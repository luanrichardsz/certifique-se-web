import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import { AppSidebar } from '../shared/AppSidebar';
import { AppHeader } from '../shared/AppHeader';
import { ToastContainer } from '../shared/ToastContainer';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  pageTitle,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    // Auth guard check
    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 flex">
      {/* Desktop Sidebar & Mobile Drawer */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AppHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
