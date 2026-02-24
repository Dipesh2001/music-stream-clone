import type { Track } from "./track";
import type { Artist } from "./artist";
import type { Album } from "./album";

export type { Track };

export interface Playlist {
    _id: string;
    name: string;
    description?: string;
    owner: string | any;
    tracks: string[] | Track[];
    isPublic: boolean;
    coverImage?: string;
    status: "active" | "inactive";
    createdAt?: string;
    updatedAt?: string;
}

export interface PlaylistTrack extends Track {
    addedAt?: string;
}

export interface Favorite {
    _id: string;
    user: string;
    track?: Track;
    album?: Album;
    createdAt?: string;
    updatedAt?: string;
}

export interface PlayHistoryItem {
    _id: string;
    user: string;
    track: Track;
    playedAt: string;
    lastPosition: number;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}
