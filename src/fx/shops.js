// Shop dressing drawn in code: awnings, window displays and pavement furniture,
// so the boulangerie, café and pharmacie each read as what they are.
const TILE = 16;

function canvas(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) return;
  const c = scene.textures.createCanvas(key, w, h);
  const ctx = c.getContext();
  const px = (x, y, ww, hh, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, ww, hh); };
  draw(ctx, px);
  c.refresh();
}

// Striped awning, 52 x 11, with a scalloped edge.
function awning(scene, key, a, b) {
  canvas(scene, key, 52, 11, (ctx, px) => {
    px(0, 0, 52, 2, '#1a1a22');
    for (let x = 0; x < 52; x += 4) px(x, 2, 4, 6, (x / 4) % 2 ? b : a);
    px(0, 7, 52, 1, 'rgba(0,0,0,0.35)');
    for (let x = 0; x < 52; x += 4) {
      const col = (x / 4) % 2 ? b : a;
      px(x, 8, 4, 1, col);
      px(x + 1, 9, 2, 1, col);
    }
  });
}

function makeTextures(scene) {
  awning(scene, 'awning_boul', '#b5303a', '#efe6d6');
  awning(scene, 'awning_cafe', '#2f5d45', '#e8dfc8');

  // Boulangerie window: shelf of round loaves and croissants, a basket of baguettes,
  // and a gold wheat sheaf painted on the glass.
  canvas(scene, 'win_boul', 48, 32, (ctx, px) => {
    const CRUST = '#b8732e';
    const CRUST_D = '#7e4a1c';
    const CRUST_L = '#e2a75a';
    const GOLD = '#e6c04a';
    // wheat sheaf
    px(23, 4, 2, 6, GOLD); px(21, 4, 1, 3, GOLD); px(26, 4, 1, 3, GOLD);
    px(20, 3, 1, 2, GOLD); px(27, 3, 1, 2, GOLD); px(22, 9, 4, 1, '#a8862c');
    // shelf
    px(4, 14, 40, 1, '#5a3a22');
    // round loaves
    [[8, 12], [15, 12], [33, 12], [40, 12]].forEach(([x, y]) => {
      px(x - 3, y - 1, 6, 3, CRUST); px(x - 2, y - 2, 4, 1, CRUST); px(x - 2, y - 1, 3, 1, CRUST_L);
      px(x - 3, y + 1, 6, 1, CRUST_D);
    });
    // croissants
    [[21, 13], [27, 13]].forEach(([x, y]) => {
      px(x - 3, y - 1, 6, 2, CRUST_L); px(x - 4, y, 1, 1, CRUST); px(x + 3, y, 1, 1, CRUST);
      px(x - 1, y - 1, 1, 2, CRUST_D); px(x + 1, y - 1, 1, 2, CRUST_D);
    });
    // basket of baguettes
    [[12, 17], [15, 16], [18, 17], [30, 17], [33, 16], [36, 17]].forEach(([x, y]) => {
      px(x, y, 2, 8, CRUST_L); px(x, y, 1, 8, CRUST);
      px(x + 1, y + 2, 1, 1, CRUST_D); px(x + 1, y + 5, 1, 1, CRUST_D);
    });
    [[9, 23], [27, 23]].forEach(([x, y]) => {
      px(x, y, 13, 3, '#6b4423'); px(x, y, 13, 1, '#8a5a30');
      for (let k = 1; k < 13; k += 3) px(x + k, y + 1, 1, 2, '#4d2f17');
    });
  });

  // Café window: a steaming cup and an espresso machine, and the silhouettes of
  // a man in a hat with a newspaper and a woman at the counter.
  canvas(scene, 'win_cafe', 48, 32, (ctx, px) => {
    const SIL = 'rgba(20,14,10,0.85)';
    // espresso machine
    px(5, 9, 10, 6, '#8d8a94'); px(5, 9, 10, 1, '#c9c5cf'); px(7, 15, 2, 2, '#3a3840'); px(11, 15, 2, 2, '#3a3840');
    // cup and steam
    px(34, 11, 6, 4, '#f1ece2'); px(40, 12, 1, 2, '#f1ece2'); px(33, 15, 8, 1, '#c9c2b4');
    px(35, 7, 1, 2, 'rgba(255,255,255,0.6)'); px(37, 6, 1, 3, 'rgba(255,255,255,0.6)'); px(39, 7, 1, 2, 'rgba(255,255,255,0.6)');
    // man in a hat reading a newspaper
    px(12, 18, 6, 1, SIL); px(13, 16, 4, 2, SIL); // hat
    px(13, 19, 4, 3, SIL); // head
    px(11, 22, 8, 6, SIL); // shoulders
    px(17, 20, 7, 6, '#d8d2c0'); px(18, 22, 5, 1, '#8e887a'); px(18, 24, 4, 1, '#8e887a'); // newspaper
    // woman at the counter
    px(31, 18, 4, 4, SIL); px(30, 17, 6, 2, SIL); // head and hair
    px(29, 22, 8, 6, SIL);
    // counter
    px(26, 27, 18, 1, '#5a3a22');
  });

  // Bistro table with two rattan chairs (one tile).
  canvas(scene, 'bistro', 16, 16, (ctx, px) => {
    const RAT = '#9a6a3a';
    const RAT_D = '#6a4424';
    // chairs
    [[1, 6], [12, 6]].forEach(([x, y]) => {
      px(x, y, 3, 6, RAT_D); px(x, y, 3, 4, RAT); px(x, y + 6, 1, 3, RAT_D); px(x + 2, y + 6, 1, 3, RAT_D);
    });
    // table
    px(4, 6, 8, 3, '#d8d6dc'); px(4, 8, 8, 1, '#9e9ca6'); px(7, 9, 2, 5, '#55535e'); px(5, 14, 6, 1, '#55535e');
    px(6, 6, 2, 1, '#f1ece2'); // a cup
  });

  // A-frame chalkboard.
  canvas(scene, 'chalkboard', 12, 16, (ctx, px) => {
    px(1, 1, 10, 11, '#6b4423'); px(2, 2, 8, 9, '#23262a');
    px(3, 3, 5, 1, '#e8e4dc'); px(3, 5, 6, 1, '#cfc9be'); px(3, 7, 4, 1, '#cfc9be'); px(3, 9, 5, 1, '#e8c87a');
    px(1, 12, 1, 4, '#6b4423'); px(10, 12, 1, 4, '#6b4423');
  });

  // "FERMÉ" card hanging in the window: cream card, red border, pixel lettering.
  canvas(scene, 'ferme', 25, 13, (ctx, px) => {
    px(7, 0, 1, 3, '#cfc9be'); px(17, 0, 1, 3, '#cfc9be'); // strings
    px(0, 3, 25, 10, '#9e2a2f'); px(1, 4, 23, 8, '#efe8d6');
    const glyph = {
      F: ['111', '100', '110', '100', '100'],
      E: ['111', '100', '110', '100', '111'],
      R: ['110', '101', '110', '101', '101'],
      M: ['101', '111', '101', '101', '101'],
    };
    let x = 3;
    ['F', 'E', 'R', 'M', 'E'].forEach((ch, i) => {
      glyph[ch].forEach((row, y) => [...row].forEach((bit, k) => { if (bit === '1') px(x + k, 6 + y, 1, 1, '#1d1b1a'); }));
      if (i === 4) px(x + 1, 4, 1, 1, '#1d1b1a'); // accent on É
      x += 4;
    });
  });

  // Police tape crossed over a door: red and white stripes, sagging slightly.
  canvas(scene, 'tape', 22, 21, (ctx, px) => {
    const strip = (x0, y0, x1, y1) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const sag = Math.sin(t * Math.PI) * 1.5;
        const x = Math.round(x0 + (x1 - x0) * t);
        const y = Math.round(y0 + (y1 - y0) * t + sag);
        const col = Math.floor(i / 3) % 2 ? '#f2efe8' : '#c7303a';
        px(x, y, 1, 3, col);
      }
    };
    strip(0, 2, 21, 15);
    strip(0, 15, 21, 3);
  });

  // Pharmacy cross on a wall bracket.
  canvas(scene, 'pharmacross', 12, 12, (ctx, px) => {
    px(4, 0, 4, 12, '#1d3a24'); px(0, 4, 12, 4, '#1d3a24');
    px(5, 1, 2, 10, '#5dff8f'); px(1, 5, 10, 2, '#5dff8f');
  });
}

// OY: rows of rooftop above the street (see world/town.js).
export function buildShopDressing(scene, OY) {
  makeTextures(scene);
  const at = (x, y) => [x * TILE, (y + OY) * TILE];

  // Boulangerie (shopfront tiles 2–4) and café (tiles 11–13): façade rows 4–5.
  [['boul', 2], ['cafe', 11]].forEach(([k, x]) => {
    const [wx, wy] = at(x, 4);
    scene.add.image(wx, wy, `win_${k}`).setOrigin(0).setDepth(4.5);
    scene.add.image(wx - 2, wy - 3, `awning_${k}`).setOrigin(0).setDepth(6);
  });

  // Café terrace and boards.
  [[11, 6], [13, 6]].forEach(([x, y]) => {
    const [px, py] = at(x, y);
    scene.add.image(px + 8, py + 16, 'bistro').setOrigin(0.5, 1).setDepth(10 + (py + 16) / 1000);
  });
  [[14, 6], [5, 6]].forEach(([x, y]) => {
    const [px, py] = at(x, y);
    scene.add.image(px + 8, py + 15, 'chalkboard').setOrigin(0.5, 1).setDepth(10 + (py + 15) / 1000);
  });

  // Pharmacie: green cross on the wall beside the door.
  const [cx, cy] = at(44, 4);
  const cross = scene.add.image(cx + 8, cy + 7, 'pharmacross').setDepth(4.6);
  // Closed since the murder: a card in the window and tape across the door (door tile 45, row 5).
  const [fx, fy] = at(41, 5);
  scene.add.image(fx + 24, fy + 1, 'ferme').setOrigin(0.5, 0).setDepth(4.7);
  const [dx, dy] = at(45, 5);
  scene.add.image(dx + 8, dy + 1, 'tape').setOrigin(0.5, 0).setDepth(4.8);
  return { cross };
}

// Tiles the dressing blocks (street coordinates).
export const SHOP_BLOCKS = [[11, 6], [13, 6], [14, 6], [5, 6]];
