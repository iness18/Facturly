# Active Context - Facturly

## État actuel du projet (19 janvier 2025)

### Ce qui fonctionne

- ✅ Structure de base frontend/backend configurée
- ✅ Docker Compose opérationnel
- ✅ Interface landing page moderne et attractive
- ✅ Base de données MongoDB configurée
- ✅ Schémas Mongoose définis
- ✅ Composants UI shadcn/ui intégrés
- ✅ Migration PostgreSQL → MongoDB complétée

### Problèmes critiques identifiés

- ✅ **Backend fonctionnel**: MongoDB intégré avec Mongoose
- ✅ **CORS configuré**: Frontend communique avec backend
- 🚨 **Animations CSS manquantes**: Classes utilisées mais non définies
- 🚨 **Sécurité**: Mots de passe en dur dans .env
- ✅ **Validation implémentée**: DTOs avec class-validator
- ✅ **Erreurs ESLint corrigées**: Apostrophes non échappées dans les composants React
- ✅ **Conflits serveurs Next.js résolus**: Multiples instances causaient des erreurs ENOENT

### Focus actuel

Le projet est en phase de **développement actif** avec une architecture MongoDB fonctionnelle. La priorité est d'enrichir les fonctionnalités et optimiser l'expérience utilisateur.

## Décisions techniques récentes

### Architecture choisie

- **Monorepo** avec frontend et backend séparés
- **API REST** plutôt que GraphQL pour la simplicité
- **MongoDB** pour la flexibilité des données et performance
- **Docker** pour la reproductibilité de l'environnement

### Patterns adoptés

- **Component-based** avec shadcn/ui pour la cohérence
- **Modular architecture** NestJS pour la scalabilité
- **Type-safe** avec TypeScript partout
- **Mobile-first** design avec Tailwind CSS

## Prochaines étapes prioritaires

### Immédiat (cette semaine)

1. ✅ **MongoDB intégré dans NestJS**

   - Service MongoDB configuré
   - Module database opérationnel
   - Connexion testée et fonctionnelle

2. ✅ **CORS configuré**

   - Requêtes frontend autorisées
   - Origines sécurisées

3. ✅ **API complètes créées**
   - CRUD complet pour users, clients, factures
   - DTOs avec validation
   - Services MongoDB fonctionnels

### Court terme (2 semaines)

1. **Interface de gestion des factures**

   - Dashboard avec liste des factures
   - Formulaire de création
   - Détail d'une facture

2. **Gestion des clients**
   - CRUD clients
   - Association avec les factures

### Moyen terme (1 mois)

1. **Authentification**

   - JWT avec NestJS
   - Protection des routes
   - Gestion des sessions

2. **Génération PDF**
   - Templates de factures
   - Export PDF
   - Envoi par email

## Insights et apprentissages

### Ce qui marche bien

- **shadcn/ui** offre une excellente base de composants
- **Tailwind CSS** permet un développement rapide
- **Docker Compose** simplifie l'environnement de développement
- **TypeScript** évite de nombreuses erreurs

### Défis rencontrés

- **Intégration Prisma/NestJS** plus complexe que prévu
- **Configuration CORS** nécessaire pour le développement
- **Animations CSS** nécessitent une configuration spécifique

### Bonnes pratiques établies

- **Validation stricte** des données d'entrée
- **Séparation claire** des responsabilités
- **Documentation** systématique des décisions
- **Tests** dès le début du développement

## Résolution des problèmes

### Conflits serveurs Next.js (Résolu - 22 juillet 2025)

**Problème**: Multiples instances de `npm run dev` causaient des erreurs ENOENT en boucle et des conflits de ports.

**Symptômes**:

- Erreurs répétitives `ENOENT: no such file or directory`
- Fichiers de manifeste Next.js introuvables
- Multiples processus Node.js en cours d'exécution
- Ports 3000, 3002, 3003 utilisés simultanément

**Solution appliquée**:

1. **Arrêt de tous les processus Node.js**:

   ```bash
   powershell "Get-Process node | Stop-Process -Force"
   ```

2. **Nettoyage du cache Next.js**:

   ```bash
   cd frontend && rm -rf .next
   ```

3. **Redémarrage propre**:
   ```bash
   npm run dev
   ```

**Prévention**:

- Ne jamais lancer plusieurs instances de `npm run dev` simultanément
- Toujours vérifier les processus actifs avant de démarrer : `tasklist | findstr node`
- En cas de problème, nettoyer le cache `.next` avant de redémarrer

## Configuration de développement

### Commandes utiles

```bash
# Démarrer l'environnement complet
docker-compose up -d

# Logs du backend
docker-compose logs -f backend

# Accès à la base de données MongoDB
docker exec -it facturly_mongodb mongosh --username facturly_user --password F4ctur1y_M0ng0_P4ssw0rd_2025 --authenticationDatabase facturly_db facturly_db

# Tests MongoDB
cd backend && npm run mongodb:test

# Migration des données (si nécessaire)
cd backend && npm run mongodb:migrate
```

### URLs importantes

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Base de données MongoDB: localhost:27017
- Mongo Express: http://localhost:8081

## Notes importantes

- Le projet utilise les **dernières versions** de Next.js et React
- **Turbopack** est activé pour de meilleures performances de développement
- La base de données utilise des **volumes persistants**
- Les **health checks** sont configurés pour PostgreSQL

## Connexion à la base de données MongoDB

### Paramètres de connexion corrects

Pour se connecter à MongoDB depuis un client externe (MongoDB Compass, Studio 3T, etc.) :

```
URI: mongodb://facturly_user:F4ctur1y_M0ng0_P4ssw0rd_2025@localhost:27017/facturly_db?authSource=facturly_db
Host: localhost
Port: 27017
Database: facturly_db
Username: facturly_user
Password: F4ctur1y_M0ng0_P4ssw0rd_2025
```

### Erreurs courantes à éviter

- ❌ Ne pas oublier l'authSource dans l'URI
- ❌ Ne pas utiliser l'IP interne Docker (172.19.0.x)
- ✅ Utiliser `facturly_user` comme username
- ✅ Utiliser `localhost` comme host

### Mongo Express intégré

Accessible sur http://localhost:8081 :

- Username: admin
- Password: admin123
