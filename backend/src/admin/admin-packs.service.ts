import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface CreatePackDto {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  duration: number; // en jours
  features: any; // JSON des fonctionnalités
  limits: any; // JSON des limites
}

export interface UpdatePackDto {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: any;
  limits?: any;
  isActive?: boolean;
}

export interface PackFilters {
  isActive?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

@Injectable()
export class AdminPacksService {
  constructor(private prisma: PrismaService) {}

  // 📦 3. Gestion des offres/packs

  // 📋 Liste des packs avec filtres
  async getPacks(filters: PackFilters = {}) {
    const { isActive, priceMin, priceMax, search } = filters;

    const where: any = {};

    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (priceMin !== undefined) where.price = { ...where.price, gte: priceMin };
    if (priceMax !== undefined) where.price = { ...where.price, lte: priceMax };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const packs = await this.prisma.pack.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        duration: true,
        features: true,
        limits: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calcul des statistiques pour chaque pack
    const packsWithStats = await Promise.all(
      packs.map(async (pack) => {
        const [activeSubscriptions, totalRevenue] = await Promise.all([
          this.prisma.subscription.count({
            where: { packId: pack.id, status: 'ACTIVE' },
          }),
          this.prisma.payment.aggregate({
            where: {
              subscription: { packId: pack.id },
              status: 'COMPLETED',
            },
            _sum: { amount: true },
          }),
        ]);

        return {
          ...pack,
          stats: {
            totalSubscriptions: pack._count.subscriptions,
            activeSubscriptions,
            totalRevenue: totalRevenue._sum.amount || 0,
          },
        };
      }),
    );

    return packsWithStats;
  }

  // 📄 Détails d'un pack
  async getPackDetails(packId: string) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        duration: true,
        features: true,
        limits: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            subscriptions: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            status: true,
            startDate: true,
            endDate: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!pack) {
      throw new NotFoundException('Pack non trouvé');
    }

    // Statistiques détaillées
    const [
      activeSubscriptions,
      expiredSubscriptions,
      cancelledSubscriptions,
      totalRevenue,
      monthlyRevenue,
    ] = await Promise.all([
      this.prisma.subscription.count({
        where: { packId, status: 'ACTIVE' },
      }),
      this.prisma.subscription.count({
        where: { packId, status: 'EXPIRED' },
      }),
      this.prisma.subscription.count({
        where: { packId, status: 'CANCELLED' },
      }),
      this.prisma.payment.aggregate({
        where: {
          subscription: { packId },
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          subscription: { packId },
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      ...pack,
      stats: {
        totalSubscriptions: pack._count.subscriptions,
        activeSubscriptions,
        expiredSubscriptions,
        cancelledSubscriptions,
        totalRevenue: totalRevenue._sum.amount || 0,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
      },
    };
  }

  // ➕ Créer un nouveau pack
  async createPack(data: CreatePackDto) {
    // Validation des données
    if (data.price <= 0) {
      throw new BadRequestException('Le prix doit être supérieur à 0');
    }

    if (data.duration <= 0) {
      throw new BadRequestException('La durée doit être supérieure à 0');
    }

    const pack = await this.prisma.pack.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency || 'EUR',
        duration: data.duration,
        features: data.features,
        limits: data.limits,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        duration: true,
        features: true,
        limits: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Log de création
    await this.prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'PACK_MANAGEMENT',
        message: `Nouveau pack créé: ${pack.name}`,
        details: { packId: pack.id, price: pack.price },
      },
    });

    return pack;
  }

  // ✏️ Modifier un pack
  async updatePack(packId: string, data: UpdatePackDto) {
    const existingPack = await this.prisma.pack.findUnique({
      where: { id: packId },
      select: { id: true, name: true },
    });

    if (!existingPack) {
      throw new NotFoundException('Pack non trouvé');
    }

    // Validation des données
    if (data.price !== undefined && data.price <= 0) {
      throw new BadRequestException('Le prix doit être supérieur à 0');
    }

    if (data.duration !== undefined && data.duration <= 0) {
      throw new BadRequestException('La durée doit être supérieure à 0');
    }

    const updatedPack = await this.prisma.pack.update({
      where: { id: packId },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        duration: true,
        features: true,
        limits: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Log de modification
    await this.prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'PACK_MANAGEMENT',
        message: `Pack modifié: ${updatedPack.name}`,
        details: { packId, changes: JSON.parse(JSON.stringify(data)) },
      },
    });

    return updatedPack;
  }

  // 🔄 Activer/Désactiver un pack
  async togglePackStatus(packId: string) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
      select: { id: true, name: true, isActive: true },
    });

    if (!pack) {
      throw new NotFoundException('Pack non trouvé');
    }

    const newStatus = !pack.isActive;

    const updatedPack = await this.prisma.pack.update({
      where: { id: packId },
      data: { isActive: newStatus },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    // Log de changement de statut
    await this.prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'PACK_MANAGEMENT',
        message: `Pack ${newStatus ? 'activé' : 'désactivé'}: ${pack.name}`,
        details: { packId, newStatus },
      },
    });

    return updatedPack;
  }

  // 🗑️ Supprimer un pack (soft delete)
  async deletePack(packId: string) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    if (!pack) {
      throw new NotFoundException('Pack non trouvé');
    }

    // Vérifier s'il y a des abonnements actifs
    const activeSubscriptions = await this.prisma.subscription.count({
      where: { packId, status: 'ACTIVE' },
    });

    if (activeSubscriptions > 0) {
      throw new BadRequestException(
        `Impossible de supprimer ce pack: ${activeSubscriptions} abonnement(s) actif(s)`,
      );
    }

    // Désactivation au lieu de suppression
    const updatedPack = await this.prisma.pack.update({
      where: { id: packId },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    // Log de suppression
    await this.prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'PACK_MANAGEMENT',
        message: `Pack supprimé (désactivé): ${pack.name}`,
        details: { packId, totalSubscriptions: pack._count.subscriptions },
      },
    });

    return updatedPack;
  }

  // 📊 Statistiques globales des packs
  async getPacksStats() {
    const [
      totalPacks,
      activePacks,
      totalSubscriptions,
      activeSubscriptions,
      totalRevenue,
      monthlyRevenue,
    ] = await Promise.all([
      this.prisma.pack.count(),
      this.prisma.pack.count({ where: { isActive: true } }),
      this.prisma.subscription.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
    ]);

    // Top 5 des packs les plus populaires
    const topPacks = await this.prisma.pack.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
      orderBy: {
        subscriptions: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return {
      total: totalPacks,
      active: activePacks,
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        monthly: monthlyRevenue._sum.amount || 0,
      },
      topPacks,
    };
  }

  // 📈 Évolution des abonnements par pack
  async getPackSubscriptionTrends(packId: string, days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        packId,
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Grouper par jour
    const dailyStats = subscriptions.reduce(
      (acc, sub) => {
        const date = sub.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, count: 0, active: 0, cancelled: 0 };
        }
        acc[date].count++;
        if (sub.status === 'ACTIVE') acc[date].active++;
        if (sub.status === 'CANCELLED') acc[date].cancelled++;
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(dailyStats);
  }
}
