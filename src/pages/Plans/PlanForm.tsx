/**
 * Plan Form (Create/Edit)
 */

import { useEffect, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import PageMeta from '@/components/common/PageMeta';
import FormInput from '@/components/form/input/FormInput';
import { plansService, Plan } from '@/lib/api/services/plansService';
import { featuresService, Feature } from '@/lib/api/services/featuresService';
import {
  createPlanSchema,
  updatePlanSchema,
  CreatePlanFormData,
  UpdatePlanFormData,
  PlanFeatureFormData,
} from '@/lib/validations/plans.schema';
import { toast } from '@/lib/toast';
import FormSkeleton from '@/components/ui/skeleton/FormSkeleton';
import Checkbox from '@/components/form/input/Checkbox';
import Select from '@/components/form/Select';
import { PlusIcon, TrashBinIcon } from '@/icons';

export default function PlanForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);

  const methods = useForm<CreatePlanFormData | UpdatePlanFormData>({
    // @ts-expect-error - Yup schema type compatibility issue with RHF
    resolver: yupResolver(isEdit ? updatePlanSchema : createPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'features',
  });

  // Fetch available features
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await featuresService.getAll({ limit: 1000 });
        setAvailableFeatures(response.data.filter((f) => f.isActive));
      } catch (err) {
        toast.error('Erro ao carregar features', 'Não foi possível carregar a lista de features');
      }
    };
    fetchFeatures();
  }, []);

  // Fetch plan data if editing
  useEffect(() => {
    if (isEdit && id) {
      const fetchPlan = async () => {
        setIsFetching(true);
        try {
          const plan = await plansService.getById(Number(id));
          methods.reset({
            name: plan.name,
            description: plan.description || '',
            isActive: plan.isActive,
            features: plan.features.map((f) => ({
              featureId: f.featureId,
              price: f.price,
            })),
          } as UpdatePlanFormData);
          setIsActive(plan.isActive);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar plano';
          toast.error('Erro ao carregar plano', errorMessage);
        } finally {
          setIsFetching(false);
        }
      };
      fetchPlan();
    }
  }, [id, isEdit, methods]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      const submitData = data as CreatePlanFormData | UpdatePlanFormData;
      if (isEdit && id) {
        await plansService.update(Number(id), submitData as UpdatePlanFormData);
        toast.success('Plano atualizado com sucesso!');
      } else {
        await plansService.create(submitData as CreatePlanFormData);
        toast.success('Plano criado com sucesso!');
      }
      navigate('/plans');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar plano';
      toast.error('Erro ao salvar plano', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeature = () => {
    if (availableFeatures.length > 0) {
      append({
        featureId: availableFeatures[0].id,
        price: 0,
      });
    }
  };

  const getFeatureName = (featureId: number) => {
    const feature = availableFeatures.find((f) => f.id === featureId);
    return feature?.name || 'Feature não encontrada';
  };

  const getTotalPrice = () => {
    const features = methods.watch('features') || [];
    return features.reduce((sum, feature) => sum + (feature.price || 0), 0);
  };

  return (
    <>
      <PageMeta
        title={isEdit ? 'Editar Plano | Ativiza' : 'Novo Plano | Ativiza'}
        description={isEdit ? 'Editar plano' : 'Criar novo plano'}
      />
      <PageBreadcrumb pageTitle={isEdit ? 'Editar Plano' : 'Novo Plano'} />
      <div className="space-y-6">
        <ComponentCard title={isEdit ? 'Editar Plano' : 'Novo Plano'}>
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
                      placeholder="Nome do plano"
                      required
                      disabled={isLoading}
                    />
                    <FormInput
                      name="description"
                      label="Descrição"
                      type="text"
                      placeholder="Descrição do plano"
                      disabled={isLoading}
                    />
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
                      Plano ativo
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Features do Plano
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        disabled={isLoading || availableFeatures.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="size-4" />
                        Adicionar Feature
                      </button>
                    </div>

                    {fields.length === 0 ? (
                      <div className="p-4 text-sm text-center text-gray-500 bg-gray-50 rounded-lg dark:bg-gray-800 dark:text-gray-400">
                        Nenhuma feature adicionada. Clique em "Adicionar Feature" para começar.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {fields.map((field, index) => {
                          const selectedFeatureId = methods.watch(`features.${index}.featureId`);
                          const availableOptions = availableFeatures.map((f) => ({
                            value: f.id.toString(),
                            label: `${f.name} (${f.code})`,
                          }));

                          return (
                            <div
                              key={field.id}
                              className="p-4 border border-gray-200 rounded-lg dark:border-gray-700"
                            >
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_200px_auto] items-end">
                                <div>
                                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Feature <span className="text-error-500">*</span>
                                  </label>
                                  <Select
                                    options={availableOptions}
                                    placeholder="Selecione a feature"
                                    onChange={(value) =>
                                      methods.setValue(`features.${index}.featureId`, Number(value))
                                    }
                                    defaultValue={selectedFeatureId?.toString()}
                                  />
                                </div>
                                <div>
                                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Preço (R$) <span className="text-error-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    {...methods.register(`features.${index}.price`, {
                                      valueAsNumber: true,
                                    })}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    disabled={isLoading}
                                  />
                                  {methods.formState.errors.features?.[index]?.price && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                      {methods.formState.errors.features[index]?.price?.message}
                                    </p>
                                  )}
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

                        <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Valor Total:
                            </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
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
                      onClick={() => navigate('/plans')}
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

