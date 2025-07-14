'use client';

import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { importFromCsv } from '@/services/inventory-service';

type UseCsvImportProps = {
  onImportSuccess?: () => void;
};

export function useCsvImport({ onImportSuccess }: UseCsvImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Resetea el input para permitir cargar el mismo archivo de nuevo
    event.target.value = '';

    toast({
      title: 'Importando...',
      description: 'Por favor espera mientras se procesa el archivo CSV.',
    });

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const csvContent = e.target?.result as string;
        await importFromCsv(csvContent);
        toast({
          title: 'Éxito',
          description: 'Los datos del CSV se han importado correctamente.',
        });
        onImportSuccess?.();
      } catch (error: any) {
        console.error('Error during CSV import:', error);
        toast({
          variant: 'destructive',
          title: 'Error de Importación',
          description: error.message || 'No se pudo importar el archivo CSV.',
        });
      }
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error de Lectura',
            description: 'No se pudo leer el archivo seleccionado.',
        });
    };
    reader.readAsText(file);
  };

  const importTrigger = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    importTrigger,
    handleFileChange,
  };
}
