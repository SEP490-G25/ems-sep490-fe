import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Base URL configuration
const BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Base API configuration for RTK Query
 * All API endpoints will extend this base API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    // Log the request for debugging
    console.log('🔵 API Request:', {
      url: typeof args === 'string' ? args : args.url,
      method: typeof args === 'string' ? 'GET' : args.method,
      body: typeof args === 'string' ? undefined : args.body,
      baseUrl: BASE_URL,
    });

    const result = await fetchBaseQuery({
      baseUrl: BASE_URL,
      prepareHeaders: (headers, { getState }) => {
        // Get token from Redux state
        const token = (getState() as RootState).auth.accessToken;

        // If we have a token, include it in the Authorization header
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }

        // Set default content type
        headers.set('Content-Type', 'application/json');

        return headers;
      },
    })(args, api, extraOptions);

    // Log the response
    if (result.error) {
      console.error('🔴 API Error:', result.error);
    } else {
      console.log('🟢 API Response:', result.data);
    }

    return result;
  },
  // Tag types for cache invalidation
  tagTypes: [
    'Auth',
    'User',
    'Branch',
    'Class',
    'Session',
    'Student',
    'Teacher',
    'Course',
    'Subject',
    'Attendance',
    'Request',
    'Report',
    'Dashboard',
  ],
  // Endpoints will be injected by individual API slices
  endpoints: () => ({}),
});
