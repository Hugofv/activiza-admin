/**
 * Validation schemas for Features
 */

import * as yup from 'yup';

export interface CreateFeatureFormData {
  name: string;
  description?: string;
  code: string;
  isActive: boolean;
}

export interface UpdateFeatureFormData {
  name?: string;
  description?: string;
  code?: string;
  isActive?: boolean;
}

export const createFeatureSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(1, 'Nome deve ter pelo menos 1 caractere'),
  description: yup.string().optional(),
  code: yup
    .string()
    .required('Código é obrigatório')
    .matches(/^[A-Z_]+$/, 'Código deve conter apenas letras maiúsculas e underscores'),
  isActive: yup.boolean().default(true),
});

export const updateFeatureSchema = yup.object({
  name: yup.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  description: yup.string().optional(),
  code: yup
    .string()
    .matches(/^[A-Z_]+$/, 'Código deve conter apenas letras maiúsculas e underscores')
    .optional(),
  isActive: yup.boolean().optional(),
});

