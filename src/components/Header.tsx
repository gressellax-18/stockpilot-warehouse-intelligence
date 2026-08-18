import React from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Building2,
  SlidersHorizontal,
  PlusCircle,
  Bot,
  Sparkles,
  Search,
  Bell,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { AllocationStrategy } from '../types';

export const Header: React.FC = () => {
  const {
    warehouses,
    activeWarehouseId,
    setActiveWarehouseId,
    currentStrategy,
    setCurrentStrategy,
    setIsNewOrderModalOpen,
    setIsAiDrawerOpen,
    presentationMode,
    orders,
    exceptions,
    currentView,
  } = useWarehouse();

  const strategies: { id: AllocationStrategy; label: string; desc: string }[] = [
    { id: 'PRIORITY_FIRST', label: 'Priority First (Default)', desc: 'Allocates stock to VIP & critical SLA orders before lower tiers' },
    { id: 'EARLIEST_DEADLINE', label: 'Earliest SLA Deadline', desc: 'Prioritizes orders expiring soonest regardless of tier' },
    { id: 'MAXIMIZE_FULFILLED', label: 'Maximize Orders Fulfilled', desc: 'Favors 100% complete order fulfillment over partial allocations' },
    { id: 'MINIMIZE_PARTIAL', label: 'Minimize Partial Shipments', desc: 'Avoids split batches to minimize carrier packaging costs' },
    { id: 'NEAREST_WAREHOUSE', label: 'Nearest Warehouse Hub', desc: 'Minimizes highway & air transit distance to customer city' },
  ];

  const viewTitles: Record<string, { main: string; category: string }> = {
    command_center: { main: 'COMMAND TOWER', category: 'DASHBOARD' },
    orders: { main: 'ORDERS FULFILLMENT', category: 'OPERATIONS' },
    inventory: { main: 'MULTI-NODE INVENTORY', category: 'WAREHOUSE' },
    picking: { main: 'PICKING & ROUTE OPTIMIZER', category: 'FLOOR OPS' },
    packing: { main: 'PACKING & QUALITY CONTROL', category: 'DISPATCH' },
    exceptions: { main: 'EXCEPTION RESOLUTION', category: 'DECISION ENGINE' },
    shipments: { main: 'CARRIER & DISPATCH TRACKING', category: 'LOGISTICS' },
    analytics: { main: 'OPERATIONAL ANALYTICS', category: 'INTELLIGENCE' },
    simulator: { main: 'WHAT-IF SIMULATION ENGINE', category: 'AI STRATEGY' },
    feedback: { main: 'CUSTOMER REVIEWS & RCA', category: 'FEEDBACK LOOP' },
    map: { main: 'NATIONAL HUBS TOPOLOGY', category: 'NETWORK MAP' },
    decision_log: { main: 'DECISION AUDIT TRAIL', category: 'SYSTEM LOGS' },
  };

  const currentMeta = viewTitles[currentView] || { main: 'CONTROL TOWER', category: 'OPERATIONS' };

  return (
    <header className="h-16 bg-white border-b border-[#12372A]/10 px-6 flex items-center justify-between flex-shrink-0 z-10 shadow-xs">
      {/* Left: View Breadcrumb & Hub Selectors */}
      <div className="flex items-center gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block leading-tight">
            {currentMeta.category}
          </span>
          <span className="text-sm font-black tracking-tight text-[#12372A]">
            {currentMeta.main}
          </span>
        </div>

        {/* Live system pulse */}
        <div className="hidden md:flex items-center space-x-2 border-l border-[#12372A]/10 pl-4 py-1">
          <span className="w-2 h-2 rounded-full bg-[#1E8E63] animate-pulse"></span>
          <span className="text-xs font-black tracking-wider text-[#1E8E63] uppercase font-mono">
            6 HUBS ONLINE
          </span>
        </div>

        {/* Warehouse Hub Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F7F5EF] px-3 py-1.5 rounded-lg border border-[#12372A]/10 text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#1E8E63]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#12372A]/60">Hub:</span>
          <select
            id="select-warehouse-location"
            value={activeWarehouseId || ''}
            onChange={(e) => setActiveWarehouseId(e.target.value || null)}
            className="bg-transparent font-bold text-xs text-[#12372A] focus:outline-none cursor-pointer"
          >
            <option value="">All National Hubs (6 Hubs)</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.city} ({wh.code}) — {wh.capacityUtilization}% Cap
              </option>
            ))}
          </select>
        </div>

        {/* Strategy Selector */}
        <div className="hidden xl:flex items-center gap-2 bg-[#E5EEE5]/60 px-3 py-1.5 rounded-lg border border-[#1E8E63]/20 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#1E8E63]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#12372A]/70">Strategy:</span>
          <select
            id="select-allocation-strategy"
            value={currentStrategy}
            onChange={(e) => setCurrentStrategy(e.target.value as AllocationStrategy)}
            className="bg-transparent font-bold text-xs text-[#12372A] focus:outline-none cursor-pointer"
          >
            {strategies.map((strat) => (
              <option key={strat.id} value={strat.id}>
                {strat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Presentation mode indicator */}
        {presentationMode && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#12372A] text-[#A7D46F] text-xs font-mono font-black tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#A7D46F] animate-ping" />
            PRESENTATION
          </div>
        )}

        {/* Quick Place Order Button */}
        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          id="btn-header-new-order"
          className="py-2 px-3.5 rounded-lg bg-[#12372A] hover:bg-[#12372A]/90 text-white text-xs font-black tracking-wider uppercase flex items-center gap-2 transition shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#A7D46F]" />
          <span>New Order</span>
        </button>

        {/* Pilot AI Co-Pilot Button */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          id="btn-header-ai-assistant"
          className="py-2 px-3.5 rounded-lg bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white text-xs font-black tracking-wider uppercase flex items-center gap-2 transition shadow-xs"
        >
          <Bot className="w-3.5 h-3.5 text-[#A7D46F]" />
          <span>Pilot AI</span>
        </button>
      </div>
    </header>
  );
};
