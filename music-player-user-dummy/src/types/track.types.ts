// music-player-user-dummy/src/types/track.types.ts

import { z } from 'zod';
import { createTrackSchema, updateTrackSchema, batchUpdateOrderSchema } from '../schemas/track.schema';

export interface ITrack {
  _id: string;
  title: string;
  artists: string[]; // Referencing Artist IDs
  album: string; // Referencing Album ID
  audioUrl: string;
  duration: number; // in seconds
  language?: string;
  isExplicit: boolean;
  playCount: number;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type ITrackCreatePayload = z.infer<typeof createTrackSchema>['body'];
export type ITrackUpdatePayload = z.infer<typeof updateTrackSchema>['body'];
export type IBatchUpdateOrderPayload = z.infer<typeof batchUpdateOrderSchema>;
