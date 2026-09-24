import React from 'react';
import { ChatAttachment } from '../../../types';
import { formatFileSize } from '../../../services/fileAttachmentService';
import { CloseIcon, FileIcon } from '../../../assets/icons/Icons';
import styles from './AttachmentPreview.module.css';

interface AttachmentPreviewProps {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachments, onRemove }) => {
  if (attachments.length === 0) return null;

  return (
    <div className={styles.bar}>
      {attachments.map((att) => (
        <div key={att.id} className={styles.item}>
          {att.isImage ? (
            <img src={att.dataUrl} alt={att.name} className={styles.thumb} />
          ) : (
            <div className={styles.fileIconWrap}>
              <FileIcon size={16} />
            </div>
          )}

          <div className={styles.info}>
            <span className={styles.fileName} title={att.name}>{att.name}</span>
            <span className={styles.fileSize}>{formatFileSize(att.sizeBytes)}</span>
          </div>

          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onRemove(att.id)}
            title="Удалить файл"
          >
            <CloseIcon size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};
