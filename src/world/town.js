import { T } from './tiles.js';

// Builds the town as plain arrays of tile indices (-1 = empty), so it can be
// previewed outside the browser and loaded into a Phaser tilemap.
//   ground   : paving and road
//   grass    : grass areas (drawn over paving)
//   water    : fountain and pond (solid)
//   building : roofs and walls (all solid)
//   facade   : doors, windows, shopfronts drawn over walls
//   object   : props at player level (all solid)
//   overhead : drawn above the player (tree tops, lamp heads)
// Layout coordinates below are 'street' coordinates. The map has OY extra rows of
// rooftops along the top so the camera can show the north street fully during dialogue.
export const MAP_W = 48;
export const OY = 4;
export const MAP_H = 36 + OY;

// Shop signs (street coords, in tiles; drawn by the world scene).
export const SIGNS = [
  { x: 5, y: 4, text: 'BOULANGERIE' },
  { x: 13.5, y: 4, text: 'CAFÉ' },
  { x: 24.5, y: 4, text: 'MAIRIE' },
  { x: 36, y: 4, text: 'ÉCOLE' },
  { x: 44, y: 4, text: 'PHARMACIE' },
  { x: 6, y: 10.4, text: 'MARCHÉ' },
  { x: 39, y: 9, text: 'PARC' },
  { x: 21.5, y: 24.4, text: 'ARRÊT DE BUS' },
];

export function buildTown() {
  const layer = () => new Array(MAP_W * MAP_H).fill(-1);
  const L = { ground: layer(), grass: layer(), water: layer(), building: layer(), facade: layer(), object: layer(), overhead: layer() };
  const inBounds = (x, y) => x >= 0 && y >= 0 && x < MAP_W && y < MAP_H;
  // set/get take street coords; physical row = y + OY.
  const put = (name, x, y, t) => { if (inBounds(x, y)) L[name][y * MAP_W + x] = t; };
  const set = (name, x, y, t) => put(name, x, y + OY, t);
  const get = (name, x, y) => (inBounds(x, y + OY) ? L[name][(y + OY) * MAP_W + x] : -1);
  const fill = (name, x0, y0, w, h, t) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) set(name, x, y, t);
  };
  const nine = (name, x0, y0, w, h, s) => {
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        const row = y === y0 ? 0 : y === y0 + h - 1 ? 2 : 1;
        const col = x === x0 ? 0 : x === x0 + w - 1 ? 2 : 1;
        set(name, x, y, s[row * 3 + col]);
      }
    }
  };
  const tree = (x, y, autumn = false) => {
    set('object', x, y, autumn ? T.treeAutumnTrunk : T.treeTrunk);
    set('overhead', x, y - 1, autumn ? T.treeAutumnTop : T.treeTop);
  };
  // Light sources in world pixels (physical rows), used by the night lighting.
  const lights = [];
  const props = []; // drawn by the world scene; each blocks its tile
  // bulbs: glowing points/rects at the source, in street tile coords ({x, y, r} or {x, y, w, h}).
  const light = (x, y, radius, kind, bulbs = []) => lights.push({
    x: x * 16, y: (y + OY) * 16, radius, kind,
    bulbs: bulbs.map((b) => ({ ...b, x: b.x * 16, y: (b.y + OY) * 16, w: b.w && b.w * 16, h: b.h && b.h * 16 })),
  });
  // Lamp: pole at (x, y), T-shaped head with a bulb at each end of the arm, one tile up.
  // The pool falls on the ground around the foot of the pole, slightly forward.
  const lamp = (x, y) => {
    set('object', x, y, T.lampPole); set('overhead', x, y - 1, T.lampTop);
    light(x + 0.5, y + 0.35, 58, 'lamp', [
      { x: x + 3.5 / 16, y: y - 1 + 4 / 16, r: 5 },
      { x: x + 12.5 / 16, y: y - 1 + 4 / 16, r: 5 },
    ]);
  };
  const sign = (x, y) => { set('object', x, y, T.signPole); set('overhead', x, y - 1, T.signTop); };

  // Building: roof of `roofH` rows, then a 2-row façade.
  // doors/windows: [{x (offset), y: 0 top row | 1 bottom row, t}]
  const building = ({ x, y, w, roofH = 4, roof = T.roofTan9, brick = T.brickRed, parts = [] }) => {
    nine('building', x, y, w, roofH, roof);
    brick.forEach((row, r) => {
      for (let i = 0; i < w; i++) {
        const col = i === 0 ? 0 : i === w - 1 ? 2 : 1;
        set('building', x + i, y + roofH + r, row[col]);
      }
    });
    parts.forEach((p) => set('facade', x + p.x, y + roofH + p.y, p.t));
  };
  const shopfront = (dx) => [0, 1, 2].flatMap((i) => [
    { x: dx + i, y: 0, t: T.shopTop[i] },
    { x: dx + i, y: 1, t: T.shopBottom[i] },
  ]);

  // Ground
  fill('ground', 0, -OY, MAP_W, MAP_H, T.paving);

  // Rear rooftops behind the north street
  [[0, 12, T.roofGrey9], [12, 14, T.roofTan9], [26, 12, T.roofGrey9], [38, 10, T.roofTan9]]
    .forEach(([x, w, roof]) => nine('building', x, -OY, w, OY, roof));

  // North street: boulangerie, café, mairie, école, pharmacie
  building({ x: 1, y: 0, w: 8, brick: T.brickRed, parts: [...shopfront(1), { x: 5, y: 1, t: T.door }, { x: 5, y: 0, t: T.window }, { x: 6, y: 0, t: T.window }] });
  building({ x: 10, y: 0, w: 7, roof: T.roofGrey9, brick: T.brickOrange, parts: [...shopfront(1), { x: 5, y: 1, t: T.glassDoor }, { x: 5, y: 0, t: T.window }] });
  building({
    x: 19, y: 0, w: 11, roof: T.roofGrey9, brick: T.brickRed,
    parts: [1, 3, 7, 9].flatMap((dx) => [{ x: dx, y: 0, t: T.window }, { x: dx, y: 1, t: T.window }])
      .concat([{ x: 5, y: 1, t: T.doubleDoor }, { x: 5, y: 0, t: T.windowWide }]),
  });
  building({ x: 32, y: 0, w: 8, brick: T.brickOrange, parts: [{ x: 1, y: 0, t: T.window }, { x: 2, y: 0, t: T.window }, { x: 5, y: 0, t: T.window }, { x: 6, y: 0, t: T.window }, { x: 3, y: 1, t: T.doubleDoor }, { x: 1, y: 1, t: T.window }, { x: 6, y: 1, t: T.window }] });
  building({ x: 41, y: 0, w: 6, roof: T.roofGrey9, brick: T.brickRed, parts: [...shopfront(0), { x: 4, y: 1, t: T.glassDoor }, { x: 4, y: 0, t: T.window }] });

  // Lit windows: the café and the bakery are open before dawn; a lamp burns in the mairie.
  light(3.5, 6.5, 46, 'window', [{ x: 2 + 3 / 16, y: 4 + 3 / 16, w: 3 - 6 / 16, h: 1.6 }]);
  light(12.5, 6.5, 48, 'window', [{ x: 11 + 3 / 16, y: 4 + 3 / 16, w: 3 - 6 / 16, h: 1.6 }]);
  light(24.5, 6.3, 30, 'window', [{ x: 24 + 3 / 16, y: 4 + 2 / 16, w: 10 / 16, h: 12 / 16 }]);

  // Street furniture along the north pavement
  [9, 18, 31, 40].forEach((x) => lamp(x, 7));
  set('object', 0, 6, T.planterRed); set('object', 47, 6, T.planterGreen);
  set('object', 17, 6, T.bin); set('object', 30, 6, T.mailbox);

  // Market (west): two rows of crates with a gap for the stallholder
  for (let x = 2; x <= 9; x++) {
    set('object', x, 11, T.crates[x % 4]);
    set('object', x, 15, T.crates[(x + 2) % 4]);
  }
  set('object', 2, 13, T.planterGreen); set('object', 9, 13, T.planterRed);

  // Plaza fountain with benches and lamps
  nine('water', 21, 10, 6, 4, T.water9);
  [19, 28].forEach((x) => { set('object', x, 11, T.bench); lamp(x, 14); });
  set('object', 18, 15, T.bin);

  // Crime scene: police barriers and a floodlight on the south side of the fountain
  set('object', 20, 17, T.barrier[0]); set('object', 27, 17, T.barrier[1]);
  // Police floodlight on a tripod, left of the body, aimed at the chalk outline.
  props.push({ kind: 'floodlight', x: 20, y: 15 });
  // Police car parked beside the scene (two tiles wide).
  props.push({ kind: 'policecar', x: 15, y: 17 }, { kind: 'block', x: 16, y: 17 });
  light(23, 14.7, 58, 'flood', [{ x: 20.5 + 5 / 16, y: 15 - 6 / 16, r: 6 }]);

  // Park (east) with pond, trees and benches
  nine('grass', 31, 9, 16, 16, T.grass9);
  nine('water', 36, 15, 7, 5, T.water9);
  [[32, 11], [45, 11], [32, 22], [45, 22], [39, 11], [34, 17], [44, 17]].forEach(([x, y], i) => tree(x, y, i % 3 === 1));
  set('object', 37, 13, T.bench); set('object', 41, 13, T.bench);
  set('object', 38, 22, T.bush); set('object', 40, 22, T.bush);

  // South-west garden
  nine('grass', 3, 17, 11, 6, T.grass9);
  [[5, 19], [11, 19]].forEach(([x, y], i) => tree(x, y, i === 1));
  set('object', 8, 20, T.bench); set('object', 4, 21, T.bush); set('object', 12, 21, T.bush);

  // Planters and trees between plaza and road
  [[20, 20], [27, 20]].forEach(([x, y]) => tree(x, y));
  [17, 30].forEach((x) => set('object', x, 22, T.planterRed));

  // West edge trees and south hedge line
  [9, 12, 17, 20, 23].forEach((y, i) => tree(0, y, i % 2 === 1));
  for (let x = 1; x <= 15; x += 3) {
    set('object', x, 24, T.hedge[0]); set('object', x + 1, 24, T.hedge[2]);
  }

  // Road with dashed centre line and two zebra crossings
  for (let x = 0; x < MAP_W; x++) {
    set('ground', x, 27, T.roadTop);
    set('ground', x, 28, x % 2 ? T.roadDash : T.road);
    set('ground', x, 29, T.roadBottom);
  }
  [12, 34].forEach((x) => T.crossing.forEach((t, i) => set('ground', x, 27 + i, t)));
  sign(21, 26);
  lamp(8, 26); lamp(28, 26); lamp(44, 26);

  // South side: rooftops only (their fronts face away from the player)
  building({ x: 0, y: 31, w: 11, roofH: 5, roof: T.roofGrey9, brick: [] });
  building({ x: 14, y: 31, w: 18, roofH: 5, roof: T.roofTan9, brick: [] });
  building({ x: 35, y: 31, w: 13, roofH: 5, roof: T.roofGrey9, brick: [] });

  // Physical coords (as used by the tilemap and pathfinding).
  const isSolid = (x, y) => !inBounds(x, y)
    || L.building[y * MAP_W + x] !== -1
    || L.object[y * MAP_W + x] !== -1
    || L.water[y * MAP_W + x] !== -1
    || props.some((p) => p.x === x && p.y + OY === y);

  // Puddles: [x, y, scale] in street tiles.
  const puddles = [
    [22, 18, 1], [27.5, 16, 0.8], [14, 9, 1.1], [10.5, 7.6, 0.8], [33.5, 8.2, 0.9],
    [18.5, 21, 0.9], [29, 23.5, 1], [6, 28.6, 1.2], [26, 29.3, 1], [41, 28.4, 0.9], [44.5, 7.8, 0.8],
  ];

  return { layers: L, isSolid, lights, props, puddles };
}
