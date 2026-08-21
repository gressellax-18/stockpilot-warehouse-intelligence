import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Smartphone,
  Sparkles,
  Zap,
  Luggage,
  Home,
  ShoppingBag,
  Receipt,
  Gamepad2,
  ChevronRight,
  Boxes,
  Layers,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { AddProductModal } from './AddProductModal';
import { getProductImage } from '../utils/productImages';

export interface DepartmentCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  accent: string;
  description: string;
  skus: string[];
}

export const DEPARTMENTS: DepartmentCategory[] = [
  {
    id: 'mobiles',
    name: 'Mobiles & Tech',
    icon: '📱',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
    accent: 'from-blue-600 to-indigo-700',
    description: 'Flagship smartphones, 5G devices, iPads & smart tablets',
    skus: ['SKU-MOB-01', 'SKU-MOB-02', 'SKU-MOB-03', 'SKU-MOB-04'],
  },
  {
    id: 'fashions',
    name: 'Fashions & Sarees',
    icon: '👗',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80',
    accent: 'from-rose-600 to-pink-700',
    description: 'Kanjivaram silks, Banarasi brocades, designer gowns & sherwanis',
    skus: ['SKU-701', 'SKU-702', 'SKU-704', 'SKU-706', 'SKU-750'],
  },
  {
    id: 'electronics',
    name: 'Electronics & Devices',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    accent: 'from-amber-600 to-yellow-600',
    description: 'Laser LiDAR sensors, thermal optics, 48V batteries & robotics',
    skus: ['SKU-421', 'SKU-872', 'SKU-104', 'SKU-309', 'SKU-TECH-01', 'SKU-TECH-02', 'SKU-TECH-03'],
  },
  {
    id: 'travel',
    name: 'Travel Items & Bags',
    icon: '🧳',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    accent: 'from-emerald-600 to-teal-700',
    description: 'RFID calfskin wallets, polycarbonate spinners & duffle luggage',
    skus: ['SKU-730', 'SKU-731', 'SKU-TRV-01', 'SKU-TRV-02'],
  },
  {
    id: 'shoes',
    name: 'Shoes & Luxury Footwear',
    icon: '👞',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&auto=format&fit=crop&q=80',
    accent: 'from-slate-700 to-slate-900',
    description: 'Handcrafted Italian Oxford leather shoes, Pro running shoes & mojari juttis',
    skus: ['SKU-720', 'SKU-721'],
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&auto=format&fit=crop&q=80',
    accent: 'from-purple-600 to-violet-700',
    description: 'Dyson air purifiers, robotic floor vacuums & gourmet tri-ply sets',
    skus: ['SKU-HOM-01', 'SKU-HOM-02', 'SKU-HOM-03', 'SKU-HOM-04'],
  },
  {
    id: 'everyday',
    name: 'Everyday Needs & FMCG',
    icon: '🛒',
    image: 'https://images.unsplash.com/photo-1607006314591-f9250005a769?w=500&auto=format&fit=crop&q=80',
    accent: 'from-green-600 to-emerald-700',
    description: 'Organic cold-pressed soaps, ayurvedic oils & raw forest honey',
    skus: ['SKU-501', 'SKU-502', 'SKU-503', 'SKU-504', 'SKU-EVD-01', 'SKU-EVD-02'],
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    icon: '💎',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=80',
    accent: 'from-amber-500 to-rose-600',
    description: 'Kundan Polki chandelier earrings, solitaire diamond studs & temple jhumkas',
    skus: ['SKU-740', 'SKU-741'],
  },
  {
    id: 'bills',
    name: 'Bills & Recharges',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
    accent: 'from-cyan-600 to-blue-700',
    description: 'Express electricity bill BBPS, fiber gigabit recharges & Fastags',
    skus: ['SKU-BIL-01', 'SKU-BIL-02', 'SKU-BIL-03'],
  },
  {
    id: 'toys',
    name: 'Kids Toys & STEM',
    icon: '🧸',
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=500&auto=format&fit=crop&q=80',
    accent: 'from-orange-600 to-amber-700',
    description: 'LEGO Technic space rovers, AI robotic arms & RC stunt vehicles',
    skus: ['SKU-TOY-01', 'SKU-TOY-02', 'SKU-TOY-03', 'SKU-TOY-04'],
  },
];

interface DepartmentMenuBarProps {
  onSelectCategory?: (catId: string) => void;
  activeCategoryId?: string | null;
}

export const DepartmentMenuBar: React.FC<DepartmentMenuBarProps> = ({
  onSelectCategory,
  activeCategoryId,
}) => {
  const { setCurrentView, inventory, products } = useWarehouse();
  const [selectedSkuForModal, setSelectedSkuForModal] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [addModalDeptId, setAddModalDeptId] = useState<string | null>(null);

  const handleCategoryClick = (dept: DepartmentCategory) => {
    if (onSelectCategory) {
      onSelectCategory(dept.id);
    }
    // Toggle dropdown preview
    setDropdownOpen(dropdownOpen === dept.id ? null : dept.id);
  };

  // Dynamically resolve all unique SKUs for a department (including dynamically added products)
  const getDepartmentSkus = (dept: DepartmentCategory) => {
    const staticSkus = dept.skus;
    const dynamicSkus = products
      .filter((p: any) => p.departmentId === dept.id || (p.category && p.category.toLowerCase().includes(dept.id.slice(0, 4))))
      .map((p) => p.sku);
    
    // Strict deduplication
    return Array.from(new Set([...staticSkus, ...dynamicSkus]));
  };

  return (
    <div className="w-full bg-[#061510]/95 backdrop-blur-md border-b border-[#00F59B]/20 shadow-md relative z-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-thin">
          
          {/* Department Label Pill */}
          <div className="flex items-center gap-1.5 pr-2.5 border-r border-[#1B4336] mr-0.5 flex-shrink-0">
            <span className="text-[10px] uppercase font-mono font-black text-[#00F59B] px-2.5 py-1 bg-[#092219] border border-[#00F59B]/30 rounded-lg flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-ping"></span>
              Departments ({DEPARTMENTS.length})
            </span>
          </div>

          {DEPARTMENTS.map((dept) => {
            const deptSkus = getDepartmentSkus(dept);
            const isActive = activeCategoryId === dept.id || dropdownOpen === dept.id;

            return (
              <div key={dept.id} className="relative flex-shrink-0">
                <button
                  onClick={() => handleCategoryClick(dept)}
                  className={`pl-1.5 pr-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? 'bg-[#00F59B] text-[#041B13] border-[#00F59B] shadow-[0_0_15px_rgba(0,245,155,0.35)]'
                      : 'bg-[#0B211A] hover:bg-[#102F25] text-[#D1E7DD] border-[#184537] hover:border-[#00F59B]/40'
                  }`}
                >
                  {/* Department Thumbnail Photo */}
                  <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 border border-white/20 shadow-2xs relative bg-black/40">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] bg-black/30">
                      {dept.icon}
                    </span>
                  </div>
                  <span>{dept.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#041B13] text-[#00F59B] font-black' : 'bg-black/30 text-[#8BAE9E]'
                  }`}>
                    {deptSkus.length}
                  </span>
                </button>

                {/* Dropdown Quick Catalog Preview with Department Hero Image */}
                {dropdownOpen === dept.id && (
                  <div className="absolute top-full left-0 mt-2 w-88 bg-[#0B1F18] border border-[#00F59B]/30 rounded-2xl shadow-2xl overflow-hidden p-0 z-50 animate-fadeIn">
                    
                    {/* Category Hero Cover Image Banner */}
                    <div className="relative h-24 w-full overflow-hidden bg-black">
                      <img
                        src={dept.image}
                        alt={dept.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-80 hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F18] via-[#0B1F18]/60 to-transparent flex flex-col justify-end p-3 text-white">
                        <div className="font-black text-sm flex items-center gap-1.5 text-white">
                          <span className="text-base">{dept.icon}</span> {dept.name}
                        </div>
                        <div className="text-[10px] text-[#A1C7B7] line-clamp-1">{dept.description}</div>
                      </div>
                    </div>

                    <div className="p-3 space-y-2.5">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8BAE9E]">
                          Department Catalog ({deptSkus.length} SKUs):
                        </span>
                        <button
                          onClick={() => {
                            setAddModalDeptId(dept.id);
                            setDropdownOpen(null);
                          }}
                          className="text-[11px] font-bold text-[#00F59B] hover:text-[#34D399] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Product
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                        {deptSkus.map((sku) => {
                          const prod = products.find((p) => p.sku === sku);
                          const skuInvs = inventory.filter((i) => i.sku === sku);
                          const totalAvail = skuInvs.reduce((acc, curr) => acc + curr.available, 0);
                          const totalDamaged = skuInvs.reduce((acc, curr) => acc + (curr.damaged || 0), 0);

                          return (
                            <button
                              key={sku}
                              onClick={() => {
                                setSelectedSkuForModal(sku);
                                setDropdownOpen(null);
                              }}
                              className="w-full text-left p-2 rounded-xl bg-[#081812] hover:bg-[#123326] border border-[#163D30] hover:border-[#00F59B]/40 text-xs flex items-center gap-2.5 group transition cursor-pointer"
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-black/40 border border-[#1E4D3D] relative">
                                <img
                                  src={getProductImage(sku, prod?.imageUrl || dept.image)}
                                  alt={prod?.name || sku}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-bold text-white group-hover:text-[#00F59B]">
                                    {sku}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-[#00F59B]">
                                    {totalAvail} in Stock
                                  </span>
                                </div>
                                <div className="text-[11px] text-[#A1C7B7] truncate">
                                  {prod?.name || 'Catalog Item'}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-mono text-gray-400">
                                    ₹{prod?.unitPrice?.toLocaleString() || '—'}
                                  </span>
                                  {totalDamaged > 0 && (
                                    <span className="text-[9px] text-rose-400 font-bold flex items-center gap-0.5">
                                      <ShieldAlert className="w-2.5 h-2.5" /> {totalDamaged} damaged
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-[#8BAE9E] group-hover:text-[#00F59B] shrink-0" />
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-[#163D30] flex items-center gap-2">
                        <button
                          onClick={() => {
                            setDropdownOpen(null);
                            setCurrentView('inventory');
                          }}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#041E15] text-[11px] font-bold text-center block transition shadow-xs cursor-pointer"
                        >
                          View in Inventory Ledger →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedSkuForModal && (
        <ProductDetailModal
          sku={selectedSkuForModal}
          onClose={() => setSelectedSkuForModal(null)}
        />
      )}

      {/* Add Product Modal */}
      {addModalDeptId && (
        <AddProductModal
          isOpen={!!addModalDeptId}
          onClose={() => setAddModalDeptId(null)}
          defaultDepartmentId={addModalDeptId}
        />
      )}
    </div>
  );
};
