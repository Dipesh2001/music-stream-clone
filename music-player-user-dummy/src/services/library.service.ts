import api from "@/lib/axios";
import {
    favoriteListResponseSchema,
    playlistListResponseSchema,
    singlePlaylistResponseSchema,
    playHistoryListResponseSchema
} from "../schemas/library.schema";

export const libraryService = {
    getFavorites: async () => {
        const res = await api.get("/favorites/me");
        return favoriteListResponseSchema.parse(res.data);
    },

    toggleFavorite: async (trackId: string, currentlyLiked: boolean) => {
        if (currentlyLiked) {
            const res = await api.delete(`/favorites/tracks/${trackId}`);
            return res.data;
        } else {
            const res = await api.post(`/favorites/tracks/${trackId}`);
            return res.data;
        }
    },

    getPlaylists: async () => {
        const res = await api.get("/playlists/me");
        return playlistListResponseSchema.parse(res.data);
    },

    getPlaylistById: async (id: string) => {
        const res = await api.get(`/playlists/${id}`);
        return singlePlaylistResponseSchema.parse(res.data);
    },

    createPlaylist: async (payload: { name: string; description?: string; isPublic?: boolean }) => {
        const res = await api.post("/playlists", payload);
        return singlePlaylistResponseSchema.parse(res.data);
    },

    addTrackToPlaylist: async (playlistId: string, trackId: string) => {
        const res = await api.post(`/playlists/${playlistId}/tracks`, { trackId });
        return singlePlaylistResponseSchema.parse(res.data);
    },

    removeTrackFromPlaylist: async (playlistId: string, trackId: string) => {
        const res = await api.delete(`/playlists/${playlistId}/tracks/${trackId}`);
        return singlePlaylistResponseSchema.parse(res.data);
    },

    getRecentlyPlayed: async (limit = 10) => {
        const res = await api.get(`/player/recent?limit=${limit}`);
        return playHistoryListResponseSchema.parse(res.data);
    },

    recordPlay: async (trackId: string) => {
        const res = await api.post(`/player/progress/${trackId}`, {
            lastPosition: 0,
            completed: true
        });
        return res.data;
    }
};
