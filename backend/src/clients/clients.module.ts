import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsController } from './clients.controller';
import { ClientsMongoService } from './clients-mongo.service';
import { Client, ClientSchema } from '../schemas/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  controllers: [ClientsController],
  providers: [ClientsMongoService],
  exports: [ClientsMongoService],
})
export class ClientsModule {}
