/**
 * Money Input Component with mask
 * Uses react-number-format for currency formatting
 */

import { forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';

interface MoneyInputProps {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  prefix?: string;
  decimalSeparator?: string;
  thousandSeparator?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  allowNegative?: boolean;
  name?: string;
}

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder = '0,00',
      disabled = false,
      className = '',
      prefix = '',
      decimalSeparator = ',',
      thousandSeparator = '.',
      decimalScale = 2,
      fixedDecimalScale = true,
      allowNegative = false,
      name,
    },
    ref
  ) => {
    return (
      <NumericFormat
        getInputRef={ref}
        value={value}
        onValueChange={(values) => {
          if (onChange) {
            onChange(values.floatValue);
          }
        }}
        onBlur={onBlur}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        prefix={prefix}
        decimalSeparator={decimalSeparator}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        allowNegative={allowNegative}
        className={`w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${className}`}
      />
    );
  }
);

MoneyInput.displayName = 'MoneyInput';

export default MoneyInput;

