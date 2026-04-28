# Mumbai Hero

A 2D top-down JRPG set in Mumbai. Play as an 18-year-old protagonist and choose from six career paths guided by neighbourhood elders.

## Quick Start

```bash
npm install
npm run dev
```

- **Client:** http://localhost:5173
- **Server:** http://localhost:3001
- **Health check:** http://localhost:3001/health

## Controls

| Action | Keyboard | Touch |
|--------|----------|-------|
| Move | Arrow keys / WASD | D-pad |
| Interact / Confirm | Z or Space | A button |
| Cancel / Back | X or Shift | B button |
| Menu | Enter | — |

## Project Structure

```
mumbai-hero/
├── shared/    # Shared TypeScript types and Zod schemas
├── server/    # Node/Express API server (authoritative game state)
└── client/    # Phaser 3 game client
```

## Dev Commands

```bash
npm run dev          # Start both client and server in parallel
npm run build        # Build all packages
npm run lint         # Lint all packages
npm run format       # Format all packages
```

## Environment Variables

**Server** (`server/.env`):
```
PORT=3001
DB_PATH=./data/db.json
CORS_ORIGIN=http://localhost:5173
```

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:3001
```

## Status

MVP — single neighbourhood vertical slice. See `docs/ARCHITECTURE.md` for full system design.
