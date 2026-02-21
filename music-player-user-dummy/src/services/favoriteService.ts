import api from "@/lib/axios";
import type { Track } from "@/types/track";
import type { Album } from "@/types/album";
import type { ApiResponse } from "@/types/api";

export interface FavoritesResponse {
    tracks: Track[];
    albums: Album[];
}

export const favoriteService = {
    getMine: async () => {
        const response = await api.get<ApiResponse<FavoritesResponse>>("/favorites/me");
        return response.data;
    },
    toggleTrack: async (trackId: string) => {
        // We'll need to check if liked or just try to like.
        // Usually services have simple like/unlike.
        return api.post(`/favorites/tracks/${trackId}`);
    },
    unlikeTrack: async (trackId: string) => {
        return api.delete(`/favorites/tracks/${trackId}`);
    }
};
