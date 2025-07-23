import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://facturly_user:F4ctur1y_S3cur3_P4ssw0rd_2025@localhost:5432/facturly_db?schema=public',
    },
  },
});

async function createAdminUser() {
  try {
    // Vérifier s'il existe déjà un admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      console.log('Un administrateur existe déjà:', existingAdmin.email);
      return;
    }

    // Données du compte admin par défaut
    const adminData = {
      email: 'admin@facturly.com',
      password: 'Admin123!',
      name: 'Administrateur Facturly',
      company: 'Facturly',
    };

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Créer le compte admin
    const admin = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        company: adminData.company,
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    console.log('✅ Compte administrateur créé avec succès:');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Mot de passe:', adminData.password);
    console.log('👤 Nom:', adminData.name);
    console.log('🏢 Entreprise:', adminData.company);
    console.log('🆔 ID:', admin.id);
    console.log(
      '\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion!',
    );
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createAdminUser();
