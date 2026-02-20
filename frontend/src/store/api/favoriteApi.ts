import { baseApi } from './baseApi';
import type { FavoriteTracksResponse } from '../../types/playlist.types';
import type { BaseApiResponse } from '../../types/common.types';

export const favoriteApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFavoriteTracks: builder.query<FavoriteTracksResponse, { page?: number; limit?: number }>({
            query: (params) => ({
                url: '/favorites',
                params,
            }),
            providesTags: ['Track'], // Favorites are essentially tracks for the user
        }),
        addFavorite: builder.mutation<BaseApiResponse<null>, string>({
            query: (trackId) => ({
                url: `/favorites/${trackId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Track'],
        }),
        removeFavorite: builder.mutation<BaseApiResponse<null>, string>({
            query: (trackId) => ({
                url: `/favorites/${trackId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Track'],
        }),
    }),
});

export const {
    useGetFavoriteTracksQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
} = favoriteApi;
