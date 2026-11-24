import React from 'react';
import { useCreditStore } from '@/stores/creditStore';
import { Clock, Sparkles } from 'lucide-react';

export const CreditCounter: React.FC = () => {
  const { quota, setUpgradeModalOpen } = useCreditStore();

  const isUnlimited = quota.transcription_minutes_limit >= 99999;
  const minutesRemaining = Math.max(0, quota.transcription_minutes_limit - quota.transcription_minutes_used);
  const minutesPct = isUnlimited ? 0 : Math.min(100, (quota.transcription_minutes_used / quota.transcription_minutes_limit) * 100);

  const tierColors = {
    free: 'bg-zinc-100 text-zinc-700',
    creator: 'bg-blue-50 text-blue-700 border-blue-200/50',
    pro: 'bg-[#FFF1F0] text-[#E54848] border-[#E54848]/20',
    agency: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  };

  return (
    <div
      onClick={() => setUpgradeModalOpen(true)}
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#EEEEEE] hover:border-zinc-300 bg-white hover:bg-zinc-50/50 transition-all cursor-pointer select-none group"
    >
      <div className="flex items-center gap-1.5">
        {isUnlimited ? (
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Clock className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#E54848] transition-colors" />
        )}
        <span className="text-xs font-semibold text-[#202124]">
          {isUnlimited ? 'Unlimited Free' : `${minutesRemaining.toFixed(0)}m left`}
        </span>
      </div>

      {!isUnlimited && (
        <div className="hidden sm:block w-12 bg-zinc-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#E54848] h-full rounded-full transition-all"
            style={{ width: `${minutesPct}%` }}
          />
        </div>
      )}

      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierColors[quota.tier]}`}>
        {isUnlimited ? 'UNLIMITED VIP' : quota.tier}
      </span>

      <span className="hidden md:inline-flex items-center text-[11px] font-semibold text-emerald-600">
        <Sparkles className="w-3 h-3 mr-0.5 fill-current" />
        {isUnlimited ? 'Free Plan' : 'Upgrade'}
      </span>
    </div>
  );
};
