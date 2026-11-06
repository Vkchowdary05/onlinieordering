import React from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`bg-white dark:bg-[#181822] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(100,90,140,0.05)] cursor-pointer transition-all ${className}`}
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
          <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {change && (
          <span
            className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${
              trend === 'up'
                ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
                : trend === 'down'
                ? 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
                : 'text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            {trend === 'up' && <ArrowUpRight size={13} />}
            {trend === 'down' && <ArrowDownRight size={13} />}
            {change}
          </span>
        )}
        {subtitle && (
          <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-medium truncate max-w-[150px]">
            {subtitle}
          </span>
        )}
      </div>
    </motion.div>
  )
}

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
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`card-coral p-5 md:p-6 text-white cursor-pointer relative overflow-hidden transition-all ${className}`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
            {title}
          </p>
          {Icon && (
            <div className="p-2 rounded-xl bg-white/20 text-white backdrop-blur-sm">
              <Icon size={18} />
            </div>
          )}
        </div>

        <div className="mt-2">
          <h2 className="text-3xl font-extrabold tracking-tight">{value}</h2>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          {badgeText && (
            <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
              <ArrowUpRight size={12} /> {badgeText}
            </span>
          )}
          {subtitle && <span className="text-white/70 text-[11px]">{subtitle}</span>}
        </div>
      </div>

      {/* Subtle background ambient graphic */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
    </motion.div>
  )
}
