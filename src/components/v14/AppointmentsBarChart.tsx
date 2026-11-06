import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

interface MonthlyData {
  month: string
  completed: number
  scheduled: number
}

const DEFAULT_DATA: MonthlyData[] = [
  { month: 'Jan', completed: 42, scheduled: 12 },
  { month: 'Feb', completed: 58, scheduled: 24 },
  { month: 'Mar', completed: 75, scheduled: 32 },
  { month: 'Apr', completed: 92, scheduled: 48 },
  { month: 'May', completed: 68, scheduled: 28 },
  { month: 'Jun', completed: 84, scheduled: 38 },
  { month: 'Jul', completed: 62, scheduled: 20 },
  { month: 'Aug', completed: 95, scheduled: 52 },
]

export const AppointmentsBarChart: React.FC<{
  title?: string
  subtitle?: string
  className?: string
}> = ({
  title = 'Appointment Trends & Volume',
  subtitle = 'Monthly completed vs scheduled consultations',
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const maxVal = 100

  return (
    <div
      className={`bg-white dark:bg-[#181822] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(100,90,140,0.05)] ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calendar size={18} className="text-[#FF5A36]" /> {title}
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-200" />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Scheduled</span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-44 md:h-48 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-1">
        {DEFAULT_DATA.map((item, idx) => {
          const completedHeight = (item.completed / maxVal) * 100
          const scheduledHeight = (item.scheduled / maxVal) * 100
          const isHovered = hoveredIndex === idx

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-1 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded-md shadow-md z-20 pointer-events-none whitespace-nowrap"
                >
                  <div>{item.month}: {item.completed} done, {item.scheduled} book</div>
                </motion.div>
              )}

              {/* Bar Group */}
              <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                {/* Dark Completed Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${completedHeight}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.04 }}
                  className={`w-1/2 rounded-t-md transition-colors ${
                    isHovered
                      ? 'bg-zinc-700 dark:bg-white'
                      : 'bg-zinc-900 dark:bg-zinc-300'
                  }`}
                />
                {/* Coral Scheduled Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${scheduledHeight}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.04 + 0.1 }}
                  className={`w-1/2 rounded-t-md transition-colors ${
                    isHovered ? 'bg-[#FF3E16]' : 'bg-[#FF5A36]'
                  }`}
                />
              </div>

              {/* X Axis Label */}
              <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 mt-2 transition-colors">
                {item.month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
