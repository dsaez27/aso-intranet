'use client';

import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!user) {
      return (
        <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Esta es la información de tu cuenta. El cambio de contraseña se gestiona a través del proveedor de autenticación.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4 max-w-lg">
                <div className="space-y-1">
                    <Label htmlFor="username">Nombre de Usuario</Label>
                    <Input id="username" value={user.username} disabled />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="role">Rol</Label>
                    <Input id="role" value={user.role} disabled />
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>Elige cómo quieres que se vea la aplicación.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>
              Claro
            </Button>
            <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>
              Oscuro
            </Button>
            <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>
              Sistema
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
