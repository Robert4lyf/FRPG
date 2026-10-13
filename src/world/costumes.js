// Noir costumes made by recolouring the urban pack's six base characters.
// base: character index in urban.png. map: source hex -> target hex.
// cap: paint a cap/kepi over the top rows of the head ({ fill, edge, band }).
const SKIN_OUTLINE = '8d5243';

export const COSTUMES = {
  // Charcoal fedora with a brim, tan trench coat, dark trousers.
  inspector: {
    base: 4,
    map: { aaa8bd: 'a0845a', '898ca6': '82683f', '60605a': '2a2824', '54544e': '201e1b' },
    cap: { fill: '3d3a36', edge: '1c1a18', band: '1c1a18', rows: 5, brim: true },
  },
  // Gendarme: navy uniform and kepi.
  dubois: {
    base: 4,
    map: { aaa8bd: '2f3e6e', '898ca6': '233058', '60605a': '161c33', '54544e': '11162a' },
    cap: { fill: '233058', edge: '0e1428', band: 'b8a25a', rows: 4 },
  },
  // Gardener: the builder's hard hat becomes an olive flat cap; brown work clothes.
  lebrun: {
    base: 3,
    map: {
      f5a94c: '6b7543', da923e: '5b6638', bc7d36: '48522b',
      '918eb9': '6a5644', '7a77a4': '544333',
    },
  },
  // Waiter: white shirt, black trousers, dark hair.
  theo: {
    base: 0,
    map: { '42a379': 'e6e1d6', '369069': 'bdb7aa', d6d4aa: '26262c', c5b993: '1c1c22' },
  },
  // Bus driver: grey hair and beard kept, blue-grey uniform.
  garnier: {
    base: 2,
    map: { '42a379': '3d4a5e', '369069': '2f3a4b' },
  },
  // Mayor: charcoal suit, silver hair.
  delacroix: {
    base: 2,
    map: { '42a379': '2b2b33', '369069': '1f1f26', '5c6278': '7d8090', a09cca: 'c9cbd6', '7a77a4': 'a3a6b4' },
  },
  // The sister: black, with a dark red band.
  claire: {
    base: 5,
    map: { ff7143: '8f2a2a', c77b47: '2c2c34', a9673b: '1f1f26', aaa8bd: '3a3a44' },
  },
  // Baker: cream apron over brown.
  roux: {
    base: 1,
    map: { c2504d: 'e3dac6', a54240: 'c2b8a2', a09cca: '6a5240', '7a77a4': '57422f' },
  },
};

// Builds a 'cast' texture: per costume, 3 rows (stand, step A, step B) x 4 columns
// (left, down, up, right) of 16x16 frames. Frame number = (costume * 3 + step) * 4 + dir.
export const COSTUME_IDS = Object.keys(COSTUMES);
export const DIRS = { left: 0, down: 1, up: 2, right: 3 };
export const castFrame = (id, dir, step) => (COSTUME_IDS.indexOf(id) * 3 + step) * 4 + DIRS[dir];

export function buildCastTexture(scene) {
  const src = scene.textures.get('urban').getSourceImage();
  const n = COSTUME_IDS.length;
  const tex = scene.textures.createCanvas('cast', 64, n * 48);
  const ctx = tex.getContext();
  const hex = (r, g, b) => [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  const rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));

  COSTUME_IDS.forEach((id, k) => {
    const c = COSTUMES[id];
    for (let step = 0; step < 3; step++) {
      for (let d = 0; d < 4; d++) {
        const i = (c.base * 3 + step) * 27 + 23 + d;
        ctx.drawImage(src, (i % 27) * 16, Math.floor(i / 27) * 16, 16, 16, d * 16, (k * 3 + step) * 16, 16, 16);
      }
    }
    const img = ctx.getImageData(0, k * 48, 64, 48);
    const px = img.data;
    for (let p = 0; p < px.length; p += 4) {
      if (!px[p + 3]) continue;
      const to = c.map[hex(px[p], px[p + 1], px[p + 2])];
      if (to) [px[p], px[p + 1], px[p + 2]] = rgb(to);
    }
    if (c.cap) {
      // Paint the top rows of each head as a cap, keeping the silhouette.
      for (let fy = 0; fy < 3; fy++) {
        for (let fx = 0; fx < 4; fx++) {
          let top = -1;
          for (let y = 0; y < 16 && top < 0; y++) {
            for (let x = 0; x < 16; x++) if (px[(((fy * 16 + y) * 64) + fx * 16 + x) * 4 + 3]) { top = y; break; }
          }
          for (let y = top; y < top + c.cap.rows; y++) {
            for (let x = 0; x < 16; x++) {
              const o = (((fy * 16 + y) * 64) + fx * 16 + x) * 4;
              if (!px[o + 3]) continue;
              const isEdge = hex(px[o], px[o + 1], px[o + 2]) === SKIN_OUTLINE;
              const col = y === top + c.cap.rows - 1 && !isEdge ? c.cap.band : (isEdge ? c.cap.edge : c.cap.fill);
              [px[o], px[o + 1], px[o + 2]] = rgb(col);
            }
          }
          if (c.cap.brim) {
            // Widen the last row by a pixel each side for a hat brim.
            const y = top + c.cap.rows - 1;
            const row = (x) => (((fy * 16 + y) * 64) + fx * 16 + x) * 4;
            let l = -1; let r = -1;
            for (let x = 0; x < 16; x++) if (px[row(x) + 3]) { if (l < 0) l = x; r = x; }
            [l - 1, r + 1].forEach((x) => {
              if (x < 0 || x > 15) return;
              const o = row(x);
              [px[o], px[o + 1], px[o + 2]] = rgb(c.cap.edge);
              px[o + 3] = 255;
            });
          }
        }
      }
    }
    ctx.putImageData(img, 0, k * 48);
  });
  tex.refresh();
  for (let f = 0; f < n * 12; f++) tex.add(f, 0, (f % 4) * 16, Math.floor(f / 4) * 16, 16, 16);
}
