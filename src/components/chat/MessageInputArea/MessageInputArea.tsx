import React, { useState, useRef } from 'react';
import { useRoutesChat } from '../../../store/RoutesChatContext';
import { useAutoResizeTextarea } from '../../../hooks/useAutoResizeTextarea';
import { useFileAttachmentHandler } from '../../../hooks/useFileAttachmentHandler';
import { AttachmentPreview } from '../AttachmentPreview/AttachmentPreview';
import { ChatAttachment } from '../../../types';
import { PaperclipIcon, SendIcon } from '../../../assets/icons/Icons';
import styles from './MessageInputArea.module.css';

export const MessageInputArea: React.FC = () => {
  const { sendMessage, isSending } = useRoutesChat();

  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const textareaRef = useAutoResizeTextarea(text, 200);

  const { processFiles, handlePaste } = useFileAttachmentHandler({
    onAttachmentsAdded: (newFiles) => {
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  });

  const handleSend = () => {
    if (isSending || (!text.trim() && attachments.length === 0)) return;

    sendMessage(text, attachments);
    setText('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const canSend = !isSending && (text.trim().length > 0 || attachments.length > 0);

  return (
    <div className={styles.container}>
      <AttachmentPreview
        attachments={attachments}
        onRemove={handleRemoveAttachment}
      />

      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          rows={1}
          className={styles.textarea}
          placeholder={isSending ? 'Маршрутизация и ожидание ответа...' : 'Напишите сообщение или вставьте файлы (Ctrl+V)...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={isSending}
        />

        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.attachBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Прикрепить файл или изображение"
          >
            <PaperclipIcon size={17} />
          </button>

          <button
            type="button"
            className={`${styles.sendBtn} ${canSend ? styles.activeSendBtn : ''}`}
            onClick={handleSend}
            disabled={!canSend}
            title="Отправить сообщение"
          >
            <SendIcon size={16} />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className={styles.hiddenFileInput}
        onChange={handleFileChange}
      />

      <div className={styles.hintText}>
        Enter — отправка, Shift+Enter — перенос строки. Поддерживается вставка картинок из буфера.
      </div>
    </div>
  );
};
