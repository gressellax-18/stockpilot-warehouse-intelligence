import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Search,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Mail,
  UserCheck,
  ShoppingBag,
  Store,
  Layers,
} from 'lucide-react';
import { OrderStatus, PriorityLevel, OrderChannel } from '../types';
import { getProductImage } from '../utils/productImages';

export const OrdersView: React.FC = () => {
  const {
    orders,
    exceptions,
    workers,
    activeWarehouseId,
    selectedOrderId,
    setSelectedOrderId,
    setIsNewOrderModalOpen,
  } = useWarehouse();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  const damagedOrderIds = new Set(
    exceptions
      .filter((e) => e.type === 'DAMAGED_ITEM' || e.type === 'QC_FAILED' || e.status === 'OPEN')
      .map((e) => e.orderId)
  );

  const filteredOrders = orders.filter((order) => {
    if (activeWarehouseId && order.assignedWarehouseId !== activeWarehouseId) return false;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'VIP_OUT_OF_STOCK') {
        if (!order.isOutOfStockVip) return false;
      } else if (statusFilter === 'DAMAGED_ORDERS') {
        if (!damagedOrderIds.has(order.id) && order.status !== 'EXCEPTION') return false;
      } else if (statusFilter === 'ONGOING_PROCESS') {
        const isOngoing =
          order.status === 'ALLOCATED' ||
          order.status === 'PICKING' ||
          order.status === 'PARTIALLY_PICKED' ||
          order.status === 'PACKING' ||
          order.status === 'QC' ||
          order.status === 'READY_TO_DISPATCH' ||
          order.status === 'IN_TRANSIT' ||
          order.status === 'DISPATCHED';
        if (!isOngoing) return false;
      } else if (statusFilter === 'ACCEPTED_ORDERS') {
        if (order.status === 'CANCELLED') return false;
      } else if (order.status !== statusFilter) {
        return false;
      }
    }
    if (priorityFilter !== 'ALL' && order.priorityLevel !== priorityFilter) return false;
    if (channelFilter !== 'ALL' && order.channel !== channelFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCustomer = order.customerName.toLowerCase().includes(q);
      const matchCity = order.destinationCity.toLowerCase().includes(q);
      const matchChannel = order.channel?.toLowerCase().includes(q);
      const matchPhone = order.customerPhone?.toLowerCase().includes(q);
      const matchSku = order.items.some((i) => i.sku.toLowerCase().includes(q) || i.productName.toLowerCase().includes(q));
      return matchId || matchCustomer || matchCity || matchSku || matchChannel || matchPhone;
    }
    return true;
  });

  const getChannelBadge = (ch?: OrderChannel | string) => {
    switch (ch) {
      case 'Amazon':
        return { label: 'Amazon India', bg: 'bg-amber-50 text-amber-900 border-amber-300', icon: '🛒' };
      case 'Flipkart':
        return { label: 'Flipkart', bg: 'bg-blue-50 text-blue-800 border-blue-300', icon: '🛍️' };
      case 'Blinkit':
        return { label: 'Blinkit 10m', bg: 'bg-yellow-50 text-yellow-900 border-yellow-300', icon: '⚡' };
      case 'Zepto':
        return { label: 'Zepto', bg: 'bg-purple-50 text-purple-900 border-purple-300', icon: '🚀' };
      case 'Swiggy Instamart':
        return { label: 'Swiggy', bg: 'bg-orange-50 text-orange-900 border-orange-300', icon: '🛵' };
      case 'B2B Portal':
        return { label: 'B2B Portal', bg: 'bg-slate-100 text-slate-900 border-slate-300', icon: '💼' };
      case 'Shopify':
        return { label: 'Shopify Store', bg: 'bg-emerald-50 text-emerald-900 border-emerald-300', icon: '🌐' };
      case 'Tata Neu':
        return { label: 'Tata Neu', bg: 'bg-purple-50 text-purple-900 border-purple-300', icon: '✨' };
      default:
        return { label: ch || 'Direct', bg: 'bg-gray-100 text-gray-800 border-gray-200', icon: '📦' };
    }
  };

  const damagedOrdersCount = orders.filter((o) => damagedOrderIds.has(o.id) || o.status === 'EXCEPTION').length;
  const ongoingOrdersCount = orders.filter(
    (o) =>
      o.status === 'ALLOCATED' ||
      o.status === 'PICKING' ||
      o.status === 'PARTIALLY_PICKED' ||
      o.status === 'PACKING' ||
      o.status === 'QC' ||
      o.status === 'READY_TO_DISPATCH' ||
      o.status === 'IN_TRANSIT' ||
      o.status === 'DISPATCHED'
  ).length;

  const stageCounts = {
    ALL: orders.length,
    DAMAGED_ORDERS: damagedOrdersCount,
    ONGOING_PROCESS: ongoingOrdersCount,
    ACCEPTED_ORDERS: orders.length,
    READY_TO_DISPATCH: orders.filter((o) => o.status === 'READY_TO_DISPATCH').length,
    ALLOCATED: orders.filter((o) => o.status === 'ALLOCATED').length,
    PICKING: orders.filter((o) => o.status === 'PICKING').length,
    PACKING: orders.filter((o) => o.status === 'PACKING').length,
    DISPATCHED: orders.filter((o) => o.status === 'DISPATCHED' || o.status === 'IN_TRANSIT').length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED' || o.status === 'FEEDBACK_RECEIVED').length,
    VIP_OUT_OF_STOCK: orders.filter((o) => o.isOutOfStockVip).length,
    EXCEPTION: orders.filter((o) => o.status === 'EXCEPTION').length,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#12372A] tracking-tight">Order Lifecycle & Channel Control</h2>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#12372A] text-white">
              {orders.length} Active Orders
            </span>
          </div>
          <p className="text-xs text-[#202923]/70">
            Real-time multi-app ordering (Amazon, Flipkart, Blinkit, Enterprise), automated SLA routing, and worker tier allocation.
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          id="btn-orders-new-order"
          className="py-2.5 px-4 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center gap-2 self-start sm:self-auto transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-[#A7D46F]" />
          <span>Place New Order (Soaps / Tech)</span>
        </button>
      </div>

      {/* 🚀 Quick Stage Filter Bar with live counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'ALL', label: '📥 All Placed', count: stageCounts.ALL },
          { id: 'DAMAGED_ORDERS', label: '🚨 Damaged Orders', count: stageCounts.DAMAGED_ORDERS, error: true },
          { id: 'ACCEPTED_ORDERS', label: '🤝 Accepted & Owned', count: stageCounts.ACCEPTED_ORDERS, accepted: true },
          { id: 'ONGOING_PROCESS', label: '⚡ Ongoing Waves', count: stageCounts.ONGOING_PROCESS, highlight: true },
          { id: 'READY_TO_DISPATCH', label: 'Ready to Dispatch', count: stageCounts.READY_TO_DISPATCH },
          { id: 'ALLOCATED', label: 'Allocated', count: stageCounts.ALLOCATED },
          { id: 'PICKING', label: 'Picking', count: stageCounts.PICKING },
          { id: 'PACKING', label: 'Packing', count: stageCounts.PACKING },
          { id: 'DISPATCHED', label: 'In Transit / Dispatched', count: stageCounts.DISPATCHED },
          { id: 'DELIVERED', label: 'Delivered', count: stageCounts.DELIVERED },
          { id: 'VIP_OUT_OF_STOCK', label: '👑 VIP Deficit', count: stageCounts.VIP_OUT_OF_STOCK, alert: true },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 border ${
              statusFilter === tab.id
                ? 'bg-[#12372A] text-white border-[#12372A] shadow-xs'
                : tab.error && tab.count > 0
                ? 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100'
                : tab.accepted
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                : tab.highlight
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : tab.alert && tab.count > 0
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-white text-[#202923]/80 border-[#E5EEE5] hover:bg-[#F7F5EF]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === tab.id
                  ? 'bg-[#A7D46F] text-[#12372A]'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEE5] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#F7F5EF] px-3 py-2 rounded-xl border border-[#12372A]/10 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#202923]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Customer, App (Blinkit/Amazon), Phone, SKU..."
            className="bg-transparent text-xs text-[#12372A] focus:outline-none w-full placeholder:text-[#202923]/40 font-medium"
          />
        </div>

        {/* Channel & Priority Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Channel filter */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="p-2 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 text-xs font-semibold text-[#12372A] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Ordering Apps</option>
            <option value="Amazon">🛒 Amazon Marketplace</option>
            <option value="Flipkart">🛍️ Flipkart</option>
            <option value="Blinkit">⚡ Blinkit</option>
            <option value="Zepto">🚀 Zepto</option>
            <option value="Swiggy Instamart">🛵 Swiggy Instamart</option>
            <option value="Direct Web Store">🌐 Direct Web Store</option>
            <option value="Enterprise EDI">💼 Enterprise EDI</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 bg-[#F7F5EF] rounded-xl border border-[#12372A]/10 text-xs font-semibold text-[#12372A] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">🔴 Critical Priority (&gt; 80)</option>
            <option value="HIGH">🟡 High Priority (60–79)</option>
            <option value="NORMAL">🟢 Normal Priority (&lt; 60)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5EEE5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5EF] border-b border-[#E5EEE5] text-[11px] font-mono uppercase text-[#202923]/70">
              <tr>
                <th className="py-3 px-4 font-bold">Order ID</th>
                <th className="py-3 px-4 font-bold">App / Channel</th>
                <th className="py-3 px-4 font-bold">Customer & Contact</th>
                <th className="py-3 px-4 font-bold">Line Items & Value</th>
                <th className="py-3 px-4 font-bold">Priority Score</th>
                <th className="py-3 px-4 font-bold">Fulfillment Hub</th>
                <th className="py-3 px-4 font-bold">SLA Deadline</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EEE5]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-[#202923]/60">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="text-sm font-bold text-[#12372A]">No orders found for this stage</div>
                      <p className="text-xs text-gray-500">
                        Try resetting filters or click "Place New Order" above to generate live orders for this pipeline stage!
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderId === order.id;
                  const channelBadge = getChannelBadge(order.channel);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`hover:bg-[#F7F5EF]/60 cursor-pointer transition ${
                        isSelected ? 'bg-[#E5EEE5]/40 ring-1 ring-[#1E8E63]' : ''
                      }`}
                    >
                      {/* Order ID */}
                      <td className="py-3 px-4 font-mono font-bold text-[#12372A]">
                        <div>#{order.id}</div>
                        {order.isOutOfStockVip && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#F26B5B] text-white flex items-center gap-0.5 mt-1">
                            <ShieldAlert className="w-2.5 h-2.5" /> VIP Deficit: {order.stockDeficitUnits}u
                          </span>
                        )}
                      </td>

                      {/* App Channel */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${channelBadge.bg}`}>
                          <span>{channelBadge.icon}</span>
                          <span>{channelBadge.label}</span>
                        </span>
                      </td>

                      {/* Customer & Contacts */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#12372A]">{order.customerName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {order.customerType === 'VIP' ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              👑 VIP Tier
                            </span>
                          ) : order.customerType === 'ENTERPRISE' ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-200">
                              🏢 Enterprise
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-mono">Regular</span>
                          )}
                          <span className="text-[10px] text-[#202923]/60 truncate max-w-[130px]">
                            {order.destinationCity}
                          </span>
                        </div>
                        {order.customerPhone && (
                          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                            <Smartphone className="w-2.5 h-2.5 text-gray-400" />
                            {order.customerPhone}
                          </div>
                        )}
                      </td>

                      {/* Line Items & Total */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          {order.items[0] && (
                            <div className="w-8 h-8 rounded-lg bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative shadow-2xs">
                              <img
                                src={getProductImage(order.items[0].sku, order.items[0].imageUrl)}
                                alt={order.items[0].productName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            {order.items.map((i, idx) => (
                              <div key={idx} className="text-[#12372A] text-xs">
                                <strong>{i.quantityRequired}×</strong> {i.sku}
                                {i.quantityAllocated < i.quantityRequired ? (
                                  <span className="text-[#F26B5B] text-[10px] ml-1 font-bold">
                                    ({i.quantityAllocated}/{i.quantityRequired} alloc)
                                  </span>
                                ) : (
                                  <span className="text-[#1E8E63] text-[10px] ml-1 font-bold">
                                    ({i.quantityAllocated} alloc)
                                  </span>
                                )}
                              </div>
                            ))}
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-[#1E8E63] font-bold">
                                ₹{order.totalAmount.toLocaleString()}
                              </span>
                              {order.conditionAssessment ? (
                                <span className={`text-[9px] font-bold px-1 rounded ${order.conditionAssessment.isAllGood ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                  {order.conditionAssessment.isAllGood ? '🟢 Good' : '🔴 Damaged'}
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold px-1 rounded bg-emerald-100 text-emerald-800">
                                  🟢 Good
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Priority Score */}
                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            order.priorityLevel === 'CRITICAL'
                              ? 'bg-[#F26B5B]/15 text-[#F26B5B] border border-[#F26B5B]/30'
                              : order.priorityLevel === 'HIGH'
                              ? 'bg-[#F3B562]/20 text-[#12372A] border border-[#F3B562]/40'
                              : 'bg-[#E5EEE5] text-[#12372A]'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          {order.priorityScore} / 100
                        </span>
                      </td>

                      {/* Hub */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#12372A] flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[#1E8E63]" />
                          <span>{order.allocatedWarehouseName || 'Hyderabad FC'}</span>
                        </div>
                        <div className="text-[10px] text-[#202923]/60">{order.shippingMethod}</div>
                      </td>

                      {/* SLA Deadline */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-1 font-bold text-[#12372A]">
                          <Clock className="w-3.5 h-3.5 text-[#F26B5B]" />
                          <span>
                            {Math.floor(order.slaRemainingMinutes / 60)}h {order.slaRemainingMinutes % 60}m
                          </span>
                        </div>
                        <div className="text-[10px] text-[#202923]/50">Target SLA</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-block ${
                            order.status === 'DELIVERED' || order.status === 'FEEDBACK_RECEIVED'
                              ? 'bg-[#1E8E63] text-white'
                              : order.status === 'EXCEPTION'
                              ? 'bg-[#F26B5B] text-white'
                              : order.status === 'IN_TRANSIT' || order.status === 'DISPATCHED'
                              ? 'bg-[#A7D46F] text-[#12372A]'
                              : order.status === 'READY_TO_DISPATCH'
                              ? 'bg-amber-400 text-[#12372A] font-black'
                              : 'bg-[#E5EEE5] text-[#12372A]'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderId(order.id);
                          }}
                          className="p-1.5 rounded-lg bg-[#F7F5EF] hover:bg-[#E5EEE5] text-[#12372A] font-bold transition inline-flex items-center gap-1"
                        >
                          <span>Lifecycle</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#1E8E63]" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

