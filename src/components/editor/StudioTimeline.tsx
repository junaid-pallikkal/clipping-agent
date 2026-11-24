import React, { useRef } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { formatTimecode } from '@/lib/timecode';
import { ZoomIn, ZoomOut, Scissors, Music, MessageSquare } from 'lucide-react';

export const StudioTimeline: React.FC = () => {
  const {
    activeClip,
    currentTime,
    duration,
    zoomLevel,
    setCurrentTime,
    setZoomLevel,
  } = useEditorStore();

  const { transcripts } = useWorkspaceStore();
  const timelineRef = useRef<HTMLDivElement>(null);

  if (!activeClip) return null;

  const transcript = transcripts[activeClip.video_asset_id];

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = clickRatio * duration;
    setCurrentTime(newTime);
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  return (
    <div className="w-full bg-white border border-[#EEEEEE] rounded-2xl p-4 shadow-xs select-none">
      {/* Header Tools */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EEEEEE] text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#202124]">Multi-Track Timeline</span>
          <span className="text-[11px] text-[#747474] font-mono">
            Trim Range: {formatTimecode(activeClip.start_time)} - {formatTimecode(activeClip.end_time)} ({duration.toFixed(1)}s)
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
            className="p-1 rounded text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-zinc-600">{zoomLevel.toFixed(1)}x</span>
          <button
            onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
            className="p-1 rounded text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Timeline Body */}
      <div
        ref={timelineRef}
        onClick={handleTimelineClick}
        className="relative h-32 bg-[#FAFAFA] rounded-xl border border-zinc-200/80 overflow-hidden cursor-pointer"
      >
        {/* Time Ruler */}
        <div className="h-5 bg-zinc-100/90 border-b border-zinc-200 flex items-center justify-between px-2 text-[9px] font-mono text-zinc-500">
          <span>00:00</span>
          <span>{formatTimecode(duration * 0.25)}</span>
          <span>{formatTimecode(duration * 0.5)}</span>
          <span>{formatTimecode(duration * 0.75)}</span>
          <span>{formatTimecode(duration)}</span>
        </div>

        {/* Track 1: Video Boundaries */}
        <div className="h-9 px-2 flex items-center border-b border-zinc-100 relative">
          <div className="w-6 shrink-0 flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
            <Scissors className="w-3 h-3 text-[#E54848]" />
          </div>
          <div className="flex-1 h-6 bg-red-100/60 border border-[#E54848]/40 rounded flex items-center px-2 text-[10px] font-semibold text-[#E54848] overflow-hidden whitespace-nowrap">
            {activeClip.title}
          </div>
        </div>

        {/* Track 2: Speech Word Cues */}
        <div className="h-8 px-2 flex items-center border-b border-zinc-100 relative overflow-hidden">
          <div className="w-6 shrink-0 flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
            <MessageSquare className="w-3 h-3 text-blue-500" />
          </div>
          <div className="flex-1 flex gap-1 h-5 items-center overflow-hidden">
            {transcript?.words.slice(0, 18).map((w, idx) => (
              <span
                key={idx}
                className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200/50 text-blue-700 whitespace-nowrap font-medium"
              >
                {w.word}
              </span>
            ))}
          </div>
        </div>

        {/* Track 3: Audio Music Stem & Ducking Waveform */}
        <div className="h-8 px-2 flex items-center relative">
          <div className="w-6 shrink-0 flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
            <Music className="w-3 h-3 text-emerald-600" />
          </div>
          <div className="flex-1 flex items-center gap-0.5 h-4 px-1">
            {Array.from({ length: 48 }).map((_, i) => {
              const h = Math.sin(i * 0.4) * 8 + 10;
              return (
                <div
                  key={i}
                  className="flex-1 bg-emerald-400/80 rounded-full"
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Playhead Scrubber */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#E54848] pointer-events-none transition-all duration-75 z-20"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="w-3 h-3 bg-[#E54848] rounded-full -translate-x-[5px] -translate-y-0.5 shadow-sm" />
        </div>
      </div>
    </div>
  );
};
