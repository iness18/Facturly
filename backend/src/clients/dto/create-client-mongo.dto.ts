import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateClientMongoDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  siret?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
