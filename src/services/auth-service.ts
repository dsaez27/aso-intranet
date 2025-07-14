'use server';

import { getUserByEmail } from './user-service';
import type { User } from '@/types';

// Este servicio maneja la lógica de autenticación.
// Compara la contraseña proporcionada con la almacenada en la base de datos.
// IMPORTANTE: La comparación de contraseñas aquí es simulada.
// Debes implementar una comparación segura usando bcrypt en un entorno real.

export async function loginUser(email: string, password: string): Promise<User | null> {
    try {
        const userWithHashedPassword = await getUserByEmail(email);
        
        // ===================================================================
        // AVISO DE SEGURIDAD IMPORTANTE
        // ===================================================================
        // La siguiente comprobación de contraseña es solo para fines de 
        // demostración. En una aplicación de producción, NUNCA debes 
        // almacenar o comparar contraseñas en texto plano.
        //
        // En su lugar, utiliza una biblioteca de hashing segura como `bcrypt`
        // para comparar la contraseña proporcionada con el hash almacenado.
        //
        // Ejemplo con bcrypt:
        // const match = await bcrypt.compare(password, user.passwordHash);
        // if (user && match) { ... }
        //
        // Para esta demo, simulamos el hash y la comparación.
        // ===================================================================
        const mockHashedPassword = `hashed_${password}`;

        if (userWithHashedPassword && (userWithHashedPassword as any).password === mockHashedPassword) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = userWithHashedPassword as any;
            return userWithoutPassword;
        }
        return null;
    } catch (error) {
        console.error("Login failed", error);
        return null;
    }
}
