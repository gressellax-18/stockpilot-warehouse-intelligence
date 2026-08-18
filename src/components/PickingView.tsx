import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ScanLine,
  User,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const PickingView: React.FC = () => {
  const {
    pickTasks,
    workers,
    orders,
    scanPickItem,
    reportMissingInPick,
    reportDamageInPick,
    assignWorkerToPickTask,
    setCurrentView,
  } = useWarehouse();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(pickTasks[0]?.id || 'PT-8821');
  const [missingModalOpen, setMissingModalOpen] = useState(false);
  const [damagedModalOpen, setDamagedModalOpen] = useState(false);
  const [missingCount, setMissingCount] = useState(1);
  const [damagedCount, setDamagedCount] = useState(1);

  const currentTask = pickTasks.find((t) => t.id === selectedTaskId) || pickTasks[0];
  const relatedOrder = orders.find((o) => o.id === currentTask?.orderId);
  const availablePickers = workers.filter((w) => w.role === 'PICKER');

  const handleScan = (sku: string) => {
    if (currentTask) {
      scanPickItem(currentTask.id, sku);
    }
  };

  const handleReportMissing = () => {
    if (currentTask) {
      reportMissingInPick(currentTask.id, currentTask.items[0]?.sku || 'SKU-421', missingCount);
      setMissingModalOpen(false);
      setCurrentView('exceptions');
    }
  };

  const handleReportDamaged = () => {
    if (currentTask) {
      reportDamageInPick(currentTask.id, currentTask.items[0]?.sku || 'SKU-421', damagedCount);
      setDamagedModalOpen(false);
      setCurrentView('exceptions');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12372A] tracking-tight">
            Smart Picking & Aisle Trajectory Optimization
          </h2>
          <p className="text-xs text-[#202923]/70">
            Automated wave routing saves 31% warehouse walking distance with live scanner verification.
          </p>
        </div>

        {/* Efficiency banner */}
        <div className="bg-[#E5EEE5] px-3.5 py-1.5 rounded-xl border border-[#1E8E63]/30 flex items-center gap-2 text-xs font-semibold text-[#12372A]">
          <Sparkles className="w-4 h-4 text-[#1E8E63]" />
          <span>Optimal Route Active: 98m Walk (Saved 44m)</span>
        </div>
      </div>

      {/* Main 2-Column Layout: Left (Tasks & Scanner) + Right (Aisle Route Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tasks & Scanner Station (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Task Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pickTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  selectedTaskId === task.id
                    ? 'bg-[#12372A] text-white border-[#12372A] shadow-sm'
                    : 'bg-white text-[#202923]/70 border-[#E5EEE5] hover:bg-[#F7F5EF]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{task.id}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      task.status === 'COMPLETED'
                        ? 'bg-[#1E8E63] text-white'
                        : task.status === 'EXCEPTION'
                        ? 'bg-[#F26B5B] text-white'
                        : 'bg-[#A7D46F] text-[#12372A]'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {currentTask && (
            <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 space-y-4 shadow-xs">
              {/* Task Header info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5EEE5]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#12372A]">{currentTask.id}</span>
                    <span className="text-xs text-[#202923]/70">for Order #{currentTask.orderId}</span>
                    {relatedOrder?.customerType === 'VIP' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        👑 VIP SLA
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#202923]/60 mt-0.5">
                    Zone: <strong>{currentTask.zone}</strong> · Estimated: <strong>{currentTask.optimizedWalkingMeters}m Walk</strong>
                  </div>
                </div>

                {/* Worker Assignment Dropdown */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1E8E63]" />
                  <select
                    value={currentTask.assignedWorkerId}
                    onChange={(e) => assignWorkerToPickTask(currentTask.id, e.target.value)}
                    className="p-1.5 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 text-xs font-semibold text-[#12372A] focus:outline-none cursor-pointer"
                  >
                    {availablePickers.map((w) => (
                      <option key={w.id} value={w.id}>
                        Picker: {w.name} ({w.stationOrZone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interactive Scanner Box */}
              <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#12372A]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#12372A] flex items-center gap-1.5">
                    <ScanLine className="w-4 h-4 text-[#1E8E63]" />
                    <span>Live Barcode Scan Station</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E8E63]">
                    {currentTask.progressPercent}% Picked
                  </span>
                </div>

                {/* Pick items list */}
                <div className="space-y-2">
                  {currentTask.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-[#E5EEE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#12372A]">{item.sku}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#12372A] text-white">
                            Bin: {item.binLocation}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#202923]/70">{item.productName}</div>
                      </div>

                      {/* Scan Counter & Action */}
                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <div className="text-xs font-bold text-[#12372A]">
                            {item.quantityScanned} / {item.quantityRequested} Units
                          </div>
                          <div className="text-[10px] text-[#1E8E63]">
                            {item.quantityScanned >= item.quantityRequested ? 'Fully Scanned' : 'Pending Scan'}
                          </div>
                        </div>

                        <button
                          onClick={() => handleScan(item.sku)}
                          disabled={item.quantityScanned >= item.quantityRequested}
                          id={`btn-scan-sku-${item.sku}`}
                          className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                            item.quantityScanned >= item.quantityRequested
                              ? 'bg-[#E5EEE5] text-[#1E8E63] cursor-not-allowed'
                              : 'bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white shadow-sm'
                          }`}
                        >
                          <ScanLine className="w-3.5 h-3.5" />
                          <span>{item.quantityScanned >= item.quantityRequested ? 'Verified' : 'Scan Unit'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E5EEE5] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1E8E63] rounded-full transition-all duration-300"
                    style={{ width: `${currentTask.progressPercent}%` }}
                  />
                </div>

                {/* Physical Exception Triggers */}
                <div className="pt-2 border-t border-[#12372A]/10 flex flex-wrap gap-2 justify-between items-center text-xs">
                  <span className="text-[#202923]/70 font-medium">Physical discrepancy detected in aisle?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDamagedModalOpen(true)}
                      id="btn-report-damaged-item"
                      className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-red-50 border border-[#F26B5B]/30 text-[#F26B5B] font-bold text-[11px] flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report Damaged</span>
                    </button>

                    <button
                      onClick={() => setMissingModalOpen(true)}
                      id="btn-report-missing-item"
                      className="py-1.5 px-3 rounded-lg bg-[#F26B5B] hover:bg-[#F26B5B]/90 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Report Missing Unit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: "Where to Go" Visual Route & Pickers (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Visual Route Card */}
          <div className="bg-white rounded-2xl border border-[#E5EEE5] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#1E8E63]" />
                <h3 className="font-bold text-sm text-[#12372A]">Optimized Wave Waypoints</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#A7D46F] text-[#12372A] px-2 py-0.5 rounded">
                Saved 31% Walk
              </span>
            </div>

            {/* Visual Waypoint Stepper */}
            <div className="space-y-2">
              {[
                { name: 'START DOCK', desc: 'Picker Staging Station', done: true },
                { name: 'BIN A-01', desc: 'Optic Housing Units', done: true },
                { name: 'BIN A-03', desc: 'LiDAR Sensors (SKU-421)', done: true, highlight: true },
                { name: 'BIN A-07', desc: 'Cable Harness Assembly', done: false },
                { name: 'BIN A-12', desc: 'Micro Controllers (SKU-104)', done: false },
                { name: 'PACKING STATION 03', desc: 'Final Handover Bay', done: false },
              ].map((wp, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                    wp.highlight
                      ? 'bg-[#F7F5EF] border-[#F26B5B] ring-1 ring-[#F26B5B]/30'
                      : wp.done
                      ? 'bg-[#E5EEE5]/40 border-[#1E8E63]/30'
                      : 'bg-white border-[#E5EEE5] opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                        wp.done ? 'bg-[#1E8E63] text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-[#12372A] font-mono">{wp.name}</div>
                      <div className="text-[10px] text-[#202923]/60">{wp.desc}</div>
                    </div>
                  </div>
                  {wp.done ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1E8E63]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>

            {/* Walking Comparison */}
            <div className="p-3 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 text-xs space-y-1.5">
              <div className="flex justify-between text-[#202923]/70">
                <span>Standard Unoptimized Route:</span>
                <span className="line-through text-red-500 font-mono">142 meters</span>
              </div>
              <div className="flex justify-between font-bold text-[#12372A]">
                <span>StockPilot Dynamic Wave Route:</span>
                <span className="text-[#1E8E63] font-mono">98 meters (31% Saved)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Missing Item Modal */}
      {missingModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5EEE5] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#F26B5B]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-[#12372A]">Report Physical Missing Item</h3>
            </div>
            <p className="text-xs text-[#202923]/70 leading-relaxed">
              Picker discovered missing stock at Bin <strong>{currentTask?.items[0]?.binLocation || 'A-03'}</strong>.
              Submitting will automatically create a Control Tower exception and initiate multi-warehouse stock routing (e.g. Chennai C-12).
            </p>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#12372A]">Missing Units Count</label>
              <input
                type="number"
                min="1"
                max={currentTask?.items[0]?.quantityRequested || 7}
                value={missingCount}
                onChange={(e) => setMissingCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-mono font-bold focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMissingModalOpen(false)}
                className="py-2 px-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReportMissing}
                id="btn-confirm-report-missing"
                className="py-2 px-4 rounded-xl bg-[#F26B5B] text-white text-xs font-bold hover:bg-[#F26B5B]/90 shadow-sm"
              >
                Register Missing Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Damaged Item Modal */}
      {damagedModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5EEE5] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#F26B5B]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-[#12372A]">Report Damaged Stock</h3>
            </div>
            <p className="text-xs text-[#202923]/70 leading-relaxed">
              Quarantine physically damaged units to prevent defective parts from reaching customer assembly lines.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#12372A]">Damaged Units Count</label>
              <input
                type="number"
                min="1"
                max="10"
                value={damagedCount}
                onChange={(e) => setDamagedCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-mono font-bold focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDamagedModalOpen(false)}
                className="py-2 px-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReportDamaged}
                className="py-2 px-4 rounded-xl bg-[#F26B5B] text-white text-xs font-bold hover:bg-[#F26B5B]/90 shadow-sm"
              >
                Quarantine & Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
