import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  ChatMessage,
  ChatSession,
  ChatAttachment,
  ModelOption,
  V0RouteMessageItem
} from '../types';
import { ROUTES_CONFIG } from '../config/routesConfig';
import {
  fetchGatewayModels,
  sendGatewayMessage
} from '../services/routesGatewayService';
import {
  loadSessionsData,
  saveSessionsData,
  formatSessionDate
} from '../services/sessionStorageService';

interface RoutesChatContextType {
  sessions: ChatSession[];
  activeSessionId: string;
  activeSession: ChatSession | undefined;
  models: ModelOption[];
  isModelsLoading: boolean;
  selectedModel: string;
  temperature: number;
  isSending: boolean;
  activeViewerAttachment: ChatAttachment | null;
  parametersModalOpen: boolean;

  // Сессии
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => void;

  // Параметры
  setSelectedModel: (modelId: string) => void;
  setTemperature: (temp: number) => void;
  updateSessionSystemPrompt: (prompt: string) => void;
  setParametersModalOpen: (open: boolean) => void;
  setActiveViewerAttachment: (att: ChatAttachment | null) => void;

  // Сообщения
  sendMessage: (text: string, attachments?: ChatAttachment[]) => Promise<void>;
  clearActiveSessionMessages: () => void;
}

const RoutesChatContext = createContext<RoutesChatContextType | undefined>(undefined);

export const RoutesChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [isModelsLoading, setIsModelsLoading] = useState<boolean>(true);
  const [selectedModel, setSelectedModelState] = useState<string>(ROUTES_CONFIG.defaultModel);
  const [temperature, setTemperatureState] = useState<number>(ROUTES_CONFIG.defaultTemperature);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [activeViewerAttachment, setActiveViewerAttachment] = useState<ChatAttachment | null>(null);
  const [parametersModalOpen, setParametersModalOpen] = useState<boolean>(false);

  const isInitializedRef = useRef<boolean>(false);

  // 1. Загрузка списка моделей со шлюза
  useEffect(() => {
    fetchGatewayModels().then((gatewayModels) => {
      setModels(gatewayModels);
      setIsModelsLoading(false);

      if (gatewayModels.length > 0 && !gatewayModels.some((m) => m.id === selectedModel)) {
        setSelectedModelState(gatewayModels[0].id);
      }
    });
  }, []);

  // 2. Загрузка сессий из файла/localStorage
  useEffect(() => {
    loadSessionsData().then((stored) => {
      if (stored && stored.sessions && stored.sessions.length > 0) {
        setSessions(stored.sessions);
        setActiveSessionId(stored.activeSessionId || stored.sessions[0].id);

        const currentActive = stored.sessions.find(
          (s) => s.id === (stored.activeSessionId || stored.sessions[0].id)
        );
        if (currentActive) {
          setSelectedModelState(currentActive.selectedModel || ROUTES_CONFIG.defaultModel);
          setTemperatureState(currentActive.temperature ?? ROUTES_CONFIG.defaultTemperature);
        }
      } else {
        // Создаем стартовую сессию по умолчанию
        const initialSession: ChatSession = {
          id: `sess_${Date.now()}`,
          title: 'Новый диалог',
          createdAt: formatSessionDate(),
          updatedAt: formatSessionDate(),
          selectedModel: ROUTES_CONFIG.defaultModel,
          temperature: ROUTES_CONFIG.defaultTemperature,
          systemPrompt: 'Ты — интеллектуальный ассистент шлюза Routes. Отвечай структурированно, точно и содержательно.',
          messages: [
            {
              id: `msg_sys_init`,
              role: 'system',
              content: 'Шлюз маршрутизации Routes подключен. Задайте вопрос или перетащите изображения/файлы в окно чата.',
              timestamp: formatSessionDate()
            }
          ]
        };
        setSessions([initialSession]);
        setActiveSessionId(initialSession.id);
      }
      isInitializedRef.current = true;
    });
  }, []);

  // 3. Автосохранение изменений в сессиях
  useEffect(() => {
    if (!isInitializedRef.current || sessions.length === 0) return;

    saveSessionsData({
      activeSessionId,
      sessions
    });
  }, [sessions, activeSessionId]);

  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0];
  }, [sessions, activeSessionId]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `sess_${Date.now()}`,
      title: 'Новый диалог',
      createdAt: formatSessionDate(),
      updatedAt: formatSessionDate(),
      selectedModel,
      temperature,
      systemPrompt: activeSession?.systemPrompt,
      messages: []
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const selectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      setSelectedModelState(target.selectedModel || ROUTES_CONFIG.defaultModel);
      setTemperatureState(target.temperature ?? ROUTES_CONFIG.defaultTemperature);
    }
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh: ChatSession = {
          id: `sess_${Date.now()}`,
          title: 'Новый диалог',
          createdAt: formatSessionDate(),
          updatedAt: formatSessionDate(),
          selectedModel,
          temperature,
          messages: []
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }

      if (sessionId === activeSessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle.trim(), updatedAt: formatSessionDate() } : s))
    );
  };

  const setSelectedModel = (modelId: string) => {
    setSelectedModelState(modelId);
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, selectedModel: modelId } : s))
    );
  };

  const setTemperature = (temp: number) => {
    setTemperatureState(temp);
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, temperature: temp } : s))
    );
  };

  const updateSessionSystemPrompt = (prompt: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, systemPrompt: prompt } : s))
    );
  };

  const clearActiveSessionMessages = () => {
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [], updatedAt: formatSessionDate() } : s))
    );
  };

  const sendMessage = async (text: string, attachments: ChatAttachment[] = []) => {
    if ((!text.trim() && attachments.length === 0) || isSending || !activeSession) return;

    setIsSending(true);

    const userMessage: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: formatSessionDate(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    // Если это первое сообщение пользователя в сессии — автоматически переименовываем диалог
    const isFirstUserMsg = !activeSession.messages.some((m) => m.role === 'user');
    const autoTitle = isFirstUserMsg && text.trim()
      ? (text.trim().length > 32 ? `${text.trim().substring(0, 32)}...` : text.trim())
      : activeSession.title;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            title: autoTitle,
            updatedAt: formatSessionDate(),
            messages: [...s.messages, userMessage]
          };
        }
        return s;
      })
    );

    // Подготовка пакета сообщений для отправки в шлюз
    const messagesPayload: V0RouteMessageItem[] = [];

    // Системный промпт (если задан)
    if (activeSession.systemPrompt?.trim()) {
      messagesPayload.push({
        v0Role: 'system',
        v0Content: activeSession.systemPrompt.trim()
      });
    }

    // История диалога
    const history = [...activeSession.messages, userMessage].filter((m) => m.role !== 'system');
    for (const msg of history) {
      const item: V0RouteMessageItem = {
        v0Role: msg.role,
        v0Content: msg.content
      };

      if (msg.attachments && msg.attachments.length > 0) {
        item.v0Files = msg.attachments.map((att) => ({
          v0FileName: att.name,
          v0MimeType: att.mimeType,
          v0Base64: att.dataUrl
        }));
      }

      messagesPayload.push(item);
    }

    try {
      const response = await sendGatewayMessage({
        v0Messages: messagesPayload,
        v0Temperature: temperature,
        v0ModelsSelect: [selectedModel],
        v0ModelsSelectOnlyIs: false // Разрешает умный failover по списку V0Models.json
      });

      if (response.v0Code === 0 && response.v0Content !== null) {
        const assistantMessage: ChatMessage = {
          id: `msg_a_${Date.now()}`,
          role: 'assistant',
          content: response.v0Content || '',
          timestamp: formatSessionDate(),
          modelUsed: response.v0ModelUsed || selectedModel,
          providerUsed: response.v0ProviderUsed || undefined
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                updatedAt: formatSessionDate(),
                messages: [...s.messages, assistantMessage]
              };
            }
            return s;
          })
        );
      } else {
        const errorMessage: ChatMessage = {
          id: `msg_err_${Date.now()}`,
          role: 'system',
          content: `Ошибка шлюза (Код ${response.v0Code}): ${response.v0Description}`,
          timestamp: formatSessionDate(),
          isError: true
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                updatedAt: formatSessionDate(),
                messages: [...s.messages, errorMessage]
              };
            }
            return s;
          })
        );
      }
    } catch (err: any) {
      const fatalError: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'system',
        content: `Сбой сетевого взаимодействия с сервером Routes: ${err?.message || err}`,
        timestamp: formatSessionDate(),
        isError: true
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              updatedAt: formatSessionDate(),
              messages: [...s.messages, fatalError]
            };
          }
          return s;
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <RoutesChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeSession,
        models,
        isModelsLoading,
        selectedModel,
        temperature,
        isSending,
        activeViewerAttachment,
        parametersModalOpen,
        createNewSession,
        selectSession,
        deleteSession,
        renameSession,
        setSelectedModel,
        setTemperature,
        updateSessionSystemPrompt,
        setParametersModalOpen,
        setActiveViewerAttachment,
        sendMessage,
        clearActiveSessionMessages
      }}
    >
      {children}
    </RoutesChatContext.Provider>
  );
};

export const useRoutesChat = () => {
  const ctx = useContext(RoutesChatContext);
  if (!ctx) throw new Error('useRoutesChat must be used within RoutesChatProvider');
  return ctx;
};
