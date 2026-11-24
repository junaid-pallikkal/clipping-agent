export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer';
export type AssetStatus = 'uploading' | 'pending' | 'transcribing' | 'analyzing' | 'completed' | 'failed';
export type ClipStatus = 'draft' | 'ready' | 'pending_approval' | 'approved' | 'rejected' | 'archived';
export type AspectRatioMode = '9:16' | '1:1' | '16:9' | '4:5';
export type SocialPlatform = 'youtube' | 'instagram' | 'tiktok' | 'facebook';
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
export type SubscriptionTier = 'free' | 'creator' | 'pro' | 'agency';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  owner_id: string;
  role: WorkspaceRole;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  color_tag: string;
  created_at: string;
  video_count: number;
}

export interface WordCue {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
  speaker?: number;
  confidence?: number;
}

export interface Transcript {
  id: string;
  video_asset_id: string;
  language: string;
  full_text: string;
  words: WordCue[];
  speakers: Array<{ speaker_id: number; label: string }>;
}

export interface ViralityBreakdown {
  hook_score: number;      // 0-100 (strength of opening 3s)
  pacing_score: number;    // 0-100 (cadence and rhythm)
  emotional_peak: number;  // 0-100 (sentiment variance)
  retention_score: number; // 0-100 (information density)
}

export interface SubtitleStyleConfig {
  preset: 'hormozi_bold' | 'mrbeast_pop' | 'minimal_clean' | 'cyber_glow';
  font_family: string;
  font_size: number;
  font_color: string;
  highlight_color: string;
  stroke_color: string;
  stroke_width: number;
  position_y_percent: number; // 0 to 100 from top
  words_per_batch: number;    // e.g. 1 to 4
  uppercase: boolean;
  active_animation: 'bounce' | 'zoom' | 'glow' | 'none';
}

export interface Clip {
  id: string;
  workspace_id: string;
  video_asset_id: string;
  title: string;
  summary: string;
  hook_sentence: string;
  virality_score: number;
  virality_breakdown: ViralityBreakdown;
  start_time: number;
  end_time: number;
  duration_seconds: number;
  aspect_ratio: AspectRatioMode;
  crop_center_x: number; // 0.0 (left) to 1.0 (right), default 0.5
  status: ClipStatus;
  video_url: string;
  thumbnail_url: string;
  subtitles: SubtitleStyleConfig;
  audio_music_track?: string;
  audio_music_volume?: number; // 0 to 1
  audio_speech_gain?: number;  // 0 to 2
  speed_multiplier?: number;   // 0.5 to 2.0
  b_roll_enabled?: boolean;
  created_at: string;
}

export interface VideoAsset {
  id: string;
  workspace_id: string;
  project_id?: string;
  title: string;
  source_type: 'upload' | 'youtube' | 'vimeo' | 'drive' | 'url';
  source_url?: string;
  duration_seconds: number;
  resolution_width: number;
  resolution_height: number;
  fps: number;
  file_size_bytes: number;
  status: AssetStatus;
  progress_percent?: number;
  clips_count: number;
  created_at: string;
}

export interface ConnectedAccount {
  id: string;
  workspace_id: string;
  platform: SocialPlatform;
  platform_account_id: string;
  account_name: string;
  account_handle: string;
  avatar_url?: string;
  is_active: boolean;
  health_status: 'healthy' | 'warning' | 'expired';
  token_expires_at?: string;
  published_count: number;
  created_at: string;
}

export interface ScheduledPost {
  id: string;
  workspace_id: string;
  clip_id: string;
  account_id: string;
  title?: string;
  caption: string;
  tags: string[];
  scheduled_for: string; // ISO date
  status: PostStatus;
  platform_post_id?: string;
  platform_post_url?: string;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  retry_count: number;
  last_error?: string;
  created_at: string;
}

export interface AutoPilotRule {
  id: string;
  workspace_id: string;
  name: string;
  is_enabled: boolean;
  source_type: 'youtube_channel' | 'folder' | 'drive';
  source_target: string;
  clips_per_video: number;
  preferred_duration_range: [number, number]; // [min, max] in seconds
  target_account_ids: string[];
  publishing_frequency: 'daily' | 'twice_daily' | 'every_other_day' | 'weekdays';
  publishing_times: string[]; // e.g. ["11:30", "18:00"]
  requires_approval: boolean;
  auto_subtitles_preset: SubtitleStyleConfig['preset'];
  bg_music_genre?: string;
  total_auto_published: number;
}

export interface SubscriptionQuota {
  tier: SubscriptionTier;
  transcription_minutes_limit: number;
  transcription_minutes_used: number;
  clips_export_limit: number;
  clips_export_used: number;
  social_accounts_limit: number;
  social_accounts_connected: number;
  team_seats_limit: number;
  team_seats_used: number;
  max_resolution: '1080p' | '4k';
  has_watermark: boolean;
  client_portals_enabled: boolean;
  auto_pilot_enabled: boolean;
  current_period_end: string;
}
