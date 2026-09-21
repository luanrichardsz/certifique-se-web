import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/auth.service';
import { certificateService } from '../../services/certificate.service';
import { toastService } from '../../services/toast.service';
import { Certificate, StatSummary } from '../../types';
import { CertificateCard } from '../../components/shared/CertificateCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import {
  Award,
  Building2,
  Tags,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const user = authService.getUser();
  const [stats, setStats] = useState<StatSummary>({
    totalCertificates: 0,
    totalInstitutions: 0,
    totalTags: 0,
    recentCertificates: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await certificateService.getStats();
      setStats(data);
    } catch {
      toastService.error('Não foi possível carregar as informações do dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    return certificateService.subscribe(() => {
      loadDashboardData();
    });
  }, []);

  const handleDeleteConfirm = async () => {
    if (!certToDelete) return;
    setIsDeleting(true);
    try {
      await certificateService.delete(certToDelete.id);
      toastService.success('Certificado removido com sucesso.');
      setCertToDelete(null);
      await loadDashboardData();
    } catch {
      toastService.error('Não foi possível remover o certificado.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Olá, {user?.name?.split(' ')[0] || 'Usuário'}!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Veja e organize seu histórico de certificações acadêmicas e profissionais.
          </p>
        </div>

        <button
          type="button"
          id="dashboard-add-certificate-btn"
          onClick={() => navigate('/certificados/novo')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-98 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Adicionar certificado</span>
        </button>
      </div>

      {/* Stats Summary Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Certificates */}
        <div
          id="stat-card-total-certs"
          onClick={() => navigate('/certificados')}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total de certificados
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              {isLoading ? '...' : stats.totalCertificates}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {stats.totalCertificates === 1 ? 'documento' : 'documentos'}
            </span>
          </div>
        </div>

        {/* Institutions */}
        <div
          id="stat-card-institutions"
          onClick={() => navigate('/certificados')}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Instituições
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              {isLoading ? '...' : stats.totalInstitutions}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {stats.totalInstitutions === 1 ? 'emissora' : 'emissoras'}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div
          id="stat-card-tags"
          onClick={() => navigate('/certificados')}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tags utilizadas
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tags className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              {isLoading ? '...' : stats.totalTags}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {stats.totalTags === 1 ? 'categoria' : 'categorias'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Certificates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Certificados recentes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Últimos certificados adicionados ao seu histórico
            </p>
          </div>

          {stats.totalCertificates > 0 && (
            <button
              type="button"
              id="view-all-certificates-link"
              onClick={() => navigate('/certificados')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>Ver todos ({stats.totalCertificates})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* List / Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-200/60 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : stats.recentCertificates.length === 0 ? (
          <EmptyState
            title="Você ainda não adicionou certificados"
            description="Adicione seu primeiro certificado para começar a organizar seu histórico."
            actionLabel="Adicionar primeiro certificado"
            onAction={() => navigate('/certificados/novo')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.recentCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onDeleteRequest={(c) => setCertToDelete(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!certToDelete}
        title="Excluir certificado?"
        message={`Tem certeza que deseja excluir "${certToDelete?.name}"? Esta ação não poderá ser desfeita.`}
        confirmLabel="Excluir certificado"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCertToDelete(null)}
      />
    </div>
  );
};
