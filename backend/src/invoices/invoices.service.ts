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
          title: createInvoiceDto.title || 'Facture',
          description: createInvoiceDto.description,
          amount: createInvoiceDto.amount,
          taxAmount: createInvoiceDto.taxAmount || 0,
          totalAmount: createInvoiceDto.totalAmount,
          status: createInvoiceDto.status || 'DRAFT',
          issueDate: createInvoiceDto.issueDate
            ? new Date(createInvoiceDto.issueDate)
            : new Date(),
          dueDate: createInvoiceDto.dueDate
            ? new Date(createInvoiceDto.dueDate)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          notes: createInvoiceDto.notes,
          userId: createInvoiceDto.userId,
          clientId: createInvoiceDto.clientId,
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              postalCode: true,
              country: true,
              siret: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
          items: true,
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

  async findAll(userId?: string) {
    const where = userId ? { userId } : {};
    return this.prisma.invoice.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            postalCode: true,
            country: true,
            siret: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
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
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            postalCode: true,
            country: true,
            siret: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
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
          },
        },
        items: true,
      },
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

  async getStats(userId?: string) {
    const where = userId ? { userId } : {};

    const [total, count, pending, paid] = await Promise.all([
      this.prisma.invoice.aggregate({
        where,
        _sum: {
          totalAmount: true,
        },
      }),
      this.prisma.invoice.count({ where }),
      this.prisma.invoice.count({
        where: {
          ...where,
          status: { in: ['DRAFT', 'SENT', 'OVERDUE'] },
        },
      }),
      this.prisma.invoice.count({
        where: {
          ...where,
          status: 'PAID',
        },
      }),
    ]);

    return {
      totalAmount: total._sum.totalAmount || 0,
      totalCount: count,
      pendingCount: pending,
      paidCount: paid,
    };
  }
}
