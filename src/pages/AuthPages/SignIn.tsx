import PageMeta from '../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';
import SignInForm from '../../components/auth/SignInForm';

export default function SignIn() {
  return (
    <>
      <PageMeta
        title='Login - Ativiza'
        description='Entre com seu email e senha para fazer login no sistema de gestão financeira Ativiza'
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
