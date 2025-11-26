/**
 * Accounts validation schemas using Yup
 */

import * as yup from 'yup';

export const createAccountSchema = yup.object({
  name: yup.string().min(1, 'Nome é obrigatório').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: yup.string().optional(),
  document: yup.string().optional(),
  status: yup.string().oneOf(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  currency: yup.string().oneOf(['BRL', 'USD', 'EUR', 'GBP']).default('BRL'),
  planId: yup.number().positive().optional(),
  ownerId: yup.number().positive().optional(),
  password: yup.string().min(8, 'Senha deve ter no mínimo 8 caracteres').optional(),
}).test(
  'password-or-owner',
  'Senha é obrigatória quando ownerId não é fornecido',
  function (value) {
    if (!value.ownerId && !value.password) {
      return this.createError({
        path: 'password',
        message: 'Senha é obrigatória quando ownerId não é fornecido',
      });
    }
    return true;
  }
);

export const updateAccountSchema = yup.object({
  name: yup.string().min(1, 'Nome é obrigatório').optional(),
  email: yup.string().email('Email inválido').optional(),
  phone: yup.string().optional(),
  document: yup.string().optional(),
  status: yup.string().oneOf(['ACTIVE', 'INACTIVE']).optional(),
  currency: yup.string().oneOf(['BRL', 'USD', 'EUR', 'GBP']).optional(),
  planId: yup.number().positive().optional(),
});

export type CreateAccountFormData = yup.InferType<typeof createAccountSchema>;
export type UpdateAccountFormData = yup.InferType<typeof updateAccountSchema>;

