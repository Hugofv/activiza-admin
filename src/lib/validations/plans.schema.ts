/**
 * Validation schemas for Plans
 */

import * as yup from 'yup';

export interface PlanFeaturePriceFormData {
  currency: string;
  price: number;
  isDefault: boolean;
}

export interface PlanFeatureConfigFormData {
  featureId: number;
  isEnabled: boolean;
  operationLimit?: number | null;
  resetPeriod: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  prices?: PlanFeaturePriceFormData[];
}

export interface CreatePlanFormData {
  name: string;
  description?: string;
  billingPeriod: 'MONTHLY' | 'YEARLY';
  isActive: boolean;
  isPublic: boolean;
  sortOrder?: number;
  maxOperations?: number | null;
  maxClients?: number | null;
  maxUsers?: number | null;
  maxStorage?: number | null;
  featureIds?: number[];
  features?: PlanFeatureConfigFormData[];
  meta?: Record<string, unknown>;
}

export interface UpdatePlanFormData {
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
  features?: PlanFeatureConfigFormData[];
  meta?: Record<string, unknown>;
}

const planFeaturePriceSchema = yup.object({
  currency: yup.string().required('Moeda é obrigatória'),
  price: yup
    .number()
    .required('Preço é obrigatório')
    .positive('Preço deve ser maior que 0')
    .typeError('Preço deve ser um número'),
  isDefault: yup.boolean().default(false),
});

const planFeatureConfigSchema = yup.object({
  featureId: yup.number().required('Feature é obrigatória').min(1, 'Feature inválida'),
  isEnabled: yup.boolean().default(true),
  operationLimit: yup.number().nullable().positive('Limite deve ser maior que 0').optional(),
  resetPeriod: yup
    .string()
    .oneOf(['MONTHLY', 'YEARLY', 'LIFETIME'], 'Período inválido')
    .default('LIFETIME'),
  prices: yup.array().of(planFeaturePriceSchema).optional(),
});

export const createPlanSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(1, 'Nome deve ter pelo menos 1 caractere'),
  description: yup.string().optional(),
  billingPeriod: yup
    .string()
    .oneOf(['MONTHLY', 'YEARLY'], 'Período de cobrança inválido')
    .default('MONTHLY'),
  isActive: yup.boolean().default(true),
  isPublic: yup.boolean().default(true),
  sortOrder: yup.number().integer().default(0),
  maxOperations: yup.number().nullable().positive('Limite deve ser maior que 0').optional(),
  maxClients: yup.number().nullable().positive('Limite deve ser maior que 0').optional(),
  maxUsers: yup.number().nullable().positive('Limite deve ser maior que 0').optional(),
  maxStorage: yup.number().nullable().positive('Limite deve ser maior que 0').optional(),
  featureIds: yup.array().of(yup.number().positive()).optional(),
  features: yup.array().of(planFeatureConfigSchema).optional(),
  meta: yup.object().optional(),
});

export const updatePlanSchema = yup.object({
  name: yup.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  description: yup.string().optional(),
  billingPeriod: yup.string().oneOf(['MONTHLY', 'YEARLY'], 'Período de cobrança inválido').optional(),
  isActive: yup.boolean().optional(),
  isPublic: yup.boolean().optional(),
  sortOrder: yup.number().integer().optional(),
  maxOperations: yup.number().nullable().positive('Limite deve ser maior que 0').optional(),
  maxClients: yup.number().nullable().positive('Limite deve ser maior que 0').optional(),
  maxUsers: yup.number().nullable().positive('Limite deve ser maior que 0').optional(),
  maxStorage: yup.number().nullable().positive('Limite deve ser maior que 0').optional(),
  featureIds: yup.array().of(yup.number().positive()).optional(),
  features: yup.array().of(planFeatureConfigSchema).optional(),
  meta: yup.object().optional(),
});

