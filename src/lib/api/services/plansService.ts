/**
 * Plans Service
 */

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface PlanFeaturePrice {
  currency: string; // e.g., "BRL", "USD", "EUR"
  price: number;
  isDefault: boolean;
}

export interface PlanFeatureConfig {
  featureId: number;
  isEnabled: boolean;
  operationLimit?: number | null; // null = unlimited
  resetPeriod: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  prices?: PlanFeaturePrice[];
}

export interface PlanFeature {
  id: number;
  featureId: number;
  feature?: {
    id: number;
    key: string;
    name: string;
    description?: string;
  };
  isEnabled: boolean;
  operationLimit?: number | null;
  resetPeriod: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  prices?: PlanFeaturePrice[];
}

export interface PlanPrice {
  currency: string;
  price: number;
  isDefault: boolean;
}

export interface Plan {
  id: number;
  name: string;
  description?: string;
  billingPeriod: 'MONTHLY' | 'YEARLY';
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
  maxOperations?: number | null;
  maxClients?: number | null;
  maxUsers?: number | null;
  maxStorage?: number | null; // in MB
  prices?: PlanPrice[]; // Calculated from enabled features
  features: PlanFeature[];
  meta?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlanData {
  name: string;
  description?: string;
  billingPeriod?: 'MONTHLY' | 'YEARLY';
  isActive?: boolean;
  isPublic?: boolean;
  sortOrder?: number;
  maxOperations?: number | null;
  maxClients?: number | null;
  maxUsers?: number | null;
  maxStorage?: number | null;
  featureIds?: number[]; // Simple array - uses defaults
  features?: PlanFeatureConfig[]; // Detailed configuration with limits and prices
  meta?: Record<string, unknown>;
}

export interface UpdatePlanData {
  name?: string;
  description?: string;
  billingPeriod?: 'MONTHLY' | 'YEARLY';
  isActive?: boolean;
  isPublic?: boolean;
  sortOrder?: number;
  maxOperations?: number | null;
  maxClients?: number | null;
  maxUsers?: number | null;
  maxStorage?: number | null;
  featureIds?: number[];
  features?: PlanFeatureConfig[];
  meta?: Record<string, unknown>;
}

export interface PlansListParams {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
  isPublic?: boolean;
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

