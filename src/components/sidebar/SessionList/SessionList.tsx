import React from 'react';
import { useRoutesChat } from '../../../store/RoutesChatContext';
import { SessionItem } from './SessionItem';
import styles from './SessionList.module.css';

export const SessionList: React.FC = () => {
  const {
    sessions,
    activeSessionId,
    selectSession,
    deleteSession,
    renameSession
  } = useRoutesChat();

  return (
    <div className={styles.list}>
      {sessions.length === 0 ? (
        <div className={styles.emptyText}>Нет активных диалогов</div>
      ) : (
        sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            onSelect={() => selectSession(session.id)}
            onDelete={() => deleteSession(session.id)}
            onRename={(newTitle) => renameSession(session.id, newTitle)}
          />
        ))
      )}
    </div>
  );
};
