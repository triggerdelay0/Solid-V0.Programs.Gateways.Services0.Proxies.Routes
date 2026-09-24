import React from 'react';
import { RoutesChatProvider } from './store/RoutesChatContext';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { ParametersModal } from './components/modals/ParametersModal/ParametersModal';
import { MediaViewerModal } from './components/modals/MediaViewerModal/MediaViewerModal';
import styles from './App.module.css';

export const AppContent: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <ChatWindow />

      <ParametersModal />
      <MediaViewerModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RoutesChatProvider>
      <AppContent />
    </RoutesChatProvider>
  );
};

export default App;
