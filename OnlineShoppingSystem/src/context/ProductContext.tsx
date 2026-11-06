import * as React from 'react'
import { Product, ProductCategory, FilterState } from '@/types'
import { INITIAL_PRODUCTS } from '@/data/initialProducts'
import { STORAGE_KEYS, safeLocalStorageGet, safeLocalStorageSet } from '@/lib/storage'
import { useToast } from './ToastContext'

interface ProductContextType {
  products: Product[]
  filteredProducts: Product[]
  filters: FilterState
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  setSearchQuery: (query: string) => void
  setCategory: (category: ProductCategory | 'All') => void
  setSortBy: (sortBy: FilterState['sortBy']) => void
  setPriceRange: (range: [number, number]) => void
  setInStockOnly: (inStockOnly: boolean) => void
  clearFilters: () => void
  addProduct: (product: Omit<Product, 'id'>) => boolean
  updateProduct: (product: Product) => boolean
  deleteProduct: (id: string) => boolean
  deductStock: (items: { productId: string; quantity: number }[]) => void
  resetToDefaultCatalog: () => void
  getProductById: (id: string) => Product | undefined
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'All',
  sortBy: 'featured',
  priceRange: [0, 1000],
  inStockOnly: false,
}

const ProductContext = React.createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast()
  const [products, setProducts] = React.useState<Product[]>(() => {
    const saved = safeLocalStorageGet<Product[]>(STORAGE_KEYS.PRODUCTS, [])
    return saved.length > 0 ? saved : INITIAL_PRODUCTS
  })

  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)

  // Save to localStorage whenever products change
  React.useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.PRODUCTS, products)
  }, [products])

  const getProductById = (id: string) => products.find((p) => p.id === id)

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (filters.category !== 'All' && p.category !== filters.category) {
          return false
        }
        // Search filter (name, description, sku, category)
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase()
          const matchName = p.name.toLowerCase().includes(query)
          const matchDesc = p.description.toLowerCase().includes(query)
          const matchSku = p.sku.toLowerCase().includes(query)
          const matchCat = p.category.toLowerCase().includes(query)
          if (!matchName && !matchDesc && !matchSku && !matchCat) return false
        }
        // In stock only filter
        if (filters.inStockOnly && p.stock <= 0) {
          return false
        }
        // Price range
        if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'featured':
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        }
      })
  }, [products, filters])

  const setSearchQuery = (searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }))
  }

  const setCategory = (category: ProductCategory | 'All') => {
    setFilters((prev) => ({ ...prev, category }))
  }

  const setSortBy = (sortBy: FilterState['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }

  const setPriceRange = (priceRange: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange }))
  }

  const setInStockOnly = (inStockOnly: boolean) => {
    setFilters((prev) => ({ ...prev, inStockOnly }))
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }

  // Admin Product Operations
  const addProduct = (newProdData: Omit<Product, 'id'>): boolean => {
    const id = `prod-${Date.now()}`
    const newProduct: Product = { ...newProdData, id }
    setProducts((prev) => [newProduct, ...prev])
    showToast({
      title: 'Product Created',
      description: `"${newProduct.name}" added to the catalogue.`,
      type: 'success',
    })
    return true
  }

  const updateProduct = (updated: Product): boolean => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    if (selectedProduct?.id === updated.id) {
      setSelectedProduct(updated)
    }
    showToast({
      title: 'Product Updated',
      description: `Changes saved for "${updated.name}".`,
      type: 'success',
    })
    return true
  }

  const deleteProduct = (id: string): boolean => {
    const target = products.find((p) => p.id === id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    if (selectedProduct?.id === id) {
      setSelectedProduct(null)
    }
    showToast({
      title: 'Product Deleted',
      description: target ? `"${target.name}" has been removed.` : 'Product removed.',
      type: 'info',
    })
    return true
  }

  // Checkout stock deduction
  const deductStock = (items: { productId: string; quantity: number }[]) => {
    setProducts((prev) =>
      prev.map((prod) => {
        const boughtItem = items.find((i) => i.productId === prod.id)
        if (boughtItem) {
          const newStock = Math.max(0, prod.stock - boughtItem.quantity)
          return { ...prod, stock: newStock }
        }
        return prod
      })
    )
  }

  const resetToDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS)
    safeLocalStorageSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
    showToast({
      title: 'Catalogue Reset',
      description: 'Restored original 24 demo products and stock counts.',
      type: 'info',
    })
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        filters,
        selectedProduct,
        setSelectedProduct,
        setSearchQuery,
        setCategory,
        setSortBy,
        setPriceRange,
        setInStockOnly,
        clearFilters,
        addProduct,
        updateProduct,
        deleteProduct,
        deductStock,
        resetToDefaultCatalog,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = React.useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}
