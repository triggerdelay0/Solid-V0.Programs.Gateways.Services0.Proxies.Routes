import React, { useState } from 'react';
import { ChatSession } from '../../../types';
import { TrashIcon } from '../../../assets/icons/Icons';
import styles from './SessionItem.module.css';

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  isActive,
  onSelect,
  onDelete,
  onRename
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(session.title);

  const handleBlur = () => {
    setIsEditing(false);
    if (titleValue.trim() && titleValue.trim() !== session.title) {
      onRename(titleValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTitleValue(session.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={onSelect}
    >
      <div className={styles.infoArea}>
        <div className={styles.titleRow}>
          {isEditing ? (
            <input
              type="text"
              className={styles.editInput}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={styles.title}
              onDoubleClick={() => setIsEditing(true)}
              title="Двойной клик для переименования"
            >
              {session.title}
            </span>
          )}
        </div>
        <div className={styles.metaRow}>
          <span>{session.updatedAt}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Удалить диалог"
        >
          <TrashIcon size={14} />
        </button>
      </div>
    </div>
  );
};
