import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Star,
  Clock,
  MapPin,
  Languages,
  Award,
  ChevronRight,
  X,
  Stethoscope,
} from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'
import type { Doctor, Specialty } from '../../types/medicare'

const SPECIALTIES: Specialty[] = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'General Medicine',
  'Gynecology',
  'Oncology',
  'Ophthalmology',
  'Psychiatry',
]

export const DoctorsView: React.FC<{
  onSelectDoctorForBooking?: (doctorId: string) => void
}> = ({ onSelectDoctorForBooking }) => {
  const { doctors, setActiveView } = useMediCare()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All')
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null)
  const [minRating, setMinRating] = useState<number>(0)

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSpecialty =
      selectedSpecialty === 'All' ? true : doc.specialty === selectedSpecialty

    const matchesRating = doc.rating >= minRating

    return matchesSearch && matchesSpecialty && matchesRating && doc.isActive
  })

  const handleBookDoctor = (doctorId: string) => {
    if (onSelectDoctorForBooking) {
      onSelectDoctorForBooking(doctorId)
    } else {
      localStorage.setItem('medicare_preselected_doc', doctorId)
      setActiveView('book')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2.5">
            <Stethoscope className="text-[#000000]" /> Doctor Directory & Specialists
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Browse our world-class physicians, inspect real-time availability, and book appointments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {filteredDoctors.length} Specialists Available
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#181822] p-4 sm:p-5 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              data-testid="input-doctor-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by physician name, department, language..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/10 text-xs sm:text-sm focus:outline-none focus:border-[#000000] transition-colors"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">
              Rating:
            </span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="py-2 px-3.5 rounded-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/10 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-[#000000]"
            >
              <option value={0}>All Ratings</option>
              <option value={4.8}>4.8+ Stars</option>
              <option value={4.9}>4.9+ Stars</option>
              <option value={4.95}>Top Rated (4.95+)</option>
            </select>
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedSpecialty('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSpecialty === 'All'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            All Specialties
          </button>
          {SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-[#000000] text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            data-testid="doctor-card"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-[#181822] rounded-3xl border border-zinc-200/70 dark:border-white/5 p-5 shadow-[0_4px_20px_-2px_rgba(100,90,140,0.04)] flex flex-col justify-between"
          >
            <div>
              {/* Doctor Header */}
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4F4F5] dark:bg-[#18181B] text-[#000000] text-[10px] font-bold uppercase tracking-wider mb-1">
                    {doc.specialty}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {doc.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 truncate">{doc.title}</p>
                </div>
              </div>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-4 py-2.5 px-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-center text-xs">
                <div>
                  <p className="text-zinc-400 text-[10px] font-medium">Rating</p>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-0.5 mt-0.5">
                    <Star size={11} className="text-amber-500 fill-amber-500" />
                    {doc.rating}
                  </p>
                </div>
                <div className="border-x border-zinc-200/60 dark:border-zinc-700/60">
                  <p className="text-zinc-400 text-[10px] font-medium">Experience</p>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {doc.experienceYears} yrs
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 text-[10px] font-medium">Fee</p>
                  <p className="font-bold text-[#000000] mt-0.5">${doc.consultationFee}</p>
                </div>
              </div>

              {/* Bio Teaser */}
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 line-clamp-2 leading-relaxed">
                {doc.bio}
              </p>

              {/* Location & Schedule preview */}
              <div className="mt-3 space-y-1 text-[11px] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#000000] shrink-0" />
                  <span className="truncate">{doc.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-emerald-500 shrink-0" />
                  <span className="truncate">
                    Slots: {doc.availableSlots.slice(0, 3).join(', ')}...
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                data-testid="btn-view-doctor-profile"
                onClick={() => setSelectedDoctorForModal(doc)}
                className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
              >
                View Profile
              </button>
              <button
                type="button"
                data-testid="btn-book-doctor-now"
                onClick={() => handleBookDoctor(doc.id)}
                className="py-2 px-3 rounded-xl bg-[#000000] hover:bg-[#27272A] text-white font-semibold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                Book Now <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Details Modal */}
      <AnimatePresence>
        {selectedDoctorForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div
              data-testid="doctor-details-modal"
              
              
              
              className="bg-white dark:bg-[#181824] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-white/10 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedDoctorForModal(null)}
                className="absolute right-4 top-4 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-4">
                <img
                  src={selectedDoctorForModal.avatar}
                  alt={selectedDoctorForModal.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#000000]/30"
                />
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F4F4F5] dark:bg-[#18181B] text-[#000000] text-[10px] font-bold uppercase tracking-wider">
                    {selectedDoctorForModal.specialty}
                  </span>
                  <h2
                    data-testid="doctor-modal-name"
                    className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1"
                  >
                    {selectedDoctorForModal.name}
                  </h2>
                  <p className="text-xs text-zinc-500">{selectedDoctorForModal.title}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  About Physician
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {selectedDoctorForModal.bio}
                </p>
              </div>

              {/* Education & Credentials */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Education & Honors
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  {selectedDoctorForModal.education.map((edu, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Award size={14} className="text-[#000000] shrink-0" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weekly Schedule */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Working Days & Timings
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoctorForModal.availableDays.map((day) => (
                    <span
                      key={day}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedDoctorForModal.availableSlots.map((slot) => (
                    <span
                      key={slot}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages & Fee */}
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Languages size={14} />
                  <span>{selectedDoctorForModal.languages.join(', ')}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 text-[11px]">Fee: </span>
                  <span className="font-extrabold text-base text-[#000000]">
                    ${selectedDoctorForModal.consultationFee}
                  </span>
                </div>
              </div>

              {/* Modal Book Button */}
              <button
                onClick={() => {
                  const id = selectedDoctorForModal.id
                  setSelectedDoctorForModal(null)
                  handleBookDoctor(id)
                }}
                className="w-full mt-5 py-3 rounded-2xl bg-[#000000] hover:bg-[#27272A] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Proceed to Book Appointment
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
