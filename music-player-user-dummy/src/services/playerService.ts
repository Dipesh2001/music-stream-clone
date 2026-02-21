import api from "@/lib/axios";

export const playerService = {
  getStream: (trackId: string) => api.get(`/tracks/${trackId}/stream`),
  recordPlay: (trackId: string) => api.post(`/tracks/${trackId}/play`),
};
