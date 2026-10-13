import { buildCastTexture, castFrame, COSTUME_IDS } from '../world/costumes.js';
import GameState from '../story/state.js';
import { makeFxTextures } from '../fx/noir.js';
import { FONT_TITLE } from '../ui/theme.js';

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
    // Dialogue portraits, 96x96 (frame 0 eyes open, frame 1 blink), made by tools/import_portraits.py.
    ['inspector', 'helene', 'dubois', 'lebrun', 'theo', 'garnier', 'delacroix', 'claire', 'roux']
      .forEach((id) => this.load.spritesheet(`portrait_${id}`, `assets/portraits/${id}.png`, { frameWidth: 96, frameHeight: 96 }));
    ['right', 'wrong', 'click', 'open']
      .forEach((k) => this.load.audio(k, [`assets/audio/${k}.ogg`, `assets/audio/${k}.mp3`]));
  }

  create() {
    // Noir costumes recoloured from the urban pack, then a walk cycle per costume and direction.
    buildCastTexture(this);
    COSTUME_IDS.forEach((id) => {
      ['left', 'down', 'up', 'right'].forEach((dir) => {
        this.anims.create({
          key: `${id}-${dir}`,
          frames: [1, 0, 2, 0].map((s) => ({ key: 'cast', frame: castFrame(id, dir, s) })),
          frameRate: 7,
          repeat: -1,
        });
      });
    });
    makeFxTextures(this);
    this.registry.set('state', new GameState());
    this.scene.start('World');
    this.scene.launch('UI');
  }
}
