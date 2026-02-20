import { baseApi } from './baseApi';
import type {
  AlbumApiResponse,
  AlbumCreateRequest,
  AlbumListResponse,
  AlbumUpdateRequest,
} from '../../types/album.types';

export const albumApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAlbum: builder.mutation<AlbumApiResponse, AlbumCreateRequest>({
      query: (body) => {
        const formData = new FormData();
        formData.append('title', body.title);
        formData.append('releaseDate', body.releaseDate);
        formData.append('genre', body.genre);
        body.artists.forEach(artistId => { // Handle array of artists
          formData.append('artists[]', artistId);
        });
        formData.append('status', body.status);
        if (body.coverImage) {
          formData.append('coverImage', body.coverImage);
        }
        return {
          url: '/albums',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Album'],
    }),
    getAlbums: builder.query<
      AlbumListResponse,
      { page?: number; limit?: number; search?: string; artistId?: string | string[] }
    >({
      query: (params) => ({
        url: '/albums',
        params,
      }),
      providesTags: (result) =>
        result?.data?.albums // Access the 'albums' property within the paginated result
          ? [
            ...result.data.albums.map(({ _id }) => ({ type: 'Album' as const, id: _id })),
            { type: 'Album', id: 'LIST' },
          ]
          : [{ type: 'Album', id: 'LIST' }],
    }),
    getAlbumById: builder.query<AlbumApiResponse, string>({
      query: (id) => `/albums/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Album', id }],
    }),
    updateAlbum: builder.mutation<
      AlbumApiResponse,
      { id: string; body: AlbumUpdateRequest }
    >({
      query: ({ id, body }) => {
        const formData = new FormData();
        if (body.title) formData.append('title', body.title);
        if (body.releaseDate) formData.append('releaseDate', body.releaseDate);
        if (body.genre) formData.append('genre', body.genre);
        if (body.artists && body.artists.length > 0) { // Handle array of artists
          body.artists.forEach(artistId => {
            formData.append('artists[]', artistId);
          });
        }
        if (body.status) formData.append('status', body.status);
        if (body.coverImage) {
          formData.append('coverImage', body.coverImage);
        } else if (body.coverImage === null) {
          // Explicitly handle case where image is removed
          formData.append('coverImage', '');
        }

        return {
          url: `/albums/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Album', id }],
    }),
    deleteAlbum: builder.mutation<AlbumApiResponse, string>({
      query: (id) => ({
        url: `/albums/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Album', id }, { type: 'Album', id: 'LIST' }],
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
