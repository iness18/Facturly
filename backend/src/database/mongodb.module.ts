import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const envMongoUri = configService.get<string>('MONGODB_URI');
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';

        // Logs adaptés à l'environnement
        if (isProduction) {
          console.log(
            '🔗 Connexion MongoDB PRODUCTION:',
            envMongoUri ? 'URI configurée' : 'URI manquante',
          );
        } else {
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
        }

        // URI par défaut pour le développement local
        const defaultLocalUri =
          'mongodb://facturly_user:F4ctur1y_M0ng0_P4ssw0rd_2025@localhost:27017/facturly_db?authSource=facturly_db';

        const mongoUri = envMongoUri || defaultLocalUri;

        // Masquer les credentials dans les logs
        const maskedUri = mongoUri.replace(/:[^:@]*@/, ':***@');
        console.log(
          `🔗 Connexion MongoDB (${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}):`,
          maskedUri,
        );

        // Configuration optimisée selon l'environnement
        const mongoConfig = {
          uri: mongoUri,
          retryWrites: true,
          w: 'majority' as const,
          // Configuration pour la production (MongoDB Atlas)
          ...(isProduction && {
            maxPoolSize: 10, // Limite le nombre de connexions
            serverSelectionTimeoutMS: 5000, // Timeout de sélection du serveur
            socketTimeoutMS: 45000, // Timeout des sockets
            connectTimeoutMS: 10000, // Timeout de connexion
            heartbeatFrequencyMS: 10000, // Fréquence des heartbeats
            maxIdleTimeMS: 30000, // Temps d'inactivité max
            // Options pour MongoDB Atlas
            ssl: true,
            authSource: 'admin',
          }),
          // Configuration pour le développement local
          ...(!isProduction && {
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 30000,
            connectTimeoutMS: 10000,
          }),
        };

        return mongoConfig;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class MongodbModule {}
