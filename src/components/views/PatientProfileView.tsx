import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Shield,
  Phone,
  Mail,
  Calendar,
  Heart,
  AlertTriangle,
  CreditCard,
  Save,
  CheckCircle2,
  Lock,
  Wifi,
} from 'lucide-react'
import { useMediCare } from '../../context/MediCareContext'

export const PatientProfileView: React.FC = () => {
  const { currentPatientProfile, currentUser, updatePatientProfile } = useMediCare()

  const [name, setName] = useState(currentUser.name || 'Sarah Connor')
  const [email, setEmail] = useState(currentUser.email || 'sarah.connor@gmail.com')
  const [phone, setPhone] = useState(currentPatientProfile?.phone || '+1 (555) 234-5678')
  const [dob, setDob] = useState(currentPatientProfile?.dob || '1988-06-14')
  const [gender, setGender] = useState(currentPatientProfile?.gender || 'Female')
  const [bloodGroup, setBloodGroup] = useState(currentPatientProfile?.bloodGroup || 'O+')
  const [allergies, setAllergies] = useState(
    currentPatientProfile?.allergies.join(', ') || 'Penicillin, Sulfa drugs'
  )
  const [chronicConditions, setChronicConditions] = useState(
    currentPatientProfile?.chronicConditions.join(', ') || 'Mild Asthma'
  )

  // Emergency contact
  const [emerName, setEmerName] = useState(currentPatientProfile?.emergencyContact.name || 'John Connor')
  const [emerPhone, setEmerPhone] = useState(currentPatientProfile?.emergencyContact.phone || '+1 (555) 987-6543')
  const [emerRel, setEmerRel] = useState(currentPatientProfile?.emergencyContact.relation || 'Son')

  // Insurance
  const [insuranceProvider, setInsuranceProvider] = useState(
    currentPatientProfile?.insuranceProvider || 'BlueCross Health Premier'
  )
  const [policyNumber, setPolicyNumber] = useState(
    currentPatientProfile?.policyNumber || 'BC-99201488'
  )

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updatePatientProfile({
      name,
      email,
      phone,
      dob,
      gender: gender as any,
      bloodGroup: bloodGroup as any,
      allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
      chronicConditions: chronicConditions.split(',').map((s) => s.trim()).filter(Boolean),
      emergencyContact: {
        name: emerName,
        phone: emerPhone,
        relation: emerRel,
      },
      insuranceProvider,
      policyNumber,
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2.5">
            <User className="text-[#FF5A36]" /> Electronic Patient Record & Profile
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Personal health details, emergency contact matrix, and insurance coverage.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#FF5A36] hover:bg-[#E84A28] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Save size={15} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Digital Health Card (Inspired by Screenshot 2 "Your cards") */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#181822] p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Digital Medical Pass
            </h3>

            {/* Realistic Black Sleek Medical Card - Matching Screenshot 2 Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white p-6 rounded-2xl shadow-xl relative overflow-hidden aspect-[1.58/1] flex flex-col justify-between border border-white/10"
            >
              {/* Top Card Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FF5A36] flex items-center justify-center font-black text-xs text-white">
                    +
                  </div>
                  <span className="font-extrabold tracking-wider text-xs">MEDICARE PASS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    ACTIVE
                  </span>
                  <Wifi size={14} className="text-white/60 rotate-90" />
                </div>
              </div>

              {/* Middle Chip / ID */}
              <div className="my-auto">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                  Patient Health Number
                </p>
                <p className="text-base sm:text-lg font-mono tracking-widest font-bold mt-0.5">
                  •••• •••• 6782
                </p>
              </div>

              {/* Bottom Card Row */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-wider">Patient Name</p>
                  <p className="text-xs font-bold uppercase tracking-wide">{name}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/50 uppercase tracking-wider">Blood Type</p>
                  <p className="text-xs font-bold text-[#FF5A36]">{bloodGroup}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-white/50 uppercase tracking-wider">Exp Date</p>
                  <p className="text-xs font-mono font-bold">09/29</p>
                </div>
              </div>

              {/* Ambient Glow */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#FF5A36]/10 rounded-full blur-2xl pointer-events-none" />
            </motion.div>

            {/* Quick Card Controls - Matching Screenshot 2 Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <button
                type="button"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold flex flex-col items-center gap-1 transition-colors"
              >
                <Lock size={14} className="text-zinc-500" /> Freeze Pass
              </button>
              <button
                type="button"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold flex flex-col items-center gap-1 transition-colors"
              >
                <CreditCard size={14} className="text-zinc-500" /> Card Details
              </button>
              <button
                type="button"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold flex flex-col items-center gap-1 transition-colors"
              >
                <Phone size={14} className="text-zinc-500" /> SOS Call
              </button>
              <button
                type="button"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold flex flex-col items-center gap-1 transition-colors"
              >
                <Shield size={14} className="text-zinc-500" /> Coverage
              </button>
            </div>
          </div>

          {/* Insurance Information Box */}
          <div className="bg-white dark:bg-[#181822] p-6 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Shield size={15} className="text-emerald-500" /> Verified Health Insurance
            </h4>
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Carrier:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{insuranceProvider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Policy Number:</span>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Copay Specialist:</span>
                <span className="font-bold text-emerald-600">$20.00 / visit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#181822] p-6 sm:p-7 rounded-3xl border border-zinc-200/70 dark:border-white/5 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {/* Personal Details */}
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                1. Personal Identification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Medical Biomarkers */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                2. Clinical & Diagnostic Parameters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1 text-rose-600">
                    Known Drug & Food Allergies
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Latex, Peanuts"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Chronic Conditions
                  </label>
                  <input
                    type="text"
                    value={chronicConditions}
                    onChange={(e) => setChronicConditions(e.target.value)}
                    placeholder="e.g. Hypertension, Mild Asthma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                3. Emergency Contact Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={emerName}
                    onChange={(e) => setEmerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={emerPhone}
                    onChange={(e) => setEmerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={emerRel}
                    onChange={(e) => setEmerRel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-7 rounded-full bg-[#FF5A36] hover:bg-[#E84A28] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <Save size={14} /> Update Medical Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
