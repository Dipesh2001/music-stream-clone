import type { Artist } from "./artist";
import type { Album } from "./album";

export interface Track {
  _id: string;
  title: string;
  artists: Artist[];
  album: Album;
  audioUrl: string;
  duration: number;
  playCount: number;
  isExplicit?: boolean;
  language?: string;
  order?: number;
  status?: 'active' | 'inactive';
  isLiked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
