import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Boxes,
  Compass,
  PackageCheck,
  Truck,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Bot,
  Zap,
  Building2,
  Activity,
  Layers,
  MapPin,
  Shield,
  PlusCircle,
  BarChart3,
  SlidersHorizontal,
  Package,
  RotateCcw,
  UserCheck,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
  ShoppingBag,
  Store,
  Smartphone,
} from 'lucide-react';
import { getProductImage } from '../utils/productImages';
import { ExceptionItem, Order, OrderStatus } from '../types';

export const OperationalStatusConsole: React.FC = () => {
  const {
    orders,
    exceptions,
    workers,
    pickTasks,
    resolveException,
    setSelectedOrderId,
    setCurrentView,
    activeWarehouseId,
  } = useWarehouse();

  const [activeTab, setActiveTab] = useState<'DAMAGED' | 'PLACED' | 'ACCEPTED' | 'ONGOING'>('DAMAGED');
  const [selectedDamagedId, setSelectedDamagedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // 1. Separate Damaged Items & Exceptions
  const damagedExceptions = exceptions.filter((e) => e.type === 'DAMAGED_ITEM' || e.type === 'QC_FAILED');
  const missingExceptions = exceptions.filter((e) => e.type === 'MISSING_IN_BIN');
  const allDefects = exceptions;

  // 2. Orders Placed
  const placedOrders = orders;

  // 3. Orders Accepted & Worker Assignments
  const aiAcceptedCount = orders.filter((o) => o.priorityScore >= 70 || o.status !== 'NEW').length;
  const managerAcceptedCount = orders.filter((o) => o.customerType === 'VIP' || o.isOutOfStockVip).length;
  const activeWorkersCount = workers.filter((w) => w.status !== 'IDLE' && w.status !== 'ON_BREAK').length;

  // 4. Ongoing Processes (Allocated, Picking, Packing, Ready to Dispatch, In Transit)
  const ongoingOrders = orders.filter(
    (o) =>
      o.status === 'ALLOCATED' ||
      o.status === 'PICKING' ||
      o.status === 'PARTIALLY_PICKED' ||
      o.status === 'PACKING' ||
      o.status === 'QC' ||
      o.status === 'READY_TO_DISPATCH' ||
      o.status === 'IN_TRANSIT' ||
      o.status === 'DISPATCHED'
  );

  const getChannelInfo = (ch?: string) => {
    switch (ch) {
      case 'Amazon':
        return { name: 'Amazon Marketplace', icon: '🛒', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'Flipkart':
        return { name: 'Flipkart Plus', icon: '🛍️', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'Blinkit':
        return { name: 'Blinkit 10-Min', icon: '⚡', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
      case 'Zepto':
        return { name: 'Zepto Express', icon: '🚀', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'Swiggy Instamart':
        return { name: 'Swiggy Instamart', icon: '🛵', color: 'bg-orange-100 text-orange-900 border-orange-300' };
      case 'B2B Portal':
        return { name: 'Enterprise EDI', icon: '💼', color: 'bg-slate-100 text-slate-900 border-slate-300' };
      default:
        return { name: ch || 'Direct Web Store', icon: '🌐', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
  };

  const getStageProgress = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
      case 'VALIDATED':
        return { percent: 15, label: 'Order Placed & Validated', color: 'bg-blue-500' };
      case 'ALLOCATED':
        return { percent: 30, label: 'Stock Allocated to Bin', color: 'bg-indigo-500' };
      case 'PICKING':
      case 'PARTIALLY_PICKED':
        return { percent: 50, label: 'Active Picker Cart Wave', color: 'bg-amber-500' };
      case 'PACKING':
      case 'QC':
        return { percent: 70, label: 'Packing & Optical QA Scan', color: 'bg-purple-500' };
      case 'READY_TO_DISPATCH':
        return { percent: 85, label: 'Dock Staged for Courier', color: 'bg-emerald-500' };
      case 'DISPATCHED':
      case 'IN_TRANSIT':
        return { percent: 92, label: 'Air / Road Transit Active', color: 'bg-[#1E8E63]' };
      case 'DELIVERED':
      case 'FEEDBACK_RECEIVED':
        return { percent: 100, label: 'Delivered to Customer', color: 'bg-[#12372A]' };
      case 'EXCEPTION':
        return { percent: 45, label: 'Quarantine & Discrepancy Halt', color: 'bg-rose-500' };
      default:
        return { percent: 20, label: status, color: 'bg-gray-400' };
    }
  };

  return (
    <div className="space-y-6">
      {/* 🚀 TOP 4 STATUS METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Damaged Products Separated Card */}
        <div
          onClick={() => setActiveTab('DAMAGED')}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition duration-200 space-y-2 shadow-xs ${
            activeTab === 'DAMAGED'
              ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/20'
              : 'bg-white border-rose-200 hover:bg-rose-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              Damaged / Defect
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-3xl font-black font-mono text-rose-700">
            {allDefects.length} <span className="text-xs font-normal text-rose-600">Discrepancies</span>
          </div>
          <div className="text-[11px] text-rose-800/80 font-medium">
            <strong>{damagedExceptions.length} Damaged items</strong> isolated in Quarantine Vaults
          </div>
        </div>

        {/* 2. Total Orders Placed Card */}
        <div
          onClick={() => setActiveTab('PLACED')}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition duration-200 space-y-2 shadow-xs ${
            activeTab === 'PLACED'
              ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20'
              : 'bg-white border-blue-200 hover:bg-blue-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300 flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-blue-600" />
              Orders Placed
            </span>
            <span className="text-xs font-mono text-blue-700 font-bold">100% Logged</span>
          </div>
          <div className="text-3xl font-black font-mono text-blue-800">
            {placedOrders.length} <span className="text-xs font-normal text-blue-600">Total Placed</span>
          </div>
          <div className="text-[11px] text-blue-800/80 font-medium">
            Multi-channel intake (Amazon, Blinkit, Flipkart, B2B)
          </div>
        </div>

        {/* 3. Orders Accepted Card */}
        <div
          onClick={() => setActiveTab('ACCEPTED')}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition duration-200 space-y-2 shadow-xs ${
            activeTab === 'ACCEPTED'
              ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white border-emerald-200 hover:bg-emerald-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-600" />
              Accepted & Assigned
            </span>
            <span className="text-xs font-mono text-emerald-700 font-bold">100% Owned</span>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-800">
            {placedOrders.length} <span className="text-xs font-normal text-emerald-600">Accepted</span>
          </div>
          <div className="text-[11px] text-emerald-800/80 font-medium">
            <strong>{workers.length} Floor Workers</strong> + AI Engine authorized
          </div>
        </div>

        {/* 4. Ongoing Processes Card */}
        <div
          onClick={() => setActiveTab('ONGOING')}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition duration-200 space-y-2 shadow-xs ${
            activeTab === 'ONGOING'
              ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-white border-amber-200 hover:bg-amber-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-700" />
              Ongoing Process
            </span>
            <span className="text-xs font-mono text-amber-700 font-bold">Live Waves</span>
          </div>
          <div className="text-3xl font-black font-mono text-amber-800">
            {ongoingOrders.length} <span className="text-xs font-normal text-amber-600">In Progress</span>
          </div>
          <div className="text-[11px] text-amber-800/80 font-medium">
            Active picking carts, packing stations & air staging
          </div>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS FOR DETAILED DRILLDOWN */}
      <div className="bg-white rounded-3xl border border-[#E5EEE5] p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EEE5]">
          {/* Tab buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('DAMAGED')}
              id="tab-damaged-products"
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'DAMAGED'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-[#F7F5EF] text-[#202923]/70 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>🚨 Damaged Product Orders ({allDefects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('PLACED')}
              id="tab-orders-placed"
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'PLACED'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#F7F5EF] text-[#202923]/70 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>📥 Orders Placed ({placedOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ACCEPTED')}
              id="tab-orders-accepted"
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'ACCEPTED'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-[#F7F5EF] text-[#202923]/70 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>🤝 Accepted & Worker Ownership</span>
            </button>

            <button
              onClick={() => setActiveTab('ONGOING')}
              id="tab-ongoing-process"
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'ONGOING'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-[#F7F5EF] text-[#202923]/70 hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>⚡ Ongoing Live Process ({ongoingOrders.length})</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#202923]/60">
            Real-time multi-hub telemetry
          </span>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 🚨 SEPARATED DAMAGED PRODUCT ORDERS (WITH PHOTOS & DEFECT SPECS) */}
        {/* ========================================================================= */}
        {activeTab === 'DAMAGED' && (
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-900">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <strong className="font-bold">Damaged Product Isolation & Recovery Protocol</strong>
                  <p className="text-[11px] text-rose-800/80 mt-0.5">
                    Every damaged item is immediately quarantined in isolated holding bins to protect customer SLA and automatically re-sourced from secondary hubs.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-rose-200 text-rose-900 px-3 py-1 rounded-full shrink-0">
                100% Quarantine Isolation
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {allDefects.map((ex) => {
                const relatedOrder = orders.find((o) => o.id === ex.orderId);
                const productImage = getProductImage(ex.sku);

                return (
                  <div
                    key={ex.id}
                    className="bg-white rounded-3xl border-2 border-rose-300 p-5 space-y-4 shadow-sm hover:shadow-md transition"
                  >
                    {/* Top Bar: Exception ID & Severity */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-rose-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#12372A]">{ex.id}</span>
                            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                              Order #{ex.orderId}
                            </span>
                            {relatedOrder?.customerType === 'VIP' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                👑 VIP Customer at Risk
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#202923]/70 mt-0.5">
                            Customer: <strong>{relatedOrder?.customerName || 'Direct Consignee'}</strong> • Destination:{' '}
                            <strong>{relatedOrder?.destinationCity || 'Regional Destination'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-rose-600 text-white uppercase tracking-wider">
                          {ex.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                          Status: {ex.status}
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Damaged Product Photo & Technical Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Product Thumbnail & SKU Info */}
                      <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#12372A]/10 flex items-start gap-3.5">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-[#12372A]/15 overflow-hidden shrink-0 shadow-xs relative">
                          <img
                            src={productImage}
                            alt={ex.productName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-rose-600/90 text-white text-[8px] font-mono text-center font-bold py-0.2">
                            DAMAGED
                          </span>
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <span className="text-[10px] font-mono font-bold text-[#1E8E63]">{ex.sku}</span>
                          <h4 className="font-bold text-xs text-[#12372A] leading-snug line-clamp-2">
                            {ex.productName}
                          </h4>
                          <div className="text-[10px] text-rose-700 font-bold pt-1">
                            {ex.missingOrDamagedCount} Unit {ex.type === 'DAMAGED_ITEM' ? 'Defective / Damaged' : 'Missing'}
                          </div>
                        </div>
                      </div>

                      {/* Defect Detection & Responsible Worker */}
                      <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#12372A]/10 space-y-1.5 text-xs">
                        <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-bold">
                          Defect Detection Audit
                        </div>
                        <div className="font-bold text-[#12372A] flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-rose-600" />
                          <span>Detected at Bin {ex.detectedAtBin}</span>
                        </div>
                        <div className="text-[11px] text-[#202923]/80">
                          Inspector / Picker: <strong>{ex.detectedByWorker}</strong>
                        </div>
                        <div className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block mt-1">
                          🔒 Moved to Quarantine Vault Q-01
                        </div>
                      </div>

                      {/* Alternate Stock Discovery & Reroute Engine */}
                      <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-300 space-y-2 text-xs">
                        <div className="text-[10px] uppercase font-mono text-emerald-900 font-bold flex items-center justify-between">
                          <span>Autonomous Reroute Stock</span>
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        {ex.alternativeStockFound ? (
                          <div className="space-y-1 text-[11px] text-emerald-900">
                            <div>
                              Available at: <strong>{ex.alternativeStockFound.warehouseName}</strong>
                            </div>
                            <div className="font-mono text-[10px] text-emerald-800">
                              Bin {ex.alternativeStockFound.binLocation} • {ex.alternativeStockFound.availableQuantity} units ready ({ex.alternativeStockFound.distanceKm} km away)
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-emerald-800">
                            Reallocated replacement stock assigned from primary master hub.
                          </div>
                        )}
                        <button
                          onClick={() => {
                            resolveException(ex.id, 'REALLOCATE_ALT_STOCK');
                          }}
                          className="w-full py-1.5 px-3 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition"
                        >
                          <Zap className="w-3 h-3 text-[#A7D46F]" />
                          <span>Dispatch Replacement Unit</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Recommendation Banner */}
                    <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-200 text-xs flex items-start gap-2">
                      <Shield className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-rose-900">
                        <strong>Actionable Resolution:</strong> {ex.recommendedResolution}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 📥 TOTAL ORDERS PLACED (BY APP CHANNELS & TIME) */}
        {/* ========================================================================= */}
        {activeTab === 'PLACED' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <strong className="font-bold">Total Placed Orders Intake ({placedOrders.length} Orders)</strong>
                  <p className="text-[11px] text-blue-800/80 mt-0.5">
                    Unified multi-channel ingestion with instantaneous SKU validation, EDI tax invoice generation, and courier SLA routing.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-200 text-blue-900 px-3 py-1 rounded-full shrink-0">
                100% Ingested
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placedOrders.map((order) => {
                const ch = getChannelInfo(order.channel);
                const firstItem = order.items[0];
                const productImage = getProductImage(firstItem?.sku);

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="bg-white rounded-3xl border border-[#E5EEE5] hover:border-blue-400 p-5 space-y-3 cursor-pointer shadow-2xs hover:shadow-md transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${ch.color}`}>
                          {ch.icon} {ch.name}
                        </span>
                        <span className="font-mono font-bold text-xs text-[#12372A]">#{order.id}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#202923]/60">
                        Placed: {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#F7F5EF] border border-[#12372A]/10 overflow-hidden shrink-0 relative group-hover:scale-105 transition">
                        <img
                          src={productImage}
                          alt={firstItem?.productName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#12372A] leading-tight line-clamp-1">
                          {order.customerName}
                        </h4>
                        <p className="text-[11px] text-[#202923]/70 truncate">
                          {firstItem?.productName} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}
                        </p>
                        <p className="text-[10px] font-mono text-[#202923]/50">
                          📍 {order.destinationCity}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-black font-mono text-[#12372A]">
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                        <span className="text-[9px] font-mono font-bold text-[#1E8E63]">
                          SLA: {order.slaRemainingMinutes}m
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 🤝 ACCEPTED ORDERS & WORKER OWNERSHIP */}
        {/* ========================================================================= */}
        {activeTab === 'ACCEPTED' && (
          <div className="space-y-6">
            {/* Acceptance Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <div className="text-[10px] uppercase font-mono text-emerald-900 font-bold flex items-center justify-between">
                  <span>AI Autonomous Fast-Track</span>
                  <Bot className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black font-mono text-emerald-800">
                  {aiAcceptedCount} Orders
                </div>
                <div className="text-[10px] text-emerald-800/80 font-medium">
                  Auto-validated & wave-routed in &lt;800ms
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                <div className="text-[10px] uppercase font-mono text-purple-900 font-bold flex items-center justify-between">
                  <span>Operations Manager Approvals</span>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black font-mono text-purple-800">
                  {managerAcceptedCount} Orders
                </div>
                <div className="text-[10px] text-purple-800/80 font-medium">
                  High-value VIP & HazMat override confirmed
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
                <div className="text-[10px] uppercase font-mono text-blue-900 font-bold flex items-center justify-between">
                  <span>Assigned Floor Personnel</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black font-mono text-blue-800">
                  {workers.length} Workers
                </div>
                <div className="text-[10px] text-blue-800/80 font-medium">
                  100% active shift station coverage
                </div>
              </div>
            </div>

            {/* Live Worker Task Ownership Grid */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase font-mono text-[#12372A] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#1E8E63]" />
                Warehouse Personnel Acceptance & Task Execution Ledger
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workers.map((worker) => {
                  return (
                    <div
                      key={worker.id}
                      className="bg-white rounded-3xl border border-[#E5EEE5] p-5 space-y-3 shadow-2xs hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-2xl ${worker.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                            {worker.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-[#12372A]">{worker.name}</h5>
                            <span className="text-[10px] font-mono text-[#202923]/60">{worker.tierLabel}</span>
                          </div>
                        </div>

                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {worker.status}
                        </span>
                      </div>

                      <div className="p-2.5 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#202923]/60">Station / Zone:</span>
                          <strong className="text-[#12372A]">{worker.stationOrZone}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#202923]/60">Efficiency Rating:</span>
                          <strong className="text-[#1E8E63] font-mono">{worker.efficiencyScore}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#202923]/60">Speed Throughput:</span>
                          <strong className="text-[#12372A] font-mono">{worker.speedUnitsPerHour} units/hr</strong>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {worker.certifications.map((c, i) => (
                          <span key={i} className="text-[9px] font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-[#202923]/70">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ⚡ ONGOING LIVE PROCESSING PIPELINE */}
        {/* ========================================================================= */}
        {activeTab === 'ONGOING' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong className="font-bold">Active In-Flight Fulfillment Waves ({ongoingOrders.length} Active)</strong>
                  <p className="text-[11px] text-amber-800/80 mt-0.5">
                    Real-time tracking of picking routes, barcode packaging scan stations, and courier loading dock staging.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full shrink-0">
                Live Wave Sync
              </span>
            </div>

            <div className="space-y-3">
              {ongoingOrders.map((order) => {
                const prog = getStageProgress(order.status);
                const firstItem = order.items[0];
                const productImage = getProductImage(firstItem?.sku);

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="bg-white rounded-3xl border border-[#E5EEE5] hover:border-amber-400 p-5 space-y-3 cursor-pointer shadow-2xs hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] border border-[#12372A]/10 overflow-hidden shrink-0">
                          <img
                            src={productImage}
                            alt={firstItem?.productName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#12372A]">#{order.id}</span>
                            <span className="font-bold text-xs text-[#12372A]">{order.customerName}</span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#12372A] text-[#A7D46F]">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#202923]/70 mt-0.5">
                            {firstItem?.productName} ({order.items.reduce((s, i) => s + i.quantityRequired, 0)} units total)
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#1E8E63]">
                          ⏱️ {order.slaRemainingMinutes} Mins to SLA
                        </span>
                        <div className="text-[10px] font-mono text-[#202923]/50">
                          Priority: {order.priorityScore}/100
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Stage Indicator */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="font-bold text-[#12372A]">{prog.label}</span>
                        <span className="font-bold text-[#1E8E63]">{prog.percent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#F7F5EF] rounded-full overflow-hidden border border-[#12372A]/10">
                        <div
                          className={`h-full ${prog.color} transition-all duration-500 rounded-full`}
                          style={{ width: `${prog.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
