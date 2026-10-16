// Opening cutscenes: still images with a slow camera move and narration along the bottom.
// Each shot: img (assets/cutscenes/<img>.jpg, 1536x1024), move from/to {x, y, zoom}
// (x, y = point of the image kept at the centre of the screen, 0–1; zoom 1 = image just
// covers the screen), and the narration lines shown while it plays.
// Until an image is in READY, a dark placeholder with its description is shown instead.
import { INTRO, NIGHT } from './chapter1.js';
import { INTRO2 } from './chapter2.js';
import { INTRO3, NIGHT3 } from './chapter3.js';

// Images that exist in assets/cutscenes/. Add an id here when its file is added.
export const READY = [
  'p1_bureau', 'p2_photo', 'p3_bus', 'c1_chambre', 'c1_place', 'c1_porte', 'c2_cimetiere', 'c2_lanternes', 'c2_carnet',
];

export const CUTSCENES = {
  prologue: [
    {
      img: 'p1_bureau', alt: 'Lyon, night. A police office, rain on the window, a letter under a desk lamp.',
      move: { from: { x: 0.5, y: 0.42, zoom: 1.0 }, to: { x: 0.49, y: 0.55, zoom: 1.5 } },
      lines: INTRO.slice(0, 2),
    },
    {
      img: 'p2_photo', alt: 'An old photo: two children throwing coins into a fountain.',
      move: { from: { x: 0.36, y: 0.52, zoom: 1.6 }, to: { x: 0.5, y: 0.48, zoom: 1.0 } },
      lines: INTRO.slice(2, 4),
    },
    {
      img: 'p3_bus', alt: 'A bus on a wet country road at night, headlights in the rain.',
      move: { from: { x: 0.24, y: 0.5, zoom: 1.15 }, to: { x: 0.7, y: 0.38, zoom: 1.15 } },
      lines: INTRO.slice(4),
    },
  ],
  ch1: [
    {
      img: 'c1_chambre', alt: 'A small room above the café. A man asleep in his coat. Rain on the window.',
      move: { from: { x: 0.42, y: 0.4, zoom: 1.25 }, to: { x: 0.76, y: 0.35, zoom: 1.25 } },
      lines: NIGHT.slice(0, 1),
    },
    {
      img: 'c1_place', alt: 'The square from above at midnight. Two figures by the fountain in the rain.',
      move: { from: { x: 0.5, y: 0.42, zoom: 1.0 }, to: { x: 0.44, y: 0.52, zoom: 1.7 } },
      lines: NIGHT.slice(1, 3),
    },
    {
      img: 'c1_porte', alt: 'Before dawn. A door opening, a man silhouetted against the corridor light.',
      move: { from: { x: 0.47, y: 0.33, zoom: 1.5 }, to: { x: 0.5, y: 0.5, zoom: 1.0 } },
      lines: NIGHT.slice(3),
    },
  ],
  ch2: [
    {
      img: 'c2_cimetiere', alt: 'A village cemetery at dusk. Chrysanthemums and candles on the graves.',
      move: { from: { x: 0.22, y: 0.5, zoom: 1.15 }, to: { x: 0.55, y: 0.45, zoom: 1.35 } },
      lines: INTRO2.slice(0, 2),
    },
    {
      img: 'c2_lanternes', alt: 'The square at night, paper lanterns over the street, people under umbrellas.',
      move: { from: { x: 0.5, y: 0.18, zoom: 1.4 }, to: { x: 0.5, y: 0.62, zoom: 1.1 } },
      lines: INTRO2.slice(2, 3),
    },
    {
      img: 'c2_carnet', alt: 'A notebook open on a café table: times and names, a cold coffee, lantern light.',
      move: { from: { x: 0.45, y: 0.45, zoom: 1.05 }, to: { x: 0.82, y: 0.5, zoom: 1.45 } },
      lines: INTRO2.slice(3),
    },
  ],
  ch3: [
    {
      img: 'c3_juge', alt: 'Dawn in the empty café. A woman in a grey coat waits at a table, a file open in front of her.',
      move: { from: { x: 0.5, y: 0.45, zoom: 1.0 }, to: { x: 0.55, y: 0.48, zoom: 1.4 } },
      lines: INTRO3.slice(0, 2),
    },
    {
      img: 'c3_pierre', alt: 'A stone on the floorboards among broken glass, a note tied round it.',
      move: { from: { x: 0.5, y: 0.5, zoom: 1.5 }, to: { x: 0.5, y: 0.5, zoom: 1.05 } },
      lines: INTRO3.slice(2, 3),
    },
    {
      img: 'c3_brouillard', alt: 'The park in fog at first light: a bench, an old oak with a hollow trunk.',
      move: { from: { x: 0.3, y: 0.5, zoom: 1.15 }, to: { x: 0.6, y: 0.48, zoom: 1.3 } },
      lines: INTRO3.slice(3),
    },
  ],
  // Mid-chapter 3: the night Ferhat dies.
  ch3_nuit: [
    {
      img: 'c3_nuit', alt: 'The square at night, thick fog, one street lamp, the café window dark.',
      move: { from: { x: 0.5, y: 0.4, zoom: 1.2 }, to: { x: 0.5, y: 0.55, zoom: 1.0 } },
      lines: NIGHT3.slice(0, 1),
    },
    {
      img: 'c3_etang', alt: 'The pond at dawn in fog. Torch beams, two gendarmes on the bank, a flat cap floating.',
      move: { from: { x: 0.35, y: 0.45, zoom: 1.0 }, to: { x: 0.55, y: 0.6, zoom: 1.5 } },
      lines: NIGHT3.slice(1),
    },
  ],
};
