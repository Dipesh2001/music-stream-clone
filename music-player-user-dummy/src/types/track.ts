import type { Artist } from "./artist";
import type { Album } from "./album";

export interface Track {
  id: string;
  title: string;
  duration: number;
  artist: Artist;
  album: Album;
  coverUrl: string;
  streamUrl: string;
  isLiked: boolean;
}
