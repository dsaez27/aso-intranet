'use client';

import React, { createContext } from 'react';
import { useRequestProvider } from '@/hooks/use-requests';

type RequestContextType = ReturnType<typeof useRequestProvider>;

export const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const requestState = useRequestProvider();
  return <RequestContext.Provider value={requestState}>{children}</RequestContext.Provider>;
}
