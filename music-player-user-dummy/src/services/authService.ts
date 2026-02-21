// music-player-user-dummy/src/services/authService.ts
import axios from '../lib/axios';
import { ILoginPayload, IRegisterPayload, IAuthResponse } from '../types/auth.types';
import { loginSchema, registerSchema, authResponseSchema } from '../schemas/auth.schema'; // Import authResponseSchema
import { setAuthTokens, clearAuthTokens } from '../utils/auth';
import { ApiResponse } from '../types/api.types';

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const register = async (payload: IRegisterPayload): Promise<IAuthResponse> => {
  try {
    registerSchema.parse(payload); // Validate request payload
    const response = await axios.post<ApiResponse<IAuthResponse>>('/auth/register', payload);

    if (!response.data.success) {
      throw new ApiError(response.data.message || 'Registration failed', response.data.error?.statusCode || 400, response.data.error?.errors);
    }

    const parsedResponse = authResponseSchema.safeParse(response.data.data); // Validate response data
    if (!parsedResponse.success) {
      console.error("Zod parsing error for register response:", parsedResponse.error);
      throw new ApiError('Invalid response format from server during registration.', 500);
    }

    setAuthTokens(parsedResponse.data.accessToken as string, parsedResponse.data.refreshToken as string);
    return parsedResponse.data as IAuthResponse;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    const errorsList = error.response?.data?.error?.errors;
    throw new ApiError(errorMessage, error.response?.status || 500, errorsList);
  }
};

const login = async (payload: ILoginPayload): Promise<IAuthResponse> => {
  try {
    loginSchema.parse(payload); // Validate request payload
    const response = await axios.post<ApiResponse<IAuthResponse>>('/auth/login', payload);

    if (!response.data.success) {
      throw new ApiError(response.data.message || 'Login failed', response.data.error?.statusCode || 401, response.data.error?.errors);
    }

    const parsedResponse = authResponseSchema.safeParse(response.data.data); // Validate response data
    if (!parsedResponse.success) {
      console.error("Zod parsing error for login response:", parsedResponse.error);
      throw new ApiError('Invalid response format from server during login.', 500);
    }

    setAuthTokens(parsedResponse.data.accessToken as string, parsedResponse.data.refreshToken as string);
    return parsedResponse.data as IAuthResponse;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    const errorsList = error.response?.data?.error?.errors;
    throw new ApiError(errorMessage, error.response?.status || 500, errorsList);
  }
};

const logout = (): void => {
  clearAuthTokens();
  window.location.href = '/login';
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
