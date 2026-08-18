import React, { useState, useEffect } from 'react';
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
  MapPin,
  Shield,
  ShieldAlert,
  Barcode,
  QrCode,
  Copy,
  Printer,
  FileText,
  Sliders,
  Check,
  Layers,
  Building2,
  Calendar,
  Clock,
  Phone,
  Mail,
  Zap,
} from 'lucide-react';
import { Package, Order } from '../types';
import { getProductImage } from '../utils/productImages';

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
    setSelectedOrderId,
  } = useWarehouse();

  const [selectedOrderId, setLocalSelectedOrderId] = useState<string>('10482');

  const packingEligibleOrders = orders.filter(
    (o) => o.status === 'PACKING' || o.status === 'QC' || o.status === 'READY_TO_DISPATCH' || o.status === 'PICKING'
  );

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || packingEligibleOrders[0] || orders[0];
  const activePackage = packages.find((p) => p.orderId === activeOrder?.id);
  const activeQc = qualityChecks.find((q) => q.orderId === activeOrder?.id);

  // Form states for packing customization
  const [boxSize, setBoxSize] = useState<Package['packageSize']>('MEDIUM_BOX');
  const [material, setMaterial] = useState<string>('Anti-Static ESD Foam + Sealed Air Cushioning');
  const [weightKg, setWeightKg] = useState<number>(8.5);
  const [customPackageCode, setCustomPackageCode] = useState<string>('PKG-10482-HYD');
  const [destinationAddress, setDestinationAddress] = useState<string>('Tata Aerospace Defense Complex, Bay 4, SEZ Gate 02');
  const [destinationCity, setDestinationCity] = useState<string>('Hyderabad Tech Zone, Telangana - 500108');
  const [coverageType, setCoverageType] = useState<string>('Full Transit Replacement Cover (100% Insured)');
  const [coverageValue, setCoverageValue] = useState<number>(145000);
  const [coveragePolicyNumber, setCoveragePolicyNumber] = useState<string>('INS-HYD-9941-AERO');
  const [packageDimensions, setPackageDimensions] = useState<string>('38 × 28 × 22 cm');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isScaleTared, setIsScaleTared] = useState<boolean>(true);

  // Synchronize state when active order/package changes
  useEffect(() => {
    if (activeOrder) {
      const pkg = packages.find((p) => p.orderId === activeOrder.id);
      if (pkg) {
        setBoxSize(pkg.packageSize || 'MEDIUM_BOX');
        setMaterial(pkg.packagingMaterial || 'Anti-Static ESD Foam + Sealed Air Cushioning');
        setWeightKg(pkg.weightKg || 8.5);
        setCustomPackageCode(pkg.customPackageCode || `PKG-${activeOrder.id}-${activeOrder.assignedWarehouseId.replace('wh-', '').toUpperCase()}`);
        setDestinationAddress(pkg.destinationAddress || `${activeOrder.customerName} Delivery Facility`);
        setDestinationCity(pkg.destinationCity || activeOrder.destinationCity);
        setCoverageType(pkg.coverageType || 'Full Transit Replacement Cover (100% Insured)');
        setCoverageValue(pkg.coverageValue || activeOrder.totalAmount);
        setCoveragePolicyNumber(pkg.coveragePolicyNumber || `INS-${activeOrder.id}-${Math.floor(1000 + Math.random() * 9000)}`);
        setPackageDimensions(pkg.packageDimensions || '38 × 28 × 22 cm');
      } else {
        // Defaults based on order
        const baseWeight = activeOrder.items.reduce((acc, i) => acc + i.quantityRequired * 0.85, 1.2);
        setWeightKg(Number(baseWeight.toFixed(1)));
        setCustomPackageCode(`PKG-${activeOrder.id}-${activeOrder.assignedWarehouseId.replace('wh-', '').toUpperCase()}`);
        setDestinationAddress(`${activeOrder.customerName} Industrial Hub`);
        setDestinationCity(activeOrder.destinationCity);
        setCoverageType('Full Transit Replacement Cover (100% Insured)');
        setCoverageValue(activeOrder.totalAmount);
        setCoveragePolicyNumber(`INS-${activeOrder.id}-AERO`);
        setPackageDimensions('38 × 28 × 22 cm');
      }
    }
  }, [selectedOrderId, activeOrder?.id, packages]);

  const [checklist, setChecklist] = useState({
    skuCorrect: true,
    quantityCorrect: true,
    packageSealed: true,
    labelAttached: true,
    addressVerified: true,
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(customPackageCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTareScale = () => {
    setIsScaleTared(true);
  };

  const handleAdjustWeight = (delta: number) => {
    setWeightKg((prev) => Math.max(0.1, Number((prev + delta).toFixed(1))));
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
      submitQualityCheck(activeOrder.id, checklist, false, 'Tamper seal misaligned or packaging defect detected');
    }
  };

  const currentItem = activeOrder?.items[0];
  const itemImageUrl = currentItem ? getProductImage(currentItem.sku, currentItem.imageUrl) : '';

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Order Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EEE5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#12372A] text-white">
              DISPATCH TERMINAL
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E5EEE5] text-[#1E8E63]">
              STATION P-03 · ESD SAFE
            </span>
          </div>
          <h1 className="text-xl font-black text-[#12372A] tracking-tight mt-1">
            Packing Stations, Logistics Routing & Zero-Defect QA
          </h1>
          <p className="text-xs text-[#202923]/70">
            Calibrated digital scale weighing, dynamic custom package barcodes, transit destination routing, and cargo coverages.
          </p>
        </div>

        {/* Order Selector */}
        <div className="flex items-center gap-2 bg-[#F7F5EF] px-3.5 py-2 rounded-xl border border-[#12372A]/10 text-xs shadow-xs">
          <span className="font-bold text-[#12372A]/70">Active Order:</span>
          <select
            value={activeOrder?.id}
            onChange={(e) => setLocalSelectedOrderId(e.target.value)}
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PACKING & WEIGHT & BARCODE SYSTEM (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 📦 1. Active Order Item & Product Image Card */}
          <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1E8E63]/15 text-[#1E8E63] flex items-center justify-center font-bold">
                  <Box className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#12372A]">Order Item Manifest</h3>
                  <p className="text-[11px] text-[#202923]/60">Order #{activeOrder?.id} · {activeOrder?.customerName}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                  activePackage?.isPacked
                    ? 'bg-[#1E8E63] text-white'
                    : 'bg-[#A7D46F] text-[#12372A]'
                }`}
              >
                {activePackage?.isPacked ? 'PACKED & SEALED' : 'IN PACKING'}
              </span>
            </div>

            {/* Product Image & Line Items Details */}
            <div className="space-y-3">
              {activeOrder?.items.map((item, idx) => {
                const img = getProductImage(item.sku, item.imageUrl);
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs">
                      <img
                        src={img}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-[#12372A] text-white px-2 py-0.5 rounded">
                          {item.sku}
                        </span>
                        <span className="text-[11px] font-bold text-[#1E8E63]">
                          ₹{item.unitPrice.toLocaleString()} / unit
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-[#12372A] leading-snug">{item.productName}</h4>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-[#202923]/70">
                        <span>Required: <strong className="text-[#12372A]">{item.quantityRequired}</strong></span>
                        <span>Allocated: <strong className="text-[#1E8E63]">{item.quantityAllocated}</strong></span>
                        <span>Packed: <strong className="text-[#1E8E63]">{item.quantityPacked || item.quantityAllocated}</strong></span>
                      </div>
                    </div>

                    <div className="text-right font-mono font-bold text-sm text-[#12372A]">
                      ₹{(item.unitPrice * item.quantityRequired).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ⚖️ 2. Digital Scale & Weight Calibration System */}
          <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#1E8E63]" />
                <h3 className="font-bold text-sm text-[#12372A]">Calibrated Digital Scale & Weight System</h3>
              </div>
              <button
                onClick={handleTareScale}
                className="text-[10px] font-mono font-bold px-2 py-1 bg-[#F7F5EF] hover:bg-[#E5EEE5] border border-[#12372A]/10 text-[#12372A] rounded-lg transition"
              >
                TARE SCALE (0.00 kg)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Gross Weight Display */}
              <div className="p-4 bg-[#12372A] text-white rounded-xl space-y-1 sm:col-span-1 shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#A7D46F] block">
                  Gross Weight
                </span>
                <div className="text-3xl font-black font-mono flex items-baseline gap-1">
                  <span>{weightKg.toFixed(2)}</span>
                  <span className="text-sm font-bold text-[#A7D46F]">kg</span>
                </div>
                <div className="text-[10px] text-white/70 font-mono flex items-center gap-1 mt-1">
                  <Check className="w-3 h-3 text-[#A7D46F]" />
                  <span>±0.01kg Optical Tolerance Passed</span>
                </div>
              </div>

              {/* Dynamic Weight Steppers */}
              <div className="sm:col-span-2 p-4 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#12372A]">Manual Scale Adjustment</span>
                  <span className="text-[11px] font-mono text-[#202923]/60">Tare: 0.35kg Box + Cushion</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdjustWeight(-0.5)}
                    className="flex-1 py-1.5 bg-white hover:bg-gray-100 border border-[#12372A]/20 rounded-lg font-bold text-xs text-[#12372A]"
                  >
                    -0.5 kg
                  </button>
                  <button
                    onClick={() => handleAdjustWeight(-0.1)}
                    className="flex-1 py-1.5 bg-white hover:bg-gray-100 border border-[#12372A]/20 rounded-lg font-bold text-xs text-[#12372A]"
                  >
                    -0.1 kg
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-20 text-center font-bold font-mono text-xs bg-white border border-[#12372A]/20 rounded-lg py-1.5 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAdjustWeight(0.1)}
                    className="flex-1 py-1.5 bg-white hover:bg-gray-100 border border-[#12372A]/20 rounded-lg font-bold text-xs text-[#12372A]"
                  >
                    +0.1 kg
                  </button>
                  <button
                    onClick={() => handleAdjustWeight(0.5)}
                    className="flex-1 py-1.5 bg-white hover:bg-gray-100 border border-[#12372A]/20 rounded-lg font-bold text-xs text-[#12372A]"
                  >
                    +0.5 kg
                  </button>
                </div>

                <div className="text-[11px] text-[#202923]/70 font-mono flex justify-between">
                  <span>Net Product: {(weightKg - 0.35).toFixed(2)} kg</span>
                  <span>Tare Box: 0.35 kg</span>
                  <span>Payload Cap: 25.0 kg</span>
                </div>
              </div>
            </div>

            {/* Container Box Dimensions & Material */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="font-bold text-xs text-[#12372A]">Shipping Container Size</label>
                <select
                  value={boxSize}
                  onChange={(e) => {
                    const sz = e.target.value as Package['packageSize'];
                    setBoxSize(sz);
                    if (sz === 'SMALL_BOX') setPackageDimensions('25 × 18 × 12 cm');
                    else if (sz === 'MEDIUM_BOX') setPackageDimensions('38 × 28 × 22 cm');
                    else setPackageDimensions('85 × 65 × 55 cm');
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#12372A]/20 text-xs font-medium bg-white focus:outline-none"
                >
                  <option value="SMALL_BOX">📦 Small Box (25×18×12 cm, ESD Polybag)</option>
                  <option value="MEDIUM_BOX">📦 Medium Box (38×28×22 cm, Foam Inserts)</option>
                  <option value="HEAVY_CRATE">📦 Heavy Wooden Skid / Crate (85×65×55 cm)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-xs text-[#12372A]">Box Cubic Dimensions (L × W × H)</label>
                <input
                  type="text"
                  value={packageDimensions}
                  onChange={(e) => setPackageDimensions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#12372A]/20 text-xs font-mono font-bold bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-xs text-[#12372A]">Protective Material & Tamper Banding</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 text-xs font-medium bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* 🏷️ 3. Package Code & Barcode Generator */}
          <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
              <div className="flex items-center gap-2">
                <Barcode className="w-5 h-5 text-[#1E8E63]" />
                <h3 className="font-bold text-sm text-[#12372A]">Custom Package Code & Carrier Barcode</h3>
              </div>
              <button
                onClick={handleCopyCode}
                className="text-[10px] font-mono font-bold px-2 py-1 bg-[#F7F5EF] hover:bg-[#E5EEE5] border border-[#12372A]/10 text-[#12372A] rounded-lg flex items-center gap-1 transition"
              >
                {copiedCode ? <Check className="w-3 h-3 text-[#1E8E63]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'COPIED' : 'COPY CODE'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="font-bold text-xs text-[#12372A]">Package Tracking Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPackageCode}
                      onChange={(e) => setCustomPackageCode(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl border border-[#12372A]/20 font-mono font-black text-xs text-[#12372A] bg-white uppercase focus:outline-none"
                    />
                    <button
                      onClick={() =>
                        setCustomPackageCode(`PKG-${activeOrder?.id}-${Math.floor(100 + Math.random() * 900)}`)
                      }
                      className="px-3 bg-[#F7F5EF] hover:bg-[#E5EEE5] border border-[#12372A]/10 rounded-xl font-bold text-xs text-[#12372A]"
                    >
                      Regen
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 text-[11px] font-mono text-[#202923]/70 space-y-1">
                  <div className="flex justify-between">
                    <span>Carrier Standard:</span>
                    <strong className="text-[#12372A]">GS1-128 / Code 128-B</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Hub Routing Gate:</span>
                    <strong className="text-[#1E8E63]">DOCK-01 (Air Priority)</strong>
                  </div>
                </div>
              </div>

              {/* Barcode Graphic Representation */}
              <div className="p-4 bg-white rounded-xl border-2 border-dashed border-[#12372A]/20 flex flex-col items-center justify-center space-y-2">
                <div className="w-full flex items-center justify-center h-12 bg-white px-2 overflow-hidden">
                  <div className="flex items-center gap-[2px] h-10">
                    {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 4, 2, 3, 1, 2, 4, 1].map(
                      (w, i) => (
                        <div
                          key={i}
                          style={{ width: `${w * 2}px` }}
                          className="h-full bg-[#12372A]"
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="font-mono font-black text-xs tracking-widest text-[#12372A]">
                  *{customPackageCode}*
                </div>
                <span className="text-[9px] font-mono text-gray-400">Scan verified 100% readable</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WHERE TO DELIVER, COVERAGES & QC INSPECTION (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 📍 4. Where to Deliver (Destination Logistics & Routing) */}
          <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#1E8E63]" />
                <h3 className="font-bold text-sm text-[#12372A]">Delivery Destination & Routing</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#E5EEE5] text-[#12372A] px-2 py-0.5 rounded">
                {activeOrder?.shippingMethod || 'SAME_DAY'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#12372A]">Recipient Customer / Facility</label>
                <div className="font-bold text-xs text-[#12372A] p-2.5 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10">
                  {activeOrder?.customerName}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12372A]">Delivery Address & Dock Bay</label>
                <textarea
                  rows={2}
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-medium text-xs text-[#12372A] bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#12372A]">Destination City & State</label>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-medium text-xs text-[#12372A] bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#12372A]">Assigned Fulfillment Hub</label>
                  <div className="font-bold text-xs text-[#1E8E63] p-2.5 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 truncate">
                    {activeOrder?.allocatedWarehouseName || 'Hyderabad Central FC'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🛡️ 5. Coverages & Cargo Protection Policy */}
          <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#1E8E63]" />
                <h3 className="font-bold text-sm text-[#12372A]">Cargo Coverages & Transit Insurance</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#A7D46F] text-[#12372A] px-2 py-0.5 rounded">
                100% COVERED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#12372A]">Coverage Policy Protection Tier</label>
                <select
                  value={coverageType}
                  onChange={(e) => setCoverageType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-medium text-xs text-[#12372A] bg-white focus:outline-none"
                >
                  <option value="Full Transit Replacement Cover (100% Insured)">
                    🛡️ Full Transit Replacement Cover (100% Insured)
                  </option>
                  <option value="Precision Electronics & ESD Shock Cover">
                    ⚡ Precision Electronics & ESD Shock Cover
                  </option>
                  <option value="Government Strategic Cargo Protection Policy">
                    👑 Government Strategic Cargo Protection Policy
                  </option>
                  <option value="High-Value Industrial Machinery & HazMat Skid Cover">
                    📦 High-Value Industrial Machinery & HazMat Skid Cover
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#12372A]">Declared Insurance Value</label>
                  <input
                    type="number"
                    value={coverageValue}
                    onChange={(e) => setCoverageValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-mono font-bold text-xs text-[#12372A] bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#12372A]">Policy Certificate ID</label>
                  <input
                    type="text"
                    value={coveragePolicyNumber}
                    onChange={(e) => setCoveragePolicyNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-mono font-bold text-xs text-[#12372A] bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#E5EEE5]/60 rounded-xl border border-[#1E8E63]/30 text-[11px] text-[#12372A] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E63]" />
                  <span>Zero-Loss SLA Indemnity Guarantee Certified</span>
                </div>
                <p className="text-[10px] text-[#202923]/70">
                  Full coverage against handling impact, transit delays, and thermal variations.
                </p>
              </div>
            </div>

            {/* Complete Packing Action */}
            <div className="pt-2 border-t border-[#E5EEE5]">
              {!activePackage?.isPacked ? (
                <button
                  onClick={handleCompletePacking}
                  id="btn-complete-packing"
                  className="w-full py-3 px-4 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#A7D46F]" />
                  <span>Seal Package & Handover to QC Inspector</span>
                </button>
              ) : (
                <div className="w-full py-2.5 px-3 rounded-xl bg-[#E5EEE5] text-[#1E8E63] font-bold text-xs flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Package Sealed — Under Inspection at QC Bay</span>
                </div>
              )}
            </div>
          </div>

          {/* 🔍 6. 5-Point Zero-Defect Quality Assurance (QC) */}
          <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EEE5]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1E8E63]" />
                <h3 className="font-bold text-sm text-[#12372A]">5-Point Optical QA Gate</h3>
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
                  : 'READY FOR INSPECTION'}
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-2 text-xs">
              {[
                { key: 'skuCorrect', label: '1. SKU Barcode matches item packaging & serial manifest' },
                { key: 'quantityCorrect', label: `2. Physical count verified (${activeOrder?.items[0]?.quantityAllocated || 10} units complete)` },
                { key: 'packageSealed', label: '3. Tamper-evident holographic security tape applied' },
                { key: 'labelAttached', label: `4. GS1 Barcode ${customPackageCode} & carrier slip adhered` },
                { key: 'addressVerified', label: `5. Destination ${destinationCity} GPS coordinate verified` },
              ].map((check) => {
                const isChecked = (checklist as any)[check.key];
                return (
                  <label
                    key={check.key}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
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

            {/* QC Actions */}
            <div className="pt-2 border-t border-[#E5EEE5] flex gap-3">
              <button
                onClick={handleFailQc}
                id="btn-fail-qc"
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-red-50 border border-[#F26B5B]/30 text-[#F26B5B] font-bold text-xs transition cursor-pointer"
              >
                Fail Inspection
              </button>

              <button
                onClick={handlePassQc}
                id="btn-pass-qc"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#A7D46F]" />
                <span>PASS QC & Dispatch</span>
              </button>
            </div>

            {activeOrder?.status === 'READY_TO_DISPATCH' && (
              <button
                onClick={() => setCurrentView('shipments')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Order Ready — Proceed to Dispatch Dock</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A7D46F]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
