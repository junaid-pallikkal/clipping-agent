import { create } from 'zustand';
import type { AutoPilotRule, Clip } from '../types/index.ts';
import { INITIAL_AUTOPILOT_RULES } from '../lib/mockData.ts';
import { useWorkspaceStore } from './workspaceStore.ts';
import { useSocialStore } from './socialStore.ts';

interface AutoPilotState {
  rules: AutoPilotRule[];
  isWizardOpen: boolean;
  isReviewPortalOpen: boolean;
  reviewPortalClipId: string | null;
  isRunningPipeline: boolean;

  // Actions
  setWizardOpen: (open: boolean) => void;
  setReviewPortalOpen: (open: boolean, clipId?: string) => void;
  toggleRule: (ruleId: string) => void;
  createRule: (rule: Omit<AutoPilotRule, 'id' | 'total_auto_published'>) => void;
  deleteRule: (ruleId: string) => void;
  
  approveClip: (clipId: string, scheduledDate?: string) => void;
  rejectClip: (clipId: string, reason?: string) => void;
  triggerManualPipeline: (ruleId: string) => Promise<number>;
}

export const useAutoPilotStore = create<AutoPilotState>((set, get) => ({
  rules: INITIAL_AUTOPILOT_RULES,
  isWizardOpen: false,
  isReviewPortalOpen: false,
  reviewPortalClipId: null,
  isRunningPipeline: false,

  setWizardOpen: (isWizardOpen) => set({ isWizardOpen }),
  
  setReviewPortalOpen: (isReviewPortalOpen, clipId = undefined) => {
    set({ isReviewPortalOpen, reviewPortalClipId: clipId || null });
  },

  toggleRule: (ruleId) => {
    set((state) => ({
      rules: state.rules.map((r) =>
        r.id === ruleId ? { ...r, is_enabled: !r.is_enabled } : r
      ),
    }));
  },

  createRule: (ruleData) => {
    const newRule: AutoPilotRule = {
      ...ruleData,
      id: `rule-${Date.now()}`,
      total_auto_published: 0,
    };
    set((state) => ({ rules: [newRule, ...state.rules], isWizardOpen: false }));
  },

  deleteRule: (ruleId) => {
    set((state) => ({
      rules: state.rules.filter((r) => r.id !== ruleId),
    }));
  },

  approveClip: (clipId, scheduledDate) => {
    useWorkspaceStore.getState().updateClip(clipId, { status: 'approved' });
    const clip = useWorkspaceStore.getState().clips.find((c) => c.id === clipId);
    const accounts = useSocialStore.getState().accounts;
    
    if (clip && accounts.length > 0) {
      // Auto queue to connected account
      useSocialStore.getState().schedulePost({
        workspace_id: clip.workspace_id,
        clip_id: clip.id,
        account_id: accounts[0].id,
        title: clip.title,
        caption: `${clip.title}\n\n${clip.summary} #viral #shorts #clipgenius`,
        tags: ['viral', 'shorts', 'clips'],
        scheduled_for: scheduledDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        requires_approval: false,
      });
    }
  },

  rejectClip: (clipId) => {
    useWorkspaceStore.getState().updateClip(clipId, { status: 'rejected' });
  },

  triggerManualPipeline: async (ruleId) => {
    set({ isRunningPipeline: true });
    const rule = get().rules.find((r) => r.id === ruleId);
    
    // Simulate multi-step analysis pipeline
    await new Promise((resolve) => setTimeout(resolve, 2200));

    // Generate new high-virality candidate clips
    const currentWs = useWorkspaceStore.getState().currentWorkspace;
    const newClip: Clip = {
      id: `clip-auto-${Date.now()}`,
      workspace_id: currentWs.id,
      video_asset_id: 'vid-1',
      title: 'Secret Distribution Weapon for High-Growth Teams',
      summary: 'Autonomous content engines replace 5 full-time video editors while tripling total organic impressions.',
      hook_sentence: 'Here is what happens when you automate 100% of your video clipping...',
      virality_score: 97,
      virality_breakdown: {
        hook_score: 99,
        pacing_score: 96,
        emotional_peak: 94,
        retention_score: 98,
      },
      start_time: 15.0,
      end_time: 42.5,
      duration_seconds: 27.5,
      aspect_ratio: '9:16',
      crop_center_x: 0.5,
      status: rule?.requires_approval ? 'pending_approval' : 'approved',
      video_url: '/sample-clip.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=600&auto=format&fit=crop&q=80',
      subtitles: {
        preset: 'hormozi_bold',
        font_family: 'Impact, sans-serif',
        font_size: 34,
        font_color: '#FFFFFF',
        highlight_color: '#FACC15',
        stroke_color: '#000000',
        stroke_width: 5,
        position_y_percent: 74,
        words_per_batch: 2,
        uppercase: true,
        active_animation: 'bounce',
      },
      audio_music_track: 'upbeat_tech_drive',
      audio_music_volume: 0.16,
      created_at: new Date().toISOString(),
    };

    useWorkspaceStore.getState().addClips([newClip]);

    if (!rule?.requires_approval && rule?.target_account_ids.length) {
      useSocialStore.getState().schedulePost({
        workspace_id: currentWs.id,
        clip_id: newClip.id,
        account_id: rule.target_account_ids[0],
        title: newClip.title,
        caption: `${newClip.hook_sentence}\n\n${newClip.summary}`,
        tags: ['autopilot', 'ai', 'growth'],
        scheduled_for: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        requires_approval: false,
      });
    }

    set((state) => ({
      isRunningPipeline: false,
      rules: state.rules.map((r) =>
        r.id === ruleId ? { ...r, total_auto_published: r.total_auto_published + 1 } : r
      ),
    }));

    return 1;
  },
}));
