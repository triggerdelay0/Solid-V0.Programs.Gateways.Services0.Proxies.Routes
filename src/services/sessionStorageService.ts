import { SessionsStorageData, ChatSession } from '../types/session';

const STORAGE_KEY = 'routes_proxy_sessions_cache_v1';

export const loadSessionsData = async (): Promise<SessionsStorageData | null> => {
  try {
    const res = await fetch('/api/routes/sessions');
    if (res.ok) {
      const data: SessionsStorageData = await res.json();
      if (data && Array.isArray(data.sessions)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('[SessionStorage] Не удалось прочитать локальный файл, читаем localStorage:', err);
  }

  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached) as SessionsStorageData;
    }
  } catch (err) {
    console.error('[SessionStorage] Ошибка чтения localStorage:', err);
  }

  return null;
};

export const saveSessionsData = async (data: SessionsStorageData): Promise<void> => {
  const jsonStr = JSON.stringify(data, null, 2);

  try {
    localStorage.setItem(STORAGE_KEY, jsonStr);
  } catch (err) {
    console.error('[SessionStorage] Ошибка записи в localStorage:', err);
  }

  try {
    await fetch('/api/routes/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonStr
    });
  } catch (err) {
    console.warn('[SessionStorage] Не удалось сохранить файл через серверный API:', err);
  }
};

export const formatSessionDate = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
