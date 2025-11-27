/**
 * Global Constants
 * Shared constants used across the application
 */

export const RESET_PERIODS = [
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
  { value: 'LIFETIME', label: 'Vitalício' },
];

export const CURRENCIES = [
  { value: 'BRL', label: 'BRL', symbol: 'R$' },
  { value: 'USD', label: 'USD', symbol: '$' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'GBP', label: 'GBP', symbol: '£' },
];

export const BILLING_PERIODS = [
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
];

export type ResetPeriod = 'MONTHLY' | 'YEARLY' | 'LIFETIME';
export type Currency = 'BRL' | 'USD' | 'EUR' | 'GBP';
export type BillingPeriod = 'MONTHLY' | 'YEARLY';

// Helper functions
export const getCurrencySymbol = (currency: Currency): string => {
  return CURRENCIES.find((c) => c.value === currency)?.symbol || 'R$';
};

export const getCurrencyByValue = (value: Currency) => {
  return CURRENCIES.find((c) => c.value === value);
};

