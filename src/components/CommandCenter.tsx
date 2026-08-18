import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  ShieldAlert,
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
  User,
  ShoppingBag,
  Gem,
  Radio,
  Flame,
  ArrowUpRight,
  Filter,
  Check,
  Eye,
  RefreshCw,
  Search,
} from 'lucide-react';
import { PriorityLevel, Order, AllocationStrategy } from '../types';
import { getProductImage, getWarehouseImage, USER_PROFILES, SKU_IMAGE_MAP } from '../utils/productImages';
import { OperationalStatusConsole } from './OperationalStatusConsole';

export const CommandCenter: React.FC = () => {
  const {
    orders,
    products,
    inventory,
    warehouses,
    exceptions,
    workers,
    pickTasks,
    setSelectedOrderId,
    setCurrentView,
    activeWarehouseId,
    setActiveWarehouseId,
    currentStrategy,
    setCurrentStrategy,
    setIsAiDrawerOpen,
    setIsNewOrderModalOpen,
    reallocateOrder,
  } = useWarehouse();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [pulseLiveTime, setPulseLiveTime] = useState<string>('');
  const [simulatedThroughput, setSimulatedThroughput] = useState<number>(44.2);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setPulseLiveTime(
        d.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter based on active warehouse if selected
  const filteredOrders = activeWarehouseId
    ? orders.filter((o) => o.assignedWarehouseId === activeWarehouseId)
    : orders;

  const pendingOrders = filteredOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const pickingQueue = pickTasks.filter((pt) => pt.status === 'IN_PROGRESS' || pt.status === 'PENDING');
  const openExceptions = exceptions.filter((e) => e.status === 'OPEN');
  const lowStockItems = inventory.filter((i) => i.available <= 6);
  const activeHub = warehouses.find((w) => w.id === activeWarehouseId) || warehouses[0];

  const priorityOrders = [...orders]
    .filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED')
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5);

  // Damaged quarantined count
  const damagedQuarantinedOrders = orders.filter((o) =>
    exceptions.some(
      (e) =>
        e.orderId === o.id &&
        (e.type === 'DAMAGED_ITEM' || e.type === 'QC_FAILED' || e.status === 'OPEN')
    )
  );

  // Sector breakdown calculations
  const electricalOrders = orders.filter((o) =>
    o.items.some((it) =>
      ['SKU-421', 'SKU-872', 'SKU-104', 'SKU-309', 'SKU-552', 'SKU-901', 'SKU-667'].includes(it.sku)
    )
  );
  const girlsDressesOrders = orders.filter((o) =>
    o.items.some((it) =>
      ['SKU-701', 'SKU-702', 'SKU-703', 'SKU-704', 'SKU-705', 'SKU-706', 'SKU-707', 'SKU-708', 'SKU-709'].includes(it.sku)
    )
  );
  const menDressesOrders = orders.filter((o) =>
    o.items.some((it) => ['SKU-750', 'SKU-751', 'SKU-752', 'SKU-753'].includes(it.sku))
  );
  const shoesOrders = orders.filter((o) =>
    o.items.some((it) => ['SKU-720', 'SKU-721', 'SKU-722', 'SKU-723'].includes(it.sku))
  );
  const jewelryOrders = orders.filter((o) =>
    o.items.some((it) => ['SKU-740', 'SKU-741', 'SKU-742', 'SKU-743', 'SKU-744'].includes(it.sku))
  );

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-[#202923]">

      {/* ========================================================================= */}
      {/* 🚀 1. HIGH-TECH COMMAND HERO WITH LIVE TELEMETRY & STRATEGY ENGINE */}
      {/* ========================================================================= */}
      <section className="relative bg-[#12372A] text-white rounded-3xl overflow-hidden shadow-2xl border border-[#12372A]/20">
        {/* Background Facility Visual with Atmospheric Layers */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&auto=format&fit=crop&q=80"
            alt="National Autonomous Logistics Facility"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity scale-105 transition duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12372A] via-[#12372A]/95 to-[#12372A]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(#A7D46F_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        {/* Hero Body */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            {/* Live Indicator Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#A7D46F] text-[#12372A] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#1E8E63] animate-ping" />
                Live Control Tower Active
              </span>
              <span className="text-[11px] font-mono font-bold bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-white/90 border border-white/10 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#A7D46F] animate-pulse" />
                6 NATIONAL HUBS CONNECTED
              </span>
              <span className="text-[11px] font-mono font-bold bg-[#1E8E63] text-white px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {pulseLiveTime || '16:30 IST'}
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                Omnichannel Logistics & Autonomous Fulfillment Center
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#E5EEE5]/90 max-w-2xl leading-relaxed mt-2">
                Multi-echelon stock synchronization, sub-800ms AI wave pathing, optical defect quarantine, and rapid drone & express carrier dispatch across Hyderabad, Bengaluru, Chennai, Pune, Delhi NCR, and Kolkata.
              </p>
            </div>

            {/* Warehouse Hub Fast-Filter Selector Chips */}
            <div className="pt-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#A7D46F] font-bold mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Select Active National Hub:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveWarehouseId(null)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    activeWarehouseId === null
                      ? 'bg-[#A7D46F] text-[#12372A] border-[#A7D46F] shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/10'
                  }`}
                >
                  <span>🌐 All Hubs ({orders.length} Orders)</span>
                </button>
                {warehouses.map((wh) => (
                  <button
                    key={wh.id}
                    onClick={() => setActiveWarehouseId(wh.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      activeWarehouseId === wh.id
                        ? 'bg-[#A7D46F] text-[#12372A] border-[#A7D46F] shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/10'
                    }`}
                  >
                    <span>{wh.city}</span>
                    <span className="font-mono text-[10px] opacity-75">{wh.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Matrix Panel */}
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/20 space-y-3.5 w-full xl:w-80 shadow-2xl">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#A7D46F] flex items-center justify-between border-b border-white/15 pb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#A7D46F]" />
                Fulfillment Strategy
              </span>
              <span className="font-mono text-[10px] text-white/80 font-bold">{currentStrategy}</span>
            </div>

            {/* Strategy Radio Selector */}
            <div className="grid grid-cols-2 gap-1.5">
              {(['PRIORITY_FIRST', 'EARLIEST_DEADLINE', 'MAXIMIZE_FULFILLED', 'NEAREST_WAREHOUSE'] as AllocationStrategy[]).map((strat) => (
                <button
                  key={strat}
                  onClick={() => setCurrentStrategy(strat)}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold transition text-left truncate border ${
                    currentStrategy === strat
                      ? 'bg-[#A7D46F] text-[#12372A] border-[#A7D46F] shadow-2xs font-black'
                      : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/15'
                  }`}
                >
                  {strat === 'PRIORITY_FIRST' && '👑 Priority First'}
                  {strat === 'EARLIEST_DEADLINE' && '⚡ Deadline SLA'}
                  {strat === 'MAXIMIZE_FULFILLED' && '📦 Max Fulfilled'}
                  {strat === 'NEAREST_WAREHOUSE' && '📍 Nearest DC'}
                </button>
              ))}
            </div>

            {/* High Impact Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => setIsNewOrderModalOpen(true)}
                id="btn-hero-new-order"
                className="w-full py-3 px-4 rounded-2xl bg-[#A7D46F] hover:bg-[#bbf07a] text-[#12372A] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#12372A]" />
                <span>+ Create / Simulate Order</span>
              </button>

              <button
                onClick={() => setIsAiDrawerOpen(true)}
                id="btn-hero-pilot-ai"
                className="w-full py-2.5 px-4 rounded-2xl bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md border border-[#A7D46F]/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Bot className="w-4 h-4 text-[#A7D46F]" />
                <span>Ask Pilot AI Co-Pilot</span>
              </button>

              <button
                onClick={() => setCurrentView('map')}
                id="btn-hero-view-map"
                className="w-full py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#A7D46F]" />
                <span>Interactive India DC Map</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📦 2. CATEGORY SECTOR BOXES OVERVIEW (WITH RICH THUMBNAILS & METRICS) */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#1E8E63]" />
            <h2 className="font-black text-sm uppercase tracking-wider text-[#12372A]">
              Dedicated Product Sector Boxes & Live Flow Channels
            </h2>
          </div>
          <div className="text-xs text-[#202923]/70 font-medium">
            Active line item segmentation across fashion, luxury electronics, jewelry, and quarantined defect items.
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Sector 1: Electrical Devices */}
          <div
            onClick={() => {
              setActiveCategoryFilter('ELECTRICAL');
              setIsNewOrderModalOpen(true);
            }}
            className="bg-white p-3.5 rounded-2xl border-2 border-sky-200 hover:border-sky-500 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-black group-hover:scale-110 transition">
                ⚡
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                {electricalOrders.length} In-Flight
              </span>
            </div>
            <div>
              <h3 className="font-black text-xs text-sky-950 group-hover:text-sky-700 transition">
                Electrical Devices
              </h3>
              <p className="text-[10px] text-gray-500 line-clamp-1">LiDAR, HazMat Batteries & Edge AI</p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sky-700 pt-1 border-t border-sky-100">
              <span>7 SKUs Active</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Sector 2: Girls Dresses & Sarees */}
          <div
            onClick={() => {
              setActiveCategoryFilter('GIRLS_DRESSES');
              setIsNewOrderModalOpen(true);
            }}
            className="bg-white p-3.5 rounded-2xl border-2 border-pink-200 hover:border-pink-500 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-sm font-black group-hover:scale-110 transition">
                👗
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-pink-50 text-pink-800 border border-pink-200">
                {girlsDressesOrders.length} In-Flight
              </span>
            </div>
            <div>
              <h3 className="font-black text-xs text-pink-950 group-hover:text-pink-700 transition">
                Girls Dresses & Sarees
              </h3>
              <p className="text-[10px] text-gray-500 line-clamp-1">Kanjivaram Silk, Banarasi, Lehengas</p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-pink-700 pt-1 border-t border-pink-100">
              <span>9 Silks Active</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Sector 3: Men Dresses & Sherwanis */}
          <div
            onClick={() => {
              setActiveCategoryFilter('MEN_DRESSES');
              setIsNewOrderModalOpen(true);
            }}
            className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 hover:border-amber-500 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-black group-hover:scale-110 transition">
                👔
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                {menDressesOrders.length} In-Flight
              </span>
            </div>
            <div>
              <h3 className="font-black text-xs text-amber-950 group-hover:text-amber-800 transition">
                Men Dresses & Suits
              </h3>
              <p className="text-[10px] text-gray-500 line-clamp-1">Royal Sherwanis, Tuxedos & Kurtas</p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-800 pt-1 border-t border-amber-100">
              <span>4 Sets Active</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Sector 4: Shoes & Footwear */}
          <div
            onClick={() => {
              setActiveCategoryFilter('SHOES');
              setIsNewOrderModalOpen(true);
            }}
            className="bg-white p-3.5 rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-black group-hover:scale-110 transition">
                👞
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                {shoesOrders.length} In-Flight
              </span>
            </div>
            <div>
              <h3 className="font-black text-xs text-emerald-950 group-hover:text-emerald-800 transition">
                Shoes & Footwear
              </h3>
              <p className="text-[10px] text-gray-500 line-clamp-1">Italian Oxford, Nike Pro & Mojaris</p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-800 pt-1 border-t border-emerald-100">
              <span>4 Models Active</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Sector 5: Jewelry & Earrings */}
          <div
            onClick={() => {
              setActiveCategoryFilter('JEWELRY');
              setIsNewOrderModalOpen(true);
            }}
            className="bg-white p-3.5 rounded-2xl border-2 border-purple-200 hover:border-purple-500 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-black group-hover:scale-110 transition">
                💎
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                {jewelryOrders.length} In-Flight
              </span>
            </div>
            <div>
              <h3 className="font-black text-xs text-purple-950 group-hover:text-purple-800 transition">
                Jewelry & Earrings
              </h3>
              <p className="text-[10px] text-gray-500 line-clamp-1">Kundan Polki, Diamond Studs & Jhumkas</p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-purple-800 pt-1 border-t border-purple-100">
              <span>5 Vault Items</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Sector 6: Quarantined Defect Products */}
          <div
            onClick={() => setCurrentView('operations_flow')}
            className="bg-rose-50 p-3.5 rounded-2xl border-2 border-rose-300 hover:border-rose-600 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center text-sm font-black group-hover:scale-110 transition">
                🚫
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 animate-pulse">
                {damagedQuarantinedOrders.length} Defect Items
              </span>
            </div>
            <div>
              <h3 className="font-black text-xs text-rose-950 group-hover:text-rose-700 transition">
                Quarantined Defect Sector
              </h3>
              <p className="text-[10px] text-rose-700 line-clamp-1">Isolated Zari Snags, Scuffs & Cracked Lens</p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-rose-800 pt-1 border-t border-rose-200">
              <span>View Isolation Vault</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📊 3. LIVE HIGH-DENSITY KPI METRIC TILES WITH SPARKLINES */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Active Orders', value: `${orders.length}`, sub: '+14% vs yesterday', color: 'text-[#12372A]', bg: 'bg-[#F7F5EF]' },
          { label: 'In-Flight Pipeline', value: `${pendingOrders.length}`, sub: 'Active in wave carts', color: 'text-[#1E8E63]', bg: 'bg-emerald-50/50' },
          { label: 'Picking Waves', value: `${pickingQueue.length}`, sub: 'Active zone pickers', color: 'text-[#12372A]', bg: 'bg-[#F7F5EF]' },
          { label: 'Low Stock Alerts', value: `${lowStockItems.length}`, sub: 'Safety threshold', color: 'text-[#F3B562]', bg: 'bg-amber-50/50' },
          { label: 'Damaged & Defect', value: `${openExceptions.length}`, sub: 'Isolated in QC Vaults', color: openExceptions.length > 0 ? 'text-rose-600' : 'text-[#1E8E63]', bg: openExceptions.length > 0 ? 'bg-rose-50/50' : 'bg-[#F7F5EF]' },
          { label: 'On-Time SLA', value: '98.6%', sub: 'Target: >98.0%', color: 'text-[#1E8E63]', bg: 'bg-emerald-50/50' },
          { label: 'Velocity Throughput', value: `${simulatedThroughput}/hr`, sub: 'Peak: 58/hr', color: 'text-[#12372A]', bg: 'bg-[#F7F5EF]' },
          { label: 'Avg Pick-to-Ship', value: '34 min', sub: '-8m vs last week', color: 'text-[#12372A]', bg: 'bg-[#F7F5EF]' },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border border-[#12372A]/10 space-y-1 shadow-2xs hover:shadow-xs transition hover:border-[#1E8E63]/40 ${kpi.bg}`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-[#202923]/60 block truncate">
              {kpi.label}
            </span>
            <div className={`text-2xl font-black font-mono tracking-tight ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[10px] text-slate-500 font-bold truncate flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 text-[#1E8E63]" />
              <span>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ========================================================================= */}
      {/* ⚡ 4. AUTONOMOUS BOTTLENECK OPTIMIZATION & RECOVERY BANNER */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-[#12372A] via-[#1b4e3c] to-[#12372A] text-white p-4.5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-[#A7D46F]/20">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#A7D46F] text-[#12372A] flex items-center justify-center font-black flex-shrink-0 shadow-md">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider bg-[#F26B5B] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                Zone Wave Dispatch Active
              </span>
              <h3 className="font-black text-sm text-white tracking-tight">
                AI Pathfinding has reduced picker walking distance by 31% (142m → 98m per wave)
              </h3>
            </div>
            <p className="text-xs text-[#E5EEE5]/90 font-medium mt-0.5">
              Live batching algorithm is clustering electronics in Aisle E and Silk Sarees in Vault S to maximize dual-line packing throughput.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setCurrentView('picking')}
            id="btn-inspect-picking-bottleneck"
            className="py-2.5 px-4 rounded-xl bg-[#A7D46F] hover:bg-[#bbf07a] text-[#12372A] text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Inspect Picking Routes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🧭 5. OPERATIONS FLOW CONSOLE (SEPARATED DAMAGED, TOTAL PLACED, ACCEPTED) */}
      {/* ========================================================================= */}
      <OperationalStatusConsole />

      {/* ========================================================================= */}
      {/* 🛍️ 6. PRODUCT MANIFEST: PRIORITY ORDERS & CRITICAL RESTOCK WATCH */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Priority Dispatch Queue with Product Thumbnails (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-[#12372A]/10 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#1E8E63]" />
              <div>
                <h3 className="font-black text-sm text-[#12372A] tracking-tight">
                  High-Priority Active Orders Manifest
                </h3>
                <p className="text-[11px] text-[#202923]/70">
                  Real-time SLA countdowns with buyer profile details and product imagery
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('orders')}
              className="text-xs font-black text-[#1E8E63] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {priorityOrders.map((ord) => {
              const primaryItem = ord.items[0];
              const productImg = getProductImage(primaryItem?.sku, primaryItem?.imageUrl);
              const buyerProfile = USER_PROFILES.find((u) => u.name === ord.customerName) || USER_PROFILES[0];

              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#12372A]/10 hover:border-[#1E8E63] hover:bg-[#E5EEE5]/30 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group shadow-2xs hover:shadow-xs"
                >
                  {/* Left: Product Image & Details */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs group-hover:scale-105 transition">
                      <img
                        src={productImg}
                        alt={primaryItem?.productName || 'Product'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-0 right-0 bg-[#12372A] text-white text-[9px] font-mono font-bold px-1 rounded-tl">
                        {primaryItem?.quantityRequired}x
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-[#12372A]">
                          #{ord.id}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                            ord.priorityLevel === 'CRITICAL'
                              ? 'bg-[#F26B5B] text-white'
                              : ord.priorityLevel === 'HIGH'
                              ? 'bg-[#F3B562] text-[#12372A]'
                              : 'bg-[#E5EEE5] text-[#12372A]'
                          }`}
                        >
                          {ord.priorityLevel}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white text-gray-700 border border-gray-200">
                          {ord.channel || 'Direct'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <img
                          src={buyerProfile.avatarUrl}
                          alt={buyerProfile.name}
                          className="w-4 h-4 rounded-full object-cover border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                        <h4 className="font-bold text-xs text-[#12372A] leading-snug">
                          {ord.customerName}
                        </h4>
                      </div>

                      <div className="text-[11px] text-[#202923]/70 font-medium truncate max-w-xs">
                        {primaryItem?.productName} ({primaryItem?.sku})
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & SLA Deadline */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#12372A]/10 text-right space-y-1">
                    <span className="text-xs font-mono font-black text-[#1E8E63]">
                      ₹{ord.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-[#12372A]/10 text-[#12372A] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-[#F26B5B]" />
                      <span>{ord.slaRemainingMinutes}m left</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                      {ord.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Critical Stock Watchlist (5 Cols with Product Images) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-[#12372A]/10 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#F3B562]" />
              <div>
                <h3 className="font-black text-sm text-[#12372A] tracking-tight">
                  Low Stock & Reorder Watchlist
                </h3>
                <p className="text-[11px] text-[#202923]/70">SKUs reaching replenishment safety thresholds</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('inventory')}
              className="text-xs font-black text-[#1E8E63] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {lowStockItems.slice(0, 5).map((item, idx) => {
              const product = products.find((p) => p.sku === item.sku);
              const productName = product?.name || item.sku;
              const itemImg = getProductImage(item.sku, product?.imageUrl);
              const isUrgent = item.available <= 3;
              const targetWh = warehouses.find((w) => w.id === item.warehouseId);

              return (
                <div
                  key={`${item.warehouseId}-${item.sku}-${item.binLocation}-${idx}`}
                  onClick={() => setCurrentView('inventory')}
                  className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#12372A]/10 hover:border-[#1E8E63] transition cursor-pointer flex items-center gap-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs">
                    <img
                      src={itemImg}
                      alt={productName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-[#12372A] text-white px-1.5 py-0.2 rounded">
                        {item.sku}
                      </span>
                      <span className="text-[10px] font-mono text-gray-600 font-bold">
                        📍 {targetWh?.city || 'Hub'} · Bin {item.binLocation}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#12372A] truncate">
                      {productName}
                    </h4>

                    {/* Stock Bar */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isUrgent ? 'bg-[#F26B5B]' : 'bg-[#F3B562]'}`}
                          style={{ width: `${Math.min(100, (item.available / 15) * 100)}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-mono font-black ${isUrgent ? 'text-[#F26B5B]' : 'text-[#F3B562]'}`}>
                        {item.available} units left
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🏭 7. MULTI-WAREHOUSE MATRIX (WITH FACILITY PHOTOS & WORKER LOAD) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouses Matrix with Visual Facility Photos (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-[#12372A]/10 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#1E8E63]" />
              <h3 className="font-black text-sm text-[#12372A] tracking-tight uppercase">
                National Fulfillment Centers (6 Hubs with Live Load)
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('map')}
              className="text-xs font-black text-[#1E8E63] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Explore India Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {warehouses.map((wh) => {
              const whImage = getWarehouseImage(wh.id);
              const isSelected = activeWarehouseId === wh.id;

              return (
                <div
                  key={wh.id}
                  onClick={() => {
                    setActiveWarehouseId(wh.id);
                    setCurrentView('inventory');
                  }}
                  className={`rounded-2xl bg-[#F7F5EF] border overflow-hidden cursor-pointer transition shadow-2xs hover:shadow-md space-y-2 group ${
                    isSelected ? 'border-[#1E8E63] ring-2 ring-[#1E8E63]/20 bg-white' : 'border-[#12372A]/10 hover:border-[#1E8E63]'
                  }`}
                >
                  {/* Warehouse Facility Image */}
                  <div className="h-28 w-full relative overflow-hidden bg-slate-800">
                    <img
                      src={whImage}
                      alt={wh.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                    
                    <div className="absolute top-2 left-2">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#12372A]/90 text-white font-black backdrop-blur-xs border border-white/10">
                        {wh.code}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold backdrop-blur-xs">
                        {wh.activeWorkers} Pickers Active
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                      <div className="font-black text-sm drop-shadow-xs">{wh.city}</div>
                      <div className="text-[10px] text-white/80 truncate drop-shadow-2xs">{wh.name}</div>
                    </div>
                  </div>

                  {/* Warehouse Details & Utilization */}
                  <div className="p-3 pt-0 space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-[#202923]/70 font-bold">
                        <span>Storage Utilization:</span>
                        <strong className="font-mono text-[#12372A]">{wh.capacityUtilization}%</strong>
                      </div>
                      <div className="w-full bg-[#E5EEE5] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            wh.capacityUtilization > 85
                              ? 'bg-[#F26B5B]'
                              : wh.capacityUtilization > 70
                              ? 'bg-[#F3B562]'
                              : 'bg-[#1E8E63]'
                          }`}
                          style={{ width: `${wh.capacityUtilization}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 font-bold pt-1 border-t border-[#12372A]/5">
                      <span>⚡ {wh.activeOrders} Active Orders</span>
                      <span className="text-[#1E8E63] font-mono font-black">99.1% SLA</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Operational Activity Log & Tactical Assistant (1 Col) */}
        <div className="bg-white p-5 rounded-3xl border border-[#12372A]/10 space-y-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1E8E63]" />
              <h3 className="font-black text-sm text-[#12372A] tracking-tight uppercase">
                Control Tower Event Log
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('decision_log')}
              className="text-xs font-black text-[#1E8E63] hover:underline uppercase tracking-wider"
            >
              Audit Trail
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-80">
            {[
              { time: '16:30', tag: 'QUARANTINE', text: 'Kolkata Vault Q-01 isolated 1 Kanjivaram Silk Saree (Gold zari weave snag). Reallocation ready.', color: 'bg-rose-100 text-rose-800' },
              { time: '16:22', tag: 'PICK_ROUTE', text: 'Aryan Rao (Picker #101) optimized 98m wave pick generated (Saved 31% walk distance).', color: 'bg-emerald-100 text-emerald-800' },
              { time: '16:18', tag: 'VIP_ALLOCATION', text: 'Aryan Sharma Blinkit VIP order assigned to Hyderabad Central with sub-4h delivery window.', color: 'bg-sky-100 text-sky-800' },
              { time: '15:45', tag: 'QC_PASS', text: 'Order #10475 passed 5-point optical checklist by Inspector Vikram Kumar.', color: 'bg-[#A7D46F]/40 text-[#12372A]' },
              { time: '15:10', tag: 'DISPATCH', text: 'BlueDart Air Express BD-98234-IN dispatched from Delhi NCR Hub for Connaught Place.', color: 'bg-[#E5EEE5] text-[#12372A]' },
            ].map((feed, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#F7F5EF] border border-[#12372A]/5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${feed.color}`}>
                    {feed.tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{feed.time}</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-snug">{feed.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-[#12372A] hover:bg-[#1b4e3c] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
          >
            <Bot className="w-4 h-4 text-[#A7D46F]" />
            <span>Launch Pilot AI Tactical Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
