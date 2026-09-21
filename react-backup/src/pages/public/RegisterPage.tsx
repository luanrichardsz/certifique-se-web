import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import { toastService } from '../../services/toast.service';
import { ShieldCheck, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { navigate } = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const getNameError = () => {
    if (!touched.name) return '';
    if (!name.trim()) return 'Informe seu nome completo.';
    if (name.trim().length < 2) return 'O nome deve ter pelo menos 2 caracteres.';
    return '';
  };

  const getEmailError = () => {
    if (!touched.email) return '';
    if (!email.trim()) return 'Informe seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Digite um e-mail válido.';
    return '';
  };

  const getPasswordError = () => {
    if (!touched.password) return '';
    if (!password) return 'Informe uma senha.';
    if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    return '';
  };

  const getConfirmPasswordError = () => {
    if (!touched.confirmPassword) return '';
    if (!confirmPassword) return 'Confirme sua senha.';
    if (password !== confirmPassword) return 'As senhas não coincidem.';
    return '';
  };

  const nameError = getNameError();
  const emailError = getEmailError();
  const passwordError = getPasswordError();
  const confirmPasswordError = getConfirmPasswordError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setGeneralError(null);

    const isNameValid = name.trim().length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 6;
    const isConfirmValid = password === confirmPassword;

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.register(name, email, password);
      if (res.success) {
        toastService.success('Conta criada com sucesso! Bem-vindo ao Certifique-se.');
        navigate('/dashboard');
      } else {
        setGeneralError(res.error || 'Não foi possível concluir o cadastro.');
      }
    } catch {
      setGeneralError('Ocorreu um erro ao criar a conta. Tente novamente.');
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
            Criar sua conta
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comece a organizar seus certificados em minutos
          </p>
        </div>

        {generalError && (
          <div
            id="register-error-banner"
            className="mb-6 p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="register-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Nome completo
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                placeholder="Ex: Carlos Eduardo Mendes"
                autoComplete="name"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white dark:bg-slate-900 ${
                  nameError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {nameError && (
              <p
                id="register-name-error"
                className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {nameError}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="register-email"
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
                id="register-email-error"
                className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="register-password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="Mínimo de 6 caracteres"
                autoComplete="new-password"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white dark:bg-slate-900 ${
                  passwordError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {passwordError && (
              <p
                id="register-password-error"
                className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {passwordError}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="register-confirm-password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Confirmar senha
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                placeholder="Digite a senha novamente"
                autoComplete="new-password"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white dark:bg-slate-900 ${
                  confirmPasswordError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {confirmPasswordError && (
              <p
                id="register-confirm-password-error"
                className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {confirmPasswordError}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="register-submit-btn"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-98 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Criando conta...</span>
              </>
            ) : (
              <>
                <span>Criar conta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login prompt */}
        <p className="mt-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Já possui uma conta?{' '}
          <button
            type="button"
            id="register-login-link"
            onClick={() => navigate('/login')}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};
