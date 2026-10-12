import { charFrame } from '../world/tiles.js';
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
    ['right', 'wrong', 'click', 'open']
      .forEach((k) => this.load.audio(k, [`assets/audio/${k}.ogg`, `assets/audio/${k}.mp3`]));
  }

  create() {
    // Walk cycle per character and direction: step A, stand, step B, stand.
    for (let c = 0; c < 6; c++) {
      ['left', 'down', 'up', 'right'].forEach((dir) => {
        this.anims.create({
          key: `c${c}-${dir}`,
          frames: [1, 0, 2, 0].map((s) => ({ key: 'urban', frame: charFrame(c, dir, s) })),
          frameRate: 7,
          repeat: -1,
        });
      });
    }
    makeFxTextures(this);
    this.registry.set('state', new GameState());
    this.scene.start('World');
    this.scene.launch('UI');
  }
}
