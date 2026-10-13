import {
  CAST, CLUES, STATEMENTS, DIALOGUE, INTRO, OUTRO, OBJECTIVES, CHAPTER, REPORT,
} from '../story/chapter1.js';
import { speech } from '../learning/speech.js';
import {
  C, FONT_TITLE, drawPanel, text, makeButton, RichText, plainText, glosses,
} from '../ui/theme.js';
import { Weather, NoirAudio } from '../fx/noir.js';
import { runReport } from '../ui/report.js';

const SOUND_KEY = 'frpg.sound';
const PAD = 30;

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;
    this.portrait = this.H > this.W;
    this.state = this.registry.get('state');
    this.world = this.scene.get('World');
    this.readyAt = 0;
    this.waiting = null;
    this.showEn = false;
    this.options = [];

    let soundOn = true;
    try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off'; } catch { /* ignore */ }

    this.audio = this.sound.context ? new NoirAudio(this.sound) : null;
    this.weather = new Weather(this, this.audio);

    this.buildHud();
    this.buildDialogue();
    this.buildTooltip();
    this.setSound(soundOn);

    this.input.keyboard.on('keydown', (e) => this.onKey(e));
    this.input.on('pointerdown', (_pointer, over) => {
      if (this.modal()) this.lock();
      this.hideTip();
      // A tap on a button or word belongs to that object, never to "next".
      if (over && over.length) return;
      // Ignore a second event from the same tap (touch + emulated mouse, double fire).
      const now = performance.now();
      if (now - (this.lastTapAt || 0) < 250) return;
      this.lastTapAt = now;
      if (this.waiting) this.continue();
    });
    this.state.onChange(() => this.updateHud());

    this.time.delayedCall(150, () => this.begin());
  }

  update() {
    this.weather.update();
  }

  // ---------- general ----------

  lock(ms = 250) {
    this.registry.set('lockUntil', this.time.now + ms);
  }

  modal() {
    return this.dlg.visible || !!this.overlay || !!this.cardOpen;
  }

  setSound(on) {
    this.soundOn = on;
    this.sound.mute = !on;
    this.audio?.setMuted(!on);
    speech.setEnabled(on);
    try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
    this.soundBtn?.setLabel(on ? 'Son ✓' : 'Son ✗');
  }

  sfx(key, volume = 0.35) {
    this.sound.play(key, { volume });
  }

  // Waits for a tap / Space. A tap while text is still typing just completes it.
  // Real time (not game time), so a slow frame can't shorten the guard.
  waitTap(rich = null) {
    this.readyAt = Math.max(this.readyAt || 0, performance.now() + 200);
    this.waitingRich = rich;
    return new Promise((resolve) => { this.waiting = resolve; });
  }

  continue() {
    const now = performance.now();
    if (!this.waiting || now < this.readyAt) return;
    if (now - (this.wordTappedAt || 0) < 150) return; // tapping a word isn't "next"
    if (this.waitingRich?.revealing) {
      this.waitingRich.finish();
      this.readyAt = now + 150;
      return;
    }
    const done = this.waiting;
    this.waiting = null;
    this.waitingRich = null;
    done();
  }

  // ---------- HUD ----------

  buildHud() {
    const { W } = this;
    const btnW = this.portrait ? 112 : 128;
    this.carnetBtn = makeButton(this, W - 12 - btnW, 12, btnW, 44, 'Carnet', () => this.openCarnet(), { size: 18, font: FONT_TITLE });
    this.soundBtn = makeButton(this, W - 12 - btnW * 2 - 8, 12, btnW, 44, '', () => this.setSound(!this.soundOn), { size: 16 });
    [this.carnetBtn, this.soundBtn].forEach((b) => b.c.setDepth(90));

    this.objW = Math.min(W - btnW * 2 - 44, 470);
    this.objG = this.add.graphics().setDepth(90);
    this.objLabel = text(this, 26, 20, 'OBJECTIF', 13, C.name, { fontFamily: FONT_TITLE }).setDepth(91);
    this.objText = text(this, 26, 38, '', 16, C.ink, { wordWrap: { width: this.objW - 30, useAdvancedWrap: true } }).setDepth(91);
    this.objZone = this.add.zone(12, 12, this.objW, 60).setOrigin(0).setInteractive().setDepth(92);
    this.objZone.on('pointerdown', (_p, _x, _y, e) => { e?.stopPropagation?.(); this.lock(); this.objEn = !this.objEn; this.updateHud(); });
    this.updateHud();
  }

  updateHud() {
    if (!this.objText) return;
    const g = this.state;
    const obj = OBJECTIVES.find((o) => !o.done(g)) || OBJECTIVES[OBJECTIVES.length - 1];
    const count = obj.count ? ` (${obj.count(g)})` : '';
    this.objText.setText((this.objEn ? obj.en : obj.fr) + count).setColor(this.objEn ? C.dim : C.ink);
    const h = this.objText.height + 38;
    this.objG.clear();
    drawPanel(this.objG, 12, 12, this.objW, h, 0.82);
    this.objZone.setSize(this.objW, h);
    if (this.lastObjective !== obj && this.lastObjective) this.toast('NOUVEL OBJECTIF', obj.fr);
    this.lastObjective = obj;
  }

  toast(title, body = '') {
    this.toasts = this.toasts || [];
    this.toasts.push([title, body]);
    if (!this.toasting) this.nextToast();
  }

  nextToast() {
    const next = this.toasts.shift();
    if (!next) { this.toasting = false; return; }
    this.toasting = true;
    const [title, body] = next;
    const w = Math.min(this.W - 40, 520);
    const c = this.add.container(this.W / 2 - w / 2, this.portrait ? 118 : 84).setDepth(95).setAlpha(0);
    const t1 = text(this, w / 2, 14, title, 14, C.gold, { fontFamily: FONT_TITLE }).setOrigin(0.5, 0);
    const t2 = text(this, w / 2, 36, body, 17, C.ink, { align: 'center', wordWrap: { width: w - 30, useAdvancedWrap: true } }).setOrigin(0.5, 0);
    const g = drawPanel(this.add.graphics(), 0, 0, w, t2.height + 50, 0.9);
    c.add([g, t1, t2]);
    this.tweens.chain({
      targets: c,
      tweens: [{ alpha: 1, duration: 200 }, { alpha: 1, duration: 2000 }, { alpha: 0, duration: 400 }],
      onComplete: () => { c.destroy(); this.nextToast(); },
    });
  }

  // ---------- dialogue panel ----------

  linePanelH() {
    return this.portrait ? 300 : 210;
  }

  panelHeight() {
    return this.linePanelH();
  }

  buildDialogue() {
    const { W } = this;
    this.dlg = this.add.container(0, 0).setDepth(100).setVisible(false);
    this.dlgG = this.add.graphics();
    this.speaker = text(this, PAD, 0, '', 16, C.name, { fontFamily: FONT_TITLE });
    this.body = new RichText(this, PAD, 0, W - PAD * 2, {
      size: 21, onWord: (fr, en, obj) => this.wordTip(fr, en, obj),
    });
    this.bodyEn = text(this, PAD, 0, '', 17, C.dim, { fontStyle: 'italic', wordWrap: { width: W - PAD * 2, useAdvancedWrap: true } });
    this.hint = text(this, W - PAD, 0, '▼', 18, C.ink).setOrigin(1, 1);
    this.tweens.add({ targets: this.hint, alpha: 0.15, yoyo: true, repeat: -1, duration: 500 });
    this.enBtn = makeButton(this, 0, 0, 56, 34, 'EN', () => this.toggleEn(), { size: 15 });
    this.ttsBtn = makeButton(this, 0, 0, 56, 34, '♪', () => speech.speak(this.currentFr), { size: 17 });
    this.dlg.add([this.dlgG, this.speaker, this.body.container, this.bodyEn, this.hint, this.enBtn.c, this.ttsBtn.c]);
  }

  layoutPanel(h) {
    const { W, H } = this;
    const top = H - h - 10;
    this.top = top;
    this.dlgG.clear();
    drawPanel(this.dlgG, 10, top, W - 20, h);
    this.speaker.setPosition(PAD, top + 18);
    this.enBtn.c.setPosition(W - PAD - 56, top + 12);
    this.ttsBtn.c.setPosition(W - PAD - 56 - 64, top + 12);
    this.hint.setPosition(W - PAD, top + h - 14);
    return top;
  }

  openDialogue() {
    if (this.dlg.visible) return;
    this.dlg.setVisible(true).setAlpha(0);
    this.tweens.add({ targets: this.dlg, alpha: 1, duration: 200 });
    this.carnetBtn.c.setVisible(false);
    this.soundBtn.c.setVisible(false);
  }

  closeDialogue() {
    this.clearOptions();
    this.body.clear();
    this.dlg.setVisible(false);
    this.carnetBtn.c.setVisible(true);
    this.soundBtn.c.setVisible(true);
    this.hideTip();
    this.lock(300);
  }

  toggleEn() {
    this.showEn = !this.showEn;
    this.bodyEn.setVisible(this.showEn && !!this.currentEn);
    this.options.forEach((o) => o.btn.setLabel(this.showEn ? o.en : o.label));
    if (this.options.length) this.arrangeOptions();
  }

  async showLine(l) {
    this.clearOptions();
    const top = this.layoutPanel(this.linePanelH());
    const narr = l.s === 'narr';
    const who = CAST[l.s];
    this.speaker.setText(narr ? '' : l.s === 'you' ? 'VOUS' : `${who.name.toUpperCase()} · ${who.role}`);
    this.body.y = top + 58;
    this.body.setText(l.fr, { italic: narr, color: narr ? '#cfc8b8' : C.ink });
    this.currentFr = plainText(l.fr);
    this.currentEn = l.en;
    this.bodyEn.setText(l.en).setPosition(PAD, this.body.y + this.body.height + 2).setVisible(this.showEn);
    this.ttsBtn.c.setVisible(this.soundOn && 'speechSynthesis' in window);
    this.enBtn.c.setVisible(true);

    glosses(l.fr).forEach((g) => this.state.addWord(g.fr, g.en));
    if (l.set) this.state.set(l.set);
    if (l.record && this.state.addStatement(l.record)) {
      this.sfx('right', 0.3);
      this.toast('TÉMOIGNAGE NOTÉ', `${CAST[STATEMENTS[l.record].who].name} : « ${STATEMENTS[l.record].fr} »`);
    }

    this.hint.setVisible(false);
    this.body.reveal(narr ? 55 : 40, () => this.hint.setVisible(true));
    await this.waitTap(this.body);
    this.sfx('click', 0.12);
  }

  async playLines(lines) {
    for (const l of lines) await this.showLine(l);
  }

  // ---------- option menus ----------

  clearOptions() {
    this.options.forEach((o) => o.btn.c.destroy());
    this.options = [];
    this.menuResolve = null;
  }

  arrangeOptions() {
    const { W } = this;
    const cols = this.portrait ? 1 : 2;
    const gap = 10;
    const colW = (W - PAD * 2 - gap * (cols - 1)) / cols;
    const rows = [];
    this.options.forEach((o, i) => {
      const r = Math.floor(i / cols);
      rows[r] = Math.max(rows[r] || 0, o.btn.h);
    });
    const total = rows.reduce((a, b) => a + b + gap, 0);
    const top = this.layoutPanel(52 + total + 14);
    let y = top + 50;
    rows.forEach((rh, r) => {
      for (let c = 0; c < cols; c++) {
        const o = this.options[r * cols + c];
        if (o) o.btn.c.setPosition(PAD + c * (colW + gap), y);
      }
      y += rh + gap;
    });
    this.hint.setVisible(false);
  }

  menu(title, options) {
    this.clearOptions();
    this.body.clear();
    this.bodyEn.setVisible(false);
    this.currentEn = null;
    this.speaker.setText(title);
    this.ttsBtn.c.setVisible(false);
    const cols = this.portrait ? 1 : 2;
    const colW = (this.W - PAD * 2 - 10 * (cols - 1)) / cols;
    return new Promise((resolve) => {
      this.menuResolve = resolve;
      options.forEach((o) => {
        const btn = makeButton(this, 0, 0, colW, 46, this.showEn ? o.en : o.label, () => {
          if (performance.now() < this.readyAt) return;
          const r = this.menuResolve;
          this.clearOptions();
          // The first reply line can't be skipped by a stray second event from this tap.
          this.readyAt = performance.now() + 350;
          r?.(o.value);
        }, { size: 18, align: 'left' });
        btn.setDim(!!o.dim);
        this.dlg.add(btn.c);
        this.options.push({ ...o, btn });
      });
      this.arrangeOptions();
      this.readyAt = performance.now() + 200;
    });
  }

  // ---------- interrogation and examination ----------

  async interrogate(id) {
    const d = DIALOGUE[id];
    const g = this.state;
    this.openDialogue();
    if (!g.has(`met_${id}`)) {
      await this.playLines(d.first);
      g.set(`met_${id}`);
    } else {
      await this.playLines(d.greet);
    }

    for (;;) {
      const topics = d.topics.filter((t) => (t.requires || []).every((r) => g.has(r)));
      const options = topics.map((t) => {
        const asked = g.wasAsked(id, t.id);
        return { label: `${asked ? '✓ ' : '› '}${t.q}`, en: `${asked ? '✓ ' : '› '}${t.en}`, dim: asked, value: { type: 'topic', t } };
      });
      if (g.evidence().length) options.push({ label: '◆ Présenter une preuve', en: '◆ Present evidence', value: { type: 'evidence' } });
      options.push({ label: '✕ Partir', en: '✕ Leave', value: { type: 'leave' } });

      const pick = await this.menu(`${CAST[id].name.toUpperCase()} · ${CAST[id].role}`, options);
      if (pick.type === 'leave') break;
      if (pick.type === 'topic') {
        await this.playLines(pick.t.lines);
        g.markAsked(id, pick.t.id);
        if (pick.t.end) {
          this.closeDialogue();
          await this.report();
          await this.outro();
          return;
        }
      } else {
        const ev = await this.pickEvidence(id);
        if (!ev) continue;
        const reaction = d.evidence?.[ev];
        if (!reaction) this.sfx('wrong', 0.25);
        await this.playLines(reaction || d.wrong);
      }
    }
    this.closeDialogue();
  }

  async examine(id) {
    const clue = CLUES[id];
    this.openDialogue();
    await this.playLines(clue.lines);
    if (this.state.addClue(id)) {
      this.sfx('right', 0.3);
      this.toast('INDICE AJOUTÉ', clue.name);
    }
    this.closeDialogue();
  }

  // ---------- tooltips ----------

  buildTooltip() {
    this.tip = this.add.container(0, 0).setDepth(250).setVisible(false);
  }

  wordTip(fr, en, obj) {
    this.lock();
    this.wordTappedAt = performance.now();
    this.state.markLooked(fr);
    this.hideTip();
    speech.speak(fr);
    const t1 = text(this, 12, 8, fr, 18, C.gold);
    const t2 = text(this, 12, 32, en, 16, C.ink, { fontStyle: 'italic' });
    const w = Math.max(t1.width, t2.width) + 24;
    const g = drawPanel(this.add.graphics(), 0, 0, w, 60, 0.97);
    const x = Phaser.Math.Clamp(obj.x + obj.width / 2 - w / 2, 8, this.W - w - 8);
    this.tip.removeAll(true).add([g, t1, t2]).setPosition(x, obj.y - 68).setVisible(true);
    this.tipShownAt = this.time.now;
    this.tipTimer?.remove();
    this.tipTimer = this.time.delayedCall(2600, () => this.hideTip());
  }

  hideTip() {
    if (this.tip?.visible && this.time.now - (this.tipShownAt || 0) > 50) this.tip.setVisible(false);
  }

  // ---------- full-screen overlays (evidence, carnet) ----------

  openOverlay(title) {
    const { W, H } = this;
    const c = this.add.container(0, 0).setDepth(150);
    const dim = this.add.rectangle(0, 0, W, H, 0x000000, 0.7).setOrigin(0).setInteractive();
    const g = drawPanel(this.add.graphics(), 14, 14, W - 28, H - 28, 0.97);
    const t = text(this, PAD + 6, 34, title, 24, C.ink, { fontFamily: FONT_TITLE });
    c.add([dim, g, t]);
    this.overlay = c;
    return c;
  }

  closeOverlay() {
    this.overlay?.destroy();
    this.overlay = null;
    this.overlayKind = null;
    this.lock(300);
  }

  // Lays out items (each returns {obj, h}) into columns and pages, with ◀ ▶ controls.
  pagedList(c, items, { top, bottom, cols }) {
    const { W } = this;
    const gap = 10;
    const colW = (W - PAD * 2 - 12 - gap * (cols - 1)) / cols;
    const built = items.map((it) => it(colW));
    const pages = [[]];
    let y = top;
    for (let i = 0; i < built.length; i += cols) {
      const row = built.slice(i, i + cols);
      const rh = Math.max(...row.map((b) => b.h));
      if (y + rh > bottom && pages[pages.length - 1].length) { pages.push([]); y = top; }
      row.forEach((b, k) => { b.obj.setPosition(PAD + 6 + k * (colW + gap), y); c.add(b.obj); pages[pages.length - 1].push(b.obj); });
      y += rh + gap;
    }
    let page = 0;
    const label = text(this, W / 2, bottom + 22, '', 16, C.dim).setOrigin(0.5);
    const show = (p) => {
      page = Phaser.Math.Clamp(p, 0, pages.length - 1);
      pages.forEach((objs, i) => objs.forEach((o) => o.setVisible(i === page)));
      label.setText(pages.length > 1 ? `${page + 1} / ${pages.length}` : '');
      prev.setEnabled(page > 0);
      next.setEnabled(page < pages.length - 1);
    };
    const prev = makeButton(this, W / 2 - 130, bottom + 4, 60, 38, '◀', () => show(page - 1), { size: 16 });
    const next = makeButton(this, W / 2 + 70, bottom + 4, 60, 38, '▶', () => show(page + 1), { size: 16 });
    prev.c.setVisible(pages.length > 1);
    next.c.setVisible(pages.length > 1);
    c.add([label, prev.c, next.c]);
    show(0);
    return { prev: () => show(page - 1), next: () => show(page + 1) };
  }

  pickEvidence(who) {
    return new Promise((resolve) => {
      const c = this.openOverlay('Présenter une preuve');
      this.overlayKind = 'picker';
      const sub = text(this, PAD + 6, 66, `à ${CAST[who].name}`, 16, C.dim, { fontStyle: 'italic' });
      c.add(sub);
      const done = (v) => { this.closeOverlay(); this.pickerKeys = null; resolve(v); };
      const items = this.state.evidence().map((e) => (w) => {
        const label = e.kind === 'clue'
          ? `▣ ${e.label}`
          : `${CAST[e.who].name} : « ${e.label} »`;
        const b = makeButton(this, 0, 0, w, 48, this.showEn ? (e.kind === 'clue' ? `▣ ${e.en}` : `${CAST[e.who].name}: "${e.en}"`) : label,
          () => done(e.id), { size: 16, align: 'left' });
        return { obj: b.c, h: b.h };
      });
      const cancel = makeButton(this, this.W - PAD - 130, 28, 130, 40, 'Annuler', () => done(null), { size: 16 });
      c.add(cancel.c);
      this.pickerKeys = this.pagedList(c, items, { top: 100, bottom: this.H - 76, cols: this.portrait ? 1 : 2 });
      this.pickerCancel = () => done(null);
    });
  }

  openCarnet(tab = 'indices') {
    if (this.modal() || this.world.busy) return;
    this.world.busy = true;
    this.sfx('open', 0.3);
    this.renderCarnet(tab);
  }

  renderCarnet(tab) {
    this.overlay?.destroy();
    const c = this.openOverlay('Carnet');
    this.overlayKind = 'carnet';
    const { W, H } = this;
    const g = this.state;
    const tabs = [['indices', `Indices (${g.clues.length})`], ['temoins', `Témoignages (${g.statements.length})`], ['mots', `Mots (${Object.keys(g.words).length})`]];
    const tabW = Math.min(190, (W - PAD * 2 - 20) / 3);
    tabs.forEach(([id, label], i) => {
      const b = makeButton(this, PAD + i * (tabW + 10), 76, tabW, 40, label, () => this.renderCarnet(id), { size: 15 });
      if (id !== tab) b.setDim(true);
      c.add(b.c);
    });
    const close = makeButton(this, W - PAD - 120, 28, 120, 40, 'Fermer', () => this.closeCarnet(), { size: 16 });
    const restart = makeButton(this, W - PAD - 120 - 10 - 150, 28, 150, 40, 'Recommencer', () => {
      if (restart.armed) { g.reset(); window.location.reload(); return; }
      restart.armed = true;
      restart.setLabel('Sûr ?');
    }, { size: 15 });
    c.add([close.c, restart.c]);

    const block = (lines) => (w) => {
      const cont = this.add.container(0, 0);
      let y = 0;
      lines.forEach(([str, size, color, extra = {}]) => {
        const t = text(this, 0, y, str, size, color, { wordWrap: { width: w, useAdvancedWrap: true }, ...extra });
        cont.add(t);
        y += t.height + 2;
      });
      return { obj: cont, h: y + 6 };
    };

    let items = [];
    let cols = this.portrait ? 1 : 2;
    if (tab === 'indices') {
      items = g.clues.map((id) => block([
        [CLUES[id].name, 19, C.gold, { fontFamily: FONT_TITLE }],
        [CLUES[id].note.fr, 16, C.ink],
        [CLUES[id].note.en, 14, C.dim, { fontStyle: 'italic' }],
      ]));
    } else if (tab === 'temoins') {
      items = g.statements.map((id) => block([
        [CAST[STATEMENTS[id].who].name, 17, C.name, { fontFamily: FONT_TITLE }],
        [`« ${STATEMENTS[id].fr} »`, 16, C.ink],
        [STATEMENTS[id].en, 14, C.dim, { fontStyle: 'italic' }],
      ]));
    } else {
      cols = this.portrait ? 2 : 3;
      items = Object.entries(g.words).map(([fr, en]) => (w) => {
        const b = block([[fr, 17, C.gold], [en, 14, C.dim, { fontStyle: 'italic' }]])(w);
        const z = this.add.zone(0, 0, w, b.h).setOrigin(0).setInteractive({ useHandCursor: true });
        z.on('pointerdown', () => speech.speak(fr));
        b.obj.add(z);
        return b;
      });
    }
    if (!items.length) {
      c.add(text(this, PAD + 6, 140, 'Rien pour le moment.', 17, C.dim, { fontStyle: 'italic' }));
    } else {
      this.carnetKeys = this.pagedList(c, items, { top: 132, bottom: H - 76, cols });
    }
  }

  closeCarnet() {
    this.closeOverlay();
    this.carnetKeys = null;
    this.world.busy = false;
  }

  // ---------- title cards ----------

  async card(lines, title, subtitle) {
    const { W, H } = this;
    this.cardOpen = true;
    this.world.busy = true;
    const c = this.add.container(0, 0).setDepth(300);
    const bg = this.add.rectangle(0, 0, W, H, 0x000000, 1).setOrigin(0);
    c.add(bg);
    const cw = Math.min(W - 70, 700);
    const x0 = (W - cw) / 2;
    let y = this.portrait ? H * 0.22 : H * 0.16;
    const enTexts = [];
    const en = makeButton(this, W - 76, H - 58, 56, 36, 'EN', () => {
      this.cardEn = !this.cardEn;
      enTexts.forEach((t) => t.setVisible(this.cardEn));
    }, { size: 15 });
    c.add(en.c);

    for (const l of lines) {
      const rt = new RichText(this, x0, y, cw, { size: this.portrait ? 21 : 22, onWord: (fr, e, obj) => this.wordTip(fr, e, obj) });
      rt.setText(l.fr, { italic: true, color: '#d9d2c3' });
      c.add(rt.container);
      glosses(l.fr).forEach((gl) => this.state.addWord(gl.fr, gl.en));
      const t = text(this, x0, y + rt.height, l.en, 15, C.dim, { fontStyle: 'italic', wordWrap: { width: cw } }).setVisible(!!this.cardEn);
      c.add(t);
      enTexts.push(t);
      y += rt.height + 26;
      rt.reveal(70);
      await this.waitTap(rt);
      this.sfx('click', 0.1);
    }
    if (title) {
      const t1 = text(this, W / 2, y + 30, title, this.portrait ? 26 : 30, C.ink, { fontFamily: FONT_TITLE, align: 'center', wordWrap: { width: cw } }).setOrigin(0.5, 0).setAlpha(0);
      const t2 = text(this, W / 2, y + 30 + t1.height + 14, subtitle || '', 16, C.dim, { align: 'center', fontStyle: 'italic', wordWrap: { width: cw } }).setOrigin(0.5, 0).setAlpha(0);
      c.add([t1, t2]);
      this.tweens.add({ targets: [t1, t2], alpha: 1, duration: 900 });
      this.audio?.thunder();
      await this.waitTap();
    }
    await new Promise((r) => this.tweens.add({ targets: c, alpha: 0, duration: 700, onComplete: r }));
    c.destroy();
    this.cardOpen = false;
    this.lock(300);
  }

  async begin() {
    if (!this.state.has('intro_seen')) {
      await this.card(INTRO, CHAPTER.title.toUpperCase(), CHAPTER.titleEn);
      this.state.set('intro_seen');
    }
    // Resume if the game was closed between the reveal and the end of the report.
    if (this.state.has('chapter1_done') && !this.state.has('report_done')) {
      await this.report();
    }
    if (this.state.has('report_done') && !this.state.has('outro_seen')) {
      await this.outro();
    }
    this.world.busy = false;
  }

  // Dubois asks for the report; the player types it up; Dubois gives a verdict.
  async report() {
    this.world.busy = true;
    this.cardOpen = true;
    this.openDialogue();
    await this.playLines(REPORT.intro);
    this.closeDialogue();
    this.carnetBtn.c.setVisible(false);
    this.soundBtn.c.setVisible(false);
    const mistakes = await runReport(this);
    this.state.set('report_done');
    this.openDialogue();
    const v = REPORT.verdict.find((x) => mistakes <= x.max);
    await this.playLines([v.line]);
    this.closeDialogue();
    this.cardOpen = false;
    this.updateHud();
  }

  async outro() {
    await this.card(OUTRO, 'FIN DU CHAPITRE 1', 'Chapitre 2 — La nuit du crime · bientôt\nChapter 2 — The Night of the Crime · coming soon');
    this.state.set('outro_seen');
    this.updateHud();
  }

  // ---------- keyboard ----------

  onKey(e) {
    const k = e.key;
    if (this.reportKeys) { this.reportKeys(k); return; }
    if (this.overlay) {
      if (k === 'Escape') {
        if (this.overlayKind === 'carnet') this.closeCarnet(); else this.pickerCancel?.();
      }
      const keys = this.overlayKind === 'carnet' ? this.carnetKeys : this.pickerKeys;
      if (k === 'ArrowLeft') keys?.prev();
      if (k === 'ArrowRight') keys?.next();
      return;
    }
    if (this.options.length && /^[1-9]$/.test(k)) {
      const o = this.options[Number(k) - 1];
      if (o && this.menuResolve && performance.now() >= this.readyAt) {
        const r = this.menuResolve;
        this.clearOptions();
        this.readyAt = performance.now() + 350;
        r(o.value);
      }
      return;
    }
    if (this.options.length && k === 'Escape') {
      const leave = this.options.find((o) => o.value.type === 'leave');
      if (leave) { const r = this.menuResolve; this.clearOptions(); r(leave.value); }
      return;
    }
    if (k === ' ' || k === 'Enter' || k === 'e' || k === 'E') { this.continue(); return; }
    if ((k === 'c' || k === 'C') && !this.modal()) this.openCarnet();
  }
}
