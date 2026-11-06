import { Search, RotateCcw, Filter, Check } from 'lucide-react'
import { ProductCategory } from '@/types'
import { useProducts } from '@/context/ProductContext'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Electronics',
  'Audio',
  'Wearables',
  'Accessories',
  'Smart Home',
  'Computing',
]

export function ProductFilters() {
  const {
    filters,
    setSearchQuery,
    setCategory,
    setSortBy,
    setInStockOnly,
    clearFilters,
    filteredProducts,
    products,
  } = useProducts()

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.category !== 'All' ||
    filters.sortBy !== 'featured' ||
    filters.inStockOnly

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm space-y-4 mb-8">
      {/* Top row: Search input + Sorting selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input with live clear */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            data-testid="search-input"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, model, or keywords..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-10 pr-9 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 rounded-full p-0.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <span className="sr-only">Clear search</span>
              ✕
            </button>
          )}
        </div>

        {/* Sort Dropdown & In-Stock Checkbox */}
        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              value={filters.sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
            </Select>
          </div>

          {/* In stock only toggle button */}
          <button
            type="button"
            onClick={() => setInStockOnly(!filters.inStockOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filters.inStockOnly
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <div
              className={`h-3.5 w-3.5 rounded flex items-center justify-center border ${
                filters.inStockOnly
                  ? 'bg-white text-zinc-900 border-white'
                  : 'border-zinc-400'
              }`}
            >
              {filters.inStockOnly && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <span>In Stock</span>
          </button>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Results Counter and Clear Filters */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 ml-auto">
          <span>
            Showing <strong className="text-zinc-900">{filteredProducts.length}</strong> of{' '}
            {products.length} products
          </span>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs h-8 text-zinc-500 hover:text-zinc-900 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
