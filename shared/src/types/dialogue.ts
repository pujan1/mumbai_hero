export interface DialogueLine {
  speaker: string;
  text: string;
  isPlayer?: boolean;
}

export interface DialogueChoice {
  text: string;
  reply?: DialogueLine[];
  next?: string;
  condition?: string;
  onComplete?: string;
}

export interface DialogueNode {
  id: string;
  lines: DialogueLine[];
  choices?: DialogueChoice[];
  condition?: string;
  onComplete?: string;
  next?: string;
}

export interface DialogueTree {
  id: string;
  nodes: DialogueNode[];
  startNode: string;
}
