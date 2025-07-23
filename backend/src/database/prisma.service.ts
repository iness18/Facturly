import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    let retries = 3;
    while (retries > 0) {
      try {
        await this.$connect();
        console.log('✅ Connected to database');
        return;
      } catch (error) {
        console.error(
          `❌ Database connection failed (${4 - retries}/3):`,
          error.message,
        );
        retries--;
        if (retries > 0) {
          console.log('🔄 Retrying connection in 2 seconds...');
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    // Si toutes les tentatives échouent
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '⚠️ All connection attempts failed. Continuing in development mode without database',
      );
      return;
    }
    throw new Error('Failed to connect to database after 3 attempts');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Disconnected from database');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    return Promise.all(
      models.map((modelKey) => this[modelKey as string].deleteMany()),
    );
  }
}
