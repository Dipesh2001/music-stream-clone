import type { BaseApiResponse } from './common.types';

// Dashboard overview stats
export interface DashboardStats {
    totalArtists: number;
    totalAlbums: number;
    totalTracks: number;
    totalUsers: number;
    totalPlaylists: number;
    totalPlays: number;
}

// Top artist with aggregated play count
export interface TopArtist {
    _id: string;
    name: string;
    image?: string;
    genres?: string[];
    totalPlays: number;
    trackCount: number;
}

// Top track with play count info
export interface TopTrack {
    _id: string;
    title: string;
    playCount: number;
    duration: number;
    artistName: string;
    artistId: string;
    albumTitle: string;
    albumId: string;
    coverImage?: string;
}

// Top album with aggregated play count
export interface TopAlbum {
    _id: string;
    title: string;
    coverImage?: string;
    genre?: string;
    artistName: string;
    artistId: string;
    totalPlays: number;
    trackCount: number;
}

// Query params for top lists
export interface TopListQueryParams {
    limit?: number;
}

// API Response types
export interface DashboardStatsResponse extends BaseApiResponse<DashboardStats> { }
export interface TopArtistsResponse extends BaseApiResponse<TopArtist[]> { }
export interface TopTracksResponse extends BaseApiResponse<TopTrack[]> { }
export interface TopAlbumsResponse extends BaseApiResponse<TopAlbum[]> { }
