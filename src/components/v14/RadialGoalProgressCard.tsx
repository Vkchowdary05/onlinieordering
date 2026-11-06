import React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Plus } from 'lucide-react'

interface RadialGoalProgressCardProps {
  title: string
  subtitle: string
  current: string
  target: string
  percentage: number
  dateBadge: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  onAction?: () => void
}

export const RadialGoalProgressCard: React.FC<RadialGoalProgressCardProps> = ({
  title,
  subtitle,
  current,
  target,
  percentage,
  dateBadge,
  icon: Icon,
  iconColor,
  iconBg,
  onAction,
}) => {
  // SVG circular calculations
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-[#181822] p-4 sm:p-5 rounded-2xl md:rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(100,90,140,0.05)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl ${iconBg} ${iconColor}`}>
          <Icon size={16} />
        </div>
        <span className="text-[10px] font-semibold tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-full">
          {dateBadge}
        </span>
      </div>

      {/* Circular Progress Ring */}
      <div className="my-3 flex flex-col items-center justify-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
            <circle
              cx="38"
              cy="38"
              r={radius}
              stroke="currentColor"
              strokeWidth="5.5"
              className="text-zinc-100 dark:text-zinc-800"
              fill="transparent"
            />
            <motion.circle
              cx="38"
              cy="38"
              r={radius}
              stroke="#FF5A36"
              strokeWidth="5.5"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {percentage}%
            </span>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 mt-1 uppercase font-semibold tracking-wider">
          {subtitle}
        </p>
      </div>

      {/* Goal Details */}
      <div className="text-center mt-1">
        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
          {title}
        </h4>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{current}</span> of {target}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onAction}
        className="mt-3.5 w-full py-1.5 px-2 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700/80 hover:border-[#FF5A36] text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-[#FF5A36] flex items-center justify-center gap-1 transition-all"
      >
        <Plus size={12} /> Update Metric
      </button>
    </motion.div>
  )
}
