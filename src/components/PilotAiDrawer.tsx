import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  X,
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

export const PilotAiDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, askAiAssistant, acceptRecommendation, setCurrentView } =
    useWarehouse();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      sender: 'user' | 'ai';
      text: string;
      confidence?: number;
      recommendation?: any;
    }>
  >([
    {
      sender: 'ai',
      text: 'Greetings. I am **Pilot AI**, your warehouse decision intelligence co-pilot. I analyze real-time SLA thresholds, multi-warehouse stock allocations, and worker routing bottlenecks. How may I assist your operations today?',
      confidence: 99,
    },
  ]);

  if (!isAiDrawerOpen) return null;

  const quickPrompts = [
    'Why should we partially fulfill Order #10482?',
    'Where is our biggest warehouse bottleneck today?',
    'How should we handle missing stock in Bin A-03?',
    'Simulate adding 50 LiDAR units to Hyderabad',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user' as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const response = await askAiAssistant(query);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.answer,
          confidence: response.confidence,
          recommendation: response.recommendation,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'StockPilot intelligence recommends prioritizing Order #10482 partial allocation to protect VIP contract SLA.',
          confidence: 94,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl border-l border-[#E5EEE5] z-50 flex flex-col animate-slide-left">
      {/* Header */}
      <div className="p-5 border-b border-[#E5EEE5] bg-[#12372A] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E8E63] to-[#A7D46F] flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-[#12372A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Pilot AI Co-Pilot</h2>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#A7D46F] text-[#12372A]">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-[#A7D46F]/80">Decision Intelligence Assistant</p>
          </div>
        </div>

        <button
          onClick={() => setIsAiDrawerOpen(false)}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompt Pills */}
      <div className="p-3 bg-[#F7F5EF] border-b border-[#E5EEE5] flex gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E5EEE5] border border-[#12372A]/10 text-[#12372A] whitespace-nowrap font-medium transition"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-4 rounded-2xl max-w-[90%] space-y-2 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#12372A] text-white rounded-br-none shadow-xs'
                  : 'bg-[#F7F5EF] text-[#12372A] rounded-bl-none border border-[#12372A]/10 shadow-xs'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#1E8E63] pb-1 border-b border-[#12372A]/10">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Intelligence Response
                  </span>
                  {msg.confidence && <span>{msg.confidence}% Confidence</span>}
                </div>
              )}

              <div className="whitespace-pre-line text-xs font-normal">{msg.text}</div>

              {msg.recommendation && (
                <div className="pt-2 border-t border-[#12372A]/10 flex justify-end">
                  <button
                    onClick={() => {
                      acceptRecommendation('10482');
                      setIsAiDrawerOpen(false);
                      setCurrentView('command_center');
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#1E8E63] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                  >
                    <span>Execute Recommendation</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#1E8E63] font-medium p-3 bg-[#E5EEE5] rounded-xl animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Consulting control tower decision matrix & inventory ledger...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-[#E5EEE5] bg-[#F7F5EF]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything (e.g. explain routing logic, stockout risk)..."
            className="flex-1 p-2.5 rounded-xl border border-[#12372A]/20 text-xs focus:ring-2 focus:ring-[#1E8E63] focus:outline-none bg-white font-medium"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="p-2.5 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white disabled:opacity-40 transition shadow-sm"
          >
            <Send className="w-4 h-4 text-[#A7D46F]" />
          </button>
        </form>
      </div>
    </div>
  );
};
