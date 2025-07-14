import { format, parseISO } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import type { InventoryItem, SortableColumn } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type InventoryTableProps = {
  items: InventoryItem[];
  sortConfig: { key: SortableColumn; direction: 'ascending' | 'descending' } | null;
  deletingItemId: string | null;
  onSort: (key: SortableColumn) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onViewDetails: (item: InventoryItem) => void;
};

const columns: { key: SortableColumn; label: string }[] = [
  { key: 'product', label: 'Producto' },
  { key: 'category', label: 'Categoría' },
  { key: 'quantity', label: 'Cantidad' },
  { key: 'minimumQuantity', label: 'Cant. Mín.' },
  { key: 'status', label: 'Estado' },
  { key: 'expiryDate', label: 'Fecha de Venc.' },
  { key: 'lastUpdated', label: 'Últ. Act.' },
];

export function InventoryTable({ items, sortConfig, onSort, onEdit, onDelete, deletingItemId, onViewDetails }: InventoryTableProps) {
  const { user } = useAuth();
  const canManageInventory = user && ['Administrador General', 'Encargado de Bodega'].includes(user.role);

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-card">
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>
              <Button variant="ghost" onClick={() => onSort(column.key)}>
                {column.label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          ))}
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((item) => (
            <TableRow
              key={item.id}
              className={cn(
                'transition-all duration-300',
                deletingItemId === item.id ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
              )}
            >
              <TableCell className="font-medium">
                <button
                  type="button"
                  className="text-left hover:underline transition-all"
                  onClick={() => onViewDetails(item)}
                >
                  {item.product}
                </button>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.minimumQuantity}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      item.status === 'En Stock' && 'bg-chart-2',
                      item.status === 'Stock Bajo' && 'bg-chart-4',
                      item.status === 'Agotado' && 'bg-chart-1'
                    )}
                  />
                  <span>{item.status}</span>
                </div>
              </TableCell>
              <TableCell>
                {item.expiryDate
                  ? format(parseISO(item.expiryDate), 'PPP')
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {format(parseISO(item.lastUpdated), 'PPP')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {canManageInventory ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Sin acciones
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length + 1} className="h-24 text-center">
              No se encontraron artículos en el inventario.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
