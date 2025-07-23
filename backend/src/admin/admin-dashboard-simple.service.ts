import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminDashboardSimpleService {
  constructor(private prisma: PrismaService) {}

  // 📊 Statistiques du tableau de bord (version simplifiée)
  async getDashboardStats() {
    try {
      const [totalUsers, totalClients, totalInvoices, totalRevenue] =
        await Promise.all([
          this.prisma.user.count(),
          this.prisma.client.count(),
          this.prisma.invoice.count(),
          this.prisma.invoice.aggregate({
            _sum: { totalAmount: true },
            where: { status: 'PAID' },
          }),
        ]);

      return {
        users: {
          total: totalUsers,
          active: totalUsers, // Simplifié pour l'instant
        },
        clients: {
          total: totalClients,
        },
        invoices: {
          total: totalInvoices,
        },
        revenue: {
          total: totalRevenue._sum.totalAmount || 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        users: { total: 0, active: 0 },
        clients: { total: 0 },
        invoices: { total: 0 },
        revenue: { total: 0 },
        error: 'Impossible de récupérer les statistiques',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 📈 Données pour graphiques (version simplifiée)
  async getChartData(period: 'week' | 'month' | 'year' = 'month') {
    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default: // month
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const [recentInvoices, recentUsers] = await Promise.all([
        this.prisma.invoice.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true, totalAmount: true, status: true },
          orderBy: { createdAt: 'asc' },
        }),
        this.prisma.user.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true },
          orderBy: { createdAt: 'asc' },
        }),
      ]);

      return {
        period,
        invoices: recentInvoices.length,
        users: recentUsers.length,
        revenue: recentInvoices
          .filter((inv) => inv.status === 'PAID')
          .reduce((sum, inv) => sum + inv.totalAmount, 0),
        data: {
          invoices: recentInvoices,
          users: recentUsers,
        },
      };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données graphiques:',
        error,
      );
      return {
        period,
        invoices: 0,
        users: 0,
        revenue: 0,
        error: 'Impossible de récupérer les données graphiques',
      };
    }
  }
}
