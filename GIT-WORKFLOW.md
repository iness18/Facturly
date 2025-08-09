# 🌿 Workflow Git - Facturly

## 📋 Structure des branches

```
main (production)     ←── Déploiement automatique Netlify + Heroku
  ↑
develop (développement) ←── Branche de développement principal
  ↑
feature/* (fonctionnalités) ←── Branches pour nouvelles fonctionnalités
```

## 🎯 Rôles des branches

### `main` - Production

- **Objectif** : Code stable prêt pour la production
- **Déploiement** : Automatique sur Netlify (frontend) + Heroku (backend)
- **Protection** : Seules les Pull Requests depuis `develop` sont autorisées
- **Tests** : Tous les tests doivent passer avant merge

### `develop` - Développement

- **Objectif** : Intégration des nouvelles fonctionnalités
- **Environnement** : Développement local avec Docker
- **Base** : Pour créer les branches `feature/*`
- **Merge** : Depuis les branches `feature/*`

### `feature/*` - Fonctionnalités

- **Objectif** : Développement de nouvelles fonctionnalités
- **Naming** : `feature/nom-de-la-fonctionnalite`
- **Base** : Créées depuis `develop`
- **Merge** : Vers `develop` via Pull Request

## 🚀 Workflow de développement

### 1. Développement d'une nouvelle fonctionnalité

```bash
# 1. Se positionner sur develop
git checkout develop
git pull origin develop

# 2. Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# 3. Développer la fonctionnalité
# ... modifications du code ...

# 4. Commiter les changements
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"

# 5. Pousser la branche
git push origin feature/nouvelle-fonctionnalite

# 6. Créer une Pull Request vers develop
# Via l'interface GitHub/GitLab
```

### 2. Intégration dans develop

```bash
# 1. Après validation de la PR, merger dans develop
git checkout develop
git pull origin develop

# 2. Supprimer la branche feature (optionnel)
git branch -d feature/nouvelle-fonctionnalite
git push origin --delete feature/nouvelle-fonctionnalite
```

### 3. Déploiement en production

```bash
# 1. Quand develop est stable, créer une PR vers main
git checkout develop
git pull origin develop

# 2. Créer une Pull Request develop → main
# Via l'interface GitHub/GitLab

# 3. Après validation et tests, merger dans main
# Le déploiement se fait automatiquement
```

## 🛠️ Configuration de développement local

### Première installation

```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/facturly.git
cd facturly

# 2. Se positionner sur la branche develop
git checkout develop

# 3. Installer les dépendances
npm install

# 4. Copier les variables d'environnement
cp .env.development .env

# 5. Démarrer l'environnement Docker
npm run docker:up

# 6. Démarrer le développement
npm run dev
```

### Développement quotidien

```bash
# Démarrer l'environnement de développement
npm run docker:up
npm run dev

# Arrêter l'environnement
npm run docker:down
```

## 📝 Conventions de commit

### Format des messages

```
type(scope): description

[body optionnel]

[footer optionnel]
```

### Types de commit

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, point-virgules manquants, etc.
- `refactor`: Refactoring du code
- `test`: Ajout ou modification de tests
- `chore`: Maintenance, dépendances, etc.

### Exemples

```bash
git commit -m "feat(auth): ajouter authentification JWT"
git commit -m "fix(invoice): corriger calcul de la TVA"
git commit -m "docs: mettre à jour le README"
git commit -m "style(frontend): formater les composants React"
git commit -m "refactor(backend): optimiser les requêtes MongoDB"
git commit -m "test(auth): ajouter tests unitaires"
git commit -m "chore: mettre à jour les dépendances"
```

## 🔄 Synchronisation des branches

### Mettre à jour develop depuis main

```bash
git checkout develop
git pull origin main
git push origin develop
```

### Mettre à jour une feature depuis develop

```bash
git checkout feature/ma-fonctionnalite
git pull origin develop
# Résoudre les conflits si nécessaire
git push origin feature/ma-fonctionnalite
```

## 🧪 Tests avant merge

### Tests locaux

```bash
# Tests backend
cd backend && npm test

# Tests frontend
cd frontend && npm test

# Build complet
npm run build

# Tests de production
node scripts/test-production.js
```

### Tests automatiques (CI/CD)

Les tests suivants sont exécutés automatiquement :

- ✅ Tests unitaires backend
- ✅ Tests unitaires frontend
- ✅ Build frontend et backend
- ✅ Linting et formatage
- ✅ Tests de sécurité

## 🚨 Règles importantes

### Protection de la branche main

- ❌ **Pas de push direct** sur `main`
- ✅ **Uniquement via Pull Request** depuis `develop`
- ✅ **Review obligatoire** avant merge
- ✅ **Tests passants** requis

### Bonnes pratiques

1. **Toujours partir de develop** pour créer une feature
2. **Commits atomiques** : une fonctionnalité = un commit
3. **Messages descriptifs** : expliquer le "pourquoi"
4. **Tests avant push** : vérifier que tout fonctionne
5. **Pull Requests courtes** : plus faciles à reviewer

## 🔧 Commandes utiles

### Gestion des branches

```bash
# Lister toutes les branches
git branch -a

# Supprimer une branche locale
git branch -d nom-branche

# Supprimer une branche distante
git push origin --delete nom-branche

# Renommer une branche
git branch -m ancien-nom nouveau-nom
```

### Résolution de conflits

```bash
# En cas de conflit lors d'un merge
git status
# Éditer les fichiers en conflit
git add .
git commit -m "resolve: conflits résolus"
```

### Annulation de changements

```bash
# Annuler le dernier commit (garder les changements)
git reset --soft HEAD~1

# Annuler les changements non commitées
git checkout -- .

# Revenir à un commit spécifique
git reset --hard <commit-hash>
```

## 📊 Exemple de workflow complet

```bash
# 1. Nouvelle fonctionnalité "gestion des clients"
git checkout develop
git pull origin develop
git checkout -b feature/gestion-clients

# 2. Développement
# ... code ...
git add .
git commit -m "feat(clients): ajouter CRUD clients"

# 3. Tests locaux
npm run test
npm run build

# 4. Push et PR
git push origin feature/gestion-clients
# Créer PR feature/gestion-clients → develop

# 5. Après validation, merger dans develop
git checkout develop
git pull origin develop

# 6. Quand prêt pour production
# Créer PR develop → main
# Après merge, déploiement automatique !
```

## 🎯 Résumé

- **`main`** = Production (déploiement automatique)
- **`develop`** = Développement (environnement local)
- **`feature/*`** = Nouvelles fonctionnalités
- **Pull Requests** obligatoires pour `main`
- **Tests** avant chaque merge
- **Déploiement automatique** sur merge dans `main`

---

**🌿 Bon développement avec Git !**
