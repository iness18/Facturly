import { Module } from '@nestjs/common';
import { TestMongoController } from './test-mongo.controller';
import { UsersMongoService } from '../users/users-mongo.service';
import { ClientsMongoService } from '../clients/clients-mongo.service';
import { InvoicesMongoService } from '../invoices/invoices-mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Client, ClientSchema } from '../schemas/client.schema';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
  ],
  controllers: [TestMongoController],
  providers: [UsersMongoService, ClientsMongoService, InvoicesMongoService],
})
export class TestModule {}
