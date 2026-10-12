import { TOPICS } from '../data/topics.js';
import { NPCS } from '../data/npcs.js';
import { makeQuestion } from '../learning/quiz.js';
import { speech } from '../learning/speech.js';
import { MASTERED_BOX, MAX_BOX } from '../learning/progress.js';
import { FONT } from './BootScene.js';

const INK = '#3b2a1a';
const NAME = '#9c3d10';
const SUB = '#6b5038';
const GOOD = '#2e7d32';
const BAD = '#b3261e';
const PANEL_SLICE = [8, 8, 8, 8];
const BUTTON_SLICE = [6, 6, 6, 8];
const TOPIC_ORDER = NPCS.map((n) => n.topic);
const SOUND_KEY = 'frpg.sound';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;
    this.portrait = this.H > this.W;
    this.progress = this.registry.get('progress');
    this.world = this.scene.get('World');
    this.readyAt = 0;
    this.waiting = null;
    this.choose = null;

    let soundOn = true;
    try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off'; } catch { /* ignore */ }
    this.setSound(soundOn);

    this.buildHud();
    this.buildDialogue();
    this.buildJournal();

    this.input.keyboard.on('keydown', (e) => this.onKey(e));
    this.input.on('pointerdown', () => {
      if (this.dlg.visible || this.jr.visible) this.lock();
      if (this.dlg.visible && this.waiting) this.continue();
    });

    this.time.delayedCall(300, () => this.welcome());
  }

  // ---------- helpers ----------

  text(x, y, str, size, color, extra = {}) {
    return this.add.text(x, y, str, { fontFamily: FONT, fontSize: `${size}px`, color, ...extra });
  }

  // Kenney 9-slice textures are tiny, so draw them at half size and scale x2 for chunky pixels.
  slice(x, y, key, w, h, s = PANEL_SLICE) {
    return this.add.nineslice(x, y, key, undefined, w / 2, h / 2, ...s).setOrigin(0).setScale(2);
  }

  button(x, y, w, h, label, onClick, size = 24) {
    const c = this.add.container(x, y);
    const bgs = {};
    ['button', 'button_pressed', 'button_right', 'button_wrong'].forEach((k) => {
      bgs[k] = this.slice(0, 0, k, w, h, BUTTON_SLICE).setVisible(k === 'button');
    });
    const t = this.text(w / 2, h / 2 - 2, label, size, '#ffffff', { align: 'center', wordWrap: { width: w - 16 } })
      .setOrigin(0.5).setShadow(0, 2, '#00000055', 0);
    const zone = this.add.zone(0, 0, w, h).setOrigin(0).setInteractive({ useHandCursor: true });
    c.add([...Object.values(bgs), t, zone]);

    const b = {
      c, t, enabled: true,
      show(key) { Object.entries(bgs).forEach(([k, bg]) => bg.setVisible(k === key)); },
      setLabel(s) { t.setText(s); return b; },
    };
    zone.on('pointerdown', () => {
      this.lock();
      if (!b.enabled) return;
      b.show('button_pressed');
      t.y = h / 2;
      this.sound.play('click', { volume: 0.4 });
    });
    const release = (fire) => {
      if (!b.enabled) return;
      b.show('button');
      t.y = h / 2 - 2;
      if (fire) onClick();
    };
    zone.on('pointerup', () => release(true));
    zone.on('pointerout', () => release(false));
    return b;
  }

  lock(ms = 250) {
    this.registry.set('lockUntil', this.time.now + ms);
  }

  setSound(on) {
    this.soundOn = on;
    this.sound.mute = !on;
    speech.setEnabled(on);
    try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
    this.soundBtn?.setLabel(on ? 'Son ✓' : 'Son ✗');
  }

  // ---------- HUD ----------

  buildHud() {
    const h = 52;
    this.hudBg = this.slice(12, 12, 'panel', 200, h);
    this.hudText = this.text(28, 12 + h / 2, '', 22, INK).setOrigin(0, 0.5);
    this.journalBtn = this.button(this.W - 12 - 130, 12, 130, h, 'Carnet', () => this.openJournal(), 22);
    this.soundBtn = this.button(this.W - 12 - 130 - 10 - 116, 12, 116, h, '', () => this.setSound(!this.soundOn), 22);
    this.setSound(this.soundOn);
    this.updateHud();
  }

  updateHud() {
    let mastered = 0;
    let total = 0;
    TOPIC_ORDER.forEach((topic) => {
      const s = this.progress.topicStats(topic, TOPICS[topic].words);
      mastered += s.mastered;
      total += s.total;
    });
    this.hudText.setText(`★ ${mastered} / ${total} mots`);
    const w = Math.ceil((this.hudText.width + 34) / 2) * 2;
    this.hudBg.setSize(w / 2, this.hudBg.height);
  }

  // ---------- dialogue ----------

  panelHeight() {
    return this.portrait ? 400 : 240;
  }

  buildDialogue() {
    const { W, H } = this;
    const ph = this.panelHeight();
    const top = H - ph - 12;
    this.top = top;
    this.dlg = this.add.container(0, 0).setDepth(100).setVisible(false);
    const panel = this.slice(12, top, 'panel', W - 24, ph);
    this.nameText = this.text(36, top + 18, '', 22, NAME, { fontStyle: 'bold' });
    this.mainText = this.text(36, top + 58, '', 26, INK, { wordWrap: { width: W - 84 } });
    this.subText = this.text(36, top + 100, '', 19, SUB, { wordWrap: { width: W - 84 }, lineSpacing: 3 });
    this.hint = this.text(W - 36, top + ph - 14, '▼', 22, INK).setOrigin(1, 1);
    this.tweens.add({ targets: this.hint, alpha: 0.2, yoyo: true, repeat: -1, duration: 450 });
    this.listenBtn = this.button(W - 36 - 150, top + 10, 150, 42, '🔊 Écouter', () => speech.speak(this.speakText), 18);
    this.dlg.add([panel, this.nameText, this.mainText, this.subText, this.hint, this.listenBtn.c]);
    this.choiceButtons = [];
  }

  showText(name, main, sub = '', speak = null) {
    this.dlg.setVisible(true);
    this.nameText.setText(name);
    this.mainText.setText(main);
    this.subText.setText(sub).setColor(SUB).setY(this.mainText.y + this.mainText.height + 6);
    this.speakText = speak;
    this.listenBtn.c.setVisible(!!speak && this.soundOn);
    if (speak) speech.speak(speak);
    this.readyAt = this.time.now + 250;
  }

  clearChoices() {
    this.choiceButtons.forEach((b) => b.c.destroy());
    this.choiceButtons = [];
    this.choose = null;
  }

  continue() {
    if (!this.waiting || this.time.now < this.readyAt) return;
    const done = this.waiting;
    this.waiting = null;
    done();
  }

  waitContinue() {
    // Sit the hint above any answer buttons so it never covers them.
    const ph = this.panelHeight();
    const buttonsTop = Math.min(...this.choiceButtons.map((b) => b.c.y));
    this.hint.setY(this.choiceButtons.length ? buttonsTop - 6 : this.top + ph - 14);
    this.hint.setVisible(true);
    this.readyAt = this.time.now + 250;
    return new Promise((resolve) => { this.waiting = resolve; });
  }

  async say(name, main, sub = '', speak = null) {
    this.clearChoices();
    this.showText(name, main, sub, speak);
    await this.waitContinue();
  }

  ask(name, q) {
    this.clearChoices();
    this.showText(name, q.prompt, q.sub, q.speak);
    this.hint.setVisible(false);
    const { W, top } = this;
    const ph = this.panelHeight();
    const n = q.choices.length;

    return new Promise((resolve) => {
      this.choose = async (i) => {
        if (i < 0 || i >= n || this.time.now < this.readyAt) return;
        this.choose = null;
        const ok = i === q.answer;
        this.choiceButtons.forEach((b, j) => {
          b.enabled = false;
          if (j === q.answer) b.show('button_right');
          else if (j === i) b.show('button_wrong');
          else b.c.setAlpha(0.45);
        });
        this.sound.play(ok ? 'right' : 'wrong', { volume: 0.6 });
        this.speakText = q.word.fr;
        this.listenBtn.c.setVisible(this.soundOn);
        speech.speak(q.word.fr);
        this.subText
          .setText(ok ? `✔ Très bien !  ${q.reveal}` : `✘ Pas tout à fait…  ${q.reveal}`)
          .setColor(ok ? GOOD : BAD);
        await this.waitContinue();
        resolve(ok);
      };

      q.choices.forEach((label, i) => {
        let x; let y; let w;
        const h = 56;
        if (this.portrait) {
          w = W - 72; x = 36; y = top + ph - 20 - (n - i) * (h + 10) + 10;
        } else {
          w = (W - 72 - (n - 1) * 14) / n; x = 36 + i * (w + 14); y = top + ph - 20 - h;
        }
        this.choiceButtons.push(this.button(x, y, w, h, label, () => this.choose?.(i), 24));
      });
      this.choiceButtons.forEach((b) => this.dlg.add(b.c));
    });
  }

  openDialogue() {
    this.dlg.setVisible(true).setAlpha(0).setY(30);
    this.tweens.add({ targets: this.dlg, alpha: 1, y: 0, duration: 180 });
  }

  closeDialogue() {
    this.clearChoices();
    this.dlg.setVisible(false);
    this.lock(300);
  }

  async welcome() {
    this.world.busy = true;
    this.openDialogue();
    await this.say(
      'Belleville',
      'Bienvenue à Belleville !',
      'Talk to the townspeople to learn French. Use the arrow keys or tap where you want to go. '
      + 'Tap a person, or press Space next to them, to talk. Answer with a tap or keys 1–3. '
      + 'Your words are saved in the Carnet (notebook).',
      'Bienvenue à Belleville !',
    );
    this.closeDialogue();
    this.world.busy = false;
  }

  // Called by the world when the player talks to someone. Resolves when the chat ends.
  async runConversation(npc) {
    const topic = TOPICS[npc.topic];
    this.openDialogue();
    this.sound.play('open', { volume: 0.4 });
    await this.say(npc.name, npc.greeting, npc.greetingEn, npc.greeting);

    const words = this.progress.pickSession(npc.topic, topic.words, 3);
    let right = 0;
    for (const word of words) {
      const isNew = this.progress.isNew(npc.topic, word);
      if (isNew) {
        await this.say(npc.name, `Nouveau mot : ${word.fr}`, `New word: it means "${word.en}".`, word.fr);
      }
      const q = makeQuestion(word, topic.words, {
        forceType: isNew ? 'fr2en' : null,
        canListen: speech.available && this.soundOn,
      });
      const ok = await this.ask(npc.name, q);
      this.progress.record(npc.topic, word, ok);
      if (ok) right += 1;
      this.updateHud();
    }

    const stats = this.progress.topicStats(npc.topic, topic.words);
    let end;
    if (right === words.length) end = ['Parfait ! À bientôt !', `Perfect! ${right}/${words.length}. See you soon!`];
    else if (right >= 2) end = ['Bien joué ! À bientôt !', `Well done! ${right}/${words.length}. See you soon!`];
    else end = ['Courage ! On réessaie bientôt ?', `Keep going! ${right}/${words.length}. Come back to practise.`];
    end[1] += `  (${topic.title}: ${stats.mastered}/${stats.total} mastered)`;
    await this.say(npc.name, end[0], end[1], end[0]);
    this.closeDialogue();
  }

  // ---------- journal (Carnet) ----------

  buildJournal() {
    const { W, H } = this;
    this.jr = this.add.container(0, 0).setDepth(200).setVisible(false);
    const dim = this.add.rectangle(0, 0, W, H, 0x000000, 0.55).setOrigin(0).setInteractive();
    const panel = this.slice(16, 16, 'panel', W - 32, H - 32);
    const title = this.text(40, 34, 'Carnet', 30, NAME, { fontStyle: 'bold' });
    const close = this.button(W - 40 - 120, 28, 120, 48, 'Fermer', () => this.closeJournal(), 22);
    const prev = this.button(40, 92, 60, 56, '◀', () => this.showTopic(this.topicIdx - 1), 26);
    const next = this.button(W - 40 - 60, 92, 60, 56, '▶', () => this.showTopic(this.topicIdx + 1), 26);
    this.jrTitle = this.text(W / 2, 96, '', 26, INK, { fontStyle: 'bold' }).setOrigin(0.5, 0);
    this.jrSub = this.text(W / 2, 128, '', 18, SUB, { align: 'center', wordWrap: { width: W - 220 } }).setOrigin(0.5, 0);
    this.jr.add([dim, panel, title, close.c, prev.c, next.c, this.jrTitle, this.jrSub]);

    const top = 176;
    const rowH = Math.min(this.portrait ? 76 : 50, Math.floor((H - 32 - 20 - top) / 8));
    this.jrRows = [];
    for (let i = 0; i < 8; i++) {
      const y = top + i * rowH;
      const zone = this.add.zone(40, y, W - 80, rowH).setOrigin(0).setInteractive({ useHandCursor: true });
      const line = this.add.rectangle(40, y + rowH - 1, W - 80, 1, 0x3b2a1a, 0.15).setOrigin(0);
      const fr = this.text(48, y + 6, '', 24, INK);
      const en = this.portrait
        ? this.text(48, y + 36, '', 19, SUB)
        : this.text(48 + Math.round((W - 96) * 0.45), y + 9, '', 19, SUB);
      const dots = this.text(W - 48, y + 8, '', 20, NAME).setOrigin(1, 0);
      zone.on('pointerdown', () => { if (zone.word) speech.speak(zone.word); });
      this.jr.add([line, zone, fr, en, dots]);
      this.jrRows.push({ zone, fr, en, dots });
    }
    this.topicIdx = 0;
  }

  showTopic(i) {
    this.topicIdx = (i + TOPIC_ORDER.length) % TOPIC_ORDER.length;
    const key = TOPIC_ORDER[this.topicIdx];
    const topic = TOPICS[key];
    const teacher = NPCS.find((n) => n.topic === key);
    const stats = this.progress.topicStats(key, topic.words);
    this.jrTitle.setText(`${topic.title}  ${'★'.repeat(stats.stars)}${'☆'.repeat(3 - stats.stars)}`);
    this.jrSub.setText(`${topic.en} · ${stats.mastered}/${stats.total} mastered · Ask ${teacher.name.toLowerCase()}`);
    topic.words.forEach((w, r) => {
      const row = this.jrRows[r];
      const seen = !this.progress.isNew(key, w);
      const box = this.progress.get(key, w).box;
      row.fr.setText(seen ? w.fr : '? ? ?').setColor(seen ? INK : SUB);
      row.en.setText(w.en);
      row.dots.setText(seen ? '●'.repeat(box) + '○'.repeat(MAX_BOX - box) : '').setColor(box >= MASTERED_BOX ? GOOD : NAME);
      row.zone.word = seen ? w.fr : null;
    });
  }

  openJournal() {
    if (this.dlg.visible || this.world.busy) return;
    this.world.busy = true;
    this.sound.play('open', { volume: 0.4 });
    this.showTopic(this.topicIdx);
    this.jr.setVisible(true);
  }

  closeJournal() {
    this.jr.setVisible(false);
    this.lock(300);
    this.world.busy = false;
  }

  // ---------- keyboard ----------

  onKey(e) {
    const k = e.key;
    if (this.jr.visible) {
      if (k === 'Escape' || k === 'j' || k === 'J') this.closeJournal();
      else if (k === 'ArrowLeft') this.showTopic(this.topicIdx - 1);
      else if (k === 'ArrowRight') this.showTopic(this.topicIdx + 1);
      return;
    }
    if (this.dlg.visible) {
      if (this.choose && /^[1-9]$/.test(k)) this.choose(Number(k) - 1);
      else if (k === ' ' || k === 'Enter' || k === 'e' || k === 'E') this.continue();
      return;
    }
    if ((k === 'j' || k === 'J') && !this.world.busy) this.openJournal();
  }
}
