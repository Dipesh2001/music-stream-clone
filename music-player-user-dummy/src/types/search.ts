import type { Track } from "./track";
import type { Album } from "./album";
import type { Artist } from "./artist";
import type { Playlist } from "./playlist";

export interface SearchResults {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}
