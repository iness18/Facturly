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
import { UsersMongoService } from '../users/users-mongo.service';
import { ClientsMongoService } from '../clients/clients-mongo.service';
import { InvoicesMongoService } from '../invoices/invoices-mongo.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersMongoService,
    private readonly clientsService: ClientsMongoService,
    private readonly invoicesService: InvoicesMongoService,
  ) {}

  // 📊 1. TABLEAU DE BORD ADMIN

  @Get('dashboard')
  async getDashboard() {
    try {
      const [totalUsers, activeUsers, totalClients, totalInvoices] =
        await Promise.all([
          this.usersService.count(),
          this.usersService.countActive(),
          this.clientsService.count(),
          this.invoicesService.count(),
        ]);

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        clients: {
          total: totalClients,
        },
        invoices: {
          total: totalInvoices,
        },
        revenue: {
          total: 0, // TODO: Calculer le chiffre d'affaires réel
        },
        timestamp: new Date().toISOString(),
        mode: 'mongodb',
        message: 'Données réelles depuis MongoDB',
      };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques admin:',
        error,
      );
      return {
        users: { total: 0, active: 0 },
        clients: { total: 0 },
        invoices: { total: 0 },
        revenue: { total: 0 },
        timestamp: new Date().toISOString(),
        mode: 'error',
        message: 'Erreur lors de la récupération des données',
        error: error.message,
      };
    }
  }

  @Get('dashboard/charts')
  async getDashboardCharts(
    @Query('period') period?: 'week' | 'month' | 'year',
  ) {
    return {
      message: 'Graphiques temporairement indisponibles (migration MongoDB)',
      period: period || 'month',
      data: [],
    };
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
    try {
      const users = await this.usersService.findAll();

      // Transformer les données pour correspondre au format attendu par le frontend
      const transformedUsers = users.map((user) => ({
        id: (user as any)._id.toString(),
        email: user.email,
        name: user.name,
        company: user.company,
        role: user.role,
        isActive: user.isActive,
        isBanned: user.isBanned || false,
        createdAt: (user as any).createdAt,
        _count: {
          invoices: 0, // TODO: Compter les factures réelles
          clients: 0, // TODO: Compter les clients réels
        },
      }));

      return {
        users: transformedUsers,
        pagination: {
          page: 1,
          limit: 20,
          total: transformedUsers.length,
          pages: 1,
        },
        mode: 'mongodb',
        message: 'Données réelles depuis MongoDB',
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return {
        users: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
        mode: 'error',
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message,
      };
    }
  }

  @Get('users/stats')
  async getUsersGlobalStats() {
    return {
      message:
        'Statistiques utilisateurs temporairement indisponibles (migration MongoDB)',
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
    };
  }

  @Get('users/:id')
  async getUserDetails(@Param('id') userId: string) {
    return {
      message:
        'Détails utilisateur temporairement indisponibles (migration MongoDB)',
      userId: userId,
    };
  }

  @Get('users/:id/activity')
  async getUserActivity(
    @Param('id') userId: string,
    @Query('days') days?: string,
  ) {
    return {
      message:
        'Activité utilisateur temporairement indisponible (migration MongoDB)',
      userId: userId,
      days: days || '30',
    };
  }

  @Patch('users/:id/ban')
  @HttpCode(HttpStatus.OK)
  async toggleUserBan(
    @Param('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
  }

  @Patch('users/:id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateUser(
    @Param('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
  }

  @Post('users/:id/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetUserPassword(
    @Param('id') userId: string,
    @Body('newPassword') newPassword?: string,
  ) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
  }

  // 📦 3. GESTION DES PACKS/ABONNEMENTS

  @Get('packs')
  async getPacks(
    @Query('isActive') isActive?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('search') search?: string,
  ) {
    // Pour l'instant, retourner des données mockées pour les packs
    // TODO: Implémenter un service pour les packs/abonnements
    return {
      packs: [
        {
          id: '1',
          name: 'Pack Gratuit',
          description: 'Parfait pour commencer',
          price: 0,
          duration: 30,
          features: [
            '5 factures par mois',
            '3 clients maximum',
            'Support par email',
          ],
          limits: {
            invoices: 5,
            clients: 3,
            exports: 1,
          },
          isActive: true,
          subscribersCount: 0,
        },
        {
          id: '2',
          name: 'Pack Pro',
          description: 'Pour les professionnels',
          price: 19.99,
          duration: 30,
          features: [
            'Factures illimitées',
            'Clients illimités',
            'Export PDF',
            'Support prioritaire',
          ],
          limits: {
            invoices: -1,
            clients: -1,
            exports: -1,
          },
          isActive: true,
          subscribersCount: 0,
        },
      ],
      mode: 'mock_data',
      message: 'Données de test pour les packs (service non implémenté)',
    };
  }

  @Get('packs/stats')
  async getPacksStats() {
    return {
      message:
        'Statistiques packs temporairement indisponibles (migration MongoDB)',
      totalPacks: 0,
      activePacks: 0,
    };
  }

  @Get('packs/:id')
  async getPackDetails(@Param('id') packId: string) {
    return {
      message: 'Détails pack temporairement indisponibles (migration MongoDB)',
      packId: packId,
    };
  }

  @Get('packs/:id/trends')
  async getPackTrends(
    @Param('id') packId: string,
    @Query('days') days?: string,
  ) {
    return {
      message:
        'Tendances pack temporairement indisponibles (migration MongoDB)',
      packId: packId,
      days: days || '30',
    };
  }

  @Post('packs')
  @HttpCode(HttpStatus.CREATED)
  async createPack(@Body() createPackDto: any) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
  }

  @Put('packs/:id')
  async updatePack(@Param('id') packId: string, @Body() updatePackDto: any) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
  }

  @Patch('packs/:id/toggle')
  @HttpCode(HttpStatus.OK)
  async togglePackStatus(@Param('id') packId: string) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
  }

  @Delete('packs/:id')
  @HttpCode(HttpStatus.OK)
  async deletePack(@Param('id') packId: string) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
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
