# Dialogue Format

Dialogue trees are plain TypeScript objects defined in `client/src/data/dialogues/`. The schema is defined in `shared/src/types/dialogue.ts`.

The system supports back-and-forth conversation: when the player picks a choice, the chosen text is echoed back as a player line (right-aligned, distinct colour), and the choice can carry an inline `reply` from the NPC before flowing to the next node.

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
  choices?: DialogueChoice[];   // if present, player must pick one after lines exhaust
  condition?: string;           // flag key that must be true to enter this node
  onComplete?: string;          // callback id fired when this node exits
  next?: string;                // id of the next node (when no choices, or as fallback)
}
```

## DialogueLine

```typescript
interface DialogueLine {
  speaker: string;     // "" for narration, "NPC Name" for character dialogue
  text: string;
  isPlayer?: boolean;  // true → rendered right-aligned in the player palette
}
```

You don't usually set `isPlayer` by hand on authored lines — the dialogue system stamps it on the synthesized echo when the player picks a choice. Use it directly only if you want to script a line *as* the player without going through a choice menu.

## DialogueChoice

```typescript
interface DialogueChoice {
  text: string;             // shown in the choice menu AND echoed as a player line on selection
  reply?: DialogueLine[];   // optional inline NPC response — saves defining a node for short replies
  next?: string;            // id of the node to jump to after the echo + reply; omit to end the dialogue
  condition?: string;       // flag key — choice is hidden unless the flag is true
  onComplete?: string;      // callback id fired the moment this choice is selected
}
```

### How a choice resolves

1. The player picks choice *N* from the visible menu.
2. The dialogue system synthesizes a transient node containing:
   - a player line (`{ speaker: <player name>, text: choice.text, isPlayer: true }`)
   - then each line in `choice.reply`, if present
3. The player advances through those lines like any other node.
4. When they exhaust, the system jumps to `choice.next`. If `next` is omitted, the dialogue closes.

The visible menu is filtered by `choice.condition` — choices whose flags aren't set are hidden. If every choice on a node is hidden, the system falls back to `node.next` (or closes).

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

### Back-and-forth with inline replies

The `reply` field lets you write a full ping-pong exchange in a single node, no extra nodes per turn.

```typescript
const tree: DialogueTree = {
  id: 'chai-wala',
  startNode: 'greet',
  nodes: [
    {
      id: 'greet',
      lines: [
        { speaker: 'Chai Wala', text: 'Arre boss, chai chahiye?' },
      ],
      choices: [
        {
          text: 'Haan, ek cutting de do.',
          reply: [
            { speaker: 'Chai Wala', text: 'Bas do minute, garam garam aati hai.' },
          ],
          next: 'serve',
        },
        {
          text: 'Bas dekh raha hoon.',
          reply: [
            { speaker: 'Chai Wala', text: 'Theek hai, jab mann kare bolna.' },
          ],
          // no `next` → dialogue closes after the reply
        },
      ],
    },
    {
      id: 'serve',
      lines: [{ speaker: 'Chai Wala', text: 'Yeh lo. Dus rupiye.' }],
      onComplete: 'bought-chai',
    },
  ],
};
```

### Branching to dedicated nodes (longer arcs)

When a branch has its own multi-line scene, route to a node instead of using `reply`:

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
      onComplete: 'accept-bollywood',
    },
    {
      id: 'decline',
      lines: [{ speaker: 'Ramesh Ji', text: 'Come back anytime.' }],
      onComplete: 'decline-bollywood',
    },
  ],
};
```

### Conditional choices (unlockable replies)

Use `condition` on a choice to gate it behind a flag. Same field on a node still gates the whole node.

```typescript
{
  id: 'ask-about',
  lines: [{ speaker: 'Ramesh Ji', text: 'Kya jaanna chahte ho?' }],
  choices: [
    { text: 'Industry ke baare mein.', next: 'industry-talk' },
    { text: 'Festival ke baare mein.', next: 'festival-talk', condition: 'heard-about-festival' },
    { text: 'Kuch nahi, abhi.' },
  ],
}
```

### Conditional node (gated by flag)

```typescript
{
  id: 'return-visit',
  lines: [{ speaker: 'Ramesh Ji', text: 'Back so soon?' }],
  condition: 'met-elder-bollywood',
  next: 'continue',
}
```

## onComplete Callbacks

`onComplete` strings are passed to the callback registered when `startDialogue()` is called. Both `DialogueNode` and `DialogueChoice` can carry one.

- A node's `onComplete` fires when the dialogue closes while that node is active.
- A choice's `onComplete` fires the instant the choice is selected (before the echo plays).

In `BaseWorldScene`, the convention is:

- `accept-<storylineId>` → calls `acceptStoryline({ storylineId })`
- `decline-<storylineId>` → calls `declineStoryline({ storylineId })`

Any other callback id is available for custom handlers per scene.

## Authoring tips

- **Short reactions → `reply`**, longer scenes → `next` to a node. Don't define a one-line node when `reply` will do.
- **Don't author player lines manually** in `node.lines` unless you specifically want a scripted player monologue. Player echoes happen automatically through `DialogueChoice.text`.
- **Player speaker name** comes from `clientGameState.profile.displayName`, falling back to `"You"` if no profile is loaded.
- **Choices without `next`** end the conversation gracefully after the reply — useful for "nevermind" exits.
