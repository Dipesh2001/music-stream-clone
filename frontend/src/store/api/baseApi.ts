import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import type { RootState } from '../';
import { selectCurrentAccessToken, selectCurrentRefreshToken, setCredentials, clearCredentials } from '../slices/authSlice';
import { type BaseQueryFn } from '@reduxjs/toolkit/query';
import { type FetchArgs } from '@reduxjs/toolkit/query';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setTokens } from '../../utils/auth';
import type { RefreshTokenResponse } from '../../types/auth.types';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000', // Backend base URL
  prepareHeaders: (headers, { getState }) => {
    const token = selectCurrentAccessToken(getState() as RootState);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const mutex = new Mutex();

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  Record<string, unknown>
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log('Unauthorized! Attempting to refresh token...');

    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const refreshToken = selectCurrentRefreshToken(state);

        if (refreshToken) {
          // Attempt to get a new token
          const refreshResult = await baseQuery(
            {
              url: '/auth/refresh-token',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            const refreshResponse = refreshResult.data as RefreshTokenResponse;
            console.log('Token refreshed successfully');

            // Update tokens in Redux state and localStorage
            api.dispatch(
              setCredentials({
                user: state.auth.user as any, // Preserve current user
                accessToken: refreshResponse.data.accessToken,
                refreshToken: refreshResponse.data.refreshToken,
              }),
            );
            setTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);

            // Retry the original query with the new token
            result = await baseQuery(args, api, extraOptions);
          } else {
            console.error('Failed to refresh token:', refreshResult.error);
            api.dispatch(clearCredentials());
          }
        } else {
          console.log('No refresh token available. Clearing credentials.');
          api.dispatch(clearCredentials());
        }
      } finally {
        // release must be called once the mutex should be released
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth, // Use the custom baseQuery
  // Define common tag types for cache invalidation
  tagTypes: ['Auth', 'User', 'Artist', 'Album', 'Track', 'Playlist', 'Analytics', 'Search'],
  endpoints: () => ({}), // Empty endpoints as this is the base API
});
