export interface Product {
  id: string
  name: string
  sku: string
  description: string
  price: number
  originalPrice?: number
  category: ProductCategory
  stock: number
  rating: number
  reviewCount: number
  image: string
  isFeatured?: boolean
  isNew?: boolean
  badge?: string
  specs?: { [key: string]: string }
}

export type ProductCategory =
  | 'Electronics'
  | 'Audio'
  | 'Wearables'
  | 'Accessories'
  | 'Smart Home'
  | 'Computing'

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export type PaymentMethod = 'credit_card' | 'paypal' | 'apple_pay' | 'cod'

export type OrderStatus = 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered'

export interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  paymentDetailsLast4?: string
  status: OrderStatus
  createdAt: string
  estimatedDelivery: string
}

export interface FilterState {
  searchQuery: string
  category: ProductCategory | 'All'
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc'
  priceRange: [number, number]
  inStockOnly: boolean
}
