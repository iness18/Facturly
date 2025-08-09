# 🚀 Déploiement Netlify - Facturly

## 🎯 Architecture Netlify

Votre application Facturly est maintenant configurée pour être entièrement déployée sur Netlify :

- **Frontend** : Next.js (export statique)
- **Backend** : Fonctions serverless Netlify
- **Base de données** : MongoDB Atlas

```
┌─────────────────────────────────────────────────────────┐
│                    Netlify                              │
├─────────────────────┬───────────────────────────────────┤
│   Frontend          │   Backend                         │
│   (Next.js)         │   (Fonctions Serverless)          │
│   Static Export     │   /.netlify/functions/api         │
└─────────────────────┴───────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  MongoDB Atlas  │
                    │  (Base de données) │
                    └─────────────────┘
```

## 📋 Configuration Netlify

### 1. Paramètres de build

Dans votre dashboard Netlify :

- **Base directory** : (laisser vide)
- **Build command** : `npm install && npm run build:frontend && npm run build:backend`
- **Publish directory** : `frontend/out`
- **Functions directory** : `netlify/functions`

### 2. Variables d'environnement

Ajoutez ces variables dans Netlify :

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/facturly_db?retryWrites=true&w=majority
JWT_SECRET=VOTRE_CLE_SECRETE_JWT_TRES_LONGUE
NEXT_TELEMETRY_DISABLED=1
```

### 3. Configuration automatique

Les fichiers suivants configurent automatiquement Netlify :

- ✅ [`netlify.toml`](netlify.toml) - Configuration principale
- ✅ [`netlify/functions/api.js`](netlify/functions/api.js) - Fonction serverless pour l'API
- ✅ [`frontend/public/_redirects`](frontend/public/_redirects) - Redirections
- ✅ [`frontend/next.config.js`](frontend/next.config.js) - Configuration Next.js

## 🗄️ Configuration MongoDB Atlas

### 1. Créer un cluster

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Créez un nouveau projet "Facturly"
3. Créez un cluster (M0 gratuit pour commencer)
4. Configurez l'accès réseau : `0.0.0.0/0` (toutes les IPs)

### 2. Créer un utilisateur

1. Database Access → Add New Database User
2. Username : `facturly_user`
3. Password : Générez un mot de passe sécurisé
4. Rôle : `readWrite` sur `facturly_db`

### 3. Récupérer l'URI

```
mongodb+srv://facturly_user:<password>@cluster.mongodb.net/facturly_db?retryWrites=true&w=majority
```

## 🚀 Déploiement

### Déploiement automatique

1. **Connectez votre repository** GitHub à Netlify
2. **Configurez la branche** `main` pour le déploiement automatique
3. **Ajoutez les variables d'environnement**
4. **Déclenchez un build** en pushant sur `main`

### Déploiement manuel

```bash
# 1. Installer Netlify CLI
npm install -g netlify-cli

# 2. Se connecter à Netlify
netlify login

# 3. Déployer
netlify deploy --prod
```

## 🧪 Tests

### 1. Tester localement

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Démarrer en mode développement avec fonctions
netlify dev
```

### 2. Tester en production

Une fois déployé, testez :

- **Frontend** : `https://votre-app.netlify.app`
- **API** : `https://votre-app.netlify.app/api/`
- **Authentification** : `https://votre-app.netlify.app/api/auth/login`

### 3. Comptes de test

- **Admin** : `admin@facturly.com` / `Admin123!`
- **User** : `user@test.com` / `Test123!`

## 🔧 Avantages de cette configuration

### ✅ Simplicité

- **Une seule plateforme** : Netlify pour tout
- **Déploiement automatique** sur push vers `main`
- **Pas de serveur à gérer** : fonctions serverless
- **SSL automatique** et CDN global

### ✅ Performance

- **Frontend statique** : Très rapide
- **Fonctions serverless** : Démarrage à froid optimisé
- **CDN global** : Netlify Edge
- **Cache intelligent** : Assets optimisés

### ✅ Coût

- **Plan gratuit** : 100GB de bande passante
- **Fonctions incluses** : 125k requêtes/mois
- **Builds illimités** : Pour les projets open source
- **Pas de serveur** : Pas de coût fixe

## 🔍 Monitoring

### Logs Netlify

1. **Build logs** : Dashboard Netlify → Deploys
2. **Function logs** : Dashboard Netlify → Functions
3. **Analytics** : Dashboard Netlify → Analytics

### Commandes utiles

```bash
# Voir les logs des fonctions
netlify functions:log

# Voir le statut du site
netlify status

# Ouvrir le dashboard
netlify open
```

## 🚨 Dépannage

### Problèmes courants

1. **Build échoue**

   - Vérifiez les variables d'environnement
   - Vérifiez les dépendances dans `package.json`
   - Consultez les logs de build

2. **Fonctions ne répondent pas**

   - Vérifiez `netlify/functions/api.js`
   - Vérifiez les redirections dans `_redirects`
   - Consultez les logs des fonctions

3. **Base de données inaccessible**
   - Vérifiez l'URI MongoDB dans les variables
   - Vérifiez l'accès réseau MongoDB Atlas
   - Testez la connexion localement

### Logs et debugging

```bash
# Logs en temps réel
netlify functions:log --live

# Tester une fonction localement
netlify functions:invoke api --payload '{"httpMethod":"GET","path":"/"}'

# Debug du build
netlify build --debug
```

## 📊 Métriques importantes

### Performance

- **Time to First Byte** : < 200ms
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cold start functions** : < 1s

### Limites Netlify (plan gratuit)

- **Bande passante** : 100GB/mois
- **Fonctions** : 125k invocations/mois
- **Durée d'exécution** : 10s max par fonction
- **Taille des fonctions** : 50MB max

## 🎯 Optimisations

### Frontend

- ✅ **Export statique** : Pas de serveur Node.js
- ✅ **Images optimisées** : Next.js Image component
- ✅ **Code splitting** : Bundles optimisés
- ✅ **Cache headers** : Assets mis en cache

### Backend

- ✅ **Fonctions serverless** : Pas de serveur permanent
- ✅ **Connection pooling** : MongoDB optimisé
- ✅ **Error handling** : Gestion des erreurs robuste
- ✅ **CORS configuré** : Sécurité optimisée

## 🔄 Workflow de développement

### Développement local

```bash
# 1. Branche develop
git checkout develop

# 2. Environnement local
npm run docker:up
npm run dev

# 3. Test avec Netlify CLI
netlify dev
```

### Déploiement production

```bash
# 1. Merger dans main
git checkout main
git merge develop
git push origin main

# 2. Netlify déploie automatiquement !
```

## 📚 Ressources

- [Documentation Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Netlify CLI](https://cli.netlify.com/)

---

**🎉 Votre application Facturly est maintenant optimisée pour Netlify !**
