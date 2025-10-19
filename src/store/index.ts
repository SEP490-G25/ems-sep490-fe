/**
 * Redux store - Main export file
 *
 * Usage:
 * ```tsx
 * import { store, useAppSelector, useAppDispatch } from '@/store';
 * import { useLoginMutation, useLogoutMutation } from '@/store';
 * ```
 */

// Store and types
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Typed hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Auth API
export {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} from './api/authApi';

// Auth slice actions
export { setCredentials, clearCredentials } from './slices/authSlice';
