import type { Artist } from "./artist";
import type { Track } from "./track";

export interface Album {
  _id: string;
  title: string;
  coverImage: string;
  artists: Artist[];
  releaseDate: string;
  genre: string;
  status?: 'active' | 'inactive';
  tracks?: Track[];
  createdAt?: string;
  updatedAt?: string;
}
