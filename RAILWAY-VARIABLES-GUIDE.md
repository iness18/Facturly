# Guide de Configuration des Variables Railway

## Étape 1 : Ajouter Toutes les Variables

1. **Cliquez sur "Add All"** dans l'interface Railway pour ajouter toutes les variables détectées

## Étape 2 : Modifier les Variables Critiques

### Variables à Modifier IMMÉDIATEMENT :

#### 1. **MONGO_PASSWORD**

- **Valeur actuelle** : `CHANGE_ME_IN_PRODUCTION`
- **Nouvelle valeur** : `FacturlySecure2024!`
- ⚠️ **IMPORTANT** : Changez cette valeur par un mot de passe fort

#### 2. **JWT_SECRET**

- **Valeur actuelle** : `GENERATE_A_STRONG_SECRET_HERE`
- **Nouvelle valeur** : `facturly-jwt-secret-production-2024-secure-key-railway`
- ⚠️ **IMPORTANT** : Ce secret sert à signer les tokens JWT

#### 3. **NODE_ENV**

- **Valeur actuelle** : `development`
- **Nouvelle valeur** : `production`
- ⚠️ **IMPORTANT** : Doit être "production" pour le déploiement

#### 4. **MONGODB_URI**

- **Valeur actuelle** : `mongodb://facturly_user:CHANGE_ME_IN_PRODUCTION@localhost:27017/facturly_db`
- **Nouvelle valeur TEMPORAIRE** : `mongodb://facturly_admin:FacturlySecure2024!@cluster0.mongodb.net/facturly_db?retryWrites=true&w=majority`
- ⚠️ **NOTE** : Vous devrez remplacer par votre vraie URI MongoDB Atlas plus tard

### Variables à Garder TEMPORAIREMENT :

#### 5. **NEXT_PUBLIC_API_URL**

- **Valeur actuelle** : `http://localhost:3001`
- **Action** : Gardez cette valeur pour l'instant
- 📝 **À faire plus tard** : Remplacer par l'URL de votre backend Railway

#### 6. **FRONTEND_URL**

- **Valeur actuelle** : `http://localhost:3000`
- **Action** : Gardez cette valeur pour l'instant
- 📝 **À faire plus tard** : Remplacer par l'URL de votre frontend Netlify

### Variables CORRECTES (ne pas modifier) :

#### 7. **MONGO_USERNAME**

- **Valeur** : `facturly_admin` ✅

#### 8. **MONGO_DATABASE**

- **Valeur** : `facturly_db` ✅

#### 9. **PORT**

- **Valeur** : `3001` ✅

## Étape 3 : Déployer le Service

1. Après avoir configuré toutes les variables, cliquez sur **"Deploy"**
2. Railway va construire et déployer votre backend
3. Attendez que le déploiement soit terminé (statut "Success")

## Étape 4 : Récupérer l'URL du Backend

1. Une fois déployé, Railway vous donnera une URL publique
2. Cette URL ressemblera à : `https://votre-app-production.up.railway.app`
3. **Notez cette URL** - vous en aurez besoin pour configurer le frontend

## Étape 5 : Prochaines Actions

Après le déploiement réussi :

1. **Créer MongoDB Atlas** (base de données cloud)
2. **Mettre à jour MONGODB_URI** avec la vraie URI Atlas
3. **Configurer Netlify** avec l'URL du backend Railway
4. **Tester l'application complète**

---

## Résumé des Valeurs à Saisir

Copiez-collez ces valeurs dans Railway :

```
MONGO_PASSWORD=FacturlySecure2024!
JWT_SECRET=facturly-jwt-secret-production-2024-secure-key-railway
NODE_ENV=production
MONGODB_URI=mongodb://facturly_admin:FacturlySecure2024!@cluster0.mongodb.net/facturly_db?retryWrites=true&w=majority
```

Les autres variables restent inchangées pour l'instant.

---

# Guide MongoDB Atlas - Configuration Complète

## Étape 1 : Créer un Compte MongoDB Atlas

1. **Allez sur** : https://www.mongodb.com/cloud/atlas
2. **Cliquez sur** "Try Free"
3. **Créez un compte** avec votre email
4. **Vérifiez votre email** et connectez-vous

## Étape 2 : Créer un Cluster (Base de Données)

1. **Sélectionnez** "Build a Database"
2. **ATTENTION** : Je vois que vous avez 3 options :
   - ❌ **M30** ($0.59/hour) - PAYANT
   - ❌ **M10** ($0.09/hour) - PAYANT
   - ✅ **Flex** (From $0.01/hour) - PAYANT aussi

**⚠️ PROBLÈME** : Il semble qu'il n'y ait pas d'option M0 gratuite visible !

## Solution Alternative : Chercher l'Option Gratuite

1. **Scrollez vers le bas** pour voir s'il y a d'autres options
2. **Ou cliquez sur** "View all cluster tiers" ou "See more options"
3. **Cherchez** l'option **"M0 Sandbox"** ou **"Free Tier"**
4. **Si introuvable** : Cliquez sur "Skip" ou "Later" et cherchez dans les paramètres

## Plan B : Utiliser Railway Database (Recommandé)

Si MongoDB Atlas ne propose pas d'option gratuite, **Railway propose une base PostgreSQL gratuite** :

1. **Dans Railway**, ajoutez un service "PostgreSQL"
2. **Modifiez votre backend** pour utiliser PostgreSQL au lieu de MongoDB
3. **Plus simple et gratuit** avec Railway

**Voulez-vous que je vous aide à configurer PostgreSQL avec Railway à la place ?**

## Étape 3 : Configurer la Sécurité

### A. Créer un Utilisateur de Base de Données

1. **Allez dans** "Database Access" (menu gauche)
2. **Cliquez** "Add New Database User"
3. **Nom d'utilisateur** : `facturly_admin`
4. **Mot de passe** : `FacturlySecure2024!`
5. **Privilèges** : "Read and write to any database"
6. **Cliquez** "Add User"

### B. Configurer l'Accès Réseau

1. **Allez dans** "Network Access" (menu gauche)
2. **Cliquez** "Add IP Address"
3. **Sélectionnez** "Allow Access from Anywhere" (0.0.0.0/0)
4. **Commentaire** : "Railway Production Access"
5. **Cliquez** "Confirm"

## Étape 4 : Récupérer l'URI de Connexion

1. **Retournez à** "Database" (menu gauche)
2. **Cliquez** "Connect" sur votre cluster
3. **Sélectionnez** "Connect your application"
4. **Driver** : Node.js
5. **Version** : 4.1 or later
6. **Copiez l'URI** qui ressemble à :
   ```
   mongodb+srv://facturly_admin:<password>@facturly-production.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Étape 5 : Préparer l'URI pour Railway

**Remplacez** `<password>` par votre mot de passe et ajoutez le nom de la base :

**URI Finale pour Railway** :

```
mongodb+srv://facturly_admin:FacturlySecure2024!@facturly-production.xxxxx.mongodb.net/facturly_db?retryWrites=true&w=majority
```

⚠️ **IMPORTANT** : Remplacez `xxxxx` par votre vrai cluster ID

## Étape 6 : Mettre à Jour Railway

1. **Retournez dans Railway**
2. **Allez dans** "Variables"
3. **Modifiez** `MONGODB_URI` avec votre nouvelle URI Atlas
4. **Redéployez** le service

## Étape 7 : Créer la Base de Données

1. **Dans MongoDB Atlas**, allez dans "Browse Collections"
2. **Cliquez** "Add My Own Data"
3. **Nom de la base** : `facturly_db`
4. **Nom de la collection** : `users`
5. **Cliquez** "Create"

---

## Résumé des Actions MongoDB

1. ✅ Créer compte MongoDB Atlas
2. ✅ Créer cluster gratuit M0
3. ✅ Créer utilisateur `facturly_admin` / `FacturlySecure2024!`
4. ✅ Autoriser accès depuis partout (0.0.0.0/0)
5. ✅ Récupérer URI de connexion
6. ✅ Mettre à jour `MONGODB_URI` dans Railway
7. ✅ Créer base `facturly_db` avec collection `users`

**URI Type** :

```
mongodb+srv://facturly_admin:FacturlySecure2024!@facturly-production.xxxxx.mongodb.net/facturly_db?retryWrites=true&w=majority
```
