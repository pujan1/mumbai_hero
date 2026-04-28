import type { DialogueTree } from '@mumbai-hero/shared';

export const elderBollywoodDialogue: DialogueTree = {
  id: 'elder-bollywood',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Ramesh Ji', text: 'Arre, come in, come in! You look like someone with fire in their eyes.' },
        { speaker: 'Ramesh Ji', text: 'I have been in this industry for forty years. I have seen stars rise from nothing.' },
        { speaker: 'Ramesh Ji', text: 'Mumbai does not care where you come from. Only where you are going.' },
        { speaker: 'Ramesh Ji', text: 'The path of a Bollywood star is not easy. But for the right person, it is the only path.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Ramesh Ji', text: 'I can guide you. Start small — handing out flyers, background work. But every legend started somewhere.' },
        { speaker: 'Ramesh Ji', text: 'Will you walk this path with me?' },
      ],
      choices: [
        { text: 'Yes, I want to become a Bollywood star!', next: 'accept' },
        { text: 'Not right now, thank you.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Ramesh Ji', text: 'Shandaar! Brilliant! You will not regret this, my friend.' },
        { speaker: 'Ramesh Ji', text: 'Come back when you are ready to begin. The city is waiting for you.' },
      ],
      onComplete: 'accept-bollywood',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Ramesh Ji', text: 'No hurry, no hurry. The door is always open.' },
        { speaker: 'Ramesh Ji', text: 'When you are ready, you know where to find me.' },
      ],
      onComplete: 'decline-bollywood',
    },
  ],
};
