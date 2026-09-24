import { ChatMessage } from './chat';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  selectedModel: string;
  temperature: number;
  systemPrompt?: string;
  messages: ChatMessage[];
}

export interface SessionsStorageData {
  activeSessionId: string;
  sessions: ChatSession[];
}
