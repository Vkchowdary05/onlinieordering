import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CartDrawerProps {
  onNavigateToCheckout: () => void
}

export function CartDrawer({ onNavigateToCheckout }: CartDrawerProps) {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    tax,
    total,
    clearCart,
  } = useCart()

  const freeShippingThreshold = 50
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  )
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            
            
            
            
            onClick={() => setIsCartDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div
              
              
              
              
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 p-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">Your Cart</h2>
                    <p className="text-xs text-zinc-500">
                      {items.length === 0
                        ? 'Your bag is empty'
                        : `${items.reduce((s, i) => s + i.quantity, 0)} items in bag`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs text-zinc-400 hover:text-black transition-colors px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Free Shipping Progress bar */}
              {items.length > 0 && (
                <div className="bg-zinc-50 border-b border-zinc-100 px-6 py-3">
                  <div className="flex items-center justify-between text-xs font-medium text-zinc-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-zinc-500" />
                      {remainingForFreeShipping > 0
                        ? `Add ${formatCurrency(remainingForFreeShipping)} for FREE Shipping`
                        : '🎉 Congratulations! You qualify for FREE Shipping'}
                    </span>
                    <span className="text-zinc-500">{progressToFreeShipping}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full"
                      
                      style={{ width: progressToFreeShipping + '%' }}
                      
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                    <h3 className="text-base font-semibold text-zinc-900 mb-1">
                      Your bag is empty
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-xs mb-6">
                      Explore our premium technology and lifestyle products and find your next favorite item.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => setIsCartDrawerOpen(false)}
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  items.map((item) => {
                    const isMaxStockReached = item.quantity >= item.product.stock
                    return (
                      <div
                        key={item.product.id}
                        data-testid="cart-item"
                        className="flex gap-4 p-3.5 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 transition-all shadow-sm"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-20 w-20 rounded-lg object-cover bg-zinc-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-zinc-900 line-clamp-1">
                                {item.product.name}
                              </h4>
                              <button
                                type="button"
                                data-testid="cart-remove-btn"
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-zinc-400 hover:text-black transition-colors p-0.5"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {item.product.category}
                            </p>
                            <p className="text-sm font-bold text-zinc-900 mt-1">
                              {formatCurrency(item.product.price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-50">
                            {/* Quantity stepper */}
                            <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-white">
                              <button
                                type="button"
                                data-testid="cart-qty-minus"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                className="p-1.5 text-zinc-600 hover:bg-zinc-100 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span data-testid="cart-qty-value" className="px-3 text-xs font-semibold text-zinc-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                data-testid="cart-qty-plus"
                                disabled={isMaxStockReached}
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                className="p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="text-xs font-semibold text-zinc-900">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>

                          {/* Stock warning if low */}
                          {item.product.stock <= 5 && (
                            <p className="text-[11px] text-zinc-600 mt-1">
                              Only {item.product.stock} units in stock
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {items.length > 0 && (
                <div className="border-t border-zinc-100 p-6 bg-zinc-50/50 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal</span>
                      <span data-testid="cart-subtotal" className="font-medium text-zinc-900">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span className="flex items-center gap-1">
                        Shipping
                        {shipping === 0 && (
                          <span className="text-[10px] bg-zinc-100 text-black border border-zinc-300 px-1.5 py-0.2 rounded font-semibold">
                            FREE
                          </span>
                        )}
                      </span>
                      <span className="font-medium text-zinc-900">
                        {shipping === 0 ? '$0.00' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Estimated Tax (8.25%)</span>
                      <span className="font-medium text-zinc-900">
                        {formatCurrency(tax)}
                      </span>
                    </div>
                    <div className="border-t border-zinc-200 pt-2 flex justify-between text-base font-bold text-zinc-900">
                      <span>Total</span>
                      <span data-testid="cart-total">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    data-testid="proceed-to-checkout-btn"
                    className="w-full gap-2 text-base font-semibold shadow-lg shadow-zinc-900/10"
                    onClick={() => {
                      setIsCartDrawerOpen(false)
                      onNavigateToCheckout()
                    }}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                    <ShieldCheck className="h-4 w-4 text-black" />
                    <span>Secure encrypted checkout · 30-day money-back guarantee</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
