
'use client';

import type { InventoryItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScrollArea } from '../ui/scroll-area';

type InventoryDetailDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: InventoryItem | null;
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  value || value === 0 ? (
    <div className="grid grid-cols-1 gap-1 py-3 border-b sm:grid-cols-3 sm:gap-4">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2">{value}</dd>
    </div>
  ) : null
);

export function InventoryDetailDialog({ isOpen, onOpenChange, item }: InventoryDetailDialogProps) {
  if (!item) return null;
  
  const statusColor =
    item.status === 'En Stock' ? 'bg-chart-2' :
    item.status === 'Stock Bajo' ? 'bg-chart-4' :
    'bg-chart-1';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{item.product}</DialogTitle>
          <DialogDescription>
            Detalles completos del artículo de inventario.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <dl className="text-sm">
            <DetailRow label="Categoría" value={<Badge variant="secondary">{item.category}</Badge>} />
            <DetailRow label="Marca/Modelo" value={item.brandModel} />
            <DetailRow label="Cantidad" value={`${item.quantity} ${item.unit}`} />
            <DetailRow label="Cantidad Mínima" value={`${item.minimumQuantity} ${item.unit}`} />
            <DetailRow label="Estado" value={
                <div className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', statusColor)} />
                  <span>{item.status}</span>
                </div>
              } />
            <DetailRow label="Ubicación Principal" value={item.primaryLocation} />
            <DetailRow label="Ubicación Secundaria" value={item.secondaryLocation} />
            <DetailRow label="Persona Responsable" value={item.responsiblePerson} />
            <DetailRow label="Proveedor" value={item.supplier} />
            <DetailRow label="Fecha de Compra" value={format(parseISO(item.purchaseDate), 'PPP', { locale: es })} />
            <DetailRow label="Fecha de Vencimiento" value={item.expiryDate ? format(parseISO(item.expiryDate), 'PPP', { locale: es }) : 'N/A'} />
            <DetailRow label="Garantía" value={item.warrantyMonths ? `${item.warrantyMonths} meses` : 'N/A'} />
            <DetailRow label="Serie/Código" value={item.serialNumberCode || 'N/A'} />
            <DetailRow label="Última Actualización" value={format(parseISO(item.lastUpdated), 'PPP', { locale: es })} />
            <DetailRow label="Observaciones" value={<p className="whitespace-pre-wrap">{item.observations || 'Sin observaciones.'}</p>} />
          </dl>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
