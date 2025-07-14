'use client';

import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useInventory } from '@/hooks/use-inventory';
import { useRequests } from '@/hooks/use-requests';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const { items: inventoryData, loading: inventoryLoading } = useInventory();
  const { requests, loading: requestsLoading } = useRequests();
  const router = useRouter();

  const loading = authLoading || inventoryLoading || requestsLoading;

  if (loading) {
     return (
        <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
          <CardHeader className="p-4 sm:p-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-[350px] md:col-span-2" />
              <Skeleton className="h-[350px] md:col-span-2" />
              <Skeleton className="h-[350px] md:col-span-2" />
              <Skeleton className="h-[350px] md:col-span-2" />
              <Skeleton className="h-[350px] md:col-span-2 lg:col-span-4" />
            </div>
          </CardContent>
        </Card>
      );
  }

  // The route protection is handled in the layout, but this is an extra layer
  if (!user || !['Administrador General', 'Encargado de Bodega', 'Inspector General', 'UTP o Coordinador Académico', 'Director'].includes(user.role)) {
      router.replace('/dashboard');
      return null;
  }

  return (
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Análisis de Inventario</CardTitle>
        <CardDescription>
          Visualiza métricas y tendencias clave de tu inventario, solicitudes y actividad de usuarios.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <AnalyticsDashboard items={inventoryData} requests={requests} />
      </CardContent>
    </Card>
  );
}
