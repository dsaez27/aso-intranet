'use client';

import { useState, useMemo, useEffect, useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { RepairRequest, RepairRequestFormData, RepairRequestStatus } from '@/types';
import { RepairRequestSchema } from '@/types';
import { getRepairRequests, addRepairRequest, updateRepairRequestStatus } from '@/services/repair-request-service';
import { exportToCsv } from '@/lib/csv';
import { RepairRequestContext } from '@/context/repair-request-context';


export const useRepairRequests = () => {
    const context = useContext(RepairRequestContext);
    if (context === undefined) {
      throw new Error('useRepairRequests must be used within a RepairRequestProvider');
    }
    return context;
};

export const useRepairRequestProvider = () => {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
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
      const fetchedRequests = await getRepairRequests();
      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Failed to fetch repair requests:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar las solicitudes de soporte.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const form = useForm<RepairRequestFormData>({
    resolver: zodResolver(RepairRequestSchema),
    defaultValues: {
      requesterId: user?.id || '',
      requesterName: user?.username || '',
      item: 'Otro',
      location: '',
      description: '',
      status: 'Pendiente',
      requestDate: new Date().toISOString(),
      notes: '',
    },
  });

  const handleSubmit = async (data: RepairRequestFormData) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const requestData = {
        ...data,
        requesterId: user.id,
        requesterName: user.username,
      };

      await addRepairRequest(requestData);
      toast({ title: 'Éxito', description: 'Solicitud de soporte enviada correctamente.' });
      setIsFormOpen(false);
      fetchRequests();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo enviar la solicitud.' });
    }
  };

  const handleUpdateRequestStatus = async (id: string, status: RepairRequestStatus) => {
    const originalRequests = [...requests];
    const updatedRequests = requests.map(r => r.id === id ? { ...r, status } : r);
    setRequests(updatedRequests);

    try {
        await updateRepairRequestStatus(id, status);
        toast({ title: 'Éxito', description: `Solicitud actualizada a "${status}".` });
        fetchRequests();
    } catch (error: any) {
        setRequests(originalRequests);
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo actualizar la solicitud.' });
    }
  };

  const handleAddNew = () => {
    form.reset({
      requesterId: user?.id || '',
      requesterName: user?.username || '',
      item: 'Otro',
      location: '',
      description: '',
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
        req.item.toLowerCase().includes(lowercasedQuery) ||
        req.location.toLowerCase().includes(lowercasedQuery) ||
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
      exportToCsv('solicitudes_soporte.csv', filteredRequests);
      toast({ title: 'Éxito', description: 'Solicitudes de soporte exportadas.' });
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