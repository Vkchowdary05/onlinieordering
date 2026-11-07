import * as React from 'react'
import { Product, ProductCategory } from '@/types'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useProducts } from '@/context/ProductContext'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  productToEdit?: Product | null
}

const CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Audio',
  'Wearables',
  'Accessories',
  'Smart Home',
  'Computing',
]

export function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
}: ProductFormModalProps) {
  const { addProduct, updateProduct } = useProducts()
  const isEditing = !!productToEdit

  const [formData, setFormData] = React.useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Electronics' as ProductCategory,
    stock: '',
    image: '',
    badge: '',
    isFeatured: false,
  })

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        sku: productToEdit.sku,
        description: productToEdit.description,
        price: productToEdit.price.toString(),
        originalPrice: productToEdit.originalPrice ? productToEdit.originalPrice.toString() : '',
        category: productToEdit.category,
        stock: productToEdit.stock.toString(),
        image: productToEdit.image,
        badge: productToEdit.badge || '',
        isFeatured: productToEdit.isFeatured || false,
      })
    } else {
      setFormData({
        name: '',
        sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
        description: '',
        price: '99.99',
        originalPrice: '',
        category: 'Electronics',
        stock: '15',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        badge: '',
        isFeatured: false,
      })
    }
    setErrors({})
  }, [productToEdit, isOpen])

  const validate = () => {
    const err: { [key: string]: string } = {}
    if (!formData.name.trim()) err.name = 'Product title is required'
    if (!formData.sku.trim()) err.sku = 'SKU identifier is required'
    if (!formData.description.trim()) err.description = 'Description is required'
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      err.price = 'Valid price is required'
    }
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      err.stock = 'Valid stock quantity is required'
    }
    if (!formData.image.trim()) {
      err.image = 'Image URL is required'
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const priceNum = parseFloat(formData.price)
      const origPriceNum = formData.originalPrice ? parseFloat(formData.originalPrice) : undefined
      const stockNum = parseInt(formData.stock, 10)

      if (isEditing && productToEdit) {
        updateProduct({
          ...productToEdit,
          name: formData.name.trim(),
          sku: formData.sku.trim(),
          description: formData.description.trim(),
          price: priceNum,
          originalPrice: origPriceNum,
          category: formData.category,
          stock: stockNum,
          image: formData.image.trim(),
          badge: formData.badge.trim() || undefined,
          isFeatured: formData.isFeatured,
        })
      } else {
        addProduct({
          name: formData.name.trim(),
          sku: formData.sku.trim(),
          description: formData.description.trim(),
          price: priceNum,
          originalPrice: origPriceNum,
          category: formData.category,
          stock: stockNum,
          rating: 5.0,
          reviewCount: 1,
          image: formData.image.trim(),
          badge: formData.badge.trim() || undefined,
          isFeatured: formData.isFeatured,
          specs: {
            'Warranty': '1 Year Standard',
            'Condition': 'Brand New Factory Sealed',
          },
        })
      }
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product Details' : 'Add New Product to Catalogue'}
      description={
        isEditing
          ? 'Modify pricing, inventory stock, description, or categorization.'
          : 'Create a new catalog item with realistic specs and image URL.'
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="prod-name">Product Name *</Label>
            <Input
              id="prod-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Apex Studio Bluetooth Earphones"
              error={errors.name}
            />
          </div>

          <div>
            <Label htmlFor="prod-sku">SKU Code *</Label>
            <Input
              id="prod-sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="AUD-APX-001"
              error={errors.sku}
              className="font-mono"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="prod-desc">Description *</Label>
          <textarea
            id="prod-desc"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Comprehensive feature highlights and physical specs..."
            className="flex w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-black font-semibold">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="prod-cat">Category *</Label>
            <Select
              id="prod-cat"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as ProductCategory })
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="prod-price">Sale Price ($) *</Label>
            <Input
              id="prod-price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="129.99"
              error={errors.price}
            />
          </div>

          <div>
            <Label htmlFor="prod-orig-price">Original Price ($)</Label>
            <Input
              id="prod-orig-price"
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              placeholder="159.99 (Optional)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="prod-stock">Available Stock *</Label>
            <Input
              id="prod-stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="25"
              error={errors.stock}
            />
          </div>

          <div>
            <Label htmlFor="prod-badge">Badge (e.g. Best Seller)</Label>
            <Input
              id="prod-badge"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="Trending, Sale, New..."
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 h-4 w-4"
              />
              <span>Mark as Featured</span>
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor="prod-image">Image URL *</Label>
          <Input
            id="prod-image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            error={errors.image}
          />
        </div>

        {/* Live Image Preview */}
        {formData.image && (
          <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <img
              src={formData.image}
              alt="Preview"
              className="h-16 w-16 rounded-lg object-cover bg-zinc-200"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
            <div className="text-xs text-zinc-500">
              <p className="font-semibold text-zinc-800">Image Preview</p>
              <p className="truncate max-w-sm">{formData.image}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Product Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
