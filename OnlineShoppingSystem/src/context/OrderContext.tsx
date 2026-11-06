import * as React from 'react'
import { Order, OrderItem, ShippingAddress, PaymentMethod } from '@/types'
import { STORAGE_KEYS, safeLocalStorageGet, safeLocalStorageSet } from '@/lib/storage'
import { generateOrderId } from '@/lib/utils'
import { useAuth } from './AuthContext'
import { useCart } from './CartContext'
import { useProducts } from './ProductContext'
import { useToast } from './ToastContext'

interface PlaceOrderParams {
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  cardNumber?: string
}

interface OrderContextType {
  orders: Order[]
  customerOrders: Order[]
  selectedOrder: Order | null
  setSelectedOrder: (order: Order | null) => void
  lastPlacedOrder: Order | null
  setLastPlacedOrder: (order: Order | null) => void
  placeOrder: (params: PlaceOrderParams) => Promise<Order | null>
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  getOrderById: (orderId: string) => Order | undefined
}

const OrderContext = React.createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { items, subtotal, shipping, tax, total, clearCart } = useCart()
  const { deductStock } = useProducts()
  const { showToast } = useToast()

  const [orders, setOrders] = React.useState<Order[]>(() =>
    safeLocalStorageGet<Order[]>(STORAGE_KEYS.ORDERS, [])
  )
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [lastPlacedOrder, setLastPlacedOrder] = React.useState<Order | null>(null)

  // Sync orders to localStorage
  React.useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.ORDERS, orders)
  }, [orders])

  // Filter orders by current logged in user (or show all if admin)
  const customerOrders = React.useMemo(() => {
    if (!user) return []
    if (user.role === 'admin') return orders
    return orders.filter((o) => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase())
  }, [orders, user])

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId)

  const placeOrder = async ({
    shippingAddress,
    paymentMethod,
    cardNumber,
  }: PlaceOrderParams): Promise<Order | null> => {
    if (items.length === 0) {
      showToast({
        title: 'Empty Cart',
        description: 'Please add items to your cart before proceeding to checkout.',
        type: 'error',
      })
      return null
    }

    // Prepare order items
    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }))

    // Calculate delivery estimate: 3 business days from now
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 3)
    const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

    const newOrder: Order = {
      id: generateOrderId(),
      userId: user?.id || 'guest',
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      paymentDetailsLast4: cardNumber ? cardNumber.slice(-4) : '••••',
      status: 'Processing',
      createdAt: new Date().toISOString(),
      estimatedDelivery,
    }

    // 1. Deduct product inventory in ProductContext
    deductStock(items.map((i) => ({ productId: i.product.id, quantity: i.quantity })))

    // 2. Save new order
    setOrders((prev) => [newOrder, ...prev])
    setLastPlacedOrder(newOrder)

    // 3. Clear cart
    clearCart()

    showToast({
      title: 'Order Placed Successfully!',
      description: `Order ${newOrder.id} confirmed. Total: $${total.toFixed(2)}.`,
      type: 'success',
      duration: 6000,
    })

    return newOrder
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null))
    }
    showToast({
      title: 'Order Status Updated',
      description: `Order ${orderId} marked as ${status}.`,
      type: 'info',
    })
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        customerOrders,
        selectedOrder,
        setSelectedOrder,
        lastPlacedOrder,
        setLastPlacedOrder,
        placeOrder,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = React.useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}
