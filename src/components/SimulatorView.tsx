import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Sliders,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Zap,
  Boxes,
  Users,
  Truck,
  Layers,
  ArrowRight,
  Clock,
  ShieldCheck,
  Building2,
  Cpu,
  BarChart3,
  Flame,
  CheckCircle,
  Package,
  Activity,
} from 'lucide-react';
import { getProductImage, getWarehouseImage } from '../utils/productImages';

interface ScenarioPreset {
  id: string;
  title: string;
  category: 'COUTURE' | 'FOOTWEAR' | 'LEATHER' | 'TECH' | 'WORKFORCE' | 'NETWORK';
  categoryLabel: string;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  featuredSku?: string;
  productName?: string;
  targetWarehouseId: string;
  targetWarehouseName: string;
  description: string;
  unitsToInject?: number;
  slaImpact: string;
  slaImpactValue: number; // positive = improvement, negative = drop
  costImpact: string;
  cycleImpact: string;
  confidenceScore: number;
  co2Reduction: string;
  recommendation: string;
  simulationSteps: string[];
}

export const SimulatorView: React.FC = () => {
  const { inventory, warehouses, products, createReorder } = useWarehouse();

  const presetScenarios: ScenarioPreset[] = [
    {
      id: 'sc-couture',
      title: 'Silk Sarees & Bridal Couture Festive Surge Buffer',
      category: 'COUTURE',
      categoryLabel: '👗 Sarees & Couture',
      accentColor: 'from-rose-600 to-pink-700',
      borderColor: 'border-rose-400',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      badgeText: 'text-rose-600',
      featuredSku: 'SKU-702',
      productName: 'Varanasi Handwoven Banarasi Silk Saree',
      targetWarehouseId: 'wh-kol',
      targetWarehouseName: 'Kolkata East Hub (CCU-06)',
      description: 'Simulates a 120-unit instant stock buffer injection of pure Banarasi & Kanjivaram silk sarees ahead of seasonal bridal demand.',
      unitsToInject: 120,
      slaImpact: '+5.4% SLA Surge Protection',
      slaImpactValue: 5.4,
      costImpact: '₹0 Stockout Lost Sales',
      cycleImpact: '-22 Mins Pick-to-Pack',
      confidenceScore: 98,
      co2Reduction: '-12% via localized fulfillment',
      recommendation: 'Eliminates cross-dock stockouts for Eastern bridal boutiques. Keeps luxury muslin packaging buffers above safety threshold.',
      simulationSteps: [
        'Forecasted 280% bridal demand surge across Kolkata & Delhi',
        'Allocated 120 pristine silk units into temperature-regulated Bin S-04',
        'Pre-assigned velvet acid-free presentation boxing kits',
        'Guaranteed zero stockout during high-margin wedding flash promotions',
      ],
    },
    {
      id: 'sc-shoes',
      title: 'Handcrafted Italian Shoes & Footwear Batch Dispatch',
      category: 'FOOTWEAR',
      categoryLabel: '👞 Footwear & Shoes',
      accentColor: 'from-amber-600 to-orange-700',
      borderColor: 'border-amber-400',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      badgeText: 'text-amber-600',
      featuredSku: 'SKU-720',
      productName: 'Handcrafted Italian Oxford Leather Shoes',
      targetWarehouseId: 'wh-blr',
      targetWarehouseName: 'Bengaluru South FC (BLR-02)',
      description: 'Restocks 75 pairs of handcrafted luxury Oxford shoes & running sneakers directly at Tech Park fulfillment docks.',
      unitsToInject: 75,
      slaImpact: '+4.1% Corporate Dispatch SLA',
      slaImpactValue: 4.1,
      costImpact: '₹42,000 Saved in Expedited Road Freight',
      cycleImpact: '-18 Mins Staging Time',
      confidenceScore: 96,
      co2Reduction: '-180 kg carbon emissions',
      recommendation: 'Fulfills high-velocity luxury footwear orders for Silicon Valley executives within 2-hour delivery windows.',
      simulationSteps: [
        'Simulated 75-pair intake at Bengaluru Inbound Dock B',
        'Automated barcode serialization & size matrix bin allocation',
        'Zero-crease magnetic box packaging pre-staged',
        'Synchronized direct courier pickup with BlueDart Priority VIP',
      ],
    },
    {
      id: 'sc-wallets',
      title: 'RFID Leather Wallets & Bags Direct-to-Consumer Wave',
      category: 'LEATHER',
      categoryLabel: '💼 Wallets & Leather',
      accentColor: 'from-orange-600 to-amber-700',
      borderColor: 'border-orange-400',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      badgeText: 'text-orange-600',
      featuredSku: 'SKU-730',
      productName: 'RFID-Blocking Top-Grain Leather Bi-Fold Wallet',
      targetWarehouseId: 'wh-che',
      targetWarehouseName: 'Chennai Coastal Hub (MAA-03)',
      description: 'Injects 100 units of RFID-shielded calfskin wallets & weekender bags for e-commerce prime subscribers.',
      unitsToInject: 100,
      slaImpact: '+3.8% Regional Order Velocity',
      slaImpactValue: 3.8,
      costImpact: '₹14,500 Cross-Dock Transfer Efficiency',
      cycleImpact: '-14 Mins Fulfillment Lag',
      confidenceScore: 97,
      co2Reduction: '-8% Transit Miles',
      recommendation: 'Optimizes high-density small-item racking in Zone C. Enables batch multi-tote wave picking.',
      simulationSteps: [
        'Injected 100 RFID wallet units into high-density mezzanine Bin L-08',
        'Consolidated 42 pending single-line consumer orders into Wave #302',
        'Automated tamper-evident hologram seal verification',
        'Dispatched via DTDC Surface Express with 100% scanning traceability',
      ],
    },
    {
      id: 'sc-tech',
      title: 'Laser LiDAR Sensors & Satellite Hardware Emergency Drop',
      category: 'TECH',
      categoryLabel: '📡 Tech & LiDAR',
      accentColor: 'from-emerald-600 to-teal-700',
      borderColor: 'border-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      badgeText: 'text-emerald-600',
      featuredSku: 'SKU-421',
      productName: 'Laser LiDAR Sensor (Industrial Precision)',
      targetWarehouseId: 'wh-hyd',
      targetWarehouseName: 'Hyderabad Central FC (HYD-01)',
      description: 'Emergency air freight drop-shipment of 50 High-Precision LiDAR sensors into clean-room optical storage.',
      unitsToInject: 50,
      slaImpact: '+6.2% Critical Defence SLA Protection',
      slaImpactValue: 6.2,
      costImpact: '₹0 Aerospace Penalty Incurred',
      cycleImpact: '-35 Mins Cleanroom Quarantine',
      confidenceScore: 99,
      co2Reduction: 'Direct air-shuttle zero idle time',
      recommendation: 'Guarantees 100% on-time fulfillment for mission-critical satellite assembly payload orders.',
      simulationSteps: [
        'Air cargo charter arrival at Rajiv Gandhi Airport (HYD)',
        'Class-1000 cleanroom optical QA and ESD barcode scan',
        'Allocated to climate-controlled secure vault Bin T-01',
        'Immediate release of backordered VIP aerospace orders',
      ],
    },
    {
      id: 'sc-workforce',
      title: 'Dynamic Wave Reallocation: 3 Extra Zone-A Pickers',
      category: 'WORKFORCE',
      categoryLabel: '👥 Workforce & Routing',
      accentColor: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-400',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      badgeText: 'text-blue-600',
      featuredSku: 'SKU-872',
      productName: '48V 100Ah Industrial Lithium Battery Pack',
      targetWarehouseId: 'wh-pun',
      targetWarehouseName: 'Pune Industrial FC (PNQ-04)',
      description: 'Dynamically shifts 3 certified operators from general receiving to heavy-duty battery pack order staging.',
      unitsToInject: 40,
      slaImpact: '+4.9% Heavy Cargo Throughput',
      slaImpactValue: 4.9,
      costImpact: '₹0 Overtime Labor Overhead',
      cycleImpact: '-28 Mins Pallet Turnaround',
      confidenceScore: 94,
      co2Reduction: '-22% Forklift deadhead driving',
      recommendation: 'Balances aisle congestion in HazMat zones and speeds up battery pack safety inspections.',
      simulationSteps: [
        'Shifted 3 Tier-1 HazMat operators to Battery Staging Zone P',
        'Optimized forklift travel path algorithms (reduced 420m deadhead)',
        'Parallelized flame-retardant crating & UN3480 sticker verification',
        'Reduced dock holding time by 48 minutes per truckload',
      ],
    },
    {
      id: 'sc-network',
      title: 'Autonomous Multi-Hub Spillover Routing (6 National Nodes)',
      category: 'NETWORK',
      categoryLabel: '🌐 Multi-Hub Network',
      accentColor: 'from-purple-600 to-violet-800',
      borderColor: 'border-purple-400',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      badgeText: 'text-purple-600',
      featuredSku: 'SKU-501',
      productName: 'Organic Neem & Turmeric Artisan Soaps (Pack of 12)',
      targetWarehouseId: 'wh-del',
      targetWarehouseName: 'Delhi NCR Mega Hub (DEL-05)',
      description: 'Tests automated load-balancing across Hyderabad, Bengaluru, Chennai, Pune, Delhi, and Kolkata during peak festival surge.',
      unitsToInject: 200,
      slaImpact: '+7.8% Pan-India On-Time Delivery',
      slaImpactValue: 7.8,
      costImpact: '₹85,000 Network Optimization Savings',
      cycleImpact: '-4.2 Hours Total Order-to-Delivery',
      confidenceScore: 95,
      co2Reduction: '-28% Cross-regional fuel consumption',
      recommendation: 'Autonomous inter-hub fulfillment absorbs sudden order spikes with zero single-point-of-failure risks.',
      simulationSteps: [
        'AI monitoring detected 340% northern corridor order surge',
        'Dynamically split consignments between Delhi and Kolkata hubs',
        'Routed local deliveries to nearest fulfillment center radius',
        'Maintained 99.2% overall customer satisfaction rating',
      ],
    },
  ];

  const [activeScenarioId, setActiveScenarioId] = useState<string>('sc-couture');
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Custom Sandbox Parameter Sliders
  const [demandSurgeMultiplier, setDemandSurgeMultiplier] = useState<number>(1.5);
  const [workforceAdjustmentPercent, setWorkforceAdjustmentPercent] = useState<number>(20);
  const [airLogisticsRatio, setAirLogisticsRatio] = useState<number>(40);
  const [customStockBufferUnits, setCustomStockBufferUnits] = useState<number>(50);
  const [selectedSandboxSku, setSelectedSandboxSku] = useState<string>('SKU-702');

  const selectedScenario = presetScenarios.find((s) => s.id === activeScenarioId) || presetScenarios[0];

  // Dynamic Calculated Projections based on Custom Sliders
  const calculatedSlaProjected = Math.min(
    99.8,
    Math.max(
      82.0,
      94.2 + (workforceAdjustmentPercent * 0.08) + (airLogisticsRatio * 0.06) + (customStockBufferUnits * 0.03) - ((demandSurgeMultiplier - 1) * 7.5)
    )
  ).toFixed(1);

  const calculatedCycleTimeMins = Math.max(
    14,
    Math.round(48 - (workforceAdjustmentPercent * 0.22) - (airLogisticsRatio * 0.18) - (customStockBufferUnits * 0.08) + ((demandSurgeMultiplier - 1) * 18))
  );

  const calculatedCostSavings = Math.round(
    32000 + (airLogisticsRatio * 450) + (customStockBufferUnits * 320) - ((demandSurgeMultiplier - 1) * 12000)
  );

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setIsApplied(false);
    setTimeout(() => {
      setIsSimulating(false);
    }, 900);
  };

  const handleApply = () => {
    if (selectedScenario.featuredSku && selectedScenario.unitsToInject) {
      createReorder(selectedScenario.featuredSku, selectedScenario.targetWarehouseId, selectedScenario.unitsToInject);
    }
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🚀 Top Header with High-Tech Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E63] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#1E8E63] uppercase">
              AI Predictive Operations Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#12372A] tracking-tight">
            What-If Operations & High-Value Inventory Simulator
          </h2>
          <p className="text-xs text-[#202923]/70">
            Model demand surges for sarees, footwear, luxury leather, LiDAR tech & batteries before physical commitment.
          </p>
        </div>

        {/* Live Network Confidence Gauge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#E5EEE5] shadow-xs">
          <Cpu className="w-4 h-4 text-[#1E8E63]" />
          <div className="text-xs font-mono">
            <span className="text-[#202923]/60">Neural Engine:</span>{' '}
            <strong className="text-[#12372A] font-bold">Monte-Carlo v4.8 Active</strong>
          </div>
        </div>
      </div>

      {/* 🌟 PRESET SCENARIOS WITH REAL PRODUCT PHOTOS & VIBRANT PALETTES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase font-mono text-[#12372A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1E8E63]" />
            Select Operational Simulation Scenario ({presetScenarios.length})
          </h3>
          <span className="text-[11px] text-[#202923]/60 font-mono">Click to preview impact</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presetScenarios.map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            const productImage = getProductImage(sc.featuredSku);

            return (
              <div
                key={sc.id}
                onClick={() => {
                  setActiveScenarioId(sc.id);
                  setIsApplied(false);
                  handleRunSimulation();
                }}
                id={`scenario-card-${sc.id}`}
                className={`relative rounded-3xl border p-4 cursor-pointer transition duration-200 overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? `bg-white ${sc.borderColor} shadow-lg ring-2 ring-offset-2 ring-[#12372A]`
                    : 'bg-[#F7F5EF] border-[#E5EEE5] hover:bg-white hover:shadow-md hover:border-[#12372A]/30'
                }`}
              >
                {/* Top Glowing Header Strip */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${sc.accentColor} opacity-90`}
                />

                <div className="space-y-3 pt-1">
                  {/* Category Pill & Confidence */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${sc.badgeBg}`}>
                      {sc.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#1E8E63] bg-[#E5EEE5] px-2 py-0.5 rounded-full">
                      {sc.confidenceScore}% Conf
                    </span>
                  </div>

                  {/* Product Photo & Scenario Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-xs group-hover:scale-105 transition">
                      <img
                        src={productImage}
                        alt={sc.productName || sc.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/5" />
                    </div>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#12372A] leading-snug line-clamp-2">
                        {sc.title}
                      </h4>
                      <p className="text-[10px] font-mono text-[#202923]/60 truncate">
                        Target: {sc.targetWarehouseName.split(' ')[0]} Hub
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#202923]/75 leading-relaxed line-clamp-2">
                    {sc.description}
                  </p>
                </div>

                {/* Bottom Metrics Bar */}
                <div className="mt-3 pt-2.5 border-t border-[#12372A]/10 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#1E8E63] font-mono flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {sc.slaImpact.split(' ')[0]} SLA
                  </span>
                  <span className="font-mono text-[#12372A]/70 text-[10px]">
                    {sc.cycleImpact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔬 DEEP DIVE SIMULATION INSPECTOR WITH PRODUCT DISPLAY & LIVE IMPACT GAUGES */}
      <div className="bg-white rounded-3xl border border-[#E5EEE5] p-6 space-y-6 shadow-sm relative overflow-hidden">
        {/* Dynamic Colorful Accent Glow */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${selectedScenario.accentColor}`}
        />

        {/* Selected Scenario Header & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5EEE5]">
          <div className="flex items-start gap-4">
            {/* Large High-Definition Product Box */}
            <div className="w-20 h-20 rounded-2xl bg-[#F7F5EF] border border-[#12372A]/15 overflow-hidden flex-shrink-0 relative shadow-sm">
              <img
                src={getProductImage(selectedScenario.featuredSku)}
                alt={selectedScenario.productName || selectedScenario.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold bg-[#12372A] text-[#A7D46F] px-1.5 py-0.2 rounded">
                {selectedScenario.featuredSku || 'HUB-OPS'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${selectedScenario.badgeBg}`}>
                  {selectedScenario.categoryLabel}
                </span>
                <span className="text-xs font-mono font-bold text-[#12372A] bg-[#F7F5EF] px-2 py-0.5 rounded-full border border-[#12372A]/10">
                  📍 {selectedScenario.targetWarehouseName}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#12372A] leading-snug">
                {selectedScenario.title}
              </h3>
              <p className="text-xs text-[#202923]/70 max-w-2xl leading-relaxed">
                {selectedScenario.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunSimulation}
              className="py-2.5 px-4 rounded-2xl bg-[#F7F5EF] hover:bg-[#E5EEE5] border border-[#12372A]/15 text-[#12372A] font-bold text-xs flex items-center gap-2 transition"
            >
              <RotateCcw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Re-Simulate Monte-Carlo</span>
            </button>

            <button
              onClick={handleApply}
              id="btn-apply-simulation"
              className="py-2.5 px-5 rounded-2xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
            >
              <Play className="w-4 h-4 text-[#A7D46F]" />
              <span>Commit & Inject to Live Racks</span>
            </button>
          </div>
        </div>

        {/* 📊 4 Key Projected Impact Metrics (Colorful Bento Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <div className="text-[10px] uppercase font-mono text-emerald-900 font-bold flex items-center justify-between">
              <span>SLA Performance</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-700">
              {selectedScenario.slaImpact}
            </div>
            <div className="text-[10px] text-emerald-800/80 font-medium">
              Zero customer breach penalty
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
            <div className="text-[10px] uppercase font-mono text-blue-900 font-bold flex items-center justify-between">
              <span>Cost Optimization</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-black font-mono text-blue-800">
              {selectedScenario.costImpact}
            </div>
            <div className="text-[10px] text-blue-800/80 font-medium">
              High capital efficiency
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <div className="text-[10px] uppercase font-mono text-amber-900 font-bold flex items-center justify-between">
              <span>Fulfillment Velocity</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black font-mono text-amber-800">
              {selectedScenario.cycleImpact}
            </div>
            <div className="text-[10px] text-amber-800/80 font-medium">
              Faster dock-to-courier turnaround
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
            <div className="text-[10px] uppercase font-mono text-purple-900 font-bold flex items-center justify-between">
              <span>Eco-Logistics Footprint</span>
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-black font-mono text-purple-800">
              {selectedScenario.co2Reduction}
            </div>
            <div className="text-[10px] text-purple-800/80 font-medium">
              Green delivery routing enabled
            </div>
          </div>
        </div>

        {/* 🤖 Neural Pipeline Step Execution Sequence */}
        <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#12372A]/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-[#12372A] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#1E8E63]" />
              Automated Simulation Execution Sequence:
            </span>
            <span className="text-[10px] font-mono font-bold text-[#1E8E63] bg-white px-2 py-0.5 rounded-full border border-[#1E8E63]/20">
              4 of 4 Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {selectedScenario.simulationSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-xl border border-[#12372A]/10 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#12372A]">
                  <span className="w-4 h-4 rounded-full bg-[#12372A] text-[#A7D46F] flex items-center justify-center text-[9px]">
                    {idx + 1}
                  </span>
                  <span>Stage {idx + 1}</span>
                </div>
                <p className="text-[11px] text-[#202923]/80 leading-snug">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Evaluation Box */}
        <div className="p-4 rounded-2xl bg-[#E5EEE5] border border-[#1E8E63]/30 space-y-1 text-xs">
          <span className="font-bold text-[#12372A] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#1E8E63]" />
            StockPilot Autonomous AI Recommendation:
          </span>
          <p className="text-[#202923]/80 leading-relaxed font-medium">
            {selectedScenario.recommendation}
          </p>
        </div>

        {isApplied && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-3 animate-fade-in shadow-md">
            <CheckCircle className="w-5 h-5 text-[#A7D46F]" />
            <div className="space-y-0.5">
              <div>Simulation Changes Successfully Committed to Warehouse State!</div>
              <div className="text-[11px] font-normal text-emerald-100">
                Injected {selectedScenario.unitsToInject || 50} units of {selectedScenario.productName || 'Inventory'} to {selectedScenario.targetWarehouseName}.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🎛️ INTERACTIVE CUSTOM WHAT-IF SANDBOX SLIDERS (COLORFUL & LIVE) */}
      <div className="bg-gradient-to-br from-[#12372A] to-[#1a4a39] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-[#12372A]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#A7D46F]" />
              <h3 className="text-xl font-bold text-white">
                Custom Operational Sandbox & Stress Tester
              </h3>
            </div>
            <p className="text-xs text-[#E5EEE5]/80">
              Adjust variables in real time to simulate surge volumes, picker workforce capacity, and air transport logistics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-[#A7D46F] text-[#12372A] px-3 py-1 rounded-full uppercase tracking-wider">
              Live Simulation Mode
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Slider 1: Demand Surge Multiplier */}
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                Peak Consumer Demand Surge:
              </label>
              <span className="text-sm font-mono font-black text-[#A7D46F] bg-black/30 px-2 py-0.5 rounded">
                {demandSurgeMultiplier}x Volume
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.5"
              step="0.1"
              value={demandSurgeMultiplier}
              onChange={(e) => setDemandSurgeMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#A7D46F]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span>1.0x (Normal)</span>
              <span>2.0x (Holiday Spike)</span>
              <span>3.5x (Flash Midnight Sale)</span>
            </div>
          </div>

          {/* Slider 2: Workforce Reallocation */}
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                Picker & Packer Shift Crew Scaling:
              </label>
              <span className="text-sm font-mono font-black text-[#A7D46F] bg-black/30 px-2 py-0.5 rounded">
                {workforceAdjustmentPercent > 0 ? `+${workforceAdjustmentPercent}%` : `${workforceAdjustmentPercent}%`} Staff
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="100"
              step="10"
              value={workforceAdjustmentPercent}
              onChange={(e) => setWorkforceAdjustmentPercent(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#A7D46F]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span>-40% (Labor Shortage)</span>
              <span>0% (Standard)</span>
              <span>+100% (Double Shift)</span>
            </div>
          </div>

          {/* Slider 3: Air Express Corridors */}
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-purple-400" />
                Dedicated Air Express vs Surface Road:
              </label>
              <span className="text-sm font-mono font-black text-[#A7D46F] bg-black/30 px-2 py-0.5 rounded">
                {airLogisticsRatio}% Air Cargo
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={airLogisticsRatio}
              onChange={(e) => setAirLogisticsRatio(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#A7D46F]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span>0% (100% Road Freight)</span>
              <span>50% (Hybrid Hubs)</span>
              <span>100% (Charter Flight SLA)</span>
            </div>
          </div>

          {/* Slider 4: Dynamic Buffer Stock Injection */}
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-400" />
                Product Stock Injection Level:
              </label>
              <span className="text-sm font-mono font-black text-[#A7D46F] bg-black/30 px-2 py-0.5 rounded">
                +{customStockBufferUnits} Units
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              step="25"
              value={customStockBufferUnits}
              onChange={(e) => setCustomStockBufferUnits(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#A7D46F]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span>0 Units</span>
              <span>125 Units (Standard Buffer)</span>
              <span>250 Units (Max Reserve)</span>
            </div>
          </div>
        </div>

        {/* 🌟 Dynamic Real-Time Calculated Outcomes Bento */}
        <div className="bg-black/30 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3">
          <div className="text-xs font-bold font-mono text-[#A7D46F] uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#A7D46F]" />
            Real-Time Output Metrics under Custom Parameters:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
              <div className="text-[10px] font-mono text-white/70">Projected Network SLA</div>
              <div className="text-2xl font-black font-mono text-[#A7D46F]">
                {calculatedSlaProjected}%
              </div>
              <div className="text-[10px] text-white/60">
                {parseFloat(calculatedSlaProjected) >= 95 ? '✅ Zero SLA Breach Risk' : '⚠️ Minor Risk of Late Parcel'}
              </div>
            </div>

            <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
              <div className="text-[10px] font-mono text-white/70">Order Turnaround Time</div>
              <div className="text-2xl font-black font-mono text-white">
                {calculatedCycleTimeMins} Mins
              </div>
              <div className="text-[10px] text-white/60">
                Pick-to-Dock departure speed
              </div>
            </div>

            <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
              <div className="text-[10px] font-mono text-white/70">Projected Financial Impact</div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                +₹{calculatedCostSavings.toLocaleString()}
              </div>
              <div className="text-[10px] text-white/60">
                Net operational & stockout savings
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
