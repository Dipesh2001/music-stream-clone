import type { Track } from "@/types/track";
import type { Album } from "@/types/album";
import type { Artist } from "@/types/artist";
import type { Playlist } from "@/types/playlist";

// Mock data for the UI—replace with API calls when backend is ready.

const mockArtist: Artist = {
  id: "artist-1",
  name: "Luna Eclipse",
  imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  bio: "Electronic music producer and vocalist.",
  monthlyListeners: 2_450_000,
};

const mockArtist2: Artist = {
  id: "artist-2",
  name: "Neon Waves",
  imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
  monthlyListeners: 1_200_000,
};

const mockArtist3: Artist = {
  id: "artist-3",
  name: "Velvet Skies",
  imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
  monthlyListeners: 890_000,
};

const mockAlbum: Album = {
  id: "album-1",
  title: "Midnight Signals",
  coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  artist: mockArtist,
  releaseYear: 2024,
  tracks: [],
};

const mockAlbum2: Album = {
  id: "album-2",
  title: "Electric Dreams",
  coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  artist: mockArtist2,
  releaseYear: 2025,
  tracks: [],
};

const mockAlbum3: Album = {
  id: "album-3",
  title: "Chill Horizons",
  coverUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop",
  artist: mockArtist3,
  releaseYear: 2024,
  tracks: [],
};

export const mockTracks: Track[] = [
  { id: "t1", title: "Starlight", duration: 234, artist: mockArtist, album: mockAlbum, coverUrl: mockAlbum.coverUrl, streamUrl: "", isLiked: true },
  { id: "t2", title: "Digital Rain", duration: 198, artist: mockArtist, album: mockAlbum, coverUrl: mockAlbum.coverUrl, streamUrl: "", isLiked: false },
  { id: "t3", title: "Pulse", duration: 256, artist: mockArtist2, album: mockAlbum2, coverUrl: mockAlbum2.coverUrl, streamUrl: "", isLiked: false },
  { id: "t4", title: "Synthwave Blvd", duration: 312, artist: mockArtist2, album: mockAlbum2, coverUrl: mockAlbum2.coverUrl, streamUrl: "", isLiked: true },
  { id: "t5", title: "Ocean Drive", duration: 278, artist: mockArtist3, album: mockAlbum3, coverUrl: mockAlbum3.coverUrl, streamUrl: "", isLiked: false },
  { id: "t6", title: "Night Owl", duration: 203, artist: mockArtist3, album: mockAlbum3, coverUrl: mockAlbum3.coverUrl, streamUrl: "", isLiked: false },
  { id: "t7", title: "Fading Echoes", duration: 189, artist: mockArtist, album: mockAlbum, coverUrl: mockAlbum.coverUrl, streamUrl: "", isLiked: true },
  { id: "t8", title: "Vapor Trail", duration: 245, artist: mockArtist2, album: mockAlbum2, coverUrl: mockAlbum2.coverUrl, streamUrl: "", isLiked: false },
];

export const mockAlbums: Album[] = [
  { ...mockAlbum, tracks: mockTracks.slice(0, 3) },
  { ...mockAlbum2, tracks: mockTracks.slice(3, 6) },
  { ...mockAlbum3, tracks: mockTracks.slice(4, 7) },
  { id: "album-4", title: "Solar Flares", coverUrl: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop", artist: mockArtist, releaseYear: 2023, tracks: [] },
  { id: "album-5", title: "Cosmic Drift", coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop", artist: mockArtist2, releaseYear: 2025, tracks: [] },
  { id: "album-6", title: "Ambient Waves", coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop", artist: mockArtist3, releaseYear: 2024, tracks: [] },
];

export const mockArtists: Artist[] = [mockArtist, mockArtist2, mockArtist3];

export const mockPlaylists: Playlist[] = [
  { id: "pl-1", title: "Late Night Vibes", description: "Chill electronic beats", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", tracks: mockTracks.slice(0, 4), owner: { id: "u1", name: "You" }, isPublic: true, trackCount: 4 },
  { id: "pl-2", title: "Workout Mix", description: "High energy tracks", coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop", tracks: mockTracks.slice(2, 7), owner: { id: "u1", name: "You" }, isPublic: false, trackCount: 5 },
  { id: "pl-3", title: "Road Trip", description: "Perfect road trip soundtrack", coverUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop", tracks: mockTracks.slice(1, 5), owner: { id: "u1", name: "You" }, isPublic: true, trackCount: 4 },
];

export function useFetchHomeData() {
  return {
    tracks: mockTracks,
    albums: mockAlbums,
    artists: mockArtists,
    playlists: mockPlaylists,
    isLoading: false,
  };
}
