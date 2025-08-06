import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from '../schemas/client.schema';

@Injectable()
export class ClientsMongoService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  // Créer un client
  async create(
    userId: string,
    clientData: {
      name: string;
      email: string;
      phone?: string;
      address?: string;
      city?: string;
      postalCode?: string;
      country?: string;
      siret?: string;
    },
  ) {
    const client = new this.clientModel({
      ...clientData,
      userId: new Types.ObjectId(userId),
    });

    return client.save();
  }

  // Trouver tous les clients d'un utilisateur
  async findByUserId(userId: string) {
    return this.clientModel
      .find({ userId: new Types.ObjectId(userId), isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Trouver un client par ID
  async findById(id: string) {
    return this.clientModel.findById(id).exec();
  }

  // Trouver un client par ID et userId (sécurité)
  async findByIdAndUserId(id: string, userId: string) {
    return this.clientModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .exec();
  }

  // Mettre à jour un client
  async update(
    id: string,
    userId: string,
    updateData: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
      siret: string;
    }>,
  ) {
    return this.clientModel
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

  // Supprimer un client (soft delete)
  async delete(id: string, userId: string) {
    return this.clientModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        },
        { isActive: false },
        { new: true },
      )
      .exec();
  }

  // Rechercher des clients
  async search(userId: string, query: string) {
    return this.clientModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Trouver un client par email (pour éviter les doublons)
  async findByEmailAndUserId(email: string, userId: string) {
    return this.clientModel
      .findOne({
        email,
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .exec();
  }

  // Compter les clients d'un utilisateur
  async countByUserId(userId: string): Promise<number> {
    return this.clientModel
      .countDocuments({
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .exec();
  }

  // Obtenir les clients récents d'un utilisateur
  async findRecentByUserId(userId: string, limit: number = 5) {
    return this.clientModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  // Obtenir tous les clients (pour admin)
  async findAll() {
    return this.clientModel
      .find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Compter tous les clients
  async count(): Promise<number> {
    return this.clientModel.countDocuments({ isActive: true }).exec();
  }
}
