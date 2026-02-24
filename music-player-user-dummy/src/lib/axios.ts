// music-player-user-dummy/src/lib/axios.ts
import Axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';

const API_BASE_URL = env.VITE_API_BASE_URL;

const axios = Axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle 401 errors
    if (error.response?.status === 401) {
      // Depending on your setup, you could potentially reload or redirect here
      // But typically React Context handles global state clears based on errors or specific hook callbacks.
      // E.g., window.location.href = '/login'; if strictly enforced here.
    }
    return Promise.reject(error);
  }
);

export default axios;
