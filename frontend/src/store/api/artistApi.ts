import { baseApi } from './baseApi';
import type { Artist, ArtistApiResponse, ArtistCreateRequest, ArtistUpdateRequest, ArtistStatus } from '../../types/artist.types';
import type { BaseApiResponse, PaginatedResult } from '../../types/common.types';

export const artistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createArtist: builder.mutation<ArtistApiResponse, ArtistCreateRequest>({
      query: (body) => ({
        url: '/artists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Artist'],
    }),
    getArtists: builder.query<BaseApiResponse<PaginatedResult<Artist>>, { page?: number; limit?: number; search?: string; status?: ArtistStatus }>({
      query: (params) => ({
        url: '/artists',
        params,
      }),
      providesTags: (result) =>
        result && result.data && result.data.artists
          ? [...result.data.artists.map(({ _id }) => ({ type: 'Artist' as const, id: _id })), 'Artist']
          : ['Artist'],
    }),
    getArtistById: builder.query<ArtistApiResponse, string>({
      query: (id) => `/artists/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Artist', id }],
    }),
    updateArtist: builder.mutation<ArtistApiResponse, { id: string; body: ArtistUpdateRequest }>({
      query: ({ id, body }) => ({
        url: `/artists/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Artist', id }],
    }),
    deleteArtist: builder.mutation<ArtistApiResponse, string>({
      query: (id) => ({
        url: `/artists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Artist', id }],
    }),
  }),
});

export const {
  useCreateArtistMutation,
  useGetArtistsQuery,
  useGetArtistByIdQuery,
  useUpdateArtistMutation,
  useDeleteArtistMutation,
} = artistApi;
