# System Patterns - Facturly

## Architecture générale

```
Frontend (Next.js) ←→ Backend (NestJS) ←→ Database (MongoDB)
```

## Patterns architecturaux

### Backend (NestJS)

- **Modular Architecture**: Séparation par domaines métier
- **Schema Pattern**: Définition des modèles via Mongoose
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
├── database/               # Module MongoDB
├── schemas/               # Schémas Mongoose
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

```typescript
// User Schema
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  company?: string;

  @Prop({ type: Object })
  vendorInfo: VendorInfo;

  @Prop({ type: Object })
  contact: ContactInfo;
}

// Client Schema (Embedded in Invoice)
export class ClientInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  address?: string;
}

// Invoice Schema
@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true, unique: true })
  invoiceNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: ClientInfo })
  client: ClientInfo;

  @Prop({ required: true })
  amount: number;

  @Prop({ enum: InvoiceStatus })
  status: InvoiceStatus;

  @Prop([InvoiceItem])
  items: InvoiceItem[];
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
- **MongoDB**: Index et cache intégré
- **Static generation**: Pages statiques

### Optimisation

- **Lazy loading**: Chargement à la demande
- **Code splitting**: Bundles optimisés
- **Image optimization**: Next.js Image component
