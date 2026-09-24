import React, { useState } from 'react';
import { ChatMessage, ChatAttachment } from '../../../types';
import { useRoutesChat } from '../../../store/RoutesChatContext';
import { useAudioPlayer } from '../../../hooks/useAudioPlayer';
import { VolumeIcon, CopyIcon, CheckIcon, FileIcon } from '../../../assets/icons/Icons';
import styles from './MessageItem.module.css';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { setActiveViewerAttachment } = useRoutesChat();
  const { playingMessageId, loadingAudioId, playOrSynthesize } = useAudioPlayer();
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isPlaying = playingMessageId === message.id;
  const isLoadingAudio = loadingAudioId === message.id;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenAttachment = (att: ChatAttachment) => {
    setActiveViewerAttachment(att);
  };

  return (
    <div
      className={`${styles.row} ${
        isUser ? styles.userRow : isSystem ? styles.systemRow : styles.assistantRow
      }`}
    >
      <div
        className={`${styles.bubble} ${
          isUser
            ? styles.userBubble
            : isSystem
            ? styles.systemBubble
            : styles.assistantBubble
        } ${message.isError ? styles.errorBubble : ''}`}
      >
        <div className={styles.metaHeader}>
          <span className={styles.senderRole}>
            {isUser ? 'Вы' : isSystem ? 'Система' : 'Ассистент'}
          </span>

          {message.modelUsed && (
            <span className={styles.modelBadge} title={`Провайдер: ${message.providerUsed || 'auto'}`}>
              {message.modelUsed}
            </span>
          )}

          <span className={styles.timestamp}>{message.timestamp}</span>
        </div>

        {/* Вложения файлов и изображений */}
        {message.attachments && message.attachments.length > 0 && (
          <div className={styles.attachmentsGrid}>
            {message.attachments.map((att) =>
              att.isImage ? (
                <img
                  key={att.id}
                  src={att.dataUrl}
                  alt={att.name}
                  className={styles.imagePreview}
                  onClick={() => handleOpenAttachment(att)}
                />
              ) : (
                <div
                  key={att.id}
                  className={styles.fileBadge}
                  onClick={() => handleOpenAttachment(att)}
                >
                  <FileIcon size={14} />
                  <span>{att.name}</span>
                </div>
              )
            )}
          </div>
        )}

        <div className={styles.content}>{message.content}</div>

        {!isSystem && !message.isError && (
          <div className={styles.footerBar}>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={handleCopy}
              title="Скопировать ответ"
            >
              {copied ? <CheckIcon size={13} color="var(--status-online)" /> : <CopyIcon size={13} />}
              <span>{copied ? 'Скопировано' : 'Копия'}</span>
            </button>

            {!isUser && (
              <button
                type="button"
                className={`${styles.toolBtn} ${isPlaying ? styles.playingBtn : ''}`}
                onClick={() => playOrSynthesize(message.id, message.content, message.audioBase64)}
                disabled={isLoadingAudio}
                title="Озвучить ответ через Fish Audio TTS"
              >
                <VolumeIcon size={13} />
                <span>
                  {isLoadingAudio
                    ? 'Синтез...'
                    : isPlaying
                    ? 'Остановить'
                    : 'Озвучить'}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
