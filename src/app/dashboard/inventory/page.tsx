'use client';

import { useInventory } from '@/hooks/use-inventory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InventoryPage as InventoryPageComponent } from '@/components/inventory/inventory-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardInventoryPage() {
  const { loading } = useInventory();

  return (
    <Card className="-mx-4 h-[calc(100vh-8rem)] flex flex-col rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
      <CardHeader className="p-4 sm:p-6">
          <CardTitle>Gestión de Inventario</CardTitle>
          <CardDescription>
            Busca, agrega, edita y gestiona todos los artículos del inventario escolar.
          </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4 pt-0 sm:p-6 sm:pt-0">
        {loading ? (
            <div className="flex h-full flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <Skeleton className="h-10 w-full sm:w-1/3" />
                    <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-[150px]" />
                    </div>
                </div>
                <div className="relative flex-1 overflow-auto rounded-lg border">
                    <Skeleton className="h-full w-full" />
                </div>
            </div>
        ) : <InventoryPageComponent />}
      </CardContent>
    </Card>
  );
}
