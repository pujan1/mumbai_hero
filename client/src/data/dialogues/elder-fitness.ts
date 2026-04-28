import type { DialogueTree } from '@mumbai-hero/shared';

export const elderFitnessDialogue: DialogueTree = {
  id: 'elder-fitness',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Bala Bhai', text: '*flexes and laughs* Aye! You look like you need some guidance, not just muscles!' },
        { speaker: 'Bala Bhai', text: 'I cleaned gyms for two years before I touched a barbell. That is how you learn respect for the craft.' },
        { speaker: 'Bala Bhai', text: 'Today? I train film stars, business people, anyone who is serious. And I own four gyms.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Bala Bhai', text: 'Fitness is not just bodies — it is discipline, business, mindset. You want to learn all of it?' },
      ],
      choices: [
        { text: 'Yes! I want to build a fitness empire!', next: 'accept' },
        { text: 'Maybe not for me right now.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Bala Bhai', text: 'Atta boy/girl! We start from the bottom and we climb. Come back ready to work hard!' },
      ],
      onComplete: 'accept-fitness',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Bala Bhai', text: 'No pressure! The weights will still be here. Come back when you are ready.' },
      ],
      onComplete: 'decline-fitness',
    },
  ],
};
