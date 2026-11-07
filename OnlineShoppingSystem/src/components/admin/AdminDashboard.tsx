import * as React from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RotateCcw,
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Shield,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react'
import { Product, ProductCategory } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useProducts } from '@/context/ProductContext'
import { useOrders } from '@/context/OrderContext'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductFormModal } from './ProductFormModal'
import { ConfirmDialog } from '@/components/layout/ConfirmDialog'

interface AdminDashboardProps {
  onBackToShop: () => void
}

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Electronics',
  'Audio',
  'Wearables',
  'Accessories',
  'Smart Home',
  'Computing',
]

export function AdminDashboard({ onBackToShop }: AdminDashboardProps) {
  const { products, deleteProduct, resetToDefaultCatalog } = useProducts()
  const { orders } = useOrders()
  const { user, isAdmin, loginAsDemoAdmin } = useAuth()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory | 'All'>('All')

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
  const [productToEdit, setProductToEdit] = React.useState<Product | null>(null)

  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)

  const [isConfirmResetOpen, setIsConfirmResetOpen] = React.useState(false)

  // KPI Calculations
  const totalProducts = products.length
  const lowStockCount = products.filter((p) => p.stock <= 5).length
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0)
  const totalOrdersCount = orders.length
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)

  // Filtered products for table
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [products, selectedCategory, searchQuery])

  const handleEditClick = (product: Product) => {
    setProductToEdit(product)
    setIsFormModalOpen(true)
  }

  const handleAddClick = () => {
    setProductToEdit(null)
    setIsFormModalOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setIsConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id)
      setProductToDelete(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Access Banner if not logged in as Admin */}
      {!isAdmin && (
        <div className="rounded-2xl border border-zinc-300 bg-zinc-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-200 text-black flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">
                You are currently viewing in Preview Mode
              </h4>
              <p className="text-xs text-zinc-600 mt-0.5">
                Switch to the Demo Administrator account for full unrestricted product management privileges.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="dark"
            size="sm"
            onClick={loginAsDemoAdmin}
            className="gap-2 shrink-0 bg-black hover:bg-zinc-800 text-white border-none"
          >
            <Shield className="h-4 w-4" />
            <span>Switch to Demo Admin</span>
          </Button>
        </div>
      )}

      {/* Header with Title and Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
              Admin Product Studio
            </h1>
            <Badge variant="default" className="text-[10px] font-mono">
              Creative Tim UI
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Manage inventory catalogue, update stock quantities, monitor performance, and edit prices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfirmResetOpen(true)}
            className="text-xs gap-1.5"
            title="Restore original 24 demo products"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Catalogue</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddClick}
            className="gap-1.5 text-xs font-semibold shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        </div>
      </div>

      {/* 5 KPI Stat Cards (Creative Tim UI Admin Block style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Total Products
            </span>
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-zinc-900">{totalProducts}</span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">Active SKU listings</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Low Stock Alerts
            </span>
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-black">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-black">{lowStockCount}</span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">&le; 5 units remaining</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Inventory Value
            </span>
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-zinc-900">
              {formatCurrency(totalInventoryValue)}
            </span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">Retail inventory value</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Orders Processed
            </span>
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-zinc-900">{totalOrdersCount}</span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">Customer orders</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-black">
              Store Revenue
            </span>
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-black">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-black">
              {formatCurrency(totalRevenue)}
            </span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">Completed checkout sales</span>
          </div>
        </Card>
      </div>

      {/* Product Table Card */}
      <Card className="overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, SKU..."
              className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-semibold text-[11px] border-b border-zinc-100">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Inventory Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400">
                    No products found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = p.stock <= 0
                  const isLow = p.stock > 0 && p.stock <= 5

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-zinc-50/80 transition-colors group"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-10 w-10 rounded-lg object-cover bg-zinc-100 border border-zinc-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-zinc-900 line-clamp-1 max-w-xs">
                              {p.name}
                            </p>
                            <span className="font-mono text-[10px] text-zinc-400">
                              {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-medium text-zinc-600">
                        {p.category}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-zinc-900">
                        {formatCurrency(p.price)}
                        {p.originalPrice && (
                          <span className="text-[10px] text-zinc-400 line-through block font-normal">
                            {formatCurrency(p.originalPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              isOut
                                ? 'text-black font-bold'
                                : isLow
                                ? 'text-black'
                                : 'text-zinc-900'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {isOut ? (
                          <Badge variant="danger">Out of Stock</Badge>
                        ) : isLow ? (
                          <Badge variant="warning">Low Stock ({p.stock})</Badge>
                        ) : (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditClick(p)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(p)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-black font-bold hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product?"
        message={
          productToDelete
            ? `Are you sure you want to remove "${productToDelete.name}" (${productToDelete.sku}) from the store catalogue? This action cannot be undone.`
            : 'Are you sure you want to delete this product?'
        }
        confirmText="Yes, Delete"
        variant="destructive"
      />

      {/* Reset Catalog Confirmation Modal */}
      <ConfirmDialog
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={resetToDefaultCatalog}
        title="Reset Catalogue to Defaults?"
        message="This will reset the store database to the original 24 realistic products with pristine inventory stock levels."
        confirmText="Reset Catalogue"
        variant="primary"
      />
    </div>
  )
}
