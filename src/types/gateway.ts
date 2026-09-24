export interface V0FileAttachment {
  v0FileName?: string;
  v0MimeType?: string;
  v0Base64: string;
}

export interface V0RouteMessageItem {
  v0Role: string;
  v0Content: string;
  v0Files?: V0FileAttachment[];
}

export interface V0RouteMessageRequest {
  v0Messages: V0RouteMessageItem[];
  v0FileBase64?: string | null;
  v0Temperature?: number | null;
  v0StreamIs?: boolean;
  v0ModelsSelect?: string[] | null;
  v0ModelsSelectOnlyIs?: boolean;
}

export interface V0RouteMessageResponse {
  v0Code: number;
  v0Description: string;
  v0Content?: string | null;
  v0FinishReason?: string | null;
  v0ModelUsed?: string | null;
  v0ProviderUsed?: string | null;
}

export interface V0ModelsResponse {
  v0Code: number;
  v0Description: string;
  v0Value: string[];
}

export interface V0RouteAudioTtsRequest {
  v0Text: string;
  v0Model?: string;
  v0VoiceId?: string;
  v0Format?: string;
  v0Speed?: number;
  v0Volume?: number;
  v0Latency?: string;
  v0NormalizeIs?: boolean;
  v0ProviderSelect?: string;
}

export interface V0RouteAudioTtsResponse {
  v0Code: number;
  v0Description: string;
  v0AudioBase64?: string;
  v0Format?: string;
  v0ModelUsed?: string;
  v0VoiceIdUsed?: string;
  v0ProviderUsed?: string;
}
