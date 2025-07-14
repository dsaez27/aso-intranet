import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { MaterialRequest } from '@/types';

export interface IMaterialRequest extends Omit<MaterialRequest, 'id'>, Document {}

const MaterialRequestSchema: Schema = new Schema({
  requesterId: { type: String, required: true },
  requesterName: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['Pendiente', 'Aprobado', 'Rechazado'], required: true },
  requestDate: { type: Date, required: true },
  resolutionDate: { type: Date },
  notes: { type: String, default: '' },
});

const MaterialRequestModel: Model<IMaterialRequest> = models.MaterialRequest || mongoose.model<IMaterialRequest>('MaterialRequest', MaterialRequestSchema, 'materialRequests');

export default MaterialRequestModel;
