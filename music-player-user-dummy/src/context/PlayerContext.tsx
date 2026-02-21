import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Track } from "@/types/track";
import type { PlayerTrack, PlayerState } from "@/types/player";

interface PlayerContextValue extends PlayerState {
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setQueue: (tracks: Track[]) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  // UI mocks to not break existing code before actual wiring
  toggleFullscreen: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const STORAGE_KEY = "music_player_last_played";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          currentTrack: parsed.currentTrack || null,
          queue: parsed.queue || [],
          isPlaying: false,
          currentIndex: parsed.currentIndex || 0,
          repeatMode: parsed.repeatMode || "off",
          shuffleEnabled: parsed.shuffleEnabled || false,
          isFullscreen: false,
          progress: 0,
          duration: 100, // mock duration
          volume: 0.8,
        };
      } catch (e) {
        // ignore
      }
    }
    return {
      currentTrack: null,
      queue: [],
      isPlaying: false,
      currentIndex: -1,
      repeatMode: "off",
      shuffleEnabled: false,
      isFullscreen: false,
      progress: 0,
      duration: 100, // mock duration
      volume: 0.8,
    };
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentTrack: state.currentTrack,
      queue: state.queue,
      currentIndex: state.currentIndex,
      repeatMode: state.repeatMode,
      shuffleEnabled: state.shuffleEnabled,
    }));
  }, [state.currentTrack, state.queue, state.currentIndex, state.repeatMode, state.shuffleEnabled]);

  // Temporary interval to fake progress if it's playing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state.isPlaying) {
      interval = setInterval(() => {
        setState(prev => {
          if (prev.progress >= prev.duration) {
            // Handle next logic inside progress mock
            if (prev.queue.length === 0) return { ...prev, progress: 0, isPlaying: false };
            let nextIndex = prev.currentIndex + 1;
            if (nextIndex >= prev.queue.length) {
              if (prev.repeatMode === "all") {
                nextIndex = 0;
              } else {
                return { ...prev, isPlaying: false, progress: 0, currentIndex: 0, currentTrack: prev.queue[0] };
              }
            }
            return {
              ...prev,
              currentIndex: nextIndex,
              currentTrack: prev.queue[nextIndex],
              progress: 0,
            };
          }
          return { ...prev, progress: prev.progress + 1 };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.isPlaying]);

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
      isPlaying: true,
      progress: 0,
    }));
  }, [state.queue]);

  const togglePlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !!prev.currentTrack && !prev.isPlaying
    }));
  }, []);

  const playNext = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) return prev;

      let nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.queue.length) {
        if (prev.repeatMode === "all") {
          nextIndex = 0;
        } else {
          return { ...prev, isPlaying: false, currentIndex: 0, currentTrack: prev.queue[0], progress: 0 };
        }
      }
      return {
        ...prev,
        currentIndex: nextIndex,
        currentTrack: prev.queue[nextIndex],
        isPlaying: true,
        progress: 0,
      };
    });
  }, []);

  const playPrevious = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) return prev;

      let prevIndex = prev.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = 0;
      }
      return {
        ...prev,
        currentIndex: prevIndex,
        currentTrack: prev.queue[prevIndex],
        isPlaying: true,
        progress: 0,
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
    }));
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
        repeatMode: modeMap[prev.repeatMode]
      };
    });
  }, []);

  // UI Mocks
  const toggleFullscreen = useCallback(() => setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen })), []);
  const seek = useCallback((time: number) => setState(prev => ({ ...prev, progress: time })), []);
  const setVolume = useCallback((v: number) => setState(prev => ({ ...prev, volume: v })), []);

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
