import * as React from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Lock,
  CheckCircle,
  ShoppingBag,
} from 'lucide-react'
import { PaymentMethod, ShippingAddress } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface CheckoutViewProps {
  onBackToShop: () => void
  onOrderSuccess: () => void
}

export function CheckoutView({ onBackToShop, onOrderSuccess }: CheckoutViewProps) {
  const { items, subtotal, shipping, tax, total } = useCart()
  const { user } = useAuth()
  const { placeOrder } = useOrders()

  const [isLoading, setIsLoading] = React.useState(false)

  // Shipping Address Form State
  const [formData, setFormData] = React.useState<ShippingAddress>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: 'United States',
  })

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('credit_card')
  const [cardNumber, setCardNumber] = React.useState('4242 4242 4242 4242')
  const [cardExpiry, setCardExpiry] = React.useState('12/28')
  const [cardCvv, setCardCvv] = React.useState('789')

  // Validation Errors
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({})

  // If user signs in or changes while checkout view is open, update form with user defaults
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
        street: prev.street || user.address?.street || '',
        city: prev.city || user.address?.city || '',
        state: prev.state || user.address?.state || '',
        zip: prev.zip || user.address?.zip || '',
      }))
    }
  }, [user])

  const validate = () => {
    const err: { [key: string]: string } = {}
    if (!formData.fullName.trim()) err.fullName = 'Full Name is required'
    if (!formData.email.trim()) {
      err.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = 'Valid email is required'
    }
    if (!formData.phone.trim()) err.phone = 'Phone number is required'
    if (!formData.street.trim()) err.street = 'Street address is required'
    if (!formData.city.trim()) err.city = 'City is required'
    if (!formData.state.trim()) err.state = 'State is required'
    if (!formData.zip.trim()) err.zip = 'ZIP code is required'

    if (paymentMethod === 'credit_card') {
      if (!cardNumber.replace(/\s/g, '').trim()) err.cardNumber = 'Card number is required'
      if (!cardExpiry.trim()) err.cardExpiry = 'Expiry (MM/YY) is required'
      if (!cardCvv.trim()) err.cardCvv = 'CVV is required'
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const order = await placeOrder({
        shippingAddress: formData,
        paymentMethod,
        cardNumber,
      })

      if (order) {
        onOrderSuccess()
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-4">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Your cart is empty</h2>
        <p className="text-sm text-zinc-500 mb-6">
          You need items in your cart to proceed with checkout.
        </p>
        <Button variant="primary" onClick={onBackToShop}>
          Return to Catalogue
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackToShop}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checkout Forms (8 cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          {/* 1. Customer & Shipping Address */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
              <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Customer & Delivery Address
                </h3>
                <p className="text-xs text-zinc-500">
                  Enter your recipient contact and shipping destination.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkout-name">Recipient Full Name *</Label>
                  <Input
                    id="checkout-name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Sarah Jenkins"
                    error={errors.fullName}
                  />
                </div>
                <div>
                  <Label htmlFor="checkout-email">Email Address *</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="sarah@example.com"
                    error={errors.email}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="checkout-phone">Phone Number *</Label>
                <Input
                  id="checkout-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  error={errors.phone}
                />
              </div>

              <div>
                <Label htmlFor="checkout-street">Street Address *</Label>
                <Input
                  id="checkout-street"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  placeholder="742 Evergreen Terrace, Apt 4B"
                  error={errors.street}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="checkout-city">City *</Label>
                  <Input
                    id="checkout-city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Springfield"
                    error={errors.city}
                  />
                </div>
                <div>
                  <Label htmlFor="checkout-state">State *</Label>
                  <Input
                    id="checkout-state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="OR"
                    error={errors.state}
                  />
                </div>
                <div>
                  <Label htmlFor="checkout-zip">ZIP Code *</Label>
                  <Input
                    id="checkout-zip"
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                    placeholder="97477"
                    error={errors.zip}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Payment Method */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
              <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">Payment Method</h3>
                <p className="text-xs text-zinc-500">
                  Select payment option (Simulated demo transaction).
                </p>
              </div>
            </div>

            {/* Payment selection pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
              {[
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                { id: 'paypal', label: 'PayPal Demo', icon: ShieldCheck },
                { id: 'apple_pay', label: 'Apple Pay', icon: Lock },
                { id: 'cod', label: 'Cash on Deliv.', icon: Truck },
              ].map((m) => {
                const Icon = m.icon
                const isSelected = paymentMethod === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1.5" />
                    <span className="text-xs font-semibold">{m.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Credit Card Fields (when selected) */}
            {paymentMethod === 'credit_card' ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                  <span className="font-semibold text-zinc-700">Demo Card Details</span>
                  <span className="text-[11px] text-zinc-400">Pre-filled for testing</span>
                </div>

                <div>
                  <Label htmlFor="checkout-card-num">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="checkout-card-num"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      error={errors.cardNumber}
                      className="bg-white pl-9 font-mono text-xs"
                    />
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="checkout-expiry">Expiration</Label>
                    <Input
                      id="checkout-expiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      error={errors.cardExpiry}
                      className="bg-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout-cvv">CVV</Label>
                    <Input
                      id="checkout-cvv"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="789"
                      error={errors.cardCvv}
                      className="bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>
                  Demo transaction mode: No actual charge will be processed. You will be redirected to the confirmed receipt instantly.
                </span>
              </div>
            )}

            <Button
              type="submit"
              data-testid="place-order-btn"
              variant="primary"
              size="lg"
              className="w-full mt-6 text-base font-bold shadow-xl shadow-zinc-950/10"
              isLoading={isLoading}
            >
              <span>Place Order • {formatCurrency(total)}</span>
            </Button>
          </Card>
        </form>

        {/* Right Column: Order Summary (5 cols sticky) */}
        <div className="lg:col-span-5">
          <Card className="p-6 sticky top-24">
            <h3 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-zinc-500 font-normal">
                {items.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </h3>

            {/* Scrollable list of items */}
            <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto my-3 pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-14 w-14 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Qty: {item.quantity} × {formatCurrency(item.product.price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-zinc-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span className="font-semibold text-zinc-900">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-semibold text-zinc-900">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-2.5 flex justify-between text-sm font-extrabold text-zinc-950">
                <span>Grand Total</span>
                <span className="text-base text-zinc-950">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 text-[11px] text-zinc-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Product stock will be automatically reserved and deducted upon order completion.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
