import type { DialogueTree } from '@mumbai-hero/shared';

export const elderFoodDialogue: DialogueTree = {
  id: 'elder-food',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Uday Kaka', text: '*offers a plate* Eat first, talk later! That is my rule.' },
        { speaker: 'Uday Kaka', text: 'Food is love. Food is culture. Food is business. All three in one.' },
        { speaker: 'Uday Kaka', text: 'I started with a vada pav stall near the station. Twenty rupees profit some days. Now I supply three restaurants.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Uday Kaka', text: 'Mumbai runs on street food. But the real vision is to take that heart and make it global.' },
        { speaker: 'Uday Kaka', text: 'Will you walk the food path with this old man?' },
      ],
      choices: [
        { text: 'Yes! I want to build a food empire!', next: 'accept' },
        { text: 'Not yet, Kaka.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Uday Kaka', text: 'Wonderful! First lesson: taste everything. Know your product. Come back soon, beta!' },
      ],
      onComplete: 'accept-food',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Uday Kaka', text: 'No worries! Come back anytime. I will have chai ready.' },
      ],
      onComplete: 'decline-food',
    },
  ],
};
