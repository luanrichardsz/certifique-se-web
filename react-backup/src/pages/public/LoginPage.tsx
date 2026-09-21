import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import { toastService } from '../../services/toast.service';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const getEmailError = () => {
    if (!touched.email) return '';
    if (!email.trim()) return 'Informe seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Digite um e-mail válido.';
    return '';
  };

  const getPasswordError = () => {
    if (!touched.password) return '';
    if (!password) return 'Informe uma senha.';
    return '';
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setGeneralError(null);

    const emailValid = email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = password.length > 0;

    if (!emailValid || !passwordValid) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        toastService.success(`Bem-vindo(a) de volta, ${response.user?.name || 'usuário'}!`);
        navigate('/dashboard');
      } else {
        setGeneralError(response.error || 'Credenciais inválidas.');
      }
    } catch {
      setGeneralError('Ocorreu um erro ao autenticar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 my-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 cursor-pointer shadow-xs"
            onClick={() => navigate('/')}
          >
            <ShieldCheck className="w-6 h-6 stroke-[2.25]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Acessar conta
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Entre para gerenciar seus certificados
          </p>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div
            id="login-error-banner"
            className="mb-6 p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                placeholder="seu.email@exemplo.com"
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white dark:bg-slate-900 ${
                  emailError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {emailError && (
              <p
                id="login-email-error"
                className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Senha
              </label>
              <button
                type="button"
                id="login-forgot-password-link"
                onClick={() => navigate('/esqueci-senha')}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white dark:bg-slate-900 ${
                  passwordError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {passwordError && (
              <p
                id="login-password-error"
                className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-98 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fill Helper for easy evaluation */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-center">
          <button
            type="button"
            onClick={() => {
              setEmail('ana.silva@exemplo.com');
              setPassword('123456');
              setTouched({ email: false, password: false });
            }}
            className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
          >
            Preencher com conta de demonstração (Ana Silva)
          </button>
        </div>

        {/* Register prompt */}
        <p className="mt-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Ainda não possui uma conta?{' '}
          <button
            type="button"
            id="login-register-link"
            onClick={() => navigate('/cadastro')}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Criar conta
          </button>
        </p>
      </div>
    </div>
  );
};
