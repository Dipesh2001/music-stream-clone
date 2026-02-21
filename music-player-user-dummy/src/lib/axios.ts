// music-player-user-dummy/src/lib/axios.ts
import Axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthTokens } from '../utils/auth';
import { env } from '../config/env'; // Correctly import env

const API_BASE_URL = env.VITE_API_BASE_URL;

const axios = Axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          // Attempt to refresh token
          // IMPORTANT: Use a new Axios instance for refresh token request to avoid infinite interceptor loop
          const refreshAxios = Axios.create({
            baseURL: API_BASE_URL,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const response = await refreshAxios.post('/auth/refresh-token', { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data; // Assuming data is nested
          setAuthTokens(accessToken, newRefreshToken); // Store new tokens
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axios(originalRequest); // Retry the original request
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        console.error('Failed to refresh token:', refreshError);
        clearAuthTokens();
        // Redirect to login, assuming '/login' is the route for the login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
