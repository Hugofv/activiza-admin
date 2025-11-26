/**
 * Accounts Service
 */

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface Account {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  status: 'ACTIVE' | 'INACTIVE';
  currency: 'BRL' | 'USD' | 'EUR' | 'GBP';
  planId?: number;
  ownerId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccountData {
  name: string;
  email: string;
  phone?: string;
  document?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  currency?: 'BRL' | 'USD' | 'EUR' | 'GBP';
  planId?: number;
  ownerId?: number;
  password?: string;
}

export interface UpdateAccountData {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  currency?: 'BRL' | 'USD' | 'EUR' | 'GBP';
  planId?: number;
}

export interface AccountsListParams {
  page?: number;
  limit?: number;
  q?: string;
  ownerId?: number;
}

export const accountsService = {
  /**
   * Get all accounts
   */
  async getAll(params?: AccountsListParams): Promise<PaginatedResponse<Account>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Account>>>('/api/accounts', {
      params,
    });
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch accounts');
    }
    return response.data.data;
  },

  /**
   * Get account by ID
   */
  async getById(id: string): Promise<Account> {
    const response = await apiClient.get<ApiResponse<Account>>(`/api/accounts/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch account');
    }
    return response.data.data;
  },

  /**
   * Create new account
   */
  async create(data: CreateAccountData): Promise<Account> {
    const response = await apiClient.post<ApiResponse<Account>>('/api/accounts', data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to create account');
    }
    return response.data.data;
  },

  /**
   * Update account
   */
  async update(id: string, data: UpdateAccountData): Promise<Account> {
    const response = await apiClient.put<ApiResponse<Account>>(`/api/accounts/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to update account');
    }
    return response.data.data;
  },

  /**
   * Delete account
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/accounts/${id}`);
  },
};

