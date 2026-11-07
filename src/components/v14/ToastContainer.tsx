import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMediCare()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-950 text-black dark:text-white border border-zinc-300 dark:border-zinc-800 shadow-xl"
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 size={18} className="text-black dark:text-white" />
              )}
              {toast.type === 'error' && (
                <AlertCircle size={18} className="text-black dark:text-white" />
              )}
              {toast.type === 'info' && (
                <Info size={18} className="text-zinc-600 dark:text-zinc-300" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-black dark:hover:text-white shrink-0 p-1 rounded-lg"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
