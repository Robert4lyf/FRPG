import { charFrame } from '../world/tiles.js';
import Progress from '../learning/progress.js';

export const FONT = '"Pixelify Sans", sans-serif';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const { width, height } = this.scale;
    const label = this.add.text(width / 2, height / 2, 'Chargement…', {
      fontFamily: FONT, fontSize: '28px', color: '#ffffff',
    }).setOrigin(0.5);
    this.load.on('progress', (p) => label.setText(`Chargement… ${Math.round(p * 100)} %`));

    this.load.spritesheet('urban', 'assets/tiles/urban.png', { frameWidth: 16, frameHeight: 16 });
    ['panel', 'button', 'button_pressed', 'button_right', 'button_wrong']
      .forEach((k) => this.load.image(k, `assets/ui/${k}.png`));
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
          frameRate: 8,
          repeat: -1,
        });
      });
    }
    this.registry.set('progress', new Progress());
    this.scene.start('World');
    this.scene.launch('UI');
  }
}
