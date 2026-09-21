import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from '../../context/RouterContext';
import { certificateService } from '../../services/certificate.service';
import { toastService } from '../../services/toast.service';
import { Certificate, CertificateFilterParams } from '../../types';
import { CertificateCard } from '../../components/shared/CertificateCard';
import { SearchInput } from '../../components/shared/SearchInput';
import { EmptyState } from '../../components/shared/EmptyState';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import {
  Plus,
  Filter,
  LayoutGrid,
  List,
  RotateCcw,
  SlidersHorizontal,
  X,
  ChevronDown,
} from 'lucide-react';

export const CertificateListPage: React.FC = () => {
  const { navigate, queryParams } = useRouter();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(queryParams.q || '');
  const [selectedInstitution, setSelectedInstitution] = useState(queryParams.institution || '');
  const [selectedTag, setSelectedTag] = useState(queryParams.tag || '');
  const [selectedYear, setSelectedYear] = useState(queryParams.year || '');

  // Delete modal state
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const institutionsList = useMemo(() => certificateService.getDistinctInstitutions(), [certificates]);
  const tagsList = useMemo(() => certificateService.getDistinctTags(), [certificates]);
  const yearsList = useMemo(() => certificateService.getDistinctYears(), [certificates]);

  const loadCertificates = async () => {
    setIsLoading(true);
    try {
      const params: CertificateFilterParams = {
        query: searchQuery,
        institution: selectedInstitution,
        tag: selectedTag,
        year: selectedYear,
      };
      const data = await certificateService.getAll(params);
      setCertificates(data);
    } catch {
      toastService.error('Não foi possível carregar os certificados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [searchQuery, selectedInstitution, selectedTag, selectedYear]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedInstitution || selectedTag || selectedYear
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedInstitution('');
    setSelectedTag('');
    setSelectedYear('');
  };

  const handleDeleteConfirm = async () => {
    if (!certToDelete) return;
    setIsDeleting(true);
    try {
      await certificateService.delete(certToDelete.id);
      toastService.success('Certificado removido com sucesso.');
      setCertToDelete(null);
      await loadCertificates();
    } catch {
      toastService.error('Erro ao excluir certificado.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Meus certificados
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize e consulte seus certificados.
          </p>
        </div>

        <button
          type="button"
          id="add-certificate-main-btn"
          onClick={() => navigate('/certificados/novo')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-98 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Adicionar certificado</span>
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Pesquisar por nome, instituição ou tag..."
            />
          </div>

          {/* Desktop Filter Dropdowns */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Institution Filter */}
            <div className="relative">
              <select
                id="filter-institution-select"
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                aria-label="Filtrar por instituição"
                className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer"
              >
                <option value="">Todas instituições</option>
                {institutionsList.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Tag Filter */}
            <div className="relative">
              <select
                id="filter-tag-select"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                aria-label="Filtrar por tag"
                className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer"
              >
                <option value="">Todas as tags</option>
                {tagsList.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                id="filter-year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                aria-label="Filtrar por ano"
                className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer"
              >
                <option value="">Todos os anos</option>
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                id="clear-filters-btn"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar filtros</span>
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle & Layout View Mode */}
          <div className="flex items-center justify-between lg:justify-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/60">
            <button
              type="button"
              id="mobile-filter-drawer-btn"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros {hasActiveFilters && '(Ativos)'}</span>
            </button>

            {/* Layout Mode (Grid vs List) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                id="view-mode-grid"
                onClick={() => setLayoutMode('grid')}
                aria-label="Visualização em grade"
                className={`p-1.5 rounded-lg transition-colors ${
                  layoutMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="view-mode-list"
                onClick={() => setLayoutMode('list')}
                aria-label="Visualização em lista"
                className={`p-1.5 rounded-lg transition-colors ${
                  layoutMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer Accordion */}
        {showMobileFilters && (
          <div className="lg:hidden pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-3 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Instituição
                </label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                >
                  <option value="">Todas instituições</option>
                  {institutionsList.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Tag
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                >
                  <option value="">Todas as tags</option>
                  {tagsList.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Ano
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                >
                  <option value="">Todos os anos</option>
                  {yearsList.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Mostrando{' '}
          <strong className="font-semibold text-slate-800 dark:text-slate-200">
            {certificates.length}
          </strong>{' '}
          {certificates.length === 1 ? 'certificado' : 'certificados'}
        </span>
      </div>

      {/* Content Grid/List */}
      {isLoading ? (
        <div
          className={`grid gap-5 ${
            layoutMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-56 bg-slate-200/60 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon="search"
            title="Nenhum certificado encontrado"
            description="Não encontramos nenhum resultado correspondente aos filtros selecionados. Tente ajustar os termos de busca."
            actionLabel="Limpar filtros"
            onAction={handleClearFilters}
          />
        ) : (
          <EmptyState
            title="Você ainda não adicionou certificados"
            description="Adicione seu primeiro certificado para começar a organizar seu histórico."
            actionLabel="Adicionar primeiro certificado"
            onAction={() => navigate('/certificados/novo')}
          />
        )
      ) : (
        <div
          className={`grid gap-5 ${
            layoutMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              layout={layoutMode}
              onDeleteRequest={(c) => setCertToDelete(c)}
            />
          ))}
        </div>
      )}

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!certToDelete}
        title="Excluir certificado?"
        message={`Esta ação não poderá ser desfeita. O certificado "${certToDelete?.name}" será removido permanentemente.`}
        confirmLabel="Excluir certificado"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCertToDelete(null)}
      />
    </div>
  );
};
