import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../';
import { selectCurrentAccessToken } from '../slices/authSlice'; // Import selector for accessToken

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000', // Backend base URL
    prepareHeaders: (headers, { getState }) => {
      const token = selectCurrentAccessToken(getState() as RootState);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Define common tag types for cache invalidation
  tagTypes: ['Auth', 'User', 'Artist', 'Album', 'Track', 'Playlist'],
  endpoints: () => ({}), // Empty endpoints as this is the base API
});
