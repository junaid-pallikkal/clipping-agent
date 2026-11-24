# CLIPGENIUS AI — Premium Design System & UI/UX Specification

**Design Direction:** Linear + Stripe + Notion Craftsmanship with NLE Functional Precision  
**Core Tone:** Minimal, Refined, Modern, Calm, Intelligent, Fast, Trustworthy

---

## 1. Color Palette & Token System

The interface uses a deliberate, high-contrast white-and-red design system. Red is reserved for intentional visual emphasis, primary calls to action, active playhead states, and critical highlights—never used gratuitously.

```css
:root {
  /* Surfaces & Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAFAFA;
  --bg-tertiary: #F4F4F5;
  --bg-elevated: #FFFFFF;

  /* Brand Red Palette */
  --brand-red-primary: #E54848;   /* Primary actions, active highlights */
  --brand-red-hover: #C93636;     /* Dark red for hover & pressed states */
  --brand-red-subtle: #FFF1F0;    /* Soft red for badges, pill backgrounds, selection tints */
  --brand-red-ring: rgba(229, 72, 72, 0.2); /* Focus rings and glow */

  /* Neutral Text & Borders */
  --text-primary: #202124;        /* High-contrast headings and body */
  --text-secondary: #747474;      /* Subtitles, timestamps, metadata */
  --text-muted: #A1A1AA;          /* Disabled, placeholders */
  --border-subtle: #EEEEEE;       /* Standard divider lines and card borders */
  --border-strong: #E4E4E7;       /* Input borders and active tab lines */

  /* Semantic Feedback */
  --status-success: #10B981;
  --status-warning: #F59E0B;
  --status-error: #EF4444;
  --status-info: #3B82F6;
}
```

---

## 2. Typography & Spatial Rhythm

- **Primary Font Family:** `Inter`, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Monospace Code/Timestamps:** `JetBrains Mono`, "SF Mono", monospace.
- **Typographic Scale:**
  - `Hero Display`: 32px / line-height 40px / font-weight 700 / tracking -0.02em
  - `Section Heading (H1)`: 24px / line-height 32px / font-weight 600 / tracking -0.015em
  - `Card Title (H2)`: 18px / line-height 26px / font-weight 600 / tracking -0.01em
  - `Section Subtitle (H3)`: 15px / line-height 22px / font-weight 600
  - `Body Regular`: 14px / line-height 20px / font-weight 400
  - `Body Medium`: 14px / line-height 20px / font-weight 500
  - `Micro / Metadata`: 12px / line-height 16px / font-weight 500 / tracking +0.01em
- **Spatial Grid:** 4px baseline grid (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).

---

## 3. Product Workflows & Three Primary Actions

The dashboard directly answers the core creator question:  
**"What do you want to create today?"**

```
+-----------------------------------------------------------------------------------------+
|                               WHAT DO YOU WANT TO CREATE TODAY?                         |
|                                                                                         |
|  [ 1. Create Clips from Long Video ]  [ 2. Edit an Existing Video ]  [ 3. Automate Social ]  |
+-----------------------------------------------------------------------------------------+
```

### 3.1 The Three Core Operating Modes
1. **Quick Mode:**
   - Single-drop upload or URL paste.
   - Choose clip count (e.g. 5, 10) & duration (15s, 30s, 60s).
   - AI auto-extracts highlights, applies default subtitle style, and auto-generates 9:16 vertical outputs.
   - Ready to schedule or download in $<3$ minutes.
2. **Advanced Mode:**
   - Multi-track timeline: video, audio stems, subtitles, b-roll overlays.
   - Dynamic smart-reframe editor: drag active speaker bounding box, set dual-speaker split screen.
   - Full subtitle customization: word-by-word font styling, stroke, shadows, position, emoji stickers.
   - Audio equalizer, compressor, background music fader, and speed ramping.
3. **AI Auto-Pilot Mode:**
   - Autonomous background pipeline.
   - Setup once: link podcast YouTube channel or Dropbox folder $\rightarrow$ set target accounts $\rightarrow$ set publishing cadence.
   - AI analyzes new uploads, extracts clips, generates descriptions and hashtags, and queues posts to the calendar for optional one-tap approval.

---

## 4. Layout Architecture & Responsive Breakpoints

### 4.1 Desktop Standard (>= 1024px)
- **Top Bar:** Workspace switcher, Search bar (`Cmd+K`), Credit balance indicator, Notification center, User profile.
- **Sidebar (Collapsible 240px $\leftrightarrow$ 64px):**
  - Dashboard
  - Studio (Create Clips / Editor)
  - Projects & Media Library
  - Auto-Pilot & Pipeline
  - Calendar & Publishing
  - Social Accounts
  - Analytics & Reports
  - Settings & Team
- **Main Workspace Canvas:** Uncluttered, clean `#FFFFFF` / `#FAFAFA` contrast, border-defined cards without heavy shadows.

### 4.2 Mobile-First Navigation (< 768px)
- Bottom sticky navigation bar with 5 high-priority touch targets:
  ```
  [ Home ]    [ Create (+) ]    [ Projects ]    [ Calendar ]    [ Profile ]
  ```
- Floating prominent Red Action button for `Create (+)` with haptic feedback feel.
- Touch-friendly scrubbing on timeline with thumb-reach zones for video playback and subtitle edits.

---

## 5. Micro-Interactions & State Design

1. **Loading States:** No spinning spinners that freeze the eye. Use subtle skeleton shimmers with brand-red subtle glow.
2. **Empty States:** Every empty state (e.g. "No clips generated yet", "No social accounts connected") features a clear vector graphic, a friendly 2-line explanation, and an immediate primary action button.
3. **Destructive Actions:** Deleting a project, disconnecting an active social account, or terminating an auto-pilot schedule requires explicit confirmation with irreversible action warnings.
4. **Toast & Notification System:** Non-intrusive bottom-right toasts for background events ("Clip render finished", "Instagram post published successfully") with direct action links ("View Post", "Open in Editor").
