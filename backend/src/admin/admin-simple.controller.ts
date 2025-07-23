import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AdminDashboardSimpleService } from './admin-dashboard-simple.service';
import {
  AdminUsersSimpleService,
  UserSearchFilters,
  UserListOptions,
} from './admin-users-simple.service';
import {
  AdminPacksSimpleService,
  PackCreateData,
  PackUpdateData,
} from './admin-packs-simple.service';

@Controller('admin')
export class AdminSimpleController {
  constructor(
    private readonly dashboardService: AdminDashboardSimpleService,
    private readonly usersService: AdminUsersSimpleService,
    private readonly packsService: AdminPacksSimpleService,
  ) {}

  // 📊 1. TABLEAU DE BORD ADMIN

  @Get('dashboard')
  async getDashboard() {
    return await this.dashboardService.getDashboardStats();
  }

  @Get('dashboard/charts')
  async getDashboardCharts(
    @Query('period') period?: 'week' | 'month' | 'year',
  ) {
    return await this.dashboardService.getChartData(period);
  }

  // 👥 2. GESTION DES UTILISATEURS

  @Get('users')
  async getUsers(
    @Query('search') search?: string,
    @Query('role') role?: 'USER' | 'ADMIN',
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const filters: UserSearchFilters = {
      search,
      role,
      isActive: isActive ? isActive === 'true' : undefined,
    };

    const options: UserListOptions = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sortBy: sortBy as any,
      sortOrder,
    };

    return await this.usersService.searchUsers(filters, options);
  }

  @Get('users/stats')
  async getUsersGlobalStats() {
    return await this.usersService.getUserStats();
  }

  @Get('users/:id')
  async getUserDetails(@Param('id') userId: string) {
    return await this.usersService.getUserDetails(userId);
  }

  @Get('users/:id/activity')
  async getUserActivity(
    @Param('id') userId: string,
    @Query('days') days?: string,
  ) {
    const daysNumber = days ? parseInt(days) : 30;
    return await this.usersService.getUserActivity(userId, daysNumber);
  }

  @Patch('users/:id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateUser(
    @Param('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return await this.usersService.deactivateUser(userId, reason);
  }

  @Post('users/:id/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetUserPassword(
    @Param('id') userId: string,
    @Body('newPassword') newPassword?: string,
  ) {
    return await this.usersService.resetUserPassword(userId, newPassword);
  }

  // 🚀 ENDPOINTS DE TEST ET DOCUMENTATION

  @Get('info')
  async getAdminInfo() {
    return {
      name: 'Facturly Admin Panel (Version Simplifiée)',
      version: '1.0.0',
      description:
        "Panel d'administration pour Facturly - Version fonctionnelle avec modèles existants",
      status: 'operational',
      authentication: 'disabled_for_testing',
      features: {
        implemented: [
          '📊 Tableau de bord avec statistiques de base',
          '👥 Gestion des utilisateurs (recherche, détails, désactivation)',
          '🔄 Réinitialisation de mots de passe',
          "📈 Suivi de l'activité utilisateur",
          '📋 Statistiques globales',
        ],
        limitations: [
          'Authentification désactivée pour les tests',
          'Pas de bannissement (champ isBanned non disponible)',
          'Pas de gestion des packs (modèles non synchronisés)',
          'Pas de logs système avancés',
          'Fonctionnalités limitées aux modèles existants',
        ],
        planned: [
          "🔐 Réactivation de l'authentification JWT",
          '💳 Suivi des paiements et intégration Stripe',
          '🎯 Outils marketing (campagnes email, codes promo)',
          '🌐 Gestion du contenu du site',
          '🎫 Système de tickets/support',
          '🔧 Paramètres avancés et logs système',
          '📈 Rapports et analytics détaillés',
        ],
      },
      endpoints: {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        info: '/admin/info',
        health: '/admin/system/health',
      },
      database: {
        status: 'connected',
        models: ['User', 'Client', 'Invoice', 'InvoiceItem'],
        note: 'Modèles avancés (Pack, Payment, Ticket, etc.) en attente de synchronisation',
      },
    };
  }

  @Get('system/health')
  async getSystemHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      services: {
        dashboard: 'operational',
        users: 'operational',
        authentication: 'disabled_for_testing',
      },
      version: 'simplified',
      message: 'Système admin fonctionnel avec modèles de base',
    };
  }

  // 📋 ENDPOINTS DE COMPATIBILITÉ (pour éviter les erreurs 404)

  // 💼 3. GESTION DES PACKS/OFFRES

  @Get('packs')
  async getPacks() {
    return await this.packsService.getAllPacks();
  }

  @Get('packs/stats')
  async getPacksStats() {
    return await this.packsService.getPacksStats();
  }

  @Get('packs/:id')
  async getPackById(@Param('id') id: string) {
    return await this.packsService.getPackById(id);
  }

  @Post('packs')
  @HttpCode(HttpStatus.CREATED)
  async createPack(@Body() packData: PackCreateData) {
    return await this.packsService.createPack(packData);
  }

  @Patch('packs/:id')
  @HttpCode(HttpStatus.OK)
  async updatePack(@Param('id') id: string, @Body() packData: PackUpdateData) {
    return await this.packsService.updatePack(id, packData);
  }

  @Patch('packs/:id/toggle')
  @HttpCode(HttpStatus.OK)
  async togglePackStatus(@Param('id') id: string) {
    return await this.packsService.togglePackStatus(id);
  }

  @Post('packs/:id/delete')
  @HttpCode(HttpStatus.OK)
  async deletePack(@Param('id') id: string) {
    return await this.packsService.deletePack(id);
  }

  @Get('payments')
  async getPayments() {
    return {
      message: 'Suivi des paiements temporairement indisponible',
      reason: 'Modèles Prisma en cours de synchronisation',
      status: 'pending',
      planned_features: [
        'Liste des paiements avec filtres',
        'Statistiques de revenus',
        'Intégration Stripe',
        'Gestion des remboursements',
      ],
    };
  }

  @Get('marketing/campaigns')
  async getEmailCampaigns() {
    return {
      message: 'Outils marketing temporairement indisponibles',
      reason: 'Modèles Prisma en cours de synchronisation',
      status: 'pending',
      planned_features: [
        'Campagnes email automatisées',
        'Codes promo et réductions',
        'Segmentation utilisateurs',
        'Analytics marketing',
      ],
    };
  }

  @Get('tickets')
  async getTickets() {
    return {
      message: 'Système de tickets temporairement indisponible',
      reason: 'Modèles Prisma en cours de synchronisation',
      status: 'pending',
      planned_features: [
        'Gestion des tickets de support',
        'Système de priorités',
        'Assignation aux admins',
        'Historique des conversations',
      ],
    };
  }

  @Get('system/logs')
  async getSystemLogs() {
    return {
      message: 'Logs système temporairement indisponibles',
      reason: 'Modèles Prisma en cours de synchronisation',
      status: 'pending',
      planned_features: [
        "Logs d'activité détaillés",
        'Filtrage par niveau et catégorie',
        'Monitoring en temps réel',
        'Alertes automatiques',
      ],
    };
  }
}
