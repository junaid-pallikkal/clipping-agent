import { create } from 'zustand';
import type { ConnectedAccount, ScheduledPost, SocialPlatform } from '../types/index.ts';
import { INITIAL_ACCOUNTS, INITIAL_SCHEDULED_POSTS } from '../lib/mockData.ts';

interface SocialState {
  accounts: ConnectedAccount[];
  scheduledPosts: ScheduledPost[];
  isConnectModalOpen: boolean;
  selectedPlatform: SocialPlatform | null;
  selectedPostForSchedule: { clipId: string } | null;

  // Actions
  setConnectModalOpen: (open: boolean, platform?: SocialPlatform) => void;
  setSelectedPostForSchedule: (data: { clipId: string } | null) => void;
  
  connectAccount: (platform: SocialPlatform, accountName: string, handle: string) => void;
  disconnectAccount: (accountId: string) => void;
  
  schedulePost: (newPost: Omit<ScheduledPost, 'id' | 'created_at' | 'retry_count'>) => ScheduledPost;
  reschedulePost: (postId: string, newScheduledTime: string) => void;
  updatePostStatus: (postId: string, status: ScheduledPost['status'], error?: string) => void;
  deleteScheduledPost: (postId: string) => void;
  publishPostNow: (postId: string) => Promise<boolean>;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  accounts: INITIAL_ACCOUNTS,
  scheduledPosts: INITIAL_SCHEDULED_POSTS,
  isConnectModalOpen: false,
  selectedPlatform: null,
  selectedPostForSchedule: null,

  setConnectModalOpen: (open, platform = undefined) => {
    set({ isConnectModalOpen: open, selectedPlatform: platform || null });
  },

  setSelectedPostForSchedule: (data) => {
    set({ selectedPostForSchedule: data });
  },

  connectAccount: (platform, accountName, handle) => {
    const newAccount: ConnectedAccount = {
      id: `acc-${platform}-${Date.now()}`,
      workspace_id: 'ws-junaid-clips',
      platform,
      platform_account_id: `plat_${Date.now()}`,
      account_name: accountName,
      account_handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatar_url: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=120&auto=format&fit=crop&q=80`,
      is_active: true,
      health_status: 'healthy',
      token_expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      published_count: 0,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ accounts: [...state.accounts, newAccount], isConnectModalOpen: false }));
  },

  disconnectAccount: (accountId) => {
    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== accountId),
      scheduledPosts: state.scheduledPosts.filter((p) => p.account_id !== accountId),
    }));
  },

  schedulePost: (postData) => {
    const newPost: ScheduledPost = {
      ...postData,
      id: `post-${Date.now()}`,
      created_at: new Date().toISOString(),
      retry_count: 0,
    };
    set((state) => ({
      scheduledPosts: [newPost, ...state.scheduledPosts],
      selectedPostForSchedule: null,
    }));
    return newPost;
  },

  reschedulePost: (postId, newScheduledTime) => {
    set((state) => ({
      scheduledPosts: state.scheduledPosts.map((p) =>
        p.id === postId ? { ...p, scheduled_for: newScheduledTime } : p
      ),
    }));
  },

  updatePostStatus: (postId, status, error) => {
    set((state) => ({
      scheduledPosts: state.scheduledPosts.map((p) =>
        p.id === postId ? { ...p, status, last_error: error } : p
      ),
    }));
  },

  deleteScheduledPost: (postId) => {
    set((state) => ({
      scheduledPosts: state.scheduledPosts.filter((p) => p.id !== postId),
    }));
  },

  publishPostNow: async (postId) => {
    const post = get().scheduledPosts.find((p) => p.id === postId);
    if (!post) return false;

    // Transition to publishing state
    get().updatePostStatus(postId, 'publishing');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const targetAccount = get().accounts.find((a) => a.id === post.account_id);
    const pubId = Math.random().toString(36).substring(2, 11);
    
    let platformUrl = '';
    if (targetAccount?.platform === 'youtube') {
      platformUrl = `https://youtube.com/shorts/${pubId}`;
    } else if (targetAccount?.platform === 'instagram') {
      platformUrl = `https://instagram.com/reel/${pubId}`;
    } else if (targetAccount?.platform === 'tiktok') {
      platformUrl = `https://tiktok.com/@${targetAccount.account_handle.replace('@', '')}/video/${pubId}`;
    } else {
      platformUrl = `https://facebook.com/watch/?v=${pubId}`;
    }

    // Confirm published with platform ID & exact platform link
    set((state) => ({
      scheduledPosts: state.scheduledPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: 'published',
              platform_post_id: `pub_${pubId}`,
              platform_post_url: platformUrl,
            }
          : p
      ),
      accounts: state.accounts.map((a) =>
        a.id === post.account_id ? { ...a, published_count: a.published_count + 1 } : a
      ),
    }));
    return true;
  },
}));
