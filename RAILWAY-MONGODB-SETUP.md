# Railway MongoDB - Configuration Complète

## 🎯 Plan Final : Railway Backend + MongoDB

**Architecture** :

- 🌐 **Frontend** : Netlify (gratuit)
- 🚀 **Backend** : Railway (gratuit)
- 🗄️ **Base de données** : Railway MongoDB (gratuit)

## 📋 Étapes de Configuration

### Étape 1 : Ajouter MongoDB à Railway

1. **Retournez dans Railway** (votre projet backend)
2. **Cliquez sur** "Add Service" ou "+"
3. **Sélectionnez** "Database"
4. **Choisissez** "MongoDB"
5. **Railway va automatiquement** :
   - Créer une instance MongoDB
   - Générer l'URI de connexion
   - L'ajouter à vos variables d'environnement

### Étape 2 : Variables Automatiques

Railway va créer automatiquement ces variables :

```
MONGO_URL=mongodb://mongo:27017/railway
MONGODB_URL=mongodb://mongo:27017/railway
DATABASE_URL=mongodb://mongo:27017/railway
```

### Étape 3 : Mettre à Jour Vos Variables

**Modifiez ces variables dans Railway** :

```
MONGODB_URI=mongodb://mongo:27017/facturly_db
MONGO_DATABASE=facturly_db
MONGO_USERNAME=admin
MONGO_PASSWORD=FacturlySecure2024!
```

### Étape 4 : Vérifier la Configuration

Votre backend NestJS va automatiquement se connecter à MongoDB Railway avec l'URI fournie.

## 🆓 Limites du Plan Gratuit Railway

- **500 heures d'exécution/mois** (largement suffisant)
- **1 GB de RAM** par service
- **1 GB de stockage** pour MongoDB
- **100 GB de bande passante**

## ✅ Avantages de Cette Solution

- ✅ **100% gratuit** pour commencer
- ✅ **Pas de configuration complexe**
- ✅ **Intégration automatique** backend ↔ base
- ✅ **Même région** = performance optimale
- ✅ **Variables d'environnement automatiques**
- ✅ **Pas de refactoring** de code nécessaire

## 🚀 Actions Immédiates

1. **Allez dans Railway**
2. **Ajoutez le service MongoDB**
3. **Configurez les variables**
4. **Redéployez le backend**
5. **Testez la connexion**

Cette solution est parfaite : simple, gratuite, et vous gardez votre architecture actuelle !
