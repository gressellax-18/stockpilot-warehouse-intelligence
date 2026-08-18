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
} from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';

export interface DepartmentCategory {
  id: string;
  name: string;
  icon: string;
  accent: string;
  description: string;
  skus: string[];
}

export const DEPARTMENTS: DepartmentCategory[] = [
  {
    id: 'mobiles',
    name: 'Mobiles & Tech',
    icon: '📱',
    accent: 'from-blue-600 to-indigo-700',
    description: 'Flagship smartphones, 5G devices, iPads & smart tablets',
    skus: ['SKU-MOB-01', 'SKU-MOB-02', 'SKU-MOB-03', 'SKU-MOB-04'],
  },
  {
    id: 'fashions',
    name: 'Fashions & Sarees',
    icon: '👗',
    accent: 'from-rose-600 to-pink-700',
    description: 'Kanjivaram silks, Banarasi brocades, designer gowns & sherwanis',
    skus: ['SKU-701', 'SKU-702', 'SKU-706', 'SKU-750', 'SKU-704'],
  },
  {
    id: 'electronics',
    name: 'Electronics & Devices',
    icon: '⚡',
    accent: 'from-amber-600 to-yellow-600',
    description: 'Laser LiDAR sensors, thermal optics, 48V batteries & robotics',
    skus: ['SKU-421', 'SKU-872', 'SKU-309', 'SKU-TECH-01', 'SKU-TECH-02'],
  },
  {
    id: 'travel',
    name: 'Travel Items & Bags',
    icon: '🧳',
    accent: 'from-emerald-600 to-teal-700',
    description: 'RFID calfskin wallets, polycarbonate spinners & duffle luggage',
    skus: ['SKU-730', 'SKU-731', 'SKU-732', 'SKU-TRV-01'],
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    icon: '🏠',
    accent: 'from-purple-600 to-violet-700',
    description: 'Dyson air purifiers, robotic floor vacuums & gourmet tri-ply sets',
    skus: ['SKU-HOM-01', 'SKU-HOM-02', 'SKU-HOM-03'],
  },
  {
    id: 'everyday',
    name: 'Everyday Needs & FMCG',
    icon: '🛒',
    accent: 'from-green-600 to-emerald-700',
    description: 'Organic cold-pressed soaps, ayurvedic oils & raw forest honey',
    skus: ['SKU-501', 'SKU-502', 'SKU-503', 'SKU-504'],
  },
  {
    id: 'bills',
    name: 'Bills & Recharges',
    icon: '⚡',
    accent: 'from-cyan-600 to-blue-700',
    description: 'Express electricity bill BBPS, fiber gigabit recharges & Fastags',
    skus: ['SKU-BIL-01', 'SKU-BIL-02', 'SKU-BIL-03'],
  },
  {
    id: 'toys',
    name: 'Kids Toys & STEM',
    icon: '🧸',
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
  const { setCurrentView } = useWarehouse();
  const [selectedSkuForModal, setSelectedSkuForModal] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleCategoryClick = (dept: DepartmentCategory) => {
    if (onSelectCategory) {
      onSelectCategory(dept.id);
    }
    // Also toggle dropdown preview
    setDropdownOpen(dropdownOpen === dept.id ? null : dept.id);
  };

  return (
    <div className="w-full bg-white border-b border-[#E5EEE5] shadow-2xs relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-thin">
          <div className="flex items-center gap-1.5 pr-2 border-r border-[#E5EEE5] mr-1 flex-shrink-0">
            <span className="text-[10px] uppercase font-mono font-bold text-[#12372A]/70 px-2 py-1 bg-[#F7F5EF] rounded-lg">
              Departments:
            </span>
          </div>

          {DEPARTMENTS.map((dept) => {
            const isActive = activeCategoryId === dept.id || dropdownOpen === dept.id;
            return (
              <div key={dept.id} className="relative flex-shrink-0">
                <button
                  onClick={() => handleCategoryClick(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#12372A] text-white shadow-xs'
                      : 'bg-[#F7F5EF] hover:bg-[#E5EEE5] text-[#12372A]'
                  }`}
                >
                  <span>{dept.icon}</span>
                  <span>{dept.name}</span>
                </button>

                {/* Dropdown Quick Catalog Preview */}
                {dropdownOpen === dept.id && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-[#12372A]/15 shadow-xl p-3 z-50 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5EEE5]">
                      <div>
                        <div className="font-bold text-xs text-[#12372A] flex items-center gap-1">
                          <span>{dept.icon}</span> {dept.name}
                        </div>
                        <div className="text-[10px] text-[#202923]/60">{dept.description}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {dept.skus.map((sku) => (
                        <button
                          key={sku}
                          onClick={() => {
                            setSelectedSkuForModal(sku);
                            setDropdownOpen(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-[#F7F5EF] text-xs flex items-center justify-between group transition"
                        >
                          <span className="font-mono font-bold text-[#12372A] group-hover:text-[#1E8E63]">
                            {sku}
                          </span>
                          <span className="text-[10px] text-[#202923]/50 flex items-center gap-0.5">
                            Inspect Gallery <ChevronRight className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(null);
                        setCurrentView('inventory');
                      }}
                      className="w-full py-1.5 rounded-lg bg-[#12372A]/5 hover:bg-[#12372A]/10 text-[#12372A] text-[11px] font-bold text-center block transition"
                    >
                      View All in Inventory Hub →
                    </button>
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
    </div>
  );
};
