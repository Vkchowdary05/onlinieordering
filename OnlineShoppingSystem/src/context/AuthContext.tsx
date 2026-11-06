import * as React from 'react'
import { User } from '@/types'
import {
  STORAGE_KEYS,
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
} from '@/lib/storage'
import { useToast } from './ToastContext'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password?: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    password?: string
    phone?: string
    street?: string
    city?: string
    state?: string
    zip?: string
  }) => Promise<boolean>
  logout: () => void
  loginAsDemoCustomer: () => void
  loginAsDemoAdmin: () => void
  isAuthModalOpen: boolean
  openAuthModal: (defaultTab?: 'login' | 'register') => void
  closeAuthModal: () => void
  authModalDefaultTab: 'login' | 'register'
}

export const DEMO_CUSTOMER: User = {
  id: 'usr-demo-customer',
  name: 'Sarah Jenkins',
  email: 'customer@demo.com',
  role: 'customer',
  phone: '+1 (555) 382-9912',
  address: {
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
    country: 'United States',
  },
}

export const DEMO_ADMIN: User = {
  id: 'usr-demo-admin',
  name: 'Marcus Vance (Admin)',
  email: 'admin@demo.com',
  role: 'admin',
  phone: '+1 (555) 901-4433',
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast()
  const [user, setUser] = React.useState<User | null>(() =>
    safeLocalStorageGet<User | null>(STORAGE_KEYS.CURRENT_USER, null)
  )
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)
  const [authModalDefaultTab, setAuthModalDefaultTab] = React.useState<'login' | 'register'>('login')

  // Initialize demo users database if not present
  React.useEffect(() => {
    const existingUsers = safeLocalStorageGet<User[]>(STORAGE_KEYS.REGISTERED_USERS, [])
    if (existingUsers.length === 0) {
      safeLocalStorageSet<User[]>(STORAGE_KEYS.REGISTERED_USERS, [DEMO_CUSTOMER, DEMO_ADMIN])
    }
  }, [])

  const openAuthModal = (defaultTab: 'login' | 'register' = 'login') => {
    setAuthModalDefaultTab(defaultTab)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const login = async (email: string): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase()

    if (trimmedEmail === DEMO_ADMIN.email.toLowerCase()) {
      setUser(DEMO_ADMIN)
      safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, DEMO_ADMIN)
      showToast({
        title: 'Welcome Admin!',
        description: `Signed in as Administrator (${DEMO_ADMIN.name})`,
        type: 'success',
      })
      closeAuthModal()
      return true
    }

    if (trimmedEmail === DEMO_CUSTOMER.email.toLowerCase()) {
      setUser(DEMO_CUSTOMER)
      safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, DEMO_CUSTOMER)
      showToast({
        title: 'Welcome Back!',
        description: `Signed in as ${DEMO_CUSTOMER.name}`,
        type: 'success',
      })
      closeAuthModal()
      return true
    }

    // Check user database
    const registeredUsers = safeLocalStorageGet<User[]>(STORAGE_KEYS.REGISTERED_USERS, [])
    const found = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail)
    if (found) {
      setUser(found)
      safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, found)
      showToast({
        title: 'Welcome Back!',
        description: `Signed in as ${found.name}`,
        type: 'success',
      })
      closeAuthModal()
      return true
    }

    showToast({
      title: 'Login Failed',
      description: 'Account not found with this email. Try customer@demo.com or register.',
      type: 'error',
    })
    return false
  }

  const register = async (userData: {
    name: string
    email: string
    password?: string
    phone?: string
    street?: string
    city?: string
    state?: string
    zip?: string
  }): Promise<boolean> => {
    const trimmedEmail = userData.email.trim().toLowerCase()
    const registeredUsers = safeLocalStorageGet<User[]>(STORAGE_KEYS.REGISTERED_USERS, [])

    if (registeredUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      showToast({
        title: 'Registration Error',
        description: 'An account with this email address already exists.',
        type: 'error',
      })
      return false
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      role: 'customer',
      phone: userData.phone?.trim() || '',
      address: {
        street: userData.street?.trim() || '',
        city: userData.city?.trim() || '',
        state: userData.state?.trim() || '',
        zip: userData.zip?.trim() || '',
        country: 'United States',
      },
    }

    const updatedUsers = [...registeredUsers, newUser]
    safeLocalStorageSet(STORAGE_KEYS.REGISTERED_USERS, updatedUsers)
    setUser(newUser)
    safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, newUser)

    showToast({
      title: 'Registration Successful',
      description: `Account created for ${newUser.name}. Welcome to NovaStore!`,
      type: 'success',
    })
    closeAuthModal()
    return true
  }

  const logout = () => {
    setUser(null)
    safeLocalStorageRemove(STORAGE_KEYS.CURRENT_USER)
    showToast({
      title: 'Signed Out',
      description: 'You have been safely signed out.',
      type: 'info',
    })
  }

  const loginAsDemoCustomer = () => {
    setUser(DEMO_CUSTOMER)
    safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, DEMO_CUSTOMER)
    showToast({
      title: 'Customer Mode Active',
      description: `Logged in as ${DEMO_CUSTOMER.name} (${DEMO_CUSTOMER.email})`,
      type: 'success',
    })
    closeAuthModal()
  }

  const loginAsDemoAdmin = () => {
    setUser(DEMO_ADMIN)
    safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, DEMO_ADMIN)
    showToast({
      title: 'Admin Access Granted',
      description: `Logged in as ${DEMO_ADMIN.name}`,
      type: 'success',
    })
    closeAuthModal()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        loginAsDemoCustomer,
        loginAsDemoAdmin,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalDefaultTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
