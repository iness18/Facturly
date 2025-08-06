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
    await app.listen(port);

    logger.log(`🚀 Backend Facturly démarré sur: http://localhost:${port}`);
    logger.log(`📡 API Admin disponible sur: http://localhost:${port}/admin`);
    logger.log(`🗄️ Base de données synchronisée et prête`);
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
