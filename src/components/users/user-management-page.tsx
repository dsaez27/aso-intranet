'use client';

import { useUsers } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import { Plus, Download, Search } from 'lucide-react';
import { UserTable } from './user-table';
import { UserFormDialog } from './user-form-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';

export function UserManagementPage() {
  const {
    paginatedUsers,
    totalUsers,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    searchQuery,
    handleSearchChange,
    handleExport,
    deletingUserId,
    form,
    isFormOpen,
    isDeleteConfirmOpen,
    entityToDelete,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    setIsFormOpen,
    setIsDeleteConfirmOpen,
    onSubmit,
  } = useUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre o rol..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Usuario
          </Button>
        </div>
      </div>
      
      <UserTable
        users={paginatedUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingUserId={deletingUserId}
      />

      <Pagination
        totalItems={totalUsers}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <UserFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
        isEditing={!!form.getValues().id}
      />

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario
              "{entityToDelete?.username}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
