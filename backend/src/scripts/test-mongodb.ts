import { config } from 'dotenv';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { TestAppModule } from './test-app.module';
import { UsersMongoService } from '../users/users-mongo.service';
import { ClientsMongoService } from '../clients/clients-mongo.service';
import { InvoicesMongoService } from '../invoices/invoices-mongo.service';

// Charger les variables d'environnement depuis le répertoire racine
config({ path: resolve(__dirname, '../../../.env') });

console.log("🔧 Variables d'environnement chargées:");
console.log(
  '   MONGODB_URI:',
  process.env.MONGODB_URI ? 'Définie' : 'Non définie',
);

async function testMongoDB() {
  console.log('🚀 Test de connexion MongoDB...');

  try {
    // Créer l'application NestJS avec le module de test
    const app = await NestFactory.createApplicationContext(TestAppModule);

    // Récupérer les services MongoDB
    const usersService = app.get(UsersMongoService);
    const clientsService = app.get(ClientsMongoService);
    const invoicesService = app.get(InvoicesMongoService);

    console.log('✅ Services MongoDB récupérés avec succès');

    // Test de comptage (vérifier la connexion)
    const userCount = await usersService.count();
    const clientCount = await clientsService.count();
    const invoiceCount = await invoicesService.count();

    console.log('📊 Statistiques MongoDB:');
    console.log(`   - Utilisateurs: ${userCount}`);
    console.log(`   - Clients: ${clientCount}`);
    console.log(`   - Factures: ${invoiceCount}`);

    // Test de création d'un utilisateur de test
    console.log("\n🧪 Test de création d'un utilisateur...");
    const testUser = await usersService.create({
      email: 'test@mongodb.com',
      password: 'test123',
      name: 'Test MongoDB User',
      company: 'Test Company',
    });

    console.log('✅ Utilisateur créé:', testUser);

    // Test de recherche
    const foundUser = await usersService.findByEmail('test@mongodb.com');
    console.log('✅ Utilisateur trouvé:', foundUser ? 'Oui' : 'Non');

    console.log('\n🎉 Tous les tests MongoDB sont passés avec succès !');

    await app.close();
  } catch (error) {
    console.error('❌ Erreur lors du test MongoDB:', error);
    process.exit(1);
  }
}

// Exécuter le test
testMongoDB();
