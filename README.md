# LudaVia — Investor Prototype

High-fidelity investor prototype for LudaVia. The current UI uses Tailwind CSS with local Magic UI-style primitives for the splash, five-step journey, and snapshot review. See `IMPLEMENTATION_PLAN.md` for the product scope and `DEMO_SCRIPT.md` for the investor pitch path.

## Prerequisites

- Node.js 24 (LTS). The default Homebrew `node` may be an EOL line; use `node@24` and put `/opt/homebrew/opt/node@24/bin` first in `PATH`.
- npm

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Live insight configuration

Gemini is read only by the server. Set `GEMINI_API_KEY` in the launch environment or in a local, gitignored `.env.local` file:

```bash
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-3.6-flash
```

Restart the server after changing the key. Never use a `NEXT_PUBLIC_` variable or commit the key. If the key is absent or the request fails, the results briefing shows its prepared fallback insight.

## Build

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Astryx remains installed as a reversible migration dependency, but the active app screens no longer import it.
