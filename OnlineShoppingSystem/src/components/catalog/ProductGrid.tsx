import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductGridProps {
  products: Product[]
  onQuickView: (product: Product) => void
  onClearFilters: () => void
}

export function ProductGrid({
  products,
  onQuickView,
  onClearFilters,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center my-8 shadow-sm">
        <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
          <PackageSearch className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-1">
          No matching products found
        </h3>
        <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed">
          We couldn't find any items matching your current search or category criteria. Try broadening your filters or clearing search queries.
        </p>
        <Button variant="primary" onClick={onClearFilters}>
          Clear All Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  )
}
