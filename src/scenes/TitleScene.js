// Title screen: the rainy square at midnight drifting slowly behind the title, with
// Continuer, Nouvelle partie and a chapter list (chapters unlock as they're reached).
import { C, FONT_TITLE, text, makeButton, drawPanel } from '../ui/theme.js';
import { NoirAudio, Weather } from '../fx/noir.js';
import { CHAPTERS } from '../story/story.js';

const SOUND_KEY = 'frpg.sound';

// Chapter list: id, label, unlocked when.
const CHAPTER_LIST = [
  { id: 'prologue', unlocked: () => true },
  { id: 'ch1', unlocked: (g) => g.has('prologue_done') },
  { id: 'ch2', unlocked: (g) => g.has('outro_seen') },
  { id: 'ch3', unlocked: (g) => g.has('ch2_outro_seen') },
];

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.W = W; this.H = H;
    const portrait = H > W;
    this.state = this.registry.get('state');

    // One audio engine for the whole game, so rain and music never double up.
    if (!this.registry.get('audio') && this.sound.context) this.registry.set('audio', new NoirAudio(this.sound));
    this.audio = this.registry.get('audio');
    let soundOn = true;
    try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off'; } catch { /* ignore */ }
    this.sound.mute = !soundOn;
    this.audio?.setMuted(!soundOn);
    this.audio?.setTheme('prologue');
    this.audio?.setCafe(0);

    // Background: the square at midnight, panning very slowly.
    this.add.rectangle(0, 0, W, H, 0x000000).setOrigin(0);
    if (this.textures.exists('cut_c1_place')) {
      const img = this.add.image(W / 2, H / 2, 'cut_c1_place');
      const s = Math.max(W / img.width, H / img.height) * 1.25;
      img.setScale(s).setAlpha(0.7);
      const span = Math.max(0, (img.width * s - W) / 2);
      img.x = W / 2 + span;
      this.tweens.add({ targets: img, x: W / 2 - span, duration: 60000, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
    const shade = this.add.graphics();
    shade.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.2, 0.2, 0.85, 0.85).fillRect(0, 0, W, H);
    this.weather = new Weather(this, this.audio);

    const ty = portrait ? H * 0.2 : H * 0.17;
    const t1 = text(this, W / 2, ty, 'Belleville', portrait ? 64 : 72, C.ink, { fontFamily: FONT_TITLE }).setOrigin(0.5).setAlpha(0);
    const t2 = text(this, W / 2, ty + (portrait ? 56 : 60), 'un polar en français', 20, C.dim, { fontStyle: 'italic' }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: [t1, t2], alpha: 1, duration: 1600 });

    this.menu = this.add.container(0, 0);
    this.showMain();
  }

  update() {
    this.weather?.update();
  }

  clearMenu() {
    this.menu.removeAll(true);
  }

  // Buttons stacked down the middle of the screen.
  buttons(list, top) {
    const { W } = this;
    const bw = Math.min(W - 80, 360);
    let y = top;
    list.forEach(([label, fn, dim]) => {
      const b = makeButton(this, W / 2 - bw / 2, y, bw, 52, label, fn, { size: 19, font: FONT_TITLE });
      if (dim) b.setEnabled(false);
      this.menu.add(b.c);
      y += b.h + 12;
    });
    return y;
  }

  menuTop() {
    return this.H > this.W ? this.H * 0.42 : this.H * 0.38;
  }

  hasSave() {
    return this.state.has('intro_seen');
  }

  showMain() {
    this.clearMenu();
    const list = [];
    if (this.hasSave()) list.push(['Continuer', () => this.play()]);
    list.push(['Nouvelle partie', () => this.confirm(this.hasSave(), () => { this.state.reset(); this.play(); })]);
    list.push(['Chapitres', () => this.showChapters()]);
    const y = this.buttons(list, this.menuTop());
    const on = !this.sound.mute;
    const snd = makeButton(this, this.W / 2 - 70, y + 6, 140, 40, on ? 'Son ✓' : 'Son ✗', () => {
      const now = this.sound.mute; // toggling: muted -> on
      this.sound.mute = !now;
      this.audio?.setMuted(!now);
      try { localStorage.setItem(SOUND_KEY, now ? 'on' : 'off'); } catch { /* ignore */ }
      snd.setLabel(now ? 'Son ✓' : 'Son ✗');
    }, { size: 15 });
    this.menu.add(snd.c);
  }

  showChapters() {
    this.clearMenu();
    const g = this.state;
    const list = CHAPTER_LIST.map(({ id, unlocked }) => {
      const open = unlocked(g);
      const ch = CHAPTERS[id];
      return [open ? ch.title : `${ch.title.split('—')[0].trim()} — 🔒`, () => this.confirm(this.hasSave(), () => { g.startAt(id); this.play(); }), !open];
    });
    list.push(['‹ Retour', () => this.showMain()]);
    this.buttons(list, this.menuTop());
  }

  // Ask before wiping progress.
  confirm(needed, fn) {
    if (!needed) { fn(); return; }
    this.clearMenu();
    const { W } = this;
    const bw = Math.min(W - 80, 360);
    const top = this.menuTop();
    const g = drawPanel(this.add.graphics(), W / 2 - bw / 2, top - 8, bw, 96, 0.9);
    const msg = text(this, W / 2, top + 10, 'Votre enquête en cours sera remplacée.', 17, C.ink, { align: 'center', wordWrap: { width: bw - 30 } }).setOrigin(0.5, 0);
    const en = text(this, W / 2, top + 10 + msg.height + 6, 'Your current investigation will be replaced.', 14, C.dim, { fontStyle: 'italic', align: 'center', wordWrap: { width: bw - 30 } }).setOrigin(0.5, 0);
    this.menu.add([g, msg, en]);
    this.buttons([['Oui, recommencer', fn], ['‹ Retour', () => this.showMain()]], top + 110);
  }

  play() {
    if (this.leaving) return;
    this.leaving = true;
    this.registry.set('room', null);
    this.registry.set('spawn', null);
    this.audio?.setIndoor?.(false);
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('World');
      this.scene.launch('UI');
    });
  }
}
