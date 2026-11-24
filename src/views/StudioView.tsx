import React, { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useSocialStore } from '@/stores/socialStore';
import { VideoPlayer } from '@/components/editor/VideoPlayer';
import { StudioTimeline } from '@/components/editor/StudioTimeline';
import { SubtitleStyler } from '@/components/editor/SubtitleStyler';
import { ReframingGuide } from '@/components/editor/ReframingGuide';
import { AudioDucker } from '@/components/editor/AudioDucker';
import { ExportModal } from '@/components/editor/ExportModal';
import { Button } from '@/components/common/Button';
import { ViralityGauge } from '@/components/dashboard/ViralityGauge';
import {
  Download,
  Send,
  Type,
  Crop,
  Music,
  Smartphone,
  Square,
  Monitor
} from 'lucide-react';

export const StudioView: React.FC = () => {
  const { activeClip, activeTab, setActiveTab, setActiveClip, setAspectRatio } = useEditorStore();
  const { clips } = useWorkspaceStore();
  const { setSelectedPostForSchedule } = useSocialStore();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  if (!activeClip) {
    return (
      <div className="bg-white rounded-2xl border border-[#EEEEEE] p-12 text-center space-y-3">
        <h3 className="text-base font-semibold text-[#202124]">No Clip Selected</h3>
        <p className="text-xs text-[#747474]">Select an existing clip to begin studio editing.</p>
        <Button variant="primary" onClick={() => setActiveClip(clips[0])}>
          Load Sample Clip
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Studio Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EEEEEE] shadow-xs">
        {/* Clip Selector Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={activeClip.id}
              onChange={(e) => {
                const found = clips.find((c) => c.id === e.target.value);
                if (found) setActiveClip(found);
              }}
              className="text-xs font-bold text-[#202124] py-1.5 pl-3 pr-8 rounded-xl border border-zinc-200 bg-white hover:border-[#E54848] focus:outline-none cursor-pointer max-w-xs truncate"
            >
              {clips.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.duration_seconds.toFixed(0)}s)
                </option>
              ))}
            </select>
          </div>

          <ViralityGauge score={activeClip.virality_score} size="sm" />
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-zinc-100 p-1">
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                activeClip.aspect_ratio === '9:16'
                  ? 'bg-white shadow-xs text-[#E54848]'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title="9:16 Vertical"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                activeClip.aspect_ratio === '1:1'
                  ? 'bg-white shadow-xs text-[#E54848]'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title="1:1 Square"
            >
              <Square className="w-3.5 h-3.5" />
              <span>1:1</span>
            </button>
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                activeClip.aspect_ratio === '16:9'
                  ? 'bg-white shadow-xs text-[#E54848]'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title="16:9 Landscape"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => setIsExportModalOpen(true)}
          >
            Export MP4
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Send className="w-3.5 h-3.5" />}
            onClick={() => setSelectedPostForSchedule({ clipId: activeClip.id })}
          >
            Schedule
          </Button>
        </div>
      </div>

      {/* Main Studio Canvas (Player + Sidebar Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Video Preview */}
        <div className="lg:col-span-8 bg-[#FAFAFA] rounded-2xl border border-[#EEEEEE] p-4 flex flex-col items-center justify-center min-h-[500px]">
          <VideoPlayer />
        </div>

        {/* Right Column: Customization Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EEEEEE] p-4 shadow-xs">
          {/* Sub-tabs */}
          <div className="flex border-b border-[#EEEEEE] pb-2 mb-4 gap-1">
            <button
              onClick={() => setActiveTab('subtitles')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'subtitles'
                  ? 'bg-[#FFF1F0] text-[#E54848] border border-[#E54848]/20'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Captions</span>
            </button>

            <button
              onClick={() => setActiveTab('reframe')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'reframe'
                  ? 'bg-[#FFF1F0] text-[#E54848] border border-[#E54848]/20'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Reframe</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-[#FFF1F0] text-[#E54848] border border-[#E54848]/20'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'subtitles' && <SubtitleStyler />}
          {activeTab === 'reframe' && <ReframingGuide />}
          {activeTab === 'audio' && <AudioDucker />}
        </div>
      </div>

      {/* Bottom Timeline */}
      <StudioTimeline />

      {/* Export Dialog */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
