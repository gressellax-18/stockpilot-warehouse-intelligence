import React, { useState, useEffect, useRef } from 'react';
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
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  X,
  Layers,
} from 'lucide-react';
import { AllocationStrategy } from '../types';

import { DepartmentMenuBar } from './DepartmentMenuBar';

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
    setCurrentView,
    setSelectedOrderId,
  } = useWarehouse();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toastAlert, setToastAlert] = useState<{ id: string; title: string; message: string; type: 'EXCEPTION' | 'AT_RISK' } | null>(null);

  // Compute current at-risk and open exception counts
  const atRiskOrders = orders.filter(
    (o) =>
      (o.status !== 'DELIVERED' && o.status !== 'FEEDBACK_RECEIVED' && o.status !== 'CANCELLED') &&
      (o.slaRemainingMinutes < 180 || o.priorityLevel === 'CRITICAL' || o.isOutOfStockVip)
  );
  const openExceptions = exceptions.filter((e) => e.status === 'OPEN');
  const totalAlertsCount = atRiskOrders.length + openExceptions.length;

  const prevAtRiskCount = useRef(atRiskOrders.length);
  const prevExceptionCount = useRef(openExceptions.length);

  // Trigger alert toast whenever at-risk or exception counts change
  useEffect(() => {
    if (openExceptions.length > prevExceptionCount.current) {
      const diff = openExceptions.length - prevExceptionCount.current;
      setToastAlert({
        id: `toast-${Date.now()}`,
        title: 'New Operational Exception Detected',
        message: `${diff} new exception item(s) logged in warehouse floor. Immediate review needed.`,
        type: 'EXCEPTION',
      });
    } else if (atRiskOrders.length > prevAtRiskCount.current) {
      const diff = atRiskOrders.length - prevAtRiskCount.current;
      setToastAlert({
        id: `toast-${Date.now()}`,
        title: 'SLA At-Risk Alert Triggered',
        message: `${diff} active order(s) approaching deadline or flagged with high priority SLA.`,
        type: 'AT_RISK',
      });
    }

    prevAtRiskCount.current = atRiskOrders.length;
    prevExceptionCount.current = openExceptions.length;
  }, [atRiskOrders.length, openExceptions.length]);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (toastAlert) {
      const timer = setTimeout(() => setToastAlert(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toastAlert]);

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
    <>
      {/* Toast Alert Banner */}
      {toastAlert && (
        <div className="fixed top-18 right-6 z-50 animate-bounce-short">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl max-w-md ${
              toastAlert.type === 'EXCEPTION'
                ? 'bg-white border-[#F26B5B] text-[#12372A]'
                : 'bg-white border-[#F3B562] text-[#12372A]'
            }`}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                toastAlert.type === 'EXCEPTION' ? 'bg-[#F26B5B]/10 text-[#F26B5B]' : 'bg-[#F3B562]/20 text-[#12372A]'
              }`}
            >
              {toastAlert.type === 'EXCEPTION' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-sm text-[#12372A]">{toastAlert.title}</div>
              <p className="text-[#202923]/80 mt-0.5">{toastAlert.message}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentView(toastAlert.type === 'EXCEPTION' ? 'exceptions' : 'orders');
                    setToastAlert(null);
                  }}
                  className="px-2.5 py-1 bg-[#12372A] text-white rounded-md font-bold text-[10px] uppercase tracking-wider hover:bg-[#12372A]/90 transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => setToastAlert(null)}
                  className="px-2 py-1 text-gray-500 hover:text-gray-700 font-bold text-[10px]"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setToastAlert(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <header className="h-16 bg-white border-b border-[#12372A]/10 px-6 flex items-center justify-between flex-shrink-0 z-10 shadow-xs relative">
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

        {/* Right: Actions & Notification Alerts */}
        <div className="flex items-center gap-3">
          {/* Notification Alert Bell Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              id="btn-header-notifications"
              className={`p-2 rounded-lg border transition relative flex items-center gap-1.5 ${
                totalAlertsCount > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                  : 'bg-[#F7F5EF] border-[#12372A]/10 text-[#12372A] hover:bg-[#E5EEE5]'
              }`}
              title="Warehouse Alerts & Exceptions"
            >
              <Bell className="w-4 h-4 text-[#12372A]" />
              {totalAlertsCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F26B5B] animate-ping" />
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#F26B5B] text-white">
                    {totalAlertsCount}
                  </span>
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#E5EEE5] shadow-2xl z-50 p-4 space-y-3 animate-slide-down">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5EEE5]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#1E8E63]" />
                    <h3 className="font-bold text-xs text-[#12372A] uppercase tracking-wider">
                      Command Alerts ({totalAlertsCount})
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2.5 text-xs">
                  {/* Open Exceptions Section */}
                  {openExceptions.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono font-bold text-[#F26B5B] uppercase flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Exceptions Requiring Decision ({openExceptions.length})</span>
                      </div>
                      {openExceptions.map((exc) => (
                        <div
                          key={exc.id}
                          onClick={() => {
                            setSelectedOrderId(exc.orderId);
                            setCurrentView('exceptions');
                            setIsNotifOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-red-50/70 border border-red-200 hover:bg-red-100/70 cursor-pointer transition space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-[#12372A]">
                            <span>{exc.id} · Order #{exc.orderId}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#F26B5B] text-white rounded">
                              {exc.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#202923]/70">{exc.productName}</p>
                          <div className="flex justify-between items-center text-[10px] text-[#1E8E63] font-bold">
                            <span>{exc.recommendedResolution}</span>
                            <ArrowRight className="w-3 h-3 text-[#F26B5B]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* At-Risk Orders Section */}
                  {atRiskOrders.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-mono font-bold text-amber-700 uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>SLA At-Risk Orders ({atRiskOrders.length})</span>
                      </div>
                      {atRiskOrders.map((ord) => (
                        <div
                          key={ord.id}
                          onClick={() => {
                            setSelectedOrderId(ord.id);
                            setIsNotifOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/70 cursor-pointer transition space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-[#12372A]">
                            <span>Order #{ord.id} ({ord.customerName})</span>
                            <span className="text-[10px] font-mono text-[#F26B5B] flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {ord.slaRemainingMinutes}m left
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#202923]/70">
                            <span>Score: {ord.priorityScore}/100 ({ord.priorityLevel})</span>
                            <span className="font-mono font-bold uppercase text-[#1E8E63]">
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {totalAlertsCount === 0 && (
                    <div className="text-center py-6 text-gray-500 space-y-1">
                      <CheckCircle className="w-6 h-6 text-[#1E8E63] mx-auto" />
                      <div className="font-bold text-xs text-[#12372A]">All Systems Operational</div>
                      <p className="text-[10px]">Zero at-risk SLAs or unresolved exceptions.</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E5EEE5] flex justify-between">
                  <button
                    onClick={() => {
                      setCurrentView('command_center');
                      setIsNotifOpen(false);
                    }}
                    className="text-[11px] font-bold text-[#1E8E63] hover:underline flex items-center gap-1"
                  >
                    <span>Command Center Overview</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[11px] font-bold text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

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
      {/* 🧭 Top Department Mega Menu / Category Quick Bar */}
      <DepartmentMenuBar />
    </>
  );
};
