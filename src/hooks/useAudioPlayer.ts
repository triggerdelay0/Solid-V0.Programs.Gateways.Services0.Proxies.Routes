import { useState, useCallback } from 'react';
import { audioTtsService } from '../services/audioTtsService';
import { requestSpeechTts } from '../services/routesGatewayService';

export const useAudioPlayer = () => {
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);

  const playOrSynthesize = useCallback(async (messageId: string, text: string, existingAudioUrl?: string | null) => {
    if (playingMessageId === messageId) {
      audioTtsService.stopAudio();
      setPlayingMessageId(null);
      return;
    }

    if (existingAudioUrl) {
      setPlayingMessageId(messageId);
      audioTtsService.playAudio(existingAudioUrl, () => setPlayingMessageId(null));
      return;
    }

    try {
      setLoadingAudioId(messageId);
      const res = await requestSpeechTts(text);

      if (res.v0Code === 0 && res.v0AudioBase64) {
        setPlayingMessageId(messageId);
        audioTtsService.playAudio(res.v0AudioBase64, () => setPlayingMessageId(null));
      } else {
        alert(`Ошибка синтеза речи TTS: ${res.v0Description}`);
      }
    } catch (e: any) {
      alert(`Сбой вызова TTS: ${e?.message || e}`);
    } finally {
      setLoadingAudioId(null);
    }
  }, [playingMessageId]);

  return {
    playingMessageId,
    loadingAudioId,
    playOrSynthesize
  };
};
