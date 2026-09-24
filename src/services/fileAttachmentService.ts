import { ChatAttachment } from '../types/chat';

export const convertFileToAttachment = (file: File): Promise<ChatAttachment> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const isImage = file.type.startsWith('image/');

      const attachment: ChatAttachment = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        dataUrl: result,
        isImage
      };

      resolve(attachment);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
