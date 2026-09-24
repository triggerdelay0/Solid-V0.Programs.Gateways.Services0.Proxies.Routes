import React from 'react';
import { useRoutesChat } from '../../../store/RoutesChatContext';
import { Modal } from '../../common/Modal/Modal';
import { formatFileSize } from '../../../services/fileAttachmentService';
import { FileIcon } from '../../../assets/icons/Icons';
import styles from './MediaViewerModal.module.css';

export const MediaViewerModal: React.FC = () => {
  const { activeViewerAttachment, setActiveViewerAttachment } = useRoutesChat();

  if (!activeViewerAttachment) return null;

  return (
    <Modal
      isOpen={Boolean(activeViewerAttachment)}
      onClose={() => setActiveViewerAttachment(null)}
      title={activeViewerAttachment.name}
      width="720px"
    >
      <div className={styles.container}>
        {activeViewerAttachment.isImage ? (
          <img
            src={activeViewerAttachment.dataUrl}
            alt={activeViewerAttachment.name}
            className={styles.imageViewer}
          />
        ) : (
          <div className={styles.fileFallback}>
            <FileIcon size={48} color="var(--text-accent)" />
            <span>Файл: {activeViewerAttachment.name}</span>
          </div>
        )}

        <div className={styles.metaInfo}>
          <span>MIME-тип: {activeViewerAttachment.mimeType}</span>
          <span>Размер: {formatFileSize(activeViewerAttachment.sizeBytes)}</span>
        </div>
      </div>
    </Modal>
  );
};
