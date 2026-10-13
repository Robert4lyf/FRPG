import { buildTown, MAP_W, MAP_H, OY, SIGNS } from '../world/town.js';
import { charFrame } from '../world/tiles.js';
import { CAST, CLUES, CHAPTER } from '../story/chapter1.js';
import { NightLighting, gradeCamera } from '../fx/noir.js';
import { FONT_TITLE } from '../ui/theme.js';

const TILE = 16;
const ZOOM = 3;
const SPEED = 62; // a measured walk, not a jog
const REACH = 22; // px between feet to interact
const PLAYER_CHAR = 5;
const LAYERS = ['ground', 'grass', 'water', 'building', 'facade', 'object', 'overhead'];
const SOLID_LAYERS = ['water', 'building', 'object'];
const OPPOSITE = { left: 'right', right: 'left', up: 'down', down: 'up' };

const centre = (t) => t * TILE + TILE / 2;
const tileOf = (px) => Math.floor(px / TILE);
const dirOf = (dx, dy) => (Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('World');
  }

  create() {
    this.busy = true; // the UI releases this after the intro
    this.path = null;
    this.pending = null;
    this.state = this.registry.get('state');

    this.buildMap();
    this.buildCrimeScene();
    this.buildFountain();
    this.buildCharacters();
    this.buildClues();
    this.buildLabels();

    const cam = this.cameras.main;
    cam.setZoom(ZOOM).setBounds(0, 0, MAP_W * TILE, MAP_H * TILE).setRoundPixels(true);
    cam.startFollow(this.player, true, 0.15, 0.15);
    gradeCamera(cam);

    this.lighting = new NightLighting(this, MAP_W * TILE, MAP_H * TILE, this.town.lights);
    // A faint pool around the inspector only; the moonlight keeps everyone else visible.
    this.lighting.follow(this.player, 30, 0.22);

    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
    ['SPACE', 'E', 'ENTER'].forEach((k) => this.input.keyboard.on(`keydown-${k}`, () => this.tryInteract()));
    this.input.on('pointerdown', (p) => this.onTap(p));
  }

  // ---------- setup ----------

  buildMap() {
    this.town = buildTown();
    const map = this.make.tilemap({ tileWidth: TILE, tileHeight: TILE, width: MAP_W, height: MAP_H });
    const tiles = map.addTilesetImage('urban', 'urban', TILE, TILE, 0, 0);
    this.layers = {};
    LAYERS.forEach((name, i) => {
      const layer = map.createBlankLayer(name, tiles);
      const data = this.town.layers[name];
      for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
          const t = data[y * MAP_W + x];
          if (t >= 0) layer.putTileAt(t, x, y);
        }
      }
      layer.setDepth(name === 'overhead' ? 2000 : i);
      this.layers[name] = layer;
    });
    SOLID_LAYERS.forEach((n) => this.layers[n].setCollisionByExclusion([-1]));
    this.physics.world.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
  }

  // A two-tier stone fountain in the middle of the pool, drawn in the tileset's palette,
  // with water arcing from the top and ripples in the basin.
  buildFountain() {
    if (!this.textures.exists('fountain')) {
      const W = 30;
      const H = 40;
      const c = this.textures.createCanvas('fountain', W, H);
      const ctx = c.getContext();
      const px = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); };
      const ellipse = (cx, cy, rx, ry, col) => {
        ctx.fillStyle = col;
        for (let y = -ry; y <= ry; y++) {
          const half = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
          ctx.fillRect(cx - half, cy + y, half * 2, 1);
        }
      };
      const OUT = '#4b4763';
      const DARK = '#7d7896';
      const MID = '#a7a3bd';
      const LIGHT = '#cfcbe0';
      const WATER = '#5fb6e0';
      const WATER_L = '#9fdcf5';
      // Lower basin (sits in the pool)
      ellipse(15, 33, 14, 6, OUT);
      ellipse(15, 32, 13, 5, DARK);
      ellipse(15, 31, 12, 4, MID);
      ellipse(15, 31, 10, 3, WATER);
      px(9, 30, 4, 1, WATER_L); px(18, 32, 3, 1, WATER_L);
      // Column
      px(12, 13, 6, 18, OUT);
      px(13, 13, 4, 18, MID);
      px(13, 13, 1, 18, LIGHT);
      px(16, 13, 1, 18, DARK);
      // Upper bowl
      ellipse(15, 14, 9, 4, OUT);
      ellipse(15, 13, 8, 3, DARK);
      ellipse(15, 12, 7, 2, MID);
      ellipse(15, 12, 5, 1, WATER);
      // Finial / spout
      px(13, 4, 4, 8, OUT);
      px(14, 4, 2, 8, MID);
      px(14, 4, 1, 8, LIGHT);
      ellipse(15, 4, 3, 2, OUT);
      ellipse(15, 4, 2, 1, LIGHT);
      c.refresh();
    }
    if (!this.textures.exists('droplet')) {
      const c = this.textures.createCanvas('droplet', 2, 2);
      c.getContext().fillStyle = '#bfe8ff';
      c.getContext().fillRect(0, 0, 2, 2);
      c.refresh();
    }

    // Centre of the pool (pool spans x 21–26, y 10–13 in street coordinates).
    const fx = 24 * TILE;
    const fy = (12 + OY) * TILE + 4;
    this.add.image(fx, fy, 'fountain').setOrigin(0.5, 0.8).setDepth(10 + fy / 1000);

    // Water from the spout arcing down into the bowl and basin.
    const top = fy - 30;
    this.add.particles(fx, top, 'droplet', {
      speed: { min: 14, max: 30 },
      angle: { min: 200, max: 340 },
      gravityY: 90,
      lifespan: 650,
      quantity: 2,
      frequency: 60,
      alpha: { start: 0.9, end: 0.2 },
      scale: { start: 1, end: 0.5 },
    }).setDepth(10 + fy / 1000 + 0.001);

    // Expanding ripples on the pool around the base.
    const ripples = this.add.graphics().setDepth(2.4);
    const rings = [0, 0.33, 0.66];
    this.events.on('update', (_t, dt) => {
      ripples.clear();
      for (let i = 0; i < rings.length; i++) {
        rings[i] = (rings[i] + dt / 2400) % 1;
        const r = rings[i];
        ripples.lineStyle(1, 0xcdeeff, 0.45 * (1 - r));
        ripples.strokeEllipse(fx, fy + 2, 30 + r * 50, 10 + r * 18);
      }
    });
  }

  // Chalk outline where the body was laid out, and muddy prints from the park.
  buildCrimeScene() {
    const g = this.add.graphics().setDepth(2.5);
    const ox = 22 * TILE + 3;
    const oy = (14 + OY) * TILE + 3;
    g.lineStyle(1, 0xf4f1ea, 0.75);
    g.strokeCircle(ox + 4, oy + 5, 3.5);
    const body = [[8, 3], [11, 3], [14, 0], [16, 1], [13, 4], [21, 3], [29, 3], [35, 1], [41, 2], [41, 4], [32, 5],
      [41, 7], [41, 9], [35, 10], [29, 8], [21, 8], [14, 10], [12, 11], [11, 9], [13, 7], [8, 7]];
    g.beginPath();
    g.moveTo(ox + body[0][0], oy + body[0][1]);
    body.slice(1).forEach(([x, y]) => g.lineTo(ox + x, oy + y));
    g.closePath();
    g.strokePath();

    g.fillStyle(0x2a1f16, 0.75);
    const from = { x: 31 * TILE, y: (13 + OY) * TILE + 6 };
    const to = { x: 27 * TILE + 4, y: (13 + OY) * TILE + 9 };
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const side = i % 2 ? -2 : 2;
      g.fillEllipse(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t + side, 3, 2);
    }
  }

  buildCharacters() {
    const start = CHAPTER.playerStart;
    this.player = this.physics.add.sprite(centre(start.x), centre(start.y + OY), 'urban', charFrame(PLAYER_CHAR, 'up', 0));
    this.player.body.setSize(10, 6).setOffset(3, 10);
    this.player.setCollideWorldBounds(true);
    this.player.char = PLAYER_CHAR;
    this.player.dir = 'up';
    SOLID_LAYERS.forEach((n) => this.physics.add.collider(this.player, this.layers[n]));

    this.people = Object.entries(CAST).map(([id, c]) => {
      const s = this.physics.add.sprite(centre(c.x), centre(c.y + OY), 'urban', charFrame(c.char, 'down', 0));
      s.body.setSize(12, 8).setOffset(2, 8).setImmovable(true);
      Object.assign(s, { kind: 'person', id, info: c, tx: c.x, ty: c.y + OY });
      s.setDepth(10 + s.y / 1000);
      return s;
    });
    this.physics.add.collider(this.player, this.people);

    // People shift their weight and glance around.
    this.time.addEvent({
      delay: 2800, loop: true, callback: () => {
        const s = Phaser.Utils.Array.GetRandom(this.people);
        if (s !== this.talkingTo) s.setFrame(charFrame(s.info.char, Phaser.Utils.Array.GetRandom(['down', 'down', 'left', 'right']), 0));
      },
    });
  }

  buildClues() {
    this.clueSprites = Object.entries(CLUES).map(([id, c]) => {
      const s = this.add.image(centre(c.x), centre(c.y + OY) + 2, 'glint').setDepth(2070);
      Object.assign(s, { kind: 'clue', id, info: c, tx: c.x, ty: c.y + OY });
      s.marker = this.add.image(s.x, s.y + 2, 'marker').setDepth(2.6).setVisible(false);
      this.tweens.add({ targets: s, alpha: { from: 0.25, to: 1 }, scale: { from: 0.7, to: 1.1 }, yoyo: true, repeat: -1, duration: 700, delay: Math.random() * 600 });
      return s;
    });
    this.refreshClues();
  }

  refreshClues() {
    this.clueSprites.forEach((s) => {
      const found = this.state.clues.includes(s.id);
      s.setVisible(!found);
      s.marker.setVisible(found);
    });
  }

  // Text drawn at 3x and scaled down stays crisp under the 3x camera zoom.
  label(x, y, str, style = {}) {
    return this.add.text(x, y, str, {
      fontFamily: FONT_TITLE, fontSize: '21px', color: '#e9e3d5', ...style,
    }).setScale(1 / ZOOM).setOrigin(0.5, 1).setDepth(2100);
  }

  buildLabels() {
    SIGNS.forEach((s) => this.label(s.x * TILE, (s.y + OY) * TILE + 1, s.text, {
      fontSize: '19px', color: '#d9cfb8', backgroundColor: '#0b0b0ecc', padding: { x: 6, y: 2 },
    }).setAlpha(0.8));
    this.tags = this.people.map((s) => this.label(s.x, s.y - 8, s.info.name, {
      fontSize: '18px', color: '#c7b38c', stroke: '#000000', strokeThickness: 5,
    }).setAlpha(0.85));
    this.indicator = this.label(0, 0, '', {
      fontSize: '34px', color: '#e8c547', stroke: '#000000', strokeThickness: 6,
    }).setVisible(false);
    this.tweens.add({ targets: this.indicator, alpha: { from: 1, to: 0.45 }, yoyo: true, repeat: -1, duration: 500 });
  }

  // ---------- input ----------

  inputLocked() {
    return this.busy || this.time.now < (this.registry.get('lockUntil') || 0);
  }

  interactables() {
    return [...this.people, ...this.clueSprites.filter((s) => s.visible)];
  }

  onTap(p) {
    if (this.inputLocked()) return;
    const hit = this.interactables().find((s) => Math.abs(p.worldX - s.x) < 11 && Math.abs(p.worldY - s.y) < 13);
    if (hit) {
      if (this.distanceTo(hit) <= REACH) this.interact(hit);
      else this.walkTo(hit.tx, hit.ty, hit);
      return;
    }
    this.walkTo(tileOf(p.worldX), tileOf(p.worldY));
  }

  tryInteract() {
    if (this.inputLocked()) return;
    const near = this.nearest();
    if (near) this.interact(near);
  }

  // ---------- pathfinding (breadth-first search on the tile grid) ----------

  walkable(x, y) {
    return !this.town.isSolid(x, y) && !this.people.some((s) => s.tx === x && s.ty === y);
  }

  walkTo(gx, gy, target = null) {
    const sx = tileOf(this.player.body.center.x);
    const sy = tileOf(this.player.body.center.y);
    const key = (x, y) => y * MAP_W + x;
    const prev = new Map([[key(sx, sy), null]]);
    const queue = [[sx, sy]];
    let best = [sx, sy];
    let bestD = Infinity;
    // People: stop on a neighbouring tile. Clues: stand on them.
    const score = (x, y) => (target?.kind === 'person'
      ? Math.abs(x - gx) + Math.abs(y - gy) - 1
      : Math.hypot(x - gx, y - gy));
    while (queue.length) {
      const [x, y] = queue.shift();
      const d = score(x, y);
      if (d < bestD) { bestD = d; best = [x, y]; }
      if (d <= 0) break;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (!prev.has(key(nx, ny)) && this.walkable(nx, ny)) {
          prev.set(key(nx, ny), [x, y]);
          queue.push([nx, ny]);
        }
      }
    }
    const path = [];
    for (let c = best; c; c = prev.get(key(c[0], c[1]))) path.unshift(c);
    path.shift();
    this.path = path;
    this.pending = target;
    this.stuckFor = 0;
  }

  // ---------- interaction ----------

  distanceTo(s) {
    const tx = s.body ? s.body.center.x : s.x;
    const ty = s.body ? s.body.center.y : s.y;
    return Phaser.Math.Distance.Between(this.player.body.center.x, this.player.body.center.y, tx, ty);
  }

  nearest() {
    let best = null;
    let bestD = REACH;
    this.interactables().forEach((s) => {
      const d = this.distanceTo(s);
      if (d <= bestD) { bestD = d; best = s; }
    });
    return best;
  }

  async interact(s) {
    this.busy = true;
    this.path = null;
    this.pending = null;
    this.player.setVelocity(0);
    const dir = dirOf(s.x - this.player.x, s.y - this.player.y);
    this.player.dir = dir;
    this.idle();
    this.indicator.setVisible(false);

    const ui = this.scene.get('UI');
    const cam = this.cameras.main;
    const lift = ui.panelHeight() / (2 * ZOOM);
    cam.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE + lift * 2);
    this.tweens.add({ targets: cam.followOffset, y: -lift, duration: 300 });

    if (s.kind === 'person') {
      this.talkingTo = s;
      s.setFrame(charFrame(s.info.char, OPPOSITE[dir], 0));
      await ui.interrogate(s.id);
      this.talkingTo = null;
    } else {
      await ui.examine(s.id);
      this.refreshClues();
    }

    this.tweens.add({
      targets: cam.followOffset, y: 0, duration: 300,
      onComplete: () => cam.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE),
    });
    this.busy = false;
  }

  // ---------- per frame ----------

  idle() {
    this.player.anims.stop();
    this.player.setFrame(charFrame(this.player.char, this.player.dir, 0));
  }

  // If the device struggles, drop the full-screen colour grading (the most expensive effect).
  checkPerformance(dt) {
    if (this.lowQuality) return;
    this.perfTime = (this.perfTime || 0) + dt;
    if (this.perfTime < 6000) return;
    this.perfTime = 0;
    if (this.game.loop.actualFps < 28) {
      this.lowQuality = true;
      this.cameras.main.postFX?.clear();
    }
  }

  update(_t, dt) {
    const p = this.player;
    p.setDepth(10 + p.y / 1000);
    this.lighting.update(dt);
    this.checkPerformance(dt);
    this.lastX = this.prevX;
    this.lastY = this.prevY;
    this.prevX = p.x;
    this.prevY = p.y;

    if (this.busy) {
      p.setVelocity(0);
      if (p.anims.isPlaying) this.idle();
      return;
    }

    const k = this.keys;
    let vx = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.A.isDown);
    let vy = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.W.isDown);

    let speed = SPEED;
    if (vx || vy) {
      this.path = null;
      this.pending = null;
    } else if (this.path) {
      const bx = p.body.center.x;
      const by = p.body.center.y;
      // Drop waypoints we're already on.
      while (this.path.length && Math.hypot(centre(this.path[0][0]) - bx, centre(this.path[0][1]) - by) < 0.75) this.path.shift();
      const next = this.path[0];
      if (next) {
        vx = centre(next[0]) - bx;
        vy = centre(next[1]) - by;
        // Slow down on the final approach so a long (slow) frame lands exactly on the
        // waypoint instead of overshooting it.
        const dist = Math.hypot(vx, vy);
        const maxStep = (SPEED * dt) / 1000;
        if (dist < maxStep) speed = dist / (dt / 1000);
        const moved = Math.hypot(p.x - (this.lastX ?? p.x), p.y - (this.lastY ?? p.y));
        this.stuckFor = moved < 0.2 ? this.stuckFor + dt : 0;
        if (this.stuckFor > 500) this.path = [];
      }
      // Walk finished (or blocked): if we're close enough to the target, interact.
      if (this.path && !this.path.length) {
        this.path = null;
        const target = this.pending;
        this.pending = null;
        vx = 0; vy = 0;
        if (target && this.distanceTo(target) <= REACH + 14) {
          p.setVelocity(0);
          this.interact(target);
          return;
        }
      }
    }

    const len = Math.hypot(vx, vy);
    if (len) {
      p.setVelocity((vx / len) * speed, (vy / len) * speed);
      p.dir = dirOf(vx, vy);
      p.anims.play(`c${p.char}-${p.dir}`, true);
      p.anims.timeScale = 0.85;
    } else {
      p.setVelocity(0);
      this.idle();
    }

    const near = this.nearest();
    this.indicator.setVisible(!!near);
    if (near) {
      this.indicator.setText(near.kind === 'clue' ? '?' : '!');
      this.indicator.setPosition(near.x, near.y - (near.kind === 'clue' ? 6 : 15));
    }
  }
}
