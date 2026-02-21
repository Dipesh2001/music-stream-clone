import type { BaseApiResponse } from './common.types';

// Search result shapes (subset of full entities, matching backend select fields)
export interface SearchResultArtist {
    _id: string;
    name: string;
    image?: string;
    genres?: string[];
}

export interface SearchResultAlbum {
    _id: string;
    title: string;
    coverImage?: string;
    genres?: string[];
    artist?: {
        _id: string;
        name: string;
    };
}

export interface SearchResultTrack {
    _id: string;
    title: string;
    audioUrl: string;
    duration: number;
    language?: string;
    isExplicit: boolean;
    artist?: {
        _id: string;
        name: string;
    };
    album?: {
        _id: string;
        title: string;
        coverImage?: string;
    };
}

// Combined search response data
export interface GlobalSearchData {
    artists: SearchResultArtist[];
    albums: SearchResultAlbum[];
    tracks: SearchResultTrack[];
}

// Query params for global search
export interface GlobalSearchQueryParams {
    q: string;
    limit?: number;
}

// Full API response
export interface GlobalSearchResponse extends BaseApiResponse<GlobalSearchData> { }
