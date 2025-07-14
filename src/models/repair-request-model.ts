import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { RepairRequest, RepairableItem, RepairRequestStatus } from '@/types';

const RepairableItemEnum: RepairableItem[] = ['Proyector', 'Cable VGA', 'Cable HDMI', 'Canaleta', 'Otro'];
const RepairRequestStatusEnum: RepairRequestStatus[] = ['Pendiente', 'En Progreso', 'Completado', 'Rechazado'];

export interface IRepairRequest extends Omit<RepairRequest, 'id'>, Document {}

const RepairRequestSchema: Schema = new Schema({
  requesterId: { type: String, required: true },
  requesterName: { type: String, required: true },
  item: { type: String, enum: RepairableItemEnum, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: RepairRequestStatusEnum, required: true, default: 'Pendiente' },
  requestDate: { type: Date, required: true },
  resolutionDate: { type: Date },
  notes: { type: String, default: '' },
});

const RepairRequestModel: Model<IRepairRequest> = models.RepairRequest || mongoose.model<IRepairRequest>('RepairRequest', RepairRequestSchema, 'repairRequests');

export default RepairRequestModel;
