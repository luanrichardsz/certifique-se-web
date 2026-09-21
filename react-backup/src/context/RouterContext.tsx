import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { authService } from '../services/auth.service';

interface RouteMatch {
  path: string;
  params: Record<string, string>;
  queryParams: Record<string, string>;
}

interface RouterContextType {
  currentPath: string;
  params: Record<string, string>;
  queryParams: Record<string, string>;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  isActive: (path: string, exact?: boolean) => boolean;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parseCurrentLocation(): { pathname: string; queryParams: Record<string, string> } {
  // Support both hash and standard pathname
  let raw = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.pathname;

  if (!raw || raw === '') raw = '/';

  const [pathname, search] = raw.split('?');
  const queryParams: Record<string, string> = {};

  if (search) {
    const usp = new URLSearchParams(search);
    usp.forEach((value, key) => {
      queryParams[key] = value;
    });
  }

  return { pathname: pathname || '/', queryParams };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [locationState, setLocationState] = useState(parseCurrentLocation);

  useEffect(() => {
    const handlePopState = () => {
      setLocationState(parseCurrentLocation());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    // Normalizing URL
    const target = to.startsWith('/') ? to : '/' + to;
    if (options?.replace) {
      window.history.replaceState(null, '', '#' + target);
    } else {
      window.history.pushState(null, '', '#' + target);
    }
    setLocationState(parseCurrentLocation());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (targetPath: string, exact = false): boolean => {
    if (exact) {
      return locationState.pathname === targetPath;
    }
    if (targetPath === '/') {
      return locationState.pathname === '/';
    }
    return locationState.pathname.startsWith(targetPath);
  };

  // Route pattern matcher to extract params (e.g. /certificados/:id or /u/:username)
  const routeParams = useMemo(() => {
    const params: Record<string, string> = {};
    const path = locationState.pathname;

    // Pattern /certificados/:id/editar
    const editMatch = path.match(/^\/certificados\/([^/]+)\/editar\/?$/);
    if (editMatch) {
      params.id = decodeURIComponent(editMatch[1]);
      return params;
    }

    // Pattern /certificados/:id
    const certMatch = path.match(/^\/certificados\/([^/]+)\/?$/);
    if (certMatch && certMatch[1] !== 'novo') {
      params.id = decodeURIComponent(certMatch[1]);
      return params;
    }

    // Pattern /u/:username
    const userMatch = path.match(/^\/u\/([^/]+)\/?$/);
    if (userMatch) {
      params.username = decodeURIComponent(userMatch[1]);
      return params;
    }

    return params;
  }, [locationState.pathname]);

  return (
    <RouterContext.Provider
      value={{
        currentPath: locationState.pathname,
        params: routeParams,
        queryParams: locationState.queryParams,
        navigate,
        isActive,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
