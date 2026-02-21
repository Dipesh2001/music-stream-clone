// music-player-user-dummy/src/types/playlist.types.ts

import { z } from 'zod';
import { createPlaylistSchema, addTrackSchema } from '../schemas/playlist.schema';

export interface IPlaylist {
  _id: string;
  name: string;
  description?: string;
  owner: string; // Referencing User ID
  tracks: string[]; // Referencing Track IDs
  isPublic: boolean;
  coverImage?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type IPlaylistCreatePayload = z.infer<typeof createPlaylistSchema>['body'];
export type IAddTrackPayload = z.infer<typeof addTrackSchema>['body'];
