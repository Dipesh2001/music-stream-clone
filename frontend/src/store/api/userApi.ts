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
    getAllUsers: builder.query<any, { page?: number; limit?: number; search?: string; role?: string; isActive?: boolean }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.role) queryParams.append('role', params.role);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

        return {
          url: `/users?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['User'],
    }),
    updateUserStatus: builder.mutation<any, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetProtectedRouteQuery,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation
} = userApi;
