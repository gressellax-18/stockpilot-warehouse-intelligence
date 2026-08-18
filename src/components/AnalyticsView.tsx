import React from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Activity,
  TrendingUp,
  Clock,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { workers, orders } = useWarehouse();

  const stageBreakdownData = [
    { name: 'Validation', minutes: 2, percentage: 5, color: '#1E8E63' },
    { name: 'Allocation', minutes: 1, percentage: 2, color: '#A7D46F' },
    { name: 'Picking (Bottleneck)', minutes: 24, percentage: 53, color: '#F26B5B' },
    { name: 'Packing', minutes: 7, percentage: 16, color: '#F3B562' },
    { name: 'Quality Check', minutes: 4, percentage: 9, color: '#12372A' },
    { name: 'Dispatch & Staging', minutes: 7, percentage: 15, color: '#202923' },
  ];

  const throughputData = [
    { hour: '08:00', orders: 18, target: 20 },
    { hour: '10:00', orders: 34, target: 30 },
    { hour: '12:00', orders: 48, target: 40 },
    { hour: '14:00', orders: 52, target: 45 },
    { hour: '16:00', orders: 46, target: 40 },
    { hour: '18:00', orders: 28, target: 25 },
  ];

  const pickerProductivityData = workers
    .filter((w) => w.role === 'PICKER')
    .map((w) => ({
      name: w.name.split(' ')[0],
      picksPerHour: w.picksPerHour,
      accuracy: w.accuracyRate,
    }));

  const slaAdherenceData = [
    { day: 'Mon', onTime: 97.8, slaTarget: 98.0 },
    { day: 'Tue', onTime: 98.4, slaTarget: 98.0 },
    { day: 'Wed', onTime: 96.9, slaTarget: 98.0 },
    { day: 'Thu', onTime: 99.1, slaTarget: 98.0 },
    { day: 'Fri', onTime: 98.8, slaTarget: 98.0 },
    { day: 'Sat', onTime: 99.4, slaTarget: 98.0 },
    { day: 'Today', onTime: 98.5, slaTarget: 98.0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#12372A] tracking-tight">
          Decision Intelligence & Operational Bottlenecks
        </h2>
        <p className="text-xs text-[#202923]/70">
          Root cause analysis, warehouse cycle breakdown, and picker productivity telemetry.
        </p>
      </div>

      {/* 🔴 WHERE IS THE WAREHOUSE LOSING TIME? (SPECIAL EMPHASIS) */}
      <section className="bg-white rounded-2xl border-2 border-[#F26B5B]/30 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5EEE5]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#F26B5B]/15 text-[#F26B5B] flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-[#12372A]">
                Where is the Warehouse Losing Time? (Cycle Breakdown)
              </h3>
              <p className="text-xs text-[#202923]/60">Total Average Cycle Time: 45 Minutes</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#F26B5B] text-white">
            PICKING = 53% BOTTLENECK
          </span>
        </div>

        {/* Visual Progress Ratio Bar */}
        <div className="space-y-1">
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-gray-100 shadow-inner">
            {stageBreakdownData.map((stage) => (
              <div
                key={stage.name}
                className="h-full relative group cursor-pointer transition"
                style={{ width: `${stage.percentage}%`, backgroundColor: stage.color }}
                title={`${stage.name}: ${stage.minutes}m (${stage.percentage}%)`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 text-xs">
            {stageBreakdownData.map((stage) => (
              <div key={stage.name} className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#12372A]/10 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#12372A]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="truncate">{stage.name}</span>
                </div>
                <div className="font-mono text-sm font-bold text-[#12372A]">{stage.minutes} Min</div>
                <div className="text-[10px] text-[#202923]/60">{stage.percentage}% of cycle</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#E5EEE5] p-3.5 rounded-xl border border-[#1E8E63]/30 text-xs flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-[#1E8E63] flex-shrink-0 mt-0.5" />
          <p className="text-[#12372A]">
            <strong>Automated Improvement Plan:</strong> Deploying StockPilot's Wave Route sequencing
            in Zone A will reduce picker search latency from 24 min down to 16 min, saving ~18% in total cycle time.
          </p>
        </div>
      </section>

      {/* 2-Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Order Velocity */}
        <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#12372A]">Hourly Fulfillment Throughput</h3>
            <span className="text-[10px] font-mono text-[#1E8E63] font-bold">Peak: 52 Orders / Hr</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5EEE5" />
                <XAxis dataKey="hour" stroke="#202923" fontSize={11} />
                <YAxis stroke="#202923" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12372A',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="orders" stroke="#1E8E63" fill="#A7D46F" fillOpacity={0.4} />
                <Line type="monotone" dataKey="target" stroke="#12372A" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Adherence Curve */}
        <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#12372A]">7-Day SLA Adherence (%)</h3>
            <span className="text-[10px] font-mono text-[#1E8E63] font-bold">Current: 98.5%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slaAdherenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5EEE5" />
                <XAxis dataKey="day" stroke="#202923" fontSize={11} />
                <YAxis domain={[95, 100]} stroke="#202923" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12372A',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="onTime" stroke="#1E8E63" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="slaTarget" stroke="#F26B5B" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Picker Productivity Telemetry */}
      <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 space-y-4 shadow-xs">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#12372A]">Picker Performance & Accuracy Telemetry</h3>
          <span className="text-[10px] font-mono text-[#202923]/60">Target: &gt; 40 Picks/Hour</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {workers
            .filter((w) => w.role === 'PICKER')
            .map((picker) => (
              <div key={picker.id} className="p-4 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#12372A]">{picker.name}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#12372A] text-white">
                    {picker.stationOrZone}
                  </span>
                </div>
                <div className="flex justify-between text-[#202923]/70 font-mono">
                  <span>Speed:</span>
                  <strong className="text-[#1E8E63]">{picker.picksPerHour} picks/hr</strong>
                </div>
                <div className="flex justify-between text-[#202923]/70 font-mono">
                  <span>Accuracy:</span>
                  <strong className="text-[#12372A]">{picker.accuracyRate}%</strong>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
