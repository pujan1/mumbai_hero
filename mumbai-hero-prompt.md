# Mumbai Hero — MVP Build Prompt

## Project Overview

Build the MVP of **Mumbai Hero**, a 2D top-down JRPG-style game in the visual tradition of classic Game Boy Advance era role-playing games (16-bit pixel art, tile-based maps, sprite-based characters with 4-direction walk animations). The player controls an 18-year-old protagonist (selectable boy or girl) living in a Mumbai *kholi* (a small one-room dwelling typical of Mumbai chawls) who explores a single dense neighborhood and meets 5–7 elders, each of whom introduces one of six career storylines.

This MVP delivers **one fully playable neighborhood** as a vertical slice. All systems must be architected so the game can scale to multiple neighborhoods, dozens of NPCs, full storyline progression, shops, power-ups, fast-travel between districts, multi-device play, leaderboards, and analytics — without rewrites.

The project is structured as a **monorepo with a frontend (Phaser game client) and a backend (Node API server)**. Authoritative game state lives on the backend so it can later move to a real database, sync across devices, and support server-side validation of player actions. For MVP, the backend stores state in an in-memory TypeScript object that is dumped to a local JSON file on shutdown — but it is built behind a `GameStateRepository` interface so swapping in SQLite or Postgres later is a single-file change.

---

## Target Platform & Display

- **Orientation:** Portrait (mobile-first), but must run in a desktop browser for development.
- **Aspect ratio:** Design for 9:16 (e.g., 360×640 logical resolution, scaled up).
- **Screen layout (top to bottom):**
  - **Top 20%** — Stats HUD (player name, current storyline, level/stage indicator, money/coins, energy/stamina placeholder)
  - **Middle ~10–15%** — Dialogue/text box. Hidden when no dialogue is active; the game view expands to fill the freed space when hidden.
  - **Bottom ~65–70%** — Game viewport (the actual map and player sprite)
  - **Overlaid on bottom of game view** — Translucent on-screen controls: D-pad on bottom-left, A/B action buttons on bottom-right, start/menu button top-right of the HUD area.
- **Input:** Both touch (translucent on-screen controls) AND keyboard must work simultaneously for development. Keyboard mapping: Arrow keys / WASD for movement, Z or Space = A button (interact/confirm), X or Shift = B button (cancel/back), Enter = Start/Menu.

---

## Tech Stack

### Frontend (game client)
- **Engine:** Phaser 3 (latest stable)
- **Language:** TypeScript (strict mode enabled)
- **Build tool:** Vite
- **Map editor format:** Tiled (`.tmj` JSON export) — even if the MVP map is hand-coded as a tilemap data array, the loader must accept Tiled JSON so future maps drop in directly.
- **Client-side state:** A lightweight custom event bus + a typed `GameState` mirror that is hydrated from the backend on load and updated via API responses. Do NOT pull in Redux or similar.
- **Local cache:** `localStorage` is used only as an *offline cache* of the last-known good state, not as the source of truth. The backend is authoritative.
- **HTTP client:** Native `fetch` wrapped in a thin `ApiClient` service. No axios.

### Backend (game server)
- **Runtime:** Node.js (LTS) with TypeScript (strict mode).
- **Framework:** [Hono](https://hono.dev/) or Express — pick Hono if the implementer is comfortable with it (smaller, faster, modern), otherwise Express. Document the choice.
- **Persistence (MVP):** In-memory TypeScript object acting as the database. On graceful shutdown (and on a debounced timer every ~5 seconds), the object is serialized to a local JSON file (`server/data/db.json`). On startup, if the file exists, it is loaded back in. This gives durable-enough persistence without a real DB dependency.
- **Persistence abstraction:** All data access goes through a `GameStateRepository` interface. The MVP implementation is `InMemoryGameStateRepository`. Future implementations (`SqliteGameStateRepository`, `PostgresGameStateRepository`) drop in without touching route handlers.
- **Validation:** [Zod](https://zod.dev/) schemas on every request body and response. The same schemas are reused on the frontend for type-safe API calls.
- **Auth (MVP):** None. Each player gets an anonymous `playerId` (UUID) generated on first launch and stored in `localStorage`. Every API call sends it as an `X-Player-Id` header. This is replaceable with real auth (Clerk, Supabase Auth, custom JWT) later by changing one middleware.
- **Logging:** A simple structured logger. Every action endpoint logs the playerId, action type, and resulting state diff.

### Shared
- **Shared types and Zod schemas** live in a `shared/` package consumed by both client and server. This is the secret sauce of a TypeScript monorepo: define `GameState`, `Storyline`, `DialogueTree`, and API request/response shapes once.
- **Monorepo tooling:** npm workspaces (simplest) or pnpm workspaces. Document the choice.

### General
- **Linting/formatting:** ESLint + Prettier preconfigured at the repo root, applied to all packages.
- **Package manager:** npm (or pnpm if preferred — pick one and document it).

---

## Folder Structure

The project is a monorepo with three packages: `client/` (Phaser game), `server/` (Node API), and `shared/` (types and schemas used by both). File names use kebab-case; class names use PascalCase.

```
mumbai-hero/
├── package.json                    # root workspace config
├── tsconfig.base.json              # shared TS compiler options
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── README.md
├── docs/
│   ├── ARCHITECTURE.md             # how client, server, and shared interact
│   ├── BACKEND.md                  # API endpoints, repository pattern, swap-out guide
│   ├── ADDING-A-STORYLINE.md
│   ├── ADDING-A-SCENE.md
│   ├── DIALOGUE-FORMAT.md
│   └── ASSET-PIPELINE.md
│
├── shared/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                # re-exports everything
│       ├── types/
│       │   ├── game-state.ts       # PlayerProfile, ProgressionState, full GameState
│       │   ├── storyline.ts
│       │   ├── dialogue.ts
│       │   ├── npc.ts
│       │   └── api.ts              # request/response DTOs
│       └── schemas/
│           ├── game-state.schema.ts # Zod schemas mirroring the types
│           └── api.schema.ts
│
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── data/
│   │   └── db.json                 # gitignored; auto-created on first write
│   └── src/
│       ├── main.ts                 # server bootstrap
│       ├── config/
│       │   └── env.ts              # PORT, DB_PATH, etc.
│       ├── routes/
│       │   ├── index.ts
│       │   ├── player.routes.ts    # GET/POST /players, GET /players/:id
│       │   ├── state.routes.ts     # GET /state, the read endpoint
│       │   └── action.routes.ts    # POST /actions/* — the write endpoints
│       ├── services/
│       │   ├── game-engine.service.ts   # action handlers (the rules of the game)
│       │   ├── storyline.service.ts
│       │   └── event-log.service.ts     # appends to player's event log
│       ├── repositories/
│       │   ├── game-state.repository.ts # interface
│       │   └── in-memory-game-state.repository.ts # MVP impl + JSON persistence
│       ├── middleware/
│       │   ├── player-id.middleware.ts  # reads X-Player-Id, attaches to request
│       │   ├── error-handler.middleware.ts
│       │   └── validate.middleware.ts   # Zod-based request validation
│       └── utils/
│           └── logger.ts
│
└── client/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── public/
    │   └── assets/
    │       ├── sprites/
    │       │   ├── characters/
    │       │   ├── npcs/
    │       │   └── objects/
    │       ├── tilesets/
    │       ├── maps/
    │       ├── ui/
    │       └── audio/              # placeholder, empty for MVP
    └── src/
        ├── main.ts                 # Phaser game bootstrap
        ├── config/
        │   ├── game-config.ts      # Phaser config, screen dimensions, layout constants
        │   └── constants.ts        # tile size, speeds, key bindings, layout %s
        ├── scenes/
        │   ├── boot-scene.ts       # asset preload + initial state hydration from server
        │   ├── title-scene.ts      # title + character select (boy/girl)
        │   ├── hud-scene.ts        # always-on overlay: stats + dialogue + controls
        │   ├── world/
        │   │   ├── kholi-interior-scene.ts
        │   │   ├── neighborhood-scene.ts
        │   │   ├── house-bollywood-scene.ts
        │   │   ├── house-music-scene.ts
        │   │   ├── house-textile-scene.ts
        │   │   ├── house-fitness-scene.ts
        │   │   ├── house-food-scene.ts
        │   │   └── house-cinema-scene.ts
        │   └── base-world-scene.ts # abstract parent — handles player, camera, transitions, interactables
        ├── entities/
        │   ├── player.ts
        │   ├── npc.ts
        │   └── interactable.ts
        ├── systems/
        │   ├── dialogue-system.ts
        │   ├── interaction-system.ts
        │   ├── story-progression-manager.ts  # client mirror of server progression
        │   ├── fast-travel-system.ts
        │   ├── input-manager.ts
        │   └── scene-transition-manager.ts
        ├── services/
        │   ├── api-client.ts       # wraps fetch, attaches X-Player-Id, parses Zod responses
        │   ├── state-sync.ts       # hydrates GameState from server, dispatches actions, applies updates
        │   └── local-cache.ts      # localStorage fallback (offline cache, NOT source of truth)
        ├── ui/
        │   ├── stats-hud.ts
        │   ├── dialogue-box.ts
        │   ├── on-screen-controls.ts
        │   └── menu-overlay.ts
        ├── data/
        │   ├── dialogues/
        │   │   ├── elder-bollywood.ts
        │   │   ├── elder-music.ts
        │   │   ├── elder-textile.ts
        │   │   ├── elder-fitness.ts
        │   │   ├── elder-food.ts
        │   │   ├── elder-cinema.ts
        │   │   └── household-objects.ts
        │   ├── storylines.ts       # imported from shared/, re-exported for client convenience
        │   ├── npcs.ts
        │   └── interactables.ts
        ├── state/
        │   └── game-state.ts       # client-side mirror, populated by state-sync
        └── utils/
            ├── event-bus.ts
            └── grid.ts
```

A `.gitignore` at the root must exclude `node_modules/`, `dist/`, `server/data/db.json`, and `.env*` files.

---

## Core Systems — Specifications

### 1. `BaseWorldScene` (parent class for all map scenes)
- Loads a Tiled map and tileset.
- Spawns the player at a configurable spawn point.
- Sets up collision layer.
- Hosts the `InteractionSystem` (proximity check on A-button press).
- Handles scene-to-scene transitions via "door" tile properties (e.g., a tile flagged `transition: "neighborhood-scene", spawnAt: "kholi-door"`).
- Subclasses only need to declare which map/tileset to load and any scene-specific NPC spawns.

### 2. `DialogueSystem`
- Dialogue trees defined as data (TypeScript objects in `src/data/dialogues/`).
- Each tree supports: linear lines, branching choices, conditional branches (based on `GameState` flags), and "on-complete" callbacks (e.g., set a flag, give an item, start a storyline).
- Driven by the always-on `HUDScene` dialogue box. Pauses world input while open.
- Document the schema in `docs/DIALOGUE-FORMAT.md`.

### 3. `StoryProgressionManager`
- Holds the six storyline definitions from `data/storylines.ts`. Each storyline has 6 stages (defined below).
- Tracks per-storyline current stage in `GameState`.
- For the MVP, only the **stage-0 → stage-1 transition** needs to actually fire when the player accepts a storyline from an elder. All later stages are defined as data but not playable yet.
- Emits events on stage change so the HUD and any future quest log can react.

### 4. `FastTravelSystem`
- In MVP, register two nodes — `train-station` and `bus-stop` — with screen positions on the neighborhood map.
- Walking onto the trigger tile shows a stub dialogue: "Trains to other parts of Mumbai coming soon!" — and plays a brief idle animation (train passing, or bus pulling up). Same for the bus stop.
- The system itself is built to accept N nodes and route to N scenes; only the stub UI is MVP.

### 5. `StateSync` (client) + `GameStateRepository` (server)
- The backend is the **source of truth** for all persistent state. The client never writes directly to its own state — it dispatches actions to the server, the server validates and applies them, and the client updates its local mirror from the response.
- On boot, the client calls `GET /state` with its `X-Player-Id` and hydrates the `GameState` mirror.
- After every successful action response, the client overwrites its mirror with the server-returned new state and emits a `state:updated` event on the event bus.
- `local-cache.ts` writes the last-known good state to `localStorage` as an offline fallback. If the server is unreachable on boot, the game runs in read-only mode using the cached state and shows a "Reconnecting…" banner. Actions queue and replay on reconnect (MVP can stub this; production-quality replay can come later).
- The server auto-saves the in-memory DB to `server/data/db.json` on a debounced 5-second timer and on `SIGINT`/`SIGTERM`.

### 6. `InputManager`
- Single source of truth for "is the up button currently pressed." Both keyboard handlers and on-screen control touch events feed into it.
- Exposes a small API: `isDown('up')`, `justPressed('action')`, etc.
- Game logic NEVER reads keyboard or pointer events directly.

---

## Backend Architecture

The backend exists from day one even though the MVP could technically work without it. The reason is scalability: every shortcut taken now (writing directly to localStorage, computing storyline progression on the client, trusting client-sent state) is a multi-week refactor later. Building it correctly from the start costs maybe a day extra and saves the project from a rewrite.

### Authoritative state, action-based API

The backend owns the truth. The client describes **what the player tried to do**; the backend decides **what happened**. This is the difference between a game that's trivial to cheat and one that isn't, and it costs nothing extra to build correctly the first time.

**Wrong shape (do not build this):**
```
PUT /state  { money: 9999, storylines: { bollywood: { stage: 5 } } }
```
**Right shape (build this):**
```
POST /actions/talk-to-npc          { npcId: "elder-bollywood" }
POST /actions/accept-storyline     { storylineId: "bollywood" }
POST /actions/interact-with-object { objectId: "kholi-bed" }
POST /actions/enter-scene          { sceneId: "neighborhood" }
```
Every action endpoint returns the new full `GameState` plus a list of `events` that just happened (e.g., `{ type: "storyline-stage-advanced", storylineId: "bollywood", from: 0, to: 1 }`). The client uses the events to trigger animations, sound effects, and HUD flashes; it uses the new state to refresh its mirror.

### What gets stored — three tiers

The `GameState` shape (defined in `shared/types/game-state.ts`) has three parts:

**Tier 1 — `PlayerProfile`** (rarely changes, tiny):
```
{
  playerId: string                  // UUID
  displayName: string | null
  characterChoice: "boy" | "girl"
  createdAt: ISO timestamp
  lastPlayedAt: ISO timestamp
  saveVersion: number               // for schema migrations
}
```

**Tier 2 — `ProgressionState`** (changes often, small — this is "the save file"):
```
{
  currentScene: string              // e.g., "neighborhood-scene"
  spawnPoint: string                // where to place the player on scene load
  money: number
  energy: number                    // placeholder for future stamina mechanic
  inventory: { itemId: string, quantity: number }[]
  flags: Record<string, boolean>    // e.g., "met-elder-bollywood": true
  storylines: Record<StorylineId, { stage: number, startedAt: ISO | null }>
  settings: { audioVolume: number, controlScheme: "default" | "..." }
}
```

**Tier 3 — `EventLog`** (append-only, can grow large):
```
{
  events: { id: string, type: string, payload: object, timestamp: ISO }[]
}
```
Every action handler appends one or more events here. For MVP this is just an array in the in-memory DB; later it migrates to a separate table. It's the foundation of analytics, undo/redo, and "how did the player end up here?" debugging — start logging from day one even if nothing reads from it yet.

**Things deliberately NOT stored:**
- Anything deterministically derivable from other state (e.g., "is the train station unlocked" — compute it).
- Pure client-side concerns (current animation frame, camera position, on-screen button hover state).
- The dialogue trees, storyline definitions, NPC registry — those are static game *content*, defined as code in `shared/` and `client/src/data/`, not in the DB.

### API endpoints (MVP)

```
POST   /players                     // creates a player; body: { characterChoice }
                                    // returns: { playerId, profile, state, events: [] }
GET    /state                       // headers: X-Player-Id
                                    // returns: { profile, progression, recentEvents }

POST   /actions/talk-to-npc         // { npcId }
POST   /actions/accept-storyline    // { storylineId }
POST   /actions/decline-storyline   // { storylineId }
POST   /actions/interact-with-object// { objectId }
POST   /actions/enter-scene         // { sceneId, spawnPoint? }
POST   /actions/update-settings     // { settings: Partial<Settings> }
```
Every action endpoint returns the same shape: `{ state: ProgressionState, events: GameEvent[] }`. The client always replaces its mirror with the returned `state`.

### Repository pattern — the swap-out plan

```typescript
// shared or server interface
interface GameStateRepository {
  createPlayer(profile: PlayerProfile, initialState: ProgressionState): Promise<void>
  getProfile(playerId: string): Promise<PlayerProfile | null>
  getProgression(playerId: string): Promise<ProgressionState | null>
  saveProgression(playerId: string, state: ProgressionState): Promise<void>
  appendEvents(playerId: string, events: GameEvent[]): Promise<void>
  getRecentEvents(playerId: string, limit: number): Promise<GameEvent[]>
}
```

MVP ships `InMemoryGameStateRepository` implementing this interface. The class holds a `Map<playerId, { profile, progression, events }>`, debounces JSON writes to `server/data/db.json`, and loads from that file on construction.

When the project graduates to SQLite or Postgres, a new `SqliteGameStateRepository` implements the same interface and the dependency injection in `main.ts` flips one line. Route handlers and services never change.

### What changes when the backend graduates

This section exists in `docs/BACKEND.md` so future-you knows the migration path:

- **In-memory → SQLite (Drizzle or Prisma):** Write `SqliteGameStateRepository`. Profile and progression become rows; events become an append-only table. Single-developer single-machine — perfect for self-hosting or a small launch.
- **SQLite → Postgres + auth (Supabase / Neon):** Same repository interface, different driver. Add a real auth middleware (replacing the anonymous `X-Player-Id` flow) so players can sync across devices.
- **Add real-time features:** Introduce a websocket layer alongside the HTTP API for things like multiplayer presence or live events. The action-based API design means websocket actions are just a different transport for the same handlers.

---

## MVP Content — What Must Exist

### The Kholi (player's home interior)
A small one-room interior. Interactable objects:
- **Bed** — "You feel rested." (no-op for MVP, hook for future sleep/save mechanic)
- **Stove / kitchen corner** — flavor dialogue
- **Mirror** — flavor dialogue, future cosmetics hook
- **Family photo on wall** — flavor dialogue establishing backstory
- **Door** — exits to neighborhood

### The Neighborhood (exterior hub map)
A dense Mumbai chawl-style neighborhood. Required elements:
- The player's kholi door (re-entry point).
- **6 enterable houses**, one per storyline elder (Bollywood, Playback Singer, Textile, Fitness, Food, Cinematographer). Each house has a clearly marked exterior cue (a film poster outside the Bollywood elder's, a tailor's mannequin outside the textile elder's, etc.).
- **A local train station** with a visible train that passes on a loop animation.
- **A bus stop (BEST bus stop)** with a bus that pulls up periodically.
- **3–5 ambient NPCs** (a chai-wallah, a kid playing cricket, an aunty hanging laundry, a stray dog, a vegetable vendor) with one-line flavor dialogues. These do NOT advance any storyline — they exist to make the world feel alive and to validate the NPC system at scale.
- **Decorative-only buildings** (4–6 closed houses with "Locked" or "Coming soon" dialogue if interacted with) — these are visual placeholders for future shops and power-up vendors. Wire them through the same `Interactable` system the open houses use, so converting them later is just a data change.

### The 6 Elder Houses (interiors)
Each is a small interior with the elder NPC inside. Talking to the elder:
1. Plays an introduction dialogue establishing the career path.
2. Offers the player a choice: "Pursue this path?" → Yes/No.
3. On Yes, sets that storyline's stage to 1 in `GameState`, updates the HUD's "current storyline" indicator, and saves.
4. On No, the elder says they'll be here when the player is ready.

The player can pursue only one storyline at a time in MVP, but the data model must allow multiple concurrent storylines later (storyline state stored as a map, not a single field).

### The Six Storylines (data only — define all 6 stages each)
Define each as data in `src/data/storylines.ts`. MVP only plays stage 0 → 1; stages 2–5 are defined for scaffolding but unreachable.

1. **The Bollywood Star** — small gig advertiser → side actor → ad lead → TV lead → film lead → iconic superstar.
2. **The Playback Singer** — chorus singer → local cafe performer → ad jingle singer → reality TV contestant → Bollywood playback singer → international music icon.
3. **The Textile Mogul** — Mangaldas Market porter → tailor's apprentice → boutique assistant → independent fashion designer → Bollywood celebrity stylist → global fashion label owner.
4. **The Fitness Mogul** — local gym cleaner → personal trainer → celebrity fitness coach → high-end gym chain owner → wellness app founder → global health & fitness tycoon.
5. **The Food Tycoon** — vada pav stall helper → street food cart owner → small Udupi restaurant owner → local eatery chain founder → fine-dining restaurateur → global hospitality tycoon.
6. **The Cinematographer** — Gateway of India tourist photographer → wedding photography assistant → fashion magazine photographer → assistant cinematographer → lead director of photography → Oscar-winning cinematographer.

---

## Player Character

- 18 years old, selectable as boy or girl on the title screen. Choice is stored in `GameState` and determines which sprite is loaded.
- 4-direction walk animation (up, down, left, right), 4 frames per direction, plus 1 idle frame per direction (so 5 frames × 4 directions = 20 frames per character).
- Movement: 8-directional movement is **not** required; stick to 4-directional grid-aligned movement at one tile per ~250ms (tweak to feel right). This matches the classic JRPG feel and keeps collision simple.

---

## Documentation Requirements

Every file in `docs/` must be written before the project is considered done. Specifically:

- **`ARCHITECTURE.md`** — A diagram (ASCII or Mermaid) of how client, server, shared package, scenes, systems, and the event bus interact. Explain the HUD-as-overlay-scene pattern. Explain the action-based API flow (client → POST /actions/* → server validates → returns new state + events → client mirrors).
- **`BACKEND.md`** — Full API reference (every endpoint, request/response shape with examples). Explanation of the repository pattern and the migration path from in-memory → SQLite → Postgres. Explanation of the three state tiers (profile, progression, event log).
- **`ADDING-A-STORYLINE.md`** — A walkthrough: "To add a 7th storyline: (1) add to `shared/storylines.ts`, (2) create dialogue file, (3) create new house scene by copying template, (4) register in `npcs.ts`, (5) no backend changes needed unless the storyline introduces new action types…" etc.
- **`ADDING-A-SCENE.md`** — How to add a new neighborhood/area, including Tiled export settings and how to wire transitions.
- **`DIALOGUE-FORMAT.md`** — Full schema reference with examples of linear, branching, and conditional dialogues.
- **`ASSET-PIPELINE.md`** — Sprite sheet dimensions, tileset conventions, naming rules.
- **`README.md`** — Setup instructions (install, run client, run server, run both with one command), dev commands, controls, project status.

---

## Deliverables Checklist

### Project setup
- [ ] Monorepo with `client/`, `server/`, `shared/` workspaces, runnable with a single root `npm run dev` that starts both client and server in parallel (use `concurrently` or `npm-run-all`).
- [ ] All folders and placeholder files created per the structure above.
- [ ] Shared types and Zod schemas defined in `shared/`, consumed by both client and server.

### Backend
- [ ] `InMemoryGameStateRepository` implementing the `GameStateRepository` interface.
- [ ] All 6 action endpoints implemented and validated with Zod.
- [ ] Auto-save to `server/data/db.json` on debounced timer + graceful shutdown.
- [ ] Load from `db.json` on startup if present.
- [ ] Anonymous `X-Player-Id` middleware in place; new playerIds minted via `POST /players`.
- [ ] Event log appended on every action.
- [ ] Server runs on a configurable port (default 3001), and client points to it via env var.

### Client / game
- [ ] Title screen with boy/girl selection that calls `POST /players` and stores the returned `playerId` in localStorage.
- [ ] On boot after first launch, client reads `playerId` from localStorage, calls `GET /state`, and hydrates the local mirror.
- [ ] Kholi interior scene with at least 4 interactable objects (each fires `POST /actions/interact-with-object`).
- [ ] Neighborhood scene with all 6 elder houses, train station, bus stop, and ambient NPCs.
- [ ] All 6 elder house interiors with elder NPC and full stage-0 dialogue.
- [ ] Accepting a storyline calls `POST /actions/accept-storyline` and the HUD reflects the server-returned new state.
- [ ] HUD overlay (stats top, dialogue middle, on-screen controls bottom) functional.
- [ ] Keyboard AND on-screen controls both working.
- [ ] Offline cache: if the server is unreachable on boot, the game loads from localStorage in read-only mode and displays a "Reconnecting…" banner.

### Content & docs
- [ ] All six storylines defined as data in `shared/types/storyline.ts` + `client/src/data/storylines.ts`.
- [ ] All documentation files written, including `BACKEND.md` with full API reference.
- [ ] Placeholder sprites/tilesets in place (colored rectangles are acceptable for the very first commit; final art will be generated separately using the asset prompts below).

---

## Asset Generation Prompts

All prompts use the **100 px tile / 1200×2600 logical canvas** standard. See [`docs/assets/README.md`](docs/assets/README.md) for visual-style boilerplate, sprite-sheet grid conventions, and the wiring checklist.

| File | Contents |
|------|----------|
| [`docs/assets/01-characters.md`](docs/assets/01-characters.md) | Player Boy, Player Girl |
| [`docs/assets/02-elder-npcs.md`](docs/assets/02-elder-npcs.md) | 6 Elder NPCs (Bollywood, Music, Textile, Fitness, Food, Cinema) |
| [`docs/assets/03-ambient-npcs.md`](docs/assets/03-ambient-npcs.md) | Chai Wallah, Cricket Kid, Laundry Aunty, Vendor, Dog |
| [`docs/assets/04-tilesets.md`](docs/assets/04-tilesets.md) | Kholi interior, Neighborhood exterior, Train station, House interior |
| [`docs/assets/05-vehicles.md`](docs/assets/05-vehicles.md) | Mumbai Local Train, BEST Bus |
| [`docs/assets/06-ui.md`](docs/assets/06-ui.md) | HUD frame, Dialogue box, D-pad, Buttons A/B, Title background |

---

### Visual modes

The game has two distinct visual modes. Every tileset must be consistent with the mode it belongs to.

**Outdoor (overworld — `NeighborhoodScene` / `BaseOutdoorScene`)**
Ground palette: medium-dark grass green `#4a7a3d` as the primary fill; brighter park-grass `#5d9944` for the open cricket-ground block (B2); dark asphalt road `#3d3d4d` forming a 3×3 street grid (two horizontal roads at rows 5–6 and 11–12, two vertical roads at cols 7–8 and 15–16); yellow centre-line dashes `#CCCC44` on road tiles; cricket pitch strip `#a0a870` inside the park block; dark tree/hedge border `#2d5a1e` along all four map edges. Feels like a dense, sun-baked Mumbai neighbourhood with proper streets and distinct building blocks.

**Indoor (house interiors — `BaseIndoorScene`)**
Floor palette: warm honey-toned wood in a subtle checkerboard — lighter tile `#C4A35A`, darker tile `#B8943F`, 1-px gap between tiles. Wall palette: very dark brown `#4A2F0D` (rich teak, almost black). Window accent: small rectangular panes of sky blue `#7AB8D4` set into the top wall. Feels enclosed, warm, domestic. Houses are **not all rectangular**: Bollywood (L — main + right wing), Music (tall narrow), Textile (L — main + lower-left workshop), Fitness (wide rectangle), Food (L — main + right kitchen), Cinema (wider rectangle), Kholi (square 12×12). The tileset must include **inner concave corner tiles** so L-shaped rooms render a clean 270° wall join.

---

## Notes for the Implementing Agent

- Build placeholder colored-rectangle sprites first so the game is testable end-to-end before final art arrives. Wire the asset loader to make swapping in the real PNGs a one-line change per asset.
- When writing the dialogue trees for the elders, keep the introduction tone warm and motivational — these are mentors, not gatekeepers.
- The HUD scene should be Phaser's `scene.launch`'d in parallel with the world scene, not embedded in it. This is critical for clean scene transitions later.
- Do not name or visually reference any real-world copyrighted franchise's characters, logos, or specific designs in the code, comments, or assets. The visual style is "16-bit JRPG" — describe it that way throughout.
- **Action handlers, not state setters.** When in doubt about an API endpoint, ask: "is the client telling the server what it tried to do, or telling the server what to set?" If it's the latter, redesign it. The client describes intent; the server decides outcome.
- **The client never writes to its own GameState directly.** Every change flows through an action → server → response → mirror update. The only exception is purely client-side concerns like "is the dialogue box currently showing" or "what's the camera position."
- **Start logging events from day one** even if nothing reads them yet. Future-you will thank present-you when debugging "how did the player end up with negative money."
- Commit early, commit often. The first commit should already `npm run dev` to a black screen with the title text rendering, and the server should respond `200 OK` to a health check. Work outward from there.

