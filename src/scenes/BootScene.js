import { buildCastTexture, castFrame, COSTUME_IDS } from '../world/costumes.js';
import GameState from '../story/state.js';
import { makeFxTextures } from '../fx/noir.js';
import { FONT_TITLE } from '../ui/theme.js';
import { SPRITES } from '../world/sprites.js';
import { READY } from '../story/cutscenes.js';

const LPC_ROW = { up: 0, left: 1, down: 2, right: 3 };
const LPC_STEP = [0, 2, 6]; // idle, and the two contact poses used for static 'step' frames

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const { width, height } = this.scale;
    const label = this.add.text(width / 2, height / 2, 'Belleville', {
      fontFamily: FONT_TITLE, fontSize: '30px', color: '#e9e3d5',
    }).setOrigin(0.5);
    this.load.on('progress', (p) => label.setAlpha(0.3 + p * 0.7));

    this.load.spritesheet('urban', 'assets/tiles/urban.png', { frameWidth: 16, frameHeight: 16 });
    // Dialogue portraits, 96x96: frames neutral, blink, hostile, shaken (tools/import_portraits.py).
    ['inspector', 'helene', 'dubois', 'lebrun', 'theo', 'garnier', 'delacroix', 'claire', 'roux']
      .forEach((id) => this.load.spritesheet(`portrait_${id}`, `assets/portraits/${id}.png`, { frameWidth: 96, frameHeight: 96 }));
    if (SPRITES.lpc) {
      COSTUME_IDS.forEach((id) => this.load.spritesheet(`lpc_${id}`, `assets/lpc/${SPRITES.size}/${id}.png`,
        { frameWidth: SPRITES.size, frameHeight: SPRITES.size }));
    }
    // Cutscene stills (the rest show a placeholder until their image is added).
    READY.forEach((id) => this.load.image(`cut_${id}`, `assets/cutscenes/${id}.jpg`));
    ['right', 'wrong', 'click', 'open']
      .forEach((k) => this.load.audio(k, [`assets/audio/${k}.ogg`, `assets/audio/${k}.mp3`]));
  }

  create() {
    // Noir costumes recoloured from the urban pack, then a walk cycle per costume and direction.
    if (SPRITES.lpc) this.buildLpcCast();
    else buildCastTexture(this);
    COSTUME_IDS.forEach((id) => {
      ['left', 'down', 'up', 'right'].forEach((dir) => {
        this.anims.create({
          key: `${id}-${dir}`,
          frames: SPRITES.lpc
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((k) => ({ key: `lpc_${id}`, frame: LPC_ROW[dir] * 9 + k }))
            : [1, 0, 2, 0].map((s) => ({ key: 'cast', frame: castFrame(id, dir, s) })),
          frameRate: SPRITES.lpc ? 12 : 7,
          repeat: -1,
        });
      });
    });
    makeFxTextures(this);
    this.registry.set('state', new GameState());
    this.scene.start('World');
    this.scene.launch('UI');
  }

  // Same 'cast' frame numbering as the Kenney set, filled from the LPC sheets.
  buildLpcCast() {
    const S = SPRITES.size;
    const tex = this.textures.createCanvas('cast', 4 * S, COSTUME_IDS.length * 3 * S);
    const ctx = tex.getContext();
    COSTUME_IDS.forEach((id) => {
      const src = this.textures.get(`lpc_${id}`).getSourceImage();
      ['left', 'down', 'up', 'right'].forEach((dir) => [0, 1, 2].forEach((step) => {
        const f = castFrame(id, dir, step);
        const x = (f % 4) * S;
        const y = Math.floor(f / 4) * S;
        ctx.drawImage(src, LPC_STEP[step] * S, LPC_ROW[dir] * S, S, S, x, y, S, S);
        tex.add(f, 0, x, y, S, S);
      }));
    });
    tex.refresh();
  }
}
