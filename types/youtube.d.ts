// Canonical global types for the YouTube IFrame Player API.
// Single source of truth — components must NOT re-declare `window.YT` /
// `onYouTubeIframeAPIReady` inline (doing so causes conflicting-declaration errors).

export {};

declare global {
  namespace YT {
    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      seekTo(seconds: number, allowSeekAhead?: boolean): void;
      getCurrentTime(): number;
      getDuration(): number;
      getPlayerState(): number;
      mute(): void;
      unMute(): void;
      isMuted(): boolean;
      setVolume(volume: number): void;
      getVolume(): number;
      destroy(): void;
      loadVideoById(videoId: string, startSeconds?: number): void;
      cueVideoById(videoId: string, startSeconds?: number): void;
    }
  }

  interface Window {
    // Loosely typed on purpose: the IFrame API is injected at runtime via a
    // <script> tag, and call sites construct `new window.YT.Player(...)`.
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}
