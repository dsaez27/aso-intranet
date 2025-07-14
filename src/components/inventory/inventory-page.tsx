'use client';

import { InventoryToolbar } from './inventory-toolbar';
import { InventoryTable } from './inventory-table';
import { useInventory } from '@/hooks/use-inventory';
import { InventoryFormDialog } from './inventory-form-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Pagination } from '@/components/ui/pagination';
import { InventoryDetailDialog } from './inventory-detail-dialog';

export function InventoryPage() {
  const {
    displayItems,
    totalFilteredItems,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    sortConfig,
    searchQuery,
    setSearchQuery,
    handleSort,
    handleExport,
    deletingItemId,
    itemToView,
    isDetailOpen,
    handleViewDetails,
    setIsDetailOpen,
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
  } = useInventory();

  return (
    <div className="flex h-full flex-col gap-6">
      <InventoryToolbar
        onAdd={handleAddNew}
        onExport={handleExport}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="relative flex-1 overflow-auto rounded-lg border">
        <InventoryTable
          items={displayItems}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deletingItemId={deletingItemId}
          onViewDetails={handleViewDetails}
        />
      </div>

      <Pagination
        totalItems={totalFilteredItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <InventoryFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
        isEditing={!!form.getValues().id}
      />

      <InventoryDetailDialog
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        item={itemToView}
      />
      
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo
              "{entityToDelete?.product}".
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
