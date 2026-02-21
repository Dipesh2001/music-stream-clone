import { useQuery } from "@tanstack/react-query";
import { trackService } from "@/services/trackService";
import { albumService } from "@/services/albumService";
import { artistService } from "@/services/artistService";
import { playlistService } from "@/services/playlistService";
import { favoriteService } from "@/services/favoriteService";

export const useTrendingTracks = () => {
    return useQuery({
        queryKey: ["tracks", "trending"],
        queryFn: async () => {
            const response = await trackService.getAll({ limit: 10 });
            return response.data.tracks;
        },
    });
};

export const useLatestAlbums = () => {
    return useQuery({
        queryKey: ["albums", "latest"],
        queryFn: async () => {
            const response = await albumService.getAll({ limit: 8 });
            return response.data.albums;
        },
    });
};

export const useFeaturedArtists = () => {
    return useQuery({
        queryKey: ["artists", "featured"],
        queryFn: async () => {
            const response = await artistService.getAll({ limit: 8 });
            return response.data.artists;
        },
    });
};

export const useMyPlaylists = () => {
    return useQuery({
        queryKey: ["playlists", "me"],
        queryFn: async () => {
            const response = await playlistService.getMine();
            return response.data.playlists || [];
        },
    });

};

export const useAlbumDetails = (id?: string) => {
    return useQuery({
        queryKey: ["albums", "detail", id],
        queryFn: async () => {
            if (!id) return null;
            const response = await albumService.getById(id);
            const tracksResponse = await trackService.getAll({ albumId: id });
            return {
                ...response.data,
                tracks: tracksResponse.data.tracks || []
            };
        },
        enabled: !!id,
    });
};

export const useArtistDetails = (id?: string) => {
    return useQuery({
        queryKey: ["artists", "detail", id],
        queryFn: async () => {
            if (!id) return null;
            const response = await artistService.getById(id);
            const [tracksResponse, albumsResponse] = await Promise.all([
                trackService.getAll({ artistId: id, limit: 10 }),
                albumService.getAll({ artistId: id, limit: 10 })
            ]);
            return {
                ...response.data,
                tracks: tracksResponse.data.tracks || [],
                albums: albumsResponse.data.albums || []
            };
        },
        enabled: !!id,
    });
};

export const usePlaylistDetails = (id?: string) => {
    return useQuery({
        queryKey: ["playlists", "detail", id],
        queryFn: async () => {
            if (!id) return null;
            const response = await playlistService.getById(id);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useMusicSearch = (query: string) => {
    return useQuery({
        queryKey: ["search", query],
        queryFn: async () => {
            if (!query) return { tracks: [], albums: [], artists: [] };
            const [tracksRes, albumsRes, artistsRes] = await Promise.all([
                trackService.getAll({ search: query, limit: 10 }),
                albumService.getAll({ search: query, limit: 10 }),
                artistService.getAll({ search: query, limit: 10 })
            ]);
            return {
                tracks: tracksRes.data.tracks || [],
                albums: albumsRes.data.albums || [],
                artists: artistsRes.data.artists || []
            };
        },
        enabled: query.length > 0,
    });
};

export const useFavorites = () => {
    return useQuery({
        queryKey: ["favorites", "me"],
        queryFn: async () => {
            const response = await favoriteService.getMine();
            return response.data;
        },
    });
};
