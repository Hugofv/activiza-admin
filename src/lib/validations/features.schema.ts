/**
 * Validation schemas for Features
 */

import * as yup from 'yup';

export interface ModuleOption {
  value: number;
  label: string;
}

export interface CreateFeatureFormData {
  key: string;
  name: string;
  description?: string;
  category?: string;
  module?: ModuleOption;
  isActive?: boolean;
  sortOrder?: number;
  meta?: Record<string, unknown>;
}

export interface UpdateFeatureFormData {
  name?: string;
  description?: string;
  category?: string;
  module?: ModuleOption;
  isActive?: boolean;
  sortOrder?: number;
  meta?: Record<string, unknown>;
}

const moduleOptionSchema = yup.object({
  value: yup.number().required(),
  label: yup.string().required(),
});

export const createFeatureSchema = yup.object({
  key: yup
    .string()
    .required('Chave é obrigatória')
    .min(1, 'Chave deve ter pelo menos 1 caractere')
    .matches(/^[a-z_]+$/, 'Chave deve conter apenas letras minúsculas e underscores'),
  name: yup.string().required('Nome é obrigatório').min(1, 'Nome deve ter pelo menos 1 caractere'),
  description: yup.string().optional(),
  category: yup.string().optional(),
  module: moduleOptionSchema.optional(),
  isActive: yup.boolean().default(true),
  sortOrder: yup.number().integer().default(0),
  meta: yup.object().optional(),
});

export const updateFeatureSchema = yup.object({
  name: yup.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  description: yup.string().optional(),
  category: yup.string().optional(),
  module: moduleOptionSchema.optional(),
  isActive: yup.boolean().optional(),
  sortOrder: yup.number().integer().optional(),
  meta: yup.object().optional(),
});

