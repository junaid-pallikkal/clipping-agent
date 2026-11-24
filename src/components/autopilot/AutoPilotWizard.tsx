import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useAutoPilotStore } from '@/stores/autoPilotStore';
import { useSocialStore } from '@/stores/socialStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { YoutubeIcon, InstagramIcon, TikTokIcon, FacebookIcon } from '@/components/common/PlatformIcons';
import { Sparkles, Plus, AlertCircle } from 'lucide-react';

export const AutoPilotWizard: React.FC = () => {
  const { isWizardOpen, setWizardOpen, createRule } = useAutoPilotStore();
  const { accounts, setConnectModalOpen } = useSocialStore();
  const { currentWorkspace } = useWorkspaceStore();

  const [ruleName, setRuleName] = useState('Daily Viral Pipeline');
  const [sourceTarget, setSourceTarget] = useState('https://youtube.com/@techchannel');
  const [clipsPerVideo, setClipsPerVideo] = useState(5);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    accounts.map((a) => a.id).slice(0, 2)
  );
  const [requiresApproval, setRequiresApproval] = useState(true);

  const toggleAccount = (accId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accId) ? prev.filter((id) => id !== accId) : [...prev, accId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRule({
      workspace_id: currentWorkspace.id,
      name: ruleName,
      is_enabled: true,
      source_type: 'youtube_channel',
      source_target: sourceTarget,
      clips_per_video: clipsPerVideo,
      preferred_duration_range: [20, 45],
      target_account_ids: selectedAccounts,
      publishing_frequency: 'daily',
      publishing_times: ['11:30', '18:30'],
      requires_approval: requiresApproval,
      auto_subtitles_preset: 'mrbeast_pop',
      bg_music_genre: 'upbeat_tech_drive',
    });
  };

  return (
    <Modal
      isOpen={isWizardOpen}
      onClose={() => setWizardOpen(false)}
      title="Create Autonomous Auto-Pilot Rule"
      description="Configure your end-to-end content production flywheel from video ingest to social publishing."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#202124] mb-1">Pipeline Name</label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            required
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#202124] mb-1">
            Source Channel / Target
          </label>
          <input
            type="text"
            placeholder="e.g. YouTube Channel URL or Show Name"
            value={sourceTarget}
            onChange={(e) => setSourceTarget(e.target.value)}
            required
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
          />
        </div>

        {/* Clips per source video */}
        <div>
          <label className="block text-xs font-semibold text-[#202124] mb-1.5">
            Clips Extracted Per Episode
          </label>
          <div className="flex gap-2">
            {[3, 5, 8, 12].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setClipsPerVideo(num)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  clipsPerVideo === num
                    ? 'bg-[#E54848] text-white border-[#E54848]'
                    : 'border-[#EEEEEE] text-[#747474] hover:bg-zinc-50'
                }`}
              >
                {num} clips
              </button>
            ))}
          </div>
        </div>

        {/* Target accounts multi-select */}
        <div>
          <label className="block text-xs font-semibold text-[#202124] mb-1.5">
            Publishing Channels (YouTube Shorts & Instagram Reels)
          </label>
          {accounts.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>No publishing channels connected</span>
              </div>
              <p className="text-[11px] text-amber-700">
                Connect your YouTube Shorts or Instagram Reels account so Auto-Pilot knows where to publish.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setWizardOpen(false);
                  setConnectModalOpen(true);
                }}
              >
                Connect Channel
              </Button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {accounts.map((a) => {
                const isSelected = selectedAccounts.includes(a.id);
                return (
                  <div
                    key={a.id}
                    onClick={() => toggleAccount(a.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected ? 'border-[#E54848] bg-[#FFF1F0]/40 font-semibold' : 'border-[#EEEEEE] hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {a.platform === 'youtube' && <YoutubeIcon className="w-4 h-4 text-red-600" />}
                      {a.platform === 'instagram' && <InstagramIcon className="w-4 h-4 text-pink-600" />}
                      {a.platform === 'tiktok' && <TikTokIcon className="w-4 h-4 text-black" />}
                      {a.platform === 'facebook' && <FacebookIcon className="w-4 h-4 text-blue-600" />}
                      <span className="text-xs text-[#202124]">{a.account_name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">({a.account_handle})</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#E54848] rounded pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Approval Gate */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#202124] block">
              Require Human Review Before Publishing
            </span>
            <span className="text-[10px] text-[#747474]">
              When enabled, clips land in the Approval Queue before going live.
            </span>
          </div>
          <input
            type="checkbox"
            checked={requiresApproval}
            onChange={(e) => setRequiresApproval(e.target.checked)}
            className="w-4 h-4 accent-[#E54848] rounded cursor-pointer"
          />
        </div>

        <div className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between">
          <Button variant="ghost" type="button" onClick={() => setWizardOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Activate Auto-Pilot
          </Button>
        </div>
      </form>
    </Modal>
  );
};
