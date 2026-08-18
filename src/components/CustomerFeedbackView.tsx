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
} from 'lucide-react';

export const CustomerFeedbackView: React.FC = () => {
  const { feedback, orders, submitCustomerFeedback } = useWarehouse();

  const [selectedOrderId, setSelectedOrderId] = useState<string>('10482');
  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Fast delivery', 'Good packaging', 'Accurate order']);
  const [comment, setComment] = useState<string>(
    'Remarkable response! The partial fulfillment saved our satellite assembly schedule from halting. Outstanding control tower communication.'
  );
  const [submittedMessage, setSubmittedMessage] = useState<boolean>(false);

  const availableTags = [
    'Fast delivery',
    'Accurate order',
    'Good packaging',
    'Great communication',
    'Late delivery',
    'Damaged item',
    'Missing item',
    'Minor packaging wear',
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

  const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / (feedback.length || 1)).toFixed(1);
  const csatScore = Math.round((feedback.filter((f) => f.rating >= 4).length / (feedback.length || 1)) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12372A] tracking-tight">
            Customer Feedback & Continuous Learning Loop
          </h2>
          <p className="text-xs text-[#202923]/70">
            Real user feedback directly drives operational process improvements and packaging protocols.
          </p>
        </div>

        {/* CSAT Metric Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#E5EEE5] shadow-xs text-xs font-mono">
            <span className="text-[#202923]/60">CSAT Score:</span>{' '}
            <strong className="text-[#1E8E63] font-bold">{csatScore}% Positive</strong>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#E5EEE5] shadow-xs text-xs font-mono">
            <span className="text-[#202923]/60">Avg Rating:</span>{' '}
            <strong className="text-amber-600 font-bold">★ {avgRating} / 5.0</strong>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Submit Feedback (Left) & Live Impact Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submit Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5EEE5] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5EEE5]">
            <MessageSquareHeart className="w-5 h-5 text-[#1E8E63]" />
            <h3 className="font-bold text-sm text-[#12372A]">Submit Order Experience</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Select Order</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 font-medium focus:outline-none"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.id} — {o.customerName} ({o.status})
                  </option>
                ))}
              </select>
            </div>

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
              <label className="font-bold text-[#12372A]">Feedback Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
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

            {/* Comments */}
            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Customer Notes & Comments</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                required
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              id="btn-submit-feedback"
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E8E63] hover:bg-[#1E8E63]/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Sparkles className="w-4 h-4 text-[#A7D46F]" />
              <span>Submit Feedback & Close Lifecycle</span>
            </button>

            {submittedMessage && (
              <div className="p-2.5 rounded-xl bg-[#E5EEE5] text-[#1E8E63] font-bold text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Feedback registered! Operational intelligence updated.</span>
              </div>
            )}
          </form>
        </div>

        {/* Live Feedback & Actionable Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-xs uppercase font-mono text-[#12372A]/70">
            Actionable AI Recommendations Driven by Customer Feedback ({feedback.length})
          </h3>

          <div className="space-y-3">
            {feedback.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E5EEE5] p-5 space-y-3 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#12372A]">{item.customerName}</span>
                      <span className="text-[10px] font-mono text-[#202923]/50 font-bold">
                        Order #{item.orderId}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mt-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#12372A]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#202923]/80 italic bg-[#F7F5EF] p-3 rounded-xl border border-[#12372A]/5">
                  "{item.comments}"
                </p>

                {/* Actionable warehouse improvement */}
                {item.actionableRecommendation && (
                  <div className="bg-[#E5EEE5]/60 border border-[#1E8E63]/30 p-3 rounded-xl flex items-start gap-2.5 text-xs">
                    <Lightbulb className="w-4 h-4 text-[#1E8E63] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#12372A]">AI Warehouse Recommendation: </span>
                      <span className="text-[#202923]/80">{item.actionableRecommendation}</span>
                    </div>
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
