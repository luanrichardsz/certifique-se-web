import { User, AuthState } from '../types';

const AUTH_STORAGE_KEY = 'certifiquese_auth_user';

const DEFAULT_USER: User = {
  id: 'usr_01hqz81239ab',
  name: 'Ana Carolina Silva',
  email: 'ana.silva@exemplo.com',
  username: 'anacarolina',
  headline: 'Engenheira de Software Full Stack & Entusiasta Cloud',
  bio: 'Profissional de tecnologia com foco em desenvolvimento Java, Spring Boot, Angular e arquitetura em nuvem. Apaixonada por aprendizado contínuo.',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop&q=80',
  isPublicProfileEnabled: true,
  createdAt: '2024-01-15T10:00:00.000Z',
};

type AuthListener = (state: AuthState) => void;

class AuthService {
  private currentState: AuthState;
  private listeners: AuthListener[] = [];

  constructor() {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.currentState = {
          user: parsed,
          isAuthenticated: true,
          token: 'mock_jwt_token_' + Date.now(),
        };
      } catch {
        this.currentState = {
          user: DEFAULT_USER,
          isAuthenticated: true,
          token: 'mock_jwt_token_default',
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_USER));
      }
    } else {
      // Default to logged-in for immediate review experience, can logout any time
      this.currentState = {
        user: DEFAULT_USER,
        isAuthenticated: true,
        token: 'mock_jwt_token_default',
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_USER));
    }
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    listener(this.currentState);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.currentState }));
  }

  getState(): AuthState {
    return { ...this.currentState };
  }

  getUser(): User | null {
    return this.currentState.user;
  }

  isAuthenticated(): boolean {
    return this.currentState.isAuthenticated;
  }

  async login(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulating realistic backend latency for REST API
    await new Promise((res) => setTimeout(res, 400));

    if (!email || !email.includes('@')) {
      return { success: false, error: 'E-mail inválido.' };
    }

    const user: User = {
      id: this.currentState.user?.id || 'usr_01hqz81239ab',
      name: this.currentState.user?.name || email.split('@')[0],
      email: email,
      username: this.currentState.user?.username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
      headline: this.currentState.user?.headline || 'Profissional em Desenvolvimento',
      bio: this.currentState.user?.bio || '',
      avatarUrl: this.currentState.user?.avatarUrl || DEFAULT_USER.avatarUrl,
      isPublicProfileEnabled: true,
      createdAt: this.currentState.user?.createdAt || new Date().toISOString(),
    };

    this.currentState = {
      user,
      isAuthenticated: true,
      token: 'jwt_token_' + Math.random().toString(36).substring(2),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    this.notify();

    return { success: true, user };
  }

  async register(name: string, email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((res) => setTimeout(res, 500));

    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Informe um nome válido.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Informe um e-mail válido.' };
    }

    const username = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 10),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      username: username || 'usuario' + Math.floor(Math.random() * 1000),
      headline: 'Profissional em Desenvolvimento',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5`,
      isPublicProfileEnabled: true,
      createdAt: new Date().toISOString(),
    };

    this.currentState = {
      user: newUser,
      isAuthenticated: true,
      token: 'jwt_token_' + Math.random().toString(36).substring(2),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    this.notify();

    return { success: true, user: newUser };
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 500));
    return {
      success: true,
      message: `Instruções de recuperação foram enviadas para ${email}. Verifique sua caixa de entrada e spam.`,
    };
  }

  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((res) => setTimeout(res, 350));
    if (!this.currentState.user) {
      return { success: false, error: 'Usuário não autenticado.' };
    }

    const updatedUser: User = {
      ...this.currentState.user,
      ...updates,
    };

    this.currentState = {
      ...this.currentState,
      user: updatedUser,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    this.notify();

    return { success: true, user: updatedUser };
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    await new Promise((res) => setTimeout(res, 400));
    if (!currentPassword || currentPassword.length < 4) {
      return { success: false, error: 'A senha atual está incorreta.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'A nova senha deve ter pelo menos 6 caracteres.' };
    }
    return { success: true };
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    return this.updatePassword(currentPassword, newPassword);
  }

  logout(): void {
    this.currentState = {
      user: null,
      isAuthenticated: false,
      token: undefined,
    };
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.notify();
  }

  deleteAccount(): void {
    this.logout();
    localStorage.clear();
  }
}

export const authService = new AuthService();
