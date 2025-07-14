'use server';

import mongoose, { Mongoose } from 'mongoose';

// ===================================================================
// INSTRUCCIONES DE CONEXIÓN A LA BASE DE DATOS
// ===================================================================
// 1. Obtén tu cadena de conexión de MongoDB Atlas.
// 2. Crea un archivo llamado `.env` en la raíz de tu proyecto
//    (al mismo nivel que `package.json`).
// 3. Dentro de `.env`, añade tu cadena de conexión a la variable
//    `MONGODB_URI`.
//
//    Ejemplo de contenido para el archivo .env:
//    MONGODB_URI="mongodb+srv://<username>:<password>@cluster-name.mongodb.net/your-db-name?retryWrites=true&w=majority"
//
// 4. Asegúrate de que la cadena de conexión incluya el nombre de la
//    base de datos que deseas usar (reemplaza `your-db-name`).
// ===================================================================

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, define la variable de entorno MONGODB_URI dentro de .env'
  );
}

/**
 * Caché global para la conexión de Mongoose. Esto evita crear una nueva conexión
 * en cada invocación de una Server Action en Next.js, lo cual es más eficiente.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Establece una conexión con la base de datos.
 * Si ya existe una conexión en caché, la reutiliza.
 * @returns {Promise<Mongoose>} Una promesa que se resuelve en la instancia de Mongoose.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // En caso de error, limpia la promesa para reintentar la conexión la próxima vez.
    throw e;
  }
  
  return cached.conn;
}
