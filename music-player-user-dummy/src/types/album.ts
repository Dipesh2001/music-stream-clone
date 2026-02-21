import type { Artist } from "./artist";
import type { Track } from "./track";

export interface Album {
  id: string;
  title: string;
  coverUrl: string;
  artist: Artist;
  releaseYear: number;
  tracks: Track[];
}
