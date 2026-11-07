import React from 'react'
import { Plus } from 'lucide-react'

interface RadialGoalProgressCardProps {
  title: string
  subtitle: string
  current: string | number
  target: string | number
  percentage: number
  color?: string
  onAction?: () => void
}

export const RadialGoalProgressCard: React.FC<RadialGoalProgressCardProps> = ({
  title,
  subtitle,
  current,
  target,
  percentage,
  onAction,
}) => {
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="card-v14 p-4 md:p-5 flex flex-col justify-between">
      {/* Badge Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          Wellness Goal
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700">
          Target Tracking
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
              className="text-zinc-200 dark:text-zinc-800"
              fill="transparent"
            />
            <circle
              cx="38"
              cy="38"
              r={radius}
              stroke="currentColor"
              strokeWidth="5.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="text-black dark:text-white"
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
        <p className="text-[11px] text-zinc-500 mt-0.5">
          <span className="font-semibold text-black dark:text-white">{current}</span> of {target}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onAction}
        className="mt-3.5 w-full py-1.5 px-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white text-[11px] font-medium text-black dark:text-white flex items-center justify-center gap-1"
      >
        <Plus size={12} /> Update Metric
      </button>
    </div>
  )
}
