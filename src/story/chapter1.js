// Chapitre 1 — L'arrivée
//
// Line format: { s: speaker, fr, en, record?, set?, clue? }
//   s: a CAST id, 'you' (the inspector), or 'narr' (inner monologue)
//   fr: French with [[word|gloss]] marking key vocabulary (tappable, collected in the Carnet)
//   en: English translation (shown only when the player taps EN)
//   record: statement id added to the case notebook
//   set: flag set when the line is shown
// Grammar level: present tense and passé composé, with a little imparfait.
// Positions are street tile coordinates (see world/town.js).

export const CHAPTER = {
  id: 'ch1',
  title: 'Chapitre 1 — L\'arrivée',
  titleEn: 'Chapter 1 — The Arrival',
  playerStart: { x: 24, y: 23 },
};

export const CAST = {
  dubois: { name: 'Brigadier Dubois', role: 'le gendarme', char: 4, x: 24, y: 16 },
  lebrun: { name: 'Lebrun', role: 'le jardinier', char: 3, x: 30, y: 12 },
  theo: { name: 'Théo', role: 'le serveur', char: 0, x: 15, y: 7 },
  garnier: { name: 'Garnier', role: 'le chauffeur', char: 2, x: 22, y: 26 },
  delacroix: { name: 'M. Delacroix', role: 'le maire', char: 2, x: 24, y: 7 },
  claire: { name: 'Claire Marchand', role: 'la sœur', char: 1, x: 35, y: 7 },
  roux: { name: 'Mme Roux', role: 'la boulangère', char: 1, x: 6, y: 7 },
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

export const INTRO = [
  { s: 'narr', fr: 'Belleville. Le 31 octobre. Six heures du matin.', en: 'Belleville. 31 October. Six in the morning.' },
  { s: 'narr', fr: 'Il [[pleut|is raining]] depuis trois jours.', en: "It's been raining for three days." },
  { s: 'narr', fr: 'Cette nuit, une femme est [[morte|dead]] ici.', en: 'Last night, a woman died here.' },
  { s: 'narr', fr: 'On m\'a envoyé de Lyon pour une [[enquête|investigation]] simple.', en: 'They sent me from Lyon for a simple investigation.' },
  { s: 'narr', fr: 'Rien n\'est simple à Belleville.', en: 'Nothing is simple in Belleville.' },
];

export const OUTRO = [
  { s: 'narr', fr: 'Une femme [[morte|dead]]. Une écharpe rouge. Une lettre.', en: 'A dead woman. A red scarf. A letter.' },
  { s: 'narr', fr: 'Et une ville qui [[ment|lies]].', en: 'And a town that lies.' },
  { s: 'narr', fr: 'La pluie [[continue|continues]]. L\'enquête aussi.', en: 'The rain continues. So does the investigation.' },
];

// Shown top-left. The first objective whose `done` is false is the current one.
export const OBJECTIVES = [
  { fr: 'Parlez au gendarme près de la fontaine.', en: 'Talk to the gendarme by the fountain.', done: (g) => g.has('met_dubois') },
  { fr: 'Examinez la scène du crime.', en: 'Examine the crime scene.', done: (g) => g.clueCount() >= 4, count: (g) => `${g.clueCount()}/4` },
  { fr: 'Interrogez les témoins. Quelqu\'un ment.', en: 'Question the witnesses. Someone is lying.', done: (g) => g.has('lebrun_confessed') },
  { fr: 'Retournez voir le brigadier Dubois.', en: 'Go back to Sergeant Dubois.', done: (g) => g.has('chapter1_done') },
  { fr: 'Fin du chapitre 1. Belleville vous attend.', en: 'End of chapter 1. Belleville is waiting.', done: () => false },
];

// Per character: first meeting, greeting on later visits, questions, evidence reactions.
// topics[].requires: flags/clue ids/statement ids that must be known first.
export const DIALOGUE = {
  dubois: {
    first: [
      { s: 'dubois', fr: 'Vous êtes l\'inspecteur de Lyon ? Vous êtes en [[retard|late]].', en: "You're the inspector from Lyon? You're late." },
      { s: 'you', fr: 'Le bus est arrivé à six heures. Qu\'est-ce qui s\'est [[passé|happened]] ?', en: 'The bus arrived at six. What happened?' },
      { s: 'dubois', fr: 'Hélène Marchand, la [[pharmacienne|pharmacist]]. On l\'a [[trouvée|found]] dans la fontaine ce matin.', en: 'Hélène Marchand, the pharmacist. She was found in the fountain this morning.' },
      { s: 'dubois', fr: 'Elle est [[tombée|fell]]. Elle s\'est [[noyée|drowned]]. C\'est un accident.', en: "She fell. She drowned. It's an accident." },
      { s: 'dubois', fr: 'Regardez si vous voulez. Mais ne [[dérangez|disturb]] pas les gens. Ils sont assez tristes.', en: "Look around if you want. But don't bother people. They're sad enough." },
      { s: 'narr', fr: 'Un accident. Il a dit ça trop [[vite|quickly]].', en: 'An accident. He said that too quickly.', set: 'met_dubois' },
    ],
    greet: [{ s: 'dubois', fr: 'Encore vous ?', en: 'You again?' }],
    topics: [
      {
        id: 'corps', q: 'Qui a trouvé le corps ?', en: 'Who found the body?',
        lines: [
          { s: 'dubois', fr: 'Lebrun, le [[jardinier|gardener]]. À cinq heures et demie.', en: 'Lebrun, the gardener. At half past five.' },
          { s: 'dubois', fr: 'Il est là-bas, à côté du parc. Il ne va pas bien.', en: "He's over there, by the park. He's not doing well." },
        ],
      },
      {
        id: 'victime', q: 'Parlez-moi de la victime.', en: 'Tell me about the victim.',
        lines: [
          { s: 'dubois', fr: 'Elle travaillait à la pharmacie depuis vingt ans. Elle [[vivait|lived]] seule.', en: 'She had worked at the pharmacy for twenty years. She lived alone.' },
          { s: 'you', fr: 'Elle avait des [[ennemis|enemies]] ?', en: 'Did she have enemies?' },
          { s: 'dubois', fr: 'Ici, tout le monde se connaît, inspecteur. Et tout le monde se [[déteste|hates]] un peu.', en: 'Here, everyone knows each other, inspector. And everyone hates each other a little.' },
        ],
      },
      {
        id: 'accident', q: 'Son sac est encore là. Avec l\'argent.', en: 'Her bag is still there. With the money.', requires: ['sac'],
        lines: [
          { s: 'dubois', fr: 'Et alors ? Ce n\'est pas un vol. C\'est un accident. Je vous l\'ai [[dit|told]].', en: "So? It isn't a robbery. It's an accident. I told you." },
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
          { s: 'dubois', fr: 'C\'était le [[médecin|doctor]]. Hélène n\'est pas morte noyée.', en: "That was the doctor. Hélène didn't drown." },
          { s: 'dubois', fr: 'Elle a reçu un [[coup|blow]] à la tête. Avant de tomber dans l\'eau.', en: 'She was struck on the head. Before she fell into the water.' },
          { s: 'dubois', fr: 'Ce n\'est pas un accident, inspecteur.', en: "It isn't an accident, inspector." },
          { s: 'dubois', fr: 'C\'est un [[meurtre|murder]].', en: "It's a murder.", set: 'chapter1_done' },
        ],
      },
    ],
    wrong: [{ s: 'dubois', fr: 'Vous perdez votre temps. Et le mien.', en: "You're wasting your time. And mine." }],
  },

  lebrun: {
    first: [
      { s: 'lebrun', fr: 'Vous êtes [[policier|police officer]] ? J\'ai déjà tout dit au brigadier.', en: "You're police? I've already told the sergeant everything." },
      { s: 'lebrun', fr: 'Je suis arrivé au parc à cinq heures et demie. Comme tous les jours.', en: 'I got to the park at half past five. Like every day.' },
      { s: 'lebrun', fr: 'Je l\'ai vue dans l\'eau. Je ne l\'ai pas [[touchée|touched]]. J\'ai appelé la gendarmerie.', en: "I saw her in the water. I didn't touch her. I called the police." },
      { s: 'narr', fr: 'Ses mains [[tremblent|are shaking]]. Le froid, peut-être.', en: 'His hands are shaking. The cold, maybe.' },
    ],
    greet: [{ s: 'lebrun', fr: 'Quoi encore ?', en: 'What now?' }],
    topics: [
      {
        id: 'soir', q: 'Où étiez-vous hier soir ?', en: 'Where were you last night?',
        lines: [
          { s: 'lebrun', fr: 'Chez moi. Je ne suis pas [[sorti|gone out]] hier soir.', en: "At home. I didn't go out last night.", record: 'lebrun_maison' },
          { s: 'lebrun', fr: 'Je me [[couche|go to bed]] tôt. Je travaille tôt.', en: 'I go to bed early. I work early.' },
        ],
      },
      {
        id: 'victime', q: 'Vous connaissiez Hélène ?', en: 'Did you know Hélène?',
        lines: [
          { s: 'lebrun', fr: 'Un peu. Elle venait souvent au parc. Elle aimait les [[arbres|trees]].', en: 'A little. She often came to the park. She loved the trees.' },
          { s: 'lebrun', fr: 'Le maire veut [[vendre|sell]] le parc. Hélène était contre. Moi aussi.', en: 'The mayor wants to sell the park. Hélène was against it. Me too.' },
        ],
      },
      {
        id: 'boue', q: 'Il y a des traces de boue. Elles viennent du parc.', en: 'There are muddy prints. They come from the park.', requires: ['boue'],
        lines: [
          { s: 'lebrun', fr: 'Je travaille dans le parc, inspecteur. Il y a de la boue partout. Regardez mes [[bottes|boots]].', en: 'I work in the park, inspector. There is mud everywhere. Look at my boots.' },
          { s: 'narr', fr: 'Il a raison. Mais il regarde [[ailleurs|elsewhere]].', en: "He's right. But he looks away." },
        ],
      },
    ],
    evidence: {
      garnier_vu: [
        { s: 'you', fr: 'Le chauffeur de bus vous a vu sur la place. À vingt-trois heures trente.', en: 'The bus driver saw you in the square. At half past eleven.' },
        { s: 'lebrun', fr: '...', en: '...' },
        { s: 'lebrun', fr: 'D\'accord. Je suis sorti. J\'ai [[menti|lied]].', en: 'All right. I went out. I lied.' },
        { s: 'lebrun', fr: 'Hélène m\'a donné [[rendez-vous|a meeting]] à la fontaine. Elle voulait me parler du parc.', en: 'Hélène asked to meet me at the fountain. She wanted to talk to me about the park.' },
        { s: 'lebrun', fr: 'Quand je suis arrivé, elle se [[disputait|was arguing]] avec quelqu\'un. Une femme.', en: 'When I arrived, she was arguing with someone. A woman.', record: 'lebrun_dispute' },
        { s: 'you', fr: 'Qui ?', en: 'Who?' },
        { s: 'lebrun', fr: 'Je n\'ai pas vu son visage. Il faisait [[noir|dark]]. Il pleuvait.', en: "I didn't see her face. It was dark. It was raining." },
        { s: 'lebrun', fr: 'J\'ai eu [[peur|fear]]. Je suis rentré chez moi. Je n\'ai rien fait, je vous le [[jure|swear]] !', en: "I was scared. I went home. I didn't do anything, I swear!", set: 'lebrun_confessed' },
      ],
      theo_cri: [
        { s: 'you', fr: 'Le serveur a entendu un cri. Vers minuit moins vingt.', en: 'The waiter heard a scream. Around twenty to midnight.' },
        { s: 'lebrun', fr: 'Moi, je dormais. Je n\'ai rien entendu.', en: "I was asleep. I didn't hear anything." },
        { s: 'narr', fr: 'Il ment. Mais il me faut une [[preuve|proof]].', en: "He's lying. But I need proof." },
      ],
    },
    wrong: [{ s: 'lebrun', fr: 'Je ne vois pas le [[rapport|connection]], inspecteur.', en: "I don't see the connection, inspector." }],
  },

  theo: {
    first: [
      { s: 'theo', fr: 'Le café est [[fermé|closed]]... Ah, pardon. Vous êtes l\'inspecteur ?', en: "The café is closed... Oh, sorry. You're the inspector?" },
      { s: 'theo', fr: 'Pauvre Hélène. Elle prenait un café ici tous les matins. Un café [[noir|black]], sans sucre.', en: 'Poor Hélène. She had a coffee here every morning. Black, no sugar.' },
    ],
    greet: [{ s: 'theo', fr: 'Inspecteur.', en: 'Inspector.' }],
    topics: [
      {
        id: 'soir', q: 'Où étiez-vous hier soir ?', en: 'Where were you last night?',
        lines: [
          { s: 'theo', fr: 'Ici. Le café a fermé à vingt-trois heures. Après, j\'ai fait le [[ménage|cleaning]].', en: 'Here. The café closed at eleven. Afterwards, I did the cleaning.' },
          { s: 'theo', fr: 'Vers minuit moins vingt, j\'ai [[entendu|heard]] un [[cri|scream]].', en: 'Around twenty to midnight, I heard a scream.', record: 'theo_cri' },
          { s: 'theo', fr: 'J\'ai regardé par la [[fenêtre|window]]. Mais avec la pluie, je n\'ai rien vu.', en: "I looked out of the window. But with the rain, I didn't see anything." },
        ],
      },
      {
        id: 'victime', q: 'Hélène avait des problèmes ?', en: 'Did Hélène have problems?',
        lines: [
          { s: 'theo', fr: 'Elle était [[nerveuse|nervous]] ces derniers jours. Elle ne dormait pas bien.', en: "She'd been nervous recently. She wasn't sleeping well." },
          { s: 'theo', fr: 'Hier matin, elle a reçu une [[lettre|letter]]. Elle l\'a lue ici. Elle a [[pleuré|cried]].', en: 'Yesterday morning, she got a letter. She read it here. She cried.', record: 'theo_lettre' },
          { s: 'you', fr: 'Qu\'est-ce qu\'il y avait dans la lettre ?', en: 'What was in the letter?' },
          { s: 'theo', fr: 'Je ne sais pas. Elle l\'a mise dans sa [[poche|pocket]] et elle est partie.', en: "I don't know. She put it in her pocket and left." },
        ],
      },
    ],
    evidence: {
      montre: [
        { s: 'theo', fr: 'Vingt-trois heures quarante... C\'est l\'heure du cri.', en: "Twenty to midnight... That's when the scream was." },
        { s: 'narr', fr: 'Le cri, la montre. La même [[heure|time]].', en: 'The scream, the watch. The same time.' },
      ],
    },
    wrong: [{ s: 'theo', fr: 'Je ne sais pas, inspecteur. Moi, je sers des cafés.', en: "I don't know, inspector. I just serve coffee." }],
  },

  garnier: {
    first: [
      { s: 'garnier', fr: 'C\'est moi qui vous ai [[conduit|driven]] ici ce matin, inspecteur.', en: 'I was the one who drove you here this morning, inspector.' },
      { s: 'garnier', fr: 'Quelle histoire... Une femme si [[gentille|kind]].', en: 'What a thing... Such a kind woman.' },
    ],
    greet: [{ s: 'garnier', fr: 'Le prochain bus part dans une heure.', en: 'The next bus leaves in an hour.' }],
    topics: [
      {
        id: 'soir', q: 'Vous étiez ici hier soir ?', en: 'Were you here last night?',
        lines: [
          { s: 'garnier', fr: 'Oui. Le [[dernier|last]] bus part à vingt-trois heures trente. J\'ai [[attendu|waited]] cinq minutes. Personne.', en: 'Yes. The last bus leaves at half past eleven. I waited five minutes. Nobody.' },
          { s: 'garnier', fr: 'Mais il y avait un homme sur la [[place|square]], près de la fontaine.', en: 'But there was a man in the square, near the fountain.' },
          { s: 'garnier', fr: 'Le jardinier, Lebrun. Il avait l\'air [[nerveux|nervous]].', en: 'The gardener, Lebrun. He looked nervous.', record: 'garnier_vu' },
        ],
      },
      {
        id: 'victime', q: 'Vous connaissiez la victime ?', en: 'Did you know the victim?',
        lines: [
          { s: 'garnier', fr: 'Tout le monde connaissait Hélène. Elle donnait des [[médicaments|medicine]] aux vieux, même sans argent.', en: 'Everyone knew Hélène. She gave medicine to old people, even without money.' },
          { s: 'garnier', fr: 'Une femme bien. Trop bien pour cette ville.', en: 'A good woman. Too good for this town.' },
        ],
      },
    ],
    wrong: [{ s: 'garnier', fr: 'Moi, je [[conduis|drive]] le bus. Je ne suis pas détective.', en: "I drive the bus. I'm not a detective." }],
  },

  delacroix: {
    first: [
      { s: 'delacroix', fr: 'Inspecteur. Je suis Delacroix, le [[maire|mayor]].', en: "Inspector. I'm Delacroix, the mayor." },
      { s: 'delacroix', fr: 'C\'est une tragédie. Mais c\'est un accident. Le brigadier est d\'accord.', en: "It's a tragedy. But it's an accident. The sergeant agrees." },
      { s: 'delacroix', fr: 'La [[fête|festival]] de la Toussaint est demain. Je ne veux pas de [[scandale|scandal]]. Vous comprenez ?', en: "The All Saints' festival is tomorrow. I don't want a scandal. You understand?" },
    ],
    greet: [{ s: 'delacroix', fr: 'J\'ai beaucoup de travail, inspecteur.', en: 'I have a lot of work, inspector.' }],
    topics: [
      {
        id: 'victime', q: 'Vous connaissiez Hélène Marchand ?', en: 'Did you know Hélène Marchand?',
        lines: [
          { s: 'delacroix', fr: 'Bien sûr. Elle était... [[difficile|difficult]].', en: 'Of course. She was... difficult.' },
          { s: 'delacroix', fr: 'Elle était contre la [[vente|sale]] du parc. Elle a écrit au journal. Elle a parlé à tout le monde.', en: 'She was against the sale of the park. She wrote to the newspaper. She talked to everyone.', record: 'maire_parc' },
        ],
      },
      {
        id: 'soir', q: 'Où étiez-vous hier soir ?', en: 'Where were you last night?',
        lines: [
          { s: 'delacroix', fr: 'Pardon ? Vous m\'[[accusez|accuse]] ?', en: 'Excuse me? Are you accusing me?' },
          { s: 'delacroix', fr: 'J\'étais à la mairie jusqu\'à vingt-deux heures. Puis chez moi, avec ma [[femme|wife]].', en: 'I was at the town hall until ten. Then at home, with my wife.', record: 'maire_alibi' },
        ],
      },
      {
        id: 'parc', q: 'Pourquoi vendre le parc ?', en: 'Why sell the park?', requires: ['maire_parc'],
        lines: [
          { s: 'delacroix', fr: 'Belleville n\'a pas d\'argent, inspecteur. Un [[promoteur|developer]] veut construire des [[appartements|flats]].', en: 'Belleville has no money, inspector. A developer wants to build flats.' },
          { s: 'delacroix', fr: 'C\'est l\'[[avenir|future]]. Hélène vivait dans le passé.', en: 'It is the future. Hélène lived in the past.' },
        ],
      },
    ],
    evidence: {
      echarpe: [
        { s: 'delacroix', fr: 'Une écharpe rouge ? Beaucoup de femmes portent du rouge, inspecteur.', en: 'A red scarf? Lots of women wear red, inspector.' },
        { s: 'narr', fr: 'Mais ses yeux vont vers l\'école.', en: 'But his eyes go towards the school.' },
      ],
    },
    wrong: [{ s: 'delacroix', fr: 'Je n\'ai pas de temps pour ça.', en: "I don't have time for this." }],
  },

  claire: {
    first: [
      { s: 'claire', fr: 'Laissez-moi [[tranquille|alone]].', en: 'Leave me alone.' },
      { s: 'narr', fr: 'Ses yeux sont rouges. Elle ne porte pas d\'[[écharpe|scarf]]. Malgré le froid.', en: "Her eyes are red. She isn't wearing a scarf. Despite the cold." },
      { s: 'claire', fr: 'Hélène était ma [[sœur|sister]]. Nous ne nous parlions plus depuis dix ans.', en: "Hélène was my sister. We hadn't spoken for ten years." },
    ],
    greet: [{ s: 'claire', fr: 'Encore vous.', en: 'You again.' }],
    topics: [
      {
        id: 'soir', q: 'Où étiez-vous hier soir ?', en: 'Where were you last night?',
        lines: [
          { s: 'claire', fr: 'À l\'école. Je [[corrigeais|was marking]] des cahiers. Seule.', en: 'At the school. I was marking exercise books. Alone.' },
          { s: 'claire', fr: 'Non, personne ne peut le [[confirmer|confirm]].', en: 'No, nobody can confirm it.', record: 'claire_ecole' },
        ],
      },
      {
        id: 'pourquoi', q: 'Pourquoi ne parliez-vous plus à votre sœur ?', en: "Why didn't you speak to your sister any more?",
        lines: [
          { s: 'claire', fr: 'Ça ne vous [[regarde|concern]] pas.', en: 'That is none of your business.' },
          { s: 'narr', fr: 'Dix ans de [[silence|silence]]. Et hier soir ?', en: 'Ten years of silence. And last night?' },
        ],
      },
    ],
    evidence: {
      echarpe: [
        { s: 'you', fr: 'Cette écharpe était près de la fontaine.', en: 'This scarf was near the fountain.' },
        { s: 'claire', fr: '...', en: '...' },
        { s: 'claire', fr: 'Elle est à moi. Mais je l\'ai [[perdue|lost]] la semaine dernière.', en: 'It is mine. But I lost it last week.', record: 'claire_echarpe' },
        { s: 'narr', fr: 'Elle [[ment|is lying]]. Ou elle a peur.', en: "She's lying. Or she's afraid." },
      ],
    },
    wrong: [{ s: 'claire', fr: 'Je n\'ai rien à vous dire.', en: 'I have nothing to say to you.' }],
  },

  roux: {
    first: [
      { s: 'roux', fr: 'Bonjour, inspecteur. Un [[croissant|croissant]] ? Il est [[chaud|hot]].', en: "Morning, inspector. A croissant? It's hot." },
      { s: 'roux', fr: 'Ici, les [[nouvelles|news]] vont vite. Tout le monde parle déjà d\'Hélène.', en: 'News travels fast here. Everyone is already talking about Hélène.' },
    ],
    greet: [{ s: 'roux', fr: 'Il vous faut autre chose ?', en: 'Do you need anything else?' }],
    topics: [
      {
        id: 'rumeurs', q: 'Qu\'est-ce que les gens disent ?', en: 'What are people saying?',
        lines: [
          { s: 'roux', fr: 'Ils disent que ce n\'est pas un accident.', en: "They say it isn't an accident." },
          { s: 'roux', fr: 'Hélène était pharmacienne. Elle savait qui prenait quels médicaments. Elle connaissait les [[secrets|secrets]] de tout le monde.', en: "Hélène was a pharmacist. She knew who took what medicine. She knew everyone's secrets." },
        ],
      },
      {
        id: 'victime', q: 'Vous connaissiez bien Hélène ?', en: 'Did you know Hélène well?',
        lines: [
          { s: 'roux', fr: 'Elle m\'a [[prêté|lent]] de l\'argent l\'année dernière. Je ne l\'ai pas encore [[rendu|paid back]]...', en: "She lent me money last year. I haven't paid it back yet...", record: 'roux_dette' },
          { s: 'roux', fr: 'Mais je ne l\'ai pas [[tuée|killed]], si c\'est votre question !', en: "But I didn't kill her, if that's your question!" },
        ],
      },
    ],
    wrong: [{ s: 'roux', fr: 'Moi, je fais du pain, inspecteur.', en: 'I make bread, inspector.' }],
  },
};
