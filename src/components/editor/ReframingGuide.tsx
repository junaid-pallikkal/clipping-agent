import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { AspectRatioMode } from '@/types';
import { Smartphone, Square, Monitor, Eye } from 'lucide-react';

export const ReframingGuide: React.FC = () => {
  const { activeClip, setAspectRatio, setCropCenterX } = useEditorStore();

  if (!activeClip) return null;

  const ratios: Array<{ id: AspectRatioMode; label: string; icon: React.ReactNode; desc: string }> = [
    { id: '9:16', label: '9:16 Vertical', icon: <Smartphone className="w-4 h-4" />, desc: 'TikTok, Reels, Shorts' },
    { id: '1:1', label: '1:1 Square', icon: <Square className="w-4 h-4" />, desc: 'Instagram Feed, LinkedIn' },
    { id: '16:9', label: '16:9 Landscape', icon: <Monitor className="w-4 h-4" />, desc: 'YouTube, Web' },
  ];

  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block text-xs font-semibold text-[#202124] mb-2">
          Target Aspect Ratio
        </label>
        <div className="space-y-2">
          {ratios.map((r) => (
            <button
              key={r.id}
              onClick={() => setAspectRatio(r.id)}
              className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                activeClip.aspect_ratio === r.id
                  ? 'border-[#E54848] bg-[#FFF1F0]/30 text-[#202124] font-semibold'
                  : 'border-[#EEEEEE] hover:border-zinc-300 bg-white text-[#747474]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={activeClip.aspect_ratio === r.id ? 'text-[#E54848]' : 'text-zinc-500'}>
                  {r.icon}
                </span>
                <div>
                  <div className="text-xs font-semibold text-[#202124]">{r.label}</div>
                  <div className="text-[10px] text-[#747474]">{r.desc}</div>
                </div>
              </div>
              {activeClip.aspect_ratio === r.id && (
                <div className="w-2 h-2 rounded-full bg-[#E54848]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeClip.aspect_ratio === '9:16' && (
        <div className="pt-3 border-t border-[#EEEEEE] space-y-3">
          <label className="block text-xs font-semibold text-[#202124] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#E54848]" />
            <span>Active Speaker Tracking Offset</span>
          </label>
          <div className="flex items-center justify-between text-[11px] text-[#747474]">
            <span>Left Anchor</span>
            <span className="font-mono font-bold text-[#202124]">
              {Math.round(activeClip.crop_center_x * 100)}%
            </span>
            <span>Right Anchor</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={activeClip.crop_center_x}
            onChange={(e) => setCropCenterX(parseFloat(e.target.value))}
            className="w-full accent-[#E54848] cursor-pointer"
          />

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 text-[11px] text-zinc-600 leading-relaxed">
            AI automatically tracks the active speaker’s face. Adjust the slider above to offset the center frame if text or props are obscured.
          </div>
        </div>
      )}
    </div>
  );
};
