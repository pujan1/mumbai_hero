export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface DialogueChoice {
  text: string;
  next: string;
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
