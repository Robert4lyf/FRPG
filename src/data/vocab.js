// Vocabulary grouped by topic. Each NPC quizzes one topic.
export const VOCAB = {
  food: [
    { fr: 'le pain', en: 'bread' },
    { fr: 'le fromage', en: 'cheese' },
    { fr: 'la pomme', en: 'apple' },
    { fr: "l'eau", en: 'water' },
    { fr: 'le gâteau', en: 'cake' },
    { fr: 'le lait', en: 'milk' },
  ],
  greetings: [
    { fr: 'bonjour', en: 'hello' },
    { fr: 'au revoir', en: 'goodbye' },
    { fr: 'merci', en: 'thank you' },
    { fr: "s'il vous plaît", en: 'please' },
    { fr: 'bonsoir', en: 'good evening' },
    { fr: 'à bientôt', en: 'see you soon' },
  ],
  colours: [
    { fr: 'rouge', en: 'red' },
    { fr: 'bleu', en: 'blue' },
    { fr: 'vert', en: 'green' },
    { fr: 'jaune', en: 'yellow' },
    { fr: 'noir', en: 'black' },
    { fr: 'blanc', en: 'white' },
  ],
  shopping: [
    { fr: 'combien ?', en: 'how much?' },
    { fr: "l'argent", en: 'money' },
    { fr: 'cher', en: 'expensive' },
    { fr: 'le magasin', en: 'shop' },
    { fr: 'acheter', en: 'to buy' },
    { fr: 'le sac', en: 'bag' },
  ],
};

export const NPCS = [
  { x: 5, y: 3, name: 'Boulanger', topic: 'food', greeting: 'Bonjour ! Du pain ?', body: 0xfff1e8, hair: 0x5f574f },
  { x: 19, y: 5, name: 'Garde', topic: 'greetings', greeting: 'Halte ! Bonjour.', body: 0x29adff, hair: 0x222034 },
  { x: 7, y: 10, name: 'Lucie', topic: 'colours', greeting: "J'adore les couleurs !", body: 0xff77a8, hair: 0xffa300 },
  { x: 14, y: 14, name: 'Marchand', topic: 'shopping', greeting: 'Bienvenue au marché !', body: 0xffec27, hair: 0x7e2553 },
];
