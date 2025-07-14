'use server';

import { connectToDatabase } from '@/lib/mongodb';
import RepairRequestModel from '@/models/repair-request-model';
import type { RepairRequest, RepairRequestFormData, RepairRequestStatus } from '@/types';
import type { Document } from 'mongoose';

// Helper para convertir el documento de Mongoose a un objeto plano y mapear _id a id.
function toPlainObject(doc: Document | null): any {
  if (!doc) return null;
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  // Convertir fechas a string ISO para evitar problemas de serialización
  for (const key in obj) {
    if (obj[key] instanceof Date) {
      obj[key] = obj[key].toISOString();
    }
  }
  return obj;
}

export async function getRepairRequests(): Promise<RepairRequest[]> {
  await connectToDatabase();
  const requests = await RepairRequestModel.find({}).sort({ requestDate: -1 });
  return requests.map(toPlainObject) as RepairRequest[];
}

export async function addRepairRequest(data: RepairRequestFormData): Promise<RepairRequest> {
  await connectToDatabase();
  const newRequest = new RepairRequestModel({
    ...data,
    requestDate: new Date(),
  });
  const savedRequest = await newRequest.save();
  return toPlainObject(savedRequest) as RepairRequest;
}

export async function updateRepairRequestStatus(id: string, status: RepairRequestStatus, notes?: string): Promise<void> {
  await connectToDatabase();

  const updateData: Partial<RepairRequest> = { status };
  if (notes) {
    updateData.notes = notes;
  }
  if (['Completado', 'Rechazado'].includes(status)) {
    updateData.resolutionDate = new Date().toISOString();
    if (status === 'Completado' && !notes) {
      updateData.notes = 'Reparación finalizada.';
    }
  }

  await RepairRequestModel.findByIdAndUpdate(id, { $set: updateData });
}
