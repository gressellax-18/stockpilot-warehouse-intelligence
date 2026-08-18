import React from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  AlertTriangle,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  RefreshCw,
  XCircle,
  Truck,
} from 'lucide-react';
import { getProductImage } from '../utils/productImages';

export const ExceptionsView: React.FC = () => {
  const { exceptions, resolveException, orders, setSelectedOrderId, setCurrentView } = useWarehouse();

  const openExceptions = exceptions.filter((e) => e.status === 'OPEN');
  const resolvedExceptions = exceptions.filter((e) => e.status === 'RESOLVED');

  const handleResolve = (exceptionId: string, resolution: 'REALLOCATE_ALT_STOCK' | 'BACKORDER' | 'CANCEL_ITEM') => {
    resolveException(exceptionId, resolution);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12372A] tracking-tight">
            Exception Resolution & Stock Recovery Engine
          </h2>
          <p className="text-xs text-[#202923]/70">
            Real-time multi-warehouse inventory rerouting and automated physical discrepancy management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-[#F26B5B]/15 text-[#F26B5B] border border-[#F26B5B]/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F26B5B] animate-ping" />
            {openExceptions.length} Open Discrepancies
          </span>
        </div>
      </div>

      {/* OPEN EXCEPTIONS LIST */}
      <div className="space-y-4">
        <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]/70">
          Active Discrepancies Requiring Decision ({openExceptions.length})
        </h3>

        {openExceptions.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#E5EEE5] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#1E8E63] mx-auto" />
            <h4 className="font-bold text-sm text-[#12372A]">All Warehouse Exceptions Resolved</h4>
            <p className="text-xs text-[#202923]/60">
              No open physical discrepancies or damaged stock alerts across all 6 national fulfillment centers.
            </p>
          </div>
        ) : (
          openExceptions.map((ex) => {
            const relatedOrder = orders.find((o) => o.id === ex.orderId);
            return (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border-2 border-[#F26B5B]/40 p-6 space-y-5 shadow-sm relative overflow-hidden"
              >
                {/* Top bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5EEE5]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#F26B5B]/15 text-[#F26B5B] flex items-center justify-center font-bold flex-shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#12372A]">{ex.id}</span>
                        <span className="font-mono text-xs text-[#202923]/70 font-semibold">
                          Order #{ex.orderId} ({relatedOrder?.customerName})
                        </span>
                        {relatedOrder?.customerType === 'VIP' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                            👑 VIP SLA at Risk
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#202923]/60 mt-0.5">
                        Detected at <strong>Bin {ex.detectedAtBin}</strong> by Picker <strong>{ex.detectedByWorker}</strong>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full bg-[#F26B5B] text-white">
                    {ex.type.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Discrepancy Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#F7F5EF] p-3.5 rounded-xl border border-[#12372A]/10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs">
                      <img
                        src={getProductImage(ex.sku)}
                        alt={ex.productName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">Product SKU</div>
                      <div className="font-bold text-sm text-[#12372A] font-mono">{ex.sku}</div>
                      <div className="text-[11px] text-[#202923]/70">{ex.productName}</div>
                    </div>
                  </div>

                  <div className="bg-[#F7F5EF] p-3.5 rounded-xl border border-[#12372A]/10 space-y-1">
                    <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">Physical Deficit</div>
                    <div className="font-bold text-sm text-[#F26B5B] font-mono">
                      {ex.missingOrDamagedCount} Unit {ex.type === 'MISSING_IN_BIN' ? 'Missing' : 'Damaged'}
                    </div>
                    <div className="text-[11px] text-[#202923]/70">
                      Expected: {ex.expectedQuantity} | Found: {ex.foundQuantity}
                    </div>
                  </div>

                  <div className="bg-[#F7F5EF] p-3.5 rounded-xl border border-[#12372A]/10 space-y-1">
                    <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">SLA Status</div>
                    <div className="font-bold text-sm text-[#12372A] font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#F26B5B]" />
                      Imminent Deadline
                    </div>
                    <div className="text-[11px] text-[#1E8E63] font-semibold">Stock Reallocation Ready</div>
                  </div>
                </div>

                {/* 🤖 Cross-Warehouse Alternative Stock Discovery */}
                {ex.alternativeStockFound && (
                  <div className="bg-[#E5EEE5] border border-[#1E8E63]/30 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-[#12372A] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#1E8E63]" />
                        <span>Alternative Stock Discovered via Multi-Warehouse Network</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#1E8E63]">
                        {ex.alternativeStockFound.availableQuantity} Units Available
                      </span>
                    </div>

                    <p className="text-xs text-[#202923]/80 leading-relaxed">
                      StockPilot scanned all 6 connected national nodes. <strong>{ex.alternativeStockFound.warehouseName}</strong> has{' '}
                      <strong>{ex.alternativeStockFound.availableQuantity} units</strong> in <strong>Bin {ex.alternativeStockFound.binLocation}</strong>{' '}
                      ({ex.alternativeStockFound.distanceKm} km away). Air express shuttle can guarantee SLA delivery with zero penalty.
                    </p>
                  </div>
                )}

                {/* Decision Actions */}
                <div className="pt-2 border-t border-[#E5EEE5] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#202923]/70 font-medium">
                    Recommended Action: <strong className="text-[#12372A]">{ex.recommendedResolution}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve(ex.id, 'BACKORDER')}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-gray-100 border border-[#12372A]/20 text-[#12372A] font-semibold text-xs transition"
                    >
                      Create Backorder
                    </button>

                    <button
                      onClick={() => handleResolve(ex.id, 'REALLOCATE_ALT_STOCK')}
                      id={`btn-reallocate-exception-${ex.id}`}
                      className="py-2 px-4 rounded-xl bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
                    >
                      <Truck className="w-4 h-4 text-[#A7D46F]" />
                      <span>
                        {ex.alternativeStockFound
                          ? `Reallocate ${ex.missingOrDamagedCount} Unit${ex.missingOrDamagedCount > 1 ? 's' : ''} from ${ex.alternativeStockFound.warehouseName.split(' ')[0]} (${ex.alternativeStockFound.binLocation})`
                          : `Reallocate ${ex.missingOrDamagedCount} Unit${ex.missingOrDamagedCount > 1 ? 's' : ''} from Alternative Hub`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RESOLVED EXCEPTIONS AUDIT TRAIL */}
      {resolvedExceptions.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]/70">
            Resolved Discrepancy History ({resolvedExceptions.length})
          </h3>

          <div className="space-y-2">
            {resolvedExceptions.map((ex) => (
              <div
                key={ex.id}
                className="bg-white p-4 rounded-xl border border-[#E5EEE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E8E63] flex-shrink-0" />
                  <div>
                    <div className="font-bold text-[#12372A]">
                      {ex.id} · Order #{ex.orderId} ({ex.sku})
                    </div>
                    <div className="text-[11px] text-[#202923]/70">{ex.resolvedAction}</div>
                  </div>
                </div>

                <div className="text-right font-mono text-[10px] text-[#202923]/60">
                  <span className="bg-[#E5EEE5] text-[#1E8E63] font-bold px-2 py-0.5 rounded">
                    RESOLVED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
