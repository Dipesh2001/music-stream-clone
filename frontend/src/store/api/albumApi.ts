import { baseApi } from './baseApi';

export const albumApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAlbum: builder.mutation<any, any>({
      query: (body) => ({
        url: '/albums',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Album'],
    }),
    getAlbums: builder.query<any, { page?: number; limit?: number; search?: string; artistId?: string }>({
      query: (params) => ({
        url: '/albums',
        params,
      }),
      providesTags: (result) =>
        result
          ? [...result.docs.map(({ id }: { id: string }) => ({ type: 'Album' as const, id })), 'Album']
          : ['Album'],
    }),
    getAlbumById: builder.query<any, string>({
      query: (id) => `/albums/${id}`,
      providesTags: (result, error, id) => [{ type: 'Album', id }],
    }),
    updateAlbum: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/albums/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Album', id }],
    }),
    deleteAlbum: builder.mutation<any, string>({
      query: (id) => ({
        url: `/albums/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Album', id }],
    }),
  }),
});

export const {
  useCreateAlbumMutation,
  useGetAlbumsQuery,
  useGetAlbumByIdQuery,
  useUpdateAlbumMutation,
  useDeleteAlbumMutation,
} = albumApi;
