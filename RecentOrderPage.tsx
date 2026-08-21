import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Cpu, 
  Radio, 
  Printer, 
  Search, 
  ArrowRight, 
  Package, 
  ShieldCheck, 
  CreditCard, 
  RotateCcw,
  Zap,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CompletedTransaction, Product } from '../types';
import { SafeImage } from './SafeImage';

interface RecentOrdersPageProps {
  transactions: CompletedTransaction[];
  onOpenStore: () => void;
  onOpenStockPilot: () => void;
  onAddToCart: (product: Product) => void;
  onClearTransactions?: () => void;
  onSeedSampleTransactions: () => void;
}

export const RecentOrdersPage: React.FC<RecentOrdersPageProps> = ({
  transactions,
  onOpenStore,
  onOpenStockPilot,
  onAddToCart,
  onSeedSampleTransactions
}) => {
  const [filterType, setFilterType] = useState<'all' | 'order' | 'recharge' | 'bill'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    transactions.length > 0 ? transactions[0].id : null
  );

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.items && tx.items.some(i => i.product.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.product.sku.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  const activeTransaction = transactions.find(t => t.id === selectedOrderId) || transactions[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-16 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/30 flex items-center space-x-1.5">
                  <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
                  <span>StockPilot Live Dispatch Sync</span>
                </span>
                <span className="text-xs text-slate-400">• Real-Time RFID & Order History</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-center space-x-2.5">
                <span>Recent Orders & Activity</span>
                <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {transactions.length} Records
                </span>
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onOpenStockPilot}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Cpu className="w-4 h-4 text-indigo-200" />
                <span>Open StockPilot Intelligence</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenStore}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop More</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Autonomous Dispatch Pipeline Card */}
        {activeTransaction && (
          <div className="mb-8 bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>STOCKPILOT AUTONOMOUS DISPATCH TELEMETRY</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Order Tracking: <span className="font-mono text-indigo-300">{activeTransaction.id}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed on {activeTransaction.date} • Total: <strong className="text-emerald-400 font-mono">${activeTransaction.amount.toFixed(2)}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Status: {activeTransaction.status}</span>
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 cursor-pointer border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>

            {/* 4-Step StockPilot Fulfillment Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
              <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-500/30">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center space-x-1">
                    <span>Payment Verified</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    SSL 256-Bit cleared via {activeTransaction.details['Payment Method'] || 'Credit/Debit Card'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/70 rounded-xl p-3.5 border border-indigo-500/40 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/40">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-300 flex items-center space-x-1">
                    <span>AGV Robot Pick Path</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Assigned Robot AGV-03 • Optimal Floor Routing Aisle 04/09
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/30">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    RFID Manifest Scan
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Anti-tamper packaging & weight verification passed
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/30">
                  4
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center space-x-1">
                    <span>Carrier Handoff</span>
                    <Truck className="w-3 h-3 text-indigo-400 inline" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Dock Bay #4 • FedEx Express 2-Day Air
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-slate-900 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Activity', count: transactions.length },
              { id: 'order', label: 'Store Orders', count: transactions.filter(t => t.type === 'order').length },
              { id: 'recharge', label: 'Mobile Recharges', count: transactions.filter(t => t.type === 'recharge').length },
              { id: 'bill', label: 'Utility Bills', count: transactions.filter(t => t.type === 'bill').length }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{f.label}</span>
                <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or product..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-4 border border-indigo-500/20">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Orders Matching Your Search</h3>
            <p className="text-xs text-slate-400 mb-6">
              You haven't placed orders under this filter yet or no matching items found.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onSeedSampleTransactions}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-md shadow-indigo-600/30"
              >
                Load Sample Verified Orders
              </button>
              <button
                onClick={onOpenStore}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
              >
                Browse Store Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredTransactions.map((tx) => {
                const isSelected = tx.id === selectedOrderId;
                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedOrderId(tx.id)}
                    className={`bg-slate-900 rounded-2xl p-5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'order' 
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                            : tx.type === 'recharge' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                        }`}>
                          {tx.type === 'order' ? <ShoppingBag className="w-5 h-5" /> : tx.type === 'recharge' ? <Zap className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-indigo-400">{tx.id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 uppercase font-bold">
                              {tx.type}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{tx.title}</h4>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-base font-mono font-black text-emerald-400">
                          ${tx.amount.toFixed(2)}
                        </div>
                        <span className="text-[11px] text-slate-500">{tx.date}</span>
                      </div>
                    </div>

                    {/* Itemized list if store order */}
                    {tx.items && tx.items.length > 0 && (
                      <div className="mt-4 pt-1 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Dispatched Products ({tx.items.reduce((s, i) => s + i.quantity, 0)} Units):
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tx.items.map((item, idx) => (
                            <div
                              key={`${item.product.id}-${idx}`}
                              className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 flex items-center space-x-2.5"
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                                <SafeImage
                                  src={item.product.image}
                                  alt={item.product.title}
                                  aspectRatio="aspect-square"
                                  fallbackCategory={item.product.department}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-slate-200 truncate">
                                  {item.product.title}
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                  <span className="font-mono">{item.quantity}x @ ${item.product.price}</span>
                                  <span className="font-mono font-semibold text-indigo-300">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata attributes */}
                    <div className="mt-4 bg-slate-950/40 rounded-xl p-2.5 border border-slate-800/50 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                      {Object.entries(tx.details).map(([key, val]) => (
                        <div key={key} className="truncate">
                          <span className="text-slate-500 font-semibold">{key}: </span>
                          <span className="text-slate-300">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Dispatched via StockPilot Autonomous Line</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (tx.items) {
                            tx.items.forEach(i => onAddToCart(i.product));
                          }
                        }}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reorder Items</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Order Detail Inspector & Quick Actions */}
            {activeTransaction && (
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 sticky top-36 h-fit shadow-2xl">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Tax Invoice & Dispatch Details</span>
                </div>

                <h3 className="text-xl font-black text-white font-mono">{activeTransaction.id}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Processed on {activeTransaction.date}
                </p>

                <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transaction Status:</span>
                    <span className="font-bold text-emerald-400 font-mono">{activeTransaction.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Gateway:</span>
                    <span className="font-medium text-slate-200">{activeTransaction.details['Payment Method'] || 'Encrypted SSL'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Carrier Dispatch:</span>
                    <span className="font-medium text-slate-200">StockPilot Express Line</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between">
                    <span className="text-slate-300 font-bold">Total Paid:</span>
                    <span className="font-mono font-black text-lg text-emerald-400">
                      ${activeTransaction.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={onOpenStockPilot}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-md shadow-indigo-600/30"
                  >
                    <Cpu className="w-4 h-4 text-indigo-200" />
                    <span>View in StockPilot Floor Matrix</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-colors border border-slate-700"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Tax Receipt</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
