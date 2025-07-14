'use client';

import React, { createContext } from 'react';
import { useRepairRequestProvider } from '@/hooks/use-repair-requests';

type RepairRequestContextType = ReturnType<typeof useRepairRequestProvider>;

export const RepairRequestContext = createContext<RepairRequestContextType | undefined>(undefined);

export function RepairRequestProvider({ children }: { children: React.ReactNode }) {
  const repairRequestState = useRepairRequestProvider();
  return <RepairRequestContext.Provider value={repairRequestState}>{children}</RepairRequestContext.Provider>;
}
