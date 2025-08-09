# 🚀 Guide de Déploiement - Facturly

Ce guide vous explique comment déployer Facturly en production avec Netlify (frontend) et Heroku (backend) en utilisant la branche `main` comme branche de production.

## 📋 Prérequis

- [ ] Compte [Netlify](https://netlify.com)
- [ ] Compte [Heroku](https://heroku.com)
- [ ] Compte [MongoDB Atlas](https://cloud.mongodb.com) (recommandé pour la production)
- [ ] Repository Git avec la branche `main` configurée

## 🗄️ Étape 1: Configuration MongoDB Atlas

### 1.1 Créer un cluster MongoDB Atlas

1. Connectez-vous à [MongoDB Atlas](https://cloud.mongodb.com)
2. Créez un nouveau projet "Facturly"
3. Créez un cluster (choisissez le plan gratuit M0 pour commencer)
4. Configurez l'accès réseau :
   - Ajoutez `0.0.0.0/0` pour autoriser toutes les IPs (ou configurez spécifiquement)
5. Créez un utilisateur de base de données :
   - Username: `facturly_user`
   - Password: générez un mot de passe sécurisé
6. Récupérez l'URI de connexion :
   ```
   mongodb+srv://facturly_user:<password>@cluster.mongodb.net/facturly_db?retryWrites=true&w=majority
   ```

### 1.2 Tester la connexion

```bash
# Depuis le dossier backend
npm run mongodb:test:atlas
```

## 🖥️ Étape 2: Déploiement Backend sur Heroku

### 2.1 Préparation

1. Installez la CLI Heroku :

   ```bash
   npm install -g heroku
   ```

2. Connectez-vous à Heroku :
   ```bash
   heroku login
   ```

### 2.2 Création de l'application Heroku

```bash
# Depuis la racine du projet
heroku create votre-app-backend-facturly

# Ou avec un nom spécifique
heroku create facturly-backend-prod
```

### 2.3 Configuration des variables d'environnement

```bash
# Variables essentielles
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://facturly_user:<password>@cluster.mongodb.net/facturly_db?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="VOTRE_CLE_SECRETE_JWT_TRES_LONGUE_ET_COMPLEXE"
heroku config:set FRONTEND_URL="https://votre-app.netlify.app"

# Variables optionnelles
heroku config:set CORS_ORIGIN="https://votre-app.netlify.app"
heroku config:set LOG_LEVEL=info
heroku config:set LOG_FORMAT=json
```

### 2.4 Déploiement

```bash
# Ajouter le remote Heroku
heroku git:remote -a votre-app-backend-facturly

# Déployer la branche main
git push heroku main

# Vérifier les logs
heroku logs --tail
```

### 2.5 Vérification

```bash
# Tester l'API
curl https://votre-app-backend-facturly.herokuapp.com/

# Vérifier la santé de l'application
heroku ps:scale web=1
heroku open
```

## 🌐 Étape 3: Déploiement Frontend sur Netlify

### 3.1 Configuration via l'interface Netlify

1. Connectez-vous à [Netlify](https://app.netlify.com)
2. Cliquez sur "New site from Git"
3. Connectez votre repository GitHub/GitLab
4. Configurez les paramètres de build :
   - **Branch to deploy:** `main`
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/.next`

### 3.2 Variables d'environnement Netlify

Dans les paramètres de votre site Netlify, ajoutez :

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://votre-app-backend-facturly.herokuapp.com
NEXT_TELEMETRY_DISABLED=1
```

### 3.3 Configuration du domaine personnalisé (optionnel)

1. Dans les paramètres Netlify, allez à "Domain management"
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions Netlify
4. Activez HTTPS automatique

### 3.4 Mise à jour des URLs

Une fois déployé, mettez à jour les URLs dans Heroku :

```bash
# Mettre à jour l'URL frontend dans le backend
heroku config:set FRONTEND_URL="https://votre-app.netlify.app"
heroku config:set CORS_ORIGIN="https://votre-app.netlify.app"
```

Et dans Netlify, mettez à jour :

```env
NEXT_PUBLIC_API_URL=https://votre-app-backend-facturly.herokuapp.com
```

## 🔧 Étape 4: Configuration des redirections

### 4.1 Mise à jour des redirections Netlify

Modifiez le fichier `frontend/public/_redirects` :

```
# API routes - rediriger vers le backend Heroku
/api/* https://votre-app-backend-facturly.herokuapp.com/:splat 200

# Pages dynamiques Next.js
/dashboard/* /index.html 200
/admin/* /index.html 200
/connexion /index.html 200
/inscription /index.html 200
/contact /index.html 200
/fonctionnalites /index.html 200
/demo /index.html 200

# Fallback pour toutes les autres routes
/* /index.html 200
```

## 🧪 Étape 5: Tests de production

### 5.1 Tests backend

```bash
# Tester l'API de santé
curl https://votre-app-backend-facturly.herokuapp.com/

# Tester l'authentification
curl -X POST https://votre-app-backend-facturly.herokuapp.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@facturly.com","password":"Admin123!"}'
```

### 5.2 Tests frontend

1. Visitez `https://votre-app.netlify.app`
2. Testez la navigation entre les pages
3. Testez la connexion avec les comptes de test :
   - Admin : `admin@facturly.com` / `Admin123!`
   - User : `user@test.com` / `Test123!`

## 🔄 Étape 6: Workflow de déploiement automatique

### 6.1 Configuration des webhooks

Les deux plateformes se déploient automatiquement sur push vers `main` :

- **Netlify** : Déploiement automatique configuré
- **Heroku** : Déploiement automatique via Git

### 6.2 Processus de mise à jour

```bash
# 1. Développement local
git checkout main
git pull origin main

# 2. Faire vos modifications
# ... modifications du code ...

# 3. Tests locaux
npm run test  # si configuré
npm run build # vérifier que le build fonctionne

# 4. Commit et push
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 5. Les déploiements se font automatiquement
# - Netlify redéploie le frontend
# - Heroku redéploie le backend
```

## 🔍 Étape 7: Monitoring et maintenance

### 7.1 Surveillance des logs

```bash
# Logs Heroku
heroku logs --tail -a votre-app-backend-facturly

# Logs Netlify
# Disponibles dans l'interface web Netlify
```

### 7.2 Métriques importantes à surveiller

- **Heroku** : Temps de réponse, utilisation mémoire, erreurs
- **Netlify** : Temps de build, taille des bundles, Core Web Vitals
- **MongoDB Atlas** : Connexions, requêtes lentes, stockage

### 7.3 Sauvegardes

```bash
# Sauvegarde MongoDB Atlas (automatique)
# Ou manuel via mongodump
mongodump --uri="mongodb+srv://..." --out=./backup-$(date +%Y%m%d)
```

## 🚨 Dépannage

### Problèmes courants

1. **Erreur de connexion MongoDB**

   - Vérifiez l'URI dans les variables Heroku
   - Vérifiez les autorisations réseau MongoDB Atlas

2. **Erreurs CORS**

   - Vérifiez que `FRONTEND_URL` est correctement configuré
   - Vérifiez les redirections Netlify

3. **Build Netlify échoue**

   - Vérifiez les variables d'environnement
   - Vérifiez les dépendances dans `package.json`

4. **API non accessible**
   - Vérifiez que Heroku est bien démarré : `heroku ps`
   - Vérifiez les logs : `heroku logs --tail`

### Commandes utiles

```bash
# Redémarrer Heroku
heroku restart

# Voir l'état des dynos
heroku ps

# Accéder à la console Heroku
heroku run bash

# Forcer un nouveau déploiement Netlify
# Via l'interface web : Deploy > Trigger deploy
```

## 📚 Ressources

- [Documentation Heroku](https://devcenter.heroku.com/)
- [Documentation Netlify](https://docs.netlify.com/)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentation Next.js Deployment](https://nextjs.org/docs/deployment)

---

## ✅ Checklist de déploiement

- [ ] MongoDB Atlas configuré et testé
- [ ] Backend Heroku déployé et fonctionnel
- [ ] Frontend Netlify déployé et accessible
- [ ] Variables d'environnement configurées
- [ ] Redirections configurées
- [ ] Tests de production réussis
- [ ] Monitoring configuré
- [ ] Documentation mise à jour

**🎉 Félicitations ! Votre application Facturly est maintenant en production !**
