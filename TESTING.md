# CLIPGENIUS AI — Quality Assurance & Testing Strategy

**Document Version:** 1.0.0  
**Quality Philosophy:** Never ship simulated green tests. Verify actual database constraints, audio-video synchronization, and external API error states.

---

## 1. Testing Pyramid & Tooling

```
            / \
           /   \        E2E Tests (Playwright)
          / E2E \       - Full video upload -> clip extraction -> editor -> schedule flow
         /-------\      
        /  Integ  \     Integration Tests (Vitest + Supabase Local Test Container)
       /   Tests   \    - PostgreSQL RLS policies, Edge Functions, OAuth Mock Brokers
      /-------------\   
     /     Unit      \  Unit Tests (Vitest + Testing Library)
    /      Tests      \ - Subtitle parser, waveform calculator, timecode math, store reducers
   /-------------------\
```

| Layer | Framework / Runner | Target Coverage | Key Focus Areas |
|---|---|:---:|---|
| **Unit Testing** | Vitest | > 85% | Timecode utilities (`formatTimestamp`, `secondsToHms`), subtitle SRT/VTT parser, virality heuristics, audio ducking calculations. |
| **Component Testing** | React Testing Library | > 80% | `VideoPlayer`, `StudioTimeline`, `SubtitleStyler`, `ViralityGauge`, `ContentCalendarView`. |
| **Database & Security** | pgTAP / Supabase CLI test | 100% RLS | Tenant isolation (Workspace A cannot read Workspace B), RBAC permissions for Editor vs Viewer. |
| **End-to-End (E2E)** | Playwright | Critical Paths | Onboarding, video ingestion, subtitle style switching, social scheduling, client approval portal. |

---

## 2. Critical Test Scenarios & Acceptance Tests

### Scenario 1: Video Ingestion & Timestamp Integrity
- **Test:** Ingest a 10-minute multi-speaker video file.
- **Verification:**
  - Verify all words in `transcripts.words` contain non-null `start`, `end`, and `speaker` attributes.
  - Verify `start < end` for every word token.
  - Confirm clip boundaries (`start_time`, `end_time`) accurately map to complete sentence boundaries without clipping mid-word.

### Scenario 2: Subtitle Dynamic Synchronization
- **Test:** Play video at 1.0x, 1.5x, and 2.0x playback speeds.
- **Verification:**
  - Active highlighted word in karaoke subtitle matches `video.currentTime` within a $\pm 30\text{ms}$ margin.
  - Subtitle bounding box remains strictly within 9:16 safe zones (avoiding TikTok/Reels UI overlay occlusion).

### Scenario 3: Row Level Security & Multi-Tenant Isolation
- **Test:** User 1 (Workspace Alpha) attempts to query `clips` or `connected_accounts` from Workspace Beta via Supabase direct REST API with User 1's JWT.
- **Verification:**
  - PostgreSQL returns an empty array `[]` (HTTP 200) or HTTP 403.
  - Direct update or delete query affects zero rows.

### Scenario 4: Social Media Publishing Idempotency & Failure Handling
- **Test:** Trigger publishing worker for an Instagram post when Meta Graph API returns HTTP 429 (Rate Limit) or HTTP 500.
- **Verification:**
  - Post status changes to `failed_retryable`.
  - Next retry scheduled with exponential backoff.
  - Duplicate posts are prevented by checking platform creation ID before re-dispatching.
