import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Invoice,
  InvoiceDocument,
  InvoiceItem,
  EmbeddedClient,
} from '../schemas/invoice.schema';
import { Client, ClientDocument } from '../schemas/client.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class InvoicesMongoService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Créer une facture
  async create(
    userId: string,
    invoiceData: {
      clientId: string;
      title?: string;
      description?: string;
      amount: number;
      taxAmount?: number;
      totalAmount: number;
      dueDate: Date;
      items?: InvoiceItem[];
      notes?: string;
    },
  ) {
    // Récupérer les données du client pour l'embedding
    const client = await this.clientModel.findById(invoiceData.clientId).exec();
    if (!client) {
      throw new Error('Client not found');
    }

    // Créer le client embedded (snapshot)
    const embeddedClient: EmbeddedClient = {
      _id: client._id as Types.ObjectId,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      postalCode: client.postalCode,
      country: client.country,
      siret: client.siret,
    };

    // Générer un numéro de facture unique
    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = new this.invoiceModel({
      invoiceNumber,
      userId: new Types.ObjectId(userId),
      client: embeddedClient,
      title: invoiceData.title,
      description: invoiceData.description,
      amount: invoiceData.amount,
      taxAmount: invoiceData.taxAmount || 0,
      totalAmount: invoiceData.totalAmount,
      dueDate: invoiceData.dueDate,
      items: invoiceData.items || [],
      notes: invoiceData.notes,
    });

    return invoice.save();
  }

  // Créer une facture avec informations client intégrées
  async createWithClientInfo(
    userId: string,
    invoiceData: {
      clientId?: string;
      clientInfo?: {
        name: string;
        email: string;
        phone?: string;
        address?: string;
        city?: string;
        postalCode?: string;
        country?: string;
        siret?: string;
      };
      title?: string;
      description?: string;
      amount: number;
      taxAmount?: number;
      totalAmount: number;
      dueDate: Date;
      items?: InvoiceItem[];
      notes?: string;
    },
  ) {
    let client: ClientDocument;

    // Si clientId est fourni, utiliser le client existant
    if (invoiceData.clientId) {
      const foundClient = await this.clientModel
        .findById(invoiceData.clientId)
        .exec();
      if (!foundClient) {
        throw new Error('Client not found');
      }
      client = foundClient;
    }
    // Sinon, créer un nouveau client avec les informations fournies
    else if (invoiceData.clientInfo) {
      // Vérifier si un client avec cet email existe déjà pour cet utilisateur
      const existingClient = await this.clientModel
        .findOne({
          email: invoiceData.clientInfo.email,
          userId: new Types.ObjectId(userId),
          isActive: true,
        })
        .exec();

      if (existingClient) {
        client = existingClient;
      } else {
        // Créer un nouveau client
        const newClient = new this.clientModel({
          ...invoiceData.clientInfo,
          userId: new Types.ObjectId(userId),
        });
        client = await newClient.save();
      }
    } else {
      throw new Error('Either clientId or clientInfo must be provided');
    }

    // Récupérer les informations utilisateur pour les informations vendeur
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();
    if (!user) {
      throw new Error('User not found');
    }

    // Créer le client embedded (snapshot)
    const embeddedClient: EmbeddedClient = {
      _id: client._id as Types.ObjectId,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      postalCode: client.postalCode,
      country: client.country,
      siret: client.siret,
    };

    // Générer un numéro de facture unique
    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = new this.invoiceModel({
      invoiceNumber,
      userId: new Types.ObjectId(userId),
      client: embeddedClient,
      title: invoiceData.title,
      description: invoiceData.description,
      amount: invoiceData.amount,
      taxAmount: invoiceData.taxAmount || 0,
      totalAmount: invoiceData.totalAmount,
      dueDate: invoiceData.dueDate,
      items: invoiceData.items || [],
      notes: invoiceData.notes,
    });

    const savedInvoice = await invoice.save();

    // Retourner la facture avec les informations utilisateur (vendeur)
    return {
      ...savedInvoice.toObject(),
      vendorInfo: {
        name: user.name,
        company: user.company,
        email: user.email,
        vendorInfo: user.vendorInfo,
        contact: user.contact,
        banking: user.banking,
        branding: user.branding,
      },
    };
  }

  // Générer un numéro de facture unique
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `FAC-${year}-`;

    // Trouver le dernier numéro de facture de l'année
    const lastInvoice = await this.invoiceModel
      .findOne({
        invoiceNumber: { $regex: `^${prefix}` },
      })
      .sort({ invoiceNumber: -1 })
      .exec();

    let nextNumber = 1;
    if (lastInvoice) {
      const lastNumber = parseInt(
        lastInvoice.invoiceNumber.replace(prefix, ''),
      );
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }

  // Trouver toutes les factures d'un utilisateur
  async findByUserId(userId: string) {
    return this.invoiceModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Trouver une facture par ID
  async findById(id: string) {
    return this.invoiceModel.findById(id).exec();
  }

  // Trouver une facture par ID et userId (sécurité)
  async findByIdAndUserId(id: string, userId: string) {
    return this.invoiceModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  // Mettre à jour une facture
  async update(
    id: string,
    userId: string,
    updateData: Partial<{
      title: string;
      description: string;
      amount: number;
      taxAmount: number;
      totalAmount: number;
      status: string;
      dueDate: Date;
      paidDate: Date;
      items: InvoiceItem[];
      notes: string;
    }>,
  ) {
    return this.invoiceModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        },
        updateData,
        { new: true },
      )
      .exec();
  }

  // Mettre à jour le statut d'une facture
  async updateStatus(id: string, userId: string, status: string) {
    const updateData: any = { status };

    // Si le statut est PAID, ajouter la date de paiement
    if (status === 'PAID') {
      updateData.paidDate = new Date();
    }

    return this.invoiceModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        },
        updateData,
        { new: true },
      )
      .exec();
  }

  // Supprimer une facture
  async delete(id: string, userId: string) {
    return this.invoiceModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  // Rechercher des factures
  async search(userId: string, query: string) {
    return this.invoiceModel
      .find({
        userId: new Types.ObjectId(userId),
        $or: [
          { invoiceNumber: { $regex: query, $options: 'i' } },
          { title: { $regex: query, $options: 'i' } },
          { 'client.name': { $regex: query, $options: 'i' } },
          { 'client.email': { $regex: query, $options: 'i' } },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Trouver les factures par statut
  async findByStatus(userId: string, status: string) {
    return this.invoiceModel
      .find({
        userId: new Types.ObjectId(userId),
        status,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Trouver les factures en retard
  async findOverdue(userId: string) {
    return this.invoiceModel
      .find({
        userId: new Types.ObjectId(userId),
        status: { $in: ['SENT', 'OVERDUE'] },
        dueDate: { $lt: new Date() },
      })
      .sort({ dueDate: 1 })
      .exec();
  }

  // Statistiques des factures d'un utilisateur
  async getStats(userId: string) {
    const stats = await this.invoiceModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    const result = {
      total: 0,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
      cancelled: 0,
      totalRevenue: 0,
      paidRevenue: 0,
    };

    stats.forEach((stat) => {
      result.total += stat.count;
      switch (stat._id) {
        case 'DRAFT':
          result.draft = stat.count;
          break;
        case 'SENT':
          result.sent = stat.count;
          break;
        case 'PAID':
          result.paid = stat.count;
          result.paidRevenue += stat.totalAmount;
          break;
        case 'OVERDUE':
          result.overdue = stat.count;
          break;
        case 'CANCELLED':
          result.cancelled = stat.count;
          break;
      }
      result.totalRevenue += stat.totalAmount;
    });

    return result;
  }

  // Trouver les factures récentes d'un utilisateur
  async findRecentByUserId(userId: string, limit: number = 5) {
    return this.invoiceModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  // Compter les factures d'un utilisateur
  async countByUserId(userId: string): Promise<number> {
    return this.invoiceModel
      .countDocuments({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  // Obtenir toutes les factures (pour admin)
  async findAll() {
    return this.invoiceModel.find().sort({ createdAt: -1 }).exec();
  }

  // Compter toutes les factures
  async count(): Promise<number> {
    return this.invoiceModel.countDocuments().exec();
  }
}
