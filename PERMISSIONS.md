# CLIPGENIUS AI — Permissions & Access Control Specification

**Document Version:** 1.0.0  
**Security Standard:** Strict Principle of Least Privilege (PoLP)  
**Enforcement Boundary:** Server-Side (PostgreSQL RLS + Supabase Edge Functions / Auth)

---

## 1. Role-Based Access Control (RBAC) Matrix

Workspaces maintain five discrete user roles. Each role is strictly bounded to prevent unauthorized publishing, credit overconsumption, or project deletion.

| Capability / Action | Owner | Admin | Editor | Reviewer (Client) | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| **Workspace Settings & Billing** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Manage Team & Invite Members** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Connect / Disconnect Social Accounts** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Create / Delete Projects** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Upload Long Video & Ingest Media** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Trigger AI Moment Detection** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Edit Timeline, Subtitles, Framing** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Submit Clip for Client Approval** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Approve / Reject Clips** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Schedule Posts to Social Media** | ✅ | ✅ | ✅* | ❌ | ❌ |
| **Direct Instant Publish** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **View Analytics & Calendar** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Export / Download Rendered Video** | ✅ | ✅ | ✅ | ❌ | ❌ |

*\*Note: Editors can only schedule posts if the workspace policy "Require Approval for Scheduled Posts" is disabled, or their scheduled posts are marked as `pending_approval` until an Admin/Reviewer approves them.*

---

## 2. Client Reviewer Portal (Zero-Friction Approvals)

Agencies managing external clients require a clean, unconfusing review portal where clients can preview videos, verify captions, and approve or request edits with zero administrative clutter:

1. **Tokenized Guest Access:** Review links can be shared via cryptographic single-use or expirable signed tokens (`/review/[token]`).
2. **Reviewer Capabilities:**
   - Play video preview in native 9:16 vertical resolution.
   - Read and scrub through synced subtitles.
   - Click one-tap buttons: **"Approve for Publishing"** or **"Request Revisions"**.
   - Leave timestamped pinned comments (e.g. at 00:14: *"Please change font color to white"*).
3. **Security Safeguards:**
   - Reviewer tokens cannot query other workspace projects, view raw credentials, or alter billing settings.
   - Tokens automatically invalidate upon post publishing or after an admin-configurable window (default: 7 days).

---

## 3. Social Media OAuth Token Isolation

1. **Storage Security:**
   - Social tokens (`access_token`, `refresh_token`) are never transmitted in plaintext to client browsers.
   - Encrypted with AES-256-GCM using a server-side encryption key stored in Supabase Secrets / Environment Variables.
2. **Execution Boundaries:**
   - Social publishing endpoints execute strictly inside isolated Supabase Edge Functions or background job workers.
   - The browser client triggers publishing actions via RPC or database status transitions (`status = 'scheduled'`), never by invoking social media endpoints directly.
3. **Revocation & Health Audits:**
   - Periodic cron health checks test token validity via platform `/me` endpoints.
   - If a token is revoked or expired, the workspace is flagged with an immediate UI banner, and scheduled posts are safely paused rather than failing silently.

---

## 4. API & Webhook Security

- **Stripe Webhook Signature Verification:** All billing and subscription events verify the `stripe-signature` header using the webhook signing secret. Subscriptions are never upgraded via client-side requests.
- **Rate Limiting:** Public API and upload endpoints are rate-limited via Upstash / Edge Middleware (e.g., max 30 video upload initiations per user per hour).
- **CORS Policies:** Restricted to verified production domains (`https://app.clipgenius.ai`) and local development origins (`http://localhost:5173`).
