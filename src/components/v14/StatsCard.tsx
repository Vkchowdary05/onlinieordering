import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  icon?: LucideIcon
  className?: string
  onClick?: () => void
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend = 'up',
  subtitle,
  icon: Icon,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-zinc-950 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
            {title}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            {value}
          </h2>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white border border-zinc-200 dark:border-zinc-800">
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {change && (
          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-black bg-zinc-100 dark:text-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            {trend === 'up' && <ArrowUpRight size={13} />}
            {trend === 'down' && <ArrowDownRight size={13} />}
            {change}
          </span>
        )}
        {subtitle && (
          <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-medium truncate max-w-[150px]">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Featured Dark Hero Card (Monochrome Solid Black)
 */
export const CoralStatsCard: React.FC<{
  title: string
  value: string | number
  badgeText?: string
  subtitle?: string
  icon?: LucideIcon
  className?: string
  onClick?: () => void
}> = ({
  title,
  value,
  badgeText = '+7% This month',
  subtitle,
  icon: Icon,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-coral p-5 md:p-6 text-white cursor-pointer relative overflow-hidden bg-black dark:bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-3xl ${className}`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {title}
          </p>
          {Icon && (
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
              <Icon size={18} />
            </div>
          )}
        </div>

        <div className="mt-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">{value}</h2>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          {badgeText && (
            <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full bg-white text-black font-bold">
              <ArrowUpRight size={12} /> {badgeText}
            </span>
          )}
          {subtitle && <span className="text-zinc-400 text-[11px]">{subtitle}</span>}
        </div>
      </div>
    </div>
  )
}
