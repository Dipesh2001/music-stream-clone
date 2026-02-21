// music-player-user-dummy/src/types/album.types.ts

import { z } from 'zod';
import { createAlbumSchema, updateAlbumSchema } from '../schemas/album.schema';

export interface IAlbum {
  _id: string;
  title: string;
  artists: string[]; // Referencing Artist IDs
  coverImage?: string;
  releaseDate?: string; // ISO Date string
  genre?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type IAlbumCreatePayload = z.infer<typeof createAlbumSchema>['body'];
export type IAlbumUpdatePayload = z.infer<typeof updateAlbumSchema>['body'];
