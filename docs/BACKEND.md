# Backend Reference

## Framework Choice

**Express** — chosen for ecosystem maturity and broad team familiarity. Hono is a valid future swap if edge/serverless deployment is needed.

## API Endpoints

All endpoints are prefixed at the server root (e.g., `http://localhost:3001`).

### Health

```
GET /health
Response: { status: "ok" }
```

### Players

```
POST /players
Body:    { characterChoice: "boy" | "girl", displayName?: string }
Headers: (none required)
Response 201: {
  playerId: string,
  profile: PlayerProfile,
  state: ProgressionState,
  events: []
}
```

```
GET /players/:id
Headers: X-Player-Id: <uuid>
Response 200: { profile: PlayerProfile }
Response 404: { error: "Player not found" }
```

### State

```
GET /state
Headers: X-Player-Id: <uuid>
Response 200: {
  profile: PlayerProfile,
  progression: ProgressionState,
  recentEvents: GameEvent[]   // last 50
}
Response 401: { error: "Missing X-Player-Id header" }
Response 404: { error: "Player not found" }
```

### Actions

All action endpoints:
- **Require** `X-Player-Id` header
- **Accept** JSON body (validated with Zod)
- **Return** `{ state: ProgressionState, events: GameEvent[] }`

```
POST /actions/talk-to-npc
Body: { npcId: string }
Events emitted: [ { type: "npc-talked", payload: { npcId } } ]

POST /actions/accept-storyline
Body: { storylineId: string }
Events emitted: [ { type: "storyline-stage-advanced", payload: { storylineId, from: 0, to: 1 } } ]
Note: no-op if storyline already started (stage > 0)

POST /actions/decline-storyline
Body: { storylineId: string }
Events emitted: [ { type: "storyline-declined", payload: { storylineId } } ]

POST /actions/interact-with-object
Body: { objectId: string }
Events emitted: [ { type: "object-interacted", payload: { objectId } } ]

POST /actions/enter-scene
Body: { sceneId: string, spawnPoint?: string }
Events emitted: [ { type: "scene-entered", payload: { sceneId, from: string } } ]

POST /actions/update-settings
Body: { settings: { audioVolume?: number, controlScheme?: "default" } }
Events emitted: [ { type: "settings-updated", payload: { settings } } ]
```

## Repository Pattern & Migration Path

### Current: InMemoryGameStateRepository

Stores all data in a `Map<playerId, PlayerRecord>`. Debounced JSON save to `server/data/db.json` every 5 seconds and on SIGINT/SIGTERM.

### Migrating to SQLite (Drizzle or Prisma)

1. Create `server/src/repositories/sqlite-game-state.repository.ts`
2. Implement all methods of `GameStateRepository` interface
3. Change one line in `server/src/main.ts`:
   ```typescript
   // Before:
   const repo = new InMemoryGameStateRepository(config.dbPath, config.saveIntervalMs);
   // After:
   const repo = new SqliteGameStateRepository(config.dbPath);
   ```
4. No changes to routes or services.

### Migrating to Postgres + Auth

1. Write `PostgresGameStateRepository`
2. Replace anonymous `X-Player-Id` middleware with a JWT/session middleware
3. Update `createRouter()` to inject the new auth middleware
4. Still zero changes to route handlers or game engine

## State Tiers Explained

### Tier 1: PlayerProfile

Immutable identity. Written once on `POST /players`, updated only for `lastPlayedAt`.

```typescript
{
  playerId: string          // UUID, primary key
  displayName: string|null  // optional display name
  characterChoice: "boy"|"girl"
  createdAt: ISO string
  lastPlayedAt: ISO string
  saveVersion: number       // increment on breaking schema changes
}
```

### Tier 2: ProgressionState

The save file. Rewritten after every action.

```typescript
{
  currentScene: string
  spawnPoint: string
  money: number
  energy: number            // 0-100, stamina placeholder
  inventory: { itemId, quantity }[]
  flags: Record<string, boolean>   // "met-elder-bollywood": true, etc.
  storylines: Record<StorylineId, { stage: number, startedAt: string|null }>
  settings: { audioVolume: number, controlScheme: "default" }
}
```

### Tier 3: EventLog

Append-only audit trail. Never mutated, only appended.

```typescript
{
  id: UUID
  type: string             // "npc-talked", "storyline-stage-advanced", etc.
  payload: object          // action-specific data
  timestamp: ISO string
}
```

Even if nothing reads events in MVP, they are the foundation of analytics, replay debugging, and undo systems.
