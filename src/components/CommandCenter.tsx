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
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Bot,
  Zap,
  Building2,
  Activity,
  Layers,
} from 'lucide-react';
import { PriorityLevel } from '../types';

export const CommandCenter: React.FC = () => {
  const {
    orders,
    inventory,
    warehouses,
    exceptions,
    workers,
    pickTasks,
    acceptRecommendation,
    overrideRecommendation,
    setSelectedOrderId,
    setCurrentView,
    activeWarehouseId,
    currentStrategy,
    setIsAiDrawerOpen,
  } = useWarehouse();

  const [expandedWhy, setExpandedWhy] = useState<boolean>(true);
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>('');

  // Filter based on active warehouse if selected
  const filteredOrders = activeWarehouseId
    ? orders.filter((o) => o.assignedWarehouseId === activeWarehouseId)
    : orders;

  const criticalOrder = orders.find((o) => o.id === '10482') || orders.find((o) => o.priorityLevel === 'CRITICAL');
  const pendingOrders = filteredOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const pickingQueue = pickTasks.filter((pt) => pt.status === 'IN_PROGRESS' || pt.status === 'PENDING');
  const openExceptions = exceptions.filter((e) => e.status === 'OPEN');
  const lowStockItems = inventory.filter((i) => i.available <= 5);

  const handleAccept = () => {
    if (criticalOrder) {
      acceptRecommendation(criticalOrder.id);
    }
  };

  const handleOverrideSubmit = () => {
    if (criticalOrder) {
      overrideRecommendation(criticalOrder.id, overrideReason || 'Manual manager priority override');
      setShowOverrideModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🔴 TOP HERO ACTION BANNER (BOLD TYPOGRAPHY HERO SECTION) */}
      <section className="bg-white border-l-4 border-[#F26B5B] rounded-r-2xl p-6 shadow-sm relative overflow-hidden border border-t-[#12372A]/5 border-r-[#12372A]/5 border-b-[#12372A]/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-[#F26B5B] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
              Critical Action Required
            </span>
            <span className="text-xs font-mono font-bold bg-[#F7F5EF] px-2.5 py-1 rounded text-[#12372A] border border-[#12372A]/10">
              SLA BREACH IN: 02h 14m
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            ENGINE ID: REC-2024-098
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2 text-[#12372A]">
              Order #{criticalOrder?.id || '10482'} — Stock Shortage Imminent
            </h1>
            <p className="text-sm font-bold text-slate-600 mb-4">
              VIP Tier: {criticalOrder?.customerName || 'Tata Advanced Systems'} | Required: 10× LiDAR Sensor (SKU-421) | Available: 7 Units
            </p>

            {/* AI Reasoning Box with Bold Accent */}
            <div className="bg-[#F7F5EF] rounded-xl p-4 border border-[#12372A]/10 space-y-2">
              <div className="flex items-center space-x-2 text-[#12372A]">
                <Sparkles className="w-4 h-4 text-[#1E8E63]" />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  Pilot AI Decision Engine Recommendation
                </span>
                <span className="text-[10px] font-mono bg-[#1E8E63]/15 text-[#1E8E63] font-bold px-1.5 py-0.5 rounded ml-auto">
                  94% CONFIDENCE
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Authorize partial shipment of 7 units from Hyderabad Central to preserve manufacturing SLA. Re-route 3 units from Chennai Coastal FC (Bin C-12). Reallocate lower-priority Order #10490 to Pune West FC."
              </p>
            </div>
          </div>

          {/* Action Callout Controls */}
          <div className="flex flex-col justify-end space-y-3 bg-[#F7F5EF] p-4 rounded-xl border border-[#12372A]/10">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Impact Assessment</div>
              <div className="flex justify-between text-xs font-bold text-[#12372A]">
                <span>SLA Protected:</span>
                <span className="text-[#1E8E63] font-mono font-black">100%</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#12372A]">
                <span>Penalty Avoided:</span>
                <span className="text-[#1E8E63] font-mono font-black">₹50,000</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#12372A]/10 space-y-2">
              <button
                onClick={handleAccept}
                id="btn-accept-recommendation"
                className="w-full bg-[#12372A] hover:bg-[#12372A]/90 text-white px-4 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase transition shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#A7D46F]" />
                <span>Accept Recommendation</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowOverrideModal(true)}
                  id="btn-override-recommendation"
                  className="bg-white border border-[#12372A]/20 text-[#12372A] px-3 py-2 rounded-lg text-xs font-black tracking-wider uppercase hover:bg-slate-50 transition text-center"
                >
                  Override
                </button>
                <button
                  onClick={() => setExpandedWhy(!expandedWhy)}
                  id="btn-view-reasoning"
                  className="bg-[#E5EEE5] border border-[#1E8E63]/30 text-[#12372A] px-3 py-2 rounded-lg text-xs font-black tracking-wider uppercase hover:bg-[#E5EEE5]/80 transition flex items-center justify-center gap-1"
                >
                  <span>Why?</span>
                  {expandedWhy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Reasoning Matrix */}
        {expandedWhy && (
          <div className="mt-4 pt-4 border-t border-[#12372A]/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#F7F5EF] p-3 rounded-lg border border-[#12372A]/10 space-y-1">
              <div className="font-black text-[11px] uppercase tracking-wider text-[#12372A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1E8E63]" />
                1. Priority & SLA Contract
              </div>
              <p className="text-slate-600 text-xs font-medium">
                Tier-1 Aerospace VIP customer with guaranteed same-day delivery contract.
              </p>
            </div>
            <div className="bg-[#F7F5EF] p-3 rounded-lg border border-[#12372A]/10 space-y-1">
              <div className="font-black text-[11px] uppercase tracking-wider text-[#12372A] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#1E8E63]" />
                2. Non-Disruptive Alternative
              </div>
              <p className="text-slate-600 text-xs font-medium">
                Standard Order #10490 can be routed through Pune West FC without SLA breach.
              </p>
            </div>
            <div className="bg-[#F7F5EF] p-3 rounded-lg border border-[#12372A]/10 space-y-1">
              <div className="font-black text-[11px] uppercase tracking-wider text-[#12372A] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#1E8E63]" />
                3. Assembly Line Continuity
              </div>
              <p className="text-slate-600 text-xs font-medium">
                7 sensors prevent assembly line halt; remaining 3 will arrive on early shuttle.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ⚡ BOTTLENECK ALERT BANNER (BOLD TYPOGRAPHY) */}
      <section className="bg-[#12372A] text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#A7D46F] text-[#12372A] flex items-center justify-center font-black flex-shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider bg-[#F26B5B] text-white px-2 py-0.5 rounded">
                Operational Bottleneck
              </span>
              <h3 className="font-black text-sm text-white tracking-tight">
                Picking accounts for 53% of total fulfillment cycle (24 min average)
              </h3>
            </div>
            <p className="text-xs text-[#E5EEE5]/80 font-medium">
              Zone A route optimization can recover up to 31% walking distance (142m → 98m).
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('picking')}
          id="btn-inspect-picking-bottleneck"
          className="py-2 px-4 rounded-lg bg-[#1E8E63] hover:bg-[#A7D46F] hover:text-[#12372A] text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 flex-shrink-0 shadow-xs"
        >
          <span>Inspect Picking Routes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* 📊 STATS / KPIS WITH BOLD TYPOGRAPHY */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Orders Today', value: `${orders.length}`, sub: '+12% vs yesterday', color: 'text-[#12372A]' },
          { label: 'Pending Queue', value: `${pendingOrders.length}`, sub: 'Active in DC', color: 'text-[#1E8E63]' },
          { label: 'Picking Queue', value: `${pickingQueue.length}`, sub: 'Tasks in flight', color: 'text-[#12372A]' },
          { label: 'Low Stock SKUs', value: `${lowStockItems.length}`, sub: 'Reorder alerts', color: 'text-[#F3B562]' },
          { label: 'Open Exceptions', value: `${openExceptions.length}`, sub: 'Need action', color: openExceptions.length > 0 ? 'text-[#F26B5B]' : 'text-[#1E8E63]' },
          { label: 'On-Time SLA', value: '98.4%', sub: 'Target: >98%', color: 'text-[#1E8E63]' },
          { label: 'Orders / Hour', value: '42.8', sub: 'Peak: 58/hr', color: 'text-[#12372A]' },
          { label: 'Avg Fulfillment', value: '38m', sub: '-6m vs last wk', color: 'text-[#12372A]' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#12372A]/10 space-y-1 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block truncate">
              {kpi.label}
            </span>
            <div className={`text-2xl font-black font-mono ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[10px] text-slate-500 font-bold truncate">{kpi.sub}</div>
          </div>
        ))}
      </section>

      {/* 🏭 MULTI-WAREHOUSE MATRIX & CONTROL TOWER FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouses Matrix */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#12372A]/10 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#1E8E63]" />
              <h3 className="font-black text-sm text-[#12372A] tracking-tight uppercase">
                National Fulfillment Centers (6 Hubs)
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('map')}
              className="text-xs font-black text-[#1E8E63] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View India Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {warehouses.map((wh) => (
              <div
                key={wh.id}
                onClick={() => {
                  setSelectedOrderId('10482');
                  setCurrentView('inventory');
                }}
                className="p-3.5 rounded-lg bg-[#F7F5EF] border border-[#12372A]/10 hover:border-[#1E8E63] cursor-pointer transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-[#12372A]">{wh.city}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#12372A] text-white font-black">
                    {wh.code}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#202923]/70 font-semibold">
                    <span>Capacity Load:</span>
                    <strong className="font-mono text-[#12372A] font-black">{wh.capacityUtilization}%</strong>
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
                  <span>{wh.activeWorkers} Staff</span>
                  <span>{wh.activeOrders} Orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Operational Feed */}
        <div className="bg-white p-5 rounded-xl border border-[#12372A]/10 space-y-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1E8E63]" />
              <h3 className="font-black text-sm text-[#12372A] tracking-tight uppercase">
                Control Tower Feed
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('decision_log')}
              className="text-xs font-black text-[#1E8E63] hover:underline uppercase tracking-wider"
            >
              History
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72">
            {[
              { time: '16:30', tag: 'EXCEPTION', text: 'Aryan Rao reported 1 unit missing for #10482 in Bin A-03. Chennai C-12 stock located.', color: 'bg-[#F3B562]/20 text-[#12372A]' },
              { time: '16:22', tag: 'PICK_ROUTE', text: 'Optimized 98m wave pick generated for Picker Aryan Rao (Saved 31% walk).', color: 'bg-[#1E8E63]/20 text-[#12372A]' },
              { time: '16:18', tag: 'DECISION', text: 'Partial fulfillment allocated: 7 units HYD-01, 3 units backordered.', color: 'bg-[#12372A]/10 text-[#12372A]' },
              { time: '15:00', tag: 'QC_PASS', text: 'Order #10475 passed 5-point optical checklist by Inspector Vikram Kumar.', color: 'bg-[#A7D46F]/30 text-[#12372A]' },
              { time: '13:00', tag: 'DISPATCH', text: 'Order #10468 dispatched via BlueDart Air Express (BD-98234-IN).', color: 'bg-[#E5EEE5] text-[#12372A]' },
            ].map((feed, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#F7F5EF] border border-[#12372A]/5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${feed.color}`}>
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
            className="w-full py-2.5 px-3 rounded-lg bg-[#F7F5EF] hover:bg-[#E5EEE5] text-xs font-black uppercase tracking-wider text-[#12372A] border border-[#12372A]/10 flex items-center justify-center gap-2 transition"
          >
            <Bot className="w-4 h-4 text-[#1E8E63]" />
            <span>Ask Pilot AI for Strategic Advice</span>
          </button>
        </div>
      </div>

      {/* Manual Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-[#E5EEE5] space-y-4">
            <h3 className="text-base font-black text-[#12372A] uppercase tracking-tight">Manager Recommendation Override</h3>
            <p className="text-xs text-slate-600 font-medium">
              Provide the operational justification for overriding the automated allocation decision. This will be logged into the permanent audit trail.
            </p>
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. Approved supplier emergency direct courier delivery..."
              rows={3}
              className="w-full p-3 rounded-lg border border-[#12372A]/20 text-xs focus:outline-none focus:ring-2 focus:ring-[#1E8E63] font-medium"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="py-2 px-4 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleOverrideSubmit}
                className="py-2 px-4 rounded-lg bg-[#12372A] text-white text-xs font-black uppercase tracking-wider hover:bg-[#12372A]/90"
              >
                Commit Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
