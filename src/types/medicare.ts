export type Specialty =
  | 'Cardiology'
  | 'Neurology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'Dermatology'
  | 'Oncology'
  | 'General Medicine'
  | 'Ophthalmology'
  | 'Psychiatry'
  | 'Gynecology'

export interface Doctor {
  id: string
  name: string
  title: string
  specialty: Specialty
  avatar: string
  rating: number
  reviewCount: number
  experienceYears: number
  consultationFee: number
  room: string
  department: string
  bio: string
  education: string[]
  availableDays: string[]
  availableSlots: string[]
  isActive: boolean
  languages: string[]
  featured?: boolean
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'
export type ConsultationType = 'In-Person' | 'Video Call'

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone: string
  doctorId: string
  doctorName: string
  doctorSpecialty: Specialty
  doctorAvatar: string
  date: string // YYYY-MM-DD
  timeSlot: string // e.g., "09:30 AM"
  type: ConsultationType
  status: AppointmentStatus
  reason: string
  notes?: string
  paymentStatus: 'paid' | 'pending' | 'insurance'
  fee: number
  room: string
  cancellationReason?: string
  createdAt: string
}

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dob: string
  gender: 'Male' | 'Female' | 'Other'
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  allergies: string[]
  chronicConditions: string[]
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
  insuranceProvider: string
  policyNumber: string
}

export type UserRole = 'patient' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
}

export interface HealthVital {
  title: string
  value: string
  unit: string
  percentage: number
  status: 'normal' | 'optimal' | 'warning'
  change: string
}

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message: string
}
