import api from "@/lib/axios";

export const trackService = {
  getById: (id: string) => api.get(`/tracks/${id}`),
  getPopular: () => api.get("/tracks/popular"),
  like: (id: string) => api.post(`/tracks/${id}/like`),
  unlike: (id: string) => api.delete(`/tracks/${id}/like`),
};
