# Adding a New Scene / Neighbourhood Area

## Steps

### 1. Create the scene class

Extend `BaseWorldScene` — copy any existing house scene as a template:

```typescript
// client/src/scenes/world/my-new-scene.ts
import { BaseWorldScene } from '../base-world-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';

export class MyNewScene extends BaseWorldScene {
  constructor() { super({ key: 'my-new-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-my-new',
      tilesetKey: 'tileset-neighborhood',
      tilesetName: 'neighborhood',
      spawnPoints: {
        default: { x: 5, y: 8 },
        'from-entrance': { x: 5, y: 9 },
      },
      sceneId: 'my-new-scene',
    };
  }

  spawnNPCs(): void { /* addNPC(...) calls */ }
  spawnInteractables(): void { /* addInteractable(...) calls */ }
}
```

### 2. Register in game config

In `client/src/config/game-config.ts`:
```typescript
import { MyNewScene } from '../scenes/world/my-new-scene.js';
// Add to the scene array:
scene: [...existingScenes, MyNewScene],
```

### 3. Add a transition trigger

In whatever scene should link here (e.g., `neighborhood-scene.ts`), add an interactable:
```typescript
this.addInteractable(tileX, tileY, 'my-new-door', 'My New Place', null, {
  sceneId: 'my-new-scene',
  spawnPoint: 'default',
});
```

Add a matching return spawn point in `my-new-scene.ts` and a door interactable that leads back.

### 4. Add a Tiled map (when using real maps)

Export from Tiled as `.tmj` (JSON format). Place the file at `client/public/assets/maps/my-new-scene.tmj`.

Load it in `BootScene.preload()`:
```typescript
this.load.tilemapTiledJSON('map-my-new', 'assets/maps/my-new-scene.tmj');
```

**Tiled export settings:**
- Tile size: 100×100
- Map format: JSON (`.tmj`)
- Embed tilesets: No (reference external tileset files)
- Layer naming: use `ground`, `collision`, `objects` consistently

The `BaseWorldScene.buildPlaceholderWorld()` method will be replaced by actual Tiled map loading once the `mapKey` resolves to a loaded tilemap. Until then, the placeholder grid renders.

### 5. Update the server (only if needed)

If the new scene has unique mechanics beyond dialogue/interaction, add new action handlers. Otherwise no server changes are required — `POST /actions/enter-scene` already records scene transitions.
