import { create } from 'zustand';
import type {
  UserProfile,
  Workspace,
  Project,
  VideoAsset,
  Clip,
  Transcript
} from '../types/index.ts';
import {
  INITIAL_USER,
  INITIAL_WORKSPACES,
  INITIAL_PROJECTS,
  INITIAL_VIDEOS,
  INITIAL_CLIPS,
  SAMPLE_TRANSCRIPT
} from '../lib/mockData.ts';

interface WorkspaceState {
  currentUser: UserProfile;
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  projects: Project[];
  videos: VideoAsset[];
  clips: Clip[];
  transcripts: Record<string, Transcript>;
  activeView: 'dashboard' | 'studio' | 'projects' | 'calendar' | 'social' | 'autopilot' | 'analytics' | 'settings';
  searchQuery: string;
  isQuickModeOpen: boolean;
  isUploadModalOpen: boolean;

  // Actions
  setActiveView: (view: WorkspaceState['activeView']) => void;
  setCurrentWorkspace: (workspaceId: string) => void;
  setSearchQuery: (query: string) => void;
  setQuickModeOpen: (open: boolean) => void;
  setUploadModalOpen: (open: boolean) => void;
  
  createProject: (name: string, description?: string, colorTag?: string) => Project;
  addVideoAsset: (video: Omit<VideoAsset, 'id' | 'created_at' | 'clips_count'>) => VideoAsset;
  addClips: (newClips: Clip[]) => void;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  deleteClip: (clipId: string) => void;
  deleteVideo: (videoId: string) => void;
  addTranscript: (videoId: string, transcript: Transcript) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  currentUser: INITIAL_USER,
  workspaces: INITIAL_WORKSPACES,
  currentWorkspace: INITIAL_WORKSPACES[0],
  projects: INITIAL_PROJECTS,
  videos: INITIAL_VIDEOS,
  clips: INITIAL_CLIPS,
  transcripts: {
    'vid-1': SAMPLE_TRANSCRIPT,
  },
  activeView: 'dashboard',
  searchQuery: '',
  isQuickModeOpen: false,
  isUploadModalOpen: false,

  setActiveView: (view) => set({ activeView: view }),
  setCurrentWorkspace: (workspaceId) => {
    const ws = get().workspaces.find((w) => w.id === workspaceId);
    if (ws) set({ currentWorkspace: ws });
  },
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setQuickModeOpen: (isQuickModeOpen) => set({ isQuickModeOpen }),
  setUploadModalOpen: (isUploadModalOpen) => set({ isUploadModalOpen }),

  createProject: (name, description, colorTag = '#E54848') => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      workspace_id: get().currentWorkspace.id,
      name,
      description,
      color_tag: colorTag,
      created_at: new Date().toISOString(),
      video_count: 0,
    };
    set((state) => ({ projects: [newProject, ...state.projects] }));
    return newProject;
  },

  addVideoAsset: (videoData) => {
    const newVideo: VideoAsset = {
      ...videoData,
      id: `vid-${Date.now()}`,
      created_at: new Date().toISOString(),
      clips_count: 0,
    };
    set((state) => ({ videos: [newVideo, ...state.videos] }));
    return newVideo;
  },

  addClips: (newClips) => {
    set((state) => ({
      clips: [...newClips, ...state.clips],
      videos: state.videos.map((v) => {
        const addedCount = newClips.filter((c) => c.video_asset_id === v.id).length;
        return addedCount > 0 ? { ...v, clips_count: v.clips_count + addedCount } : v;
      }),
    }));
  },

  updateClip: (clipId, updates) => {
    set((state) => ({
      clips: state.clips.map((c) => (c.id === clipId ? { ...c, ...updates } : c)),
    }));
  },

  deleteClip: (clipId) => {
    set((state) => ({
      clips: state.clips.filter((c) => c.id !== clipId),
    }));
  },

  deleteVideo: (videoId) => {
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== videoId),
      clips: state.clips.filter((c) => c.video_asset_id !== videoId),
    }));
  },

  addTranscript: (videoId, transcript) => {
    set((state) => ({
      transcripts: {
        ...state.transcripts,
        [videoId]: transcript,
      },
    }));
  },
}));
