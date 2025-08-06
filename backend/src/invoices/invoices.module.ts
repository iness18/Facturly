import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesController } from './invoices.controller';
import { InvoicesMongoService } from './invoices-mongo.service';
import { ExportService } from './export.service';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { Client, ClientSchema } from '../schemas/client.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Client.name, schema: ClientSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesMongoService, ExportService],
  exports: [InvoicesMongoService, ExportService],
})
export class InvoicesModule {}
