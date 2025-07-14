import { z } from 'zod';

export const UserRole = z.enum([
  'Administrador General',
  'Encargado de Bodega',
  'Inspector General',
  'Docente',
  'Asistente de la Educación',
  'UTP o Coordinador Académico',
  'Director',
]);

export type UserRole = z.infer<typeof UserRole>;

export const roleDisplayNames: Record<UserRole, string> = {
  'Administrador General': 'Administrador General',
  'Encargado de Bodega': 'Encargado de Bodega',
  'Inspector General': 'Inspector General',
  'Docente': 'Docente',
  'Asistente de la Educación': 'Asistente de la Educación',
  'UTP o Coordinador Académico': 'UTP o Coordinador Académico',
  'Director': 'Director',
};

export const UserSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Debe ser un correo electrónico válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  role: UserRole,
}).refine(data => {
    // Si no hay un ID (es un usuario nuevo), la contraseña es obligatoria.
    if (!data.id && !data.password) {
        return false;
    }
    return true;
}, {
    message: "La contraseña es obligatoria para nuevos usuarios.",
    path: ["password"],
});


export type UserFormData = z.infer<typeof UserSchema>;

export interface User {
  id: string; 
  username: string;
  email: string;
  role: UserRole;
}
