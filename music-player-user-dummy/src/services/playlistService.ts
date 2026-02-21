import api from "@/lib/axios";
import type { Playlist } from "@/types/playlist";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const playlistService = {
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Playlist>>(`/playlists/${id}`);
    return response.data;
  },
  getMine: async () => {
    const response = await api.get<ApiResponse<{ playlists: Playlist[] }>>("/playlists/me");
    return response.data;
  },


  create: async (data: { name: string; description?: string; isPublic?: boolean }) => {
    const response = await api.post<ApiResponse<Playlist>>("/playlists", data);
    return response.data;
  },
  addTrack: async (playlistId: string, trackId: string) => {
    const response = await api.post<ApiResponse<Playlist>>(`/playlists/${playlistId}/tracks`, { trackId });
    return response.data;
  },
  removeTrack: async (playlistId: string, trackId: string) => {
    const response = await api.delete<ApiResponse<Playlist>>(`/playlists/${playlistId}/tracks/${trackId}`);
    return response.data;
  },
};
