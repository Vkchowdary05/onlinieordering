import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Star,
} from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'
import { StatsCard, CoralStatsCard } from '../v14/StatsCard'
import { AppointmentsBarChart } from '../v14/AppointmentsBarChart'
import { HospitalControlsCard } from '../v14/HospitalControlsCard'
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

export const AdminDashboardView: React.FC = () => {
  const {
    doctors,
    appointments,
    patients,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    updateAppointmentStatus,
    setActiveView,
    addToast,
  } = useMediCare()

  const [adminTab, setAdminTab] = useState<'overview' | 'appointments' | 'doctors' | 'patients'>('overview')
  const [searchFilter, setSearchFilter] = useState('')

  // Add/Edit Doctor Modal
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)

  // Doctor Form Fields
  const [formName, setFormName] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formSpecialty, setFormSpecialty] = useState<Specialty>('Cardiology')
  const [formDepartment, setFormDepartment] = useState('')
  const [formFee, setFormFee] = useState<number>(180)
  const [formExperience, setFormExperience] = useState<number>(10)
  const [formRoom, setFormRoom] = useState('')
  const [formBio, setFormBio] = useState('')
  const [formAvatar, setFormAvatar] = useState('')

  const openAddDoctor = () => {
    setEditingDoctor(null)
    setFormName('')
    setFormTitle('MD, Specialist')
    setFormSpecialty('Cardiology')
    setFormDepartment('Cardiovascular Center')
    setFormFee(180)
    setFormExperience(12)
    setFormRoom('Suite 302, West Wing')
    setFormBio('Specialist dedicated to comprehensive patient diagnostics and patient care.')
    setFormAvatar('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300')
    setIsDoctorModalOpen(true)
  }

  const openEditDoctor = (doc: Doctor) => {
    setEditingDoctor(doc)
    setFormName(doc.name)
    setFormTitle(doc.title)
    setFormSpecialty(doc.specialty)
    setFormDepartment(doc.department)
    setFormFee(doc.consultationFee)
    setFormExperience(doc.experienceYears)
    setFormRoom(doc.room)
    setFormBio(doc.bio)
    setFormAvatar(doc.avatar)
    setIsDoctorModalOpen(true)
  }

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) {
      addToast('Validation Error', 'Physician name is required', 'error')
      return
    }

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, {
        name: formName,
        title: formTitle,
        specialty: formSpecialty,
        department: formDepartment,
        consultationFee: formFee,
        experienceYears: formExperience,
        room: formRoom,
        bio: formBio,
        avatar: formAvatar,
      })
    } else {
      addDoctor({
        name: formName,
        title: formTitle,
        specialty: formSpecialty,
        department: formDepartment,
        consultationFee: formFee,
        experienceYears: formExperience,
        room: formRoom,
        bio: formBio,
        avatar: formAvatar,
        education: ['Stanford School of Medicine', 'Residency in Specialty'],
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        isActive: true,
        languages: ['English'],
      })
    }
    setIsDoctorModalOpen(false)
  }

  // Calculated Metrics
  const totalRevenue = appointments
    .filter((a) => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + a.fee, 0)

  const activeDoctorsCount = doctors.filter((d) => d.isActive).length
  const todayStr = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter((a) => a.date === todayStr)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="text-[#FF5A36]" /> Hospital Administration Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time occupancy monitoring, physician roster management, and clinical operations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={openAddDoctor}
            className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Plus size={14} /> Add Doctor
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation Pills */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-[#181822] p-1.5 rounded-full border border-zinc-200/70 dark:border-white/5 shadow-xs w-full sm:w-auto">
        <button
          onClick={() => setAdminTab('overview')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold transition-all ${
            adminTab === 'overview'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setAdminTab('appointments')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold transition-all ${
            adminTab === 'appointments'
              ? 'bg-[#FF5A36] text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Appointments ({appointments.length})
        </button>
        <button
          onClick={() => setAdminTab('doctors')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold transition-all ${
            adminTab === 'doctors'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Doctors ({doctors.length})
        </button>
        <button
          onClick={() => setAdminTab('patients')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold transition-all ${
            adminTab === 'patients'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Patients ({patients.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CoralStatsCard
              title="Monthly Hospital Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              badgeText="+14.8% vs target"
              subtitle="24 Consultations"
            />

            <StatsCard
              title="Today's Appointments"
              value={todayAppointments.length}
              change="+2 urgent triage"
              subtitle="5 Doctors on duty"
              icon={Calendar}
            />

            <StatsCard
              title="Active Specialists"
              value={`${activeDoctorsCount} / ${doctors.length}`}
              change="100% duty coverage"
              subtitle="Across 10 wings"
              icon={Stethoscope}
            />

            <StatsCard
              title="Registered Patients"
              value={patients.length * 720}
              change="+85 this week"
              subtitle="Active health portal"
              icon={Users}
            />
          </div>

          {/* Grid: Bar Chart & Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <AppointmentsBarChart
                title="Hospital Inpatient & Outpatient Volume"
                subtitle="Aggregated clinical throughput for 2026"
              />
            </div>
            <div className="lg:col-span-5">
              <HospitalControlsCard />
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {adminTab === 'appointments' && (
        <div className="bg-white dark:bg-[#181822] p-5 sm:p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Master Appointment Directory
              </h3>
              <p className="text-xs text-zinc-400">
                Search, inspect, and update all patient reservations
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by patient, doctor, ID..."
                className="w-full pl-9 pr-3.5 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs focus:outline-none focus:border-[#FF5A36]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3 pl-2">ID</th>
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Doctor</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3">Fee</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Status Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {appointments
                  .filter(
                    (a) =>
                      a.patientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      a.doctorName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      a.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      a.doctorSpecialty.toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 pl-2 font-mono font-medium text-zinc-900 dark:text-zinc-100">
                        {apt.id}
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">
                          {apt.patientName}
                        </p>
                        <p className="text-[10px] text-zinc-400">{apt.patientPhone}</p>
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {apt.doctorName}
                        </p>
                        <p className="text-[10px] text-[#FF5A36]">{apt.doctorSpecialty}</p>
                      </td>
                      <td className="py-3">
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{apt.date}</p>
                        <p className="text-[10px] text-zinc-400">{apt.timeSlot}</p>
                      </td>
                      <td className="py-3 text-zinc-600 dark:text-zinc-400">{apt.type}</td>
                      <td className="py-3 font-bold text-zinc-900 dark:text-zinc-100">
                        ${apt.fee}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            apt.status === 'confirmed'
                              ? 'bg-[#FFF2EE] text-[#FF5A36]'
                              : apt.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-600'
                              : apt.status === 'pending'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status !== 'confirmed' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              title="Mark Confirmed"
                              className="p-1 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}
                          {apt.status !== 'completed' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                              title="Mark Completed"
                              className="p-1 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}
                          {apt.status !== 'cancelled' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                              title="Cancel"
                              className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                            >
                              <XCircle size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DOCTORS MANAGEMENT TAB */}
      {adminTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#181822] p-4 rounded-3xl border border-zinc-200/70 dark:border-white/5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Medical Staff & Faculty
              </h3>
              <p className="text-xs text-zinc-400">
                {doctors.length} doctors onboarded across hospital wings
              </p>
            </div>
            <button
              onClick={openAddDoctor}
              className="px-4 py-2 rounded-full bg-[#FF5A36] hover:bg-[#E84A28] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} /> Add New Physician
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-[#181822] p-5 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-zinc-100"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditDoctor(doc)}
                        className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                        title="Edit Doctor"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => deleteDoctor(doc.id)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                        title="Remove Doctor"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-[#FF5A36] uppercase tracking-wider">
                      {doc.specialty}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-zinc-500">{doc.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-1">{doc.room}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500">Fee: ${doc.consultationFee}</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Star size={12} className="fill-emerald-600" /> {doc.rating} ({doc.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.isActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-zinc-100 text-zinc-400'
                    }`}
                  >
                    {doc.isActive ? 'On Duty' : 'On Leave'}
                  </span>
                  <button
                    onClick={() => updateDoctor(doc.id, { isActive: !doc.isActive })}
                    className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                  >
                    Toggle Duty
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PATIENTS TAB */}
      {adminTab === 'patients' && (
        <div className="bg-white dark:bg-[#181822] p-5 sm:p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Registered Patients Roster
              </h3>
              <p className="text-xs text-zinc-400">
                Patient profiles, insurance details, and medical emergency logs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map((pat) => (
              <div
                key={pat.id}
                className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {pat.name}
                    </h4>
                    <p className="text-xs text-zinc-500">{pat.email}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-extrabold text-xs">
                    Blood: {pat.bloodGroup}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Phone</p>
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium">{pat.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Date of Birth</p>
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium">{pat.dob}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Insurance</p>
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {pat.insuranceProvider} ({pat.policyNumber})
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Allergies</p>
                    <p className="text-rose-600 font-medium">{pat.allergies.join(', ')}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200/50 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 text-[11px]">
                    Emergency: {pat.emergencyContact.name} ({pat.emergencyContact.relation})
                  </span>
                  <button
                    onClick={() => {
                      localStorage.setItem('medicare_book_for_patient', pat.email)
                      setActiveView('book')
                    }}
                    className="text-xs font-bold text-[#FF5A36] hover:underline"
                  >
                    + Book for Patient
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Doctor Modal */}
      <AnimatePresence>
        {isDoctorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#181824] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-white/10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {editingDoctor ? 'Edit Doctor Profile' : 'Add New Physician'}
                </h3>
                <button
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveDoctor} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Dr. Hannah Schmidt"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Title & Degrees
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g., MD, FACC"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Specialty
                    </label>
                    <select
                      value={formSpecialty}
                      onChange={(e) => setFormSpecialty(e.target.value as Specialty)}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    >
                      {SPECIALTIES.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      placeholder="e.g., Heart & Vascular Center"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Clinic Room / Suite
                    </label>
                    <input
                      type="text"
                      value={formRoom}
                      onChange={(e) => setFormRoom(e.target.value)}
                      placeholder="e.g., Suite 204, East Wing"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={1000}
                      value={formFee}
                      onChange={(e) => setFormFee(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={formExperience}
                      onChange={(e) => setFormExperience(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Photo Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formAvatar}
                    onChange={(e) => setFormAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Biography & Clinical Focus
                  </label>
                  <textarea
                    rows={3}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="Brief background and specialties..."
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsDoctorModalOpen(false)}
                    className="py-2 px-4 rounded-full text-zinc-600 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-full bg-[#FF5A36] hover:bg-[#E84A28] text-white font-bold text-xs shadow-xs"
                  >
                    {editingDoctor ? 'Save Changes' : 'Create Physician'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
