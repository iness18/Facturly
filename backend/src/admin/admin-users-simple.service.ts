import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

export interface UserSearchFilters {
  search?: string;
  role?: 'USER' | 'ADMIN';
  isActive?: boolean;
}

export interface UserListOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'name' | 'email';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class AdminUsersSimpleService {
  constructor(private prisma: PrismaService) {}

  // 👥 Recherche d'utilisateurs (version simplifiée)
  async searchUsers(
    filters: UserSearchFilters = {},
    options: UserListOptions = {},
  ) {
    const { search, role, isActive } = filters;

    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;

    try {
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
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                invoices: true,
                clients: true,
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
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error);
      return {
        users: [],
        pagination: { page, limit, total: 0, pages: 0 },
        error: 'Impossible de récupérer les utilisateurs',
      };
    }
  }

  // 📋 Détails utilisateur (version simplifiée)
  async getUserDetails(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,

          // Statistiques
          _count: {
            select: {
              invoices: true,
              clients: true,
            },
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

          // Clients
          clients: {
            select: {
              id: true,
              name: true,
              email: true,
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
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des détails utilisateur:',
        error,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error("Impossible de récupérer les détails de l'utilisateur");
    }
  }

  // 🗑️ Désactiver un utilisateur (version simplifiée)
  async deactivateUser(userId: string, reason?: string) {
    try {
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

      return updatedUser;
    } catch (error) {
      console.error("Erreur lors de la désactivation de l'utilisateur:", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error("Impossible de désactiver l'utilisateur");
    }
  }

  // 🔄 Réinitialiser le mot de passe (version simplifiée)
  async resetUserPassword(userId: string, newPassword?: string) {
    try {
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

      return {
        success: true,
        tempPassword,
        message: 'Mot de passe réinitialisé avec succès',
      };
    } catch (error) {
      console.error(
        'Erreur lors de la réinitialisation du mot de passe:',
        error,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Impossible de réinitialiser le mot de passe');
    }
  }

  // 📈 Activité utilisateur (version simplifiée)
  async getUserActivity(userId: string, days: number = 30) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const [invoiceActivity] = await Promise.all([
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
      ]);

      return {
        period: `${days} derniers jours`,
        invoices: invoiceActivity,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'activité utilisateur:",
        error,
      );
      return {
        period: `${days} derniers jours`,
        invoices: [],
        error: "Impossible de récupérer l'activité utilisateur",
      };
    }
  }

  // Statistiques globales des utilisateurs (version simplifiée)
  async getUserStats() {
    try {
      const [totalUsers, activeUsers, newUsersThisMonth] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isActive: true } }),
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
        newThisMonth: newUsersThisMonth,
      };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques utilisateurs:',
        error,
      );
      return {
        total: 0,
        active: 0,
        newThisMonth: 0,
        error: 'Impossible de récupérer les statistiques utilisateurs',
      };
    }
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
}
