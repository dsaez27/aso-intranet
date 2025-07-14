import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { InventoryItem } from '@/types';

export interface IInventoryItem extends Omit<InventoryItem, 'id'>, Document {}

const InventorySchema: Schema = new Schema({
  category: { type: String, required: true },
  product: { type: String, required: true },
  brandModel: { type: String, default: '' },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  minimumQuantity: { type: Number, required: true, min: 0 },
  primaryLocation: { type: String, required: true },
  secondaryLocation: { type: String, default: '' },
  responsiblePerson: { type: String, required: true },
  status: { type: String, enum: ['En Stock', 'Stock Bajo', 'Agotado'], required: true },
  purchaseDate: { type: Date, required: true },
  expiryDate: { type: Date },
  warrantyMonths: { type: Number, min: 0 },
  serialNumberCode: { type: String, default: '' },
  supplier: { type: String, required: true },
  observations: { type: String, default: '' },
  lastUpdated: { type: Date, required: true },
});

// Para evitar recompilar el modelo en cada hot-reload en desarrollo
const InventoryModel: Model<IInventoryItem> = models.InventoryItem || mongoose.model<IInventoryItem>('InventoryItem', InventorySchema, 'inventory');

export default InventoryModel;
