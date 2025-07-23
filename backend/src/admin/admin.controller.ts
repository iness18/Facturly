import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminDashboardService } from './admin-dashboard.service';
import {
  AdminUsersService,
  UserSearchFilters,
  UserListOptions,
} from './admin-users.service';
import {
  AdminPacksService,
  CreatePackDto,
  UpdatePackDto,
  PackFilters,
} from './admin-packs.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private readonly dashboardService: AdminDashboardService,
    private readonly usersService: AdminUsersService,
    private readonly packsService: AdminPacksService,
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
    @Query('isBanned') isBanned?: string,
    @Query('hasSubscription') hasSubscription?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const filters: UserSearchFilters = {
      search,
      role,
      isActive: isActive ? isActive === 'true' : undefined,
      isBanned: isBanned ? isBanned === 'true' : undefined,
      hasSubscription: hasSubscription ? hasSubscription === 'true' : undefined,
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

  @Patch('users/:id/ban')
  @HttpCode(HttpStatus.OK)
  async toggleUserBan(
    @Param('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return await this.usersService.toggleUserBan(userId, reason);
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

  // 📦 3. GESTION DES PACKS/ABONNEMENTS

  @Get('packs')
  async getPacks(
    @Query('isActive') isActive?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('search') search?: string,
  ) {
    const filters: PackFilters = {
      isActive: isActive ? isActive === 'true' : undefined,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      search,
    };

    return await this.packsService.getPacks(filters);
  }

  @Get('packs/stats')
  async getPacksStats() {
    return await this.packsService.getPacksStats();
  }

  @Get('packs/:id')
  async getPackDetails(@Param('id') packId: string) {
    return await this.packsService.getPackDetails(packId);
  }

  @Get('packs/:id/trends')
  async getPackTrends(
    @Param('id') packId: string,
    @Query('days') days?: string,
  ) {
    const daysNumber = days ? parseInt(days) : 30;
    return await this.packsService.getPackSubscriptionTrends(
      packId,
      daysNumber,
    );
  }

  @Post('packs')
  @HttpCode(HttpStatus.CREATED)
  async createPack(@Body() createPackDto: CreatePackDto) {
    return await this.packsService.createPack(createPackDto);
  }

  @Put('packs/:id')
  async updatePack(
    @Param('id') packId: string,
    @Body() updatePackDto: UpdatePackDto,
  ) {
    return await this.packsService.updatePack(packId, updatePackDto);
  }

  @Patch('packs/:id/toggle')
  @HttpCode(HttpStatus.OK)
  async togglePackStatus(@Param('id') packId: string) {
    return await this.packsService.togglePackStatus(packId);
  }

  @Delete('packs/:id')
  @HttpCode(HttpStatus.OK)
  async deletePack(@Param('id') packId: string) {
    return await this.packsService.deletePack(packId);
  }

  // 💳 4. SUIVI DES PAIEMENTS (à implémenter)

  @Get('payments')
  async getPayments(
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // TODO: Implémenter le service de paiements
    return {
      message: 'Service de paiements à implémenter',
      endpoints: [
        'GET /admin/payments - Liste des paiements',
        'GET /admin/payments/stats - Statistiques des paiements',
        "GET /admin/payments/:id - Détails d'un paiement",
        'POST /admin/payments/:id/refund - Rembourser un paiement',
      ],
    };
  }

  @Get('payments/stats')
  async getPaymentsStats() {
    // TODO: Implémenter les statistiques de paiements
    return { message: 'Statistiques de paiements à implémenter' };
  }

  // 🎯 5. OUTILS MARKETING (à implémenter)

  @Get('marketing/campaigns')
  async getEmailCampaigns() {
    // TODO: Implémenter la gestion des campagnes email
    return {
      message: 'Gestion des campagnes email à implémenter',
      endpoints: [
        'GET /admin/marketing/campaigns - Liste des campagnes',
        'POST /admin/marketing/campaigns - Créer une campagne',
        'PUT /admin/marketing/campaigns/:id - Modifier une campagne',
        'POST /admin/marketing/campaigns/:id/send - Envoyer une campagne',
      ],
    };
  }

  @Get('marketing/promo-codes')
  async getPromoCodes() {
    // TODO: Implémenter la gestion des codes promo
    return {
      message: 'Gestion des codes promo à implémenter',
      endpoints: [
        'GET /admin/marketing/promo-codes - Liste des codes promo',
        'POST /admin/marketing/promo-codes - Créer un code promo',
        'PUT /admin/marketing/promo-codes/:id - Modifier un code promo',
        'DELETE /admin/marketing/promo-codes/:id - Supprimer un code promo',
      ],
    };
  }

  // 🌐 6. GESTION DU CONTENU DU SITE (à implémenter)

  @Get('site/settings')
  async getSiteSettings() {
    // TODO: Implémenter la gestion des paramètres du site
    return {
      message: 'Gestion des paramètres du site à implémenter',
      endpoints: [
        'GET /admin/site/settings - Paramètres du site',
        'PUT /admin/site/settings - Modifier les paramètres',
        'GET /admin/site/pages - Gestion des pages',
        'PUT /admin/site/pages/:page - Modifier une page',
      ],
    };
  }

  // 🎫 7. GESTION DES TICKETS/ERREURS (à implémenter)

  @Get('tickets')
  async getTickets(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // TODO: Implémenter la gestion des tickets
    return {
      message: 'Gestion des tickets à implémenter',
      endpoints: [
        'GET /admin/tickets - Liste des tickets',
        "GET /admin/tickets/:id - Détails d'un ticket",
        'PUT /admin/tickets/:id - Modifier un ticket',
        'POST /admin/tickets/:id/messages - Répondre à un ticket',
      ],
    };
  }

  @Get('tickets/stats')
  async getTicketsStats() {
    // TODO: Implémenter les statistiques des tickets
    return { message: 'Statistiques des tickets à implémenter' };
  }

  // 🔧 8. PARAMÈTRES AVANCÉS (à implémenter)

  @Get('system/logs')
  async getSystemLogs(
    @Query('level') level?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // TODO: Implémenter la consultation des logs système
    return {
      message: 'Consultation des logs système à implémenter',
      endpoints: [
        'GET /admin/system/logs - Logs système',
        'GET /admin/system/health - État du système',
        'GET /admin/system/metrics - Métriques système',
      ],
    };
  }

  @Get('system/health')
  async getSystemHealth() {
    // TODO: Implémenter le monitoring système
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      services: {
        dashboard: 'operational',
        users: 'operational',
        packs: 'operational',
        payments: 'not_implemented',
        marketing: 'not_implemented',
        tickets: 'not_implemented',
      },
      message: 'Monitoring système basique - à étendre',
    };
  }

  // 📈 9. RAPPORTS ET ANALYTICS (à implémenter)

  @Get('reports/revenue')
  async getRevenueReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // TODO: Implémenter les rapports de revenus
    return {
      message: 'Rapports de revenus à implémenter',
      endpoints: [
        'GET /admin/reports/revenue - Rapport de revenus',
        'GET /admin/reports/users - Rapport utilisateurs',
        'GET /admin/reports/subscriptions - Rapport abonnements',
      ],
    };
  }

  @Get('reports/users')
  async getUsersReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // TODO: Implémenter les rapports utilisateurs
    return { message: 'Rapports utilisateurs à implémenter' };
  }

  // 🚀 ENDPOINTS DE TEST ET DOCUMENTATION

  @Get('info')
  async getAdminInfo() {
    return {
      name: 'Facturly Admin Panel',
      version: '1.0.0',
      description: "Panel d'administration complet pour Facturly",
      features: {
        implemented: [
          '📊 Tableau de bord avec statistiques',
          '👥 Gestion des utilisateurs (recherche, bannissement, etc.)',
          '📦 Gestion des packs/abonnements',
        ],
        planned: [
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
        packs: '/admin/packs',
        system: '/admin/system/health',
      },
    };
  }
}
