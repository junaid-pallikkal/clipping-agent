# CLIPGENIUS AI — External Integrations & API Specifications

**Document Version:** 1.0.0  
**Compliance Standard:** Official Authorized APIs Only (No scraping, No reverse-engineered private endpoints)

---

## 1. Social Media Publishing APIs

### 1.1 YouTube Data API v3 (Google Cloud Platform)
- **Primary Capability:** Uploading YouTube Shorts, setting title, description, tags, category, and privacy status (`public`, `unlisted`, `private`).
- **OAuth 2.0 Scopes Required:**
  - `https://www.googleapis.com/auth/youtube.upload`
  - `https://www.googleapis.com/auth/youtube.readonly`
  - `https://www.googleapis.com/auth/userinfo.profile`
- **Publishing Flow:**
  1. Initialize resumable upload session (`POST https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status`).
  2. Stream MP4 binary chunks.
  3. Video recognized as Short automatically if vertical (9:16) and $\le 60$ seconds.
- **Rate Limits & Quota:**
  - Standard quota: 10,000 units/day. Video upload costs 1,600 units (allowing ~6 uploads/day on basic tier without quota extension request).
  - Mitigation: Cache read calls; guide high-volume creators on custom GCP Project quota extension.

### 1.2 Instagram Graph API (Meta for Developers)
- **Primary Capability:** Publishing Instagram Reels to Instagram Professional (Business / Creator) accounts.
- **Prerequisites:** Instagram account must be linked to a Facebook Page. Personal accounts are strictly unsupported by Meta.
- **OAuth 2.0 Scopes Required:**
  - `instagram_basic`
  - `instagram_content_publish`
  - `pages_show_list`
  - `pages_read_engagement`
- **Publishing Flow:**
  1. Create container: `POST https://graph.facebook.com/v19.0/{ig_user_id}/media` with `media_type=REELS`, `video_url={signed_storage_url}`, and `caption`.
  2. Poll status: `GET https://graph.facebook.com/v19.0/{container_id}?fields=status_code`. Wait until `FINISHED`.
  3. Publish container: `POST https://graph.facebook.com/v19.0/{ig_user_id}/media_publish` with `creation_id={container_id}`.
- **Constraints:** Video must be publicly accessible via HTTPS URL during ingestion; aspect ratio 9:16 recommended (range 0.01:1 to 10:1); max duration 15 minutes.

### 1.3 TikTok Content Posting API (TikTok for Developers)
- **Primary Capability:** Direct post to user profile or send to Creator Inbox for final review.
- **OAuth 2.0 Scopes Required:**
  - `user.info.basic`
  - `video.upload`
  - `video.publish`
- **Publishing Flow:**
  1. Initiate upload: `POST https://open.tiktokapis.com/v2/post/publish/video/init/` specifying source information and post preferences.
  2. Upload chunked video binary to the returned `upload_url`.
  3. Query publish status: `POST https://open.tiktokapis.com/v2/post/publish/status/fetch/`.
- **Constraints:** Privacy level settings (`PUBLIC_TO_EVERYONE`, `MUTUAL_FOLLOW_FRIENDS`, `SELF_ONLY`), duet/stitch/comment disable flags.

### 1.4 Facebook Graph API (Meta for Developers)
- **Primary Capability:** Publishing Reels to Facebook Pages.
- **OAuth 2.0 Scopes Required:**
  - `pages_manage_posts`
  - `pages_read_engagement`
  - `publish_video`
- **Publishing Flow:**
  1. Initiate video upload session on target page (`POST /{page_id}/video_reels`).
  2. Upload video binary.
  3. Finish publishing (`POST /{page_id}/video_reels?video_state=PUBLISHED`).

---

## 2. Artificial Intelligence & Speech Pipeline

| Provider / Model | Task | Endpoint / Method | Fallback Strategy |
|---|---|---|---|
| **Deepgram Nova-2 / Whisper** | Audio transcription & word timestamps | `/v1/listen?smart_format=true&diarize=true&utterances=true` | Self-hosted Whisper.cpp or local client WASM model for offline fallback |
| **Google Gemini 2.5 Flash** | Semantic segmentation, hook detection, virality scoring | `models/gemini-2.5-flash:generateContent` with structured JSON schema | Claude 3.5 Sonnet or OpenAI GPT-4o-mini |
| **FFmpeg (Native / WASM)** | Transcoding, waveform extraction, filtergraph rendering | CLI worker process / `@ffmpeg/ffmpeg` browser WASM | Server-side background container rendering |

---

## 3. Storage, Database & Payment Infrastructure

- **Supabase Storage:** S3-compatible object storage with signed URL generation (TTL: 60 minutes) for secure social media ingestion without public bucket exposure.
- **Stripe Billing:** Checkout Sessions, Customer Portal, Webhook handler for `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.
