'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { InventoryItem, UserRole } from '@/types';
import { KpiCard } from '@/components/analytics/kpi-card';
import { Package, AlertTriangle, PackageX, Warehouse, MessageSquare, BarChart3, Users, LayoutGrid, FileText, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

type HomeDashboardProps = {
  items: InventoryItem[];
};

interface QuickLink {
  href: string;
  label: string;
  icon: React.ElementType;
  requiredRoles?: UserRole[];
}

const ALL_QUICK_LINKS: QuickLink[] = [
    { href: '/dashboard/inventory', label: 'Gestionar Inventario', icon: Warehouse },
    { href: '/dashboard/requests', label: 'Crear Solicitud', icon: FileText, requiredRoles: ['Docente', 'Asistente de la Educación', 'UTP o Coordinador Académico', 'Administrador General', 'Encargado de Bodega', 'Inspector General', 'Director'] },
    { href: '/dashboard/repairs', label: 'Soporte Técnico', icon: Wrench },
    { href: '/dashboard/analytics', label: 'Ver Analíticas', icon: BarChart3, requiredRoles: ['Administrador General', 'Encargado de Bodega', 'Inspector General', 'UTP o Coordinador Académico', 'Director'] },
    { href: '/dashboard/users', label: 'Administrar Usuarios', icon: Users, requiredRoles: ['Administrador General'] },
];

export function HomeDashboard({ items }: HomeDashboardProps) {
  const { user } = useAuth();
  
  const analyticsData = useMemo(() => {
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.status === 'Stock Bajo' || item.quantity <= item.minimumQuantity).length;
    const outOfStockItems = items.filter(item => item.status === 'Agotado').length;
    const uniqueCategories = new Set(items.map(item => item.category)).size;
    
    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      uniqueCategories,
    };
  }, [items]);

  const quickLinks = useMemo(() => {
    if (!user) return [];
    return ALL_QUICK_LINKS.filter(link => {
      if (!link.requiredRoles) return true;
      return link.requiredRoles.includes(user.role);
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Categorías Únicas"
          value={analyticsData.uniqueCategories.toLocaleString('es-ES')}
          icon={<LayoutGrid className="h-4 w-4 text-muted-foreground" />}
          animationDelay={0}
        />
        <KpiCard
          title="Artículos Totales"
          value={analyticsData.totalItems.toLocaleString('es-ES')}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          animationDelay={100}
        />
        <KpiCard
          title="Artículos con Stock Bajo"
          value={analyticsData.lowStockItems.toLocaleString('es-ES')}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          animationDelay={200}
        />
        <KpiCard
          title="Artículos Agotados"
          value={analyticsData.outOfStockItems.toLocaleString('es-ES')}
          icon={<PackageX className="h-4 w-4 text-muted-foreground" />}
          animationDelay={300}
        />
      </div>

      <Card className="animate-fade-in-up" style={{ animationDelay: `400ms` }}>
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickLinks.map((link, index) => (
            <Link key={link.href} href={link.href} passHref>
              <Button 
                variant="outline" 
                className="w-full h-20 flex-col gap-2 hover:-translate-y-1 hover:shadow-md animate-fade-in-up"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <link.icon className="w-6 h-6" />
                <span>{link.label}</span>
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="animate-fade-in-up" style={{ animationDelay: `1000ms` }}>
          <CardHeader>
              <CardTitle>Items con Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
              <ul className="space-y-2">
                  {items.filter(item => item.status === 'Stock Bajo' || item.status === 'Agotado').slice(0, 5).map(item => (
                      <li key={item.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/80 transition-colors duration-200">
                          <span>{item.product}</span>
                          <span className="font-bold">{item.quantity} {item.unit}</span>
                      </li>
                  ))}
                   {items.filter(item => item.status === 'Stock Bajo' || item.status === 'Agotado').length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No hay artículos con stock bajo.</p>
                  )}
              </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
