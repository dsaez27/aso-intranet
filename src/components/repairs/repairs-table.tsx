'use client';

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import type { RepairRequest, RepairRequestStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Check, Hammer, MoreHorizontal, Hourglass, X } from 'lucide-react';

type RepairsTableProps = {
  requests: RepairRequest[];
  onUpdateRequestStatus: (id: string, status: RepairRequestStatus) => void;
};

const statusConfig: Record<RepairRequestStatus, { label: string; color: string; icon: React.ElementType }> = {
    'Pendiente': { label: 'Pendiente', color: 'border-yellow-500 text-yellow-500', icon: Hourglass },
    'En Progreso': { label: 'En Progreso', color: 'border-blue-500 text-blue-500', icon: Hammer },
    'Completado': { label: 'Completado', color: 'border-green-500 text-green-500', icon: Check },
    'Rechazado': { label: 'Rechazado', color: 'border-red-500 text-red-500', icon: X },
};

export function RepairsTable({ requests, onUpdateRequestStatus }: RepairsTableProps) {
  const { user } = useAuth();
  const canManage = user && ['Administrador General'].includes(user.role);

  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipo</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Fecha Solicitud</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => {
              const Icon = statusConfig[request.status].icon;
              return (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.item}</TableCell>
                <TableCell>{request.location}</TableCell>
                <TableCell className="max-w-xs truncate">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p>{request.description}</p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs whitespace-normal">{request.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className={cn('gap-1.5', statusConfig[request.status].color)}>
                        <Icon className="h-3 w-3"/>
                        {statusConfig[request.status].label}
                    </Badge>
                </TableCell>
                <TableCell>{request.requesterName}</TableCell>
                <TableCell>{format(parseISO(request.requestDate), "d MMM yyyy 'a las' HH:mm", { locale: es })}</TableCell>
                <TableCell>
                  {canManage ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Administrar solicitud</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUpdateRequestStatus(request.id, 'En Progreso')} disabled={request.status === 'En Progreso' || request.status === 'Completado'}>
                            <Hammer className="mr-2 h-4 w-4" /> Marcar como En Progreso
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateRequestStatus(request.id, 'Completado')} disabled={request.status === 'Completado'}>
                            <Check className="mr-2 h-4 w-4" /> Marcar como Completado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateRequestStatus(request.id, 'Rechazado')} disabled={request.status === 'Rechazado' || request.status === 'Completado'}>
                            <X className="mr-2 h-4 w-4" /> Rechazar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin acciones</span>
                  )}
                </TableCell>
              </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No se encontraron solicitudes de reparación.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
