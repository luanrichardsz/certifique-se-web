import React, { useState, useRef, useEffect } from 'react';
import { Certificate } from '../../types';
import { TagChip } from './TagChip';
import {
  Calendar,
  Building2,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Award,
  FileText,
  Clock,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

interface CertificateCardProps {
  certificate: Certificate;
  onDeleteRequest?: (certificate: Certificate) => void;
  layout?: 'grid' | 'list';
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onDeleteRequest,
  layout = 'grid',
}) => {
  const { navigate } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const handleCardClick = () => {
    navigate(`/certificados/${certificate.id}`);
  };

  if (layout === 'list') {
    return (
      <div
        id={`certificate-row-${certificate.id}`}
        onClick={handleCardClick}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-blue-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 flex items-center justify-center shrink-0 overflow-hidden text-blue-600 group-hover:scale-105 transition-transform">
            {certificate.thumbnailUrl || certificate.fileUrl ? (
              <img
                src={certificate.thumbnailUrl || certificate.fileUrl}
                alt={certificate.name}
                className="w-full h-full object-cover"
              />
            ) : certificate.fileType === 'pdf' ? (
              <FileText className="w-6 h-6 text-rose-500" />
            ) : (
              <Award className="w-6 h-6 text-blue-600" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50 truncate group-hover:text-blue-600 transition-colors">
                {certificate.name}
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {certificate.institution}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Concluído em: {formatDate(certificate.completionDate)}
              </span>
              {certificate.workloadHours && (
                <>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {certificate.workloadHours}h
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
          <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
            {certificate.tags.slice(0, 3).map((tag, idx) => (
              <TagChip key={tag.id || idx} tag={tag} size="sm" />
            ))}
            {certificate.tags.length > 3 && (
              <span className="text-xs text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                +{certificate.tags.length - 3}
              </span>
            )}
          </div>

          <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              id={`cert-menu-btn-${certificate.id}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Ações do certificado"
              className="p-2 text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div
                id={`cert-menu-dropdown-${certificate.id}`}
                className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800/60 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  type="button"
                  id={`action-view-${certificate.id}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/certificados/${certificate.id}`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                  Visualizar detalhes
                </button>
                <button
                  type="button"
                  id={`action-edit-${certificate.id}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/certificados/${certificate.id}/editar`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-slate-400" />
                  Editar certificado
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800/60" />
                <button
                  type="button"
                  id={`action-delete-${certificate.id}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onDeleteRequest) onDeleteRequest(certificate);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`certificate-card-${certificate.id}`}
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-blue-300 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Visual Header / Thumbnail banner */}
      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800/60 overflow-hidden">
        {certificate.thumbnailUrl || certificate.fileUrl ? (
          <img
            src={certificate.thumbnailUrl || certificate.fileUrl}
            alt={certificate.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 text-blue-400">
            <Award className="w-12 h-12 stroke-[1.25] text-blue-400 mb-1" />
            <span className="text-xs font-medium text-slate-400">Certificado Digital</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900/95 backdrop-blur-xs text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs border border-white/40">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            {certificate.institution}
          </span>
        </div>

        {/* Dropdown Menu Button */}
        <div
          className="absolute top-3 right-3"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            id={`card-menu-btn-${certificate.id}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Opções"
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900/90 hover:bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 shadow-xs flex items-center justify-center transition-all backdrop-blur-xs"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div
              id={`card-menu-dropdown-${certificate.id}`}
              className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800/60 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150"
            >
              <button
                type="button"
                id={`card-action-view-${certificate.id}`}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/certificados/${certificate.id}`);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4 text-slate-400" />
                Visualizar detalhes
              </button>
              <button
                type="button"
                id={`card-action-edit-${certificate.id}`}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/certificados/${certificate.id}/editar`);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-slate-400" />
                Editar certificado
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800/60" />
              <button
                type="button"
                id={`card-action-delete-${certificate.id}`}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onDeleteRequest) onDeleteRequest(certificate);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                Excluir certificado
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3
            id={`certificate-title-${certificate.id}`}
            className="text-base font-semibold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 transition-colors line-clamp-1"
            title={certificate.name}
          >
            {certificate.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Concluído em: {formatDate(certificate.completionDate)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-1.5">
          {certificate.tags.slice(0, 3).map((tag, idx) => (
            <TagChip key={tag.id || idx} tag={tag} size="sm" />
          ))}
          {certificate.tags.length > 3 && (
            <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
              +{certificate.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
