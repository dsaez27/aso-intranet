'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

type ImagePreviewDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  imageUrl: string | null;
};

export function ImagePreviewDialog({ isOpen, onOpenChange, imageUrl }: ImagePreviewDialogProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-transparent border-none shadow-none p-0 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt="Vista previa de imagen"
          width={1000}
          height={1000}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
