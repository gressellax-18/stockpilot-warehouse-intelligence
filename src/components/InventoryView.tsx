import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Boxes,
  AlertTriangle,
  Search,
  PlusCircle,
  TrendingDown,
  Building2,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Package,
} from 'lucide-react';
import { getProductImage } from '../utils/productImages';

export const InventoryView: React.FC = () => {
  const {
    products,
    warehouses,
    inventory,
    activeWarehouseId,
    setActiveWarehouseId,
    createReorder,
    reorders,
    setIsNewOrderModalOpen,
  } = useWarehouse();

  const [searchSku, setSearchSku] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [reorderModalSku, setReorderModalSku] = useState<string | null>(null);
  const [reorderQty, setReorderQty] = useState(25);

  const filteredInventory = inventory.filter((item) => {
    if (activeWarehouseId && item.warehouseId !== activeWarehouseId) return false;
    const product = products.find((p) => p.sku === item.sku);
    if (selectedCategory !== 'ALL' && product?.category !== selectedCategory) return false;

    if (searchSku.trim()) {
      const q = searchSku.toLowerCase();
      return (
        item.sku.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        item.binLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalOnHand = filteredInventory.reduce((sum, i) => sum + i.onHand, 0);
  const totalReserved = filteredInventory.reduce((sum, i) => sum + i.reserved, 0);
  const totalAvailable = filteredInventory.reduce((sum, i) => sum + i.available, 0);
  const totalDamaged = filteredInventory.reduce((sum, i) => sum + i.damaged, 0);
  const totalMissing = filteredInventory.reduce((sum, i) => sum + i.missing, 0);
  const totalIncoming = filteredInventory.reduce((sum, i) => sum + i.incoming, 0);

  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  const handleCreateReorder = (sku: string, whId: string) => {
    createReorder(sku, whId, reorderQty);
    setReorderModalSku(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12372A] tracking-tight">Multi-State Inventory Intelligence</h2>
          <p className="text-xs text-[#202923]/70">
            Real-time physical vs reserved states across 6 national hubs with automated replenishment forecasting.
          </p>
        </div>

        {/* Location selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E5EEE5] text-xs shadow-xs">
          <Building2 className="w-4 h-4 text-[#1E8E63]" />
          <span className="font-semibold text-[#12372A]/70">View Hub:</span>
          <select
            value={activeWarehouseId || ''}
            onChange={(e) => setActiveWarehouseId(e.target.value || null)}
            className="bg-transparent font-bold text-[#12372A] focus:outline-none cursor-pointer"
          >
            <option value="">All National Hubs (Consolidated)</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.city} ({w.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📊 Multi-State Inventory Architecture Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-xl border border-[#E5EEE5] space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">1. On Hand</div>
          <div className="text-xl font-bold font-mono text-[#12372A]">{totalOnHand}</div>
          <div className="text-[10px] text-[#202923]/60">Physical in bins</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E5EEE5] space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">2. Reserved</div>
          <div className="text-xl font-bold font-mono text-[#F3B562]">{totalReserved}</div>
          <div className="text-[10px] text-[#202923]/60">Committed to orders</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#1E8E63]/30 bg-[#E5EEE5]/30 space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-mono text-[#1E8E63] font-bold">3. Available</div>
          <div className="text-xl font-bold font-mono text-[#1E8E63]">{totalAvailable}</div>
          <div className="text-[10px] text-[#1E8E63]">Ready for allocation</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E5EEE5] space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-mono text-[#F26B5B] font-semibold">4. Damaged / Qtn</div>
          <div className="text-xl font-bold font-mono text-[#F26B5B]">{totalDamaged}</div>
          <div className="text-[10px] text-[#F26B5B]">Quarantine area</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E5EEE5] space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">5. Missing (Discrepancy)</div>
          <div className="text-xl font-bold font-mono text-[#F26B5B]">{totalMissing}</div>
          <div className="text-[10px] text-[#202923]/60">Flagged for audit</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E5EEE5] space-y-1 shadow-xs">
          <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">6. Incoming POs</div>
          <div className="text-xl font-bold font-mono text-[#12372A]">{totalIncoming}</div>
          <div className="text-[10px] text-[#202923]/60">In-transit shipments</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEE5] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 bg-[#F7F5EF] px-3 py-2 rounded-xl border border-[#12372A]/10 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#202923]/50" />
          <input
            type="text"
            value={searchSku}
            onChange={(e) => setSearchSku(e.target.value)}
            placeholder="Search by SKU, Product Name, or Bin Location..."
            className="bg-transparent text-xs text-[#12372A] focus:outline-none w-full font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#12372A] text-white'
                  : 'bg-[#F7F5EF] text-[#202923]/70 hover:bg-[#E5EEE5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#E5EEE5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5EF] border-b border-[#E5EEE5] text-[11px] font-mono uppercase text-[#202923]/70">
              <tr>
                <th className="py-3 px-4 font-bold">SKU & Product</th>
                <th className="py-3 px-4 font-bold">Hub & Bin</th>
                <th className="py-3 px-4 font-bold font-mono">On Hand</th>
                <th className="py-3 px-4 font-bold font-mono">Reserved</th>
                <th className="py-3 px-4 font-bold font-mono">Available</th>
                <th className="py-3 px-4 font-bold font-mono">Damaged / Miss</th>
                <th className="py-3 px-4 font-bold">Days Supply</th>
                <th className="py-3 px-4 font-bold text-right">Replenishment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EEE5]">
              {filteredInventory.map((item) => {
                const product = products.find((p) => p.sku === item.sku);
                const wh = warehouses.find((w) => w.id === item.warehouseId);
                const isLowStock = item.available <= 5;
                const daysSupply = Math.round(item.available / 1.8);

                return (
                  <tr key={`${item.warehouseId}-${item.sku}`} className="hover:bg-[#F7F5EF]/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs">
                          <img
                            src={getProductImage(item.sku, product?.imageUrl)}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[#12372A] font-mono">{item.sku}</div>
                          <div className="text-[11px] text-[#202923]/70">{item.productName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">₹{product?.unitPrice.toLocaleString()}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#12372A]">{wh?.city}</div>
                      <span className="text-[10px] font-mono font-bold bg-[#12372A]/10 text-[#12372A] px-1.5 py-0.2 rounded">
                        Bin: {item.binLocation}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#12372A]">{item.onHand}</td>
                    <td className="py-3 px-4 font-mono text-[#F3B562] font-semibold">{item.reserved}</td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          item.available <= 2
                            ? 'bg-[#F26B5B] text-white'
                            : item.available <= 7
                            ? 'bg-[#F3B562]/20 text-[#12372A] border border-[#F3B562]'
                            : 'bg-[#E5EEE5] text-[#1E8E63]'
                        }`}
                      >
                        {item.available} units
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      {item.damaged > 0 && <span className="text-[#F26B5B] mr-1">{item.damaged} dam</span>}
                      {item.missing > 0 && <span className="text-[#F26B5B] font-bold">{item.missing} miss</span>}
                      {item.damaged === 0 && item.missing === 0 && <span className="text-gray-400">0</span>}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono font-semibold">
                        <span className={daysSupply <= 3 ? 'text-[#F26B5B]' : 'text-[#1E8E63]'}>
                          {daysSupply} Days
                        </span>
                      </div>
                      <div className="text-[10px] text-[#202923]/50">Run rate: 1.8/day</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setReorderModalSku(item.sku)}
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 ${
                          isLowStock
                            ? 'bg-[#12372A] text-[#A7D46F] hover:bg-[#12372A]/90'
                            : 'bg-[#F7F5EF] hover:bg-[#E5EEE5] text-[#12372A]'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reorder</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Reorder POs Banner */}
      {reorders.length > 0 && (
        <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#12372A]/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]">
              Active Supplier Replenishment POs ({reorders.length})
            </h3>
            <span className="text-[10px] text-[#1E8E63] font-semibold">Automatic Lead Time Buffer: 2 Days</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {reorders.map((reo) => (
              <div key={reo.id} className="p-3 bg-white rounded-xl border border-[#E5EEE5] text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#12372A]">{reo.id}</span>
                  <span className="text-[9px] font-bold bg-[#A7D46F] text-[#12372A] px-1.5 py-0.2 rounded font-mono">
                    {reo.status}
                  </span>
                </div>
                <div className="font-semibold text-[#12372A]">{reo.productName} ({reo.sku})</div>
                <div className="text-[10px] text-[#202923]/70">
                  Qty: <strong>{reo.quantityRequested}</strong> · Hub: <strong>{reo.warehouseName}</strong>
                </div>
                <div className="text-[10px] text-gray-500">Supplier: {reo.supplier}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Reorder Modal */}
      {reorderModalSku && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#E5EEE5] shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-[#12372A]">Create Replenishment Order</h3>
            <p className="text-xs text-[#202923]/70">
              Generate an automated purchase order for SKU <strong>{reorderModalSku}</strong>.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#12372A]">Quantity to Reorder</label>
              <input
                type="number"
                min="5"
                max="500"
                value={reorderQty}
                onChange={(e) => setReorderQty(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-mono font-bold focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReorderModalSku(null)}
                className="py-2 px-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateReorder(reorderModalSku, activeWarehouseId || 'wh-hyd')}
                className="py-2 px-4 rounded-xl bg-[#12372A] text-white text-xs font-bold hover:bg-[#12372A]/90"
              >
                Issue Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
