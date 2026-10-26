import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-xl ${
          isSuccess
            ? 'bg-white border-emerald-300 text-[#1A1A1A] shadow-emerald-600/10'
            : isError
            ? 'bg-white border-rose-300 text-[#1A1A1A] shadow-rose-600/10'
            : 'bg-white border-[#DDD5C7] text-[#1A1A1A]'
        }`}
      >
        <div className="mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-brass-700" />}
        </div>
        <div className="flex-1 pr-2">
          {toast.title && <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">{toast.title}</h4>}
          <p className="text-xs text-[#5A524A] mt-0.5">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-[#7C746B] hover:text-[#1A1A1A] transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
