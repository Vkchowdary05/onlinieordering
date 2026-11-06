import * as React from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, Eye, Check } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  product: Product
  onQuickView: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, getItemQuantity } = useCart()
  const [isAdding, setIsAdding] = React.useState(false)
  const [justAdded, setJustAdded] = React.useState(false)

  const inCartQty = getItemQuantity(product.id)
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 5
  const isMaxInCart = inCartQty >= product.stock

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isOutOfStock || isMaxInCart) return

    setIsAdding(true)
    const success = addToCart(product, 1)
    if (success) {
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 1500)
    }
    setIsAdding(false)
  }

  return (
    <motion.div
      data-testid="product-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden"
    >
      {/* Product Image Area */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-zinc-100 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <Badge variant="default" className="shadow-sm font-semibold">
              {product.badge}
            </Badge>
          )}
          {isOutOfStock ? (
            <Badge variant="danger" className="shadow-sm">
              Sold Out
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" className="shadow-sm">
              Only {product.stock} left
            </Badge>
          ) : null}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onQuickView(product)
            }}
            className="shadow-lg backdrop-blur-md bg-white/95 text-zinc-900 gap-1.5 font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="h-4 w-4" />
            <span>Quick View</span>
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
          <span className="font-medium text-zinc-400 uppercase tracking-wider text-[11px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-zinc-800">{product.rating}</span>
            <span className="text-zinc-400 text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          data-testid="product-title"
          onClick={() => onQuickView(product)}
          className="font-bold text-sm sm:text-base text-zinc-900 line-clamp-1 hover:text-zinc-700 cursor-pointer transition-colors mb-1"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Add to Cart footer */}
        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-zinc-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 block font-mono">
              SKU: {product.sku}
            </span>
          </div>

          <Button
            type="button"
            data-testid="add-to-cart-btn"
            variant={justAdded ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isMaxInCart}
            isLoading={isAdding}
            className={`rounded-xl px-3 text-xs gap-1.5 shadow-sm transition-all ${
              justAdded ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Added</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : isMaxInCart ? (
              <span>Max in Cart ({inCartQty})</span>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
