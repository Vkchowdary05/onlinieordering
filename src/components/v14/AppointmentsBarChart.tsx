import React, { useState } from 'react'
import { Calendar } from 'lucide-react'

interface AppointmentsBarChartProps {
  title?: string
  subtitle?: string
}

const DEFAULT_DATA = [
  { month: 'Jan', completed: 42, scheduled: 18 },
  { month: 'Feb', completed: 58, scheduled: 24 },
  { month: 'Mar', completed: 74, scheduled: 32 },
  { month: 'Apr', completed: 68, scheduled: 29 },
  { month: 'May', completed: 85, scheduled: 41 },
  { month: 'Jun', completed: 92, scheduled: 48 },
  { month: 'Jul', completed: 110, scheduled: 55 },
  { month: 'Aug', completed: 98, scheduled: 44 },
  { month: 'Sep', completed: 82, scheduled: 38 },
  { month: 'Oct', completed: 104, scheduled: 51 },
  { month: 'Nov', completed: 125, scheduled: 62 },
  { month: 'Dec', completed: 78, scheduled: 35 },
]

export const AppointmentsBarChart: React.FC<AppointmentsBarChartProps> = ({
  title = 'Appointment Statistics',
  subtitle = 'Monthly patient consultation volume & completion rates',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const maxVal = Math.max(
    ...DEFAULT_DATA.map((d) => Math.max(d.completed, d.scheduled)),
    130
  )

  return (
    <div className="card-v14 p-5 md:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calendar size={18} className="text-black dark:text-white" /> {title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white" />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
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
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-1 bg-black text-white text-[10px] py-1 px-2 rounded-md shadow-md z-20 pointer-events-none whitespace-nowrap">
                  <div>{item.month}: {item.completed} done, {item.scheduled} book</div>
                </div>
              )}

              {/* Bar Group */}
              <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                {/* Completed Bar */}
                <div
                  style={{ height: `${completedHeight}%` }}
                  className={`w-1/2 rounded-t-md ${
                    isHovered
                      ? 'bg-zinc-700 dark:bg-zinc-200'
                      : 'bg-black dark:bg-white'
                  }`}
                />
                {/* Scheduled Bar */}
                <div
                  style={{ height: `${scheduledHeight}%` }}
                  className={`w-1/2 rounded-t-md ${
                    isHovered
                      ? 'bg-zinc-500 dark:bg-zinc-400'
                      : 'bg-zinc-400 dark:bg-zinc-600'
                  }`}
                />
              </div>

              {/* X Axis Label */}
              <span className="text-[11px] font-medium text-zinc-500 group-hover:text-black dark:group-hover:text-white mt-2">
                {item.month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
