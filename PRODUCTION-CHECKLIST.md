# ✅ Checklist de Configuration Production - Facturly

## 🎯 Objectif

Configurer la branche `main` comme branche de production avec déploiement automatique sur Netlify (frontend) et Heroku (backend).

## 📋 Checklist de Configuration

### 🗄️ Base de données (MongoDB Atlas)

- [ ] Créer un compte MongoDB Atlas
- [ ] Créer un cluster de production
- [ ] Configurer l'accès réseau (0.0.0.0/0 pour Heroku)
- [ ] Créer un utilisateur de base de données
- [ ] Récupérer l'URI de connexion
- [ ] Tester la connexion avec `npm run mongodb:test`

### 🖥️ Backend (Heroku)

- [ ] Créer une application Heroku : `heroku create facturly-backend-prod`
- [ ] Configurer les variables d'environnement :
  ```bash
  heroku config:set NODE_ENV=production
  heroku config:set MONGODB_URI="mongodb+srv://..."
  heroku config:set JWT_SECRET="VOTRE_CLE_SECRETE_TRES_LONGUE"
  heroku config:set FRONTEND_URL="https://votre-app.netlify.app"
  ```
- [ ] Déployer : `git push heroku main`
- [ ] Vérifier : `heroku logs --tail`

### 🌐 Frontend (Netlify)

- [ ] Connecter le repository sur Netlify
- [ ] Configurer les paramètres de build :
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/.next`
- [ ] Ajouter les variables d'environnement :
  ```
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=https://votre-backend.herokuapp.com
  NEXT_TELEMETRY_DISABLED=1
  ```
- [ ] Activer le déploiement automatique sur la branche `main`

### 🔧 Configuration des URLs

- [ ] Mettre à jour `frontend/public/_redirects` avec la vraie URL backend
- [ ] Mettre à jour les variables Heroku avec la vraie URL frontend
- [ ] Mettre à jour les variables Netlify avec la vraie URL backend

### 🧪 Tests de Production

- [ ] Tester le script : `node scripts/test-production.js`
- [ ] Vérifier l'accès au frontend
- [ ] Tester la connexion avec les comptes de test :
  - Admin : `admin@facturly.com` / `Admin123!`
  - User : `user@test.com` / `Test123!`
- [ ] Vérifier les logs backend : `heroku logs --tail`

## 📁 Fichiers Créés

### Configuration Netlify

- ✅ `netlify.toml` - Configuration principale Netlify
- ✅ `frontend/public/_redirects` - Redirections pour Next.js
- ✅ `frontend/next.config.js` - Configuration Next.js optimisée

### Configuration Heroku

- ✅ `Procfile` - Configuration de démarrage Heroku
- ✅ `backend/app.json` - Métadonnées de l'application Heroku
- ✅ `backend/src/main.ts` - Configuration serveur pour production

### Variables d'environnement

- ✅ `.env.production` - Template des variables de production
- ✅ `config/environments.json` - Configuration des environnements
- ✅ `.gitignore` - Fichiers à ignorer (incluant .env.production)

### Scripts et documentation

- ✅ `scripts/deploy.sh` - Script de déploiement automatisé
- ✅ `scripts/test-production.js` - Script de test de production
- ✅ `package.json` - Scripts npm mis à jour
- ✅ `DEPLOYMENT.md` - Guide de déploiement détaillé
- ✅ `README.md` - Documentation mise à jour

### Configuration MongoDB

- ✅ `backend/src/database/mongodb.module.ts` - Configuration optimisée pour production

## 🚀 Commandes Utiles

### Déploiement

```bash
# Déploiement automatique
npm run deploy

# Déploiement en staging
npm run deploy:staging

# Script de déploiement manuel
./scripts/deploy.sh production
```

### Tests

```bash
# Test de la configuration de production
node scripts/test-production.js

# Test de la base de données
npm run mongodb:test
```

### Monitoring

```bash
# Logs Heroku
heroku logs --tail -a facturly-backend-prod

# Status Heroku
heroku ps -a facturly-backend-prod

# Redémarrer Heroku
heroku restart -a facturly-backend-prod
```

## 🔍 Dépannage

### Problèmes courants

1. **Backend inaccessible**

   - Vérifier les variables d'environnement Heroku
   - Vérifier les logs : `heroku logs --tail`
   - Vérifier que l'application est démarrée : `heroku ps`

2. **Frontend ne charge pas**

   - Vérifier le build Netlify dans l'interface
   - Vérifier les variables d'environnement Netlify
   - Vérifier les redirections dans `_redirects`

3. **Erreurs de base de données**

   - Vérifier l'URI MongoDB dans Heroku
   - Vérifier l'accès réseau MongoDB Atlas
   - Tester la connexion : `npm run mongodb:test`

4. **Erreurs CORS**
   - Vérifier `FRONTEND_URL` dans Heroku
   - Vérifier `NEXT_PUBLIC_API_URL` dans Netlify
   - Vérifier la configuration CORS dans `main.ts`

## 🎉 Finalisation

Une fois tous les éléments cochés :

1. **Testez l'application complète** sur les URLs de production
2. **Vérifiez les fonctionnalités** : connexion, inscription, navigation
3. **Configurez le monitoring** et les alertes
4. **Documentez les URLs** pour votre équipe
5. **Planifiez les sauvegardes** de la base de données

## 📞 Support

- **Documentation** : Consultez `DEPLOYMENT.md` pour les détails
- **Scripts** : Utilisez `scripts/deploy.sh` et `scripts/test-production.js`
- **Logs** : Surveillez les logs Heroku et Netlify
- **Tests** : Utilisez les comptes de test pour valider

---

**🎯 Objectif atteint : Branche `main` configurée comme branche de production !**
