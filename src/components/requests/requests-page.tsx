'use client';

import { useRequests } from '@/hooks/use-requests';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Plus, Download, Search } from 'lucide-react';
import { RequestsTable } from './requests-table';
import { RequestFormDialog } from './request-form-dialog';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';

export function RequestsPage() {
  const {
    displayRequests,
    totalRequests,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    handleExport,
    isFormOpen,
    form,
    handleAddNew,
    handleSubmit,
    setIsFormOpen,
    handleUpdateRequestStatus
  } = useRequests();
  const { user } = useAuth();
  
  const canRequest = user && ['Docente', 'Asistente de la Educación', 'UTP o Coordinador Académico', 'Administrador General', 'Encargado de Bodega'].includes(user.role);

  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por artículo, solicitante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
            {canRequest && (
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" /> Nueva Solicitud
              </Button>
            )}
        </div>
      </div>

      <RequestsTable
        requests={displayRequests}
        onUpdateRequestStatus={handleUpdateRequestStatus}
      />

      <Pagination
        totalItems={totalRequests}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <RequestFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={form.handleSubmit(handleSubmit)}
        form={form}
      />
    </div>
  );
}
