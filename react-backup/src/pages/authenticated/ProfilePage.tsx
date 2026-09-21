import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import { certificateService } from '../../services/certificate.service';
import { toastService } from '../../services/toast.service';
import { User } from '../../types';
import {
  User as UserIcon,
  Mail,
  Award,
  ExternalLink,
  Edit2,
  Check,
  Share2,
  Calendar,
  Save,
  X,
  ShieldCheck,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { navigate } = useRouter();
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [certCount, setCertCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit fields
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = authService.getUser();
    setUser(u);
    if (u) {
      setName(u.name);
      setHeadline(u.headline || '');
      setBio(u.bio || '');
      setAvatarUrl(u.avatarUrl || '');
    }

    const loadCount = async () => {
      const all = await certificateService.getAll();
      setCertCount(all.length);
    };
    loadCount();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toastService.warning('Selecione um arquivo de imagem válido.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyPublicLink = () => {
    if (!user) return;
    const origin = window.location.origin;
    const url = `${origin}/#/u/${user.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toastService.info('Link do portfólio copiado para a área de transferência!');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toastService.warning('O nome não pode ficar vazio.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await authService.updateProfile({
        name: name.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl,
      });

      if (res.success && res.user) {
        setUser(res.user);
        setIsEditing(false);
        toastService.success('Perfil atualizado com sucesso.');
      } else {
        toastService.error('Erro ao atualizar perfil.');
      }
    } catch {
      toastService.error('Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-blue-100 ring-4 ring-blue-50 overflow-hidden shrink-0 shadow-xs">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-blue-700">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            {/* User Meta */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  {user.name}
                </h2>
                <span
                  title="Usuário Verificado"
                  className="text-blue-600 bg-blue-50 p-1 rounded-full"
                >
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                @{user.username} • {user.email}
              </p>

              {user.headline && (
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium pt-1">
                  {user.headline}
                </p>
              )}

              {user.bio && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed pt-1">
                  {user.bio}
                </p>
              )}

              <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg">
                  <Award className="w-3.5 h-3.5" />
                  {certCount} {certCount === 1 ? 'certificado cadastrado' : 'certificados cadastrados'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              id="edit-profile-btn"
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <Edit2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>{isEditing ? 'Cancelar edição' : 'Editar perfil'}</span>
            </button>

            <button
              type="button"
              id="profile-share-link-btn"
              onClick={handleCopyPublicLink}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-xl transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Link copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Portfólio público</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form Container */}
      {isEditing && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Editar informações do perfil
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-400 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <UserIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start gap-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Foto do perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Alterar foto
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-profile-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Nome completo
              </label>
              <input
                id="edit-profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="edit-profile-headline"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Título / Especialidade
              </label>
              <input
                id="edit-profile-headline"
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ex: Desenvolvedor Back-end Java & Spring Boot"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="edit-profile-bio"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Apresentação / Bio
              </label>
              <textarea
                id="edit-profile-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Breve resumo da sua trajetória profissional..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar perfil'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Public Link Card Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
              Seu Portfólio Público
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compartilhe seus certificados organizados com recrutadores e clientes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/u/${user.username}`)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
          >
            <span>Visualizar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <code className="font-mono text-slate-700 dark:text-slate-300 break-all">
            {window.location.origin}/#/u/{user.username}
          </code>

          <button
            type="button"
            onClick={handleCopyPublicLink}
            className="self-start sm:self-auto shrink-0 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            {copied ? 'Copiado!' : 'Copiar URL'}
          </button>
        </div>
      </div>
    </div>
  );
};
