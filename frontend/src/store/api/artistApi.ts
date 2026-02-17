import { baseApi } from './baseApi';

export const artistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createArtist: builder.mutation<any, any>({
      query: (body) => ({
        url: '/artists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Artist'],
    }),
    getArtists: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/artists',
        params,
      }),
      providesTags: (result) =>
        result
          ? [...result.docs.map(({ id }: { id: string }) => ({ type: 'Artist' as const, id })), 'Artist']
          : ['Artist'],
    }),
    getArtistById: builder.query<any, string>({
      query: (id) => `/artists/${id}`,
      providesTags: (result, error, id) => [{ type: 'Artist', id }],
    }),
    updateArtist: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/artists/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Artist', id }],
    }),
    deleteArtist: builder.mutation<any, string>({
      query: (id) => ({
        url: `/artists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Artist', id }],
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
