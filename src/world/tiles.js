// Tile indices in assets/tiles/urban.png (Kenney RPG Urban Pack, 27 columns of 16x16 tiles).
// 9-slice sets are [TL, T, TR, L, C, R, BL, B, BR].
export const T = {
  grass9: [0, 1, 2, 27, 28, 29, 54, 55, 56],
  paving9: [8, 9, 10, 35, 36, 37, 62, 63, 64],
  water9: [170, 171, 172, 197, 198, 199, 224, 225, 226],
  roofTan9: [81, 82, 83, 108, 109, 110, 135, 136, 137],
  roofGrey9: [89, 90, 91, 116, 117, 118, 143, 144, 145],
  paving: 36,
  grass: 28,
  road: 441,
  roadTop: 406,
  roadBottom: 460,
  roadDash: 433,
  crossing: [405, 432, 459],
  hedge: [328, 329, 330],

  // Façades: [left, middle, right] per row, top row then bottom row.
  brickRed: [[71, 72, 73], [98, 99, 100]],
  brickOrange: [[179, 180, 181], [206, 207, 208]],

  door: 283,
  doubleDoor: 284,
  glassDoor: 285,
  window: 336,
  windowWide: 363,
  shopTop: [359, 360, 361],
  shopBottom: [386, 387, 388],

  treeTop: 232,
  treeTrunk: 259,
  treeAutumnTop: 313,
  treeAutumnTrunk: 340,
  bush: 265,
  bench: 381,
  barrier: [221, 222],
  bin: 279,
  mailbox: 305,
  planterRed: 276,
  planterGreen: 277,
  crates: [301, 302, 303, 304],
  fenceRow: [382, 383, 384],
  lampTop: 165,
  lampPole: 192,
  signTop: 166,
  signPole: 193,
};

// Character sprites: 6 characters, 3 rows each (stand, step A, step B),
// 4 columns starting at column 23 (left, down, up, right).
export const CHAR_COLS = { left: 0, down: 1, up: 2, right: 3 };
export const charFrame = (charIdx, dir, step) => (charIdx * 3 + step) * 27 + 23 + CHAR_COLS[dir];
