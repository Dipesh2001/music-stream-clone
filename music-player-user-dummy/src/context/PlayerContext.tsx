import React, { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import type { Track } from "@/types/track";

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isFullscreen: boolean;
  play: (track: Track, trackList?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleFullscreen: () => void;
  addToQueue: (track: Track) => void;
}

const PlayerContext = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueIndex = useRef(0);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = 0.8;

    audio.addEventListener("timeupdate", () => setProgress(audio.currentTime));
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => {
      if (queueIndex.current < queue.length - 1) {
        queueIndex.current += 1;
        const nextTrack = queue[queueIndex.current];
        setCurrentTrack(nextTrack);
        audio.src = nextTrack.streamUrl;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    });

    return () => { audio.pause(); audio.src = ""; };
  }, []);

  // Sync queue ended handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handler = () => {
      if (queueIndex.current < queue.length - 1) {
        queueIndex.current += 1;
        const nextTrack = queue[queueIndex.current];
        setCurrentTrack(nextTrack);
        audio.src = nextTrack.streamUrl;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };
    audio.removeEventListener("ended", handler);
    audio.addEventListener("ended", handler);
  }, [queue]);

  const play = useCallback((track: Track, trackList?: Track[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const list = trackList || [track];
    setQueue(list);
    queueIndex.current = list.findIndex((t) => t.id === track.id);
    if (queueIndex.current < 0) queueIndex.current = 0;
    setCurrentTrack(track);
    audio.src = track.streamUrl;
    audio.play().catch(() => {});
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => { audioRef.current?.pause(); setIsPlaying(false); }, []);
  const resume = useCallback(() => { audioRef.current?.play(); setIsPlaying(true); }, []);

  const next = useCallback(() => {
    if (queueIndex.current < queue.length - 1) {
      queueIndex.current += 1;
      const t = queue[queueIndex.current];
      setCurrentTrack(t);
      if (audioRef.current) { audioRef.current.src = t.streamUrl; audioRef.current.play(); setIsPlaying(true); }
    }
  }, [queue]);

  const previous = useCallback(() => {
    if (queueIndex.current > 0) {
      queueIndex.current -= 1;
      const t = queue[queueIndex.current];
      setCurrentTrack(t);
      if (audioRef.current) { audioRef.current.src = t.streamUrl; audioRef.current.play(); setIsPlaying(true); }
    }
  }, [queue]);

  const seek = useCallback((time: number) => { if (audioRef.current) audioRef.current.currentTime = time; }, []);
  const setVolume = useCallback((v: number) => { setVolumeState(v); if (audioRef.current) audioRef.current.volume = v; }, []);
  const toggleFullscreen = useCallback(() => setIsFullscreen((p) => !p), []);
  const addToQueue = useCallback((track: Track) => setQueue((q) => [...q, track]), []);

  return (
    <PlayerContext.Provider value={{ currentTrack, queue, isPlaying, progress, duration, volume, isFullscreen, play, pause, resume, next, previous, seek, setVolume, toggleFullscreen, addToQueue }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayerContext must be within PlayerProvider");
  return ctx;
}
