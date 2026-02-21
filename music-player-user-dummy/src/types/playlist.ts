import type { Track } from "./track";

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  tracks: Track[] | string[];
  isPublic: boolean;
  coverImage?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}
