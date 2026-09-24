class AudioTtsService {
  private currentAudio: HTMLAudioElement | null = null;

  public playAudio(base64DataUrl: string, onEnded?: () => void): void {
    this.stopAudio();

    this.currentAudio = new Audio(base64DataUrl);
    this.currentAudio.onended = () => {
      this.currentAudio = null;
      if (onEnded) onEnded();
    };

    this.currentAudio.play().catch((err) => {
      console.warn('[AudioTtsService] Автовоспроизведение заблокировано браузером:', err);
    });
  }

  public stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }
}

export const audioTtsService = new AudioTtsService();
