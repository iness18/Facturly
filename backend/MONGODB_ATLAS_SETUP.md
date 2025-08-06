# Configuration MongoDB Atlas pour Production

## 🌐 Étapes de Configuration MongoDB Atlas

### 1. Création du Cluster MongoDB Atlas

1. **Créer un compte MongoDB Atlas** : https://cloud.mongodb.com/
2. **Créer un nouveau projet** : "Facturly Production"
3. **Créer un cluster** :
   - **Nom** : `facturly-production`
   - **Provider** : AWS (recommandé)
   - **Région** : Europe (Frankfurt) - `eu-central-1`
   - **Tier** : M0 (gratuit) pour commencer, M10+ pour production
   - **Version MongoDB** : 7.0 (dernière stable)

### 2. Configuration de Sécurité

#### A. Utilisateur de Base de Données

```bash
# Créer un utilisateur avec les privilèges appropriés
Username: facturly_prod_user
Password: [Générer un mot de passe sécurisé]
Roles: readWrite sur la base de données facturly_prod
```

#### B. Accès Réseau (IP Whitelist)

```bash
# Pour le développement (temporaire)
0.0.0.0/0  # Accès depuis n'importe où (à restreindre en production)

# Pour la production (recommandé)
[IP_DU_SERVEUR_PRODUCTION]/32  # IP spécifique du serveur
```

### 3. Variables d'Environnement Production

#### `.env.production`

```env
# MongoDB Atlas Production
MONGODB_URI="mongodb+srv://facturly_prod_user:YOUR_PASSWORD@facturly-production.xxxxx.mongodb.net/facturly_prod?retryWrites=true&w=majority"

# Sécurité Production
NODE_ENV=production
JWT_SECRET=YOUR_SUPER_SECURE_JWT_SECRET_FOR_PRODUCTION

# URLs Production
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Port
PORT=3001
```

#### `.env.staging`

```env
# MongoDB Atlas Staging
MONGODB_URI="mongodb+srv://facturly_staging_user:YOUR_PASSWORD@facturly-staging.xxxxx.mongodb.net/facturly_staging?retryWrites=true&w=majority"

# Sécurité Staging
NODE_ENV=staging
JWT_SECRET=YOUR_STAGING_JWT_SECRET

# URLs Staging
FRONTEND_URL=https://staging.your-domain.com
NEXT_PUBLIC_API_URL=https://api-staging.your-domain.com

# Port
PORT=3001
```

### 4. Configuration du Code pour Production

#### A. Module MongoDB Adaptatif

Le module MongoDB est déjà configuré pour utiliser les variables d'environnement :

```typescript
// backend/src/database/mongodb.module.ts
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'), // ✅ Utilise la variable d'environnement
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }),
  inject: [ConfigService],
});
```

#### B. Options de Production Recommandées

```typescript
// Configuration optimisée pour la production
{
  uri: configService.get<string>('MONGODB_URI'),
  maxPoolSize: 20,                    // Plus de connexions pour la production
  serverSelectionTimeoutMS: 10000,    // Timeout plus long
  socketTimeoutMS: 60000,             // Timeout socket plus long
  connectTimeoutMS: 10000,            // Timeout de connexion
  retryWrites: true,                  // Retry automatique des écritures
  w: 'majority',                      // Write concern pour la cohérence
  readPreference: 'primary',          // Lecture depuis le primary
  bufferMaxEntries: 0,                // Pas de buffer en production
  bufferCommands: false,              // Pas de buffer des commandes
}
```

### 5. Scripts de Déploiement

#### A. Script de Migration Production

```bash
#!/bin/bash
# scripts/deploy-production.sh

echo "🚀 Déploiement Production Facturly"

# 1. Vérifier les variables d'environnement
if [ -z "$MONGODB_URI" ]; then
  echo "❌ MONGODB_URI non définie"
  exit 1
fi

# 2. Build de l'application
npm run build

# 3. Test de connexion MongoDB
npm run test:mongodb:connection

# 4. Démarrage de l'application
npm run start:prod
```

#### B. Script de Test de Connexion

```typescript
// scripts/test-mongodb-connection.ts
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

async function testConnection() {
  try {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URI!),
      ],
    }).compile();

    console.log('✅ Connexion MongoDB Atlas réussie');
    await module.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB Atlas:', error.message);
    process.exit(1);
  }
}

testConnection();
```

### 6. Monitoring et Alertes

#### A. Métriques à Surveiller

- **Connexions actives** : < 80% du pool
- **Temps de réponse** : < 100ms en moyenne
- **Erreurs de connexion** : < 1%
- **Utilisation CPU** : < 70%
- **Utilisation RAM** : < 80%
- **Stockage** : < 80% de la capacité

#### B. Alertes MongoDB Atlas

1. **Connexions** : Alerte si > 15 connexions simultanées
2. **Performance** : Alerte si latence > 200ms
3. **Erreurs** : Alerte pour toute erreur de connexion
4. **Stockage** : Alerte si > 75% utilisé

### 7. Backup et Restauration

#### A. Backup Automatique

MongoDB Atlas fournit des backups automatiques :

- **Fréquence** : Toutes les 6 heures
- **Rétention** : 7 jours (M0), 2 jours à 5 ans (clusters payants)
- **Point-in-time recovery** : Disponible sur M10+

#### B. Export Manuel

```bash
# Export de la base de données
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/facturly_prod"

# Import vers un autre environnement
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/facturly_staging" dump/
```

### 8. Sécurité Production

#### A. Checklist Sécurité

- [ ] Utilisateur dédié avec privilèges minimaux
- [ ] Mot de passe fort (32+ caractères)
- [ ] IP Whitelist restrictive
- [ ] Chiffrement en transit (TLS 1.2+)
- [ ] Chiffrement au repos activé
- [ ] Audit logs activés (M10+)
- [ ] Network peering configuré (si applicable)

#### B. Rotation des Mots de Passe

```bash
# Planifier la rotation tous les 90 jours
# 1. Créer un nouvel utilisateur
# 2. Mettre à jour MONGODB_URI
# 3. Redéployer l'application
# 4. Supprimer l'ancien utilisateur
```

### 9. Performance et Optimisation

#### A. Index Recommandés

```javascript
// Index déjà créés dans les schémas Mongoose
db.users.createIndex({ email: 1 }, { unique: true });
db.clients.createIndex({ userId: 1, email: 1 });
db.invoices.createIndex({ userId: 1, invoiceNumber: 1 }, { unique: true });
db.invoices.createIndex({ userId: 1, status: 1 });
db.invoices.createIndex({ userId: 1, dueDate: 1 });
```

#### B. Requêtes Optimisées

- Utiliser les projections pour limiter les données
- Implémenter la pagination pour les grandes collections
- Utiliser les aggregations pour les statistiques complexes

### 10. Migration depuis le Développement

#### A. Export des Données de Développement

```bash
# Export depuis MongoDB local
mongodump --uri="mongodb://facturly_user:password@localhost:27017/facturly_db"
```

#### B. Import vers Atlas

```bash
# Import vers MongoDB Atlas
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/facturly_prod" dump/facturly_db/
```

## 🔧 Commandes Utiles

```bash
# Test de connexion
npm run test:mongodb:atlas

# Migration des données
npm run migrate:to:atlas

# Backup manuel
npm run backup:mongodb

# Monitoring des performances
npm run monitor:mongodb
```

## 📞 Support

- **Documentation MongoDB Atlas** : https://docs.atlas.mongodb.com/
- **Support MongoDB** : https://support.mongodb.com/
- **Community Forum** : https://community.mongodb.com/
