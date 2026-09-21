import React, { useEffect, useState } from 'react';
import { toastService, ToastMessage } from '../../services/toast.service';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toastService.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;
        let borderClass = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-lg';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
          borderClass = 'border-emerald-100 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-emerald-900/5 shadow-xl';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
          borderClass = 'border-rose-100 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-rose-900/5 shadow-xl';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
          borderClass = 'border-amber-100 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-amber-900/5 shadow-xl';
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderClass} transition-all duration-300 transform translate-y-0`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
            <button
              id={`toast-close-${toast.id}`}
              onClick={() => toastService.remove(toast.id)}
              aria-label="Fechar notificação"
              className="text-slate-400 hover:text-slate-600 dark:text-slate-400 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
