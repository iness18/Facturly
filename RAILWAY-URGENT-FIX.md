# Railway Build Failed - Fix Urgent

## 🚨 Problème Persistant

Railway continue d'essayer d'exécuter les scripts du projet racine au lieu du backend uniquement. Je vois dans les logs :

```
> npm run setup:backend && npm run setup:frontend
```

## 🎯 Solution Immédiate

### Option 1 : Changer le Root Directory (URGENT)

**Dans Railway** :

1. **Cliquez sur** "Settings" (onglet à côté de Variables)
2. **Trouvez** "Source" ou "Build Settings"
3. **Cherchez** "Root Directory" ou "Working Directory"
4. **Changez** de `/` vers `/backend`
5. **Sauvegardez** et redéployez

### Option 2 : Supprimer les Scripts Problématiques

Si l'option 1 ne fonctionne pas, nous devons modifier le `package.json` racine :

**Supprimez temporairement** ces scripts du `package.json` racine :

- `setup:backend`
- `setup:frontend`
- `setup`

### Option 3 : Forcer Railway à Utiliser le Backend

**Ajoutez ces variables dans Railway** :

**NIXPACKS_BUILD_CMD**

```
cd backend && npm install && npm run build
```

**NIXPACKS_START_CMD**

```
cd backend && npm run start:prod
```

## 🚀 Action Immédiate Recommandée

**Essayez l'Option 1 en premier** - c'est la solution la plus propre.

Si vous ne trouvez pas "Root Directory" dans Settings, essayez l'Option 3 avec les variables NIXPACKS.

## 📍 Où Trouver Root Directory

Dans Railway Settings, cherchez :

- "Source Settings"
- "Build Configuration"
- "Repository Settings"
- "Root Directory"
- "Working Directory"

Cette option devrait être disponible dans la section Source/Build de votre service.
