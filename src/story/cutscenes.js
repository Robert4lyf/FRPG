// Opening cutscenes: still images with a slow camera move and narration along the bottom.
// Each shot: img (assets/cutscenes/<img>.jpg, 1536x1024), move from/to {x, y, zoom}
// (x, y = point of the image kept at the centre of the screen, 0–1; zoom 1 = image just
// covers the screen), and the narration lines shown while it plays.
// Until an image is in READY, a dark placeholder with its description is shown instead.
import { INTRO, NIGHT } from './chapter1.js';
import { INTRO2 } from './chapter2.js';

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
};
