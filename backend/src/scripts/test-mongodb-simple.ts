import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersMongoService } from '../users/users-mongo.service';
import { ClientsMongoService } from '../clients/clients-mongo.service';
import { InvoicesMongoService } from '../invoices/invoices-mongo.service';

async function testMongoDB() {
  console.log('🚀 Test direct des services MongoDB...\n');

  try {
    // Créer l'application NestJS
    const app = await NestFactory.createApplicationContext(AppModule);

    // Obtenir les services MongoDB
    const usersService = app.get(UsersMongoService);
    const clientsService = app.get(ClientsMongoService);
    const invoicesService = app.get(InvoicesMongoService);

    console.log('✅ Services MongoDB obtenus avec succès');

    // Test 1: Compter les utilisateurs
    console.log('\n📊 Test 1: Comptage des utilisateurs...');
    const userCount = await usersService.count();
    console.log(`✅ Nombre d'utilisateurs: ${userCount}`);

    // Test 2: Créer un utilisateur de test
    console.log("\n👤 Test 2: Création d'un utilisateur...");
    const newUser = await usersService.create({
      email: 'test-mongo@example.com',
      name: 'Test MongoDB User',
      password: 'testpassword123',
    });
    if (!newUser) {
      throw new Error("Échec de la création de l'utilisateur");
    }
    console.log(`✅ Utilisateur créé: ${newUser.id} - ${newUser.email}`);

    // Test 3: Récupérer l'utilisateur
    console.log("\n🔍 Test 3: Récupération de l'utilisateur...");
    const foundUser = await usersService.findByEmail('test-mongo@example.com');
    console.log(`✅ Utilisateur trouvé: ${foundUser?.name}`);

    // Test 4: Créer un client
    console.log("\n👥 Test 4: Création d'un client...");
    const newClient = await clientsService.create(newUser.id, {
      name: 'Client Test MongoDB',
      email: 'client-test@mongodb.com',
      phone: '+33123456789',
      address: '123 Test Street, MongoDB City',
      siret: '12345678901234',
    });
    console.log(`✅ Client créé: ${newClient.id} - ${newClient.name}`);

    // Test 5: Créer une facture
    console.log("\n📄 Test 5: Création d'une facture...");
    const newInvoice = await invoicesService.create(newUser.id, {
      clientId: newClient.id,
      title: 'Facture Test MongoDB',
      description: 'Test de création de facture avec MongoDB',
      amount: 1000,
      taxAmount: 200,
      totalAmount: 1200,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: [
        {
          description: 'Service de test MongoDB',
          quantity: 1,
          unitPrice: 1000,
          totalPrice: 1000,
        },
      ],
      notes: 'Facture générée automatiquement pour test MongoDB',
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
    const searchResults = await clientsService.search(newUser.id, 'MongoDB');
    console.log(
      `✅ Résultats de recherche: ${searchResults.length} client(s) trouvé(s)`,
    );

    console.log('\n🎉 Tous les tests MongoDB ont réussi!');
    console.log('✅ La migration vers MongoDB est fonctionnelle');

    await app.close();
  } catch (error) {
    console.error('❌ Erreur lors des tests MongoDB:', error.message);
    console.error('📋 Détails:', error.stack);
    process.exit(1);
  }
}

testMongoDB();
