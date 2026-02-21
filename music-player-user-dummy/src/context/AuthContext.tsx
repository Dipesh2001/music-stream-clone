// music-player-user-dummy/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { IUser } from '../types/user.types';
import { getAccessToken, getRefreshToken, clearAuthTokens } from '../utils/auth';
import authService from '../services/authService';
import axios from '../lib/axios'; // Import the configured axios instance
import { ApiResponse } from '../types/api.types';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: import('../types/auth.types').ILoginPayload) => Promise<void>;
  register: (payload: import('../types/auth.types').IRegisterPayload) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (accessToken && refreshToken) {
      try {
        const response = await axios.get<ApiResponse<IUser>>('/users/me');
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        } else {
          clearAuthTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to initialize auth or fetch user data:", error);
        clearAuthTokens();
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      clearAuthTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (payload: import('../types/auth.types').ILoginPayload) => {
    const data = await authService.login(payload);
    setUser(data.user as IUser);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (payload: import('../types/auth.types').IRegisterPayload) => {
    const data = await authService.register(payload);
    setUser(data.user as IUser);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
