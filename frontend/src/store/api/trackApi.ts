import { baseApi } from './baseApi';

export const trackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTrack: builder.mutation<any, any>({
      query: (body) => ({
        url: '/tracks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Track'],
    }),
    getTracks: builder.query<any, { page?: number; limit?: number; search?: string; albumId?: string; artistId?: string }>({
      query: (params) => ({
        url: '/tracks',
        params,
      }),
      providesTags: (result) =>
        result
          ? [...result.docs.map(({ id }: { id: string }) => ({ type: 'Track' as const, id })), 'Track']
          : ['Track'],
    }),
    getTrackById: builder.query<any, string>({
      query: (id) => `/tracks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Track', id }],
    }),
    updateTrack: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/tracks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Track', id }],
    }),
    deleteTrack: builder.mutation<any, string>({
      query: (id) => ({
        url: `/tracks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Track', id }],
    }),
    incrementPlayCount: builder.mutation<any, string>({
      query: (id) => ({
        url: `/tracks/${id}/play`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Track', id }], // Optionally invalidate track cache
    }),
  }),
});

export const {
  useCreateTrackMutation,
  useGetTracksQuery,
  useGetTrackByIdQuery,
  useUpdateTrackMutation,
  useDeleteTrackMutation,
  useIncrementPlayCountMutation,
} = trackApi;
