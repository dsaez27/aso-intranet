'use client';

import React, { createContext } from 'react';
import { useUsers } from '@/hooks/use-users';

type UserContextType = ReturnType<typeof useUsers>;

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userState = useUsers();
  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
}
