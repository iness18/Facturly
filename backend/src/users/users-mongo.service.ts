import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersMongoService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Créer un utilisateur
  async create(userData: {
    email: string;
    password: string;
    name: string;
    company?: string;
  }) {
    const user = new this.userModel({
      ...userData,
      role: 'USER',
    });

    const savedUser = await user.save();

    // Retourner l'utilisateur sans le mot de passe
    return this.userModel
      .findById(savedUser._id)
      .select('email name company role createdAt')
      .exec();
  }

  // Trouver un utilisateur par email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Trouver un utilisateur par ID
  async findById(id: string) {
    return this.userModel
      .findById(id)
      .select('-password') // Exclure le mot de passe
      .exec();
  }

  // Mettre à jour un utilisateur
  async update(
    id: string,
    updateData: Partial<{
      name: string;
      company: string;
      isActive: boolean;
      // Informations vendeur (structure embedded)
      vendorInfo: {
        address?: string;
        postalCode?: string;
        city?: string;
        country?: string;
        siret?: string;
        siren?: string;
        vatNumber?: string;
        nafCode?: string;
        legalForm?: string;
        capital?: string;
        registrationCity?: string;
        registrationNumber?: string;
      };
      // Contact (structure embedded)
      contact: {
        phone?: string;
        website?: string;
      };
      // Banque (structure embedded)
      banking: {
        bankName?: string;
        iban?: string;
        bic?: string;
      };
      // Branding (structure embedded)
      branding: {
        logoUrl?: string;
        primaryColor?: string;
        secondaryColor?: string;
      };
    }>,
  ) {
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .exec();
  }

  // Mettre à jour les informations vendeur
  async updateVendorInfo(
    id: string,
    vendorInfo: {
      address?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      siret?: string;
      siren?: string;
      vatNumber?: string;
      nafCode?: string;
      legalForm?: string;
      capital?: string;
      registrationCity?: string;
      registrationNumber?: string;
    },
  ) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { vendorInfo } },
        { new: true, upsert: false },
      )
      .select('-password')
      .exec();
  }

  // Mettre à jour les informations de contact
  async updateContact(
    id: string,
    contact: {
      phone?: string;
      website?: string;
    },
  ) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { contact } },
        { new: true, upsert: false },
      )
      .select('-password')
      .exec();
  }

  // Mettre à jour les informations bancaires
  async updateBanking(
    id: string,
    banking: {
      bankName?: string;
      iban?: string;
      bic?: string;
    },
  ) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { banking } },
        { new: true, upsert: false },
      )
      .select('-password')
      .exec();
  }

  // Mettre à jour le branding
  async updateBranding(
    id: string,
    branding: {
      logoUrl?: string;
      primaryColor?: string;
      secondaryColor?: string;
    },
  ) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { branding } },
        { new: true, upsert: false },
      )
      .select('-password')
      .exec();
  }

  // Obtenir tous les utilisateurs (pour admin)
  async findAll() {
    return this.userModel
      .find()
      .select('email name company role isActive createdAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Mettre à jour le dernier login
  async updateLastLogin(id: string) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: { lastLogin: new Date() },
          $inc: { loginCount: 1 },
        },
        { new: true },
      )
      .select('-password')
      .exec();
  }

  // Rechercher des utilisateurs
  async search(query: string) {
    return this.userModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } },
        ],
      })
      .select('email name company role isActive createdAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Compter les utilisateurs
  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  // Compter les utilisateurs actifs
  async countActive(): Promise<number> {
    return this.userModel.countDocuments({ isActive: true }).exec();
  }
}
