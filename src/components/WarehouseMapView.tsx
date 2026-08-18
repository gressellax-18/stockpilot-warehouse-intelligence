import React, { useState, useEffect } from 'react';
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
  Navigation,
  Radio,
  Thermometer,
  Droplets,
  Layers,
  ShieldCheck,
  Zap,
  Clock,
  Compass,
} from 'lucide-react';
import { getWarehouseImage, getProductImage } from '../utils/productImages';

interface TransitVehicle {
  id: string;
  type: 'AIR' | 'SURFACE';
  code: string;
  carrier: string;
  fromWh: string;
  toWh: string;
  fromName: string;
  toName: string;
  cargo: string;
  category: 'Fashion & Sarees' | 'Precision Tech' | 'FMCG' | 'Heavy HazMat';
  sku: string;
  units: number;
  progressPercent: number; // 0 to 100
  speedKmh: number;
  eta: string;
  status: 'IN_TRANSIT' | 'APPROACHING_HUB' | 'SCHEDULED';
  coordinates: { lat: number; lng: number };
}

export const WarehouseMapView: React.FC = () => {
  const { warehouses, inventory, setActiveWarehouseId, setCurrentView, setSelectedOrderId } = useWarehouse();
  const [selectedWhId, setSelectedWhId] = useState<string>('wh-hyd');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'AIR' | 'FASHION' | 'TECH'>('ALL');
  const [radarAngle, setRadarAngle] = useState(0);

  // SVG Coordinates for India Map Representation (Approx relative % positioning)
  const nodePositions: Record<string, { x: number; y: number; lat: number; lng: number }> = {
    'wh-del': { x: 38, y: 22, lat: 28.6139, lng: 77.2090 }, // Delhi NCR
    'wh-kol': { x: 75, y: 44, lat: 22.5726, lng: 88.3639 }, // Kolkata East
    'wh-pun': { x: 32, y: 55, lat: 18.5204, lng: 73.8567 }, // Pune Industrial
    'wh-hyd': { x: 44, y: 62, lat: 17.3850, lng: 78.4867 }, // Hyderabad Central
    'wh-blr': { x: 41, y: 78, lat: 12.9716, lng: 77.5946 }, // Bengaluru South
    'wh-che': { x: 52, y: 76, lat: 13.0827, lng: 80.2707 }, // Chennai Coastal
  };

  const transitVehicles: TransitVehicle[] = [
    {
      id: 'V-01',
      type: 'AIR',
      code: 'BD-AIR-402',
      carrier: 'BlueDart Air',
      fromWh: 'wh-hyd',
      toWh: 'wh-che',
      fromName: 'HYD Central',
      toName: 'Chennai Coastal',
      cargo: 'Kanjivaram Silk Sarees + Laser LiDAR',
      category: 'Fashion & Sarees',
      sku: 'SKU-701',
      units: 12,
      progressPercent: 68,
      speedKmh: 680,
      eta: '42 mins',
      status: 'IN_TRANSIT',
      coordinates: { lat: 15.2104, lng: 79.3512 },
    },
    {
      id: 'V-02',
      type: 'SURFACE',
      code: 'DL-EXP-881',
      carrier: 'Delhivery Surface',
      fromWh: 'wh-pun',
      toWh: 'wh-hyd',
      fromName: 'Pune Industrial',
      toName: 'HYD Central',
      cargo: 'Brushless Servo Motors (Automation)',
      category: 'Precision Tech',
      sku: 'SKU-901',
      units: 20,
      progressPercent: 44,
      speedKmh: 82,
      eta: '3h 15m',
      status: 'IN_TRANSIT',
      coordinates: { lat: 17.9542, lng: 75.9124 },
    },
    {
      id: 'V-03',
      type: 'AIR',
      code: 'DTDC-AIR-904',
      carrier: 'DTDC Prime Air',
      fromWh: 'wh-kol',
      toWh: 'wh-blr',
      fromName: 'Kolkata East',
      toName: 'BLR South',
      cargo: 'Banarasi Brocade Silk Sarees',
      category: 'Fashion & Sarees',
      sku: 'SKU-702',
      units: 25,
      progressPercent: 82,
      speedKmh: 720,
      eta: '25 mins',
      status: 'APPROACHING_HUB',
      coordinates: { lat: 14.8821, lng: 78.8920 },
    },
    {
      id: 'V-04',
      type: 'SURFACE',
      code: 'XB-TRK-302',
      carrier: 'XpressBees Direct',
      fromWh: 'wh-del',
      toWh: 'wh-pun',
      fromName: 'Delhi NCR',
      toName: 'Pune Industrial',
      cargo: 'Bridal Velvet Lehengas & Gowns',
      category: 'Fashion & Sarees',
      sku: 'SKU-706',
      units: 14,
      progressPercent: 30,
      speedKmh: 78,
      eta: '9h 40m',
      status: 'IN_TRANSIT',
      coordinates: { lat: 24.1820, lng: 76.1205 },
    },
  ];

  const filteredVehicles = transitVehicles.filter((v) => {
    if (activeFilter === 'AIR') return v.type === 'AIR';
    if (activeFilter === 'FASHION') return v.category === 'Fashion & Sarees';
    if (activeFilter === 'TECH') return v.category === 'Precision Tech';
    return true;
  });

  const selectedWh = warehouses.find((w) => w.id === selectedWhId) || warehouses[0];
  const selectedWhInventory = inventory.filter((i) => i.warehouseId === selectedWhId);
  const totalStockInHub = selectedWhInventory.reduce((sum, item) => sum + item.onHand, 0);

  // Radar sweep animation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Live Telemetry Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E63] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#1E8E63] uppercase">
              Live GPS Telemetry & Multi-Node Grid
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#12372A] tracking-tight">
            National Autonomous Fulfillment Grid & Live Corridors
          </h2>
          <p className="text-xs text-[#202923]/70">
            Real-time geospatial monitoring across 6 high-bay fulfillment centers, active air shuttles & dedicated apparel vaults.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E5EEE5] shadow-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeFilter === 'ALL'
                ? 'bg-[#12372A] text-white shadow-xs'
                : 'text-[#202923]/70 hover:bg-[#F7F5EF]'
            }`}
          >
            All Corridors ({transitVehicles.length})
          </button>
          <button
            onClick={() => setActiveFilter('AIR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              activeFilter === 'AIR'
                ? 'bg-[#12372A] text-white shadow-xs'
                : 'text-[#202923]/70 hover:bg-[#F7F5EF]'
            }`}
          >
            <Plane className="w-3.5 h-3.5 text-[#A7D46F]" />
            <span>Air Express</span>
          </button>
          <button
            onClick={() => setActiveFilter('FASHION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              activeFilter === 'FASHION'
                ? 'bg-[#12372A] text-white shadow-xs'
                : 'text-[#202923]/70 hover:bg-[#F7F5EF]'
            }`}
          >
            <span>👗 Sarees & Apparel</span>
          </button>
        </div>
      </div>

      {/* Main Map & Command Control Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Futuristic SVG Map Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1f17] rounded-3xl p-6 relative overflow-hidden shadow-2xl min-h-[560px] flex flex-col justify-between border border-[#1E8E63]/30">
          {/* Subtle Grid Backdrop */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#A7D46F 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Status Bar in Map */}
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2 bg-[#12372A]/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#1E8E63]/40">
              <Radio className="w-4 h-4 text-[#A7D46F] animate-pulse" />
              <span className="font-mono text-xs text-[#A7D46F] font-bold">
                RADAR ACTIVE · 6 HUBS LINKED
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-white/70 bg-[#12372A]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1E8E63]/40">
              <Compass className="w-3.5 h-3.5 text-[#A7D46F]" />
              <span>SCAN FREQ: 100ms</span>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative flex-1 my-3 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[440px] select-none">
              {/* Radar circular rings */}
              <circle cx="48" cy="55" r="42" fill="none" stroke="#1E8E63" strokeWidth="0.3" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="48" cy="55" r="28" fill="none" stroke="#1E8E63" strokeWidth="0.3" strokeDasharray="3 3" opacity="0.5" />
              <circle cx="48" cy="55" r="14" fill="none" stroke="#1E8E63" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.6" />

              {/* Rotating Radar Sweep Line */}
              <line
                x1="48"
                y1="55"
                x2={48 + 42 * Math.cos((radarAngle * Math.PI) / 180)}
                y2={55 + 42 * Math.sin((radarAngle * Math.PI) / 180)}
                stroke="#A7D46F"
                strokeWidth="0.6"
                opacity="0.6"
              />

              {/* Stylized India Geographical Silhouette Polygon */}
              <path
                d="M 36 12 Q 44 8, 52 16 Q 66 22, 76 34 Q 86 44, 78 52 Q 68 64, 52 89 Q 44 94, 39 86 Q 30 74, 26 58 Q 20 42, 30 26 Z"
                fill="#1E8E63"
                fillOpacity="0.12"
                stroke="#1E8E63"
                strokeWidth="1.2"
                strokeDasharray="3 2"
              />

              {/* Transit Freight Corridors Vector Lines */}
              <g opacity="0.8">
                {/* Hyderabad to Chennai (Air & Road Corridor) */}
                <line x1="44" y1="62" x2="52" y2="76" stroke="#A7D46F" strokeWidth="1.4" strokeDasharray="2 2" />
                {/* Hyderabad to Bengaluru */}
                <line x1="44" y1="62" x2="41" y2="78" stroke="#1E8E63" strokeWidth="1" strokeDasharray="3 2" />
                {/* Pune to Hyderabad */}
                <line x1="32" y1="55" x2="44" y2="62" stroke="#1E8E63" strokeWidth="1" strokeDasharray="3 2" />
                {/* Delhi to Pune */}
                <line x1="38" y1="22" x2="32" y2="55" stroke="#1E8E63" strokeWidth="1" strokeDasharray="3 2" />
                {/* Delhi to Kolkata */}
                <line x1="38" y1="22" x2="75" y2="44" stroke="#1E8E63" strokeWidth="1" strokeDasharray="3 2" />
                {/* Kolkata to Bengaluru */}
                <line x1="75" y1="44" x2="41" y2="78" stroke="#A7D46F" strokeWidth="1.2" strokeDasharray="2 2" />
              </g>

              {/* Active Moving Transit Vehicles */}
              {filteredVehicles.map((veh) => {
                const p1 = nodePositions[veh.fromWh];
                const p2 = nodePositions[veh.toWh];
                if (!p1 || !p2) return null;

                const currX = p1.x + (p2.x - p1.x) * (veh.progressPercent / 100);
                const currY = p1.y + (p2.y - p1.y) * (veh.progressPercent / 100);

                return (
                  <g key={veh.id} className="cursor-pointer">
                    <circle cx={currX} cy={currY} r="3" fill="#F26B5B" className="animate-ping" opacity="0.4" />
                    <circle cx={currX} cy={currY} r="2.2" fill="#F26B5B" stroke="#ffffff" strokeWidth="0.5" />
                    <text
                      x={currX + 3.5}
                      y={currY + 1}
                      fill="#A7D46F"
                      fontSize="2.6"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {veh.type === 'AIR' ? '✈️' : '🚚'} {veh.code}
                    </text>
                  </g>
                );
              })}

              {/* Warehouse Node Markers */}
              {warehouses.map((wh) => {
                const pos = nodePositions[wh.id] || { x: 50, y: 50 };
                const isSelected = selectedWhId === wh.id;

                return (
                  <g
                    key={wh.id}
                    onClick={() => setSelectedWhId(wh.id)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring on selected */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="6.5"
                        fill="none"
                        stroke="#A7D46F"
                        strokeWidth="0.8"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Glow */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? '4.5' : '3.2'}
                      fill={isSelected ? '#A7D46F' : '#1E8E63'}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '1' : '0.6'}
                      className="transition-all duration-300"
                    />

                    {/* Inner core */}
                    <circle cx={pos.x} cy={pos.y} r="1.4" fill="#0b1f17" />

                    {/* Node Text Label */}
                    <text
                      x={pos.x}
                      y={pos.y - 4.5}
                      textAnchor="middle"
                      fill={isSelected ? '#A7D46F' : '#ffffff'}
                      fontSize={isSelected ? '3.4' : '2.8'}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {wh.code}
                    </text>

                    <text
                      x={pos.x}
                      y={pos.y + 6}
                      textAnchor="middle"
                      fill="#ffffff"
                      opacity="0.8"
                      fontSize="2.1"
                      fontFamily="sans-serif"
                    >
                      {wh.city}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Live Corridor Ticker */}
          <div className="z-10 bg-[#12372A]/90 backdrop-blur-md p-3 rounded-2xl border border-[#1E8E63]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A7D46F] animate-pulse" />
              <span className="text-white/80 font-mono text-[11px]">
                Active Transit Mission: <strong>{filteredVehicles[0]?.code}</strong> ({filteredVehicles[0]?.cargo})
              </span>
            </div>
            <span className="text-[#A7D46F] font-mono font-bold text-[11px]">
              Speed: {filteredVehicles[0]?.speedKmh} km/h · ETA: {filteredVehicles[0]?.eta}
            </span>
          </div>
        </div>

        {/* Selected Hub Interactive Control Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Facility Hero Card */}
          <div className="bg-white rounded-3xl border border-[#E5EEE5] overflow-hidden shadow-xs">
            {/* Facility Image with Live Status Badge */}
            <div className="relative h-44 w-full overflow-hidden group">
              <img
                src={getWarehouseImage(selectedWh.id)}
                alt={selectedWh.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12372A] via-[#12372A]/40 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-[#12372A]/90 text-white backdrop-blur-md border border-white/20">
                  {selectedWh.code}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-[#1E8E63] text-white flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ONLINE 99.8%</span>
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-base tracking-tight leading-snug">{selectedWh.name}</h3>
                <div className="flex items-center gap-2 text-xs text-white/80 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A7D46F]" />
                  <span>
                    {selectedWh.city}, {selectedWh.state} (
                    {nodePositions[selectedWh.id]?.lat.toFixed(2)}°N, {nodePositions[selectedWh.id]?.lng.toFixed(2)}°E)
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental & Facility Telemetry Stats */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-[#F7F5EF] p-2.5 rounded-2xl border border-[#12372A]/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#202923]/60 font-semibold uppercase font-mono">
                    <Thermometer className="w-3 h-3 text-[#1E8E63]" />
                    <span>Vault Temp</span>
                  </div>
                  <div className="font-bold text-sm text-[#12372A] font-mono mt-0.5">21.5°C</div>
                  <div className="text-[9px] text-[#1E8E63] font-semibold">Optimal for Silk/Tech</div>
                </div>

                <div className="bg-[#F7F5EF] p-2.5 rounded-2xl border border-[#12372A]/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#202923]/60 font-semibold uppercase font-mono">
                    <Droplets className="w-3 h-3 text-[#1E8E63]" />
                    <span>Humidity</span>
                  </div>
                  <div className="font-bold text-sm text-[#12372A] font-mono mt-0.5">46% RH</div>
                  <div className="text-[9px] text-[#1E8E63] font-semibold">Silk Protected</div>
                </div>

                <div className="bg-[#F7F5EF] p-2.5 rounded-2xl border border-[#12372A]/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#202923]/60 font-semibold uppercase font-mono">
                    <Users className="w-3 h-3 text-[#1E8E63]" />
                    <span>Staff Active</span>
                  </div>
                  <div className="font-bold text-sm text-[#12372A] font-mono mt-0.5">{selectedWh.workersCount} Crew</div>
                  <div className="text-[9px] text-[#202923]/70 font-semibold">Tier 1 & 2 Leads</div>
                </div>
              </div>

              {/* Dock Doors Live Status */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#12372A]">
                  <span>Loading Dock Bays</span>
                  <span className="font-mono text-[11px] text-[#1E8E63]">3 of 4 Active</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="bg-[#E5EEE5] border border-[#1E8E63]/30 p-1.5 rounded-xl text-center">
                    <div className="text-[9px] font-mono font-bold text-[#12372A]">Dock 01</div>
                    <div className="text-[9px] text-[#1E8E63] font-semibold">Air Express</div>
                  </div>
                  <div className="bg-[#E5EEE5] border border-[#1E8E63]/30 p-1.5 rounded-xl text-center">
                    <div className="text-[9px] font-mono font-bold text-[#12372A]">Dock 02</div>
                    <div className="text-[9px] text-[#1E8E63] font-semibold">Apparel Hub</div>
                  </div>
                  <div className="bg-[#E5EEE5] border border-[#1E8E63]/30 p-1.5 rounded-xl text-center">
                    <div className="text-[9px] font-mono font-bold text-[#12372A]">Dock 03</div>
                    <div className="text-[9px] text-[#1E8E63] font-semibold">Tech Pallet</div>
                  </div>
                  <div className="bg-white border border-[#12372A]/10 p-1.5 rounded-xl text-center opacity-60">
                    <div className="text-[9px] font-mono font-bold text-[#202923]">Dock 04</div>
                    <div className="text-[9px] text-[#202923]/60">Available</div>
                  </div>
                </div>
              </div>

              {/* Live Inventory Preview in this Warehouse */}
              <div className="space-y-2 pt-2 border-t border-[#E5EEE5]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#12372A]">Stored Stock at Node</span>
                  <span className="font-mono text-[11px] text-[#1E8E63] font-bold">
                    {totalStockInHub} Total Units
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedWhInventory.slice(0, 4).map((item) => (
                    <div
                      key={item.sku}
                      className="p-2 bg-[#F7F5EF] rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0">
                          <img
                            src={getProductImage(item.sku)}
                            alt={item.sku}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-xs text-[#12372A]">{item.sku}</div>
                          <div className="text-[10px] text-[#202923]/70 font-mono">Bin {item.binLocation}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="font-bold text-xs text-[#1E8E63]">{item.available} Avail</div>
                        <div className="text-[10px] text-[#202923]/60">{item.onHand} On Hand</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setActiveWarehouseId(selectedWh.id);
                    setCurrentView('inventory');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Boxes className="w-3.5 h-3.5 text-[#A7D46F]" />
                  <span>Inspect Hub Inventory</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Live Transit Shuttles Feed */}
          <div className="bg-white rounded-3xl border border-[#E5EEE5] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#1E8E63]" />
                <h4 className="font-bold text-xs uppercase font-mono text-[#12372A]">
                  Active In-Transit Shuttles ({filteredVehicles.length})
                </h4>
              </div>
              <span className="text-[10px] text-[#1E8E63] font-semibold">Live GPS Active</span>
            </div>

            <div className="space-y-2.5">
              {filteredVehicles.map((veh) => (
                <div
                  key={veh.id}
                  className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#12372A]/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#12372A] text-white flex items-center justify-center font-bold text-xs">
                        {veh.type === 'AIR' ? <Plane className="w-3.5 h-3.5 text-[#A7D46F]" /> : <Truck className="w-3.5 h-3.5 text-[#A7D46F]" />}
                      </span>
                      <div>
                        <div className="font-mono font-bold text-xs text-[#12372A]">{veh.code}</div>
                        <div className="text-[10px] text-[#202923]/70">{veh.carrier}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1E8E63]/15 text-[#1E8E63] border border-[#1E8E63]/30">
                      ETA {veh.eta}
                    </span>
                  </div>

                  <div className="text-xs text-[#202923]/80 flex items-center justify-between">
                    <span>{veh.fromName} → <strong>{veh.toName}</strong></span>
                    <span className="font-mono text-[11px] font-bold text-[#12372A]">
                      {veh.units}× {veh.sku}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#12372A]/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#1E8E63] h-full rounded-full transition-all duration-500"
                      style={{ width: `${veh.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
