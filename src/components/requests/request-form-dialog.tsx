'use client';

import { UseFormReturn } from 'react-hook-form';
import { MaterialRequestFormData } from '@/types';
import { useInventory } from '@/hooks/use-inventory';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

type RequestFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  form: UseFormReturn<MaterialRequestFormData>;
};

export function RequestFormDialog({ isOpen, onOpenChange, onSubmit, form }: RequestFormDialogProps) {
  const { items: inventoryItems } = useInventory();
  const availableItems = inventoryItems.filter(item => item.quantity > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Solicitud de Material</DialogTitle>
          <DialogDescription>
            Selecciona un artículo y la cantidad que deseas solicitar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              name="itemId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artículo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar un artículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableItems.length > 0 ? (
                        availableItems.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.product} ({item.quantity} {item.unit} disp.)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="-" disabled>No hay artículos con stock</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="quantity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl><Input type="number" {...field} min={1} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="notes"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (Opcional)</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Ej: Para la clase de ciencias del 5º B" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Enviar Solicitud
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
