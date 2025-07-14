'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useInventory } from '@/hooks/use-inventory';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardHomePage() {
  const { items, loading: inventoryLoading } = useInventory();

  const HomeDashboard = useMemo(() => dynamic(
    () => import('@/components/home/home-dashboard').then(mod => mod.HomeDashboard),
    {
      ssr: false,
      loading: () => (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-48" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      ),
    }
  ), []);
  
  if (inventoryLoading) {
      return (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-48" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      );
  }

  return <HomeDashboard items={items} />;
}
