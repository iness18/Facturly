import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

export interface UserSearchFilters {
  search?: string; // Recherche par email ou nom
  role?: 'USER' | 'ADMIN';
  isActive?: boolean;
  isBanned?: boolean;
  hasSubscription?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface UserListOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'name' | 'email' | 'lastLogin' | 'loginCount';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  // 👥 2. Gestion des utilisateurs

  // 🔍 Recherche par e-mail / nom avec filtres avancés
  async searchUsers(
    filters: UserSearchFilters = {},
    options: UserListOptions = {},
  ) {
    const {
      search,
      role,
      isActive,
      isBanned,
      hasSubscription,
      createdAfter,
      createdBefore,
    } = filters;

    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;

    // Construction des conditions de recherche
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) where.role = role;
    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (typeof isBanned === 'boolean') where.isBanned = isBanned;

    if (createdAfter || createdBefore) {
      where.createdAt = {};
      if (createdAfter) where.createdAt.gte = createdAfter;
      if (createdBefore) where.createdAt.lte = createdBefore;
    }

    if (hasSubscription !== undefined) {
      if (hasSubscription) {
        where.subscriptions = {
          some: { status: 'ACTIVE' },
        };
      } else {
        where.subscriptions = {
          none: {},
        };
      }
    }

    // Exécution de la requête
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          role: true,
          isActive: true,
          isBanned: true,
          lastLogin: true,
          loginCount: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              invoices: true,
              clients: true,
              subscriptions: true,
              payments: true,
              tickets: true,
            },
          },
          subscriptions: {
            where: { status: 'ACTIVE' },
            select: {
              id: true,
              pack: {
                select: { name: true, price: true },
              },
              endDate: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // 📋 Détails utilisateur complet
  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        isActive: true,
        isBanned: true,
        lastLogin: true,
        loginCount: true,
        createdAt: true,
        updatedAt: true,

        // Statistiques
        _count: {
          select: {
            invoices: true,
            clients: true,
            subscriptions: true,
            payments: true,
            tickets: true,
          },
        },

        // Abonnements
        subscriptions: {
          select: {
            id: true,
            status: true,
            startDate: true,
            endDate: true,
            pack: {
              select: {
                name: true,
                price: true,
                features: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },

        // Dernières factures
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },

        // Historique des paiements
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
            subscription: {
              select: {
                pack: { select: { name: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },

        // Tickets de support
        tickets: {
          select: {
            id: true,
            subject: true,
            status: true,
            priority: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  // ⛔ Bannir / Débannir un utilisateur
  async toggleUserBan(userId: string, reason?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isBanned: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const newBanStatus = !user.isBanned;

    // Mise à jour du statut
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: newBanStatus },
      select: {
        id: true,
        email: true,
        name: true,
        isBanned: true,
      },
    });

    // Log de l'action
    await this.prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'USER_MANAGEMENT',
        message: `Utilisateur ${newBanStatus ? 'banni' : 'débanni'}: ${user.email}`,
        details: { reason, userId, action: newBanStatus ? 'BAN' : 'UNBAN' },
      },
    });

    return updatedUser;
  }

  // 🗑️ Supprimer un utilisateur (soft delete)
  async deactivateUser(userId: string, reason?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Désactivation (soft delete)
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });

    // Annulation des abonnements actifs
    await this.prisma.subscription.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' },
    });

    // Log de l'action
    await this.prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'USER_MANAGEMENT',
        message: `Utilisateur désactivé: ${user.email}`,
        details: { reason, userId, action: 'DEACTIVATE' },
      },
    });

    return updatedUser;
  }

  // 🔄 Réinitialiser le mot de passe
  async resetUserPassword(userId: string, newPassword?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Génération d'un mot de passe temporaire si non fourni
    const tempPassword = newPassword || this.generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Mise à jour du mot de passe
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Log de l'action
    await this.prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'USER_MANAGEMENT',
        message: `Mot de passe réinitialisé pour: ${user.email}`,
        details: { userId, action: 'PASSWORD_RESET' },
      },
    });

    return {
      success: true,
      tempPassword,
      message: 'Mot de passe réinitialisé avec succès',
    };
  }

  // 📈 Suivi de l'activité utilisateur
  async getUserActivity(userId: string, days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [invoiceActivity, loginActivity, paymentActivity] = await Promise.all(
      [
        // Activité de facturation
        this.prisma.invoice.findMany({
          where: {
            userId,
            createdAt: { gte: startDate },
          },
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),

        // Historique de connexion (simulé - à implémenter avec un système de logs)
        this.prisma.systemLog.findMany({
          where: {
            userId,
            category: 'AUTH',
            createdAt: { gte: startDate },
          },
          select: {
            id: true,
            message: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),

        // Activité de paiement
        this.prisma.payment.findMany({
          where: {
            userId,
            createdAt: { gte: startDate },
          },
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
      ],
    );

    return {
      period: `${days} derniers jours`,
      invoices: invoiceActivity,
      logins: loginActivity,
      payments: paymentActivity,
    };
  }

  // Utilitaire pour générer un mot de passe temporaire
  private generateTempPassword(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Statistiques globales des utilisateurs
  async getUserStats() {
    const [
      totalUsers,
      activeUsers,
      bannedUsers,
      usersWithSubscriptions,
      newUsersThisMonth,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true, isBanned: false } }),
      this.prisma.user.count({ where: { isBanned: true } }),
      this.prisma.user.count({
        where: {
          subscriptions: {
            some: { status: 'ACTIVE' },
          },
        },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      total: totalUsers,
      active: activeUsers,
      banned: bannedUsers,
      withSubscriptions: usersWithSubscriptions,
      newThisMonth: newUsersThisMonth,
    };
  }
}
