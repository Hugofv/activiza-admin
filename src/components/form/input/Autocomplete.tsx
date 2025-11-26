/**
 * Autocomplete Component
 * A searchable select dropdown component using react-select
 */

import React from 'react';
import Select, { StylesConfig, GroupBase, Theme } from 'react-select';
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
      backgroundColor: 'transparent',
      '&:hover': {
        borderColor: state.isFocused
          ? 'var(--color-brand-500)'
          : 'var(--color-gray-400)',
      },
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: 'rgb(31 41 55)',
        borderColor: state.isFocused
          ? 'var(--color-brand-800)'
          : 'rgb(55 65 81)',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--color-gray-800)',
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(255 255 255 / 0.9)',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'var(--color-gray-400)',
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(156 163 175)',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--color-gray-800)',
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(255 255 255 / 0.9)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 50,
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: 'rgb(31 41 55)',
        borderColor: 'rgb(55 65 81)',
      },
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      maxHeight: '240px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--color-brand-50)'
        : state.isFocused
        ? 'var(--color-gray-100)'
        : 'transparent',
      color: state.isSelected
        ? 'var(--color-brand-600)'
        : 'var(--color-gray-800)',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: state.isSelected
          ? 'var(--color-brand-100)'
          : 'var(--color-gray-200)',
      },
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: state.isSelected
          ? 'rgb(59 130 246 / 0.2)'
          : state.isFocused
          ? 'rgb(55 65 81)'
          : 'transparent',
        color: state.isSelected ? 'rgb(96 165 250)' : 'rgb(255 255 255 / 0.9)',
        '&:active': {
          backgroundColor: state.isSelected
            ? 'rgb(59 130 246 / 0.3)'
            : 'rgb(75 85 99)',
        },
      },
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
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(156 163 175)',
        '&:hover': {
          color: 'rgb(209 213 219)',
        },
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'var(--color-gray-400)',
      '&:hover': {
        color: 'var(--color-gray-600)',
      },
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(156 163 175)',
        '&:hover': {
          color: 'rgb(209 213 219)',
        },
      },
    }),
  };

  // Use CreatableSelect if allowCustom is true
  if (allowCustom) {
    const CreatableSelect = import('react-select/creatable');

    return (
      <div className={className}>
        <CreatableSelect
          isClearable
          isDisabled={disabled}
          options={options}
          value={selectedOption}
          onChange={handleChange}
          placeholder={placeholder}
          styles={customStyles}
          formatCreateLabel={(inputValue: string) => `Criar "${inputValue}"`}
          createOptionPosition='first'
          classNamePrefix='react-select'
          className='react-select-container'
          isSearchable
          theme={(theme: Theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: 'var(--color-brand-500)',
              primary25: 'var(--color-brand-50)',
              primary50: 'var(--color-brand-100)',
              primary75: 'var(--color-brand-200)',
            },
          })}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Select
        isClearable
        isDisabled={disabled}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        styles={customStyles}
        classNamePrefix='react-select'
        className='react-select-container'
        isSearchable
        theme={(theme: Theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: 'var(--color-brand-500)',
            primary25: 'var(--color-brand-50)',
            primary50: 'var(--color-brand-100)',
            primary75: 'var(--color-brand-200)',
          },
        })}
      />
    </div>
  );
};

export default Autocomplete;
