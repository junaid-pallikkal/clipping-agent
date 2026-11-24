# CLIPGENIUS AI — Product Requirements & Acceptance Criteria

**Document Version:** 1.0.0  
**Status:** Approved Architectural Baseline  
**Product Core Promise:** *"One video. Multiple clips. Multiple accounts. One dashboard."*

---

## 1. Executive Summary & Product Scope

CLIPGENIUS AI is a comprehensive, production-grade AI-powered video production, editing, and automated social publishing ecosystem. It bridges the gap between raw long-form video (podcasts, webinars, interviews, keynotes, gameplay, tutorials) and multi-channel short-form domination across TikTok, Instagram Reels, YouTube Shorts, and Facebook Reels.

Unlike superficial clipping toys that merely chop video based on silence detection, CLIPGENIUS AI provides:
1. **Intelligent Multimodal Semantics:** Speech-to-text, speaker diarization, topic boundary detection, emotional peak scoring, and hook/payoff analysis.
2. **Professional Nondestructive Editing Engine:** In-browser timeline, dynamic smart reframing (speaker tracking 9:16 / 1:1 / 16:9), karaoke-timed animated captions, audio ducking, royalty-free sound beds, and color grading.
3. **AI Auto-Pilot & Social Media Publishing:** End-to-end hands-free pipeline with granular approval controls, direct OAuth connections to Instagram, YouTube, TikTok, and Facebook, smart calendar scheduling, and actual verified publishing.
4. **Multi-Tenant Workspace & Client Management:** Team workspaces, client review portals, granular RBAC (Owner, Admin, Editor, Reviewer, Viewer), audit logging, and flexible usage metering.

---

## 2. User Persona Profiles

| Persona | Primary Goal | Critical Pain Point | Core Product Mode |
|---|---|---|---|
| **Solo Creator / Podcaster** | Repurpose 1-2 hr podcast episodes into 10-15 viral shorts per week. | Lacks time and technical video editing skills; manual captioning and reframing is grueling. | **Quick Mode** & **AI Auto-Pilot** |
| **Social Media Agency / Manager** | Manage 5-20 client brands across multiple social channels with client approval gates. | Switching accounts, managing client approvals via messy spreadsheets, risky password sharing. | **Client Workspaces** & **Approval Workflow** |
| **Professional Content Editor** | Accelerate initial rough-cut discovery while retaining frame-accurate timeline control. | AI tools are "black boxes" that export low-res MP4s with no stem or timeline control. | **Advanced Mode** (Timeline, Audio Stemming, Custom Crop) |
| **Enterprise / Marketing Team** | Consistent brand identity, batch generation, team collaboration, and security compliance. | Brand inconsistency, lack of role permissions, unclear ROI metrics. | **Team Roles**, **Branded Presets**, **Analytics** |

---

## 3. Detailed Functional Requirements

### Module 1: Ingestion & Media Processing
- **REQ-1.1 Video Ingestion:**
  - Local upload supporting MP4, MOV, WEBM, MKV up to 4GB (chunked/resumable upload via Tus/S3/Supabase Storage).
  - URL ingestion (YouTube, Vimeo, Google Drive, Loom, Dropbox) with metadata extraction (duration, resolution, audio streams).
- **REQ-1.2 Validation & Preflight:**
  - Codec verification (H.264/HEVC/VP9), audio channel check, duration limits per subscription tier.
- **REQ-1.3 Audio Extraction & Transcription:**
  - 16kHz mono WAV extraction for AI speech pipeline.
  - Word-level timestamps, speaker identification (diarization), punctuation restoration, and profanity filtering.

### Module 2: AI Moment Detection & Clip Scoring
- **REQ-2.1 Semantic Topic Segmentation:**
  - Detection of narrative arcs (Hook $\rightarrow$ Context $\rightarrow$ Climax/Insight $\rightarrow$ Payoff/Call-to-Action).
- **REQ-2.2 Multimodal Virality Scoring:**
  - Heuristic & AI scoring based on: Hook strength (first 3 seconds), sentiment valence, acoustic energy/pitch variance, information density, and pacing.
  - Realistic transparency: Clearly framed as *engagement potential* rather than a guaranteed viral forecast.
- **REQ-2.3 Auto-Framing & Active Speaker Detection:**
  - Face detection & tracking for dynamic vertical 9:16 crop, dual-speaker split layout, or screen+speaker picture-in-picture.

### Module 3: Professional Web Editing Suite
- **REQ-3.1 Timeline & Trimming:**
  - Nondestructive cut, trim, split, ripple edit with frame-accurate preview.
  - Zoomable timeline with audio waveform visualization.
- **REQ-3.2 Dynamic Animated Subtitles:**
  - Word-by-word synchronized highlighting (Karaoke style).
  - Pre-designed viral typography presets (MrBeast, Alex Hormozi, Minimal Clean, Cyber Bold).
  - Custom font upload, shadow, stroke, positioning, emoji integration.
- **REQ-3.3 Audio Enhancement & Music:**
  - Voice leveling, background noise reduction, dynamic audio ducking under speech.
  - Curated royalty-free background music library categorized by mood/tempo.
- **REQ-3.4 Visual Polish & Overlays:**
  - B-roll overlay insertion, progress bars, hook headlines, watermarks, cinematic letterboxing, smooth speed ramping.

### Module 4: Social Media Integrations & Publishing Engine
- **REQ-4.1 Official Platform OAuth:**
  - Instagram Graph API (Reels publishing, Business/Creator accounts).
  - YouTube Data API v3 (Shorts upload, tags, category, public/unlisted/private).
  - TikTok Content Posting API (Direct post & Creator Inbox).
  - Facebook Graph API (Pages & Groups video reels).
- **REQ-4.2 Account Management:**
  - Multi-account connectivity per workspace without password disclosure.
  - Health checks, token expiration alerts, automatic refresh where supported.
- **REQ-4.3 Scheduled & Auto-Pilot Publishing:**
  - Visual weekly/monthly drag-and-drop Content Calendar.
  - Publishing states: `Draft` $\rightarrow$ `Pending Review` $\rightarrow$ `Scheduled` $\rightarrow$ `Publishing` $\rightarrow$ `Published` $\rightarrow$ `Failed`.
  - Idempotent queue workers with exponential backoff retries.
  - Explicit manual fallback export if API rate limits or third-party blocks occur.

### Module 5: Workspaces, Security & Governance
- **REQ-5.1 Multi-Tenancy:**
  - Strict workspace-level isolation using PostgreSQL Row Level Security (RLS).
- **REQ-5.2 Role-Based Access Control (RBAC):**
  - Roles: `Owner`, `Admin`, `Editor`, `Reviewer` (Client), `Viewer`.
  - External shareable review links with password protection and expiration.
- **REQ-5.3 Audit Trails & Activity Logs:**
  - Complete history of clip creations, edits, approvals, and publishing attempts.

### Module 6: Monetization, Credits & Usage Tracking
- **REQ-6.1 Tiered Plans:**
  - Free (Watermarked, limited minutes, 3 clips/mo).
  - Creator ($29/mo, 120 processing mins, 1080p, 5 social accounts).
  - Pro ($79/mo, 300 processing mins, 4K, 15 social accounts, team seats).
  - Agency ($199/mo, 1000 processing mins, unlimited accounts, white-label review portal).
- **REQ-6.2 Granular Quota Enforcement:**
  - Real-time credit deduction based on video duration ingested and AI features triggered.
  - Graceful downgrade and upgrade prompts with stripe webhook synchronization.

---

## 4. Non-Functional & Quality Requirements

- **Performance:** In-browser video scrubbing latency $< 50\text{ms}$; Dashboard initial render $< 1.2\text{s}$; API response time $< 200\text{ms}$ for metadata operations.
- **Reliability:** Background job idempotency; graceful resumption of interrupted uploads; dead-letter queue for failed rendering or publishing tasks.
- **Security:** Strict HTTPS/TLS 1.3, encrypted OAuth tokens at rest (AES-256-GCM), signed temporary URLs for media downloads, no client-side secret exposure.
- **Accessibility:** WCAG 2.1 AA compliant contrast ratios, keyboard navigable timeline shortcuts, screen-reader accessible aria attributes.
- **Responsive Standard:** Fully adaptive across Desktop (1920x1080, 1440x900), Tablet (iPad 1024x768), and Mobile (iPhone/Android 375px-430px).

---

## 5. Acceptance Criteria Checklist

- [ ] User can sign up/login securely via Supabase Auth (Email + Google OAuth).
- [ ] User can upload or paste a video link and receive progress feedback during transcription and analysis.
- [ ] User can view extracted highlight clips ranked by engagement score with full transcripts and timestamps.
- [ ] User can preview clips in vertical 9:16 format with auto-tracked speaker cropping and synced subtitles.
- [ ] User can customize subtitle styles, font sizes, colors, and audio ducking levels in real time.
- [ ] User can connect social accounts (YouTube, Instagram, TikTok, Facebook) via authorized OAuth screens.
- [ ] User can schedule a clip to multiple accounts with unique captions, tags, and scheduled time.
- [ ] Client Reviewer can approve or request changes on pending clips without accessing administrative settings.
- [ ] Background worker accurately processes scheduled posts and updates database status only upon confirmed platform receipt.
- [ ] System strictly enforces credit quotas and storage limits according to active subscription plan.
