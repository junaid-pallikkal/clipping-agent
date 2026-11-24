import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useSocialStore } from '@/stores/socialStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Calendar as CalendarIcon, Clock, Send, Plus, AlertCircle } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  clipId: string;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, clipId }) => {
  const { accounts, schedulePost, setConnectModalOpen } = useSocialStore();
  const { clips } = useWorkspaceStore();

  const clip = clips.find((c) => c.id === clipId);

  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [caption, setCaption] = useState(
    clip ? `${clip.hook_sentence}\n\n${clip.summary}\n\n#viral #shorts #productivity #ai` : ''
  );
  const [date, setDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [requiresApproval, setRequiresApproval] = useState(false);

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clip || !selectedAccountId) return;

    const scheduledDateTime = new Date(`${date}T${time}:00Z`).toISOString();

    schedulePost({
      workspace_id: clip.workspace_id,
      clip_id: clip.id,
      account_id: selectedAccountId,
      title: clip.title,
      caption,
      tags: ['viral', 'shorts', 'reels'],
      scheduled_for: scheduledDateTime,
      status: requiresApproval ? 'draft' : 'scheduled',
      requires_approval: requiresApproval,
    });

    onClose();
  };

  const addHashtags = (tagString: string) => {
    setCaption((prev) => `${prev.trim()} ${tagString}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Video to Social Channels"
      description="Queue your clip for automatic publication at optimal mobile engagement hours."
      size="md"
    >
      <form onSubmit={handleSchedule} className="space-y-4">
        {/* Account Selector */}
        {accounts.length === 0 ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>No connected accounts found</span>
            </div>
            <p className="text-[11px] text-amber-700">
              Connect your YouTube Shorts or Instagram Reels channel to enable automated publishing.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                setConnectModalOpen(true);
              }}
            >
              Connect Account Now
            </Button>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-1.5">
              Select Social Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_name} ({a.platform.toUpperCase()} - {a.account_handle})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Caption & Hashtags */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-[#202124]">Post Caption</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => addHashtags('#entrepreneur #business')}
                className="text-[10px] text-zinc-500 hover:text-[#E54848] bg-zinc-100 px-1.5 py-0.5 rounded cursor-pointer"
              >
                +Business
              </button>
              <button
                type="button"
                onClick={() => addHashtags('#tech #ai #innovation')}
                className="text-[10px] text-zinc-500 hover:text-[#E54848] bg-zinc-100 px-1.5 py-0.5 rounded cursor-pointer"
              >
                +Tech AI
              </button>
            </div>
          </div>
          <textarea
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full text-xs p-3 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
          />
        </div>

        {/* Date and Time Pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-1">Schedule Date</label>
            <div className="relative">
              <CalendarIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-1">Posting Time</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Approval Gate Toggle */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#202124] block">
              Require Client Approval
            </span>
            <span className="text-[10px] text-[#747474]">
              Holds post in draft until client signs off on portal.
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
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            icon={<Send className="w-4 h-4" />}
          >
            Add to Content Calendar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
