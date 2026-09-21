import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { certificateService } from '../../services/certificate.service';
import { toastService } from '../../services/toast.service';
import { Certificate } from '../../types';
import { TagChip } from '../../components/shared/TagChip';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  Award,
  Download,
  FileText,
  ShieldCheck,
  Globe,
  Lock,
} from 'lucide-react';

export const CertificateDetailsPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const certificateId = params.id;

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCertificate = async () => {
    if (!certificateId) return;
    setIsLoading(true);
    try {
      const data = await certificateService.getById(certificateId);
      if (data) {
        setCertificate(data);
      } else {
        toastService.error('Certificado não encontrado.');
        navigate('/certificados');
      }
    } catch {
      toastService.error('Erro ao carregar detalhes do certificado.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, [certificateId]);

  const handleDeleteConfirm = async () => {
    if (!certificate) return;
    setIsDeleting(true);
    try {
      await certificateService.delete(certificate.id);
      toastService.success('Certificado removido com sucesso.');
      setIsDeleteModalOpen(false);
      navigate('/certificados');
    } catch {
      toastService.error('Não foi possível excluir o certificado.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        const monthNames = [
          'janeiro',
          'fevereiro',
          'março',
          'abril',
          'maio',
          'junho',
          'julho',
          'agosto',
          'setembro',
          'outubro',
          'novembro',
          'dezembro',
        ];
        const mIdx = parseInt(month, 10) - 1;
        return `${parseInt(day, 10)} de ${monthNames[mIdx] || month} de ${year}`;
      }
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-6 animate-pulse">
        <div className="h-6 bg-slate-200 w-24 rounded-lg"></div>
        <div className="h-40 bg-slate-200 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (!certificate) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/certificados')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Meus Certificados</span>
        </button>

        {/* Visibility Badge */}
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
            certificate.isPublic !== false
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {certificate.isPublic !== false ? (
            <>
              <Globe className="w-3.5 h-3.5" />
              <span>Público no portfólio</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Privado</span>
            </>
          )}
        </span>
      </div>

      {/* Main Details Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
              <Building2 className="w-4 h-4" />
              <span>{certificate.institution}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight break-words">
              {certificate.name}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                Concluído em {formatDate(certificate.completionDate)}
              </span>

              {certificate.workloadHours && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Carga horária: {certificate.workloadHours} horas
                  </span>
                </>
              )}

              {certificate.credentialCode && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    ID: {certificate.credentialCode}
                  </span>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {certificate.tags.map((tag, idx) => (
                <TagChip key={tag.id || idx} tag={tag} />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/60">
            <button
              type="button"
              id="details-edit-btn"
              onClick={() => navigate(`/certificados/${certificate.id}/editar`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <Edit2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Editar</span>
            </button>

            <button
              type="button"
              id="details-delete-btn"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 text-xs sm:text-sm font-semibold rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Excluir</span>
            </button>
          </div>
        </div>

        {certificate.description && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Sobre a certificação
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {certificate.description}
            </p>
          </div>
        )}
      </div>

      {/* Large Visual Certificate Frame */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
              Visualização do Documento
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {certificate.fileUrl && (
              <a
                href={certificate.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={certificate.fileName || 'certificado'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar</span>
              </a>
            )}

            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Validar na emissora</span>
              </a>
            )}
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="w-full rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 overflow-hidden flex items-center justify-center min-h-[350px] p-4 sm:p-6">
          {certificate.fileUrl ? (
            <img
              src={certificate.fileUrl}
              alt={certificate.name}
              className="max-h-[600px] w-auto max-w-full object-contain rounded-xl shadow-md"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400">
              <FileText className="w-16 h-16 text-slate-400 stroke-[1.25] mb-3" />
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                {certificate.fileName || 'Documento registrado'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {certificate.fileSize || 'Preservado no Certifique-se'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Excluir certificado?"
        message="Esta ação não poderá ser desfeita. O documento e suas informações serão removidos permanentemente."
        confirmLabel="Excluir certificado"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
