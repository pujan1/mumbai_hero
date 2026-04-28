# Dialogue Format

Dialogue trees are plain TypeScript objects defined in `client/src/data/dialogues/`. The schema is defined in `shared/src/types/dialogue.ts`.

## DialogueTree

```typescript
interface DialogueTree {
  id: string;          // unique identifier, matches the file's export
  startNode: string;   // id of the first DialogueNode to display
  nodes: DialogueNode[];
}
```

## DialogueNode

```typescript
interface DialogueNode {
  id: string;
  lines: DialogueLine[];        // one or more lines of text
  choices?: DialogueChoice[];   // if present, player must pick one
  condition?: string;           // flag key that must be true to enter this node
  onComplete?: string;          // callback id fired when this node exits
  next?: string;                // id of the next node (if no choices)
}
```

## DialogueLine

```typescript
interface DialogueLine {
  speaker: string;   // "" for narration, "NPC Name" for character dialogue
  text: string;
}
```

## DialogueChoice

```typescript
interface DialogueChoice {
  text: string;   // choice label shown to player
  next: string;   // id of the node to jump to on selection
}
```

## Examples

### Linear dialogue (no choices)

```typescript
const tree: DialogueTree = {
  id: 'kholi-bed',
  startNode: 'start',
  nodes: [
    {
      id: 'start',
      lines: [
        { speaker: '', text: 'Your worn mattress.' },
        { speaker: '', text: 'You feel rested.' },
      ],
      // no `next` → dialogue closes after last line
    },
  ],
};
```

### Branching dialogue (with choices)

```typescript
const tree: DialogueTree = {
  id: 'elder-bollywood',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [{ speaker: 'Ramesh Ji', text: 'Will you walk this path with me?' }],
      choices: [
        { text: 'Yes!', next: 'accept' },
        { text: 'No.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [{ speaker: 'Ramesh Ji', text: 'Shandaar!' }],
      onComplete: 'accept-bollywood',   // triggers acceptStoryline action
    },
    {
      id: 'decline',
      lines: [{ speaker: 'Ramesh Ji', text: 'Come back anytime.' }],
      onComplete: 'decline-bollywood',
    },
  ],
};
```

### Conditional branch

```typescript
{
  id: 'return-visit',
  lines: [{ speaker: 'Ramesh Ji', text: 'Back so soon?' }],
  condition: 'met-elder-bollywood',  // only shown if this flag is true in GameState
  next: 'continue',
}
```

## onComplete Callbacks

The `onComplete` string is passed to the callback registered when `startDialogue()` is called. In `BaseWorldScene`, the convention is:

- `accept-<storylineId>` → calls `acceptStoryline({ storylineId })`
- `decline-<storylineId>` → calls `declineStoryline({ storylineId })`

Any other callback id is available for custom handlers per scene.
