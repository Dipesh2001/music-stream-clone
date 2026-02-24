import React, { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import type { Track } from "@/types/track";
import type { PlayerTrack, PlayerState } from "@/types/player";
import { audioPlayer } from "@/lib/audioPlayer";
import { useLibrary } from "@/context/LibraryContext";

interface PlayerContextValue extends PlayerState {
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setQueue: (tracks: Track[]) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFullscreen: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const STORAGE_KEY = "music_player_last_played";

const getFullUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${url}`;
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const library = useLibrary();
  const [state, setState] = useState<PlayerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaults = {
      currentTrack: null,
      queue: [],
      isPlaying: false,
      currentIndex: -1,
      repeatMode: "off" as const,
      shuffleEnabled: false,
      isFullscreen: false,
      progress: 0,
      duration: 0,
      volume: 0.8,
      isLoadingAudio: false,
      bufferProgress: 0,
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaults,
          currentTrack: parsed.currentTrack || null,
          queue: parsed.queue || [],
          currentIndex: parsed.currentIndex || 0,
          repeatMode: parsed.repeatMode || "off",
          shuffleEnabled: parsed.shuffleEnabled || false,
          volume: parsed.volume || 0.8,
        };
      } catch (e) {
        // ignore
      }
    }
    return defaults;
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentTrack: state.currentTrack,
      queue: state.queue,
      currentIndex: state.currentIndex,
      repeatMode: state.repeatMode,
      shuffleEnabled: state.shuffleEnabled,
      volume: state.volume,
    }));
  }, [state.currentTrack, state.queue, state.currentIndex, state.repeatMode, state.shuffleEnabled, state.volume]);

  useEffect(() => {
    audioPlayer.setVolume(state.volume);
  }, []); // Initialize volume

  // Track loader effect
  useEffect(() => {
    if (state.currentTrack) {
      const audioUrl = getFullUrl(state.currentTrack.audioUrl);
      if (audioUrl !== audioPlayer.getElement().src) {
        audioPlayer.load(audioUrl);
        if (state.isPlaying) {
          audioPlayer.play().catch(console.error);
        }
        library.recordPlayHistory(state.currentTrack._id);
      }
    } else {
      audioPlayer.destroy();
    }
  }, [state.currentTrack]);

  // Handle play/pause sync from Context -> Audio
  useEffect(() => {
    if (state.isPlaying && state.currentTrack) {
      if (audioPlayer.getElement().paused) {
        audioPlayer.play().catch(console.error);
      }
    } else {
      if (!audioPlayer.getElement().paused) {
        audioPlayer.pause();
      }
    }
  }, [state.isPlaying, state.currentTrack]);

  const internalPlayNext = useCallback(() => {
    const curr = stateRef.current;
    if (curr.queue.length === 0) return;

    let nextIndex = curr.currentIndex + 1;

    if (curr.shuffleEnabled) {
      nextIndex = Math.floor(Math.random() * curr.queue.length);
    } else if (nextIndex >= curr.queue.length) {
      if (curr.repeatMode === "all") {
        nextIndex = 0;
      } else {
        setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
        return;
      }
    }

    setState(prev => ({
      ...prev,
      currentIndex: nextIndex,
      currentTrack: prev.queue[nextIndex],
      isPlaying: true,
      progress: 0,
      bufferProgress: 0,
    }));
  }, []);

  // Audio element listeners
  useEffect(() => {
    const audio = audioPlayer.getElement();

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, progress: audio.currentTime }));
    };

    const handleDurationChange = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const duration = audio.duration;
        setState(prev => ({ ...prev, bufferProgress: duration > 0 ? (bufferedEnd / duration) * 100 : 0 }));
      }
    };

    const handleEnded = () => {
      const curr = stateRef.current;
      if (curr.repeatMode === "one") {
        audioPlayer.seek(0);
        audioPlayer.play().catch(console.error);
      } else {
        internalPlayNext();
      }
    };

    const handleLoadStart = () => setState(prev => ({ ...prev, isLoadingAudio: true }));
    const handleCanPlay = () => setState(prev => ({ ...prev, isLoadingAudio: false }));
    const handleError = () => {
      setState(prev => ({ ...prev, isLoadingAudio: false, isPlaying: false }));
      console.error("Audio playback error");
      // Could automatically skip if we wanted here
    };

    const handlePlay = () => setState(prev => ({ ...prev, isPlaying: true }));
    const handlePause = () => setState(prev => ({ ...prev, isPlaying: false }));

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("progress", handleProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("waiting", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("progress", handleProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("waiting", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [internalPlayNext]);

  const mapToPlayerTrack = (track: Track): PlayerTrack => ({
    ...track,
    queueId: `${track._id}-${Math.random().toString(36).substr(2, 9)}`,
  });

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    let pQueue = state.queue;
    let index = -1;

    if (newQueue && newQueue.length > 0) {
      pQueue = newQueue.map(mapToPlayerTrack);
      index = pQueue.findIndex(t => t._id === track._id);
    } else {
      const existingIndex = state.queue.findIndex(t => t._id === track._id);
      if (existingIndex >= 0) {
        index = existingIndex;
      } else {
        const pTrack = mapToPlayerTrack(track);
        pQueue = [...state.queue, pTrack];
        index = pQueue.length - 1;
      }
    }

    if (index < 0) index = 0;

    setState(prev => ({
      ...prev,
      queue: pQueue,
      currentIndex: index,
      currentTrack: pQueue[index] || null,
      isPlaying: true, // Auto-play when initiated manually
      progress: 0,
      bufferProgress: 0,
    }));
  }, [state.queue]);

  const togglePlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !!prev.currentTrack && !prev.isPlaying
    }));
  }, []);

  const playNext = useCallback(() => {
    internalPlayNext();
  }, [internalPlayNext]);

  const playPrevious = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) return prev;

      // If we are somewhat into the track, restart it instead
      if (prev.progress > 3) {
        audioPlayer.seek(0);
        return prev;
      }

      let prevIndex = prev.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = 0; // or loop if required
      }
      return {
        ...prev,
        currentIndex: prevIndex,
        currentTrack: prev.queue[prevIndex],
        isPlaying: true,
        progress: 0,
        bufferProgress: 0,
      };
    });
  }, []);

  const setQueue = useCallback((tracks: Track[]) => {
    setState(prev => {
      const pQueue = tracks.map(mapToPlayerTrack);
      return {
        ...prev,
        queue: pQueue,
        currentIndex: 0,
        currentTrack: pQueue.length > 0 ? pQueue[0] : null,
      };
    });
  }, []);

  const clearQueue = useCallback(() => {
    setState(prev => ({
      ...prev,
      queue: [],
      currentIndex: -1,
      currentTrack: null,
      isPlaying: false,
      progress: 0,
      bufferProgress: 0,
    }));
    audioPlayer.destroy();
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({
      ...prev,
      shuffleEnabled: !prev.shuffleEnabled
    }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => {
      const modeMap: Record<string, "off" | "all" | "one"> = {
        "off": "all",
        "all": "one",
        "one": "off"
      };
      return {
        ...prev,
        repeatMode: modeMap[prev.repeatMode] as "off" | "all" | "one"
      };
    });
  }, []);

  const toggleFullscreen = useCallback(() => setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen })), []);

  const seek = useCallback((time: number) => {
    audioPlayer.seek(time);
    setState(prev => ({ ...prev, progress: time }));
  }, []);

  const setVolume = useCallback((v: number) => {
    audioPlayer.setVolume(v);
    setState(prev => ({ ...prev, volume: v }));
  }, []);

  return (
    <PlayerContext.Provider value={{
      ...state,
      playTrack,
      togglePlay,
      playNext,
      playPrevious,
      setQueue,
      clearQueue,
      toggleShuffle,
      toggleRepeat,
      toggleFullscreen,
      seek,
      setVolume
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayerContext must be within PlayerProvider");
  return ctx;
}
