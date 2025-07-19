import {
  IsString,
  IsNumber,
  IsEmail,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @MaxLength(100)
  invoiceNumber: string;

  @IsString()
  @MaxLength(200)
  clientName: string;

  @IsEmail()
  clientEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  clientAddress?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;
}
