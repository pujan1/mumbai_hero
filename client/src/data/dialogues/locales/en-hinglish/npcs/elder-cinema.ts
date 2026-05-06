import type { DialogueTree } from '@mumbai-hero/shared';

export const elderCinemaDialogue: DialogueTree = {
  id: 'elder-cinema',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Sunita Madam', text: '*apne vintage camera se upar dekhti hain* Tumhare chehre mein kuch hai — duniya ko alag nazar se dekhne wala.' },
        { speaker: 'Sunita Madam', text: 'Cinematography waqt ko freeze karne ki kala hai. Har frame ek decision hai. Har shadow soch ke daala jaata hai.' },
        { speaker: 'Sunita Madam', text: 'Maine Gateway pe tourists ke photos click kiye the. Aaj? Mera kaam duniya bhar ki screens pe dekha gaya hai.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Sunita Madam', text: 'Safar lamba hai — tourist photographer se Oscar winner tak. Lekin sahi insaan ke liye, har kadam mein khushi hai.' },
        { speaker: 'Sunita Madam', text: 'Kya tum light aur lens se kahaniyaan sunana seekhna chahoge?' },
      ],
      choices: [
        { text: 'Haan! Main cinematographer banna chahta/chahti hoon!', next: 'accept' },
        { text: 'Shayad kisi aur waqt.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Sunita Madam', text: 'Bahut achha. Pehle dekhna seekho — sach mein dekhna. Wapas aao jab Mumbai ko naye nazariye se dekha ho tumne.' },
      ],
      onComplete: 'accept-cinematographer',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Sunita Madam', text: 'Is sheher mein roshni har ghante badalti rehti hai. Jab tayaar ho, wapas aa jaana.' },
      ],
      onComplete: 'decline-cinematographer',
    },
  ],
};
