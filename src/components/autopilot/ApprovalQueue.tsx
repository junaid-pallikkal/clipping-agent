import React from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useAutoPilotStore } from '@/stores/autoPilotStore';
import { useEditorStore } from '@/stores/editorStore';
import { ViralityGauge } from '@/components/dashboard/ViralityGauge';
import { Button } from '@/components/common/Button';
import { Check, X, Share2, Sliders } from 'lucide-react';

export const ApprovalQueue: React.FC = () => {
  const { clips, setActiveView } = useWorkspaceStore();
  const { approveClip, rejectClip, setReviewPortalOpen } = useAutoPilotStore();
  const { setActiveClip } = useEditorStore();

  const pendingClips = clips.filter((c) => c.status === 'pending_approval');

  if (pendingClips.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EEEEEE] p-8 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Check className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-[#202124]">Approval Queue is Clear</h4>
        <p className="text-xs text-[#747474]">
          All extracted clips have been approved or dispatched to the publishing schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingClips.map((clip) => (
        <div
          key={clip.id}
          className="bg-white rounded-2xl p-4 border border-[#EEEEEE] hover:border-zinc-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
        >
          {/* Clip Details */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-20 rounded-xl bg-black overflow-hidden relative shrink-0">
              <img
                src={clip.thumbnail_url}
                alt={clip.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white font-mono px-1 rounded">
                {clip.duration_seconds.toFixed(0)}s
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <ViralityGauge score={clip.virality_score} size="sm" />
                <span className="text-[10px] text-zinc-400 font-mono">
                  {clip.aspect_ratio} Vertical
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#202124] line-clamp-1">{clip.title}</h4>
              <p className="text-xs text-[#747474] line-clamp-1 mt-0.5">{clip.hook_sentence}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {/* External Client Portal Link */}
            <button
              onClick={() => setReviewPortalOpen(true, clip.id)}
              className="py-1.5 px-3 rounded-lg text-xs font-medium text-zinc-600 border border-[#EEEEEE] hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer"
              title="Open client review view"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Review Portal</span>
            </button>

            {/* Edit in Studio */}
            <button
              onClick={() => {
                setActiveClip(clip);
                setActiveView('studio');
              }}
              className="py-1.5 px-3 rounded-lg text-xs font-medium text-zinc-600 border border-[#EEEEEE] hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Fine-Tune</span>
            </button>

            {/* Reject */}
            <button
              onClick={() => rejectClip(clip.id)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
              title="Reject clip"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Approve */}
            <Button
              variant="primary"
              size="sm"
              icon={<Check className="w-3.5 h-3.5" />}
              onClick={() => approveClip(clip.id)}
            >
              Approve Post
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
