import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import { ShieldCheck, ArrowRight, User } from 'lucide-react';
import { ToastContainer } from '../shared/ToastContainer';

interface PublicLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showNavigation = true,
}) => {
  const { currentPath, navigate } = useRouter();
  const isAuthenticated = authService.isAuthenticated();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* Header */}
      {showNavigation && (
        <header
          id="public-header"
          className="sticky top-0 z-30 bg-white dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white dark:text-slate-900 shadow-xs">
                <ShieldCheck className="w-5 h-5 stroke-[2.25]" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-50 tracking-tight">
                Certifique<span className="text-blue-600">-se</span>
              </span>
            </div>

            {/* Navigation links & CTA */}
            <nav className="flex items-center gap-3 sm:gap-6">
              <button
                type="button"
                id="public-nav-home"
                onClick={() => navigate('/')}
                className={`text-sm font-medium transition-colors hidden sm:block ${
                  currentPath === '/'
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50'
                }`}
              >
                Início
              </button>

              <button
                type="button"
                id="public-nav-how-it-works"
                onClick={() => {
                  if (currentPath !== '/') {
                    navigate('/#como-funciona');
                  } else {
                    const el = document.getElementById('como-funciona');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors hidden sm:block"
              >
                Como funciona
              </button>

              {isAuthenticated ? (
                <button
                  type="button"
                  id="public-header-dashboard-btn"
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>Acessar Painel</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    id="public-header-login-btn"
                    onClick={() => navigate('/login')}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
                  >
                    Entrar
                  </button>

                  <button
                    type="button"
                    id="public-header-register-btn"
                    onClick={() => navigate('/cadastro')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-98"
                  >
                    <span>Criar conta</span>
                    <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                  </button>
                </div>
              )}
            </nav>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Public Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white dark:text-slate-900">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.25]" />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Certifique-se</span>
            <span>— Preservando seu histórico e conquistas</span>
          </div>

          <p className="text-center sm:text-right">
            Front-end SaaS profissional • Compatível com backend REST Spring Boot
          </p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};
