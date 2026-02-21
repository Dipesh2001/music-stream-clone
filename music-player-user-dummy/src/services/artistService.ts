import api from "@/lib/axios";

export const artistService = {
  getById: (id: string) => api.get(`/artists/${id}`),
  getPopular: () => api.get("/artists/popular"),
  getAlbums: (id: string) => api.get(`/artists/${id}/albums`),
  getTopTracks: (id: string) => api.get(`/artists/${id}/top-tracks`),
};
