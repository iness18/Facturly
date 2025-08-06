import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// Sous-schémas pour les objets imbriqués
@Schema({ _id: false })
export class VendorInfo {
  @Prop()
  address?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  city?: string;

  @Prop({ default: 'France' })
  country?: string;

  @Prop()
  siret?: string;

  @Prop()
  siren?: string;

  @Prop()
  vatNumber?: string;

  @Prop()
  nafCode?: string;

  @Prop()
  legalForm?: string;

  @Prop()
  capital?: string;

  @Prop()
  registrationCity?: string;

  @Prop()
  registrationNumber?: string;
}

@Schema({ _id: false })
export class Contact {
  @Prop()
  phone?: string;

  @Prop()
  website?: string;
}

@Schema({ _id: false })
export class Banking {
  @Prop()
  bankName?: string;

  @Prop()
  iban?: string;

  @Prop()
  bic?: string;
}

@Schema({ _id: false })
export class Branding {
  @Prop()
  logoUrl?: string;

  @Prop({ default: '#8b5cf6' })
  primaryColor?: string;

  @Prop({ default: '#ec4899' })
  secondaryColor?: string;
}

// Schéma principal User
@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  company?: string;

  @Prop({
    required: true,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isBanned: boolean;

  @Prop()
  lastLogin?: Date;

  @Prop({ default: 0 })
  loginCount: number;

  // Objets imbriqués
  @Prop({ type: VendorInfo })
  vendorInfo?: VendorInfo;

  @Prop({ type: Contact })
  contact?: Contact;

  @Prop({ type: Banking })
  banking?: Banking;

  @Prop({ type: Branding })
  branding?: Branding;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index pour les performances
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });
