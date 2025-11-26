/**
 * Feature Form (Create/Edit)
 */

import { useEffect, useState } from 'react';
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import PageMeta from '@/components/common/PageMeta';
import FormInput from '@/components/form/input/FormInput';
import { featuresService } from '@/lib/api/services/featuresService';
import { modulesService, Module } from '@/lib/api/services/modulesService';
import {
  createFeatureSchema,
  updateFeatureSchema,
  CreateFeatureFormData,
  UpdateFeatureFormData,
} from '@/lib/validations/features.schema';
import { toast } from '@/lib/toast';
import FormSkeleton from '@/components/ui/skeleton/FormSkeleton';
import Checkbox from '@/components/form/input/Checkbox';
import Select from '@/components/form/Select';
import MoneyInput from '@/components/form/input/MoneyInput';
import TranslationForm from '@/components/organisms/TranslationForm';
import { PlusIcon, TrashBinIcon } from '@/icons';

export default function FeatureForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);

  const methods = useForm({
    // @ts-expect-error - Yup schema type compatibility issue with RHF
    resolver: yupResolver(isEdit ? updateFeatureSchema : createFeatureSchema),
    defaultValues: {
      name: '',
      description: '',
      code: '',
      moduleId: undefined,
      prices: [],
      meta: {
        translations: [],
      },
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'prices',
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await modulesService.getAll({ limit: 1000 });
        setAvailableModules(response.results.filter((m) => m.isActive));
      } catch {
        // Silently fail, modules are optional
      }
    };
    fetchModules();
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      const fetchFeature = async () => {
        setIsFetching(true);
        try {
          const feature = await featuresService.getById(Number(id));
          const prices = feature.prices && feature.prices.length > 0 ? feature.prices : [{ price: 0, currency: 'BRL' }];
          
          // Convert translations object to array format
          const translationsObj = feature.meta?.translations || {};
          const translationsArray: { locale: string; value: string }[] = Object.entries(translationsObj).map(([locale, value]) => ({
            locale,
            value: value as string,
          }));
          
          methods.reset({
            name: feature.name,
            description: feature.description || '',
            code: feature.code,
            moduleId: feature.moduleId,
            prices,
            meta: {
              translations: translationsArray,
            },
            isActive: feature.isActive,
          } as CreateFeatureFormData);
          setIsActive(feature.isActive);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar funcionalidade';
          toast.error('Erro ao carregar funcionalidade', errorMessage);
        } finally {
          setIsFetching(false);
        }
      };
      fetchFeature();
    }
  }, [id, isEdit, methods]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      const formData = data as CreateFeatureFormData | UpdateFeatureFormData;
      
      // Build meta object with translations from array
      const translations: { [key: string]: string } = {};
      if (formData.meta?.translations && Array.isArray(formData.meta.translations)) {
        formData.meta.translations.forEach((item) => {
          if (item && item.locale && item.value && item.value.trim()) {
            translations[item.locale] = item.value.trim();
          }
        });
      }

      if (isEdit && id) {
        const updateData = {
          name: formData.name,
          description: formData.description,
          code: formData.code,
          moduleId: formData.moduleId,
          prices: formData.prices,
          isActive: formData.isActive,
          meta: {
            translations: Object.keys(translations).length > 0 ? translations : undefined,
          },
        };
        await featuresService.update(Number(id), updateData);
        toast.success('Funcionalidade atualizada com sucesso!');
      } else {
        const createData = {
          name: formData.name!,
          description: formData.description,
          code: formData.code!,
          moduleId: formData.moduleId,
          prices: formData.prices!,
          isActive: formData.isActive,
          meta: {
            translations: Object.keys(translations).length > 0 ? translations : undefined,
          },
        };
        await featuresService.create(createData);
        toast.success('Funcionalidade criada com sucesso!');
      }
      navigate('/features');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar funcionalidade';
      toast.error('Erro ao salvar funcionalidade', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title={isEdit ? 'Editar Funcionalidade | Ativiza' : 'Nova Funcionalidade | Ativiza'}
        description={isEdit ? 'Editar funcionalidade' : 'Criar nova funcionalidade'}
      />
      <PageBreadcrumb pageTitle={isEdit ? 'Editar Funcionalidade' : 'Nova Funcionalidade'} />
      <div className="space-y-6">
        <ComponentCard title={isEdit ? 'Editar Funcionalidade' : 'Nova Funcionalidade'}>
          {isFetching ? (
            <FormSkeleton />
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormInput
                      name="name"
                      label="Nome"
                      type="text"
                      placeholder="Nome da funcionalidade"
                      required
                      disabled={isLoading}
                    />
                    <FormInput
                      name="code"
                      label="Código"
                      type="text"
                      placeholder="FEATURE_CODE"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <FormInput
                    name="description"
                    label="Descrição"
                    type="text"
                    placeholder="Descrição da funcionalidade"
                    disabled={isLoading}
                  />

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Módulo
                    </label>
                    <Select
                      options={[
                        { value: '', label: 'Nenhum módulo' },
                        ...availableModules.map((module) => ({
                          value: String(module.id),
                          label: module.name,
                        })),
                      ]}
                      placeholder="Selecione um módulo"
                      onChange={(value) => {
                        methods.setValue('moduleId', value ? Number(value) : undefined);
                      }}
                      defaultValue={methods.watch('moduleId') ? String(methods.watch('moduleId')) : ''}
                    />
                  </div>

                  <TranslationForm disabled={isLoading} />

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Preços da Funcionalidade
                      </h3>
                      <button
                        type="button"
                        onClick={() => append({ price: 0, currency: 'BRL' })}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="size-4" />
                        Adicionar Preço
                      </button>
                    </div>

                    {fields.length === 0 ? (
                      <div className="p-4 text-sm text-center text-gray-500 bg-gray-50 rounded-lg dark:bg-gray-800 dark:text-gray-400">
                        Nenhum preço adicionado. Clique em "Adicionar Preço" para começar.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {fields.map((field, index) => {
                          const selectedCurrency = methods.watch(`prices.${index}.currency`) || 'BRL';
                          const currencyPrefix = selectedCurrency === 'BRL' ? 'R$ ' : selectedCurrency === 'USD' ? '$ ' : selectedCurrency === 'EUR' ? '€ ' : '£ ';

                          return (
                            <div
                              key={field.id}
                              className="p-4 border border-gray-200 rounded-lg dark:border-gray-700"
                            >
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_200px_auto] items-end">
                                <div>
                                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Moeda <span className="text-error-500">*</span>
                                  </label>
                                  <Select
                                    options={[
                                      { value: 'BRL', label: 'BRL' },
                                      { value: 'USD', label: 'USD' },
                                      { value: 'EUR', label: 'EUR' },
                                      { value: 'GBP', label: 'GBP' },
                                    ]}
                                    placeholder="Selecione a moeda"
                                    onChange={(value) =>
                                      methods.setValue(`prices.${index}.currency`, value as 'BRL' | 'USD' | 'EUR' | 'GBP')
                                    }
                                    defaultValue={selectedCurrency}
                                  />
                                </div>
                                <div>
                                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Preço <span className="text-error-500">*</span>
                                  </label>
                                  <Controller
                                    name={`prices.${index}.price`}
                                    control={methods.control}
                                    render={({ field: priceField, fieldState }) => (
                                      <>
                                        <MoneyInput
                                          value={priceField.value}
                                          onChange={(value) => priceField.onChange(value)}
                                          onBlur={priceField.onBlur}
                                          placeholder="0,00"
                                          disabled={isLoading}
                                          prefix={currencyPrefix}
                                          decimalSeparator=","
                                          thousandSeparator="."
                                          decimalScale={2}
                                          fixedDecimalScale
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
                                  disabled={isLoading}
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

                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isActive}
                      onChange={(checked) => {
                        setIsActive(checked);
                        methods.setValue('isActive', checked);
                      }}
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Funcionalidade ativa
                    </span>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      disabled={isLoading || fields.length === 0}
                      className="px-6 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/features')}
                      className="px-6 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </FormProvider>
          )}
        </ComponentCard>
      </div>
    </>
  );
}

