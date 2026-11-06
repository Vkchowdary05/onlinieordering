import React, { useState } from 'react'
import { Video, Bell, ShieldAlert, FileCheck2, Sliders } from 'lucide-react'

export const HospitalControlsCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [telehealthEnabled, setTelehealthEnabled] = useState(true)
  const [smsReminders, setSmsReminders] = useState(true)
  const [emergencyTriage, setEmergencyTriage] = useState(true)
  const [insurancePreAuth, setInsurancePreAuth] = useState(false)
  const [dailyCapacity, setDailyCapacity] = useState(120)

  return (
    <div
      className={`bg-white dark:bg-[#181822] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(100,90,140,0.05)] ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sliders size={18} className="text-[#FF5A36]" /> Clinic Controls & Policies
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hospital scheduling rules and patient notifications
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
          Active Policies
        </span>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        {/* Toggle 1 */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Video size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Online Telehealth Visits
              </p>
              <p className="text-[11px] text-zinc-400">
                Generate secure video consultation rooms
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTelehealthEnabled(!telehealthEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              telehealthEnabled ? 'bg-[#FF5A36]' : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                telehealthEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2 */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Bell size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Automated SMS & Email Reminders
              </p>
              <p className="text-[11px] text-zinc-400">
                Send check-in alerts 24h & 2h before visit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSmsReminders(!smsReminders)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              smsReminders ? 'bg-[#FF5A36]' : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                smsReminders ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3 */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <ShieldAlert size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Emergency Overbooking Buffer
              </p>
              <p className="text-[11px] text-zinc-400">
                Reserve 15% urgent walk-in emergency slots
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEmergencyTriage(!emergencyTriage)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              emergencyTriage ? 'bg-[#FF5A36]' : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                emergencyTriage ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 4 */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <FileCheck2 size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Instant Insurance Pre-Verification
              </p>
              <p className="text-[11px] text-zinc-400">
                Auto-validate patient policy copay eligibility
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setInsurancePreAuth(!insurancePreAuth)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              insurancePreAuth ? 'bg-[#FF5A36]' : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                insurancePreAuth ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Red Coral Slider - Exactly matching Screenshot 2 */}
      <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-500">
            Daily Hospital Patient Cap
          </span>
          <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
            {dailyCapacity} Patients / Day
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="200"
          value={dailyCapacity}
          onChange={(e) => setDailyCapacity(Number(e.target.value))}
          className="w-full accent-[#FF5A36] h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 font-medium">
          <span>Min: 50/day</span>
          <span className="text-[#FF5A36] font-semibold">
            {Math.round((dailyCapacity / 200) * 100)}% Max Capacity
          </span>
          <span>Max: 200/day</span>
        </div>
      </div>
    </div>
  )
}
