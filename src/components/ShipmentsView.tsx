import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Plane,
  Package,
  Send,
} from 'lucide-react';
import { Carrier } from '../types';
import { getProductImage } from '../utils/productImages';

export const ShipmentsView: React.FC = () => {
  const {
    shipments,
    orders,
    dispatchOrder,
    advanceShipmentStage,
    setSelectedOrderId,
    setCurrentView,
  } = useWarehouse();

  const [selectedCarrier, setSelectedCarrier] = useState<Carrier>('BlueDart');

  const readyToDispatchOrders = orders.filter((o) => o.status === 'READY_TO_DISPATCH');

  const handleDispatch = (orderId: string) => {
    dispatchOrder(orderId, selectedCarrier);
  };

  const handleAdvance = (shipmentId: string) => {
    advanceShipmentStage(shipmentId);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12372A] tracking-tight">
            Carrier Dispatch & End-to-End Delivery Tracking
          </h2>
          <p className="text-xs text-[#202923]/70">
            Multi-carrier rate & SLA optimization with automated milestone tracking across national corridors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-[#1E8E63]/15 text-[#1E8E63] border border-[#1E8E63]/30">
            {shipments.length} Active Shipments
          </span>
        </div>
      </div>

      {/* 🚀 READY FOR DISPATCH QUEUE */}
      {readyToDispatchOrders.length > 0 && (
        <div className="bg-[#F7F5EF] p-5 rounded-2xl border border-[#12372A]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#1E8E63]" />
              <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]">
                Ready for Carrier Dispatch ({readyToDispatchOrders.length})
              </h3>
            </div>
            <span className="text-[10px] text-[#1E8E63] font-semibold">QC Passed · Staged at Dock 01</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readyToDispatchOrders.map((ord) => (
              <div key={ord.id} className="bg-white p-4 rounded-xl border border-[#E5EEE5] space-y-3 shadow-xs">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F7F5EF] border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs">
                      <img
                        src={getProductImage(ord.items[0]?.sku, ord.items[0]?.imageUrl)}
                        alt={ord.items[0]?.productName || 'Order Product'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#12372A]">Order #{ord.id}</div>
                      <div className="text-[11px] text-[#202923]/70">{ord.customerName}</div>
                      <div className="text-[10px] text-[#1E8E63] font-semibold">
                        {ord.destinationCity} · {ord.items[0]?.quantityRequired}× {ord.items[0]?.sku}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#12372A] text-white flex-shrink-0">
                    {ord.shippingMethod}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#E5EEE5]">
                  <select
                    value={selectedCarrier}
                    onChange={(e) => setSelectedCarrier(e.target.value as Carrier)}
                    className="p-1.5 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 text-xs font-semibold text-[#12372A] focus:outline-none"
                  >
                    <option value="BlueDart">✈️ BlueDart Air Express (Fastest SLA)</option>
                    <option value="Delhivery">🚚 Delhivery Surface Express</option>
                    <option value="DTDC">📦 DTDC Prime Air</option>
                    <option value="XpressBees">⚡ XpressBees Direct Logistics</option>
                  </select>

                  <button
                    onClick={() => handleDispatch(ord.id)}
                    id={`btn-dispatch-order-${ord.id}`}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📦 ACTIVE SHIPMENTS LIST */}
      <div className="space-y-4">
        <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]/70">
          Live Shipment In-Transit Matrix ({shipments.length})
        </h3>

        <div className="space-y-4">
          {shipments.map((shp) => {
            const relatedOrder = orders.find((o) => o.id === shp.orderId);
            const isDelivered = shp.currentStage === 'DELIVERED';

            const stagesList = [
              { stage: 'WAREHOUSE', label: 'QC Passed' },
              { stage: 'DISPATCHED', label: 'Carrier Handover' },
              { stage: 'IN_TRANSIT', label: 'Air / Highway Transit' },
              { stage: 'REGIONAL_HUB', label: 'Regional Hub' },
              { stage: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
              { stage: 'DELIVERED', label: 'Delivered' },
            ];

            const currentIndex = stagesList.findIndex((s) => s.stage === shp.currentStage);

            return (
              <div
                key={shp.id}
                className="bg-white rounded-2xl border border-[#E5EEE5] p-5 space-y-4 shadow-xs"
              >
                {/* Top Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5EEE5]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs">
                      <img
                        src={getProductImage(relatedOrder?.items[0]?.sku, relatedOrder?.items[0]?.imageUrl)}
                        alt={relatedOrder?.items[0]?.productName || 'Shipped Item'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#12372A]">{shp.trackingNumber}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E5EEE5] text-[#12372A]">
                          {shp.carrier}
                        </span>
                        <span className="text-xs text-[#202923]/60 font-mono">Order #{shp.orderId}</span>
                      </div>
                      <div className="text-[11px] text-[#202923]/70 mt-0.5">
                        {shp.originWarehouse} → <strong>{shp.destinationCity}</strong> ({relatedOrder?.customerName} · {relatedOrder?.items[0]?.productName})
                      </div>
                    </div>
                  </div>

                  {/* Advance Stage Button */}
                  <div>
                    {!isDelivered ? (
                      <button
                        onClick={() => handleAdvance(shp.id)}
                        id={`btn-advance-shipment-${shp.id}`}
                        className="py-2 px-4 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
                      >
                        <span>Advance Tracking Stage</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A7D46F]" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-[#1E8E63] text-white font-bold text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>DELIVERED (SLA Met)</span>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedOrderId(shp.orderId);
                            setCurrentView('feedback');
                          }}
                          className="py-1 px-3 rounded-xl bg-[#A7D46F] text-[#12372A] font-bold text-xs"
                        >
                          Customer Feedback →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Multi-Stage Visual Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
                  {stagesList.map((stg, idx) => {
                    const isPassed = idx < currentIndex || isDelivered;
                    const isCurrent = idx === currentIndex && !isDelivered;
                    const hist = shp.history.find((h) => h.stage === stg.stage);

                    return (
                      <div
                        key={stg.stage}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 transition ${
                          isPassed
                            ? 'bg-[#E5EEE5]/40 border-[#1E8E63]/30 text-[#12372A]'
                            : isCurrent
                            ? 'bg-[#F7F5EF] border-[#1E8E63] ring-1 ring-[#1E8E63]/40'
                            : 'bg-white border-[#E5EEE5] opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold">Step {idx + 1}</span>
                          {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E63]" />}
                          {isCurrent && <span className="w-2 h-2 rounded-full bg-[#1E8E63] animate-ping" />}
                        </div>
                        <div className="font-bold text-[11px] text-[#12372A] leading-tight">{stg.label}</div>
                        {hist?.timestamp && hist.timestamp !== 'Pending' && (
                          <div className="text-[10px] font-mono text-[#202923]/50">{hist.timestamp}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
