import { z } from 'zod';

export const InventoryItemSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, 'La categoría es obligatoria'),
  product: z.string().min(1, 'El nombre del producto es obligatorio'),
  brandModel: z.string().optional(),
  unit: z.string().min(1, 'La unidad es obligatoria'),
  quantity: z.coerce.number().min(0, 'La cantidad no puede ser negativa'),
  minimumQuantity: z.coerce.number().min(0, 'La cantidad mínima no puede ser negativa'),
  primaryLocation: z.string().min(1, 'La ubicación principal es obligatoria'),
  secondaryLocation: z.string().optional(),
  responsiblePerson: z.string().min(1, 'La persona responsable es obligatoria'),
  status: z.enum(['En Stock', 'Stock Bajo', 'Agotado']),
  purchaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Fecha inválida" }),
  expiryDate: z.string().optional(),
  warrantyMonths: z.coerce.number().min(0).optional(),
  serialNumberCode: z.string().optional(),
  supplier: z.string().min(1, 'El proveedor es obligatorio'),
  observations: z.string().optional(),
});

export type InventoryItemFormData = z.infer<typeof InventoryItemSchema>;
export type InventoryItem = InventoryItemFormData & { id: string; lastUpdated: string; };

export const inventoryItemColumns = [
  'id', 'category', 'product', 'brandModel', 'unit', 'quantity', 'minimumQuantity',
  'primaryLocation', 'secondaryLocation', 'responsiblePerson', 'status', 'purchaseDate',
  'expiryDate', 'warrantyMonths', 'serialNumberCode', 'supplier',
  'observations', 'lastUpdated'
] as const;

export type SortableColumn = Exclude<keyof InventoryItem, 'observations'>;
