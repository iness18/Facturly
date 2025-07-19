# System Patterns - Facturly

## Architecture générale

```
Frontend (Next.js) ←→ Backend (NestJS) ←→ Database (PostgreSQL)
```

## Patterns architecturaux

### Backend (NestJS)

- **Modular Architecture**: Séparation par domaines métier
- **Repository Pattern**: Abstraction de l'accès aux données via Prisma
- **DTO Pattern**: Validation et transformation des données
- **Dependency Injection**: Gestion des dépendances via NestJS

### Frontend (Next.js)

- **Component-Based Architecture**: Composants réutilisables
- **Atomic Design**: Organisation des composants (atoms, molecules, organisms)
- **Server-Side Rendering**: Performance et SEO optimisés
- **Static Generation**: Pages statiques quand possible

## Structure des modules

### Backend

```
src/
├── app.module.ts           # Module racine
├── common/                 # Utilitaires partagés
├── config/                 # Configuration
├── database/               # Service Prisma
├── invoices/              # Module factures
├── clients/               # Module clients
├── auth/                  # Module authentification
└── users/                 # Module utilisateurs
```

### Frontend

```
src/
├── app/                   # Pages Next.js 13+
├── components/
│   ├── ui/               # Composants de base (shadcn/ui)
│   ├── forms/            # Formulaires
│   ├── sections/         # Sections de pages
│   └── layout/           # Composants de layout
├── lib/                  # Utilitaires
├── hooks/                # Hooks personnalisés
└── types/                # Types TypeScript
```

## Patterns de données

### Modèle de données principal

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  company   String?
  invoices  Invoice[]
  clients   Client[]
}

model Client {
  id        String    @id @default(cuid())
  name      String
  email     String
  address   String?
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  invoices  Invoice[]
}

model Invoice {
  id            String    @id @default(cuid())
  number        String    @unique
  clientId      String
  client        Client    @relation(fields: [clientId], references: [id])
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  amount        Float
  status        InvoiceStatus
  dueDate       DateTime
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  items         InvoiceItem[]
}
```

## Patterns de communication

### API REST

- **RESTful endpoints**: Conventions standard
- **HTTP status codes**: Utilisation appropriée
- **Error handling**: Réponses d'erreur structurées
- **Pagination**: Pour les listes importantes

### State Management

- **React Query**: Cache et synchronisation des données
- **React Hook Form**: Gestion des formulaires
- **Context API**: État global léger

## Patterns de sécurité

### Authentification

- **JWT tokens**: Stateless authentication
- **Refresh tokens**: Sécurité renforcée
- **Role-based access**: Contrôle des permissions

### Validation

- **Input validation**: class-validator côté backend
- **Schema validation**: Zod côté frontend
- **Sanitization**: Nettoyage des données

## Patterns de performance

### Caching

- **Redis**: Cache applicatif
- **React Query**: Cache côté client
- **Static generation**: Pages statiques

### Optimisation

- **Lazy loading**: Chargement à la demande
- **Code splitting**: Bundles optimisés
- **Image optimization**: Next.js Image component
