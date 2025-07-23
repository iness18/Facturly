import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  phone?: string;

  @IsOptional()
  @IsString({ message: "L'adresse doit être une chaîne de caractères" })
  address?: string;

  @IsOptional()
  @IsString({ message: 'La ville doit être une chaîne de caractères' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Le code postal doit être une chaîne de caractères' })
  postalCode?: string;

  @IsOptional()
  @IsString({ message: 'Le pays doit être une chaîne de caractères' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'Le SIRET doit être une chaîne de caractères' })
  siret?: string;
}
