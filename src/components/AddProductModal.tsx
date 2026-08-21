import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { DEPARTMENTS } from './DepartmentMenuBar';
import { 
  PackagePlus, 
  X, 
  Sparkles, 
  Layers, 
  IndianRupee, 
  Scale, 
  Building2, 
  Warehouse as WarehouseIcon,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDepartmentId?: string;
}

const PRESET_IMAGES: Record<string, string[]> = {
  mobiles: [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
  ],
  fashions: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  ],
  travel: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop&q=80',
  ],
  shoes: [
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  ],
  home: [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584990347449-3993d0c2666a?w=600&auto=format&fit=crop&q=80',
  ],
  everyday: [
    'https://images.unsplash.com/photo-1607006314591-f9250005a769?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
  ],
  jewelry: [
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
  ],
  bills: [
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
  ],
  toys: [
    'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&auto=format&fit=crop&q=80',
  ],
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  defaultDepartmentId = 'mobiles',
}) => {
  const { warehouses, addNewProduct } = useWarehouse();

  const [selectedDept, setSelectedDept] = useState(defaultDepartmentId);
  const [sku, setSku] = useState(`SKU-${defaultDepartmentId.toUpperCase().slice(0, 3)}-${Math.floor(10 + Math.random() * 90)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(2499);
  const [weightKg, setWeightKg] = useState<number>(0.85);
  const [minThreshold, setMinThreshold] = useState<number>(15);
  const [reorderPoint, setReorderPoint] = useState<number>(30);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(3);
  const [supplier, setSupplier] = useState('National Prime Supplier Hub');
  const [imageUrl, setImageUrl] = useState(
    PRESET_IMAGES[defaultDepartmentId]?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'
  );

  // Initial stock quantities across the hubs
  const [hubStock, setHubStock] = useState<Record<string, number>>({
    'wh-hyd': 25,
    'wh-blr': 30,
    'wh-che': 20,
    'wh-pun': 15,
    'wh-del': 20,
    'wh-kol': 15,
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDeptChange = (deptId: string) => {
    setSelectedDept(deptId);
    const deptObj = DEPARTMENTS.find(d => d.id === deptId);
    setCategory(deptObj ? deptObj.name : 'General Catalog');
    setSku(`SKU-${deptId.toUpperCase().slice(0, 3)}-${Math.floor(10 + Math.random() * 90)}`);
    if (PRESET_IMAGES[deptId]?.[0]) {
      setImageUrl(PRESET_IMAGES[deptId][0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const deptObj = DEPARTMENTS.find(d => d.id === selectedDept);

    const newProduct = {
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      category: category || deptObj?.name || 'General Products',
      unitPrice: Number(unitPrice),
      weightKg: Number(weightKg),
      minThreshold: Number(minThreshold),
      reorderPoint: Number(reorderPoint),
      leadTimeDays: Number(leadTimeDays),
      supplier: supplier.trim() || 'Premier Supply Network',
      imageUrl: imageUrl.trim(),
      departmentId: selectedDept,
    };

    const distributions = warehouses.map((wh, idx) => {
      const stock = hubStock[wh.id] !== undefined ? hubStock[wh.id] : 20;
      const binLetter = String.fromCharCode(65 + (idx % 26));
      return {
        warehouseId: wh.id,
        onHand: stock,
        available: Math.max(0, stock - 2),
        binLocation: `${binLetter}-0${idx + 1}`,
      };
    });

    addNewProduct(newProduct, distributions);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B1E17] text-[#E4F3ED] border border-[#00F59B]/30 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#143D30] bg-[#071812]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00F59B]/20 to-[#059669]/30 border border-[#00F59B]/40 text-[#00F59B]">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Add Product to Department & Inventory</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-Syncs to Hubs
                </span>
              </div>
              <p className="text-xs text-[#8BAE9E]">Instantly adds this unique SKU to the department catalog and generates multi-hub stock ledger.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8BAE9E] hover:text-white hover:bg-[#143D30] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#00F59B]/20 border-2 border-[#00F59B] flex items-center justify-center text-[#00F59B] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Product Successfully Enrolled!</h3>
            <p className="text-sm text-[#8BAE9E] max-w-md">
              <strong className="text-[#00F59B]">{name} ({sku})</strong> has been saved. It is now live in both the Department Catalog and the Inventory Master Ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 custom-scrollbar">
            
            {/* Department Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#8BAE9E] mb-2 uppercase tracking-wider">
                Select Department Target
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = selectedDept === dept.id;
                  return (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => handleDeptChange(dept.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#00F59B]/20 border-[#00F59B] text-white shadow-[0_0_12px_rgba(0,245,155,0.25)]'
                          : 'bg-[#0E2820]/60 border-[#1B4336] text-[#A1C4B5] hover:bg-[#143D30]'
                      }`}
                    >
                      <span className="text-base">{dept.icon}</span>
                      <span className="truncate">{dept.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Identification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8BAE9E] mb-1.5">
                  SKU Identifier (Must be Unique)
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="e.g. SKU-MOB-05"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#081B14] border border-[#1E4D3D] text-white font-mono text-sm focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BAE9E] mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sony Alpha 7 IV Full-Frame Camera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#081B14] border border-[#1E4D3D] text-white text-sm focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B] outline-none"
                />
              </div>
            </div>

            {/* Financials & Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8BAE9E] mb-1.5 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-[#00F59B]" /> Unit Price (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#081B14] border border-[#1E4D3D] text-white text-sm font-semibold focus:border-[#00F59B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BAE9E] mb-1.5 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-[#00F59B]" /> Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#081B14] border border-[#1E4D3D] text-white text-sm focus:border-[#00F59B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BAE9E] mb-1.5">
                  Min Safety Level
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#081B14] border border-[#1E4D3D] text-white text-sm focus:border-[#00F59B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BAE9E] mb-1.5">
                  Reorder Trigger
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={reorderPoint}
                  onChange={(e) => setReorderPoint(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#081B14] border border-[#1E4D3D] text-white text-sm focus:border-[#00F59B] outline-none"
                />
              </div>
            </div>

            {/* Supplier & Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8BAE9E] mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#00F59B]" /> Supplier & Guild Source
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g. Apex Industrial Optics"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#081B14] border border-[#1E4D3D] text-white text-sm focus:border-[#00F59B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BAE9E] mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#00F59B]" /> Product Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#081B14] border border-[#1E4D3D] text-white text-xs focus:border-[#00F59B] outline-none truncate"
                  />
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-10 h-10 rounded-lg object-cover border border-[#1E4D3D]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Initial Stock Distribution Across Warehouses */}
            <div className="p-4 rounded-xl bg-[#071812] border border-[#1B4336] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <WarehouseIcon className="w-4 h-4 text-[#00F59B]" />
                  Initial Stock Distribution Across Warehouses
                </label>
                <span className="text-[11px] text-[#00F59B] font-mono font-semibold">
                  Total Units: {Object.values(hubStock).reduce((a: number, b: number) => a + (Number(b) || 0), 0)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {warehouses.map((wh) => (
                  <div key={wh.id} className="p-2.5 rounded-xl bg-[#0D261E] border border-[#1E4D3D] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">{wh.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-[#8BAE9E]">{wh.city}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={hubStock[wh.id] ?? 20}
                        onChange={(e) =>
                          setHubStock((prev) => ({
                            ...prev,
                            [wh.id]: Math.max(0, parseInt(e.target.value, 10) || 0),
                          }))
                        }
                        className="w-16 px-2 py-1 rounded-lg bg-[#071812] border border-[#276450] text-right font-mono text-xs font-bold text-[#00F59B] outline-none focus:border-[#00F59B]"
                      />
                      <span className="text-[10px] text-[#8BAE9E]">pcs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#143D30] text-[#A1C4B5] hover:text-white hover:bg-[#1B4D3D] text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#041E15] font-bold text-sm shadow-[0_0_20px_rgba(0,245,155,0.3)] transition-all transform hover:scale-[1.02] flex items-center gap-2"
              >
                <PackagePlus className="w-4 h-4" />
                Add to Department & Inventory
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
