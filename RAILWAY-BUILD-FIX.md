# Fix Railway Build Error - Solution Complète

## 🔍 Problème Identifié

Railway essaie d'exécuter les scripts du projet racine ET du backend, causant des conflits de versions Node.js :

- **Backend** : Node 18.x, npm 8.x
- **Frontend** : Node 22.x, npm 10.x

## 🎯 Solution : Configurer Railway pour le Backend Uniquement

### Étape 1 : Modifier la Configuration Railway

**Dans Railway** :

1. **Allez dans** "Settings" de votre service
2. **Trouvez** "Source Repo"
3. **Changez** "Root Directory" de `/` vers `/backend`
4. **Sauvegardez**

### Étape 2 : Alternative - Variables d'Environnement

Si l'option Root Directory n'est pas disponible, ajoutez ces variables :

**NIXPACKS_BUILD_CMD**

```
npm install && npm run build
```

**NIXPACKS_START_CMD**

```
npm run start:prod
```

### Étape 3 : Vérifier les Variables MongoDB

Assurez-vous que ces variables sont configurées :

**MONGODB_URI**

```
${{MONGO_URL}}/facturly_db
```

**NODE_ENV**

```
production
```

**PORT**

```
3001
```

## 🚀 Redéploiement

1. **Après modification**, cliquez "Deploy"
2. **Railway va maintenant** :
   - Se concentrer uniquement sur le dossier backend
   - Utiliser Node 18.x (compatible)
   - Éviter les conflits de versions

## 📍 URL de Votre Backend

Une fois déployé avec succès, votre backend sera disponible à :

```
https://web-production-XXXX.up.railway.app
```

**Cette URL** sera votre `NEXT_PUBLIC_API_URL` pour Netlify !

## ✅ Prochaines Étapes

1. ✅ **Configurez Railway** pour pointer vers `/backend`
2. 🔄 **Redéployez** le service
3. 🔄 **Récupérez l'URL** du backend déployé
4. 🔄 **Configurez Netlify** avec cette URL

Cette solution va résoudre le conflit de versions et permettre un déploiement réussi !
