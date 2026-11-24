import React from 'react';
import { Scissors, Sliders, Sparkles, ArrowRight } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useAutoPilotStore } from '@/stores/autoPilotStore';

export const HeroActionCards: React.FC = () => {
  const { setActiveView, setQuickModeOpen, setUploadModalOpen } = useWorkspaceStore();
  const { setWizardOpen } = useAutoPilotStore();

  const actions = [
    {
      id: 'create-clips',
      title: 'Create Clips from Long Video',
      description: 'Upload a podcast, interview, or YouTube link. AI finds viral hooks, adds karaoke subtitles, and auto-reframes to 9:16.',
      badge: 'Most Popular',
      icon: <Scissors className="w-6 h-6 text-[#E54848]" />,
      iconBg: 'bg-[#FFF1F0]',
      primaryBtnText: 'Quick Clip Mode',
      onPrimaryClick: () => setQuickModeOpen(true),
      secondaryBtnText: 'Custom Upload',
      onSecondaryClick: () => setUploadModalOpen(true),
    },
    {
      id: 'edit-video',
      title: 'Edit in Video Studio',
      description: 'Fine-tune existing clips on a professional timeline. Adjust animated captions, B-roll, music ducking, and 4K crop.',
      badge: 'Studio Suite',
      icon: <Sliders className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-blue-50',
      primaryBtnText: 'Open Editor',
      onPrimaryClick: () => setActiveView('studio'),
      secondaryBtnText: 'Browse Clips',
      onSecondaryClick: () => setActiveView('projects'),
    },
    {
      id: 'automate-social',
      title: 'Automate Content Auto-Pilot',
      description: 'Set your publishing schedule once. Let AI ingest new episodes, extract highlights, and post to Instagram, TikTok & YouTube.',
      badge: 'Hands-Free',
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-50',
      primaryBtnText: 'Configure Pipeline',
      onPrimaryClick: () => {
        setActiveView('autopilot');
        setWizardOpen(true);
      },
      secondaryBtnText: 'View Calendar',
      onSecondaryClick: () => setActiveView('calendar'),
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
          What do you want to create today?
        </h2>
        <p className="text-sm text-[#747474] mt-0.5">
          One video input. Multiple viral clips. Automatic multi-channel distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((act) => (
          <div
            key={act.id}
            className="group relative bg-white rounded-2xl p-5 border border-[#EEEEEE] hover:border-[#E54848]/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${act.iconBg}`}>
                  {act.icon}
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/50">
                  {act.badge}
                </span>
              </div>

              <h3 className="text-base font-semibold text-[#202124] group-hover:text-[#E54848] transition-colors">
                {act.title}
              </h3>
              <p className="text-xs text-[#747474] mt-2 leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EEEEEE] flex items-center gap-2">
              <button
                onClick={act.onPrimaryClick}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#E54848] text-white hover:bg-[#C93636] transition-colors cursor-pointer"
              >
                <span>{act.primaryBtnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={act.onSecondaryClick}
                className="py-2 px-3 rounded-lg text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200/80 transition-colors cursor-pointer"
              >
                {act.secondaryBtnText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
