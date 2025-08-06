import { config } from 'dotenv';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserSchema } from '../schemas/user.schema';
import { ClientSchema } from '../schemas/client.schema';
import { InvoiceSchema } from '../schemas/invoice.schema';

// Charger les variables d'environnement
config();

async function createTestData() {
  try {
    console.log('🚀 Création de données de test MongoDB...');

    // Connexion à MongoDB
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connexion MongoDB établie');

    // Nettoyage des collections
    console.log('🧹 Nettoyage des collections...');
    const UserModel = mongoose.model('User', UserSchema);
    const ClientModel = mongoose.model('Client', ClientSchema);
    const InvoiceModel = mongoose.model('Invoice', InvoiceSchema);

    await UserModel.deleteMany({});
    await ClientModel.deleteMany({});
    await InvoiceModel.deleteMany({});
    console.log('✅ Collections nettoyées');

    // Création des utilisateurs de test
    console.log('\n👥 Création des utilisateurs de test...');
    const hashedPassword = await bcrypt.hash('Admin123!', 12);

    const adminUser = new UserModel({
      email: 'admin@facturly.com',
      password: hashedPassword,
      name: 'Administrateur Facturly',
      company: 'Facturly SAS',
      role: 'ADMIN',
      isActive: true,
    });
    await adminUser.save();
    console.log('✅ Utilisateur admin créé:', adminUser.email);

    const testUser = new UserModel({
      email: 'user@test.com',
      password: await bcrypt.hash('Test123!', 12),
      name: 'Utilisateur Test',
      company: 'Test Company',
      role: 'USER',
      isActive: true,
    });
    await testUser.save();
    console.log('✅ Utilisateur test créé:', testUser.email);

    // Création des clients de test
    console.log('\n🏢 Création des clients de test...');
    const clients = [
      {
        userId: adminUser._id,
        name: 'Entreprise Alpha',
        email: 'contact@alpha.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        siret: '12345678901234',
      },
      {
        userId: adminUser._id,
        name: 'Société Beta',
        email: 'info@beta.fr',
        phone: '+33 2 34 56 78 90',
        address: '456 Avenue des Champs',
        city: 'Lyon',
        postalCode: '69000',
        country: 'France',
        siret: '23456789012345',
      },
      {
        userId: testUser._id,
        name: 'Client Gamma',
        email: 'hello@gamma.com',
        phone: '+33 3 45 67 89 01',
        address: '789 Boulevard du Test',
        city: 'Marseille',
        postalCode: '13000',
        country: 'France',
      },
    ];

    const createdClients: any[] = [];
    for (const clientData of clients) {
      const client = new ClientModel(clientData);
      await client.save();
      createdClients.push(client);
      console.log('✅ Client créé:', client.name);
    }

    // Création des factures de test
    console.log('\n📄 Création des factures de test...');
    const invoices = [
      {
        userId: adminUser._id,
        client: {
          _id: createdClients[0]._id,
          name: createdClients[0].name,
          email: createdClients[0].email,
          phone: createdClients[0].phone,
          address: createdClients[0].address,
          city: createdClients[0].city,
          postalCode: createdClients[0].postalCode,
          country: createdClients[0].country,
          siret: createdClients[0].siret,
        },
        title: 'Développement site web',
        description: "Création d'un site web responsive",
        amount: 2500.0,
        taxAmount: 500.0,
        totalAmount: 3000.0,
        status: 'PAID',
        dueDate: new Date('2025-01-15'),
        paidDate: new Date('2025-01-10'),
        items: [
          {
            description: 'Développement frontend',
            quantity: 1,
            unitPrice: 1500.0,
            totalPrice: 1500.0,
          },
          {
            description: 'Développement backend',
            quantity: 1,
            unitPrice: 1000.0,
            totalPrice: 1000.0,
          },
        ],
        notes: 'Merci pour votre confiance !',
      },
      {
        userId: adminUser._id,
        client: {
          _id: createdClients[1]._id,
          name: createdClients[1].name,
          email: createdClients[1].email,
          phone: createdClients[1].phone,
          address: createdClients[1].address,
          city: createdClients[1].city,
          postalCode: createdClients[1].postalCode,
          country: createdClients[1].country,
          siret: createdClients[1].siret,
        },
        title: 'Consultation SEO',
        description: 'Audit et optimisation SEO',
        amount: 800.0,
        taxAmount: 160.0,
        totalAmount: 960.0,
        status: 'SENT',
        dueDate: new Date('2025-02-15'),
        items: [
          {
            description: 'Audit SEO complet',
            quantity: 1,
            unitPrice: 500.0,
            totalPrice: 500.0,
          },
          {
            description: 'Optimisation technique',
            quantity: 1,
            unitPrice: 300.0,
            totalPrice: 300.0,
          },
        ],
      },
      {
        userId: testUser._id,
        client: {
          _id: createdClients[2]._id,
          name: createdClients[2].name,
          email: createdClients[2].email,
          phone: createdClients[2].phone,
          address: createdClients[2].address,
          city: createdClients[2].city,
          postalCode: createdClients[2].postalCode,
          country: createdClients[2].country,
        },
        title: 'Formation React',
        description: 'Formation développement React',
        amount: 1200.0,
        taxAmount: 240.0,
        totalAmount: 1440.0,
        status: 'DRAFT',
        dueDate: new Date('2025-03-01'),
        items: [
          {
            description: 'Formation React - 2 jours',
            quantity: 2,
            unitPrice: 600.0,
            totalPrice: 1200.0,
          },
        ],
      },
    ];

    for (const invoiceData of invoices) {
      const invoice = new InvoiceModel(invoiceData);
      await invoice.save();
      console.log(
        '✅ Facture créée:',
        invoice.invoiceNumber,
        '-',
        invoice.title,
      );
    }

    console.log('\n🎉 Données de test créées avec succès !');
    console.log(`📊 Résumé:`);
    console.log(`   - ${await UserModel.countDocuments()} utilisateurs`);
    console.log(`   - ${await ClientModel.countDocuments()} clients`);
    console.log(`   - ${await InvoiceModel.countDocuments()} factures`);
  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
  } finally {
    console.log('🔌 Fermeture de la connexion...');
    await mongoose.disconnect();
  }
}

// Exécution du script
createTestData();
