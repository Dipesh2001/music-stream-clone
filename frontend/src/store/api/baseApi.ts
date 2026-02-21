import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'; // Import retry
import { Mutex } from 'async-mutex';
import type { RootState } from '../';
import { selectCurrentAccessToken, selectCurrentRefreshToken, setCredentials, clearCredentials } from '../slices/authSlice';
import { type BaseQueryFn } from '@reduxjs/toolkit/query';
import { type FetchArgs } from '@reduxjs/toolkit/query';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setTokens } from '../../utils/auth';
import type { RefreshTokenResponse } from '../../types/auth.types';

// Define a custom error type for better error normalization
interface CustomFetchBaseQueryError {
  status: number;
  data: {
    message: string;
    statusCode?: number;
    // Add other common error fields from your backend
  };
}

// Create an enhanced base query with retry logic
const staggeredBaseQuery = retry(fetchBaseQuery({
  baseUrl: 'http://localhost:5000', // Backend base URL
  prepareHeaders: (headers, { getState }) => {
    const token = selectCurrentAccessToken(getState() as RootState);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
}), {
  maxRetries: 3, // Retry a failed request up to 3 times
});

const mutex = new Mutex();

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | CustomFetchBaseQueryError, // Update error type to include CustomFetchBaseQueryError
  Record<string, unknown>
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await staggeredBaseQuery(args, api, extraOptions); // Use the staggeredBaseQuery

  if (result.error && result.error.status === 401) {
    console.log('Unauthorized! Attempting to refresh token...');

    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const refreshToken = selectCurrentRefreshToken(state);
        const currentUser = selectCurrentUser(state); // Get the current user

        if (refreshToken && currentUser) { // Ensure currentUser is not null
          const refreshResult = await staggeredBaseQuery(
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

            api.dispatch(
              setCredentials({
                user: currentUser, // Use the non-null currentUser
                accessToken: refreshResponse.data.accessToken,
                refreshToken: refreshResponse.data.refreshToken,
              }),
            );
            setTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);

            // Retry the original query with the new token
            result = await staggeredBaseQuery(args, api, extraOptions);
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
      result = await staggeredBaseQuery(args, api, extraOptions); // Use staggeredBaseQuery
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
