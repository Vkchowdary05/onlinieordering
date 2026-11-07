import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  className,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60"
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative z-10 w-full rounded-2xl bg-white shadow-2xl border border-zinc-300 overflow-hidden max-h-[90vh] flex flex-col',
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-zinc-200 p-6 pb-4">
            <div>
              {title && <h2 className="text-xl font-bold text-black">{title}</h2>}
              {description && (
                <p className="mt-1 text-sm text-zinc-600">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-black"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        )}

        {/* If no title was provided, show a floating close button */}
        {!title && !description && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-white p-2 text-zinc-500 shadow-sm hover:bg-zinc-100 hover:text-black border border-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Content with auto-scroll */}
        <div className="overflow-y-auto p-6 flex-1 text-black">{children}</div>
      </div>
    </div>
  )
}
