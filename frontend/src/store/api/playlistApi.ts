import { baseApi } from './baseApi';
import type {
    PlaylistApiResponse,
    PlaylistCreateRequest,
    PlaylistListResponse,
    PlaylistUpdateRequest,
} from '../../types/playlist.types';

export const playlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlaylists: builder.query<
            PlaylistListResponse,
            { page?: number; limit?: number; search?: string; userId?: string; visibility?: string }
        >({
            query: (params) => ({
                url: '/playlists',
                params,
            }),
            providesTags: (result) =>
                result?.data?.playlists
                    ? [
                        ...result.data.playlists.map(({ _id }) => ({ type: 'Playlist' as const, id: _id })),
                        { type: 'Playlist', id: 'LIST' },
                    ]
                    : [{ type: 'Playlist', id: 'LIST' }],
        }),
        getPlaylistById: builder.query<PlaylistApiResponse, string>({
            query: (id) => `/playlists/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Playlist', id }],
        }),
        createPlaylist: builder.mutation<PlaylistApiResponse, PlaylistCreateRequest>({
            query: (body) => {
                const formData = new FormData();
                formData.append('name', body.name);
                if (body.description) formData.append('description', body.description);
                formData.append('visibility', body.visibility);
                if (body.coverImage) formData.append('coverImage', body.coverImage);

                return {
                    url: '/playlists',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
        }),
        updatePlaylist: builder.mutation<PlaylistApiResponse, { id: string; body: PlaylistUpdateRequest }>({
            query: ({ id, body }) => {
                const formData = new FormData();
                if (body.name) formData.append('name', body.name);
                if (body.description) formData.append('description', body.description);
                if (body.visibility) formData.append('visibility', body.visibility);
                if (body.coverImage) formData.append('coverImage', body.coverImage);

                return {
                    url: `/playlists/${id}`,
                    method: 'PUT',
                    body: formData,
                };
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Playlist', id },
                { type: 'Playlist', id: 'LIST' },
            ],
        }),
        deletePlaylist: builder.mutation<PlaylistApiResponse, string>({
            query: (id) => ({
                url: `/playlists/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
        }),
        addTrackToPlaylist: builder.mutation<PlaylistApiResponse, { playlistId: string; trackId: string }>({
            query: ({ playlistId, trackId }) => ({
                url: `/playlists/${playlistId}/tracks`,
                method: 'POST',
                body: { trackId },
            }),
            invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'Playlist', id: playlistId }],
        }),
        removeTrackFromPlaylist: builder.mutation<PlaylistApiResponse, { playlistId: string; trackId: string }>({
            query: ({ playlistId, trackId }) => ({
                url: `/playlists/${playlistId}/tracks/${trackId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'Playlist', id: playlistId }],
        }),
    }),
});

export const {
    useGetPlaylistsQuery,
    useGetPlaylistByIdQuery,
    useCreatePlaylistMutation,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
    useAddTrackToPlaylistMutation,
    useRemoveTrackFromPlaylistMutation,
} = playlistApi;
