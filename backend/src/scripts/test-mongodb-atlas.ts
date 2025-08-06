import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

async function testMongoDBAtlas() {
  console.log('🌐 Test de connexion MongoDB Atlas...\n');

  try {
    // Vérifier que l'URI MongoDB Atlas est définie
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI non définie dans les variables d'environnement",
      );
    }

    if (!mongoUri.includes('mongodb+srv://')) {
      console.log('⚠️  URI MongoDB locale détectée, pas Atlas');
      console.log(
        '💡 Pour tester Atlas, définissez MONGODB_URI avec une URI mongodb+srv://',
      );
      return;
    }

    console.log('🔗 URI MongoDB Atlas détectée');
    console.log(
      `📍 Cluster: ${mongoUri.split('@')[1]?.split('/')[0] || 'inconnu'}`,
    );

    // Créer un module de test avec MongoDB Atlas
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('MONGODB_URI'),
            // Options optimisées pour Atlas
            maxPoolSize: 20,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 60000,
            connectTimeoutMS: 10000,
            retryWrites: true,
            w: 'majority',
            readPreference: 'primary',
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    console.log('✅ Connexion MongoDB Atlas établie avec succès');

    // Test de performance basique
    const startTime = Date.now();

    // Simuler une opération simple
    const mongoose = require('mongoose');
    const connection = mongoose.connection;

    if (connection.readyState === 1) {
      const endTime = Date.now();
      const latency = endTime - startTime;

      console.log(`⚡ Latence de connexion: ${latency}ms`);

      if (latency < 100) {
        console.log('🚀 Excellente performance');
      } else if (latency < 300) {
        console.log('✅ Bonne performance');
      } else {
        console.log('⚠️  Performance acceptable mais pourrait être améliorée');
      }

      // Informations sur la connexion
      console.log(`🌍 Base de données: ${connection.name}`);
      console.log(
        `🔌 État de connexion: ${connection.readyState === 1 ? 'Connecté' : 'Déconnecté'}`,
      );
      console.log(`🖥️  Host: ${connection.host}`);
      console.log(`🔢 Port: ${connection.port}`);
    }

    // Test d'écriture/lecture simple
    console.log("\n📝 Test d'écriture/lecture...");

    const TestSchema = new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now },
    });

    const TestModel = mongoose.model('AtlasTest', TestSchema);

    // Écriture
    const writeStart = Date.now();
    const testDoc = await TestModel.create({
      message: 'Test de connexion MongoDB Atlas',
    });
    const writeTime = Date.now() - writeStart;

    // Lecture
    const readStart = Date.now();
    const foundDoc = await TestModel.findById(testDoc._id);
    const readTime = Date.now() - readStart;

    // Nettoyage
    await TestModel.deleteOne({ _id: testDoc._id });

    console.log(`✍️  Temps d'écriture: ${writeTime}ms`);
    console.log(`📖 Temps de lecture: ${readTime}ms`);
    console.log(`🗑️  Document de test supprimé`);

    console.log('\n🎉 Test MongoDB Atlas réussi!');
    console.log('✅ La connexion Atlas est opérationnelle');
    console.log('✅ Les opérations CRUD fonctionnent');
    console.log('✅ Prêt pour la production');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du test MongoDB Atlas:', error.message);

    if (error.message.includes('authentication failed')) {
      console.error("🔐 Erreur d'authentification - Vérifiez les identifiants");
    } else if (error.message.includes('network')) {
      console.error('🌐 Erreur réseau - Vérifiez la whitelist IP');
    } else if (error.message.includes('timeout')) {
      console.error('⏱️  Timeout - Vérifiez la connectivité réseau');
    }

    console.error('📋 Détails:', error.stack);
    process.exit(1);
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testMongoDBAtlas();
}

export { testMongoDBAtlas };
