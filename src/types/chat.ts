import { V0FileAttachment } from './gateway';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatAttachment {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  dataUrl: string; // Формат: data:image/png;base64,...
  isImage: boolean;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  modelUsed?: string;
  providerUsed?: string;
  audioBase64?: string | null;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  isFree: boolean;
}
