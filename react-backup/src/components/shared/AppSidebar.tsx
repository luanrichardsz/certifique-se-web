import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import {
  LayoutDashboard,
  Award,
  PlusCircle,
  User,
  Settings,
  LogOut,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const { currentPath, navigate, isActive } = useRouter();
  const currentUser = authService.getUser();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Meus certificados',
      path: '/certificados',
      icon: Award,
      exact: true,
    },
    {
      label: 'Adicionar certificado',
      path: '/certificados/novo',
      icon: PlusCircle,
    },
    {
      label: 'Meu perfil',
      path: '/perfil',
      icon: User,
    },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 bg-slate-900 dark:bg-slate-50/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/60">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => handleNav('/dashboard')}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white dark:text-slate-900 shadow-xs">
                <ShieldCheck className="w-5 h-5 stroke-[2.25]" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-50 tracking-tight">
                Certifique<span className="text-blue-600">-se</span>
              </span>
            </div>

            <button
              type="button"
              id="sidebar-close-btn"
              onClick={onClose}
              aria-label="Fechar menu"
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Menu Principal
            </div>

            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  type="button"
                  id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:bg-slate-900/50'
                  }`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 ${
                      active ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
          {currentUser && currentUser.username && (
            <button
              type="button"
              id="nav-link-public-portfolio"
              onClick={() => handleNav(`/u/${currentUser.username}`)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Ver portfólio público
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
                /u/{currentUser.username}
              </span>
            </button>
          )}

          <button
            type="button"
            id="nav-link-configuracoes"
            onClick={() => handleNav('/configuracoes')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive('/configuracoes')
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:bg-slate-900/50'
            }`}
          >
            <Settings
              className={`w-4.5 h-4.5 shrink-0 ${
                isActive('/configuracoes') ? 'text-blue-600' : 'text-slate-400'
              }`}
            />
            <span>Configurações</span>
          </button>

          <button
            type="button"
            id="nav-link-logout"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5 text-rose-500 shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};
