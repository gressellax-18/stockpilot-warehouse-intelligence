import React from 'react';
import { useWarehouse, DEMO_STEPS } from '../context/WarehouseContext';
import {
  PlayCircle,
  PauseCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const DemoController: React.FC = () => {
  const {
    demoState,
    nextDemoStep,
    prevDemoStep,
    stopDemo,
    toggleDemoAutoPlay,
    runDemoStep,
  } = useWarehouse();

  if (!demoState.active) return null;

  const currentStepData = DEMO_STEPS.find((s) => s.stepNumber === demoState.currentStep) || DEMO_STEPS[0];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl bg-[#12372A] text-white rounded-2xl p-4 shadow-2xl border-2 border-[#A7D46F]/50 z-50 animate-slide-up">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E8E63]/30">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A7D46F] animate-ping" />
          <span className="text-xs font-mono font-bold text-[#A7D46F] uppercase tracking-wider">
            StockPilot 15-Step Guided Walkthrough
          </span>
          <span className="text-xs text-white/50 font-mono">
            (Step {demoState.currentStep} of 15)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Step Selector Dropdown */}
          <select
            value={demoState.currentStep}
            onChange={(e) => runDemoStep(Number(e.target.value))}
            className="bg-[#1E8E63]/30 text-xs text-[#A7D46F] font-bold px-2.5 py-1 rounded-lg border border-[#1E8E63]/50 focus:outline-none cursor-pointer"
          >
            {DEMO_STEPS.map((s) => (
              <option key={s.stepNumber} value={s.stepNumber} className="bg-[#12372A] text-white">
                Step {s.stepNumber}: {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={stopDemo}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
            title="Exit Demo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main step content */}
      <div className="py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-white tracking-tight">{currentStepData.title}</h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-[#A7D46F] text-[#12372A]">
              {currentStepData.tagline}
            </span>
          </div>
          <p className="text-xs text-[#E5EEE5]/85 leading-relaxed">{currentStepData.description}</p>

          {/* Metric chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentStepData.impactMetrics.map((m, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border border-white/10 text-[#A7D46F]"
              >
                {m.label}: <strong>{m.value}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
          <button
            onClick={prevDemoStep}
            disabled={demoState.currentStep <= 1}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={toggleDemoAutoPlay}
            id="btn-demo-autoplay"
            className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              demoState.isAutoPlaying
                ? 'bg-[#F3B562] text-[#12372A]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {demoState.isAutoPlaying ? (
              <>
                <PauseCircle className="w-4 h-4" />
                <span>Pause (6s)</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>Auto-Play</span>
              </>
            )}
          </button>

          <button
            onClick={nextDemoStep}
            disabled={demoState.currentStep >= 15}
            id="btn-demo-next-step"
            className="py-2 px-4 rounded-xl bg-[#1E8E63] hover:bg-[#A7D46F] hover:text-[#12372A] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-40"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
