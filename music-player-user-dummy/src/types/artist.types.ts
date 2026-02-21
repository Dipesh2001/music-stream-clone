// music-player-user-dummy/src/types/artist.types.ts

import { z } from 'zod';
import { createArtistSchema, updateArtistSchema } from '../schemas/artist.schema';

export interface IArtist {
  _id: string;
  name: string;
  bio?: string;
  image?: string;
  genres?: string[];
  debutDate?: string; // ISO Date string
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type IArtistCreatePayload = z.infer<typeof createArtistSchema>['body'];
export type IArtistUpdatePayload = z.infer<typeof updateArtistSchema>['body'];
