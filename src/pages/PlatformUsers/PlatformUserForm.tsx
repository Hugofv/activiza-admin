/**
 * Platform User Form (Create/Edit)
 */

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import PageMeta from '../../components/common/PageMeta';
import FormInput from '../../components/form/input/FormInput';
import { platformUsersService } from '../../lib/api/services/platformUsersService';
import {
  createPlatformUserSchema,
  updatePlatformUserSchema,
  CreatePlatformUserFormData,
  UpdatePlatformUserFormData,
} from '../../lib/validations/platformUsers.schema';
import Autocomplete from '../../components/form/input/Autocomplete';
import Checkbox from '../../components/form/input/Checkbox';
import { toast } from '../../lib/toast';
import FormSkeleton from '@/components/ui/skeleton/FormSkeleton';

export default function PlatformUserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const methods = useForm({
    // @ts-expect-error - Yup schema type compatibility issue with RHF
    resolver: yupResolver(isEdit ? updatePlatformUserSchema : createPlatformUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'viewer',
      isActive: true,
      twoFa: false,
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchUser = async () => {
        setIsFetching(true);
        try {
          const user = await platformUsersService.getById(Number(id));
          methods.reset({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            isActive: user.isActive,
            twoFa: user.twoFa || false,
          });
          setIsActive(user.isActive);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuário';
          toast.error('Erro ao carregar usuário', errorMessage);
        } finally {
          setIsFetching(false);
        }
      };
      fetchUser();
    }
  }, [id, isEdit, methods]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      const submitData = { ...(data as Record<string, unknown>) };
      if (isEdit && !submitData.password) {
        delete (submitData as UpdatePlatformUserFormData).password;
      }
      if (isEdit && id) {
        await platformUsersService.update(Number(id), submitData as UpdatePlatformUserFormData);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        await platformUsersService.create(submitData as CreatePlatformUserFormData);
        toast.success('Usuário criado com sucesso!');
      }
      navigate('/platform-users');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar usuário';
      toast.error('Erro ao salvar usuário', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title={isEdit ? 'Editar Usuário | Ativiza' : 'Novo Usuário | Ativiza'}
        description={isEdit ? 'Editar usuário da plataforma' : 'Criar novo usuário da plataforma'}
      />
      <PageBreadcrumb pageTitle={isEdit ? 'Editar Usuário' : 'Novo Usuário'} />
      <div className="space-y-6">
        <ComponentCard title={isEdit ? 'Editar Usuário' : 'Novo Usuário'}>
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
                    placeholder="Nome completo"
                    required
                    disabled={isLoading}
                  />
                  <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="email@exemplo.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormInput
                    name="phone"
                    label="Telefone"
                    type="text"
                    placeholder="+5511999999999"
                    disabled={isLoading}
                  />
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Perfil <span className="text-error-500">*</span>
                    </label>
                    <Autocomplete
                      options={[
                        { value: 'owner', label: 'Proprietário' },
                        { value: 'admin', label: 'Administrador' },
                        { value: 'agent', label: 'Agente' },
                        { value: 'viewer', label: 'Visualizador' },
                      ]}
                      placeholder="Digite ou selecione o perfil..."
                      disabled={isLoading}
                      allowCustom={false}
                      value={methods.watch('role') || ''}
                      onChange={(value) => methods.setValue('role', value as 'owner' | 'admin' | 'agent' | 'viewer')}
                    />
                  </div>
                </div>

                <FormInput
                  name="password"
                  label={isEdit ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  required={!isEdit}
                  disabled={isLoading}
                />

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isActive}
                      onChange={(checked) => {
                        setIsActive(checked);
                        methods.setValue('isActive', checked);
                      }}
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Usuário ativo
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={methods.watch('twoFa') || false}
                      onChange={(checked) => methods.setValue('twoFa', checked)}
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Autenticação de dois fatores
                    </span>
                  </div>
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
                    onClick={() => navigate('/platform-users')}
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

