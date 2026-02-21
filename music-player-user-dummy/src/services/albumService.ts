import api from "@/lib/axios";

export const albumService = {
  getById: (id: string) => api.get(`/albums/${id}`),
  getPopular: () => api.get("/albums/popular"),
  getNew: () => api.get("/albums/new"),
};
