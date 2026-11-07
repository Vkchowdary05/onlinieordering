import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCw,
  X,
  CalendarCheck,
  Video,
  Building2,
  User,
} from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'
import type { Appointment } from '../../types/medicare'

export const MyAppointmentsView: React.FC = () => {
  const {
    currentUser,
    appointments,
    doctors,
    cancelAppointment,
    rescheduleAppointment,
    updateAppointmentStatus,
    isSlotAvailable,
    setActiveView,
  } = useMediCare()

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleSlot, setRescheduleSlot] = useState('')
  const [rescheduleError, setRescheduleError] = useState('')

  const todayStr = new Date().toISOString().split('T')[0]

  // Filter based on user role (Patient sees theirs, Admin sees all)
  const userAppointments =
    currentUser.role === 'admin'
      ? appointments
      : appointments.filter((a) => a.patientEmail === currentUser.email)

  const filteredAppointments = userAppointments.filter((apt) => {
    const matchesSearch =
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === 'upcoming') {
      return (
        matchesSearch &&
        (apt.status === 'confirmed' || apt.status === 'pending') &&
        apt.date >= todayStr
      )
    }
    if (activeTab === 'completed') {
      return matchesSearch && apt.status === 'completed'
    }
    if (activeTab === 'cancelled') {
      return matchesSearch && apt.status === 'cancelled'
    }
    return matchesSearch
  })

  // Handle Cancel
  const handleConfirmCancel = () => {
    if (!cancellingAppointment) return
    cancelAppointment(cancellingAppointment.id, cancelReason)
    setCancellingAppointment(null)
    setCancelReason('')
  }

  // Handle Reschedule
  const handleConfirmReschedule = () => {
    if (!reschedulingAppointment) return
    if (!rescheduleDate || !rescheduleSlot) {
      setRescheduleError('Please pick both date and time slot.')
      return
    }

    const res = rescheduleAppointment(reschedulingAppointment.id, rescheduleDate, rescheduleSlot)
    if (res.success) {
      setReschedulingAppointment(null)
      setRescheduleDate('')
      setRescheduleSlot('')
      setRescheduleError('')
    } else {
      setRescheduleError(res.error || 'Failed to reschedule.')
    }
  }

  const selectedRescheduleDoctor = reschedulingAppointment
    ? doctors.find((d) => d.id === reschedulingAppointment.doctorId)
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="text-[#000000]" />
            {currentUser.role === 'admin' ? 'All Hospital Appointments' : 'My Scheduled Consultations'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track consultation timings, manage clinic check-ins, or reschedule reservations.
          </p>
        </div>

        <button
          onClick={() => setActiveView('book')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95"
        >
          + Book New Appointment
        </button>
      </div>

      {/* Navigation Filter Pills and Search */}
      <div className="bg-white dark:bg-[#181822] p-4 sm:p-5 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-full border border-zinc-200/50 dark:border-white/5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              All ({userAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[#000000] text-white shadow-xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Upcoming (
              {
                userAppointments.filter(
                  (a) => (a.status === 'confirmed' || a.status === 'pending') && a.date >= todayStr
                ).length
              }
              )
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'completed'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Completed ({userAppointments.filter((a) => a.status === 'completed').length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'cancelled'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Cancelled ({userAppointments.filter((a) => a.status === 'cancelled').length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor, patient, ID..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs focus:outline-none focus:border-[#000000] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-3.5">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => {
            const isPast = apt.date < todayStr

            return (
              <div
                key={apt.id}
                data-testid="appointment-card"
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-[#181822] p-5 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Doctor & Details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <img
                    src={apt.doctorAvatar}
                    alt={apt.doctorName}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        data-testid="appointment-id"
                        className="font-mono text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md"
                      >
                        {apt.id}
                      </span>
                      <span className="text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                        {apt.doctorSpecialty}
                      </span>
                      <span
                        data-testid="appointment-status-badge"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'confirmed'
                            ? 'bg-[#F4F4F5] text-[#000000] dark:bg-[#18181B]'
                            : apt.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : apt.status === 'pending'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {apt.status === 'confirmed' && <CheckCircle2 size={10} />}
                        {apt.status === 'completed' && <CheckCircle2 size={10} />}
                        {apt.status === 'cancelled' && <XCircle size={10} />}
                        <span className="capitalize">{apt.status}</span>
                      </span>
                    </div>

                    <h3
                      data-testid="appointment-doctor"
                      className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1"
                    >
                      {apt.doctorName}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-1">{apt.reason}</p>

                    {/* Meta info tags */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mt-2 flex-wrap">
                      <div className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                        <Calendar size={13} className="text-[#000000]" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                        <Clock size={13} className="text-[#000000]" />
                        <span>{apt.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        {apt.type === 'Video Call' ? (
                          <>
                            <Video size={13} className="text-indigo-500" />
                            <span>Telehealth Video</span>
                          </>
                        ) : (
                          <>
                            <Building2 size={13} className="text-zinc-400" />
                            <span>{apt.room}</span>
                          </>
                        )}
                      </div>
                      {currentUser.role === 'admin' && (
                        <div className="flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                          <User size={12} />
                          <span>Patient: {apt.patientName}</span>
                        </div>
                      )}
                    </div>

                    {apt.cancellationReason && (
                      <p className="text-[11px] text-rose-500 italic mt-1.5">
                        Cancellation Note: {apt.cancellationReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {apt.status === 'confirmed' && !isPast && (
                    <>
                      <button
                        onClick={() => {
                          setReschedulingAppointment(apt)
                          setRescheduleDate(apt.date)
                          setRescheduleSlot(apt.timeSlot)
                        }}
                        className="py-1.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCw size={12} /> Reschedule
                      </button>
                      <button
                        type="button"
                        data-testid="btn-cancel-appointment"
                        onClick={() => setCancellingAppointment(apt)}
                        className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle size={12} /> Cancel
                      </button>
                    </>
                  )}

                  {currentUser.role === 'admin' && apt.status === 'confirmed' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                      className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Mark Done
                    </button>
                  )}

                  <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 pl-2">
                    ${apt.fee}
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white dark:bg-[#181822] p-12 rounded-3xl border border-zinc-200/70 dark:border-white/5 text-center">
            <CalendarCheck size={40} className="mx-auto text-zinc-300 mb-3" />
            <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              No appointments found
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              There are no appointments matching the selected filter.
            </p>
            <button
              onClick={() => setActiveView('book')}
              className="mt-4 px-5 py-2 rounded-full bg-[#000000] text-white font-bold text-xs shadow-xs hover:bg-[#27272A]"
            >
              Book an Appointment
            </button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancellingAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div
              data-testid="cancel-modal"
              
              
              
              className="bg-white dark:bg-[#181824] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-white/10 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-rose-600">
                  <AlertCircle size={18} /> Cancel Appointment?
                </h3>
                <button
                  onClick={() => setCancellingAppointment(null)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-zinc-500">
                Are you sure you want to cancel your consultation with{' '}
                <strong className="text-zinc-800 dark:text-zinc-200">
                  {cancellingAppointment.doctorName}
                </strong>{' '}
                on {cancellingAppointment.date} at {cancellingAppointment.timeSlot}? This will
                release the time slot for other patients.
              </p>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  rows={2}
                  data-testid="input-cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g., Conflict in personal schedule, symptoms resolved, etc."
                  className="w-full p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs focus:outline-none focus:border-[#000000]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setCancellingAppointment(null)}
                  className="py-2 px-4 rounded-full text-zinc-600 dark:text-zinc-400 text-xs font-semibold"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  data-testid="btn-confirm-cancel"
                  onClick={handleConfirmCancel}
                  className="py-2 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal with Conflict Prevention */}
      <AnimatePresence>
        {reschedulingAppointment && selectedRescheduleDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div
              
              
              
              className="bg-white dark:bg-[#181824] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-white/10 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <RotateCw size={18} className="text-[#000000]" /> Reschedule Appointment
                </h3>
                <button
                  onClick={() => setReschedulingAppointment(null)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-zinc-500">
                Rescheduling consultation with{' '}
                <strong>{selectedRescheduleDoctor.name}</strong> ({selectedRescheduleDoctor.specialty}).
              </p>

              {rescheduleError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{rescheduleError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value)
                    setRescheduleSlot('')
                  }}
                  className="w-full px-4 py-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  New Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {selectedRescheduleDoctor.availableSlots.map((slot) => {
                    const isAvailable = isSlotAvailable(
                      selectedRescheduleDoctor.id,
                      rescheduleDate,
                      slot,
                      reschedulingAppointment.id
                    )
                    const isChosen = rescheduleSlot === slot

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setRescheduleSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                          !isAvailable
                            ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed line-through'
                            : isChosen
                            ? 'bg-[#000000] text-white'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        <span>{slot}</span>
                        {!isAvailable ? (
                          <span className="text-[9px] text-rose-500 uppercase font-bold">
                            Booked
                          </span>
                        ) : isChosen ? (
                          <CheckCircle2 size={12} />
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setReschedulingAppointment(null)}
                  className="py-2 px-4 rounded-full text-zinc-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReschedule}
                  className="py-2 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold shadow-xs transition-all"
                >
                  Save New Time
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
