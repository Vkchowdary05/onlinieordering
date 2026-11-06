import * as React from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAuth } from '@/context/AuthContext'
import { UserCheck, Shield, Sparkles, Lock, Mail, User, Phone, MapPin } from 'lucide-react'

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalDefaultTab,
    login,
    register,
    loginAsDemoCustomer,
    loginAsDemoAdmin,
  } = useAuth()

  const [activeTab, setActiveTab] = React.useState<string>(authModalDefaultTab)
  const [isLoading, setIsLoading] = React.useState(false)

  // Login Form State
  const [loginEmail, setLoginEmail] = React.useState('customer@demo.com')
  const [loginPassword, setLoginPassword] = React.useState('password123')
  const [loginErrors, setLoginErrors] = React.useState<{ [key: string]: string }>({})

  // Register Form State
  const [regName, setRegName] = React.useState('')
  const [regEmail, setRegEmail] = React.useState('')
  const [regPassword, setRegPassword] = React.useState('')
  const [regPhone, setRegPhone] = React.useState('')
  const [regStreet, setRegStreet] = React.useState('')
  const [regCity, setRegCity] = React.useState('')
  const [regState, setRegState] = React.useState('')
  const [regZip, setRegZip] = React.useState('')
  const [regErrors, setRegErrors] = React.useState<{ [key: string]: string }>({})

  React.useEffect(() => {
    setActiveTab(authModalDefaultTab)
  }, [authModalDefaultTab, isAuthModalOpen])

  const validateLogin = () => {
    const errors: { [key: string]: string } = {}
    if (!loginEmail.trim()) {
      errors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = 'Enter a valid email address'
    }
    if (!loginPassword.trim()) {
      errors.password = 'Password is required'
    }
    setLoginErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateLogin()) return

    setIsLoading(true)
    try {
      await login(loginEmail, loginPassword)
    } finally {
      setIsLoading(false)
    }
  }

  const validateRegister = () => {
    const errors: { [key: string]: string } = {}
    if (!regName.trim()) errors.name = 'Full name is required'
    if (!regEmail.trim()) {
      errors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(regEmail)) {
      errors.email = 'Enter a valid email address'
    }
    if (!regPassword.trim() || regPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (!regPhone.trim()) errors.phone = 'Phone number is required'
    if (!regStreet.trim()) errors.street = 'Street address is required'
    if (!regCity.trim()) errors.city = 'City is required'
    if (!regState.trim()) errors.state = 'State is required'
    if (!regZip.trim()) errors.zip = 'ZIP Code is required'

    setRegErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateRegister()) return

    setIsLoading(true)
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        street: regStreet,
        city: regCity,
        state: regState,
        zip: regZip,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} maxWidth="md">
      <div className="p-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          {/* Quick Demo Credentials Box */}
          <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Instant Demo One-Click Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                data-testid="demo-customer-btn"
                variant="outline"
                size="sm"
                className="bg-white text-xs h-9 justify-start gap-2 border-zinc-200"
                onClick={loginAsDemoCustomer}
              >
                <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="truncate">Demo Customer</span>
              </Button>
              <Button
                type="button"
                data-testid="demo-admin-btn"
                variant="outline"
                size="sm"
                className="bg-white text-xs h-9 justify-start gap-2 border-zinc-200"
                onClick={loginAsDemoAdmin}
              >
                <Shield className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="truncate">Demo Admin</span>
              </Button>
            </div>
          </div>

          {/* Login Form */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="login-email"
                    data-testid="login-email-input"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="customer@demo.com"
                    error={loginErrors.email}
                    className="pl-9"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="login-password">Password</Label>
                  <span className="text-xs text-zinc-400">demo: password123</span>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    data-testid="login-password-input"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    error={loginErrors.password}
                    className="pl-9"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                data-testid="login-submit-btn"
                variant="primary"
                size="lg"
                className="w-full mt-2 font-semibold"
                isLoading={isLoading}
              >
                Sign In
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-zinc-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="font-semibold text-zinc-900 underline hover:text-zinc-700"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </form>
          </TabsContent>

          {/* Registration Form */}
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <Label htmlFor="reg-name">Full Name *</Label>
                <div className="relative">
                  <Input
                    id="reg-name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Alexander Wright"
                    error={regErrors.name}
                    className="pl-9"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="reg-email">Email Address *</Label>
                  <div className="relative">
                    <Input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alex@example.com"
                      error={regErrors.email}
                      className="pl-9"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reg-phone">Phone Number *</Label>
                  <div className="relative">
                    <Input
                      id="reg-phone"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      error={regErrors.phone}
                      className="pl-9"
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="reg-password">Create Password (min. 6 chars) *</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    error={regErrors.password}
                    className="pl-9"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-3">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                  Shipping Address (for fast checkout)
                </span>
                <div>
                  <Label htmlFor="reg-street">Street Address *</Label>
                  <div className="relative">
                    <Input
                      id="reg-street"
                      value={regStreet}
                      onChange={(e) => setRegStreet(e.target.value)}
                      placeholder="123 Innovation Way"
                      error={regErrors.street}
                      className="pl-9"
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2.5">
                  <div>
                    <Label htmlFor="reg-city">City *</Label>
                    <Input
                      id="reg-city"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder="Seattle"
                      error={regErrors.city}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-state">State *</Label>
                    <Input
                      id="reg-state"
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      placeholder="WA"
                      error={regErrors.state}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-zip">ZIP *</Label>
                    <Input
                      id="reg-zip"
                      value={regZip}
                      onChange={(e) => setRegZip(e.target.value)}
                      placeholder="98101"
                      error={regErrors.zip}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-4 font-semibold"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  )
}
