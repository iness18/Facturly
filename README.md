# Facturly - Application de Facturation Moderne

Une application de facturation complète construite avec Next.js, NestJS, et PostgreSQL. Interface moderne avec CSS Modules et migrations automatiques.

## 🚀 Démarrage rapide

### Prérequis

- Docker et Docker Compose
- Node.js 18+ (pour le développement local)

### Installation et lancement

1. **Cloner le projet**

```bash
git clone <votre-repo>
cd facturly
```

2. **Configurer l'environnement**

```bash
# Le fichier .env est déjà configuré avec des valeurs par défaut
# Modifier les variables si nécessaire
```

3. **Démarrer avec Docker (tout automatique)**

```bash
docker-compose up -d
```

✨ **Les migrations Prisma s'appliquent automatiquement au démarrage !**

### URLs d'accès

- **Frontend**: http://localhost:3000
- **Panneau d'administration**: http://localhost:3000/admin
- **Backend API**: http://localhost:3001
- **Base de données**: localhost:5432

## 📁 Structure du projet

```
facturly/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── admin/          # Module administration
│   │   │   ├── admin.controller.ts        # Contrôleur principal
│   │   │   ├── admin-simple.controller.ts # API simplifiée
│   │   │   ├── admin-dashboard.service.ts # Statistiques
│   │   │   ├── admin-users.service.ts     # Gestion utilisateurs
│   │   │   └── admin-packs.service.ts     # Gestion packs
│   │   ├── auth/           # Authentification JWT
│   │   │   ├── auth.service.ts    # Service d'authentification
│   │   │   ├── jwt-auth.guard.ts  # Protection des routes
│   │   │   └── roles.guard.ts     # Gestion des rôles
│   │   ├── database/       # Service Prisma
│   │   ├── invoices/       # Module factures
│   │   └── main.ts         # Point d'entrée
│   └── prisma/             # Schéma et migrations étendus
├── frontend/               # Interface Next.js
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   │   ├── admin/     # Panneau d'administration
│   │   │   │   └── page.tsx # Interface admin complète (9 sections)
│   │   │   ├── page.tsx   # Page d'accueil avec Hero + Fonctionnalités
│   │   │   ├── page.module.css # Styles CSS Modules
│   │   │   └── globals.css # Système de design
│   │   └── components/    # Composants réutilisables
│   │       ├── ProtectedRoute.tsx # Protection des routes
│   │       └── ui/        # Composants UI (Button, etc.)
├── memory-bank/           # Documentation du projet
└── docker-compose.yml     # Configuration Docker
```

## 🎨 Interface utilisateur

### Page d'accueil moderne

- **Section Hero** : Titre avec gradient, badge animé, CTA et statistiques
- **Section Fonctionnalités** : 5 cartes présentant les capacités principales
- **Design responsive** : Adapté mobile et desktop
- **Animations fluides** : Effets de hover et transitions CSS

### Fonctionnalités présentées

1. **📄 Factures personnalisées** - Création avec branding et templates
2. **👥 Répertoire clients** - Gestion complète des contacts
3. **⏰ Suivi en temps réel** - Statuts et notifications automatiques
4. **📊 Tableau de bord** - Statistiques et analyses détaillées
5. **🛡️ Sécurité avancée** - Authentification et protection des données

## 🎛️ Panneau d'Administration

### Interface d'administration complète

Le panneau d'administration offre une gestion complète de la plateforme avec 9 sections principales :

#### 🎛️ Tableau de bord

- **Statistiques en temps réel** : Chiffre d'affaires, factures générées, utilisateurs actifs
- **Métriques détaillées** : Analyses quotidiennes, hebdomadaires et mensuelles
- **Alertes système** : Monitoring des erreurs et problèmes techniques
- **Derniers inscrits** : Suivi des nouveaux utilisateurs

#### 👥 Gestion des utilisateurs

- **Liste complète** : Tous les utilisateurs avec informations détaillées
- **Recherche avancée** : Filtrage par nom, email, statut
- **Actions administratives** : Bannissement, réinitialisation de mot de passe
- **Statistiques utilisateur** : Nombre de factures et clients par utilisateur
- **Gestion des abonnements** : Suivi des plans souscrits

#### 💼 Gestion des offres/packs

- **CRUD complet** : Création, modification, suppression des packs
- **Modal de modification** : Interface intuitive pour éditer les packs
- **Activation/désactivation** : Contrôle du statut des offres en temps réel
- **Configuration avancée** : Prix, durée, fonctionnalités, limites personnalisables
- **Suivi des abonnements** : Nombre d'abonnés par pack

#### 🧾 Suivi des paiements

- **Intégration Stripe** : Monitoring complet des transactions
- **Statuts détaillés** : Complété, échoué, en attente, remboursé
- **Gestion des remboursements** : Actions directes sur les paiements
- **Historique complet** : Suivi chronologique des transactions

#### 💌 Outils marketing

- **Campagnes email** : Création et envoi de newsletters
- **Codes promo** : Gestion des réductions et promotions
- **Statistiques marketing** : Taux d'ouverture, clics, conversions
- **Segmentation** : Ciblage des utilisateurs par critères

#### 📝 Gestion du contenu

- **Branding** : Personnalisation du logo, couleurs, slogan
- **Pages statiques** : Édition de la page À propos, FAQ, CGU
- **Politique de confidentialité** : Gestion des mentions légales
- **Prévisualisation** : Aperçu des modifications avant publication

#### 🐛 Gestion des tickets

- **Support client** : Suivi des demandes d'assistance
- **Priorisation** : Classification par urgence (urgent, élevée, moyenne, faible)
- **Statuts avancés** : Ouvert, en cours, résolu, fermé
- **Assignment** : Attribution des tickets aux équipes

#### 🛠️ Paramètres avancés

- **Configuration système** : Mode maintenance, inscriptions, limites
- **Clés API** : Gestion Stripe, PDF, services externes
- **Sauvegarde** : Outils de backup et maintenance
- **Sécurité** : Paramètres JWT, authentification

#### 🔒 Gestion des rôles

- **Hiérarchie admin** : Super Admin, Modérateur, Support, Analyste
- **Permissions granulaires** : Contrôle d'accès par fonctionnalité
- **Audit trail** : Suivi des actions administratives

### Fonctionnalités techniques

- **Interface responsive** : Optimisée pour desktop et mobile
- **Temps réel** : Mise à jour automatique des données
- **API intégrée** : Connexion directe avec le backend NestJS
- **Gestion d'erreurs** : Messages utilisateur et logging complet
- **Sécurité** : Protection des routes et validation des permissions

## 🛠️ Développement

### Commandes utiles

```bash
# Démarrer en mode développement
docker-compose up

# Voir les logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Arrêter les services
docker-compose down

# Reconstruire les images
docker-compose up --build

# Accéder à la base de données
docker-compose exec db psql -U facturly_user -d facturly_db

# Migrations manuelles (si nécessaire)
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma generate

# Résoudre les problèmes de cache Docker (si interface admin ne se met pas à jour)
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Accès au panneau d'administration

```bash
# L'interface admin est accessible directement
http://localhost:3000/admin

# Sections disponibles :
# - 🎛️ Tableau de bord : /admin (onglet dashboard)
# - 👥 Utilisateurs : /admin (onglet users)
# - 💼 Packs : /admin (onglet packs)
# - 🧾 Paiements : /admin (onglet payments)
# - 💌 Marketing : /admin (onglet marketing)
# - 📝 Contenu : /admin (onglet content)
# - 🐛 Tickets : /admin (onglet tickets)
# - 🛠️ Paramètres : /admin (onglet settings)
# - 🔒 Rôles : /admin (onglet roles)
```

### API Endpoints

#### Factures

- `GET /invoices` - Liste des factures
- `POST /invoices` - Créer une facture
- `GET /invoices/:id` - Détail d'une facture
- `PATCH /invoices/:id` - Modifier une facture
- `DELETE /invoices/:id` - Supprimer une facture
- `GET /invoices/stats` - Statistiques

#### Administration

- `GET /admin/dashboard` - Statistiques du tableau de bord admin
- `GET /admin/users` - Liste des utilisateurs avec statistiques
- `GET /admin/packs` - Liste des packs/offres
- `POST /admin/packs` - Créer un nouveau pack
- `PUT /admin/packs/:id` - Modifier un pack
- `DELETE /admin/packs/:id` - Supprimer un pack
- `PUT /admin/packs/:id/toggle` - Activer/désactiver un pack

### Exemple de création de facture

```bash
curl -X POST http://localhost:3001/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "FAC-001",
    "clientName": "Client Test",
    "amount": 1500.00
  }'
```

## 🎨 Stack technique

### Backend

- **NestJS 11** - Framework Node.js moderne
- **Prisma 6.12** - ORM pour PostgreSQL avec migrations automatiques
- **TypeScript 5.7** - Langage typé
- **class-validator** - Validation des données
- **PostgreSQL 15** - Base de données relationnelle

### Frontend

- **Next.js 15** - Framework React avec App Router
- **React 19** - Interface utilisateur moderne
- **CSS Modules** - Styling scopé et performant
- **Lucide React** - Icônes modernes
- **TypeScript 5.8** - Développement typé

### Infrastructure

- **Docker & Docker Compose** - Containerisation et orchestration
- **Migrations automatiques** - Prisma s'exécute au démarrage
- **Hot reload** - Rechargement automatique en développement
- **Health checks** - Vérification de l'état des services

## 📊 Fonctionnalités

### ✅ Implémentées

#### Interface utilisateur

- **Interface moderne** : Page d'accueil avec Hero et section Fonctionnalités
- **CSS Modules** : Système de styling moderne et performant
- **Design responsive** : Interface adaptée à tous les écrans
- **Composants réutilisables** : Système de design cohérent

#### Backend et API

- **API CRUD complète** : Gestion des factures avec validation
- **Base de données** : PostgreSQL avec schéma Prisma étendu
- **Migrations automatiques** : Déploiement automatique au démarrage
- **Architecture modulaire** : Services séparés par domaine

#### Panneau d'administration complet

- **🎛️ Tableau de bord** : Statistiques temps réel, métriques détaillées
- **👥 Gestion utilisateurs** : CRUD complet, recherche, bannissement
- **💼 Gestion des packs** : Création, modification, suppression avec modal
- **🧾 Suivi paiements** : Intégration Stripe, gestion remboursements
- **💌 Outils marketing** : Campagnes email, codes promo
- **📝 Gestion contenu** : Branding, pages statiques, CGU
- **🐛 Support tickets** : Système de tickets avec priorisation
- **🛠️ Paramètres avancés** : Configuration système, clés API
- **🔒 Gestion des rôles** : Hiérarchie admin, permissions granulaires

#### Modèles de données étendus

- **User** : Utilisateurs avec rôles et abonnements
- **Pack** : Offres avec fonctionnalités et limites
- **Payment** : Transactions Stripe complètes
- **Ticket** : Système de support client
- **EmailCampaign** : Campagnes marketing
- **PromoCode** : Codes de réduction
- **SiteContent** : Contenu personnalisable

### 🚧 En développement

- Synchronisation packs avec interface utilisateur
- Génération PDF avancée
- Envoi d'emails automatisés
- Templates personnalisables
- Notifications push

### 📋 Roadmap

- Tests automatisés
- CI/CD
- Monitoring
- API publique
- Application mobile

## 🔧 Configuration

### Variables d'environnement

Le fichier `.env` est pré-configuré avec :

```env
# Base de données PostgreSQL
POSTGRES_USER=facturly_user
POSTGRES_PASSWORD=F4ctur1y_S3cur3_P4ssw0rd_2025
POSTGRES_DB=facturly_db

# URL de connexion Prisma (automatique)
DATABASE_URL="postgresql://facturly_user:F4ctur1y_S3cur3_P4ssw0rd_2025@db:5432/facturly_db?schema=public"

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Sécurité
JWT_SECRET=F4ctur1y_JWT_S3cr3t_K3y_2025_V3ry_L0ng_4nd_S3cur3
NODE_ENV=development
PORT=3001
```

### Base de données

Le schéma Prisma étendu définit :

#### Modèles principaux

- **User** - Utilisateurs avec authentification, rôles et profils complets
- **Invoice** - Factures avec numéro unique, client, montant et timestamps
- **Client** - Répertoire des clients avec informations complètes
- **Pack** - Offres/abonnements avec fonctionnalités et limites
- **Payment** - Transactions Stripe avec statuts et métadonnées

#### Modèles administratifs

- **Ticket** - Système de support avec priorisation et assignment
- **EmailCampaign** - Campagnes marketing avec statistiques
- **PromoCode** - Codes de réduction avec limites d'utilisation
- **SiteContent** - Contenu personnalisable du site
- **SystemSettings** - Configuration globale de l'application

#### Relations complexes

- **User ↔ Invoice** : Un utilisateur peut avoir plusieurs factures
- **User ↔ Client** : Gestion du répertoire client par utilisateur
- **User ↔ Pack** : Abonnements et souscriptions
- **Payment ↔ User** : Historique des transactions
- **Ticket ↔ User** : Support client personnalisé

#### Fonctionnalités avancées

- **Migrations automatiques** - Appliquées au démarrage du backend
- **Indexes optimisés** - Performance des requêtes complexes
- **Contraintes de données** - Intégrité référentielle
- **Soft delete** - Suppression logique pour l'audit

## 🎨 Système de design

### CSS Modules

- **Variables CSS** : Couleurs, espacements, typographie cohérents
- **Composants scopés** : Styles isolés par composant
- **Responsive design** : Breakpoints et grilles adaptatives
- **Animations** : Transitions et effets modernes

### Polices

- **Inter** : Police principale (Google Fonts)
- **Outfit** : Police d'affichage (Google Fonts)
- **Optimisation** : Préchargement automatique

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de migration Prisma**

   ```bash
   # Les migrations sont automatiques, mais si problème :
   docker-compose restart backend
   # ou manuellement :
   docker-compose exec backend npx prisma migrate deploy
   ```

2. **Problème d'affichage CSS**

   ```bash
   # Redémarrer le frontend pour vider le cache
   docker-compose restart frontend
   ```

3. **Port déjà utilisé**

   ```bash
   # Modifier les ports dans docker-compose.yml
   # ou arrêter les services qui utilisent les ports 3000/3001/5432
   ```

4. **Problème de permissions Docker**
   ```bash
   sudo docker-compose up
   # ou configurer Docker pour votre utilisateur
   ```

## 📚 Documentation

La documentation complète du projet est disponible dans le dossier `memory-bank/` :

- `projectbrief.md` - Vision et objectifs du projet
- `systemPatterns.md` - Architecture et patterns techniques
- `techContext.md` - Stack technique détaillé
- `progress.md` - État d'avancement et roadmap
- `activeContext.md` - Contexte de développement actuel

## 🚀 Améliorations récentes

### v3.0 - Panneau d'Administration Complet

- ✅ **Panneau d'administration** : Interface complète avec 9 sections fonctionnelles
- ✅ **Gestion des packs avancée** : CRUD complet avec modal de modification
- ✅ **Tableau de bord admin** : Statistiques temps réel et métriques détaillées
- ✅ **Gestion utilisateurs** : Recherche, bannissement, réinitialisation
- ✅ **Suivi des paiements** : Intégration Stripe avec gestion des remboursements
- ✅ **Outils marketing** : Campagnes email et codes promo
- ✅ **Support client** : Système de tickets avec priorisation
- ✅ **Configuration système** : Paramètres avancés et clés API
- ✅ **Schéma Prisma étendu** : 10+ modèles avec relations complexes
- ✅ **API backend complète** : Endpoints pour toutes les fonctionnalités admin

### v2.0 - Refonte CSS et UX

- ✅ **Remplacement de Tailwind** par CSS Modules pour plus de stabilité
- ✅ **Migrations automatiques** Prisma au démarrage
- ✅ **Section Fonctionnalités** avec 5 capacités principales
- ✅ **Design system** moderne avec variables CSS
- ✅ **Composants réutilisables** (Button, etc.)
- ✅ **Interface responsive** optimisée

### Fonctionnalités clés ajoutées

#### Gestion des packs améliorée

- **Modal de modification** : Interface intuitive similaire à l'édition des factures
- **Bouton de suppression** : Suppression sécurisée avec confirmation
- **Activation/désactivation** : Contrôle du statut en temps réel
- **Configuration complète** : Prix, durée, fonctionnalités, limites personnalisables

#### Architecture backend robuste

- **Services modulaires** : Séparation claire des responsabilités
- **Contrôleurs spécialisés** : Admin simple et complet
- **Validation des données** : Sécurité et intégrité des informations
- **Gestion d'erreurs** : Messages utilisateur et logging détaillé

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Facturly** - Simplifiez votre facturation, développez votre activité 🚀
