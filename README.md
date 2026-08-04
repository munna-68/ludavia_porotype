# LudaVia — Investor Prototype

High-fidelity investor prototype for LudaVia. See `IMPLEMENTATION_PLAN.md` for the full build plan, stage status, and scope.

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
