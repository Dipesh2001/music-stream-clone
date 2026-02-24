import type { Track } from "./track";

export interface PlayerTrack extends Track {
    queueId: string; // Unique ID for queue instance
}

export interface PlayerState {
    currentTrack: PlayerTrack | null;
    queue: PlayerTrack[];
    isPlaying: boolean;
    currentIndex: number;
    repeatMode: "off" | "all" | "one";
    shuffleEnabled: boolean;
    isFullscreen: boolean;
    progress: number;
    duration: number;
    volume: number;
    isLoadingAudio: boolean;
    bufferProgress: number;
}
