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
