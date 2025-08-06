import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';

// Charger les variables d'environnement depuis le répertoire racine
config({ path: resolve(__dirname, '../../../.env') });

async function testMongoDBDirect() {
  console.log('🚀 Test de connexion MongoDB directe...');

  try {
    // URL de connexion directe pour localhost
    const mongoUri =
      'mongodb://facturly_user:F4ctur1y_M0ng0_P4ssw0rd_2025@localhost:27017/facturly_db?authSource=facturly_db';

    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(mongoUri);

    console.log('✅ Connexion MongoDB réussie !');

    // Test de création d'un document simple
    const TestSchema = new mongoose.Schema({
      name: String,
      email: String,
      createdAt: { type: Date, default: Date.now },
    });

    const TestModel = mongoose.model('Test', TestSchema);

    console.log("🧪 Test de création d'un document...");
    const testDoc = new TestModel({
      name: 'Test MongoDB',
      email: 'test@mongodb.com',
    });

    await testDoc.save();
    console.log('✅ Document créé:', testDoc);

    // Test de lecture
    console.log('📖 Test de lecture...');
    const foundDoc = await TestModel.findOne({ email: 'test@mongodb.com' });
    console.log('✅ Document trouvé:', foundDoc ? 'Oui' : 'Non');

    // Nettoyage
    await TestModel.deleteMany({});
    console.log('🧹 Nettoyage effectué');

    console.log('\n🎉 Tous les tests MongoDB sont passés avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du test MongoDB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le test
testMongoDBDirect();
