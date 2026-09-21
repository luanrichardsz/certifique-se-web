import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { certificateService } from '../../services/certificate.service';
import { authService } from '../../services/auth.service';
import { Certificate, User } from '../../types';
import { CertificateCard } from '../../components/shared/CertificateCard';
import { TagChip } from '../../components/shared/TagChip';
import {
  Award,
  ShieldCheck,
  Building2,
  Calendar,
  ExternalLink,
  Lock,
  ArrowLeft,
  X,
  FileText,
  Clock,
  Share2,
  Check,
} from 'lucide-react';

export const PublicProfilePage: React.FC = () => {
  const { params, navigate } = useRouter();
  const username = params.username || 'usuario';

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const currentUser = authService.getUser();

      if (currentUser && (currentUser.username === username || username === 'anacarolina')) {
        setUserProfile(currentUser);
      } else {
        setUserProfile({
          id: 'pub_user',
          name: username.charAt(0).toUpperCase() + username.slice(1),
          username: username,
          email: `${username}@exemplo.com`,
          headline: 'Profissional com certificações comprovadas',
          bio: 'Histórico e conquistas acadêmicas e profissionais centralizados no Certifique-se.',
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=4f46e5`,
          isPublicProfileEnabled: true,
        });
      }

      const publicCerts = await certificateService.getPublicCertificatesByUsername(username);
      setCertificates(publicCerts);
      setIsLoading(false);
    };

    loadData();
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      if (y && m && d) return `${d}/${m}/${y}`;
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Certifique-se</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-blue-100 ring-4 ring-slate-100 overflow-hidden shrink-0 shadow-sm">
            {userProfile?.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-blue-700">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                    {userProfile?.name}
                  </h1>
                  <span
                    title="Portfólio verificado"
                    className="text-blue-600 bg-blue-50 p-1 rounded-full"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  @{userProfile?.username}
                </p>
              </div>

              {/* Share button */}
              <button
                type="button"
                id="share-public-profile-btn"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors self-center sm:self-start"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartilhar portfólio</span>
                  </>
                )}
              </button>
            </div>

            {userProfile?.headline && (
              <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
                {userProfile.headline}
              </p>
            )}

            {userProfile?.bio && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                {userProfile.bio}
              </p>
            )}

            {/* Quick Stat Pill */}
            <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                {certificates.length}{' '}
                {certificates.length === 1 ? 'certificado público' : 'certificados públicos'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Certificações & Conquistas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Histórico acadêmico e profissional publicado pelo usuário
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 bg-slate-200/60 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
            <Lock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nenhum certificado público disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-blue-300 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800/60 overflow-hidden">
                  {cert.thumbnailUrl || cert.fileUrl ? (
                    <img
                      src={cert.thumbnailUrl || cert.fileUrl}
                      alt={cert.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 text-blue-400">
                      <Award className="w-12 h-12 stroke-[1.25]" />
                      <span className="text-xs mt-1 font-medium text-slate-400">
                        Certificado Digital
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900/95 backdrop-blur-xs text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      {cert.institution}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {cert.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Concluído em: {formatDate(cert.completionDate)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-1.5">
                    {cert.tags.slice(0, 3).map((tag, idx) => (
                      <TagChip key={tag.id || idx} tag={tag} size="sm" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Public Certificate View Modal */}
      {selectedCert && (
        <div
          id="public-cert-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 dark:bg-slate-50/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800/60 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  <Building2 className="w-3.5 h-3.5" />
                  {selectedCert.institution}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mt-2">
                  {selectedCert.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Concluído em {formatDate(selectedCert.completionDate)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                aria-label="Fechar"
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Preview Frame */}
            <div className="my-5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/90 overflow-hidden flex items-center justify-center min-h-[220px]">
              {selectedCert.fileUrl ? (
                <img
                  src={selectedCert.fileUrl}
                  alt={selectedCert.name}
                  className="w-full h-auto max-h-[380px] object-contain"
                />
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <Award className="w-12 h-12 text-blue-500 mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-sm font-medium">Documento registrado e verificado</p>
                </div>
              )}
            </div>

            {selectedCert.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {selectedCert.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {selectedCert.tags.map((tag, idx) => (
                <TagChip key={tag.id || idx} tag={tag} size="sm" />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              {selectedCert.credentialUrl ? (
                <a
                  href={selectedCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Verificar na instituição
                </a>
              ) : (
                <span className="text-xs text-slate-400">Verificado pelo Certifique-se</span>
              )}

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
