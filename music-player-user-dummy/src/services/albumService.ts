import api from "@/lib/axios";
import type { Album } from "@/types/album";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const albumService = {
  getAll: async (params?: any) => {
    const response = await api.get<PaginatedResponse<Album>>("/albums", { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Album>>(`/albums/${id}`);
    return response.data;
  },
};
