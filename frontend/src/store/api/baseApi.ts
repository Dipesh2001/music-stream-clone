import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

import { clearCredentials } from '../slices/authSlice';
import { type BaseQueryFn } from '@reduxjs/toolkit/query';
import { type FetchArgs } from '@reduxjs/toolkit/query';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Define a custom error type for better error normalization
interface CustomFetchBaseQueryError {
  status: number;
  data: {
    message: string;
    statusCode?: number;
  };
}

// Create an enhanced base query with retry logic
const staggeredBaseQuery = retry(fetchBaseQuery({
  baseUrl: 'http://localhost:5000',
  credentials: 'include', // Automatically send cookies
}), {
  maxRetries: 3, // Retry a failed request up to 3 times
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | CustomFetchBaseQueryError,
  Record<string, unknown>
> = async (args, api, extraOptions) => {
  let result = await staggeredBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log('Unauthorized! Clearing credentials.');
    api.dispatch(clearCredentials());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Artist', 'Album', 'Track', 'Playlist', 'Analytics', 'Search'],
  endpoints: () => ({}),
});
