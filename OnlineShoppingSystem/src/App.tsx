import * as React from 'react'
import { MotionConfig } from 'framer-motion'
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
  const { lastPlacedOrder } = useOrders()

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
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
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

      {/* View Switcher without Animations */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <div key="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Minimalist Black and White Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-black text-white mb-10 border border-zinc-800">
              <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3.5 py-1 text-xs font-semibold text-zinc-200 border border-zinc-700 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                  <span>NovaStore • Minimalist Collection</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-4">
                  Elevate Your Daily Ritual.
                </h1>

                <p className="text-sm sm:text-base text-zinc-300 mb-8 leading-relaxed">
                  Curated studio audio, titanium wearables, creator displays, and intelligent home hardware.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const target = document.getElementById('catalog-products-section')
                      target?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
                    }}
                    className="inline-flex items-center justify-center font-bold rounded-xl px-6 py-3 text-sm bg-white text-black hover:bg-zinc-200 border border-white gap-2"
                  >
                    <span>Explore Catalog</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('admin')}
                    className="inline-flex items-center justify-center font-bold rounded-xl px-5 py-3 text-sm bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-700"
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
          </div>
        )}

        {currentView === 'checkout' && (
          <div key="checkout">
            <CheckoutView
              onBackToShop={() => handleNavigate('catalog')}
              onOrderSuccess={handleOrderSuccess}
            />
          </div>
        )}

        {currentView === 'orders' && (
          <div key="orders">
            <OrderHistoryView onBackToShop={() => handleNavigate('catalog')} />
          </div>
        )}

        {currentView === 'admin' && (
          <div key="admin">
            <AdminDashboard onBackToShop={() => handleNavigate('catalog')} />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="always" transition={{ duration: 0 }}>
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
    </MotionConfig>
  )
}
