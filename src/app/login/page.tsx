"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario ya está logueado, redirige al dashboard.
    // Esto evita que un usuario logueado vea la página de login.
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);

    if (success) router.replace("/dashboard");

    if (!success) {
      toast({
        variant: "destructive",
        title: "Inicio de Sesión Fallido",
        description: "Email o contraseña incorrectos.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen">
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto w-full max-w-sm border-none shadow-none sm:border sm:shadow-sm animate-fade-in-up">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 hover:scale-110">
              <Flame className="h-7 w-7" />
            </div>
            <CardTitle>Escuela Angelina Salas Olivares</CardTitle>
            <CardDescription>Sistema de Gestión de Inventario</CardDescription>
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Iniciar Sesión
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
