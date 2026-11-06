import * as React from 'react'
import { CartItem, Product } from '@/types'
import { STORAGE_KEYS, safeLocalStorageGet, safeLocalStorageSet } from '@/lib/storage'
import { useToast } from './ToastContext'
import { useProducts } from './ProductContext'

interface CartContextType {
  items: CartItem[]
  totalItemsCount: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  isCartDrawerOpen: boolean
  setIsCartDrawerOpen: (isOpen: boolean) => void
  addToCart: (product: Product, quantity?: number) => boolean
  updateQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast()
  const { products } = useProducts()
  const [items, setItems] = React.useState<CartItem[]>(() =>
    safeLocalStorageGet<CartItem[]>(STORAGE_KEYS.CART, [])
  )
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false)

  // Sync cart items with current product catalog (e.g. if price changed or product deleted or stock reduced)
  React.useEffect(() => {
    setItems((prevItems) => {
      let changed = false
      const updated = prevItems
        .map((item) => {
          const liveProduct = products.find((p) => p.id === item.product.id)
          if (!liveProduct) {
            changed = true
            return null // product was deleted from store
          }
          // Cap quantity to live stock if stock has reduced below item.quantity
          const validQty = Math.min(item.quantity, liveProduct.stock)
          if (
            validQty !== item.quantity ||
            liveProduct.price !== item.product.price ||
            liveProduct.name !== item.product.name ||
            liveProduct.stock !== item.product.stock
          ) {
            changed = true
            return {
              product: liveProduct,
              quantity: validQty,
            }
          }
          return item
        })
        .filter((item): item is CartItem => item !== null && item.quantity > 0)

      return changed ? updated : prevItems
    })
  }, [products])

  // Persist items to localStorage
  React.useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.CART, items)
  }, [items])

  const getItemQuantity = (productId: string): number => {
    const found = items.find((i) => i.product.id === productId)
    return found ? found.quantity : 0
  }

  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.stock <= 0) {
      showToast({
        title: 'Out of Stock',
        description: `Sorry, "${product.name}" is currently sold out.`,
        type: 'warning',
      })
      return false
    }

    const currentQtyInCart = getItemQuantity(product.id)
    const proposedQty = currentQtyInCart + quantity

    if (proposedQty > product.stock) {
      showToast({
        title: 'Stock Limit Reached',
        description: `Cannot add ${quantity} more. Only ${product.stock} available in stock (${currentQtyInCart} already in cart).`,
        type: 'warning',
      })
      return false
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })

    showToast({
      title: 'Added to Cart',
      description: `${quantity} × "${product.name}" added to your bag.`,
      type: 'success',
    })
    return true
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const liveProduct = products.find((p) => p.id === productId)
    const maxStock = liveProduct ? liveProduct.stock : 999

    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    if (quantity > maxStock) {
      showToast({
        title: 'Maximum Stock Exceeded',
        description: `Only ${maxStock} items available in stock.`,
        type: 'warning',
      })
      quantity = maxStock
    }

    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    )
  }

  const removeFromCart = (productId: string) => {
    const item = items.find((i) => i.product.id === productId)
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
    if (item) {
      showToast({
        title: 'Removed from Cart',
        description: `"${item.product.name}" was removed.`,
        type: 'info',
      })
    }
  }

  const clearCart = () => {
    setItems([])
    safeLocalStorageSet(STORAGE_KEYS.CART, [])
  }

  const totalItemsCount = React.useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0)
  }, [items])

  const subtotal = React.useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  }, [items])

  // Shipping is free on orders over $50, else $9.99 (or 0 if cart is empty)
  const shipping = React.useMemo(() => {
    if (items.length === 0) return 0
    return subtotal >= 50 ? 0 : 9.99
  }, [items.length, subtotal])

  // Tax estimated at 8.25%
  const tax = React.useMemo(() => {
    return subtotal * 0.0825
  }, [subtotal])

  const total = React.useMemo(() => {
    return subtotal + shipping + tax
  }, [subtotal, shipping, tax])

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotal,
        shipping,
        tax,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
