# CLIPGENIUS AI — Technical Architecture & System Design

**Document Version:** 1.0.0  
**Architect:** Principal AI Product Architect  
**Target Environment:** Node.js v24+ / Vite + React 19 / TypeScript / Supabase (PostgreSQL 17 + Auth + Storage + Edge Functions) / FFmpeg & Media Pipeline / Web APIs

---

## 1. System Topology Overview

CLIPGENIUS AI employs a decoupled, event-driven hybrid architecture designed to balance instant client responsiveness with heavy computational workloads (video decoding, transcription, smart reframing, and multi-platform publishing).

```mermaid
flowchart TD
    Client["Client Web App (Vite + React 19 + TypeScript + Tailwind CSS)"]
    
    subgraph SupabaseCloud["Supabase Managed Cloud Platform"]
        Auth["Supabase Auth (JWT, RBAC)"]
        Postgres[("PostgreSQL 17 Database (RLS Enforced)")]
        Storage["Supabase Storage (Raw Video / Rendered Clips / Thumbnails)"]
        EdgeFunctions["Supabase Edge Functions / Deno (OAuth, Webhooks, Proxies)"]
    end
    
    subgraph ProcessingPipeline["Media & AI Processing Engine"]
        Ingestion["Ingestion & Chunk Manager"]
        AudioExtract["FFmpeg / WebAudio Processing"]
        STT["AI Speech Engine (Whisper / Deepgram / AssemblyAI)"]
        LLM["AI Semantic Analyzer (Gemini 2.5/Flash / Structured Output)"]
        ComputerVision["Smart Reframing & Speaker Tracking"]
        Renderer["Video Compositing Engine (FFmpeg / Canvas / Remotion)"]
    end
    
    subgraph PublishingEcosystem["Social Publishing Engine"]
        Scheduler["Background Job Queue (pg_cron / PGMQ)"]
        OAuthBroker["OAuth Token Vault (Encrypted AES-GCM)"]
        YT["YouTube Data API v3"]
        IG["Instagram Graph API"]
        TT["TikTok Content Posting API"]
        FB["Facebook Graph API"]
    end

    Client -->|Auth & Queries| Auth
    Client -->|RLS Queries & Realtime| Postgres
    Client -->|Resumable Upload| Storage
    Client -->|Trigger AI Analysis| EdgeFunctions
    
    EdgeFunctions --> Ingestion
    Ingestion --> AudioExtract
    AudioExtract --> STT
    STT --> LLM
    LLM --> ComputerVision
    ComputerVision --> Renderer
    Renderer --> Storage
    
    Postgres -->|Poll / Webhook| Scheduler
    Scheduler --> OAuthBroker
    OAuthBroker --> YT
    OAuthBroker --> IG
    OAuthBroker --> TT
    OAuthBroker --> FB
```

---

## 2. Technology Stack Selection & Rationale

| Layer | Selected Technology | Justification |
|---|---|---|
| **Frontend Framework** | **React 19 + Vite + TypeScript** | Ultra-fast HMR, concurrent rendering primitives, type-safe development, lightweight bundle size. |
| **Styling & Design System** | **Tailwind CSS v4 + Motion** | Custom tokenized white-and-red palette, zero-runtime CSS, smooth 60fps micro-animations. |
| **State Management** | **Zustand + TanStack Query** | Minimal boilerplate, persistent store for video editor state, robust server-state caching and deduplication. |
| **In-Browser Video Playhead** | **HTML5 Video + Web Audio API + Canvas** | Frame-accurate synchronization, real-time waveform rendering, dynamic karaoke subtitle overlay without rendering roundtrips. |
| **Backend & Database** | **Supabase (PostgreSQL 17)** | Native Row Level Security (RLS), real-time subscriptions, built-in vector support (`pgvector`), integrated storage, automated backups. |
| **Queue & Scheduling** | **PostgreSQL PGMQ / pg_cron + Edge Functions** | Transactional integrity: jobs are enqueued in the same transaction as state changes, eliminating desyncs. |
| **AI Transcription (STT)** | **Whisper / Deepgram Nova-2** | Sub-word timestamp precision, multi-language support, high accuracy on domain slang/proper nouns. |
| **Semantic & Highlight AI** | **Gemini Flash / Pro (Multimodal)** | High context window (can digest hours of transcript simultaneously), structured JSON schema adherence, low latency, economical token pricing. |
| **Video Compositing & Transcoding** | **FFmpeg Core (Server Worker / WASM Preview)** | Industry standard for stream copy, NVENC/hardware acceleration, complex filtergraphs for burn-in subtitles, aspect ratio padding, and audio ducking. |

---

## 3. Core Processing Pipeline (The 10-Step Video Lifecycle)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Web as Web App (Client)
    participant Storage as Storage (Bucket)
    participant Edge as Edge Function / Worker
    participant AI as AI Engine (Whisper + Gemini)
    participant DB as PostgreSQL
    participant Social as Social APIs (YT/IG/TT/FB)

    User->>Web: Uploads video or inputs URL
    Web->>Storage: Resumable chunked upload
    Web->>DB: Insert project & video_asset (Status: PENDING)
    Web->>Edge: Trigger processing job
    Edge->>Storage: Pull audio stream (16kHz mono)
    Edge->>AI: Transcribe & timestamp words
    AI-->>Edge: Word-level transcript + speaker tokens
    Edge->>AI: Detect viral hooks, sentiment, score segments
    AI-->>Edge: Ranked candidate clips (Start, End, Score, Hook Title)
    Edge->>DB: Insert candidate clips (Status: READY_FOR_REVIEW)
    DB-->>Web: Realtime push: clips populated
    User->>Web: Edits caption style, reframing, approves clip
    User->>Web: Schedules to Instagram & YouTube
    Web->>DB: Insert scheduled_post (Status: SCHEDULED)
    loop Background Cron Dispatcher
        Edge->>DB: Query due posts
        Edge->>Storage: Fetch rendered clip binary
        Edge->>Social: Dispatch upload with OAuth token
        Social-->>Edge: Return publish confirmation ID
        Edge->>DB: Update status: PUBLISHED
    end
    Web->>User: Notify publish success + display analytics
```

---

## 4. Key Architectural Subsystems

### 4.1 In-Browser Non-Destructive Editing Engine
- **Decoupled Preview vs Render:** The browser editor executes non-destructive playback. Cut points, zoom/crop transforms, font sizes, and caption offsets are stored as JSON metadata (`timeline_state`).
- **Zero-Wait Client Feedback:** Changes to subtitle colors, text, or reframing update immediately via CSS transforms and Web Audio gains, eliminating the need for server rendering during the creative phase.
- **Final Render Graph:** Upon approval or manual export request, the client serializes the timeline AST (Abstract Syntax Tree) to the backend render worker, which compiles it into an optimized FFmpeg filtergraph:
  ```bash
  ffmpeg -ss [START] -to [END] -i input.mp4 -vf "crop=ih*9/16:ih:(iw-ow)*[TRACK_X]:0,subtitles=caps.ass:force_style='...'" -af "volume=...,sidechaincompress=..." -c:v libx264 -preset fast -crf 20 -c:a aac output.mp4
  ```

### 4.2 Social OAuth & Token Security Architecture
- Tokens are encrypted at rest using AES-256-GCM.
- Encryption keys reside exclusively in Supabase Vault / server environment secrets, never sent to the browser.
- Client applications interact strictly via opaque account UUIDs (`account_id`).
- When a user initiates OAuth, state parameters are cryptographically signed (HMAC-SHA256) with short expiration to prevent CSRF and session fixation attacks.

### 4.3 Content Calendar & Autonomous Auto-Pilot
- **Autonomous Queue Engine:** Auto-Pilot monitors target accounts, preferred posting windows (e.g., 11:30 AM & 6:00 PM EST), and buffer sizes (e.g., maintain 3 days of approved backlog).
- **Graceful Failure Circuit Breaker:** If a social API rejects a payload (e.g., token expired, media format rejected, rate limit exceeded), the job is tagged `FAILED_RETRYABLE` with an exponential backoff schedule (1m, 5m, 15m, 1h). After 4 failures, it alerts the user and halts further automatic posts on that specific account channel without breaking other pipelines.

---

## 5. Architectural Principles & Invariants

1. **Idempotency Over Everything:** Every background worker task has an idempotent idempotency key (`workspace_id:clip_id:target_platform:scheduled_time`). Re-running a job never produces duplicate social media posts.
2. **Never Block the UI Thread:** Long-running tasks emit server-sent events (SSE) or Supabase Postgres Realtime payloads. The UI transitions through explicit states (`queued`, `processing_transcription`, `generating_clips`, `ready`).
3. **Data Isolation by Default:** Every database table references `workspace_id` with active PostgreSQL Row Level Security (RLS). Cross-workspace data leakage is physically blocked at the database engine level.
4. **Transparent Degradation:** If cloud AI services encounter throttling or downtime, users can still manually trim, split, add custom subtitles, and schedule exports without AI assistance.
