'use client';

import { ReactNode, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole } from '@/types';
import { roleDisplayNames } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import {
  Flame,
  Warehouse,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Home,
  Bell,
  X,
  FileText,
  Wrench,
  MessageSquare,
  File,
} from 'lucide-react';
import { InventoryProvider } from '@/context/inventory-context';
import { UserProvider } from '@/context/user-context';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, generateAvatarColor } from '@/lib/utils';
import { RequestProvider } from '@/context/request-context';
import { RepairRequestProvider } from '@/context/repair-request-context';
import { NotificationProvider, useNotifications } from '@/context/notification-context';


const ALL_MENU_ITEMS: MenuItem[] = [
    { href: '/dashboard', label: 'Inicio', icon: Home, exact: true },
    { href: '/dashboard/inventory', label: 'Inventario', icon: Warehouse },
    { href: '/dashboard/requests', label: 'Solicitudes', icon: FileText, requiredRoles: ['Docente', 'Asistente de la Educación', 'UTP o Coordinador Académico', 'Administrador General', 'Encargado de Bodega', 'Inspector General', 'Director'] },
    { href: '/dashboard/repairs', label: 'Soporte Técnico', icon: Wrench },
    { href: '/dashboard/chat', label: 'Mensajes', icon: MessageSquare },
    { href: '/dashboard/analytics', label: 'Analíticas', icon: BarChart3, requiredRoles: ['Administrador General', 'Encargado de Bodega', 'Inspector General', 'UTP o Coordinador Académico', 'Director'] },
    { href: '/dashboard/users', label: 'Usuarios', icon: Users, requiredRoles: ['Administrador General'] },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
];

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  requiredRoles?: UserRole[];
}

function NotificationBell() {
    const { 
        notifications,
        loading,
        hasUnread, 
        setHasUnread, 
        deletingNotificationId, 
        isClearingAll, 
        handleDeleteNotification, 
        handleClearAllNotifications 
    } = useNotifications();

    return (
        <Popover onOpenChange={(open) => { if (open) setHasUnread(false); }}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    {hasUnread && <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>}
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificaciones</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[90vw] sm:w-96">
                <div className="flex items-center justify-between p-2 pb-1">
                    <h3 className="font-semibold">Notificaciones</h3>
                    {notifications.length > 0 && 
                        <Button variant="ghost" size="sm" onClick={handleClearAllNotifications} disabled={isClearingAll}>Limpiar todo</Button>
                    }
                </div>
                <Separator />
                <ScrollArea className="h-80">
                    <div className={cn(
                        "p-3.5 space-y-2.5 transition-all duration-300",
                        isClearingAll && "opacity-0 scale-95"
                    )}>
                    {loading ? (
                        <div className="space-y-2.5 p-3.5">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={cn(
                                "group relative text-sm rounded-lg pr-10 hover:bg-muted/50 transition-all duration-300",
                                deletingNotificationId === notif.id && "opacity-0 -translate-x-full"
                                )}
                            >
                                <p className="font-semibold text-foreground">{notif.title}</p>
                                <p className="text-muted-foreground">{notif.description}</p>
                                {notif.attachmentUrl && (
                                    <div className="mt-2">
                                    {notif.attachmentType?.startsWith('image/') ? (
                                        <Image src={notif.attachmentUrl} alt={notif.attachmentName || 'Adjunto'} width={100} height={100} className="rounded-md object-cover"/>
                                    ) : (
                                        <a href={notif.attachmentUrl} download={notif.attachmentName} className="flex items-center gap-2 text-sm text-primary hover:underline">
                                            <File className="h-4 w-4" />
                                            {notif.attachmentName}
                                        </a>
                                    )}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground/80 mt-1.5">
                                {formatDistanceToNow(parseISO(notif.timestamp), { addSuffix: true, locale: es })}
                                </p>
                                <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 -translate-y-1/2 right-1 h-7 w-7 opacity-0 group-hover:opacity-100"
                                onClick={() => handleDeleteNotification(notif.id)}
                                >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Descartar notificación</span>
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-10">No hay notificaciones nuevas</p>
                    )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}


function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = useMemo(() => {
    if (!user) return [];
    return ALL_MENU_ITEMS.filter(item => {
        if (!item.requiredRoles) return true;
        return item.requiredRoles.includes(user.role);
    });
  }, [user]);

  useEffect(() => {
    // This effect handles role-based authorization after the user is confirmed to be logged in.
    // The middleware handles the initial authentication check.
    if (!loading && user) {
      const currentRouteConfig = [...ALL_MENU_ITEMS]
        .sort((a, b) => b.href.length - a.href.length)
        .find(item => pathname.startsWith(item.href));

      if (currentRouteConfig?.requiredRoles && !currentRouteConfig.requiredRoles.includes(user.role)) {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
       <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    );
  }
  
  const getPageTitle = () => {
    const sortedItems = [...menuItems].sort((a, b) => b.href.length - a.href.length);
    const currentItem = sortedItems.find(item => pathname.startsWith(item.href));
    return currentItem?.label || 'Inicio';
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset" side="left" className="z-50 border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Flame className="h-6 w-6" />
            </div>
            <h1 className="font-headline text-lg font-bold tracking-tight">
              Angelina Salas Olivares
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="p-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className={cn(generateAvatarColor(user.username), "text-primary-foreground")}>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold truncate">{user.username}</p>
              <p className="text-sm text-muted-foreground truncate">
                {roleDisplayNames[user.role]}
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="shrink-0"
                >
                  <LogOut />
                  <span className="sr-only">Cerrar Sesión</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>Cerrar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:h-16 sm:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="font-semibold text-lg">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <InventoryProvider>
        <RequestProvider>
          <RepairRequestProvider>
            <NotificationProvider>
              <DashboardLayoutContent>{children}</DashboardLayoutContent>
            </NotificationProvider>
          </RepairRequestProvider>
        </RequestProvider>
      </InventoryProvider>
    </UserProvider>
  );
}
