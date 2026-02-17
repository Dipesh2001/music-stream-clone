import { createSlice } from '@reduxjs/toolkit';
import type { AuthUser } from '../../types/auth.types';
import type { RootState } from '../index';
import { getAccessToken } from '../../utils/auth';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const accessTokenFromLocalStorage = getAccessToken();

const initialState: AuthState = {
  user: null, // User info will need to be fetched or decoded if needed on refresh
  accessToken: accessTokenFromLocalStorage,
  isAuthenticated: !!accessTokenFromLocalStorage, // isAuthenticated is true if token exists
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: { payload: { user: AuthUser; accessToken: string }; type: string }
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;
