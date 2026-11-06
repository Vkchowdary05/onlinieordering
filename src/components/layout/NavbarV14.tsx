import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  ChevronDown,
  Shield,
  User,
  Menu,
  X,
  Calendar,
  LogIn,
} from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'

export const NavbarV14: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    switchRole,
    registerPatient,
    loginUser,
    appointments,
  } = useMediCare()

  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'book', label: 'Book Appointment' },
    { id: 'appointments', label: 'My Appointments' },
    { id: 'vitals', label: 'Health Goals' },
    { id: 'admin', label: 'Admin Hub' },
    { id: 'profile', label: 'Profile' },
  ]

  const upcomingCount = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  ).length

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const res = loginUser(loginEmail, 'patient')
    if (res.success) {
      setAuthModalOpen(false)
      setLoginEmail('')
    }
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const res = registerPatient(regName, regEmail, regPhone)
    if (res.success) {
      setAuthModalOpen(false)
      setRegName('')
      setRegEmail('')
      setRegPhone('')
    }
  }

  return (
    <header className="w-full sticky top-0 z-30 pt-3 pb-2 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 bg-white/80 dark:bg-[#181824]/90 backdrop-blur-md px-3 sm:px-5 py-2.5 rounded-full border border-zinc-200/70 dark:border-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {/* Brand Pill */}
        <div
          onClick={() => setActiveView('overview')}
          className="flex items-center gap-2.5 cursor-pointer pr-2 select-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5A36] to-[#FF4522] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#FF5A36]/30">
            +
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100 hidden sm:inline">
            MediCare
          </span>
        </div>

        {/* Compact Pill Tabs (Desktop) - Exactly matching Screenshot 1 */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/60 p-1 rounded-full border border-zinc-200/50 dark:border-white/5">
          {tabs.map((tab) => {
            const isActive = activeView === tab.id
            return (
              <button
                key={tab.id}
                data-testid={`nav-${tab.id}`}
                onClick={() => setActiveView(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="pill-nav-active-bg"
                    className="absolute inset-0 bg-zinc-900 dark:bg-white rounded-full -z-10 shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={isActive ? 'text-white dark:text-zinc-900 font-bold' : ''}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Right Section Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sign In / Register Trigger */}
          <button
            data-testid="btn-auth-modal"
            onClick={() => setAuthModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all"
            title="Sign In or Register"
          >
            <LogIn size={13} />
            <span>Sign In / Register</span>
          </button>

          {/* Quick Role Switcher Pill */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-full border border-zinc-200/60 dark:border-white/5 text-[11px] font-semibold">
            <button
              data-testid="btn-switch-role-patient"
              onClick={() => switchRole('patient')}
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                currentUser.role === 'patient'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <User size={12} />
              <span className="hidden sm:inline">Patient</span>
            </button>
            <button
              data-testid="btn-switch-role-admin"
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                currentUser.role === 'admin'
                  ? 'bg-[#FF5A36] text-white shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Shield size={12} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Notifications Pill */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors relative"
              title="Notifications"
            >
              <Bell size={16} />
              {upcomingCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF5A36] rounded-full border-2 border-white dark:border-zinc-900" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#181824] rounded-2xl p-4 shadow-xl border border-zinc-200 dark:border-white/10 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-3">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Hospital Updates & Alerts
                  </h4>
                  <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full font-semibold">
                    {upcomingCount} Upcoming
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="p-2.5 rounded-xl bg-[#FFF2EE] dark:bg-[#2A1814] text-xs">
                    <p className="font-semibold text-[#FF5A36] flex items-center gap-1">
                      <Calendar size={12} /> Confirmed Consultations
                    </p>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                      You have {upcomingCount} active scheduled appointments this week.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-xs">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Annual Health Screening
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Fall seasonal vaccination drives are now open in Suite 108.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false)
                    setActiveView('appointments')
                  }}
                  className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-[#FF5A36] hover:underline"
                >
                  View All Appointments
                </button>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div
            data-testid="user-profile-pill"
            onClick={() => setActiveView('profile')}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-zinc-100/90 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 cursor-pointer transition-all border border-zinc-200/50 dark:border-white/5"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-600"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-zinc-400 leading-tight capitalize">
                {currentUser.role} Account
              </span>
            </div>
            <ChevronDown size={14} className="text-zinc-400 hidden sm:inline" />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Auth Modal (Login / Register) */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#181824] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-white/10 relative"
            >
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#FF5A36] flex items-center justify-center text-white font-bold text-sm">
                  +
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  MediCare Access Portal
                </h3>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full mb-5">
                <button
                  type="button"
                  data-testid="tab-login"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                      : 'text-zinc-500'
                  }`}
                >
                  Patient Sign In
                </button>
                <button
                  type="button"
                  data-testid="tab-register"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                    authMode === 'register'
                      ? 'bg-[#FF5A36] text-white shadow-xs'
                      : 'text-zinc-500'
                  }`}
                >
                  New Registration
                </button>
              </div>

              {/* Login Form */}
              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      data-testid="input-login-email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. sarah.connor@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      data-testid="btn-login-submit"
                      className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs shadow-xs transition-all active:scale-95"
                    >
                      Sign In to Dashboard
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 text-center">
                    Demo accounts: <strong>sarah.connor@gmail.com</strong> or{' '}
                    <strong>admin@medicare-health.org</strong>
                  </p>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      data-testid="input-register-name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Jonathan Archer"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      data-testid="input-register-email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. j.archer@enterprise.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      data-testid="input-register-phone"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 777-8888"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      data-testid="btn-register-submit"
                      className="w-full py-2.5 rounded-xl bg-[#FF5A36] hover:bg-[#E84A28] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                    >
                      Complete Registration
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 p-4 bg-white dark:bg-[#181824] rounded-3xl border border-zinc-200 dark:border-white/10 shadow-xl flex flex-col gap-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveView(tab.id)
                setMobileMenuOpen(false)
              }}
              className={`px-4 py-2.5 rounded-2xl text-left text-xs font-bold transition-all ${
                activeView === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              setAuthModalOpen(true)
            }}
            className="mt-2 py-2.5 rounded-2xl bg-zinc-100 text-center text-xs font-bold text-zinc-800"
          >
            Sign In / Register
          </button>
        </motion.div>
      )}
    </header>
  )
}
