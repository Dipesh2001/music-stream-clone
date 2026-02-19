// frontend/src/types/artist.types.ts

import type { BaseApiResponse } from "./common.types";

export enum ArtistStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface Artist {
  _id: string;
  name: string;
  bio?: string;
  image?: string;
  genres?: string[];
  debutDate?: string;
  status: ArtistStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistCreateRequest {
  name: string;
  bio?: string;
  image?: string;
  genres?: string[];
  debutDate?: string;
  status?: ArtistStatus;
}

export interface ArtistUpdateRequest {
  name?: string;
  bio?: string;
  image?: string;
  genres?: string[];
  debutDate?: string;
  status?: ArtistStatus;
}

// Full API response for a single artist
export interface ArtistApiResponse extends BaseApiResponse<Artist> { }
