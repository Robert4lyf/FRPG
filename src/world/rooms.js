// Interiors: small rooms entered through doors on the town map. Each room is drawn in
// code (floor, back wall, furniture) in the same 3/4 view and palette as the town.
// Coordinates are room tiles; rows 0–1 are the back wall. `doors` in a room lead back to
// the town; TOWN_DOORS are the entrances on the town map (street tiles, below each door).

export const TILE = 16;

// Entrances in town: x, y = the pavement tile in front of the door.
// locked: flag needed to open it (otherwise a "locked" line plays).
export const TOWN_DOORS = [
  { x: 6, y: 6, room: 'boulangerie', name: 'La boulangerie' },
  { x: 15, y: 6, room: 'cafe', name: 'Le café' },
  { x: 24, y: 6, room: 'mairie', name: 'La mairie' },
  { x: 35, y: 6, room: 'ecole', name: "L'école" },
  { x: 45, y: 6, room: 'appart', name: "L'appartement d'Hélène", locked: 'claire_keys',
    lockedLine: { s: 'narr', fr: "La porte de l'appartement d'Hélène est [[fermée à clé|locked]]. Il me faut les clés.", en: "The door to Hélène's flat is locked. I need the keys." } },
  { x: 51, y: 6, room: 'gendarmerie', name: 'La gendarmerie' },
];

// Furniture: kind, x, y (top-left tile), w, h (tiles it blocks; 0 = blocks nothing).
export const ROOMS = {
  cafe: {
    name: 'Le café', w: 14, h: 9, floor: 'checker', wall: '#5a3a2e', trim: '#2a1a14', ambience: 'cafe',
    furniture: [
      { kind: 'shelf_bottles', x: 1, y: 0, w: 0, h: 0, span: 6 },
      { kind: 'window', x: 9, y: 0, w: 0, h: 0, span: 3 },
      { kind: 'bar', x: 1, y: 4, w: 6, h: 1, span: 6 },
      { kind: 'machine', x: 1, y: 4, w: 0, h: 0 },
      { kind: 'stool', x: 2, y: 5, w: 1, h: 1 }, { kind: 'stool', x: 4, y: 5, w: 1, h: 1 }, { kind: 'stool', x: 6, y: 5, w: 1, h: 1 },
      { kind: 'table', x: 9, y: 4, w: 1, h: 1 }, { kind: 'chair', x: 8, y: 4, w: 1, h: 1 }, { kind: 'chair', x: 10, y: 4, w: 1, h: 1, flip: true },
      { kind: 'table', x: 12, y: 4, w: 1, h: 1 }, { kind: 'chair', x: 11, y: 4, w: 1, h: 1 },
      { kind: 'table', x: 9, y: 7, w: 1, h: 1 }, { kind: 'chair', x: 10, y: 7, w: 1, h: 1, flip: true },
      { kind: 'table', x: 12, y: 7, w: 1, h: 1 }, { kind: 'chair', x: 11, y: 7, w: 1, h: 1 },
      { kind: 'stairs', x: 13, y: 2, w: 1, h: 1 },
      { kind: 'plant', x: 0, y: 7, w: 1, h: 1 },
    ],
    lights: [
      { x: 3.5, y: 3.2, r: 52, kind: 'lamp', hang: true }, { x: 10.5, y: 4.6, r: 46, kind: 'lamp', hang: true },
      { x: 10.5, y: 7.4, r: 40, kind: 'lamp', hang: true }, { x: 10.5, y: 1.2, r: 30, kind: 'window' },
    ],
    doors: [{ x: 7, y: 8, to: { x: 15, y: 6 } }],
  },
  boulangerie: {
    name: 'La boulangerie', w: 11, h: 8, floor: 'tile', wall: '#d8c9a4', trim: '#7a5a34',
    furniture: [
      { kind: 'shelf_bread', x: 1, y: 0, w: 0, h: 0, span: 7 },
      { kind: 'counter_bread', x: 1, y: 3, w: 7, h: 1, span: 7 },
      { kind: 'till', x: 7, y: 3, w: 0, h: 0 },
      { kind: 'oven', x: 9, y: 2, w: 2, h: 1 },
      { kind: 'basket', x: 9, y: 5, w: 1, h: 1 },
    ],
    lights: [{ x: 4.5, y: 3, r: 54, kind: 'lamp', hang: true }, { x: 9.8, y: 2.6, r: 30, kind: 'window' }],
    doors: [{ x: 5, y: 7, to: { x: 6, y: 6 } }],
  },
  mairie: {
    name: 'Le bureau du maire', w: 12, h: 8, floor: 'wood_dark', wall: '#3e4a3c', trim: '#1e2620',
    furniture: [
      { kind: 'bookshelf', x: 1, y: 0, w: 0, h: 0, span: 3 },
      { kind: 'painting', x: 6, y: 0, w: 0, h: 0 },
      { kind: 'window', x: 9, y: 0, w: 0, h: 0, span: 2 },
      { kind: 'rug', x: 3, y: 4, w: 0, h: 0, span: 5 },
      { kind: 'desk', x: 4, y: 3, w: 3, h: 1, span: 3 },
      { kind: 'flag', x: 8, y: 2, w: 1, h: 1 },
      { kind: 'maquette', x: 9, y: 4, w: 2, h: 1, span: 2 },
      { kind: 'plant', x: 1, y: 6, w: 1, h: 1 },
    ],
    lights: [{ x: 5.5, y: 3.4, r: 50, kind: 'lamp', desk: true }, { x: 10, y: 1.2, r: 30, kind: 'window' }],
    doors: [{ x: 6, y: 7, to: { x: 24, y: 6 } }],
  },
  ecole: {
    name: 'La salle de classe', w: 14, h: 9, floor: 'wood', wall: '#c8bf9e', trim: '#5a4a34',
    furniture: [
      { kind: 'blackboard', x: 4, y: 0, w: 0, h: 0, span: 6 },
      { kind: 'window', x: 11, y: 0, w: 0, h: 0, span: 2 },
      { kind: 'desk', x: 6, y: 3, w: 2, h: 1, span: 2 },
      { kind: 'pupil', x: 2, y: 5, w: 1, h: 1 }, { kind: 'pupil', x: 4, y: 5, w: 1, h: 1 },
      { kind: 'pupil', x: 9, y: 5, w: 1, h: 1 }, { kind: 'pupil', x: 11, y: 5, w: 1, h: 1 },
      { kind: 'pupil', x: 2, y: 7, w: 1, h: 1 }, { kind: 'pupil', x: 4, y: 7, w: 1, h: 1 },
      { kind: 'pupil', x: 9, y: 7, w: 1, h: 1 }, { kind: 'pupil', x: 11, y: 7, w: 1, h: 1 },
      { kind: 'globe', x: 1, y: 2, w: 1, h: 1 },
    ],
    lights: [{ x: 7, y: 3.3, r: 46, kind: 'lamp', desk: true }, { x: 12, y: 1.2, r: 34, kind: 'window' }],
    doors: [{ x: 7, y: 8, to: { x: 35, y: 6 } }],
  },
  appart: {
    name: "L'appartement d'Hélène", w: 12, h: 8, floor: 'wood', wall: '#3d5a4a', trim: '#1c2a22',
    furniture: [
      { kind: 'window', x: 5, y: 0, w: 0, h: 0, span: 2, neon: true },
      { kind: 'painting', x: 9, y: 0, w: 0, h: 0 },
      { kind: 'drawers_open', x: 1, y: 2, w: 2, h: 1, span: 2 },
      { kind: 'bed', x: 9, y: 2, w: 2, h: 2 },
      { kind: 'table', x: 5, y: 4, w: 1, h: 1 }, { kind: 'chair', x: 4, y: 4, w: 1, h: 1, fallen: true },
      { kind: 'papers', x: 6, y: 5, w: 0, h: 0 },
      { kind: 'wardrobe', x: 11, y: 4, w: 1, h: 2 },
    ],
    lights: [{ x: 2, y: 2.8, r: 34, kind: 'lamp', desk: true }, { x: 6, y: 1.4, r: 40, kind: 'neon' }],
    doors: [{ x: 6, y: 7, to: { x: 45, y: 6 } }],
  },
  gendarmerie: {
    name: 'La gendarmerie', w: 11, h: 8, floor: 'tile_grey', wall: '#4a5068', trim: '#20242e',
    furniture: [
      { kind: 'noticeboard', x: 1, y: 0, w: 0, h: 0, span: 2 },
      { kind: 'cabinet', x: 7, y: 2, w: 1, h: 1 }, { kind: 'cabinet', x: 8, y: 2, w: 1, h: 1 },
      { kind: 'desk', x: 3, y: 3, w: 2, h: 1, span: 2, bottle: true },
      { kind: 'cell', x: 9, y: 4, w: 2, h: 2, span: 2 },
      { kind: 'coatstand', x: 1, y: 3, w: 1, h: 1 },
    ],
    lights: [{ x: 4, y: 3.3, r: 46, kind: 'lamp', desk: true }],
    doors: [{ x: 5, y: 7, to: { x: 51, y: 6 } }],
  },
};

// ---------- drawing ----------

function canvas(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) return key;
  const c = scene.textures.createCanvas(key, w, h);
  const ctx = c.getContext();
  draw((x, y, ww, hh, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, ww, hh); }, ctx);
  c.refresh();
  return key;
}

const OUT = '#141218';
const WOOD = ['#3a2416', '#5a3a24', '#7a5434', '#9a7048'];
const STONE = ['#3b3850', '#6c6884', '#9692ad', '#bdb9d0'];

// Floor and back wall in one image.
function drawShell(scene, id, room) {
  const W = room.w * TILE;
  const H = room.h * TILE;
  return canvas(scene, `room_${id}`, W, H, (px) => {
    // Floor
    for (let y = 2; y < room.h; y++) {
      for (let x = 0; x < room.w; x++) {
        const X = x * TILE; const Y = y * TILE;
        if (room.floor === 'checker' || room.floor === 'tile' || room.floor === 'tile_grey') {
          const dark = (x + y) % 2 === 0;
          const pal = { checker: ['#cfc4ab', '#2e2824'], tile: ['#d8ccb0', '#bfae8c'], tile_grey: ['#7a7e8c', '#6a6e7a'] }[room.floor];
          px(X, Y, TILE, TILE, dark ? pal[1] : pal[0]);
          px(X, Y, TILE, 1, 'rgba(0,0,0,0.12)'); px(X, Y, 1, TILE, 'rgba(0,0,0,0.12)');
        } else {
          const pal = room.floor === 'wood_dark' ? ['#3a2618', '#4a3220'] : ['#6a4a32', '#7a5838'];
          for (let r = 0; r < 4; r++) {
            px(X, Y + r * 4, TILE, 4, (r + x) % 2 ? pal[0] : pal[1]);
            px(X + ((r * 7 + x * 5) % 16), Y + r * 4, 1, 4, 'rgba(0,0,0,0.25)');
          }
        }
      }
    }
    // Back wall: two rows, wallpaper with a skirting board, dark top edge.
    px(0, 0, W, TILE * 2, room.wall);
    for (let x = 0; x < W; x += 6) px(x, 3, 1, TILE * 2 - 8, 'rgba(255,255,255,0.05)');
    px(0, 0, W, 3, room.trim);
    px(0, TILE * 2 - 4, W, 4, room.trim);
    px(0, TILE * 2, W, 2, 'rgba(0,0,0,0.35)');
    // Side walls and front edge, with the gap of the door.
    px(0, 0, 2, H, OUT); px(W - 2, 0, 2, H, OUT);
    px(0, H - 2, W, 2, OUT);
    room.doors.forEach((d) => {
      px(d.x * TILE, H - 2, TILE, 2, '#5a4a3a');
      px(d.x * TILE + 2, (room.h - 1) * TILE + 4, TILE - 4, TILE - 6, '#4a2e22'); // doormat
      px(d.x * TILE + 3, (room.h - 1) * TILE + 5, TILE - 6, 1, '#6a4432');
    });
  });
}

// One texture per furniture kind (and width). Returns { key, ox, oy } — oy: pixels the
// sprite rises above its footprint (3/4 view).
function furnitureTexture(scene, f) {
  const n = f.span || f.w || 1;
  switch (f.kind) {
    case 'bar': return { key: canvas(scene, `f_bar${n}`, n * 16, 22, (px) => {
      px(0, 0, n * 16, 22, OUT); px(1, 1, n * 16 - 2, 6, WOOD[3]); px(1, 1, n * 16 - 2, 1, '#c09468');
      px(1, 7, n * 16 - 2, 14, WOOD[1]); for (let x = 6; x < n * 16; x += 12) px(x, 9, 1, 10, WOOD[0]);
    }), oy: 6 };
    case 'counter_bread': return { key: canvas(scene, `f_cb${n}`, n * 16, 22, (px) => {
      px(0, 0, n * 16, 22, OUT); px(1, 1, n * 16 - 2, 6, '#e8e0cc');
      for (let x = 3; x < n * 16 - 8; x += 9) { px(x, 2, 7, 3, '#c8883a'); px(x + 1, 2, 5, 1, '#e8b060'); }
      px(1, 7, n * 16 - 2, 14, '#8a6a44'); px(2, 9, n * 16 - 4, 9, '#d8d0bc'); // glass front
      for (let x = 5; x < n * 16 - 8; x += 11) { px(x, 12, 8, 4, '#b87a34'); px(x + 1, 12, 6, 1, '#e0a050'); }
    }), oy: 6 };
    case 'machine': return { key: canvas(scene, 'f_machine', 14, 12, (px) => {
      px(0, 0, 14, 12, OUT); px(1, 1, 12, 10, '#9aa0aa'); px(2, 2, 10, 3, '#c8ccd4'); px(4, 7, 2, 3, '#2a2a30'); px(8, 7, 2, 3, '#2a2a30');
    }), oy: 14, dx: 1 };
    case 'till': return { key: canvas(scene, 'f_till', 12, 9, (px) => {
      px(0, 0, 12, 9, OUT); px(1, 1, 10, 7, '#5a5048'); px(2, 2, 8, 2, '#9adc8a'); px(2, 5, 8, 2, '#3a3430');
    }), oy: 12, dx: 2 };
    case 'stool': return { key: canvas(scene, 'f_stool', 10, 12, (px) => {
      px(1, 0, 8, 4, OUT); px(2, 1, 6, 2, '#8a2a2a'); px(4, 4, 2, 8, OUT); px(1, 11, 8, 1, OUT);
    }), oy: 0, dx: 3 };
    case 'table': return { key: canvas(scene, 'f_table', 16, 16, (px) => {
      px(1, 2, 14, 6, OUT); px(2, 3, 12, 4, WOOD[3]); px(2, 3, 12, 1, '#c09468'); px(7, 8, 2, 7, OUT); px(3, 14, 10, 2, OUT);
    }), oy: 4 };
    case 'chair': return { key: canvas(scene, f.fallen ? 'f_chair_fallen' : 'f_chair', 12, 14, (px) => {
      if (f.fallen) { px(0, 8, 12, 3, OUT); px(1, 9, 10, 1, WOOD[2]); px(2, 11, 2, 3, OUT); px(8, 11, 2, 3, OUT); return; }
      px(2, 0, 2, 13, OUT); px(2, 6, 8, 3, OUT); px(3, 7, 6, 1, WOOD[2]); px(8, 9, 2, 5, OUT); px(3, 1, 1, 5, WOOD[1]);
    }), oy: 0, dx: 2, flip: f.flip };
    case 'stairs': return { key: canvas(scene, 'f_stairs', 16, 30, (px) => {
      px(0, 0, 16, 30, OUT);
      for (let i = 0; i < 6; i++) { px(1, 1 + i * 5, 14, 4, i % 2 ? WOOD[2] : WOOD[3]); px(1, 4 + i * 5, 14, 1, WOOD[0]); }
    }), oy: 14 };
    case 'plant': return { key: canvas(scene, 'f_plant', 12, 18, (px) => {
      px(3, 12, 6, 6, '#7a4a30'); px(2, 11, 8, 2, OUT);
      [[5, 0], [2, 3], [7, 3], [1, 7], [8, 7], [4, 5]].forEach(([x, y]) => { px(x, y, 3, 5, '#2e6a3a'); px(x, y, 1, 3, '#4a9a5a'); });
    }), oy: 2, dx: 2 };
    case 'shelf_bottles': case 'shelf_bread': case 'bookshelf': return { key: canvas(scene, `f_${f.kind}${n}`, n * 16, 26, (px) => {
      px(0, 0, n * 16, 26, OUT); px(1, 1, n * 16 - 2, 24, WOOD[1]);
      [4, 12, 20].forEach((y) => px(1, y + 4, n * 16 - 2, 2, WOOD[3]));
      for (let x = 2; x < n * 16 - 3; x += 3) {
        [0, 8, 16].forEach((y, r) => {
          if (f.kind === 'shelf_bottles') { const col = ['#3a6a3a', '#7a2a2a', '#c8a050', '#5a3a6a'][(x + r) % 4]; px(x, y + 2, 2, 6, col); px(x, y + 2, 1, 1, '#e8e8e8'); }
          else if (f.kind === 'shelf_bread') { if (x % 6 === 2) { px(x, y + 4, 5, 3, '#c8883a'); px(x + 1, y + 4, 3, 1, '#e8b060'); } }
          else { px(x, y + 1 + (x % 2), 2, 7 - (x % 2), ['#6a2a2a', '#2a3a6a', '#3a5a3a', '#7a6a3a'][(x + r) % 4]); }
        });
      }
    }), oy: 0, wall: true };
    case 'window': return { key: canvas(scene, `f_window${n}${f.neon ? 'n' : ''}`, n * 16, 22, (px) => {
      px(0, 0, n * 16, 22, OUT); px(2, 2, n * 16 - 4, 18, f.neon ? '#123020' : '#14203c');
      for (let i = 0; i < 9; i++) px(4 + ((i * 7) % (n * 16 - 8)), 3 + ((i * 5) % 14), 1, 3, 'rgba(160,190,230,0.35)');
      if (f.neon) { px(n * 8 - 3, 6, 6, 2, '#5dff8f'); px(n * 8 - 1, 4, 2, 6, '#5dff8f'); }
      else px(n * 8 - 2, 8, 3, 3, '#ffcf6a');
      px(n * 8 - 1, 2, 2, 18, OUT); px(2, 10, n * 16 - 4, 1, OUT);
    }), oy: -4, wall: true };
    case 'painting': return { key: canvas(scene, 'f_painting', 16, 12, (px) => {
      px(0, 0, 16, 12, '#8a6a2a'); px(2, 2, 12, 8, '#2a3a4a'); px(3, 6, 10, 3, '#3a5a3a'); px(9, 3, 3, 3, '#c8a050');
    }), oy: -6, wall: true };
    case 'noticeboard': return { key: canvas(scene, `f_notice${n}`, n * 16, 14, (px) => {
      px(0, 0, n * 16, 14, '#5a3a24'); px(1, 1, n * 16 - 2, 12, '#a8845a');
      [[3, 2], [10, 3], [18, 2], [24, 5], [6, 7]].forEach(([x, y]) => { if (x < n * 16 - 6) { px(x, y, 6, 6, '#e8e4dc'); px(x + 2, y, 1, 1, '#c82a2a'); } });
    }), oy: -6, wall: true };
    case 'blackboard': return { key: canvas(scene, `f_board${n}`, n * 16, 20, (px) => {
      px(0, 0, n * 16, 20, '#6a4a2a'); px(2, 2, n * 16 - 4, 15, '#1e3a2a');
      for (let i = 0; i < 5; i++) px(6 + i * 3, 5 + i * 2, 20 + ((i * 13) % 30), 1, 'rgba(230,230,220,0.55)');
      px(2, 17, n * 16 - 4, 2, '#8a6a4a');
    }), oy: -4, wall: true };
    case 'desk': return { key: canvas(scene, `f_desk${n}${f.bottle ? 'b' : ''}`, n * 16, 24, (px) => {
      px(0, 4, n * 16, 20, OUT); px(1, 5, n * 16 - 2, 5, WOOD[3]); px(1, 5, n * 16 - 2, 1, '#c09468');
      px(1, 10, n * 16 - 2, 13, WOOD[1]); px(2, 12, 10, 4, WOOD[2]); px(n * 16 - 12, 12, 10, 4, WOOD[2]);
      px(6, 13, 2, 1, '#c8a050'); px(n * 16 - 8, 13, 2, 1, '#c8a050');
      px(4, 2, 10, 4, '#e8e4dc'); // papers
      if (f.bottle) { px(n * 16 - 9, 0, 3, 6, '#3a5a2a'); px(n * 16 - 8, 0, 1, 1, '#c8a050'); px(n * 16 - 14, 3, 3, 3, '#c8c8d0'); }
      px(n * 16 - 5, 0, 2, 5, OUT); px(n * 16 - 7, 0, 6, 2, '#2a5a3a'); // lamp
    }), oy: 8 };
    case 'drawers_open': return { key: canvas(scene, `f_drawers${n}`, n * 16, 24, (px) => {
      px(0, 0, n * 16, 22, OUT); px(1, 1, n * 16 - 2, 20, WOOD[1]);
      [2, 9].forEach((y, i) => { px(2, y, n * 16 - 4, 6, WOOD[2]); if (i === 1) { px(0, y + 2, n * 16, 8, OUT); px(1, y + 3, n * 16 - 2, 6, WOOD[3]); px(4, y + 3, 8, 2, '#e8e4dc'); } });
      px(6, 22, 9, 2, '#e8e4dc'); px(17, 23, 6, 1, '#e8e4dc'); // papers spilled on the floor
    }), oy: 8 };
    case 'bed': return { key: canvas(scene, 'f_bed', 32, 34, (px) => {
      px(0, 0, 32, 34, OUT); px(1, 1, 30, 6, WOOD[2]); px(2, 7, 28, 25, '#d8d2c4'); px(2, 7, 28, 6, '#ece8de');
      px(2, 16, 28, 16, '#5a7a6a'); px(2, 16, 28, 1, '#7a9a8a'); px(1, 32, 30, 2, WOOD[1]);
    }), oy: 2 };
    case 'wardrobe': return { key: canvas(scene, 'f_wardrobe', 16, 40, (px) => {
      px(0, 0, 16, 40, OUT); px(1, 1, 14, 38, WOOD[1]); px(7, 2, 1, 36, WOOD[0]); px(5, 18, 1, 3, '#c8a050'); px(10, 18, 1, 3, '#c8a050');
    }), oy: 8 };
    case 'papers': return { key: canvas(scene, 'f_papers', 18, 8, (px) => {
      px(0, 2, 7, 5, '#e8e4dc'); px(6, 0, 7, 5, '#dcd6c8'); px(11, 3, 7, 5, '#e8e4dc'); px(1, 4, 5, 1, '#8a8478');
    }), oy: -2, flat: true };
    case 'rug': return { key: canvas(scene, `f_rug${n}`, n * 16, 26, (px) => {
      px(0, 0, n * 16, 26, '#5a1e1e'); px(2, 2, n * 16 - 4, 22, '#7a2a2a'); px(4, 4, n * 16 - 8, 18, '#5a1e1e'); px(6, 6, n * 16 - 12, 14, '#8a3a2a');
    }), oy: 0, flat: true };
    case 'flag': return { key: canvas(scene, 'f_flag', 14, 28, (px) => {
      px(1, 0, 2, 28, '#c8a050'); px(3, 2, 3, 12, '#2a3a8a'); px(6, 2, 3, 12, '#ece8e0'); px(9, 2, 3, 12, '#b82a2a'); px(0, 26, 4, 2, OUT);
    }), oy: 12, dx: 1 };
    case 'maquette': return { key: canvas(scene, `f_maq${n}`, n * 16, 20, (px) => {
      px(0, 6, n * 16, 14, OUT); px(1, 7, n * 16 - 2, 3, '#4a7a3a'); px(1, 10, n * 16 - 2, 9, WOOD[1]);
      [[3, 0, 5, 8], [10, 2, 4, 6], [16, 1, 6, 7], [24, 3, 4, 5]].forEach(([x, y, w, h]) => { if (x + w < n * 16) { px(x, y, w, h, '#ece8e0'); px(x, y, w, 1, '#ffffff'); px(x + 1, y + 2, 1, 1, '#8a8a9a'); } });
    }), oy: 6 };
    case 'pupil': return { key: canvas(scene, 'f_pupil', 14, 16, (px) => {
      px(0, 2, 14, 6, OUT); px(1, 3, 12, 3, WOOD[3]); px(2, 8, 2, 7, OUT); px(10, 8, 2, 7, OUT); px(3, 3, 5, 2, '#e8e4dc');
    }), oy: 2, dx: 1 };
    case 'globe': return { key: canvas(scene, 'f_globe', 12, 18, (px) => {
      px(2, 0, 8, 8, OUT); px(3, 1, 6, 6, '#3a6a9a'); px(4, 2, 2, 3, '#4a8a4a'); px(5, 8, 2, 6, '#8a6a3a'); px(2, 14, 8, 3, '#5a3a24');
    }), oy: 2, dx: 2 };
    case 'oven': return { key: canvas(scene, 'f_oven', 32, 26, (px) => {
      px(0, 0, 32, 26, OUT); px(1, 1, 30, 24, '#8a4a34'); px(6, 8, 20, 12, '#1a0a06'); px(8, 12, 16, 6, '#e86a2a'); px(10, 13, 12, 3, '#ffb04a');
      for (let x = 2; x < 30; x += 5) px(x, 2, 4, 3, '#9a5a40');
    }), oy: 10 };
    case 'basket': return { key: canvas(scene, 'f_basket', 14, 12, (px) => {
      px(0, 4, 14, 8, OUT); px(1, 5, 12, 6, '#a8844a'); [[2, 0], [5, 1], [8, 0]].forEach(([x, y]) => { px(x, y, 3, 7, '#c8883a'); px(x, y, 1, 3, '#e8b060'); });
    }), oy: 0, dx: 1 };
    case 'cabinet': return { key: canvas(scene, 'f_cabinet', 14, 26, (px) => {
      px(0, 0, 14, 26, OUT); px(1, 1, 12, 24, '#6a6e7a'); [3, 10, 17].forEach((y) => { px(2, y, 10, 6, '#8a8e9a'); px(6, y + 2, 2, 1, '#2a2a30'); });
    }), oy: 10, dx: 1 };
    case 'cell': return { key: canvas(scene, `f_cell${n}`, n * 16, 34, (px) => {
      px(0, 0, n * 16, 34, 'rgba(10,10,14,0.5)'); px(0, 0, n * 16, 2, OUT); px(0, 32, n * 16, 2, OUT);
      for (let x = 1; x < n * 16; x += 4) px(x, 0, 1, 34, '#8a8e9a');
    }), oy: 2 };
    case 'coatstand': return { key: canvas(scene, 'f_coat', 12, 28, (px) => {
      px(5, 2, 2, 24, OUT); px(2, 25, 8, 2, OUT); px(1, 3, 10, 1, OUT); px(3, 4, 6, 12, '#233058'); px(3, 0, 6, 3, '#233058'); px(4, 1, 4, 1, '#b8a25a');
    }), oy: 12, dx: 2 };
    default: return null;
  }
}

// Builds a room into the scene. Returns what WorldScene needs: size, isSolid, lights.
export function buildRoom(scene, id) {
  const room = ROOMS[id];
  const solid = new Set();
  for (let x = 0; x < room.w; x++) { solid.add(`${x},0`); solid.add(`${x},1`); }
  scene.add.image(0, 0, drawShell(scene, id, room)).setOrigin(0).setDepth(0);
  room.furniture.forEach((f) => {
    const t = furnitureTexture(scene, f);
    if (!t) return;
    for (let dx = 0; dx < (f.w || 0); dx++) for (let dy = 0; dy < (f.h || 0); dy++) solid.add(`${f.x + dx},${f.y + dy}`);
    const x = f.x * TILE + (t.dx || 0);
    const footH = Math.max(1, f.h || 1) * TILE;
    const tex = scene.textures.get(t.key).getSourceImage();
    // Wall pieces hang centred on the back wall; everything else stands on its footprint.
    const bottom = t.wall ? Math.max(3, Math.round((2 * TILE - tex.height) / 2) - 1) + tex.height : f.y * TILE + footH;
    const img = scene.add.image(x, bottom, t.key).setOrigin(0, 1);
    if (t.flip) img.setFlipX(true);
    img.setDepth(t.wall || t.flat ? 1 : 10 + bottom / 1000);
  });
  // Lights: px coordinates for NightLighting. Hanging lamps get a shade drawn above.
  const lights = room.lights.map((l) => {
    const lx = l.x * TILE; const ly = l.y * TILE;
    if (l.hang) {
      const g = scene.add.graphics().setDepth(2002);
      g.lineStyle(1, 0x141218, 1).lineBetween(lx, 0, lx, ly - 18);
      g.fillStyle(0x2a4a3a, 1).fillTriangle(lx - 5, ly - 13, lx + 5, ly - 13, lx, ly - 19);
      g.fillStyle(0x141218, 1).fillRect(lx - 5, ly - 13, 10, 1);
    }
    return {
      x: lx, y: ly + (l.hang ? 4 : 0), radius: l.r, kind: l.kind,
      bulbs: l.hang ? [{ x: lx, y: ly - 12, r: 3 }] : l.desk ? [{ x: lx + 4, y: ly - 14, r: 3 }] : [],
    };
  });
  const isSolid = (x, y) => x < 0 || y < 0 || x >= room.w || y >= room.h || solid.has(`${x},${y}`);
  return { room, w: room.w, h: room.h, isSolid, lights, solid };
}
