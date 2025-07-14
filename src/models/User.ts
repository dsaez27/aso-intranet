import mongoose, { Schema, Document } from 'mongoose';
import type { UserRole, User as UserType } from '../types/user';

interface IUser extends Document {
  username: string;
  email: string;
  role: UserRole;
}

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: [
    'Administrador General',
    'Encargado de Bodega',
    'Inspector General',
    'Docente',
    'Asistente de la Educación',
    'UTP o Coordinador Académico',
    'Director'
  ]},
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
