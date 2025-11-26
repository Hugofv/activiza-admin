/**
 * Plans Service
 */

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface PlanFeature {
  featureId: number;
  featureName?: string;
  price: number;
}

export interface Plan {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  features: PlanFeature[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlanData {
  name: string;
  description?: string;
  isActive?: boolean;
  features: PlanFeature[];
}

export interface UpdatePlanData {
  name?: string;
  description?: string;
  isActive?: boolean;
  features?: PlanFeature[];
}

export interface PlansListParams {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
}

const PLANS_API_URL = '/api/admin/plans';

export const plansService = {
  /**
   * Get all plans
   */
  async getAll(params?: PlansListParams): Promise<PaginatedResponse<Plan>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Plan>>>(
      PLANS_API_URL,
      {
        params,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch plans');
    }
    return response.data.data;
  },

  /**
   * Get plan by ID
   */
  async getById(id: number): Promise<Plan> {
    const response = await apiClient.get<ApiResponse<Plan>>(`${PLANS_API_URL}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch plan');
    }
    return response.data.data;
  },

  /**
   * Create new plan
   */
  async create(data: CreatePlanData): Promise<Plan> {
    const response = await apiClient.post<ApiResponse<Plan>>(PLANS_API_URL, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to create plan');
    }
    return response.data.data;
  },

  /**
   * Update plan
   */
  async update(id: number, data: UpdatePlanData): Promise<Plan> {
    const response = await apiClient.put<ApiResponse<Plan>>(`${PLANS_API_URL}/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to update plan');
    }
    return response.data.data;
  },

  /**
   * Delete plan
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${PLANS_API_URL}/${id}`);
  },
};

