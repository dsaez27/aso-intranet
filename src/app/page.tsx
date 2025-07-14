'use client';

import { Skeleton } from '@/components/ui/skeleton';

// La lógica de redirección ahora es manejada por el middleware.
// Esta página solo mostrará un esqueleto de carga mientras el middleware
// decide a dónde redirigir al usuario.
export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
