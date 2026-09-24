import React from 'react';
import { useRoutesChat } from '../../../store/RoutesChatContext';
import { SettingsIcon, TrashIcon } from '../../../assets/icons/Icons';
import styles from './ChatHeader.module.css';

export const ChatHeader: React.FC = () => {
  const {
    activeSession,
    selectedModel,
    setParametersModalOpen,
    clearActiveSessionMessages
  } = useRoutesChat();

  if (!activeSession) return null;

  return (
    <header className={styles.header}>
      <div className={styles.sessionInfo}>
        <div className={styles.sessionTitle}>{activeSession.title}</div>
        <div className={styles.sessionMeta}>
          <span>Модель:</span>
          <span className={styles.modelBadge}>{selectedModel}</span>
          <span>•</span>
          <span>Темп: {activeSession.temperature}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={clearActiveSessionMessages}
          title="Очистить историю сообщений текущего диалога"
        >
          <TrashIcon size={16} />
        </button>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setParametersModalOpen(true)}
          title="Параметры диалога и шлюза"
        >
          <SettingsIcon size={16} />
        </button>
      </div>
    </header>
  );
};
