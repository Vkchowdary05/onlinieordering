import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle,
  Truck,
  Clock,
} from 'lucide-react'
import { Order, OrderStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

const ORDER_STEPS: OrderStatus[] = ['Processing', 'Confirmed', 'Shipped', 'Delivered']

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  if (!order) return null

  const currentStepIndex = ORDER_STEPS.indexOf(order.status)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details: ${order.id}`}
      description={`Placed on ${formatDate(order.createdAt)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Tracking Timeline (Creative Tim UI Order Tracking Block) */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Shipment Status
            </span>
            <Badge
              variant={
                order.status === 'Delivered'
                  ? 'success'
                  : order.status === 'Shipped'
                  ? 'info'
                  : 'warning'
              }
            >
              {order.status}
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-2 relative">
            {ORDER_STEPS.map((step, idx) => {
              const isDone = idx <= currentStepIndex
              const isCurrent = idx === currentStepIndex
              return (
                <div key={step} className="flex flex-col items-center text-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                      isDone
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-200 text-zinc-400'
                    } ${isCurrent ? 'ring-4 ring-zinc-300' : ''}`}
                  >
                    {isDone ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      isDone ? 'text-zinc-900' : 'text-zinc-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-zinc-400" />
              Standard Express Shipping
            </span>
            <span>Est. Delivery: <strong className="text-zinc-800">{order.estimatedDelivery}</strong></span>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-zinc-200 p-4 bg-white">
            <div className="flex items-center gap-1.5 text-zinc-400 font-bold uppercase tracking-wider mb-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>Shipping Information</span>
            </div>
            <p className="font-bold text-zinc-900 text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-zinc-600 mt-1">{order.shippingAddress.street}</p>
            <p className="text-zinc-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p className="text-zinc-500 mt-2 font-mono">Contact: {order.shippingAddress.phone}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 bg-white">
            <div className="flex items-center gap-1.5 text-zinc-400 font-bold uppercase tracking-wider mb-2">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Payment & Contact</span>
            </div>
            <p className="font-semibold text-zinc-900 capitalize">
              {order.paymentMethod.replace('_', ' ')} (ending in {order.paymentDetailsLast4})
            </p>
            <p className="text-zinc-500 mt-1">Receipt Email: {order.customerEmail}</p>
            <p className="text-zinc-500">Account ID: {order.userId}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="rounded-xl border border-zinc-200 overflow-hidden text-xs">
          <div className="bg-zinc-100/70 px-4 py-2.5 font-bold text-zinc-700 uppercase tracking-wider flex justify-between">
            <span>Product Details</span>
            <span>Total</span>
          </div>
          <div className="divide-y divide-zinc-100 bg-white">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover bg-zinc-100 shrink-0"
                  />
                  <div>
                    <h5 className="font-bold text-zinc-900">{item.name}</h5>
                    <p className="text-zinc-500 text-[11px]">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-zinc-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-zinc-50 rounded-xl p-4 text-xs space-y-1.5">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span className="font-semibold text-zinc-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Shipping</span>
            <span className="font-semibold text-zinc-900">
              {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Sales Tax</span>
            <span className="font-semibold text-zinc-900">{formatCurrency(order.tax)}</span>
          </div>
          <div className="border-t border-zinc-200 pt-2 flex justify-between text-sm font-bold text-zinc-900">
            <span>Total Paid</span>
            <span className="text-base font-extrabold">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
