import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  // 🎛️ 1. Tableau de bord général
  async getDashboardStats() {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Statistiques des revenus
    const totalRevenue = await this.prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    });

    // Statistiques des factures
    const [totalInvoices, todayInvoices, weekInvoices, monthInvoices] =
      await Promise.all([
        this.prisma.invoice.count(),
        this.prisma.invoice.count({
          where: { createdAt: { gte: startOfDay } },
        }),
        this.prisma.invoice.count({
          where: { createdAt: { gte: startOfWeek } },
        }),
        this.prisma.invoice.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
      ]);

    // Statistiques des utilisateurs
    const [totalUsers, activeUsers, inactiveUsers, bannedUsers] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isActive: true, isBanned: false } }),
        this.prisma.user.count({ where: { isActive: false } }),
        this.prisma.user.count({ where: { isBanned: true } }),
      ]);

    // Derniers inscrits (7 derniers jours)
    const recentUsers = await this.prisma.user.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Alertes système (erreurs récentes)
    const systemAlerts = await this.prisma.systemLog.findMany({
      where: {
        level: { in: ['ERROR', 'FATAL'] },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      select: {
        id: true,
        level: true,
        category: true,
        message: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return {
      revenue: {
        total: totalRevenue._sum.amount || 0,
        currency: 'EUR',
      },
      invoices: {
        total: totalInvoices,
        today: todayInvoices,
        thisWeek: weekInvoices,
        thisMonth: monthInvoices,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        banned: bannedUsers,
        recentSignups: recentUsers,
      },
      alerts: systemAlerts,
    };
  }

  // Graphiques pour le dashboard
  async getChartData(period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;
    let groupBy: string;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = 'month';
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupBy = 'day';
    }

    // Évolution des inscriptions
    const userSignups = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC(${groupBy}, "createdAt") as date,
        COUNT(*) as count
      FROM "users" 
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC(${groupBy}, "createdAt")
      ORDER BY date ASC
    `;

    // Évolution des factures
    const invoiceCreation = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC(${groupBy}, "createdAt") as date,
        COUNT(*) as count,
        SUM("totalAmount") as revenue
      FROM "invoices" 
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC(${groupBy}, "createdAt")
      ORDER BY date ASC
    `;

    // Évolution des paiements
    const paymentData = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC(${groupBy}, "createdAt") as date,
        COUNT(*) as count,
        SUM("amount") as amount
      FROM "payments" 
      WHERE "createdAt" >= ${startDate} AND "status" = 'COMPLETED'
      GROUP BY DATE_TRUNC(${groupBy}, "createdAt")
      ORDER BY date ASC
    `;

    return {
      period,
      userSignups,
      invoiceCreation,
      paymentData,
    };
  }

  // Statistiques avancées
  async getAdvancedStats() {
    // Top utilisateurs par nombre de factures
    const topUsersByInvoices = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: { select: { invoices: true } },
      },
      orderBy: { invoices: { _count: 'desc' } },
      take: 10,
    });

    // Répartition par statut de facture
    const invoiceStatusDistribution = await this.prisma.invoice.groupBy({
      by: ['status'],
      _count: { status: true },
      _sum: { totalAmount: true },
    });

    // Utilisateurs avec abonnements actifs
    const activeSubscriptions = await this.prisma.subscription.count({
      where: { status: 'ACTIVE' },
    });

    // Tickets ouverts
    const openTickets = await this.prisma.ticket.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
    });

    return {
      topUsers: topUsersByInvoices,
      invoiceDistribution: invoiceStatusDistribution,
      activeSubscriptions,
      openTickets,
    };
  }
}
