import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserInfoDTO } from '@/types/auth';
import { authApi } from '../api/authApi';

interface AuthState {
  user: UserInfoDTO | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Load initial state from localStorage
const loadAuthFromStorage = (): AuthState => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');

    if (accessToken && refreshToken && userStr) {
      return {
        user: JSON.parse(userStr),
        accessToken,
        refreshToken,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to load auth from localStorage:', error);
  }

  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = loadAuthFromStorage();

/**
 * Auth slice for managing authentication state
 * Handles tokens, user info, and authentication status
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set credentials manually (useful for token refresh)
     */
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: UserInfoDTO;
        accessToken: string;
        refreshToken?: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;

      if (user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }

      state.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken);

      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
      }

      state.isAuthenticated = true;
    },

    /**
     * Clear all auth data (logout)
     */
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },

  /**
   * Extra reducers to handle RTK Query mutations
   */
  extraReducers: (builder) => {
    // Handle successful login
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;

        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;

        // Persist to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
    );

    // Handle successful logout
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;

        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    );

    // Handle successful token refresh
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, action) => {
        const { accessToken } = action.payload;

        state.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
      }
    );
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
