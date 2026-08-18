import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  MessageSquareHeart,
  Star,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ThumbsUp,
  AlertCircle,
  Lightbulb,
  Clock,
  Package,
  ShieldCheck,
  Building2,
  Reply,
  Filter,
} from 'lucide-react';
import { getProductImage } from '../utils/productImages';

export const CustomerFeedbackView: React.FC = () => {
  const { feedback, orders, submitCustomerFeedback } = useWarehouse();

  const [selectedOrderId, setSelectedOrderId] = useState<string>('10520');
  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Fast delivery',
    'Good packaging',
    'Accurate order',
    'Pristine fabric condition',
  ]);
  const [comment, setComment] = useState<string>(
    'The Kanjivaram pure silk sarees arrived in museum-grade acid-free muslin wrapping. Outstanding delivery velocity for our bridal showcase.'
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'DRESSES_SAREES' | 'SHOES' | 'WALLETS' | 'SOAPS' | 'TECH'>('ALL');
  const [submittedMessage, setSubmittedMessage] = useState<boolean>(false);

  const availableTags = [
    'Fast delivery',
    'Accurate order',
    'Good packaging',
    'Great communication',
    'Pristine fabric condition',
    'Silk Mark Certified',
    'Flawless leather finish',
    'Tamper-proof seal',
    'Shock-absorption box',
    'Minor packaging wear',
    'Late delivery',
  ];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCustomerFeedback(selectedOrderId, rating, selectedTags, comment);
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  const isFeedbackMatchCategory = (item: typeof feedback[0], filter: 'ALL' | 'DRESSES_SAREES' | 'SHOES' | 'WALLETS' | 'SOAPS' | 'TECH') => {
    if (filter === 'ALL') return true;
    const text = `${item.productName || ''} ${item.comments || ''} ${item.sku || ''} ${item.customerName || ''}`.toLowerCase();
    if (filter === 'DRESSES_SAREES') {
      return (
        text.includes('saree') ||
        text.includes('sari') ||
        text.includes('lehenga') ||
        text.includes('dress') ||
        text.includes('gown') ||
        text.includes('silk') ||
        text.includes('zari') ||
        (item.sku && item.sku.startsWith('SKU-70'))
      );
    }
    if (filter === 'SHOES') {
      return (
        text.includes('shoe') ||
        text.includes('oxford') ||
        text.includes('running') ||
        text.includes('juttis') ||
        text.includes('mojari') ||
        text.includes('heels') ||
        text.includes('footwear') ||
        (item.sku && item.sku.startsWith('SKU-72'))
      );
    }
    if (filter === 'WALLETS') {
      return (
        text.includes('wallet') ||
        text.includes('handbag') ||
        text.includes('tote') ||
        text.includes('duffle') ||
        text.includes('leather') ||
        text.includes('crossbody') ||
        (item.sku && item.sku.startsWith('SKU-73'))
      );
    }
    if (filter === 'SOAPS') {
      return (
        text.includes('soap') ||
        text.includes('fresh') ||
        text.includes('fmcg') ||
        (item.sku && item.sku.startsWith('SKU-5'))
      );
    }
    if (filter === 'TECH') {
      return (
        text.includes('lidar') ||
        text.includes('scanner') ||
        text.includes('battery') ||
        text.includes('sensor') ||
        text.includes('gateway') ||
        text.includes('aerospace') ||
        (item.sku && (item.sku.startsWith('SKU-4') || item.sku.startsWith('SKU-6') || item.sku.startsWith('SKU-8') || item.sku.startsWith('SKU-1')))
      );
    }
    return true;
  };

  const dressesSareesCount = feedback.filter((f) => isFeedbackMatchCategory(f, 'DRESSES_SAREES')).length;
  const shoesCount = feedback.filter((f) => isFeedbackMatchCategory(f, 'SHOES')).length;
  const walletsCount = feedback.filter((f) => isFeedbackMatchCategory(f, 'WALLETS')).length;
  const soapsCount = feedback.filter((f) => isFeedbackMatchCategory(f, 'SOAPS')).length;
  const techCount = feedback.filter((f) => isFeedbackMatchCategory(f, 'TECH')).length;

  const filteredFeedback = feedback.filter((item) => isFeedbackMatchCategory(item, activeCategoryFilter));

  const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / (feedback.length || 1)).toFixed(1);
  const csatScore = Math.round((feedback.filter((f) => f.rating >= 4).length / (feedback.length || 1)) * 100);

  const selectedOrderObj = orders.find((o) => o.id === selectedOrderId) || orders[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E63] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#1E8E63] uppercase">
              Omnichannel Customer Experience (CSAT)
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#12372A] tracking-tight">
            Customer Feedback & Continuous Quality Intelligence
          </h2>
          <p className="text-xs text-[#202923]/70">
            Real customer delivery reviews across Sarees & Bridal Coutures, FMCG Personal Care, and High-Tech consignments.
          </p>
        </div>

        {/* CSAT Metric Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-[#E5EEE5] shadow-xs text-xs font-mono">
            <span className="text-[#202923]/60">CSAT Score:</span>{' '}
            <strong className="text-[#1E8E63] font-bold text-sm">{csatScore}% Positive</strong>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-[#E5EEE5] shadow-xs text-xs font-mono">
            <span className="text-[#202923]/60">Avg Rating:</span>{' '}
            <strong className="text-amber-600 font-bold text-sm">★ {avgRating} / 5.0</strong>
          </div>
        </div>
      </div>

      {/* Category Performance Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5EEE5] shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F7F5EF] flex items-center justify-center text-xl">
            👗
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">
              Sarees & Apparel CSAT
            </div>
            <div className="font-bold text-base text-[#12372A]">99.4% (Pristine Delivery)</div>
            <div className="text-[11px] text-[#1E8E63] font-semibold">Zero fabric creasing reports</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EEE5] shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F7F5EF] flex items-center justify-center text-xl">
            🧼
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">
              FMCG & Soaps Velocity
            </div>
            <div className="font-bold text-base text-[#12372A]">45-min Quick Commerce</div>
            <div className="text-[11px] text-[#1E8E63] font-semibold">Moisture-sealed packaging</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EEE5] shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F7F5EF] flex items-center justify-center text-xl">
            📡
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">
              High-Precision Hardware
            </div>
            <div className="font-bold text-base text-[#12372A]">98.8% Zero Defect</div>
            <div className="text-[11px] text-[#1E8E63] font-semibold">Shock-calibrated transit</div>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Submit Feedback (Left) & Real Customer Feedback Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submit Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E5EEE5] p-6 space-y-4 shadow-xs h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5EEE5]">
            <MessageSquareHeart className="w-5 h-5 text-[#1E8E63]" />
            <h3 className="font-bold text-sm text-[#12372A]">Submit Customer Order Feedback</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Select Order</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#12372A]/20 font-medium focus:outline-none bg-[#F7F5EF]"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.id} — {o.customerName} ({o.items[0]?.productName?.slice(0, 30)}...)
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Order Product Preview */}
            {selectedOrderObj && (
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#12372A]/10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0">
                  <img
                    src={getProductImage(selectedOrderObj.items[0]?.sku, selectedOrderObj.items[0]?.imageUrl)}
                    alt={selectedOrderObj.items[0]?.productName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-mono font-bold text-xs text-[#12372A]">
                    {selectedOrderObj.items[0]?.productName}
                  </div>
                  <div className="text-[10px] text-[#202923]/70">
                    Destination: {selectedOrderObj.destinationCity}
                  </div>
                </div>
              </div>
            )}

            {/* Star Rating */}
            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Satisfaction Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'fill-amber-400 text-amber-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Tags */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#12372A]">Quality & Delivery Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition ${
                        isSelected
                          ? 'bg-[#12372A] text-[#A7D46F]'
                          : 'bg-[#F7F5EF] text-[#202923]/70 hover:bg-[#E5EEE5]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Customer Review & Feedback Note</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-2xl border border-[#12372A]/20 focus:outline-none text-xs leading-relaxed bg-[#F7F5EF]"
                placeholder="Describe product condition, packaging, and delivery experience..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <ThumbsUp className="w-4 h-4 text-[#A7D46F]" />
              <span>Log Feedback & Update Quality Score</span>
            </button>

            {submittedMessage && (
              <div className="p-3 rounded-2xl bg-[#E5EEE5] border border-[#1E8E63]/30 text-[#12372A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E8E63]" />
                <span className="font-semibold text-xs">
                  Feedback logged! Operational scores updated in real time.
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Live Feedback Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Feed Filter Bar */}
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]">
              Verified Customer Delivery Logs ({filteredFeedback.length})
            </h3>

            <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-[#E5EEE5]">
              <button
                onClick={() => setActiveCategoryFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  activeCategoryFilter === 'ALL'
                    ? 'bg-[#12372A] text-white'
                    : 'text-[#202923]/70 hover:bg-[#F7F5EF]'
                }`}
              >
                All ({feedback.length})
              </button>
              <button
                onClick={() => setActiveCategoryFilter('DRESSES_SAREES')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  activeCategoryFilter === 'DRESSES_SAREES'
                    ? 'bg-[#12372A] text-white'
                    : 'text-[#202923]/70 hover:bg-[#F7F5EF]'
                }`}
              >
                <span>👗 Sarees & Couture</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                  activeCategoryFilter === 'DRESSES_SAREES' ? 'bg-[#A7D46F] text-[#12372A]' : 'bg-black/10'
                }`}>
                  {dressesSareesCount}
                </span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('TECH')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  activeCategoryFilter === 'TECH'
                    ? 'bg-[#12372A] text-white'
                    : 'text-[#202923]/70 hover:bg-[#F7F5EF]'
                }`}
              >
                <span>📡 Tech & LiDAR</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                  activeCategoryFilter === 'TECH' ? 'bg-[#A7D46F] text-[#12372A]' : 'bg-black/10'
                }`}>
                  {techCount}
                </span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('SHOES')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  activeCategoryFilter === 'SHOES'
                    ? 'bg-[#12372A] text-white'
                    : 'text-[#202923]/70 hover:bg-[#F7F5EF]'
                }`}
              >
                <span>👞 Shoes</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                  activeCategoryFilter === 'SHOES' ? 'bg-[#A7D46F] text-[#12372A]' : 'bg-black/10'
                }`}>
                  {shoesCount}
                </span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('WALLETS')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  activeCategoryFilter === 'WALLETS'
                    ? 'bg-[#12372A] text-white'
                    : 'text-[#202923]/70 hover:bg-[#F7F5EF]'
                }`}
              >
                <span>💼 Wallets & Bags</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                  activeCategoryFilter === 'WALLETS' ? 'bg-[#A7D46F] text-[#12372A]' : 'bg-black/10'
                }`}>
                  {walletsCount}
                </span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('SOAPS')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  activeCategoryFilter === 'SOAPS'
                    ? 'bg-[#12372A] text-white'
                    : 'text-[#202923]/70 hover:bg-[#F7F5EF]'
                }`}
              >
                <span>🧼 Soaps</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                  activeCategoryFilter === 'SOAPS' ? 'bg-[#A7D46F] text-[#12372A]' : 'bg-black/10'
                }`}>
                  {soapsCount}
                </span>
              </button>
            </div>
          </div>

          {/* Feedback Cards */}
          <div className="space-y-4">
            {filteredFeedback.map((fb) => (
              <div
                key={fb.id}
                className="bg-white rounded-3xl border border-[#E5EEE5] p-5 space-y-3.5 shadow-xs transition hover:shadow-md"
              >
                {/* Header with Customer & Order info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5EEE5]">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        fb.customerAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={fb.customerName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#12372A]/10 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#12372A]">{fb.customerName}</span>
                        {fb.verifiedPurchase && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E8E63]/15 text-[#1E8E63] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Consignment</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#202923]/60">
                        Order #{fb.orderId} · {new Date(fb.submittedAt).toLocaleDateString()}
                        {fb.deliverySpeedHours && ` · Delivered in ${fb.deliverySpeedHours}h`}
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= fb.rating ? 'fill-amber-400 text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Ordered Product Thumbnail & Details */}
                <div className="p-2.5 bg-[#F7F5EF] rounded-2xl border border-[#12372A]/10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#12372A]/10 overflow-hidden flex-shrink-0 relative">
                    <img
                      src={getProductImage(fb.sku, fb.imageUrl)}
                      alt={fb.productName || 'Ordered Item'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold">
                      Ordered SKU: {fb.sku || 'SKU-701'}
                    </div>
                    <div className="font-bold text-xs text-[#12372A]">
                      {fb.productName || 'Pure Kanjivaram Silk Saree'}
                    </div>
                    {fb.packagingCondition && (
                      <div className="text-[10px] text-[#1E8E63] font-semibold flex items-center gap-1 mt-0.5">
                        <Package className="w-3 h-3" />
                        <span>Packaging: {fb.packagingCondition}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {fb.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#E5EEE5] text-[#12372A]"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-xs text-[#202923]/90 italic leading-relaxed pl-3 border-l-2 border-[#1E8E63]">
                  "{fb.comments}"
                </p>

                {/* Official Response if present */}
                {fb.managerReply && (
                  <div className="bg-[#E5EEE5]/60 p-3 rounded-2xl border border-[#1E8E63]/20 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#12372A]">
                      <Reply className="w-3.5 h-3.5 text-[#1E8E63]" />
                      <span>StockPilot Quality Control Response:</span>
                    </div>
                    <p className="text-[11px] text-[#202923]/80 leading-relaxed pl-4">
                      {fb.managerReply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
