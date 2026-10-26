import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  title = 'Restore Defaults',
  message = 'Are you sure you want to restore default values? This action can be saved to overwrite current settings.',
  confirmText = 'Restore Defaults',
  onConfirm,
  onClose,
  isDangerous = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] shadow-2xl p-6 sm:p-7 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#7C746B] hover:text-[#1A1A1A] hover:bg-[#EFEAE1] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            isDangerous ? 'bg-rose-500/15 text-rose-700 border border-rose-500/30' : 'bg-brass-500/15 text-brass-700 border border-brass-500/30'
          }`}>
            {isDangerous ? <AlertTriangle className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
              {title}
            </h3>
            <p className="text-xs text-[#6B635B] mt-0.5">
              Ram Prasad Agencies • Admin Management
            </p>
          </div>
        </div>

        <p className="text-xs text-[#4A433D] leading-relaxed">
          {message}
        </p>

        <div className="pt-3 border-t border-[#E8E1D5] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4A433D] hover:bg-[#EFEAE1] border border-[#DDD5C7] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm && onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all active:scale-95 ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 shadow-brass-600/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
