import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { USER_SESSION_KEY } from './context/auth-context';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(USER_SESSION_KEY);
  const { pathname } = request.nextUrl;

  const loginUrl = new URL('/login', request.url);
  const dashboardUrl = new URL('/dashboard', request.url);

  // Si el usuario está autenticado (tiene la cookie)
  if (sessionCookie) {
    // Y está intentando acceder a /login o a la página raíz,
    // redirigirlo al dashboard.
    if (pathname === '/login' || pathname === '/') {
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Si el usuario NO está autenticado (no tiene la cookie)
  if (!sessionCookie) {
    // Y está intentando acceder a cualquier ruta del dashboard,
    // redirigirlo a la página de login.
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(loginUrl);
    }
    // Si el usuario no autenticado está en la raíz, redirigirlo a login.
    if (pathname === '/') {
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si ninguna de las condiciones anteriores se cumple, permitir el acceso.
  return NextResponse.next();
}

// Configuración del matcher:
// Esto asegura que el middleware se ejecute en las rutas especificadas.
export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
  ],
};
