import type { DialogueTree } from '@mumbai-hero/shared';

export const bedDialogue: DialogueTree = {
  id: 'kholi-bed',
  startNode: 'start',
  nodes: [
    {
      id: 'start',
      lines: [
        { speaker: '', text: 'Tumhara ghasaa hua gadda. Apni poori zindagi iss par so ke uthe ho.' },
        { speaker: '', text: 'Neend thodi achhi aayi.' },
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
        { speaker: '', text: 'Do-burner ka gas stove. Ek taraf chai ka daag — jo Aai ne kabhi theek se saaf nahi kiya.' },
        { speaker: '', text: 'Subah subah poore mohalle mein pyaz aur masalon ki khushbu failt hai.' },
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
        { speaker: '', text: 'Tum toote hue aayne mein apne aap ko dekhte ho.' },
        { speaker: '', text: 'Aaj... aaj kuch badalne wala hai, shayad.' },
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
        { speaker: '', text: 'Ek framed tasveer. Tumhara parivaar, Marine Drive pe, paanch saal pehle.' },
        { speaker: '', text: 'Sab hans rahe hain. Woh din yaad hai tumhe abhi bhi.' },
        { speaker: '', text: 'Woh tumpe bharosa karte hain. Unka sapna tumhara sapna bhi hai.' },
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
        { speaker: '', text: 'Mohalla bahar khada hai intezaar mein. Waqt aa gaya bahar nikalte ka.' },
      ],
    },
  ],
};
