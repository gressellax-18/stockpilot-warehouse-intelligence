import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  MapPin,
  Building2,
  Boxes,
  Users,
  Activity,
  ArrowRight,
  Sparkles,
  Plane,
  Truck,
} from 'lucide-react';

export const WarehouseMapView: React.FC = () => {
  const { warehouses, inventory, setActiveWarehouseId, setCurrentView, setSelectedOrderId } = useWarehouse();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // SVG Coordinates for India Map Representation (Approx relative % positioning)
  const nodePositions: Record<string, { x: number; y: number }> = {
    'wh-del': { x: 38, y: 24 }, // Delhi
    'wh-kol': { x: 74, y: 44 }, // Kolkata
    'wh-pun': { x: 32, y: 56 }, // Pune
    'wh-hyd': { x: 44, y: 62 }, // Hyderabad
    'wh-blr': { x: 40, y: 78 }, // Bengaluru
    'wh-che': { x: 50, y: 76 }, // Chennai
  };

  const transitCorridors = [
    { from: 'wh-hyd', to: 'wh-che', label: 'Air Shuttle (620km - Active)' },
    { from: 'wh-hyd', to: 'wh-blr', label: 'Express Highway (570km)' },
    { from: 'wh-pun', to: 'wh-hyd', label: 'Express Corridor (560km)' },
    { from: 'wh-del', to: 'wh-kol', label: 'Eastern Trunk (1450km)' },
    { from: 'wh-del', to: 'wh-hyd', label: 'Central Freight (1500km)' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#12372A] tracking-tight">
          National Fulfillment Network & Transit Corridors
        </h2>
        <p className="text-xs text-[#202923]/70">
          6 interconnected multi-echelon warehouse nodes with real-time capacity and air/road freight corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Interactive Map (7 cols) */}
        <div className="lg:col-span-7 bg-[#12372A] rounded-2xl p-6 relative overflow-hidden shadow-xl min-h-[480px] flex flex-col justify-between">
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A7D46F] animate-ping" />
              <span className="font-mono text-xs text-[#A7D46F] font-bold">LIVE TELEMETRY: 6 HUBS SYNCED</span>
            </div>
            <span className="text-[10px] font-mono text-white/50">India Operations Grid</span>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[380px] select-none">
              {/* India Outline Silhouette */}
              <path
                d="M 35 15 Q 45 10, 52 18 Q 65 24, 75 35 Q 85 45, 78 52 Q 68 65, 52 88 Q 45 92, 40 85 Q 32 75, 28 60 Q 22 45, 32 30 Z"
                fill="#1E8E63"
                fillOpacity="0.15"
                stroke="#1E8E63"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />

              {/* Transit Corridors Lines */}
              {transitCorridors.map((corridor, idx) => {
                const p1 = nodePositions[corridor.from];
                const p2 = nodePositions[corridor.to];
                if (!p1 || !p2) return null;
                const isSpecial = corridor.from === 'wh-hyd' && corridor.to === 'wh-che';

                return (
                  <g key={idx}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isSpecial ? '#A7D46F' : '#1E8E63'}
                      strokeWidth={isSpecial ? '1.5' : '0.8'}
                      strokeDasharray={isSpecial ? '3 2' : '2 2'}
                      strokeOpacity={isSpecial ? '0.9' : '0.4'}
                    />
                  </g>
                );
              })}

              {/* Warehouse Node Markers */}
              {warehouses.map((wh) => {
                const pos = nodePositions[wh.id] || { x: 50, y: 50 };
                const isHovered = hoveredNode === wh.id;
                const isHyd = wh.id === 'wh-hyd';

                return (
                  <g
                    key={wh.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(wh.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => {
                      setActiveWarehouseId(wh.id);
                      setCurrentView('inventory');
                    }}
                  >
                    {/* Pulsing halo */}
                    <circle
                      cx={pos.x}
                      y={pos.y}
                      r={isHyd ? '4' : '3'}
                      fill={isHyd ? '#F26B5B' : '#A7D46F'}
                      fillOpacity="0.3"
                      className="animate-pulse"
                    />

                    {/* Main Node Point */}
                    <circle
                      cx={pos.x}
                      y={pos.y}
                      r={isHyd ? '2.5' : '1.8'}
                      fill={isHyd ? '#F26B5B' : '#A7D46F'}
                      stroke="#12372A"
                      strokeWidth="0.8"
                    />

                    {/* Label */}
                    <text
                      x={pos.x + 3.5}
                      y={pos.y + 1}
                      fill="#FFFFFF"
                      fontSize="3.2"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {wh.city} ({wh.code})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] text-white/70 flex justify-between items-center z-10 pt-2 border-t border-white/10">
            <span>🟢 Green: Operational Hubs</span>
            <span>🔴 Red: Critical Priority Focus (HYD)</span>
            <span>✈️ Dashed Line: Active Air Corridor</span>
          </div>
        </div>

        {/* Warehouse Detail Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {warehouses.map((wh) => {
            const isSelected = hoveredNode === wh.id;
            const sku421Stock = inventory.find((i) => i.warehouseId === wh.id && i.sku === 'SKU-421')?.available || 0;

            return (
              <div
                key={wh.id}
                onMouseEnter={() => setHoveredNode(wh.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => {
                  setActiveWarehouseId(wh.id);
                  setCurrentView('inventory');
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-white border-[#1E8E63] shadow-md ring-2 ring-[#1E8E63]/20'
                    : 'bg-[#F7F5EF] border-[#E5EEE5] hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#1E8E63]" />
                    <span className="font-bold text-xs text-[#12372A]">{wh.name}</span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#12372A] text-white font-bold">
                    {wh.code}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#202923]/60 block text-[10px]">Capacity</span>
                    <strong className="text-[#12372A] font-mono">{wh.capacityUtilization}%</strong>
                  </div>
                  <div>
                    <span className="text-[#202923]/60 block text-[10px]">Active Staff</span>
                    <strong className="text-[#12372A] font-mono">{wh.activeWorkers}</strong>
                  </div>
                  <div>
                    <span className="text-[#202923]/60 block text-[10px]">SKU-421 Stock</span>
                    <strong className="text-[#1E8E63] font-mono">{sku421Stock} Units</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
