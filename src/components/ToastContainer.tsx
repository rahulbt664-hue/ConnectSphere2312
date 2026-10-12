import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
        };

        const bg = {
          success: 'bg-slate-900/95 border-emerald-500/30 text-slate-100 shadow-emerald-950/20',
          error: 'bg-slate-900/95 border-rose-500/30 text-slate-100 shadow-rose-950/20',
          info: 'bg-slate-900/95 border-indigo-500/30 text-slate-100 shadow-indigo-950/20',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${bg[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium leading-snug">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
