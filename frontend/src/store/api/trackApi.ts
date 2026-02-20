import { baseApi } from './baseApi';
import type {
  TrackApiResponse,
  TrackCreateRequest,
  TrackListResponse,
  TrackUpdateRequest,
  TrackBatchOrderUpdateRequest,
} from '../../types/track.types';

export const trackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTracks: builder.query<
      TrackListResponse,
      { page?: number; limit?: number; search?: string; albumId?: string | string[]; artistId?: string | string[] }
    >({
      query: (params) => ({
        url: '/tracks',
        params,
      }),
      providesTags: (result) =>
        result?.data?.tracks
          ? [
            ...result.data.tracks.map(({ _id }) => ({ type: 'Track' as const, id: _id })),
            { type: 'Track', id: 'LIST' },
          ]
          : [{ type: 'Track', id: 'LIST' }],
    }),
    getTrackById: builder.query<TrackApiResponse, string>({
      query: (id) => `/tracks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Track', id }],
    }),
    createTrack: builder.mutation<TrackApiResponse, TrackCreateRequest>({
      query: (body) => {
        const formData = new FormData();
        formData.append('title', body.title);
        body.artists.forEach((id) => formData.append('artists[]', id));
        formData.append('album', body.album);
        formData.append('audioFile', body.audioFile);
        formData.append('duration', String(body.duration));
        if (body.language) formData.append('language', body.language);
        if (body.isExplicit !== undefined) formData.append('isExplicit', String(body.isExplicit));
        if (body.order !== undefined) formData.append('order', String(body.order));
        if (body.status) formData.append('status', body.status);

        return {
          url: '/tracks',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Track', id: 'LIST' }, 'Album'],
    }),
    updateTrack: builder.mutation<
      TrackApiResponse,
      { id: string; body: TrackUpdateRequest }
    >({
      query: ({ id, body }) => {
        const formData = new FormData();
        if (body.title) formData.append('title', body.title);
        if (body.artists) {
          body.artists.forEach((id) => formData.append('artists[]', id));
        }
        if (body.album) formData.append('album', body.album);
        if (body.audioFile) {
          formData.append('audioFile', body.audioFile);
        }
        if (body.duration) formData.append('duration', String(body.duration));
        if (body.language !== undefined) formData.append('language', body.language);
        if (body.isExplicit !== undefined) formData.append('isExplicit', String(body.isExplicit));
        if (body.order !== undefined) formData.append('order', String(body.order));
        if (body.status) formData.append('status', body.status);

        return {
          url: `/tracks/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Track', id },
        { type: 'Track', id: 'LIST' },
        'Album',
      ],
    }),
    deleteTrack: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tracks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Track', id: 'LIST' }, 'Album'],
    }),
    updateTrackOrder: builder.mutation<void, TrackBatchOrderUpdateRequest>({
      query: (body) => ({
        url: '/tracks/order',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Track', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTracksQuery,
  useGetTrackByIdQuery,
  useCreateTrackMutation,
  useUpdateTrackMutation,
  useDeleteTrackMutation,
  useUpdateTrackOrderMutation,
} = trackApi;
