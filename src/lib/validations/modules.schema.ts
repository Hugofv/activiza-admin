/**
 * Validation schemas for Modules
 */

import * as yup from 'yup';
import { TranslationItem, translationItemSchema, MetaFormData } from './common.schema';

export interface ModuleMetaFormData extends MetaFormData {
  translations?: TranslationItem[];
}

export interface CreateModuleFormData {
  name: string;
  code: string;
  description?: string;
  meta?: ModuleMetaFormData;
  isActive: boolean;
}

export interface UpdateModuleFormData {
  name?: string;
  code?: string;
  description?: string;
  meta?: ModuleMetaFormData;
  isActive?: boolean;
}

export const createModuleSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(1, 'Nome deve ter pelo menos 1 caractere'),
  description: yup.string().optional(),
  code: yup
    .string()
    .required('Código é obrigatório')
    .matches(/^[A-Z_]+$/, 'Código deve conter apenas letras maiúsculas e underscores'),
  meta: yup
    .object({
      translations: yup.array().of(translationItemSchema).optional(),
    })
    .optional(),
  isActive: yup.boolean().default(true),
});

export const updateModuleSchema = yup.object({
  name: yup.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  description: yup.string().optional(),
  code: yup
    .string()
    .matches(/^[A-Z_]+$/, 'Código deve conter apenas letras maiúsculas e underscores')
    .optional(),
  meta: yup
    .object({
      translations: yup.array().of(translationItemSchema).optional(),
    })
    .optional(),
  isActive: yup.boolean().optional(),
});

