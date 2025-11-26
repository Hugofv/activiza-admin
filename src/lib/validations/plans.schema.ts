/**
 * Validation schemas for Plans
 */

import * as yup from 'yup';

export interface PlanFeatureFormData {
  featureId: number;
  price: number;
}

export interface CreatePlanFormData {
  name: string;
  description?: string;
  isActive: boolean;
  features: PlanFeatureFormData[];
}

export interface UpdatePlanFormData {
  name?: string;
  description?: string;
  isActive?: boolean;
  features?: PlanFeatureFormData[];
}

export const planFeatureSchema = yup.object({
  featureId: yup.number().required('Feature é obrigatória').min(1, 'Feature inválida'),
  price: yup
    .number()
    .required('Preço é obrigatório')
    .min(0, 'Preço deve ser maior ou igual a 0')
    .typeError('Preço deve ser um número'),
});

export const createPlanSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(1, 'Nome deve ter pelo menos 1 caractere'),
  description: yup.string().optional(),
  isActive: yup.boolean().default(true),
  features: yup
    .array()
    .of(planFeatureSchema)
    .required('Features são obrigatórias')
    .min(1, 'Plano deve ter pelo menos uma feature'),
});

export const updatePlanSchema = yup.object({
  name: yup.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  description: yup.string().optional(),
  isActive: yup.boolean().optional(),
  features: yup.array().of(planFeatureSchema).min(1, 'Plano deve ter pelo menos uma feature').optional(),
});

