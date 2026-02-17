import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: '/users/me',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    getProtectedRoute: builder.query<any, void>({
      query: () => '/protected',
      providesTags: ['User'], // Or a more specific tag if applicable
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation, useGetProtectedRouteQuery } = userApi;
