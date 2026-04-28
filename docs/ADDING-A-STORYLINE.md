# Adding a New Storyline

This walkthrough adds a hypothetical 7th storyline: **The Tech Entrepreneur**.

## Steps

### 1. Add to shared types

In `shared/src/types/game-state.ts`, add to `StorylineId`:
```typescript
export type StorylineId =
  | 'bollywood' | 'playback-singer' | 'textile'
  | 'fitness' | 'food' | 'cinematographer'
  | 'tech-entrepreneur';   // ← add this
```

Also update `createInitialProgression()` to include the new key:
```typescript
storylines: {
  // ... existing ones
  'tech-entrepreneur': { ...DEFAULT_STORYLINE_PROGRESS },
},
```

### 2. Add to shared Zod schema

In `shared/src/schemas/game-state.schema.ts`, add to `StorylineIdSchema`:
```typescript
export const StorylineIdSchema = z.enum([
  'bollywood', 'playback-singer', 'textile',
  'fitness', 'food', 'cinematographer',
  'tech-entrepreneur',   // ← add this
]);
```

### 3. Define the storyline data

In `shared/src/types/storyline.ts`, add to the `STORYLINES` array:
```typescript
{
  id: 'tech-entrepreneur',
  name: 'The Tech Entrepreneur',
  elderName: 'Vikram Sir',
  elderNpcId: 'elder-tech',
  houseSceneId: 'house-tech-scene',
  stages: [
    { stage: 0, title: 'Dreamer', description: 'You have not yet begun.' },
    { stage: 1, title: 'Internship', description: 'Coding for free in Andheri.' },
    // ... define all 6 stages
  ],
},
```

### 4. Write the dialogue file

Create `client/src/data/dialogues/elder-tech.ts`:
```typescript
import type { DialogueTree } from '@mumbai-hero/shared';
export const elderTechDialogue: DialogueTree = {
  id: 'elder-tech',
  startNode: 'intro',
  nodes: [ /* ... */ ],
};
```

### 5. Register the NPC

In `client/src/data/npcs.ts`, add:
```typescript
{ id: 'elder-tech', name: 'Vikram Sir', spriteKey: 'npc-elder-tech',
  dialogueTreeId: 'elder-tech', isAmbient: false },
```

### 6. Create the house scene

Copy `client/src/scenes/world/house-bollywood-scene.ts` to `house-tech-scene.ts`.
Update the class name, key, elder NPC id/name/sprite, and dialogue import.

### 7. Register the scene in game config

In `client/src/config/game-config.ts`, import and add `HouseTechScene` to the `scene` array.

### 8. Add the door in the neighborhood

In `client/src/scenes/world/neighborhood-scene.ts` → `spawnInteractables()`, add:
```typescript
this.addInteractable(12, 15, 'house-tech-door', 'Tech House', null, {
  sceneId: 'house-tech-scene', spawnPoint: 'default',
});
```
Also add a `'from-tech'` spawn point in `getSceneConfig().spawnPoints`.

### 9. No backend changes needed

The backend already handles any valid `StorylineId`. Because the storyline list is defined in shared code and the repository pattern stores progression as a generic record, no server routes change.

The only exception is if the new storyline introduces a **new action type** (e.g., a crafting mechanic). In that case, add a new route in `server/src/routes/action.routes.ts` and a handler in `server/src/services/game-engine.service.ts`.
