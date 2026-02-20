import type { Artist } from './artist.types';
import type { Album } from './album.types';
import type { BaseApiResponse, PaginatedResult } from './common.types';

export enum TrackStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export interface TrackAudioMeta {
    duration: number;
    size: number;
    mimeType: string;
}

export interface Track {
    _id: string;
    title: string;
    artists: Artist[];
    album: Album;
    audioUrl: string;
    duration: number;
    language?: string;
    isExplicit: boolean;
    order: number;
    status: TrackStatus;
    playCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface TrackCreateRequest {
    title: string;
    artists: string[]; // Artist IDs
    album: string;  // Album ID
    audioFile: File;
    language?: string;
    isExplicit?: boolean;
    order?: number;
    status?: TrackStatus;
    duration: number; // Duration is required by backend schema
}

export interface TrackUpdateRequest {
    title?: string;
    artists?: string[];
    album?: string;
    audioFile?: File | null;
    language?: string;
    isExplicit?: boolean;
    order?: number;
    status?: TrackStatus;
    duration?: number;
}

export interface TrackBatchOrderUpdateRequest {
    albumId: string;
    orders: {
        trackId: string;
        order: number;
    }[];
}

export interface TrackApiResponse extends BaseApiResponse<Track> { }

export interface TrackListResponse extends BaseApiResponse<PaginatedResult<Track>> { }
