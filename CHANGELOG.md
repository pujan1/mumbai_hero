# Changelog

## [1.0.1] - 2026-04-28

### Added
- `BaseOutdoorScene` — abstract base for all exterior/overworld scenes. Renders a grass + dirt-path + tree-border placeholder world (default 24×18 tiles). Subclasses override `getMapSize()` to pick a different size.
- `BaseIndoorScene` — abstract base for all interior scenes. Renders a warm wood checkerboard floor with dark walls and window hints. Enforces a tile size range of 10×10 (min) to 20×20 (max), defaulting to 12×12. Subclasses override `getIndoorSize()` per room. Camera auto-centres on the room instead of scrolling when the room fits entirely in the viewport.
- Exported constants `INDOOR_MIN_TILES`, `INDOOR_MAX_TILES`, `INDOOR_DEFAULT_TILES` from `base-indoor-scene.ts` for use by future scenes.

### Changed
- `BaseWorldScene` — `buildPlaceholderWorld()` replaced by `protected abstract buildWorld()`, delegating world construction to each scene-type base class.
- `NeighborhoodScene` — now extends `BaseOutdoorScene` instead of `BaseWorldScene`.
- `KholiInteriorScene`, `HouseBollywoodScene`, `HouseMusicScene`, `HouseTextileScene`, `HouseFitnessScene`, `HouseFoodScene`, `HouseCinemaScene` — all now extend `BaseIndoorScene` instead of `BaseWorldScene`.

---

## [1.0.0] - 2026-04-28

Initial release — full project scaffolding.

### Client
- Phaser 3 game bootstrapped with Vite, targeting a 360×640 logical resolution with pixel-art rendering.
- `BaseWorldScene` — shared abstract base for all playable scenes (player spawn, NPC/interactable registration, input, camera, dialogue routing).
- **Scenes:** `BootScene` (asset preload), `TitleScene` (character select), `HUDScene` (persistent overlay), `NeighborhoodScene` (main overworld), `KholiInteriorScene` (player's home), and six elder houses (Bollywood, Music, Textile, Fitness, Food, Cinema).
- **Entities:** `Player` (grid-based tile movement, directional sprite), `NPC` (dialogue tree holder), `Interactable` (proximity trigger with optional scene transition).
- **Systems:** `InputManager` (keyboard + on-screen D-pad), `DialogueSystem`, `InteractionSystem`, `SceneTransitionManager`, `FastTravelSystem`, `StoryProgressionManager`.
- **UI:** `DialogueBox`, `StatsHUD`, `MenuOverlay`, `OnScreenControls`.
- **Data:** Dialogue trees for all six elders and household objects; NPC and interactable registries; storyline definitions.

### Server
- Express server with player-id middleware, validation middleware, and an in-memory game-state repository.
- REST routes: `/player`, `/state`, `/action` (talk to NPC, interact with object, accept/decline storyline).
- `GameEngineService` — core game logic and event log; `StorylineService` — storyline state management.

### Shared
- `@mumbai-hero/shared` package with Zod schemas and TypeScript types for API contracts, game state, dialogue, NPCs, and storylines.

### Tooling & Docs
- Monorepo with `package.json` workspaces; ESLint + Prettier config; `tsconfig.base.json` extended by client, server, and shared.
- Docs: `ARCHITECTURE.md`, `BACKEND.md`, `DIALOGUE-FORMAT.md`, `ADDING-A-SCENE.md`, `ADDING-A-STORYLINE.md`, `ASSET-PIPELINE.md`.
