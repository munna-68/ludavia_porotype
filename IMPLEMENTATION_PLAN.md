# LudaVia Investor Prototype — Implementation Plan

## Orientation (read this first, every session)

**Product:** LudaVia (secondary mark **L:V**). Investor-facing high-fidelity prototype — not production.
**Goal:** Convince stakeholders in a live laptop demo. Visual polish and a seamless end-to-end flow beat backend completeness.
**Demo story:** User shares a bit about their business → sees one sample opportunity + one sample connection → gets a **live** AI growth summary (Gemini) with **one** clear recommended next step.
**Brand (locked for this prototype):**
- Dominant: black / near-black (dark-first aesthetic; light mode still required and polished)
- Accent: `#4e1d8e` (brand purple) — sparse, intentional (primary CTAs, key highlights only)
- Not in scope brand systems: anything referencing “Connect & Grow AI”, charcoal/deep-blue/bronze palettes, or full production specs (auth, billing, admin, moderation). Ignore those docs if found.
**Stack:**
- Next.js (App Router) — UI + minimal API route for Gemini
- GSAP — motion (load/scroll text reveals, page transitions; optional preloader)
- [Astryx](https://astryx.atmeta.com) (`@astryxdesign/core` + theme packages) — component library
- Gemini API — real call for the growth summary (demo key will be provided; simple config is fine, not production secret handling)
**Logos:** Approved LudaVia logo files (light-bg and dark-bg variants) will be placed in the repo. Use them **unchanged**. Do not redraw or reinterpret.
**Out of scope (do not build):** marketing landing page, auth/accounts, billing, messaging, moderation, real opportunity DB, admin tools. If unsure, leave it out and note under “Future / out of scope” at the bottom of this file — do not expand scope.
**Mobile-first CSS, desktop-strong layout** — demo is shown on a laptop.

---

## Global rules for every executing agent

1. **One stage per session unless told otherwise.** Open this file, find the lowest-numbered stage with `Status: NOT STARTED` (or the stage number you were told to run), implement only that stage.
2. **Do not skip stages.** Later stages assume earlier ones are complete.
3. **Verify before marking complete.** Run the checks in the stage’s Acceptance Criteria. Only then change:
   - `**Status: NOT STARTED**` → `**Status: COMPLETED**`
   - Add a one-line note: `Completed: YYYY-MM-DD — <what was verified>`
4. **Never mark COMPLETED without verification.** If blocked, set `**Status: BLOCKED**` and write why under the stage.
5. **No drive-by refactors** outside the stage objective. No extra features.
6. **Astryx first.** Prefer Astryx components (`Button`, `Field`, `TextInput`, `Selector`, `Card`, `Heading`, `Text`, `VStack`/`HStack`/`Grid`, `Spinner`, `Banner`, `Skeleton`, `Markdown`, etc.). Before inventing UI primitives, run:
   ```bash
   npm run astryx -- component <Name> --dense
   ```
   (after the `astryx` script exists). Read generated `AGENTS.md` / Astryx agent docs when present.
7. **Comments:** do not add explanatory comments unless the stage explicitly asks.
8. **When finished with a stage:** update this file’s status line for that stage, leave the working tree in a runnable state (`npm run dev` works).

### Status legend
- `NOT STARTED` — ready to pick up
- `IN PROGRESS` — optional; set if mid-session handoff
- `COMPLETED` — verified against acceptance criteria
- `BLOCKED` — cannot finish; reason documented in-stage

### Model tier legend
- **Low** — scaffolding, boilerplate, exact patterns
- **Medium** — integration, moderate judgment
- **High** — design tradeoffs, subtle UX/logic, easy-to-get-wrong polish
- **Super-intelligent** — architectural ambiguity / hard-to-reverse cross-cutting choices

---

## Suggested app shape (all agents: follow this structure)

Create/keep roughly this tree (adjust only if a stage requires it):

```
/
├── IMPLEMENTATION_PLAN.md          ← this file
├── package.json
├── next.config.ts
├── tsconfig.json
├── public/
│   └── brand/
│       ├── ludavia-logo-light.svg  (or .png — whatever is supplied)
│       └── ludavia-logo-dark.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 ← splash / entry
│   │   ├── globals.css
│   │   ├── form/page.tsx            ← business needs form
│   │   ├── results/page.tsx         ← results view
│   │   └── api/generate-summary/route.ts
│   ├── components/
│   │   ├── providers/
│   │   │   └── app-providers.tsx    ← Theme + mode + any client providers
│   │   ├── chrome/
│   │   │   ├── app-header.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── splash/
│   │   │   └── splash-screen.tsx
│   │   ├── form/
│   │   │   └── business-needs-form.tsx
│   │   ├── results/
│   │   │   ├── opportunity-card.tsx
│   │   │   ├── connection-card.tsx
│   │   │   ├── ai-summary-panel.tsx
│   │   │   └── next-step-panel.tsx
│   │   └── motion/
│   │       └── gsap-*.tsx           ← as needed
│   ├── data/
│   │   ├── sample-opportunity.ts
│   │   ├── sample-connection.ts
│   │   └── fallback-summary.ts
│   ├── lib/
│   │   ├── types.ts
│   │   ├── theme.ts                 ← LudaVia defineTheme
│   │   ├── session-store.ts         ← client form state handoff
│   │   └── gemini.ts                ← server-side Gemini helper (optional)
│   └── config/
│       └── demo.ts                  ← GEMINI_API_KEY placeholder for demo
├── AGENTS.md                        ← generated by astryx init (do not hand-author conventions)
└── README.md                        ← minimal run instructions (stage that adds it)
```

**Flow:** `/` (splash) → `/form` (business needs) → `/results` (cards + live AI summary + next step).

**State handoff:** Form data lives in `sessionStorage` (and/or a tiny client store) so refresh on `/results` can still show context. No database.

---

## Stage 0 — Repo hygiene & empty-state check

**Objective:** Confirm the repo is ready and this plan is the source of truth.

**Instructions:**
1. Confirm working directory is the repo root.
2. Confirm no conflicting app already exists (repo may be empty except git + this plan).
3. Do not delete `IMPLEMENTATION_PLAN.md`.
4. If logo files are already present under `public/brand/`, note their exact filenames in a short comment at the top of Stage 5 (edit this plan: add “Logo files found: …”). If absent, leave Stage 5 as-is (placeholders allowed until real assets land).

**Acceptance criteria:**
- [ ] `IMPLEMENTATION_PLAN.md` exists at repo root and is readable.
- [ ] No accidental deletion of plan or `.git`.

**Status: NOT STARTED**  
**Model Tier: Low**

---

## Stage 1 — Scaffold Next.js (App Router, TypeScript)

**Objective:** Create a clean Next.js app foundation.

**Instructions:**
1. Scaffold Next.js in the repo root (not a subfolder). Prefer:
   ```bash
   npx create-next-app@latest . --typescript --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
   ```
   If the tool refuses a non-empty directory because of this plan file, scaffold with flags that allow current directory, or create files manually to match create-next-app defaults. **Keep `IMPLEMENTATION_PLAN.md`.**
2. Use **React 19** and a current Next.js 15+ release (Astryx peer requirement: React ≥ 19).
3. **Do not** add Tailwind unless Astryx Next example requires a bridge — default path is Astryx CSS + optional StyleX later. Prefer plain CSS modules / globals for custom layout chrome.
4. Ensure `npm run dev`, `npm run build` scripts exist.
5. Replace default marketing boilerplate page with a minimal placeholder: heading “LudaVia” and short text “Prototype scaffold”.
6. Add a minimal `README.md` with: project name, `npm install`, `npm run dev`, note that full instructions live in `IMPLEMENTATION_PLAN.md`.

**Acceptance criteria:**
- [ ] `npm install` succeeds.
- [ ] `npm run dev` serves a page at `/` showing the placeholder.
- [ ] `npm run build` succeeds.
- [ ] `src/app` App Router structure is in use.
- [ ] `IMPLEMENTATION_PLAN.md` still present.

**Status: NOT STARTED**  
**Model Tier: Low**

---

## Stage 2 — Install Astryx and generate agent docs

**Objective:** Wire Meta’s Astryx design system and AI agent docs so later stages use correct components.

**Instructions:**
1. Install:
   ```bash
   npm install @astryxdesign/core @astryxdesign/theme-neutral @astryxdesign/cli
   ```
2. Add package script (exact path matters for agents):
   ```json
   "astryx": "node node_modules/@astryxdesign/cli/clients/cli/bin/astryx.mjs"
   ```
3. Run:
   ```bash
   npx @astryxdesign/cli init --features agents
   ```
   (or `npx astryx init --features agents` if available). Commit to reading generated `AGENTS.md`.
4. Import Astryx CSS in `src/app/globals.css` per Astryx getting started:
   - `@import '@astryxdesign/core/reset.css';`
   - `@import '@astryxdesign/core/astryx.css';`
   - `@import '@astryxdesign/theme-neutral/theme.css';` (temporary until custom theme in Stage 3)
5. Create a client `AppProviders` component that wraps children with Astryx `<Theme theme={neutralTheme} mode={...}>` using the **built** theme import pattern recommended for Next.js SSR when possible:
   - Prefer `@astryxdesign/theme-neutral/built` + CSS import for no flash.
6. Wrap root `layout.tsx` with `AppProviders`.
7. On the placeholder page, render one real Astryx `Button` and one `Heading` to prove integration.
8. Consult https://astryx.atmeta.com/docs/getting-started and the example app patterns under `facebook/astryx` `apps/example-nextjs` if build issues arise (StyleX is optional; CSS theme path is enough).

**Acceptance criteria:**
- [ ] Astryx packages installed; `npm run astryx -- component Button --dense` prints docs.
- [ ] Agent docs file(s) generated (e.g. `AGENTS.md`).
- [ ] Home page shows an Astryx Button; no console errors about missing Theme.
- [ ] `npm run build` succeeds.
- [ ] Light content renders with Astryx tokens (not unstyled native button only).

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 3 — LudaVia custom theme (black-dominant + purple accent)

**Objective:** Brand the design system: near-black dominance, accent `#4e1d8e`, working light and dark modes.

**Instructions:**
1. Create `src/lib/theme.ts` using Astryx `defineTheme`:
   - `name: 'ludavia'`
   - `extends: neutralTheme` (from `@astryxdesign/theme-neutral`)
   - Set accent to `#4e1d8e` for light; choose a slightly lifted purple for dark tuple if needed for contrast (e.g. light `#4e1d8e`, dark a readable lighter purple — keep hue family, do not invent a second brand color system).
   - Bias **surfaces toward black/near-black in dark mode** and clean light grays/white in light mode via token overrides (`--color-background-*`, text, borders) as supported by `defineTheme` / token docs.
   - Keep purple **off** large backgrounds; accent is for actions/highlights.
2. Build the theme for SSR if CLI supports it:
   ```bash
   npm run astryx -- theme build ./src/lib/theme.ts
   ```
   Wire built CSS + built theme object into `AppProviders`. If build command fails, use runtime `defineTheme` export and document the limitation in a short note under this stage — still deliver correct colors.
3. Update `globals.css` imports to use the LudaVia theme CSS (and keep core reset/astryx layers). Respect cascade layers if Astryx docs require explicit layer order.
4. Typography: prefer distinctive but restrained pairing available via theme font config (avoid generic “Inter-only AI slop” if theme allows loading a quality display+body pair). Do not add flashy novelty fonts.
5. Smoke-test primary `Button` uses accent; page background feels black-dominant in dark mode.

**Acceptance criteria:**
- [ ] Dark mode default or first paint feels black/near-black, not purple-washed.
- [ ] Primary actions visibly use `#4e1d8e` (or dark-mode accent tuple).
- [ ] Toggling `mode` between `light` and `dark` on `<Theme>` changes surfaces and text correctly (manual test via temporary buttons OK if toggle stage not done).
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: High**

---

## Stage 4 — App chrome: header, logo slots, theme toggle + persistence

**Objective:** Persistent chrome with light/dark toggle that survives refresh.

**Instructions:**
1. Implement `ThemeToggle` client component:
   - Cycles or switches `light` | `dark` (optional: include `system` only if it doesn’t confuse the demo — binary light/dark is preferred for investor control).
   - Persist choice in `localStorage` key `ludavia-theme-mode`.
   - On load, read storage before paint if possible (inline script in `layout.tsx` or careful default) to avoid wrong-theme flash.
2. Lift mode state into `AppProviders`; pass `mode` into Astryx `<Theme>`.
3. Build `AppHeader`:
   - Left: logo image slot (use placeholder text “LudaVia” / “L:V” until Stage 5 assets).
   - Right: theme toggle (Astryx `IconButton` or `Switch` + label; keep accessible `aria-label`).
   - Minimal, premium, not a marketing mega-nav. No fake account menus.
4. Include header on form and results routes; splash may use a quieter variant or delayed chrome (decide for calm splash — header can appear after splash or as slim top bar).
5. Default mode for first visit: **`dark`** (matches dominant black brand for the pitch room).

**Acceptance criteria:**
- [ ] Toggle switches light ↔ dark; entire themed UI updates.
- [ ] Refresh keeps the selected mode.
- [ ] Header layout works at ~390px width and ~1280px width.
- [ ] No layout shift disaster on toggle.
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 5 — Brand assets (logos)

**Objective:** Integrate approved LudaVia logos without alteration.

**Instructions:**
1. Expect files in `public/brand/` (names may vary). Common pattern:
   - `ludavia-logo-light.*` — for use on light backgrounds
   - `ludavia-logo-dark.*` — for use on dark backgrounds  
   If files are missing when this stage runs: create the folder, add a short `public/brand/README.md` listing expected filenames, and keep text wordmark fallback. Set stage to **BLOCKED** only if you were explicitly told assets are already added and they are not; otherwise complete with fallback and note “assets pending”.
2. Create a `BrandLogo` component:
   - Picks light-bg vs dark-bg artwork based on current theme mode (use `useTheme` or mode from context).
   - `alt="LudaVia"`, appropriate height (~28–36px header; larger on splash).
   - Never recolor via CSS filters in a way that “redesigns” the mark; swap files instead.
3. Replace header text placeholder with `BrandLogo`.
4. Use logo on splash prominently.

**Acceptance criteria:**
- [ ] Correct logo variant shows in light mode and in dark mode.
- [ ] Logos are not stretched/distorted; crisp on retina.
- [ ] Fallback wordmark if file 404s (optional but recommended).
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Low**

---

## Stage 6 — Types, demo config, session handoff

**Objective:** Shared TypeScript types and client-side persistence for the demo flow.

**Instructions:**
1. `src/lib/types.ts` — define at least:
   ```ts
   export type BusinessStage = 'idea' | 'early' | 'growing' | 'established';
   export type BusinessNeedsInput = {
     businessName: string;
     businessType: string;      // e.g. SaaS, agency, retail…
     industry: string;
     location: string;
     stage: BusinessStage;
     mainGoal: string;          // primary growth goal
     helpNeeded: string;        // what they want help with
     description?: string;      // optional free text
   };
   export type GrowthSummaryResult = {
     summary: string;           // markdown-friendly plain text
     recommendedNextStep: {
       title: string;
       detail: string;
     };
     source: 'gemini' | 'fallback';
   };
   ```
2. `src/config/demo.ts`:
   - `export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? 'PASTE_DEMO_KEY_HERE';`
   - `export const GEMINI_MODEL = 'gemini-2.0-flash';` (or current stable flash model; adjust if Google renames — pick a fast, cheap model suitable for live demo).
   - Comment in README: for local demo, either paste key in this file **or** set `GEMINI_API_KEY` env. Prototype is not production; do not build a secrets manager.
3. `src/lib/session-store.ts` (client-safe):
   - `saveBusinessNeeds(data: BusinessNeedsInput)`
   - `loadBusinessNeeds(): BusinessNeedsInput | null`
   - `clearBusinessNeeds()`
   - Use `sessionStorage` key `ludavia-business-needs`.
4. No server database.

**Acceptance criteria:**
- [ ] Types compile; imports work from form/results later.
- [ ] Manual test in browser console or throwaway button: save → reload → load returns same JSON.
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Low**

---

## Stage 7 — Splash / entry screen

**Objective:** Premium first impression; route user into the product (not a marketing site).

**Instructions:**
1. Replace `/` page with splash experience (`SplashScreen` client component is fine).
2. Content (copy can be tightened later):
   - Logo
   - Product name LudaVia + restrained tagline (e.g. “See how your business could grow next.”)
   - Single primary CTA: “Start” / “Explore your growth” → navigates to `/form`
   - Optional secondary text line: “Investor prototype” is **not** required on-screen (avoid breaking immersion); keep README honest instead.
3. Layout: generous whitespace, vertical center on desktop, comfortable padding on mobile. Black-dominant in dark mode.
4. No GSAP required yet (Stage 16). CSS-only fade-in is OK.
5. CTA uses Astryx primary `Button`.

**Acceptance criteria:**
- [ ] `/` shows splash only (no long marketing page of features/pricing).
- [ ] CTA navigates to `/form` (form can still be placeholder until Stage 8).
- [ ] Looks intentional at laptop width and phone width.
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 8 — Business needs form UI

**Objective:** Short, high-quality form capturing enough context for a credible AI summary.

**Instructions:**
1. Implement `/form` with `BusinessNeedsForm`.
2. Use Astryx form primitives: `FormLayout`, `Field`, `FieldLabel`, `FieldStatus`, `TextInput`, `TextArea`, `Selector` / `RadioList` as appropriate. Run `npm run astryx -- component Field --dense` etc. before guessing props.
3. **Fields (required unless noted):**
   | Field | Control | Notes |
   |-------|---------|--------|
   | Business name | text | |
   | Business type | select | e.g. Product/SaaS, Service/Agency, Retail/eCom, Marketplace, Other |
   | Industry | text or select | e.g. Health, Fintech, Education, Consumer, B2B services… |
   | Location | text | city/region/country free text |
   | Stage | select/radio | Idea, Early, Growing, Established |
   | Main goal | select | e.g. Find customers, Raise capital, Hire talent, Find partners, Expand market |
   | Help needed | select or short text | e.g. Introductions, Go-to-market, Product feedback, Strategic advice |
   | Description | textarea optional | max ~500 chars |
4. Single primary submit: “See opportunities” (or similar).
5. Layout: one focused column, max-width ~560–640px, not a dense enterprise form. Progress is unnecessary (one step only).
6. Prefill from `loadBusinessNeeds()` if user navigates back.
7. Wire submit in Stage 9; for this stage, submit may `console.log` if needed but prefer implementing controlled state fully now.

**Acceptance criteria:**
- [ ] All fields render with labels; keyboard accessible.
- [ ] Mobile: no horizontal scroll; inputs full width.
- [ ] Desktop: centered refined column, strong hierarchy.
- [ ] Uses Astryx components (not raw unstyled HTML inputs only).
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 9 — Form validation + navigate to results

**Objective:** Validate input, persist session, go to `/results`.

**Instructions:**
1. On submit:
   - Trim strings; require all non-optional fields.
   - Show inline `FieldStatus` errors; focus first invalid field.
   - Character limits: name/type/industry/location reasonable (e.g. 80–120); description 500.
2. On success: `saveBusinessNeeds(data)` then `router.push('/results')`.
3. `/results` page: if no session data, redirect to `/form` or show a calm empty state with link back to form (prefer redirect for demo reliability).
4. Optional: disable submit button while navigating.

**Acceptance criteria:**
- [ ] Empty submit shows errors and does not navigate.
- [ ] Valid submit writes sessionStorage and lands on `/results`.
- [ ] Visiting `/results` cold (no data) does not crash; recovers via redirect or CTA.
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Low**

---

## Stage 10 — Sample opportunity + connection data

**Objective:** Curated static demo cards that feel relevant (not a real DB).

**Instructions:**
1. `src/data/sample-opportunity.ts` — export one rich opportunity object, e.g.:
   - title, organization/program name, type (grant / pilot / partnership / accelerator), location/scope, deadline or timeframe, whyItFits (1–2 sentences with `{{industry}}` / `{{goal}}` placeholders), ctaLabel
2. `src/data/sample-connection.ts` — one person/org connection:
   - name, role, organization, mutualContext, expertise tags, whyConnect, location
3. `src/lib/personalize.ts` — tiny helper to fill placeholders from `BusinessNeedsInput` so cards feel tailored without AI.
4. Keep tone premium and realistic. No lorem ipsum. No joke content.
5. Do **not** build browsing, search, or multiple pages of inventory.

**Acceptance criteria:**
- [ ] Modules export typed data + personalize helper.
- [ ] Personalize substitutes business industry/goal/location when present.
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Low**

---

## Stage 11 — Results page layout shell

**Objective:** Structure the results experience before filling every widget.

**Instructions:**
1. Build `/results` layout:
   - Top: short recap line from session (“Growth snapshot for {businessName} · {industry} · {location}”) + text button “Edit details” → `/form`.
   - Main grid (desktop): **two cards side-by-side** (opportunity | connection), then **full-width AI summary**, then **recommended next step**.
   - Mobile: single column, same order: opportunity → connection → summary → next step.
2. Use Astryx `Grid`, `Section`, `Heading`, `Text`, `Card` shells with skeleton placeholders inside summary area for now.
3. Ensure header + theme toggle still present.
4. Max content width ~1040–1120px centered; generous vertical rhythm.

**Acceptance criteria:**
- [ ] With session data present, layout matches the structure above at 1280px and 390px.
- [ ] Edit details returns to form with data prefilling (from Stage 8/6).
- [ ] No crash without AI wired yet.
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 12 — Opportunity card + connection card UI

**Objective:** High-polish sample cards that look investor-real.

**Instructions:**
1. `OpportunityCard` — use Astryx `Card`, `Badge`/`Token` for type, clear title, org, timeframe, personalized “Why this fits”, secondary button “View details” that can open an Astryx `Dialog` with the same content expanded (dialog is optional but nice; if dialog, keep simple — no real navigation).
2. `ConnectionCard` — avatar initials via `Avatar`, name, role, org, tags, personalized why, CTA “Request intro” (button may be non-functional or toast “Prototype: intro flow coming soon” via Astryx toast — **no real messaging**).
3. Personalize with session business needs.
4. Visual hierarchy: scannable in 3 seconds. Purple only on primary actions / small accents.
5. Do not use generic multi-column dashboard clutter.

**Acceptance criteria:**
- [ ] Both cards render personalized copy from session data.
- [ ] Desktop side-by-side; mobile stacked.
- [ ] CTAs do not break demo (no dead error throws).
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 13 — Gemini API route (server)

**Objective:** Real Gemini call returning summary + next step JSON.

**Instructions:**
1. Add dependency: `@google/generative-ai` (official SDK) **or** use `fetch` to the Gemini REST endpoint. Prefer official SDK if maintained.
2. Implement `POST src/app/api/generate-summary/route.ts`:
   - Body: `BusinessNeedsInput` JSON.
   - Validate required fields; `400` if invalid.
   - Build a tight system/user prompt:
     - You are LudaVia’s growth strategist.
     - Given the business profile, write: (1) a concise growth summary (120–180 words, 2–3 short paragraphs or markdown bullets), specific to their industry/stage/goal; (2) exactly one recommended next step with `title` (≤8 words) and `detail` (1–2 sentences).
     - Tone: confident, concrete, premium, no hype fluff, no mention of being an AI demo.
     - Return **JSON only** matching `GrowthSummaryResult` without `source` (server sets `source: 'gemini'`).
   - Call Gemini with the demo key from `src/config/demo.ts` / env.
   - Parse JSON (strip markdown fences if model wraps them).
   - On success: `200` with `GrowthSummaryResult`.
   - On failure: `502` or `500` with `{ error: string }` — **do not** silently succeed.
3. Set reasonable timeout; use a fast model for live demos.
4. Never expose the API key to the client bundle (server route / server-only module only).
5. Manual test with curl or a temporary client fetch once key is pasted.

**Acceptance criteria:**
- [ ] With a valid key and body, route returns JSON containing `summary` and `recommendedNextStep`.
- [ ] Invalid body → 400.
- [ ] Missing/invalid key → error response (not a 200 with empty success).
- [ ] API key not present in client JS bundle (grep `.next` / ensure server-only import).
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 14 — AI summary panel (live client integration)

**Objective:** Results page fetches live summary and renders it beautifully.

**Instructions:**
1. `AiSummaryPanel` client component:
   - On mount (when business needs available), `POST /api/generate-summary`.
   - Loading state: Astryx `Skeleton` and/or `Spinner` + calm copy (“Analyzing your growth context…”) — must look premium for 2–5s waits.
   - Success: render summary with Astryx `Markdown` if available, else formatted paragraphs. Show a subtle badge “Live insight” when `source === 'gemini'`.
   - Pass `recommendedNextStep` up via callback/props to Stage 15 component (lift state in results page).
2. Avoid double-fetch in React Strict Mode by using an abort controller + ignore flag, or a simple ref guard.
3. Do not block rendering of opportunity/connection cards on AI — cards show immediately; summary streams in below.

**Acceptance criteria:**
- [ ] Submitting form → results shows cards immediately and summary loading → live text.
- [ ] Strict Mode double-mount does not produce duplicate visible errors (at most one in-flight logical request UX).
- [ ] Readable typography; good contrast in light and dark.
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 15 — Recommended next step + graceful AI fallback

**Objective:** Always show a strong next step; demo never dies if Gemini fails.

**Instructions:**
1. `NextStepPanel`:
   - Highlighted card/section with accent border or quiet purple left rule (restrained).
   - Label: “Recommended next step”.
   - Title + detail from AI when available.
   - Primary CTA button: e.g. “Start this step” — may `toast` prototype message or scroll to opportunity card; must not 404.
2. `src/data/fallback-summary.ts`:
   - High-quality static `GrowthSummaryResult` with `source: 'fallback'`.
   - Personalize lightly with business name/goal via helper.
3. In `AiSummaryPanel` error/timeout path:
   - Use fallback content automatically.
   - Show a non-alarming `Banner` or muted text: “Showing a prepared insight while live generation is unavailable.” — **never** a red stack trace or blank panel mid-pitch.
4. Results page always ends with a visible next step within a few seconds max (if Gemini hangs, client timeout ~8–12s then fallback).

**Acceptance criteria:**
- [ ] Forced API failure (bad key or offline) still shows summary + next step fallback.
- [ ] Live success path shows Gemini content and next step without fallback banner.
- [ ] Timeout path falls back cleanly.
- [ ] Investor can always point to one clear next action on screen.
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 16 — GSAP motion (load, reveal, transitions)

**Objective:** “Wow” motion without gimmicks; 60fps feel on laptop.

**Instructions:**
1. Install `gsap` (and `@gsap/react` if desired).
2. Splash: elegant logo/title fade-up + CTA slight delay; optional very short preloader (logo pulse → content) **only if** it stays under ~1.2s and can be skipped on repeat visits (`sessionStorage` flag).
3. Form: subtle section enter (opacity/y); no jank on inputs.
4. Results: staggered card reveal (opportunity, connection, then summary area); text reveal for headings via split lines **or** simple fade-up if split is fragile.
5. Respect `prefers-reduced-motion`: skip/minimize animations.
6. Kill tweens on unmount; no memory leaks.
7. Do not animate layout properties that cause expensive reflow thrash; prefer transform/opacity.
8. Keep purple/motion tasteful — this is editorial premium, not a game trailer.

**Acceptance criteria:**
- [ ] Splash animation plays once per visit path and looks smooth.
- [ ] Results cards stagger in without blocking interaction for long.
- [ ] `prefers-reduced-motion: reduce` disables non-essential motion.
- [ ] No hydration warnings from GSAP misuse (run animations in `useEffect` / client only).
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: High**

---

## Stage 17 — Responsive polish & laptop demo pass

**Objective:** Pixel-feel confidence for a live investor meeting on a laptop, plus credible mobile.

**Instructions:**
1. Test at widths: 390, 768, 1024, 1280, 1440.
2. Fix: overflow, uneven gaps, weak tap targets (<44px), header collision, form keyboard issues.
3. Desktop: tighten alignment of the two cards; ensure summary reads like a featured editorial block.
4. Verify theme toggle and logos at each breakpoint.
5. Loading and fallback states re-checked visually in both themes.
6. Performance: no huge unoptimized images; logos appropriately sized.
7. Add `metadata` in root layout: title `LudaVia`, description short.

**Acceptance criteria:**
- [ ] No horizontal scroll at 390 or 1280.
- [ ] Demo path splash → form → results completable with mouse only in <60 seconds of user time (excluding AI latency).
- [ ] Both themes look intentionally designed (not “inverted colors only”).
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: High**

---

## Stage 18 — End-to-end demo script hardening

**Objective:** Make the happy path bulletproof for a pitch.

**Instructions:**
1. Create `DEMO_SCRIPT.md` at repo root with:
   - Exact click path and sample spoken lines (60–90 seconds).
   - Sample form values that produce a strong Gemini story (pick one coherent fictional business).
   - What to do if Wi‑Fi dies (fallback already on screen).
   - How to set the Gemini key (`src/config/demo.ts` or env).
2. Seed optional “Demo fill” ghost control on the form: small text button “Use sample business” that fills fields with the script’s sample values (very useful live). Not a second product feature — a presenter aid. Hide it visually as subtle text link under the form.
3. Verify cold start: `npm run build && npm run start` production mode once.
4. Fix any bugs found; do not add new features.

**Acceptance criteria:**
- [ ] `DEMO_SCRIPT.md` exists and matches the actual UI labels.
- [ ] “Use sample business” fills valid values and submits successfully.
- [ ] Production server serves the full flow.
- [ ] Fallback verified once with key removed/invalid.
- [ ] `npm run build` succeeds.

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Stage 19 — Final QA checklist (release gate)

**Objective:** Sign-off pass; only bugfixes.

**Instructions:**
Run through this checklist and fix failures only:

### Functional
- [ ] Splash CTA → form
- [ ] Validation works
- [ ] Session persists to results; edit details returns with data
- [ ] Opportunity + connection personalized
- [ ] Gemini live summary works with real key
- [ ] Fallback works without key / on error
- [ ] Next step always visible after load/fallback
- [ ] Theme toggle persists

### Brand / UI
- [ ] Black-dominant dark theme; purple used sparingly
- [ ] Logos correct per theme; not redrawn
- [ ] No “Connect & Grow AI” naming anywhere in UI
- [ ] No leftover Next.js default assets/copy

### Technical
- [ ] `npm run build` clean
- [ ] No secrets needed in client bundle
- [ ] README explains install, dev, key placement, demo script pointer

### Scope guard
- [ ] No auth, billing, admin, messaging, marketing landing, or real DB added

When all boxes pass, mark this stage COMPLETED and add at the top of this plan (below Orientation):

```
## Build status: PROTOTYPE COMPLETE
Last verified: YYYY-MM-DD
```

**Status: NOT STARTED**  
**Model Tier: Medium**

---

## Future / out of scope (do not implement in this plan)

- Real authentication, user accounts, persistence DB
- Billing, subscriptions, entitlements
- Real opportunities marketplace + search/filter
- Messaging / intro request backend
- Admin, moderation, trust & safety
- Multi-step onboarding wizard beyond the single form
- Marketing website / SEO blog
- Mobile native apps
- Production secrets management, rate limiting, observability suites
- Full “Connect & Grow AI” engineering spec

---

## Quick resume guide (for a new session)

```
1. Open IMPLEMENTATION_PLAN.md
2. Search for "**Status: NOT STARTED**" (or BLOCKED)
3. Read Orientation + Global rules + the stage body
4. Implement only that stage
5. Verify acceptance criteria
6. Mark Status: COMPLETED with date + verification note
7. Stop (or continue only if user asked for multiple stages)
```

### Recommended model tier by stage (summary)

| Stage | Topic                         | Tier              |
|------:|-------------------------------|-------------------|
| 0     | Hygiene                       | Low               |
| 1     | Next.js scaffold              | Low               |
| 2     | Astryx install                | Medium            |
| 3     | Custom theme                  | High              |
| 4     | Chrome + theme toggle         | Medium            |
| 5     | Logos                         | Low               |
| 6     | Types + session               | Low               |
| 7     | Splash                        | Medium            |
| 8     | Form UI                       | Medium            |
| 9     | Validation + nav              | Low               |
| 10    | Sample data                   | Low               |
| 11    | Results shell                 | Medium            |
| 12    | Cards UI                      | Medium            |
| 13    | Gemini API route              | Medium            |
| 14    | AI summary client             | Medium            |
| 15    | Next step + fallback          | Medium            |
| 16    | GSAP motion                   | High              |
| 17    | Responsive polish             | High              |
| 18    | Demo script hardening         | Medium            |
| 19    | Final QA                      | Medium            |

**Note on Astryx:** Confirmed live at https://astryx.atmeta.com — Meta open-source design system (`@astryxdesign/core`), React 19+, theme packages, CLI (`astryx component`, `astryx init`). Executing agents must use its docs/CLI rather than inventing component APIs.
