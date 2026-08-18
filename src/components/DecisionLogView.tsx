import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  History,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  User,
  Bot,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Compass,
  DollarSign,
  Package,
  Layers,
  Search,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { getProductImage } from '../utils/productImages';

export const DecisionLogView: React.FC = () => {
  const { decisionLogs, orders, setSelectedOrderId, setCurrentView } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'DRESSES_SAREES' | 'SHOES' | 'WALLETS' | 'TECH'>('ALL');

  const isMatchCategory = (log: typeof decisionLogs[0], filter: 'ALL' | 'DRESSES_SAREES' | 'SHOES' | 'WALLETS' | 'TECH') => {
    if (filter === 'ALL') return true;
    const text = `${log.productName || ''} ${log.action || ''} ${log.reason || ''} ${log.sku || ''} ${log.customerName || ''}`.toLowerCase();
    if (filter === 'DRESSES_SAREES') {
      return (
        text.includes('saree') ||
        text.includes('sari') ||
        text.includes('dress') ||
        text.includes('gown') ||
        text.includes('lehenga') ||
        text.includes('couture') ||
        text.includes('silk') ||
        text.includes('zari') ||
        (log.sku && log.sku.startsWith('SKU-70'))
      );
    }
    if (filter === 'SHOES') {
      return (
        text.includes('shoe') ||
        text.includes('oxford') ||
        text.includes('running') ||
        text.includes('mojari') ||
        text.includes('heel') ||
        text.includes('footwear') ||
        text.includes('sneaker') ||
        (log.sku && log.sku.startsWith('SKU-72'))
      );
    }
    if (filter === 'WALLETS') {
      return (
        text.includes('wallet') ||
        text.includes('bag') ||
        text.includes('duffle') ||
        text.includes('tote') ||
        text.includes('leather') ||
        text.includes('crossbody') ||
        (log.sku && log.sku.startsWith('SKU-73'))
      );
    }
    if (filter === 'TECH') {
      return (
        text.includes('lidar') ||
        text.includes('battery') ||
        text.includes('sensor') ||
        text.includes('scanner') ||
        text.includes('gateway') ||
        text.includes('iot') ||
        text.includes('telemetry') ||
        text.includes('aerospace') ||
        (log.sku && (log.sku.startsWith('SKU-4') || log.sku.startsWith('SKU-8') || log.sku.startsWith('SKU-1') || log.sku.startsWith('SKU-6')))
      );
    }
    return true;
  };

  const dressesSareesCount = decisionLogs.filter((l) => isMatchCategory(l, 'DRESSES_SAREES')).length;
  const shoesCount = decisionLogs.filter((l) => isMatchCategory(l, 'SHOES')).length;
  const walletsCount = decisionLogs.filter((l) => isMatchCategory(l, 'WALLETS')).length;
  const techCount = decisionLogs.filter((l) => isMatchCategory(l, 'TECH')).length;

  const filteredLogs = decisionLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.productName && log.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.customerName && log.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.destinationCity && log.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    return isMatchCategory(log, categoryFilter);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E63] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#1E8E63] uppercase">
              Autonomous Intelligence Audit Trail
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#12372A] tracking-tight">
            Live Location Decision History & Ordered Consignments
          </h2>
          <p className="text-xs text-[#202923]/70">
            Immutable audit log with geospatial tracking, verified product photos for sarees & couture, shoes, wallets, and tech & LiDAR sensors.
          </p>
        </div>

        {/* Confidence & Accuracy Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-[#E5EEE5] shadow-xs text-xs font-mono">
            <span className="text-[#202923]/60">AI Accuracy:</span>{' '}
            <strong className="text-[#1E8E63] font-bold text-sm">99.4% Validated</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5EEE5] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#202923]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order #, Shoes, Wallet, Dress, Saree, LiDAR, Customer, City..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#12372A]/15 text-xs bg-[#F7F5EF] focus:outline-none focus:border-[#1E8E63]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F7F5EF] rounded-2xl border border-[#12372A]/10">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              categoryFilter === 'ALL'
                ? 'bg-[#12372A] text-white shadow-xs'
                : 'text-[#202923]/70 hover:bg-white'
            }`}
          >
            All Logs ({decisionLogs.length})
          </button>
          <button
            onClick={() => setCategoryFilter('DRESSES_SAREES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              categoryFilter === 'DRESSES_SAREES'
                ? 'bg-[#12372A] text-white shadow-xs'
                : 'text-[#202923]/70 hover:bg-white'
            }`}
          >
            <span>👗 Sarees & Couture</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
              categoryFilter === 'DRESSES_SAREES' ? 'bg-[#A7D46F] text-[#12372A]' : 'bg-black/10 text-[#202923]/80'
            }`}>
              {dressesSareesCount}
            </span>
          </button>
          <button
            onClick={() => setCategoryFilter('TECH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              categoryFilter === 'TECH'
                ? 'bg-[#12372A] text-white shadow-xs'
                : 'text-[#202923]/70 hover:bg-white'
            }`}
          >
            <span>📡 Tech & LiDAR</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
              categoryFilter === 'TECH' ? 'bg-[#A7D46F] text-[#12372A]' : 'bg-black/10 text-[#202923]/80'
            }`}>
              {techCount}
            </span>
          </button>
          <button
            onClick={() => setCategoryFilter('SHOES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              categoryFilter === 'SHOES'
                ? 'bg-[#12372A] text-white shadow-xs'
                : 'text-[#202923]/70 hover:bg-white'
            }`}
          >
            <span>👞 Shoes</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
              categoryFilter === 'SHOES' ? 'bg-[#A7D46F] text-[#12372A]' : 'bg-black/10 text-[#202923]/80'
            }`}>
              {shoesCount}
            </span>
          </button>
          <button
            onClick={() => setCategoryFilter('WALLETS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              categoryFilter === 'WALLETS'
                ? 'bg-[#12372A] text-white shadow-xs'
                : 'text-[#202923]/70 hover:bg-white'
            }`}
          >
            <span>💼 Wallets & Bags</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
              categoryFilter === 'WALLETS' ? 'bg-[#A7D46F] text-[#12372A]' : 'bg-black/10 text-[#202923]/80'
            }`}>
              {walletsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Decision Logs Stream */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-3xl border border-[#E5EEE5] p-6 space-y-4 shadow-xs transition hover:shadow-md"
          >
            {/* Top Bar with Authorization Badge & Confidence */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5EEE5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#12372A] text-white flex items-center justify-center font-bold shadow-xs">
                  {log.acceptedBy.includes('AI') ? (
                    <Bot className="w-5 h-5 text-[#A7D46F]" />
                  ) : (
                    <User className="w-5 h-5 text-[#A7D46F]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#12372A]">{log.id}</span>
                    <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E5EEE5] text-[#12372A] border border-[#1E8E63]/20">
                      {log.decisionType.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedOrderId(log.orderId);
                        setCurrentView('orders');
                      }}
                      className="text-xs font-mono font-bold text-[#1E8E63] hover:underline"
                    >
                      Order #{log.orderId}
                    </button>
                  </div>
                  <div className="text-[11px] text-[#202923]/60 mt-0.5">
                    Authorized by <strong>{log.acceptedBy.replace(/_/g, ' ')}</strong> ·{' '}
                    {new Date(log.timestamp).toLocaleDateString()} at{' '}
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Confidence Score Gauge */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">
                    Confidence
                  </div>
                  <div className="font-mono font-bold text-sm text-[#1E8E63]">
                    {log.confidenceScore}% Optimal
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1E8E63] flex items-center justify-center font-mono font-bold text-xs text-[#12372A] bg-[#E5EEE5]">
                  {log.confidenceScore}
                </div>
              </div>
            </div>

            {/* Ordered Product Card & Live Geospatial Corridor */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Product Thumbnail & Ordered Quantity (5 cols) */}
              <div className="md:col-span-5 p-3.5 bg-[#F7F5EF] rounded-2xl border border-[#12372A]/10 flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative group">
                  <img
                    src={getProductImage(log.sku, log.imageUrl)}
                    alt={log.productName || 'Ordered Item'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[10px] font-mono uppercase text-[#202923]/60 font-semibold truncate">
                    {log.sku || 'SKU-701'} · {log.quantity ? `${log.quantity} Units` : '1 Batch'}
                  </div>
                  <div className="font-bold text-xs text-[#12372A] leading-snug line-clamp-2">
                    {log.productName || 'Pure Kanjivaram Gold Zari Crimson Silk Saree'}
                  </div>
                  {log.customerName && (
                    <div className="text-[11px] text-[#202923]/70 font-medium truncate">
                      {log.customerName}
                    </div>
                  )}
                </div>
              </div>

              {/* Geospatial Corridor & Financial Protection (7 cols) */}
              <div className="md:col-span-7 p-3.5 bg-[#F7F5EF] rounded-2xl border border-[#12372A]/10 space-y-2">
                {/* Source to Destination Corridor */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#12372A] font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#1E8E63]" />
                    <span>{log.sourceWarehouse || 'HYD Central Hub'}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1E8E63]" />
                  <div className="flex items-center gap-1.5 text-[#12372A] font-bold">
                    <Compass className="w-3.5 h-3.5 text-[#1E8E63]" />
                    <span>{log.destinationCity || 'Banjara Hills, Hyderabad'}</span>
                  </div>
                </div>

                {/* Financial Value Protected */}
                {log.financialImpact && (
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#12372A]/10">
                    <span className="text-[#202923]/70 font-medium">Value Guaranteed:</span>
                    <span className="font-mono font-bold text-[#1E8E63]">{log.financialImpact}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action & Core Rationale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#E5EEE5]/60 border border-[#1E8E63]/20 space-y-1">
                <div className="font-bold text-[#12372A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E63]" />
                  <span>Executed Action:</span>
                </div>
                <p className="text-[#202923]/80 leading-relaxed font-mono text-[11px]">
                  {log.action}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#12372A]/10 space-y-1">
                <div className="font-bold text-[#12372A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Decision Rationale & Intelligence:</span>
                </div>
                <p className="text-[#202923]/80 leading-relaxed text-[11px]">
                  {log.reason}
                </p>
              </div>
            </div>

            {/* Alternative Options Evaluated */}
            {log.alternativeOptions && log.alternativeOptions.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-[#E5EEE5]">
                <div className="text-[10px] font-mono uppercase font-bold text-[#202923]/60">
                  Alternative Routes & Dispatches Evaluated ({log.alternativeOptions.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {log.alternativeOptions.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-[#12372A]/10 text-[11px] space-y-1"
                    >
                      <div className="font-semibold text-[#12372A] line-through text-gray-500">
                        ✕ {alt.option}
                      </div>
                      <div className="text-[10px] text-amber-700 font-medium">
                        Rejected: {alt.rejectedReason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
