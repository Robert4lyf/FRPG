import { NPCS } from '../data/vocab.js';
import { makeQuestion } from '../quiz.js';
import DialogueBox from '../ui/DialogueBox.js';

const TILE = 16;
const COLS = 30;
const ROWS = 20;
const SPEED = 80;
const PLAYER_START = { x: 15, y: 8 };
// Interior walls (tile coords). The border is added automatically.
const WALLS = [
  [8, 4], [9, 4], [10, 4], [11, 4], [8, 5], [11, 5],
  [21, 11], [22, 11], [23, 11], [24, 11], [21, 12],
];

const toPx = (t) => t * TILE + TILE / 2;

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('World');
  }

  create() {
    this.makeTextures();
    this.score = 0;
    this.asked = 0;
    this.target = null;
    this.talkCooldown = 0;

    this.add.tileSprite(0, 0, COLS * TILE, ROWS * TILE, 'grass').setOrigin(0);

    const walls = this.physics.add.staticGroup();
    for (let x = 0; x < COLS; x++) {
      walls.create(toPx(x), toPx(0), 'wall');
      walls.create(toPx(x), toPx(ROWS - 1), 'wall');
    }
    for (let y = 1; y < ROWS - 1; y++) {
      walls.create(toPx(0), toPx(y), 'wall');
      walls.create(toPx(COLS - 1), toPx(y), 'wall');
    }
    WALLS.forEach(([x, y]) => walls.create(toPx(x), toPx(y), 'wall'));

    const npcs = this.physics.add.staticGroup();
    NPCS.forEach((n, i) => {
      const key = `npc${i}`;
      this.makePerson(key, n.body, n.hair);
      const s = npcs.create(toPx(n.x), toPx(n.y), key);
      s.setData('npc', n);
      this.add.text(s.x, s.y - 12, n.name, {
        fontFamily: 'monospace', fontSize: '10px', color: '#ffffff',
        backgroundColor: '#00000088', padding: { x: 2, y: 0 },
      }).setOrigin(0.5, 1);
    });

    this.player = this.physics.add.sprite(toPx(PLAYER_START.x), toPx(PLAYER_START.y), 'player');
    this.player.body.setSize(12, 12).setOffset(2, 4);
    this.physics.add.collider(this.player, walls);
    this.physics.add.collider(this.player, npcs, (_p, npc) => this.talkTo(npc.getData('npc')));

    this.scoreText = this.add.text(6, 4, '', {
      fontFamily: 'monospace', fontSize: '12px', color: '#ffffff',
      backgroundColor: '#000000aa', padding: { x: 4, y: 2 },
    }).setDepth(50);
    this.updateScore();

    this.dialogue = new DialogueBox(this);
    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
    this.input.keyboard.on('keydown', (e) => this.dialogue.handleKey(e.key));
    this.input.on('pointerdown', (p) => {
      if (this.dialogue.open) {
        this.dialogue.advance();
        return;
      }
      this.target = { x: p.worldX, y: p.worldY };
    });

    this.dialogue.show(
      'Bienvenue ! Walk with the arrow keys or tap where you want to go. Talk to people by walking into them.',
    );
  }

  talkTo(npc) {
    if (this.dialogue.open || this.time.now < this.talkCooldown) return;
    this.target = null;
    this.player.setVelocity(0);
    const q = makeQuestion(npc.topic);
    this.dialogue.show(`${npc.name} : « ${npc.greeting} »\n${q.prompt}`, q.choices, (i) => {
      const right = i === q.answer;
      this.asked += 1;
      if (right) this.score += 1;
      this.updateScore();
      this.dialogue.show(right ? 'Très bien !' : `Pas tout à fait... ${q.explain}`, [], () => {
        this.talkCooldown = this.time.now + 1500;
      });
    });
  }

  updateScore() {
    this.scoreText.setText(`Score : ${this.score} / ${this.asked}`);
  }

  update() {
    const p = this.player;
    if (this.dialogue.open) {
      p.setVelocity(0);
      return;
    }
    const k = this.keys;
    let vx = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.A.isDown);
    let vy = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.W.isDown);
    if (vx || vy) {
      this.target = null;
    } else if (this.target) {
      const dx = this.target.x - p.x;
      const dy = this.target.y - p.y;
      if (Math.hypot(dx, dy) < 3) this.target = null;
      else { vx = dx; vy = dy; }
    }
    const len = Math.hypot(vx, vy);
    if (len) p.setVelocity((vx / len) * SPEED, (vy / len) * SPEED);
    else p.setVelocity(0);
  }

  // Placeholder pixel art drawn in code, so no asset files are needed yet.
  makeTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x3a7d44).fillRect(0, 0, 16, 16);
    g.fillStyle(0x4f9d5a).fillRect(3, 4, 1, 2).fillRect(10, 9, 1, 2).fillRect(6, 12, 1, 1);
    g.generateTexture('grass', 16, 16);
    g.clear();
    g.fillStyle(0x5f574f).fillRect(0, 0, 16, 16);
    g.fillStyle(0x83769c).fillRect(1, 1, 6, 6).fillRect(9, 1, 6, 6).fillRect(5, 9, 6, 6);
    g.generateTexture('wall', 16, 16);
    g.destroy();
    this.makePerson('player', 0x008751, 0xab5236);
  }

  makePerson(key, body, hair) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffccaa).fillRect(4, 1, 8, 6);
    g.fillStyle(hair).fillRect(4, 0, 8, 2);
    g.fillStyle(0x000000).fillRect(6, 3, 1, 1).fillRect(9, 3, 1, 1);
    g.fillStyle(body).fillRect(3, 7, 10, 6);
    g.fillStyle(0x222034).fillRect(4, 13, 3, 3).fillRect(9, 13, 3, 3);
    g.generateTexture(key, 16, 16);
    g.destroy();
  }
}
