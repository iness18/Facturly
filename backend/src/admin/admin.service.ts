import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Vérifier si un utilisateur est admin
  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === UserRole.ADMIN;
  }

  // Obtenir tous les utilisateurs (admin seulement)
  async getAllUsers(adminUserId: string) {
    await this.verifyAdminAccess(adminUserId);

    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            invoices: true,
            clients: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Obtenir tous les clients de tous les utilisateurs (admin seulement)
  async getAllClients(adminUserId: string) {
    await this.verifyAdminAccess(adminUserId);

    return this.prisma.client.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        _count: {
          select: {
            invoices: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Obtenir toutes les factures de tous les utilisateurs (admin seulement)
  async getAllInvoices(adminUserId: string) {
    await this.verifyAdminAccess(adminUserId);

    return this.prisma.invoice.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Statistiques globales (admin seulement)
  async getGlobalStats(adminUserId: string) {
    await this.verifyAdminAccess(adminUserId);

    const [totalUsers, totalClients, totalInvoices, totalRevenue, recentUsers] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.client.count(),
        this.prisma.invoice.count(),
        this.prisma.invoice.aggregate({
          _sum: { totalAmount: true },
          where: { status: 'PAID' },
        }),
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
            },
          },
        }),
      ]);

    return {
      totalUsers,
      totalClients,
      totalInvoices,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentUsers,
    };
  }

  // Activer/désactiver un utilisateur (admin seulement)
  async toggleUserStatus(adminUserId: string, targetUserId: string) {
    await this.verifyAdminAccess(adminUserId);

    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { isActive: true, role: true },
    });

    if (!user) {
      throw new ForbiddenException('Utilisateur non trouvé');
    }

    // Empêcher la désactivation d'un autre admin
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException(
        "Impossible de modifier le statut d'un administrateur",
      );
    }

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });
  }

  // Promouvoir un utilisateur en admin (super admin seulement)
  async promoteToAdmin(adminUserId: string, targetUserId: string) {
    await this.verifyAdminAccess(adminUserId);

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: UserRole.ADMIN },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  // Créer un compte admin
  async createAdminUser(email: string, password: string, name: string) {
    // Vérifier s'il existe déjà un admin
    const existingAdmin = await this.prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      throw new ForbiddenException('Un administrateur existe déjà');
    }

    // Hasher le mot de passe (à implémenter avec bcrypt)
    const hashedPassword = password; // TODO: Hasher avec bcrypt

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // Méthode privée pour vérifier l'accès admin
  private async verifyAdminAccess(userId: string): Promise<void> {
    const isAdmin = await this.isAdmin(userId);
    if (!isAdmin) {
      throw new ForbiddenException('Accès administrateur requis');
    }
  }
}
