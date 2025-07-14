import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { User, UserRole } from '@/types';

const UserRoleEnum: UserRole[] = [
  'Administrador General',
  'Encargado de Bodega',
  'Inspector General',
  'Docente',
  'Asistente de la Educación',
  'UTP o Coordinador Académico',
  'Director',
];

export interface IUser extends Omit<User, 'id'>, Document {
  password?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // No se devuelve por defecto
  role: { type: String, enum: UserRoleEnum, required: true },
});

const UserModel: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema, 'users');

export default UserModel;
