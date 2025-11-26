/**
 * Common Locales Configuration
 * Used across the application for translation management
 */

export interface LocaleOption {
  value: string;
  label: string;
}

export const COMMON_LOCALES: LocaleOption[] = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-UK', label: 'English (UK)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'it-IT', label: 'Italiano' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'zh-CN', label: '中文 (简体)' },
];

/**
 * Get locale label by value
 */
export const getLocaleLabel = (value: string): string => {
  const locale = COMMON_LOCALES.find((loc) => loc.value === value);
  return locale?.label || value;
};

