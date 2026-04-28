# Architecture

## Overview

Mumbai Hero is a TypeScript monorepo with three packages:

```
┌─────────────────────────────────────────────────────────┐
│                    shared/                              │
│  Types (GameState, Storyline, Dialogue, NPC, API DTOs)  │
│  Zod schemas (validate on both client & server)         │
└────────────────┬─────────────────────┬──────────────────┘
                 │                     │
    ┌────────────▼─────────┐  ┌────────▼──────────────────┐
    │      client/         │  │        server/            │
    │  Phaser 3 game       │  │  Express REST API         │
    │  Vite + TypeScript   │  │  Node.js + TypeScript     │
    └──────────────────────┘  └───────────────────────────┘
```

## Client Architecture

### Scene Graph

```
Game
 ├── boot-scene        (preload assets, hydrate state from server)
 ├── title-scene       (character select, calls POST /players)
 ├── hud-scene         (always-on overlay: stats, dialogue, controls)
 └── world scenes (one active at a time, launched below HUD)
      ├── kholi-interior-scene
      ├── neighborhood-scene
      ├── house-bollywood-scene
      ├── house-music-scene
      ├── house-textile-scene
      ├── house-fitness-scene
      ├── house-food-scene
      └── house-cinema-scene
```

**HUD as overlay scene**: `hud-scene` is launched with `scene.launch()` so it runs in parallel with the active world scene. It sits above world scenes in the display list and is never stopped during scene transitions — only the world scene swaps. This means the stats bar, dialogue box, and on-screen controls persist without re-creating them.

### Data Flow

```
Player presses A near NPC
        │
        ▼
InputManager.justPressed('action')  ← single truth for keyboard + touch
        │
        ▼
BaseWorldScene.update()
  → finds NPC in InteractionSystem
  → calls StateSync.talkToNpc({ npcId })   ← POST /actions/talk-to-npc
  → starts DialogueSystem with dialogue tree
        │
        ▼
Server validates action, applies rules, returns { state, events }
        │
        ▼
StateSync.applyUpdate()
  → overwrites clientGameState.progression
  → writes to localStorage (offline cache)
  → emits eventBus 'state:updated'
        │
        ▼
HUDScene listens → StatsHUD.refresh()
```

### Event Bus

A minimal pub/sub (`src/utils/event-bus.ts`) decouples systems:

| Event | Emitter | Listener |
|-------|---------|----------|
| `state:updated` | StateSync | HUDScene, StoryProgressionManager |
| `dialogue:show` | DialogueSystem | HUDScene/DialogueBox |
| `dialogue:choices` | DialogueSystem | HUDScene/DialogueBox |
| `dialogue:hide` | DialogueSystem | HUDScene/DialogueBox |
| `hud:refresh` | StoryProgressionManager | HUDScene |

## Server Architecture

### Action-Based API

The server owns all authoritative game state. The client describes **what was attempted**; the server decides **what happened**.

```
Client                          Server
  │                               │
  │  POST /actions/talk-to-npc    │
  │  { npcId: "elder-bollywood" } │
  │ ──────────────────────────── ▶│
  │                               │ validate (Zod)
  │                               │ load progression
  │                               │ apply rules
  │                               │ append events
  │                               │ save progression
  │  { state, events }            │
  │ ◀─────────────────────────────│
  │                               │
  │  mirror state locally         │
```

### Repository Pattern

All data access goes through `GameStateRepository` interface. MVP ships `InMemoryGameStateRepository` with JSON file persistence. Future implementations slot in without touching route handlers.

```typescript
interface GameStateRepository {
  createPlayer(profile, initialState): Promise<void>
  getProfile(playerId): Promise<PlayerProfile | null>
  getProgression(playerId): Promise<ProgressionState | null>
  saveProgression(playerId, state): Promise<void>
  appendEvents(playerId, events): Promise<void>
  getRecentEvents(playerId, limit): Promise<GameEvent[]>
}
```

### State Tiers

1. **PlayerProfile** — identity, rarely changes (UUID, name, character choice)
2. **ProgressionState** — the save file (scene, money, flags, storyline stages)
3. **EventLog** — append-only audit trail (analytics, debugging)

## Offline Mode

1. On boot, client tries `GET /state` with stored `X-Player-Id`
2. On failure, reads `localStorage` cache
3. Runs in read-only mode, shows "Reconnecting…" banner
4. Actions are no-ops while offline (stubbed in StateSync)
