import React from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Compass,
  PackageCheck,
  AlertTriangle,
  Truck,
  BarChart3,
  Sliders,
  MessageSquareHeart,
  History,
  MapPin,
  PlayCircle,
  Presentation,
  RotateCcw,
  Bot,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    presentationMode,
    setPresentationMode,
    startDemo,
    demoState,
    resetDemoData,
    exceptions,
    orders,
    setIsAiDrawerOpen,
  } = useWarehouse();

  const openExceptionsCount = exceptions.filter((e) => e.status === 'OPEN').length;
  const criticalOrdersCount = orders.filter((o) => o.priorityLevel === 'CRITICAL' && o.status !== 'DELIVERED').length;

  const navItems = [
    { id: 'command_center', label: 'Command Center', icon: LayoutDashboard, badge: criticalOrdersCount ? `${criticalOrdersCount} Critical` : null, badgeColor: 'bg-[#F26B5B] text-white font-black' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, count: orders.length },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'picking', label: 'Picking & Routes', icon: Compass },
    { id: 'packing', label: 'Packing & QC', icon: PackageCheck },
    { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle, badge: openExceptionsCount ? `${openExceptionsCount} Open` : null, badgeColor: 'bg-[#F3B562] text-[#12372A] font-black' },
    { id: 'shipments', label: 'Shipments', icon: Truck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'feedback', label: 'Customer Feedback', icon: MessageSquareHeart },
    { id: 'map', label: 'Warehouse Map', icon: MapPin },
    { id: 'decision_log', label: 'Decision History', icon: History },
  ];

  return (
    <aside className="w-60 bg-[#12372A] text-white flex flex-col flex-shrink-0 border-r border-[#1E8E63]/20 select-none shadow-xl z-20">
      {/* Brand Header with Bold Typography */}
      <div className="p-6 pb-4">
        <div className="text-[#A7D46F] font-black text-2xl tracking-tighter leading-none flex items-center gap-2">
          <span>STOCKPILOT</span>
        </div>
        <div className="text-[#E5EEE5] text-[10px] uppercase tracking-[0.2em] font-bold opacity-70 mt-1">
          Warehouse Intelligence
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 space-y-1 px-3 overflow-y-auto">
        <div className="text-[10px] font-black uppercase tracking-widest text-[#A7D46F]/60 px-3 py-1 mb-1">
          Operational Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#1E8E63] text-white font-bold shadow-sm'
                  : 'text-[#E5EEE5] hover:bg-white/5 hover:text-white opacity-70 hover:opacity-100 font-semibold'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isActive ? (
                  <div className="w-2 h-2 rounded-full bg-[#A7D46F] shrink-0"></div>
                ) : (
                  <Icon className="w-4 h-4 text-[#A7D46F]/60 shrink-0" />
                )}
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && !item.badge && (
                <span className="text-xs font-mono font-bold text-[#E5EEE5]/50">{item.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Profile & Demo Control Footer */}
      <div className="p-4 border-t border-white/10 bg-[#12372A] space-y-3">
        {/* User Card */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#1E8E63] flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-xs">
            AR
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-black text-white truncate">Aryan Rao</div>
            <div className="text-[10px] text-[#E5EEE5] opacity-60 font-semibold">Ops Manager</div>
          </div>
        </div>

        {/* Demo Button with Bold Typography */}
        <button
          onClick={startDemo}
          id="btn-run-demo"
          className={`w-full py-2.5 text-xs font-black uppercase tracking-widest rounded-md shadow-sm transition duration-150 flex items-center justify-center gap-1.5 ${
            demoState.active
              ? 'bg-[#1E8E63] text-white ring-2 ring-[#A7D46F]'
              : 'bg-[#A7D46F] text-[#12372A] hover:bg-[#b8e384]'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>{demoState.active ? `Demo Step ${demoState.currentStep}/15` : 'Run Full Demo'}</span>
        </button>

        {/* Secondary controls */}
        <div className="flex items-center justify-between text-[11px] pt-1 text-[#E5EEE5]/70 font-semibold px-1">
          <button
            onClick={() => setPresentationMode(!presentationMode)}
            className={`hover:text-white transition ${presentationMode ? 'text-[#A7D46F] font-black' : ''}`}
          >
            {presentationMode ? 'Focus: ON' : 'Presentation'}
          </button>
          <span className="text-white/20">|</span>
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="text-[#A7D46F] hover:underline font-bold"
          >
            Pilot AI
          </button>
          <span className="text-white/20">|</span>
          <button
            onClick={resetDemoData}
            id="btn-reset-data"
            className="hover:text-white transition opacity-70 hover:opacity-100"
            title="Reset to default dataset"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
};
