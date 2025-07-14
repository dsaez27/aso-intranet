import { useMemo } from 'react';
import type { InventoryItem, MaterialRequest } from '@/types';
import { KpiCard } from './kpi-card';
import { CategoryChart } from './category-chart';
import { StatusChart } from './status-chart';
import { RequestStatusChart } from './request-status-chart';
import { Package, ClipboardList, UserCheck, FileText, LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type AnalyticsDashboardProps = {
  items: InventoryItem[];
  requests: MaterialRequest[];
};

export function AnalyticsDashboard({ items, requests }: AnalyticsDashboardProps) {
  const analyticsData = useMemo(() => {
    // Inventory Analytics
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.status === 'Stock Bajo' || item.quantity <= item.minimumQuantity).length;
    const uniqueCategories = new Set(items.map(item => item.category)).size;

    const categoryCounts = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryDistribution = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const inventoryStatusCounts: Record<string, number> = { 'En Stock': 0, 'Stock Bajo': 0, 'Agotado': 0 };
    for (const item of items) {
      if (item.status in inventoryStatusCounts) {
        inventoryStatusCounts[item.status]++;
      }
    }
    const inventoryStatusDistribution = Object.entries(inventoryStatusCounts).map(([status, count]) => ({ status, count }));

    // Request Analytics
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'Pendiente').length;
    const approvedRequests = requests.filter(r => r.status === 'Aprobado').length;

    const requestStatusCounts: Record<string, number> = { 'Pendiente': 0, 'Aprobado': 0, 'Rechazado': 0 };
    for (const req of requests) {
      if (req.status in requestStatusCounts) {
        requestStatusCounts[req.status]++;
      }
    }
    const requestStatusDistribution = Object.entries(requestStatusCounts).map(([status, count]) => ({ status, count }));

    const mostRequestedItems = requests
      .filter(r => r.status === 'Aprobado')
      .reduce((acc, req) => {
        acc[req.itemName] = (acc[req.itemName] || 0) + req.quantity;
        return acc;
      }, {} as Record<string, number>);

    const topFiveRequested = Object.entries(mostRequestedItems)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const userActivity = requests
      .reduce((acc, req) => {
        acc[req.requesterName] = (acc[req.requesterName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topFiveUsers = Object.entries(userActivity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      uniqueCategories,
      totalItems,
      lowStockItems,
      categoryDistribution,
      inventoryStatusDistribution,
      totalRequests,
      pendingRequests,
      approvedRequests,
      requestStatusDistribution,
      topFiveRequested,
      topFiveUsers,
    };
  }, [items, requests]);

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* KPIs */}
      <KpiCard
        title="Categorías Únicas"
        value={analyticsData.uniqueCategories.toLocaleString('es-ES')}
        icon={<LayoutGrid className="h-4 w-4 text-muted-foreground" />}
        description="Total de clasificaciones de productos."
      />
      <KpiCard
        title="Artículos Totales"
        value={analyticsData.totalItems.toLocaleString('es-ES')}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        description={`${analyticsData.lowStockItems} artículo(s) con stock bajo.`}
      />
      <KpiCard
        title="Solicitudes Totales"
        value={analyticsData.totalRequests.toLocaleString('es-ES')}
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        description={`${analyticsData.approvedRequests} aprobada(s) este periodo.`}
      />
      <KpiCard
        title="Solicitudes Pendientes"
        value={analyticsData.pendingRequests.toLocaleString('es-ES')}
        icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        description="Esperando acción del administrador."
      />

      {/* Charts and Lists */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Estado de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestStatusChart data={analyticsData.requestStatusDistribution} />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Distribución de Estados de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusChart data={analyticsData.inventoryStatusDistribution} />
        </CardContent>
      </Card>

       <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Productos más Solicitados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {analyticsData.topFiveRequested.length > 0 ? (
            analyticsData.topFiveRequested.map(item => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <p className="font-medium truncate flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    {item.name}
                </p>
                <Badge variant="secondary">{item.count} unidades</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-muted-foreground py-10">No hay datos de solicitudes aprobadas.</p>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Top 5 Usuarios Activos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {analyticsData.topFiveUsers.length > 0 ? (
            analyticsData.topFiveUsers.map(user => (
              <div key={user.name} className="flex justify-between items-center text-sm">
                <p className="font-medium truncate flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  {user.name}
                </p>
                <Badge variant="secondary">{user.count} solicitudes</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-muted-foreground py-10">No hay actividad de usuarios registrada.</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Artículos por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryChart data={analyticsData.categoryDistribution.map(d => ({ category: d.category, value: d.count }))} />
        </CardContent>
      </Card>
    </div>
  );
}
