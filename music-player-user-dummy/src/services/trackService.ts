import api from "@/lib/axios";
import type { Track } from "@/types/track";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const trackService = {
  getAll: async (params?: any) => {
    const response = await api.get<PaginatedResponse<Track>>("/tracks", { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Track>>(`/tracks/${id}`);
    return response.data;
  },
  incrementPlayCount: async (id: string) => {
    const response = await api.post<ApiResponse<any>>(`/tracks/${id}/play`);
    return response.data;
  },
};
