import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    try {
      const invoice = await this.prisma.invoice.create({
        data: {
          invoiceNumber: createInvoiceDto.invoiceNumber,
          amount: createInvoiceDto.amount,
          totalAmount: createInvoiceDto.amount, // Pour l'instant, total = amount
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
          userId: 'temp-user-id', // TODO: Récupérer depuis l'auth
          clientId: 'temp-client-id', // TODO: Récupérer depuis le DTO
        },
      });
      return invoice;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Le numéro de facture existe déjà');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException(`Facture avec l'ID ${id} non trouvée`);
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    await this.findOne(id); // Vérifier que la facture existe

    try {
      return await this.prisma.invoice.update({
        where: { id },
        data: {
          ...(updateInvoiceDto.invoiceNumber && {
            invoiceNumber: updateInvoiceDto.invoiceNumber,
          }),
          ...(updateInvoiceDto.amount && { amount: updateInvoiceDto.amount }),
          ...(updateInvoiceDto.amount && {
            totalAmount: updateInvoiceDto.amount,
          }),
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Le numéro de facture existe déjà');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id); // Vérifier que la facture existe

    return this.prisma.invoice.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, count, pending] = await Promise.all([
      this.prisma.invoice.aggregate({
        _sum: {
          amount: true,
        },
      }),
      this.prisma.invoice.count(),
      this.prisma.invoice.count({
        where: {
          // Ajouter une condition pour les factures en attente si nécessaire
        },
      }),
    ]);

    return {
      totalAmount: total._sum.amount || 0,
      totalCount: count,
      pendingCount: pending,
    };
  }
}
