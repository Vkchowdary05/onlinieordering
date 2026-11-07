import * as React from 'react'
import {
  ShoppingBag,
  Search,
  User,
  Shield,
  Clock,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useOrders } from '@/context/OrderContext'
import { useProducts } from '@/context/ProductContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NavbarProps {
  currentView: 'catalog' | 'checkout' | 'orders' | 'admin'
  onNavigate: (view: 'catalog' | 'checkout' | 'orders' | 'admin') => void
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, loginAsDemoCustomer, loginAsDemoAdmin } =
    useAuth()
  const { totalItemsCount, setIsCartDrawerOpen } = useCart()
  const { customerOrders } = useOrders()
  const { filters, setSearchQuery } = useProducts()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)

  const userMenuRef = React.useRef<HTMLDivElement>(null)

  // Click outside to close user dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-black text-white text-[11px] font-medium py-1.5 px-4 text-center tracking-wide">
        <span>✨ Welcome to NovaStore — Creative Tim UI Ecommerce Experience. Free express shipping on orders over $50!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center font-bold tracking-tighter text-lg shadow-sm group-hover:scale-105 transition-transform">
                N
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-zinc-950 flex items-center gap-1">
                  Nova<span className="text-zinc-500 font-light">Store</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-zinc-400 block -mt-1">
                  Creative Tim UI
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                type="button"
                data-testid="nav-products-link"
                onClick={() => onNavigate('catalog')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  currentView === 'catalog'
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                }`}
              >
                Products
              </button>

              <button
                type="button"
                data-testid="nav-orders-link"
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal('login')
                  } else {
                    onNavigate('orders')
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'orders'
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                }`}
              >
                <Clock className="h-4 w-4 text-zinc-400" />
                <span>Orders</span>
                {customerOrders.length > 0 && (
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                    {customerOrders.length}
                  </Badge>
                )}
              </button>

              <button
                type="button"
                data-testid="nav-admin-link"
                onClick={() => onNavigate('admin')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-black text-white font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                }`}
              >
                <Shield className="h-4 w-4 text-black" />
                <span>Admin Portal</span>
              </button>
            </nav>
          </div>

          {/* Center search (desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                data-testid="nav-search-input"
                value={filters.searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (currentView !== 'catalog') onNavigate('catalog')
                }}
                placeholder="Search products, SKU..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-9 pr-3.5 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Shopping Cart Button */}
            <button
              type="button"
              data-testid="cart-trigger-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-700 hover:border-zinc-300 hover:text-zinc-950 transition-all shadow-sm active:scale-95"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItemsCount > 0 && (
                <span
                  data-testid="cart-badge"
                  className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-bold text-white shadow ring-2 ring-white "
                >
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Login */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  data-testid="user-profile-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-1.5 pr-3 hover:bg-zinc-50 transition-colors shadow-sm"
                >
                  <div className="h-7 w-7 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <p data-testid="user-name-display" className="font-semibold text-zinc-900 leading-none truncate max-w-[100px]">
                      {user?.name}
                    </p>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-100 bg-white p-1.5 shadow-xl z-50">
                    <div className="px-3 py-2 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
                      <Badge
                        variant={isAdmin ? 'default' : 'secondary'}
                        className="mt-1 text-[10px]"
                      >
                        {isAdmin ? 'Administrator' : 'Customer Account'}
                      </Badge>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('orders')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg text-left"
                      >
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        <span>My Orders</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('admin')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg text-left"
                      >
                        <Shield className="h-3.5 w-3.5 text-black" />
                        <span>Admin Product Studio</span>
                      </button>
                    </div>

                    <div className="border-t border-zinc-100 pt-1">
                      <button
                        type="button"
                        data-testid="logout-btn"
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-black hover:bg-zinc-100 rounded-lg text-left"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="login-trigger-btn"
                  onClick={() => openAuthModal('login')}
                  className="inline-flex"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  data-testid="register-trigger-btn"
                  onClick={() => openAuthModal('register')}
                >
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-xl border border-zinc-200 p-2 text-zinc-700 hover:bg-zinc-50"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-100 py-3 space-y-2">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-2 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onNavigate('catalog')
                setIsMobileMenuOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-zinc-900 rounded-lg hover:bg-zinc-50"
            >
              Catalogue
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('orders')
                setIsMobileMenuOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-zinc-900 rounded-lg hover:bg-zinc-50 flex items-center justify-between"
            >
              <span>My Orders</span>
              {customerOrders.length > 0 && (
                <Badge variant="secondary">{customerOrders.length}</Badge>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('admin')
                setIsMobileMenuOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-zinc-900 rounded-lg hover:bg-zinc-50 flex items-center gap-2"
            >
              <Shield className="h-4 w-4 text-indigo-600" />
              <span>Admin Management</span>
            </button>

            <div className="pt-2 border-t border-zinc-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoCustomer()
                  setIsMobileMenuOpen(false)
                }}
                className="flex-1 text-xs py-2 px-3 rounded-lg bg-zinc-100 text-zinc-800 font-medium"
              >
                Demo Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsDemoAdmin()
                  setIsMobileMenuOpen(false)
                }}
                className="flex-1 text-xs py-2 px-3 rounded-lg bg-zinc-900 text-white font-medium"
              >
                Demo Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
