import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLoginMutation, useLogoutMutation } from '@/store/api/authApi';
import { clearCredentials } from '@/store/slices/authSlice';
import type { LoginRequestDTO } from '@/types/auth';

/**
 * Custom hook for authentication
 * Replaces the old AuthContext with Redux + RTK Query
 *
 * Usage:
 * ```tsx
 * const { user, isAuthenticated, login, logout, isLoading } = useAuth();
 * ```
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const { user, isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

  // RTK Query mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  /**
   * Login function
   * @param credentials - Email or phone + password
   */
  const login = useCallback(
    async (credentials: LoginRequestDTO) => {
      try {
        await loginMutation(credentials).unwrap();
        // Auth state is automatically updated by authSlice extraReducers
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    [loginMutation]
  );

  /**
   * Logout function
   * Calls logout API and clears local state
   */
  const logout = useCallback(async () => {
    try {
      // Call logout API if we have a token
      if (accessToken) {
        await logoutMutation().unwrap();
      }
    } catch (error) {
      console.error('Logout API failed:', error);
      // Even if API fails, clear local state
    } finally {
      // Clear credentials from Redux and localStorage
      dispatch(clearCredentials());
    }
  }, [accessToken, logoutMutation, dispatch]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: isLoginLoading || isLogoutLoading,
  };
};
