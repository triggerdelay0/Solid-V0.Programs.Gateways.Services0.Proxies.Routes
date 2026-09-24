import { ROUTES_CONFIG } from '../config/routesConfig';
import {
  V0ModelsResponse,
  V0RouteMessageRequest,
  V0RouteMessageResponse,
  V0RouteAudioTtsRequest,
  V0RouteAudioTtsResponse
} from '../types/gateway';
import { ModelOption } from '../types/chat';

export const fetchGatewayModels = async (): Promise<ModelOption[]> => {
  try {
    const res = await fetch(`${ROUTES_CONFIG.gatewayBaseUrl}/Route/Models/Get`);
    if (!res.ok) {
      throw new Error(`Ошибка шлюза HTTP ${res.status}: ${res.statusText}`);
    }

    const data: V0ModelsResponse = await res.json();
    if (data.v0Code !== 0 || !Array.isArray(data.v0Value)) {
      throw new Error(data.v0Description || 'Некорректный ответ моделей');
    }

    return data.v0Value.map((rawModel) => {
      const slashIndex = rawModel.indexOf('/');
      let provider = 'openrouter';
      let name = rawModel;

      if (slashIndex >= 0) {
        provider = rawModel.substring(0, slashIndex).trim();
        name = rawModel.substring(slashIndex + 1).trim();
      }

      const isFree = rawModel.toLowerCase().includes('free');

      return {
        id: rawModel,
        name,
        provider,
        isFree
      };
    });
  } catch (error) {
    console.error('[RoutesGatewayService] Ошибка загрузки списка моделей:', error);
    return [];
  }
};

export const sendGatewayMessage = async (
  payload: V0RouteMessageRequest
): Promise<V0RouteMessageResponse> => {
  const res = await fetch(`${ROUTES_CONFIG.gatewayBaseUrl}/Route/Message/Send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    return {
      v0Code: res.status,
      v0Description: `HTTP ${res.status}: ${errorText || res.statusText}`,
      v0Content: null
    };
  }

  return await res.json();
};

export const requestSpeechTts = async (
  text: string,
  model: string = ROUTES_CONFIG.defaultTtsModel
): Promise<V0RouteAudioTtsResponse> => {
  const payload: V0RouteAudioTtsRequest = {
    v0Text: text,
    v0Model: model,
    v0Format: 'mp3',
    v0ProviderSelect: 'fishaudio',
    v0NormalizeIs: true
  };

  const res = await fetch(`${ROUTES_CONFIG.gatewayBaseUrl}/Routes/Audios/TTS`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    return {
      v0Code: res.status,
      v0Description: `HTTP ${res.status}: ${errorText || res.statusText}`
    };
  }

  return await res.json();
};
