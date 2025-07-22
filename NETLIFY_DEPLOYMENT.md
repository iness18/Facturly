# 🚀 Guide de Déploiement Netlify pour Facturly

Ce guide vous explique comment déployer votre application Facturly sur Netlify via GitHub.

## 📋 Prérequis

- ✅ Compte GitHub avec le repository Facturly
- ✅ Compte Netlify (gratuit)
- ✅ Code pushé sur la branche `main`

## 🔧 Configuration Automatique

Les fichiers de configuration suivants ont été créés pour optimiser le déploiement :

### 📄 `netlify.toml`

- Configuration de build automatique
- Optimisations pour Next.js
- Headers de sécurité
- Cache des assets

### 📄 `frontend/next.config.js`

- Export statique activé
- Images non optimisées (compatible Netlify)
- Headers de sécurité
- Optimisations webpack

### 📄 `frontend/public/_redirects`

- Gestion des routes dynamiques
- Fallback SPA pour Next.js App Router

## 🚀 Étapes de Déploiement

### 1. Connexion à Netlify

1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur **"Sign up"** ou **"Log in"**
3. Connectez-vous avec votre compte GitHub

### 2. Nouveau Site depuis Git

1. Dans le dashboard Netlify, cliquez sur **"Add new site"**
2. Sélectionnez **"Import an existing project"**
3. Choisissez **"Deploy with GitHub"**
4. Autorisez Netlify à accéder à vos repositories GitHub
5. Sélectionnez le repository **"Facturly"**

### 3. Configuration du Build

Netlify détectera automatiquement la configuration grâce au fichier `netlify.toml`, mais vérifiez :

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/out
```

### 4. Variables d'Environnement (Optionnel)

Si vous avez des variables d'environnement :

1. Dans les paramètres du site Netlify
2. Allez dans **"Environment variables"**
3. Ajoutez vos variables :
   - `NEXT_PUBLIC_API_URL` (si vous avez une API)
   - `NODE_VERSION=18`

### 5. Déploiement

1. Cliquez sur **"Deploy site"**
2. Netlify va :
   - Cloner votre repository
   - Installer les dépendances (`npm install`)
   - Builder l'application (`npm run build`)
   - Déployer les fichiers statiques

## 🔄 Déploiements Automatiques

Une fois configuré, Netlify redéploiera automatiquement votre site à chaque push sur la branche `main`.

## 🌐 URL de Production

Après le déploiement, vous obtiendrez :

- **URL temporaire** : `https://random-name-123456.netlify.app`
- **Domaine personnalisé** : Configurable dans les paramètres

## 🛠️ Optimisations Incluses

### Performance

- ✅ Export statique Next.js
- ✅ Cache des assets (1 an)
- ✅ Compression automatique
- ✅ CDN global Netlify

### Sécurité

- ✅ Headers de sécurité (X-Frame-Options, CSP, etc.)
- ✅ HTTPS automatique
- ✅ Protection contre les attaques XSS

### SEO

- ✅ Meta tags optimisés
- ✅ Sitemap automatique
- ✅ Robots.txt

## 🐛 Dépannage

### Erreur de Build

Si le build échoue :

1. Vérifiez les logs dans Netlify
2. Testez le build localement : `cd frontend && npm run build`
3. Vérifiez que toutes les dépendances sont dans `package.json`

### Routes 404

Si certaines pages retournent 404 :

1. Vérifiez le fichier `frontend/public/_redirects`
2. Assurez-vous que `output: 'export'` est dans `next.config.js`

### Performance

Pour optimiser les performances :

1. Activez les "Build plugins" Netlify
2. Configurez le cache des images
3. Utilisez Netlify Analytics

## 📞 Support

- 📖 [Documentation Netlify](https://docs.netlify.com)
- 📖 [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- 🆘 [Support Netlify](https://support.netlify.com)

## 🎉 Félicitations !

Votre application Facturly est maintenant déployée et accessible mondialement via le CDN Netlify !
