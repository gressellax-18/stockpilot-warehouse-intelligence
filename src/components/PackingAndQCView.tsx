import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  PackageCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Box,
  Scale,
  Sparkles,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { Package } from '../types';

export const PackingAndQCView: React.FC = () => {
  const {
    packages,
    qualityChecks,
    orders,
    workers,
    startPacking,
    completePacking,
    submitQualityCheck,
    setCurrentView,
  } = useWarehouse();

  const [selectedOrderId, setSelectedOrderId] = useState<string>('10482');
  const [boxSize, setBoxSize] = useState<Package['packageSize']>('MEDIUM_BOX');
  const [material, setMaterial] = useState('Anti-Static ESD Foam + Bubble wrap');
  const [checklist, setChecklist] = useState({
    skuCorrect: true,
    quantityCorrect: true,
    packageSealed: true,
    labelAttached: true,
    addressVerified: true,
  });

  const packingEligibleOrders = orders.filter(
    (o) => o.status === 'PACKING' || o.status === 'QC' || o.status === 'READY_TO_DISPATCH'
  );

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || packingEligibleOrders[0] || orders[0];
  const activePackage = packages.find((p) => p.orderId === activeOrder?.id);
  const activeQc = qualityChecks.find((q) => q.orderId === activeOrder?.id);

  const handleStartPacking = () => {
    if (activeOrder) {
      startPacking(activeOrder.id, boxSize, material);
    }
  };

  const handleCompletePacking = () => {
    if (activeOrder) {
      completePacking(activeOrder.id);
    }
  };

  const handlePassQc = () => {
    if (activeOrder) {
      submitQualityCheck(activeOrder.id, checklist, true);
    }
  };

  const handleFailQc = () => {
    if (activeOrder) {
      submitQualityCheck(activeOrder.id, checklist, false, 'Tamper seal misaligned during drop test');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12372A] tracking-tight">
            Packing Stations & Zero-Defect Quality Assurance
          </h2>
          <p className="text-xs text-[#202923]/70">
            Cubic optimization, ESD-protective packaging, and 5-point optical verification inspection.
          </p>
        </div>

        {/* Order Selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E5EEE5] text-xs shadow-xs">
          <span className="font-semibold text-[#12372A]/70">Active Order:</span>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="bg-transparent font-bold text-[#12372A] focus:outline-none cursor-pointer"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.id} — {o.customerName} ({o.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Split: Left (Packing Station) & Right (Quality Check) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 📦 LEFT: PACKING STATION */}
        <div className="bg-white rounded-2xl border border-[#E5EEE5] p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#1E8E63]/15 text-[#1E8E63] flex items-center justify-center font-bold">
                <Box className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#12372A]">Packing Station P-03</h3>
                <p className="text-[11px] text-[#202923]/60">Packer: Nisha Shah · ESD Safe Bay</p>
              </div>
            </div>

            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activePackage?.isPacked
                  ? 'bg-[#1E8E63] text-white'
                  : 'bg-[#A7D46F] text-[#12372A]'
              }`}
            >
              {activePackage?.isPacked ? 'PACKED & SEALED' : 'IN PACKING'}
            </span>
          </div>

          {/* Active order info */}
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#12372A]/10 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-[#202923]/70">Target Order:</span>
              <strong className="text-[#12372A]">#{activeOrder?.id} ({activeOrder?.customerName})</strong>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#202923]/70">Items to Pack:</span>
              <strong className="text-[#1E8E63]">
                {activeOrder?.items.map((i) => `${i.quantityAllocated} × ${i.sku}`).join(', ')}
              </strong>
            </div>
          </div>

          {/* Packing Configuration */}
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Shipping Container Size</label>
              <select
                value={boxSize}
                onChange={(e) => setBoxSize(e.target.value as Package['packageSize'])}
                disabled={activePackage?.isPacked}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-medium focus:outline-none"
              >
                <option value="SMALL_BOX">📦 Small Box (2.4 kg max, ESD Polybag)</option>
                <option value="MEDIUM_BOX">📦 Medium Box (6.2 kg, Anti-Static Foam Inserts)</option>
                <option value="HEAVY_CRATE">📦 Heavy Crate (18.5 kg, Reinforced Double Wall)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Protective Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                disabled={activePackage?.isPacked}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-medium focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 space-y-0.5">
                <div className="text-[10px] text-[#202923]/60 uppercase font-mono">Gross Weight</div>
                <div className="font-bold font-mono text-sm text-[#12372A] flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-[#1E8E63]" />
                  {activePackage?.weightKg || (boxSize === 'MEDIUM_BOX' ? 6.2 : 2.4)} kg
                </div>
              </div>
              <div className="p-3 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 space-y-0.5">
                <div className="text-[10px] text-[#202923]/60 uppercase font-mono">Package Barcode</div>
                <div className="font-bold font-mono text-xs text-[#12372A]">
                  {activePackage?.id || 'PKG-4491'}
                </div>
              </div>
            </div>
          </div>

          {/* Packing Actions */}
          <div className="pt-2 border-t border-[#E5EEE5] flex gap-3">
            {!activePackage?.isPacked ? (
              <button
                onClick={handleCompletePacking}
                id="btn-complete-packing"
                className="w-full py-2.5 px-4 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <CheckCircle2 className="w-4 h-4 text-[#A7D46F]" />
                <span>Complete Packing & Handover to QC</span>
              </button>
            ) : (
              <div className="w-full py-2 px-3 rounded-xl bg-[#E5EEE5] text-[#1E8E63] font-bold text-xs flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Packing Complete — Transferred to QC Station</span>
              </div>
            )}
          </div>
        </div>

        {/* 🛡️ RIGHT: QUALITY CHECK (QC) */}
        <div className="bg-white rounded-2xl border border-[#E5EEE5] p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-[#1E8E63]" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#12372A]">5-Point QC Optical Verification</h3>
                <p className="text-[11px] text-[#202923]/60">Inspector: Vikram Kumar · Zero Defect Gate</p>
              </div>
            </div>

            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeQc?.passed === true
                  ? 'bg-[#1E8E63] text-white'
                  : activeQc?.passed === false
                  ? 'bg-[#F26B5B] text-white'
                  : 'bg-[#F3B562]/20 text-[#12372A]'
              }`}
            >
              {activeQc?.passed === true
                ? 'QC PASSED'
                : activeQc?.passed === false
                ? 'QC FAILED'
                : 'PENDING INSPECTION'}
            </span>
          </div>

          {/* Interactive 5-Point Checklist */}
          <div className="space-y-2.5 text-xs">
            {[
              { key: 'skuCorrect', label: '1. SKU Barcode Verification matches packing slip manifest' },
              { key: 'quantityCorrect', label: '2. Physical item quantity verified against allocation order' },
              { key: 'packageSealed', label: '3. Tamper-evident holographic security tape applied' },
              { key: 'labelAttached', label: '4. High-contrast carrier routing label & 2D barcode adhered' },
              { key: 'addressVerified', label: '5. Customer delivery GPS & pin code verified' },
            ].map((check) => {
              const isChecked = (checklist as any)[check.key];
              return (
                <label
                  key={check.key}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    isChecked
                      ? 'bg-[#E5EEE5]/40 border-[#1E8E63]/30 text-[#12372A]'
                      : 'bg-white border-[#E5EEE5] text-gray-500'
                  }`}
                >
                  <span className="font-medium">{check.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      setChecklist((prev) => ({ ...prev, [check.key]: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#1E8E63] rounded focus:ring-0 cursor-pointer"
                  />
                </label>
              );
            })}
          </div>

          {/* QC Decisions */}
          <div className="pt-3 border-t border-[#E5EEE5] flex gap-3">
            <button
              onClick={handleFailQc}
              id="btn-fail-qc"
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-red-50 border border-[#F26B5B]/30 text-[#F26B5B] font-bold text-xs transition"
            >
              Fail Inspection
            </button>

            <button
              onClick={handlePassQc}
              id="btn-pass-qc"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4 text-[#A7D46F]" />
              <span>PASS QC & Mark Ready for Dispatch</span>
            </button>
          </div>

          {activeOrder?.status === 'READY_TO_DISPATCH' && (
            <button
              onClick={() => setCurrentView('shipments')}
              className="w-full py-2 px-3 rounded-xl bg-[#12372A] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Order Ready — Proceed to Dispatch Dock</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A7D46F]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
