import { buildTown, MAP_W, MAP_H, OY, SIGNS } from '../world/town.js';
import { charFrame } from '../world/tiles.js';
import { NPCS, PLAYER } from '../data/npcs.js';
import { TOPICS } from '../data/topics.js';
import { FONT } from './BootScene.js';

const TILE = 16;
const ZOOM = 3;
const SPEED = 72;
const REACH = 22; // px between feet to start a conversation
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
    this.busy = false;
    this.path = null;
    this.pendingTalk = null;
    this.progress = this.registry.get('progress');

    this.buildMap();
    this.buildCharacters();
    this.buildLabels();

    const cam = this.cameras.main;
    cam.setZoom(ZOOM).setBounds(0, 0, MAP_W * TILE, MAP_H * TILE).setRoundPixels(true);
    cam.startFollow(this.player, true, 0.2, 0.2);

    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
    ['SPACE', 'E', 'ENTER'].forEach((k) => this.input.keyboard.on(`keydown-${k}`, () => this.tryTalk()));
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

  buildCharacters() {
    this.player = this.physics.add.sprite(centre(PLAYER.x), centre(PLAYER.y + OY), 'urban', charFrame(PLAYER.char, 'down', 0));
    this.player.body.setSize(10, 6).setOffset(3, 10);
    this.player.setCollideWorldBounds(true);
    this.player.char = PLAYER.char;
    this.player.dir = 'down';
    SOLID_LAYERS.forEach((n) => this.physics.add.collider(this.player, this.layers[n]));

    this.npcs = NPCS.map((n) => {
      const s = this.physics.add.sprite(centre(n.x), centre(n.y + OY), 'urban', charFrame(n.char, 'down', 0));
      s.body.setSize(12, 8).setOffset(2, 8).setImmovable(true);
      s.npc = n;
      s.tx = n.x;
      s.ty = n.y + OY;
      s.setDepth(10 + s.y / 1000);
      return s;
    });
    this.physics.add.collider(this.player, this.npcs);

    // Townspeople glance around now and then.
    this.time.addEvent({
      delay: 2500, loop: true, callback: () => {
        const s = Phaser.Utils.Array.GetRandom(this.npcs);
        if (s !== this.talkingTo) s.setFrame(charFrame(s.npc.char, Phaser.Utils.Array.GetRandom(['down', 'down', 'left', 'right']), 0));
      },
    });
  }

  // Text is drawn at 3x size and scaled down, so it stays crisp under the 3x camera zoom.
  label(x, y, text, style = {}) {
    return this.add.text(x, y, text, {
      fontFamily: FONT, fontSize: '24px', color: '#ffffff', resolution: 1, ...style,
    }).setScale(1 / ZOOM).setOrigin(0.5, 1).setDepth(2100);
  }

  buildLabels() {
    SIGNS.forEach((s) => this.label(s.x * TILE, (s.y + OY) * TILE + 1, s.text, {
      fontSize: '21px', color: '#fff6d5', backgroundColor: '#3b2a1acc', padding: { x: 6, y: 2 },
    }));
    this.tags = this.npcs.map((s) => this.label(s.x, s.y - 8, '', {
      fontSize: '20px', stroke: '#1b1b2b', strokeThickness: 5,
    }));
    this.refreshTags();

    this.indicator = this.label(0, 0, '!', {
      fontSize: '36px', color: '#ffd23f', stroke: '#1b1b2b', strokeThickness: 6,
    }).setVisible(false);
    this.tweens.add({ targets: this.indicator, scaleY: { from: 1 / ZOOM, to: 1.25 / ZOOM }, yoyo: true, repeat: -1, duration: 350 });
  }

  refreshTags() {
    this.npcs.forEach((s, i) => {
      const stats = this.progress.topicStats(s.npc.topic, TOPICS[s.npc.topic].words);
      const stars = stats.seen ? ` ${'★'.repeat(stats.stars)}${'☆'.repeat(3 - stats.stars)}` : '';
      this.tags[i].setText(`${s.npc.name}${stars}`);
    });
  }

  // ---------- input ----------

  inputLocked() {
    return this.busy || this.time.now < (this.registry.get('lockUntil') || 0);
  }

  onTap(p) {
    if (this.inputLocked()) return;
    const npc = this.npcs.find((s) => Math.abs(p.worldX - s.x) < 12 && Math.abs(p.worldY - s.y) < 14);
    if (npc) {
      if (this.distanceTo(npc) <= REACH) this.talk(npc);
      else this.walkTo(npc.tx, npc.ty, npc);
      return;
    }
    this.walkTo(tileOf(p.worldX), tileOf(p.worldY));
  }

  tryTalk() {
    if (this.inputLocked()) return;
    const npc = this.nearestNpc();
    if (npc) this.talk(npc);
  }

  // ---------- pathfinding (breadth-first search on the tile grid) ----------

  walkable(x, y) {
    return !this.town.isSolid(x, y) && !this.npcs.some((s) => s.tx === x && s.ty === y);
  }

  // Walks to tile (gx, gy). If talkTo is set, stops next to that NPC and talks.
  // If the goal can't be reached, walks to the closest reachable tile.
  walkTo(gx, gy, talkTo = null) {
    const sx = tileOf(this.player.body.center.x);
    const sy = tileOf(this.player.body.center.y);
    const key = (x, y) => y * MAP_W + x;
    const prev = new Map([[key(sx, sy), null]]);
    const queue = [[sx, sy]];
    let best = [sx, sy];
    let bestD = Infinity;
    const score = (x, y) => (talkTo ? Math.abs(x - gx) + Math.abs(y - gy) - 1 : Math.hypot(x - gx, y - gy));
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
    path.shift(); // current tile
    this.path = path;
    this.pendingTalk = talkTo;
    this.stuckFor = 0;
  }

  // ---------- conversation ----------

  distanceTo(s) {
    return Phaser.Math.Distance.Between(this.player.body.center.x, this.player.body.center.y, s.body.center.x, s.body.center.y);
  }

  nearestNpc() {
    let best = null;
    let bestD = REACH;
    this.npcs.forEach((s) => {
      const d = this.distanceTo(s);
      if (d <= bestD) { bestD = d; best = s; }
    });
    return best;
  }

  async talk(s) {
    this.busy = true;
    this.path = null;
    this.pendingTalk = null;
    this.talkingTo = s;
    this.player.setVelocity(0);
    const dir = dirOf(s.x - this.player.x, s.y - this.player.y);
    this.player.dir = dir;
    this.idle();
    s.setFrame(charFrame(s.npc.char, OPPOSITE[dir], 0));
    this.indicator.setVisible(false);

    // Lift the player above the dialogue panel.
    const ui = this.scene.get('UI');
    const cam = this.cameras.main;
    cam.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE + ui.panelHeight() / ZOOM);
    this.tweens.add({ targets: cam.followOffset, y: -ui.panelHeight() / (2 * ZOOM), duration: 250 });

    await ui.runConversation(s.npc);

    this.tweens.add({
      targets: cam.followOffset, y: 0, duration: 250,
      onComplete: () => cam.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE),
    });
    this.refreshTags();
    this.talkingTo = null;
    this.busy = false;
  }

  // ---------- per-frame ----------

  idle() {
    this.player.anims.stop();
    this.player.setFrame(charFrame(this.player.char, this.player.dir, 0));
  }

  update(_t, dt) {
    const p = this.player;
    p.setDepth(10 + p.y / 1000);
    this.lastX = this.prevX;
    this.lastY = this.prevY;
    this.prevX = p.x;
    this.prevY = p.y;
    if (this.busy) {
      p.setVelocity(0);
      return;
    }

    const k = this.keys;
    let vx = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.A.isDown);
    let vy = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.W.isDown);

    if (vx || vy) {
      this.path = null;
      this.pendingTalk = null;
    } else if (this.path) {
      const next = this.path[0];
      if (next) {
        const dx = centre(next[0]) - p.body.center.x;
        const dy = centre(next[1]) - p.body.center.y;
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) this.path.shift();
        else { vx = dx; vy = dy; }
        // Give up if something blocks the way.
        const moved = Math.hypot(p.x - (this.lastX ?? p.x), p.y - (this.lastY ?? p.y));
        this.stuckFor = moved < 0.2 && (vx || vy) ? this.stuckFor + dt : 0;
        if (this.stuckFor > 400) this.path = null;
      }
      if (this.path && !this.path.length) {
        this.path = null;
        if (this.pendingTalk && this.distanceTo(this.pendingTalk) <= REACH + 8) {
          const s = this.pendingTalk;
          p.setVelocity(0);
          this.talk(s);
          return;
        }
        this.pendingTalk = null;
      }
    }

    const len = Math.hypot(vx, vy);
    if (len) {
      p.setVelocity((vx / len) * SPEED, (vy / len) * SPEED);
      p.dir = dirOf(vx, vy);
      p.anims.play(`c${p.char}-${p.dir}`, true);
    } else {
      p.setVelocity(0);
      this.idle();
    }

    const near = this.nearestNpc();
    this.indicator.setVisible(!!near);
    if (near) this.indicator.setPosition(near.x, near.y - 15);
  }
}
