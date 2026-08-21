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
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  ShieldAlert,
  ArrowUpDown,
  Filter,
  Plus,
} from 'lucide-react';
import { getProductImage } from '../utils/productImages';
import { AddProductModal } from './AddProductModal';
import { ProductDetailModal } from './ProductDetailModal';

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
  const [stockHealthFilter, setStockHealthFilter] = useState<'ALL' | 'HEALTHY' | 'LOW' | 'DAMAGED'>('ALL');
  const [viewMode, setViewMode] = useState<'CONSOLIDATED' | 'BINS'>('CONSOLIDATED');
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailSku, setDetailSku] = useState<string | null>(null);

  const [reorderModalSku, setReorderModalSku] = useState<string | null>(null);
  const [reorderQty, setReorderQty] = useState(25);
  const [reorderWhId, setReorderWhId] = useState('wh-hyd');

  // Strict deduplication of products for the consolidated master view
  const uniqueProducts = React.useMemo(() => {
    const seen = new Set<string>();
    return products.filter((p) => {
      if (!p || !p.sku) return false;
      const key = p.sku.toUpperCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [products]);

  // Aggregate stats per unique product across warehouses
  const consolidatedProductLedger = React.useMemo(() => {
    return uniqueProducts.map((prod) => {
      const skuInvs = inventory.filter((i) => i.sku.toUpperCase() === prod.sku.toUpperCase());
      const onHand = skuInvs.reduce((sum, i) => sum + (i.onHand || 0), 0);
      const reserved = skuInvs.reduce((sum, i) => sum + (i.reserved || 0), 0);
      const available = skuInvs.reduce((sum, i) => sum + (i.available || 0), 0);
      const damaged = skuInvs.reduce((sum, i) => sum + (i.damaged || 0), 0);
      const missing = skuInvs.reduce((sum, i) => sum + (i.missing || 0), 0);
      const incoming = skuInvs.reduce((sum, i) => sum + (i.incoming || 0), 0);
      const valuation = onHand * prod.unitPrice;

      let status: 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL' | 'OVERSTOCKED' = 'HEALTHY';
      if (available <= (prod.minThreshold || 10)) {
        status = 'CRITICAL';
      } else if (available <= (prod.reorderPoint || 25)) {
        status = 'LOW_STOCK';
      }

      return {
        product: prod,
        onHand,
        reserved,
        available,
        damaged,
        missing,
        incoming,
        valuation,
        status,
        warehouseBreakdown: skuInvs,
      };
    });
  }, [uniqueProducts, inventory]);

  // Filtered master ledger
  const filteredMasterLedger = consolidatedProductLedger.filter((item) => {
    if (selectedCategory !== 'ALL' && item.product.category !== selectedCategory) return false;
    
    if (stockHealthFilter === 'HEALTHY' && (item.status === 'LOW_STOCK' || item.status === 'CRITICAL')) return false;
    if (stockHealthFilter === 'LOW' && item.status !== 'LOW_STOCK' && item.status !== 'CRITICAL') return false;
    if (stockHealthFilter === 'DAMAGED' && item.damaged === 0 && item.missing === 0) return false;

    if (searchSku.trim()) {
      const q = searchSku.toLowerCase();
      return (
        item.product.sku.toLowerCase().includes(q) ||
        item.product.name.toLowerCase().includes(q) ||
        item.product.category.toLowerCase().includes(q) ||
        item.product.supplier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Flat bin inventory for warehouse bin mode
  const filteredBinInventory = inventory.filter((item) => {
    if (activeWarehouseId && item.warehouseId !== activeWarehouseId) return false;
    const prod = uniqueProducts.find((p) => p.sku === item.sku);
    if (selectedCategory !== 'ALL' && prod?.category !== selectedCategory) return false;

    if (searchSku.trim()) {
      const q = searchSku.toLowerCase();
      return (
        item.sku.toLowerCase().includes(q) ||
        item.binLocation.toLowerCase().includes(q) ||
        (prod?.name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Global KPIs
  const totalOnHand = consolidatedProductLedger.reduce((sum, i) => sum + i.onHand, 0);
  const totalReserved = consolidatedProductLedger.reduce((sum, i) => sum + i.reserved, 0);
  const totalAvailable = consolidatedProductLedger.reduce((sum, i) => sum + i.available, 0);
  const totalDamaged = consolidatedProductLedger.reduce((sum, i) => sum + i.damaged, 0);
  const totalValuation = consolidatedProductLedger.reduce((sum, i) => sum + i.valuation, 0);
  const lowStockCount = consolidatedProductLedger.filter((i) => i.status === 'LOW_STOCK' || i.status === 'CRITICAL').length;

  const categories = ['ALL', ...Array.from(new Set(uniqueProducts.map((p) => p.category)))];

  const handleCreateReorder = (sku: string, whId: string) => {
    createReorder(sku, whId, reorderQty);
    setReorderModalSku(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner with Unique Styling & Add Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#061510] via-[#09261D] to-[#0D382B] border border-[#00F59B]/25 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F59B]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#00F59B]/20 border border-[#00F59B]/40 text-[#00F59B]">
              <Boxes className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              National Inventory Operating Matrix
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/40 font-mono font-bold">
                {uniqueProducts.length} Unique SKUs
              </span>
            </h2>
          </div>
          <p className="text-xs text-[#9EC4B3]">
            Unified physical vs allocated inventory across all 6 national fulfillment hubs with real-time condition tracking.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 relative z-10">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#071912] p-1 rounded-xl border border-[#184637] text-xs font-semibold">
            <button
              onClick={() => setViewMode('CONSOLIDATED')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'CONSOLIDATED'
                  ? 'bg-[#00F59B] text-[#051A13] font-bold shadow-xs'
                  : 'text-[#8BAE9E] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Unique Master Ledger
            </button>
            <button
              onClick={() => setViewMode('BINS')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'BINS'
                  ? 'bg-[#00F59B] text-[#051A13] font-bold shadow-xs'
                  : 'text-[#8BAE9E] hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              By Warehouse Bin
            </button>
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#041E15] font-bold text-xs shadow-[0_0_15px_rgba(0,245,155,0.3)] transition transform hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Product to Catalog
          </button>
        </div>
      </div>

      {/* 📊 Multi-State Inventory Architecture Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-[#08221A]/10 shadow-[0_2px_10px_rgba(8,34,26,0.04)] space-y-1">
          <div className="text-[10px] uppercase font-mono text-gray-500 font-bold flex items-center justify-between">
            <span>1. Total Physical</span>
            <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#071D16]">{totalOnHand.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">Units across all hubs</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#08221A]/10 shadow-[0_2px_10px_rgba(8,34,26,0.04)] space-y-1">
          <div className="text-[10px] uppercase font-mono text-amber-600 font-bold flex items-center justify-between">
            <span>2. Reserved</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{totalReserved.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">Committed to active orders</div>
        </div>

        <div className="bg-[#059669]/10 p-3.5 rounded-2xl border border-[#059669]/30 shadow-[0_2px_10px_rgba(5,150,105,0.08)] space-y-1">
          <div className="text-[10px] uppercase font-mono text-[#059669] font-bold flex items-center justify-between">
            <span>3. Available to Ship</span>
            <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse"></span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#059669]">{totalAvailable.toLocaleString()}</div>
          <div className="text-[10px] text-[#059669] font-medium">Ready for allocation</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#08221A]/10 shadow-[0_2px_10px_rgba(8,34,26,0.04)] space-y-1">
          <div className="text-[10px] uppercase font-mono text-rose-600 font-bold flex items-center justify-between">
            <span>4. Damaged / Qtn</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600">{totalDamaged}</div>
          <div className="text-[10px] text-rose-500">Quarantine inspection</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#08221A]/10 shadow-[0_2px_10px_rgba(8,34,26,0.04)] space-y-1">
          <div className="text-[10px] uppercase font-mono text-indigo-600 font-bold flex items-center justify-between">
            <span>5. Total Valuation</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          </div>
          <div className="text-xl font-bold font-mono text-indigo-900 truncate">₹{(totalValuation / 100000).toFixed(1)}L</div>
          <div className="text-[10px] text-gray-500">Asset inventory value</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#08221A]/10 shadow-[0_2px_10px_rgba(8,34,26,0.04)] space-y-1">
          <div className="text-[10px] uppercase font-mono text-amber-600 font-bold flex items-center justify-between">
            <span>6. Low Stock Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{lowStockCount}</div>
          <div className="text-[10px] text-amber-600">Reorders suggested</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#08221A]/10 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 bg-[#F2F6F4] px-3.5 py-2 rounded-xl border border-[#08221A]/10 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#071D16]/50" />
          <input
            type="text"
            value={searchSku}
            onChange={(e) => setSearchSku(e.target.value)}
            placeholder="Search by SKU, Product Name, Category or Supplier..."
            className="bg-transparent text-xs text-[#071D16] focus:outline-none w-full font-medium placeholder-[#071D16]/40"
          />
        </div>

        {/* Stock Health Quick Filters */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStockHealthFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              stockHealthFilter === 'ALL'
                ? 'bg-[#071D16] text-white'
                : 'bg-[#F2F6F4] text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Health
          </button>
          <button
            onClick={() => setStockHealthFilter('HEALTHY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              stockHealthFilter === 'HEALTHY'
                ? 'bg-[#059669] text-white'
                : 'bg-[#F2F6F4] text-gray-600 hover:bg-gray-200'
            }`}
          >
            Healthy
          </button>
          <button
            onClick={() => setStockHealthFilter('LOW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              stockHealthFilter === 'LOW'
                ? 'bg-amber-500 text-white'
                : 'bg-[#F2F6F4] text-gray-600 hover:bg-gray-200'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setStockHealthFilter('DAMAGED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              stockHealthFilter === 'DAMAGED'
                ? 'bg-rose-500 text-white'
                : 'bg-[#F2F6F4] text-gray-600 hover:bg-gray-200'
            }`}
          >
            Quarantine/Damaged
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="w-full flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 scrollbar-thin">
          <span className="text-[11px] font-bold text-gray-400 uppercase font-mono mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#071D16] text-[#00F59B] font-bold shadow-xs'
                  : 'bg-[#F2F6F4] text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Consolidated Master Ledger (Every Product Appears EXACTLY Once) */}
      {viewMode === 'CONSOLIDATED' ? (
        <div className="bg-white rounded-2xl border border-[#08221A]/10 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-[#F2F6F4] border-b border-[#08221A]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F59B] ring-4 ring-[#00F59B]/20"></span>
              <h3 className="text-xs font-bold font-mono text-[#071D16] uppercase tracking-wider">
                Consolidated Product Master Ledger — {filteredMasterLedger.length} Items Listed (Strictly Deduplicated)
              </h3>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">
              Click any product row to inspect multi-hub distribution & physical bin locations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] border-b border-[#08221A]/10 text-[11px] font-mono uppercase text-gray-600">
                <tr>
                  <th className="py-3 px-4 font-bold">Unique SKU & Product Details</th>
                  <th className="py-3 px-4 font-bold">Department / Category</th>
                  <th className="py-3 px-4 font-bold font-mono">Total On Hand</th>
                  <th className="py-3 px-4 font-bold font-mono">Reserved</th>
                  <th className="py-3 px-4 font-bold font-mono text-[#059669]">Available to Ship</th>
                  <th className="py-3 px-4 font-bold font-mono text-rose-600">Damaged / Qtn</th>
                  <th className="py-3 px-4 font-bold font-mono">Unit Price</th>
                  <th className="py-3 px-4 font-bold">Stock Health</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#08221A]/5">
                {filteredMasterLedger.map(({ product, onHand, reserved, available, damaged, missing, status, warehouseBreakdown }) => {
                  const isExpanded = expandedSku === product.sku;

                  return (
                    <React.Fragment key={product.sku}>
                      <tr
                        className={`transition hover:bg-[#F2F6F4]/70 cursor-pointer ${
                          isExpanded ? 'bg-[#F2F6F4]/90' : ''
                        }`}
                        onClick={() => setExpandedSku(isExpanded ? null : product.sku)}
                      >
                        {/* Product info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gray-100 border border-[#08221A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs">
                              <img
                                src={getProductImage(product.sku, product.imageUrl)}
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#071D16] bg-[#071D16]/5 px-2 py-0.5 rounded-md border border-[#071D16]/10 text-xs">
                                  {product.sku}
                                </span>
                              </div>
                              <div className="font-semibold text-gray-900 text-xs mt-0.5 max-w-[280px] truncate" title={product.name}>
                                {product.name}
                              </div>
                              <div className="text-[10px] text-gray-500">{product.supplier}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-[#071D16]/5 text-gray-800 font-medium text-[11px] border border-[#08221A]/10 whitespace-nowrap">
                            {product.category}
                          </span>
                        </td>

                        {/* On Hand */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#071D16] text-sm">
                          {onHand}
                        </td>

                        {/* Reserved */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-amber-600">
                          {reserved}
                        </td>

                        {/* Available to Ship */}
                        <td className="py-3.5 px-4 font-mono font-bold">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                              available <= 5
                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                : available <= 15
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-[#00F59B]/20 text-[#071D16] border border-[#00F59B]/50'
                            }`}
                          >
                            {available} units
                          </span>
                        </td>

                        {/* Damaged & Missing */}
                        <td className="py-3.5 px-4 font-mono text-xs">
                          {damaged > 0 || missing > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold border border-rose-200">
                              {damaged > 0 ? `${damaged} damaged` : ''} {missing > 0 ? `${missing} missing` : ''}
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>

                        {/* Unit Price */}
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          ₹{product.unitPrice.toLocaleString()}
                        </td>

                        {/* Stock Health */}
                        <td className="py-3.5 px-4">
                          {status === 'CRITICAL' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                              CRITICAL LOW
                            </span>
                          )}
                          {status === 'LOW_STOCK' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                              REORDER SOON
                            </span>
                          )}
                          {status === 'HEALTHY' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#059669] text-white">
                              HEALTHY
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setReorderModalSku(product.sku);
                                setReorderWhId(warehouseBreakdown[0]?.warehouseId || 'wh-hyd');
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#071D16] text-[#00F59B] hover:bg-[#0E2F23] transition flex items-center gap-1"
                              title="Create Reorder PO"
                            >
                              <RefreshCw className="w-3 h-3" />
                              PO
                            </button>
                            <button
                              onClick={() => setDetailSku(product.sku)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                            >
                              Quick View
                            </button>
                            <button
                              onClick={() => setExpandedSku(isExpanded ? null : product.sku)}
                              className="p-1 rounded-lg hover:bg-gray-200 text-gray-500"
                              title="Toggle Multi-Hub Breakdown"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Multi-Hub Ledger Breakdown */}
                      {isExpanded && (
                        <tr className="bg-[#F8FAF9] border-y border-[#00F59B]/20">
                          <td colSpan={9} className="p-4">
                            <div className="rounded-xl bg-white border border-[#08221A]/10 p-4 space-y-3 shadow-inner">
                              <div className="flex items-center justify-between">
                                <div className="text-xs font-bold text-[#071D16] flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-[#059669]" />
                                  Multi-Hub Stock Distribution for <span className="font-mono text-[#059669]">{product.sku}</span>
                                </div>
                                <span className="text-[11px] text-gray-500 font-mono">
                                  Lead Time: {product.leadTimeDays} days | Weight: {product.weightKg} kg | Safety Min: {product.minThreshold}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                {warehouses.map((wh) => {
                                  const inv = warehouseBreakdown.find((i) => i.warehouseId === wh.id);
                                  const onHandCount = inv?.onHand || 0;
                                  const availCount = inv?.available || 0;
                                  const resCount = inv?.reserved || 0;
                                  const damCount = inv?.damaged || 0;
                                  const binLoc = inv?.binLocation || 'A-01';

                                  return (
                                    <div
                                      key={wh.id}
                                      className="p-3 rounded-xl border border-gray-200 bg-[#FAFBF9] flex items-center justify-between text-xs"
                                    >
                                      <div>
                                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                          <span>{wh.city} Hub</span>
                                          <span className="text-[10px] font-mono font-bold bg-[#071D16]/10 px-1.5 py-0.2 rounded">
                                            Bin {binLoc}
                                          </span>
                                        </div>
                                        <div className="text-[11px] text-gray-500 mt-0.5">
                                          On Hand: <strong className="text-gray-800">{onHandCount}</strong> | Reserved: {resCount}
                                        </div>
                                      </div>

                                      <div className="text-right">
                                        <div className="font-mono font-bold text-[#059669] text-sm">
                                          {availCount} avail
                                        </div>
                                        {damCount > 0 && (
                                          <div className="text-[10px] font-bold text-rose-600">
                                            {damCount} damaged
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Bin Matrix View by Specific Warehouse Location */
        <div className="bg-white rounded-2xl border border-[#08221A]/10 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-[#F2F6F4] border-b border-[#08221A]/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#059669]" />
              <h3 className="text-xs font-bold font-mono text-[#071D16] uppercase tracking-wider">
                Warehouse Node Bins Matrix
              </h3>
            </div>

            {/* Warehouse Selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-300 text-xs">
              <span className="font-semibold text-gray-600">Filter Warehouse:</span>
              <select
                value={activeWarehouseId || ''}
                onChange={(e) => setActiveWarehouseId(e.target.value || null)}
                className="bg-transparent font-bold text-[#071D16] focus:outline-none cursor-pointer"
              >
                <option value="">All National Hubs</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.city} ({w.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] border-b border-[#08221A]/10 text-[11px] font-mono uppercase text-gray-600">
                <tr>
                  <th className="py-3 px-4 font-bold">SKU & Product</th>
                  <th className="py-3 px-4 font-bold">Hub & Bin Location</th>
                  <th className="py-3 px-4 font-bold font-mono">On Hand</th>
                  <th className="py-3 px-4 font-bold font-mono">Reserved</th>
                  <th className="py-3 px-4 font-bold font-mono">Available</th>
                  <th className="py-3 px-4 font-bold font-mono">Damaged / Miss</th>
                  <th className="py-3 px-4 font-bold text-right">Replenishment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#08221A]/5">
                {filteredBinInventory.map((item) => {
                  const product = uniqueProducts.find((p) => p.sku === item.sku);
                  const wh = warehouses.find((w) => w.id === item.warehouseId);
                  const isLowStock = item.available <= 5;

                  return (
                    <tr key={`${item.warehouseId}-${item.sku}`} className="hover:bg-[#F2F6F4]/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative">
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
                            <div className="font-bold text-[#071D16] font-mono">{item.sku}</div>
                            <div className="text-[11px] text-gray-700">{product?.name || item.productName}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{wh?.city} Hub</div>
                        <span className="text-[10px] font-mono font-bold bg-[#071D16]/10 text-[#071D16] px-1.5 py-0.2 rounded">
                          Bin: {item.binLocation}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{item.onHand}</td>
                      <td className="py-3 px-4 font-mono text-amber-600 font-semibold">{item.reserved}</td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            item.available <= 2
                              ? 'bg-rose-600 text-white'
                              : item.available <= 7
                              ? 'bg-amber-100 text-amber-900 border border-amber-400'
                              : 'bg-[#00F59B]/20 text-[#071D16]'
                          }`}
                        >
                          {item.available} units
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        {item.damaged > 0 && <span className="text-rose-600 font-bold mr-1">{item.damaged} dam</span>}
                        {item.missing > 0 && <span className="text-rose-600 font-bold">{item.missing} miss</span>}
                        {item.damaged === 0 && item.missing === 0 && <span className="text-gray-400">0</span>}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setReorderModalSku(item.sku);
                            setReorderWhId(item.warehouseId);
                          }}
                          className={`py-1 px-2.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 ${
                            isLowStock
                              ? 'bg-[#071D16] text-[#00F59B] hover:bg-[#0E2F23]'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          Reorder
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {reorderModalSku && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#0B1E17] text-white border border-[#00F59B]/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#00F59B]" />
              Replenishment Purchase Order
            </h3>
            <p className="text-xs text-[#8BAE9E]">
              Generate an automated stock replenishment PO for SKU <strong className="text-white font-mono">{reorderModalSku}</strong>.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#8BAE9E] block mb-1">Target Warehouse Hub</label>
                <select
                  value={reorderWhId}
                  onChange={(e) => setReorderWhId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081812] border border-[#1A4537] text-sm text-white focus:outline-none"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.city} ({w.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8BAE9E] block mb-1">Quantity Units</label>
                <input
                  type="number"
                  min="5"
                  value={reorderQty}
                  onChange={(e) => setReorderQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#081812] border border-[#1A4537] text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReorderModalSku(null)}
                className="px-4 py-2 rounded-xl bg-[#143D30] text-[#A1C4B5] hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateReorder(reorderModalSku, reorderWhId)}
                className="px-5 py-2 rounded-xl bg-[#00F59B] text-[#051A13] hover:bg-[#34D399] text-xs font-bold shadow-xs"
              >
                Submit Replenishment PO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultDepartmentId="mobiles"
      />

      {/* Product Detail Modal */}
      {detailSku && (
        <ProductDetailModal
          sku={detailSku}
          onClose={() => setDetailSku(null)}
        />
      )}
    </div>
  );
};
