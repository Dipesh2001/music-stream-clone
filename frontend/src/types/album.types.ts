import type { Artist } from './artist.types';
import type { BaseApiResponse, PaginatedResult } from './common.types';

export enum AlbumStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Album {
  _id: string;
  title: string;
  releaseDate: string; // ISO date string
  genre: string;
  coverImage: string; // URL to the cover image
  artists: Artist[]; // Changed from single artist to an array of artists
  status: AlbumStatus;
  createdAt: string;
  updatedAt: string;
}

// Minimal Artist reference for creating/updating albums
export interface AlbumArtistReference {
  _id: string;
}

export interface AlbumCreateRequest {
  title: string;
  releaseDate: string; // ISO date string
  genre: string;
  artists: string[]; // Changed to an array of Artist IDs
  status: AlbumStatus;
  coverImage: File | null; // For multipart/form-data upload
}

export interface AlbumUpdateRequest {
  title?: string;
  releaseDate?: string; // ISO date string
  genre?: string;
  artists?: string[]; // Changed to an array of Artist IDs
  status?: AlbumStatus;
  coverImage?: File | null; // For multipart/form-data upload
}

// API Response for a single album
export interface AlbumApiResponse extends BaseApiResponse<Album> { }

// API Response for a list of albums (paginated)
export interface AlbumListResponse extends BaseApiResponse<PaginatedResult<Album>> { }
