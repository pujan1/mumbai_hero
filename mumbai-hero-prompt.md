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

Use these prompts with an image generation model (Midjourney, DALL-E, Stable Diffusion, etc.) to produce the final art. Each prompt is **self-contained** — the style descriptor is already embedded. Copy the prompt verbatim.

### View-type visual language (reference before generating tilesets)

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

