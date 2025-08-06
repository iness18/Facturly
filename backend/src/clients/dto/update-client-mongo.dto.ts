import { PartialType } from '@nestjs/mapped-types';
import { CreateClientMongoDto } from './create-client-mongo.dto';

export class UpdateClientMongoDto extends PartialType(CreateClientMongoDto) {}
