/**
 * Qualification Form (Create/Edit)
 */

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import PageMeta from '@/components/common/PageMeta';
import FormInput from '@/components/form/input/FormInput';
import { qualificationsService } from '@/lib/api/services/qualificationsService';
import {
  createQualificationSchema,
  updateQualificationSchema,
  CreateQualificationFormData,
  UpdateQualificationFormData,
} from '@/lib/validations/qualifications.schema';
import { toast } from '@/lib/toast';
import FormSkeleton from '@/components/ui/skeleton/FormSkeleton';
import Checkbox from '@/components/form/input/Checkbox';

export default function QualificationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const methods = useForm({
    // @ts-expect-error - Yup schema type compatibility issue with RHF
    resolver: yupResolver(isEdit ? updateQualificationSchema : createQualificationSchema),
    defaultValues: {
      name: '',
      description: '',
      code: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchQualification = async () => {
        setIsFetching(true);
        try {
          const qualification = await qualificationsService.getById(Number(id));
          methods.reset({
            name: qualification.name,
            description: qualification.description || '',
            code: qualification.code,
            isActive: qualification.isActive,
          } as UpdateQualificationFormData);
          setIsActive(qualification.isActive);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar qualificação';
          toast.error('Erro ao carregar qualificação', errorMessage);
        } finally {
          setIsFetching(false);
        }
      };
      fetchQualification();
    }
  }, [id, isEdit, methods]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      if (isEdit && id) {
        await qualificationsService.update(Number(id), data as UpdateQualificationFormData);
        toast.success('Qualificação atualizada com sucesso!');
      } else {
        await qualificationsService.create(data as CreateQualificationFormData);
        toast.success('Qualificação criada com sucesso!');
      }
      navigate('/qualifications');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar qualificação';
      toast.error('Erro ao salvar qualificação', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title={isEdit ? 'Editar Qualificação | Ativiza' : 'Nova Qualificação | Ativiza'}
        description={isEdit ? 'Editar qualificação' : 'Criar nova qualificação'}
      />
      <PageBreadcrumb pageTitle={isEdit ? 'Editar Qualificação' : 'Nova Qualificação'} />
      <div className="space-y-6">
        <ComponentCard title={isEdit ? 'Editar Qualificação' : 'Nova Qualificação'}>
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
                      placeholder="Nome da qualificação"
                      required
                      disabled={isLoading}
                    />
                    <FormInput
                      name="code"
                      label="Código"
                      type="text"
                      placeholder="QUALIFICATION_CODE"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <FormInput
                    name="description"
                    label="Descrição"
                    type="text"
                    placeholder="Descrição da qualificação"
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
                      Qualificação ativa
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/qualifications')}
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

