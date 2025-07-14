'use client';

import { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AppNotification } from '@/types';
import { getNotifications, addNotification, deleteNotification, deleteAllNotifications } from '@/services/notification-service';

type Attachment = {
  name: string;
  type: string;
  url: string; // Data URI
};

interface NotificationContextType {
  notifications: AppNotification[];
  loading: boolean;
  hasUnread: boolean;
  setHasUnread: (hasUnread: boolean) => void;
  customNotificationTitle: string;
  setCustomNotificationTitle: (title: string) => void;
  customNotificationDesc: string;
  setCustomNotificationDesc: (desc: string) => void;
  attachment: Attachment | null;
  setAttachment: (attachment: Attachment | null) => void;
  deletingNotificationId: string | null;
  isClearingAll: boolean;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendCustomNotification: (e: React.FormEvent) => Promise<void>;
  handleDeleteNotification: (id: string) => Promise<void>;
  handleClearAllNotifications: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const [customNotificationTitle, setCustomNotificationTitle] = useState('');
  const [customNotificationDesc, setCustomNotificationDesc] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [deletingNotificationId, setDeletingNotificationId] = useState<string | null>(null);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los mensajes.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setAttachment({
          name: file.name,
          type: file.type,
          url: loadEvent.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendCustomNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNotificationTitle.trim() && !customNotificationDesc.trim() && !attachment) return;

    setLoading(true);
    try {
      const newNotificationData = {
        title: customNotificationTitle,
        description: customNotificationDesc,
        attachmentName: attachment?.name,
        attachmentType: attachment?.type,
        attachmentUrl: attachment?.url,
      };

      const newNotification = await addNotification(newNotificationData);
      setNotifications(prev => [newNotification, ...prev]);
      setHasUnread(true);
      setCustomNotificationTitle('');
      setCustomNotificationDesc('');
      setAttachment(null);
      toast({
        title: 'Éxito',
        description: 'Mensaje enviado correctamente.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo enviar el mensaje.',
      });
    } finally {
        setLoading(false);
    }
  };
  
  const handleDeleteNotification = async (id: string) => {
    setDeletingNotificationId(id);
    try {
        await deleteNotification(id);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
            setDeletingNotificationId(null);
        }, 300);
    } catch(error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudo eliminar el mensaje.',
        });
        setDeletingNotificationId(null);
    }
  };

  const handleClearAllNotifications = async () => {
    if (notifications.length === 0) return;
    setIsClearingAll(true);
    try {
        await deleteAllNotifications();
        setTimeout(() => {
            setNotifications([]);
            setIsClearingAll(false);
            toast({
                title: 'Éxito',
                description: 'Todos los mensajes han sido eliminados.',
            });
        }, 300);
    } catch(error) {
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudieron eliminar los mensajes.',
        });
        setIsClearingAll(false);
    }
  };

  const value = {
    notifications,
    loading,
    hasUnread,
    setHasUnread,
    customNotificationTitle,
    setCustomNotificationTitle,
    customNotificationDesc,
    setCustomNotificationDesc,
    attachment,
    setAttachment,
    deletingNotificationId,
    isClearingAll,
    handleFileSelect,
    handleSendCustomNotification,
    handleDeleteNotification,
    handleClearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
