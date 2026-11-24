import { create } from 'zustand';
import { SubscriptionQuota, SubscriptionTier } from '@/types';
import { INITIAL_QUOTA } from '@/lib/mockData';

interface CreditState {
  quota: SubscriptionQuota;
  isUpgradeModalOpen: boolean;

  setUpgradeModalOpen: (open: boolean) => void;
  switchTier: (tier: SubscriptionTier) => void;
  deductMinutes: (minutes: number) => boolean;
  deductExportClip: () => boolean;
}

const TIER_DEFAULTS: Record<SubscriptionTier, Omit<SubscriptionQuota, 'transcription_minutes_used' | 'clips_export_used' | 'social_accounts_connected' | 'team_seats_used' | 'current_period_end'>> = {
  free: {
    tier: 'free',
    transcription_minutes_limit: 30,
    clips_export_limit: 5,
    social_accounts_limit: 1,
    team_seats_limit: 1,
    max_resolution: '1080p',
    has_watermark: true,
    client_portals_enabled: false,
    auto_pilot_enabled: false,
  },
  creator: {
    tier: 'creator',
    transcription_minutes_limit: 120,
    clips_export_limit: 30,
    social_accounts_limit: 5,
    team_seats_limit: 1,
    max_resolution: '1080p',
    has_watermark: false,
    client_portals_enabled: false,
    auto_pilot_enabled: true,
  },
  pro: {
    tier: 'pro',
    transcription_minutes_limit: 300,
    clips_export_limit: 100,
    social_accounts_limit: 15,
    team_seats_limit: 5,
    max_resolution: '4k',
    has_watermark: false,
    client_portals_enabled: true,
    auto_pilot_enabled: true,
  },
  agency: {
    tier: 'agency',
    transcription_minutes_limit: 1000,
    clips_export_limit: 500,
    social_accounts_limit: 50,
    team_seats_limit: 20,
    max_resolution: '4k',
    has_watermark: false,
    client_portals_enabled: true,
    auto_pilot_enabled: true,
  },
};

export const useCreditStore = create<CreditState>((set, get) => ({
  quota: INITIAL_QUOTA,
  isUpgradeModalOpen: false,

  setUpgradeModalOpen: (isUpgradeModalOpen) => set({ isUpgradeModalOpen }),

  switchTier: (tier) => {
    set((state) => ({
      quota: {
        ...state.quota,
        ...TIER_DEFAULTS[tier],
        tier,
      },
      isUpgradeModalOpen: false,
    }));
  },

  deductMinutes: (minutes) => {
    const { quota } = get();
    // Unlimited tier never blocks
    if (quota.tier === 'agency' || quota.transcription_minutes_limit >= 99999) {
      set({
        quota: {
          ...quota,
          transcription_minutes_used: Number((quota.transcription_minutes_used + minutes).toFixed(1)),
        },
      });
      return true;
    }
    if (quota.transcription_minutes_used + minutes > quota.transcription_minutes_limit) {
      set({ isUpgradeModalOpen: true });
      return false;
    }
    set({
      quota: {
        ...quota,
        transcription_minutes_used: Number((quota.transcription_minutes_used + minutes).toFixed(1)),
      },
    });
    return true;
  },

  deductExportClip: () => {
    const { quota } = get();
    // Unlimited tier never blocks
    if (quota.tier === 'agency' || quota.clips_export_limit >= 99999) {
      set({
        quota: {
          ...quota,
          clips_export_used: quota.clips_export_used + 1,
        },
      });
      return true;
    }
    if (quota.clips_export_used + 1 > quota.clips_export_limit) {
      set({ isUpgradeModalOpen: true });
      return false;
    }
    set({
      quota: {
        ...quota,
        clips_export_used: quota.clips_export_used + 1,
      },
    });
    return true;
  },
}));
