import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Heart,
  Droplet,
  Activity,
  Flame,
  CalendarPlus,
  Stethoscope,
} from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'
import { StatsCard, CoralStatsCard } from '../v14/StatsCard'
import { AppointmentsBarChart } from '../v14/AppointmentsBarChart'
import { RadialGoalProgressCard } from '../v14/RadialGoalProgressCard'

export const PatientDashboardView: React.FC = () => {
  const {
    currentUser,
    appointments,
    setActiveView,
  } = useMediCare()

  const [tableSearch, setTableSearch] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all')

  // Patient appointments
  const myAppointments = appointments.filter(
    (a) => a.patientEmail === currentUser.email || currentUser.role === 'admin'
  )

  const upcomingAppointments = myAppointments.filter(
    (a) => (a.status === 'confirmed' || a.status === 'pending') && a.date >= '2026-11-06'
  )

  const nextAppointment = upcomingAppointments[0]

  const filteredAppointments = myAppointments.filter((a) => {
    const matchesSearch =
      a.doctorName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      a.doctorSpecialty.toLowerCase().includes(tableSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      a.reason.toLowerCase().includes(tableSearch.toLowerCase())

    const matchesStatus =
      selectedStatusFilter === 'all' ? true : a.status === selectedStatusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header - Exactly matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            data-testid="patient-greeting"
            className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight"
          >
            Good morning, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Stay on top of your appointments, doctor consultations, and health wellness records.
          </p>
        </div>

        {/* Quick Action Pill Button */}
        <button
          onClick={() => setActiveView('book')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <CalendarPlus size={16} />
          Book Appointment
        </button>
      </div>

      {/* Main Grid: Visual Top Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols): Total Balance / Health Status & Department quick links */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Card 1: Health Index & Quick CTAs */}
          <div className="bg-white dark:bg-[#181822] p-5 sm:p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(100,90,140,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Overall Wellness Index
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                Optimal Condition
              </span>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  94<span className="text-xl font-normal text-zinc-400">/100</span>
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  +4.2% than last month
                </span>
              </div>
            </div>

            {/* Quick Action Buttons matching Transfer / Request pills */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setActiveView('book')}
                className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <CalendarPlus size={14} /> Schedule Visit
              </button>
              <button
                onClick={() => setActiveView('doctors')}
                className="py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Stethoscope size={14} /> Find Doctors
              </button>
            </div>

            {/* Departments Mini Carousel / Pills matching Wallets */}
            <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  Active Departments
                </span>
                <span className="text-zinc-400 text-[11px]">8 Specialty Wings</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div
                  onClick={() => setActiveView('doctors')}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-white/5 cursor-pointer hover:border-[#FF5A36] transition-colors"
                >
                  <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">Cardio</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">3 Doctors</p>
                </div>
                <div
                  onClick={() => setActiveView('doctors')}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-white/5 cursor-pointer hover:border-[#FF5A36] transition-colors"
                >
                  <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">Neuro</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">2 Doctors</p>
                </div>
                <div
                  onClick={() => setActiveView('doctors')}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-white/5 cursor-pointer hover:border-[#FF5A36] transition-colors"
                >
                  <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">Pediatric</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">3 Doctors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Appointment Highlight Card */}
          {nextAppointment ? (
            <div className="bg-white dark:bg-[#181822] p-5 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36] flex items-center gap-1.5">
                  <Clock size={14} /> Next Up
                </span>
                <span className="text-[11px] font-semibold bg-[#FFF2EE] dark:bg-[#2A1814] text-[#FF5A36] px-2.5 py-0.5 rounded-full">
                  Confirmed
                </span>
              </div>

              <div className="flex items-center gap-3.5 mt-3">
                <img
                  src={nextAppointment.doctorAvatar}
                  alt={nextAppointment.doctorName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {nextAppointment.doctorName}
                  </h4>
                  <p className="text-xs text-zinc-500">{nextAppointment.doctorSpecialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#FF5A36]" />
                  <span className="font-medium">{nextAppointment.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#FF5A36]" />
                  <span className="font-medium">{nextAppointment.timeSlot}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <MapPin size={13} className="text-[#FF5A36]" />
                  <span className="truncate">{nextAppointment.room}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => setActiveView('appointments')}
                  className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1"
                >
                  Manage Appointment <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#181822] p-5 rounded-3xl border border-zinc-200/70 dark:border-white/5 text-center py-8">
              <Calendar size={32} className="mx-auto text-zinc-300 mb-2" />
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                No upcoming appointments
              </p>
              <button
                onClick={() => setActiveView('book')}
                className="mt-3 px-4 py-1.5 bg-[#FF5A36] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#E84A28]"
              >
                Book Now
              </button>
            </div>
          )}
        </div>

        {/* Center & Right Column (7 cols): 2x2 Stats & Bar Chart */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* 4 Stat Cards Grid: Including Signature Coral Card */}
          <div className="grid grid-cols-2 gap-4">
            {/* Signature Coral Card matching Screenshot 1 Total Earnings */}
            <CoralStatsCard
              title="Active Appointments"
              value={upcomingAppointments.length}
              badgeText="+3 this week"
              subtitle="All Confirmed"
              onClick={() => setActiveView('appointments')}
            />

            <StatsCard
              title="Completed Visits"
              value={myAppointments.filter((a) => a.status === 'completed').length}
              change="+12%"
              subtitle="Total history"
              onClick={() => setActiveView('appointments')}
            />

            <StatsCard
              title="Prescriptions"
              value="4 Active"
              change="+1 Refill"
              subtitle="Cardio & Allergy"
              trend="neutral"
              onClick={() => setActiveView('profile')}
            />

            <StatsCard
              title="Total Doctors Seen"
              value={new Set(myAppointments.map((a) => a.doctorId)).size}
              change="+2 specialists"
              subtitle="Across 3 depts"
              onClick={() => setActiveView('doctors')}
            />
          </div>

          {/* Appointments Bar Chart matching Screenshot 1 */}
          <AppointmentsBarChart />
        </div>
      </div>

      {/* Five Radial Progress Cards - Exactly matching Screenshot 3 */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Personal Health Goals & Monitoring
            </h3>
            <p className="text-xs text-zinc-400">
              Preventive biomarkers and therapy milestone progress
            </p>
          </div>
          <button
            onClick={() => setActiveView('vitals')}
            className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1"
          >
            All Metrics <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <RadialGoalProgressCard
            title="Blood Pressure"
            subtitle="Optimal Target"
            current="118/76"
            target="120/80"
            percentage={74}
            dateBadge="Nov 2026"
            icon={Heart}
            iconColor="text-[#FF5A36]"
            iconBg="bg-[#FFF2EE]"
            onAction={() => setActiveView('vitals')}
          />

          <RadialGoalProgressCard
            title="Cardio Rehab"
            subtitle="Exercise Goal"
            current="16 sessions"
            target="25 sessions"
            percentage={64}
            dateBadge="Q4 2026"
            icon={Activity}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
            onAction={() => setActiveView('vitals')}
          />

          <RadialGoalProgressCard
            title="Lab Screenings"
            subtitle="Annual Health"
            current="5 of 8"
            target="8 tests"
            percentage={63}
            dateBadge="Dec 2026"
            icon={Droplet}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
            onAction={() => setActiveView('vitals')}
          />

          <RadialGoalProgressCard
            title="Physical Therapy"
            subtitle="Mobility Rehab"
            current="2 of 6"
            target="6 weeks"
            percentage={26}
            dateBadge="Jan 2027"
            icon={Flame}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
            onAction={() => setActiveView('vitals')}
          />

          <RadialGoalProgressCard
            title="Vaccination Status"
            subtitle="Immunization"
            current="4 of 5"
            target="5 vaccines"
            percentage={80}
            dateBadge="May 2026"
            icon={CheckCircle2}
            iconColor="text-rose-600"
            iconBg="bg-rose-50"
            onAction={() => setActiveView('vitals')}
          />
        </div>
      </div>

      {/* Recent Activities Table - Exactly matching Screenshot 1 Bottom */}
      <div className="bg-white dark:bg-[#181822] p-5 sm:p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(100,90,140,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Recent Consultations & Bookings
            </h3>
            <p className="text-xs text-zinc-400">
              Complete chronological audit of your medical visits
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input matching Screenshot */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search appointments..."
                className="pl-8 pr-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-white/10 text-xs focus:outline-none focus:border-[#FF5A36] w-48 sm:w-56"
              />
            </div>

            {/* Filter Pill */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 rounded-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-white/10 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none focus:border-[#FF5A36]"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Appointment ID</th>
                <th className="pb-3">Doctor & Specialty</th>
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Fee</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.slice(0, 7).map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3 pl-2 font-mono font-medium text-zinc-900 dark:text-zinc-100">
                      {apt.id}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={apt.doctorAvatar}
                          alt={apt.doctorName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">
                            {apt.doctorName}
                          </p>
                          <p className="text-[10px] text-zinc-400">{apt.doctorSpecialty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">{apt.date}</p>
                      <p className="text-[10px] text-zinc-400">{apt.timeSlot}</p>
                    </td>
                    <td className="py-3 font-medium text-zinc-600 dark:text-zinc-400">
                      {apt.type}
                    </td>
                    <td className="py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                      ${apt.fee}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'confirmed'
                            ? 'bg-[#FFF2EE] text-[#FF5A36] dark:bg-[#2A1814]'
                            : apt.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : apt.status === 'pending'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {apt.status === 'confirmed' && <CheckCircle2 size={10} />}
                        {apt.status === 'completed' && <CheckCircle2 size={10} />}
                        {apt.status === 'cancelled' && <AlertCircle size={10} />}
                        <span className="capitalize">{apt.status}</span>
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => setActiveView('appointments')}
                        className="text-xs font-semibold text-[#FF5A36] hover:underline"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400 text-xs">
                    No appointments match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
