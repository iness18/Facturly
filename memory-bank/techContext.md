# Tech Context - Facturly

## Stack technique actuel

### Frontend

- **Framework**: Next.js 15.4.1 (App Router)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 4 + tailwindcss-animate
- **UI Components**: shadcn/ui (Radix UI + class-variance-authority)
- **Icons**: Lucide React
- **Fonts**: Inter + Outfit (Google Fonts)

### Backend

- **Framework**: NestJS 11.0.1
- **Runtime**: Node.js
- **Language**: TypeScript 5.7.3
- **ODM**: Mongoose 8.17.0
- **Database**: MongoDB 7.0
- **Testing**: Jest 29.7.0

### DevOps & Infrastructure

- **Containerization**: Docker + Docker Compose
- **Database**: MongoDB avec volumes persistants
- **Development**: Hot reload activé
- **Linting**: ESLint 9.18.0 + Prettier 3.4.2

## Configuration actuelle

### Ports

- Frontend: 3000
- Backend: 3001 (mappé depuis 3000 interne)
- Database: 27017
- Mongo Express: 8081

### Variables d'environnement

```env
MONGO_USERNAME=facturly_admin
MONGO_PASSWORD=supersecretpassword
MONGO_DATABASE=facturly_db
MONGODB_URI=mongodb://...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Dépendances clés

### Backend

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/platform-express": "^11.0.1",
  "@nestjs/mongoose": "^11.0.3",
  "mongoose": "^8.17.0",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1"
}
```

### Frontend

```json
{
  "@radix-ui/react-slot": "^1.2.3",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.525.0",
  "next": "15.4.1",
  "react": "19.1.0",
  "tailwind-merge": "^3.3.1"
}
```

## Contraintes techniques

### Performance

- Turbopack activé pour le développement
- Next.js Image optimization disponible
- Tailwind CSS pour un bundle CSS optimisé

### Compatibilité

- Node.js version moderne requise
- MongoDB 7.0+ pour les fonctionnalités avancées
- Navigateurs modernes (ES2020+)

## Outils de développement

### Code Quality

- ESLint avec configuration moderne
- Prettier pour le formatage
- TypeScript strict mode
- Jest pour les tests

### Development Experience

- Hot reload frontend et backend
- Docker pour l'environnement isolé
- Volumes pour la persistance des données
- Health checks pour la base de données

## Patterns de configuration

### Tailwind CSS

- Configuration étendue avec variables CSS
- Polices personnalisées via CSS variables
- Animations personnalisées
- Mode sombre supporté

### Next.js

- App Router (nouvelle architecture)
- Turbopack pour les performances
- Configuration TypeScript stricte
- Support des polices Google optimisé

### NestJS

- Architecture modulaire
- Dependency injection
- Décorateurs TypeScript
- Configuration ESLint moderne
- Mongoose ODM intégré

## Améliorations techniques recommandées

### Sécurité

- Variables d'environnement sécurisées
- Validation des entrées
- CORS configuration
- Rate limiting

### Performance

- Cache Redis
- Optimisation des requêtes MongoDB
- Compression des assets
- CDN pour les ressources statiques

### Monitoring

- Logging structuré
- Health checks applicatifs
- Métriques de performance
- Error tracking (Sentry)

### Testing

- Tests unitaires complets
- Tests d'intégration
- Tests E2E avec Playwright
- Coverage reporting
