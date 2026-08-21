import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  Cpu, 
  TrendingUp, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Route, 
  Radio, 
  ShieldCheck, 
  Layers, 
  Search, 
  ArrowUpRight, 
  Download, 
  Zap, 
  Thermometer, 
  Activity, 
  PackageCheck, 
  Clock, 
  Bot, 
  X,
  FileText,
  Sliders,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, CompletedTransaction, WarehouseZone, WarehouseLog, StockForecastItem } from '../types';
import { SafeImage } from './SafeImage';

interface StockPilotWarehouseProps {
  products: Product[];
  transactions: CompletedTransaction[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onRestockAllLow: () => void;
  onRecordTransaction: (tx: CompletedTransaction) => void;
}

const INITIAL_ZONES: WarehouseZone[] = [
  {
    id: 'zone-a',
    code: 'ZONE-A',
    name: 'Tech & Smartphone High-Density Bay',
    department: 'mobile',
    capacityPct: 88,
    temperature: '21.5°C',
    aislesCount: 12,
    activeRobots: 4,
    assignedSkusCount: 8,
    color: 'indigo',
    status: 'Optimal'
  },
  {
    id: 'zone-b',
    code: 'ZONE-B',
    name: 'Apparel & Hanging Garment Racks',
    department: 'fashion',
    capacityPct: 74,
    temperature: '22.0°C',
    aislesCount: 16,
    activeRobots: 3,
    assignedSkusCount: 8,
    color: 'rose',
    status: 'Optimal'
  },
  {
    id: 'zone-c',
    code: 'ZONE-C',
    name: 'Heavy Electronics & Audio Staging',
    department: 'electronics',
    capacityPct: 91,
    temperature: '20.8°C',
    aislesCount: 10,
    activeRobots: 5,
    assignedSkusCount: 8,
    color: 'cyan',
    status: 'High Density'
  },
  {
    id: 'zone-d',
    code: 'ZONE-D',
    name: 'Travel Luggage & Oversize Stacking',
    department: 'travel',
    capacityPct: 68,
    temperature: '21.0°C',
    aislesCount: 8,
    activeRobots: 2,
    assignedSkusCount: 8,
    color: 'amber',
    status: 'Optimal'
  },
  {
    id: 'zone-e',
    code: 'ZONE-E',
    name: 'Kitchen & Precision Cookware Vault',
    department: 'home-kitchen',
    capacityPct: 82,
    temperature: '21.2°C',
    aislesCount: 10,
    activeRobots: 3,
    assignedSkusCount: 8,
    color: 'emerald',
    status: 'Optimal'
  },
  {
    id: 'zone-f',
    code: 'ZONE-F',
    name: 'Fresh Groceries & Climate Pantry (Cold Chain)',
    department: 'everyday-needs',
    capacityPct: 79,
    temperature: '14.2°C',
    aislesCount: 8,
    activeRobots: 3,
    assignedSkusCount: 8,
    color: 'lime',
    status: 'Cooling Active'
  },
  {
    id: 'zone-g',
    code: 'ZONE-G',
    name: 'Kids Toys & STEM Robotic Bins',
    department: 'kids-toys',
    capacityPct: 71,
    temperature: '21.8°C',
    aislesCount: 14,
    activeRobots: 4,
    assignedSkusCount: 8,
    color: 'purple',
    status: 'Optimal'
  }
];

const INITIAL_LOGS: WarehouseLog[] = [
  {
    id: 'log-1',
    timestamp: '2 mins ago',
    type: 'RFID_SCAN',
    message: 'Automated AGV-04 verified pallet SKU ELC-SONIC-ANC in Aisle C-04',
    zone: 'ZONE-C',
    sku: 'ELC-SONIC-ANC',
    operator: 'AGV-Robot-04'
  },
  {
    id: 'log-2',
    timestamp: '14 mins ago',
    type: 'DISPATCH',
    message: 'Express order batch loaded onto Outbound Bay 03 (FedEx Air)',
    zone: 'DOCK-OUT-3',
    operator: 'Marcus Vance'
  },
  {
    id: 'log-3',
    timestamp: '32 mins ago',
    type: 'AI_OPTIMIZE',
    message: 'StockPilot AI dynamically re-routed pick path: -32% travel distance for 4 orders',
    zone: 'WAREHOUSE-CORE',
    operator: 'StockPilot AI Engine'
  },
  {
    id: 'log-4',
    timestamp: '1 hour ago',
    type: 'INBOUND',
    message: 'Received 120 units from Supplier TechLogistics Inc. via Inbound Bay 01',
    zone: 'DOCK-IN-1',
    sku: 'MOB-AERO-5G',
    operator: 'Elena Rostova'
  },
  {
    id: 'log-5',
    timestamp: '2 hours ago',
    type: 'TEMP_ALERT',
    message: 'Cold chain Zone F sensor reading 14.2°C - Normalizing airflow compressor',
    zone: 'ZONE-F',
    operator: 'IoT Telemetry Mesh'
  }
];

export const StockPilotWarehouse: React.FC<StockPilotWarehouseProps> = ({
  products,
  transactions,
  onUpdateStock,
  onRestockAllLow,
  onRecordTransaction
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'forecaster' | 'pickroute' | 'activity' | 'inbound'>('matrix');
  const [selectedZone, setSelectedZone] = useState<WarehouseZone | null>(null);
  const [logs, setLogs] = useState<WarehouseLog[]>(INITIAL_LOGS);
  const [isSimulatingInbound, setIsSimulatingInbound] = useState(false);
  const [simulatedRobotProgress, setSimulatedRobotProgress] = useState(0);
  const [activePickStep, setActivePickStep] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const showBannerNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Compute AI Stock Forecasting based on live products
  const stockForecasts: StockForecastItem[] = useMemo(() => {
    return products.map((product) => {
      // Estimated daily velocity derived from reviewsCount & rating
      const dailyVelocity = Math.max(1, Math.round((product.reviewsCount / 90) + (product.isBestSeller ? 3 : 1)));
      const daysRemaining = Math.max(0, Math.floor(product.stockCount / dailyVelocity));
      
      let urgency: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'SURPLUS' = 'HEALTHY';
      if (product.stockCount === 0 || daysRemaining <= 2) {
        urgency = 'CRITICAL';
      } else if (daysRemaining <= 6 || product.stockCount <= 10) {
        urgency = 'WARNING';
      } else if (daysRemaining > 30) {
        urgency = 'SURPLUS';
      }

      const recommendedReorder = urgency === 'CRITICAL' ? 45 : urgency === 'WARNING' ? 25 : 0;
      const leadTimeDays = product.department === 'everyday-needs' ? 2 : product.department === 'mobile' ? 3 : 4;

      return {
        productId: product.id,
        sku: product.sku,
        title: product.title,
        department: product.department,
        currentStock: product.stockCount,
        dailyVelocity,
        daysRemaining,
        urgency,
        recommendedReorder,
        leadTimeDays
      };
    });
  }, [products]);

  // Key metrics calculation
  const totalStockUnits = products.reduce((sum, p) => sum + p.stockCount, 0);
  const totalValuation = products.reduce((sum, p) => sum + p.price * p.stockCount, 0);
  const criticalItems = stockForecasts.filter(f => f.urgency === 'CRITICAL');
  const warningItems = stockForecasts.filter(f => f.urgency === 'WARNING');
  const totalActiveRobots = INITIAL_ZONES.reduce((s, z) => s + z.activeRobots, 0);

  // Trigger Inbound Manifest Simulation
  const handleSimulateInboundManifest = () => {
    setIsSimulatingInbound(true);
    setSimulatedRobotProgress(15);

    setTimeout(() => setSimulatedRobotProgress(45), 400);
    setTimeout(() => setSimulatedRobotProgress(80), 800);

    setTimeout(() => {
      // Pick 3 low-stock items and add 30 units each
      const lowItems = products.filter(p => p.stockCount < 25).slice(0, 3);
      if (lowItems.length > 0) {
        lowItems.forEach(item => {
          onUpdateStock(item.id, item.stockCount + 30);
        });
      } else if (products[0]) {
        onUpdateStock(products[0].id, products[0].stockCount + 20);
      }

      const newLog: WarehouseLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        type: 'INBOUND',
        message: `Freight Inbound Manifest #INB-${Math.floor(1000 + Math.random() * 9000)} docked: 90 units received & slotted by AGVs`,
        zone: 'DOCK-IN-02',
        operator: 'StockPilot Autonomous Ingestion'
      };

      setLogs(prev => [newLog, ...prev]);
      setIsSimulatingInbound(false);
      setSimulatedRobotProgress(0);

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.5 }
      });

      showBannerNotice('Inbound container successfully slotted into warehouse racks!');
    }, 1200);
  };

  // Run AI Rebalancing
  const handleRunAiRebalancing = () => {
    onRestockAllLow();
    const newLog: WarehouseLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      type: 'AI_OPTIMIZE',
      message: 'Executed Automated Aisle Rebalancing: safety stock restored across all critical SKUs',
      zone: 'WAREHOUSE-ALL',
      operator: 'StockPilot AI Autopilot'
    };
    setLogs(prev => [newLog, ...prev]);
    showBannerNotice('StockPilot AI rebalanced inventory levels across all 7 warehouse zones!');
  };

  // Export WMS Manifest
  const handleExportWms = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "SKU,Product,Department,Stock,Velocity,DaysRemaining,Urgency,ReorderRecommended\n" +
      stockForecasts.map(f => `"${f.sku}","${f.title.replace(/"/g, '""')}","${f.department}",${f.currentStock},${f.dailyVelocity},${f.daysRemaining},"${f.urgency}",${f.recommendedReorder}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `StockPilot_Warehouse_Manifest_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showBannerNotice('Exported StockPilot Warehouse WMS Report (CSV)');
  };

  // Filtered forecasts
  const filteredForecasts = stockForecasts.filter(f => 
    f.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    f.sku.toLowerCase().includes(searchFilter.toLowerCase()) ||
    f.department.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-[85vh] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      
      {/* Top Banner Notice */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-3 rounded-2xl shadow-2xl border border-indigo-400 flex items-center space-x-2 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cockpit Header */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            {/* Title & Facility Meta */}
            <div>
              <div className="flex items-center space-x-2.5 mb-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 text-xs font-bold flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>StockPilot AI v4.8 Engine</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Telemetry Live • 99.9% Optimal</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-serif">
                StockPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">Warehouse Intelligence</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Central Autonomous Fulfillment Hub • Zone Mapping • Predictive Stockout Forecasting • AGV Pick-Path Optimization.
              </p>
            </div>

            {/* Quick Master Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="stockpilot-inbound-btn"
                onClick={handleSimulateInboundManifest}
                disabled={isSimulatingInbound}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
              >
                {isSimulatingInbound ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Inbound Ingestion ({simulatedRobotProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-3.5 h-3.5" />
                    <span>Simulate Inbound PO</span>
                  </>
                )}
              </button>

              <button
                id="stockpilot-rebalance-btn"
                onClick={handleRunAiRebalancing}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Auto-Rebalance Stock</span>
              </button>

              <button
                onClick={handleExportWms}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                title="Export WMS Manifest CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>

          </div>

          {/* Telemetry Stat Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                <Boxes className="w-3 h-3 text-indigo-400" />
                <span>Total Stored Units</span>
              </span>
              <div className="text-lg font-black text-white mt-1 font-mono">{totalStockUnits.toLocaleString()}</div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>Warehouse Valuation</span>
              </span>
              <div className="text-lg font-black text-emerald-400 mt-1 font-mono">${totalValuation.toLocaleString()}</div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                <Bot className="w-3 h-3 text-cyan-400" />
                <span>Autonomous AGVs</span>
              </span>
              <div className="text-lg font-black text-cyan-300 mt-1 font-mono">{totalActiveRobots} Online</div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Critical Stockout</span>
              </span>
              <div className="text-lg font-black text-rose-400 mt-1 font-mono">{criticalItems.length} SKUs</div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>Facility Temp Mesh</span>
              </span>
              <div className="text-lg font-black text-amber-300 mt-1 font-mono">20.4°C Avg</div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                <PackageCheck className="w-3 h-3 text-violet-400" />
                <span>Fulfillment Rate</span>
              </span>
              <div className="text-lg font-black text-violet-300 mt-1 font-mono">99.8% SLA</div>
            </div>
          </div>
        </div>

        {/* View Switcher Sub-Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 p-2 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Zone & Aisle Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('forecaster')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'forecaster'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>AI Stockout Forecaster</span>
              {criticalItems.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {criticalItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pickroute')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'pickroute'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>Pick-Path Optimizer</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live RFID & Events</span>
            </button>

            <button
              onClick={() => setActiveTab('inbound')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'inbound'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Inbound Receiving</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2 px-3 py-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Facility ID: WH-PILOT-CENTRAL-01</span>
          </div>
        </div>

        {/* --- TAB 1: ZONE & AISLE MATRIX --- */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            
            {/* Interactive Zones Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {INITIAL_ZONES.map((zone) => {
                const zoneProducts = products.filter(p => p.department === zone.department);
                const zoneUnits = zoneProducts.reduce((s, p) => s + p.stockCount, 0);

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 hover:border-indigo-500/60 hover:bg-slate-900 transition-all cursor-pointer group relative overflow-hidden shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {zone.code}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1.5 group-hover:text-indigo-300 transition-colors">
                          {zone.name}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        zone.status === 'Optimal'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : zone.status === 'Cooling Active'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {zone.status}
                      </span>
                    </div>

                    {/* Capacity bar */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Rack Storage Density</span>
                        <span className="font-mono font-bold text-white">{zone.capacityPct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            zone.capacityPct > 85
                              ? 'bg-amber-500'
                              : 'bg-gradient-to-r from-indigo-500 to-emerald-500'
                          }`}
                          style={{ width: `${zone.capacityPct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Zone Meta Pills */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block">Aisles</span>
                        <strong className="text-slate-200">{zone.aislesCount} Units</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Robots</span>
                        <strong className="text-cyan-400">{zone.activeRobots} AGVs</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Units</span>
                        <strong className="text-emerald-400">{zoneUnits}</strong>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-400 font-semibold pt-2 border-t border-slate-800/60">
                      <span>Inspect {zoneProducts.length} Assigned SKUs</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}

              {/* Inbound / Outbound Docks Overview Tile */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/70 rounded-2xl border border-indigo-500/30 p-5 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center space-x-1.5 text-indigo-400 mb-2">
                    <Truck className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">Dock Doors Status</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Automated Cross-Dock Bays</h3>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-300">Inbound Bay 01:</span>
                      <span className="text-emerald-400 font-bold font-mono">Unloading (DHL)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-300">Inbound Bay 02:</span>
                      <span className="text-slate-400 font-mono">Available (Ready)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-300">Outbound Bay 03:</span>
                      <span className="text-indigo-400 font-bold font-mono">Dispatching (FedEx)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('inbound')}
                  className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Manage Dock Receiving
                </button>
              </div>
            </div>

            {/* Warehouse Visual Heatmap Schematic */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Route className="w-4 h-4 text-indigo-400" />
                    <span>Real-Time Facility Floor Plan & AGV Mesh</span>
                  </h3>
                  <p className="text-xs text-slate-400">Live coordinates of autonomous stock conveyors and high-velocity picking aisles</p>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>High Velocity</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <span>Standard Bay</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>Active AGV Bot</span>
                  </span>
                </div>
              </div>

              {/* Blueprint Layout Grid */}
              <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 border border-slate-800/80 font-mono text-[11px]">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                  {INITIAL_ZONES.map((z, idx) => (
                    <div
                      key={z.id}
                      onClick={() => setSelectedZone(z)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-400 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between min-h-[110px]"
                    >
                      <div className="text-[10px] font-bold text-indigo-400">{z.code}</div>
                      <div className="text-xs font-bold text-white my-1">{z.department.toUpperCase()}</div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${z.capacityPct}%` }}></div>
                      </div>
                      <div className="text-[10px] text-cyan-300 mt-1 flex items-center justify-center space-x-1">
                        <Bot className="w-2.5 h-2.5" />
                        <span>AGV-0{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: AI STOCKOUT FORECASTER --- */}
        {activeTab === 'forecaster' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search forecasting by SKU, product name, or department..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Filter Urgency:</span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold">
                  {criticalItems.length} Critical Stockouts
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold">
                  {warningItems.length} Reorder Warnings
                </span>
              </div>
            </div>

            {/* Forecast Table */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-4">SKU / Product</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Sales Velocity</th>
                      <th className="p-4">Run-Out Projection</th>
                      <th className="p-4">AI Recommended PO</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredForecasts.map((item) => {
                      return (
                        <tr key={item.productId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="font-mono text-[11px] text-indigo-400 font-bold">{item.sku}</div>
                            <div className="font-bold text-white truncate max-w-xs">{item.title}</div>
                          </td>
                          <td className="p-4">
                            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                              {item.department.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold">
                            <span className={item.currentStock <= 5 ? 'text-rose-400' : 'text-slate-200'}>
                              {item.currentStock} Units
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-300">
                            ~{item.dailyVelocity} units/day
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.urgency === 'CRITICAL'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : item.urgency === 'WARNING'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {item.daysRemaining === 0 ? 'Depleted' : `${item.daysRemaining} days left`}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-mono">
                            {item.recommendedReorder > 0 ? (
                              <span className="text-indigo-400 font-bold">+{item.recommendedReorder} Units (Lead {item.leadTimeDays}d)</span>
                            ) : (
                              <span className="text-slate-500">Optimum Level</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {item.recommendedReorder > 0 ? (
                              <button
                                onClick={() => {
                                  onUpdateStock(item.productId, item.currentStock + item.recommendedReorder);
                                  showBannerNotice(`Restocked +${item.recommendedReorder} units for SKU ${item.sku}`);
                                }}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                              >
                                Reorder Batch
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Balanced</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: SMART PICK-PATH OPTIMIZER --- */}
        {activeTab === 'pickroute' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Algorithmic Batch Fulfillment
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  AI Pick-Path Travel Optimizer (TSP Heuristic)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculates shortest Euclidean traversal across warehouse racks to maximize picks per hour.
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Travel Reduction</span>
                  <span className="text-emerald-400 font-bold">-38.4% Distance</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-slate-500 block text-[10px]">Batch SLA Time</span>
                  <span className="text-cyan-300 font-bold">4.2 Mins Total</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Simulated Route */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Active Batch Route #PK-8842 (Autonomous AGV-02 + Picker Team)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: 1, zone: 'ZONE-A (Tech)', aisle: 'Aisle A-02 / Shelf 4B', sku: 'MOB-AERO-5G', item: 'Aero Ultra 5G Smartphone', qty: 2, status: 'Completed' },
                  { step: 2, zone: 'ZONE-C (Audio)', aisle: 'Aisle C-05 / Shelf 1A', sku: 'ELC-SONIC-ANC', item: 'Active Noise Cancelling Headphones', qty: 1, status: 'In Progress' },
                  { step: 3, zone: 'ZONE-E (Kitchen)', aisle: 'Aisle E-08 / Shelf 3C', sku: 'HM-CAFFE-ESP', item: 'Italian 15-Bar Espresso Machine', qty: 1, status: 'Queued' },
                  { step: 4, zone: 'DOCK-OUT-03', aisle: 'Conveyor Staging Spiral', sku: 'PACK-FINAL', item: 'Packaging & Automated Seal', qty: 4, status: 'Final Destination' }
                ].map((s) => (
                  <div
                    key={s.step}
                    onClick={() => setActivePickStep(s.step)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      activePickStep === s.step
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                        {s.step}
                      </span>
                      <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">
                        {s.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs mb-1 truncate">{s.item}</div>
                    <div className="font-mono text-[10px] text-slate-400">{s.aisle}</div>
                    <div className="mt-2 text-[10px] text-indigo-300 font-mono flex justify-between">
                      <span>SKU: {s.sku}</span>
                      <span>Qty: {s.qty}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>AGV Robotic Carrier #02 is locking onto coordinates for Step {activePickStep}</span>
                </div>
                <button
                  onClick={() => {
                    setActivePickStep(prev => prev < 4 ? prev + 1 : 1);
                    showBannerNotice('Verified RFID scan & proceeded to next waypoint!');
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                >
                  Simulate RFID Scan & Advance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: LIVE RFID & TELEMETRY STREAM --- */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h3 className="text-base font-bold text-white">Live Facility Activity & RFID Log</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Telemetry Sampling: 100ms</span>
              </div>

              <div className="space-y-2 divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <div key={log.id} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                    <div className="flex items-start space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold mt-0.5 ${
                        log.type === 'DISPATCH'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : log.type === 'INBOUND'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : log.type === 'AI_OPTIMIZE'
                          ? 'bg-violet-500/20 text-violet-300'
                          : log.type === 'TEMP_ALERT'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {log.type}
                      </span>
                      <div>
                        <div className="text-slate-200 font-medium">{log.message}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Zone: <strong className="text-slate-400">{log.zone}</strong> • Handler: {log.operator}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-4">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 5: INBOUND RECEIVING & PURCHASE ORDERS --- */}
        {activeTab === 'inbound' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <span>Inbound Freight Receiving & Cross-Dock Sliders</span>
                </h3>
                <p className="text-xs text-slate-400">Manage incoming supplier consignments and auto-slot them into warehouse bays.</p>
              </div>

              <button
                onClick={handleSimulateInboundManifest}
                disabled={isSimulatingInbound}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Receive Arrived Container</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">PO #PO-9021 • In Transit</span>
                <h4 className="font-bold text-white">Apex Supplier Hub (Tech & Gadgets)</h4>
                <p className="text-slate-400 text-[11px]">Consignment of 180 units (Aero 5G, ANC Headphones, Smart Watches)</p>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-mono text-[10px] text-slate-400">
                  <span>Carrier: DHL Freight</span>
                  <span>ETA: Today 14:00</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">PO #PO-9022 • Docked Bay 01</span>
                <h4 className="font-bold text-white">Nordic Threads Global (Apparel)</h4>
                <p className="text-slate-400 text-[11px]">Consignment of 95 units (Wool Overcoats, Organic Hoodies)</p>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-mono text-[10px] text-slate-400">
                  <span>Carrier: FedEx Express</span>
                  <span>Status: Scanning</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">PO #PO-9023 • Scheduled</span>
                <h4 className="font-bold text-white">PureMeadow & Olympian Groceries</h4>
                <p className="text-slate-400 text-[11px]">Consignment of 120 units (Raw Honey, Cold-Pressed Olive Oil)</p>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-mono text-[10px] text-slate-400">
                  <span>Carrier: BlueDart Cold</span>
                  <span>ETA: Tomorrow 09:30</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ZONE DETAIL INSPECTOR MODAL */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-700 p-6 sm:p-8 text-white">
            <button
              onClick={() => setSelectedZone(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
                {selectedZone.code}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">{selectedZone.status}</span>
            </div>

            <h2 className="text-xl font-bold mb-1">{selectedZone.name}</h2>
            <p className="text-xs text-slate-400 mb-6">
              Department: <strong className="text-slate-200 capitalize">{selectedZone.department.replace('-', ' ')}</strong> • Capacity: {selectedZone.capacityPct}% • Temp: {selectedZone.temperature}
            </p>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Assigned Product SKUs & Live Stock:
              </h4>

              {products.filter(p => p.department === selectedZone.department).map(prod => (
                <div key={prod.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                      <SafeImage
                        src={prod.image}
                        alt={prod.title}
                        aspectRatio="aspect-square"
                        fallbackCategory={prod.category}
                      />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-white truncate">{prod.title}</div>
                      <div className="font-mono text-[10px] text-slate-400">SKU: {prod.sku} • Price: ${prod.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right font-mono">
                      <span className={`font-bold ${prod.stockCount <= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {prod.stockCount} in stock
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onUpdateStock(prod.id, Math.max(0, prod.stockCount - 5))}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold cursor-pointer"
                        title="Pick 5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => onUpdateStock(prod.id, prod.stockCount + 10)}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold cursor-pointer"
                        title="Restock 10"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedZone(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
