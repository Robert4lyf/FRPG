// Rain-soaked streets and the police car at the crime scene.
const TILE = 16;

function makeTextures(scene) {
  const tex = scene.textures;

  // Reflection of a light on wet paving: broken horizontal strokes, fading downwards.
  if (!tex.exists('streak')) {
    const c = tex.createCanvas('streak', 16, 48);
    const ctx = c.getContext();
    for (let y = 0; y < 48; y += 2) {
      const t = y / 48;
      const w = Math.round(16 * (1 - t * 0.6) * (0.55 + 0.45 * Math.abs(Math.sin(y * 1.7))));
      ctx.fillStyle = `rgba(255,255,255,${(1 - t) * 0.9})`;
      ctx.fillRect(Math.round((16 - w) / 2), y, w, 1);
    }
    c.refresh();
  }

  // Puddle: dark, slightly glossy pool with a pale rim on the far edge.
  if (!tex.exists('puddle')) {
    const c = tex.createCanvas('puddle', 40, 16);
    const ctx = c.getContext();
    const blob = (cx, cy, rx, ry, col) => {
      ctx.fillStyle = col;
      for (let y = -ry; y <= ry; y++) {
        const half = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
        ctx.fillRect(cx - half, cy + y, half * 2, 1);
      }
    };
    // Mostly sky reflection (a cool sheen) with a darker wet edge, so it reads as water.
    blob(20, 8, 18, 6, 'rgba(20,30,60,0.28)');
    blob(13, 9, 10, 5, 'rgba(20,30,60,0.18)');
    blob(20, 8, 16, 4, 'rgba(120,150,205,0.22)');
    blob(24, 7, 7, 2, 'rgba(170,195,235,0.22)');
    ctx.fillStyle = 'rgba(210,225,250,0.45)';
    ctx.fillRect(9, 3, 14, 1);
    ctx.fillRect(26, 4, 5, 1);
    c.refresh();
  }

  // Raindrop splash: a tiny broken ring.
  if (!tex.exists('splash')) {
    const c = tex.createCanvas('splash', 7, 3);
    const ctx = c.getContext();
    ctx.fillStyle = 'rgba(210,225,245,1)';
    ctx.fillRect(1, 0, 2, 1); ctx.fillRect(4, 0, 2, 1);
    ctx.fillRect(0, 1, 1, 1); ctx.fillRect(6, 1, 1, 1);
    ctx.fillRect(2, 2, 3, 1);
    c.refresh();
  }

  // Rotating beacon beam: a soft wedge pointing right from its origin.
  if (!tex.exists('beam')) {
    const c = tex.createCanvas('beam', 160, 64);
    const ctx = c.getContext();
    const g = ctx.createLinearGradient(0, 0, 160, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 30); ctx.lineTo(160, 0); ctx.lineTo(160, 64); ctx.lineTo(0, 34);
    ctx.closePath();
    ctx.fill();
    c.refresh();
  }

  // French police car in the tileset's 3/4 view: the pack's red car (seen from behind),
  // repainted white with a blue band, navy trim and a roof light bar.
  if (!tex.exists('policecar')) {
    const src = scene.textures.get('urban').getSourceImage();
    const c = tex.createCanvas('policecar', 32, 32);
    const ctx = c.getContext();
    [[447, 0, 0], [448, 16, 0], [474, 0, 16], [475, 16, 16]].forEach(([t, dx, dy]) => {
      ctx.drawImage(src, (t % 27) * 16, Math.floor(t / 27) * 16, 16, 16, dx, dy, 16, 16);
    });
    const img = ctx.getImageData(0, 0, 32, 32);
    const d = img.data;
    const map = { dc615d: [232, 230, 239], c2504d: [201, 200, 214], a54240: [150, 150, 170], '742c34': [27, 35, 64] };
    const hex = (o) => [d[o], d[o + 1], d[o + 2]].map((v) => v.toString(16).padStart(2, '0')).join('');
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const o = (y * 32 + x) * 4;
        if (!d[o + 3]) continue;
        const h = hex(o);
        let col = map[h];
        // Blue band along the body (rows 20-21), red pinstripe below it.
        if ((h === 'dc615d' || h === 'c2504d') && (y === 20 || y === 21)) col = [37, 70, 168];
        if ((h === 'dc615d' || h === 'c2504d') && y === 22) col = [184, 40, 48];
        if (col) [d[o], d[o + 1], d[o + 2]] = col;
      }
    }
    ctx.putImageData(img, 0, 0);
    // Light bar on the roof.
    const px = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); };
    px(13, 8, 8, 3, '#1b2340');
    px(14, 9, 3, 1, '#3a6cff');
    px(17, 9, 1, 1, '#d9d9e6');
    px(18, 9, 2, 1, '#3a6cff');
    c.refresh();
  }
}

// lights: from the town (pool centre x/y in px, kind, bulbs)
export function buildWetStreets(scene, lights, puddles, OY) {
  makeTextures(scene);
  const colour = { lamp: 0xffb020, window: 0xff9428, flood: 0xffdc8a };

  // Puddles on the paving (below people and props).
  puddles.forEach(([x, y, s = 1]) => {
    scene.add.image(x * TILE, (y + OY) * TILE, 'puddle').setScale(s).setDepth(2.3);
  });

  // Shimmering reflections of lamps and windows on the wet ground.
  const reflections = lights.filter((l) => l.kind !== 'flood').map((l) => {
    const win = l.kind === 'window' && l.bulbs[0]?.w;
    const w = win ? l.bulbs[0].w : 10;
    const img = scene.add.image(l.x, l.y + (win ? -4 : 6), 'streak')
      .setOrigin(0.5, 0)
      .setScale(w / 16, win ? 0.55 : 0.75)
      .setTint(colour[l.kind])
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.3)
      .setDepth(2058);
    return { img, base: w / 16 };
  });
  scene.time.addEvent({
    delay: 90, loop: true, callback: () => {
      reflections.forEach((r) => {
        r.img.scaleX = r.base * (0.85 + Math.random() * 0.3);
        r.img.alpha = 0.22 + Math.random() * 0.14;
      });
    },
  });

  // Raindrops splashing on the ground across the visible area.
  const cam = scene.cameras.main;
  const zone = new Phaser.Geom.Rectangle(0, 0, 10, 10);
  scene.add.particles(0, 0, 'splash', {
    emitZone: { type: 'random', source: zone },
    lifespan: 260,
    scale: { start: 0.4, end: 1.1 },
    alpha: { start: 0.55, end: 0 },
    quantity: 2,
    frequency: 35,
  }).setDepth(2.6);
  scene.events.on('update', () => {
    const v = cam.worldView;
    zone.setTo(v.x, v.y, v.width, v.height);
  });
}

// Police car parked at (x, y) street tiles (covers x and x+1), with a rotating blue beacon.
export function buildPoliceCar(scene, x, y, OY) {
  makeTextures(scene);
  const cx = (x + 1) * TILE;
  const bottom = (y + 1 + OY) * TILE;
  scene.add.image(cx, bottom, 'policecar').setOrigin(0.5, 1).setDepth(10 + bottom / 1000);

  const roof = { x: cx + 1, y: bottom - 23 };
  const beam = scene.add.image(roof.x, roof.y, 'beam')
    .setOrigin(0, 0.5).setTint(0x3c6bff).setAlpha(0.22)
    .setBlendMode(Phaser.BlendModes.ADD).setDepth(2062);
  const glow = scene.add.image(roof.x, roof.y + 8, 'light')
    .setScale(110 / 128).setTint(0x2f5cff).setAlpha(0)
    .setBlendMode(Phaser.BlendModes.ADD).setDepth(2061);
  const bulb = scene.add.image(roof.x, roof.y, 'light')
    .setScale(12 / 128).setTint(0x9fb8ff).setAlpha(1)
    .setBlendMode(Phaser.BlendModes.ADD).setDepth(2066);

  scene.events.on('update', (t) => {
    const a = (t / 1800) * Math.PI * 2;
    beam.setRotation(a);
    // The car's surroundings pulse blue each time the beam swings past the front.
    const pulse = Math.max(0, Math.cos(a)) ** 6;
    glow.setAlpha(0.08 + 0.2 * pulse);
    bulb.setAlpha(0.5 + 0.5 * pulse);
  });

  // Solid body for collisions (the lower part of the car, where its wheels meet the ground).
  const body = scene.physics.add.staticImage(cx, bottom - 6, undefined).setVisible(false);
  body.body.setSize(30, 12);
  return body;
}
