import React, { useState } from 'react';
import { ViralityBreakdown } from '@/types';
import { Flame, Info, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ViralityGaugeProps {
  score: number;
  breakdown?: ViralityBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

export const ViralityGauge: React.FC<ViralityGaugeProps> = ({
  score,
  breakdown,
  size = 'md',
  showBreakdown = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Color gradient calculation
  const getColor = (val: number) => {
    if (val >= 90) return { text: 'text-[#E54848]', bg: 'bg-[#FFF1F0]', stroke: '#E54848' };
    if (val >= 75) return { text: 'text-amber-600', bg: 'bg-amber-50', stroke: '#D97706' };
    return { text: 'text-zinc-600', bg: 'bg-zinc-100', stroke: '#71717A' };
  };

  const style = getColor(score);

  if (size === 'sm') {
    return (
      <div className={clsx('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold', style.bg, style.text)}>
        <Flame className="w-3.5 h-3.5 fill-current" />
        <span>{score}% Viral Potential</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <div
        onClick={() => breakdown && setIsOpen(!isOpen)}
        className={clsx(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/80 cursor-pointer transition-all hover:border-[#E54848]/40 select-none',
          style.bg
        )}
      >
        <div className="relative flex items-center justify-center">
          <Flame className={clsx('w-4 h-4 fill-current', style.text)} />
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className={clsx('text-xs font-bold leading-none', style.text)}>{score}%</span>
            <span className="text-[10px] text-zinc-500 font-medium">Virality Score</span>
            {breakdown && <Info className="w-3 h-3 text-zinc-400 ml-0.5" />}
          </div>
        </div>
      </div>

      {/* Popover Breakdown */}
      {(isOpen || showBreakdown) && breakdown && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#EEEEEE] p-3.5 z-30 text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
            <span className="font-semibold text-zinc-800">Virality Heuristics</span>
            <span className="text-[10px] text-zinc-400">AI Engagement Model</span>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-zinc-600">Hook Strength (first 3s)</span>
                <span className="font-bold text-zinc-800">{breakdown.hook_score}/100</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#E54848] h-full rounded-full transition-all"
                  style={{ width: `${breakdown.hook_score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-zinc-600">Speech Cadence & Pacing</span>
                <span className="font-bold text-zinc-800">{breakdown.pacing_score}/100</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${breakdown.pacing_score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-zinc-600">Emotional Valence Peak</span>
                <span className="font-bold text-zinc-800">{breakdown.emotional_peak}/100</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${breakdown.emotional_peak}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-zinc-600">Retention Predictor</span>
                <span className="font-bold text-zinc-800">{breakdown.retention_score}/100</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${breakdown.retention_score}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center gap-1.5 text-[10px] text-zinc-500">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Optimal 9:16 mobile retention profile</span>
          </div>
        </div>
      )}
    </div>
  );
};
