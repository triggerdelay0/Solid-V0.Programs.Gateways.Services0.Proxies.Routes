import { useCallback, useState } from 'react';
import { ChatAttachment } from '../types/chat';
import { convertFileToAttachment } from '../services/fileAttachmentService';

interface UseFileAttachmentHandlerOptions {
  onAttachmentsAdded: (attachments: ChatAttachment[]) => void;
}

export const useFileAttachmentHandler = ({ onAttachmentsAdded }: UseFileAttachmentHandlerOptions) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    try {
      const promises = list.map((file) => convertFileToAttachment(file));
      const results = await Promise.all(promises);
      onAttachmentsAdded(results);
    } catch (err) {
      console.error('[AttachmentHandler] Ошибка при обработке файлов:', err);
    }
  }, [onAttachmentsAdded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handlePaste = useCallback((e: React.ClipboardEvent | ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData || !clipboardData.items) return;

    const filesToUpload: File[] = [];

    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) filesToUpload.push(file);
      }
    }

    if (filesToUpload.length > 0) {
      processFiles(filesToUpload);
    }
  }, [processFiles]);

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePaste,
    processFiles
  };
};
