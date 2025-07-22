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
- **Backend API**: http://localhost:3001
- **Base de données**: localhost:5432

## 📁 Structure du projet

```
facturly/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── database/       # Service Prisma
│   │   ├── invoices/       # Module factures
│   │   └── main.ts         # Point d'entrée
│   └── prisma/             # Schéma et migrations
├── frontend/               # Interface Next.js
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   │   ├── page.tsx   # Page d'accueil avec Hero + Fonctionnalités
│   │   │   ├── page.module.css # Styles CSS Modules
│   │   │   └── globals.css # Système de design
│   │   └── components/    # Composants réutilisables
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
```

### API Endpoints

- `GET /invoices` - Liste des factures
- `POST /invoices` - Créer une facture
- `GET /invoices/:id` - Détail d'une facture
- `PATCH /invoices/:id` - Modifier une facture
- `DELETE /invoices/:id` - Supprimer une facture
- `GET /invoices/stats` - Statistiques

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

- **Interface moderne** : Page d'accueil avec Hero et section Fonctionnalités
- **CSS Modules** : Système de styling moderne et performant
- **API CRUD complète** : Gestion des factures avec validation
- **Base de données** : PostgreSQL avec schéma Prisma
- **Migrations automatiques** : Déploiement automatique au démarrage
- **Design responsive** : Interface adaptée à tous les écrans
- **Composants réutilisables** : Système de design cohérent

### 🚧 En développement

- Authentification JWT
- Gestion des clients
- Génération PDF
- Envoi d'emails
- Templates personnalisables

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

Le schéma Prisma définit actuellement :

- **Invoice** - Factures avec numéro unique, client, montant et timestamps
- **Migrations automatiques** - Appliquées au démarrage du backend
- **Relations futures** : User, Client, InvoiceItem

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

### v2.0 - Refonte CSS et UX

- ✅ **Remplacement de Tailwind** par CSS Modules pour plus de stabilité
- ✅ **Migrations automatiques** Prisma au démarrage
- ✅ **Section Fonctionnalités** avec 5 capacités principales
- ✅ **Design system** moderne avec variables CSS
- ✅ **Composants réutilisables** (Button, etc.)
- ✅ **Interface responsive** optimisée

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
