'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { InventoryItem, SortableColumn, InventoryItemFormData } from '@/types';
import { InventoryItemSchema } from '@/types';
import { getItems, addItem, updateItem, deleteItem } from '@/services/inventory-service';
import { exportToCsv } from '@/lib/csv';
import { useEntityForm } from './use-entity-form';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: SortableColumn; direction: 'ascending' | 'descending' } | null>(null);
  const [searchQuery, _setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToView, setItemToView] = useState<InventoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const inventoryItems = await getItems();
      setItems(inventoryItems);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo conectar al inventario.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const formManager = useEntityForm<InventoryItemFormData, InventoryItem>({
    schema: InventoryItemSchema,
    defaultValues: {
      category: '',
      product: '',
      brandModel: '',
      unit: '',
      quantity: 0,
      minimumQuantity: 10,
      primaryLocation: '',
      secondaryLocation: '',
      responsiblePerson: '',
      status: 'En Stock',
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      warrantyMonths: 0,
      serialNumberCode: '',
      supplier: '',
      observations: '',
    },
    entityApi: {
      add: addItem,
      update: updateItem,
      delete: deleteItem,
    },
    onSuccess: (message) => toast({ title: 'Éxito', description: message }),
    onError: (message) => toast({ variant: 'destructive', title: 'Error', description: message }),
    refetch: fetchItems,
  });

  const setSearchQuery = (query: string) => {
    _setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const searchTerm = searchQuery.toLowerCase().trim();
      if (!searchTerm) return true;
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm)
      );
    });
  }, [items, searchQuery]);

  const sortedItems = useMemo(() => {
    let sortable = [...filteredItems];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredItems, sortConfig]);

  const displayItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedItems, currentPage]);

  const handleSort = (key: SortableColumn) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleViewDetails = (item: InventoryItem) => {
    setItemToView(item);
    setIsDetailOpen(true);
  };
  
  const handleExport = () => {
    try {
      exportToCsv('inventario.csv', sortedItems);
      toast({ title: 'Éxito', description: 'Inventario exportado correctamente.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return {
    loading,
    items,
    displayItems,
    fetchItems,
    totalFilteredItems: sortedItems.length,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    sortConfig,
    itemToView,
    isDetailOpen,
    setIsDetailOpen,
    searchQuery,
    setSearchQuery,
    handleSort,
    handleExport,
    handleViewDetails,
    ...formManager,
  };
};
