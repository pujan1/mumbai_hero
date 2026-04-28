import type { DialogueTree } from '@mumbai-hero/shared';

export const elderCinemaDialogue: DialogueTree = {
  id: 'elder-cinema',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Sunita Madam', text: '*looks up from her vintage camera* You have the look of someone who sees the world differently.' },
        { speaker: 'Sunita Madam', text: 'Cinematography is the art of freezing time. Every frame is a decision. Every shadow, deliberate.' },
        { speaker: 'Sunita Madam', text: 'I started taking photos of tourists at the Gateway. Now my work has been on screens around the world.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Sunita Madam', text: 'The journey is long — from tourist photographer to Oscar winner. But for the right person, every step is a joy.' },
        { speaker: 'Sunita Madam', text: 'Do you want to learn to tell stories through light and lens?' },
      ],
      choices: [
        { text: 'Yes! I want to be a cinematographer!', next: 'accept' },
        { text: 'Perhaps another time.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Sunita Madam', text: 'Excellent. First, learn to observe. Really observe. Come back when you have seen Mumbai through new eyes.' },
      ],
      onComplete: 'accept-cinematographer',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Sunita Madam', text: 'The light changes every hour in this city. Come back when you are ready.' },
      ],
      onComplete: 'decline-cinematographer',
    },
  ],
};
