import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'info'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-black text-white border border-black',
    secondary: 'bg-zinc-100 text-zinc-900 border border-zinc-300',
    outline: 'border border-zinc-900 text-zinc-900 bg-transparent',
    success: 'bg-zinc-900 text-white border border-black',
    warning: 'bg-zinc-200 text-zinc-900 border border-zinc-400',
    danger: 'bg-black text-white border border-black',
    info: 'bg-zinc-100 text-zinc-900 border border-zinc-300',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}
