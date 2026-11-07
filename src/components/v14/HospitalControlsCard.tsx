import React, { useState } from 'react'
import { Sliders, Video, MessageSquare, AlertCircle, ShieldCheck } from 'lucide-react'

export const HospitalControlsCard: React.FC = () => {
  const [telehealthEnabled, setTelehealthEnabled] = useState(true)
  const [smsReminders, setSmsReminders] = useState(true)
  const [emergencyTriage, setEmergencyTriage] = useState(false)
  const [insurancePreAuth, setInsurancePreAuth] = useState(true)
  const [bufferTime, setBufferTime] = useState(15)

  return (
    <div className="card-v14 p-5 md:p-6 w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sliders size={18} className="text-black dark:text-white" /> Clinic Controls & Policies
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Hospital scheduling rules and patient notifications
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700">
          Active Policies
        </span>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        {/* Toggle 1 */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
              <Video size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Online Telehealth Visits
              </p>
              <p className="text-[11px] text-zinc-500">
                Generate secure video consultation rooms
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTelehealthEnabled(!telehealthEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 ${
              telehealthEnabled ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full shadow-md ${
                telehealthEnabled
                  ? 'translate-x-5 bg-white dark:bg-black'
                  : 'translate-x-0 bg-white dark:bg-zinc-300'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2 */}
        <div className="flex items-center justify-between py-1 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
              <MessageSquare size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Automated SMS & WhatsApp Alerts
              </p>
              <p className="text-[11px] text-zinc-500">
                Send 24h prior reminders & check-in links
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSmsReminders(!smsReminders)}
            className={`w-11 h-6 flex items-center rounded-full p-1 ${
              smsReminders ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full shadow-md ${
                smsReminders
                  ? 'translate-x-5 bg-white dark:bg-black'
                  : 'translate-x-0 bg-white dark:bg-zinc-300'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3 */}
        <div className="flex items-center justify-between py-1 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
              <AlertCircle size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                ER Bed Auto-Allocation Triage
              </p>
              <p className="text-[11px] text-zinc-500">
                Direct acute care visits into triage queue
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEmergencyTriage(!emergencyTriage)}
            className={`w-11 h-6 flex items-center rounded-full p-1 ${
              emergencyTriage ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full shadow-md ${
                emergencyTriage
                  ? 'translate-x-5 bg-white dark:bg-black'
                  : 'translate-x-0 bg-white dark:bg-zinc-300'
              }`}
            />
          </button>
        </div>

        {/* Toggle 4 */}
        <div className="flex items-center justify-between py-1 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Insurance Pre-Authorization
              </p>
              <p className="text-[11px] text-zinc-500">
                Enforce copay eligibility before check-in
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setInsurancePreAuth(!insurancePreAuth)}
            className={`w-11 h-6 flex items-center rounded-full p-1 ${
              insurancePreAuth ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full shadow-md ${
                insurancePreAuth
                  ? 'translate-x-5 bg-white dark:bg-black'
                  : 'translate-x-0 bg-white dark:bg-zinc-300'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Slider: Slot Buffer */}
      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            Consultation Buffer Gap
          </span>
          <span className="text-black dark:text-white font-bold">{bufferTime} mins</span>
        </div>
        <input
          type="range"
          min="5"
          max="30"
          step="5"
          value={bufferTime}
          onChange={(e) => setBufferTime(Number(e.target.value))}
          className="w-full accent-black dark:accent-white h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
          <span>5m (Express)</span>
          <span>15m (Standard)</span>
          <span>30m (Thorough)</span>
        </div>
      </div>
    </div>
  )
}
