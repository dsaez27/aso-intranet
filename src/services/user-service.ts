'use server';

import { connectToDatabase } from '@/lib/mongodb';
import UserModel from '@/models/user-model';
import type { User, UserFormData } from '@/types';
import type { Document } from 'mongoose';

// Este servicio interactúa con la colección 'users' en MongoDB usando Mongoose.
// Para poder iniciar sesión, necesitarás crear al menos un usuario
// en tu base de datos. Puedes hacerlo manualmente en MongoDB Atlas
// o creando un script de inicialización.
// La contraseña se guarda hasheada (simulado aquí), no en texto plano.

// En una aplicación real, usa una librería de hashing segura como bcrypt
async function mockHashPassword(password: string): Promise<string> {
  // Esto es solo para demostración. ¡NO USAR EN PRODUCCIÓN!
  // Reemplaza esto con `bcrypt.hash(password, saltRounds)`
  return `hashed_${password}`;
}

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

export async function getUsers(): Promise<User[]> {
  await connectToDatabase();
  const users = await UserModel.find({}).select('-password'); // Excluye la contraseña
  return users.map(toPlainObject) as User[];
}

export async function getUserByEmail(email: string): Promise<(User & { password?: string }) | null> {
  await connectToDatabase();
  const user = await UserModel.findOne({ email }).select('+password'); // Incluye la contraseña para la validación
  if (!user) return null;
  
  return toPlainObject(user) as (User & { password?: string });
}


export async function addUser(data: UserFormData): Promise<User> {
  await connectToDatabase();
  if (!data.password) {
    throw new Error('Password is required to create a new user.');
  }

  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  const hashedPassword = await mockHashPassword(data.password);

  const newUser = new UserModel({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  });
  const savedUser = await newUser.save();
  const userObject = toPlainObject(savedUser);
  delete userObject.password; // No devolver la contraseña
  return userObject as User;
}

export async function updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
  await connectToDatabase();
  // El password no se puede actualizar a través de esta función
  const { password, ...updateData } = data;

  const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  if (!updatedUser) {
    throw new Error('User not found or failed to update');
  }
  return toPlainObject(updatedUser) as User;
}

export async function deleteUser(id: string): Promise<void> {
  await connectToDatabase();
  await UserModel.findByIdAndDelete(id);
}

export async function getAllUsers(): Promise<User[]> {
  await connectToDatabase();
  const users = await UserModel.find({}).select('-password'); // Excluye la contraseña
  return users.map(toPlainObject) as User[];
}