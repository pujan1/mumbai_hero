# Changelog

## [1.0.4]

### Added

- **Inventory, backpack, and trading loop** (`client/src/data/items.ts`, `client/src/systems/inventory-system.ts`, `client/src/ui/backpack-overlay.ts`, `client/src/ui/shop-overlay.ts`, `client/src/systems/ui-state.ts`): Added a static item registry, generic inventory helpers, player money/capacity management, a 25-slot backpack with upgrade support, and buy/sell overlays for merchant NPCs.
- **Merchant NPC support** (`client/src/entities/npc.ts`, `client/src/scenes/world/neighborhood-scene.ts`): NPCs can now carry inventories and expose shop configs. Chai Wallah sells chai, the vegetable vendor trades produce, and a new Kirana Bhai merchant sells staples plus backpack upgrades.
- **Speech-bubble dialogue presentation** (`client/src/ui/speech-bubble.ts`, `client/src/scenes/base-world-scene.ts`): Added speaker-anchored world-space speech bubbles with tap-to-advance, while narration and off-scene speakers still fall back to the HUD dialogue panel.
- **Locale-based dialogue structure** (`client/src/data/dialogues/config.ts`, `client/src/data/dialogues/index.ts`, `client/src/data/dialogues/locales/`): Dialogue data is now organized by locale. Added an `en-hinglish` pack, a Hindi locale stub, and centralized exports for elder, ambient, household, and fast-travel dialogue.
- **Authored Kholi tilemap assets** (`client/public/assets/maps/kholi-interior.tmj`, `client/public/assets/tilesets/tileset-kholi-a.png`, `client/public/assets/tilesets/tileset-kholi-b.png`): Added the first Tiled-authored interior map plus split Kholi tileset sheets for multi-tileset rendering.
- **Image resize helper** (`utils/resize-image.mjs`): Added a `sharp`-based utility for resizing generated art into the tilemap pipeline.

### Changed

- **Dialogue flow and schema** (`client/src/systems/dialogue-system.ts`, `shared/src/types/dialogue.ts`, `docs/DIALOGUE-FORMAT.md`): Choices can now be conditionally hidden, fire their own callbacks, include inline NPC replies, and echo the player's selected line before continuing or closing.
- **World interaction model** (`client/src/scenes/base-world-scene.ts`, `client/src/systems/input-manager.ts`): The action button now context-switches between talking, shopping, and object interaction; modal overlays block world input; `Shift` also confirms, while `Enter` doubles as cancel/close for overlays.
- **HUD and dialogue UI behavior** (`client/src/ui/dialogue-box.ts`, `client/src/scenes/hud-scene.ts`, `client/src/ui/on-screen-controls.ts`, `client/src/ui/stats-hud.ts`, `client/src/config/constants.ts`): Dialogue became a slide-up bottom overlay with a close button, the A button label now reflects nearby context (`TALK`, `SHOP`, `OPEN`), and both controls/HUD now wake and fade based on recent interaction.
- **Indoor scene rendering pipeline** (`client/src/scenes/base-indoor-scene.ts`, `client/src/scenes/world/kholi-interior-scene.ts`, `client/src/scenes/world/house-*.ts`, `client/src/scenes/boot-scene.ts`): Indoor scenes now accept multiple tilesets by name/key, prefer authored TMJ maps when present, and fall back to procedural rendering otherwise. House scenes were rewired to split architecture/shared/theme-specific tilesets.
- **Neighborhood presentation and data wiring** (`client/src/scenes/world/neighborhood-scene.ts`, `client/src/systems/fast-travel-system.ts`): Ambient and stub dialogue now come from locale packs, placeholder labels identify buildings in the 3×3 grid, and fast-travel stub text is centralized with the rest of the dialogue content.
- **Shared progression defaults** (`shared/src/types/game-state.ts`, `shared/src/schemas/game-state.schema.ts`): Progression state now tracks `backpackCapacity`, starts players with ₹100, and defaults backpack capacity to 25 slots.
- **Tileset documentation pipeline** (`docs/assets/04-tilesets.md`): Reworked the asset spec around split 500×500 sheets, per-sheet frame maps, scene-to-tileset mapping, and Tiled `firstgid` notes.

### Fixed

- **Choice dead-ends and boilerplate nodes** (`client/src/systems/dialogue-system.ts`): Dialogue can now end cleanly after a choice reply without forcing a dummy follow-up node.
- **Dialogue dismissal UX** (`client/src/ui/dialogue-box.ts`): Players can now force-close dialogue from the HUD panel instead of being locked into advancing line by line.
- **Input leakage while overlays are open** (`client/src/scenes/base-world-scene.ts`, `client/src/scenes/hud-scene.ts`): Backpack/shop menus now properly capture input so movement and world interactions do not continue underneath.

---

## [1.0.3]

### Added

- **3×3 neighborhood grid** (`neighborhood-scene.ts`): Completely reworked from a single-road layout to a proper 3×3 block grid with two horizontal roads (H1: rows 5–6, H2: rows 11–12) and two vertical roads (V1: cols 7–8, V2: cols 15–16). Nine distinct building blocks (Train Station, Bollywood+Music, Textile+Fitness, Kholi/Chawl, Park, Food+Cinema, Market, Office, Residential) with correct door positions aligned to road edges.
- **Building collision** (`base-world-scene.ts`): `solidTiles` set populated per-scene by `addBuildingCollision()` in `neighborhood-scene.ts`. All building footprints are solid; door tiles are excluded so the player can walk through them to trigger transitions.
- **NPC collision** (`base-world-scene.ts`): `isColliding()` now blocks the tile occupied by any NPC, preventing the player from walking through characters.
- **Auto-dialogue** (`base-world-scene.ts`): Player automatically starts dialogue when standing adjacent and facing an NPC — no button press needed. `lastAutoNpcId` prevents re-triggering until the player looks away and back. `wasInDialogue` clears the lock when a dialogue session ends.
- **Bollywood Elder sprite wired** (`boot-scene.ts`): `npc-elder-bollywood.png` (400×100 px, 4 frames) loaded as a real spritesheet; idle animations registered for all four directions; placeholder texture removed.
- **NPC idle animation auto-play** (`entities/npc.ts`): NPCs automatically play their `<spriteKey>-idle-down` animation on spawn if it is registered.
- **Asset docs split** (`docs/assets/`): All image-generation prompts extracted from `mumbai-hero-prompt.md` into six focused files:
  - `01-characters.md` — Player Boy, Player Girl
  - `02-elder-npcs.md` — 6 Elder NPCs
  - `03-ambient-npcs.md` — Chai Wallah, Cricket Kid, Laundry Aunty, Vendor, Dog
  - `04-tilesets.md` — Kholi, Neighborhood, Train Station, House Interior tilesets
  - `05-vehicles.md` — Mumbai Local Train, BEST Bus
  - `06-ui.md` — HUD frame, Dialogue box, D-pad, Buttons A/B, Title screen
- **Asset docs README** (`docs/assets/README.md`): Standards quick reference — tile constants, visual-style boilerplate, sprite-sheet grid conventions, tileset standard, wiring checklist.

### Changed

- **On-screen controls scaled up** (`ui/on-screen-controls.ts`): D-pad arm size 130 px, center-to-center gap 155 px, action button radius 74 px, font 58 px. Directional arrow labels added to D-pad arms. Layout adjusted so controls occupy bottom-left and bottom-right quadrants.
- **Dialogue box text scaled up** (`ui/dialogue-box.ts`): Speaker text 38 px, body text 32 px, choice text 32 px at 42 px row spacing. Continue-indicator triangle enlarged to 36×24 px. Choice prefix changed to `▶`.
- **Stats HUD text scaled up** (`ui/stats-hud.ts`): Name 42 px, storyline 30 px, money 42 px, offline banner 28 px.
- **Fast-travel node positions** (`systems/fast-travel-system.ts`): Train station moved to Road H1 (tileX=3, tileY=6); bus stop moved to Road H1 (tileX=13, tileY=6).
- **Neighborhood default spawn** (`neighborhood-scene.ts`): Changed from `(3, 8)` (inside a solid building) to `(3, 11)` (Road H2, outside the Kholi door).
- **`mumbai-hero-prompt.md` trimmed**: Asset generation section (previously ~800 lines) replaced with a two-paragraph visual-modes summary and a link table pointing to `docs/assets/`.

### Fixed

- Player could walk through all buildings in the neighborhood (no collision).
- Player could walk through NPCs.
- On-screen controls and HUD text were unreadably small at the ~0.33 display scale factor of the 1200×2600 logical canvas.
- Bollywood Elder NPC displayed only as a placeholder rectangle; now shows the real sprite.

---

## [1.0.2] - 2026-04-28

### Fixed
- **Exit / interaction bug:** `facingTileOffsetX/Y` was reset to `0,0` every frame when no movement key was held. Standing still then pressing action looked for an interactable at the player's own tile instead of the one they were facing — making every door non-functional. Offset is now derived from `this.facing` and persists when idle.
- **World boundary:** `isColliding` only blocked movement at negative coordinates. Players could walk out of the map on the positive side. Now checks against `physics.world.bounds` in all directions.
- **Camera centering for small rooms:** `stopFollow()` was called inside `buildWorld()`, which runs before `startFollow()` in `create()`, so it had no effect. Moved to a `create()` override in `BaseIndoorScene` so it runs after the camera is set up.

### Added
- `RoomLayout` and `RoomSection` types exported from `base-indoor-scene.ts` — define a room as one or more rectangular sections, enabling L-shaped and other irregular floor plans.
- Varied house layouts: Bollywood (L-shape: main hall + study wing), Music (tall narrow rectangle), Textile (L-shape: main room + back workshop), Fitness (wide open rectangle), Food (L-shape: dining room + side kitchen), Cinema (wider rectangle). Kholi stays 12×12.

### Changed
- `BaseIndoorScene.getIndoorSize()` replaced by `getRoomLayout()` — returns a `RoomLayout` describing all room sections. `buildWorld()` renders each section independently, so two sections that share an edge produce a seamless join.

---

## [1.0.1] - 2026-04-28

### Added
- `BaseOutdoorScene` — abstract base for all exterior/overworld scenes. Renders a grass + dirt-path + tree-border placeholder world (default 24×18 tiles). Subclasses override `getMapSize()` to pick a different size.
- `BaseIndoorScene` — abstract base for all interior scenes. Renders a warm wood checkerboard floor with dark walls and window hints. Enforces a tile size range of 10×10 (min) to 20×20 (max), defaulting to 12×12. Subclasses override `getRoomLayout()` per room. Camera auto-centres on the room instead of scrolling when the room fits entirely in the viewport.
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
