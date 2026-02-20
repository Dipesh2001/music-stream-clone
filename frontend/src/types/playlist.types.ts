import type { Track } from './track.types';
import type { User } from './user.types';
import type { BaseApiResponse, PaginatedResult } from './common.types';

export enum PlaylistVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export interface PlaylistTrack {
    track: Track;
    addedAt: string;
    order: number;
}

export interface Playlist {
    _id: string;
    name: string;
    description?: string;
    owner: User;
    tracks: PlaylistTrack[];
    visibility: PlaylistVisibility;
    coverImage?: string;
    trackCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface PlaylistCreateRequest {
    name: string;
    description?: string;
    visibility: PlaylistVisibility;
    coverImage?: File | null;
}

export interface PlaylistUpdateRequest {
    name?: string;
    description?: string;
    visibility?: PlaylistVisibility;
    coverImage?: File | null;
}

export interface FavoriteTrack {
    _id: string;
    user: string;
    track: Track;
    createdAt: string;
}

export interface PlaylistApiResponse extends BaseApiResponse<Playlist> { }
export interface PlaylistListResponse extends BaseApiResponse<PaginatedResult<Playlist>> { }
export interface FavoriteTracksResponse extends BaseApiResponse<PaginatedResult<FavoriteTrack>> { }
