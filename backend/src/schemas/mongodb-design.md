# Conception du schéma MongoDB pour Facturly

## Stratégie de modélisation

### Approche choisie : **Embedded Documents + Références sélectives**

- **User** : Document principal avec informations vendeur embedded
- **Invoice** : Document avec client et items embedded
- **Client** : Collection séparée pour réutilisation
- **Admin entities** : Documents séparés avec références

## Schémas détaillés

### 1. User Collection

```typescript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  company: String?,
  role: "USER" | "ADMIN",
  isActive: Boolean,
  isBanned: Boolean,
  lastLogin: Date?,
  loginCount: Number,

  // Informations vendeur (embedded)
  vendorInfo: {
    address: String?,
    postalCode: String?,
    city: String?,
    country: String = "France",
    siret: String?,
    siren: String?,
    vatNumber: String?,
    nafCode: String?,
    legalForm: String?,
    capital: String?,
    registrationCity: String?,
    registrationNumber: String?
  },

  // Contact (embedded)
  contact: {
    phone: String?,
    website: String?
  },

  // Informations bancaires (embedded)
  banking: {
    bankName: String?,
    iban: String?,
    bic: String?
  },

  // Branding (embedded)
  branding: {
    logoUrl: String?,
    primaryColor: String = "#8b5cf6",
    secondaryColor: String = "#ec4899"
  },

  createdAt: Date,
  updatedAt: Date
}
```

### 2. Client Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId, // Référence vers User
  name: String,
  email: String,
  phone: String?,
  address: String?,
  city: String?,
  postalCode: String?,
  country: String?,
  siret: String?,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Invoice Collection

```typescript
{
  _id: ObjectId,
  invoiceNumber: String (unique),
  userId: ObjectId, // Référence vers User

  // Client embedded (snapshot au moment de la facture)
  client: {
    _id: ObjectId, // Référence vers Client original
    name: String,
    email: String,
    phone: String?,
    address: String?,
    city: String?,
    postalCode: String?,
    country: String?,
    siret: String?
  },

  // Informations facture
  title: String?,
  description: String?,
  amount: Number,
  taxAmount: Number,
  totalAmount: Number,
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED",

  // Items embedded
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],

  // Dates
  issueDate: Date,
  dueDate: Date,
  paidDate: Date?,

  notes: String?,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Subscription Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  packId: ObjectId,
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED",
  startDate: Date,
  endDate: Date,
  stripeId: String?,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Pack Collection

```typescript
{
  _id: ObjectId,
  name: String,
  description: String?,
  price: Number,
  currency: String = "EUR",
  duration: Number, // en jours
  features: Object, // JSON des fonctionnalités
  limits: Object, // JSON des limites
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Avantages de cette approche

### ✅ Performance

- Moins de requêtes (données embedded)
- Pas de JOIN complexes
- Index optimisés

### ✅ Simplicité

- Une requête pour récupérer une facture complète
- Pas de gestion de relations complexes
- Schema évolutif sans migration

### ✅ Cohérence

- Snapshot des données client dans la facture
- Historique préservé même si client modifié
- Intégrité des données financières

## Index recommandés

```javascript
// User
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Client
db.clients.createIndex({ userId: 1 });
db.clients.createIndex({ email: 1 });

// Invoice
db.invoices.createIndex({ invoiceNumber: 1 }, { unique: true });
db.invoices.createIndex({ userId: 1 });
db.invoices.createIndex({ status: 1 });
db.invoices.createIndex({ issueDate: -1 });
db.invoices.createIndex({ 'client._id': 1 });
```
