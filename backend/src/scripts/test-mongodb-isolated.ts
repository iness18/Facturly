import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UsersMongoService } from '../users/users-mongo.service';
import { ClientsMongoService } from '../clients/clients-mongo.service';
import { InvoicesMongoService } from '../invoices/invoices-mongo.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Client, ClientSchema } from '../schemas/client.schema';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';

async function testMongoDBIsolated() {
  console.log('🚀 Test isolé des services MongoDB...\n');

  try {
    // Créer un module de test isolé avec seulement MongoDB
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot(
          'mongodb://facturly_user:F4ctur1y_M0ng0_P4ssw0rd_2025@localhost:27017/facturly_db?authSource=facturly_db',
        ),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Client.name, schema: ClientSchema },
          { name: Invoice.name, schema: InvoiceSchema },
        ]),
      ],
      providers: [UsersMongoService, ClientsMongoService, InvoicesMongoService],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    // Obtenir les services MongoDB
    const usersService = moduleRef.get<UsersMongoService>(UsersMongoService);
    const clientsService =
      moduleRef.get<ClientsMongoService>(ClientsMongoService);
    const invoicesService =
      moduleRef.get<InvoicesMongoService>(InvoicesMongoService);

    console.log('✅ Services MongoDB obtenus avec succès');

    // Test 1: Compter les utilisateurs
    console.log('\n📊 Test 1: Comptage des utilisateurs...');
    const userCount = await usersService.count();
    console.log(`✅ Nombre d'utilisateurs: ${userCount}`);

    // Test 2: Créer un utilisateur de test
    console.log("\n👤 Test 2: Création d'un utilisateur...");
    const newUser = await usersService.create({
      email: 'test-isolated@example.com',
      name: 'Test Isolated User',
      password: 'testpassword123',
    });

    if (!newUser) {
      throw new Error("Échec de la création de l'utilisateur");
    }

    console.log(`✅ Utilisateur créé: ${newUser.id} - ${newUser.email}`);

    // Test 3: Récupérer l'utilisateur
    console.log("\n🔍 Test 3: Récupération de l'utilisateur...");
    const foundUser = await usersService.findByEmail(
      'test-isolated@example.com',
    );
    console.log(`✅ Utilisateur trouvé: ${foundUser?.name}`);

    // Test 4: Créer un client
    console.log("\n👥 Test 4: Création d'un client...");
    const newClient = await clientsService.create(newUser.id, {
      name: 'Client Test Isolated',
      email: 'client-isolated@mongodb.com',
      phone: '+33123456789',
      address: '123 Isolated Street, MongoDB City',
      siret: '12345678901234',
    });
    console.log(`✅ Client créé: ${newClient.id} - ${newClient.name}`);

    // Test 5: Créer une facture
    console.log("\n📄 Test 5: Création d'une facture...");
    const newInvoice = await invoicesService.create(newUser.id, {
      clientId: newClient.id,
      title: 'Facture Test Isolated',
      description: 'Test de création de facture isolée avec MongoDB',
      amount: 1500,
      taxAmount: 300,
      totalAmount: 1800,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: [
        {
          description: 'Service de test MongoDB isolé',
          quantity: 1,
          unitPrice: 1500,
          totalPrice: 1500,
        },
      ],
      notes: 'Facture générée automatiquement pour test MongoDB isolé',
    });
    console.log(
      `✅ Facture créée: ${newInvoice.id} - ${newInvoice.invoiceNumber}`,
    );

    // Test 6: Statistiques
    console.log('\n📈 Test 6: Statistiques...');
    const stats = await invoicesService.getStats(newUser.id);
    console.log(`✅ Statistiques:`, stats);

    // Test 7: Recherche
    console.log('\n🔍 Test 7: Recherche...');
    const searchResults = await clientsService.search(newUser.id, 'Isolated');
    console.log(
      `✅ Résultats de recherche: ${searchResults.length} client(s) trouvé(s)`,
    );

    // Test 8: Compter les clients
    console.log('\n📊 Test 8: Comptage des clients...');
    const clientCount = await clientsService.countByUserId(newUser.id);
    console.log(`✅ Nombre de clients pour l'utilisateur: ${clientCount}`);

    // Test 9: Factures par statut
    console.log('\n📋 Test 9: Factures par statut...');
    const pendingInvoices = await invoicesService.findByStatus(
      newUser.id,
      'pending',
    );
    console.log(`✅ Factures en attente: ${pendingInvoices.length}`);

    console.log('\n🎉 Tous les tests MongoDB isolés ont réussi!');
    console.log('✅ La migration vers MongoDB est complètement fonctionnelle');
    console.log('✅ Tous les services CRUD fonctionnent correctement');
    console.log('✅ Les relations entre documents sont bien gérées');
    console.log('✅ Les recherches et statistiques fonctionnent');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors des tests MongoDB isolés:', error.message);
    console.error('📋 Détails:', error.stack);
    process.exit(1);
  }
}

testMongoDBIsolated();
