/**
 * Clients Service
 * Example service for clients endpoints
 */

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface Client {
  id: string;
  name: string;
  email?: string;
  [key: string]: unknown;
}

export const clientsService = {
  /**
   * Get all clients
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Client>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Client>>>('/api/clients', {
      params,
    });
    return response.data.data;
  },

  /**
   * Get client by ID
   */
  async getById(id: string): Promise<Client> {
    const response = await apiClient.get<ApiResponse<Client>>(`/api/clients/${id}`);
    return response.data.data;
  },

  /**
   * Create new client
   */
  async create(data: Partial<Client>): Promise<Client> {
    const response = await apiClient.post<ApiResponse<Client>>('/api/clients', data);
    return response.data.data;
  },

  /**
   * Update client
   */
  async update(id: string, data: Partial<Client>): Promise<Client> {
    const response = await apiClient.put<ApiResponse<Client>>(`/api/clients/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete client
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/clients/${id}`);
  },
};

