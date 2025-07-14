'use client';

import { useState } from 'react';
import type { UseFormReturn, FieldValues, DeepPartial } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

interface UseEntityFormProps<TFormData extends FieldValues, TEntity extends { id: string }> {
  schema: z.ZodType<TFormData>;
  defaultValues: DeepPartial<TFormData>;
  entityApi: {
    add: (data: TFormData) => Promise<any>;
    update: (id: string, data: TFormData) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  refetch: () => void;
}

export function useEntityForm<TFormData extends FieldValues, TEntity extends { id: string }>({
  schema,
  defaultValues,
  entityApi,
  onSuccess,
  onError,
  refetch,
}: UseEntityFormProps<TFormData, TEntity>) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<TEntity | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const form: UseFormReturn<TFormData> = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: TFormData) => {
    try {
      const entityId = data.id as string | undefined;
      if (entityId) {
        await entityApi.update(entityId, data);
        onSuccess('Entidad actualizada correctamente.');
      } else {
        await entityApi.add(data);
        onSuccess('Entidad agregada correctamente.');
      }
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      onError(error.message || 'No se pudo guardar la entidad.');
    }
  };

  const handleAddNew = () => {
    form.reset(defaultValues);
    setIsFormOpen(true);
  };

  const handleEdit = (entity: TEntity) => {
    form.reset(entity as DeepPartial<TFormData>);
    setIsFormOpen(true);
  };

  const handleDelete = (entity: TEntity) => {
    setEntityToDelete(entity);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (entityToDelete) {
      setDeletingItemId(entityToDelete.id);
      setIsDeleteConfirmOpen(false);
      try {
        await entityApi.delete(entityToDelete.id);
        onSuccess('Entidad eliminada.');
        refetch();
      } catch (error: any) {
        onError(error.message || 'No se pudo eliminar la entidad.');
      } finally {
        setEntityToDelete(null);
        setDeletingItemId(null);
      }
    }
  };

  return {
    form,
    isFormOpen,
    setIsFormOpen,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    entityToDelete,
    deletingItemId,
    onSubmit,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  };
}
