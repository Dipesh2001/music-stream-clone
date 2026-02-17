// frontend/src/utils/auth.ts

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Basic token validity check (e.g., presence, not expiration)
export const isAccessTokenValid = (): boolean => {
  const token = getAccessToken();
  return !!token; // Returns true if token exists, false otherwise
};

export const isRefreshTokenValid = (): boolean => {
  const token = getRefreshToken();
  return !!token; // Returns true if token exists, false otherwise
};
