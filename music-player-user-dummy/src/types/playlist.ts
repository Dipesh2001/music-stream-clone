import type { Track } from "./track";

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  tracks: Track[];
  owner: { id: string; name: string };
  isPublic: boolean;
  trackCount: number;
}
