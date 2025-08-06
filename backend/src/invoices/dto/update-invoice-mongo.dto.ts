import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceMongoDto } from './create-invoice-mongo.dto';

export class UpdateInvoiceMongoDto extends PartialType(CreateInvoiceMongoDto) {}
