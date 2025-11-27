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

  // Custom styles for react-select to match the design system
  const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '44px',
      borderColor: state.isFocused
        ? 'var(--color-brand-500)'
        : 'var(--color-gray-300)',
      boxShadow: state.isFocused ? '0 0 0 2px var(--color-brand-500)' : 'none',
      '&:hover': {
        borderColor: state.isFocused
          ? 'var(--color-brand-500)'
          : 'var(--color-gray-400)',
      },
    }),
    input: (provided) => ({
      ...provided,
    }),
    placeholder: (provided) => ({
      ...provided,
    }),
    singleValue: (provided) => ({
      ...provided,
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
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: 'var(--color-gray-400)',
      transform: state.selectProps.menuIsOpen
        ? 'rotate(180deg)'
        : 'rotate(0deg)',
      transition: 'transform 0.2s',
      '&:hover': {
        color: 'var(--color-gray-600)',
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'var(--color-gray-400)',
      '&:hover': {
        color: 'var(--color-gray-600)',
      },
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
