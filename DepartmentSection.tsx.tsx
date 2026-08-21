import React, { useState } from 'react';
import { 
  Smartphone, 
  Shirt, 
  Laptop, 
  Luggage, 
  UtensilsCrossed, 
  ShoppingBag, 
  CreditCard, 
  Gamepad2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Star,
  Zap,
  Tag,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { Department, DepartmentId, Product } from '../types';
import { ProductCard } from './ProductCard';
import { SafeImage } from './SafeImage';

interface DepartmentSectionsProps {
  departments: Department[];
  products: Product[];
  onSelectDepartment: (deptId: DepartmentId) => void;
  onAddToCart: (product: Product) => void;
  onUpdateCartQty?: (productId: string, delta: number) => void;
  cart: { product: Product; quantity: number }[];
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenBills: () => void;
}

const getDepartmentIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Luggage':
      return <Luggage className={className} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Gamepad2':
      return <Gamepad2 className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

export const DepartmentSections: React.FC<DepartmentSectionsProps> = ({
  departments,
  products,
  onSelectDepartment,
  onAddToCart,
  onUpdateCartQty,
  cart,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onOpenBills
}) => {
  const [activeJumpDept, setActiveJumpDept] = useState<string>('mobile');

  const scrollToDepartment = (deptId: string) => {
    setActiveJumpDept(deptId);
    const element = document.getElementById(`dept-section-${deptId}`);
    if (element) {
      const yOffset = -140; // account for sticky navbar and department bar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Filter out bills-recharge for standard physical product sections
  const physicalDepartments = departments.filter(d => d.id !== 'bills-recharge');

  return (
    <div className="space-y-12">
      {/* Sticky Department Quick Jump Sub-Navigation */}
      <div className="sticky top-14 z-20 bg-slate-900/95 backdrop-blur-md border-y border-slate-800 py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2 shrink-0 text-slate-300 text-xs font-bold uppercase tracking-wider hidden md:flex">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Jump to Section:</span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5 w-full">
            {departments.map((dept) => {
              const isBills = dept.id === 'bills-recharge';
              return (
                <button
                  key={dept.id}
                  onClick={() => isBills ? onOpenBills() : scrollToDepartment(dept.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-all cursor-pointer border ${
                    activeJumpDept === dept.id && !isBills
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : isBills
                      ? 'bg-violet-950/80 text-violet-300 border-violet-700/60 hover:bg-violet-900'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {getDepartmentIcon(dept.iconName, 'w-3.5 h-3.5')}
                  <span>{dept.shortName}</span>
                  <span className="text-[10px] opacity-75 font-mono">({dept.itemCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Department Sections Loop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {physicalDepartments.map((dept, deptIndex) => {
          const deptProducts = products.filter(p => p.department === dept.id);
          const inStockCount = deptProducts.filter(p => p.inStock && p.stockCount > 0).length;
          const bestSeller = deptProducts.find(p => p.isBestSeller) || deptProducts[0];

          return (
            <section
              key={dept.id}
              id={`dept-section-${dept.id}`}
              className="scroll-mt-40 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              {/* Department Section Header Banner */}
              <div className={`p-6 sm:p-8 bg-gradient-to-r ${dept.bannerGradient} text-white relative overflow-hidden`}>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-black/10 backdrop-blur-[2px] transform skew-x-12 pointer-events-none hidden lg:block"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold tracking-wide uppercase flex items-center space-x-1 border border-white/30">
                        {getDepartmentIcon(dept.iconName, 'w-3.5 h-3.5 text-white')}
                        <span>{dept.featuredTag || 'Verified Department'}</span>
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-white/90 text-xs font-semibold">
                        {inStockCount} of {deptProducts.length} Items In Stock
                      </span>

                      <span className="text-white/80 text-xs font-medium hidden sm:inline">
                        • Verified High-Res Photography
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {dept.name}
                    </h2>
                    <p className="text-white/90 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl">
                      {dept.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => onSelectDepartment(dept.id)}
                      className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-50 text-xs font-bold shadow-md hover:shadow-lg flex items-center space-x-2 transition-all cursor-pointer transform hover:scale-[1.02]"
                    >
                      <span>Explore Full {dept.shortName} Department</span>
                      <ArrowRight className="w-4 h-4 text-indigo-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Department Products Showcase Grid */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      Featured {dept.shortName} Catalog ({deptProducts.length} Verified Products)
                    </h3>
                  </div>

                  <button
                    onClick={() => onSelectDepartment(dept.id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <span>View all {deptProducts.length} items</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4-column responsive product card shelf */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                  {deptProducts.map((product) => {
                    const cartItem = cart.find(item => item.product.id === product.id);
                    const isWishlisted = wishlist.some(p => p.id === product.id);

                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onUpdateCartQty={onUpdateCartQty}
                        cartQuantity={cartItem?.quantity || 0}
                        onQuickView={onQuickView}
                        isWishlisted={isWishlisted}
                        onToggleWishlist={onToggleWishlist}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Department Bottom Quick Guarantee bar */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Quality Inspected</span>
                  </span>
                  <span className="flex items-center space-x-1 font-medium">
                    <Truck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Free 2-Day Shipping Eligible</span>
                  </span>
                  <span className="flex items-center space-x-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Direct Brand Warranty</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectDepartment(dept.id)}
                  className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Filter & Sort {dept.shortName} →
                </button>
              </div>
            </section>
          );
        })}

        {/* Digital Bills & Recharges Interactive Department Showcase Card */}
        <section
          id="dept-section-bills-recharge"
          className="scroll-mt-40 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border border-indigo-500/30 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-bold mb-3">
                <CreditCard className="w-3.5 h-3.5 text-violet-400" />
                <span>Instant 0% Convenience Fee Digital Services</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Bills, Mobile Recharges & Utilities
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Recharge prepaid 5G plans (Airtel, Jio, Vi), settle electricity bills across 30+ utility boards, pay FASTag, broadband, and water bills with instant operator verification and downloadable receipts.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenBills}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all cursor-pointer transform hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Open Bills & Recharge Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick service pills preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              {[
                { title: 'Mobile Prepaid', desc: '5G Plans & Data', icon: Smartphone },
                { title: 'Electricity Bill', desc: '30+ Power Boards', icon: Zap },
                { title: 'FASTag Recharge', desc: 'Instant Toll Wallet', icon: Tag },
                { title: 'Broadband Fiber', desc: 'High-speed ISPs', icon: Laptop },
                { title: 'DTH Satellite', desc: 'Tata Play, DishTV', icon: Sparkles },
                { title: 'Instant Receipts', desc: 'PDF & Tax Invoices', icon: CheckCircle2 }
              ].map((srv, idx) => {
                const IconComponent = srv.icon;
                return (
                  <div
                    key={idx}
                    onClick={onOpenBills}
                    className="bg-slate-950/60 hover:bg-indigo-900/40 p-3.5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer"
                  >
                    <IconComponent className="w-5 h-5 text-indigo-400 mb-1.5" />
                    <div className="text-xs font-bold text-white">{srv.title}</div>
                    <div className="text-[10px] text-slate-400">{srv.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
