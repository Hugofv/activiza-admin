/**
 * Qualifications Service
 */

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface Qualification {
  id: number;
  name: string;
  description?: string;
  code: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQualificationData {
  name: string;
  description?: string;
  code: string;
  isActive?: boolean;
}

export interface UpdateQualificationData {
  name?: string;
  description?: string;
  code?: string;
  isActive?: boolean;
}

export interface QualificationsListParams {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
}

const QUALIFICATIONS_API_URL = '/api/admin/qualifications';

export const qualificationsService = {
  /**
   * Get all qualifications
   */
  async getAll(params?: QualificationsListParams): Promise<PaginatedResponse<Qualification>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Qualification>>>(
      QUALIFICATIONS_API_URL,
      {
        params,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch qualifications');
    }
    return response.data.data;
  },

  /**
   * Get qualification by ID
   */
  async getById(id: number): Promise<Qualification> {
    const response = await apiClient.get<ApiResponse<Qualification>>(`${QUALIFICATIONS_API_URL}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch qualification');
    }
    return response.data.data;
  },

  /**
   * Create new qualification
   */
  async create(data: CreateQualificationData): Promise<Qualification> {
    const response = await apiClient.post<ApiResponse<Qualification>>(QUALIFICATIONS_API_URL, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to create qualification');
    }
    return response.data.data;
  },

  /**
   * Update qualification
   */
  async update(id: number, data: UpdateQualificationData): Promise<Qualification> {
    const response = await apiClient.put<ApiResponse<Qualification>>(`${QUALIFICATIONS_API_URL}/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to update qualification');
    }
    return response.data.data;
  },

  /**
   * Delete qualification
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${QUALIFICATIONS_API_URL}/${id}`);
  },
};

