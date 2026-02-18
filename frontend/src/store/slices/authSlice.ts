import { createSlice } from '@reduxjs/toolkit';
import type { AuthUser } from '../../types/auth.types';
import type { RootState } from '../index';
import { getAccessToken, getRefreshToken, clearTokens, setTokens } from '../../utils/auth'; // Import setTokens

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null; // Add refreshToken to state
  isAuthenticated: boolean;
}

const accessTokenFromLocalStorage = getAccessToken();
const refreshTokenFromLocalStorage = getRefreshToken(); // Get refreshToken from local storage

const initialState: AuthState = {
  user: null, // User info will need to be fetched or decoded if needed on refresh
  accessToken: accessTokenFromLocalStorage,
  refreshToken: refreshTokenFromLocalStorage, // Initialize refreshToken
  isAuthenticated: !!accessTokenFromLocalStorage && !!refreshTokenFromLocalStorage, // isAuthenticated depends on both
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: { payload: { user: AuthUser; accessToken: string; refreshToken: string }; type: string }
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken; // Set refreshToken in state
      state.isAuthenticated = true;
      setTokens(action.payload.accessToken, action.payload.refreshToken); // Save to local storage
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null; // Clear refreshToken from state
      state.isAuthenticated = false;
      clearTokens(); // Clear tokens from local storage
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentAccessToken = (state: RootState) => state.auth.accessToken;
export const selectCurrentRefreshToken = (state: RootState) => state.auth.refreshToken; // New selector for refreshToken
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;
