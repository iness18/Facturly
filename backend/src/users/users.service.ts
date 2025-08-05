import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Créer un utilisateur
  async create(userData: {
    email: string;
    password: string;
    name: string;
    company?: string;
  }) {
    return this.prisma.user.create({
      data: {
        ...userData,
        role: UserRole.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // Trouver un utilisateur par email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Trouver un utilisateur par ID
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        isActive: true,
        // Informations vendeur
        companyAddress: true,
        companyPostalCode: true,
        companyCity: true,
        companyCountry: true,
        companySiret: true,
        companySiren: true,
        companyVatNumber: true,
        companyNafCode: true,
        companyLegalForm: true,
        companyCapital: true,
        companyRegistrationCity: true,
        companyRegistrationNumber: true,
        // Contact
        phone: true,
        website: true,
        // Banque
        bankName: true,
        bankIban: true,
        bankBic: true,
        // Branding
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        createdAt: true,
      },
    });
  }

  // Mettre à jour un utilisateur
  async update(
    id: string,
    updateData: Partial<{
      name: string;
      company: string;
      isActive: boolean;
      // Informations vendeur
      companyAddress: string;
      companyPostalCode: string;
      companyCity: string;
      companyCountry: string;
      companySiret: string;
      companySiren: string;
      companyVatNumber: string;
      companyNafCode: string;
      companyLegalForm: string;
      companyCapital: string;
      companyRegistrationCity: string;
      companyRegistrationNumber: string;
      // Contact
      phone: string;
      website: string;
      // Banque
      bankName: string;
      bankIban: string;
      bankBic: string;
      // Branding
      logoUrl: string;
      primaryColor: string;
      secondaryColor: string;
    }>,
  ) {
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        isActive: true,
        // Informations vendeur
        companyAddress: true,
        companyPostalCode: true,
        companyCity: true,
        companyCountry: true,
        companySiret: true,
        companySiren: true,
        companyVatNumber: true,
        companyNafCode: true,
        companyLegalForm: true,
        companyCapital: true,
        companyRegistrationCity: true,
        companyRegistrationNumber: true,
        // Contact
        phone: true,
        website: true,
        // Banque
        bankName: true,
        bankIban: true,
        bankBic: true,
        // Branding
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        updatedAt: true,
      },
    });
  }

  // Obtenir tous les utilisateurs (pour admin)
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
