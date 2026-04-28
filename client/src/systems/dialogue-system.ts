import type { DialogueTree, DialogueNode } from '@mumbai-hero/shared';
import { eventBus } from '../utils/event-bus.js';
import { clientGameState } from '../state/game-state.js';

type OnCompleteCallback = (callbackId: string) => void;

let activeTree: DialogueTree | null = null;
let activeNode: DialogueNode | null = null;
let activeLine = 0;
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
  eventBus.emit('dialogue:show', node, 0);
}

export function advanceDialogue(): void {
  if (!isOpen || !activeNode || !activeTree) return;

  if (activeNode.choices && activeLine >= activeNode.lines.length - 1) {
    eventBus.emit('dialogue:choices', activeNode.choices);
    return;
  }

  if (activeLine < activeNode.lines.length - 1) {
    activeLine++;
    eventBus.emit('dialogue:show', activeNode, activeLine);
    return;
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
  if (!activeNode?.choices || !activeTree) return;
  const choice = activeNode.choices[index];
  if (!choice) return;
  if (activeNode.onComplete && onCompleteCallback) onCompleteCallback(activeNode.onComplete);
  const nextNode = activeTree.nodes.find((n) => n.id === choice.next);
  if (nextNode) {
    setNode(nextNode);
  } else {
    closeDialogue();
  }
}

function closeDialogue(): void {
  if (activeNode?.onComplete && onCompleteCallback) {
    onCompleteCallback(activeNode.onComplete);
  }
  activeTree = null;
  activeNode = null;
  isOpen = false;
  eventBus.emit('dialogue:hide');
}

function checkCondition(condition: string | undefined): boolean {
  if (!condition) return true;
  const flags = clientGameState.progression?.flags ?? {};
  return flags[condition] === true;
}

export function isDialogueOpen(): boolean {
  return isOpen;
}
