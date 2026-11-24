import { create } from 'zustand';
import { Clip, SubtitleStyleConfig, AspectRatioMode } from '@/types';
import { INITIAL_CLIPS } from '@/lib/mockData';
import { SUBTITLE_PRESETS } from '@/lib/subtitles';
import { useWorkspaceStore } from './workspaceStore';

interface EditorState {
  activeClip: Clip | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  zoomLevel: number;
  activeTab: 'subtitles' | 'reframe' | 'audio' | 'trim';
  isExporting: boolean;
  exportProgress: number;

  // Actions
  setActiveClip: (clip: Clip | null) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  setPlaybackRate: (rate: number) => void;
  setZoomLevel: (zoom: number) => void;
  setActiveTab: (tab: EditorState['activeTab']) => void;
  
  // Nondestructive edit operations
  setTrimPoints: (start: number, end: number) => void;
  setAspectRatio: (aspect: AspectRatioMode) => void;
  setCropCenterX: (x: number) => void;
  setSubtitlePreset: (preset: SubtitleStyleConfig['preset']) => void;
  updateSubtitleStyle: (updates: Partial<SubtitleStyleConfig>) => void;
  setAudioConfig: (updates: {
    track?: string;
    musicVolume?: number;
    speechGain?: number;
    speedMultiplier?: number;
  }) => void;

  startExport: () => Promise<void>;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeClip: INITIAL_CLIPS[0] || null,
  currentTime: 0,
  duration: INITIAL_CLIPS[0] ? INITIAL_CLIPS[0].duration_seconds : 30,
  isPlaying: false,
  playbackRate: 1.0,
  zoomLevel: 1.0,
  activeTab: 'subtitles',
  isExporting: false,
  exportProgress: 0,

  setActiveClip: (clip) => {
    set({
      activeClip: clip,
      currentTime: 0,
      duration: clip ? clip.duration_seconds : 30,
      isPlaying: false,
    });
  },

  setCurrentTime: (currentTime) => set({ currentTime }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setActiveTab: (activeTab) => set({ activeTab }),

  setTrimPoints: (start, end) => {
    const { activeClip } = get();
    if (!activeClip) return;
    const duration = Math.max(1, end - start);
    const updated = {
      ...activeClip,
      start_time: start,
      end_time: end,
      duration_seconds: duration,
    };
    set({ activeClip: updated, duration });
    useWorkspaceStore.getState().updateClip(activeClip.id, updated);
  },

  setAspectRatio: (aspect_ratio) => {
    const { activeClip } = get();
    if (!activeClip) return;
    const updated = { ...activeClip, aspect_ratio };
    set({ activeClip: updated });
    useWorkspaceStore.getState().updateClip(activeClip.id, updated);
  },

  setCropCenterX: (crop_center_x) => {
    const { activeClip } = get();
    if (!activeClip) return;
    const updated = { ...activeClip, crop_center_x };
    set({ activeClip: updated });
    useWorkspaceStore.getState().updateClip(activeClip.id, updated);
  },

  setSubtitlePreset: (preset) => {
    const { activeClip } = get();
    if (!activeClip) return;
    const newStyle = { ...SUBTITLE_PRESETS[preset] };
    const updated = { ...activeClip, subtitles: newStyle };
    set({ activeClip: updated });
    useWorkspaceStore.getState().updateClip(activeClip.id, updated);
  },

  updateSubtitleStyle: (updates) => {
    const { activeClip } = get();
    if (!activeClip) return;
    const newStyle = { ...activeClip.subtitles, ...updates };
    const updated = { ...activeClip, subtitles: newStyle };
    set({ activeClip: updated });
    useWorkspaceStore.getState().updateClip(activeClip.id, updated);
  },

  setAudioConfig: ({ track, musicVolume, speechGain, speedMultiplier }) => {
    const { activeClip } = get();
    if (!activeClip) return;
    const updated: Partial<Clip> = {};
    if (track !== undefined) updated.audio_music_track = track;
    if (musicVolume !== undefined) updated.audio_music_volume = musicVolume;
    if (speechGain !== undefined) updated.audio_speech_gain = speechGain;
    if (speedMultiplier !== undefined) updated.speed_multiplier = speedMultiplier;

    const finalClip = { ...activeClip, ...updated };
    set({ activeClip: finalClip });
    useWorkspaceStore.getState().updateClip(activeClip.id, finalClip);
  },

  startExport: async () => {
    set({ isExporting: true, exportProgress: 0 });
    for (let progress = 5; progress <= 100; progress += 15) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ exportProgress: Math.min(100, progress) });
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    set({ isExporting: false, exportProgress: 0 });
  },
}));
