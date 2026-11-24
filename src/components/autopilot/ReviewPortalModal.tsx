import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useAutoPilotStore } from '@/stores/autoPilotStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { CheckCircle2, ShieldCheck, Play } from 'lucide-react';

export const ReviewPortalModal: React.FC = () => {
  const { isReviewPortalOpen, reviewPortalClipId, setReviewPortalOpen, approveClip, rejectClip } = useAutoPilotStore();
  const { clips } = useWorkspaceStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [comment, setComment] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const clip = clips.find((c) => c.id === reviewPortalClipId) || clips[0];

  const handleApprove = () => {
    if (clip) {
      approveClip(clip.id);
      setIsApproved(true);
      setTimeout(() => {
        setIsApproved(false);
        setReviewPortalOpen(false);
      }, 1500);
    }
  };

  const handleRequestChanges = () => {
    if (clip) {
      rejectClip(clip.id, comment);
      setReviewPortalOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isReviewPortalOpen}
      onClose={() => setReviewPortalOpen(false)}
      title="Client Review Portal (Guest Preview)"
      description="Experience the external review interface delivered to clients via secure signed tokens."
      size="lg"
    >
      {isApproved ? (
        <div className="py-10 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-base font-bold text-[#202124]">Post Approved for Publication!</h4>
          <p className="text-xs text-[#747474]">
            This clip has been added to the automated publishing calendar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Vertical Video Preview Frame */}
          <div className="flex flex-col items-center">
            <div className="relative aspect-[9/16] w-56 bg-black rounded-2xl overflow-hidden shadow-xl border border-zinc-800 flex items-center justify-center">
              <video
                src={clip?.video_url}
                className="w-full h-full object-cover"
                loop
                autoPlay={isPlaying}
                playsInline
              />

              {/* Subtitle overlay preview */}
              <div className="absolute bottom-16 left-2 right-2 text-center pointer-events-none">
                <span className="inline-block bg-black/80 px-2.5 py-1 rounded text-yellow-400 font-black text-xs uppercase tracking-wide">
                  {clip?.hook_sentence || 'ONE VIDEO. MULTIPLE VIRAL CLIPS.'}
                </span>
              </div>

              {/* Play toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 text-white cursor-pointer"
              >
                {!isPlaying && (
                  <div className="w-12 h-12 rounded-full bg-[#E54848] flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Reviewer Action Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Client Review Link</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#202124] leading-tight">
                {clip?.title}
              </h3>
              <p className="text-xs text-[#747474] mt-1.5 leading-relaxed">
                {clip?.summary}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
              <span className="block text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1">
                Suggested Post Caption
              </span>
              <p className="text-[#202124] line-clamp-3">
                {clip?.hook_sentence} #shorts #entrepreneur #viral
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                Need Revisions? Leave Notes for the Editor
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please change subtitle color to white or trim the end by 2 seconds."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRequestChanges}
                disabled={!comment}
              >
                Request Revisions
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleApprove}
              >
                Approve Clip
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
