/**
 * Feature Form (Create/Edit)
 */

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
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
import Autocomplete from '@/components/form/input/Autocomplete';

export default function FeatureForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);

  const methods = useForm<CreateFeatureFormData | UpdateFeatureFormData>({
    // @ts-expect-error - Yup schema type compatibility issue with RHF
    resolver: yupResolver(isEdit ? updateFeatureSchema : createFeatureSchema),
    defaultValues: {
      key: '',
      name: '',
      description: '',
      category: '',
      module: undefined,
      isActive: true,
      sortOrder: 0,
    },
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
          
          methods.reset({
            key: feature.key,
            name: feature.name,
            description: feature.description || '',
            category: feature.category || '',
            module: feature.module
              ? { value: feature.module.id, label: feature.module.name }
              : undefined,
            isActive: feature.isActive,
            sortOrder: feature.sortOrder || 0,
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
      
      if (isEdit && id) {
        const updateData: UpdateFeatureFormData = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          module: formData.module,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder,
        };
        await featuresService.update(Number(id), updateData);
        toast.success('Funcionalidade atualizada com sucesso!');
      } else {
        const createData: CreateFeatureFormData = {
          key: (formData as CreateFeatureFormData).key!,
          name: formData.name!,
          description: formData.description,
          category: formData.category,
          module: formData.module,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder,
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
                  <FormInput
                    name="key"
                    label="Chave"
                    type="text"
                    placeholder="ex: loan_module, advanced_reports"
                    required
                    disabled={isLoading || isEdit}
                  />

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
                      name="category"
                      label="Categoria"
                      type="text"
                      placeholder="ex: reports, integrations, automation"
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
                    <Autocomplete
                      options={[
                        { value: '', label: 'Nenhum módulo' },
                        ...availableModules.map((module) => ({
                          value: String(module.id),
                          label: module.name,
                        })),
                      ]}
                      placeholder="Digite ou selecione um módulo..."
                      disabled={isLoading}
                      allowCustom={false}
                      value={
                        methods.watch('module')
                          ? String(methods.watch('module')?.value || '')
                          : ''
                      }
                      onChange={(value) => {
                        if (value && value !== '') {
                          const moduleId = Number(value);
                          const selectedModule = availableModules.find((m) => m.id === moduleId);
                          if (selectedModule) {
                            methods.setValue('module', {
                              value: selectedModule.id,
                              label: selectedModule.name,
                            });
                          }
                        } else {
                          methods.setValue('module', undefined);
                        }
                      }}
                    />
                  </div>

                  <FormInput
                    name="sortOrder"
                    label="Ordem de Exibição"
                    type="number"
                    placeholder="0"
                    disabled={isLoading}
                  />

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
                      disabled={isLoading}
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
