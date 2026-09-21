import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import { toastService } from '../../services/toast.service';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { useTheme } from '../../context/ThemeContext';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  ShieldAlert,
  Save,
  Check,
  Globe,
  Moon,
  Sun,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { navigate } = useRouter();
  const user = authService.getUser();
  const { theme, toggleTheme } = useTheme();

  // Account form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Privacy
  const [isPublicProfile, setIsPublicProfile] = useState(
    user?.isPublicProfileEnabled ?? true
  );

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toastService.warning('Informe seu nome.');
      return;
    }
    setIsUpdatingAccount(true);
    try {
      await authService.updateProfile({ name: name.trim() });
      toastService.success('Dados da conta atualizados com sucesso.');
    } catch {
      toastService.error('Erro ao atualizar dados da conta.');
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toastService.warning('Informe a senha atual.');
      return;
    }
    if (newPassword.length < 6) {
      toastService.warning('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toastService.warning('As senhas não coincidem.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      if (res.success) {
        toastService.success('Senha alterada com sucesso.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toastService.error(res.error || 'Não foi possível alterar a senha.');
      }
    } catch {
      toastService.error('Erro ao alterar senha.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleTogglePrivacy = async (enabled: boolean) => {
    setIsPublicProfile(enabled);
    try {
      await authService.updateProfile({ isPublicProfileEnabled: enabled });
      toastService.success(
        enabled
          ? 'Portfólio público habilitado.'
          : 'Portfólio público desabilitado.'
      );
    } catch {
      toastService.error('Erro ao atualizar configurações de privacidade.');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authService.deleteAccount();
      toastService.info('Sua conta foi excluída com sucesso.');
      navigate('/');
    } catch {
      toastService.error('Erro ao excluir conta.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Configurações
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gerencie suas preferências de conta, segurança e privacidade.
        </p>
      </div>

      {/* Account Info Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
            Informações da Conta
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Atualize seus dados cadastrais principais.
          </p>
        </div>

        <form onSubmit={handleUpdateAccount} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Nome
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="settings-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="settings-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                E-mail (fixo)
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="settings-email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingAccount}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isUpdatingAccount ? 'Salvando...' : 'Salvar dados'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
            Alterar Senha
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mantenha sua conta segura com uma senha forte.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Senha atual
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Nova senha
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-new-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Confirmar nova senha
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isUpdatingPassword ? 'Atualizando...' : 'Atualizar senha'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <Moon className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Aparência</h3>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Tema Noturno</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Alternar entre o tema claro e escuro em todo o sistema.</p>
          </div>
          
          <button
            type="button"
            onClick={toggleTheme}
            className="relative inline-flex items-center justify-center w-11 h-6 rounded-full bg-slate-200 dark:bg-blue-600 transition-colors focus:outline-none"
          >
            <span
              className={`inline-block w-5 h-5 bg-white rounded-full transition-transform transform ${
                theme === 'dark' ? 'translate-x-2.5' : '-translate-x-2.5'
              } shadow flex items-center justify-center`}
            >
              {theme === 'dark' ? (
                <Moon className="w-3 h-3 text-blue-600" />
              ) : (
                <Sun className="w-3 h-3 text-amber-500" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
            Privacidade & Portfólio Público
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Defina como seu portfólio de certificados pode ser visualizado na internet.
          </p>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Permitir visualização pública do perfil
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quando ativado, qualquer pessoa com o link /u/{user?.username} poderá
              visualizar seus certificados marcados como públicos.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublicProfile}
              onChange={(e) => handleTogglePrivacy(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-slate-300 dark:border-slate-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="bg-rose-50/50 p-6 sm:p-8 rounded-3xl border border-rose-200/70 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-700">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-base font-bold">Zona de Perigo</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Ao excluir sua conta, todos os seus dados cadastrados, certificados
            armazenados e histórico serão removidos permanentemente.
          </p>

          <button
            type="button"
            id="delete-account-btn"
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold rounded-xl transition-colors shrink-0 shadow-xs"
          >
            Excluir minha conta
          </button>
        </div>
      </div>

      {/* Confirm Account Deletion Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Excluir conta permanentemente?"
        message="Tem certeza que deseja excluir sua conta no Certifique-se? Todos os seus certificados e arquivos salvos serão excluídos para sempre."
        confirmLabel="Sim, excluir minha conta"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
