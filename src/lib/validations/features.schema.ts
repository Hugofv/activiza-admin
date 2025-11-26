/**
 * Validation schemas for Features
 */

import * as yup from 'yup';
import { TranslationItem, translationItemSchema, MetaFormData } from './common.schema';

export interface FeaturePriceFormData {
  price: number;
  currency: 'BRL' | 'USD' | 'EUR' | 'GBP';
}

export interface FeatureMetaFormData extends MetaFormData {
  translations?: TranslationItem[];
}

export interface CreateFeatureFormData {
  name: string;
  description?: string;
  code: string;
  moduleId?: number;
  prices: FeaturePriceFormData[];
  meta?: FeatureMetaFormData;
  isActive: boolean;
}

export interface UpdateFeatureFormData {
  name?: string;
  description?: string;
  code?: string;
  moduleId?: number;
  prices?: FeaturePriceFormData[];
  meta?: FeatureMetaFormData;
  isActive?: boolean;
}

export const featurePriceSchema = yup.object({
  price: yup
    .number()
    .required('Preço é obrigatório')
    .min(0, 'Preço deve ser maior ou igual a 0')
    .typeError('Preço deve ser um número'),
  currency: yup
    .string()
    .required('Moeda é obrigatória')
    .oneOf(['BRL', 'USD', 'EUR', 'GBP'], 'Moeda inválida'),
});

export const createFeatureSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(1, 'Nome deve ter pelo menos 1 caractere'),
  description: yup.string().optional(),
  code: yup
    .string()
    .required('Código é obrigatório')
    .matches(/^[A-Z_]+$/, 'Código deve conter apenas letras maiúsculas e underscores'),
  moduleId: yup.number().optional(),
  prices: yup
    .array()
    .of(featurePriceSchema)
    .required('Preços são obrigatórios')
    .min(1, 'Funcionalidade deve ter pelo menos um preço'),
  meta: yup
    .object({
      translations: yup.array().of(translationItemSchema).optional(),
    })
    .optional(),
  isActive: yup.boolean().default(true),
});

export const updateFeatureSchema = yup.object({
  name: yup.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  description: yup.string().optional(),
  code: yup
    .string()
    .matches(/^[A-Z_]+$/, 'Código deve conter apenas letras maiúsculas e underscores')
    .optional(),
  moduleId: yup.number().optional(),
  prices: yup
    .array()
    .of(featurePriceSchema)
    .min(1, 'Funcionalidade deve ter pelo menos um preço')
    .optional(),
  meta: yup
    .object({
      translations: yup.array().of(translationItemSchema).optional(),
    })
    .optional(),
  isActive: yup.boolean().optional(),
});

