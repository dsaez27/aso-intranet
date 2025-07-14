'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { X, Send, Paperclip, File as FileIcon, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ImagePreviewDialog } from '@/components/chat/image-preview-dialog';

export default function ChatPage() {
  const { user } = useAuth();
  const {
    notifications,
    loading,
    deletingNotificationId,
    isClearingAll,
    customNotificationTitle,
    setCustomNotificationTitle,
    customNotificationDesc,
    setCustomNotificationDesc,
    attachment,
    setAttachment,
    handleFileSelect,
    handleSendCustomNotification,
    handleDeleteNotification,
    handleClearAllNotifications,
  } = useNotifications();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const canSendMessages = user && ['Administrador General', 'Director', 'Inspector General'].includes(user.role);

  return (
    <>
      <Card className="-mx-4 h-[calc(100vh-8rem)] flex flex-col rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Centro de Mensajes</CardTitle>
          <CardDescription>
            Aquí puedes ver todos los mensajes y enviar notificaciones a los usuarios. Los mensajes son persistentes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-0">
          <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                  <div className="p-4 sm:p-6 space-y-4">
                  {loading ? (
                      <div className="space-y-4">
                          <Skeleton className="h-24 w-full" />
                          <Skeleton className="h-24 w-full" />
                          <Skeleton className="h-24 w-full" />
                      </div>
                  ) : notifications.length > 0 ? (
                      notifications.map((notif) => (
                      <div
                          key={notif.id}
                          className={cn(
                          "group relative rounded-lg border p-4 pr-10 transition-all duration-300",
                          deletingNotificationId === notif.id && "opacity-0 -translate-x-full"
                          )}
                      >
                          <p className="font-semibold text-foreground">{notif.title}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notif.description}</p>
                          {notif.attachmentUrl && (
                            <div className="mt-2 rounded-md border p-2">
                              {notif.attachmentType?.startsWith('image/') ? (
                                  <button onClick={() => setSelectedImage(notif.attachmentUrl || null)}>
                                    <Image src={notif.attachmentUrl} alt={notif.attachmentName || 'Adjunto'} width={200} height={200} className="rounded-md object-cover max-h-48 w-auto cursor-pointer transition-transform hover:scale-105"/>
                                  </button>
                              ) : (
                                  <a href={notif.attachmentUrl} download={notif.attachmentName} className="flex items-center gap-2 text-sm text-primary hover:underline">
                                      <FileIcon className="h-4 w-4" />
                                      {notif.attachmentName}
                                  </a>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground/80 mt-2">
                              {formatDistanceToNow(parseISO(notif.timestamp), { addSuffix: true, locale: es })}
                          </p>
                          <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                          onClick={() => handleDeleteNotification(notif.id)}
                          disabled={deletingNotificationId === notif.id}
                          >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Descartar mensaje</span>
                          </Button>
                      </div>
                      ))
                  ) : (
                      <div className="flex h-full items-center justify-center">
                          <p className="text-center text-sm text-muted-foreground py-10">No hay mensajes.</p>
                      </div>
                  )}
                  </div>
              </ScrollArea>
          </div>
          
          {canSendMessages && (
            <div className="border-t p-4">
              <form onSubmit={handleSendCustomNotification} className="space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="chat-title">Título</Label>
                  <Input
                    id="chat-title"
                    value={customNotificationTitle}
                    onChange={(e) => setCustomNotificationTitle(e.target.value)}
                    placeholder="Asunto del mensaje"
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="chat-desc">Mensaje</Label>
                  <Input
                    id="chat-desc"
                    value={customNotificationDesc}
                    onChange={(e) => setCustomNotificationDesc(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    disabled={loading}
                  />
                </div>

                {attachment && (
                  <div className="relative rounded-md border p-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {attachment.type.startsWith('image/') ? (
                        <Image src={attachment.url} alt="Vista previa" width={32} height={32} className="h-8 w-8 rounded-sm object-cover" />
                      ) : (
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                      <span className="text-sm truncate">{attachment.name}</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachment(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

                <div className="flex justify-between items-center">
                    <Button type="button" variant="ghost" size="sm" onClick={handleClearAllNotifications} disabled={notifications.length === 0 || isClearingAll}>
                        {isClearingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Limpiar todo
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                          <Paperclip className="h-4 w-4"/>
                      </Button>
                      <Button type="submit" disabled={(!customNotificationTitle && !customNotificationDesc && !attachment) || loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
                        Enviar Mensaje
                      </Button>
                    </div>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
      <ImagePreviewDialog
        isOpen={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
          }
        }}
        imageUrl={selectedImage}
      />
    </>
  );
}
