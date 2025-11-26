/**
 * Account Form (Create/Edit)
 */

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import PageMeta from '../../components/common/PageMeta';
import FormInput from '../../components/form/input/FormInput';
import { accountsService } from '../../lib/api/services/accountsService';
import {
  createAccountSchema,
  updateAccountSchema,
  CreateAccountFormData,
  UpdateAccountFormData,
} from '../../lib/validations/accounts.schema';
import { useState } from 'react';
import Select from '../../components/form/Select';
import { toast } from '../../lib/toast';
import FormSkeleton from '@/components/ui/skeleton/FormSkeleton';

export default function AccountForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const methods = useForm({
    // @ts-expect-error - Yup schema type compatibility issue with RHF
    resolver: yupResolver(isEdit ? updateAccountSchema : createAccountSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      document: '',
      status: 'ACTIVE',
      currency: 'BRL',
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchAccount = async () => {
        setIsFetching(true);
        try {
          const account = await accountsService.getById(id);
          methods.reset({
            name: account.name,
            email: account.email,
            phone: account.phone || '',
            document: account.document || '',
            status: account.status,
            currency: account.currency,
          } as UpdateAccountFormData);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar conta';
          toast.error('Erro ao carregar conta', errorMessage);
        } finally {
          setIsFetching(false);
        }
      };
      fetchAccount();
    }
  }, [id, isEdit, methods]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      if (isEdit && id) {
        await accountsService.update(id, data as UpdateAccountFormData);
        toast.success('Conta atualizada com sucesso!');
      } else {
        await accountsService.create(data as CreateAccountFormData);
        toast.success('Conta criada com sucesso!');
      }
      navigate('/accounts');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar conta';
      toast.error('Erro ao salvar conta', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title={isEdit ? 'Editar Conta | Ativiza' : 'Nova Conta | Ativiza'}
        description={isEdit ? 'Editar conta' : 'Criar nova conta'}
      />
      <PageBreadcrumb pageTitle={isEdit ? 'Editar Conta' : 'Nova Conta'} />
      <div className="space-y-6">
        <ComponentCard title={isEdit ? 'Editar Conta' : 'Nova Conta'}>
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
                    placeholder="Nome da conta"
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
                  <FormInput
                    name="document"
                    label="Documento"
                    type="text"
                    placeholder="12345678901"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <Select
                      options={[
                        { value: 'ACTIVE', label: 'Ativo' },
                        { value: 'INACTIVE', label: 'Inativo' },
                      ]}
                      placeholder="Selecione o status"
                      onChange={(value) => methods.setValue('status', value as 'ACTIVE' | 'INACTIVE')}
                      defaultValue={methods.watch('status')}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Moeda
                    </label>
                    <Select
                      options={[
                        { value: 'BRL', label: 'BRL' },
                        { value: 'USD', label: 'USD' },
                        { value: 'EUR', label: 'EUR' },
                        { value: 'GBP', label: 'GBP' },
                      ]}
                      placeholder="Selecione a moeda"
                      onChange={(value) => methods.setValue('currency', value as 'BRL' | 'USD' | 'EUR' | 'GBP')}
                      defaultValue={methods.watch('currency')}
                    />
                  </div>
                </div>

                {!isEdit && (
                  <FormInput
                    name="password"
                    label="Senha (opcional se ownerId for fornecido)"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    disabled={isLoading}
                  />
                )}

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
                    onClick={() => navigate('/accounts')}
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

