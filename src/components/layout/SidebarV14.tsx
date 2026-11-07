import React from 'react'
import {
  LayoutDashboard,
  CalendarCheck,
  Stethoscope,
  CalendarPlus,
  Activity,
  ShieldCheck,
  User,
  Sun,
  Moon,
  RotateCcw,
  HelpCircle,
} from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'

export const SidebarV14: React.FC = () => {
  const { activeView, setActiveView, currentUser, resetToDefaultData, addToast } = useMediCare()
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'book', label: 'Book Visit', icon: CalendarPlus },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
    { id: 'vitals', label: 'Health Vitals', icon: Activity },
    { id: 'admin', label: 'Admin Hub', icon: ShieldCheck, adminOnly: true },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <aside className="hidden lg:flex flex-col items-center justify-between w-20 py-6 px-3 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 z-40 select-none">
      {/* Top: Theme Toggle & Brand Mark */}
      <div className="flex flex-col items-center gap-4">
        {/* Black & White Logo Icon */}
        <div className="w-11 h-11 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-extrabold text-lg cursor-pointer border border-zinc-800 dark:border-zinc-200">
          M
        </div>

        {/* Sun / Moon Toggle Switch */}
        <div className="flex flex-col items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => !isDark || toggleTheme()}
            title="Light Theme"
            className={`p-1.5 rounded-full ${
              !isDark
                ? 'bg-white text-black shadow-xs'
                : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Sun size={14} />
          </button>
          <button
            onClick={() => isDark || toggleTheme()}
            title="Dark Theme"
            className={`p-1.5 rounded-full ${
              isDark
                ? 'bg-black text-white shadow-xs'
                : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Moon size={14} />
          </button>
        </div>
      </div>

      {/* Center: Slim Vertical Nav Rail */}
      <nav className="flex flex-col items-center gap-2.5 my-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveView(item.id)}
                className={`relative w-11 h-11 rounded-2xl flex items-center justify-center ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white shadow-xs'
                    : 'text-zinc-500 hover:text-black hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900'
                }`}
                title={item.label}
              >
                <Icon size={19} />
                {isActive && (
                  <div
                    className="absolute -right-1 w-1.5 h-1.5 rounded-full bg-black dark:bg-white"
                  />
                )}
              </button>

              {/* Tooltip */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 z-50 whitespace-nowrap shadow-md border border-zinc-800 dark:border-zinc-200">
                {item.label}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Bottom: Reset data, Help, and Avatar */}
      <div className="flex flex-col items-center gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={resetToDefaultData}
          title="Reset Demo Data"
          className="p-2 rounded-xl text-zinc-500 hover:text-black hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-white"
        >
          <RotateCcw size={17} />
        </button>

        {/* Quick Help Modal Trigger */}
        <button
          onClick={() =>
            addToast(
              'MediCare Assistant',
              'Need help? Contact hospital 24/7 hotline at +1 (800) 555-CARE.',
              'info'
            )
          }
          title="Help & Info"
          className="p-2 rounded-xl text-zinc-500 hover:text-black hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-white"
        >
          <HelpCircle size={17} />
        </button>

        {/* User Avatar */}
        <div
          onClick={() => setActiveView('profile')}
          className="relative cursor-pointer mt-1"
          title={`Logged in as ${currentUser.name}`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-2xl object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black" />
        </div>
      </div>
    </aside>
  )
}
