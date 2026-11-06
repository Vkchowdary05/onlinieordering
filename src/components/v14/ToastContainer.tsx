import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMediCare()

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto bg-white dark:bg-[#181824] p-4 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-white/10 flex items-start gap-3 relative overflow-hidden"
          >
            {/* Type border indicator */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${
                toast.type === 'success'
                  ? 'bg-emerald-500'
                  : toast.type === 'error'
                  ? 'bg-[#FF5A36]'
                  : 'bg-indigo-500'
              }`}
            />

            <div className="mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 size={18} className="text-emerald-500" />
              )}
              {toast.type === 'error' && (
                <AlertCircle size={18} className="text-[#FF5A36]" />
              )}
              {toast.type === 'info' && <Info size={18} className="text-indigo-500" />}
            </div>

            <div className="flex-1 pr-2">
              <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {toast.title}
              </h5>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
