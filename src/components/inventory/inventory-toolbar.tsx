'use client';

import { Button } from '@/components/ui/button';
import { Plus, Download, Search, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { useCsvImport } from '@/hooks/use-csv-import';
import { useInventory } from '@/hooks/use-inventory';

type InventoryToolbarProps = {
  onAdd: () => void;
  onExport: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export function InventoryToolbar({ onAdd, onExport, searchQuery, onSearchChange }: InventoryToolbarProps) {
  const { user } = useAuth();
  const { fetchItems: refetchInventory } = useInventory();
  const { importTrigger, handleFileChange, fileInputRef } = useCsvImport({ onImportSuccess: refetchInventory });
  
  const canManageInventory = user && ['Administrador General', 'Encargado de Bodega'].includes(user.role);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div className="flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Busca por producto, marca, proveedor..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="outline" onClick={importTrigger} disabled={!canManageInventory}>
            <Upload className="mr-2 h-4 w-4" /> Importar CSV
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
          <Button onClick={onAdd} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={!canManageInventory}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Artículo
          </Button>
        </div>
      </div>
    </div>
  );
}
