'use server';

import { connectToDatabase } from '@/lib/mongodb';
import MaterialRequestModel from '@/models/material-request-model';
import type { MaterialRequest, MaterialRequestFormData } from '@/types';
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


export async function getMaterialRequests(): Promise<MaterialRequest[]> {
  await connectToDatabase();
  const requests = await MaterialRequestModel.find({}).sort({ requestDate: -1 });
  return requests.map(toPlainObject) as MaterialRequest[];
}

export async function addMaterialRequest(data: MaterialRequestFormData): Promise<MaterialRequest> {
  await connectToDatabase();
  const newRequest = new MaterialRequestModel({
    ...data,
    requestDate: new Date(),
  });
  const savedRequest = await newRequest.save();
  return toPlainObject(savedRequest) as MaterialRequest;
}

export async function updateMaterialRequestStatus(id: string, status: 'Aprobado' | 'Rechazado', notes?: string): Promise<void> {
  await connectToDatabase();

  const updateData: Partial<MaterialRequest> = { status }; if (notes) {
    updateData.notes = notes;
  }
  if (['Aprobado', 'Rechazado'].includes(status)) {
    updateData.resolutionDate = new Date().toISOString();
  }

  await MaterialRequestModel.findByIdAndUpdate(id, { $set: updateData });
}
