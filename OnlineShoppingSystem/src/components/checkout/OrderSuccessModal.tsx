import { CheckCircle2, ArrowRight, Package, Calendar, MapPin, CreditCard } from 'lucide-react'
import { Order } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface OrderSuccessModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onViewOrderHistory: () => void
  onContinueShopping: () => void
}

export function OrderSuccessModal({
  order,
  isOpen,
  onClose,
  onViewOrderHistory,
  onContinueShopping,
}: OrderSuccessModalProps) {
  if (!order) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="text-center p-2">
        {/* Success Icon */}
        <div className="mx-auto h-16 w-16 rounded-full bg-zinc-100 border border-black flex items-center justify-center text-black mb-4">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
          Thank you for your order!
        </h2>
        <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">
          We've received your order and are preparing it for shipment. A confirmation receipt has been sent to{' '}
          <strong className="text-zinc-800">{order.customerEmail}</strong>.
        </p>

        {/* Order Identifier Pill */}
        <div className="my-6 inline-flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-3">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
              Unique Order Identifier
            </span>
            <span data-testid="confirmed-order-id" className="text-base font-mono font-bold text-zinc-900">
              {order.id}
            </span>
          </div>
          <Badge variant="success" className="text-xs">
            {order.status}
          </Badge>
        </div>

        {/* Receipt Details Box */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-left text-xs mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-100">
            <div>
              <span className="text-zinc-400 font-medium flex items-center gap-1.5 mb-1">
                <Calendar className="h-3.5 w-3.5" /> Date Placed
              </span>
              <p className="font-semibold text-zinc-800">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <span className="text-zinc-400 font-medium flex items-center gap-1.5 mb-1">
                <Package className="h-3.5 w-3.5" /> Est. Delivery
              </span>
              <p className="font-semibold text-emerald-600">{order.estimatedDelivery}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-100">
            <div>
              <span className="text-zinc-400 font-medium flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5" /> Destination
              </span>
              <p className="font-semibold text-zinc-800">{order.shippingAddress.fullName}</p>
              <p className="text-zinc-500 text-[11px]">
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 font-medium flex items-center gap-1.5 mb-1">
                <CreditCard className="h-3.5 w-3.5" /> Payment Method
              </span>
              <p className="font-semibold text-zinc-800 capitalize">
                {order.paymentMethod.replace('_', ' ')}
              </p>
              <p className="text-zinc-500 text-[11px]">
                Ending in {order.paymentDetailsLast4 || '4242'}
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <span className="text-zinc-400 font-semibold uppercase tracking-wider block mb-2 text-[10px]">
              Purchased Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </span>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-8 w-8 rounded-lg object-cover bg-zinc-100"
                    />
                    <span className="font-medium text-zinc-800 line-clamp-1 max-w-xs">
                      {item.quantity} × {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-zinc-100 pt-3 flex justify-between items-center text-sm">
            <span className="font-bold text-zinc-700">Total Paid</span>
            <span className="font-extrabold text-zinc-950 text-base">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            data-testid="view-history-after-checkout-btn"
            className="flex-1"
            onClick={() => {
              onClose()
              onViewOrderHistory()
            }}
          >
            <span>View in Order History</span>
          </Button>
          <Button
            variant="primary"
            className="flex-1 gap-2"
            onClick={() => {
              onClose()
              onContinueShopping()
            }}
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
