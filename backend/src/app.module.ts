import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbModule } from './database/mongodb.module';
import { InvoicesModule } from './invoices/invoices.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { ClientsModule } from './clients/clients.module';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule, // Nouveau module MongoDB
    // DatabaseModule, // Désactivé temporairement pour les tests MongoDB
    AuthModule,
    // TestModule, // Désactivé temporairement - utilise encore Prisma
    InvoicesModule,
    UsersModule,
    // AdminModule, // Désactivé temporairement - utilise encore Prisma
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
