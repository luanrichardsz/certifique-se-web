import React from 'react';
import { X } from 'lucide-react';
import { Tag } from '../../types';

interface TagChipProps {
  tag: Tag | string;
  onRemove?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  size?: 'sm' | 'md';
  variant?: 'default' | 'primary' | 'outline';
}

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  onRemove,
  onClick,
  isSelected = false,
  size = 'md',
  variant = 'default',
}) => {
  const tagName = typeof tag === 'string' ? tag : tag.name;

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2.5 py-0.5'
      : 'text-xs sm:text-sm px-3 py-1 font-medium';

  let variantClasses =
    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 border border-slate-200 dark:border-slate-800/60';

  if (variant === 'primary' || isSelected) {
    variantClasses =
      'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100';
  } else if (variant === 'outline') {
    variantClasses =
      'bg-transparent text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:bg-slate-900/50';
  }

  const clickableClasses = onClick ? 'cursor-pointer select-none transition-all' : '';

  return (
    <span
      id={`tag-chip-${tagName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg whitespace-nowrap transition-colors ${sizeClasses} ${variantClasses} ${clickableClasses}`}
    >
      <span>{tagName}</span>
      {onRemove && (
        <button
          type="button"
          id={`tag-remove-${tagName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remover tag ${tagName}`}
          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors focus:outline-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};
