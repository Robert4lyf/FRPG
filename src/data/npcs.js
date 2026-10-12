// Townspeople. x/y are street tile coordinates (see world/town.js).
// char: sprite 1-5 from the urban pack (0 is the player).
export const NPCS = [
  {
    id: 'maire', name: 'Le maire', char: 2, x: 24, y: 7, topic: 'salutations',
    greeting: 'Bonjour ! Bienvenue à Belleville.', greetingEn: "Hello! Welcome to Belleville. I'm the mayor. Let's practise greetings.",
  },
  {
    id: 'boulangere', name: 'La boulangère', char: 1, x: 6, y: 7, topic: 'boulangerie',
    greeting: 'Bonjour ! Qu\'est-ce que vous désirez ?', greetingEn: 'Hello! What would you like? (Bakery words)',
  },
  {
    id: 'serveur', name: 'Le serveur', char: 3, x: 15, y: 7, topic: 'cafe',
    greeting: 'Bonjour ! Une table pour une personne ?', greetingEn: 'Hello! A table for one? (Café words)',
  },
  {
    id: 'maitresse', name: 'La maîtresse', char: 5, x: 35, y: 7, topic: 'nombres',
    greeting: 'Bonjour ! On compte ensemble ?', greetingEn: "Hello! Shall we count together? I'm the teacher.",
  },
  {
    id: 'pharmacien', name: 'Le pharmacien', char: 4, x: 45, y: 7, topic: 'corps',
    greeting: 'Bonjour ! Où avez-vous mal ?', greetingEn: 'Hello! Where does it hurt? (Body words)',
  },
  {
    id: 'marchande', name: 'La marchande', char: 1, x: 6, y: 13, topic: 'marche',
    greeting: 'Des fruits et des légumes frais !', greetingEn: 'Fresh fruit and vegetables!',
  },
  {
    id: 'peintre', name: 'Le peintre', char: 3, x: 35, y: 12, topic: 'couleurs',
    greeting: "J'adore les couleurs du parc !", greetingEn: "I love the park's colours! I'm a painter.",
  },
  {
    id: 'gendarme', name: 'Le gendarme', char: 4, x: 24, y: 16, topic: 'directions',
    greeting: 'Bonjour ! Vous êtes perdu ?', greetingEn: 'Hello! Are you lost? (Directions)',
  },
  {
    id: 'chauffeur', name: 'Le chauffeur', char: 2, x: 23, y: 26, topic: 'transport',
    greeting: 'Le bus arrive bientôt !', greetingEn: "The bus is coming soon! I'm the driver.",
  },
  {
    id: 'jardiniere', name: 'La jardinière', char: 5, x: 39, y: 21, topic: 'meteo',
    greeting: "Quel temps fait-il aujourd'hui ?", greetingEn: "What's the weather like today? I'm the gardener.",
  },
];

export const PLAYER = { char: 0, x: 24, y: 19 };
