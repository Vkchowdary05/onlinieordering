import * as React from 'react'
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const { addToCart, getItemQuantity } = useCart()
  const [quantity, setQuantity] = React.useState(1)
  const [isAdding, setIsAdding] = React.useState(false)
  const [addedSuccess, setAddedSuccess] = React.useState(false)

  React.useEffect(() => {
    setQuantity(1)
    setAddedSuccess(false)
  }, [product, isOpen])

  if (!product) return null

  const inCartQty = getItemQuantity(product.id)
  const availableStock = product.stock - inCartQty
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  const handleIncrement = () => {
    if (quantity < availableStock) {
      setQuantity((q) => q + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1)
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock || availableStock <= 0) return

    setIsAdding(true)
    const success = addToCart(product, quantity)
    if (success) {
      setAddedSuccess(true)
      setTimeout(() => {
        setAddedSuccess(false)
      }, 2000)
    }
    setIsAdding(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Product Image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <Badge variant="default" className="shadow-md">
                {product.badge}
              </Badge>
            )}
            {isOutOfStock ? (
              <Badge variant="danger" className="shadow-md">
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="warning" className="shadow-md">
                Only {product.stock} units left
              </Badge>
            ) : (
              <Badge variant="success" className="shadow-md">
                In Stock ({product.stock})
              </Badge>
            )}
          </div>
        </div>

        {/* Right Column: Information, Specs & Actions */}
        <div className="flex flex-col">
          {/* Breadcrumb / Category */}
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-zinc-400">
              {product.category}
            </span>
            <span className="font-mono text-zinc-400">SKU: {product.sku}</span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight leading-snug mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-zinc-800">{product.rating}</span>
            <span className="text-xs text-zinc-400">
              ({product.reviewCount} verified ratings)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-2xl font-black text-zinc-950">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-zinc-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Save {formatCurrency(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Specifications Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-6 rounded-xl border border-zinc-200 overflow-hidden text-xs">
              <div className="bg-zinc-100/70 px-3 py-2 font-bold text-zinc-800 uppercase tracking-wider">
                Key Technical Specifications
              </div>
              <div className="divide-y divide-zinc-100 bg-white">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between px-3 py-2">
                    <span className="text-zinc-500 font-medium">{key}</span>
                    <span className="text-zinc-900 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cart Quantity & Add CTA */}
          <div className="mt-auto space-y-4 pt-4 border-t border-zinc-100">
            {isOutOfStock ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center font-medium">
                This item is currently out of stock. Check back soon!
              </div>
            ) : availableStock <= 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs text-center font-medium">
                You already have all {product.stock} available units in your shopping bag.
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-zinc-200 rounded-xl bg-white shadow-sm h-11">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="px-3 h-full text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={quantity >= availableStock}
                    className="px-3 h-full text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <Button
                  type="button"
                  variant={addedSuccess ? 'secondary' : 'primary'}
                  size="lg"
                  onClick={handleAddToCart}
                  isLoading={isAdding}
                  className="flex-1 font-bold text-sm gap-2"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>
                        Add to Bag • {formatCurrency(product.price * quantity)}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Micro guarantees */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-500 pt-2 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-4 w-4 text-zinc-400" />
                <span>Free Ship &gt; $50</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="h-4 w-4 text-zinc-400" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
