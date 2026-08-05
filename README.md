# LudaVia — Investor Prototype

High-fidelity investor prototype for LudaVia. The current UI uses Tailwind CSS with local Magic UI-style primitives for the splash, five-step journey, and snapshot review. See `IMPLEMENTATION_PLAN.md` for the original product scope.

## Prerequisites

- Node.js 24 (LTS). The default Homebrew `node` may be an EOL line; use `node@24` and put `/opt/homebrew/opt/node@24/bin` first in `PATH`.
- npm

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Astryx remains installed as a reversible migration dependency, but the active app screens no longer import it.
