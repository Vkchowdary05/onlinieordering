import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Stethoscope,
  CalendarPlus,
  CalendarCheck,
  Activity,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useMediCare } from '../context/MediCareContext'
import { SidebarV14 } from '../components/layout/SidebarV14'
import { NavbarV14 } from '../components/layout/NavbarV14'
import { PatientDashboardView } from '../components/views/PatientDashboardView'
import { DoctorsView } from '../components/views/DoctorsView'
import { BookAppointmentView } from '../components/views/BookAppointmentView'
import { MyAppointmentsView } from '../components/views/MyAppointmentsView'
import { AdminDashboardView } from '../components/views/AdminDashboardView'
import { PatientProfileView } from '../components/views/PatientProfileView'
import { HealthGoalsView } from '../components/views/HealthGoalsView'

export const Route = createFileRoute('/')({ component: MediCareApp })

function MediCareApp() {
  const { activeView, setActiveView, currentUser } = useMediCare()

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return currentUser.role === 'admin' ? (
          <AdminDashboardView />
        ) : (
          <PatientDashboardView />
        )
      case 'doctors':
        return <DoctorsView />
      case 'book':
        return <BookAppointmentView />
      case 'appointments':
        return <MyAppointmentsView />
      case 'vitals':
        return <HealthGoalsView />
      case 'admin':
        return <AdminDashboardView />
      case 'profile':
        return <PatientProfileView />
      default:
        return <PatientDashboardView />
    }
  }

  const mobileNavItems = [
    { id: 'overview', label: 'Home', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'book', label: 'Book', icon: CalendarPlus, highlight: true },
    { id: 'appointments', label: 'Visits', icon: CalendarCheck },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="flex min-h-screen bg-[#ECEBF4] dark:bg-[#0E0E14] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Slim Vertical Icon Sidebar - Dashboard V14 Left Rail */}
      <SidebarV14 />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Compact Horizontal Pill Navigation Bar */}
        <NavbarV14 />

        {/* Dynamic Route Content with Framer Motion Page Transition */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView + '-' + currentUser.role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Docked Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#181824]/90 backdrop-blur-md border-t border-zinc-200/80 dark:border-white/10 px-4 py-2 flex items-center justify-around shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                item.highlight
                  ? 'text-[#FF5A36]'
                  : isActive
                  ? 'text-zinc-900 dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl ${
                  item.highlight
                    ? 'bg-[#FF5A36] text-white shadow-xs'
                    : isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : ''
                }`}
              >
                <Icon size={18} />
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
