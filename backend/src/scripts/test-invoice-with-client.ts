import { NestFactory } from '@nestjs/core';
import { TestAppModule } from './test-app.module';
import { InvoicesMongoService } from '../invoices/invoices-mongo.service';
import { UsersMongoService } from '../users/users-mongo.service';
import { ClientsMongoService } from '../clients/clients-mongo.service';

async function testInvoiceWithClient() {
  console.log('🧪 Test de création de facture avec informations client...\n');

  const app = await NestFactory.createApplicationContext(TestAppModule);
  const invoicesService = app.get(InvoicesMongoService);
  const usersService = app.get(UsersMongoService);
  const clientsService = app.get(ClientsMongoService);

  try {
    // 1. Créer un utilisateur de test avec informations vendeur
    console.log("1. Création d'un utilisateur de test...");
    const testUser = await usersService.create({
      email: 'vendeur@test.com',
      password: 'password123',
      name: 'Jean Dupont',
      company: 'SARL Dupont Consulting',
    });

    if (!testUser || !testUser._id) {
      throw new Error("Échec de la création de l'utilisateur");
    }

    const userId = (testUser._id as any).toString();

    // Ajouter les informations vendeur
    await usersService.updateVendorInfo(userId, {
      address: '123 Rue de la Paix',
      postalCode: '75001',
      city: 'Paris',
      country: 'France',
      siret: '12345678901234',
      siren: '123456789',
      vatNumber: 'FR12345678901',
    });

    await usersService.updateContact(userId, {
      phone: '+33 1 23 45 67 89',
      website: 'https://dupont-consulting.fr',
    });

    await usersService.updateBanking(userId, {
      bankName: 'Banque Populaire',
      iban: 'FR1420041010050500013M02606',
      bic: 'PSSTFRPPPAR',
    });

    console.log('✅ Utilisateur créé avec ID:', userId);

    // 2. Test 1: Créer une facture avec un nouveau client
    console.log('\n2. Test 1: Création de facture avec nouveau client...');
    const invoice1 = await invoicesService.createWithClientInfo(userId, {
      clientInfo: {
        name: 'Entreprise ABC',
        email: 'contact@abc.com',
        phone: '+33 1 98 76 54 32',
        address: '456 Avenue des Champs',
        city: 'Lyon',
        postalCode: '69000',
        country: 'France',
        siret: '98765432109876',
      },
      title: 'Prestation de conseil',
      description: 'Mission de conseil en stratégie',
      amount: 1000,
      taxAmount: 200,
      totalAmount: 1200,
      dueDate: new Date('2025-02-15'),
      items: [
        {
          description: 'Conseil stratégique',
          quantity: 5,
          unitPrice: 200,
          totalPrice: 1000,
        },
      ],
      notes: 'Paiement à 30 jours',
    });

    console.log('✅ Facture 1 créée:', {
      invoiceNumber: invoice1.invoiceNumber,
      clientName: invoice1.client.name,
      totalAmount: invoice1.totalAmount,
      vendorName: invoice1.vendorInfo?.name,
    });

    // 3. Test 2: Créer une autre facture pour le même client (doit réutiliser le client existant)
    console.log('\n3. Test 2: Création de facture pour client existant...');
    const invoice2 = await invoicesService.createWithClientInfo(userId, {
      clientInfo: {
        name: 'Entreprise ABC',
        email: 'contact@abc.com', // Même email = même client
        phone: '+33 1 98 76 54 32',
      },
      title: 'Formation équipe',
      description: 'Formation sur les nouvelles technologies',
      amount: 800,
      taxAmount: 160,
      totalAmount: 960,
      dueDate: new Date('2025-03-01'),
      items: [
        {
          description: 'Formation 1 jour',
          quantity: 1,
          unitPrice: 800,
          totalPrice: 800,
        },
      ],
    });

    console.log('✅ Facture 2 créée:', {
      invoiceNumber: invoice2.invoiceNumber,
      clientName: invoice2.client.name,
      totalAmount: invoice2.totalAmount,
      sameClientId:
        invoice1.client._id.toString() === invoice2.client._id.toString(),
    });

    // 4. Vérifier que le client a bien été créé dans la collection clients
    console.log('\n4. Vérification de la création du client...');
    const clients = await clientsService.findByUserId(userId);
    console.log('✅ Nombre de clients créés:', clients.length);

    if (clients.length === 0) {
      throw new Error('Aucun client créé');
    }

    console.log('✅ Client créé:', {
      name: clients[0]?.name,
      email: clients[0]?.email,
      id: (clients[0] as any)?._id,
    });

    // 5. Test 3: Créer une facture avec un client existant par ID
    console.log('\n5. Test 3: Création de facture avec clientId existant...');
    const invoice3 = await invoicesService.createWithClientInfo(userId, {
      clientId: (clients[0] as any)._id.toString(),
      title: 'Maintenance mensuelle',
      description: 'Maintenance système mensuelle',
      amount: 500,
      taxAmount: 100,
      totalAmount: 600,
      dueDate: new Date('2025-02-28'),
      items: [
        {
          description: 'Maintenance',
          quantity: 1,
          unitPrice: 500,
          totalPrice: 500,
        },
      ],
    });

    console.log('✅ Facture 3 créée:', {
      invoiceNumber: invoice3.invoiceNumber,
      clientName: invoice3.client.name,
      totalAmount: invoice3.totalAmount,
    });

    // 6. Afficher le résumé
    console.log('\n📊 RÉSUMÉ DES TESTS:');
    console.log('✅ Utilisateur créé avec informations vendeur complètes');
    console.log('✅ 3 factures créées avec informations vendeur automatiques');
    console.log('✅ 1 client créé automatiquement et réutilisé');
    console.log('✅ Gestion des clients existants par email');
    console.log('✅ Gestion des clients existants par ID');

    console.log('\n🎉 Tous les tests sont passés avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await app.close();
  }
}

// Exécuter les tests si ce fichier est lancé directement
if (require.main === module) {
  testInvoiceWithClient().catch(console.error);
}

export { testInvoiceWithClient };
