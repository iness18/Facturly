# 🛠️ Configuration de Développement - Facturly

## 🎯 Nouvelle Structure

Votre projet est maintenant configuré avec deux branches principales :

- **`main`** → Production (Netlify + Heroku)
- **`develop`** → Développement local (Docker)

## 🚀 Démarrage rapide

### 1. Cloner et configurer

```bash
# Si vous n'avez pas encore cloné
git clone https://github.com/iness18/Facturly.git
cd facturly

# Se positionner sur la branche develop
git checkout develop

# Installer les dépendances
npm install
```

### 2. Configuration de l'environnement

```bash
# Copier le fichier d'environnement de développement
cp .env.development .env

# Le fichier .env.development contient déjà toute la configuration locale
```

### 3. Démarrer l'environnement

```bash
# Démarrer MongoDB et les services avec Docker
npm run docker:up

# Dans un autre terminal, démarrer l'application
npm run dev
```

### 4. Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:3001
- **MongoDB** : localhost:27017
- **Mongo Express** : http://localhost:8081 (admin/admin123)

## 🔄 Workflow de développement quotidien

### Démarrer une session de développement

```bash
# 1. Mettre à jour la branche develop
git checkout develop
git pull origin develop

# 2. Démarrer l'environnement
npm run docker:up
npm run dev

# 3. Développer...
```

### Créer une nouvelle fonctionnalité

```bash
# 1. Créer une branche feature
git checkout -b feature/ma-nouvelle-fonctionnalite

# 2. Développer la fonctionnalité
# ... modifications du code ...

# 3. Tester localement
npm run test
npm run build

# 4. Commiter et pousser
git add .
git commit -m "feat: ajouter ma nouvelle fonctionnalité"
git push origin feature/ma-nouvelle-fonctionnalite

# 5. Créer une Pull Request vers develop
```

### Arrêter l'environnement

```bash
# Arrêter l'application (Ctrl+C)
# Arrêter Docker
npm run docker:down
```

## 🧪 Tests et validation

### Tests locaux

```bash
# Tests backend
cd backend && npm test

# Tests frontend
cd frontend && npm test

# Tests complets
npm test

# Build complet
npm run build
```

### Comptes de test

- **Admin** : `admin@facturly.com` / `Admin123!`
- **Utilisateur** : `user@test.com` / `Test123!`

## 📦 Déploiement en production

### Quand votre fonctionnalité est prête

```bash
# 1. Merger votre feature dans develop
git checkout develop
git pull origin develop
# Merger votre PR via GitHub

# 2. Quand develop est stable, créer une PR vers main
# Via l'interface GitHub

# 3. Après validation, merger dans main
# Le déploiement se fait automatiquement !
```

### Scripts de déploiement

```bash
# Déploiement automatique (depuis main)
npm run deploy

# Test de la configuration de production
node scripts/test-production.js
```

## 🔧 Commandes utiles

### Gestion Docker

```bash
npm run docker:up      # Démarrer les services
npm run docker:down    # Arrêter les services
npm run docker:logs    # Voir les logs
```

### Développement

```bash
npm run dev            # Démarrer frontend + backend
npm run dev:frontend   # Frontend uniquement
npm run dev:backend    # Backend uniquement
```

### Base de données

```bash
npm run mongodb:test   # Tester la connexion MongoDB
npm run mongodb:backup # Sauvegarder la base
```

### Maintenance

```bash
npm run clean          # Nettoyer les builds
npm run lint           # Vérifier le code
```

## 🐛 Dépannage

### Problème de port occupé

```bash
# Arrêter tous les processus Node.js
powershell "Get-Process node | Stop-Process -Force"

# Redémarrer proprement
npm run docker:down
npm run docker:up
npm run dev
```

### Problème de base de données

```bash
# Vérifier que MongoDB est démarré
npm run docker:logs

# Tester la connexion
npm run mongodb:test

# Redémarrer MongoDB
npm run docker:down
npm run docker:up
```

### Problème de build

```bash
# Nettoyer et réinstaller
npm run clean
npm install
npm run build
```

## 📁 Structure des fichiers

```
facturly/
├── .env.development      # Variables de développement (commitées)
├── .env.production       # Template production (non commitées)
├── .env                  # Variables locales (non commitées)
├── GIT-WORKFLOW.md       # Guide du workflow Git
├── DEPLOYMENT.md         # Guide de déploiement
├── DEVELOPMENT-SETUP.md  # Ce fichier
├── scripts/
│   ├── deploy.sh         # Script de déploiement
│   └── test-production.js # Tests de production
├── config/
│   └── environments.json # Configuration des environnements
└── ...
```

## 🌟 Avantages de cette configuration

### Pour le développement

- ✅ **Environnement isolé** avec Docker
- ✅ **Variables pré-configurées** pour le développement
- ✅ **Hot reload** frontend et backend
- ✅ **Base de données locale** avec données de test

### Pour la production

- ✅ **Déploiement automatique** sur push vers main
- ✅ **Configuration optimisée** pour Netlify et Heroku
- ✅ **Variables sécurisées** pour la production
- ✅ **Tests automatiques** avant déploiement

### Pour l'équipe

- ✅ **Workflow Git clair** avec branches dédiées
- ✅ **Documentation complète** pour tous les processus
- ✅ **Scripts automatisés** pour les tâches courantes
- ✅ **Séparation claire** développement/production

## 🎯 Prochaines étapes

1. **Développez sur `develop`** avec l'environnement local
2. **Créez des branches `feature/*`** pour les nouvelles fonctionnalités
3. **Mergez dans `develop`** via Pull Requests
4. **Déployez en production** via merge `develop` → `main`

## 📞 Aide

- **Workflow Git** : Consultez [`GIT-WORKFLOW.md`](GIT-WORKFLOW.md)
- **Déploiement** : Consultez [`DEPLOYMENT.md`](DEPLOYMENT.md)
- **Production** : Consultez [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md)

---

**🎉 Bon développement sur Facturly !**
