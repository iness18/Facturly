import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://facturly_user:F4ctur1y_S3cur3_P4ssw0rd_2025@localhost:5432/facturly_db?schema=public',
    },
  },
});

async function createDefaultClient() {
  try {
    // Récupérer l'utilisateur admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!adminUser) {
      console.error(
        "❌ Aucun utilisateur admin trouvé. Créez d'abord un admin.",
      );
      return;
    }

    // Vérifier s'il existe déjà un client par défaut
    const existingClient = await prisma.client.findFirst({
      where: {
        userId: adminUser.id,
        email: 'client.demo@facturly.com',
      },
    });

    if (existingClient) {
      console.log('✅ Client par défaut existe déjà:', existingClient.email);
      console.log('🆔 ID:', existingClient.id);
      return existingClient;
    }

    // Créer le client par défaut
    const defaultClient = await prisma.client.create({
      data: {
        name: 'Client Démo',
        email: 'client.demo@facturly.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Démo',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        siret: '12345678901234',
        userId: adminUser.id,
      },
    });

    console.log('✅ Client par défaut créé avec succès:');
    console.log('📧 Email:', defaultClient.email);
    console.log('👤 Nom:', defaultClient.name);
    console.log('🏢 Entreprise:', defaultClient.name);
    console.log('🆔 ID:', defaultClient.id);
    console.log('👤 Utilisateur ID:', defaultClient.userId);

    return defaultClient;
  } catch (error) {
    console.error('❌ Erreur lors de la création du client par défaut:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createDefaultClient();
