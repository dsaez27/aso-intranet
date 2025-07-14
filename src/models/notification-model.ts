import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { AppNotification } from '@/types';

export interface INotification extends Omit<AppNotification, 'id'>, Document {}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  attachmentName: { type: String },
  attachmentType: { type: String },
  attachmentUrl: { type: String }, // Storing Data URI as a string
});

const NotificationModel: Model<INotification> = models.Notification || mongoose.model<INotification>('Notification', NotificationSchema, 'notifications');

export default NotificationModel;
