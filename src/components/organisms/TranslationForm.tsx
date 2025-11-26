/**
 * Translation Form Component (Organism)
 * Reusable component for managing translations
 * Combines multiple molecules (Autocomplete, Input, Button) into a complex form section
 */

import { useFieldArray, Controller, useFormContext } from 'react-hook-form';
import Autocomplete from '../form/input/Autocomplete';
import { PlusIcon, TrashBinIcon } from '@/icons';
import { COMMON_LOCALES } from '@/config/locales';

interface TranslationFormProps {
  fieldName?: string;
  disabled?: boolean;
  title?: string;
}

export default function TranslationForm({
  fieldName = 'meta.translations',
  disabled = false,
  title = 'Traduções',
}: TranslationFormProps) {
  const { control, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName as any,
  });

  const handleAddTranslation = () => {
    // Find first unused locale
    const usedLocales: string[] = [];
    fields.forEach((_, idx) => {
      const locale = getValues(`${fieldName}.${idx}.locale` as any) as string | undefined;
      if (locale) usedLocales.push(locale);
    });
    const availableLocale = COMMON_LOCALES.find((loc) => !usedLocales.includes(loc.value));

    if (availableLocale) {
      append({ locale: availableLocale.value, value: '' });
    } else {
      // If all common locales are used, allow custom locale
      append({ locale: '', value: '' });
    }
  };

  const getAvailableLocales = (currentIndex: number) => {
    const usedLocales: string[] = [];
    fields.forEach((_, idx) => {
      if (idx !== currentIndex) {
        const locale = getValues(`${fieldName}.${idx}.locale` as any) as string | undefined;
        if (locale) usedLocales.push(locale);
      }
    });

    return COMMON_LOCALES.filter((loc) => !usedLocales.includes(loc.value));
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
        <button
          type="button"
          onClick={handleAddTranslation}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="size-4" />
          Adicionar Tradução
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="p-4 text-sm text-center text-gray-500 bg-gray-50 rounded-lg dark:bg-gray-800 dark:text-gray-400">
          Nenhuma tradução adicionada. Clique em "Adicionar Tradução" para começar.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const availableLocales = getAvailableLocales(index);

            return (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg dark:border-gray-700"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[200px_1fr_auto] items-end">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Idioma <span className="text-error-500">*</span>
                    </label>
                    <Controller
                      name={`${fieldName}.${index}.locale` as any}
                      control={control}
                      render={({ field: localeField, fieldState }) => (
                        <>
                          <Autocomplete
                            options={availableLocales}
                            value={localeField.value || ''}
                            onChange={(value: string) => localeField.onChange(value)}
                            placeholder="Selecione ou digite um idioma"
                            disabled={disabled}
                            allowCustom={true}
                          />
                          {fieldState.error && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                              {fieldState.error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome Traduzido <span className="text-error-500">*</span>
                    </label>
                    <Controller
                      name={`${fieldName}.${index}.value` as any}
                      control={control}
                      render={({ field: valueField, fieldState }) => (
                        <>
                          <input
                            {...valueField}
                            type="text"
                            value={valueField.value || ''}
                            placeholder="Nome traduzido"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            disabled={disabled}
                          />
                          {fieldState.error && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                              {fieldState.error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={disabled}
                    className="p-2 text-red-600 transition-colors rounded hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50"
                  >
                    <TrashBinIcon className="size-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

