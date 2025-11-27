/**
 * Module Form (Create/Edit)
 */

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import PageMeta from '@/components/common/PageMeta';
import FormInput from '@/components/form/input/FormInput';
import { modulesService } from '@/lib/api/services/modulesService';
import {
  createModuleSchema,
  updateModuleSchema,
  CreateModuleFormData,
  UpdateModuleFormData,
} from '@/lib/validations/modules.schema';
import { toast } from '@/lib/toast';
import FormSkeleton from '@/components/ui/skeleton/FormSkeleton';
import Checkbox from '@/components/form/input/Checkbox';
import TranslationForm from '@/components/organisms/TranslationForm';

export default function ModuleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const methods = useForm({
    // @ts-expect-error - Yup schema type compatibility issue with RHF
    resolver: yupResolver(isEdit ? updateModuleSchema : createModuleSchema),
    defaultValues: {
      name: '',
      description: '',
      key: '',
      meta: {
        translations: [],
      },
      isActive: true,
    },
  });


  useEffect(() => {
    if (isEdit && id) {
      const fetchModule = async () => {
        setIsFetching(true);
        try {
          const module = await modulesService.getById(Number(id));
          const translationsObj = module.meta?.translations || {};
          
          // Convert translations object to array format for useFieldArray
          const translationsArray: { locale: string; value: string }[] = Object.entries(translationsObj).map(([locale, value]) => ({
            locale,
            value: value as string,
          }));
          
          // Reset form with module data
          methods.reset({
            name: module.name,
            description: module.description || '',
            key: module.key,
            meta: {
              translations: translationsArray,
            },
            isActive: module.isActive,
          } as CreateModuleFormData);
          
          setIsActive(module.isActive);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar módulo';
          toast.error('Erro ao carregar módulo', errorMessage);
        } finally {
          setIsFetching(false);
        }
      };
      fetchModule();
    }
  }, [id, isEdit, methods]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      const formData = data as CreateModuleFormData | UpdateModuleFormData;
      
      // Build meta object with translations from array
      const translations: { [key: string]: string } = {};
      if (formData.meta?.translations && Array.isArray(formData.meta.translations)) {
        formData.meta.translations.forEach((item: { locale: string; value: string }) => {
          if (item && item.locale && item.value && item.value.trim()) {
            translations[item.locale] = item.value.trim();
          }
        });
      }

      if (isEdit && id) {
        const updateData = {
          name: formData.name,
          key: formData.key,
          description: formData.description,
          isActive: formData.isActive,
          meta: {
            translations: Object.keys(translations).length > 0 ? translations : undefined,
          },
        };
        await modulesService.update(Number(id), updateData);
        toast.success('Módulo atualizado com sucesso!');
      } else {
        const createData = {
          name: formData.name!,
          key: formData.key!,
          description: formData.description,
          isActive: formData.isActive,
          meta: {
            translations: Object.keys(translations).length > 0 ? translations : undefined,
          },
        };
        await modulesService.create(createData);
        toast.success('Módulo criado com sucesso!');
      }
      navigate('/modules');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar módulo';
      toast.error('Erro ao salvar módulo', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <PageMeta
        title={isEdit ? 'Editar Módulo | Ativiza' : 'Novo Módulo | Ativiza'}
        description={isEdit ? 'Editar módulo' : 'Criar novo módulo'}
      />
      <PageBreadcrumb pageTitle={isEdit ? 'Editar Módulo' : 'Novo Módulo'} />
      <div className="space-y-6">
        <ComponentCard title={isEdit ? 'Editar Módulo' : 'Novo Módulo'}>
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
                      placeholder="Nome do módulo"
                      required
                      disabled={isLoading}
                    />
                    <FormInput
                      name="key"
                      label="Código"
                      type="text"
                      placeholder="MODULE_KEY"
                      required
                      disabled={isLoading || isEdit}
                    />
                  </div>

                  <FormInput
                    name="description"
                    label="Descrição"
                    type="text"
                    placeholder="Descrição do módulo"
                    disabled={isLoading}
                  />

                  <TranslationForm disabled={isLoading} />

                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isActive}
                      onChange={(checked) => {
                        setIsActive(checked);
                        methods.setValue('isActive', checked);
                      }}
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Módulo ativo
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
                      onClick={() => navigate('/modules')}
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

