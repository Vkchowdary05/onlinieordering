export const STORAGE_KEYS = {
  PRODUCTS: 'oss_products_v1',
  CART: 'oss_cart_v1',
  ORDERS: 'oss_orders_v1',
  CURRENT_USER: 'oss_current_user_v1',
  REGISTERED_USERS: 'oss_registered_users_v1',
} as const

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return fallback
  }
}

export function safeLocalStorageSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    // Dispatch a storage event for cross-component sync
    window.dispatchEvent(new Event('storage'))
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error)
  }
}

export function safeLocalStorageRemove(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
    window.dispatchEvent(new Event('storage'))
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
  }
}
