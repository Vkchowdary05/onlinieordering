import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Video,
  Building2,
  CreditCard,
  Download,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  MapPin,
} from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'

export const BookAppointmentView: React.FC = () => {
  const {
    doctors,
    currentUser,
    currentPatientProfile,
    bookAppointment,
    isSlotAvailable,
    setActiveView,
  } = useMediCare()

  // Steps: 1 = Doctor, 2 = Date & Slot, 3 = Visit Details, 4 = Review & Pay, 5 = Confirmed
  const [step, setStep] = useState(1)

  // Selected State
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [consultationType, setConsultationType] = useState<'In-Person' | 'Video Call'>('In-Person')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'clinic' | 'card' | 'insurance'>('clinic')

  // Patient info fields
  const [patientName, setPatientName] = useState(currentUser.name)
  const [patientEmail, setPatientEmail] = useState(currentUser.email)
  const [patientPhone, setPatientPhone] = useState(currentPatientProfile?.phone || '+1 (555) 234-5678')

  // Result state
  const [confirmedAppointment, setConfirmedAppointment] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0]

  // Check if doctor was pre-selected from doctor directory
  useEffect(() => {
    const preselected = localStorage.getItem('medicare_preselected_doc')
    if (preselected && doctors.some((d) => d.id === preselected)) {
      setSelectedDoctorId(preselected)
      localStorage.removeItem('medicare_preselected_doc')
      setStep(2)
    } else if (doctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(doctors[0].id)
    }
  }, [doctors])

  // Default date to tomorrow if not set
  useEffect(() => {
    if (!selectedDate) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setSelectedDate(tomorrow.toISOString().split('T')[0])
    }
  }, [selectedDate])

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0]

  // Handle final submission
  const handleConfirmBooking = () => {
    setErrorMessage('')
    if (!selectedDate || !selectedSlot) {
      setErrorMessage('Please pick both an appointment date and an available time slot.')
      return
    }
    if (!reason.trim()) {
      setErrorMessage('Please state the reason for your medical visit.')
      return
    }

    const res = bookAppointment({
      doctorId: selectedDoctor.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      type: consultationType,
      reason,
      notes,
      patientName,
      patientEmail,
      patientPhone,
    })

    if (res.success && res.appointment) {
      setConfirmedAppointment(res.appointment)
      setStep(5)
    } else {
      setErrorMessage(res.error || 'Failed to complete booking. Please try again.')
    }
  }

  // Generate simulated .ics calendar file download
  const downloadCalendarFile = () => {
    if (!confirmedAppointment) return
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MediCare Hospital//EN\nBEGIN:VEVENT\nSUMMARY:MediCare Appointment: ${confirmedAppointment.doctorName}\nDESCRIPTION:${confirmedAppointment.reason} - ${confirmedAppointment.room}\nDTSTART:${confirmedAppointment.date.replace(/-/g, '')}T090000Z\nDTEND:${confirmedAppointment.date.replace(/-/g, '')}T100000Z\nLOCATION:${confirmedAppointment.room}\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `appointment-${confirmedAppointment.id}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="text-[#000000]" /> Schedule Hospital Consultation
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time appointment reservation with verified slot availability.
          </p>
        </div>

        {step < 5 && (
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-[#000000] bg-[#F4F4F5] dark:bg-[#18181B] px-3 py-1 rounded-full">
              Step {step} of 4
            </span>
          </div>
        )}
      </div>

      {/* Step Progress Bar - Dashboard V14 Style */}
      {step < 5 && (
        <div className="bg-white dark:bg-[#181822] p-3 rounded-2xl border border-zinc-200/70 dark:border-white/5 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <button
              onClick={() => setStep(1)}
              className={`py-1.5 rounded-xl font-bold transition-all ${
                step >= 1
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-400'
              }`}
            >
              1. Doctor
            </button>
            <button
              onClick={() => step >= 2 && setStep(2)}
              disabled={step < 2}
              className={`py-1.5 rounded-xl font-bold transition-all ${
                step === 2
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : step > 2
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                  : 'text-zinc-400 opacity-60'
              }`}
            >
              2. Date & Time
            </button>
            <button
              onClick={() => step >= 3 && setStep(3)}
              disabled={step < 3}
              className={`py-1.5 rounded-xl font-bold transition-all ${
                step === 3
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : step > 3
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                  : 'text-zinc-400 opacity-60'
              }`}
            >
              3. Details
            </button>
            <button
              onClick={() => step >= 4 && setStep(4)}
              disabled={step < 4}
              className={`py-1.5 rounded-xl font-bold transition-all ${
                step === 4
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-400 opacity-60'
              }`}
            >
              4. Confirm
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div
          data-testid="booking-error-alert"
          className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Select Doctor */}
      {step === 1 && (
        <div
          
          
          className="bg-white dark:bg-[#181822] p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Choose a Physician
              </h3>
              <p className="text-xs text-zinc-400">
                Select from our certified departmental specialists
              </p>
            </div>
            <button
              onClick={() => setActiveView('doctors')}
              className="text-xs font-bold text-[#000000] hover:underline"
            >
              Browse Directory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
            {doctors.map((doc) => {
              const isSelected = selectedDoctorId === doc.id
              return (
                <div
                  key={doc.id}
                  data-testid="doctor-select-card"
                  onClick={() => setSelectedDoctorId(doc.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-[#000000] bg-[#F4F4F5]/40 dark:bg-[#18181B]/30 shadow-xs ring-1 ring-[#000000]'
                      : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30'
                  }`}
                >
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                      {doc.specialty}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {doc.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500 truncate">{doc.department}</p>
                    <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mt-1">
                      Fee: ${doc.consultationFee}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#000000] flex items-center justify-center text-white shrink-0">
                      <CheckCircle2 size={13} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              data-testid="btn-book-step-1"
              onClick={() => setStep(2)}
              className="py-2.5 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
            >
              Continue to Date & Time <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Pick Date & Time Slot (Strict Validation & Double Booking Prevention) */}
      {step === 2 && (
        <div
          
          
          className="bg-white dark:bg-[#181822] p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-6"
        >
          {/* Selected Doctor Summary Header */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <img
              src={selectedDoctor.avatar}
              alt={selectedDoctor.name}
              className="w-11 h-11 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {selectedDoctor.name}
              </h4>
              <p className="text-[11px] text-zinc-500">
                {selectedDoctor.title} • {selectedDoctor.room}
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-[#000000] hover:underline"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#000000]" /> Select Consultation Date
              </label>
              <input
                type="date"
                data-testid="input-booking-date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setSelectedSlot('') // Reset slot when date changes
                }}
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium focus:outline-none focus:border-[#000000] transition-colors"
              />
              <p className="text-[11px] text-zinc-400 mt-2">
                Available Days: {selectedDoctor.availableDays.join(', ')}
              </p>

              {/* Quick Date Pills */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(todayStr)
                    setSelectedSlot('')
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedDate === todayStr
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tmrw = new Date()
                    tmrw.setDate(tmrw.getDate() + 1)
                    setSelectedDate(tmrw.toISOString().split('T')[0])
                    setSelectedSlot('')
                  }}
                  className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold hover:bg-zinc-200"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextW = new Date()
                    nextW.setDate(nextW.getDate() + 3)
                    setSelectedDate(nextW.toISOString().split('T')[0])
                    setSelectedSlot('')
                  }}
                  className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold hover:bg-zinc-200"
                >
                  In 3 Days
                </button>
              </div>
            </div>

            {/* Time Slot Picker with real-time double-booking checking */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Clock size={14} className="text-[#000000]" /> Available Time Slots
                </label>
                <span className="text-[10px] text-zinc-400 font-medium">
                  {selectedDoctor.availableSlots.length} Total Slots
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {selectedDoctor.availableSlots.map((slot) => {
                  const isAvailable = isSlotAvailable(selectedDoctor.id, selectedDate, slot)
                  const isChosen = selectedSlot === slot

                  return (
                    <button
                      key={slot}
                      type="button"
                      data-testid={isAvailable ? "slot-button-available" : "slot-button-booked"}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                        !isAvailable
                          ? 'bg-zinc-100/60 dark:bg-zinc-800/30 text-zinc-300 dark:text-zinc-600 cursor-not-allowed line-through'
                          : isChosen
                          ? 'bg-[#000000] text-white shadow-xs font-bold'
                          : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-white/5'
                      }`}
                    >
                      <span>{slot}</span>
                      {!isAvailable ? (
                        <span className="text-[9px] uppercase font-bold text-rose-500">
                          Booked
                        </span>
                      ) : isChosen ? (
                        <CheckCircle2 size={12} />
                      ) : null}
                    </button>
                  )
                })}
              </div>

              {selectedSlot && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>
                    Slot confirmed available for {selectedDate} at {selectedSlot}.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setStep(1)}
              className="py-2 px-4 rounded-full text-zinc-600 dark:text-zinc-400 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="button"
              data-testid="btn-book-step-2"
              onClick={() => {
                if (!selectedSlot) {
                  setErrorMessage('Please select an available time slot.')
                  return
                }
                setErrorMessage('')
                setStep(3)
              }}
              className="py-2.5 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
            >
              Continue to Details <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Consultation Details & Patient Verification */}
      {step === 3 && (
        <div
          
          
          className="bg-white dark:bg-[#181822] p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-5"
        >
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Visit Purpose & Patient Verification
            </h3>
            <p className="text-xs text-zinc-400">
              Provide clinical context to help the physician prepare for your consultation
            </p>
          </div>

          {/* Consultation Type Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">
              Consultation Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType('In-Person')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  consultationType === 'In-Person'
                    ? 'border-[#000000] bg-[#F4F4F5]/40 dark:bg-[#18181B]/30 ring-1 ring-[#000000]'
                    : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-[#000000] shadow-xs">
                  <Building2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    In-Person Hospital Visit
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Visit {selectedDoctor.room} for physical examination
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('Video Call')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  consultationType === 'Video Call'
                    ? 'border-[#000000] bg-[#F4F4F5]/40 dark:bg-[#18181B]/30 ring-1 ring-[#000000]'
                    : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-[#000000] shadow-xs">
                  <Video size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Video Teleconsultation
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Encrypted HD virtual consultation room
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
              Reason for Visit / Chief Complaint *
            </label>
            <input
              type="text"
              data-testid="input-visit-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Routine cardiac follow-up, persistent joint pain, migraine review..."
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs focus:outline-none focus:border-[#000000] transition-colors"
            />
          </div>

          {/* Medical Notes & Symptoms */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
              Additional Symptoms or Clinical Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="List any existing medications, onset duration, allergies, or questions for the doctor..."
              className="w-full p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs focus:outline-none focus:border-[#000000] transition-colors"
            />
          </div>

          {/* Patient Details Verification */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <User size={14} className="text-[#000000]" /> Patient Contact Verification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 uppercase font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 uppercase font-semibold">
                  Phone
                </label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setStep(2)}
              className="py-2 px-4 rounded-full text-zinc-600 dark:text-zinc-400 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="button"
              data-testid="btn-book-step-3"
              onClick={() => {
                if (!reason.trim()) {
                  setErrorMessage('Please specify the reason for visit.')
                  return
                }
                setErrorMessage('')
                setStep(4)
              }}
              className="py-2.5 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
            >
              Review Booking <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review, Payment Method & Confirmation */}
      {step === 4 && (
        <div
          
          
          className="bg-white dark:bg-[#181822] p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-6"
        >
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Review Appointment Summary
            </h3>
            <p className="text-xs text-zinc-400">
              Please double check all reservation parameters before confirming
            </p>
          </div>

          {/* Booking Summary Card */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 space-y-4">
            <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-200/60 dark:border-zinc-700/60">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#000000]/20"
              />
              <div>
                <span className="text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                  {selectedDoctor.specialty}
                </span>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedDoctor.name}
                </h4>
                <p className="text-xs text-zinc-500">{selectedDoctor.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-zinc-400 text-[10px] uppercase font-bold">Date</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {selectedDate}
                </p>
              </div>
              <div>
                <p className="text-zinc-400 text-[10px] uppercase font-bold">Time Slot</p>
                <p className="font-bold text-[#000000] mt-0.5">{selectedSlot}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-[10px] uppercase font-bold">Mode</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {consultationType}
                </p>
              </div>
              <div>
                <p className="text-zinc-400 text-[10px] uppercase font-bold">Location</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 truncate">
                  {selectedDoctor.room}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-700/60">
              <p className="text-zinc-400 text-[10px] uppercase font-bold">Reason for Visit</p>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 font-medium mt-0.5">
                {reason}
              </p>
              {notes && <p className="text-[11px] text-zinc-500 italic mt-1">"{notes}"</p>}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('clinic')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'clinic'
                    ? 'border-[#000000] bg-[#F4F4F5]/50 dark:bg-[#18181B]/30 ring-1 ring-[#000000]'
                    : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
                }`}
              >
                <Building2 size={18} className="mx-auto text-zinc-700 dark:text-zinc-300 mb-1" />
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Pay at Reception</p>
                <p className="text-[10px] text-zinc-400">Cash / Card in clinic</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#000000] bg-[#F4F4F5]/50 dark:bg-[#18181B]/30 ring-1 ring-[#000000]'
                    : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
                }`}
              >
                <CreditCard size={18} className="mx-auto text-zinc-700 dark:text-zinc-300 mb-1" />
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Credit Card</p>
                <p className="text-[10px] text-zinc-400">Online pre-payment</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('insurance')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'insurance'
                    ? 'border-[#000000] bg-[#F4F4F5]/50 dark:bg-[#18181B]/30 ring-1 ring-[#000000]'
                    : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
                }`}
              >
                <CheckCircle2 size={18} className="mx-auto text-zinc-700 dark:text-zinc-300 mb-1" />
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Insurance Copay</p>
                <p className="text-[10px] text-zinc-400">Direct claim billing</p>
              </button>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between text-xs">
            <div>
              <span className="text-zinc-500 font-medium">Standard Specialist Consultation Fee</span>
              <p className="text-[11px] text-emerald-600 font-semibold">
                Includes 45min clinical evaluation & e-prescription
              </p>
            </div>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              ${selectedDoctor.consultationFee}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setStep(3)}
              className="py-2 px-4 rounded-full text-zinc-600 dark:text-zinc-400 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="button"
              data-testid="btn-confirm-booking"
              onClick={handleConfirmBooking}
              className="py-3 px-8 rounded-full bg-[#000000] hover:bg-[#27272A] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Confirm Appointment
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Booking Confirmation State */}
      {step === 5 && confirmedAppointment && (
        <div
          data-testid="booking-confirmation-card"
          
          
          className="bg-white dark:bg-[#181822] p-8 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xl text-center space-y-6"
        >
          {/* Animated Green Badge */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Booking Confirmed
            </span>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">
              Appointment Successfully Reserved!
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              A confirmation email and SMS reminder have been dispatched to {confirmedAppointment.patientEmail}
            </p>
          </div>

          {/* Digital Appointment Ticket Card */}
          <div className="max-w-md mx-auto bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 text-left space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60 dark:border-zinc-700/60">
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold">Reference ID</p>
                <p
                  data-testid="booking-reference-id"
                  className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100"
                >
                  {confirmedAppointment.id}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#F4F4F5] dark:bg-[#18181B] text-[#000000] text-[10px] font-bold">
                {confirmedAppointment.type}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={confirmedAppointment.doctorAvatar}
                alt={confirmedAppointment.doctorName}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {confirmedAppointment.doctorName}
                </h4>
                <p className="text-[11px] text-zinc-500">
                  {confirmedAppointment.doctorSpecialty}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Calendar size={13} className="text-[#000000]" />
                <span className="font-semibold">{confirmedAppointment.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Clock size={13} className="text-[#000000]" />
                <span className="font-semibold">{confirmedAppointment.timeSlot}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
                <MapPin size={13} className="text-[#000000]" />
                <span className="truncate">{confirmedAppointment.room}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={downloadCalendarFile}
              className="w-full sm:w-auto py-2.5 px-5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Download size={14} /> Add to Calendar (.ics)
            </button>
            <button
              onClick={() => setActiveView('appointments')}
              className="w-full sm:w-auto py-2.5 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              View My Appointments <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
