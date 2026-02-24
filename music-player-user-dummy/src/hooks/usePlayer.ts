import { usePlayerContext } from "@/context/PlayerContext";
import type { Track } from "@/types/track";

export function usePlayer() {
  const context = usePlayerContext();

  return {
    // State
    currentTrack: context.currentTrack,
    queue: context.queue,
    isPlaying: context.isPlaying,
    currentIndex: context.currentIndex,
    repeatMode: context.repeatMode,
    shuffleEnabled: context.shuffleEnabled,
    isFullscreen: context.isFullscreen,
    duration: context.duration,
    progress: context.progress,
    volume: context.volume,
    isLoadingAudio: context.isLoadingAudio,
    bufferProgress: context.bufferProgress,

    // Actions
    playTrack: (track: Track, queue?: Track[]) => context.playTrack(track, queue),
    togglePlay: context.togglePlay,
    playNext: context.playNext,
    playPrevious: context.playPrevious,
    setQueue: (tracks: Track[]) => context.setQueue(tracks),
    clearQueue: context.clearQueue,
    toggleShuffle: context.toggleShuffle,
    toggleRepeat: context.toggleRepeat,
    toggleFullscreen: context.toggleFullscreen,
    seek: context.seek,
    setVolume: context.setVolume,
  };
}
