import React, { useState } from 'react'
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
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 bg-white dark:bg-black px-3 sm:px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Brand Pill */}
        <div
          onClick={() => setActiveView('overview')}
          className="flex items-center gap-2.5 cursor-pointer pr-2 select-none"
        >
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-sm">
            +
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-black dark:text-white hidden sm:inline">
            MediCare
          </span>
        </div>

        {/* Compact Pill Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full border border-zinc-200 dark:border-zinc-800">
          {tabs.map((tab) => {
            const isActive = activeView === tab.id
            return (
              <button
                key={tab.id}
                data-testid={`nav-${tab.id}`}
                onClick={() => setActiveView(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
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
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-black dark:text-white text-xs font-semibold border border-zinc-200 dark:border-zinc-800"
            title="Sign In or Register"
          >
            <LogIn size={13} />
            <span>Sign In / Register</span>
          </button>

          {/* Quick Role Switcher Pill */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold">
            <button
              data-testid="btn-switch-role-patient"
              onClick={() => switchRole('patient')}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 ${
                currentUser.role === 'patient'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <User size={12} />
              <span className="hidden sm:inline">Patient</span>
            </button>
            <button
              data-testid="btn-switch-role-admin"
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 ${
                currentUser.role === 'admin'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
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
              className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-black dark:text-white relative border border-zinc-200 dark:border-zinc-800"
              title="Notifications"
            >
              <Bell size={16} />
              {upcomingCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-950 rounded-2xl p-4 shadow-xl border border-zinc-200 dark:border-zinc-800 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-3">
                  <h4 className="text-xs font-bold text-black dark:text-white">
                    Hospital Updates & Alerts
                  </h4>
                  <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full font-semibold border border-zinc-200 dark:border-zinc-800">
                    {upcomingCount} Upcoming
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs border border-zinc-200 dark:border-zinc-800">
                    <p className="font-semibold text-black dark:text-white flex items-center gap-1">
                      <Calendar size={12} /> Confirmed Consultations
                    </p>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                      You have {upcomingCount} active scheduled appointments this week.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 text-xs border border-zinc-100 dark:border-zinc-800">
                    <p className="font-semibold text-black dark:text-white">
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
                  className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-black dark:text-white hover:underline"
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
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer border border-zinc-200 dark:border-zinc-800"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-600"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-black dark:text-white leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-zinc-500 leading-tight capitalize">
                {currentUser.role} Account
              </span>
            </div>
            <ChevronDown size={14} className="text-zinc-400 hidden sm:inline" />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Auth Modal (Login / Register) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-300 dark:border-zinc-800 relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 text-zinc-500 hover:text-black dark:hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-sm">
                +
              </div>
              <h3 className="text-base font-bold text-black dark:text-white">
                MediCare Access Portal
              </h3>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full mb-5 border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                data-testid="tab-login"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold ${
                  authMode === 'login'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                Patient Sign In
              </button>
              <button
                type="button"
                data-testid="tab-register"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold ${
                  authMode === 'register'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    data-testid="btn-login-submit"
                    className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black font-bold text-xs shadow-xs"
                  >
                    Sign In to Dashboard
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500 text-center">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    data-testid="btn-register-submit"
                    className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black font-bold text-xs shadow-xs"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveView(tab.id)
                setMobileMenuOpen(false)
              }}
              className={`px-4 py-2.5 rounded-xl text-left text-xs font-bold ${
                activeView === tab.id
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
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
            className="mt-2 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-center text-xs font-bold text-black dark:text-white"
          >
            Sign In / Register
          </button>
        </div>
      )}
    </header>
  )
}
