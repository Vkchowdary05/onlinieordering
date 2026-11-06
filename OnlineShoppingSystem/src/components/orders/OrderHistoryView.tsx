import * as React from 'react'
import { Clock, Eye, Package, ArrowRight, ShoppingBag, Search } from 'lucide-react'
import { Order } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useOrders } from '@/context/OrderContext'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OrderDetailModal } from './OrderDetailModal'

interface OrderHistoryViewProps {
  onBackToShop: () => void
}

export function OrderHistoryView({ onBackToShop }: OrderHistoryViewProps) {
  const { customerOrders } = useOrders()
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [searchOrder, setSearchOrder] = React.useState('')

  const filteredOrders = React.useMemo(() => {
    if (!searchOrder.trim()) return customerOrders
    const query = searchOrder.toLowerCase()
    return customerOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.items.some((i) => i.name.toLowerCase().includes(query)) ||
        o.shippingAddress.fullName.toLowerCase().includes(query)
    )
  }, [customerOrders, searchOrder])

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Sign in to view your orders</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Access your past purchases, shipment statuses, and digital receipts anytime.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="primary" onClick={() => openAuthModal('login')}>
            Sign In with Demo Account
          </Button>
          <Button variant="outline" onClick={onBackToShop}>
            Browse Store
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Order History</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Logged in as <strong className="text-zinc-800">{user?.name}</strong> ({user?.email})
          </p>
        </div>

        {/* Search inside orders */}
        {customerOrders.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              placeholder="Search by Order ID or item..."
              className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
          </div>
        )}
      </div>

      {customerOrders.length === 0 ? (
        <Card className="p-12 text-center max-w-xl mx-auto">
          <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-4">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">No orders placed yet</h3>
          <p className="text-sm text-zinc-500 mb-6">
            When you complete checkout, your confirmed orders and live tracking will appear right here.
          </p>
          <Button variant="primary" onClick={onBackToShop} className="gap-2">
            <span>Explore Products</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const totalItemsCount = order.items.reduce((s, i) => s + i.quantity, 0)
            return (
              <Card
                key={order.id}
                data-testid="order-card"
                className="overflow-hidden hover:border-zinc-300 transition-all shadow-sm"
              >
                {/* Order Top Bar */}
                <div className="bg-zinc-50/80 px-6 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-zinc-400 block font-semibold text-[10px] uppercase tracking-wider">
                        Order Placed
                      </span>
                      <span className="font-semibold text-zinc-800">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-semibold text-[10px] uppercase tracking-wider">
                        Total Amount
                      </span>
                      <span className="font-extrabold text-zinc-950">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-semibold text-[10px] uppercase tracking-wider">
                        Ship To
                      </span>
                      <span className="font-semibold text-zinc-800">
                        {order.shippingAddress.fullName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span data-testid="order-id-display" className="font-mono text-zinc-400 text-xs">{order.id}</span>
                    <Badge
                      variant={
                        order.status === 'Delivered'
                          ? 'success'
                          : order.status === 'Shipped'
                          ? 'info'
                          : 'warning'
                      }
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Thumbnails preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 overflow-x-auto pb-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="relative group shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-xl object-cover bg-zinc-100 border border-zinc-200"
                            title={item.name}
                          />
                          {item.quantity > 1 && (
                            <span className="absolute -top-1 -right-1 bg-zinc-900 text-white rounded-full text-[10px] font-bold h-4 min-w-4 px-1 flex items-center justify-center">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                      <div className="pl-2">
                        <p className="text-xs font-bold text-zinc-800">
                          {order.items[0]?.name}
                          {order.items.length > 1 &&
                            ` + ${order.items.length - 1} other item(s)`}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {totalItemsCount} total items · Est. delivery {order.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View Details Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="view-order-details-btn"
                      onClick={() => setSelectedOrder(order)}
                      className="gap-1.5 font-medium text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Receipt & Tracking</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Detailed Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  )
}
