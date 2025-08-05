import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://facturly_user:F4ctur1y_S3cur3_P4ssw0rd_2025@localhost:5432/facturly_db?schema=public',
    },
  },
});

async function createClientForUser() {
  try {
    // Récupérer l'utilisateur test
    const testUser = await prisma.user.findFirst({
      where: { email: 'user@test.com' },
    });

    if (!testUser) {
      console.error(
        "❌ Utilisateur test non trouvé. Créez d'abord l'utilisateur test.",
      );
      return;
    }

    // Vérifier s'il existe déjà un client pour cet utilisateur
    const existingClient = await prisma.client.findFirst({
      where: {
        userId: testUser.id,
        email: 'client.user@test.com',
      },
    });

    if (existingClient) {
      console.log(
        '✅ Client pour utilisateur test existe déjà:',
        existingClient.email,
      );
      console.log('🆔 ID:', existingClient.id);
      return existingClient;
    }

    // Créer le client pour l'utilisateur test
    const testClient = await prisma.client.create({
      data: {
        name: 'Client Test User',
        email: 'client.user@test.com',
        phone: '+33 1 98 76 54 32',
        address: '456 Avenue du Test',
        city: 'Lyon',
        postalCode: '69000',
        country: 'France',
        siret: '98765432109876',
        userId: testUser.id,
      },
    });

    console.log('✅ Client pour utilisateur test créé avec succès:');
    console.log('📧 Email:', testClient.email);
    console.log('👤 Nom:', testClient.name);
    console.log('🏢 Entreprise:', testClient.name);
    console.log('🆔 ID:', testClient.id);
    console.log('👤 Utilisateur ID:', testClient.userId);

    return testClient;
  } catch (error) {
    console.error(
      '❌ Erreur lors de la création du client pour utilisateur test:',
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createClientForUser();
