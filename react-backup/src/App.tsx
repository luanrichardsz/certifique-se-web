import React, { useEffect, useState } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { authService } from './services/auth.service';
import { ToastContainer } from './components/shared/ToastContainer';

// Layouts
import { PublicLayout } from './components/layouts/PublicLayout';
import { AuthenticatedLayout } from './components/layouts/AuthenticatedLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { PublicProfilePage } from './pages/public/PublicProfilePage';

// Authenticated Pages
import { DashboardPage } from './pages/authenticated/DashboardPage';
import { CertificateListPage } from './pages/authenticated/CertificateListPage';
import { CertificateFormPage } from './pages/authenticated/CertificateFormPage';
import { CertificateDetailsPage } from './pages/authenticated/CertificateDetailsPage';
import { ProfilePage } from './pages/authenticated/ProfilePage';
import { SettingsPage } from './pages/authenticated/SettingsPage';

import { ThemeProvider } from './context/ThemeContext';

const AppRoutes: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    return authService.subscribe((user) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  // Protected route checking
  const isProtectedPath =
    currentPath.startsWith('/dashboard') ||
    currentPath.startsWith('/certificados') ||
    currentPath.startsWith('/perfil') ||
    currentPath.startsWith('/configuracoes');

  const isAuthOnlyPage = currentPath === '/login' || currentPath === '/cadastro';

  useEffect(() => {
    if (isProtectedPath && !isAuthenticated) {
      navigate('/login');
    }
  }, [currentPath, isAuthenticated, isProtectedPath, navigate]);

  // Render matching view
  const renderContent = () => {
    // Public routes
    if (currentPath === '/') {
      return (
        <PublicLayout>
          <LandingPage />
        </PublicLayout>
      );
    }

    if (currentPath === '/login') {
      return (
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      );
    }

    if (currentPath === '/cadastro') {
      return (
        <PublicLayout>
          <RegisterPage />
        </PublicLayout>
      );
    }

    if (currentPath === '/esqueci-senha') {
      return (
        <PublicLayout>
          <ForgotPasswordPage />
        </PublicLayout>
      );
    }

    // Public Profile /u/:username
    if (currentPath.startsWith('/u/')) {
      return (
        <PublicLayout>
          <PublicProfilePage />
        </PublicLayout>
      );
    }

    // Authenticated routes
    if (currentPath === '/dashboard') {
      return (
        <AuthenticatedLayout>
          <DashboardPage />
        </AuthenticatedLayout>
      );
    }

    if (currentPath === '/certificados') {
      return (
        <AuthenticatedLayout>
          <CertificateListPage />
        </AuthenticatedLayout>
      );
    }

    if (currentPath === '/certificados/novo') {
      return (
        <AuthenticatedLayout>
          <CertificateFormPage mode="create" />
        </AuthenticatedLayout>
      );
    }

    if (currentPath.endsWith('/editar')) {
      return (
        <AuthenticatedLayout>
          <CertificateFormPage mode="edit" />
        </AuthenticatedLayout>
      );
    }

    if (currentPath.startsWith('/certificados/')) {
      return (
        <AuthenticatedLayout>
          <CertificateDetailsPage />
        </AuthenticatedLayout>
      );
    }

    if (currentPath === '/perfil') {
      return (
        <AuthenticatedLayout>
          <ProfilePage />
        </AuthenticatedLayout>
      );
    }

    if (currentPath === '/configuracoes') {
      return (
        <AuthenticatedLayout>
          <SettingsPage />
        </AuthenticatedLayout>
      );
    }

    // Fallback to landing page if unknown
    return (
      <PublicLayout>
        <LandingPage />
      </PublicLayout>
    );
  };

  return (
    <>
      <ToastContainer />
      {renderContent()}
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </ThemeProvider>
  );
}
