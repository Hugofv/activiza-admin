/**
 * Platform Users validation schemas using Yup
 */

import * as yup from 'yup';

export const createPlatformUserSchema = yup.object({
  name: yup.string().min(2, 'Nome deve ter no mínimo 2 caracteres').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: yup.string().optional(),
  password: yup.string().min(8, 'Senha deve ter no mínimo 8 caracteres').required('Senha é obrigatória'),
  role: yup.string().oneOf(['owner', 'admin', 'agent', 'viewer']).required('Perfil é obrigatório'),
  isActive: yup.boolean().default(true),
  twoFa: yup.boolean().default(false),
});

export const updatePlatformUserSchema = yup.object({
  name: yup.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  email: yup.string().email('Email inválido').optional(),
  phone: yup.string().optional(),
  password: yup.string().min(8, 'Senha deve ter no mínimo 8 caracteres').optional(),
  role: yup.string().oneOf(['owner', 'admin', 'agent', 'viewer']).optional(),
  isActive: yup.boolean().optional(),
  twoFa: yup.boolean().optional(),
});

export type CreatePlatformUserFormData = yup.InferType<typeof createPlatformUserSchema>;
export type UpdatePlatformUserFormData = yup.InferType<typeof updatePlatformUserSchema>;

