import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Product } from '@/types'

// Providers
import { ToastProvider } from '@/context/ToastContext'
import { AuthProvider } from '@/context/AuthContext'
import { ProductProvider, useProducts } from '@/context/ProductContext'
import { CartProvider } from '@/context/CartContext'
import { OrderProvider, useOrders } from '@/context/OrderContext'

// Layout & UI
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { AuthModal } from '@/components/auth/AuthModal'

// Catalog
import { ProductFilters } from '@/components/catalog/ProductFilters'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { ProductDetailModal } from '@/components/catalog/ProductDetailModal'

// Checkout
import { CheckoutView } from '@/components/checkout/CheckoutView'
import { OrderSuccessModal } from '@/components/checkout/OrderSuccessModal'

// Orders
import { OrderHistoryView } from '@/components/orders/OrderHistoryView'

// Admin
import { AdminDashboard } from '@/components/admin/AdminDashboard'

type AppView = 'catalog' | 'checkout' | 'orders' | 'admin'

function MainContent() {
  const [currentView, setCurrentView] = React.useState<AppView>('catalog')
  const { filteredProducts, clearFilters } = useProducts()
  const { lastPlacedOrder, setLastPlacedOrder } = useOrders()

  // Quick View Product Detail Modal
  const [inspectProduct, setInspectProduct] = React.useState<Product | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  // Order Success Modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)

  const handleQuickView = (product: Product) => {
    setInspectProduct(product)
    setIsDetailOpen(true)
  }

  const handleOrderSuccess = () => {
    setIsSuccessModalOpen(true)
  }

  const handleNavigate = (view: AppView) => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900">
      {/* Top Navigation */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Cart Drawer */}
      <CartDrawer onNavigateToCheckout={() => handleNavigate('checkout')} />

      {/* Auth Modal */}
      <AuthModal />

      {/* Product Quick-View Details Modal */}
      <ProductDetailModal
        product={inspectProduct}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setInspectProduct(null)
        }}
      />

      {/* Order Confirmed Success Modal */}
      <OrderSuccessModal
        order={lastPlacedOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewOrderHistory={() => handleNavigate('orders')}
        onContinueShopping={() => handleNavigate('catalog')}
      />

      {/* View Switcher with Framer Motion Animation */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              {/* Creative Tim UI Ecommerce Hero Banner Block */}
              <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white mb-10 shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&auto=format&fit=crop&q=80')",
                  }}
                />
                <div className="relative z-10 px-6 py-14 sm:px-12 sm:py-20 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-zinc-200 border border-white/10 mb-4">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Creative Tim UI • High-Precision Living</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-4">
                    Elevate Your Daily Ritual.
                  </h1>

                  <p className="text-sm sm:text-base text-zinc-300 mb-8 leading-relaxed">
                    Explore curated studio audio, titanium wearables, creator displays, and intelligent home hardware crafted for uncompromising performance.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const target = document.getElementById('catalog-products-section')
                        target?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="inline-flex items-center justify-center font-bold rounded-xl px-6 py-3 text-sm bg-white text-zinc-950 hover:bg-zinc-100 transition-all shadow-lg gap-2"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('admin')}
                      className="inline-flex items-center justify-center font-bold rounded-xl px-5 py-3 text-sm bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 transition-all"
                    >
                      Admin Studio
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div id="catalog-products-section">
                <ProductFilters />
                <ProductGrid
                  products={filteredProducts}
                  onQuickView={handleQuickView}
                  onClearFilters={clearFilters}
                />
              </div>
            </motion.div>
          )}

          {currentView === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <CheckoutView
                onBackToShop={() => handleNavigate('catalog')}
                onOrderSuccess={handleOrderSuccess}
              />
            </motion.div>
          )}

          {currentView === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <OrderHistoryView onBackToShop={() => handleNavigate('catalog')} />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AdminDashboard onBackToShop={() => handleNavigate('catalog')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <MainContent />
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
