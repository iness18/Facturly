import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

// Sous-schéma pour les items de facture
@Schema({ _id: false })
export class InvoiceItem {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalPrice: number;
}

// Sous-schéma pour le client embedded (snapshot)
@Schema({ _id: false })
export class EmbeddedClient {
  @Prop({ required: true, type: Types.ObjectId })
  _id: Types.ObjectId; // Référence vers le client original

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  country?: string;

  @Prop()
  siret?: string;
}

// Schéma principal Invoice
@Schema({
  timestamps: true,
  collection: 'invoices',
})
export class Invoice {
  @Prop({ required: true, unique: true })
  invoiceNumber: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  // Client embedded (snapshot au moment de la facture)
  @Prop({ required: true, type: EmbeddedClient })
  client: EmbeddedClient;

  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 0 })
  taxAmount: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    required: true,
    enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'],
    default: 'DRAFT',
  })
  status: string;

  // Items embedded
  @Prop({ type: [InvoiceItem], default: [] })
  items: InvoiceItem[];

  @Prop({ required: true, default: () => new Date() })
  issueDate: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop()
  paidDate?: Date;

  @Prop()
  notes?: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Index pour les performances
InvoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ userId: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ issueDate: -1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ 'client._id': 1 });
InvoiceSchema.index({ totalAmount: 1 });
InvoiceSchema.index({ createdAt: -1 });

// Index composé pour les requêtes fréquentes
InvoiceSchema.index({ userId: 1, status: 1 });
InvoiceSchema.index({ userId: 1, issueDate: -1 });
