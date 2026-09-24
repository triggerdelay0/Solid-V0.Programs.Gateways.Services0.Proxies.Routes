import React from 'react';
import { useRoutesChat } from '../../store/RoutesChatContext';
import { ModelSelector } from './ModelSelector/ModelSelector';
import { SessionList } from './SessionList/SessionList';
import { PlusIcon } from '../../assets/icons/Icons';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const { createNewSession } = useRoutesChat();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <div className={styles.headerRow}>
          <div className={styles.appBrand}>
            <span className={styles.brandDot} />
            <span className={styles.brandTitle}>Routes Proxy</span>
          </div>
        </div>

        <button
          type="button"
          className={styles.newChatBtn}
          onClick={createNewSession}
          title="Начать новый диалог"
        >
          <PlusIcon size={16} />
          <span>Новый диалог</span>
        </button>

        <div className={styles.modelSelectWrapper}>
          <ModelSelector />
        </div>
      </div>

      <div className={styles.historyLabel}>История сессий</div>
      <SessionList />
    </aside>
  );
};
