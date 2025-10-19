import { baseApi } from './baseApi';
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO,
  ResponseObject,
} from '@/types/auth';

/**
 * Auth API endpoints
 * Base path: /auth
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login endpoint
     * POST /auth/login
     *
     * @param credentials - Email or phone + password
     * @returns Access token, refresh token, and user info
     */
    login: builder.mutation<LoginResponseDTO, LoginRequestDTO>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Transform response to handle ResponseObject wrapper if needed
      transformResponse: (response: LoginResponseDTO | ResponseObject<LoginResponseDTO>) => {
        // If backend wraps response in ResponseObject
        if ('data' in response && 'status' in response) {
          return (response as ResponseObject<LoginResponseDTO>).data;
        }
        // If backend returns LoginResponseDTO directly
        return response as LoginResponseDTO;
      },
      invalidatesTags: ['Auth'],
    }),

    /**
     * Logout endpoint
     * POST /auth/logout
     *
     * Requires Authorization header (handled by baseQuery)
     */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      // On successful logout, invalidate auth cache
      invalidatesTags: ['Auth'],
    }),

    /**
     * Refresh token endpoint
     * POST /auth/refresh
     *
     * @param request - Refresh token
     * @returns New access token and expiry time
     */
    refreshToken: builder.mutation<RefreshTokenResponseDTO, RefreshTokenRequestDTO>({
      query: (request) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: request,
      }),
      transformResponse: (
        response: RefreshTokenResponseDTO | ResponseObject<RefreshTokenResponseDTO>
      ) => {
        if ('data' in response && 'status' in response) {
          return (response as ResponseObject<RefreshTokenResponseDTO>).data;
        }
        return response as RefreshTokenResponseDTO;
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
