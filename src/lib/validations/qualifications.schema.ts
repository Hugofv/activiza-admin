/**
 * Validation schemas for Qualifications
 */

import * as yup from 'yup';

export interface CreateQualificationFormData {
  name: string;
  description?: string;
  code: string;
  isActive: boolean;
}

export interface UpdateQualificationFormData {
  name?: string;
  description?: string;
  code?: string;
  isActive?: boolean;
}

export const createQualificationSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(1, 'Nome deve ter pelo menos 1 caractere'),
  description: yup.string().optional(),
  code: yup
    .string()
    .required('Código é obrigatório')
    .matches(/^[A-Z_]+$/, 'Código deve conter apenas letras maiúsculas e underscores'),
  isActive: yup.boolean().default(true),
});

export const updateQualificationSchema = yup.object({
  name: yup.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  description: yup.string().optional(),
  code: yup
    .string()
    .matches(/^[A-Z_]+$/, 'Código deve conter apenas letras maiúsculas e underscores')
    .optional(),
  isActive: yup.boolean().optional(),
});

