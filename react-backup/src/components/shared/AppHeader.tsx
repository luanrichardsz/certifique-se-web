import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import {
  Menu,
  Search,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenSidebar: () => void;
  pageTitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenSidebar, pageTitle }) => {
  const { currentPath, navigate } = useRouter();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = authService.getUser();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const getAutoTitle = () => {
    if (pageTitle) return pageTitle;
    if (currentPath === '/dashboard') return 'Dashboard';
    if (currentPath === '/certificados') return 'Meus Certificados';
    if (currentPath === '/certificados/novo') return 'Adicionar Certificado';
    if (currentPath.endsWith('/editar')) return 'Editar Certificado';
    if (currentPath.startsWith('/certificados/')) return 'Detalhes do Certificado';
    if (currentPath === '/perfil') return 'Meu Perfil';
    if (currentPath === '/configuracoes') return 'Configurações';
    return 'Certifique-se';
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    authService.logout();
    navigate('/login');
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          id="mobile-menu-trigger"
          onClick={onOpenSidebar}
          aria-label="Abrir menu de navegação"
          className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 truncate tracking-tight">
          {getAutoTitle()}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Quick Add Button */}
        {currentPath !== '/certificados/novo' && (
          <button
            type="button"
            id="header-quick-add-btn"
            onClick={() => navigate('/certificados/novo')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo certificado</span>
          </button>
        )}

        {/* User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            id="user-profile-menu-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 dark:bg-slate-800 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs overflow-hidden ring-2 ring-blue-50">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name.charAt(0) || 'U'
              )}
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.name || 'Usuário'}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">
                {user?.email || 'email@exemplo.com'}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {userDropdownOpen && (
            <div
              id="user-profile-dropdown"
              className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/60 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 md:hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                type="button"
                id="dropdown-item-profile"
                onClick={() => {
                  setUserDropdownOpen(false);
                  navigate('/perfil');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 hover:text-blue-600 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Meu perfil
              </button>

              <button
                type="button"
                id="dropdown-item-settings"
                onClick={() => {
                  setUserDropdownOpen(false);
                  navigate('/configuracoes');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Configurações
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800/60" />

              <button
                type="button"
                id="dropdown-item-logout"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
