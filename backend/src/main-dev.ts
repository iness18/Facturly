import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🚀 Démarrage en mode développement sans base de données');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Configuration CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation globale des données
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend Facturly démarré sur: http://localhost:${port}`);
  console.log(`📡 API Admin disponible sur: http://localhost:${port}/admin`);
  console.log(`🔧 Mode développement: Données de test activées`);
  console.log(`🔑 Identifiants de test:`);
  console.log(`   Admin: admin@facturly.com / Admin123!`);
  console.log(`   User:  user@test.com / Test123!`);
}

// Gérer les erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.log('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
  // Ne pas arrêter le processus en mode développement
});

process.on('uncaughtException', (error) => {
  console.log('⚠️ Uncaught Exception:', error);
  // Ne pas arrêter le processus en mode développement
});

bootstrap().catch((error) => {
  console.error('❌ Erreur lors du démarrage:', error);
  // En mode développement, on continue quand même
  console.log('🔧 Tentative de démarrage en mode dégradé...');
});
