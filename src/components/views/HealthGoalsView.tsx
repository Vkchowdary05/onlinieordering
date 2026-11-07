import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Activity,
  Droplet,
  Flame,
  CheckCircle2,
  Plus,
  Watch,
  BellRing,
  Sparkles,
} from 'lucide-react'
import { RadialGoalProgressCard } from '../v14/RadialGoalProgressCard'
import { useMediCare } from '../../context/MediCareContext'

export const HealthGoalsView: React.FC = () => {
  const { addToast } = useMediCare()
  const [smartwatchSync, setSmartwatchSync] = useState(true)
  const [autoLabSync, setAutoLabSync] = useState(true)
  const [dailyPrompt, setDailyPrompt] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header - Exactly matching Screenshot 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Heart className="text-[#000000]" /> Health & Recovery Milestones
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Set clinical targets for the biomarkers that matter — and monitor your wellness progress.
          </p>
        </div>

        <button
          onClick={() =>
            addToast('New Milestone', 'Milestone configuration wizard launched.', 'info')
          }
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Plus size={14} /> New Goal
        </button>
      </div>

      {/* Top Grid: Left Chart + Right Auto-Track - Matching Screenshot 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Total Wellness Saved / Achieved */}
        <div className="lg:col-span-8 bg-white dark:bg-[#181822] p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Overall Clinical Compliance
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  86.4%
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  +12% more than last quarter
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-zinc-400">Monthly contributions</span>
          </div>

          {/* Bar Chart Simulation matching Screenshot 3 */}
          <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { m: 'Nov', v: 40 },
              { m: 'Dec', v: 55 },
              { m: 'Jan', v: 62 },
              { m: 'Feb', v: 75 },
              { m: 'Mar', v: 88 },
              { m: 'Apr', v: 96, coral: true },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  
                  animate={{ height: `${col.v}%` }}
                  
                  className={`w-full max-w-[36px] rounded-t-lg ${
                    col.coral ? 'bg-[#000000]' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
                <span className="text-[11px] text-zinc-400 font-medium">{col.m}</span>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-zinc-500">
                <strong className="text-zinc-900 dark:text-zinc-100">86%</strong> of 12 health
                milestones across 5 protocols
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                
                
                
                className="h-full bg-[#000000] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Right Card: Auto-sync Toggles - Matching Screenshot 3 */}
        <div className="lg:col-span-4 bg-white dark:bg-[#181822] p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Auto-Telemetry Sync
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                LIVE
              </span>
            </div>

            <div className="space-y-4">
              {/* Row 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    <Watch size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Smartwatch Wearable
                    </p>
                    <p className="text-[10px] text-zinc-400">Stream continuous heart rate</p>
                  </div>
                </div>
                <button
                  onClick={() => setSmartwatchSync(!smartwatchSync)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    smartwatchSync ? 'bg-[#000000]' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                      smartwatchSync ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Auto-Lab Ingestion
                    </p>
                    <p className="text-[10px] text-zinc-400">Sync hospital pathology feeds</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoLabSync(!autoLabSync)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    autoLabSync ? 'bg-[#000000]' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                      autoLabSync ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    <BellRing size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Daily 09:00 Vitals Prompt
                    </p>
                    <p className="text-[10px] text-zinc-400">Push reminder to log BP & glucose</p>
                  </div>
                </div>
                <button
                  onClick={() => setDailyPrompt(!dailyPrompt)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    dailyPrompt ? 'bg-[#000000]' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                      dailyPrompt ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
            Encrypted HIPAA-compliant biometric transmission.
          </div>
        </div>
      </div>

      {/* Bottom 5 Radial Progress Cards - Exact replica of Screenshot 3 Bottom Row */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 px-1">
          Active Biomarker Recovery Targets
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <RadialGoalProgressCard
            title="Blood Pressure"
            subtitle="Optimal Target"
            current="118/76"
            target="120/80"
            percentage={74}
            dateBadge="Nov 2026"
            icon={Heart}
            iconColor="text-[#000000]"
            iconBg="bg-[#F4F4F5]"
            onAction={() => addToast('Vitals', 'Logged Blood Pressure reading: 118/76 mmHg', 'success')}
          />

          <RadialGoalProgressCard
            title="Cardio Rehab"
            subtitle="Exercise Sessions"
            current="16 sessions"
            target="25 sessions"
            percentage={64}
            dateBadge="Q4 2026"
            icon={Activity}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
            onAction={() => addToast('Vitals', 'Rehab session registered.', 'success')}
          />

          <RadialGoalProgressCard
            title="Annual Lab Work"
            subtitle="Diagnostic Panel"
            current="5 of 8"
            target="8 tests"
            percentage={63}
            dateBadge="Dec 2026"
            icon={Droplet}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
            onAction={() => addToast('Vitals', 'Lab test results updated.', 'success')}
          />

          <RadialGoalProgressCard
            title="Spine & Joint PT"
            subtitle="Mobility Rehab"
            current="2 of 6"
            target="6 weeks"
            percentage={26}
            dateBadge="Jan 2027"
            icon={Flame}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
            onAction={() => addToast('Vitals', 'Physical therapy session marked complete.', 'success')}
          />

          <RadialGoalProgressCard
            title="Vaccination Roster"
            subtitle="Immunization"
            current="4 of 5"
            target="5 vaccines"
            percentage={80}
            dateBadge="May 2026"
            icon={CheckCircle2}
            iconColor="text-rose-600"
            iconBg="bg-rose-50"
            onAction={() => addToast('Vitals', 'Booster vaccination recorded.', 'success')}
          />
        </div>
      </div>
    </div>
  )
}
