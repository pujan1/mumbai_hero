import type { DialogueTree } from '@mumbai-hero/shared';

export const elderMusicDialogue: DialogueTree = {
  id: 'elder-music',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Meena Tai', text: '*dheere gun gun gaate hue* Aao, aao! Iss ghar mein sangeet kabhi ruka nahi.' },
        { speaker: 'Meena Tai', text: 'Maine apni awaaz hazaar gaanom ko di hai. Har gaane mein apna dil rakh diya.' },
        { speaker: 'Meena Tai', text: 'Playback singer hi toh asli jaan hoti hai parde ke peeche. Hum Hindi cinema ka chhupta hua jadoo hain.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Meena Tai', text: 'Tumhare andar kuch hai — ek alag sa resonance sunai deta hai mujhe. Seekhna chahoge yeh kala?' },
        { speaker: 'Meena Tai', text: 'Shuruat hogi chorus work se, chote recordings se. Par yeh safar? Laajawaab hai, ekdum.' },
      ],
      choices: [
        { text: 'Haan! Main playback singer banna chahta/chahti hoon!', next: 'accept' },
        { text: 'Shayad phir kabhi.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Meena Tai', text: 'Wah! Pehla kadam — apne andar ki sangeet dhundho. Woh kahin na kahin toh hai.' },
        { speaker: 'Meena Tai', text: 'Wapas aao aur hum training shuru karenge.' },
      ],
      onComplete: 'accept-playback-singer',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Meena Tai', text: 'Sangeet kisi ka intezaar nahi karta — lekin hamesha wapas bulaata hai.' },
        { speaker: 'Meena Tai', text: 'Mera darwaza khula hai jab bhi tumhara dil tayaar ho.' },
      ],
      onComplete: 'decline-playback-singer',
    },
  ],
};
