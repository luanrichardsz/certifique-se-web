import React from 'react';
import { Award, Plus, FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: 'award' | 'search';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Você ainda não adicionou certificados',
  description = 'Adicione seu primeiro certificado para começar a organizar seu histórico profissional e acadêmico.',
  actionLabel = 'Adicionar primeiro certificado',
  onAction,
  icon = 'award',
}) => {
  return (
    <div
      id="empty-state-container"
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl my-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-inner">
        {icon === 'search' ? (
          <FolderSearch className="w-8 h-8 stroke-[1.75]" />
        ) : (
          <Award className="w-8 h-8 stroke-[1.75]" />
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {onAction && actionLabel && (
        <button
          type="button"
          id="empty-state-action-btn"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-sm font-medium rounded-xl transition-all shadow-sm shadow-blue-200 active:scale-98 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
