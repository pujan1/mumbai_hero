import type { DialogueTree } from '@mumbai-hero/shared';

export const elderTextileDialogue: DialogueTree = {
  id: 'elder-textile',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Harishbhai', text: '*measures a length of fabric* One moment, one moment.' },
        { speaker: 'Harishbhai', text: 'Fashion is not about fancy clothes. It is about understanding people — what makes them feel powerful.' },
        { speaker: 'Harishbhai', text: 'I started carrying bales at Mangaldas Market at your age. Now? Bollywood celebrities call me.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Harishbhai', text: 'Do you want to learn the textile trade? Fabric, fashion, the whole business?' },
        { speaker: 'Harishbhai', text: 'It starts with honest work. But the rewards — limitless.' },
      ],
      choices: [
        { text: 'Yes, teach me the textile business!', next: 'accept' },
        { text: 'I will think about it.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Harishbhai', text: 'Good, good! First you must learn to respect the craft. Come back when you are ready to begin.' },
      ],
      onComplete: 'accept-textile',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Harishbhai', text: 'No problem. I am here. Good fabric, like good people, is always worth waiting for.' },
      ],
      onComplete: 'decline-textile',
    },
  ],
};
