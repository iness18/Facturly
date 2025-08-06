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
import { AdminMockService } from './admin-mock.service';

@Controller('admin')
export class AdminSimpleController {
  constructor(private readonly mockService: AdminMockService) {}

  // 📊 1. TABLEAU DE BORD ADMIN

  @Get('dashboard')
  async getDashboard() {
    console.log(
      '📊 Utilisation des données de test (services Prisma supprimés)',
    );
    return this.mockService.getDashboardStats();
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
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    console.log(
      '👥 Utilisation des données de test (services Prisma supprimés)',
    );
    return this.mockService.getUsers();
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
    // Utiliser directement le service mock pour éviter les erreurs Prisma
    return this.mockService.getSystemHealth();
  }

  @Get('test/mock')
  async testMock() {
    // Endpoint de test pour vérifier que le service mock fonctionne
    return {
      message: 'Service mock fonctionnel',
      timestamp: new Date().toISOString(),
      mockData: this.mockService.getDashboardStats(),
    };
  }

  @Get('test/database')
  async testDatabase() {
    return {
      message: 'Test de connexion MongoDB',
      timestamp: new Date().toISOString(),
      status: 'mock_data',
      note: 'Services Prisma supprimés - utilisation des données de test',
      data: this.mockService.getDashboardStats(),
    };
  }

  // 📋 ENDPOINTS DE COMPATIBILITÉ (pour éviter les erreurs 404)

  // 💼 3. GESTION DES PACKS/OFFRES

  @Get('packs')
  async getPacks() {
    console.log(
      '💼 Utilisation des données de test (services Prisma supprimés)',
    );
    return this.mockService.getPacks();
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
  async getPackById(@Param('id') id: string) {
    return {
      message: 'Détails pack temporairement indisponibles (migration MongoDB)',
      packId: id,
    };
  }

  @Post('packs')
  @HttpCode(HttpStatus.CREATED)
  async createPack(@Body() packData: any) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
  }

  @Patch('packs/:id')
  @HttpCode(HttpStatus.OK)
  async updatePack(@Param('id') id: string, @Body() packData: any) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
  }

  @Patch('packs/:id/toggle')
  @HttpCode(HttpStatus.OK)
  async togglePackStatus(@Param('id') id: string) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
  }

  @Post('packs/:id/delete')
  @HttpCode(HttpStatus.OK)
  async deletePack(@Param('id') id: string) {
    return {
      message: 'Fonctionnalité temporairement indisponible (migration MongoDB)',
    };
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
