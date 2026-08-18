import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ScanLine,
  User,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  ShieldAlert,
  Zap,
  Boxes,
  Navigation,
  Footprints,
  Activity,
  Maximize2,
  Check,
  Search,
  RotateCcw,
  Sparkle,
  Radio,
  Eye,
  Sliders,
  Flame,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { getProductImage, USER_PROFILES } from '../utils/productImages';

export const PickingView: React.FC = () => {
  const {
    pickTasks,
    workers,
    orders,
    scanPickItem,
    reportMissingInPick,
    reportDamageInPick,
    assignWorkerToPickTask,
    setCurrentView,
  } = useWarehouse();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(pickTasks[0]?.id || 'PT-8821');
  const [missingModalOpen, setMissingModalOpen] = useState(false);
  const [damagedModalOpen, setDamagedModalOpen] = useState(false);
  const [missingCount, setMissingCount] = useState(1);
  const [damagedCount, setDamagedCount] = useState(1);
  const [scanSuccessSku, setScanSuccessSku] = useState<string | null>(null);
  const [activeAisleTab, setActiveAisleTab] = useState<'ROUTE_MAP' | 'WAVE_CART' | 'HEATMAP'>('ROUTE_MAP');
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState<number>(2);

  const currentTask = pickTasks.find((t) => t.id === selectedTaskId) || pickTasks[0];
  const relatedOrder = orders.find((o) => o.id === currentTask?.orderId);
  const availablePickers = workers.filter((w) => w.role === 'PICKER');
  const assignedWorker = workers.find((w) => w.id === currentTask?.assignedWorkerId) || availablePickers[0];

  const handleScan = (sku: string) => {
    if (currentTask) {
      scanPickItem(currentTask.id, sku);
      setScanSuccessSku(sku);
      setTimeout(() => setScanSuccessSku(null), 1800);
    }
  };

  const handleScanAll = () => {
    if (currentTask) {
      currentTask.items.forEach((it) => {
        if (it.quantityScanned < it.quantityRequested) {
          scanPickItem(currentTask.id, it.sku);
        }
      });
      setScanSuccessSku('ALL');
      setTimeout(() => setScanSuccessSku(null), 2000);
    }
  };

  const handleReportMissing = () => {
    if (currentTask) {
      reportMissingInPick(currentTask.id, currentTask.items[0]?.sku || 'SKU-421', missingCount);
      setMissingModalOpen(false);
      setCurrentView('exceptions');
    }
  };

  const handleReportDamaged = () => {
    if (currentTask) {
      reportDamageInPick(currentTask.id, currentTask.items[0]?.sku || 'SKU-421', damagedCount);
      setDamagedModalOpen(false);
      setCurrentView('exceptions');
    }
  };

  // Route Waypoints Data
  const waypoints = [
    { id: 'WP-1', code: 'STAGING-01', name: 'Start Staging Dock A', zone: 'Intake Bay', x: 40, y: 190, done: true, distance: '0m', action: 'Initialize Wave Cart #W-42' },
    { id: 'WP-2', code: 'AISLE-A01', name: 'Bin A-01 (Optic Frames)', zone: 'Zone A (Sensors)', x: 120, y: 80, done: true, distance: '+22m', action: 'Pass-through verification' },
    { id: 'WP-3', code: 'BIN-A03', name: 'Bin A-03 (Laser LiDAR SKU-421)', zone: 'Zone A (Sensors)', x: 230, y: 80, done: (currentTask?.progressPercent || 0) >= 50, current: true, distance: '+18m', action: 'Pick 10x LiDAR Sensors' },
    { id: 'WP-4', code: 'BIN-S11', name: 'Vault S-11 (Banarasi Silk Saree)', zone: 'Zone S (Fashion)', x: 330, y: 150, done: false, distance: '+24m', action: 'Pick 2x Pure Zari Sarees' },
    { id: 'WP-5', code: 'BIN-J02', name: 'High-Sec J-02 (Diamond Studs)', zone: 'Zone J (Jewelry)', x: 420, y: 90, done: false, distance: '+16m', action: 'Biometric scan & pick' },
    { id: 'WP-6', code: 'PACK-03', name: 'Packing Station P-03', zone: 'Dispatch Bay', x: 500, y: 190, done: (currentTask?.progressPercent || 0) === 100, distance: '+18m', action: 'Handover to QC Inspector' },
  ];

  return (
    <div className="space-y-6 pb-16 text-[#202923] animate-fade-in">
      {/* ========================================================================= */}
      {/* 🚀 1. UNIQUE SMART PICKING HEADER WITH REAL-TIME EFFICIENCY TELEMETRY */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-[#12372A] via-[#1a4a39] to-[#12372A] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-[#A7D46F]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#A7D46F_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#A7D46F] text-[#12372A] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Navigation className="w-3 h-3 text-[#12372A] animate-pulse" />
                Dynamic LiDAR Wave Trajectory Active
              </span>
              <span className="text-[10px] font-mono font-bold bg-white/15 px-2.5 py-0.5 rounded-full text-white/90 border border-white/10">
                Aisle Algorithm v4.8 (Sub-800ms)
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              Smart Wave Picking & Autonomous Aisle Trajectory Routing
            </h1>
            <p className="text-xs sm:text-sm text-[#E5EEE5]/90 font-medium max-w-3xl leading-relaxed">
              Multi-compartment wave cart navigation segregating delicate silk sarees, high-security jewelry, HazMat batteries, and precision LiDAR optics into optimized 98m walking loops.
            </p>
          </div>

          {/* Efficiency Metric Pods */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center min-w-[110px]">
              <span className="text-[9px] font-mono uppercase text-[#A7D46F] font-bold block">Optimized Walk</span>
              <div className="text-xl font-black font-mono text-white">98 meters</div>
              <span className="text-[9px] text-emerald-300 font-bold">Saved 44m (-31%)</span>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center min-w-[110px]">
              <span className="text-[9px] font-mono uppercase text-[#A7D46F] font-bold block">Picker Speed</span>
              <div className="text-xl font-black font-mono text-[#A7D46F]">65 UPH</div>
              <span className="text-[9px] text-white/80 font-bold">Target: 50 UPH</span>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center min-w-[110px]">
              <span className="text-[9px] font-mono uppercase text-[#A7D46F] font-bold block">Accuracy SLA</span>
              <div className="text-xl font-black font-mono text-emerald-400">99.7%</div>
              <span className="text-[9px] text-white/80 font-bold">Zero-Defect Lead</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🧭 2. ACTIVE WAVE TASK CAROUSEL SELECTOR */}
      {/* ========================================================================= */}
      <section className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#12372A]">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Boxes className="w-4 h-4 text-[#1E8E63]" />
            Active Wave Pick Tasks in Queue ({pickTasks.length})
          </span>
          <span className="text-[#202923]/60 font-mono text-[11px]">Select wave to load real-time trajectory</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {pickTasks.map((task) => {
            const isSelected = selectedTaskId === task.id;
            const taskOrder = orders.find((o) => o.id === task.orderId);

            return (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`p-3 rounded-2xl text-left transition cursor-pointer border flex flex-col justify-between space-y-2 relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#12372A] text-white border-[#12372A] shadow-md ring-2 ring-[#A7D46F]/50 scale-[1.02]'
                    : 'bg-white hover:bg-[#F7F5EF] text-[#12372A] border-[#12372A]/10 shadow-2xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#A7D46F] m-2 animate-ping" />
                )}

                <div className="flex items-center justify-between">
                  <span className={`font-mono font-black text-xs ${isSelected ? 'text-[#A7D46F]' : 'text-[#12372A]'}`}>
                    {task.id}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                      task.status === 'COMPLETED'
                        ? 'bg-[#1E8E63] text-white'
                        : task.status === 'EXCEPTION'
                        ? 'bg-[#F26B5B] text-white'
                        : isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#A7D46F] text-[#12372A]'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-bold truncate">
                    Order #{task.orderId}
                  </div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                    {taskOrder?.customerName || 'Direct B2B Order'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-white/10">
                  <span className={isSelected ? 'text-white/80' : 'text-gray-500'}>{task.zone}</span>
                  <strong className={isSelected ? 'text-[#A7D46F]' : 'text-[#1E8E63]'}>
                    {task.progressPercent}%
                  </strong>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🗺️ 3. UNIQUE DUAL-PANEL: INTERACTIVE ROUTE MAP & SMART SCANNER STATION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: INTERACTIVE SCANNER & DEDICATED WAVE CART (7 COLS) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {currentTask && (
            <div className="bg-white rounded-3xl border border-[#12372A]/10 p-5 space-y-5 shadow-sm">
              
              {/* Task Header & Assigned Specialist */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5EEE5]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-base text-[#12372A]">{currentTask.id}</span>
                    <span className="text-xs text-gray-500 font-medium">for Order #{currentTask.orderId}</span>
                    {relatedOrder?.priorityLevel === 'CRITICAL' && (
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-[#F26B5B] text-white">
                        CRITICAL VIP SLA
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
                    <span>Target Zone: <strong>{currentTask.zone}</strong></span>
                    <span>·</span>
                    <span>Trajectory Length: <strong>{currentTask.optimizedWalkingMeters}m</strong></span>
                  </div>
                </div>

                {/* Worker Assignment Dropdown */}
                <div className="flex items-center gap-2 bg-[#F7F5EF] p-1.5 px-3 rounded-2xl border border-[#12372A]/10">
                  <User className="w-4 h-4 text-[#1E8E63]" />
                  <div className="text-xs">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-gray-500 block">Assigned Picker:</label>
                    <select
                      value={currentTask.assignedWorkerId}
                      onChange={(e) => assignWorkerToPickTask(currentTask.id, e.target.value)}
                      className="bg-transparent font-bold text-xs text-[#12372A] focus:outline-none cursor-pointer"
                    >
                      {availablePickers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.tierLabel})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* High-Tech Optical Scanner Station */}
              <div className="bg-[#F7F5EF] p-5 rounded-2xl border border-[#12372A]/10 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#12372A] text-[#A7D46F] flex items-center justify-center font-black">
                      <ScanLine className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-black text-xs uppercase tracking-wider text-[#12372A]">
                        Live Handheld Optical Barcode Station
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium">Verify SKU barcodes against warehouse optical gate</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleScanAll}
                      id="btn-auto-scan-all"
                      className="py-1.5 px-3 rounded-xl bg-[#12372A] hover:bg-[#1b4e3c] text-[#A7D46F] text-xs font-mono font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Scan All Wave SKUs</span>
                    </button>
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-[#1E8E63] text-white">
                      {currentTask.progressPercent}% Verified
                    </span>
                  </div>
                </div>

                {/* Scan Feedback Banner */}
                {scanSuccessSku && (
                  <div className="bg-emerald-500 text-white p-2.5 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in shadow-md">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      Barcode Scan Verified: {scanSuccessSku === 'ALL' ? 'All Wave Units' : scanSuccessSku} matched!
                    </span>
                    <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded">0.08s LATENCY</span>
                  </div>
                )}

                {/* Pick Items List with Product Thumbnails */}
                <div className="space-y-2.5">
                  {currentTask.items.map((item, idx) => {
                    const isFullyScanned = item.quantityScanned >= item.quantityRequested;
                    const itemImg = getProductImage(item.sku);

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                          isFullyScanned
                            ? 'bg-white border-emerald-300 ring-1 ring-emerald-400/30'
                            : 'bg-white border-[#12372A]/10 hover:border-[#1E8E63]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs">
                            <img
                              src={itemImg}
                              alt={item.productName}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            {isFullyScanned && (
                              <div className="absolute inset-0 bg-emerald-700/70 backdrop-blur-2xs flex items-center justify-center text-white">
                                <Check className="w-6 h-6 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-xs text-[#12372A]">{item.sku}</span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#12372A] text-white">
                                Bin: {item.binLocation}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-[#12372A] leading-snug">
                              {item.productName}
                            </h4>
                            <div className="text-[10px] text-gray-500 font-mono">
                              Aisle Sector: <strong>{item.binLocation.startsWith('S') ? '👗 Silk Mezzanine' : item.binLocation.startsWith('A') ? '⚡ Precision Optics' : '📦 Storage Bay'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Scanned Counter & Action Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                          <div className="text-right font-mono">
                            <div className="text-sm font-black text-[#12372A]">
                              {item.quantityScanned} / {item.quantityRequested}
                            </div>
                            <div className={`text-[10px] font-bold ${isFullyScanned ? 'text-[#1E8E63]' : 'text-amber-600'}`}>
                              {isFullyScanned ? 'Verified & Staged' : 'Pending Scan'}
                            </div>
                          </div>

                          <button
                            onClick={() => handleScan(item.sku)}
                            disabled={isFullyScanned}
                            id={`btn-scan-sku-${item.sku}`}
                            className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                              isFullyScanned
                                ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed border border-emerald-300'
                                : 'bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white shadow-sm hover:scale-105 active:scale-95'
                            }`}
                          >
                            <ScanLine className="w-3.5 h-3.5" />
                            <span>{isFullyScanned ? 'Verified' : 'Scan SKU'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-gray-600">
                    <span>Wave Pick Completion</span>
                    <span className="text-[#1E8E63]">{currentTask.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#E5EEE5] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1E8E63] rounded-full transition-all duration-500"
                      style={{ width: `${currentTask.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Exceptions Quick Trigger Buttons */}
                <div className="pt-2 border-t border-[#12372A]/10 flex flex-wrap gap-2 justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium">Physical discrepancy or defect discovered?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDamagedModalOpen(true)}
                      id="btn-report-damaged-item"
                      className="py-1.5 px-3 rounded-xl bg-white hover:bg-red-50 border border-red-300 text-red-600 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report Damaged</span>
                    </button>

                    <button
                      onClick={() => setMissingModalOpen(true)}
                      id="btn-report-missing-item"
                      className="py-1.5 px-3 rounded-xl bg-[#F26B5B] hover:bg-[#F26B5B]/90 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Report Missing</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dedicated Wave Cart Compartments Breakdown */}
              <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#12372A]/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#12372A]">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Package className="w-4 h-4 text-[#1E8E63]" />
                    Trolley Cart #W-42 Dedicated Sector Compartments
                  </span>
                  <span className="font-mono text-[10px] text-emerald-700 font-black">4 Bays Isolated</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-sky-200 space-y-1">
                    <span className="text-[10px] font-bold text-sky-800 flex items-center gap-1">
                      ⚡ Bay 1: Electronics
                    </span>
                    <div className="font-mono text-[11px] font-black text-slate-800">ESD Antistatic Foam</div>
                    <span className="text-[9px] text-gray-500 block">LiDAR & Battery Packs</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-pink-200 space-y-1">
                    <span className="text-[10px] font-bold text-pink-800 flex items-center gap-1">
                      👗 Bay 2: Silks & Sarees
                    </span>
                    <div className="font-mono text-[11px] font-black text-slate-800">Anti-Crease Hanger</div>
                    <span className="text-[9px] text-gray-500 block">Kanjivaram & Banarasi</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-purple-200 space-y-1">
                    <span className="text-[10px] font-bold text-purple-800 flex items-center gap-1">
                      💎 Bay 3: High-Jewelry
                    </span>
                    <div className="font-mono text-[11px] font-black text-slate-800">Biometric Lockbox</div>
                    <span className="text-[9px] text-gray-500 block">Diamonds & Gold Jhumkas</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                      👞 Bay 4: Footwear
                    </span>
                    <div className="font-mono text-[11px] font-black text-slate-800">Ventilated Stack Crate</div>
                    <span className="text-[9px] text-gray-500 block">Italian Oxfords & Mojaris</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: INTERACTIVE VISUAL AISLE ROUTE MAP & WAYPOINTS (5 COLS) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-[#12372A]/10 p-5 space-y-4 shadow-sm">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#1E8E63]" />
                <h3 className="font-black text-sm text-[#12372A] uppercase tracking-tight">
                  Dynamic Aisle Map & Route Waypoints
                </h3>
              </div>
              <span className="text-[10px] font-mono font-black bg-[#A7D46F] text-[#12372A] px-2 py-0.5 rounded-full">
                Saved 31% Walk
              </span>
            </div>

            {/* Interactive SVG Warehouse Aisle Blueprint Map */}
            <div className="relative rounded-2xl bg-[#12372A] p-4 text-white overflow-hidden shadow-inner border border-[#A7D46F]/30 blueprint-dark-grid">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#A7D46F] mb-2">
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-[#A7D46F] animate-pulse" />
                  HYD CENTRAL · MEZZANINE LEVEL 1
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-white">LIVE PATHFINDER</span>
              </div>

              {/* Visual Floorplan Vector Map */}
              <div className="relative w-full h-56 bg-[#0a231b] rounded-xl border border-white/10 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 540 240" fill="none">
                  {/* Grid Racks background */}
                  <rect x="30" y="30" width="80" height="40" rx="6" fill="#1b4e3c" stroke="#A7D46F" strokeWidth="1" strokeOpacity="0.4" />
                  <text x="70" y="55" fill="#E5EEE5" fontSize="9" fontWeight="bold" textAnchor="middle">Aisle A (Sensors)</text>

                  <rect x="140" y="30" width="80" height="40" rx="6" fill="#1b4e3c" stroke="#A7D46F" strokeWidth="1" strokeOpacity="0.4" />
                  <text x="180" y="55" fill="#E5EEE5" fontSize="9" fontWeight="bold" textAnchor="middle">Aisle B (Batteries)</text>

                  <rect x="250" y="30" width="80" height="40" rx="6" fill="#1b4e3c" stroke="#A7D46F" strokeWidth="1" strokeOpacity="0.4" />
                  <text x="290" y="55" fill="#E5EEE5" fontSize="9" fontWeight="bold" textAnchor="middle">Aisle S (Silk Sarees)</text>

                  <rect x="360" y="30" width="80" height="40" rx="6" fill="#1b4e3c" stroke="#A7D46F" strokeWidth="1" strokeOpacity="0.4" />
                  <text x="400" y="55" fill="#E5EEE5" fontSize="9" fontWeight="bold" textAnchor="middle">Aisle J (Jewelry)</text>

                  {/* Packing bay area */}
                  <rect x="420" y="150" width="100" height="60" rx="8" fill="#12372A" stroke="#1E8E63" strokeWidth="1.5" />
                  <text x="470" y="185" fill="#A7D46F" fontSize="10" fontWeight="bold" textAnchor="middle">QC & Packing Bay</text>

                  {/* Start Dock */}
                  <rect x="20" y="150" width="80" height="60" rx="8" fill="#12372A" stroke="#F3B562" strokeWidth="1.5" />
                  <text x="60" y="185" fill="#F3B562" fontSize="10" fontWeight="bold" textAnchor="middle">Picker Staging</text>

                  {/* Dynamic Trajectory Vector Path */}
                  <path
                    d="M 60 180 L 120 80 L 230 80 L 330 150 L 420 90 L 470 180"
                    fill="none"
                    stroke="#A7D46F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-route-flow"
                  />

                  {/* Waypoint Nodes */}
                  {waypoints.map((wp, idx) => (
                    <g
                      key={wp.id}
                      onClick={() => setSelectedWaypointIndex(idx)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={wp.x}
                        cy={wp.y}
                        r={selectedWaypointIndex === idx ? 9 : 7}
                        fill={wp.done ? '#1E8E63' : selectedWaypointIndex === idx ? '#F26B5B' : '#A7D46F'}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x={wp.x}
                        y={wp.y - 12}
                        fill="#ffffff"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {wp.code}
                      </text>
                    </g>
                  ))}

                  {/* Animated Picker Location Avatar Pin */}
                  <g transform="translate(230, 80)">
                    <circle r="12" fill="#F26B5B" fillOpacity="0.4" className="animate-ping" />
                    <circle r="8" fill="#F26B5B" stroke="#ffffff" strokeWidth="2" />
                  </g>
                </svg>

                {/* Floating Map Legend */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-[9px] font-mono text-white">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1E8E63]" /> Done
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#F26B5B]" /> Current Picker Location
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#A7D46F]" /> Next Waypoint
                  </span>
                </div>
              </div>
            </div>

            {/* Turn-By-Turn Waypoint List */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                <span>Turn-by-Turn Waypoints</span>
                <span>Total 6 Checkpoints</span>
              </div>

              <div className="space-y-2">
                {waypoints.map((wp, idx) => {
                  const isSelected = selectedWaypointIndex === idx;

                  return (
                    <div
                      key={wp.id}
                      onClick={() => setSelectedWaypointIndex(idx)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#12372A] text-white border-[#12372A] shadow-md ring-1 ring-[#A7D46F]'
                          : wp.done
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-[#F7F5EF] border-[#12372A]/10 hover:border-[#1E8E63]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                            isSelected
                              ? 'bg-[#A7D46F] text-[#12372A]'
                              : wp.done
                              ? 'bg-[#1E8E63] text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {idx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono font-black text-xs ${isSelected ? 'text-white' : 'text-[#12372A]'}`}>
                              {wp.code}
                            </span>
                            <span className={`text-[10px] font-mono ${isSelected ? 'text-emerald-300' : 'text-gray-500'}`}>
                              ({wp.distance})
                            </span>
                          </div>
                          <div className={`text-[11px] font-medium leading-snug ${isSelected ? 'text-white/90' : 'text-slate-700'}`}>
                            {wp.action}
                          </div>
                        </div>
                      </div>

                      <div>
                        {wp.done ? (
                          <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-[#A7D46F]' : 'text-[#1E8E63]'}`} />
                        ) : (
                          <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Walking Efficiency Summary Bar */}
            <div className="p-3.5 bg-[#F7F5EF] rounded-2xl border border-[#12372A]/10 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Standard Linear Trajectory:</span>
                <span className="line-through text-red-500 font-mono font-bold">142 meters</span>
              </div>
              <div className="flex justify-between font-black text-[#12372A]">
                <span>Optimized Dynamic Wave Loop:</span>
                <span className="text-[#1E8E63] font-mono">98 meters (Saved 31%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ⚠️ 4. MODALS FOR REPORTING MISSING OR DAMAGED PHYSICAL STOCK */}
      {/* ========================================================================= */}
      {missingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#12372A]/10 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#F26B5B]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-black text-base text-[#12372A]">Register Missing Physical Stock</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Picker discovered missing inventory units at Bin <strong>{currentTask?.items[0]?.binLocation || 'A-03'}</strong>.
              Submitting will immediately trigger an automated cross-warehouse allocation swap (e.g. Chennai or Bengaluru) and flag an inventory audit task.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#12372A]">Missing Units Count</label>
              <input
                type="number"
                min="1"
                max={currentTask?.items[0]?.quantityRequested || 10}
                value={missingCount}
                onChange={(e) => setMissingCount(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-[#12372A]/20 font-mono font-black text-sm focus:outline-none focus:ring-2 focus:ring-[#F26B5B]"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setMissingModalOpen(false)}
                className="py-2.5 px-4 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReportMissing}
                id="btn-confirm-report-missing"
                className="py-2.5 px-5 rounded-2xl bg-[#F26B5B] hover:bg-[#F26B5B]/90 text-white text-xs font-black uppercase tracking-wider shadow-md"
              >
                Register & Reroute Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {damagedModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#12372A]/10 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#F26B5B]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-black text-base text-[#12372A]">Quarantine Damaged Stock</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Isolate physically flawed units (scuffs, broken sensors, zari snags) to the Quarantined Defect Sector vault and immediately trigger priority replacement.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#12372A]">Damaged Units Count</label>
              <input
                type="number"
                min="1"
                max={10}
                value={damagedCount}
                onChange={(e) => setDamagedCount(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-[#12372A]/20 font-mono font-black text-sm focus:outline-none focus:ring-2 focus:ring-[#F26B5B]"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDamagedModalOpen(false)}
                className="py-2.5 px-4 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReportDamaged}
                className="py-2.5 px-5 rounded-2xl bg-[#F26B5B] hover:bg-[#F26B5B]/90 text-white text-xs font-black uppercase tracking-wider shadow-md"
              >
                Quarantine & Auto-Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
