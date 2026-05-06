import type { DialogueTree, DialogueNode, DialogueChoice } from '@mumbai-hero/shared';
import { eventBus } from '../utils/event-bus.js';
import { clientGameState } from '../state/game-state.js';

type OnCompleteCallback = (callbackId: string) => void;

let activeTree: DialogueTree | null = null;
let activeNode: DialogueNode | null = null;
let activeLine = 0;
let visibleChoices: DialogueChoice[] | null = null;
let isOpen = false;
let onCompleteCallback: OnCompleteCallback | null = null;

export function startDialogue(tree: DialogueTree, onComplete?: OnCompleteCallback): void {
  activeTree = tree;
  activeLine = 0;
  isOpen = true;
  onCompleteCallback = onComplete ?? null;
  const startNode = tree.nodes.find((n) => n.id === tree.startNode);
  if (!startNode) return;
  setNode(startNode);
}

function setNode(node: DialogueNode): void {
  activeNode = node;
  activeLine = 0;
  visibleChoices = null;
  eventBus.emit('dialogue:show', node, 0);
}

export function advanceDialogue(): void {
  if (!isOpen || !activeNode || !activeTree) return;

  if (activeLine < activeNode.lines.length - 1) {
    activeLine++;
    eventBus.emit('dialogue:show', activeNode, activeLine);
    return;
  }

  if (activeNode.choices) {
    const filtered = activeNode.choices.filter((c) => checkCondition(c.condition));
    if (filtered.length > 0) {
      visibleChoices = filtered;
      eventBus.emit('dialogue:choices', filtered);
      return;
    }
  }

  if (activeNode.next) {
    const nextNode = activeTree.nodes.find((n) => n.id === activeNode!.next);
    if (nextNode && checkCondition(nextNode.condition)) {
      setNode(nextNode);
      return;
    }
  }

  closeDialogue();
}

export function selectChoice(index: number): void {
  if (!visibleChoices || !activeNode || !activeTree) return;
  const choice = visibleChoices[index];
  if (!choice) return;

  // Per-choice onComplete fires immediately on selection.
  if (choice.onComplete && onCompleteCallback) onCompleteCallback(choice.onComplete);

  // Synthesize a transient node: echo the player's chosen line, then any
  // inline NPC reply, then route to choice.next (or close on exhaustion).
  const transitionNode: DialogueNode = {
    id: `__choice_${activeNode.id}_${index}`,
    lines: [
      { speaker: playerSpeaker(), text: choice.text, isPlayer: true },
      ...(choice.reply ?? []),
    ],
    ...(choice.next ? { next: choice.next } : {}),
  };
  setNode(transitionNode);
}

export function forceCloseDialogue(): void {
  closeDialogue();
}

function closeDialogue(): void {
  if (activeNode?.onComplete && onCompleteCallback) {
    onCompleteCallback(activeNode.onComplete);
  }
  activeTree = null;
  activeNode = null;
  visibleChoices = null;
  isOpen = false;
  eventBus.emit('dialogue:hide');
}

function checkCondition(condition: string | undefined): boolean {
  if (!condition) return true;
  const flags = clientGameState.progression?.flags ?? {};
  return flags[condition] === true;
}

function playerSpeaker(): string {
  return clientGameState.profile?.displayName ?? 'You';
}

export function isDialogueOpen(): boolean {
  return isOpen;
}
