'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { User, UserSchema, UserFormData, roleDisplayNames } from '@/types';
import { getUsers, addUser, updateUser, deleteUser } from '@/services/user-service';
import { exportToCsv } from '@/lib/csv';
import { useEntityForm } from './use-entity-form';

export const useUsers = () => {
  const { user: currentUser, updateCurrentUser } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const allUsers = await getUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los usuarios.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const formManager = useEntityForm<UserFormData, User>({
    schema: UserSchema,
    defaultValues: { username: '', email: '', password: '', role: 'Docente' },
    entityApi: { add: addUser, update: updateUser, delete: deleteUser },
    onSuccess: (message) => {
        toast({ title: 'Éxito', description: message });
        const editedUser = formManager.form.getValues();
        if (currentUser?.id === editedUser.id) {
            updateCurrentUser({ ...currentUser, ...editedUser });
        }
    },
    onError: (message) => toast({ variant: 'destructive', title: 'Error', description: message }),
    refetch: fetchUsers,
  });

  const handleDeleteOverride = (user: User) => {
    if (currentUser?.id === user.id) {
        toast({ variant: 'destructive', title: 'Acción no permitida', description: 'No puedes eliminarte a ti mismo.' });
        return;
    }
    formManager.handleDelete(user);
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const lowercasedQuery = searchQuery.toLowerCase();
    return users.filter(user =>
      user.username.toLowerCase().includes(lowercasedQuery) ||
      user.email.toLowerCase().includes(lowercasedQuery) ||
      roleDisplayNames[user.role].toLowerCase().includes(lowercasedQuery)
    );
  }, [users, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleExport = () => {
    try {
      exportToCsv('usuarios.csv', filteredUsers);
      toast({ title: 'Éxito', description: 'Usuarios exportados correctamente.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return {
    loading,
    users,
    paginatedUsers,
    totalUsers: filteredUsers.length,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    searchQuery,
    handleSearchChange,
    handleExport,
    ...formManager,
    handleDelete: handleDeleteOverride, // Override the default handleDelete
  };
};
