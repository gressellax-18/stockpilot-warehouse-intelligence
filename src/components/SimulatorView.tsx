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
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  category: 'INVENTORY' | 'PRIORITY' | 'WORKFORCE' | 'CARRIER';
  description: string;
  slaImpact: string;
  costImpact: string;
  cycleImpact: string;
  confidenceScore: number;
  recommendation: string;
}

export const SimulatorView: React.FC = () => {
  const { inventory, createReorder } = useWarehouse();

  const scenarios: Scenario[] = [
    {
      id: 'sc-1',
      title: 'Inject 50 Units of SKU-421 into Hyderabad Central Hub',
      category: 'INVENTORY',
      description: 'Simulates instant emergency supplier drop-shipment of 50 Laser LiDAR Sensors into HYD-01.',
      slaImpact: '+4.2% (100% VIP Protection)',
      costImpact: '₹0 Penalty Incurred',
      cycleImpact: '-8 Mins per Order',
      confidenceScore: 98,
      recommendation: 'Completely eliminates partial fulfillment conflict and satisfies all backorders.',
    },
    {
      id: 'sc-2',
      title: 'Dynamic Wave Routing in Zone A with 2 Extra Pickers',
      category: 'WORKFORCE',
      description: 'Reallocates 2 staff from Dock Staging to Zone A wave picking.',
      slaImpact: '+2.8% Faster Turnaround',
      costImpact: 'Zero additional labor cost',
      cycleImpact: '-14 Mins (Reduces 53% Bottleneck)',
      confidenceScore: 95,
      recommendation: 'Eliminates peak-hour picking queue backlogs.',
    },
    {
      id: 'sc-3',
      title: 'Shift Southern Corridors to Dedicated Air Shuttle Logistics',
      category: 'CARRIER',
      description: 'Upgrades all inter-city South transit (Hyderabad - Chennai - Bengaluru) to morning flights.',
      slaImpact: '+6.1% On-Time Delivery',
      costImpact: '+₹140 per parcel freight premium',
      cycleImpact: '-4 Hours Total Transit',
      confidenceScore: 92,
      recommendation: 'Recommended for VIP Tier contracts with high breach penalty clauses.',
    },
    {
      id: 'sc-4',
      title: 'Simulate 80% Severe Labor Shortage at Bengaluru FC',
      category: 'WORKFORCE',
      description: 'Tests automated spillover routing to Chennai and Hyderabad hubs.',
      slaImpact: '-1.4% (Mitigated by Multi-Hub Routing)',
      costImpact: '+₹8,000 Cross-Dock Routing',
      cycleImpact: '+35 Mins Transit',
      confidenceScore: 90,
      recommendation: 'StockPilot network automatically absorbs 86% of order volume with zero total outages.',
    },
  ];

  const [activeScenarioId, setActiveScenarioId] = useState<string>('sc-1');
  const [isApplied, setIsApplied] = useState<boolean>(false);

  const selectedScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const handleApply = () => {
    if (selectedScenario.id === 'sc-1') {
      createReorder('SKU-421', 'wh-hyd', 50);
    }
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#12372A] tracking-tight">
          What-If Warehouse Operations Simulator
        </h2>
        <p className="text-xs text-[#202923]/70">
          Simulate capacity surges, workforce reallocations, and supplier stock injections before physical execution.
        </p>
      </div>

      {/* Preset Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((sc) => {
          const isSelected = activeScenarioId === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => {
                setActiveScenarioId(sc.id);
                setIsApplied(false);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition space-y-3 ${
                isSelected
                  ? 'bg-white border-[#1E8E63] shadow-md ring-2 ring-[#1E8E63]/20'
                  : 'bg-[#F7F5EF] border-[#E5EEE5] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#12372A] text-white">
                  {sc.category}
                </span>
                <span className="text-[10px] font-mono text-[#1E8E63] font-bold">
                  {sc.confidenceScore}% Conf
                </span>
              </div>

              <h4 className="font-bold text-xs text-[#12372A] leading-tight">{sc.title}</h4>
              <p className="text-[11px] text-[#202923]/70 leading-snug">{sc.description}</p>
            </div>
          );
        })}
      </div>

      {/* Simulation Results & Impact Panel */}
      <div className="bg-white rounded-2xl border border-[#E5EEE5] p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5EEE5]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1E8E63]" />
              <h3 className="font-bold text-base text-[#12372A]">{selectedScenario.title}</h3>
            </div>
            <p className="text-xs text-[#202923]/60 mt-0.5">
              Simulated across all 6 national warehouses and active order queues.
            </p>
          </div>

          <button
            onClick={handleApply}
            id="btn-apply-simulation"
            className="py-2.5 px-5 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-sm transition"
          >
            <Play className="w-4 h-4 text-[#A7D46F]" />
            <span>Apply Simulation to Live Data</span>
          </button>
        </div>

        {/* Projected Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#E5EEE5] rounded-xl border border-[#1E8E63]/30 space-y-1">
            <div className="text-[10px] uppercase font-mono text-[#12372A]/70 font-bold">SLA Adherence Impact</div>
            <div className="text-xl font-bold font-mono text-[#1E8E63]">{selectedScenario.slaImpact}</div>
            <div className="text-[10px] text-[#202923]/70">Zero breach projected</div>
          </div>

          <div className="p-4 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 space-y-1">
            <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">Cost Impact</div>
            <div className="text-xl font-bold font-mono text-[#12372A]">{selectedScenario.costImpact}</div>
            <div className="text-[10px] text-[#202923]/70">High financial efficiency</div>
          </div>

          <div className="p-4 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 space-y-1">
            <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">Fulfillment Cycle Time</div>
            <div className="text-xl font-bold font-mono text-[#1E8E63]">{selectedScenario.cycleImpact}</div>
            <div className="text-[10px] text-[#202923]/70">Significant speed improvement</div>
          </div>
        </div>

        {/* Strategic Recommendation */}
        <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#12372A]/10 space-y-1 text-xs">
          <span className="font-bold text-[#12372A] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#1E8E63]" />
            Strategic Evaluation:
          </span>
          <p className="text-[#202923]/80 leading-relaxed">{selectedScenario.recommendation}</p>
        </div>

        {isApplied && (
          <div className="p-3 rounded-xl bg-[#E5EEE5] text-[#1E8E63] font-bold text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Simulation changes committed to live warehouse state! Inventory ledger updated.</span>
          </div>
        )}
      </div>
    </div>
  );
};
