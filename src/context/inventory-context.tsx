'use client';

import React, { createContext } from 'react';
import { useInventory } from '@/hooks/use-inventory';

type InventoryContextType = ReturnType<typeof useInventory>;

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const inventoryState = useInventory();
  return <InventoryContext.Provider value={inventoryState}>{children}</InventoryContext.Provider>;
}
