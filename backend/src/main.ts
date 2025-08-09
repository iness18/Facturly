import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // 🔄 ÉTAPE 1: Créer l'application NestJS
    logger.log("🏗️ Création de l'application NestJS...");
    const app = await NestFactory.create(AppModule);

    // 🔄 ÉTAPE 2: Migrations désactivées pour tests MongoDB
    // logger.log('🚀 Exécution des migrations automatiques...');
    // const migrationService = app.get(MigrationService);
    // await migrationService.performFullMigration();
    // logger.log('✅ Migrations terminées avec succès');

    // 🔄 ÉTAPE 3: Configuration CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // 🔄 ÉTAPE 4: Validation globale des données
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // 🔄 ÉTAPE 5: Démarrage du serveur
    const port = process.env.PORT || 3001;

    // Configuration spécifique pour Heroku
    if (process.env.NODE_ENV === 'production') {
      await app.listen(port, '0.0.0.0');
      logger.log(
        `🚀 Backend Facturly démarré en PRODUCTION sur le port: ${port}`,
      );
    } else {
      await app.listen(port);
      logger.log(
        `🚀 Backend Facturly démarré en DÉVELOPPEMENT sur: http://localhost:${port}`,
      );
    }

    logger.log(`📡 API disponible sur le port: ${port}`);
    logger.log(`🗄️ Base de données MongoDB connectée`);
    logger.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    logger.error(
      "❌ Erreur lors du démarrage de l'application:",
      error.message,
    );
    logger.error("📋 Détails de l'erreur:", error.stack);
    process.exit(1);
  }
}

bootstrap();
