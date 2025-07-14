'use client';

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import type { MaterialRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

type RequestsTableProps = {
  requests: MaterialRequest[];
  onUpdateRequestStatus: (id: string, status: 'Aprobado' | 'Rechazado') => void;
};

export function RequestsTable({ requests, onUpdateRequestStatus }: RequestsTableProps) {
  const { user } = useAuth();
  const canApprove = user && ['Administrador General', 'Encargado de Bodega'].includes(user.role);

  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Artículo</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Fecha Solicitud</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.itemName}</TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn({
                      'border-yellow-500 text-yellow-500': request.status === 'Pendiente',
                      'border-green-500 text-green-500': request.status === 'Aprobado',
                      'border-red-500 text-red-500': request.status === 'Rechazado',
                    })}
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>{request.requesterName}</TableCell>
                <TableCell>{format(parseISO(request.requestDate), "d MMM yyyy 'a las' HH:mm", { locale: es })}</TableCell>
                <TableCell>
                  {canApprove && request.status === 'Pendiente' ? (
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onUpdateRequestStatus(request.id, 'Aprobado')}>
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Aprobar</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                           <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onUpdateRequestStatus(request.id, 'Rechazado')}>
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                           </TooltipTrigger>
                           <TooltipContent><p>Rechazar</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin acciones</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron solicitudes.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
