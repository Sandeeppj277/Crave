import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#faf6f1] rounded-[32px] shadow-[18px_24px_48px_rgba(168,126,92,0.22)] border border-white/60 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-black text-stone-900 mb-1">{title}</h3>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 clay-btn-secondary text-xs font-black"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-[4px_6px_14px_rgba(225,29,72,0.35)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{loading ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
