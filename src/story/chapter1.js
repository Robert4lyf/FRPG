// Prologue — Le dernier soir, and Chapitre 1 — Trop tard
//
// Julien Morel, an inspector in Lyon, comes home to Belleville after fifteen years because
// his childhood friend Hélène wrote that she was scared. He sees her alive for a moment on the
// evening of 30 October. That night she dies in the fountain; he hears the scream and thinks
// he is dreaming.
//
// Line format: { s: speaker, fr, en, record?, set? }
//   s: a CAST id, 'you' (Julien), or 'narr' (his inner voice)
//   fr: French with [[word|gloss]] marking key vocabulary (tappable, collected in the Carnet)
//   en: English translation (shown only when the player taps EN)
//   record: statement id added to the case notebook; set: flag set when the line is shown
// Grammar: present tense and passé composé, with a little imparfait.
// tu / vous matters: old friends say "tu"; people who resent Julien insist on "vous".
// Positions are street tile coordinates (see world/town.js).

export const PLAYER_NAME = 'Julien';

export const CHAPTER = {
  id: 'ch1',
  title: 'Chapitre 1 — Trop tard',
  titleEn: 'Chapter 1 — Too Late',
  playerStart: { x: 16, y: 9 }, // outside the café, where Julien slept
};

export const PROLOGUE = {
  title: 'Prologue — Le dernier soir',
  titleEn: 'Prologue — The Last Evening',
  playerStart: { x: 23, y: 24 }, // stepping off the bus
};

// phases: where each person appears. Positions can differ per phase.
export const CAST = {
  helene: { name: 'Hélène Marchand', role: 'la pharmacienne', x: 25, y: 24, phases: ['prologue'] },
  dubois: { name: 'Brigadier Dubois', role: 'le gendarme', x: 24, y: 16, phases: ['ch1'] },
  lebrun: { name: 'Lebrun', role: 'le jardinier', x: 30, y: 12, phases: ['ch1'] },
  theo: { name: 'Théo', role: 'le serveur', x: 15, y: 7, phases: ['prologue', 'ch1'] },
  garnier: { name: 'Garnier', role: 'le chauffeur', x: 22, y: 26, phases: ['prologue', 'ch1'] },
  delacroix: { name: 'M. Delacroix', role: 'le maire', x: 24, y: 7, phases: ['ch1'] },
  claire: { name: 'Claire Marchand', role: 'la sœur', x: 35, y: 7, phases: ['ch1'] },
  roux: { name: 'Mme Roux', role: 'la boulangère', x: 6, y: 7, phases: ['ch1'] },
};

export const CLUES = {
  montre: {
    name: 'La montre cassée', en: 'The broken watch', x: 25, y: 14,
    note: { fr: 'La montre de la victime. Arrêtée à 23 h 40.', en: "The victim's watch. Stopped at 23:40." },
    lines: [
      { s: 'narr', fr: 'Une [[montre|watch]] de femme, au [[bord|edge]] de la fontaine. Le [[verre|glass]] est cassé.', en: "A woman's watch, at the edge of the fountain. The glass is broken." },
      { s: 'narr', fr: 'Elle s\'est [[arrêtée|stopped]] à vingt-trois heures quarante.', en: 'It stopped at twenty to midnight.' },
    ],
  },
  sac: {
    name: 'Le sac', en: 'The handbag', x: 21, y: 15,
    note: { fr: 'Le sac de la victime. L\'argent est encore là.', en: "The victim's bag. The money is still there." },
    lines: [
      { s: 'narr', fr: 'Le [[sac|bag]] d\'Hélène. Dedans, un [[portefeuille|wallet]] avec cent euros.', en: "Hélène's bag. Inside, a wallet with a hundred euros." },
      { s: 'narr', fr: 'Ce n\'est pas un [[vol|theft]]. Alors, pourquoi ?', en: "It isn't a robbery. So why?" },
    ],
  },
  echarpe: {
    name: 'L\'écharpe rouge', en: 'The red scarf', x: 26, y: 16,
    note: { fr: 'Une écharpe rouge, mouillée. Un parfum de femme.', en: "A red scarf, wet. A woman's perfume." },
    lines: [
      { s: 'narr', fr: 'Une [[écharpe|scarf]] rouge, en [[laine|wool]]. Elle est [[mouillée|wet]].', en: "A red wool scarf. It's wet." },
      { s: 'narr', fr: 'Elle sent le [[parfum|perfume]]. Un parfum de femme. Pas celui d\'Hélène.', en: "It smells of perfume. A woman's perfume. Not Hélène's." },
    ],
  },
  boue: {
    name: 'Les traces de boue', en: 'The muddy footprints', x: 29, y: 13,
    note: { fr: 'Des traces de chaussures d\'homme. Du parc à la fontaine.', en: "Men's shoe prints. From the park to the fountain." },
    lines: [
      { s: 'narr', fr: 'Des [[traces|prints]] de [[boue|mud]]. De grandes [[chaussures|shoes]]. Un homme.', en: 'Muddy prints. Big shoes. A man.' },
      { s: 'narr', fr: 'Elles viennent du parc et vont [[vers|towards]] la fontaine.', en: 'They come from the park and go towards the fountain.' },
    ],
  },
};

export const STATEMENTS = {
  lebrun_maison: { who: 'lebrun', fr: 'Je ne suis pas sorti hier soir.', en: "I didn't go out last night." },
  garnier_vu: { who: 'garnier', fr: 'À 23 h 30, j\'ai vu Lebrun près de la fontaine.', en: 'At 23:30, I saw Lebrun near the fountain.' },
  theo_cri: { who: 'theo', fr: 'Vers 23 h 40, j\'ai entendu un cri.', en: 'Around 23:40, I heard a scream.' },
  theo_lettre: { who: 'theo', fr: 'Hier, Hélène a reçu une lettre. Elle a pleuré.', en: 'Yesterday, Hélène got a letter. She cried.' },
  maire_parc: { who: 'delacroix', fr: 'Hélène était contre la vente du parc.', en: 'Hélène was against selling the park.' },
  maire_alibi: { who: 'delacroix', fr: 'J\'étais à la mairie, puis chez moi avec ma femme.', en: 'I was at the town hall, then at home with my wife.' },
  claire_ecole: { who: 'claire', fr: 'J\'étais seule à l\'école. Personne ne peut le confirmer.', en: 'I was alone at the school. Nobody can confirm it.' },
  claire_echarpe: { who: 'claire', fr: 'L\'écharpe est à moi. Je l\'ai perdue la semaine dernière.', en: "The scarf is mine. I lost it last week." },
  roux_dette: { who: 'roux', fr: 'Hélène m\'a prêté de l\'argent. Je ne l\'ai pas rendu.', en: "Hélène lent me money. I haven't paid it back." },
  lebrun_dispute: { who: 'lebrun', fr: 'À la fontaine, Hélène se disputait avec une femme.', en: 'At the fountain, Hélène was arguing with a woman.' },
};

// Places that bring back a memory (optional, not evidence). Chapter 1 only.
export const MEMORIES = {
  fontaine: {
    name: 'La fontaine', x: 23, y: 9,
    lines: [
      { s: 'narr', fr: "Enfants, Hélène et moi, on lançait des [[pièces|coins]] dans cette fontaine.", en: 'As children, Hélène and I used to throw coins into this fountain.' },
      { s: 'narr', fr: "Elle faisait toujours le même [[vœu|wish]]. Elle ne m'a jamais dit lequel.", en: 'She always made the same wish. She never told me which.' },
    ],
  },
  ecole: {
    name: "L'école", x: 37, y: 8,
    lines: [
      { s: 'narr', fr: "Mon ancienne école. Claire s'asseyait devant moi.", en: 'My old school. Claire used to sit in front of me.' },
      { s: 'narr', fr: 'Elle ne se retournait jamais. Presque jamais.', en: 'She never turned round. Almost never.' },
    ],
  },
  banc: {
    name: 'Le banc du parc', x: 39, y: 13,
    lines: [
      { s: 'narr', fr: "Après l'école, on lisait ici. Hélène voulait devenir pharmacienne. Moi, [[policier|police officer]].", en: 'After school, we used to read here. Hélène wanted to be a pharmacist. Me, a police officer.' },
      { s: 'narr', fr: 'On a réussi tous les deux. Et ça n\'a servi à rien.', en: "We both made it. And it was no use at all." },
    ],
  },
  arret: {
    name: "L'arrêt de bus", x: 19, y: 26,
    lines: [
      { s: 'narr', fr: "C'est ici que je suis [[parti|left]], il y a quinze ans. Je n'ai pas regardé derrière moi.", en: "This is where I left, fifteen years ago. I didn't look back." },
    ],
  },
};

// Opening: Hélène's letter, then the bus home.
export const INTRO = [
  { s: 'narr', fr: 'Lyon. Le 29 octobre. Une [[lettre|letter]] sur mon bureau.', en: 'Lyon. 29 October. A letter on my desk.' },
  { s: 'narr', fr: "« Julien, reviens à Belleville. J'ai [[peur|fear]]. Je ne peux le dire qu'à toi. — Hélène »", en: '"Julien, come back to Belleville. I\'m scared. I can only tell you. — Hélène"' },
  { s: 'narr', fr: "Hélène. Mon amie d'[[enfance|childhood]].", en: 'Hélène. My childhood friend.' },
  { s: 'narr', fr: 'Je ne suis pas [[rentré|come home]] depuis quinze ans.', en: "I haven't been home for fifteen years." },
  { s: 'narr', fr: "Le lendemain soir, j'ai pris le bus pour Belleville.", en: 'The next evening, I took the bus to Belleville.' },
];

// After the prologue: the night of the murder.
export const NIGHT = [
  { s: 'narr', fr: "Cette nuit-là, la pluie n'a pas [[arrêté|stopped]].", en: "That night, the rain didn't stop." },
  { s: 'narr', fr: "Vers minuit, j'ai entendu un [[cri|scream]]. J'ai cru que je [[rêvais|was dreaming]].", en: 'Around midnight, I heard a scream. I thought I was dreaming.' },
  { s: 'narr', fr: 'Je ne rêvais pas.', en: "I wasn't dreaming." },
  { s: 'narr', fr: 'Le 31 octobre, six heures du matin. Théo frappe à ma porte.', en: '31 October, six in the morning. Théo knocks at my door.' },
];

export const OUTRO = [
  { s: 'narr', fr: "Hélène voulait me dire quelque chose. Quelqu'un l'en a [[empêchée|stopped]].", en: 'Hélène wanted to tell me something. Someone stopped her.' },
  { s: 'narr', fr: 'Une écharpe rouge. Une lettre. Une ville qui [[ment|lies]].', en: 'A red scarf. A letter. A town that lies.' },
  { s: 'narr', fr: 'Je suis rentré trop tard. Je ne repartirai pas sans la [[vérité|truth]].', en: "I came home too late. I won't leave without the truth." },
];

// Shown top-left. The first objective whose `done` is false is the current one.
export const OBJECTIVES = [
  { fr: "Hélène vous attend à l'arrêt de bus.", en: 'Hélène is waiting for you at the bus stop.', done: (g) => g.has('met_helene') },
  { fr: 'Allez au café. Théo vous attend.', en: 'Go to the café. Théo is waiting for you.', done: (g) => g.has('prologue_done') },
  { fr: 'Parlez à Théo.', en: 'Talk to Théo.', done: (g) => g.has('met_theo') },
  { fr: 'Allez à la fontaine.', en: 'Go to the fountain.', done: (g) => g.has('met_dubois') },
  { fr: 'Examinez la scène du crime.', en: 'Examine the crime scene.', done: (g) => g.clueCount() >= 4, count: (g) => `${g.clueCount()}/4` },
  { fr: "Interrogez les témoins. Quelqu'un ment.", en: 'Question the witnesses. Someone is lying.', done: (g) => g.has('lebrun_confessed') },
  { fr: 'Retournez voir le brigadier Dubois.', en: 'Go back to Sergeant Dubois.', done: (g) => g.has('chapter1_done') },
  { fr: 'Rédigez votre rapport.', en: 'Write your report.', done: (g) => g.has('report_done') },
  { fr: 'Fin du chapitre 1. Belleville vous attend.', en: 'End of chapter 1. Belleville is waiting.', done: () => false },
];

// The prologue's conversations (evening of 30 October).
export const PROLOGUE_DIALOGUE = {
  helene: {
    first: [
      { s: 'helene', fr: 'Julien ! Tu es venu...', en: 'Julien! You came...' },
      { s: 'you', fr: "Bien sûr. Ta lettre m'a fait peur. Qu'est-ce qui se passe ?", en: "Of course. Your letter scared me. What's going on?" },
      { s: 'helene', fr: 'Pas ici. Pas ce soir. Quelqu\'un nous [[regarde|is watching]], peut-être.', en: 'Not here. Not tonight. Someone may be watching us.' },
      { s: 'narr', fr: 'Elle regarde la place, la mairie, les fenêtres. Elle [[tremble|is shaking]].', en: 'She looks at the square, the town hall, the windows. She is shaking.' },
      { s: 'helene', fr: 'Demain matin, sept heures, au café de Théo. Je te dirai tout.', en: "Tomorrow morning, seven o'clock, at Théo's café. I'll tell you everything." },
      { s: 'you', fr: 'Hélène, si tu es en [[danger|danger]]...', en: "Hélène, if you're in danger..." },
      { s: 'helene', fr: 'Demain. [[Promis|Promise]].', en: 'Tomorrow. Promise.' },
      { s: 'helene', fr: "Tu m'as [[manqué|missed]], tu sais.", en: 'I missed you, you know.' },
      { s: 'narr', fr: "Elle part sous la pluie. Je ne savais pas que c'était la dernière fois.", en: "She leaves into the rain. I didn't know it was the last time.", set: 'met_helene' },
    ],
    greet: [],
    topics: [],
  },
  garnier: {
    first: [
      { s: 'garnier', fr: 'Belleville, [[terminus|last stop]] ! ... Attends. Le petit Julien ?', en: 'Belleville, last stop! ... Wait. Little Julien?' },
      { s: 'garnier', fr: "Je t'ai reconnu dans le bus. Tu as grandi, mais tu as toujours les mêmes yeux.", en: 'I recognised you on the bus. You\'ve grown up, but you still have the same eyes.' },
      { s: 'garnier', fr: 'Bienvenue à la maison, mon garçon.', en: 'Welcome home, my boy.' },
    ],
    greet: [{ s: 'garnier', fr: 'Encore un peu de pluie, et on va [[nager|swim]].', en: "A bit more rain, and we'll be swimming." }],
    topics: [
      {
        id: 'dernier', q: 'Le dernier bus part à quelle heure ?', en: 'What time does the last bus leave?',
        lines: [
          { s: 'garnier', fr: 'À vingt-trois heures trente. Comme toujours. Pourquoi ? Tu repars déjà ?', en: 'At half past eleven. As always. Why? Leaving already?' },
          { s: 'you', fr: 'Non. Pas cette fois.', en: 'No. Not this time.' },
        ],
      },
    ],
  },
  theo: {
    first: [
      { s: 'theo', fr: '[[Ben ça alors|Well I never]]... Julien ?', en: 'Well I never... Julien?' },
      { s: 'theo', fr: 'Quinze ans. Quinze ans, et pas une [[carte postale|postcard]].', en: 'Fifteen years. Fifteen years, and not a single postcard.' },
      { s: 'you', fr: 'Je sais, Théo. Je suis [[désolé|sorry]].', en: "I know, Théo. I'm sorry." },
      { s: 'theo', fr: "[[Bah|Eh]]... [[T'es|you're]] là, c'est l'essentiel.", en: "Eh... You're here, that's what matters." },
      { s: 'theo', fr: "Hélène m'a demandé de te garder la [[chambre|room]] au-dessus du café. Elle est bizarre en ce moment.", en: "Hélène asked me to keep you the room above the café. She's been strange lately." },
      { s: 'theo', fr: 'Allez, monte. On parlera demain.', en: "Go on, up you go. We'll talk tomorrow.", set: 'prologue_done' },
    ],
    greet: [],
    topics: [],
  },
};

// Chapter 1 conversations (morning of 31 October).
// first: first meeting this chapter; greet: later visits; topics[].requires: flags, clues or statements.
export const DIALOGUE = {
  theo: {
    first: [
      { s: 'theo', fr: "Julien... C'est Hélène. On l'a [[trouvée|found]] dans la fontaine.", en: "Julien... It's Hélène. They found her in the fountain." },
      { s: 'theo', fr: 'Elle est [[morte|dead]].', en: "She's dead." },
      { s: 'narr', fr: "Sept heures, au café. Elle n'est jamais venue.", en: "Seven o'clock, at the café. She never came." },
      { s: 'theo', fr: "Les gendarmes sont là-bas. Dubois dit que c'est un [[accident|accident]].", en: "The gendarmes are over there. Dubois says it's an accident." },
    ],
    greet: [{ s: 'theo', fr: 'Je... je ne sais pas quoi te dire.', en: "I... I don't know what to say to you." }],
    topics: [
      {
        id: 'soir', q: "Qu'est-ce que tu as fait hier soir ?", en: 'What did you do last night?',
        lines: [
          { s: 'theo', fr: "J'ai fermé à vingt-trois heures. Après, j'ai fait le [[ménage|cleaning]].", en: 'I closed at eleven. Afterwards, I did the cleaning.' },
          { s: 'theo', fr: "Vers minuit moins vingt, j'ai [[entendu|heard]] un cri.", en: 'Around twenty to midnight, I heard a scream.', record: 'theo_cri' },
          { s: 'theo', fr: "J'ai regardé par la [[fenêtre|window]]. Avec la pluie, je n'ai rien vu. Toi aussi, tu l'as entendu ?", en: "I looked out of the window. With the rain, I didn't see anything. You heard it too?" },
          { s: 'you', fr: "Oui. J'ai cru que je rêvais.", en: 'Yes. I thought I was dreaming.' },
          { s: 'narr', fr: "J'étais là. Juste au-dessus. Et je n'ai rien fait.", en: "I was there. Right above. And I did nothing." },
        ],
      },
      {
        id: 'victime', q: 'Hélène avait des problèmes ?', en: 'Did Hélène have problems?',
        lines: [
          { s: 'theo', fr: "[[Ouais|Yeah]]. Elle était [[nerveuse|nervous]]. Elle dormait mal.", en: "Yeah. She was nervous. She wasn't sleeping well." },
          { s: 'theo', fr: "Hier matin, elle a reçu une lettre, ici. Elle l'a lue. Elle a [[pleuré|cried]].", en: 'Yesterday morning, she got a letter, here. She read it. She cried.', record: 'theo_lettre' },
          { s: 'you', fr: "Qu'est-ce qu'il y avait dans la lettre ?", en: 'What was in the letter?' },
          { s: 'theo', fr: "[[J'sais pas|Dunno]]. Elle l'a mise dans sa [[poche|pocket]]. Après, elle m'a dit : « Julien arrive ce soir. Il va m'aider. »", en: "Dunno. She put it in her pocket. Then she said to me: \"Julien arrives tonight. He's going to help me.\"" },
          { s: 'narr', fr: 'Je suis arrivé. Je ne l\'ai pas aidée.', en: "I arrived. I didn't help her." },
        ],
      },
    ],
    evidence: {
      montre: [
        { s: 'theo', fr: "Vingt-trois heures quarante... C'est l'heure du cri.", en: "Twenty to midnight... That's when the scream was." },
        { s: 'narr', fr: 'Le cri, la montre. La même [[heure|time]].', en: 'The scream, the watch. The same time.' },
      ],
    },
    wrong: [{ s: 'theo', fr: "Je sais pas, Julien. Moi, je sers des cafés.", en: "I dunno, Julien. I just serve coffee." }],
  },

  dubois: {
    first: [
      { s: 'dubois', fr: 'Tiens. Le petit Morel. Le grand [[inspecteur|inspector]] de Lyon.', en: 'Well. Young Morel. The big inspector from Lyon.' },
      { s: 'you', fr: "Bonjour, Dubois. Qu'est-ce qui s'est [[passé|happened]] ?", en: 'Hello, Dubois. What happened?' },
      { s: 'dubois', fr: "Hélène Marchand. Le jardinier l'a trouvée dans la fontaine à cinq heures et demie.", en: 'Hélène Marchand. The gardener found her in the fountain at half past five.' },
      { s: 'dubois', fr: "Elle est [[tombée|fell]]. Elle s'est [[noyée|drowned]]. C'est un accident.", en: "She fell. She drowned. It's an accident." },
      { s: 'you', fr: "Elle m'a écrit. Elle avait peur. Ce n'est pas un accident.", en: "She wrote to me. She was scared. It isn't an accident." },
      { s: 'dubois', fr: "Vous êtes parti il y a quinze ans, monsieur l'inspecteur. Ici, ce n'est plus chez vous.", en: "You left fifteen years ago, inspector. This isn't your home any more." },
      { s: 'narr', fr: "Il me dit « vous ». Quand j'étais petit, il me disait « tu ».", en: 'He calls me "vous". When I was little, he called me "tu".' },
      { s: 'dubois', fr: 'Regardez si vous voulez. Mais ne [[dérangez|disturb]] pas les gens.', en: "Look around if you want. But don't bother people.", set: 'met_dubois' },
    ],
    greet: [{ s: 'dubois', fr: 'Encore vous.', en: 'You again.' }],
    topics: [
      {
        id: 'corps', q: 'Où est le jardinier ?', en: 'Where is the gardener?',
        lines: [
          { s: 'dubois', fr: 'Lebrun ? Là-bas, à côté du parc. Il ne va pas bien.', en: "Lebrun? Over there, by the park. He's not doing well." },
        ],
      },
      {
        id: 'victime', q: 'Parlez-moi de la victime.', en: 'Tell me about the victim.',
        lines: [
          { s: 'dubois', fr: 'Vous la connaissiez mieux que moi, non ?', en: 'You knew her better than I did, didn\'t you?' },
          { s: 'dubois', fr: 'Elle travaillait à la pharmacie depuis vingt ans. Elle [[vivait|lived]] seule.', en: 'She had worked at the pharmacy for twenty years. She lived alone.' },
          { s: 'you', fr: 'Elle avait des [[ennemis|enemies]] ?', en: 'Did she have enemies?' },
          { s: 'dubois', fr: 'Ici, tout le monde se connaît. Et tout le monde se [[déteste|hates]] un peu.', en: 'Here, everyone knows each other. And everyone hates each other a little.' },
        ],
      },
      {
        id: 'accident', q: "Son sac est encore là. Avec l'argent.", en: 'Her bag is still there. With the money.', requires: ['sac'],
        lines: [
          { s: 'dubois', fr: "Et alors ? Ce n'est pas un vol. C'est un accident. Je vous l'ai [[dit|told]].", en: "So? It isn't a robbery. It's an accident. I told you." },
          { s: 'narr', fr: 'Il ne me regarde pas dans les yeux.', en: "He doesn't look me in the eye." },
        ],
      },
      {
        id: 'fin', q: 'Le jardinier a menti. Il était sur la place hier soir.', en: 'The gardener lied. He was in the square last night.', requires: ['lebrun_confessed'], end: true,
        lines: [
          { s: 'dubois', fr: '...Il a vu quelque chose ?', en: '...Did he see something?' },
          { s: 'you', fr: 'Une [[dispute|argument]]. Entre Hélène et une femme.', en: 'An argument. Between Hélène and a woman.' },
          { s: 'dubois', fr: 'Une femme...', en: 'A woman...' },
          { s: 'narr', fr: 'Son [[téléphone|phone]] sonne. Il écoute. Son [[visage|face]] change.', en: 'His phone rings. He listens. His face changes.' },
          { s: 'dubois', fr: "C'était le [[médecin|doctor]]. Hélène n'est pas morte noyée.", en: "That was the doctor. Hélène didn't drown." },
          { s: 'dubois', fr: "Elle a reçu un [[coup|blow]] à la tête. Avant de tomber dans l'eau.", en: 'She was struck on the head. Before she fell into the water.' },
          { s: 'dubois', fr: '...Vous aviez raison, Julien.', en: '...You were right, Julien.' },
          { s: 'narr', fr: "Mon prénom. Pour la première fois depuis quinze ans.", en: 'My first name. For the first time in fifteen years.' },
          { s: 'dubois', fr: "C'est un [[meurtre|murder]].", en: "It's a murder.", set: 'chapter1_done' },
        ],
      },
    ],
    wrong: [{ s: 'dubois', fr: 'Vous perdez votre temps. Et le mien.', en: "You're wasting your time. And mine." }],
  },

  lebrun: {
    first: [
      { s: 'lebrun', fr: 'Le petit Morel. Vous voliez les [[pommes|apples]] du parc, avant.', en: 'Young Morel. You used to steal the apples from the park.' },
      { s: 'lebrun', fr: "J'ai déjà tout dit au brigadier. Je suis arrivé à cinq heures et demie. Comme tous les jours.", en: "I've already told the sergeant everything. I got here at half past five. Like every day." },
      { s: 'lebrun', fr: "Je l'ai vue dans l'eau. Je ne l'ai pas [[touchée|touched]].", en: "I saw her in the water. I didn't touch her." },
      { s: 'narr', fr: 'Ses mains [[tremblent|are shaking]]. Le froid, peut-être.', en: 'His hands are shaking. The cold, maybe.' },
    ],
    greet: [{ s: 'lebrun', fr: 'Quoi encore ?', en: 'What now?' }],
    topics: [
      {
        id: 'soir', q: 'Où étiez-vous hier soir ?', en: 'Where were you last night?',
        lines: [
          { s: 'lebrun', fr: "Chez moi. Je ne suis pas [[sorti|gone out]] hier soir.", en: "At home. I didn't go out last night.", record: 'lebrun_maison' },
          { s: 'lebrun', fr: 'Je me [[couche|go to bed]] tôt. Je travaille tôt.', en: 'I go to bed early. I work early.' },
        ],
      },
      {
        id: 'victime', q: 'Vous connaissiez bien Hélène ?', en: 'Did you know Hélène well?',
        lines: [
          { s: 'lebrun', fr: 'Elle venait souvent au parc. Elle aimait les [[arbres|trees]].', en: 'She often came to the park. She loved the trees.' },
          { s: 'lebrun', fr: 'Le maire veut [[vendre|sell]] le parc. Hélène était contre. Moi aussi.', en: 'The mayor wants to sell the park. Hélène was against it. Me too.' },
        ],
      },
      {
        id: 'boue', q: 'Il y a des traces de boue. Elles viennent du parc.', en: 'There are muddy prints. They come from the park.', requires: ['boue'],
        lines: [
          { s: 'lebrun', fr: 'Je travaille dans le parc. Il y a de la boue partout. Regardez mes [[bottes|boots]].', en: 'I work in the park. There is mud everywhere. Look at my boots.' },
          { s: 'narr', fr: 'Il a raison. Mais il regarde [[ailleurs|elsewhere]].', en: "He's right. But he looks away." },
        ],
      },
    ],
    evidence: {
      garnier_vu: [
        { s: 'you', fr: 'Garnier vous a vu sur la place. À vingt-trois heures trente.', en: 'Garnier saw you in the square. At half past eleven.' },
        { s: 'lebrun', fr: '...', en: '...' },
        { s: 'lebrun', fr: "D'accord. Je suis sorti. J'ai [[menti|lied]].", en: 'All right. I went out. I lied.' },
        { s: 'lebrun', fr: "Hélène m'a donné [[rendez-vous|a meeting]] à la fontaine. Elle voulait me parler du parc.", en: 'Hélène asked to meet me at the fountain. She wanted to talk to me about the park.' },
        { s: 'lebrun', fr: "Quand je suis arrivé, elle se [[disputait|was arguing]] avec quelqu'un. Une femme.", en: 'When I arrived, she was arguing with someone. A woman.', record: 'lebrun_dispute' },
        { s: 'you', fr: 'Qui ?', en: 'Who?' },
        { s: 'lebrun', fr: "Je n'ai pas vu son visage. Il faisait [[noir|dark]]. Il pleuvait.", en: "I didn't see her face. It was dark. It was raining." },
        { s: 'lebrun', fr: "J'ai eu peur. Je suis rentré chez moi. Je n'ai rien fait, je vous le [[jure|swear]] !", en: "I was scared. I went home. I didn't do anything, I swear!", set: 'lebrun_confessed' },
      ],
      theo_cri: [
        { s: 'you', fr: 'Théo a entendu un cri. Vers minuit moins vingt.', en: 'Théo heard a scream. Around twenty to midnight.' },
        { s: 'lebrun', fr: "Moi, je dormais. Je n'ai rien entendu.", en: "I was asleep. I didn't hear anything." },
        { s: 'narr', fr: 'Il ment. Mais il me faut une [[preuve|proof]].', en: "He's lying. But I need proof." },
      ],
    },
    wrong: [{ s: 'lebrun', fr: 'Je ne vois pas le [[rapport|connection]].', en: "I don't see the connection." }],
  },

  garnier: {
    first: [
      { s: 'garnier', fr: 'Julien... Je suis désolé, mon garçon. Je sais qu\'elle comptait pour toi.', en: 'Julien... I\'m sorry, my boy. I know she mattered to you.' },
      { s: 'garnier', fr: "Après la pluie, le beau temps, comme on dit. Mais pas aujourd'hui.", en: "After the rain comes sunshine, as they say. But not today." },
    ],
    greet: [{ s: 'garnier', fr: 'Le prochain bus part dans une heure. Pas pour toi, hein ?', en: 'The next bus leaves in an hour. Not for you, eh?' }],
    topics: [
      {
        id: 'soir', q: 'Tu étais ici hier soir, après mon arrivée ?', en: 'Were you here last night, after I arrived?',
        lines: [
          { s: 'garnier', fr: "Oui. Le [[dernier|last]] bus part à vingt-trois heures trente. J'ai [[attendu|waited]] cinq minutes. Personne.", en: 'Yes. The last bus leaves at half past eleven. I waited five minutes. Nobody.' },
          { s: 'garnier', fr: 'Mais il y avait un homme sur la [[place|square]], près de la fontaine.', en: 'But there was a man in the square, near the fountain.' },
          { s: 'garnier', fr: "Le jardinier, Lebrun. Il avait l'air [[nerveux|nervous]].", en: 'The gardener, Lebrun. He looked nervous.', record: 'garnier_vu' },
        ],
      },
      {
        id: 'victime', q: 'Hélène prenait souvent ton bus ?', en: 'Did Hélène often take your bus?',
        lines: [
          { s: 'garnier', fr: 'La semaine dernière, elle est allée à Lyon. Elle avait un gros [[dossier|file]] sous le bras.', en: 'Last week, she went to Lyon. She had a big file under her arm.' },
          { s: 'garnier', fr: "Elle ne m'a pas dit pourquoi. Elle ne parlait plus beaucoup.", en: "She didn't tell me why. She didn't talk much any more." },
        ],
      },
    ],
    wrong: [{ s: 'garnier', fr: 'Moi, je [[conduis|drive]] le bus, mon garçon. Je ne suis pas détective.', en: "I drive the bus, my boy. I'm not a detective." }],
  },

  delacroix: {
    first: [
      { s: 'delacroix', fr: 'Monsieur Morel. Quelle [[surprise|surprise]]. Vous étiez un enfant... [[difficile|difficult]].', en: 'Mr Morel. What a surprise. You were a... difficult child.' },
      { s: 'delacroix', fr: "C'est une tragédie, naturellement. Mais c'est un accident. Le brigadier est d'accord.", en: "It's a tragedy, naturally. But it's an accident. The sergeant agrees." },
      { s: 'delacroix', fr: 'La [[fête|festival]] de la Toussaint est demain. Je ne veux pas de [[scandale|scandal]]. Vous comprenez, je vous en prie ?', en: "The All Saints' festival is tomorrow. I don't want a scandal. You do understand, I trust?" },
    ],
    greet: [{ s: 'delacroix', fr: "J'ai énormément de travail, monsieur Morel.", en: 'I have an enormous amount of work, Mr Morel.' }],
    topics: [
      {
        id: 'victime', q: 'Vous connaissiez Hélène ?', en: 'Did you know Hélène?',
        lines: [
          { s: 'delacroix', fr: 'Évidemment. Elle était... difficile, elle aussi.', en: 'Obviously. She was... difficult, too.' },
          { s: 'delacroix', fr: 'Elle était contre la [[vente|sale]] du parc. Elle a écrit au journal. Elle a parlé à tout le monde.', en: 'She was against the sale of the park. She wrote to the newspaper. She talked to everyone.', record: 'maire_parc' },
        ],
      },
      {
        id: 'soir', q: 'Où étiez-vous hier soir ?', en: 'Where were you last night?',
        lines: [
          { s: 'delacroix', fr: "Pardon ? Vous m'[[accusez|accuse]] ? Quelle insolence.", en: 'I beg your pardon? Are you accusing me? What insolence.' },
          { s: 'delacroix', fr: "J'étais à la mairie jusqu'à vingt-deux heures. Puis chez moi, avec ma [[femme|wife]].", en: 'I was at the town hall until ten. Then at home, with my wife.', record: 'maire_alibi' },
        ],
      },
      {
        id: 'parc', q: 'Pourquoi vendre le parc ?', en: 'Why sell the park?', requires: ['maire_parc'],
        lines: [
          { s: 'delacroix', fr: "Belleville n'a pas d'argent. Un [[promoteur|developer]] veut construire des [[appartements|flats]].", en: 'Belleville has no money. A developer wants to build flats.' },
          { s: 'delacroix', fr: "C'est l'[[avenir|future]]. Hélène vivait dans le passé. Comme vous, peut-être.", en: 'It is the future. Hélène lived in the past. Like you, perhaps.' },
        ],
      },
    ],
    evidence: {
      echarpe: [
        { s: 'delacroix', fr: 'Une écharpe rouge ? Beaucoup de femmes portent du rouge, monsieur Morel.', en: 'A red scarf? Lots of women wear red, Mr Morel.' },
        { s: 'narr', fr: "Mais ses yeux vont vers l'école.", en: 'But his eyes go towards the school.' },
      ],
    },
    wrong: [{ s: 'delacroix', fr: "Je n'ai pas de temps pour ça.", en: "I don't have time for this." }],
  },

  claire: {
    first: [
      { s: 'claire', fr: 'Julien.', en: 'Julien.' },
      { s: 'claire', fr: "Tu n'aurais pas dû [[revenir|come back]].", en: "You shouldn't have come back." },
      { s: 'narr', fr: "Ses yeux sont rouges. Elle ne porte pas d'[[écharpe|scarf]]. Malgré le froid.", en: "Her eyes are red. She isn't wearing a scarf. Despite the cold." },
      { s: 'you', fr: 'Claire... Je suis désolé. Pour Hélène.', en: "Claire... I'm sorry. About Hélène." },
      { s: 'claire', fr: 'Ne dis pas ça. Tu es parti sans dire au revoir. À elle. À moi.', en: "Don't say that. You left without saying goodbye. To her. To me." },
      { s: 'claire', fr: 'Ma sœur et moi, on ne se parlait plus depuis dix ans. Tu ne savais pas, hein ?', en: "My sister and I hadn't spoken for ten years. You didn't know, did you?" },
    ],
    greet: [{ s: 'claire', fr: 'Encore toi.', en: 'You again.' }],
    topics: [
      {
        id: 'soir', q: 'Où étais-tu hier soir ?', en: 'Where were you last night?',
        lines: [
          { s: 'claire', fr: "Vous voulez mon [[alibi|alibi]], monsieur l'inspecteur ?", en: 'You want my alibi, inspector?' },
          { s: 'narr', fr: '« Vous ». Elle a choisi « vous ».', en: '"Vous". She chose "vous".' },
          { s: 'claire', fr: "J'étais à l'école. Je [[corrigeais|was marking]] des cahiers. Seule. Personne ne peut le [[confirmer|confirm]].", en: 'I was at the school. I was marking exercise books. Alone. Nobody can confirm it.', record: 'claire_ecole' },
        ],
      },
      {
        id: 'pourquoi', q: 'Pourquoi tu ne parlais plus à Hélène ?', en: "Why didn't you speak to Hélène any more?",
        lines: [
          { s: 'claire', fr: 'Ça ne te [[regarde|concern]] pas. Plus maintenant.', en: "That's none of your business. Not any more." },
          { s: 'narr', fr: 'Dix ans de [[silence|silence]]. Et hier soir ?', en: 'Ten years of silence. And last night?' },
        ],
      },
    ],
    evidence: {
      echarpe: [
        { s: 'you', fr: 'Cette écharpe était près de la fontaine.', en: 'This scarf was near the fountain.' },
        { s: 'claire', fr: '...', en: '...' },
        { s: 'claire', fr: "Elle est à moi. Mais je l'ai [[perdue|lost]] la semaine dernière.", en: 'It is mine. But I lost it last week.', record: 'claire_echarpe' },
        { s: 'claire', fr: 'Tu te souviens ? Tu me l\'as offerte. Avant de partir.', en: 'Do you remember? You gave it to me. Before you left.' },
        { s: 'narr', fr: 'Elle [[ment|is lying]] sur quelque chose. Ou elle a peur.', en: "She's lying about something. Or she's afraid." },
      ],
    },
    wrong: [{ s: 'claire', fr: "Je n'ai rien à te dire.", en: 'I have nothing to say to you.' }],
  },

  roux: {
    first: [
      { s: 'roux', fr: 'Julien ! Mon petit Julien ! Viens ici, que je te regarde !', en: 'Julien! My little Julien! Come here, let me look at you!' },
      { s: 'roux', fr: "Tu es tout [[maigre|thin]] ! Ils ne te nourrissent pas, à Lyon ? Tiens, un croissant, il est [[chaud|hot]], mange, mange !", en: "You're so thin! Don't they feed you in Lyon? Here, a croissant, it's hot, eat, eat!" },
      { s: 'roux', fr: "Et la pauvre Hélène, mon Dieu... Ici, les [[nouvelles|news]] vont plus vite que le bus de Garnier, tu sais !", en: "And poor Hélène, my God... Here, news travels faster than Garnier's bus, you know!" },
    ],
    greet: [{ s: 'roux', fr: 'Encore toi ! Tu as mangé ton croissant, au moins ?', en: 'You again! Did you at least eat your croissant?' }],
    topics: [
      {
        id: 'rumeurs', q: "Qu'est-ce que les gens disent ?", en: 'What are people saying?',
        lines: [
          { s: 'roux', fr: "Oh, ils disent que ce n'est pas un accident, et que le maire est nerveux, et que Claire n'a pas dormi, et...", en: "Oh, they say it isn't an accident, and that the mayor is nervous, and that Claire didn't sleep, and..." },
          { s: 'roux', fr: 'Hélène était pharmacienne. Elle savait qui prenait quels médicaments. Elle connaissait les [[secrets|secrets]] de tout le monde.', en: "Hélène was a pharmacist. She knew who took what medicine. She knew everyone's secrets." },
        ],
      },
      {
        id: 'victime', q: 'Tu connaissais bien Hélène ?', en: 'Did you know Hélène well?',
        lines: [
          { s: 'roux', fr: "Elle m'a [[prêté|lent]] de l'argent l'année dernière, pour le four. Je ne l'ai pas encore [[rendu|paid back]]...", en: "She lent me money last year, for the oven. I haven't paid it back yet..." , record: 'roux_dette' },
          { s: 'roux', fr: "Mais je ne l'ai pas [[tuée|killed]], hein ! Je t'ai donné le biberon, petit !", en: "But I didn't kill her, eh! I bottle-fed you, young man!" },
        ],
      },
    ],
    wrong: [{ s: 'roux', fr: 'Moi, je fais du pain, mon chéri.', en: 'I make bread, sweetheart.' }],
  },
};

// End-of-chapter case report. Each line has one blank ({}) and three options; `answer` is the
// index of the right one. Distractors are words the player has met, so the report doubles as review.
export const REPORT = {
  header: 'GENDARMERIE DE BELLEVILLE',
  title: 'RAPPORT D\'ENQUÊTE',
  case: 'Affaire : Hélène Marchand — le 31 octobre',
  intro: [
    { s: 'dubois', fr: 'Le [[juge|judge]] veut un [[rapport|report]] ce soir. Écrivez-le, Julien.', en: 'The judge wants a report tonight. Write it, Julien.' },
  ],
  lines: [
    { fr: 'La victime, Hélène Marchand, était {}.', en: 'The victim, Hélène Marchand, was a pharmacist.', options: ['pharmacienne', 'boulangère', 'serveuse'], answer: 0 },
    { fr: 'Le jardinier l\'a trouvée dans {} à cinq heures et demie.', en: 'The gardener found her in the fountain at half past five.', options: ['le parc', 'la fontaine', 'le café'], answer: 1 },
    { fr: 'Sa {} s\'est arrêtée à vingt-trois heures quarante.', en: 'Her watch stopped at twenty to midnight.', options: ['lettre', 'écharpe', 'montre'], answer: 2 },
    { fr: 'Son argent était dans son sac : ce n\'est pas un {}.', en: "Her money was in her bag: it isn't a theft.", options: ['vol', 'cri', 'rendez-vous'], answer: 0 },
    { fr: 'Le chauffeur a vu Lebrun près de la fontaine. Lebrun a {}.', en: 'The driver saw Lebrun near the fountain. Lebrun lied.', options: ['dormi', 'menti', 'pleuré'], answer: 1 },
    { fr: 'À la fontaine, Hélène se {} avec une femme.', en: 'At the fountain, Hélène was arguing with a woman.', options: ['noyait', 'couchait', 'disputait'], answer: 2 },
    { fr: 'Près de la fontaine, il y avait une écharpe {}.', en: 'Near the fountain, there was a red scarf.', options: ['rouge', 'noire', 'blanche'], answer: 0 },
    { fr: 'Elle a reçu un {} à la tête avant de tomber dans l\'eau.', en: 'She was struck on the head before falling into the water.', options: ['cri', 'coup', 'café'], answer: 1 },
  ],
  conclusion: { fr: 'Conclusion : ce n\'est pas un accident. C\'est un meurtre.', en: "Conclusion: it isn't an accident. It's a murder." },
  stamp: 'MEURTRE',
  verdict: [
    { max: 0, line: { s: 'dubois', fr: 'Impeccable. Le juge sera content.', en: 'Flawless. The judge will be pleased.' } },
    { max: 2, line: { s: 'dubois', fr: 'Pas mal, pour quelqu\'un de Lyon.', en: 'Not bad, for someone from Lyon.' } },
    { max: 99, line: { s: 'dubois', fr: 'Le juge va avoir des questions...', en: 'The judge is going to have questions...' } },
  ],
};
