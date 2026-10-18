import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    error: 'bg-rose-50 border-rose-300 text-rose-900',
    info: 'bg-blue-50 border-blue-300 text-blue-900',
  }[type] || 'bg-slate-50 border-slate-300 text-slate-900';

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type] || Info;

  const iconColors = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    info: 'text-blue-600',
  }[type] || 'text-slate-600';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-md w-full px-4">
      <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl ${bgStyles}`}>
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors}`} />
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {message}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
