import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  // Créer un client
  async create(userId: string, createClientDto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        ...createClientDto,
        userId,
      },
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });
  }

  // Obtenir tous les clients d'un utilisateur
  async findAll(userId: string) {
    return this.prisma.client.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Obtenir un client par ID
  async findOne(userId: string, id: string) {
    return this.prisma.client.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
      include: {
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true,
            issueDate: true,
            dueDate: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });
  }

  // Mettre à jour un client
  async update(userId: string, id: string, updateClientDto: UpdateClientDto) {
    // Vérifier que le client appartient à l'utilisateur
    const client = await this.prisma.client.findFirst({
      where: { id, userId },
    });

    if (!client) {
      throw new Error('Client non trouvé');
    }

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });
  }

  // Supprimer un client (soft delete)
  async remove(userId: string, id: string) {
    // Vérifier que le client appartient à l'utilisateur
    const client = await this.prisma.client.findFirst({
      where: { id, userId },
    });

    if (!client) {
      throw new Error('Client non trouvé');
    }

    return this.prisma.client.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Rechercher des clients
  async search(userId: string, query: string) {
    return this.prisma.client.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { siret: { contains: query } },
        ],
      },
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Obtenir les statistiques d'un client
  async getClientStats(userId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, userId },
    });

    if (!client) {
      throw new Error('Client non trouvé');
    }

    const [invoiceCount, totalAmount, paidAmount, pendingAmount] =
      await Promise.all([
        this.prisma.invoice.count({
          where: { clientId, userId },
        }),
        this.prisma.invoice.aggregate({
          where: { clientId, userId },
          _sum: { totalAmount: true },
        }),
        this.prisma.invoice.aggregate({
          where: { clientId, userId, status: 'PAID' },
          _sum: { totalAmount: true },
        }),
        this.prisma.invoice.aggregate({
          where: {
            clientId,
            userId,
            status: { in: ['SENT', 'OVERDUE'] },
          },
          _sum: { totalAmount: true },
        }),
      ]);

    return {
      invoiceCount,
      totalAmount: totalAmount._sum.totalAmount || 0,
      paidAmount: paidAmount._sum.totalAmount || 0,
      pendingAmount: pendingAmount._sum.totalAmount || 0,
    };
  }
}
