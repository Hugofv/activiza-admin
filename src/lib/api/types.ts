/**
 * API Types and Interfaces
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
  accountId?: number | null;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

