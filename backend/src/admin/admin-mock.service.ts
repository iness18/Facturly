import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminMockService {
  // Données de test pour le mode développement sans base de données

  getDashboardStats() {
    return {
      users: {
        total: 15,
        active: 12,
      },
      clients: {
        total: 8,
      },
      invoices: {
        total: 23,
      },
      revenue: {
        total: 4567.89,
      },
      timestamp: new Date().toISOString(),
      mode: 'mock_data',
      message: 'Données de test - Base de données non connectée',
    };
  }

  getUsers() {
    return {
      users: [
        {
          id: '1',
          email: 'admin@facturly.com',
          name: 'Administrateur',
          company: 'Facturly',
          role: 'ADMIN',
          isActive: true,
          createdAt: new Date().toISOString(),
          _count: {
            invoices: 5,
            clients: 3,
          },
        },
        {
          id: '2',
          email: 'user@example.com',
          name: 'Utilisateur Test',
          company: 'Entreprise Test',
          role: 'USER',
          isActive: true,
          createdAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          _count: {
            invoices: 12,
            clients: 5,
          },
        },
        {
          id: '3',
          email: 'client@demo.com',
          name: 'Client Démo',
          company: 'Démo SARL',
          role: 'USER',
          isActive: true,
          createdAt: new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          _count: {
            invoices: 6,
            clients: 2,
          },
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 3,
        pages: 1,
      },
      mode: 'mock_data',
      message: 'Données de test - Base de données non connectée',
    };
  }

  getPacks() {
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
          subscribersCount: 8,
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
          subscribersCount: 5,
        },
        {
          id: '3',
          name: 'Pack Entreprise',
          description: 'Pour les grandes entreprises',
          price: 49.99,
          duration: 30,
          features: [
            'Tout du Pack Pro',
            'API personnalisée',
            'Support téléphonique',
            'Formation incluse',
          ],
          limits: {
            invoices: -1,
            clients: -1,
            exports: -1,
          },
          isActive: true,
          subscribersCount: 2,
        },
      ],
      mode: 'mock_data',
      message: 'Données de test - Base de données non connectée',
    };
  }

  getSystemHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      services: {
        dashboard: 'operational',
        users: 'operational',
        authentication: 'disabled_for_testing',
      },
      version: 'mock_mode',
      message: 'Système admin fonctionnel en mode test (sans base de données)',
    };
  }
}
