import { baseApi } from './baseApi';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../../types/auth.types';
import type { BaseApiResponse } from '../../types/common.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<BaseApiResponse<LoginResponse['data']>, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    loginUser: builder.mutation<BaseApiResponse<LoginResponse['data']>, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<BaseApiResponse<RefreshTokenResponse['data']>, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useRefreshTokenMutation } = authApi;
