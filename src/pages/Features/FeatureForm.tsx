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
import { PlusIcon, TrashBinIcon } from '@/icons';

export default function FeatureForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const methods = useForm({
    // @ts-expect-error - Yup schema type compatibility issue with RHF
    resolver: yupResolver(isEdit ? updateFeatureSchema : createFeatureSchema),
    defaultValues: {
      name: '',
      description: '',
      code: '',
      prices: [],
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'prices',
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchFeature = async () => {
        setIsFetching(true);
        try {
          const feature = await featuresService.getById(Number(id));
          const prices = feature.prices && feature.prices.length > 0 ? feature.prices : [{ price: 0, currency: 'BRL' }];
          methods.reset({
            name: feature.name,
            description: feature.description || '',
            code: feature.code,
            prices,
            isActive: feature.isActive,
          } as UpdateFeatureFormData);
          setIsActive(feature.isActive);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar feature';
          toast.error('Erro ao carregar feature', errorMessage);
        } finally {
          setIsFetching(false);
        }
      };
      fetchFeature();
    } else {
      // Adiciona um preço inicial ao criar nova feature
      if (fields.length === 0) {
        append({ price: 0, currency: 'BRL' });
      }
    }
  }, [id, isEdit, methods, fields.length, append]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      if (isEdit && id) {
        await featuresService.update(Number(id), data as UpdateFeatureFormData);
        toast.success('Funcionalidade atualizada com sucesso!');
      } else {
        await featuresService.create(data as CreateFeatureFormData);
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

