# CLIPGENIUS AI — Instructions for Future Coding Agents

**Document Version:** 1.0.0  
**Target:** Autonomous AI Agents, Subagents, and Human Developers

---

## 1. Prime Directives & Operating Rules

1. **Inspect Before Modifying:** Never alter an existing file without reading its contents, exports, and imports first.
2. **Preserve Working Conventions:** Follow the established white-and-red design system tokens, Tailwind CSS utility classes, and TypeScript type contracts.
3. **No Fake Functionality:** Never create mock buttons that do nothing, simulated progress bars that do not map to real state, or fake analytics numbers without explicit labeling.
4. **Enforce Server-Side Security:** Never trust client-sent user IDs or roles. Always authenticate via `auth.uid()` and enforce policies in PostgreSQL RLS or Edge Function headers.
5. **Protect Secrets & OAuth Credentials:** Never log, store, or output social media access tokens, refresh tokens, or API keys in client-side bundles or repository commits.
6. **Frame-Accurate Video Timing:** When manipulating audio/video cues, never round timestamps to coarse integers; maintain double-precision floats (`NUMERIC(10, 2)` or JavaScript `Number` with 2-3 decimal precision).

---

## 2. Codebase Conventions & Structure

```
clipping agent/
├── src/
│   ├── components/         # Reusable atomic and molecular UI components
│   │   ├── common/         # Buttons, Badges, Modals, Inputs
│   │   ├── editor/         # VideoPlayer, StudioTimeline, SubtitleStyler
│   │   ├── calendar/       # ContentCalendarView, PostCard
│   │   ├── social/         # AccountCard, ConnectModal
│   │   └── dashboard/      # ViralityGauge, CreditCounter, ProjectCard
│   ├── hooks/              # Custom React hooks (useVideoSync, useClips, useWorkspace)
│   ├── lib/                # Utility functions, API clients, Supabase client
│   │   ├── supabase.ts     # Supabase client instantiation
│   │   ├── timecode.ts     # Timestamp math and formatting
│   │   ├── subtitle.ts     # Subtitle parser & generator
│   │   └── virality.ts     # Scoring heuristics
│   ├── stores/             # Zustand state stores (editorStore, workspaceStore)
│   ├── types/              # TypeScript database models and interface definitions
│   └── views/              # High-level route views (Dashboard, Studio, Calendar, Settings)
├── supabase/
│   ├── migrations/         # PostgreSQL schema DDL and RLS policies
│   └── functions/          # Deno Edge Functions (OAuth, Webhooks, Transcribe)
```

---

## 3. Mandatory Review Checklist Before Marking Work Complete

- [ ] Code compiles without TypeScript errors (`tsc --noEmit`).
- [ ] No ESLint / Oxlint warnings or unresolved imports.
- [ ] Responsive design verified on Mobile viewport (390px) and Desktop viewport (1440px).
- [ ] Loading, Error, and Empty states implemented for all async data hooks.
- [ ] RLS policies verified so users cannot access data belonging to other workspaces.
