# 🚂 Déploiement Railway - Backend Facturly

## 🎯 Architecture complète

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐
│     Frontend        │    │      Backend        │    │   Database      │
│   (Netlify)         │◄──►│    (Railway)        │◄──►│ (MongoDB Atlas) │
│   factur-ly.com     │    │ votre-app.railway   │    │                 │
└─────────────────────┘    └─────────────────────┘    └─────────────────┘
```

## 🚀 Déploiement sur Railway

### 1. Créer un compte Railway

1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Sélectionnez "Deploy from GitHub repo"
5. Choisissez votre repository `Facturly`

### 2. Configuration automatique

Railway va automatiquement :

- ✅ Détecter que c'est un projet Node.js
- ✅ Utiliser le fichier [`railway.json`](railway.json) pour la configuration
- ✅ Installer les dépendances du backend
- ✅ Builder l'application NestJS
- ✅ Démarrer le serveur

### 3. Variables d'environnement

Dans Railway, ajoutez ces variables :

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/facturly_db?retryWrites=true&w=majority
JWT_SECRET=VOTRE_CLE_SECRETE_JWT_TRES_LONGUE
FRONTEND_URL=https://factur-ly.com
PORT=3001
```

### 4. Récupérer l'URL du backend

Une fois déployé, Railway vous donnera une URL comme :

```
https://votre-app-production.up.railway.app
```

## 🔗 Connecter Frontend et Backend

### 1. Mettre à jour Netlify

Dans votre dashboard Netlify, ajoutez/modifiez cette variable :

```env
NEXT_PUBLIC_API_URL=https://votre-app-production.up.railway.app
```

### 2. Redéployer le frontend

```bash
# Déclencher un nouveau build Netlify
git commit --allow-empty -m "trigger: redeploy frontend with Railway backend URL"
git push origin main
```

## 🧪 Tests

### 1. Tester le backend

```bash
# Test de santé
curl https://votre-app-production.up.railway.app/

# Test d'authentification
curl -X POST https://votre-app-production.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@facturly.com","password":"Admin123!"}'
```

### 2. Tester l'application complète

1. **Frontend** : https://factur-ly.com
2. **Connexion** : Testez avec `admin@facturly.com` / `Admin123!`
3. **API** : Les appels depuis le frontend vers `/api/*` sont redirigés vers Railway

## 🔧 Configuration Railway

### Fichier de configuration

Le fichier [`railway.json`](railway.json) configure :

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend && npm run start:prod",
    "healthcheckPath": "/",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Avantages de Railway

- ✅ **Gratuit** : 500h/mois (largement suffisant pour commencer)
- ✅ **Simple** : Déploiement automatique sur push
- ✅ **Rapide** : Build et déploiement en quelques minutes
- ✅ **Monitoring** : Logs et métriques intégrés
- ✅ **Domaine** : URL HTTPS automatique
- ✅ **Variables** : Interface simple pour les env vars

## 📊 Monitoring

### Logs Railway

1. **Dashboard Railway** → Votre projet → Deployments
2. **View Logs** pour voir les logs en temps réel
3. **Metrics** pour voir CPU, RAM, requêtes

### Commandes utiles

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Voir les logs
railway logs

# Voir les variables
railway variables

# Redéployer
railway up
```

## 🚨 Dépannage

### Problèmes courants

1. **Build échoue**

   - Vérifiez que `backend/package.json` a le script `start:prod`
   - Vérifiez les dépendances dans `package.json`

2. **App ne démarre pas**

   - Vérifiez les variables d'environnement
   - Vérifiez les logs Railway
   - Vérifiez que le port est bien configuré

3. **Frontend ne peut pas appeler l'API**
   - Vérifiez `NEXT_PUBLIC_API_URL` dans Netlify
   - Vérifiez `FRONTEND_URL` dans Railway
   - Vérifiez les CORS dans le backend

### Logs et debugging

```bash
# Voir les logs en temps réel
railway logs --follow

# Voir les variables d'environnement
railway variables

# Redémarrer l'application
railway restart
```

## 🔄 Workflow de développement

### Développement local

```bash
# Branche develop
git checkout develop
npm run docker:up
npm run dev
```

### Déploiement production

```bash
# 1. Merger dans main
git checkout main
git merge develop
git push origin main

# 2. Railway redéploie automatiquement le backend
# 3. Netlify redéploie automatiquement le frontend
```

## 💰 Coûts

### Plan gratuit Railway

- **500 heures/mois** : ~20 jours de fonctionnement continu
- **1GB RAM** : Suffisant pour NestJS
- **1GB stockage** : Pour les logs et cache
- **Domaine HTTPS** : Inclus

### Optimisation

Pour économiser les heures :

- L'app se met en veille après 10min d'inactivité
- Se réveille automatiquement à la première requête
- Temps de réveil : ~2-3 secondes

## 🎯 Prochaines étapes

1. **Déployez sur Railway** avec ce guide
2. **Récupérez l'URL** du backend
3. **Mettez à jour Netlify** avec la nouvelle URL
4. **Testez l'application complète** !

---

**🚂 Votre backend sera bientôt en ligne sur Railway !**
