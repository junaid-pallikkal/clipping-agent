# CLIPGENIUS AI — Component Inventory & UI Catalog

**Document Version:** 1.0.0  
**Framework:** React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + Motion

---

## 1. Atoms (Foundational UI Primitives)

| Component | Props / Variants | Description & States |
|---|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'`, `size: 'sm' \| 'md' \| 'lg'`, `loading: boolean` | Primary uses `#E54848` with hover `#C93636`. Focus ring uses `--brand-red-ring`. |
| `Badge` | `variant: 'brand' \| 'neutral' \| 'success' \| 'warning' \| 'error'`, `size: 'sm' \| 'md'` | Rounded-full pills for status tags (`Published`, `Scheduled`, `AI 98% Virality`). |
| `Input` | `type`, `label`, `error`, `icon`, `helperText` | Border `#EEEEEE`, focus border `#E54848`, clean typography, inline validation state. |
| `Select` & `Dropdown` | `options`, `value`, `onChange`, `searchable` | Clean flyout with animated fade/slide, keyboard navigable. |
| `Slider` | `min`, `max`, `step`, `value`, `onChange`, `formatTooltip` | Scrubbable slider for timeline seeking, audio volume, subtitle positioning. |
| `Modal` & `Dialog` | `isOpen`, `onClose`, `title`, `description`, `size` | Accessible dialog with backdrop blur, trapped focus, escape key dismiss. |
| `Tabs` | `tabs: Array<{id, label, icon, badge}>`, `activeTab` | Underline or pill style with subtle red indicator transition. |
| `Avatar` & `AvatarGroup` | `src`, `name`, `size`, `status` | User profile and connected social account avatars with platform badge overlays. |
| `Tooltip` | `content`, `position: 'top' \| 'bottom' \| 'left' \| 'right'` | Instant micro-explanations for complex editing parameters. |

---

## 2. Molecules & Specialized Widgets

| Component | Purpose & Feature Set |
|---|---|
| `VideoPlayer` | HTML5 custom video player supporting 9:16, 1:1, 16:9 aspect ratios, frame-by-frame scrubbing, play/pause hotkeys (`Space`), and live caption overlay. |
| `ViralityGauge` | Visual radial or linear gauge rendering 0-100 engagement score with breakdown popover (Hook, Pacing, Sentiment). |
| `AudioWaveform` | Canvas/SVG rendered acoustic waveform displaying volume peaks, speech segments, and silence intervals. |
| `SubtitleStyler` | Interactive panel allowing one-click selection of presets (Hormozi, MrBeast, Minimal) plus granular font, color, and position sliders. |
| `AccountCard` | Connected account card showing platform logo (Instagram, YouTube, TikTok, Facebook), handle, health indicator, and disconnect button. |
| `PublishingPostCard` | Scheduled post card with clip thumbnail, scheduled time, channel badge, approval status, and quick reschedule action. |
| `CreditCounter` | Header widget showing remaining transcription minutes and AI credits with one-click upgrade popover. |

---

## 3. Organisms & Complex Views

### 3.1 `VideoUploadZone`
- Drag-and-drop file upload target with file size validation (up to 4GB).
- Tabbed alternative for URL ingestion (YouTube, Google Drive, Vimeo, direct link).
- Real-time progress bar showing upload speed, percentage, and conversion status.

### 3.2 `ClipCardGrid`
- Responsive grid of AI-extracted clips.
- Each card shows: 9:16 video preview on hover, clip duration, virality score badge, hook headline summary, one-click "Edit in Studio", and "Schedule Now" buttons.

### 3.3 `StudioTimeline`
- Multi-track timeline for Advanced Mode:
  - Track 1: Video clip boundaries (trim/split draggable handles).
  - Track 2: Speech transcription word cues.
  - Track 3: Background audio stem with volume automation.
  - Track 4: B-roll / overlay elements.
- Time ruler with zooming capabilities (`Cmd + Scroll`).

### 3.4 `ContentCalendarView`
- Weekly and monthly calendar grid displaying scheduled posts across social platforms.
- Drag-and-drop rescheduling between time slots and dates.
- Filter by connected account, platform, or approval status.

### 3.5 `AutoPilotConfigPanel`
- Guided step-by-step wizard to configure automated clipping rules:
  - Source channel / folder.
  - Number of clips per source video.
  - Preferred duration (e.g. 30-45s).
  - Target social accounts.
  - Approval toggle (Autonomous Auto-Publish vs Require Human Review).
