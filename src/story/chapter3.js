// Chapitre 3 — Les secrets
//
// 2 November, le Jour des morts. The judge takes Sacha off the case; he goes on alone.
// Inès's diary (hidden in the hollow tree where they kept "treasures" as children) talks
// about "G." — Lacombe, or Guy Delorme, the mayor. That night Ferhat, the only witness
// who saw the bus, is found in the pond. Rouvière breaks: he buried a blood test in 2011 to
// protect a friend he won't name. Maud gives Sacha the old photo. Lacombe offers him a
// ride on the last bus. (The truth, for chapter 4: Lacombe hit Tiago Ferreira with the bus
// in 2011, on sedatives and drunk; Rouvière covered it up.)
//
// Grammar: plus-que-parfait (the diary), object pronouns (le, la, lui, leur, y, en),
// relative pronouns qui / que / dont (the report). Same line format as chapter1.js, plus
// `clue: id` on a line to hand the player a clue.

export const CHAPTER3 = {
  id: 'ch3',
  title: 'Chapitre 3 — Les secrets',
  titleEn: 'Chapter 3 — Secrets',
  playerStart: { x: 16, y: 9 },
};

export const CAST3 = {
  vasseur: { name: 'La juge Diallo', role: "la juge d'instruction" },
};

// Placement can depend on flags: the first entry whose `if` flags are all set and whose
// `unless` flag isn't set is used; none means the person isn't there.
export const PLACES3 = {
  vasseur: [{ x: 12, y: 5, room: 'cafe' }],
  dubois: [{ x: 4, y: 2, room: 'gendarmerie' }],
  lebrun: [{ x: 36, y: 12, unless: 'lebrun_mort' }],
  theo: [{ x: 3, y: 3, room: 'cafe' }],
  roux: [{ x: 4, y: 2, room: 'boulangerie' }],
  claire: [{ x: 25, y: 15, if: ['lebrun_mort'] }, { x: 7, y: 2, room: 'ecole' }],
  garnier: [{ x: 17, y: 26 }],
  delacroix: [{ x: 5, y: 2, room: 'mairie' }],
  mmedelacroix: [{ x: 28, y: 9 }],
};

export const CLUES3 = {
  pierre_note: {
    name: 'Le papier de la pierre', en: 'The note from the stone', x: 16, y: 6,
    note: { fr: '« RENTRE À LYON », en majuscules. Pour cacher son écriture.', en: '"GO BACK TO LYON", in capitals. To hide the handwriting.' },
    lines: [
      { s: 'narr', fr: "La pierre est encore là, sur le rebord de la fenêtre. Je l'avais posée là cette nuit.", en: 'The stone is still there, on the windowsill. I had put it there in the night.' },
      { s: 'narr', fr: '« RENTRE À LYON. » Des [[majuscules|capital letters]]. Quelqu\'un ne voulait pas qu\'on reconnaisse son [[écriture|handwriting]].', en: '"GO BACK TO LYON." Capital letters. Someone didn\'t want their handwriting recognised.' },
      { s: 'narr', fr: 'Le « R » a une petite [[boucle|loop]]. Je vais [[comparer|compare]].', en: 'The "R" has a little loop. I\'m going to compare.' },
    ],
  },
  ardoise: {
    name: "L'ardoise du café", en: "The café's slate", x: 14, y: 7, requires: ['pierre_note'],
    note: { fr: "« CAFÉ 1,50 € », en majuscules. Mais à la craie, et le R n'a pas de boucle.", en: '"COFFEE €1.50", in capitals. But in chalk, and the R has no loop.' },
    lines: [
      { s: 'narr', fr: "L'[[ardoise|slate]] de Karim : « CAFÉ 1,50 € — CROISSANT 1,20 € ». Des majuscules, lui aussi.", en: "Karim's slate: \"COFFEE €1.50 — CROISSANT €1.20\". Capitals, him too." },
      { s: 'narr', fr: "Mais le R est droit. Pas de boucle. Ce n'est pas lui.", en: "But the R is straight. No loop. It isn't him." },
    ],
  },
  etiquettes: {
    name: 'Les étiquettes de la boulangerie', en: "The bakery's price labels", x: 2, y: 4, room: 'boulangerie', requires: ['pierre_note'],
    note: { fr: 'Une écriture ronde, en minuscules. Rien à voir avec le papier.', en: 'Round handwriting, in small letters. Nothing like the note.' },
    lines: [
      { s: 'narr', fr: "Les [[étiquettes|labels]] de Mme Pellegrin : « baguette », « pain de campagne ». Une écriture ronde, en [[minuscules|small letters]].", en: "Mme Pellegrin's labels: \"baguette\", \"country loaf\". Round handwriting, in small letters." },
      { s: 'narr', fr: 'Rien à voir. Mme Pellegrin n\'a jamais écrit une majuscule de sa vie.', en: 'Nothing like it. Mme Pellegrin has never written a capital letter in her life.' },
    ],
  },
  horaire: {
    name: "L'horaire du bus", en: 'The bus timetable', x: 20, y: 26, requires: ['pierre_note'],
    note: { fr: 'Écrit à la main, en majuscules. Le R a une petite boucle.', en: 'Handwritten, in capitals. The R has a little loop.' },
    lines: [
      { s: 'narr', fr: "L'[[horaire|timetable]] du bus, écrit à la main : « DERNIER BUS : 23 H 30 ».", en: 'The bus timetable, handwritten: "LAST BUS: 23:30".' },
      { s: 'narr', fr: 'Des majuscules. Et le R a une petite boucle.', en: 'Capitals. And the R has a little loop.' },
      { s: 'narr', fr: "Je ne suis pas un [[expert|expert]]. Mais je le regarde longtemps.", en: "I'm not an expert. But I look at it for a long time." },
    ],
  },
  journal: {
    name: "Le journal d'Inès", en: "Inès's diary", x: 39, y: 12, requires: ['mem_banc3'],
    note: { fr: 'Caché dans le vieux tronc. Des pages arrachées. Elle parle de « G. ».', en: 'Hidden in the old tree trunk. Pages torn out. She writes about "G.".' },
    lines: [
      { s: 'narr', fr: "Le vieux tronc [[creux|hollow]]. Je mets la main dedans, comme quand j'avais dix ans.", en: 'The old hollow trunk. I put my hand inside, like when I was ten.' },
      { s: 'narr', fr: "Un petit carnet dans un sac en plastique. Le [[journal|diary]] d'Inès.", en: "A little notebook in a plastic bag. Inès's diary." },
      { s: 'narr', fr: "Elle l'avait caché ici. Elle savait que je m'en souviendrais.", en: 'She had hidden it here. She knew I would remember.' },
      { s: 'narr', fr: "Des pages ont été [[arrachées|torn out]]. Sur celles qui restent, elle parle de « G. ».", en: 'Pages have been torn out. On the ones that are left, she writes about "G.".' },
    ],
  },
  page_brulee: {
    name: 'La page brûlée', en: 'The burnt page', x: 17, y: 7, requires: ['journal'],
    note: { fr: 'Dans la poubelle, à moitié brûlée : « ...G. conduisait cette nuit-là... »', en: 'In the bin, half burnt: "...G. was driving that night..."' },
    lines: [
      { s: 'narr', fr: "Dans la [[poubelle|bin]], du papier noirci. Quelqu'un a voulu le [[brûler|burn]]. La pluie l'en a empêché.", en: 'In the bin, blackened paper. Someone tried to burn it. The rain stopped them.' },
      { s: 'narr', fr: "L'écriture d'Inès. Je peux lire : « ...G. [[conduisait|was driving]] cette nuit-là... »", en: 'Inès\'s writing. I can read: "...G. was driving that night..."' },
    ],
  },
  parechoc: {
    name: 'Le pare-chocs du bus', en: "The bus's bumper", x: 23, y: 27,
    note: { fr: 'Le pare-chocs avant est plus neuf que le reste du bus. Réparé.', en: 'The front bumper is newer than the rest of the bus. Repaired.' },
    lines: [
      { s: 'narr', fr: "Le vieux bus de Lacombe. La peinture est [[usée|worn]] partout.", en: "Lacombe's old bus. The paint is worn everywhere." },
      { s: 'narr', fr: 'Sauf le [[pare-chocs|bumper]] avant. Il est presque neuf. Quelqu\'un l\'a [[réparé|repaired]].', en: 'Except the front bumper. It is almost new. Someone repaired it.' },
    ],
  },
  lebrun_note: {
    name: 'Le papier de Ferhat', en: "Ferhat's note", x: 38, y: 20, requires: ['lebrun_mort'],
    note: { fr: 'Dans sa poche : « PARDON », en majuscules. Le R a une petite boucle.', en: 'In his pocket: "FORGIVE ME", in capitals. The R has a little loop.' },
    lines: [
      { s: 'narr', fr: "Au bord de l'[[étang|pond]], la [[casquette|cap]] de Ferhat. Les gendarmes l'ont sorti de l'eau à l'aube.", en: "At the edge of the pond, Ferhat's cap. The gendarmes pulled him out of the water at dawn." },
      { s: 'narr', fr: 'Dans sa poche, un papier [[mouillé|wet]] : « PARDON ».', en: 'In his pocket, a wet piece of paper: "FORGIVE ME".' },
      { s: 'narr', fr: "En majuscules. Et le R a une petite boucle.", en: 'In capitals. And the R has a little loop.' },
      { s: 'narr', fr: "Ferhat ne savait presque pas écrire. Quelqu'un l'a écrit pour lui.", en: 'Ferhat could hardly write. Someone wrote it for him.' },
      { s: 'narr', fr: 'Rouvière doit voir ce papier.', en: 'Rouvière needs to see this note.' },
    ],
  },
  // Given in conversation (no position).
  page_roux: {
    name: 'La page de Mme Pellegrin', en: "Mme Pellegrin's page", given: true,
    note: { fr: 'Une page du journal, laissée chez Mme Pellegrin pour Sacha.', en: "A page of the diary, left at Mme Pellegrin's for Sacha." },
  },
  page_claire: {
    name: 'La page de Maud', en: "Maud's page", given: true,
    note: { fr: "Une page du journal, dans une lettre envoyée à Maud. Elle ne l'avait pas ouverte.", en: "A page of the diary, in a letter sent to Maud. She hadn't opened it." },
  },
  photo: {
    name: 'La photo de la fontaine', en: 'The fountain photo', given: true,
    note: { fr: 'Sacha et Inès, enfants. Derrière : « Le vœu : qu\'il revienne. »', en: 'Sacha and Inès as children. On the back: "The wish: that he comes back."' },
  },
};

export const STATEMENTS3 = {
  vasseur_retire: { who: 'vasseur', fr: "Vous n'êtes plus sur l'enquête. Vous ne quittez pas Belleville.", en: "You're off the case. You don't leave Belleville." },
  theo_courir: { who: 'theo', fr: "Après la pierre, j'ai vu quelqu'un courir vers l'arrêt de bus.", en: 'After the stone, I saw someone run towards the bus stop.' },
  lebrun_telephone: { who: 'lebrun', fr: "Quelqu'un m'a téléphoné cette nuit. Il n'a rien dit. J'ai entendu un moteur.", en: "Someone phoned me last night. He said nothing. I heard an engine." },
  mme_somniferes: { who: 'mmedelacroix', fr: "Je prends des somnifères depuis des années. Inès le savait.", en: "I've been taking sleeping pills for years. Inès knew." },
  mme_voiture: { who: 'mmedelacroix', fr: "En 2011, Guy conduisait ma voiture. Il l'a vendue après l'hiver.", en: 'In 2011, Guy drove my car. He sold it after the winter.' },
  maire_voiture: { who: 'delacroix', fr: "J'ai vendu la voiture parce qu'elle était vieille. J'ai la facture.", en: 'I sold the car because it was old. I have the receipt.' },
  garnier_sanglier: { who: 'garnier', fr: "Le pare-chocs ? Un sanglier, en 2011, sur la route de Lyon.", en: 'The bumper? A wild boar, in 2011, on the Lyon road.' },
  garnier_horaire: { who: 'garnier', fr: "C'est moi qui écris les horaires. En majuscules, pour les vieux.", en: "I'm the one who writes the timetables. In capitals, for the old folk." },
  dubois_aveu: { who: 'dubois', fr: "En 2011, j'ai caché une analyse de sang. Pour protéger un ami.", en: 'In 2011, I hid a blood test. To protect a friend.' },
};

// The diary: four entries whose dates are lost. The player puts them in order;
// each one points back to the one before with the plus-que-parfait.
export const DIARY = {
  pieces: ['journal', 'page_roux', 'page_claire'],
  entries: [
    { id: 'a', from: 'journal', fr: "En rangeant la pharmacie, j'ai trouvé les vieilles [[ordonnances|prescriptions]] de 2011. Une ordonnance de G. : des [[somnifères|sleeping pills]] très forts. « Ne pas conduire. »", en: 'Tidying the pharmacy, I found the old prescriptions from 2011. A prescription for G.: very strong sleeping pills. "Do not drive."' },
    { id: 'b', from: 'page_roux', fr: "J'avais trouvé l'ordonnance de G. trois semaines plus tôt. Aujourd'hui, je suis allée au laboratoire de Lyon avec le dossier de papa.", en: "I had found G.'s prescription three weeks earlier. Today, I went to the laboratory in Lyon with Dad's file." },
    { id: 'c', from: 'page_claire', fr: "Depuis que j'étais allée à Lyon, quelqu'un me suivait. Ce soir, j'ai écrit à Sacha. Et j'ai appelé Maud.", en: "Since I had gone to Lyon, someone was following me. Tonight, I wrote to Sacha. And I called Maud." },
    { id: 'd', from: 'journal', fr: "La lettre du laboratoire est arrivée. En 2011, la gendarmerie avait déjà fait une analyse : « G. », positif. Quelqu'un l'avait cachée. Heureusement, j'avais écrit à Sacha. Il arrive ce soir.", en: 'The letter from the laboratory has arrived. In 2011, the gendarmerie had already done a test: "G.", positive. Someone had hidden it. Luckily, I had written to Sacha. He arrives tonight.' },
  ],
  order: ['a', 'b', 'c', 'd'],
  hint: { fr: "Cherchez le plus-que-parfait : « j'avais trouvé », « j'étais allée »... Il parle de ce qui s'était passé AVANT.", en: 'Look for the pluperfect: "I had found", "I had gone"... It talks about what had happened BEFORE.' },
  done: [
    { s: 'narr', fr: "Septembre : l'ordonnance. Octobre : Lyon. Puis quelqu'un la suivait. Puis la lettre. Et le soir même, elle était morte.", en: 'September: the prescription. October: Lyon. Then someone was following her. Then the letter. And that same evening, she was dead.' },
    { s: 'narr', fr: "« G. » prenait des somnifères en 2011. « G. » conduisait. Mais qui est « G. » ?", en: '"G." was taking sleeping pills in 2011. "G." was driving. But who is "G."?' },
  ],
};

export const MEMORIES3 = {
  banc3: {
    name: 'Le banc du parc', x: 39, y: 13,
    lines: [
      { s: 'narr', fr: "Le banc où on lisait, Inès et moi. Derrière, le vieux chêne.", en: 'The bench where Inès and I used to read. Behind it, the old oak.' },
      { s: 'narr', fr: "Dans son tronc creux, on cachait nos [[trésors|treasures]] : des billes, des lettres, des secrets.", en: 'In its hollow trunk, we used to hide our treasures: marbles, letters, secrets.' },
      { s: 'narr', fr: "Si Inès avait voulu cacher quelque chose... elle l'aurait caché là.", en: 'If Inès had wanted to hide something... she would have hidden it there.' },
    ],
  },
  dormir: {
    name: 'Monter dormir', x: 13, y: 3, room: 'cafe', requires: ['journal_ordre', 'mme_voiture'], cut: 'ch3_nuit', set: 'lebrun_mort',
    lines: [
      { s: 'narr', fr: "Il est tard. Le [[brouillard|fog]] monte de l'étang. Je monte me [[coucher|go to bed]].", en: "It's late. The fog is rising from the pond. I go up to bed." },
      { s: 'narr', fr: "Demain, je trouverai qui est « G. ».", en: 'Tomorrow, I will find out who "G." is.' },
    ],
  },
};

export const INTRO3 = [
  { s: 'narr', fr: 'Le 2 novembre. Le [[jour des morts|All Souls\' Day]].', en: "2 November. All Souls' Day." },
  { s: 'narr', fr: "La juge Diallo m'attendait au café. Elle avait lu ma chronologie toute la nuit.", en: 'Judge Diallo was waiting for me at the café. She had read my timeline all night.' },
  { s: 'narr', fr: "Par terre, dans ma chambre, il y avait encore la pierre. Et le papier : « RENTRE À LYON ».", en: 'On the floor of my room, there was still the stone. And the note: "GO BACK TO LYON".' },
  { s: 'narr', fr: "Quelqu'un avait [[peur|fear]]. Donc j'étais sur la bonne [[piste|track]].", en: 'Someone was afraid. So I was on the right track.' },
];

export const NIGHT3 = [
  { s: 'narr', fr: 'Cette nuit-là, le brouillard est tombé sur Belleville.', en: 'That night, the fog came down over Belleville.' },
  { s: 'narr', fr: "À l'[[aube|dawn]], des lampes de poche brillaient autour de l'étang.", en: 'At dawn, torches were shining around the pond.' },
  { s: 'narr', fr: "Ferhat. Le seul homme qui avait vu le bus.", en: 'Ferhat. The only man who had seen the bus.' },
  { s: 'narr', fr: "Les gendarmes disaient qu'il avait trop bu. Qu'il était tombé.", en: 'The gendarmes said he had drunk too much. That he had fallen.' },
  { s: 'narr', fr: "Comme Inès était « tombée ».", en: 'The way Inès had "fallen".' },
];

export const OUTRO3 = [
  { s: 'narr', fr: 'Il était presque minuit. Le dernier bus attendait sur la place, moteur allumé.', en: 'It was nearly midnight. The last bus was waiting in the square, engine running.' },
  { s: 'narr', fr: "Lacombe m'a fait signe. « Monte, mon garçon. On fait un dernier tour. Il faut qu'on parle, toi et moi. »", en: 'Lacombe waved to me. "Get in, my boy. One last round. You and I need to talk."' },
  { s: 'narr', fr: "Je suis monté. J'étais le seul [[passager|passenger]].", en: 'I got on. I was the only passenger.' },
  { s: 'narr', fr: 'Les portes se sont fermées derrière moi.', en: 'The doors closed behind me.' },
  { s: 'narr', fr: "Dans le [[rétroviseur|rear-view mirror]], j'ai vu ses yeux. Puis il a éteint les [[phares|headlights]].", en: 'In the rear-view mirror, I saw his eyes. Then he switched off the headlights.' },
];

const has = (...ids) => (g) => ids.every((id) => g.has(id));
const count = (...ids) => (g) => `${ids.filter((id) => g.has(id)).length}/${ids.length}`;

export const OBJECTIVES3 = [
  { fr: 'Parlez à la juge Diallo, au café.', en: 'Talk to Judge Diallo, in the café.', done: has('met3_vasseur') },
  { fr: 'Examinez le papier de la pierre, devant le café.', en: 'Examine the note from the stone, outside the café.', done: has('pierre_note') },
  { fr: "Comparez l'écriture : le café, la boulangerie, l'arrêt de bus.", en: 'Compare the handwriting: the café, the bakery, the bus stop.', done: has('ardoise', 'etiquettes', 'horaire'), count: count('ardoise', 'etiquettes', 'horaire') },
  { fr: 'Où Inès cachait-elle ses trésors ?', en: 'Where did Inès hide her treasures?', done: has('journal') },
  { fr: 'Retrouvez les pages arrachées. Qui les a ?', en: 'Find the torn-out pages. Who has them?', done: has('page_roux', 'page_claire'), count: count('page_roux', 'page_claire') },
  { fr: 'Remettez les pages du journal dans l\'ordre.', en: 'Put the diary pages back in order.', done: has('journal_ordre') },
  { fr: 'Qui est « G. » ? Parlez à Mme Delorme.', en: 'Who is "G."? Talk to Mme Delorme.', done: has('mme_voiture') },
  { fr: 'Il est tard. Montez dormir, au café.', en: "It's late. Go up to bed, at the café.", done: has('lebrun_mort') },
  { fr: "Allez à l'étang.", en: 'Go to the pond.', done: has('lebrun_note') },
  { fr: 'Faites parler Rouvière, à la gendarmerie.', en: 'Make Rouvière talk, at the gendarmerie.', done: has('dubois_aveu') },
  { fr: 'Regardez le bus de Lacombe de plus près.', en: "Take a closer look at Lacombe's bus.", done: has('parechoc') },
  { fr: 'Maud vous attend à la fontaine.', en: 'Maud is waiting for you at the fountain.', done: has('photo') },
  { fr: 'Retournez voir la juge.', en: 'Go back to the judge.', done: has('ch3_done') },
  { fr: 'Écrivez vos notes.', en: 'Write your notes.', done: has('ch3_report_done') },
  { fr: 'Fin du chapitre 3. Belleville vous attend.', en: 'End of chapter 3. Belleville is waiting.', done: () => false },
];

export const DIALOGUE3 = {
  vasseur: {
    first: [
      { s: 'vasseur', fr: 'Inspecteur Morvan. Asseyez-vous.', en: 'Inspector Morvan. Sit down.' },
      { s: 'vasseur', fr: "J'ai lu votre chronologie. Elle est bonne. Trop bonne, peut-être.", en: 'I read your timeline. It is good. Too good, perhaps.' },
      { s: 'vasseur', e: 'hostile', fr: "Vous êtes arrivé le soir du crime. La victime vous avait écrit. Et vous n'avez pas d'alibi.", en: "You arrived the evening of the crime. The victim had written to you. And you have no alibi." },
      { s: 'you', fr: 'Je dormais au-dessus du café.', en: 'I was asleep above the café.' },
      { s: 'vasseur', fr: 'Seul. Je sais.', en: 'Alone. I know.' },
      { s: 'vasseur', fr: "Vous n'êtes plus sur l'enquête, inspecteur. Et vous ne quittez pas Belleville. C'est clair ?", en: "You're off the case, Inspector. And you don't leave Belleville. Is that clear?", record: 'vasseur_retire' },
      { s: 'narr', fr: "Plus d'enquête [[officielle|official]]. Il me restait une enquête [[officieuse|unofficial]].", en: 'No more official investigation. I still had an unofficial one.' },
    ],
    greet: [{ s: 'vasseur', fr: 'Inspecteur. Vous ne devriez pas être ici.', en: "Inspector. You shouldn't be here." }],
    topics: [
      {
        id: 'pierre', q: "Quelqu'un a jeté une pierre dans ma fenêtre.", en: 'Someone threw a stone through my window.',
        lines: [
          { s: 'vasseur', fr: 'Je le sais. Le brigadier me l\'a dit.', en: 'I know. The sergeant told me.' },
          { s: 'vasseur', fr: 'Vous voyez ? Quelqu\'un veut que vous partiez. Moi, je veux que vous restiez. Pour l\'instant.', en: 'You see? Someone wants you to leave. I want you to stay. For now.' },
        ],
      },
      {
        id: 'fin', q: "J'ai des preuves. Sur la mort de Tiago Ferreira, en 2011.", en: "I have evidence. About Tiago Ferreira's death, in 2011.", requires: ['dubois_aveu', 'photo', 'parechoc'], end: true,
        lines: [
          { s: 'vasseur', fr: 'En 2011 ? Ce dossier est [[classé|closed]], inspecteur.', en: 'In 2011? That case is closed, Inspector.' },
          { s: 'you', fr: "Rouvière l'a classé. Et il a caché une analyse de sang.", en: 'Rouvière closed it. And he hid a blood test.' },
          { s: 'vasseur', e: 'shaken', fr: '...', en: '...' },
          { s: 'vasseur', fr: 'Écrivez-moi tout ce que vous savez. Si c\'est sérieux, je le rouvre.', en: "Write down everything you know for me. If it's serious, I'll reopen it.", set: 'ch3_done' },
        ],
      },
    ],
    evidence: {
      dubois_aveu: [
        { s: 'vasseur', e: 'shaken', fr: 'Le brigadier a caché une analyse ? Vous en êtes sûr ?', en: 'The sergeant hid a test? Are you sure of it?' },
        { s: 'vasseur', fr: 'Je vais lui parler. Moi-même.', en: 'I will speak to him. Myself.' },
      ],
      lebrun_note: [
        { s: 'vasseur', fr: 'Un [[suicide|suicide]], disent les gendarmes. Vous n\'y croyez pas.', en: "A suicide, say the gendarmes. You don't believe it." },
        { s: 'you', fr: "Ferhat ne savait pas écrire. Quelqu'un l'a écrit pour lui.", en: "Ferhat couldn't write. Someone wrote it for him." },
        { s: 'vasseur', fr: "Alors trouvez-le. Mais je ne vous ai rien dit.", en: "Then find him. But I didn't tell you anything." },
      ],
    },
    wrong: [{ s: 'vasseur', fr: "Ça ne m'intéresse pas, inspecteur.", en: "That doesn't interest me, Inspector." }],
  },

  theo: {
    first: [
      { s: 'theo', e: 'shaken', fr: "Sacha ! T'as vu la juge ? Elle t'attendait depuis six heures.", en: 'Sacha! Did you see the judge? She\'d been waiting for you since six.' },
      { s: 'theo', fr: "Et ta fenêtre... Je l'ai réparée avec du carton. C'est tout ce que j'avais.", en: "And your window... I fixed it with cardboard. It's all I had." },
    ],
    greet: [{ s: 'theo', fr: 'Un café ? T\'en as besoin.', en: 'A coffee? You need one.' }],
    topics: [
      {
        id: 'pierre', q: 'Tu as vu qui a jeté la pierre ?', en: 'Did you see who threw the stone?',
        lines: [
          { s: 'theo', fr: "Je l'ai entendue. Je suis descendu tout de suite.", en: 'I heard it. I came down straight away.' },
          { s: 'theo', fr: "J'ai vu quelqu'un courir vers l'arrêt de bus. Un homme, je crois. Je ne l'ai pas vu de [[face|the front]].", en: "I saw someone running towards the bus stop. A man, I think. I didn't see him from the front.", record: 'theo_courir' },
        ],
      },
      {
        id: 'ardoise', q: "C'est toi qui écris l'ardoise ?", en: 'Are you the one who writes the slate?', requires: ['ardoise'],
        lines: [
          { s: 'theo', fr: "Ouais. En majuscules, comme tout le monde. Pourquoi ?", en: 'Yeah. In capitals, like everyone. Why?' },
          { s: 'theo', e: 'hostile', fr: "Attends... Tu crois que c'est moi, la pierre ? Sacha. Sérieux ?", en: 'Wait... You think the stone was me? Sacha. Seriously?' },
        ],
      },
      {
        id: 'lebrun', q: 'Tu connaissais bien Ferhat ?', en: 'Did you know Ferhat well?', requires: ['lebrun_mort'],
        lines: [
          { s: 'theo', e: 'shaken', fr: "Il venait tous les matins. Un café noir, sans sucre. Il ne buvait jamais d'alcool.", en: 'He came every morning. A black coffee, no sugar. He never drank alcohol.' },
          { s: 'narr', fr: "Les gendarmes disaient qu'il avait trop bu.", en: 'The gendarmes said he had drunk too much.' },
        ],
      },
    ],
    evidence: {},
    wrong: [{ s: 'theo', fr: 'Je sais pas, Sacha. Moi, je sers des cafés.', en: 'I dunno, Sacha. I just serve coffee.' }],
  },

  roux: {
    first: [
      { s: 'roux', e: 'shaken', fr: 'Sacha ! Une pierre dans ta fenêtre ! Toute la ville en parle.', en: 'Sacha! A stone through your window! The whole town is talking about it.' },
    ],
    greet: [{ s: 'roux', fr: 'Mon petit. Tu as mangé ?', en: 'Sweetheart. Have you eaten?' }],
    topics: [
      {
        id: 'page', q: 'Inès t\'a laissé quelque chose pour moi ?', en: 'Did Inès leave you something for me?', requires: ['journal'],
        lines: [
          { s: 'roux', fr: 'Pour toi ? ... Oh, mon Dieu. Oui !', en: 'For you? ... Oh, my goodness. Yes!' },
          { s: 'roux', fr: "La semaine dernière, elle m'a donné une [[enveloppe|envelope]]. Elle m'a dit : « S'il m'arrive quelque chose, donne-la à Sacha. »", en: 'Last week, she gave me an envelope. She said to me: "If anything happens to me, give it to Sacha."' },
          { s: 'roux', e: 'shaken', fr: "Je l'avais mise dans le tiroir de la caisse. Et je l'avais oubliée. Pardonne-moi, mon petit.", en: 'I had put it in the till drawer. And I had forgotten it. Forgive me, sweetheart.' },
          { s: 'roux', fr: "Et les gendarmes ? Je ne [[leur|to them]] ai rien dit. Inès m'avait fait promettre.", en: "And the gendarmes? I didn't tell them anything. Inès had made me promise." },
          { s: 'narr', fr: "Dans l'enveloppe, une page du journal d'Inès.", en: "In the envelope, a page from Inès's diary.", clue: 'page_roux' },
        ],
      },
      {
        id: 'etiquettes', q: "C'est toi qui écris les étiquettes ?", en: 'Do you write the labels?', requires: ['etiquettes'],
        lines: [
          { s: 'roux', fr: "Bien sûr ! Avec mon beau stylo. Les majuscules, je ne les aime pas. Ça crie.", en: "Of course! With my nice pen. I don't like capitals. They shout." },
        ],
      },
    ],
    evidence: {},
    wrong: [{ s: 'roux', fr: 'Moi, je fais du pain, mon chéri.', en: 'I make bread, sweetheart.' }],
  },

  claire: {
    first: [
      { s: 'claire', fr: "Sacha. On m'a dit pour la juge. Elle t'a retiré l'enquête ?", en: 'Sacha. I heard about the judge. She took the case off you?' },
      { s: 'you', fr: "Officiellement. Pas vraiment.", en: 'Officially. Not really.' },
      { s: 'claire', fr: 'Évidemment.', en: 'Obviously.' },
    ],
    greet: [{ s: 'claire', fr: 'Encore toi. Ça devient une habitude.', en: "You again. It's becoming a habit." }],
    topics: [
      {
        id: 'page', q: "Inès t'a envoyé quelque chose, avant de mourir ?", en: 'Did Inès send you anything before she died?', requires: ['journal'],
        lines: [
          { s: 'claire', e: 'shaken', fr: "Une lettre. Je ne l'avais pas ouverte. Dix ans sans se parler... je ne pouvais pas.", en: "A letter. I hadn't opened it. Ten years without talking... I couldn't." },
          { s: 'claire', fr: "Je l'ai ouverte hier soir. Il n'y avait pas de lettre. Juste une page de son journal.", en: 'I opened it last night. There was no letter. Just a page of her diary.' },
          { s: 'claire', fr: 'Tiens. Je crois qu\'elle était pour toi, en fait.', en: 'Here. I think it was for you, really.', clue: 'page_claire' },
        ],
      },
      {
        id: 'photo', q: 'Tu voulais me voir ?', en: 'You wanted to see me?', requires: ['lebrun_mort'],
        lines: [
          { s: 'claire', fr: "J'ai trouvé cette photo chez elle. Elle l'avait gardée pendant quinze ans.", en: 'I found this photo at her place. She had kept it for fifteen years.' },
          { s: 'narr', fr: "La photo. Inès et moi, à dix ans, devant la fontaine. On y lançait des pièces.", en: 'The photo. Inès and me, aged ten, in front of the fountain. We used to throw coins into it.' },
          { s: 'claire', fr: 'Regarde derrière.', en: 'Look on the back.' },
          { s: 'narr', fr: "« Le [[vœu|wish]] : qu'il revienne. »", en: '"The wish: that he comes back."', clue: 'photo' },
          { s: 'narr', fr: "Le vœu qu'elle faisait à la fontaine. Celui dont elle ne m'avait jamais parlé.", en: 'The wish she used to make at the fountain. The one she had never told me about.' },
          { s: 'claire', fr: 'Elle t\'attendait, Sacha. Depuis quinze ans.', en: 'She was waiting for you, Sacha. For fifteen years.' },
          { s: 'claire', fr: 'Moi aussi, peut-être.', en: 'Me too, perhaps.' },
          { s: 'narr', fr: "Elle est partie avant que je puisse répondre.", en: 'She left before I could answer.' },
        ],
      },
    ],
    evidence: {
      lebrun_note: [
        { s: 'claire', e: 'shaken', fr: '« Pardon »... Comme sur la tombe de papa. Ce n\'est pas une coïncidence, Sacha.', en: '"Forgive me"... Like on Dad\'s grave. It\'s not a coincidence, Sacha.' },
      ],
    },
    wrong: [{ s: 'claire', fr: 'Je ne sais pas, Sacha.', en: "I don't know, Sacha." }],
  },

  mmedelacroix: {
    first: [
      { s: 'mmedelacroix', fr: 'Inspecteur. On dit que vous n\'êtes plus sur l\'enquête.', en: "Inspector. They say you're off the case." },
      { s: 'mmedelacroix', fr: 'Et pourtant, vous êtes là.', en: 'And yet here you are.' },
    ],
    greet: [{ s: 'mmedelacroix', fr: 'Encore vous, inspecteur.', en: 'You again, Inspector.' }],
    topics: [
      {
        id: 'g', q: 'Votre mari... il s\'appelle Guy, n\'est-ce pas ?', en: "Your husband... his name is Guy, isn't it?", requires: ['journal'],
        lines: [
          { s: 'mmedelacroix', fr: 'Guy, oui. Pourquoi ?', en: 'Guy, yes. Why?' },
          { s: 'narr', fr: '« G. »', en: '"G."' },
          { s: 'mmedelacroix', fr: "En 2011, nous avions une vieille voiture. C'est lui qui la conduisait. Il l'a vendue après l'hiver.", en: 'In 2011, we had an old car. He was the one who drove it. He sold it after the winter.', record: 'mme_voiture' },
          { s: 'mmedelacroix', fr: "Il a dit qu'elle était trop vieille. Je ne lui ai pas posé de questions.", en: "He said it was too old. I didn't ask him any questions." },
        ],
      },
      {
        id: 'medicaments', q: 'Inès vous donnait des médicaments...', en: 'Inès used to give you medicines...',
        lines: [
          { s: 'mmedelacroix', fr: 'Des [[somnifères|sleeping pills]]. Depuis des années. Inès le savait. Elle ne l\'a jamais dit à personne.', en: 'Sleeping pills. For years. Inès knew. She never told anyone.', record: 'mme_somniferes' },
          { s: 'mmedelacroix', fr: "Ne le dites pas à Guy. Il pense que je dors bien.", en: "Don't tell Guy. He thinks I sleep well." },
        ],
      },
    ],
    evidence: {},
    wrong: [{ s: 'mmedelacroix', fr: 'Je ne sais rien, inspecteur.', en: "I don't know anything, Inspector." }],
  },

  delacroix: {
    first: [
      { s: 'delacroix', e: 'hostile', fr: "Monsieur Morvan. La juge vous a retiré l'enquête. Enfin quelqu'un de raisonnable.", en: 'Mr Morvan. The judge has taken you off the case. Someone sensible at last.' },
    ],
    greet: [{ s: 'delacroix', fr: 'Vous, encore.', en: 'You again.' }],
    topics: [
      {
        id: 'prenom', q: 'Vous vous appelez Guy, monsieur le maire ?', en: 'Your name is Guy, Mr Mayor?', requires: ['journal'],
        lines: [
          { s: 'delacroix', fr: 'Guy Delorme. C\'est écrit sur toutes les affiches de la ville. Pourquoi ?', en: "Guy Delorme. It's on every poster in town. Why?" },
          { s: 'narr', fr: 'Je ne lui réponds pas. Il ne me quitte pas des yeux.', en: "I don't answer him. He doesn't take his eyes off me." },
        ],
      },
    ],
    evidence: {
      mme_voiture: [
        { s: 'delacroix', e: 'hostile', fr: "Ma voiture ? Elle avait vingt ans ! Je l'ai vendue à un garage de Lyon. Vous voulez la [[facture|receipt]] ?", en: 'My car? It was twenty years old! I sold it to a garage in Lyon. Do you want the receipt?', record: 'maire_voiture' },
        { s: 'narr', fr: 'Il a gardé la facture pendant quinze ans ?', en: 'He kept the receipt for fifteen years?' },
      ],
      page_brulee: [
        { s: 'delacroix', e: 'shaken', fr: '« G. conduisait »... Ce n\'est pas moi. Je ne conduis plus depuis 2012.', en: '"G. was driving"... It isn\'t me. I haven\'t driven since 2012.' },
        { s: 'narr', fr: 'Depuis 2012. Pas depuis 2011.', en: 'Since 2012. Not since 2011.' },
      ],
    },
    wrong: [{ s: 'delacroix', fr: "Je n'ai pas de temps pour ça.", en: "I don't have time for this." }],
  },

  lebrun: {
    first: [
      { s: 'lebrun', e: 'shaken', fr: "Le petit Morvan. Vous avez une tête de chien battu. Moi aussi, j'en ai une, je sais.", en: "Young Morvan. You look like a beaten dog. I've got the same look, I know." },
      { s: 'lebrun', fr: "Je n'ai pas dormi. Quelqu'un m'a téléphoné, cette nuit. À trois heures.", en: "I didn't sleep. Someone phoned me last night. At three o'clock." },
    ],
    greet: [{ s: 'lebrun', fr: 'Oui ?', en: 'Yes?' }],
    topics: [
      {
        id: 'telephone', q: 'Qui vous a téléphoné ?', en: 'Who phoned you?',
        lines: [
          { s: 'lebrun', fr: "Je ne sais pas. Il n'a rien dit. J'ai entendu la pluie. Et un moteur, au loin.", en: "I don't know. He didn't say anything. I heard the rain. And an engine, far away.", record: 'lebrun_telephone' },
          { s: 'lebrun', e: 'shaken', fr: "Quelqu'un sait que j'ai vu le bus. Et maintenant, j'ai peur.", en: 'Someone knows I saw the bus. And now I\'m afraid.' },
          { s: 'you', fr: 'Vous en avez parlé à la juge ?', en: 'Did you tell the judge about it?' },
          { s: 'lebrun', fr: "Oui. Je lui ai tout dit. Elle m'a écouté, elle, au moins.", en: 'Yes. I told her everything. She listened to me, at least.' },
        ],
      },
    ],
    evidence: {},
    wrong: [{ s: 'lebrun', fr: 'Je ne vois pas le rapport.', en: "I don't see the connection." }],
  },

  garnier: {
    first: [
      { s: 'garnier', fr: "Ah, mon garçon ! On m'a dit pour ta fenêtre. Les jeunes d'aujourd'hui, hein...", en: 'Ah, my boy! I heard about your window. Young people these days, eh...' },
      { s: 'garnier', fr: "Une pierre qui roule n'amasse pas mousse, comme on dit. Toi, tu roules trop.", en: 'A rolling stone gathers no moss, as they say. You roll too much.' },
    ],
    greet: [{ s: 'garnier', fr: 'Mon garçon.', en: 'My boy.' }],
    topics: [
      {
        id: 'horaire', q: "C'est toi qui écris les horaires du bus ?", en: 'Are you the one who writes the bus timetables?', requires: ['horaire'],
        lines: [
          { s: 'garnier', fr: "Depuis trente ans ! En majuscules, pour que les vieux puissent les lire.", en: 'For thirty years! In capitals, so the old folk can read them.', record: 'garnier_horaire' },
          { s: 'garnier', fr: 'Pourquoi ? Tu veux un autographe ?', en: 'Why? Do you want an autograph?' },
          { s: 'narr', fr: 'Il rit. Je ne ris pas.', en: "He laughs. I don't." },
        ],
      },
      {
        id: 'parechoc', q: 'Le pare-chocs de ton bus est neuf. Que lui est-il arrivé ?', en: 'Your bus bumper is new. What happened to it?', requires: ['parechoc'],
        lines: [
          { s: 'garnier', fr: "Ça ? Un [[sanglier|wild boar]], en 2011, sur la route de Lyon. Ces bêtes-là, la nuit, tu ne les vois pas.", en: "That? A wild boar, in 2011, on the Lyon road. Those animals, at night, you don't see them.", record: 'garnier_sanglier' },
          { s: 'narr', fr: 'En 2011. Sur la route de Lyon. La nuit.', en: 'In 2011. On the Lyon road. At night.' },
        ],
      },
      {
        id: 'lebrun', q: 'Tu as appris pour Ferhat ?', en: 'Have you heard about Ferhat?', requires: ['lebrun_mort'],
        lines: [
          { s: 'garnier', e: 'shaken', fr: "Pauvre homme. Il buvait, tu sais. Depuis des années.", en: 'Poor man. He drank, you know. For years.' },
          { s: 'narr', fr: "Karim dit le contraire.", en: 'Karim says the opposite.' },
        ],
      },
    ],
    evidence: {
      lebrun_note: [
        { s: 'garnier', fr: "« Pardon »... Il avait des remords. Pour Inès, peut-être. Il l'avait vue, cette nuit-là, et il n'avait rien fait.", en: '"Forgive me"... He had regrets. For Inès, perhaps. He had seen her that night, and he had done nothing.' },
        { s: 'narr', fr: 'Il connaît bien la nuit de Ferhat. Trop bien.', en: "He knows Ferhat's night well. Too well." },
      ],
    },
    wrong: [{ s: 'garnier', fr: 'Moi, je conduis le bus, mon garçon. Je ne suis pas détective.', en: "I drive the bus, my boy. I'm not a detective." }],
  },

  dubois: {
    first: [
      { s: 'dubois', e: 'hostile', fr: "Sacha. Vous n'êtes plus sur l'enquête. Rentrez à Lyon.", en: "Sacha. You're off the case. Go back to Lyon." },
      { s: 'you', fr: 'La juge me demande de rester.', en: 'The judge is asking me to stay.' },
      { s: 'dubois', fr: 'Alors restez. Mais ne me parlez pas.', en: "Then stay. But don't talk to me." },
    ],
    greet: [{ s: 'dubois', fr: 'Encore vous.', en: 'You again.' }],
    topics: [
      {
        id: 'pardon', q: 'C\'est vous qui avez écrit « Pardon » sur la tombe de Tiago ?', en: 'Was it you who wrote "Forgive me" on Tiago\'s grave?', requires: ['chrysanthemes'],
        lines: [
          { s: 'dubois', e: 'hostile', fr: 'Je ne vois pas de quoi vous parlez.', en: "I don't know what you're talking about." },
          { s: 'narr', fr: 'Ses mains tremblent. Comme hier.', en: 'His hands are shaking. Like yesterday.' },
        ],
      },
      {
        id: 'etang', q: "Qu'est-ce qui est arrivé à Ferhat ?", en: 'What happened to Ferhat?', requires: ['lebrun_mort'],
        lines: [
          { s: 'dubois', e: 'shaken', fr: "On l'a trouvé dans l'étang, à cinq heures. Il avait bu, d'après le médecin.", en: 'We found him in the pond, at five. He had been drinking, according to the doctor.' },
          { s: 'dubois', fr: "Pour moi, c'est un accident.", en: "As far as I'm concerned, it's an accident." },
          { s: 'narr', fr: 'Il le dit sans y croire.', en: 'He says it without believing it.' },
        ],
      },
    ],
    evidence: {
      lebrun_note: 'aveu',
      enveloppe: [{ s: 'dubois', e: 'hostile', fr: 'Je vous ai dit de laisser les morts tranquilles.', en: 'I told you to leave the dead in peace.' }],
      chrysanthemes: [{ s: 'dubois', e: 'hostile', fr: 'Des fleurs. Tout le monde pose des fleurs à la Toussaint.', en: "Flowers. Everyone puts down flowers at All Saints'." }],
    },
    shared: {
      aveu: [
        { s: 'dubois', e: 'shaken', fr: 'Ferhat... C\'est ma faute. Tout est ma faute.', en: "Ferhat... It's my fault. It's all my fault." },
        { s: 'dubois', fr: "Oui. C'est moi qui ai écrit « Pardon ». Pas sur ce papier-là. Sur la tombe de Tiago.", en: 'Yes. I\'m the one who wrote "Forgive me". Not on that piece of paper. On Tiago\'s grave.' },
        { s: 'dubois', fr: "En 2011, j'ai fait faire une analyse de sang. Le résultat est arrivé de Lyon. Je l'ai caché.", en: 'In 2011, I had a blood test done. The result came from Lyon. I hid it.', record: 'dubois_aveu', set: 'dubois_aveu' },
        { s: 'you', fr: 'Le sang de qui ?', en: 'Whose blood?' },
        { s: 'dubois', fr: "D'un ami. Un ami que je connais depuis quarante ans. Je ne vous dirai pas son nom.", en: "A friend's. A friend I've known for forty years. I won't tell you his name." },
        { s: 'dubois', e: 'hostile', fr: "Mais je n'ai tué personne, Sacha. Je vous le jure.", en: "But I haven't killed anyone, Sacha. I swear it." },
        { s: 'narr', fr: "Un ami dont il ne dira pas le nom. À Belleville, deux hommes le connaissent depuis quarante ans.", en: "A friend whose name he won't say. In Belleville, two men have known him for forty years." },
        { s: 'narr', fr: 'Guy Delorme. Et Gaby Lacombe.', en: 'Guy Delorme. And Gaby Lacombe.' },
      ],
    },
    wrong: [{ s: 'dubois', fr: 'Ça ne m\'aide pas.', en: "That doesn't help me." }],
  },
};

// The chapter's report: Sacha's own notes, joining facts with qui / que / dont.
export const REPORT3 = {
  header: 'NOTES PERSONNELLES — S. MORVAN',
  title: 'CE QUE JE SAIS',
  case: 'Affaire Ferreira — 2011 et 2026',
  intro: [
    { s: 'vasseur', fr: 'Qui, que, dont, inspecteur. Je veux des phrases claires. Pas des romans.', en: 'Who, that, whose, Inspector. I want clear sentences. Not novels.' },
  ],
  lines: [
    { fr: "« G. » est l'homme {} prenait des somnifères en 2011.", en: '"G." is the man who was taking sleeping pills in 2011.', options: ['qui', 'que', 'dont'], answer: 0 },
    { fr: "L'ordonnance {} G. avait reçue disait : « Ne pas conduire ».", en: 'The prescription that G. had been given said: "Do not drive".', options: ['qui', 'que', 'dont'], answer: 1 },
    { fr: 'Quand je suis arrivé, Inès {} déjà découvert la vérité.', en: 'When I arrived, Inès had already discovered the truth.', options: ['a', 'avait', 'est'], answer: 1 },
    { fr: 'Ferhat était le seul témoin {} avait vu le bus.', en: 'Ferhat was the only witness who had seen the bus.', options: ['que', 'dont', 'qui'], answer: 2 },
    { fr: 'Rouvière protège un ami {} il ne veut pas dire le nom.', en: "Rouvière is protecting a friend whose name he won't say.", options: ['qui', 'dont', 'que'], answer: 1 },
    { fr: 'Le pare-chocs {} Lacombe a fait réparer date de 2011.', en: 'The bumper that Lacombe had repaired dates from 2011.', options: ['que', 'qui', 'dont'], answer: 0 },
    { fr: 'La photo ? Maud {} donnée ce soir.', en: 'The photo? Maud gave it to me this evening.', options: ["me l'a", 'me lui a', "m'en a"], answer: 0 },
    { fr: "Le papier de Ferhat ? Quelqu'un {} écrit à sa place.", en: "Ferhat's note? Someone wrote it in his place.", options: ['y a', "en a", "l'a"], answer: 2 },
  ],
  conclusion: { fr: "Conclusion : la mort de Tiago Ferreira n'était pas un accident. Et « G. » est toujours à Belleville.", en: "Conclusion: Tiago Ferreira's death wasn't an accident. And \"G.\" is still in Belleville." },
  stamp: 'SECRET',
  verdict: [
    { max: 0, line: { s: 'vasseur', fr: 'Clair et précis. Je rouvre le dossier Ferreira demain matin.', en: 'Clear and precise. I am reopening the Ferreira case tomorrow morning.' } },
    { max: 2, line: { s: 'vasseur', fr: 'Ça ira. Je rouvre le dossier. Ne me le faites pas regretter.', en: "That'll do. I'm reopening the case. Don't make me regret it." } },
    { max: 99, line: { s: 'vasseur', e: 'hostile', fr: "Qui, que, dont, inspecteur... Enfin. Je rouvre le dossier quand même.", en: 'Who, that, whose, Inspector... Well. I am reopening the case anyway.' } },
  ],
};
