/**
 * API Client Configuration
 * Handles all HTTP requests to the backend API
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../../config/env';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Try to refresh token if we have a refresh token
      if (refreshToken) {
        try {
          const { authService } = await import('./services/authService');
          const tokens = await authService.refreshToken(refreshToken);
          
          // Store new tokens
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          
          // Calculate expiration time
          const expiresAt = Date.now() + tokens.expiresIn * 1000;
          localStorage.setItem('tokenExpiresAt', expiresAt.toString());
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          }
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiresAt');
          
          if (window.location.pathname !== '/signin') {
            window.location.href = '/signin';
          }
          
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, clear auth data and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiresAt');
        
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin';
        }
      }
    }

    // Handle other errors
    const errorData = error.response?.data as { error?: { message?: string }; message?: string } | undefined;
    const errorMessage = 
      errorData?.error?.message || 
      errorData?.message || 
      error.message || 
      'An error occurred';

    return Promise.reject({
      ...error,
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default apiClient;

