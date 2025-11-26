import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EyeCloseIcon, EyeIcon } from '../../icons';
import Checkbox from '../form/input/Checkbox';
import FormInput from '../form/input/FormInput';
import { useAuth } from '../../context/AuthContext';
import {
  signInSchema,
  SignInFormData,
} from '../../lib/validations/auth.schema';
import { toast } from '../../lib/toast';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const methods = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      await login({
        email: data.email.trim(),
        password: data.password,
      });
      toast.success('Login realizado com sucesso!', 'Redirecionando...');
      // Redirect to home page on successful login
      navigate('/', { replace: true });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Email ou senha inválidos';
      toast.error('Erro ao fazer login', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col flex-1'>
      <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
        <div>
          <div className='mb-5 sm:mb-8'>
            <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
              Login
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Entre com seu email e senha para fazer login!
            </p>
          </div>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className='space-y-6'>
                  <FormInput
                    name='email'
                    label='E-mail'
                    type='email'
                    placeholder='info@gmail.com'
                    required
                    disabled={isLoading}
                  />
                  <div className='relative'>
                    <FormInput
                      name='password'
                      label='Senha'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Digite sua senha'
                      required
                      disabled={isLoading}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-[calc(50%+12px)]'
                    >
                      {showPassword ? (
                        <EyeIcon className='fill-gray-500 dark:fill-gray-400 size-5' />
                      ) : (
                        <EyeCloseIcon className='fill-gray-500 dark:fill-gray-400 size-5' />
                      )}
                    </button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Checkbox checked={isChecked} onChange={setIsChecked} />
                      <span className='block font-normal text-gray-700 text-theme-sm dark:text-gray-400'>
                        Manter-me conectado
                      </span>
                    </div>
                    <Link
                      to='/reset-password'
                      className='text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400'
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                  <div>
                    <button
                      type='submit'
                      className='w-full inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50'
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
