// Script d'initialisation MongoDB pour Facturly
// Ce script est exécuté automatiquement au démarrage du conteneur MongoDB

// Création de la base de données et de l'utilisateur
db = db.getSiblingDB('facturly_db');

// Création d'un utilisateur pour l'application
db.createUser({
  user: 'facturly_user',
  pwd: 'F4ctur1y_M0ng0_P4ssw0rd_2025',
  roles: [
    {
      role: 'readWrite',
      db: 'facturly_db',
    },
  ],
});

// Création des collections avec validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'name', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        },
        password: {
          bsonType: 'string',
          minLength: 6,
        },
        name: {
          bsonType: 'string',
          minLength: 1,
        },
        role: {
          enum: ['USER', 'ADMIN'],
        },
      },
    },
  },
});

db.createCollection('clients', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'name', 'email'],
      properties: {
        userId: {
          bsonType: 'objectId',
        },
        name: {
          bsonType: 'string',
          minLength: 1,
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        },
      },
    },
  },
});

db.createCollection('invoices', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'invoiceNumber',
        'userId',
        'client',
        'amount',
        'totalAmount',
        'status',
      ],
      properties: {
        invoiceNumber: {
          bsonType: 'string',
          minLength: 1,
        },
        userId: {
          bsonType: 'objectId',
        },
        amount: {
          bsonType: 'number',
          minimum: 0,
        },
        totalAmount: {
          bsonType: 'number',
          minimum: 0,
        },
        status: {
          enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'],
        },
      },
    },
  },
});

// Création des index pour les performances
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

db.clients.createIndex({ userId: 1 });
db.clients.createIndex({ email: 1 });

db.invoices.createIndex({ invoiceNumber: 1 }, { unique: true });
db.invoices.createIndex({ userId: 1 });
db.invoices.createIndex({ status: 1 });
db.invoices.createIndex({ issueDate: -1 });
db.invoices.createIndex({ 'client._id': 1 });

print('✅ Base de données Facturly initialisée avec succès');
print('📊 Collections créées : users, clients, invoices');
print('🔐 Utilisateur facturly_user créé');
print('⚡ Index de performance créés');
