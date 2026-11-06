# NovaStore — Online Shopping & Order Management System

A high-performance, modern e-commerce web application built using **Creative Tim UI**, **Tailwind CSS v4**, **React 19**, **TypeScript**, and **Framer Motion**.

---

## 🌟 Key Features & Modules

### A. Customer Registration & Authentication
- **Registration & Sign In**: Full form validation with error indicators.
- **One-Click Demo Personas**:
  - **Demo Customer**: `customer@demo.com` / `password123` (Sarah Jenkins)
  - **Demo Admin**: `admin@demo.com` / `admin123` (Marcus Vance)
- **Session Persistence**: Sessions persist in `localStorage` across refreshes.

### B. Product Catalogue
- **24 Curated High-Fidelity Products**: Spanning Audio, Wearables, Computing, Electronics, Smart Home, and Accessories.
- **Rich Product Information**: SKU, category, star ratings, review counts, stock indicators, specs, original price, and discounts.
- **Product Overview Modal**: Creative Tim UI style detail view with technical specs table, live stock counter, and stepper.

### C. Search & Filter Bar
- **Real-Time Search**: Instant search by title, SKU, or category.
- **Category Filter Pills**: Filter by category or view all.
- **Price & Rating Sorting**: Sort by Featured, Price (Low-High), Price (High-Low), Highest Rated, or A-Z.
- **Availability Filter**: One-click "In Stock" filter toggle.
- **Reset Button**: Single-click filter reset.

### D. Shopping Cart
- **Slide-Over Drawer**: Framer Motion animated cart drawer with backdrop blur.
- **Stock Limit Protection**: Prevents adding quantities exceeding current available inventory.
- **Free Shipping Progress Meter**: Dynamic progress bar toward free shipping (unlocked at \$50).
- **Automatic Calculations**: Real-time calculation of subtotal, tax (8.25%), shipping, and total.

### E. Checkout & Order Placement
- **Step-by-Step Checkout**:
  - Customer & Delivery destination (pre-fills from active user profile).
  - Payment method selection (Credit Card, PayPal Demo, Apple Pay, Cash on Delivery).
- **Validation**: Strict client-side validation.
- **Atomic Stock Deduction**: Automatically reserves and deducts stock from product catalogue upon order placement.
- **Order Confirmation Receipt**: Displays unique alphanumeric Order ID (`ORD-XXXXXX`), estimated delivery date, recipient, and breakdown.

### F. Order History & Tracking
- **Customer-Specific History**: Displays orders associated with the signed-in customer.
- **Status Badges**: Processing, Confirmed, Shipped, Delivered.
- **Shipment Timeline**: Visual 4-step progress tracker (Order Placed &rarr; Confirmed &rarr; Shipped &rarr; Delivered).
- **Digital Receipt**: Itemized summary and totals.

### G. Admin Product Studio
- **KPI Metrics**: Total Active Products, Low Stock Alerts (&le; 5 units), Inventory Value, Total Orders, and Store Revenue.
- **Searchable Inventory Table**: Sort and filter inventory with stock health badges.
- **CRUD Operations**:
  - **Add Product**: Modal form with validation and live image preview.
  - **Edit Product**: Modify prices, stock, categories, and badges.
  - **Delete Product**: Protected with confirmation dialog.
  - **Reset Catalogue**: One-click restore to default 24 products.
- **Live Inventory Sync**: Stock changes made in Admin immediately update catalogue availability and cart limits.

---

## 🛠 Technology Stack

- **Framework**: Vite 8 + React 19 + TypeScript
- **Component Styling**: Creative Tim UI design language + Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Persistence**: Safe `localStorage` wrappers with cross-component reactivity

---

## 🚀 Running the Project

```bash
# Navigate into the project folder
cd OnlineShoppingSystem

# Install dependencies (if not already installed)
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔒 Project Isolation Notice

This project is completely isolated within `OnlineShoppingSystem/`:
- MediCare project files and configurations remain completely untouched.
- Independent package management, styles, Tailwind configuration, and routing.
