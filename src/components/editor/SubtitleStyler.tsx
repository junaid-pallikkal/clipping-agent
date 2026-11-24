import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { SubtitleStyleConfig } from '@/types';
import { Sparkles } from 'lucide-react';

export const SubtitleStyler: React.FC = () => {
  const { activeClip, setSubtitlePreset, updateSubtitleStyle } = useEditorStore();

  if (!activeClip) return null;
  const sub = activeClip.subtitles;

  const presets: Array<{ id: SubtitleStyleConfig['preset']; name: string; highlight: string; bg: string }> = [
    { id: 'hormozi_bold', name: 'Hormozi Pop', highlight: '#FACC15', bg: 'bg-zinc-900 text-yellow-400' },
    { id: 'mrbeast_pop', name: 'MrBeast Viral', highlight: '#E54848', bg: 'bg-zinc-900 text-red-500' },
    { id: 'minimal_clean', name: 'Minimal Clean', highlight: '#E54848', bg: 'bg-zinc-100 text-zinc-900' },
    { id: 'cyber_glow', name: 'Cyber Neon', highlight: '#F43F5E', bg: 'bg-slate-950 text-cyan-400' },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Preset Cards */}
      <div>
        <label className="block text-xs font-semibold text-[#202124] mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E54848]" />
          <span>Viral Style Presets</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setSubtitlePreset(p.id)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                sub.preset === p.id
                  ? 'border-[#E54848] ring-2 ring-[#E54848]/20 bg-white'
                  : 'border-[#EEEEEE] hover:border-zinc-300 bg-white'
              }`}
            >
              <div className={`py-1 px-2 rounded-lg text-[11px] mb-1 font-black ${p.bg}`}>
                SAMPLE TEXT
              </div>
              <span className="text-[11px] text-[#202124] font-medium">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Granular Sliders */}
      <div className="pt-3 border-t border-[#EEEEEE] space-y-3">
        {/* Font Size */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-[#202124] mb-1">
            <span>Font Size</span>
            <span className="font-mono text-[#747474]">{sub.font_size}px</span>
          </div>
          <input
            type="range"
            min={20}
            max={48}
            value={sub.font_size}
            onChange={(e) => updateSubtitleStyle({ font_size: parseInt(e.target.value) })}
            className="w-full accent-[#E54848] cursor-pointer"
          />
        </div>

        {/* Vertical Position */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-[#202124] mb-1">
            <span>Vertical Safe Position</span>
            <span className="font-mono text-[#747474]">{sub.position_y_percent}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={85}
            value={sub.position_y_percent}
            onChange={(e) => updateSubtitleStyle({ position_y_percent: parseInt(e.target.value) })}
            className="w-full accent-[#E54848] cursor-pointer"
          />
        </div>

        {/* Stroke Outline */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-[#202124] mb-1">
            <span>Stroke Outline</span>
            <span className="font-mono text-[#747474]">{sub.stroke_width}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={8}
            value={sub.stroke_width}
            onChange={(e) => updateSubtitleStyle({ stroke_width: parseInt(e.target.value) })}
            className="w-full accent-[#E54848] cursor-pointer"
          />
        </div>

        {/* Words per batch */}
        <div>
          <label className="block text-[11px] font-medium text-[#202124] mb-1.5">
            Words Per On-Screen Batch
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => updateSubtitleStyle({ words_per_batch: count })}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  sub.words_per_batch === count
                    ? 'bg-[#E54848] text-white border-[#E54848]'
                    : 'border-[#EEEEEE] text-[#747474] hover:bg-zinc-50'
                }`}
              >
                {count} {count === 1 ? 'word' : 'words'}
              </button>
            ))}
          </div>
        </div>

        {/* Uppercase Toggle */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-medium text-[#202124]">Uppercase All Caps</span>
          <button
            onClick={() => updateSubtitleStyle({ uppercase: !sub.uppercase })}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              sub.uppercase ? 'bg-[#E54848]' : 'bg-zinc-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                sub.uppercase ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
