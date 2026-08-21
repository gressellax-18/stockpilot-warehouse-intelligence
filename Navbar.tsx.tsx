import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Boxes, 
  CreditCard, 
  Clock, 
  Cpu,
  Sparkles,
  X,
  Truck
} from 'lucide-react';
import { DepartmentId } from '../types';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDepartment: DepartmentId;
  setSelectedDepartment: (dept: DepartmentId) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenInventory: () => void;
  onOpenHistory: () => void;
  onSelectBills: () => void;
  activeView: 'store' | 'inventory' | 'bills' | 'stockpilot' | 'orders';
  setActiveView: (view: 'store' | 'inventory' | 'bills' | 'stockpilot' | 'orders') => void;
  ordersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onOpenHistory,
  activeView,
  setActiveView,
  ordersCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Flash Deal
            </span>
            <span className="hidden sm:inline text-slate-300">
              Use code <strong className="text-white font-mono">SAVE10</strong> for 10% off • Free 2-Day Shipping on orders over $50
            </span>
            <span className="sm:hidden text-slate-300">
              Free delivery over $50 with code <strong className="text-white">SAVE10</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-300 text-xs">
            <button
              id="nav-stockpilot-quick-btn"
              onClick={() => setActiveView('stockpilot')}
              className={`hover:text-indigo-300 flex items-center space-x-1.5 cursor-pointer transition-colors ${
                activeView === 'stockpilot' ? 'text-indigo-400 font-bold' : 'text-indigo-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>StockPilot AI</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              id="nav-order-history-btn"
              onClick={() => setActiveView('orders')}
              className={`hover:text-white flex items-center space-x-1 cursor-pointer transition-colors ${
                activeView === 'orders' ? 'text-white font-bold' : 'text-slate-300'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recent Orders & Activity</span>
            </button>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>8 Departments Open</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveView('store')}
            className="flex items-center space-x-2.5 cursor-pointer select-none group shrink-0"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-serif">Omni<span className="text-indigo-600">Store</span></span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Superstore
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:block">Store • StockPilot AI • Bills</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 8 departments, products, brands, or SKUs..."
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-100/90 border border-slate-200 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-hidden text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Views & Navigation items */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* View Switchers */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
              <button
                id="nav-tab-store"
                onClick={() => setActiveView('store')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                  activeView === 'store'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Store</span>
              </button>

              <button
                id="nav-tab-stockpilot"
                onClick={() => setActiveView('stockpilot')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                  activeView === 'stockpilot'
                    ? 'bg-slate-950 text-indigo-300 shadow-xs font-bold'
                    : 'text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                <span className="hidden sm:inline">StockPilot AI</span>
                <span className="sm:hidden">Pilot AI</span>
              </button>

              <button
                id="nav-tab-orders"
                onClick={() => setActiveView('orders')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                  activeView === 'orders'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Recent Activity</span>
                <span className="sm:hidden">Orders</span>
                {ordersCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 font-mono font-bold">
                    {ordersCount}
                  </span>
                )}
              </button>

              <button
                id="nav-tab-bills"
                onClick={() => setActiveView('bills')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                  activeView === 'bills'
                    ? 'bg-white text-violet-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-violet-600" />
                <span className="hidden sm:inline">Bills & Recharges</span>
                <span className="sm:hidden">Bills</span>
              </button>

              <button
                id="nav-tab-inventory"
                onClick={() => setActiveView('inventory')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                  activeView === 'inventory'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Boxes className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Inventory</span>
                <span className="sm:hidden">Stock</span>
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              id="nav-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm shadow-indigo-600/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="w-5 h-5 rounded-full bg-white text-indigo-700 text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>

          </div>
        </div>

        {/* Mobile Search input bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, or SKUs..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-900 outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
