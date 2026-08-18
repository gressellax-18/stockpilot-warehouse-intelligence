import React from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  X,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Compass,
  PackageCheck,
  Truck,
  MessageSquareHeart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderDetailDrawer: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    setSelectedOrderId,
    setCurrentView,
    acceptRecommendation,
  } = useWarehouse();

  if (!selectedOrderId) return null;

  const order = orders.find((o) => o.id === selectedOrderId);
  if (!order) return null;

  const lifecycleStages: { stage: OrderStatus; label: string; icon: any }[] = [
    { stage: 'NEW', label: 'Order Received', icon: Boxes },
    { stage: 'VALIDATED', label: 'Validated', icon: ShieldCheck },
    { stage: 'PRIORITIZED', label: 'Prioritized', icon: Sparkles },
    { stage: 'ALLOCATED', label: 'Inventory Allocated', icon: Boxes },
    { stage: 'PICKING', label: 'Picking', icon: Compass },
    { stage: 'PACKING', label: 'Packing Station', icon: PackageCheck },
    { stage: 'QC', label: 'Quality Check', icon: ShieldCheck },
    { stage: 'DISPATCHED', label: 'Dispatched', icon: Truck },
    { stage: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
    { stage: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
    { stage: 'FEEDBACK_RECEIVED', label: 'Customer Feedback', icon: MessageSquareHeart },
  ];

  const currentStageIndex = lifecycleStages.findIndex((s) => s.stage === order.status);

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl border-l border-[#E5EEE5] z-50 flex flex-col animate-slide-left">
      {/* Drawer Header */}
      <div className="p-6 border-b border-[#E5EEE5] bg-[#F7F5EF] flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#12372A] text-white">
              ORDER #{order.id}
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                order.priorityLevel === 'CRITICAL'
                  ? 'bg-[#F26B5B] text-white'
                  : order.priorityLevel === 'HIGH'
                  ? 'bg-[#F3B562] text-[#12372A]'
                  : 'bg-[#E5EEE5] text-[#12372A]'
              }`}
            >
              PRIORITY: {order.priorityScore}/100 ({order.priorityLevel})
            </span>
            {order.customerType === 'VIP' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                👑 VIP
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-[#12372A] mt-1.5 tracking-tight">{order.customerName}</h2>
          <p className="text-xs text-[#202923]/70 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#1E8E63]" />
            {order.destinationCity} · {order.shippingMethod}
          </p>
        </div>

        <button
          onClick={() => setSelectedOrderId(null)}
          className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-[#12372A]/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
        {/* Quick Operational Status Box */}
        <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#12372A]/10 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#202923]/70">Fulfillment Hub:</span>
            <strong className="font-semibold text-[#12372A]">{order.allocatedWarehouseName || 'Hyderabad Central FC'}</strong>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#202923]/70">Current Status:</span>
            <span className="font-mono font-bold text-[#1E8E63] uppercase bg-[#E5EEE5] px-2 py-0.5 rounded">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#202923]/70">Order Value:</span>
            <strong className="font-mono font-bold text-sm text-[#12372A]">₹{order.totalAmount.toLocaleString()}</strong>
          </div>
          {order.notes && (
            <div className="pt-2 border-t border-[#12372A]/10 text-[11px] text-[#202923]/80 italic">
              {order.notes}
            </div>
          )}
        </div>

        {/* Priority Reasons Rationale */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]/70">Priority Scoring Breakdown</h3>
          <div className="space-y-1 bg-white p-3 rounded-xl border border-[#E5EEE5]">
            {order.priorityReasons.map((reason, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-[#202923]/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E63] flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Items Breakdown */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]/70">Order Line Items</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 flex justify-between items-center">
                <div>
                  <div className="font-bold text-xs text-[#12372A] font-mono">{item.sku}</div>
                  <div className="text-[11px] text-[#202923]/70">{item.productName}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-xs text-[#12372A]">Qty: {item.quantityRequired} units</div>
                  <div className="text-[10px] text-[#1E8E63]">Allocated: {item.quantityAllocated}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complete 11-Stage Operational Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]/70">
              Warehouse Lifecycle Timeline
            </h3>
            <span className="text-[10px] font-mono text-[#1E8E63]">
              Stage {Math.max(1, currentStageIndex + 1)} / {lifecycleStages.length}
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5EEE5]">
            {lifecycleStages.map((stg, idx) => {
              const Icon = stg.icon;
              const isPast = idx < currentStageIndex || order.status === 'DELIVERED' || order.status === 'FEEDBACK_RECEIVED';
              const isCurrent = idx === currentStageIndex;
              const timelineLog = order.timeline.find((t) => t.stage === stg.stage);

              return (
                <div key={stg.stage} className="relative flex items-start gap-3">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition ${
                      isPast
                        ? 'bg-[#1E8E63] text-white ring-2 ring-white'
                        : isCurrent
                        ? 'bg-[#A7D46F] text-[#12372A] ring-4 ring-[#1E8E63]/20 animate-pulse'
                        : 'bg-[#E5EEE5] text-gray-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3 h-3" />}
                  </div>

                  {/* Stage details */}
                  <div
                    className={`flex-1 p-2.5 rounded-xl border transition ${
                      isCurrent
                        ? 'bg-white border-[#1E8E63] shadow-xs'
                        : isPast
                        ? 'bg-[#F7F5EF]/60 border-[#E5EEE5]'
                        : 'bg-white/40 border-transparent text-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-[#12372A] flex items-center gap-1.5">
                        <span>{stg.label}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-mono font-bold bg-[#A7D46F] text-[#12372A] px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      {timelineLog?.startTime && (
                        <span className="text-[10px] font-mono text-[#202923]/50">
                          {timelineLog.startTime}
                        </span>
                      )}
                    </div>
                    {timelineLog?.workerName && (
                      <div className="text-[10px] text-[#202923]/70 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-[#1E8E63]" />
                        <span>Worker: {timelineLog.workerName}</span>
                      </div>
                    )}
                    {timelineLog?.notes && (
                      <div className="text-[10px] text-[#1E8E63] font-medium mt-0.5">
                        {timelineLog.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 border-t border-[#E5EEE5] bg-[#F7F5EF] flex items-center justify-between">
        <button
          onClick={() => {
            setSelectedOrderId(null);
          }}
          className="py-2 px-3 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200"
        >
          Close Drawer
        </button>

        <div className="flex gap-2">
          {order.status === 'ALLOCATED' && (
            <button
              onClick={() => {
                setCurrentView('picking');
              }}
              className="py-2 px-4 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Go to Pick Task</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A7D46F]" />
            </button>
          )}

          {order.status === 'PICKING' && (
            <button
              onClick={() => {
                setCurrentView('picking');
              }}
              className="py-2 px-4 rounded-xl bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Open Scanner Station</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A7D46F]" />
            </button>
          )}

          {order.status === 'PACKING' && (
            <button
              onClick={() => {
                setCurrentView('packing');
              }}
              className="py-2 px-4 rounded-xl bg-[#1E8E63] text-white font-bold text-xs flex items-center gap-1.5"
            >
              <span>Go to Packing Station</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {order.status === 'READY_TO_DISPATCH' && (
            <button
              onClick={() => {
                setCurrentView('shipments');
              }}
              className="py-2 px-4 rounded-xl bg-[#12372A] text-white font-bold text-xs flex items-center gap-1.5"
            >
              <span>Dispatch Shipment</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A7D46F]" />
            </button>
          )}

          {order.status === 'DELIVERED' && (
            <button
              onClick={() => {
                setCurrentView('feedback');
              }}
              className="py-2 px-4 rounded-xl bg-[#A7D46F] text-[#12372A] font-bold text-xs flex items-center gap-1.5"
            >
              <span>Submit Feedback</span>
              <MessageSquareHeart className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
