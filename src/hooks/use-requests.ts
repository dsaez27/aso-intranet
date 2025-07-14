'use client';

import { useState, useMemo, useEffect, useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { MaterialRequest, MaterialRequestFormData } from '@/types';
import { MaterialRequestSchema } from '@/types';
import { getMaterialRequests, addMaterialRequest, updateMaterialRequestStatus } from '@/services/request-service';
import { updateItemQuantity, getItemById } from '@/services/inventory-service';
import { exportToCsv } from '@/lib/csv';
import { RequestContext } from '@/context/request-context';

export const useRequests = () => {
    const context = useContext(RequestContext);
    if (context === undefined) {
      throw new Error('useRequests must be used within a RequestProvider');
    }
    return context;
};

export const useRequestProvider = () => {
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedRequests = await getMaterialRequests();
      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Failed to fetch material requests:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar las solicitudes.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const form = useForm<MaterialRequestFormData>({
    resolver: zodResolver(MaterialRequestSchema),
    defaultValues: {
      requesterId: user?.id || '',
      requesterName: user?.username || '',
      itemId: '',
      itemName: '',
      quantity: 1,
      status: 'Pendiente',
      requestDate: new Date().toISOString(),
      notes: '',
    },
  });

  const handleSubmit = async (data: MaterialRequestFormData) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const item = await getItemById(data.itemId);
      if (!item) throw new Error("Item not found");

      if (data.quantity > item.quantity) {
        toast({
          variant: 'destructive',
          title: 'Cantidad insuficiente',
          description: `No hay suficiente stock para "${item.product}". Disponible: ${item.quantity}.`,
        });
        return;
      }
      
      const requestData = {
        ...data,
        requesterId: user.id,
        requesterName: user.username,
        itemName: item.product,
      };

      await addMaterialRequest(requestData);
      toast({ title: 'Éxito', description: 'Solicitud enviada correctamente.' });
      setIsFormOpen(false);
      fetchRequests();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo enviar la solicitud.' });
    }
  };

  const handleUpdateRequestStatus = async (id: string, status: 'Aprobado' | 'Rechazado') => {
    const originalRequests = [...requests];
    const updatedRequests = requests.map(r => r.id === id ? { ...r, status } : r);
    setRequests(updatedRequests);

    try {
        const requestToUpdate = requests.find(r => r.id === id);
        if (!requestToUpdate) throw new Error("Request not found");

        if (status === 'Aprobado') {
            const item = await getItemById(requestToUpdate.itemId);
            if (!item || item.quantity < requestToUpdate.quantity) {
                setRequests(originalRequests); // Revert optimistic update
                toast({ variant: 'destructive', title: 'Error de Stock', description: 'No hay suficiente stock para aprobar esta solicitud.' });
                return;
            }
            await updateItemQuantity(requestToUpdate.itemId, item.quantity - requestToUpdate.quantity);
        }

        await updateMaterialRequestStatus(id, status);
        toast({ title: 'Éxito', description: `Solicitud ${status.toLowerCase()}.` });
        fetchRequests(); // Refetch to get latest state
    } catch (error: any) {
        setRequests(originalRequests); // Revert optimistic update on error
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo actualizar la solicitud.' });
    }
  };

  const handleAddNew = () => {
    form.reset({
      requesterId: user?.id || '',
      requesterName: user?.username || '',
      itemId: '',
      itemName: '',
      quantity: 1,
      status: 'Pendiente',
      requestDate: new Date().toISOString(),
      notes: '',
    });
    setIsFormOpen(true);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const filteredRequests = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return requests.filter(req => 
        req.itemName.toLowerCase().includes(lowercasedQuery) ||
        req.requesterName.toLowerCase().includes(lowercasedQuery) ||
        req.status.toLowerCase().includes(lowercasedQuery)
    );
  }, [requests, searchQuery]);

  const displayRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

  const handleExport = () => {
    try {
      exportToCsv('solicitudes.csv', filteredRequests);
      toast({ title: 'Éxito', description: 'Solicitudes exportadas correctamente.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return {
    loading,
    requests,
    displayRequests,
    totalRequests: filteredRequests.length,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery: handleSearch,
    handleExport,
    isFormOpen,
    setIsFormOpen,
    form,
    handleAddNew,
    handleSubmit,
    handleUpdateRequestStatus,
  };
};