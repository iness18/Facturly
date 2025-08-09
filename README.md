# 🧾 Facturly

Application de facturation moderne pour freelances et petites entreprises, construite avec Next.js, NestJS et MongoDB.

## 🚀 Déploiement en Production

La branche `main` est configurée comme branche de production avec déploiement automatique sur :

- **Frontend** : Netlify
- **Backend** : Heroku
- **Base de données** : MongoDB Atlas

### Déploiement rapide

```bash
# Déploiement en production
npm run deploy

# Déploiement en staging
npm run deploy:staging
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│  (MongoDB)      │
│   Netlify       │    │   Heroku        │    │  Atlas          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Installation et Développement

### Prérequis

- Node.js 18+
- npm 8+
- Docker (pour le développement local)
- Git

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/facturly.git
cd facturly

# Installer toutes les dépendances
npm install

# Ou installer manuellement
npm run setup
```

### Développement local

```bash
# Démarrer avec Docker (recommandé)
npm run docker:up

# Ou démarrer manuellement
npm run dev

# Voir les logs Docker
npm run docker:logs

# Arrêter Docker
npm run docker:down
```

### URLs de développement

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:3001
- **MongoDB** : localhost:27017
- **Mongo Express** : http://localhost:8081

## 📦 Scripts disponibles

### Développement

```bash
npm run dev              # Démarrer frontend + backend
npm run dev:frontend     # Démarrer uniquement le frontend
npm run dev:backend      # Démarrer uniquement le backend
```

### Build et test

```bash
npm run build            # Builder frontend + backend
npm run test             # Tester frontend + backend
npm run lint             # Linter frontend + backend
```

### Déploiement

```bash
npm run deploy           # Déployer en production
npm run deploy:staging   # Déployer en staging
npm run deploy:production # Déployer en production (explicite)
```

### Base de données

```bash
npm run mongodb:test     # Tester la connexion MongoDB
npm run mongodb:backup   # Sauvegarder la base de données
```

### Maintenance

```bash
npm run clean            # Nettoyer les builds et node_modules
npm run docker:up        # Démarrer l'environnement Docker
npm run docker:down      # Arrêter l'environnement Docker
```

## 🌍 Environnements

### Développement Local

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:3001
- **Base de données** : MongoDB local (Docker)

### Staging

- **Frontend** : https://staging--facturly.netlify.app
- **Backend** : https://facturly-backend-staging.herokuapp.com
- **Base de données** : MongoDB Atlas (staging)

### Production

- **Frontend** : https://facturly.netlify.app
- **Backend** : https://facturly-backend-prod.herokuapp.com
- **Base de données** : MongoDB Atlas (production)

## 🔧 Configuration

### Variables d'environnement

Copiez et configurez les fichiers d'environnement :

```bash
# Développement
cp .env.example .env

# Production
cp .env.production.example .env.production
```

### Configuration MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Créez un cluster
3. Configurez l'accès réseau (0.0.0.0/0 pour Heroku)
4. Créez un utilisateur de base de données
5. Récupérez l'URI de connexion

### Configuration Netlify

1. Connectez votre repository GitHub
2. Configurez les paramètres de build :
   - **Base directory** : `frontend`
   - **Build command** : `npm run build`
   - **Publish directory** : `frontend/.next`
3. Ajoutez les variables d'environnement

### Configuration Heroku

1. Créez une application Heroku
2. Configurez les variables d'environnement
3. Connectez votre repository GitHub
4. Activez le déploiement automatique

## 🧪 Tests

### Comptes de test

- **Admin** : `admin@facturly.com` / `Admin123!`
- **Utilisateur** : `user@test.com` / `Test123!`

### Tests automatisés

```bash
# Tests backend
cd backend && npm test

# Tests frontend
cd frontend && npm test

# Tests complets
npm test
```

## 📚 Documentation

- [Guide de déploiement](./DEPLOYMENT.md) - Instructions détaillées pour la production
- [Architecture technique](./docs/ARCHITECTURE.md) - Détails de l'architecture
- [API Documentation](./docs/API.md) - Documentation de l'API REST

## 🔍 Dépannage

### Problèmes courants

1. **Erreur de connexion MongoDB**

   ```bash
   npm run mongodb:test
   ```

2. **Problème de build**

   ```bash
   npm run clean
   npm install
   npm run build
   ```

3. **Problème Docker**
   ```bash
   npm run docker:down
   npm run docker:up
   ```

### Logs

```bash
# Logs Heroku
heroku logs --tail -a facturly-backend-prod

# Logs Docker
npm run docker:logs

# Logs Netlify
# Disponibles dans l'interface web Netlify
```

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [NestJS](https://nestjs.com/) - Framework Node.js
- [MongoDB](https://www.mongodb.com/) - Base de données NoSQL
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI

---

**🎉 Facturly - Simplifiez votre facturation !**
