import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const envMongoUri = configService.get<string>('MONGODB_URI');
        console.log(
          '🔍 Variable MONGODB_URI depuis ConfigService:',
          envMongoUri ? 'TROUVÉE' : 'NON TROUVÉE',
        );
        console.log('🔍 Valeur exacte de MONGODB_URI:', envMongoUri);
        console.log(
          '🔍 Valeur depuis process.env.MONGODB_URI:',
          process.env.MONGODB_URI,
        );
        console.log(
          "🔍 Toutes les variables d'environnement:",
          Object.keys(process.env).filter((key) => key.includes('MONGO')),
        );

        const mongoUri =
          envMongoUri ||
          'mongodb://facturly_user:F4ctur1y_M0ng0_P4ssw0rd_2025@localhost:27017/facturly_db?authSource=facturly_db';

        console.log(
          '🔗 Tentative de connexion MongoDB avec URI:',
          mongoUri.replace(/:[^:@]*@/, ':***@'),
        );

        return {
          uri: mongoUri,
          // Options de performance et sécurité (compatibles avec MongoDB 7.0)
          maxPoolSize: 10, // Limite le nombre de connexions
          serverSelectionTimeoutMS: 5000, // Timeout de sélection du serveur
          socketTimeoutMS: 45000, // Timeout des sockets
          // Note: bufferMaxEntries et bufferCommands sont obsolètes dans les nouvelles versions
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class MongodbModule {}
