/**
 * Features Service
 */

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface Feature {
  id: number;
  name: string;
  description?: string;
  code: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeatureData {
  name: string;
  description?: string;
  code: string;
  isActive?: boolean;
}

export interface UpdateFeatureData {
  name?: string;
  description?: string;
  code?: string;
  isActive?: boolean;
}

export interface FeaturesListParams {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
}

const FEATURES_API_URL = '/api/admin/features';

export const featuresService = {
  /**
   * Get all features
   */
  async getAll(params?: FeaturesListParams): Promise<PaginatedResponse<Feature>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Feature>>>(
      FEATURES_API_URL,
      {
        params,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch features');
    }
    return response.data.data;
  },

  /**
   * Get feature by ID
   */
  async getById(id: number): Promise<Feature> {
    const response = await apiClient.get<ApiResponse<Feature>>(`${FEATURES_API_URL}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch feature');
    }
    return response.data.data;
  },

  /**
   * Create new feature
   */
  async create(data: CreateFeatureData): Promise<Feature> {
    const response = await apiClient.post<ApiResponse<Feature>>(FEATURES_API_URL, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to create feature');
    }
    return response.data.data;
  },

  /**
   * Update feature
   */
  async update(id: number, data: UpdateFeatureData): Promise<Feature> {
    const response = await apiClient.put<ApiResponse<Feature>>(`${FEATURES_API_URL}/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to update feature');
    }
    return response.data.data;
  },

  /**
   * Delete feature
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${FEATURES_API_URL}/${id}`);
  },
};

