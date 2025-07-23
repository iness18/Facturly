import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('test')
export class TestController {
  constructor(private prisma: PrismaService) {}

  @Get('db')
  async testDatabase() {
    try {
      // Test simple de connexion à la base de données
      await this.prisma.$queryRaw`SELECT 1 as test`;
      return {
        success: true,
        message: 'Connexion à la base de données réussie',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion à la base de données',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'OK',
      message: 'Backend is running',
      timestamp: new Date().toISOString(),
    };
  }
}
