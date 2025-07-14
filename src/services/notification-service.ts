'use server';

import { connectToDatabase } from '@/lib/mongodb';
import NotificationModel from '@/models/notification-model';
import type { AppNotification } from '@/types';
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

export async function getNotifications(): Promise<AppNotification[]> {
  await connectToDatabase();
  const notifications = await NotificationModel.find({}).sort({ timestamp: -1 }).limit(50);
  return notifications.map(toPlainObject) as AppNotification[];
}

export async function addNotification(
  data: Omit<AppNotification, 'id' | 'timestamp'>
): Promise<AppNotification> {
  await connectToDatabase();
  const newNotification = new NotificationModel({
    ...data,
    timestamp: new Date(),
  });
  const savedNotification = await newNotification.save();
  return toPlainObject(savedNotification) as AppNotification;
}

export async function deleteNotification(id: string): Promise<void> {
  await connectToDatabase();
  await NotificationModel.findByIdAndDelete(id);
}

export async function deleteAllNotifications(): Promise<void> {
  await connectToDatabase();
  await NotificationModel.deleteMany({});
}
