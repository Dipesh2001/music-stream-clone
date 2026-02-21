import api from "@/lib/axios";
import type { Artist } from "@/types/artist";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const artistService = {
  getAll: async (params?: any) => {
    const response = await api.get<PaginatedResponse<Artist>>("/artists", { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Artist>>(`/artists/${id}`);
    return response.data;
  },
};
