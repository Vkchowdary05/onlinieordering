import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-600 mt-20">
      {/* 4 Feature Badges section (Creative Tim UI Ecommerce Blocks style) */}
      <div className="border-b border-zinc-100 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Complimentary Shipping</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Free standard delivery on all continental orders over $50.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Encrypted Payments</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  256-bit bank-grade encryption with multi-gateway redundancy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">30-Day Hassle Free Returns</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Simple return labels and full refunds for unopened merchandise.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">24/7 Concierge Support</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Dedicated specialist assistance via chat and prioritized email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold tracking-tighter text-base">
                N
              </div>
              <span className="text-lg font-bold text-zinc-900">
                Nova<span className="text-zinc-500 font-light">Store</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              An enterprise-grade online shopping and order management system built with
              Creative Tim UI architecture, Tailwind CSS, React, and TypeScript.
            </p>
            <div className="text-xs text-zinc-400">
              Demo Environment: Isolated LocalStorage Persistence
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Categories
            </h5>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>Electronics & Displays</li>
              <li>Audio & Soundbars</li>
              <li>Wearables & Health</li>
              <li>Computing & Peripherals</li>
              <li>Smart Home Automation</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Demo Roles
            </h5>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>Customer: <code className="text-zinc-800 font-mono">customer@demo.com</code></li>
              <li>Admin: <code className="text-zinc-800 font-mono">admin@demo.com</code></li>
              <li>Password: <code className="text-zinc-800 font-mono">password123</code></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} NovaStore. Creative Tim UI Components. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
