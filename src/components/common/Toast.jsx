import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short max-w-md w-full px-4">
      <div className={`flex items-center space-x-3 p-4 rounded-xl shadow-luxury backdrop-blur-md border ${
        isSuccess 
          ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300' 
          : 'bg-slate-900/95 border-amber-500/40 text-amber-300'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        )}
        <p className="text-sm font-medium leading-relaxed flex-1 text-slate-100">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
