import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://facturly_user:F4ctur1y_S3cur3_P4ssw0rd_2025@localhost:5432/facturly_db?schema=public',
    },
  },
});

async function createTestUser() {
  try {
    // Vérifier s'il existe déjà un utilisateur test
    const existingUser = await prisma.user.findFirst({
      where: {
        email: 'user@test.com',
      },
    });

    if (existingUser) {
      console.log('✅ Utilisateur test existe déjà:', existingUser.email);
      console.log('🆔 ID:', existingUser.id);
      return existingUser;
    }

    // Données du compte utilisateur par défaut
    const userData = {
      email: 'user@test.com',
      password: 'Test123!',
      name: 'Utilisateur Test',
      company: 'Test Company',
    };

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Créer le compte utilisateur
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        company: userData.company,
        role: UserRole.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        createdAt: true,
      },
    });

    console.log('✅ Compte utilisateur test créé avec succès:');
    console.log('📧 Email:', userData.email);
    console.log('🔑 Mot de passe:', userData.password);
    console.log('👤 Nom:', userData.name);
    console.log('🏢 Entreprise:', userData.company);
    console.log('🆔 ID:', user.id);
    console.log('👤 Rôle:', user.role);

    return user;
  } catch (error) {
    console.error(
      '❌ Erreur lors de la création du compte utilisateur:',
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createTestUser();
