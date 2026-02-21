import api from "@/lib/axios";

export const playlistService = {
  getById: (id: string) => api.get(`/playlists/${id}`),
  getMine: () => api.get("/playlists/me"),
  create: (data: { title: string; description?: string }) => api.post("/playlists", data),
  addTrack: (playlistId: string, trackId: string) => api.post(`/playlists/${playlistId}/tracks`, { trackId }),
  removeTrack: (playlistId: string, trackId: string) => api.delete(`/playlists/${playlistId}/tracks/${trackId}`),
};
