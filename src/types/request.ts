import { z } from 'zod';

export const MaterialRequestSchema = z.object({
  id: z.string().optional(),
  requesterId: z.string(),
  requesterName: z.string(),
  itemId: z.string().min(1, "Debes seleccionar un artículo."),
  itemName: z.string(),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
  status: z.enum(['Pendiente', 'Aprobado', 'Rechazado']),
  requestDate: z.string(),
  resolutionDate: z.string().optional(),
  notes: z.string().optional(),
});

export type MaterialRequestFormData = z.infer<typeof MaterialRequestSchema>;
export type MaterialRequest = MaterialRequestFormData & { id: string };

export const RepairableItemEnum = z.enum(['Proyector', 'Cable VGA', 'Cable HDMI', 'Canaleta', 'Otro']);
export type RepairableItem = z.infer<typeof RepairableItemEnum>;

export const RepairRequestStatusEnum = z.enum(['Pendiente', 'En Progreso', 'Completado', 'Rechazado']);
export type RepairRequestStatus = z.infer<typeof RepairRequestStatusEnum>;

export const RepairRequestSchema = z.object({
  id: z.string().optional(),
  requesterId: z.string(),
  requesterName: z.string(),
  item: RepairableItemEnum,
  location: z.string().min(1, "La ubicación es obligatoria (ej. Sala 5B)."),
  description: z.string().min(1, "Debes describir el problema."),
  status: RepairRequestStatusEnum.default('Pendiente'),
  requestDate: z.string(),
  resolutionDate: z.string().optional(),
  notes: z.string().optional(),
});

export type RepairRequestFormData = z.infer<typeof RepairRequestSchema>;
export type RepairRequest = RepairRequestFormData & { id: string };
