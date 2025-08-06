import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { ClientsModule } from '../clients/clients.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [UsersModule, ClientsModule, InvoicesModule],
  controllers: [AdminController],
  providers: [],
  exports: [],
})
export class AdminModule {}
