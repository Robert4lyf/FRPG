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

  // French police car, side-on with the roof visible (the same 3/4 angle as the characters),
  // facing right: white body, blue band, dark windows, roof light bar.
  if (!tex.exists('policecar')) {
    const W = 46;
    const H = 28;
    const c = tex.createCanvas('policecar', W, H);
    const ctx = c.getContext();
    const px = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); };
    const OUT = '#141a2e';
    const BODY = '#e9e7f0';
    const SHADE = '#b9b8c9';
    const ROOF = '#f6f5fa';
    const GLASS = '#26324d';
    const GLASS_HI = '#5d6f96';
    const BLUE = '#2546a8';
    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(23, 25, 21, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Cabin (greenhouse) with slanted windscreen and rear window
    px(12, 5, 21, 1, OUT);
    px(11, 6, 24, 1, OUT);
    px(10, 7, 27, 6, OUT);
    px(13, 6, 19, 1, ROOF); // roof plane seen from above
    px(12, 7, 22, 1, ROOF);
    px(12, 8, 6, 4, GLASS); px(19, 8, 7, 4, GLASS); px(27, 8, 8, 4, GLASS); // windows
    px(12, 8, 6, 1, GLASS_HI); px(19, 8, 7, 1, GLASS_HI); px(27, 8, 8, 1, GLASS_HI);
    px(18, 8, 1, 4, BODY); px(26, 8, 1, 4, BODY); // pillars
    px(35, 8, 2, 4, GLASS); // windscreen edge
    // Body
    px(3, 12, 41, 1, OUT);
    px(2, 13, 43, 9, OUT);
    px(3, 13, 41, 2, ROOF); // bonnet and boot tops
    px(3, 15, 41, 6, BODY);
    px(3, 20, 41, 1, SHADE);
    px(3, 17, 41, 2, BLUE); // blue band
    px(3, 19, 41, 1, '#c22d36'); // red pinstripe
    px(21, 14, 1, 7, SHADE); // door line
    px(43, 15, 1, 2, '#fff1b8'); // headlight
    px(3, 15, 1, 2, '#c22d36'); // tail light
    // Wheels
    [[11, 21], [34, 21]].forEach(([wx, wy]) => {
      px(wx - 4, wy - 1, 9, 6, OUT);
      px(wx - 3, wy - 2, 7, 8, OUT);
      px(wx - 2, wy, 5, 3, '#4b5064');
      px(wx - 1, wy + 1, 2, 1, '#9aa0b4');
    });
    // Light bar on the roof
    px(19, 3, 9, 3, OUT);
    px(20, 4, 3, 1, '#3a6cff'); px(23, 4, 1, 1, '#d9d9e6'); px(24, 4, 3, 1, '#3a6cff');
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

  const roof = { x: cx + 0.5, y: bottom - 24 };
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
  body.body.setSize(32, 10); // exactly its two tiles, so pathfinding and collision agree
  return body;
}
