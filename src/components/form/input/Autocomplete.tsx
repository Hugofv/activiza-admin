/**
 * Autocomplete Component
 * A searchable select dropdown component using react-select
 */

import React from 'react';
import Select, { StylesConfig, GroupBase, Theme } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SingleValue } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface AutocompleteProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowCustom?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value = '',
  onChange,
  placeholder = 'Digite ou selecione...',
  disabled = false,
  className = '',
  allowCustom = true,
}) => {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (newValue: SingleValue<Option>) => {
    if (newValue) {
      onChange(newValue.value);
    } else {
      onChange('');
    }
  };

  // Custom styles for react-select to match the design system (FormInput styling)
  const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '36px', // h-11
      height: '36px',
      fontSize: '0.875rem', // text-sm (14px) to match FormInput
      lineHeight: '1.25rem',
      padding: 0, // Remove all default padding
      paddingLeft: '1rem', // px-4 = 16px
      paddingRight: '0.5rem', // Small padding for indicators
      borderColor: state.isFocused
        ? '#3b82f6' // brand-500
        : '#d1d5db', // gray-300
      borderRadius: '0.5rem', // rounded-lg
      boxShadow: state.isFocused
        ? '0 0 0 3px rgba(59, 130, 246, 0.2)' // focus:ring-brand-500/20
        : '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-theme-xs
      backgroundColor: state.isDisabled
        ? '#f3f4f6' // gray-100
        : 'transparent',
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        borderColor: state.isFocused
          ? '#3b82f6' // brand-500
          : '#9ca3af', // gray-400
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0, // Remove all padding - control handles it
      margin: 0,
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    }),
    input: (provided) => ({
      ...provided,
      fontSize: '0.875rem', // text-sm
      margin: 0,
      padding: 0,
      paddingTop: 0,
      paddingBottom: 0,
      color: '#1f2937', // gray-800
      height: 'auto',
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '0.875rem', // text-sm
      color: '#9ca3af', // gray-400
      margin: 0,
      padding: 0,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontSize: '0.875rem', // text-sm
      margin: 0,
      padding: 0,
      color: state.isDisabled
        ? '#6b7280' // gray-500
        : '#1f2937', // gray-800
      lineHeight: '1.25rem',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      alignSelf: 'stretch',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      padding: '0 0.25rem', // Small padding for icon
      color: '#98a2b3', // gray-400
      display: 'flex',
      alignItems: 'center',
      transform: state.selectProps.menuIsOpen
        ? 'rotate(180deg)'
        : 'rotate(0deg)',
      transition: 'transform 0.2s',
      '&:hover': {
        color: '#475467', // gray-600
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: '0 0.25rem', // Small padding for icon
      color: '#98a2b3', // gray-400
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        color: '#475467', // gray-600
      },
    }),
    menu: (provided) => ({
      ...provided,
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 50,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      maxHeight: '240px',
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  const commonSelectProps = {
    isClearable: true,
    isDisabled: disabled,
    options,
    value: selectedOption,
    onChange: handleChange,
    placeholder,
    styles: customStyles,
    classNamePrefix: 'react-select',
    className: 'react-select-container',
    isSearchable: true,
    theme: (theme: Theme) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary: 'var(--color-brand-500)',
        primary25: 'var(--color-brand-50)',
        primary50: 'var(--color-brand-100)',
        primary75: 'var(--color-brand-200)',
      },
    }),
  } as const;

  const SelectComponent = allowCustom ? CreatableSelect : Select;

  return (
    <div className={className}>
      <SelectComponent
        {...commonSelectProps}
        {...(allowCustom
          ? {
              formatCreateLabel: (inputValue: string) => `Criar "${inputValue}"`,
              createOptionPosition: 'first' as const,
            }
          : {})}
      />
    </div>
  );
};

export default Autocomplete;
