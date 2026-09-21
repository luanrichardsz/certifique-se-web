import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import { toastService } from '../../services/toast.service';
import { ShieldCheck, Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const getEmailError = () => {
    if (!touched) return '';
    if (!email.trim()) return 'Informe seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Digite um e-mail válido.';
    return '';
  };

  const emailError = getEmailError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSubmittedMessage(res.message);
      toastService.info('Instruções de recuperação enviadas.');
    } catch {
      toastService.error('Erro ao processar solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 my-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 cursor-pointer shadow-xs"
            onClick={() => navigate('/')}
          >
            <ShieldCheck className="w-6 h-6 stroke-[2.25]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Recuperar senha
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Informe seu e-mail cadastrado para enviarmos as instruções de
            redefinição de acesso.
          </p>
        </div>

        {submittedMessage ? (
          <div
            id="forgot-password-success"
            className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-4"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-emerald-900 font-medium leading-relaxed">
              {submittedMessage}
            </p>
            <button
              type="button"
              id="return-to-login-after-sent-btn"
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:underline pt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a tela de login</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="forgot-password-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                E-mail cadastrado
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="forgot-password-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
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
                  id="forgot-password-email-error"
                  className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              id="forgot-password-submit-btn"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-98 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span>Enviar instruções</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                id="forgot-password-back-login"
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao login</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
