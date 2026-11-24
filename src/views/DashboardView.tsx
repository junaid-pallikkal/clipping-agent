import React from 'react';
import { HeroActionCards } from '@/components/dashboard/HeroActionCards';
import { ViralityGauge } from '@/components/dashboard/ViralityGauge';
import { Button } from '@/components/common/Button';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useEditorStore } from '@/stores/editorStore';
import { useSocialStore } from '@/stores/socialStore';
import { useAutoPilotStore } from '@/stores/autoPilotStore';
import { YoutubeIcon, InstagramIcon } from '@/components/common/PlatformIcons';
import {
  Sparkles,
  Sliders,
  Send,
  Play,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { clips, setActiveView } = useWorkspaceStore();
  const { setActiveClip } = useEditorStore();
  const { accounts, setSelectedPostForSchedule } = useSocialStore();
  const { rules } = useAutoPilotStore();

  const handleEditClip = (clip: (typeof clips)[0]) => {
    setActiveClip(clip);
    setActiveView('studio');
  };

  const handleScheduleClip = (clipId: string) => {
    setSelectedPostForSchedule({ clipId });
  };

  return (
    <div className="space-y-8">
      {/* 1. Primary Action Hero: What do you want to create today? */}
      <HeroActionCards />

      {/* 2. Top Viral Highlights (Extracted Candidate Clips) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#202124] tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E54848]" />
              <span>Recommended Viral Highlights</span>
            </h3>
            <p className="text-xs text-[#747474] mt-0.5">
              Ranked by AI hook strength, emotional peak, and pacing algorithms.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={() => setActiveView('projects')}>
            View All ({clips.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clips.slice(0, 3).map((clip) => (
            <div
              key={clip.id}
              className="group bg-white rounded-2xl border border-[#EEEEEE] hover:border-[#E54848]/40 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* 9:16 Thumbnail Container with Preview Trigger */}
                <div
                  className="relative aspect-[16/10] bg-black overflow-hidden cursor-pointer"
                  onClick={() => handleEditClip(clip)}
                >
                  <img
                    src={clip.thumbnail_url}
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                    <span className="text-xs font-semibold text-white line-clamp-1 drop-shadow-sm">
                      {clip.hook_sentence}
                    </span>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-[#E54848] text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <span className="absolute top-2 right-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-xs">
                    {clip.duration_seconds.toFixed(0)}s
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <ViralityGauge score={clip.virality_score} breakdown={clip.virality_breakdown} size="md" />
                    <span className="text-[10px] text-zinc-400 font-medium">9:16 Vertical</span>
                  </div>

                  <h4 className="text-sm font-semibold text-[#202124] line-clamp-1 group-hover:text-[#E54848] transition-colors">
                    {clip.title}
                  </h4>
                  <p className="text-xs text-[#747474] line-clamp-2 mt-1 leading-relaxed">
                    {clip.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#EEEEEE] flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleEditClip(clip)}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-[#202124] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Studio</span>
                </button>
                <button
                  onClick={() => handleScheduleClip(clip.id)}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#E54848] hover:bg-[#C93636] text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. System Status Snapshot: Auto-Pilot & Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Auto-Pilot Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#EEEEEE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#202124]">Auto-Pilot Engine</h4>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                Active & Running
              </span>
            </div>
            <p className="text-xs text-[#747474] leading-relaxed">
              Monitoring {rules.length} configured source pipelines. Automatically cuts, captions, and posts approved reels daily at 11:30 AM and 6:30 PM.
            </p>
          </div>

          <div className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between mt-4">
            <span className="text-[11px] font-mono text-zinc-500">
              Next scheduled run: Today, 6:30 PM EST
            </span>
            <button
              onClick={() => setActiveView('autopilot')}
              className="text-xs font-semibold text-[#E54848] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Rules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Connected Channels Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#EEEEEE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <YoutubeIcon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#202124]">Connected Channels</h4>
              </div>
              <span className="text-xs font-semibold text-[#202124]">
                {accounts.length} Accounts Active
              </span>
            </div>
            <div className="flex flex-wrap gap-2 my-2">
              {accounts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200/60 text-xs text-zinc-800"
                >
                  {a.platform === 'youtube' && <YoutubeIcon className="w-3.5 h-3.5 text-red-600" />}
                  {a.platform === 'instagram' && <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />}
                  <span className="font-medium">{a.account_handle}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between mt-4">
            <span className="text-[11px] text-zinc-500">All OAuth tokens valid</span>
            <button
              onClick={() => setActiveView('social')}
              className="text-xs font-semibold text-[#E54848] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Channel Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
