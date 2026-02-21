import api from "@/lib/axios";

export const userService = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data: Record<string, unknown>) => api.put("/user/profile", data),
};
