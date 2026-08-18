import React from 'react';
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
} from 'lucide-react';

export const DecisionLogView: React.FC = () => {
  const { decisionLogs } = useWarehouse();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#12372A] tracking-tight">
          Explainable Decision History & Immutable Audit Log
        </h2>
        <p className="text-xs text-[#202923]/70">
          Transparent record of every autonomous AI recommendation, human override, and routing decision.
        </p>
      </div>

      {/* Decision Logs Stream */}
      <div className="space-y-4">
        {decisionLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-2xl border border-[#E5EEE5] p-5 space-y-4 shadow-xs"
          >
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5EEE5]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#12372A] text-white flex items-center justify-center font-bold">
                  {log.acceptedBy.includes('AI') ? (
                    <Bot className="w-5 h-5 text-[#A7D46F]" />
                  ) : (
                    <User className="w-5 h-5 text-[#A7D46F]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#12372A]">{log.id}</span>
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#E5EEE5] text-[#12372A]">
                      {log.decisionType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-[#202923]/60 font-mono">
                      Order #{log.orderId}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#202923]/60 mt-0.5">
                    Authorized by <strong>{log.acceptedBy.replace(/_/g, ' ')}</strong> · {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Confidence badge */}
              <div className="text-right font-mono">
                <span className="text-xs font-bold text-[#1E8E63] bg-[#E5EEE5] px-2.5 py-1 rounded-full">
                  {log.confidenceScore}% Confidence
                </span>
              </div>
            </div>

            {/* Action & Reason */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#202923]/60 font-semibold block">
                  Action Executed
                </span>
                <strong className="text-sm text-[#12372A] font-semibold">{log.action}</strong>
              </div>

              <div className="bg-[#F7F5EF] p-3.5 rounded-xl border border-[#12372A]/10 space-y-1">
                <span className="font-bold text-[#12372A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E8E63]" />
                  Decision Rationale:
                </span>
                <p className="text-[#202923]/80 leading-relaxed">{log.reason}</p>
              </div>
            </div>

            {/* Rejected Alternatives & Expected Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              {log.alternativeOptions.length > 0 && (
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/50 space-y-1">
                  <span className="font-bold text-red-900 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    Rejected Alternative:
                  </span>
                  <div className="text-[11px] text-red-800">
                    <strong>{log.alternativeOptions[0].option}</strong>
                    <div className="text-[10px] text-red-600 mt-0.5">
                      Rejected because: {log.alternativeOptions[0].rejectedReason}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-[#E5EEE5]/40 rounded-xl border border-[#1E8E63]/20 space-y-1">
                <span className="font-bold text-[#12372A] flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E63]" />
                  Expected Operational Impact:
                </span>
                <div className="text-[11px] text-[#202923]/80 font-medium">{log.expectedImpact}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
