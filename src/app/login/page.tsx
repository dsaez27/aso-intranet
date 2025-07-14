'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // La redirección de usuarios ya autenticados es manejada por el middleware.
  // Ya no se necesita un useEffect aquí para esa tarea.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    
    if (success) {
      // Forzar redirección al dashboard después de un inicio de sesión exitoso.
      // El middleware se encargará de las futuras visitas.
      router.replace('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Inicio de Sesión Fallido',
        description: 'Email o contraseña incorrectos.',
      });
      setIsSubmitting(false);
    }
  };
  
  // Muestra un loader mientras el contexto de autenticación se inicializa.
  if (loading) {
    return (
       <div className="flex h-screen items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin" />
       </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen">
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto w-full max-w-sm border-none shadow-none sm:border sm:shadow-sm animate-fade-in-up">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 hover:scale-110">
              <Flame className="h-7 w-7" />
            </div>
            <CardTitle>Escuela Angelina Salas Olivares</CardTitle>
            <CardDescription>
              Sistema de Gestión de Inventario
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ej. admin@escuela.test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="ej. password123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Iniciar Sesión
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
