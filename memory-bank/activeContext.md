# Active Context - Facturly

## État actuel du projet (19 janvier 2025)

### Ce qui fonctionne

- ✅ Structure de base frontend/backend configurée
- ✅ Docker Compose opérationnel
- ✅ Interface landing page moderne et attractive
- ✅ Base de données PostgreSQL configurée
- ✅ Schéma Prisma de base défini
- ✅ Composants UI shadcn/ui intégrés

### Problèmes critiques identifiés

- 🚨 **Backend non fonctionnel**: Prisma non intégré dans NestJS
- 🚨 **Pas de CORS**: Frontend ne peut pas communiquer avec backend
- 🚨 **Animations CSS manquantes**: Classes utilisées mais non définies
- 🚨 **Sécurité**: Mots de passe en dur dans .env
- 🚨 **Validation manquante**: Aucune validation des données
- ✅ **Erreurs ESLint corrigées**: Apostrophes non échappées dans les composants React

### Focus actuel

Le projet est en phase de **setup initial** avec une belle interface mais un backend non fonctionnel. La priorité est de créer un MVP fonctionnel.

## Décisions techniques récentes

### Architecture choisie

- **Monorepo** avec frontend et backend séparés
- **API REST** plutôt que GraphQL pour la simplicité
- **PostgreSQL** pour la robustesse des données financières
- **Docker** pour la reproductibilité de l'environnement

### Patterns adoptés

- **Component-based** avec shadcn/ui pour la cohérence
- **Modular architecture** NestJS pour la scalabilité
- **Type-safe** avec TypeScript partout
- **Mobile-first** design avec Tailwind CSS

## Prochaines étapes prioritaires

### Immédiat (cette semaine)

1. **Intégrer Prisma dans NestJS**

   - Créer le service Prisma
   - Configurer le module database
   - Tester la connexion

2. **Configurer CORS**

   - Permettre les requêtes depuis le frontend
   - Sécuriser les origines autorisées

3. **Créer l'API Invoice**
   - CRUD complet pour les factures
   - DTOs avec validation
   - Tests de base

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

## Configuration de développement

### Commandes utiles

```bash
# Démarrer l'environnement complet
docker-compose up -d

# Logs du backend
docker-compose logs -f backend

# Accès à la base de données
docker-compose exec db psql -U facturly_user -d facturly_db

# Migrations Prisma
cd backend && npx prisma migrate dev

# Génération du client Prisma
cd backend && npx prisma generate
```

### URLs importantes

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Base de données: localhost:5432

## Notes importantes

- Le projet utilise les **dernières versions** de Next.js et React
- **Turbopack** est activé pour de meilleures performances de développement
- La base de données utilise des **volumes persistants**
- Les **health checks** sont configurés pour PostgreSQL
