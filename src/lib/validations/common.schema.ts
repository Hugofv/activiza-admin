/**
 * Common validation schemas
 * Shared schemas used across multiple validation files
 */

import * as yup from 'yup';

/**
 * Translation Item Interface
 * Used for form data with translations
 */
export interface TranslationItem {
  locale: string;
  value: string;
}

/**
 * Translation Item Schema
 * Yup validation schema for translation items
 */
export const translationItemSchema = yup.object({
  locale: yup.string().required('Idioma é obrigatório'),
  value: yup
    .string()
    .required('Nome traduzido é obrigatório')
    .min(1, 'Nome traduzido deve ter pelo menos 1 caractere'),
});

/**
 * Meta Form Data Interface
 * Generic interface for meta data with translations
 */
export interface MetaFormData {
  translations?: TranslationItem[];
}

