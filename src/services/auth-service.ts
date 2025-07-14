'use server';

import { getUserByEmail } from './user-service';
import type { User } from '@/types';

// Este servicio maneja la lógica de autenticación.
// Compara la contraseña proporcionada con la almacenada en la base de datos.
// IMPORTANTE: La comparación de contraseñas aquí es simulada.
// Debes implementar una comparación segura usando bcrypt en un entorno real.

export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    console.log('Auth service - attempting login for:', email); // Debug
    const userWithHashedPassword = await getUserByEmail(email);
    console.log('Auth service - user found:', userWithHashedPassword); // Debug
    
    if (!userWithHashedPassword) {
      console.log('Auth service - no user found'); // Debug
      return null;
    }
    
    const mockHashedPassword = `hashed_${password}`;
    console.log('Auth service - comparing passwords:', { 
      provided: mockHashedPassword, 
      stored: (userWithHashedPassword as any)?.password 
    }); // Debug

    if ((userWithHashedPassword as any).password === mockHashedPassword) {
      const { password: _, ...userWithoutPassword } = userWithHashedPassword as any;
      console.log('Auth service - login successful for user:', userWithoutPassword); // Debug
      return userWithoutPassword;
    }
    
    console.log('Auth service - password mismatch'); // Debug
    return null;
  } catch (error) {
    console.error("Auth service - login failed:", error);
    return null;
  }
}
