# Facturly - Application de Facturation Moderne

Une application de facturation complète construite avec Next.js, NestJS, et PostgreSQL.

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

2. **Installer les dépendances**

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

3. **Configurer l'environnement**

```bash
# Copier le fichier d'exemple
cp .env.example .env
# Modifier les variables si nécessaire
```

4. **Démarrer avec Docker**

```bash
docker-compose up -d
```

5. **Initialiser la base de données**

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

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
│   │   └── ...
│   └── prisma/             # Schéma de base de données
├── frontend/               # Interface Next.js
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # Composants réutilisables
│   │   └── lib/          # Utilitaires
├── memory-bank/           # Documentation du projet
└── docker-compose.yml     # Configuration Docker
```

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

- **NestJS** - Framework Node.js
- **Prisma** - ORM pour PostgreSQL
- **TypeScript** - Langage typé
- **class-validator** - Validation des données

### Frontend

- **Next.js 15** - Framework React
- **React 19** - Interface utilisateur
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI

### Infrastructure

- **PostgreSQL** - Base de données
- **Docker** - Containerisation
- **Docker Compose** - Orchestration

## 📊 Fonctionnalités

### ✅ Implémentées

- Interface landing page moderne
- Dashboard avec statistiques
- API CRUD complète pour les factures
- Base de données PostgreSQL
- Validation des données
- Configuration CORS
- Animations CSS

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

Voir `.env.example` pour la liste complète des variables.

Variables principales :

- `DATABASE_URL` - URL de connexion PostgreSQL
- `NEXT_PUBLIC_API_URL` - URL de l'API pour le frontend
- `JWT_SECRET` - Secret pour les tokens JWT
- `NODE_ENV` - Environnement (development/production)

### Base de données

Le schéma Prisma définit actuellement :

- **Invoice** - Factures avec numéro, client, montant
- Relations futures : User, Client, InvoiceItem

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données**

   ```bash
   docker-compose down
   docker-compose up -d db
   # Attendre que la DB soit prête
   docker-compose up
   ```

2. **Port déjà utilisé**

   ```bash
   # Modifier les ports dans docker-compose.yml
   # ou arrêter les services qui utilisent les ports 3000/3001/5432
   ```

3. **Problème de permissions Docker**
   ```bash
   sudo docker-compose up
   # ou configurer Docker pour votre utilisateur
   ```

## 📚 Documentation

La documentation complète du projet est disponible dans le dossier `memory-bank/` :

- `projectbrief.md` - Vision et objectifs
- `systemPatterns.md` - Architecture technique
- `progress.md` - État d'avancement

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
