'use server';

import { connectToDatabase } from '@/lib/mongodb';
import InventoryModel from '@/models/inventory-model';
import type { InventoryItem, InventoryItemFormData } from '@/types';
import type { Document } from 'mongoose';

// Este servicio interactúa con la colección 'inventory' en MongoDB usando Mongoose.
// Asegúrate de que tu base de datos esté poblada con datos si esperas ver resultados.

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


export async function getItems(): Promise<InventoryItem[]> {
  await connectToDatabase();
  const items = await InventoryModel.find({}).sort({ lastUpdated: -1 });
  return items.map(toPlainObject) as InventoryItem[];
}

export async function getItemById(id: string): Promise<InventoryItem | null> {
  await connectToDatabase();
  const item = await InventoryModel.findById(id);
  return toPlainObject(item) as InventoryItem | null;
}

export async function addItem(data: InventoryItemFormData): Promise<InventoryItem> {
  await connectToDatabase();
  const newItem = new InventoryModel({
    ...data,
    lastUpdated: new Date(),
  });
  const savedItem = await newItem.save();
  return toPlainObject(savedItem) as InventoryItem;
}

export async function updateItem(id: string, data: InventoryItemFormData): Promise<void> {
  await connectToDatabase();
  await InventoryModel.findByIdAndUpdate(id, { ...data, lastUpdated: new Date() });
}

export async function updateItemQuantity(id: string, newQuantity: number): Promise<void> {
  await connectToDatabase();
  const item = await InventoryModel.findById(id);
  if (!item) throw new Error('Item not found');

  let newStatus = item.status;
  if (newQuantity <= 0) {
    newStatus = 'Agotado';
  } else if (newQuantity <= item.minimumQuantity) {
    newStatus = 'Stock Bajo';
  } else {
    newStatus = 'En Stock';
  }

  await InventoryModel.findByIdAndUpdate(id, {
    quantity: newQuantity,
    status: newStatus,
    lastUpdated: new Date(),
  });
}

export async function deleteItem(id: string): Promise<void> {
  await connectToDatabase();
  await InventoryModel.findByIdAndDelete(id);
}

export async function importFromCsv(csvContent: string): Promise<void> {
  await connectToDatabase();
  try {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      throw new Error('El archivo CSV está vacío o solo contiene la cabecera.');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    const newItemsData = lines.slice(1).map(line => {
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/"/g, ''));
      const itemData: any = {};
      headers.forEach((header, index) => {
        const key = header as keyof InventoryItem;
        // Ignorar el ID del CSV, ya que MongoDB generará uno nuevo
        if (key === 'id') return;
        
        let value: any = values[index];
        // Convertir a número si corresponde
        if (key === 'quantity' || key === 'minimumQuantity' || key === 'warrantyMonths') {
          value = Number(value) || 0;
        }
        // Convertir a fecha si corresponde
        if ((key === 'purchaseDate' || key === 'expiryDate') && value) {
            value = new Date(value);
        }

        itemData[key] = value;
      });
      // Asegurarse de que los campos obligatorios tengan valores por defecto si no están en el CSV
      return {
        ...itemData,
        status: itemData.status || 'En Stock',
        lastUpdated: new Date(),
      };
    });

    if (newItemsData.length > 0) {
      await InventoryModel.insertMany(newItemsData, { ordered: false });
    }
  } catch (error) {
    console.error('Error al procesar el archivo CSV en el servidor:', error);
    throw new Error('Error al analizar el archivo CSV. Por favor, revisa el formato del archivo y los datos.');
  }
}
