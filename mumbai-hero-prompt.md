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

Use these prompts with an image generation model (Midjourney, DALL-E, Stable Diffusion, etc.) to produce the final art. Each prompt is **self-contained** — copy the prompt verbatim. **Discard all previously generated assets; regenerate everything at the new 100 px tile specifications below.**

---

### Resolution & tile standards

| Constant | Value | Notes |
|---|---|---|
| `TILE_SIZE` | **100 px** | One map tile is 100 × 100 px |
| `LOGICAL_WIDTH` | **1200 px** | 12 tiles across the viewport |
| `LOGICAL_HEIGHT` | **2600 px** | 19.5 : 9 iPhone ratio |
| Game view height | ~2132 px | 82 % of 2600 — approximately 21 tiles tall |
| HUD area | 260 px | Top 10 % of screen |
| Dialogue area | 208 px | Bottom 8 % of screen |

---

### Visual style (embed verbatim in every prompt)

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow effects, no drop shadows, no gradients, no post-processing filters."

- **Transparent PNG** for all sprites and UI overlays (except the title screen, which is fully opaque).
- **Dimensions listed are exact output file sizes** — no extra padding, margins, or canvas overflow.

---

### Sprite sheet grid conventions

**Walking characters** (player, ambient NPCs):

```
Frame size:  100 × 100 px
Sheet PNG:   500 × 400 px  (5 columns × 4 rows, 20 frames total)

Row 0 (y=0):    facing DOWN  — col 0: idle | cols 1–4: walk cycle
Row 1 (y=100):  facing UP    — col 0: idle | cols 1–4: walk cycle
Row 2 (y=200):  facing LEFT  — col 0: idle | cols 1–4: walk cycle
Row 3 (y=300):  facing RIGHT — col 0: idle | cols 1–4: walk cycle
```

Phaser load: `this.load.spritesheet('player-boy', 'assets/sprites/characters/player-boy.png', { frameWidth: 100, frameHeight: 100 })`

Frame index map:
- 0 = idle-down, 1–4 = walk-down
- 5 = idle-up, 6–9 = walk-up
- 10 = idle-left, 11–14 = walk-left
- 15 = idle-right, 16–19 = walk-right

**Elder NPCs** (stationary, idle only):

```
Frame size:  100 × 100 px
Sheet PNG:   400 × 100 px  (4 columns × 1 row, 4 frames total)

Col 0 (x=0):    facing DOWN  (toward arriving player — primary frame)
Col 1 (x=100):  facing UP
Col 2 (x=200):  facing LEFT
Col 3 (x=300):  facing RIGHT
```

Phaser load: `this.load.spritesheet('npc-elder-bollywood', 'assets/sprites/npcs/npc-elder-bollywood.png', { frameWidth: 100, frameHeight: 100 })`

**Stray Dog** (shorter walk cycle):

```
Frame size:  100 × 100 px
Sheet PNG:   300 × 400 px  (3 columns × 4 rows, 12 frames total)

Col 0: idle | Col 1: walk-frame-1 | Col 2: walk-frame-2
Row 0: DOWN | Row 1: UP | Row 2: LEFT | Row 3: RIGHT
```

---

### Tileset standard

```
Tile size:    100 × 100 px
Sheet width:  1000 px  (10 tiles per row)
Row height:   100 px
Background:   transparent PNG
Seamless:     all ground/floor tiles must tile seamlessly with adjacent same-type tiles
```

---

### Critical constraints (every asset)

- **No anti-aliasing.** Every pixel must be a single solid color.
- **1-pixel black outlines** on all character and object edges.
- **Transparent PNG** for sprites and overlays (except title screen).
- **Dimensions listed are exact output file sizes** — no padding.

---

### A — Player Character Sprite Sheets

**Character proportions at 100 × 100 px** (top-down JRPG, slightly overhead perspective):
- ~5 px transparent margin on all sides; character art within a ~90 × 90 px area
- Head: round/oval ~28 × 24 px, centered horizontally at y = 6–30
- Neck + upper torso: y = 30–58 (~52 px wide at shoulders)
- Lower body + legs: y = 58–90
- Walk cycle (4 frames): frame 1 left foot extended ~10 px forward; frame 2 feet together; frame 3 right foot extended; frame 4 feet together
- Facing DOWN: front face — visible eyes, nose, mouth
- Facing UP: back of head only, no face
- Facing LEFT/RIGHT: side profile, one eye, profile nose

**A1 — Player Boy** → `assets/sprites/characters/player-boy.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled — no blank cells. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Column 0 idle, columns 1–4 walk cycle. Character: Indian teenage boy, 18 years old, lean build. Top-down foreshortening — head oval (~28 × 24 px) centered at y = 6–30. Upper torso (~52 px wide at shoulders) from y = 30–58. Legs and feet from y = 58–90. 5 px transparent margin on all sides. Short straight black hair (#1A1A1A) — from above a dark rounded oval covering the top of the head. Warm brown skin (#8B5A2B). Outfit: sky-blue round-neck T-shirt (#5B9BD5), dark navy jeans (#1A2744), worn grey sneakers (#9B9B9B). Facing-down idle (col 0 row 0): front face — two brown eyes with 4 × 4 px black pupils and small white highlights, tiny nose dot (#8B5A2B deeper), a small curved smile. Walk-down frames (cols 1–4 row 0): left leg swings forward frame 1, both feet together frame 2, right leg swings forward frame 3, both feet together frame 4; arms swing slightly opposite to leg. Row 1 facing-up: back of head (black hair oval), back of blue T-shirt, jeans, shoes — no face. Rows 2–3 facing-left/right: side profile, one visible eye, 2-px nose bump, side of hair. Maximum 32 colors across entire sheet."

**A2 — Player Girl** → `assets/sprites/characters/player-girl.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Column 0 idle, columns 1–4 walk cycle. Character: Indian teenage girl, 18 years old, slim build. Same proportions as boy: head oval y = 6–30, torso y = 30–58, legs y = 58–90, 5 px transparent margin. Long straight black hair (#1A1A1A) in a low ponytail — from above an elongated dark oval at the top of the head with a 4-px-wide tail extending from the south edge to y = 50. Warm brown skin (#8B5A2B). Outfit: mustard-yellow kurti (#D4A017) reaching to mid-thigh (covers most torso in yellow), dark grey leggings (#333333) visible as two narrow dark columns below the kurti hem, flat brown sandals (#A0522D). Facing-down idle: gentle eyes slightly wider-set than boy, soft 4-px smile. Walk-down frames: legging-covered legs alternate beneath the kurti hem; kurti hem sways slightly left/right each frame. Facing-up: ponytail hangs down the center back. Rows 2–3: side profile with ponytail visible on the far side. Maximum 32 colors."

---

### B — Elder NPC Sprite Sheets (stationary, idle only)

All 6 elders: **400 × 100 px** sheet, 4 frames of 100 × 100 px. Character art fills ~88 × 88 px within each cell (6 px margin). Elders are in their 50s–60s — visibly older, broader/heavier builds than the player. Facing-down is the primary frame.

**B1 — Bollywood Elder** → `assets/sprites/npcs/npc-elder-bollywood.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 400 × 100 px PNG. Sprite sheet: 4 columns × 1 row, each cell 100 × 100 px. All 4 cells filled. Col 0 facing-down, col 1 facing-up, col 2 facing-left, col 3 facing-right. Idle only. Character: charismatic Indian man, early 60s, heavyset stocky frame. Broad rounded head (~34 × 28 px) at y = 4–32, wide shoulders at y = 32–60 (torso ~64 px wide), legs at y = 60–88. Short salt-and-pepper hair (#808080 streaks in #1A1A1A) — from above a dark rounded rectangle with grey flecks. Warm brown skin (#7A4A28). Facing-down: neatly trimmed grey beard (#3A2010) on lower 8 px of face oval. Round gold-rimmed spectacles (#FFD700 rings, 2 px thick). Cream kurta (#F5F0DC) with subtle vertical seam lines. Maroon shawl (#8B0000) draped from left shoulder — diagonal band from upper-left to lower-right, 10 px wide. Right hand holds a rolled white film script (6 × 14 px white rectangle). Facing-up: back of head, hair shape, shawl on shoulders. Facing-left/right: side profile, one spectacle ring visible. Maximum 28 colors."

**B2 — Playback Singer Elder** → `assets/sprites/npcs/npc-elder-music.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 400 × 100 px PNG. Sprite sheet: 4 columns × 1 row, each cell 100 × 100 px. All 4 cells filled. Col 0 facing-down, col 1 facing-up, col 2 facing-left, col 3 facing-right. Idle only. Character: elegant Indian woman, early 60s, slim build. Head oval ~28 × 24 px at y = 6–30. Torso ~48 px wide at y = 30–60. Silver-grey hair (#C0C0C0) in a tight bun — from above a neat silver circle (~18 px diameter) at the very top of the head. Warm brown skin (#7A4A28). Deep purple sari (#4B0082) wrapping the entire torso with a 2-px silver embroidery stripe (#C0C0C0) along one draping edge. Facing-down: serene expression — eyes as two thin 6 × 2 px horizontal lines (meditative half-closed), small red bindi dot (#CC0000, 3 px) on forehead. Facing-up: only bun shape visible. Maximum 24 colors."

**B3 — Textile Elder** → `assets/sprites/npcs/npc-elder-textile.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 400 × 100 px PNG. Sprite sheet: 4 columns × 1 row, each cell 100 × 100 px. All 4 cells filled. Col 0 facing-down, col 1 facing-up, col 2 facing-left, col 3 facing-right. Idle only. Character: Indian man, late 50s, stocky build. Head ~32 × 26 px at y = 5–31. Torso ~58 px wide. Balding — from above a skin-toned oval (#8B5A2B) with a thin horseshoe ring of short grey hair (#A0A0A0, 4 px wide) around sides and back. Plain white half-sleeve shirt (#F0F0F0), brown trousers (#6B3A2A). Facing-down: yellow measuring tape (#FFD700) draped around neck, visible as a thin looping 3-px-wide yellow line across upper torso. Right hand holds fabric shears: X-shaped silver (#C0C0C0) cluster 8 × 12 px. Open friendly expression, wide brown eyes. Maximum 24 colors."

**B4 — Fitness Elder** → `assets/sprites/npcs/npc-elder-fitness.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 400 × 100 px PNG. Sprite sheet: 4 columns × 1 row, each cell 100 × 100 px. All 4 cells filled. Col 0 facing-down, col 1 facing-up, col 2 facing-left, col 3 facing-right. Idle only. Character: Indian man, early 50s, exceptionally muscular — the broadest character with shoulders spanning ~80 px of the cell width. Shaved head — wide brown skin oval (#7A4A28, ~36 × 28 px), no hair. Thick black moustache (#1A1A1A) as two 8 × 4 px horizontal strokes flanking center nose in facing-down cell. Sleeveless bright red gym vest (#CC0000) — large solid red torso mass with skin-colored arm strips at sides. Grey track pants (#888888). White towel strip (#F0F0F0, 4 × 20 px) draped diagonally over left shoulder. Facing-down: intense wide-set eyes with prominent brow ridge. Maximum 22 colors."

**B5 — Food Elder** → `assets/sprites/npcs/npc-elder-food.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 400 × 100 px PNG. Sprite sheet: 4 columns × 1 row, each cell 100 × 100 px. All 4 cells filled. Col 0 facing-down, col 1 facing-up, col 2 facing-left, col 3 facing-right. Idle only. Character: Indian man, early 60s, stout rotund build — round torso visibly wider than other elders (~70 px wide). Small white chef's toque (#FFFFFF, 14 × 12 px puffed hat) on head. White cook's shirt (#F5F5F5). White moustache (#F0F0F0, 10 × 4 px patch below nose in facing-down cell). Red-and-white checked lungi (#CC0000 and #FFFFFF alternating 4 × 4 px squares) fills lower body. Right hand holds a silver steel ladle (T-shape: 6 × 16 px handle in grey #C0C0C0, 10 × 8 px oval head). Facing-down: jolly expression — wide eyes, large warm smile. Maximum 24 colors."

**B6 — Cinematographer Elder** → `assets/sprites/npcs/npc-elder-cinema.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 400 × 100 px PNG. Sprite sheet: 4 columns × 1 row, each cell 100 × 100 px. All 4 cells filled. Col 0 facing-down, col 1 facing-up, col 2 facing-left, col 3 facing-right. Idle only. Character: Indian woman, early 50s, lean build. Head oval ~26 × 22 px at y = 6–28. Torso ~48 px wide. Short bobbed hair — dark #1A1A1A oval with thin silver-grey highlights (#D0D0D0, 10 px wide strips) along outer left and right edges (grey temple streaks). Warm brown skin (#7A4A28). Plain black T-shirt (#1A1A1A) — near-all-black torso. Khaki cargo pants (#8B8C5A). Vintage film camera (#4A4A4A, 14 × 10 px body) at chest level on a neck strap — small dark rectangle on torso center with a tiny circular brass lens (#D4A017, 5 px) at one end. Focused analytical expression, slightly furrowed brow. Maximum 24 colors."

---

### C — Ambient NPC Sprite Sheets (walking)

All walking ambient NPCs: **500 × 400 px** sheet, 5 cols × 4 rows, 100 × 100 px per cell, all 20 cells filled. Same grid as player sprites.

**C1 — Chai Wallah** → `assets/sprites/npcs/npc-chai-wallah.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Col 0 idle, cols 1–4 walk cycle. Character: young Indian man, mid-20s, lean. Short black hair (#1A1A1A). Warm brown skin (#8B5A2B). Plain white vest/banyan (#F5F5F5). Beige rolled-up trousers (#D2B48C). Right hand holds a dark brown tin kettle (#5C4033, 10 × 14 px teardrop shape); left hand holds a tiny off-white glass (#F0F0F0, 6 × 8 px). Walk frames: legs alternate, kettle stays in right hand. Maximum 26 colors."

**C2 — Cricket Kid** → `assets/sprites/npcs/npc-cricket-kid.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Col 0 idle, cols 1–4 walk cycle. Character: Indian boy ~10 years old, noticeably shorter — character art occupies only the top 75 px of each 100 × 100 cell (bottom 25 px transparent). Head ~22 × 20 px at y = 6–26. Short black hair (#1A1A1A). Warm brown skin (#8B5A2B). White school shirt (#F5F5F5). Royal blue school shorts (#0047AB). Idle and facing-down: holding a tan cricket bat (#C8A96E) — a thin 4 × 28 px vertical rectangle beside the body with a 10 × 6 px rectangular blade at the bottom. Walk frames: bat swings slightly with movement. Maximum 24 colors."

**C3 — Laundry Aunty** → `assets/sprites/npcs/npc-laundry-aunty.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Col 0 idle, cols 1–4 walk cycle. Character: middle-aged Indian woman, slightly plump — torso visibly wider (~58 px at shoulders). Hair in a tight bun — dark #1A1A1A circle (~18 px diameter) from above. Warm brown skin (#7A4A28). Forest-green sari (#228B22) with 4-px golden-yellow border stripe (#DAA520) along the draping edge at torso bottom. Idle and facing-down: pale-blue damp cloth (#B0C4DE, 50 × 10 px) draped across both arms as a wide band at midriff level. Walk frames: cloth sways slightly. Maximum 28 colors."

---

### D — Stationary Ambient NPC

**D1 — Vegetable Vendor** → `assets/sprites/npcs/npc-vendor.png`

```
Output PNG:  100 × 100 px  — single frame, no animation
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 100 × 100 px PNG, single frame. Scene: Indian man ~40s, sitting cross-legged on the ground. Seated figure occupies upper-left region, approximately a 40 × 40 px area (y = 10–50, x = 5–45). Beige kurta (#D2B48C). White dhoti (#F5F5F5). Warm brown skin (#7A4A28). In front of and slightly right of him (x = 35–90, y = 40–80): a wicker basket seen from above as a flat oval brown shape (#8B6914, 50 × 30 px) with a lighter interior (#A07820). Inside the basket: 4 red tomato circles (#CC2200, 8 × 8 px each), 3 pale onion ovals (#D4C27A, 10 × 8 px each), 2 green chili shapes (#228B22, 4 × 12 px thin ovals). Maximum 22 colors."

---

### E — Stray Dog

**E1 — Stray Dog** → `assets/sprites/npcs/npc-dog.png`

```
Output PNG:  300 × 400 px
Grid:        3 columns × 4 rows, each cell 100 × 100 px (12 cells total)

Col 0: idle | Col 1: walk-frame-1 | Col 2: walk-frame-2
Row 0: facing DOWN | Row 1: facing UP | Row 2: facing LEFT | Row 3: facing RIGHT
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 300 × 400 px PNG. Sprite sheet: 3 columns × 4 rows, each cell 100 × 100 px, 12 cells total. All 12 cells filled. Col 0 idle, col 1 walk-frame-1, col 2 walk-frame-2. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Character: friendly Indian street dog (INDog), quadruped. Top-down view — body is a rounded oval (~60 × 44 px) centered in each cell. Tan fur (#C19A6B). Off-white belly patch (#F0EED0) as a lighter oval at the center of the body. Four stubby legs: 8 × 10 px rounded nubs at the four corners of the body oval. Floppy ears (#8B6914, darker): two teardrop shapes drooping outward from the head sides, ~10 × 14 px each. Tail: a 4 × 20 px curved strip extending from the rear, angled upward ~45° in idle. Small black nose dot (4 × 4 px #1A1A1A) at south edge of head in facing-down cell. Walk-frame-1: front-left and rear-right legs extended 8 px outward. Walk-frame-2: front-right and rear-left legs extended. Maximum 18 colors."

---

### F — Tilesets

All tilesets: **100 × 100 px per tile**, transparent PNG, **1000 px wide** (10 tiles per row).

---

**F1 — Kholi Interior Tileset** → `assets/tilesets/tileset-kholi.png`

```
Output PNG:  1000 × 600 px  (10 columns × 6 rows, 60 tile slots)
```

Tile inventory:

```
Row 0 — Floor & wall bases (tiles 0–9):
  0: Worn cement floor — mid-grey #A8A8A8, diagonal hairline cracks, seamlessly tileable
  1: Floor variant — darker #909090, horizontal crack offset
  2: Floor variant — small corner chip, same grey base
  3: Solid painted wall — faded powder-blue #8AABCC plaster, flat, tileable
  4: Wall with watermark stain — same blue + brownish horizontal stripe
  5: Wall–floor junction — blue wall top 50 px, 8 px dark shadow, grey floor bottom 42 px
  6: Wall corner top-left outer — blue wall on top and left edges meeting at corner
  7: Wall corner top-right outer — mirrored
  8: Open doorway — floor tile, passage gap, no door
  9: Window in wall — metal grill bars #808080 in blue wall, pale light #FFFACD beyond

Row 1 — Doors & small wall items (tiles 10–19):
  10: Closed door — worn wood #6B3A2A, two raised rectangular panels, dark gap at base
  11: Open door — door leaf swung 90° open
  12: Oval mirror — silver frame #C0C0C0 (6 px wide), light-blue interior with highlight glint
  13: Framed family photo — sepia #C8A87A in dark wood frame #4A2C0A on wall
  14: Religious calendar — white paper, red border, on wall
  15: LPG gas cylinder — small red cylinder #CC0000 (20 × 40 px) with white label, against wall
  16: Wall-mounted fan — off-white circular body, 3 dark grey blades
  17: Light switch plate — small cream rectangle on blue wall
  18–19: Transparent (reserved)

Row 2 — Furniture top-halves (tiles 20–29):
  20: Bed top-half — grey metal headboard #808080, light-blue bedsheet #6699CC
  21: Bed top-half variant — orange-floral patterned sheet #E67E22
  22: Wooden side table top — dark brown #4A2C0A, steel cup (silver circle) on surface
  23: 2-burner gas stove top — grey body #666666, two silver burner rings #C0C0C0
  24: Wall-mounted utensil rack (upper) — rail with 3 hanging steel vessels
  25: Wooden chair top-half — ladder-back as two horizontal bars from above
  26: Small plastic stool top-half — light grey flat circle #D0D0D0, 40 px diameter
  27: Stacked folded clothes — mixed colors (blue, beige, white)
  28–29: Transparent (reserved)

Row 3 — Furniture bottom-halves (tiles 30–39):
  30: Bed bottom-half — foot of bed, sheet fold, small white pillow
  31: Bed bottom-half variant — orange-floral sheet foot, pillow
  32: Table bottom-half — dark brown legs on floor
  33: Gas stove bottom-half — stove base on floor
  34: Utensil rack bottom-half — lower shelf with stacked steel plates
  35: Chair bottom-half — seat and four dark legs on floor
  36: Stool bottom-half — three thin grey legs on floor
  37–39: Transparent (reserved)

Rows 4–5: All transparent (reserved)
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 1000 × 600 px PNG. Tile grid: 10 columns × 6 rows, each tile 100 × 100 px. Arrange tiles left-to-right, top-to-bottom exactly as the inventory above. Row 0: tile 0 worn cement floor mid-grey #A8A8A8 with diagonal hairline cracks, seamlessly tileable; tile 1 floor darker #909090 horizontal crack offset; tile 2 floor with corner chip; tile 3 faded powder-blue #8AABCC plaster wall flat tileable; tile 4 same blue wall with brownish horizontal water-stain stripe; tile 5 wall-floor junction (blue wall top 50px, 8px dark shadow, grey floor bottom 42px); tile 6 outer top-left wall corner; tile 7 outer top-right wall corner (mirrored); tile 8 open doorway (floor tile no door); tile 9 barred window in blue wall (metal grill #808080, pale yellow light #FFFACD beyond bars). Row 1: tile 10 closed wooden door #6B3A2A two raised panels dark gap at base; tile 11 open door leaf swung 90°; tile 12 oval mirror silver frame #C0C0C0 light-blue interior; tile 13 framed sepia family photo in dark wood frame on wall; tile 14 white religious calendar with red border on wall; tile 15 red LPG cylinder #CC0000 with white label leaning against wall; tile 16 off-white wall fan with 3 dark blades; tile 17 cream light-switch plate on wall; tiles 18–19 transparent. Row 2: tile 20 bed top-half grey headboard #808080 light-blue sheet #6699CC; tile 21 bed top orange-floral sheet #E67E22; tile 22 small wooden table top #4A2C0A with steel cup; tile 23 2-burner stove top grey body silver rings; tile 24 wall utensil rack upper with hanging vessels; tile 25 wooden chair ladder-back top-half; tile 26 light-grey stool top circle; tile 27 stacked folded clothes; tiles 28–29 transparent. Row 3: tile 30 bed foot sheet fold pillow; tile 31 bed foot floral variant with pillow; tile 32 table legs on floor; tile 33 stove base on floor; tile 34 utensil rack lower shelf with stacked plates; tile 35 chair seat and four legs; tile 36 stool three-legged base; tiles 37–39 transparent. Rows 4–5: fully transparent. All floor tiles seamlessly tileable. Palette: cool-grey concrete, aged blue-grey walls, warm dark-brown furniture, off-white #F0EEE0 as brightest highlight. Maximum 40 colors total."

---

**F2 — Neighborhood Exterior Tileset** → `assets/tilesets/tileset-neighborhood.png`

```
Output PNG:  1000 × 800 px  (10 columns × 8 rows, 80 tile slots)
```

Ground palette (must match `base-outdoor-scene.ts` placeholder colors):
- Grass primary: `#4A7A3D`, lighter variant `#527A40`
- Dirt path center: `#9A8060`, edges `#8A7050`
- Tree/hedge border: `#2D5A1E`

Tile inventory:

```
Row 0 — Ground tiles (0–9):
  0: Grass base — #4A7A3D, subtle 2-px blade dashes in #527A40, seamlessly tileable
  1: Grass variant — different blade pattern, same base color
  2: Dirt path center — dusty tan #9A8060, faint horizontal grain, seamlessly tileable
  3: Dirt path north edge — grass #4A7A3D on top 40 px transitioning to path tan bottom 60 px
  4: Dirt path south edge — mirror of tile 3
  5: Cracked pavement — grey #B0B0B0, thin black crack lines
  6: Pavement variant — darker #909090
  7: Pavement-to-grass transition — pavement left half, grass right half
  8: Muddy patch — dark brown #6B4A2A (near building entrances)
  9: Transparent (reserved)

Row 1 — Border, trees, infrastructure (10–19):
  10: Tree / hedge tile — #2D5A1E base, two round dark-green canopy blobs with 1-px outlines
  11: Tree variant — canopy blobs shifted / offset
  12: Small shrub / bush — medium green #3A7A2A, rounder smaller canopy
  13: Electric pole — dark grey post #606060 (6 px wide) on grass, wire-connection arms at top
  14: Blue plastic water tank on rooftop — blue rectangle #1A5276 on grey concrete roof tile
  15: Small temple corner — white-washed structure #F5F5F5 with saffron flag #FF8C00 on top
  16: Potted tulsi plant — terracotta pot #CC6633 with bright green leaves #228B22
  17: Faded wall advertisement — cream wall #D4B896 with bold red lettering marks #CC2200
  18: Corrugated iron roofing — silver-grey horizontal ridges #A0A0A0, alternating light/dark stripes
  19: Transparent (reserved)

Row 2 — Chawl facade tiles (20–29):
  20: Chawl facade base wall — cream-ochre #D4B896 plaster, flat tileable
  21: Facade with small wooden window frame #4A2C0A (30 × 24 px) in cream wall
  22: Facade with balcony edge — 10 px shadow overhang strip at tile bottom
  23: Facade with decorative arch above door-sized gap
  24: Facade upper floor — cream wall with horizontal ledge-line 20 px from bottom
  25–29: Transparent (reserved)

Row 3 — Elder house entrance tiles (30–39):
  30: Bollywood house door — cream facade + vibrant film poster (#CC2200 & #FFD700) beside dark wood doorframe
  31: Music house entrance — cream facade + painted musical notes (#1A1A1A) above arch
  32: Textile house entrance — cream facade + tailor's dress-form silhouette (#D2B48C) beside door
  33: Fitness house entrance — cream facade + painted dumbbell shape #808080 above door
  34: Food house entrance — cream facade + painted steel thali circle #C0C0C0 + steam lines above door
  35: Cinema house entrance — cream facade + vintage camera silhouette #4A4A4A beside door
  36: Locked house door — plain cream facade + dark wooden door + padlock symbol
  37: Kholi door exterior — worn cream facade + small simple door
  38: Generic house entrance — plain door in cream wall, no markings
  39: Transparent (reserved)

Row 4 — Street objects & props (40–49):
  40: Wooden bench top-down — dark brown planks #4A2C0A with slat lines, 80 × 40 px area on grass
  41: Street lamp — dark post with small yellow bulb circle (#FFD700) at top
  42: Bicycle parked — two wheel circles (#1A1A1A outline, #808080 fill) with frame between
  43: Trash bin — green metal cylinder #228B22 (28 × 36 px) with darker lid strip
  44: Pushcart / handcart — wooden planks #8B6914 (40 × 30 px) with two dark-circle wheels
  45: Manhole cover — dark grey circle #606060 (60 px diam.) with cross-hatch grid on pavement
  46: NPC standing shadow spot — grass tile with faint grey shadow circle (20 px diam.)
  47–49: Transparent (reserved)

Rows 5–7: All transparent (reserved)
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 1000 × 800 px PNG. Tile grid: 10 columns × 8 rows, each tile 100 × 100 px. Arrange tiles left-to-right, top-to-bottom exactly as the inventory above. Row 0 (ground tiles 0–9): tile 0 grass base #4A7A3D seamlessly tileable with subtle 2-px blade dashes in lighter #527A40; tile 1 grass variant different dash pattern; tile 2 dirt path center #9A8060 with faint horizontal grain seamlessly tileable; tile 3 dirt path north edge (grass top 40 px transitioning to tan bottom 60 px); tile 4 dirt path south edge mirror; tile 5 cracked pavement #B0B0B0 thin black cracks; tile 6 darker pavement #909090; tile 7 pavement-to-grass transition; tile 8 muddy patch #6B4A2A; tile 9 transparent. Row 1 (border and infrastructure tiles 10–19): tile 10 tree hedge #2D5A1E with two round dark-green canopy blobs and 1-px outlines; tile 11 tree variant offset; tile 12 small bush #3A7A2A rounder shape; tile 13 concrete electric pole #606060 on grass with wire arms; tile 14 blue water tank #1A5276 on grey roof; tile 15 whitewashed temple corner #F5F5F5 with saffron flag #FF8C00; tile 16 tulsi plant in terracotta pot #CC6633; tile 17 cream wall with faded red ad marks #CC2200; tile 18 corrugated iron roofing silver-grey ridges #A0A0A0; tile 19 transparent. Row 2 (chawl facades 20–29): tile 20 cream-ochre facade #D4B896 flat wall tileable; tile 21 facade with small dark window frame; tile 22 facade with 10 px balcony shadow overhang; tile 23 facade with decorative arch; tile 24 facade upper floor with ledge line; tiles 25–29 transparent. Row 3 (elder house entrances 30–39): tile 30 Bollywood house cream facade with film poster #CC2200 and #FFD700 beside dark wood doorframe; tile 31 music house with painted musical notes above arch; tile 32 textile house with tailor dress-form silhouette; tile 33 fitness house with dumbbell above door; tile 34 food house with thali circle and steam lines; tile 35 cinema house with camera silhouette; tile 36 locked house with padlock; tile 37 kholi door exterior worn small door; tile 38 generic house entrance plain door; tile 39 transparent. Row 4 (street objects 40–49): tile 40 wooden bench dark brown slats #4A2C0A; tile 41 street lamp with yellow bulb; tile 42 parked bicycle two wheel circles; tile 43 green trash bin #228B22; tile 44 wooden pushcart with wheels; tile 45 manhole cover grey circle cross-hatch; tile 46 NPC shadow spot grey circle; tiles 47–49 transparent. Rows 5–7: fully transparent. All grass and ground tiles seamlessly tileable. Maximum 48 colors total. Palette: warm greens for grass, tan-browns for dirt path, cream-ochre for facades, bright accent colors for house markers."

---

**F3 — Train Station Tileset** → `assets/tilesets/tileset-train.png`

```
Output PNG:  1000 × 400 px  (10 columns × 4 rows, 40 tile slots)
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 1000 × 400 px PNG. Tile grid: 10 columns × 4 rows, each tile 100 × 100 px. Row 0 (platform tiles 0–9): tile 0 platform floor warm yellow-ochre #D4A843 with subtle 4-px grout lines (#B89030 cross-hatching), seamlessly tileable; tile 1 platform edge tile (south) same ochre with 12-px black-and-yellow #FFD700 caution stripe along south edge; tile 2 platform edge corner; tile 3 platform with center 4-px white stripe running full 100-px width; tile 4 bench on platform (dark brown plank #4A2C0A occupying north 40 px, transparent south 60 px); tile 5 metal support pillar top-down (grey circle #808080, 20-px diameter, centered on ochre platform); tile 6 station signboard (teal-blue #006994 rectangle 80 × 24 px, white horizontal text-line, centered in tile); tiles 7–9 transparent. Row 1 (track tiles 10–19): tile 10 train track center — two parallel dark steel rails (#444444, 6 px wide, 18 px apart) on grey concrete sleepers #A0A0A0 (sleeper rectangles every 20 px), seamlessly tileable horizontally; tile 11 track variant sleeper offset; tile 12 track buffer end (red buffer stop #CC0000, 20 × 14 px block at end of rails); tile 13 overbridge floor grey #909090 with shadow strips on both sides; tile 14 overbridge railing segment blue bar #0047AB (8 px wide, full tile height); tiles 15–19 transparent. Row 2 (train roof tiles for animated train 20–29): tile 20 train carriage roof center — flat orange #E85B00 with 6-px-wide blue center stripe #1A3B8C running full 100-px width horizontally, 4-px darker orange border #B84500 on north and south edges, seamlessly tileable horizontally; tile 21 train cab/nose tile — same orange with 8 ventilation slit lines (1 px dark, 6 px apart) across full height; tile 22 inter-carriage coupling (10-px dark gap #2A2A2A with grey coupling connector squares); tiles 23–29 transparent. Row 3: fully transparent. Maximum 28 colors."

---

**F4 — Elder House Interior Tileset** → `assets/tilesets/tileset-house.png`

```
Output PNG:  1000 × 600 px  (10 columns × 6 rows, 60 tile slots)
```

Floor / wall reference (must match `BaseIndoorScene` placeholder palette):
- Floor A (lighter checkerboard): `#C4A35A`
- Floor B (darker checkerboard): `#B8943F`
- Wall: very dark teak `#4A2F0D`
- Window: sky-blue `#7AB8D4` in wall
- Inner concave corners (tiles 10–13): required for L-shaped room joins

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 1000 × 600 px PNG. Tile grid: 10 columns × 6 rows, each tile 100 × 100 px. Row 0 (floor and wall bases, tiles 0–9): tile 0 warm honey-wood floor A #C4A35A with subtle horizontal plank grain lines (2-px #B09040 lines every 14 px), seamlessly tileable; tile 1 floor B #B8943F grain lines offset by 7 px to pair with tile 0 in checkerboard, seamlessly tileable; tile 2 dark teak wall #4A2F0D flat solid tileable; tile 3 wall with 6-px picture rail (#6B4420 horizontal strip 14 px from top); tile 4 wall-floor junction (dark teak top 60 px, 6-px shadow #1A0E05, floor A bottom 34 px); tile 5 outer top-left wall corner (teak walls on top and left edges); tile 6 outer top-right wall corner (mirrored); tile 7 open doorway (floor tile, passage gap at wall base); tile 8 closed wooden door #3D1F0D with 2-px brass handle dot #D4A017, set in teak wall; tile 9 wall window — sky-blue pane #7AB8D4 (60 × 44 px) centered in dark teak wall with 4-px black window frame. Row 1 (concave corners and shared furniture tops, tiles 10–19): tile 10 inner concave corner top-left 270° join (dark teak on outer two edges, floor A tile visible in inner 90° quadrant — clean L-room notch); tile 11 inner concave corner top-right (mirror of 10); tile 12 inner concave corner bottom-left; tile 13 inner concave corner bottom-right; tile 14 two-seater sofa back top-half (teal #2E8B8B upholstered back, 80 px wide, 40 px tall in top of tile); tile 15 sofa armrest tile (one end cap, teal with darker side); tile 16 wooden desk top #3D1F0D with small desk lamp (off-white 14-px shade, 4-px yellow bulb dot); tile 17 wall-mounted bookshelf (colorful book spines packed 80 px wide — blue, red, green, yellow, white); tile 18 small side table #6B3A2A with steel glass (16-px silver circle) on top; tile 19 framed certificate on wall (cream paper #F5F0DC in gold frame #D4A017). Row 2 (Bollywood themed decor, tiles 20–29): tile 20 film poster on wall (bold red #CC2200 and gold #FFD700 graphic); tile 21 film reel on shelf (dark grey circle with orange #E85B00 film strip); tile 22 gold award trophy (golden statuette on dark base); tile 23 director's megaphone (grey cone outline); tile 24 clapperboard (black-and-white striped top, white body); tile 25 vintage film projector top-half (dark grey boxy body with round brass lens); tile 26 projector bottom-half (pedestal base); tile 27 rolled film script (white cylinder); tiles 28–29 transparent. Row 3 (Music tiles 30–34, Textile tiles 35–39): tile 30 harmonium top-half (dark brown body #3D1F0D, ivory keys strip #FFFFF0); tile 31 harmonium bottom; tile 32 tanpura instrument (elongated brown gourd #6B3A2A); tile 33 tabla drum pair top-down (two side-by-side brown circles); tile 34 framed concert photograph (sepia tones in gold frame); tile 35 tailor's mannequin top (beige #D2B48C oval torso on thin pole); tile 36 mannequin pole base; tile 37 colorful fabric bolt (rolled magenta #D81B8B cylinder); tile 38 sewing machine top-half (#1A1A1A body with brass flywheel #D4A017); tile 39 sewing machine bottom-half. Row 4 (Fitness tiles 40–44, Food tiles 45–49): tile 40 dumbbell pair top-down (two grey circles #808080 connected by bar); tile 41 rolled yoga mat (purple cylinder end-on #6A0DAD); tile 42 punching bag top (red oval #CC0000); tile 43 punching bag bottom with chain; tile 44 wall mirror (wide horizontal silver strip #C0C0C0); tile 45 kitchen counter top-half (white tile surface #F5F5F5 with green trim); tile 46 counter bottom-half; tile 47 hanging copper pots top-down (two bronze circles #B87333 side by side); tile 48 spice jar row (five small jars: red, yellow, brown, green, orange); tile 49 steel pressure cooker top-down (silver disc with valve). Row 5 (Cinema themed decor, tiles 50–59): tile 50 vintage box camera on shelf (#4A4A4A body, brass lens #D4A017); tile 51 movie clapperboard (black-and-white stripes); tile 52 lighting umbrella top-down (large white/silver circle); tile 53 flat film reel disc top-down; tile 54 framed black-and-white photograph; tile 55 camera tripod top-down (three grey legs converging); tile 56 director's folding chair; tile 57 film award statuette (golden figure); tiles 58–59 transparent. Maximum 52 colors total across entire sheet."

---

### G — Vehicles / Animated Props

Vehicles are static sprites moved by Phaser tweens. Sized to match the 100 px tile standard.

**G1 — Mumbai Local Train Carriage** → `assets/sprites/objects/prop-train.png`

```
Output PNG:  300 × 100 px  — single top-down carriage frame (3 tiles wide × 1 tile tall)
Load as: this.load.image('prop-train', 'assets/sprites/objects/prop-train.png')
Phaser tweens the sprite across the screen horizontally.
```

> "Pixel art, top-down JRPG style, vibrant saturated palette, 1-pixel black outlines, strictly no anti-aliasing, hard pixel edges only. Transparent PNG background. Output: exactly 300 × 100 px PNG. Single frame: top-down view of one Mumbai suburban local train carriage. The carriage roof fills 290 × 88 px (6 px transparent margin on all sides). Roof surface: flat orange #E85B00 as primary fill. A 10-px-wide royal blue stripe #1A3B8C runs horizontally along the full 290 px width at the vertical center of the roof. A 4-px darker-orange border #B84500 runs along both the north and south edges of the roof rectangle. East end (motorman cab): a 16-px-wide section with 6 ventilation slits (1-px black lines, 6 px apart) and a small grey windscreen (20 × 16 px, dark tinted #5A7A9A). West end (tail): two small red tail-light squares #FF0000 (8 × 8 px) in the corners. No wheels visible (hidden under car). Maximum 14 colors."

**G2 — BEST Bus** → `assets/sprites/objects/prop-bus.png`

```
Output PNG:  200 × 100 px  — single top-down bus frame (2 tiles wide × 1 tile tall)
Load as: this.load.image('prop-bus', 'assets/sprites/objects/prop-bus.png')
Phaser tweens the sprite across the screen horizontally.
```

> "Pixel art, top-down JRPG style, vibrant saturated palette, 1-pixel black outlines, strictly no anti-aliasing, hard pixel edges only. Transparent PNG background. Output: exactly 200 × 100 px PNG. Single frame: top-down view of a Mumbai BEST double-decker bus travelling rightward. Bus roof fills 188 × 78 px (6 px transparent margin). From above: lower deck roof is red #CC0000 occupying the southern 36 px of the roof height. Upper deck roof is off-white cream #F5F0DC occupying the northern 42 px. A 4-px dark-red border #8B0000 runs along both long sides. Right end (front, direction of travel): dark tinted windscreen #5A7A9A (18 × 50 px, slightly trapezoidal). Left end (rear): two small red tail-light squares #FF0000 (8 × 8 px) in the lower-deck corners. 2-px shadow strip #1A1A1A along both long edges. No wheels visible. Maximum 12 colors."

---

### H — UI Elements

**H1 — Stats HUD Frame** → `assets/ui/hud-frame.png`

```
Output PNG:  1200 × 260 px  (fully opaque — spans full viewport width)
```

> "Pixel art, JRPG stats HUD panel. Output: exactly 1200 × 260 px PNG, fully opaque. Panel spans full 1200 px width. Background fill: very dark navy #0D0D2B. Top edge: 4-px horizontal gold line #DAA520 spanning full 1200 px. Bottom edge: 4-px dark brass line #6B5A2A. Four brass corner ornaments: L-shaped 20 × 20 px flourish #B8860B at each corner. Left zone (0–180 px): 120 × 120 px inset portrait box with 4-px dark border #1A1A3E and warm tan fill #D4A843, centered vertically (top margin 70 px). Leave interior blank — runtime portrait overlaid by Phaser. Center zone (180–980 px, 800 px wide): three stacked pill-shaped label areas, each a rounded dark rectangle #1A1A3E with 2-px gold border #DAA520, arranged vertically with 20-px gaps. Top pill (y = 20, h = 60, w = 720 px): NAME. Middle pill (y = 100, h = 60): CAREER. Bottom pill (y = 180, h = 60): STAGE. Leave all pill interiors blank. Right zone (980–1200 px, 220 px wide): 60 × 60 px gold coin icon (#FFD700 circle, black outline, dark center dot) at top-center of zone (y = 30), below it a 180 × 60 px dark pill #1A1A3E for coin number, 2-px gold border. No gradients. Strictly hard-edged pixel art. Maximum 20 colors."

---

**H2 — Dialogue Box** → `assets/ui/dialogue-box.png`

```
Output PNG:  1200 × 208 px  (transparent outside the box border)
```

> "Pixel art, JRPG dialogue text box. Output: exactly 1200 × 208 px PNG. 10-px transparent margin on all four sides — visible box occupies 1180 × 188 px centered in the canvas. Box frame: 8-px outer border in dark warm-brown #3D1F0D. 4-px inner rule in slightly lighter #6B3A2A. Interior fill (1164 × 172 px after borders): aged cream parchment #F5EDD5 with subtle texture — horizontal scan lines every 10 px alternating 2-px lighter #FAF4E0 and 2-px darker #E8DFC0, suggesting paper grain. Leave interior blank — runtime text rendered by Phaser. Bottom-right corner: solid downward-pointing triangle in dark brown #3D1F0D, 20 px wide × 14 px tall, positioned 20 px from right interior edge and 14 px from bottom interior edge (text-advance indicator). Maximum 10 colors."

---

**H3 — D-pad** → `assets/ui/dpad.png`

```
Output PNG:  300 × 300 px  (transparent outside the cross shape)
All non-transparent pixels at alpha=128 (50% opacity)
```

> "Pixel art, translucent on-screen D-pad. Output: exactly 300 × 300 px PNG. Cross/plus shape centered in canvas: each arm is 100 px wide and 110 px long, with a 100 × 100 px center square, forming a plus shape that exactly fits the 300 px canvas. All cross pixels alpha=128. Background fully transparent (alpha=0). Cross body color: dark brass #6B5A2A. Lighter raised face on each arm: #9B8040 (88 × 100 px inset rectangle on each arm face). Dark shadow edge around outer perimeter: #2A2010 (3-px outline). Center intersection: 80 × 80 px dark recess circle #4A3A1A. Embossed directional arrows in near-black #1A1A0A — solid triangles centered on each arm face: up arm 24 × 18 px pointing up; down arm pointing down; left arm pointing left; right arm pointing right. Maximum 8 colors."

---

**H4 — Action Button A** → `assets/ui/btn-a.png`

```
Output PNG:  150 × 150 px  (transparent outside the circle)
All non-transparent pixels at alpha=153 (60% opacity)
```

> "Pixel art, translucent on-screen A action button. Output: exactly 150 × 150 px PNG. Circle button: 134 × 134 px circle centered at pixel 75, 75 (8-px transparent margin). All circle pixels alpha=153. Background alpha=0. Base fill: dark red #8B0000. Raised face: lighter red #CC0000 on top-left quadrant (~60 × 60 px). Rim: 4-px black outline on perimeter. Top-left arc highlight: 4-px arc of bright #FF4444 just inside the rim on the upper-left. Label: letter 'A' in chunky 30 × 36 px pixel font (each stroke 4 px wide), solid white #FFFFFF, centered at 75, 75. Maximum 8 colors."

---

**H5 — Action Button B** → `assets/ui/btn-b.png`

```
Output PNG:  150 × 150 px  (transparent outside the circle)
All non-transparent pixels at alpha=153 (60% opacity)
```

> "Pixel art, translucent on-screen B action button. Output: exactly 150 × 150 px PNG. Identical construction to A button (134 × 134 px circle, 8-px margin, alpha=153) with deep navy-blue color scheme. Base fill: deep navy #000066. Raised face: medium blue #0000CC on top-left quadrant. Rim: 4-px black #000000. Highlight arc: 4-px #4444FF. Label: letter 'B' in chunky 30 × 36 px pixel font, solid white #FFFFFF, centered. Maximum 8 colors."

---

**H6 — Title Screen Background** → `assets/ui/title-bg.png`

```
Output PNG:  1200 × 2600 px  (fully opaque — no transparency)
```

> "Pixel art, vertical portrait title screen, JRPG style (Golden Sun era detail quality). Output: exactly 1200 × 2600 px PNG, fully opaque. Sky zone (top 620 px, y = 0–619): five flat horizontal color bands with hard step-change edges — strictly no gradients. Band 1 (y = 0–134, 135 px): deep orange #E87722. Band 2 (y = 135–289, 155 px): amber #F4A23A. Band 3 (y = 290–425, 136 px): golden #F7C76A. Band 4 (y = 426–520, 95 px): pale yellow #FAE0A0. Band 5 (y = 521–619, 99 px): near-white horizon #FFEEC0. Skyline silhouette (y = 480–920): dense jagged rooftop silhouette in near-black #0D0D1A — rectangular chawl blocks of varying heights (30–100 px) packed edge-to-edge across full 1200 px. On rooftops: 24 × 20 px square water tanks (dark boxes), 14 × 14 px satellite dishes (cross shapes), 4-px electric poles with wire arms curving down. Center distance (y = 580–680): Gateway of India silhouette in slightly lighter #1A1A3A — central arch 150 px wide and 100 px tall with flanking smaller towers. Foreground (y = 920–2600): very dark navy #0D0D2B ground plane — faint lighter #121220 vertical path strip centered (200 px wide) leading toward the bottom edge. Title text 'MUMBAI HERO': centered horizontally, y = 710–800. Letters: chunky block pixel font, each letter ~70 px tall and 50–60 px wide, 10 px gaps between letters, 4-px black #000000 outline, bright gold #FFD700 fill, 4-px white #FFFFFF highlight line along top edge of each letter. Subtitle 'YOUR STORY STARTS HERE': centered, y = 830, 20 × 20 px pixel font, white #FFFFFF, 3-px letter spacing. Maximum 32 colors total."

---

The game has two distinct visual modes. Every tileset must be consistent with the mode it belongs to.

**Outdoor (overworld — `BaseOutdoorScene`)**
Ground palette: medium-dark grass green `#4A7A3D` as the primary fill; warm dirt/dust path `#9A8060` (edges `#8A7050`) running horizontally through the middle third; dark tree/hedge border `#2D5A1E` along all four map edges. Feels open and sun-baked.

**Indoor (house interiors — `BaseIndoorScene`)**
Floor palette: warm honey-toned wood in a subtle checkerboard — lighter tile `#C4A35A`, darker tile `#B8943F`, 1-px gap between tiles. Wall palette: very dark brown `#4A2F0D` (rich teak, almost black). Window accent: small rectangular panes of sky blue `#7AB8D4` set into the top wall. Feels enclosed, warm, domestic. Houses are **not all rectangular**: Bollywood (L — main + right wing), Music (tall narrow), Textile (L — main + lower-left workshop), Fitness (wide rectangle), Food (L — main + right kitchen), Cinema (wider rectangle), Kholi (square 12×12). The tileset must include **inner concave corner tiles** so L-shaped rooms render a clean 270° wall join.

### Critical constraints that apply to every asset

- **No anti-aliasing.** Every pixel must be a single solid color — no sub-pixel blending, no smooth color transitions between edges.
- **Hard 1-pixel black outlines** around all characters, objects, and UI panels.
- **Transparent PNG background** for all sprites and UI overlays (except the title screen, which is fully opaque).
- **Maximum color counts** are listed per asset — stay within them so palettes stay cohesive.
- **No glow effects, drop shadows, gradients, or post-processing filters.**
- All **dimensions listed are exact output PNG file sizes** — do not add padding, margins, or canvas overflow.

---

### A — Player Character Sprite Sheets

Both player characters share the same sprite sheet grid:

```
Output PNG:  160 × 128 px
Grid:        5 columns × 4 rows, each cell 32×32 px (20 cells total)

Row 0 (y=0):   facing DOWN  — col 0: idle | cols 1–4: walk frames 1–4
Row 1 (y=32):  facing UP    — col 0: idle | cols 1–4: walk frames 1–4
Row 2 (y=64):  facing LEFT  — col 0: idle | cols 1–4: walk frames 1–4
Row 3 (y=96):  facing RIGHT — col 0: idle | cols 1–4: walk frames 1–4
```

Walk cycle: legs alternate left-right across frames 1→4. Idle: both feet together, arms at sides.  
Top-down foreshortening: body occupies bottom 22 px of each 32×32 cell; head/hair occupies top 10 px.  
All 20 cells must be filled. No blank cells.

Phaser loads these as: `this.load.spritesheet('player-boy', '...player-boy.png', { frameWidth: 32, frameHeight: 32 })`

**A1 — Player Boy** → save as `sprites/characters/player-boy.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges, transparent PNG background. Output: exactly 160×128 px PNG. Sprite sheet grid: 5 columns × 4 rows, each cell 32×32 px. Row order top-to-bottom: facing-down (row 0), facing-up (row 1), facing-left (row 2), facing-right (row 3). Column order left-to-right: idle (col 0), walk-frame-1 (col 1), walk-frame-2 (col 2), walk-frame-3 (col 3), walk-frame-4 (col 4). All 20 cells filled — no empty cells. Character: Indian teenage boy, 18 years old, lean build. Top-down foreshortening — body occupies bottom 22 px of each 32×32 cell, head occupies top 10 px. Short straight black hair (#1A1A1A). Warm brown skin (#8B5A2B). Outfit: plain sky-blue T-shirt (#5B9BD5), dark navy jeans (#1A2744), worn grey sneakers (#9B9B9B). Facing-down idle (col 0, row 0): front-facing face, small friendly expression — two black dot eyes (2×2 px each), tiny 4-px-wide smile. Walk frames (cols 1–4): left and right foot alternate beneath the torso across the 4 frames — frame 1: left foot forward; frame 2: both feet center; frame 3: right foot forward; frame 4: both feet center (mirror of frame 2). Facing-up rows: back of head visible (black hair shape, no face). Facing-left/-right: side profile with one eye visible. Maximum 24 colors total across the entire 160×128 sheet."

**A2 — Player Girl** → save as `sprites/characters/player-girl.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant saturated palette, 1-pixel black outlines, strictly no anti-aliasing, hard pixel edges, transparent PNG background. Output: exactly 160×128 px PNG. Sprite sheet grid: 5 columns × 4 rows, each cell 32×32 px. Row order: facing-down (row 0), facing-up (row 1), facing-left (row 2), facing-right (row 3). Column order: idle (col 0), walk-frame-1 through walk-frame-4 (cols 1–4). All 20 cells filled. Character: Indian teenage girl, 18 years old, slim build. Top-down foreshortening — body occupies bottom 22 px, head occupies top 10 px. Long straight black hair (#1A1A1A) tied in a low loose ponytail — from above, hair appears as a dark oval shape at the top of the head with a thin tail extending slightly south. Warm brown skin (#8B5A2B). Outfit: mustard-yellow kurti top (#D4A017) hanging to mid-thigh (fills most of the body area), dark grey leggings (#333333) visible below the kurti hem, flat brown sandals (#A0522D). Facing-down idle: simple friendly face — two black dot eyes (2×2 px), gentle 4-px-wide smile. Walk frames: feet alternate beneath the kurti just as the boy sprite, but the swinging leg is darker grey (legging) below a yellow hem. Facing-up rows: only the hair ponytail shape visible at top, no face. Maximum 24 colors across the entire sheet."

---

### B — Elder NPC Sprite Sheets (stationary, idle only)

Elders never walk. They stand in their house facing the player. Sheet layout for all 6 elders:

```
Output PNG:  128 × 32 px
Grid:        4 columns × 1 row, each cell 32×32 px (4 cells total)

Col 0 (x=0):   facing DOWN  (toward player arriving from south door — most-used frame)
Col 1 (x=32):  facing UP
Col 2 (x=64):  facing LEFT
Col 3 (x=96):  facing RIGHT
```

Body proportions identical to player sprites (bottom 22 px = body/torso, top 10 px = head).  
All 4 cells must be filled. No blank cells.

Phaser loads as: `this.load.spritesheet('npc-elder-bollywood', '...', { frameWidth: 32, frameHeight: 32 })`

**B1 — Bollywood Elder** → save as `sprites/npcs/npc-elder-bollywood.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 128×32 px PNG. Grid: 4 columns × 1 row, each cell 32×32 px. Column order left-to-right: facing-down (col 0), facing-up (col 1), facing-left (col 2), facing-right (col 3). Idle pose only — no walk frames. All 4 cells filled. Character: charismatic Indian man, early 60s, heavyset frame. Top-down view — head occupies top 10 px, body bottom 22 px of each 32×32 cell. Short salt-and-pepper hair (#808080 streaks on #1A1A1A base) visible from above as a rounded dark shape with grey highlights. Warm brown skin (#7A4A28). In facing-down cell: neatly trimmed beard visible as a dark patch (#2A1A0A) along jaw line. Gold-rimmed circular glasses (#FFD700 2-px rings) on face. Cream-colored kurta (#F5F0DC) forms the torso fill. Maroon shawl (#8B0000) draped from left shoulder — visible from above as a diagonal darker band running from upper-left toward lower-right of the torso. Holding a small rolled white scroll (film script) in the right hand — a 2×6 px white rectangle with black outline. In facing-up cell: back of head, no face detail, shawl band visible on shoulders. Left/right cells: side profile, one eye/glass ring visible. Maximum 20 colors."

**B2 — Playback Singer Elder** → save as `sprites/npcs/npc-elder-music.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 128×32 px PNG. Grid: 4 columns × 1 row, each cell 32×32 px. Column order: facing-down, facing-up, facing-left, facing-right. Idle only. All 4 cells filled. Character: elegant Indian woman, early 60s, slim build. Top-down foreshortening — head (10 px) and body (22 px). Silver-grey hair (#C0C0C0) tied in a tight bun — from above appears as a round light-grey circle at top of head, no stray hairs. Warm brown skin (#7A4A28). Deep purple sari (#4B0082) with a thin silver embroidery border (#C0C0C0, 2 px stripe) along lower wrap edge — the sari fills the entire torso area in purple with a lighter stripe at one edge. In facing-down cell: serene expression, eyes depicted as two thin horizontal lines (meditative half-closed), gentle closed-mouth expression. In facing-up cell: only the bun shape visible. Maximum 20 colors."

**B3 — Textile Elder** → save as `sprites/npcs/npc-elder-textile.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 128×32 px PNG. Grid: 4 columns × 1 row, each cell 32×32 px. Column order: facing-down, facing-up, facing-left, facing-right. Idle only. All 4 cells filled. Character: Indian man, late 50s, stocky build. Balding head visible from above as a tan skin-colored oval (#7A4A28) with only a thin ring of short grey hair (#A0A0A0) around the sides and back. Warm brown skin. Wearing a plain white half-sleeve shirt (#F0F0F0) — white torso fill, sleeve edges visible as thin white extensions at the sides. Brown trousers (#6B3A2A) fill the lower body. Yellow measuring tape (#FFD700) draped around neck — visible from above as a small looping thin yellow line across the upper torso in the facing-down cell. Holding fabric shears in right hand (facing-down cell) — a small X-shaped silver (#C0C0C0) cross of pixels, 4×6 px. Maximum 20 colors."

**B4 — Fitness Elder** → save as `sprites/npcs/npc-elder-fitness.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 128×32 px PNG. Grid: 4 columns × 1 row, each cell 32×32 px. Column order: facing-down, facing-up, facing-left, facing-right. Idle only. All 4 cells filled. Character: Indian man, early 50s, very muscular — the broadest character in the cast, shoulders should almost span the full 30 px usable width of the cell. Shaved head (brown skin #7A4A28 visible all the way to edge of head). Thick black moustache (#1A1A1A) shown as two short horizontal 4-px strokes on either side of the nose in facing-down cell. Sleeveless bright red gym vest (#CC0000) — the wide torso appears as a solid red mass with skin-colored shoulder/arm sides visible. Grey track pants (#888888) fill the lower body. A thin white towel strip (#F0F0F0) draped over the left shoulder — a 2×8 px white strip hanging diagonally. Maximum 20 colors."

**B5 — Food Elder** → save as `sprites/npcs/npc-elder-food.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 128×32 px PNG. Grid: 4 columns × 1 row, each cell 32×32 px. Column order: facing-down, facing-up, facing-left, facing-right. Idle only. All 4 cells filled. Character: Indian man, early 60s, stout rotund build — the torso is wide and rounded. Small white chef's cap (#FFFFFF) on head — from above appears as a white rounded-rectangle shape (10×6 px) sitting atop the head. White moustache (#F5F5F5) visible as a small 4-px white patch below nose (facing-down cell). White cook's shirt (#F5F5F5) — torso is mostly white. Checked red-and-white lungi (#CC0000 and #FFFFFF alternating 2-px squares) fills lower body. Holding a silver steel ladle in right hand — a small T-shaped silver (#C0C0C0) cluster of pixels (3×5 px total). Maximum 20 colors."

**B6 — Cinematographer Elder** → save as `sprites/npcs/npc-elder-cinema.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 128×32 px PNG. Grid: 4 columns × 1 row, each cell 32×32 px. Column order: facing-down, facing-up, facing-left, facing-right. Idle only. All 4 cells filled. Character: Indian woman, early 50s, lean build. Short bobbed hair — from above appears as a dark shape (#1A1A1A) with grey-white streaks on the sides (#DCDCDC highlights at the edges of the hair mass). Warm brown skin (#7A4A28). Plain black T-shirt (#1A1A1A) — torso is nearly all black. Khaki/olive cargo pants (#8B8C5A) fill the lower body. A vintage film camera (#4A4A4A body, 8×6 px rectangle with a tiny brass circular lens #D4A017 at center) hanging at chest level from a neck strap — visible in facing-down cell as a small dark rectangle on the torso. Maximum 20 colors."

---

### C — Ambient NPC Sprite Sheets (walking)

Walking ambient NPCs use the full 5-frame layout. Sheet: **160×128 px** (same grid as the player sprites — 5 cols × 4 rows, 32×32 per cell, all 20 cells filled).

**C1 — Chai-wallah** → save as `sprites/npcs/npc-chai-wallah.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 160×128 px PNG. Grid: 5 columns × 4 rows, each cell 32×32 px, all 20 cells filled. Row order: facing-down (row 0), facing-up (row 1), facing-left (row 2), facing-right (row 3). Column order: idle (col 0), walk-frame-1 through walk-frame-4 (cols 1–4). Top-down foreshortening: head occupies top 10 px, body bottom 22 px. Character: young Indian man, mid-20s, lean. Short black hair (#1A1A1A). Warm brown skin (#8B5A2B). Plain white vest/banyan (#F5F5F5) for torso. Beige rolled-up trousers (#D2B48C) for lower body. In idle and facing-down cells: right hand holds a dark brown tin kettle (#5C4033) — a 5×6 px teardrop shape; left hand holds a tiny off-white small glass (#F0F0F0, 2×3 px white rectangle). Walk frames: legs alternate, kettle stays in right hand. Maximum 22 colors."

**C2 — Cricket kid** → save as `sprites/npcs/npc-cricket-kid.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 160×128 px PNG. Grid: 5 columns × 4 rows, each cell 32×32 px, all 20 cells filled. Row order: facing-down, facing-up, facing-left, facing-right. Column order: idle, walk-frames 1–4. Character: Indian boy ~10 years old. Noticeably shorter than adult NPCs — head occupies top 8 px, body occupies 16 px, with 8 px of empty (transparent) space at the bottom of each cell. Short black hair (#1A1A1A). Warm brown skin (#8B5A2B). Royal blue school shorts (#0047AB) for lower body. White school shirt (#F5F5F5) for torso. Idle and facing-down cells: holding a light tan cricket bat (#C8A96E) in right hand — a thin vertical rectangle 2×14 px beside the body. Walk frames: legs alternate, bat held in right hand swings slightly. Maximum 22 colors."

**C3 — Laundry aunty** → save as `sprites/npcs/npc-laundry-aunty.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 160×128 px PNG. Grid: 5 columns × 4 rows, each cell 32×32 px, all 20 cells filled. Row order: facing-down, facing-up, facing-left, facing-right. Column order: idle, walk-frames 1–4. Top-down foreshortening: head 10 px, body 22 px. Character: middle-aged Indian woman, slightly plump — body wider than the lean characters. Hair in a tight bun — from above, a round dark circle (#1A1A1A, 10 px diameter) at the top of the head. Warm brown skin (#7A4A28). Forest-green sari (#228B22) with a 2-px golden-yellow border stripe (#DAA520) along the bottom hem. Idle and facing-down cells: a pale-blue damp cloth (#B0C4DE) draped across both arms — shown as a wide soft-blue horizontal band (24×6 px) across the sprite's midriff. Walk frames: cloth shifts slightly but remains draped. Maximum 22 colors."

---

### D — Stationary ambient NPC (single frame)

**D1 — Vegetable vendor** → save as `sprites/npcs/npc-vendor.png`

```
Output PNG:  32 × 32 px  — single frame, no animation
```

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 32×32 px PNG, single frame, no animation. Character: Indian man ~40s, sitting cross-legged on the ground. He is compact — his seated body occupies approximately the top-left 18×16 px of the 32×32 cell. Beige kurta shirt (#D2B48C). White dhoti (#F5F5F5) folds visible beneath. Warm brown skin (#7A4A28). In front of and slightly south of him: a wicker basket depicted as a flat oval brown shape (#8B6914, roughly 14×8 px) with contents: 3 bright-red tomato dots (#CC2200, 3×3 px each) and 2 creamy-white onion dots (#D4C27A, 4×4 px each) arranged inside the oval. Total scene fits within 32×32 px. Maximum 18 colors."

---

### E — Stray Dog

The dog has a shorter walk cycle: idle + 2 walk frames per direction.

```
Output PNG:  96 × 128 px
Grid:        3 columns × 4 rows, each cell 32×32 px (12 cells total)

Col 0: idle (standing, tail up)
Col 1: walk-frame-1 (left two legs stepped forward)
Col 2: walk-frame-2 (right two legs stepped forward)

Row 0: facing DOWN
Row 1: facing UP
Row 2: facing LEFT
Row 3: facing RIGHT
```

All 12 cells must be filled.

Phaser loads as: `this.load.spritesheet('npc-dog', '...', { frameWidth: 32, frameHeight: 32 })`

**E1 — Stray dog** → save as `sprites/npcs/npc-dog.png`

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 96×128 px PNG. Grid: 3 columns × 4 rows, each cell 32×32 px, all 12 cells filled. Column order: idle (col 0), walk-frame-1 (col 1), walk-frame-2 (col 2). Row order: facing-down (row 0), facing-up (row 1), facing-left (row 2), facing-right (row 3). Character: friendly Indian street dog (INDog), quadruped. Top-down view — the dog appears as an oval body mass (~24×18 px) centered in each 32×32 cell, with 4 stubby legs at the corners (each leg a 4×4 px dark nub). Tan fur (#C19A6B) body with an off-white chest/belly patch (#F0F0F0) as a lighter oval in the center of the body. Floppy ears (#8B6914, darker than body): two small dark triangular shapes flanking the head, drooping outward. Small black nose dot (2×2 px #1A1A1A) at the southern edge of the head in facing-down cell. In idle frames: short upright tail — a thin 2×6 px stick extending from the rear, angled at 30°. Walk frames: alternate pairs of legs (col 1: front-left + rear-right legs extended; col 2: front-right + rear-left legs extended). Maximum 16 colors."

---

### F — Tilesets

All tilesets: PNG, transparent background, 32×32 px per tile. Each tile must seamlessly tile with adjacent same-type tiles. Sheet width is 512 px (16 tiles per row) for all tilesets below.

**F1 — Kholi Interior Tileset** → save as `tilesets/tileset-kholi.png`

```
Output PNG:  512 × 192 px  (16 columns × 6 rows, 96 tile slots, each tile 32×32 px)
```

Tile layout — left-to-right, top-to-bottom:

```
Row 0 — Floor & wall bases (tiles 0–15):
  0:  Plain worn cement floor — mid-grey #A8A8A8, subtle diagonal hairline crack, fully tileable
  1:  Floor variant — slightly darker #909090 with a horizontal crack
  2:  Floor variant — chip mark in one corner, same grey base
  3:  Solid wall — faded powder-blue #8AABCC painted plaster, flat, tileable
  4:  Wall with stain — same blue wall with a horizontal brownish water-mark stripe
  5:  Wall–floor junction — wall blue on top 16 px, dark shadow strip 4 px, floor grey on bottom 12 px
  6:  Corner junction (top-left) — blue wall on top and left edges meeting at corner
  7:  Corner junction (top-right) — blue wall meeting at right corner
  8:  Open doorway — floor tile showing a passage gap (no door leaf, just floor through)
  9:  Window (in wall) — barred metal grill #808080 set in blue wall, exterior light #FFFACD beyond
  10: Closed door — worn wood #6B3A2A with two raised rectangular panels, dark gap at base
  11: Open door — same door swung 90° (door leaf visible to one side)
  12–15: Transparent (reserved)

Row 1 — Furniture top-halves (tiles 16–31):
  16: Bed top-half — metal headboard #808080, light-blue printed bedsheet #6699CC
  17: Bed top-half variant — same headboard, orange-floral sheet #E67E22
  18: Small wooden table top — dark brown surface #4A2C0A with a steel cup (silver circle) on it
  19: 2-burner gas stove top — grey metal body #666666, two silver burner rings #C0C0C0
  20: Wall-mounted utensil rack (upper) — rack rail with 3 hanging steel vessels (silver ovals)
  21: Wall-mounted fan — off-white circular fan body, 3 dark blades, mounted on blue wall
  22: Oval mirror — silver frame #C0C0C0, light-blue interior with small white highlight glint
  23: Framed family photo — small warm sepia #C8A87A rectangle in a dark wood frame on wall
  24: Religious calendar — small white paper page with a red border, on wall
  25: LPG gas cylinder — small red cylinder #CC0000 (8×18 px) leaning against wall corner
  26–31: Transparent (reserved)

Row 2 — Furniture bottom-halves (tiles 32–47):
  32: Bed bottom-half — foot of bed, bedsheet fold, small pillow visible
  33: Bed bottom-half variant — matching orange-floral sheet foot
  34: Table bottom-half — dark brown legs #4A2C0A
  35: Gas stove bottom-half — stove base sitting on floor
  36: Utensil rack bottom-half — lower shelf with 2 stacked steel plates
  37–47: Transparent (reserved)

Rows 3–5: All transparent (reserved for future expansion)
```

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 512×192 px PNG. Tile grid: 16 columns × 6 rows, each tile 32×32 px. Tiles arranged exactly as follows — Row 0 (floor and wall bases, tiles 0–11 then 4 transparent): tile 0: plain worn cement floor mid-grey #A8A8A8 with a diagonal hairline crack fully tileable; tile 1: floor variant darker #909090 with horizontal crack; tile 2: floor variant with corner chip; tile 3: faded powder-blue #8AABCC plaster wall fully tileable; tile 4: same blue wall with brownish horizontal watermark stripe; tile 5: wall-floor junction (blue wall top 16px, 4px dark shadow strip, grey floor bottom 12px); tile 6: top-left wall corner junction; tile 7: top-right wall corner junction; tile 8: open doorway (floor tile, no door); tile 9: barred window in blue wall (metal grill #808080, pale yellow exterior light #FFFACD); tile 10: closed wooden door #6B3A2A with raised panels; tile 11: open door (door swung open); tiles 12–15: transparent. Row 1 (furniture top-halves, tiles 16–25 then 6 transparent): tile 16: single bed top-half with grey metal headboard #808080 and light-blue bedsheet #6699CC; tile 17: bed top alternate with orange-floral sheet #E67E22; tile 18: small wooden table top #4A2C0A with steel cup; tile 19: 2-burner gas stove top with silver burner rings; tile 20: wall-mounted utensil rack upper shelf with hanging steel vessels; tile 21: wall-mounted off-white fan with 3 dark blades; tile 22: oval mirror with silver frame and light-blue reflective interior; tile 23: small framed sepia family photo #C8A87A in dark wood frame; tile 24: small religious calendar page, white with red border; tile 25: small red LPG gas cylinder #CC0000 leaning in corner; tiles 26–31: transparent. Row 2 (furniture bottom-halves, tiles 32–36 then 11 transparent): tile 32: bed foot with sheet fold; tile 33: bed foot floral variant; tile 34: table legs #4A2C0A; tile 35: stove base on floor; tile 36: utensil rack lower shelf with stacked plates; tiles 37–47: transparent. Rows 3–5: fully transparent. All floor tiles seamlessly tileable. Maximum 32 colors total across entire sheet. Palette: cool-grey concrete, aged blue-grey walls, warm dark-brown furniture, off-white #F0EEE0 as brightest highlight."

---

**F2 — Neighborhood Exterior Tileset** → save as `tilesets/tileset-neighborhood.png`

```
Output PNG:  512 × 256 px  (16 columns × 8 rows, 128 tile slots, each tile 32×32 px)
```

Ground type reference (matches outdoor placeholder palette):
- **Grass** (primary fill): medium-dark green `#4A7A3D`, slightly lighter variant `#527A40`
- **Dirt path** (horizontal band through the middle third): dusty tan-brown `#9A8060`, darker edge `#8A7050`
- **Tree/hedge border** (perimeter row): deep forest green `#2D5A1E` with small round canopy shapes

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 512×256 px PNG. Grid: 16 columns × 8 rows, each tile 32×32 px, 128 total slots. Tiles arranged left-to-right, top-to-bottom. Row 0 — ground tiles: (0) grass base — medium-dark green #4A7A3D, seamlessly tileable, subtle 2-px lighter #527A40 dashed highlights every 6 px to suggest blades; (1) grass variant — slightly different blade pattern, same #4A7A3D base; (2) dirt path center — dusty tan #9A8060, horizontal faint grain lines, seamlessly tileable; (3) dirt path edge (north) — grass #4A7A3D on top 12 px, transition strip, path tan #9A8060 on bottom 20 px; (4) dirt path edge (south) — mirror of tile 3; (5) cracked pavement — grey #B0B0B0 with thin black crack lines, for narrow alley side-streets; (6) pavement variant — slightly darker #909090; (7) pavement-to-grass transition — pavement on left half, grass on right; (8–15) transparent. Row 1 — tree/border and furniture tiles: (16) tree/hedge tile — solid dark green #2D5A1E base, two round canopy blobs (#3A6B26, 18 px diameter each, slightly offset) with 1-px black outlines, for map perimeter; (17) tree variant — canopy shifted slightly; (18) chawl facade wall — cream-ochre #D4B896 plaster, flat tileable; (19) facade with small wooden window frame (dark brown rectangle in cream wall); (20) facade with balcony overhang edge (shadow strip along tile bottom); (21) electric pole base — dark concrete post #606060 centered in a grass tile; (22) electric pole top — pole tip with 3 wire connection dots; (23) plastic blue water tank on rooftop — blue rectangle #1A5276 on grey roof; (24) small temple corner — orange shrine flag #FF8C00 on whitewashed corner structure; (25) potted tulsi plant — terracotta pot #CC6633, bright green tulsi leaves #228B22; (26) faded wall advertisement — red lettering #CC2200 on cream wall; (27) corrugated iron roofing tile; (28–31) transparent. Row 2 — house exterior entrance tiles for all 6 elder houses plus locked houses: (32) Bollywood house door — red-and-yellow film poster (#CC2200 and #FFD700) beside doorway on cream wall; (33) Music house door — small painted music notes (#1A1A1A) above doorway; (34) Textile house exterior — tailor's dress mannequin (#D2B48C torso form on grey pole) standing beside door; (35) Fitness house door — tiny dumbbell shape painted on door; (36) Food house door — steel thali circle painted on wall; (37) Cinema house door — vintage box camera shape painted beside door; (38) Locked house door — plain door with padlock symbol; (39) NPC standing spot — grass tile with a faint grey shadow circle (12 px diameter); (40–47) transparent. Rows 3–7: fully transparent (reserved). All grass and ground tiles seamlessly tileable. Maximum 48 colors total. Palette: warm greens for grass, tan-browns for path, cream-ochre for building facades, bright accent colors for signage."

---

**F3 — Train Station Tileset** → save as `tilesets/tileset-train.png`

```
Output PNG:  512 × 128 px  (16 columns × 4 rows, 64 tile slots, each tile 32×32 px)
```

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 512×128 px PNG. Grid: 16 columns × 4 rows, each tile 32×32 px. Row 0 — platform surface tiles: (0) platform floor — warm yellow-ochre #D4A843 smooth tiles, seamlessly tileable; (1) platform edge tile — same ochre with black-and-yellow #FFD700 caution stripe (4 px wide) along the south edge; (2) platform edge corner tile; (3) platform with painted white center line (2 px wide); (4) bench top-down — dark brown plank #4A2C0A seat occupying the top 16 px of tile, legs implied by shadows; (5) metal pillar top-down — grey circle #808080 (12 px diameter) on ochre platform; (6) blue station name sign board — teal-blue #006994 rectangle (28×12 px) with white horizontal text-placeholder bar; (7–15) transparent. Row 1 — track tiles: (16) train track — two parallel dark steel rails (#444444, 3 px wide each, 8 px apart) on grey concrete sleepers #A0A0A0, seamlessly tileable horizontally; (17) track variant — sleeper offset; (18) track buffer end tile — a red buffer stop #CC0000 at end of rails; (19) foot-overbridge floor tile — concrete grey #909090 with railing shadow strips along both sides; (20) overbridge railing tile — a blue painted railing bar; (21–31) transparent. Row 2 — train carriage roof tiles (top-down view of train from above, placed on map to represent train on tracks): (32) train carriage roof center tile — flat orange #E85B00 roof with a 3 px wide blue center stripe #1A3B8C running the full 32 px horizontally, seamlessly tileable; (33) train carriage nose/cab tile — slightly tapered front end with ventilation slits (thin dark lines); (34) inter-carriage coupling tile — a 4 px dark gap with grey coupling connector; (35–47) transparent. Row 3: fully transparent. Maximum 24 colors."

---

**F4 — Elder House Interior Tileset** → save as `tilesets/tileset-house.png`

```
Output PNG:  512 × 192 px  (16 columns × 6 rows, 96 tile slots, each tile 32×32 px)
```

Floor / wall / window reference (matches indoor placeholder palette):
- **Floor A** (lighter checkerboard tile): warm honey wood `#C4A35A`
- **Floor B** (darker checkerboard tile): slightly deeper honey `#B8943F`
- **Wall**: very dark teak-brown `#4A2F0D` (used for all four outer walls AND the inner walls of L-shaped wings)
- **Window accent**: sky-blue pane `#7AB8D4` set flush into the top wall tile
- **Inner concave corner** (270° join where an L-shaped wing meets the main room): tiles 10–13 below

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 512×192 px PNG. Grid: 16 columns × 6 rows, each tile 32×32 px. Row 0 — floor and wall bases: (0) warm honey-wood floor tile A #C4A35A — subtle horizontal plank grain lines (1-px #B09040 lines every 8 px), seamlessly tileable; (1) warm honey-wood floor tile B #B8943F — grain lines offset by 4 px to pair with tile 0 in a checkerboard, seamlessly tileable; (2) dark teak wall #4A2F0D — flat solid, no decoration, tileable (all four outer walls and L-wing inner walls use this); (3) wall with horizontal picture rail — same dark teak wall with a thin 3-px lighter brown rail #6B4420 running 8 px from the top; (4) wall-floor junction — dark teak wall on top 20 px, a 4-px deep shadow strip #1A0E05, then floor A tile on bottom 8 px; (5) outer top-left corner — dark teak, meeting corner of two wall edges; (6) outer top-right corner — dark teak, mirrored; (7) open doorway — floor tile showing a passage gap at the base of a wall; (8) closed door — sturdy dark wood #3D1F0D with 2-px brass handle dot #D4A017, set into teak wall; (9) wall window — sky-blue pane #7AB8D4 (24×18 px) centered in a dark teak wall tile, 1-px black window frame; (10) inner concave corner (top-left, 270°) — for L-shaped room joins: dark teak fills the outer two edges, floor A tile visible in the inner 90° quadrant, produces a clean notch corner; (11) inner concave corner (top-right, 270°) — mirror of tile 10; (12) inner concave corner (bottom-left, 270°); (13) inner concave corner (bottom-right, 270°); (14–15) transparent. Row 1 — shared furniture top-halves: (16) two-seater sofa top — teal upholstered back #2E8B8B; (17) sofa armrest tile (one end of sofa); (18) wooden desk top #3D1F0D with a small desk lamp (off-white shade, yellow bulb dot); (19) wall-mounted bookshelf — colorful book spines packed horizontally; (20) small side table #6B3A2A with a steel glass on top; (21) framed certificate on wall — cream paper #F5F0DC in gold frame #D4A017; (22–31) transparent. Row 2 — shared furniture bottom-halves: (32) sofa seat and base; (33) sofa armrest base; (34) desk legs and floor; (35–47) transparent. Rows 3–5 — six themed decoration sets, 8 tiles per career, left-to-right: Row 3 tiles 48–55 (Bollywood): film poster wall tile (bold red #CC2200 and gold #FFD700 graphic on dark teak wall); film reel on shelf (circular dark grey reel with orange #E85B00 film strip); gold award trophy (golden figure on dark base); director's megaphone (grey cone); clapperboard (black/white striped top, white body); vintage film projector top-half (boxy dark grey body with round lens); vintage projector bottom-half (pedestal base); rolled film script. Row 3 tiles 56–63 (Music): harmonium instrument top-half (dark brown #3D1F0D body, ivory keys #FFFFF0 strip); harmonium bottom-half; tanpura instrument (oval brown gourd #6B3A2A); framed concert photograph (sepia tones); tabla drum pair top-down (two circles #6B3A2A side by side); hand-written music notation sheet; microphone on stand top-down (thin grey stand, grey bulb top); transparent. Row 4 tiles 64–71 (Textile): tailor's mannequin top (beige #D2B48C oval torso on thin grey pole); mannequin pole base; colorful fabric bolt on shelf (rolled magenta #D81B8B fabric); sewing machine top-half (black body #1A1A1A with brass flywheel #D4A017); sewing machine bottom-half; large fabric scissors (silver #C0C0C0); measuring tape looped (yellow #FFD700); thread spool (small colorful cylinder). Row 4 tiles 72–79 (Fitness): dumbbell pair top-down (two grey circles #808080 connected by a bar); rolled yoga mat (purple cylinder #6A0DAD end-on); punching bag top (red oval #CC0000); punching bag bottom (chain link above); wall mirror (wide horizontal silver strip #C0C0C0); resistance band loop (yellow #FFD700 loop); water bottle (blue #1A5276 cylinder); gym trophy (golden cup). Row 5 tiles 80–87 (Food): kitchen counter top-half (white tiled surface with green trim #228B22); counter bottom-half; hanging copper pots top-down (two circles #B87333, side by side); spice jar row (five tiny jars: red #CC2200, yellow #FFD700, brown #8B6914, green #228B22, orange #E67E22); steel pressure cooker top-down (silver disc with valve); wooden cutting board with vegetable cross-sections; clay pot top-down (terracotta #CC6633 circle); transparent. Row 5 tiles 88–95 (Cinema): vintage box camera on shelf (#4A4A4A body, brass lens #D4A017); movie clapperboard (black/white stripes); lighting umbrella top-down (large white/silver circle #E0E0E0); flat film reel disc; framed black-and-white photograph; tripod stand top-down (three grey lines converging); director's folding chair top-down; film award statuette (golden figure). Maximum 48 colors total across entire sheet."

---

### G — Vehicles / Animated Props

**G1 — Mumbai Local Train (animated)** → save as `sprites/objects/prop-train.png`

```
Output PNG:  192 × 128 px
Grid:        1 column × 4 rows, each frame 192×32 px (4 frames total)

The train passes horizontally. Each frame shows 3 linked carriages (each carriage 64×32 px).
Frame 0 (y=0):   train position A — rightmost start position
Frame 1 (y=32):  train position B — shifted 6 px left
Frame 2 (y=64):  train position C — shifted 12 px left
Frame 3 (y=96):  train position D — shifted 18 px left

Phaser animates by looping frames 0→3 while also tweening the sprite left.
Load as: frameWidth: 192, frameHeight: 32
```

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 192×128 px PNG. Grid: 1 column × 4 rows, each frame 192×32 px — 4 sequential animation frames stacked vertically. Each frame shows a top-down view of a Mumbai suburban local train: 3 linked carriages, each carriage exactly 64×32 px wide, connected end-to-end to fill the full 192 px width. Top-down carriage view: the visible surface is the flat roof. Carriage roof: orange #E85B00 fills most of the 64×28 px carriage area (2 px transparent margin on each long side for track gap). A 3-px wide blue stripe #1A3B8C runs horizontally along the center of each carriage roof for its full 64 px length. The outer edges of the roof have a 2-px darker orange shadow #B84500 border. At each inter-carriage joint (at x=64 and x=128): a 3-px dark gap #2A2A2A with tiny grey coupling dots. Left end (motorman's cab): same orange roof but slightly narrower front — a 4-px strip of ventilation slits (thin dark lines 1 px wide, spaced 3 px apart) across the full 32 px height. All 4 frames show the identical train — the position offset is achieved by Phaser tweening, not by drawing the train in different positions. Maximum 14 colors."

**G2 — BEST Bus (animated)** → save as `sprites/objects/prop-bus.png`

```
Output PNG:  64 × 128 px
Grid:        1 column × 4 rows, each frame 64×32 px (4 frames total)

All 4 frames are identical — Phaser moves the sprite via tween.
Load as: frameWidth: 64, frameHeight: 32
```

> "16-bit pixel art, top-down JRPG style, Game Boy Advance era, vibrant palette, 1-pixel black outlines, strictly no anti-aliasing, transparent PNG background. Output: exactly 64×128 px PNG. Grid: 1 column × 4 rows, each frame 64×32 px — 4 identical frames stacked. Each frame shows a top-down (bird's-eye) view of a Mumbai BEST double-decker bus travelling rightward. Bus body: 58×26 px centered in the 64×32 cell (3 px transparent margin on each side). From above, the roof of the lower deck is red #CC2200 occupying the southern 14 px of the bus body width. The upper deck roof is off-white cream #F5F0DC occupying the northern 12 px. A thin 2-px dark red border #8B0000 runs along the full length of both sides of the bus. Front (right end of the 58 px body): dark tinted blue-grey windscreen #5A7A9A (8×20 px trapezoid). Rear (left end): two tiny red tail-light squares #FF0000 (3×3 px each). No wheels visible in pure top-down (hidden underneath). A 2-px dark shadow strip runs along both long edges of the bus body. All 4 frames are pixel-for-pixel identical. Maximum 14 colors."

---

### H — UI Elements

**H1 — Stats HUD Frame** → save as `ui/hud-frame.png`

```
Output PNG:  360 × 128 px  (fully opaque, no transparency outside the panel)
```

> "16-bit pixel art, JRPG stats HUD panel. Output: exactly 360×128 px PNG, fully opaque. The panel spans the full 360 px width. Background fill: very dark navy #0D0D2B. Top edge: a single 2-px horizontal line in gold #DAA520 spanning the full 360 px width. Bottom edge: a 2-px line in dark brass #6B5A2A. Four brass corner ornaments at each corner: an L-shaped 8×8 px brass flourish #B8860B. Layout zones left-to-right: (1) Portrait zone — left 68 px: a 60×60 px inset box with a 2-px dark border #1A1A3E and a warm tan fill #D4A843, centered vertically in the 128 px height (top margin 34 px). Leave the tan interior blank — runtime portrait overlaid by Phaser. (2) Text label zone — center 212 px: three stacked pill-shaped label areas, each a rounded dark rectangle #1A1A3E with a 1-px golden border #DAA520, arranged vertically with 8 px gaps between them. Top pill (y=12, h=30, w=200): 'NAME' label area. Middle pill (y=50, h=30): 'CAREER' label area. Bottom pill (y=88, h=30): 'STAGE' area. Leave interiors blank — runtime text rendered by Phaser. (3) Coin zone — right 80 px: a 16×16 px gold coin icon (#FFD700 circle with black outline and a dark center dot) at top-center of this zone (y=20), below it a 64×28 px dark pill #1A1A3E for the coin number, 1-px gold border. No gradients. Strictly hard-edged pixel art. Maximum 24 colors."

**H2 — Dialogue Box** → save as `ui/dialogue-box.png`

```
Output PNG:  360 × 96 px  (transparent outside the box border)
```

> "16-bit pixel art, JRPG dialogue text box. Output: exactly 360×96 px PNG. A 4-px transparent margin on all four sides — the visible box occupies a 352×88 px rectangle centered in the 360×96 canvas. Box frame: 4-px outer border in dark warm-brown #3D1F0D. 2-px inner rule just inside the outer border in slightly lighter #6B3A2A. Interior fill (344×80 px after borders): aged cream parchment #F5EDD5 with subtle texture — horizontal scan lines every 4 px alternating 1-px lighter #FAF4E0 and 1-px darker #E8DFC0 rows against the cream base, to suggest paper grain. Do not draw any text inside the box — interior left blank for Phaser text rendering. Bottom-right corner of interior: a small solid downward-pointing triangle in dark brown #3D1F0D, 8 px wide × 6 px tall, positioned 8 px from the right interior edge and 6 px from the bottom interior edge — this is the 'more text' advance indicator. All other interior area is blank parchment. Maximum 12 colors."

**H3 — D-pad** → save as `ui/dpad.png`

```
Output PNG:  128 × 128 px  (transparent outside the cross shape)
All non-transparent pixels at alpha=128 (50% opacity) — PNG alpha channel
```

> "16-bit pixel art, translucent on-screen D-pad. Output: exactly 128×128 px PNG. Cross/plus shape centered in the canvas: each arm of the cross is 40 px wide and 44 px long, with a 40×40 px center square, forming an overall plus shape that fits within a 40+44+40=124 px span — leaving a 2 px margin on each side. All pixels of the cross shape have alpha=128 (50% transparency via PNG alpha channel). Background (outside the cross) fully transparent (alpha=0). Cross body color: dark brass #6B5A2A. Slightly lighter raised face on the flat surface of each arm: #9B8040 (a 36×40 px rectangle inset 2 px from edges on each arm). Dark shadow edge along outer perimeter of cross: #2A2010 (1-px outline). Center intersection circle: a 32×32 px dark recess circle #4A3A1A. Embossed directional arrows — solid near-black #1A1A0A triangles on each arm: up arm (pointing upward, 10×8 px triangle centered on the arm face); down arm (pointing down); left arm (pointing left); right arm (pointing right). 1-px black outline on all outer edges of the cross shape. No gradients. Maximum 8 colors (opacity via alpha, not blending)."

**H4 — A Button** → save as `ui/btn-a.png`

```
Output PNG:  64 × 64 px  (transparent outside the circle)
All non-transparent pixels at alpha=153 (60% opacity)
```

> "16-bit pixel art, translucent on-screen A action button. Output: exactly 64×64 px PNG. Circle button: 56×56 px circle centered at pixel 32,32 (4 px transparent margin all around). Alpha=153 (60%) on all non-transparent pixels. Base fill: dark red #8B0000. Raised face highlight: lighter red #CC0000 on the top-left quadrant of the circle (a roughly 26×26 px bright zone). Rim: 2-px black #000000 outline on circle perimeter. Top-left arc highlight: 2-px arc of bright #FF4444 just inside the rim on the upper-left. Label: letter 'A' in chunky 12×14 px pixel font (each stroke 2 px wide), solid white #FFFFFF, centered at 32,32. All circle pixels at alpha=153. All background pixels alpha=0. Maximum 8 colors."

**H5 — B Button** → save as `ui/btn-b.png`

```
Output PNG:  64 × 64 px  (transparent outside the circle)
All non-transparent pixels at alpha=153 (60% opacity)
```

> "16-bit pixel art, translucent on-screen B action button. Output: exactly 64×64 px PNG. Identical construction to the A button (56×56 px circle, 4 px margin, alpha=153) but with a deep navy-blue color scheme. Base fill: deep navy #000066. Raised face highlight: medium blue #0000CC on top-left quadrant. Rim: 2-px black #000000. Highlight arc: 2-px #4444FF. Label: letter 'B' in chunky 12×14 px pixel font, solid white #FFFFFF, centered. Maximum 8 colors."

**H6 — Title Screen Background** → save as `ui/title-bg.png`

```
Output PNG:  360 × 640 px  (fully opaque — no transparency)
```

> "16-bit pixel art, vertical portrait title screen, Game Boy Advance era style. Output: exactly 360×640 px PNG, fully opaque. Sky (top 256 px, y=0 to y=255): divided into 5 flat horizontal bands with hard step-change edges (strictly no smooth gradients): band 1 (y=0–55, 56 px tall) deep orange #E87722; band 2 (y=56–119, 64 px) amber #F4A23A; band 3 (y=120–175, 56 px) golden #F7C76A; band 4 (y=176–215, 40 px) pale yellow #FAE0A0; band 5 (y=216–255, 40 px) near-white horizon #FFEEC0. Skyline silhouette layer (y=200–380 approx): a dense jagged rooftop silhouette in near-black #0D0D1A — multiple rectangular chawl blocks of varying heights (12–40 px tall) packed edge to edge across the full 360 px width. On rooftops: rectangular plastic water tanks (10×8 px dark boxes), small satellite dishes (cross shapes, 6×6 px), electric poles (2-px vertical lines with 2-px horizontal wire arms curving down). In the far center distance (y=240–280, rendered in a slightly lighter dark navy #1A1A3A to indicate depth): the silhouette of the Gateway of India — a central arch 60 px wide and 40 px tall with flanking smaller towers. Foreground (y=380–640): very dark navy #0D0D2B ground plane, minimal detail — a faint vertical path/road suggestion (slightly lighter #121220) leading toward the bottom edge. Title text 'MUMBAI HERO': positioned y=285–330, centered horizontally. Letters: chunky block pixel font, each letter approximately 28 px tall and 18–22 px wide (depending on letter), 4 px gaps between letters, 2-px black #000000 outline, filled bright gold #FFD700, with a single 2-px white #FFFFFF highlight line along the top of each letter. Subtitle text 'YOUR STORY STARTS HERE': positioned y=342, centered, 8×8 px pixel font, white #FFFFFF, 1-px letter spacing. Maximum 32 colors total."

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

