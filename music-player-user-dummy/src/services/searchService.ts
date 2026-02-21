import api from "@/lib/axios";

export const searchService = {
  search: (query: string) => api.get("/search", { params: { q: query } }),
};
