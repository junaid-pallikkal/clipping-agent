import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Volume2, Music, Mic } from 'lucide-react';

export const AudioDucker: React.FC = () => {
  const { activeClip, setAudioConfig } = useEditorStore();

  if (!activeClip) return null;

  const musicTracks = [
    { id: 'upbeat_tech_drive', name: 'Upbeat Tech Drive', genre: 'Tech / Modern' },
    { id: 'cinematic_lofi', name: 'Chill Deep Lofi', genre: 'Podcast / Relaxed' },
    { id: 'deep_ambient_flow', name: 'Deep Ambient Flow', genre: 'Storytelling' },
    { id: 'epic_motivation', name: 'High-Tempo Energy', genre: 'Fitness / Viral' },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Speech Voice Enhancer */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-[#202124] mb-1.5">
          <span className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-[#E54848]" />
            Voice Clarity & Gain
          </span>
          <span className="font-mono text-[#747474]">
            {Math.round((activeClip.audio_speech_gain || 1.2) * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={2.0}
          step={0.05}
          value={activeClip.audio_speech_gain || 1.2}
          onChange={(e) => setAudioConfig({ speechGain: parseFloat(e.target.value) })}
          className="w-full accent-[#E54848] cursor-pointer"
        />
      </div>

      {/* Background Music Selector */}
      <div className="pt-3 border-t border-[#EEEEEE]">
        <label className="block text-xs font-semibold text-[#202124] mb-2 flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-emerald-600" />
          <span>Royalty-Free Sound Bed</span>
        </label>
        <div className="space-y-1.5">
          {musicTracks.map((trk) => (
            <button
              key={trk.id}
              onClick={() => setAudioConfig({ track: trk.id })}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                activeClip.audio_music_track === trk.id
                  ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 font-semibold'
                  : 'border-[#EEEEEE] hover:border-zinc-300 bg-white text-[#747474]'
              }`}
            >
              <div>
                <div className="text-xs font-semibold text-[#202124]">{trk.name}</div>
                <div className="text-[10px] text-zinc-500">{trk.genre}</div>
              </div>
              {activeClip.audio_music_track === trk.id && (
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Ducking Fader */}
      <div className="pt-3 border-t border-[#EEEEEE]">
        <div className="flex items-center justify-between text-xs font-semibold text-[#202124] mb-1.5">
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-zinc-600" />
            Background Music Level
          </span>
          <span className="font-mono text-[#747474]">
            {Math.round((activeClip.audio_music_volume || 0.15) * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={0.5}
          step={0.01}
          value={activeClip.audio_music_volume || 0.15}
          onChange={(e) => setAudioConfig({ musicVolume: parseFloat(e.target.value) })}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <p className="text-[10px] text-zinc-500 mt-1">
          Smart audio ducking automatically reduces background music volume by 80% while words are spoken.
        </p>
      </div>
    </div>
  );
};
