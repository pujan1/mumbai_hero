import type { DialogueTree } from '@mumbai-hero/shared';

export const elderMusicDialogue: DialogueTree = {
  id: 'elder-music',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Meena Tai', text: '*hums a soft melody* Ah, a visitor. Please, sit. The music never stops in this house.' },
        { speaker: 'Meena Tai', text: 'I have given my voice to a thousand songs. Each one a piece of my heart.' },
        { speaker: 'Meena Tai', text: 'The playback singer is the soul behind the face on screen. We are the hidden magic of Hindi cinema.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Meena Tai', text: 'I can hear something in you. A resonance. Would you like to learn this art?' },
        { speaker: 'Meena Tai', text: 'It begins with chorus work, small recordings. But the journey? Extraordinary.' },
      ],
      choices: [
        { text: 'Yes! I want to be a playback singer!', next: 'accept' },
        { text: 'Maybe another time.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Meena Tai', text: 'Wonderful! Your first step is to find where the music lives inside you.' },
        { speaker: 'Meena Tai', text: 'Come back and we will begin your training.' },
      ],
      onComplete: 'accept-playback-singer',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Meena Tai', text: 'Music waits for no one — but it always welcomes you back.' },
        { speaker: 'Meena Tai', text: 'My door is open whenever your heart is ready.' },
      ],
      onComplete: 'decline-playback-singer',
    },
  ],
};
