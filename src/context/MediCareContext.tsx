import React, { createContext, useContext, useState, useEffect } from 'react'
import type {
  Doctor,
  Appointment,
  Patient,
  User,
  UserRole,
  ToastNotification,
  AppointmentStatus,
} from '../types/medicare'
import {
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_PATIENTS,
  DEMO_USERS,
} from '../data/seedData'

interface MediCareContextType {
  currentUser: User
  doctors: Doctor[]
  appointments: Appointment[]
  patients: Patient[]
  currentPatientProfile: Patient | undefined
  toasts: ToastNotification[]
  isHydrated: boolean
  activeView: string
  setActiveView: (view: string) => void
  switchRole: (role: UserRole) => void
  registerPatient: (name: string, email: string, phone: string, bloodGroup?: string) => { success: boolean; message: string; user?: User }
  loginUser: (email: string, role?: UserRole) => { success: boolean; message: string; user?: User }
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  bookAppointment: (params: {
    doctorId: string
    date: string
    timeSlot: string
    type: 'In-Person' | 'Video Call'
    reason: string
    notes?: string
    patientName?: string
    patientEmail?: string
    patientPhone?: string
  }) => { success: boolean; error?: string; appointment?: Appointment }
  cancelAppointment: (appointmentId: string, reason: string) => boolean
  rescheduleAppointment: (appointmentId: string, newDate: string, newSlot: string) => { success: boolean; error?: string }
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void
  addDoctor: (doctor: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => void
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void
  deleteDoctor: (id: string) => void
  updatePatientProfile: (profile: Partial<Patient>) => void
  resetToDefaultData: () => void
  isSlotAvailable: (doctorId: string, date: string, timeSlot: string, excludeAppointmentId?: string) => boolean
}

const MediCareContext = createContext<MediCareContextType | null>(null)

const STORAGE_KEYS = {
  DOCTORS: 'medicare_doctors_v2',
  APPOINTMENTS: 'medicare_appointments_v2',
  PATIENTS: 'medicare_patients_v2',
  USER: 'medicare_current_user_v2',
}

export function MediCareProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.patient)
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS)
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS)
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS)
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [activeView, setActiveView] = useState('overview')

  // Safe client-side hydration
  useEffect(() => {
    try {
      const storedDoctors = localStorage.getItem(STORAGE_KEYS.DOCTORS)
      if (storedDoctors) {
        setDoctors(JSON.parse(storedDoctors))
      } else {
        localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS))
      }

      const storedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments))
      } else {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS))
      }

      const storedPatients = localStorage.getItem(STORAGE_KEYS.PATIENTS)
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients))
      } else {
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS))
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      }
    } catch (e) {
      console.error('Failed to load Medicare state from localStorage:', e)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Sync state changes to localStorage
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors))
    } catch (e) {
      console.error(e)
    }
  }, [doctors, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments))
    } catch (e) {
      console.error(e)
    }
  }, [appointments, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients))
    } catch (e) {
      console.error(e)
    }
  }, [patients, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser))
    } catch (e) {
      console.error(e)
    }
  }, [currentUser, isHydrated])

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      removeToast(id)
    }, 4500)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const switchRole = (role: UserRole) => {
    const newUser = DEMO_USERS[role]
    setCurrentUser(newUser)
    addToast('Role Switched', `Logged in as ${newUser.name} (${role.toUpperCase()})`, 'info')
  }

  const registerPatient = (
    name: string,
    email: string,
    phone: string,
    bloodGroup: string = 'O+'
  ): { success: boolean; message: string; user?: User } => {
    if (!name || !email) {
      addToast('Registration Failed', 'Name and email are required.', 'error')
      return { success: false, message: 'Name and email are required.' }
    }

    const newPatientId = `pat-${Date.now()}`
    const newPatient: Patient = {
      id: newPatientId,
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      dob: '1995-01-01',
      gender: 'Other',
      bloodGroup: (bloodGroup as any) || 'O+',
      allergies: [],
      chronicConditions: [],
      emergencyContact: {
        name: 'Emergency Contact',
        phone: phone || '+1 (555) 000-0000',
        relation: 'Family',
      },
      insuranceProvider: 'Standard Healthcare',
      policyNumber: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
    }

    const newUser: User = {
      id: newPatientId,
      name,
      email,
      role: 'patient',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    }

    setPatients((prev) => [newPatient, ...prev])
    setCurrentUser(newUser)
    setActiveView('overview')
    addToast(
      'Registration Successful',
      `Welcome to MediCare, ${name}! Your account has been created.`,
      'success'
    )

    return { success: true, message: 'Registration successful', user: newUser }
  }

  const loginUser = (
    email: string,
    role: UserRole = 'patient'
  ): { success: boolean; message: string; user?: User } => {
    if (!email) {
      addToast('Login Failed', 'Email is required to sign in.', 'error')
      return { success: false, message: 'Email is required to sign in.' }
    }

    if (role === 'admin' || email.toLowerCase().includes('admin')) {
      const adminUser = DEMO_USERS.admin
      setCurrentUser(adminUser)
      setActiveView('overview')
      addToast('Login Successful', `Welcome back, ${adminUser.name}!`, 'success')
      return { success: true, message: 'Login successful', user: adminUser }
    }

    const existingPatient = patients.find(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    )

    const user: User = existingPatient
      ? {
          id: existingPatient.id,
          name: existingPatient.name,
          email: existingPatient.email,
          role: 'patient',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        }
      : {
          id: `pat-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' '),
          email: email,
          role: 'patient',
          avatar:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        }

    setCurrentUser(user)
    setActiveView('overview')
    addToast('Login Successful', `Welcome back, ${user.name}!`, 'success')
    return { success: true, message: 'Login successful', user }
  }

  const currentPatientProfile = patients.find((p) => p.email === currentUser.email) || patients[0]

  // Slot availability & double booking check
  const isSlotAvailable = (
    doctorId: string,
    date: string,
    timeSlot: string,
    excludeAppointmentId?: string
  ): boolean => {
    // Check doctor exists and is active
    const doc = doctors.find((d) => d.id === doctorId)
    if (!doc || !doc.isActive) return false

    // Check if slot is in doctor's available slots
    if (!doc.availableSlots.includes(timeSlot)) return false

    // Check against existing appointments
    const conflict = appointments.some(
      (apt) =>
        apt.doctorId === doctorId &&
        apt.date === date &&
        apt.timeSlot === timeSlot &&
        (apt.status === 'confirmed' || apt.status === 'pending') &&
        (!excludeAppointmentId || apt.id !== excludeAppointmentId)
    )

    return !conflict
  }

  const bookAppointment = (params: {
    doctorId: string
    date: string
    timeSlot: string
    type: 'In-Person' | 'Video Call'
    reason: string
    notes?: string
    patientName?: string
    patientEmail?: string
    patientPhone?: string
  }) => {
    const todayStr = new Date().toISOString().split('T')[0]

    // 1. Prevent past date bookings
    if (params.date < todayStr) {
      addToast('Invalid Date', 'Cannot book appointments for past dates.', 'error')
      return { success: false, error: 'Cannot book appointments for past dates.' }
    }

    // 2. Prevent double booking / unavailable slots
    if (!isSlotAvailable(params.doctorId, params.date, params.timeSlot)) {
      addToast(
        'Slot Unavailable',
        'This time slot is already booked or unavailable for this physician. Please choose another time.',
        'error'
      )
      return {
        success: false,
        error: 'This time slot is already booked. Please choose another time.',
      }
    }

    const doc = doctors.find((d) => d.id === params.doctorId)
    if (!doc) {
      return { success: false, error: 'Selected doctor could not be found.' }
    }

    const patientName = params.patientName || currentUser.name
    const patientEmail = params.patientEmail || currentUser.email
    const patientPhone = params.patientPhone || currentPatientProfile?.phone || '+1 (555) 234-5678'

    const newAppointment: Appointment = {
      id: `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: currentUser.id,
      patientName,
      patientEmail,
      patientPhone,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      doctorAvatar: doc.avatar,
      date: params.date,
      timeSlot: params.timeSlot,
      type: params.type,
      status: 'confirmed',
      reason: params.reason,
      notes: params.notes,
      paymentStatus: 'paid',
      fee: doc.consultationFee,
      room: doc.room,
      createdAt: new Date().toISOString(),
    }

    setAppointments((prev) => [newAppointment, ...prev])
    addToast(
      'Appointment Confirmed',
      `Your appointment with ${doc.name} on ${params.date} at ${params.timeSlot} is confirmed!`,
      'success'
    )

    return { success: true, appointment: newAppointment }
  }

  const cancelAppointment = (appointmentId: string, reason: string): boolean => {
    let updated = false
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          updated = true
          return {
            ...apt,
            status: 'cancelled',
            cancellationReason: reason || 'Cancelled by patient',
          }
        }
        return apt
      })
    )

    if (updated) {
      addToast('Appointment Cancelled', 'The appointment was cancelled and the slot has been freed.', 'info')
    }
    return updated
  }

  const rescheduleAppointment = (
    appointmentId: string,
    newDate: string,
    newSlot: string
  ): { success: boolean; error?: string } => {
    const todayStr = new Date().toISOString().split('T')[0]
    if (newDate < todayStr) {
      addToast('Invalid Date', 'Cannot reschedule to a past date.', 'error')
      return { success: false, error: 'Cannot reschedule to a past date.' }
    }

    const currentApt = appointments.find((a) => a.id === appointmentId)
    if (!currentApt) {
      return { success: false, error: 'Appointment not found.' }
    }

    if (!isSlotAvailable(currentApt.doctorId, newDate, newSlot, appointmentId)) {
      addToast('Slot Busy', 'Selected slot is already reserved. Please choose another time.', 'error')
      return { success: false, error: 'Selected slot is already reserved.' }
    }

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            date: newDate,
            timeSlot: newSlot,
            status: 'confirmed',
          }
        }
        return apt
      })
    )

    addToast(
      'Appointment Rescheduled',
      `Rescheduled successfully for ${newDate} at ${newSlot}.`,
      'success'
    )
    return { success: true }
  }

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
    )
    addToast('Status Updated', `Appointment ${appointmentId} updated to ${status.toUpperCase()}.`, 'info')
  }

  const addDoctor = (doctorData: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => {
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
    }
    setDoctors((prev) => [newDoc, ...prev])
    addToast('Doctor Added', `${newDoc.name} has been added to the hospital directory.`, 'success')
  }

  const updateDoctor = (id: string, doctorData: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...doctorData } : doc))
    )
    addToast('Doctor Updated', 'Doctor details updated successfully.', 'success')
  }

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== id))
    addToast('Doctor Removed', 'Physician removed from active roster.', 'info')
  }

  const updatePatientProfile = (profileData: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === currentPatientProfile?.id) {
          return { ...p, ...profileData }
        }
        return p
      })
    )
    if (profileData.name && currentUser.role === 'patient') {
      setCurrentUser((prev) => ({ ...prev, name: profileData.name! }))
    }
    addToast('Profile Saved', 'Your medical profile was updated successfully.', 'success')
  }

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.DOCTORS)
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS)
    localStorage.removeItem(STORAGE_KEYS.PATIENTS)
    localStorage.removeItem(STORAGE_KEYS.USER)
    setDoctors(INITIAL_DOCTORS)
    setAppointments(INITIAL_APPOINTMENTS)
    setPatients(INITIAL_PATIENTS)
    setCurrentUser(DEMO_USERS.patient)
    addToast('System Reset', 'All MediCare demo data has been reset to defaults.', 'info')
  }

  return (
    <MediCareContext.Provider
      value={{
        currentUser,
        doctors,
        appointments,
        patients,
        currentPatientProfile,
        toasts,
        isHydrated,
        activeView,
        setActiveView,
        switchRole,
        registerPatient,
        loginUser,
        addToast,
        removeToast,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        updateAppointmentStatus,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        updatePatientProfile,
        resetToDefaultData,
        isSlotAvailable,
      }}
    >
      {children}
    </MediCareContext.Provider>
  )
}

export function useMediCare() {
  const context = useContext(MediCareContext)
  if (!context) {
    throw new Error('useMediCare must be used within a MediCareProvider')
  }
  return context
}
