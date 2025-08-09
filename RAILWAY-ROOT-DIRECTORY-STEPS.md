# Railway Root Directory - Configuration Étape par Étape

## 🎯 Solution Immédiate

Je vois vos paramètres Railway. Voici exactement quoi faire :

### Étape 1 : Configurer Root Directory

**Dans la section "Source"** (première image) :

1. **Cliquez sur** "Add Root Directory" (vous voyez le lien)
2. **Tapez** : `backend`
3. **Sauvegardez**

### Étape 2 : Vérifier la Configuration Build

**Dans la section "Build"** (deuxième image) :

Vos paramètres actuels sont corrects :

- ✅ **Custom Build Command** : `npm install && npm run build`
- ✅ **Node Provider** : Activé

### Étape 3 : Vérifier la Configuration Deploy

**Dans la section "Deploy"** (troisième image) :

Vos paramètres actuels sont corrects :

- ✅ **Custom Start Command** : `npm run start:prod`
- ✅ **Healthcheck Path** : `/`

## 🚀 Action Immédiate

**Cliquez sur "Add Root Directory"** dans la première section et tapez `backend`.

Cela va dire à Railway :

- "Va dans le dossier `/backend`"
- "Exécute `npm install && npm run build` DANS ce dossier"
- "Lance `npm run start:prod` DANS ce dossier"

## ✅ Résultat Attendu

Après avoir ajouté `backend` comme Root Directory :

1. **Railway va redéployer automatiquement**
2. **Il va ignorer** les scripts du projet racine
3. **Il va utiliser** uniquement le `package.json` du backend
4. **Le build va réussir** !

## 📍 URL Finale

Une fois déployé, votre backend sera à :

```
https://web-production-5087a.up.railway.app
```

**Cette URL sera votre `NEXT_PUBLIC_API_URL` !**
