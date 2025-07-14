import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { USER_SESSION_KEY } from './context/auth-context';

// Este middleware se ejecuta en el servidor antes de cada solicitud.
// Su propósito es proteger las rutas del dashboard, asegurando que solo
// los usuarios autenticados puedan acceder a ellas.

export function middleware(request: NextRequest) {
  // 1. Obtiene la URL de inicio de sesión.
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';

  // 2. Extrae la cookie de sesión del usuario de la solicitud.
  const sessionCookie = request.cookies.get(USER_SESSION_KEY);

  // 3. Define la ruta que estamos protegiendo (todas las sub-rutas de /dashboard).
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // Lógica de redirección:
  // Si el usuario intenta acceder a una ruta del dashboard SIN una cookie de sesión,
  // se le redirige a la página de inicio de sesión.
  if (isDashboardRoute && !sessionCookie) {
    return NextResponse.redirect(loginUrl);
  }

  // 4. Si la comprobación pasa, permite que la solicitud continúe.
  return NextResponse.next();
}

// Configuración del matcher:
// Esto asegura que el middleware solo se ejecute en las rutas especificadas,
// lo cual es más eficiente que ejecutarlo en todas las solicitudes.
export const config = {
  matcher: [
    // Aplica el middleware a todas las rutas dentro de /dashboard
    '/dashboard/:path*',
    // Excluye las rutas que no necesitan protección (ej. archivos estáticos, API, etc.)
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
