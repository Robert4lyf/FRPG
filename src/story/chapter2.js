// Chapitre 2 — La nuit du crime
//
// 1 November, la Toussaint. The mayor keeps his lantern festival. Sacha rebuilds the night of
// 30 October minute by minute: Maud was the woman at the fountain, the mayor lied about his
// alibi, Inès's flat was searched before him, and her father's death fifteen years ago was
// never solved. Ferhat says the bus was still in the square when Inès screamed; Lacombe says
// he had already left. (The answer, for later chapters: Lacombe.)
//
// Grammar: imparfait (background, what was going on) vs passé composé (what happened).
// Same line format as chapter1.js. Statements carry a time `t` for the Carnet's timeline.

export const CHAPTER2 = {
  id: 'ch2',
  title: 'Chapitre 2 — La nuit du crime',
  titleEn: 'Chapter 2 — The Night of the Crime',
  playerStart: { x: 16, y: 9 },
};

// New people this chapter (same fields as chapter1 CAST).
export const CAST2 = {
  mmedelacroix: { name: 'Mme Delorme', role: 'la femme du maire' },
};

// Where everyone stands on the evening of the festival (street tiles).
export const PLACES2 = {
  dubois: { x: 23, y: 16 },
  theo: { x: 3, y: 3, room: 'cafe' },
  roux: { x: 6, y: 13 },
  delacroix: { x: 24, y: 7 },
  mmedelacroix: { x: 28, y: 9 },
  // At the gate until Sacha has found her father's grave; then beside it.
  claire: [{ x: 55, y: 15, if: ['tombe'] }, { x: 51, y: 17 }],
  lebrun: { x: 36, y: 12 },
  garnier: { x: 22, y: 26 },
};

export const CLUES2 = {
  enveloppe: {
    name: "L'enveloppe de Lyon", en: 'The envelope from Lyon', x: 5, y: 4, room: 'appart', requires: ['claire_keys'],
    note: { fr: 'Une enveloppe déchirée. « Laboratoire de toxicologie, Lyon ». La lettre a disparu.', en: 'A torn envelope. "Toxicology laboratory, Lyon". The letter has gone.' },
    lines: [
      { s: 'narr', fr: 'Sur la table, une enveloppe [[déchirée|torn]] : « Laboratoire de [[toxicologie|toxicology]], Lyon ».', en: 'On the table, a torn envelope: "Toxicology laboratory, Lyon".' },
      { s: 'narr', fr: "Elle est vide. La lettre qui a fait pleurer Inès a [[disparu|disappeared]].", en: 'It is empty. The letter that made Inès cry has disappeared.' },
    ],
  },
  chemise: {
    name: 'La chemise vide', en: 'The empty folder', x: 6, y: 5, room: 'appart', requires: ['claire_keys'],
    note: { fr: 'Une chemise en carton : « T. Ferreira — 2011 ». Vide.', en: 'A cardboard folder: "T. Ferreira — 2011". Empty.' },
    lines: [
      { s: 'narr', fr: "Par terre, une [[chemise|folder]] en carton. Dessus, l'écriture d'Inès : « T. Ferreira — 2011 ».", en: 'On the floor, a cardboard folder. On it, in Inès\'s writing: "T. Ferreira — 2011".' },
      { s: 'narr', fr: "Le dossier de son père. Elle le portait dans le bus de Lacombe, la semaine dernière.", en: "Her father's file. She was carrying it on Lacombe's bus last week." },
      { s: 'narr', fr: "Il est vide. Quelqu'un a pris les papiers. Pourquoi ?", en: 'It is empty. Someone took the papers. Why?' },
    ],
  },
  repondeur: {
    name: "Le répondeur d'Inès", en: "Inès's answering machine", x: 2, y: 3, room: 'appart', requires: ['claire_keys'],
    note: { fr: 'Le labo de Lyon voulait voir Inès le 31 octobre, à 9 h 15. Le lendemain de sa mort.', en: 'The Lyon lab wanted to see Inès on 31 October, at 9:15. The day after her death.' },
    lines: [
      { s: 'narr', fr: 'Le trente et un octobre, à neuf heures et quart. Le [[lendemain|day after]] de sa mort.', en: 'The thirty-first of October, at a quarter past nine. The day after her death.' },
      { s: 'narr', fr: "Inès allait apprendre quelque chose à Lyon. Quelqu'un ne voulait pas qu'elle y aille.", en: "Inès was going to find something out in Lyon. Someone didn't want her to go." },
    ],
    puzzle: {
      before: [
        { s: 'narr', fr: 'Sur la commode, un vieux [[répondeur|answering machine]]. Une petite lumière rouge [[clignote|is blinking]].', en: 'On the chest of drawers, an old answering machine. A little red light is blinking.' },
        { s: 'narr', fr: "Trois messages. Personne ne les a [[écoutés|listened to]].", en: 'Three messages. Nobody has listened to them.' },
      ],
      title: "LE RÉPONDEUR D'INÈS", heading: 'Trois messages',
      sub: { fr: "Touchez un message pour l'écouter.", en: 'Tap a message to listen to it.' },
      items: [
        { label: 'Message 1', speak: true, hidden: true, fr: "Bonjour Inès, c'est Mme Pellegrin. Tu as oublié ta baguette ! Je te la garde pour demain.", en: "Hello Inès, it's Mme Pellegrin. You forgot your baguette! I'm keeping it for you for tomorrow." },
        { label: 'Message 2', speak: true, hidden: true, fr: "Bonjour madame Ferreira, ici le laboratoire de Lyon. Nous avons les résultats pour le dossier de votre père. Rappelez-nous, s'il vous plaît.", en: "Hello Ms Ferreira, this is the Lyon laboratory. We have the results for your father's file. Please call us back." },
        { label: 'Message 3', speak: true, hidden: true, fr: "Madame Ferreira, c'est encore le laboratoire. Le docteur Morel peut vous recevoir le trente et un octobre, à neuf heures et quart. Au revoir.", en: "Ms Ferreira, it's the laboratory again. Dr Morel can see you on the thirty-first of October, at a quarter past nine. Goodbye." },
      ],
      question: { fr: 'Le laboratoire veut voir Inès quand ?', en: 'When does the laboratory want to see Inès?' },
      options: ['Le 21 octobre, à 9 h 15', 'Le 31 octobre, à 9 h 15', 'Le 31 octobre, à 9 h 45', 'Le 30 octobre, à 18 h'],
      answer: 1,
      wrong: { fr: 'Non. Écoutez encore le troisième message : le jour, puis l\'heure.', en: 'No. Listen to the third message again: the day, then the time.' },
      later: [{ s: 'narr', fr: 'Je reviendrai écouter ces messages.', en: "I'll come back and listen to these messages." }],
    },
  },
  tombe: {
    name: 'La tombe de Tiago Ferreira', en: "Tiago Ferreira's grave", x: 54, y: 16,
    note: { fr: 'Tiago Ferreira, 1959-2011. Mort sur la route de Lyon.', en: 'Tiago Ferreira, 1959-2011. Died on the Lyon road.' },
    lines: [
      { s: 'narr', fr: '« Tiago Ferreira, 1959-2011. »', en: '"Tiago Ferreira, 1959-2011."' },
      { s: 'narr', fr: "Le père d'Inès et de Maud. Il est mort l'année de mon [[départ|leaving]].", en: "Inès and Maud's father. He died the year I left." },
      { s: 'narr', fr: "Je ne suis pas venu à l'[[enterrement|funeral]]. Je faisais mes [[valises|suitcases]].", en: "I didn't come to the funeral. I was packing my suitcases." },
    ],
    // Four graves read "T. Ferreira": Mme Pellegrin's description (in words) says which.
    puzzle: {
      needs: 'pellegrin_tombe',
      blocked: [
        { s: 'narr', fr: "Ferreira... Ici, c'est un nom [[courant|common]]. Je compte quatre tombes « T. Ferreira ».", en: 'Ferreira... Round here, it\'s a common name. I count four graves marked "T. Ferreira".' },
        { s: 'narr', fr: 'Laquelle est celle de Tiago ? Mme Pellegrin connaît tout le monde à Belleville.', en: "Which one is Tiago's? Mme Pellegrin knows everyone in Belleville.", set: 'tombes_vues' },
      ],
      before: [{ s: 'narr', fr: 'Quatre tombes « T. Ferreira ». Je me souviens de ce que Mme Pellegrin m\'a dit.', en: 'Four graves marked "T. Ferreira". I remember what Mme Pellegrin told me.' }],
      title: 'LE CIMETIÈRE', heading: 'Quatre tombes « T. Ferreira »',
      sub: { fr: "Mme Pellegrin : « Il est mort en deux mille onze. Il avait cinquante-deux ans. Sa tombe est sous les cyprès. »", en: 'Mme Pellegrin: "He died in two thousand and eleven. He was fifty-two. His grave is under the cypress trees."' },
      question: { fr: 'Quelle est la tombe de Tiago ?', en: "Which is Tiago's grave?" },
      options: [
        '« T. Ferreira, 1931-2011 ». Sous les cyprès.',
        '« T. Ferreira, 1959-2001 ». Près du mur.',
        '« T. Ferreira, 1959-2011 ». Sous les cyprès.',
        '« T. Ferreira, 1962-2011 ». Près du mur.',
      ],
      answer: 2,
      wrong: { fr: "Non. Relisez Mme Pellegrin : l'année, l'âge, l'endroit.", en: 'No. Read Mme Pellegrin again: the year, the age, the place.' },
      later: [{ s: 'narr', fr: 'Je reviendrai.', en: "I'll come back." }],
    },
  },
  chrysanthemes: {
    name: 'Les chrysanthèmes', en: 'The chrysanthemums', x: 53, y: 16,
    note: { fr: 'Des fleurs fraîches sur la tombe de Tiago. Une carte : « Pardon. » Pas de nom.', en: 'Fresh flowers on Tiago\'s grave. A card: "Forgive me." No name.' },
    lines: [
      { s: 'narr', fr: 'Des [[chrysanthèmes|chrysanthemums]] blancs, tout frais. À la Toussaint, on [[fleurit|puts flowers on]] les tombes.', en: 'White chrysanthemums, very fresh. On All Saints\' Day, people put flowers on graves.' },
      { s: 'narr', fr: 'Une petite carte, [[mouillée|wet]] par la pluie. Un seul mot : « [[Pardon|Forgive me]]. »', en: 'A little card, wet from the rain. A single word: "Forgive me."' },
      { s: 'narr', fr: "Pas de nom. Quelqu'un demande pardon à un mort. Pour quoi ?", en: 'No name. Someone is asking a dead man for forgiveness. For what?' },
    ],
  },
};

// t: time on the night of 30 October ('16:00' = that afternoon, '00:00' = midnight).
export const STATEMENTS2 = {
  dubois_coup: { who: 'dubois', t: '23:40', fr: 'Un seul coup à la tête, vers 23 h 40.', en: 'A single blow to the head, around 23:40.' },
  roux_echarpe: { who: 'roux', t: '16:00', fr: "Le 30, l'après-midi, Maud portait son écharpe rouge.", en: 'On the 30th, in the afternoon, Maud was wearing her red scarf.' },
  claire_fontaine: { who: 'claire', t: '23:15', fr: "À 23 h 15, j'ai retrouvé Inès à la fontaine. Je suis partie à 23 h 35.", en: 'At 23:15, I met Inès at the fountain. I left at 23:35.' },
  mme_minuit: { who: 'mmedelacroix', t: '00:00', fr: 'Mon mari est rentré à minuit. Il était trempé.', en: 'My husband came home at midnight. He was soaked.' },
  maire_promoteur: { who: 'delacroix', t: '23:50', fr: "J'étais à la mairie avec le promoteur jusqu'à 23 h 50.", en: 'I was at the town hall with the developer until 23:50.' },
  theo_ferme: { who: 'theo', t: '23:00', fr: "À 23 h, j'ai fermé le café. Il pleuvait très fort.", en: 'At 23:00, I closed the café. It was raining very hard.' },
  garnier_parti: { who: 'garnier', t: '23:35', fr: "Je suis parti à 23 h 35. Personne n'est venu.", en: 'I left at 23:35. Nobody came.' },
  lebrun_bus: { who: 'lebrun', t: '23:40', fr: 'Au moment du cri, le bus était encore là. Phares éteints.', en: 'When the scream came, the bus was still there. Headlights off.' },
};

// Times for chapter 1 statements and clues, so they join the timeline.
export const TIMES1 = {
  garnier_vu: '23:30', theo_cri: '23:40', maire_alibi: '22:00', claire_ecole: '23:00', lebrun_dispute: '23:30', montre: '23:40',
};

// Pairs that can't both be true. Shown on the timeline (red until `resolved` is set);
// a toast when the second is found.
export const CONFLICTS = [
  { a: 'lebrun_maison', b: 'garnier_vu', resolved: 'lebrun_confessed', fr: 'Ferhat a menti : il était sur la place.', en: 'Ferhat lied: he was in the square.' },
  { a: 'claire_echarpe', b: 'roux_echarpe', resolved: 'claire_confessed', fr: "L'écharpe n'était pas perdue.", en: "The scarf wasn't lost." },
  { a: 'claire_ecole', b: 'claire_fontaine', resolved: 'claire_confessed', fr: "Maud n'était pas à l'école.", en: "Maud wasn't at the school." },
  { a: 'maire_alibi', b: 'mme_minuit', resolved: 'maire_confessed', fr: "Le maire n'était pas chez lui.", en: "The mayor wasn't at home." },
  { a: 'garnier_parti', b: 'lebrun_bus', fr: "Le bus était-il parti ? L'un des deux se trompe. Ou ment.", en: 'Had the bus left? One of them is wrong. Or lying.' },
];

// Narration the first time you walk into a room this chapter.
export const ENTER2 = {
  appart: [
      { s: 'narr', fr: "J'ouvre la porte avec les [[clés|keys]] de Maud. L'appartement sent le café froid.", en: "I open the door with Maud's keys. The flat smells of cold coffee." },
      { s: 'narr', fr: "Quelqu'un est venu ici avant moi. Les [[tiroirs|drawers]] sont ouverts, une chaise est renversée.", en: 'Someone came here before me. The drawers are open, a chair has been knocked over.' },
      { s: 'narr', fr: "Qu'est-ce qu'on [[cherchait|was looking for]], chez Inès ?", en: "What was someone looking for, at Inès's place?" },
  ],
};

export const MEMORIES2 = {
  cimetiere: {
    name: 'Le cimetière', x: 49, y: 17,
    lines: [
      { s: 'narr', fr: "Petits, on avait peur de ce cimetière. Inès, elle, n'avait jamais peur.", en: 'As kids, we were scared of this cemetery. Inès was never scared.' },
      { s: 'narr', fr: "Elle disait : « Les morts ne font pas de mal. Ce sont les [[vivants|living]]. »", en: 'She used to say: "The dead don\'t hurt anyone. It\'s the living."' },
    ],
  },
  bougies: {
    name: 'Les bougies', x: 21, y: 15,
    lines: [
      { s: 'narr', fr: "Des [[bougies|candles]] pour Inès, au bord de la fontaine. Toute la ville est passée ici aujourd'hui.", en: 'Candles for Inès, at the edge of the fountain. The whole town came by here today.' },
      { s: 'narr', fr: "Celui qui l'a tuée aussi, peut-être.", en: 'The one who killed her too, perhaps.' },
    ],
  },
  route: {
    name: 'La route de Lyon', x: 46, y: 26,
    lines: [
      { s: 'narr', fr: "La route de Lyon. Le soir de mon départ, il pleuvait aussi.", en: 'The Lyon road. The evening I left, it was raining too.' },
      { s: 'narr', fr: "Maud m'attendait à l'arrêt. Je suis monté dans le bus sans lui dire au revoir.", en: 'Maud was waiting for me at the stop. I got on the bus without saying goodbye to her.' },
      { s: 'narr', fr: "Lacombe conduisait. Il n'a rien dit pendant tout le [[trajet|journey]]. Ses mains [[tremblaient|were shaking]].", en: "Lacombe was driving. He didn't say anything for the whole journey. His hands were shaking." },
    ],
  },
};

export const INTRO2 = [
  { s: 'narr', fr: 'Le 1er novembre. La [[Toussaint|All Saints\' Day]].', en: "1 November. All Saints' Day." },
  { s: 'narr', fr: 'En France, ce jour-là, on pose des [[fleurs|flowers]] sur les tombes de nos morts.', en: 'In France, on that day, people put flowers on the graves of their dead.' },
  { s: 'narr', fr: "À Belleville, le maire a [[maintenu|kept on]] sa fête. Des [[lanternes|lanterns]] sur la place, comme si de rien n'était.", en: 'In Belleville, the mayor kept his festival. Lanterns in the square, as if nothing had happened.' },
  { s: 'narr', fr: "Moi, je ne pensais qu'à une chose : la nuit du crime.", en: 'I could only think about one thing: the night of the crime.' },
  { s: 'narr', fr: "Entre vingt-trois heures et minuit, qui était sur la place ? Et qui [[mentait|was lying]] ?", en: 'Between eleven and midnight, who was in the square? And who was lying?' },
];

export const OUTRO2 = [
  { s: 'narr', fr: 'Le soir même, la [[juge|judge]] Diallo est arrivée de Lyon.', en: 'That same evening, Judge Diallo arrived from Lyon.' },
  { s: 'narr', fr: "Elle a lu ma chronologie. Puis elle m'a posé une seule question.", en: 'She read my timeline. Then she asked me a single question.' },
  { s: 'narr', fr: '« Et vous, inspecteur Morvan ? Où étiez-vous à 23 h 40 ? »', en: '"And you, Inspector Morvan? Where were you at 23:40?"' },
  { s: 'narr', fr: "J'étais arrivé le soir du crime. Inès m'avait écrit. Je n'avais pas d'[[alibi|alibi]].", en: 'I had arrived the evening of the crime. Inès had written to me. I had no alibi.' },
  { s: 'narr', fr: 'Cette nuit-là, une [[pierre|stone]] a cassé la fenêtre de ma chambre.', en: 'That night, a stone broke the window of my room.' },
  { s: 'narr', fr: 'Autour de la pierre, un papier : « [[Rentre|Go back]] à Lyon. »', en: 'Around the stone, a piece of paper: "Go back to Lyon."' },
  { s: 'narr', fr: 'Je ne rentrerai pas.', en: "I won't go back." },
];

const has = (...ids) => (g) => ids.every((id) => g.has(id));

export const OBJECTIVES2 = [
  { fr: 'Parlez au brigadier Rouvière, près de la fontaine.', en: 'Talk to Sergeant Rouvière, near the fountain.', done: has('met2_dubois') },
  { fr: 'Qui était la femme de la fontaine ?', en: 'Who was the woman at the fountain?', done: has('claire_confessed') },
  { fr: "Vérifiez l'alibi du maire.", en: "Check the mayor's alibi.", done: has('maire_confessed') },
  { fr: "Fouillez l'appartement d'Inès, au-dessus de la pharmacie.", en: "Search Inès's flat, above the pharmacy.", done: has('enveloppe', 'chemise', 'repondeur') },
  { fr: "Allez au cimetière, à l'est du parc.", en: 'Go to the cemetery, east of the park.', done: has('tombe', 'chrysanthemes') },
  { fr: 'Montrez à Rouvière ce que vous avez trouvé chez Inès.', en: "Show Rouvière what you found at Inès's.", done: has('dubois_dossier') },
  { fr: 'Qui était sur la place au moment du cri ?', en: 'Who was in the square when the scream came?', done: has('lebrun_bus', 'garnier_parti') },
  { fr: 'Retournez voir Rouvière.', en: 'Go back to Rouvière.', done: has('ch2_done') },
  { fr: 'Écrivez la chronologie.', en: 'Write the timeline.', done: has('ch2_report_done') },
  { fr: 'Fin du chapitre 2. Belleville vous attend.', en: 'End of chapter 2. Belleville is waiting.', done: () => false },
];

const FIN = ['claire_fontaine', 'mme_minuit', 'enveloppe', 'tombe', 'dubois_dossier', 'lebrun_bus', 'garnier_parti'];

export const DIALOGUE2 = {
  dubois: {
    first: [
      { s: 'dubois', fr: 'Sacha. Le rapport du [[médecin légiste|coroner]] est arrivé.', en: "Sacha. The coroner's report has arrived." },
      { s: 'dubois', fr: 'Un seul [[coup|blow]] à la tête, avec un objet [[lourd|heavy]]. Vers vingt-trois heures quarante.', en: 'A single blow to the head, with a heavy object. Around twenty to midnight.', record: 'dubois_coup' },
      { s: 'you', fr: "Et l'objet ?", en: 'And the object?' },
      { s: 'dubois', fr: "On ne l'a pas trouvé. La pluie a tout [[effacé|washed away]].", en: "We haven't found it. The rain washed everything away." },
      { s: 'narr', fr: 'Il m\'appelle Sacha, maintenant. Mais il me dit toujours « vous ».', en: 'He calls me Sacha now. But he still says "vous" to me.' },
      { s: 'dubois', fr: "La juge veut savoir ce qui s'est passé cette nuit-là. Minute par minute.", en: 'The judge wants to know what happened that night. Minute by minute.' },
      { s: 'dubois', fr: 'Qui était où. Qui faisait quoi. Notez tout dans votre [[carnet|notebook]].', en: 'Who was where. Who was doing what. Write it all in your notebook.', set: 'timeline_open' },
      { s: 'narr', fr: 'Une [[chronologie|timeline]]. Entre vingt-trois heures et minuit, quelqu\'un ment encore.', en: 'A timeline. Between eleven and midnight, someone is still lying.' },
    ],
    greet: [{ s: 'dubois', fr: 'Alors, cette chronologie ?', en: 'So, this timeline?' }],
    topics: [
      {
        id: 'fete', q: 'Pourquoi le maire a maintenu la fête ?', en: 'Why did the mayor keep the festival?',
        lines: [
          { s: 'dubois', fr: "Pour les [[touristes|tourists]]. Pour l'argent. Pour faire comme si tout allait bien.", en: 'For the tourists. For the money. To act as if everything was fine.' },
          { s: 'narr', fr: 'Les lanternes brillaient sur la place. Inès était morte depuis un jour.', en: 'The lanterns were shining in the square. Inès had been dead for a day.' },
        ],
      },
      {
        id: 'marchand', q: "Qu'est-ce qui est arrivé à Tiago Ferreira, il y a quinze ans ?", en: 'What happened to Tiago Ferreira fifteen years ago?', requires: ['tombe'],
        lines: [
          { s: 'dubois', e: 'hostile', fr: "Un accident. La nuit, sur la route de Lyon. Une voiture l'a [[renversé|knocked down]].", en: 'An accident. At night, on the Lyon road. A car knocked him down.' },
          { s: 'you', fr: 'Et le [[chauffeur|driver]] ?', en: 'And the driver?' },
          { s: 'dubois', fr: "On ne l'a jamais trouvé. J'ai [[classé|closed]] le dossier.", en: 'He was never found. I closed the file.' },
          { s: 'narr', fr: 'Il a dit « j\'ai classé ». Pas « on a classé ».', en: 'He said "I closed". Not "we closed".' },
        ],
      },
      {
        id: 'fin', q: "J'ai fini la chronologie.", en: "I've finished the timeline.", requires: FIN, end: true,
        lines: [
          { s: 'dubois', fr: 'Bien. La juge arrive ce soir, de Lyon. Écrivez-la au propre.', en: 'Good. The judge arrives tonight, from Lyon. Write it up properly.', set: 'ch2_done' },
        ],
      },
    ],
    evidence: {
      enveloppe: 'dossier',
      chemise: 'dossier',
      claire_fontaine: [
        { s: 'dubois', fr: "Maud... Faites attention, Sacha. Avec elle, vous n'êtes pas [[objectif|objective]].", en: "Maud... Be careful, Sacha. With her, you aren't objective." },
      ],
      mme_minuit: [{ s: 'dubois', fr: 'Le maire a menti ? Ça ne m\'[[étonne|surprises]] pas.', en: "The mayor lied? That doesn't surprise me." }],
      lebrun_bus: [{ s: 'dubois', fr: "Ferhat a déjà menti une fois. Mais bon. Notez-le.", en: 'Ferhat has already lied once. But still. Write it down.' }],
    },
    shared: {
      dossier: [
        { s: 'dubois', e: 'shaken', fr: 'Un laboratoire de Lyon... de toxicologie.', en: 'A laboratory in Lyon... toxicology.' },
        { s: 'you', fr: 'Et chez elle, une chemise vide : « T. Ferreira — 2011 ».', en: 'And at her place, an empty folder: "T. Ferreira — 2011".' },
        { s: 'dubois', e: 'shaken', fr: 'Le dossier de son père.', en: "Her father's file." },
        { s: 'dubois', e: 'hostile', fr: 'Écoutez-moi, Sacha. Laissez les morts [[tranquilles|in peace]].', en: 'Listen to me, Sacha. Leave the dead in peace.', set: 'dubois_dossier' },
        { s: 'narr', fr: 'Ses mains tremblaient. Il avait peur. Mais de quoi ?', en: 'His hands were shaking. He was afraid. But of what?' },
      ],
    },
    wrong: [{ s: 'dubois', fr: 'Ça ne m\'aide pas.', en: "That doesn't help me." }],
  },

  roux: {
    first: [
      { s: 'roux', e: 'shaken', fr: "Sacha, mon petit... Tu as mangé ? Non, tu n'as pas mangé.", en: "Sacha, my little one... Have you eaten? No, you haven't eaten." },
      { s: 'roux', fr: 'À la Toussaint, on pense à nos morts. Moi, je pense à Inès.', en: "At All Saints', we think of our dead. I'm thinking of Inès." },
    ],
    greet: [{ s: 'roux', fr: 'Encore toi ! Tu veux une [[brioche|brioche]] ?', en: 'You again! Do you want a brioche?' }],
    topics: [
      {
        id: 'apresmidi', q: 'Tu as vu Inès, le 30 octobre ?', en: 'Did you see Inès on 30 October?',
        lines: [
          { s: 'roux', fr: "Oui, l'après-midi. Elle achetait son pain. Elle était [[pâle|pale]].", en: 'Yes, in the afternoon. She was buying her bread. She was pale.' },
          { s: 'roux', fr: 'Et Maud était là aussi, devant la boulangerie. Elle attendait sa sœur.', en: 'And Maud was there too, outside the bakery. She was waiting for her sister.' },
          { s: 'roux', fr: 'Elle portait son écharpe rouge, la belle. Il faisait froid.', en: 'She was wearing her red scarf, the nice one. It was cold.', record: 'roux_echarpe' },
          { s: 'narr', fr: '« Perdue la semaine dernière », a dit Maud.', en: '"Lost last week," Maud said.', if: 'claire_echarpe' },
          { s: 'narr', fr: "L'écharpe rouge, près de la fontaine. C'était donc celle de Maud.", en: 'The red scarf, near the fountain. So it was Maud\'s.', unless: 'claire_echarpe' },
        ],
      },
      {
        id: 'marchand', q: 'Tu te souviens de Tiago Ferreira ?', en: 'Do you remember Tiago Ferreira?',
        lines: [
          { s: 'roux', fr: "Le père d'Inès et de Maud ? Bien sûr. Il était [[facteur|postman]]. Un homme gentil.", en: "Inès and Maud's father? Of course. He was a postman. A kind man." },
          { s: 'roux', e: 'shaken', fr: "Une voiture l'a tué, la nuit. Le chauffeur ne s'est pas [[arrêté|stopped]].", en: "A car killed him, at night. The driver didn't stop." },
          { s: 'roux', fr: 'Et toi, tu es parti à Lyon juste après. Tu te souviens ?', en: 'And you left for Lyon just after. Do you remember?' },
          { s: 'narr', fr: 'Je me souviens. Je ne voulais pas me souvenir.', en: "I remember. I didn't want to remember." },
        ],
      },
      {
        id: 'tombe', q: 'Où est la tombe de Tiago ?', en: "Where is Tiago's grave?", requires: ['tombes_vues'],
        lines: [
          { s: 'roux', fr: 'Il y a beaucoup de Ferreira, là-bas. Notre Tiago est mort en deux mille onze.', en: 'There are lots of Ferreiras over there. Our Tiago died in two thousand and eleven.' },
          { s: 'roux', e: 'shaken', fr: 'Il avait cinquante-deux ans. Ce n\'est pas un âge pour mourir.', en: "He was fifty-two. That's no age to die." },
          { s: 'roux', fr: 'Sa tombe est sous les [[cyprès|cypress trees]]. J\'y vais à chaque Toussaint.', en: 'His grave is under the cypress trees. I go there every All Saints\'.', set: 'pellegrin_tombe' },
        ],
      },
    ],
    evidence: {
      claire_echarpe: [
        { s: 'roux', fr: "Perdue ? Non, non. Elle la portait le 30, l'après-midi. J'en suis sûre.", en: "Lost? No, no. She was wearing it on the 30th, in the afternoon. I'm sure of it.", record: 'roux_echarpe' },
      ],
      echarpe: [
        { s: 'roux', fr: "L'écharpe de Maud ! Elle la portait le 30, l'après-midi.", en: "Maud's scarf! She was wearing it on the 30th, in the afternoon.", record: 'roux_echarpe' },
      ],
    },
    wrong: [{ s: 'roux', fr: 'Moi, je fais du pain, mon chéri.', en: 'I make bread, sweetheart.' }],
  },

  claire: {
    first: [
      { s: 'narr', fr: 'Maud est debout devant une [[tombe|grave]]. Elle ne se retourne pas.', en: "Maud is standing in front of a grave. She doesn't turn round.", if: 'tombe' },
      { s: 'narr', fr: "Maud est à l'entrée du cimetière, sous la pluie. Elle ne se retourne pas.", en: "Maud is at the entrance to the cemetery, in the rain. She doesn't turn round.", unless: 'tombe' },
      { s: 'claire', e: 'hostile', fr: 'Vous me [[suivez|follow]], maintenant ?', en: 'You follow me now?' },
      { s: 'you', fr: 'Je cherche la vérité, Maud.', en: "I'm looking for the truth, Maud." },
      { s: 'claire', fr: "C'est mon père. Tiago Ferreira. Vous vous souvenez de lui ?", en: 'This is my father. Tiago Ferreira. Do you remember him?', if: 'tombe' },
      { s: 'claire', fr: "Mon père est [[enterré|buried]] ici. Tiago Ferreira. Vous vous souvenez de lui ?", en: 'My father is buried here. Tiago Ferreira. Do you remember him?', unless: 'tombe' },
      { s: 'you', fr: 'Il réparait nos vélos.', en: 'He used to fix our bikes.' },
      { s: 'claire', e: 'shaken', fr: 'Oui. Il réparait tout.', en: 'Yes. He used to fix everything.' },
    ],
    greet: [{ s: 'claire', fr: 'Sacha.', en: 'Sacha.' }],
    topics: [
      {
        id: 'soir', q: 'Où étais-tu le 30 octobre, à 23 h ?', en: 'Where were you on 30 October at 11 pm?',
        lines: [
          { s: 'claire', e: 'hostile', fr: "Je vous l'ai dit. À l'école. Je [[corrigeais|was marking]] des cahiers.", en: 'I told you. At the school. I was marking exercise books.', if: 'claire_ecole' },
          { s: 'claire', e: 'hostile', fr: "À l'école. Je [[corrigeais|was marking]] des cahiers. Seule.", en: 'At the school. I was marking exercise books. Alone.', unless: 'claire_ecole', record: 'claire_ecole' },
          { s: 'narr', fr: 'Elle regarde la tombe, pas moi.', en: 'She looks at the grave, not at me.', if: 'tombe' },
          { s: 'narr', fr: 'Elle regarde les tombes, pas moi.', en: 'She looks at the graves, not at me.', unless: 'tombe' },
        ],
      },
      {
        id: 'pere', q: 'Comment ton père est-il mort ?', en: 'How did your father die?',
        lines: [
          { s: 'claire', fr: 'Sur la route de Lyon. Il rentrait à vélo. Il pleuvait.', en: 'On the Lyon road. He was cycling home. It was raining.' },
          { s: 'claire', fr: "Une voiture ne s'est pas arrêtée. Rouvière n'a jamais trouvé personne.", en: "A car didn't stop. Rouvière never found anyone." },
          { s: 'claire', e: 'hostile', fr: 'Et vous, vous êtes parti un mois après. Sans un mot.', en: 'And you left a month later. Without a word.' },
        ],
      },
      {
        id: 'mensonge', q: "Pourquoi tu m'as menti ?", en: 'Why did you lie to me?', requires: ['claire_confessed'],
        lines: [
          { s: 'claire', e: 'shaken', fr: "Parce que la dernière fois que j'ai vu ma sœur, je lui ai crié dessus.", en: 'Because the last time I saw my sister, I shouted at her.' },
          { s: 'claire', fr: 'Et maintenant, elle est morte. Et je ne peux plus lui dire pardon.', en: "And now she's dead. And I can't say sorry to her any more." },
        ],
      },
    ],
    evidence: {
      roux_echarpe: [
        { s: 'claire', fr: '...', en: '...' },
        { s: 'claire', e: 'shaken', fr: "D'accord. Je n'étais pas à l'école.", en: "All right. I wasn't at the school.", if: 'claire_ecole' },
        { s: 'claire', e: 'shaken', fr: "D'accord. L'écharpe est à moi. Et je ne l'avais pas perdue.", en: "All right. The scarf is mine. And I hadn't lost it.", unless: 'claire_ecole' },
        { s: 'claire', fr: "Inès m'a appelée ce soir-là. Après dix ans de silence. Elle voulait me voir à la fontaine, à 23 h 15.", en: 'Inès called me that evening. After ten years of silence. She wanted to see me at the fountain, at 23:15.' },
        { s: 'claire', fr: "Elle disait que l'accident de papa n'était pas un accident. Qu'elle avait des [[preuves|proof]].", en: "She said Dad's accident wasn't an accident. That she had proof." },
        { s: 'claire', e: 'hostile', fr: "Je ne voulais pas entendre ça. Pas encore. On s'est [[disputées|argued]]. J'ai crié.", en: "I didn't want to hear that. Not again. We argued. I shouted." },
        { s: 'claire', fr: "J'ai jeté mon écharpe. Je suis partie à 23 h 35. Elle était [[vivante|alive]], Sacha. Je te le jure.", en: 'I threw my scarf down. I left at 23:35. She was alive, Sacha. I swear it.', record: 'claire_fontaine', set: 'claire_confessed' },
        { s: 'narr', fr: 'Elle me dit « tu » de nouveau.', en: 'She says "tu" to me again.' },
        { s: 'claire', fr: 'Tiens. Les clés de chez elle. Elle habitait au-dessus de la pharmacie.', en: 'Here. The keys to her place. She lived above the pharmacy.', set: 'claire_keys' },
        { s: 'claire', fr: 'Moi, je ne peux pas entrer là-bas.', en: "I can't go in there." },
        { s: 'claire', fr: 'Reste un peu, Sacha. Pour les lanternes, ce soir.', en: 'Stay a little while, Sacha. For the lanterns, tonight.' },
        { s: 'you', fr: 'Je reste.', en: "I'm staying." },
        { s: 'claire', fr: "Pour l'enquête, bien sûr.", en: 'For the investigation, of course.' },
        { s: 'narr', fr: 'Bien sûr.', en: 'Of course.' },
      ],
      enveloppe: [
        { s: 'claire', e: 'shaken', fr: 'Un laboratoire ? Alors elle avait raison...', en: 'A laboratory? So she was right...' },
        { s: 'claire', fr: "Elle parlait d'une [[ordonnance|prescription]]. D'un nom sur une ordonnance. Elle ne m'a pas dit le nom.", en: "She talked about a prescription. A name on a prescription. She didn't tell me the name." },
      ],
      chrysanthemes: [
        { s: 'claire', fr: "Ces fleurs ? Elles n'étaient pas là ce matin.", en: "These flowers? They weren't here this morning." },
        { s: 'claire', e: 'hostile', fr: '« Pardon »... Qui ose écrire ça à mon père ?', en: '"Forgive me"... Who dares write that to my father?' },
      ],
    },
    wrong: [{ s: 'claire', e: 'hostile', fr: 'Ça ne vous regarde pas.', en: 'That is none of your business.' }],
  },

  delacroix: {
    first: [
      { s: 'delacroix', fr: "Monsieur Morvan. Vous aimez notre fête ? Les lanternes, c'était une idée d'Inès, vous savez.", en: "Mr Morvan. Do you like our festival? The lanterns were Inès's idea, you know." },
      { s: 'narr', fr: 'Il a dit ça sans [[rougir|blushing]].', en: 'He said it without blushing.' },
      { s: 'delacroix', fr: 'La vie continue. Belleville continue.', en: 'Life goes on. Belleville goes on.' },
    ],
    greet: [{ s: 'delacroix', fr: 'Encore vous.', en: 'You again.' }],
    topics: [
      {
        id: 'soir', q: 'Où étiez-vous le 30 octobre, à 23 h 40 ?', en: 'Where were you on 30 October at 23:40?',
        lines: [
          { s: 'delacroix', e: 'hostile', fr: "Je vous l'ai déjà dit. Chez moi, avec ma femme. Demandez-lui.", en: 'I already told you. At home, with my wife. Ask her.', if: 'maire_alibi' },
          { s: 'delacroix', e: 'hostile', fr: "Chez moi, avec ma femme. Demandez-lui.", en: 'At home, with my wife. Ask her.', unless: 'maire_alibi', record: 'maire_alibi' },
          { s: 'narr', fr: 'Bonne idée.', en: 'Good idea.' },
        ],
      },
    ],
    evidence: {
      mme_minuit: [
        { s: 'delacroix', e: 'shaken', fr: 'Ma femme a dit ça ?', en: 'My wife said that?' },
        { s: 'delacroix', fr: "Bon. Très bien. J'étais à la mairie. Avec le [[promoteur|developer]].", en: 'Fine. Very well. I was at the town hall. With the developer.' },
        { s: 'delacroix', fr: "On signait les papiers du parc. En secret. Inès ne devait pas savoir.", en: "We were signing the papers for the park. In secret. Inès wasn't supposed to know." },
        { s: 'delacroix', fr: "Je n'ai pas quitté la mairie avant 23 h 50. Je vous le jure.", en: "I didn't leave the town hall before 23:50. I swear it.", record: 'maire_promoteur', set: 'maire_confessed' },
        { s: 'narr', fr: 'Il ment pour cacher un [[contrat|contract]]. Ou pour cacher autre chose.', en: 'He is lying to hide a contract. Or to hide something else.' },
        { s: 'delacroix', e: 'hostile', fr: 'Si vous racontez ça au journal, je vous [[détruis|destroy]].', en: 'If you tell the newspaper about this, I will destroy you.' },
      ],
    },
    wrong: [{ s: 'delacroix', fr: "Je n'ai pas de temps pour ça.", en: "I don't have time for this." }],
  },

  mmedelacroix: {
    first: [
      { s: 'mmedelacroix', fr: 'Le petit Morvan ? Vous avez beaucoup changé.', en: "Little Morvan? You've changed a lot." },
      { s: 'mmedelacroix', fr: 'Pauvre Inès. Elle venait souvent à la maison, avant. Avant le parc.', en: 'Poor Inès. She often came to the house, before. Before the park.' },
    ],
    greet: [{ s: 'mmedelacroix', fr: 'Inspecteur.', en: 'Inspector.' }],
    topics: [
      {
        id: 'mari', q: 'Votre mari était avec vous, le 30 octobre au soir ?', en: 'Was your husband with you on the evening of 30 October?',
        lines: [
          { s: 'mmedelacroix', fr: 'Avec moi ? Non. Il travaillait tard, comme toujours.', en: 'With me? No. He was working late, as always.' },
          { s: 'mmedelacroix', fr: "Il est rentré à minuit. Il était [[trempé|soaked]]. Il n'a rien dit.", en: "He came home at midnight. He was soaked. He didn't say anything.", record: 'mme_minuit' },
          { s: 'narr', fr: "Le maire a dit qu'il était chez lui, avec sa femme.", en: 'The mayor said he was at home, with his wife.', if: 'maire_alibi' },
        ],
      },
      {
        id: 'helene', q: 'Inès se disputait avec votre mari ?', en: 'Did Inès argue with your husband?',
        lines: [
          { s: 'mmedelacroix', fr: "Tout le monde se disputait avec Inès. Elle avait toujours raison. C'était [[fatigant|tiring]].", en: 'Everyone argued with Inès. She was always right. It was tiring.' },
          { s: 'mmedelacroix', fr: 'Mais elle était gentille avec moi. Elle me donnait mes [[médicaments|medicines]], et elle ne disait rien à personne.', en: 'But she was kind to me. She gave me my medicines, and she never told anyone anything.' },
          { s: 'narr', fr: 'Une pharmacienne connaît les secrets de toute la ville.', en: 'A pharmacist knows the whole town\'s secrets.' },
        ],
      },
    ],
    evidence: {
      maire_alibi: [
        { s: 'mmedelacroix', fr: 'Il a dit ça ? Il était avec moi ?', en: 'He said that? That he was with me?' },
        { s: 'mmedelacroix', fr: "Non, inspecteur. Il est rentré à minuit. Il était trempé.", en: 'No, Inspector. He came home at midnight. He was soaked.', record: 'mme_minuit' },
      ],
    },
    wrong: [{ s: 'mmedelacroix', fr: 'Je ne sais rien, inspecteur.', en: "I don't know anything, Inspector." }],
  },

  theo: {
    first: [
      { s: 'theo', fr: 'Sacha. Viens, je te sers un café. Tu as une tête de [[fantôme|ghost]].', en: 'Sacha. Come, I\'ll get you a coffee. You look like a ghost.' },
      { s: 'theo', fr: "Tout le monde fait la fête. Moi, j'ai pas le [[cœur|heart]] à ça.", en: "Everyone's celebrating. I don't have the heart." },
    ],
    greet: [{ s: 'theo', fr: 'Encore un café ?', en: 'Another coffee?' }],
    topics: [
      {
        id: 'soir', q: 'Raconte-moi ta soirée du 30, minute par minute.', en: 'Tell me about your evening on the 30th, minute by minute.',
        lines: [
          { s: 'theo', fr: "À 23 h, j'ai fermé le café. Il pleuvait très fort.", en: 'At 23:00, I closed the café. It was raining very hard.', record: 'theo_ferme' },
          { s: 'theo', fr: "Je faisais le ménage. La radio [[marchait|was on]]. Je n'entendais pas grand-chose.", en: "I was doing the cleaning. The radio was on. I couldn't hear much." },
          { s: 'theo', fr: 'Et puis, vers 23 h 40, le cri.', en: 'And then, around 23:40, the scream.' },
        ],
      },
      {
        id: 'pere', q: 'Inès te parlait de son père ?', en: 'Did Inès talk to you about her father?', requires: ['tombe'],
        lines: [
          { s: 'theo', fr: "Souvent, ces derniers temps. Elle disait que ce n'était pas un accident.", en: "Often, lately. She said it wasn't an accident." },
          { s: 'theo', fr: 'Elle allait à Lyon, elle revenait avec des papiers. Elle ne dormait plus.', en: "She would go to Lyon, she would come back with papers. She wasn't sleeping any more." },
          { s: 'theo', e: 'shaken', fr: "Je pensais qu'elle devenait [[folle|mad]]. Je ne l'ai pas [[crue|believed]].", en: "I thought she was going mad. I didn't believe her." },
        ],
      },
      {
        id: 'bus', q: 'Tu as entendu le bus partir, ce soir-là ?', en: 'Did you hear the bus leave that evening?', requires: ['garnier_parti'],
        lines: [
          { s: 'theo', fr: 'Le bus ? Avec la radio et la pluie... Non. Je ne sais pas.', en: "The bus? With the radio and the rain... No. I don't know." },
        ],
      },
    ],
    evidence: {},
    wrong: [{ s: 'theo', fr: 'Je sais pas, Sacha. Moi, je sers des cafés.', en: 'I dunno, Sacha. I just serve coffee.' }],
  },

  lebrun: {
    first: [
      { s: 'lebrun', e: 'shaken', fr: 'Le petit Morvan. Je vous dois des [[excuses|apologies]]. Pour hier.', en: 'Young Morvan. I owe you an apology. For yesterday.' },
      { s: 'lebrun', fr: "Je ne dors plus. Je vois Inès dans l'eau, chaque nuit.", en: "I don't sleep any more. I see Inès in the water, every night." },
    ],
    greet: [{ s: 'lebrun', fr: 'Oui ?', en: 'Yes?' }],
    topics: [
      {
        id: 'cri', q: 'Vous avez entendu le cri, n\'est-ce pas ?', en: "You heard the scream, didn't you?",
        lines: [
          { s: 'lebrun', e: 'shaken', fr: "... Oui. J'étais dans le parc. Je rentrais chez moi.", en: 'Yes. I was in the park. I was going home.' },
          { s: 'lebrun', fr: "Je n'ai pas couru vers elle. J'ai couru chez moi. Comme un [[lâche|coward]].", en: "I didn't run to her. I ran home. Like a coward." },
          { s: 'you', fr: "Qu'est-ce que vous avez vu, à ce moment-là ?", en: 'What did you see at that moment?' },
          { s: 'lebrun', fr: "La place était vide. Il n'y avait que le bus, encore à l'arrêt.", en: 'The square was empty. There was only the bus, still at the stop.' },
          { s: 'lebrun', fr: 'Le moteur [[tournait|was running]]. Mais les [[phares|headlights]] étaient éteints.', en: 'The engine was running. But the headlights were off.', record: 'lebrun_bus' },
          { s: 'narr', fr: 'Le bus était encore là au moment du cri.', en: 'The bus was still there when the scream came.' },
        ],
      },
      {
        id: 'femme', q: 'La femme de la fontaine, elle est partie quand ?', en: 'The woman at the fountain, when did she leave?',
        lines: [
          { s: 'lebrun', fr: "Juste avant moi. Elle est partie vers l'école. Elle pleurait.", en: 'Just before me. She went off towards the school. She was crying.' },
          { s: 'lebrun', fr: 'Inès est restée seule, assise au bord de la fontaine.', en: 'Inès stayed alone, sitting on the edge of the fountain.' },
        ],
      },
    ],
    evidence: {
      garnier_parti: [
        { s: 'lebrun', e: 'hostile', fr: "Parti à 23 h 35 ? Non. J'ai entendu le cri, et le bus était là. Je suis vieux, mais je ne suis pas [[aveugle|blind]].", en: "Left at 23:35? No. I heard the scream, and the bus was there. I'm old, but I'm not blind." },
      ],
    },
    wrong: [{ s: 'lebrun', fr: 'Je ne vois pas le [[rapport|connection]].', en: "I don't see the connection." }],
  },

  garnier: {
    first: [
      { s: 'garnier', fr: 'Ah, mon garçon. Triste Toussaint, hein ?', en: "Ah, my boy. A sad All Saints', eh?" },
      { s: 'garnier', fr: "J'ai posé des fleurs pour Inès, à la fontaine. Elle prenait mon bus depuis vingt ans.", en: 'I put flowers down for Inès, at the fountain. She had taken my bus for twenty years.' },
      { s: 'narr', fr: "Il a les yeux rouges. À cause du froid. Ou parce qu'il a pleuré.", en: "His eyes are red. From the cold, or he's been crying." },
    ],
    greet: [{ s: 'garnier', fr: 'Après la pluie, le beau temps. Un jour.', en: 'After the rain comes sunshine. One day.' }],
    topics: [
      {
        id: 'depart', q: 'Le 30 au soir, tu es parti à quelle heure, exactement ?', en: 'On the evening of the 30th, what time did you leave, exactly?',
        lines: [
          { s: 'garnier', fr: "À 23 h 35. J'ai attendu cinq minutes, personne n'est venu. Alors je suis parti.", en: 'At 23:35. I waited five minutes, nobody came. So I left.', record: 'garnier_parti' },
          { s: 'garnier', fr: "Un chauffeur, ça respecte l'[[horaire|timetable]], mon garçon.", en: 'A driver sticks to the timetable, my boy.' },
        ],
      },
      {
        id: 'marchand', q: "Tu te souviens de l'accident de Tiago Ferreira ?", en: "Do you remember Tiago Ferreira's accident?", requires: ['tombe'],
        lines: [
          { s: 'garnier', fr: 'Tiago... Oui. Terrible. Sur la route de Lyon, une nuit de pluie.', en: 'Tiago... Yes. Terrible. On the Lyon road, one rainy night.' },
          { s: 'garnier', fr: "Je l'ai vu sur la route ce soir-là, juste avant. Il roulait à vélo, sans [[lumière|light]].", en: 'I saw him on the road that evening, just before. He was cycling, without a light.' },
          { s: 'garnier', fr: "Je l'ai dit à Rouvière, à l'époque. Ça n'a servi à rien.", en: "I told Rouvière, at the time. It didn't help." },
          { s: 'narr', fr: 'Il se souvient de tout. Après quinze ans.', en: 'He remembers everything. After fifteen years.' },
        ],
      },
    ],
    evidence: {
      lebrun_bus: [
        { s: 'garnier', fr: 'Ferhat a dit ça ?', en: 'Ferhat said that?' },
        { s: 'garnier', fr: "Le pauvre homme. Hier, il a menti. Aujourd'hui, il se trompe. À son âge, on [[mélange|mixes up]] tout.", en: "The poor man. Yesterday, he lied. Today, he's mistaken. At his age, you mix everything up." },
        { s: 'garnier', fr: "Moi, à 23 h 40, j'étais sur la route de Lyon. Demande au [[dépôt|depot]], mon garçon.", en: 'Me, at 23:40, I was on the Lyon road. Ask at the depot, my boy.' },
        { s: 'narr', fr: 'Il souriait. Ses mains, elles, serraient sa [[casquette|cap]].', en: 'He was smiling. His hands, though, were gripping his cap.' },
      ],
      chrysanthemes: [
        { s: 'garnier', fr: "Des fleurs sur la tombe de Tiago ? C'est gentil. Mais ce n'est pas moi, mon garçon.", en: "Flowers on Tiago's grave? That's kind. But it wasn't me, my boy." },
      ],
    },
    wrong: [{ s: 'garnier', fr: 'Moi, je [[conduis|drive]] le bus, mon garçon. Je ne suis pas détective.', en: "I drive the bus, my boy. I'm not a detective." }],
  },
};

// The chapter report is the night's timeline. Each blank: imparfait, passé composé or present.
export const REPORT2 = {
  header: 'GENDARMERIE DE BELLEVILLE',
  title: 'CHRONOLOGIE',
  case: 'Affaire Ferreira — la nuit du 30 octobre',
  intro: [
    { s: 'dubois', fr: 'Imparfait pour le décor, passé composé pour les faits. La juge aime les choses claires.', en: 'Imperfect for the background, perfect for the events. The judge likes things clear.' },
  ],
  lines: [
    { fr: 'À 23 h, il {} très fort.', en: 'At 23:00, it was raining very hard.', options: ['pleuvait', 'a plu', 'pleut'], answer: 0 },
    { fr: 'À 23 h, Karim {} le café, puis il a fait le ménage.', en: 'At 23:00, Karim closed the café, then he did the cleaning.', options: ['fermait', 'a fermé', 'ferme'], answer: 1 },
    { fr: 'À 23 h 15, Maud {} Inès à la fontaine.', en: 'At 23:15, Maud met Inès at the fountain.', options: ['retrouve', 'retrouvait', 'a retrouvé'], answer: 2 },
    { fr: 'Les deux sœurs se {} depuis un quart d\'heure quand Ferhat est arrivé.', en: 'The two sisters had been arguing for a quarter of an hour when Ferhat arrived.', options: ['disputaient', 'sont disputées', 'disputent'], answer: 0 },
    { fr: 'À 23 h 35, Maud {} et elle n\'est pas revenue.', en: "At 23:35, Maud left and she didn't come back.", options: ['partait', 'est partie', 'part'], answer: 1 },
    { fr: 'Au moment du cri, le bus {} encore sur la place.', en: 'When the scream came, the bus was still in the square.', options: ['a été', 'est', 'était'], answer: 2 },
    { fr: "À 23 h 40, quelqu'un {} Inès à la tête.", en: 'At 23:40, someone struck Inès on the head.', options: ['a frappé', 'frappait', 'frappe'], answer: 0 },
    { fr: 'Le maire {} chez lui à minuit.', en: 'The mayor came home at midnight.', options: ['rentrait', 'est rentré', 'rentre'], answer: 1 },
  ],
  conclusion: { fr: "Conclusion : à 23 h 40, Inès n'était pas seule. Quelqu'un ment encore.", en: "Conclusion: at 23:40, Inès wasn't alone. Someone is still lying." },
  stamp: 'NON RÉSOLU',
  verdict: [
    { max: 0, line: { s: 'dubois', fr: 'Parfait. Même la juge ne trouvera rien à dire.', en: "Perfect. Even the judge won't find anything to say." } },
    { max: 2, line: { s: 'dubois', fr: 'Ça ira. Vous avez appris quelque chose, à Lyon.', en: "That'll do. You learnt something in Lyon." } },
    { max: 99, line: { s: 'dubois', e: 'hostile', fr: "L'imparfait, Sacha. Vous l'avez oublié à Lyon ?", en: 'The imperfect, Sacha. Did you leave it behind in Lyon?' } },
  ],
};
