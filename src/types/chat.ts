export type AppNotification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  attachmentName?: string;
  attachmentType?: string; // e.g., 'image/png'
  attachmentUrl?: string; // data URI
};
