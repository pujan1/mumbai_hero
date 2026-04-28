import type { DialogueTree } from '@mumbai-hero/shared';

export const bedDialogue: DialogueTree = {
  id: 'kholi-bed',
  startNode: 'start',
  nodes: [
    {
      id: 'start',
      lines: [
        { speaker: '', text: 'Your worn mattress. You have slept on it every night since you were born.' },
        { speaker: '', text: 'You feel rested.' },
      ],
    },
  ],
};

export const stoveDialogue: DialogueTree = {
  id: 'kholi-stove',
  startNode: 'start',
  nodes: [
    {
      id: 'start',
      lines: [
        { speaker: '', text: 'The two-burner gas stove. A chai stain on the side that Aai never quite cleaned off.' },
        { speaker: '', text: 'The whole neighbourhood smells of onion and spices in the morning.' },
      ],
    },
  ],
};

export const mirrorDialogue: DialogueTree = {
  id: 'kholi-mirror',
  startNode: 'start',
  nodes: [
    {
      id: 'start',
      lines: [
        { speaker: '', text: 'You look at yourself in the cracked mirror.' },
        { speaker: '', text: 'You look like someone who is about to change their life.' },
      ],
    },
  ],
};

export const familyPhotoDialogue: DialogueTree = {
  id: 'kholi-photo',
  startNode: 'start',
  nodes: [
    {
      id: 'start',
      lines: [
        { speaker: '', text: 'A framed photograph. Your family, at Marine Drive, five years ago.' },
        { speaker: '', text: 'Everyone is laughing. You remember that day.' },
        { speaker: '', text: "They are counting on you. You won't let them down." },
      ],
    },
  ],
};

export const kholiDoorDialogue: DialogueTree = {
  id: 'kholi-door',
  startNode: 'start',
  nodes: [
    {
      id: 'start',
      lines: [
        { speaker: '', text: 'The neighborhood awaits. Time to explore.' },
      ],
    },
  ],
};
