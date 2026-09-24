import React, { useRef, useEffect } from 'react';
import { useRoutesChat } from '../../store/RoutesChatContext';
import { useFileAttachmentHandler } from '../../hooks/useFileAttachmentHandler';
import { ChatHeader } from './ChatHeader/ChatHeader';
import { MessageItem } from './MessageItem/MessageItem';
import { MessageInputArea } from './MessageInputArea/MessageInputArea';
import styles from './ChatWindow.module.css';

export const ChatWindow: React.FC = () => {
  const { activeSession, sendMessage } = useRoutesChat();
  const listEndRef = useRef<HTMLDivElement | null>(null);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useFileAttachmentHandler({
    onAttachmentsAdded: (attachments) => {
      // При перетаскивании сразу в окно чата отправляем с описанием
      sendMessage('', attachments);
    }
  });

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages.length]);

  return (
    <div
      className={styles.window}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ChatHeader />

      <div className={styles.messageScrollList}>
        {activeSession?.messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        <div ref={listEndRef} />
      </div>

      <MessageInputArea />

      {isDragging && (
        <div className={styles.dragOverlay}>
          <div className={styles.dragOverlayText}>Перетащите файлы сюда для прикрепления</div>
        </div>
      )}
    </div>
  );
};
