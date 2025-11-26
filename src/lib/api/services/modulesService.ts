/**
 * Modules Service
 */

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface ModuleMeta {
  translations?: {
    [locale: string]: string;
  };
  [key: string]: unknown;
}

export interface Module {
  id: number;
  name: string;
  code: string;
  description?: string;
  meta?: ModuleMeta;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateModuleData {
  name: string;
  code: string;
  description?: string;
  meta?: ModuleMeta;
  isActive?: boolean;
}

export interface UpdateModuleData {
  name?: string;
  code?: string;
  description?: string;
  meta?: ModuleMeta;
  isActive?: boolean;
}

export interface ModulesListParams {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
}

const MODULES_API_URL = '/api/admin/modules';

export const modulesService = {
  /**
   * Get all modules
   */
  async getAll(params?: ModulesListParams): Promise<PaginatedResponse<Module>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Module>>>(
      MODULES_API_URL,
      {
        params,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch modules');
    }
    return response.data.data;
  },

  /**
   * Get module by ID
   */
  async getById(id: number): Promise<Module> {
    const response = await apiClient.get<ApiResponse<Module>>(`${MODULES_API_URL}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch module');
    }
    return response.data.data;
  },

  /**
   * Create new module
   */
  async create(data: CreateModuleData): Promise<Module> {
    const response = await apiClient.post<ApiResponse<Module>>(MODULES_API_URL, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to create module');
    }
    return response.data.data;
  },

  /**
   * Update module
   */
  async update(id: number, data: UpdateModuleData): Promise<Module> {
    const response = await apiClient.put<ApiResponse<Module>>(`${MODULES_API_URL}/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to update module');
    }
    return response.data.data;
  },

  /**
   * Delete module
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${MODULES_API_URL}/${id}`);
  },
};

