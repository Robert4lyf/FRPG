import {
  CAST, CLUES, STATEMENTS, CONFLICTS, DIARY, CHAPTERS, chapterOf, phaseOf, timeKey,
} from '../story/story.js';
import { speech } from '../learning/speech.js';
import {
  C, FONT_TITLE, FONT_BODY, drawPanel, text, makeButton, RichText, plainText, glosses,
} from '../ui/theme.js';
import { Weather, NoirAudio } from '../fx/noir.js';
import { runReport } from '../ui/report.js';
import { runCutscene } from '../ui/cutscene.js';
import { runDiary } from '../ui/diary.js';
import { runPuzzle } from '../ui/puzzle.js';
import { CUTSCENES } from '../story/cutscenes.js';

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
    // The scene object is reused on restart: clear anything a card or cutscene left open.
    this.cardOpen = false; this.overlay = null; this.overlayKind = null;
    this.reportKeys = null; this.cutsceneSkip = null; this.diarySolve = null; this.puzzleSolve = null; this.toasts = []; this.toasting = false;
    this.waiting = null;
    this.showEn = false;
    this.options = [];

    let soundOn = true;
    try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off'; } catch { /* ignore */ }

    // One audio engine for the whole game (made on the title screen), so nothing doubles up.
    if (!this.registry.get('audio') && this.sound.context) this.registry.set('audio', new NoirAudio(this.sound));
    this.audio = this.registry.get('audio');
    this.audio?.setTheme(phaseOf(this.state));
    this.weather = new Weather(this, this.audio);
    this.weather.setIndoor(!!this.world.indoors);

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

  // The chapter being played (prologue, ch1, ch2...).
  ch() {
    return chapterOf(phaseOf(this.state));
  }

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
    this.soundBtn?.setLabel(on ? 'Son : oui' : 'Son : non');
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
    const list = this.ch().objectives;
    const obj = list.find((o) => !o.done(g)) || list[list.length - 1];
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
    return this.portrait ? 300 : 226;
  }

  panelHeight() {
    return this.linePanelH();
  }

  buildDialogue() {
    const { W } = this;
    this.dlg = this.add.container(0, 0).setDepth(100).setVisible(false);
    this.dlgG = this.add.graphics();
    this.speaker = text(this, PAD, 0, '', 15, C.name, { fontFamily: FONT_TITLE, lineSpacing: -2 });
    this.body = new RichText(this, PAD, 0, W - PAD * 2, {
      size: 21, onWord: (fr, en, obj) => this.wordTip(fr, en, obj),
    });
    this.bodyEn = text(this, PAD, 0, '', 17, C.dim, { fontStyle: 'italic', wordWrap: { width: W - PAD * 2, useAdvancedWrap: true } });
    this.hint = text(this, W - PAD, 0, '»', 28, C.ink, { fontFamily: FONT_TITLE }).setOrigin(1, 1);
    this.tweens.add({ targets: this.hint, alpha: 0.15, yoyo: true, repeat: -1, duration: 500 });
    this.enBtn = makeButton(this, 0, 0, 56, 34, 'EN', () => this.toggleEn(), { size: 15 });
    this.ttsBtn = makeButton(this, 0, 0, 56, 34, '', () => speech.speak(this.currentFr), { size: 17 });
    // A drawn speaker icon: no font has the same symbol on every phone.
    const icon = this.add.graphics();
    icon.fillStyle(0xe9e3d5, 1).fillRect(16, 14, 5, 6).fillPoints([{ x: 21, y: 14 }, { x: 27, y: 9 }, { x: 27, y: 25 }, { x: 21, y: 20 }], true);
    icon.lineStyle(1.5, 0xe9e3d5, 1);
    icon.beginPath(); icon.arc(28, 17, 5, -0.9, 0.9); icon.strokePath();
    icon.beginPath(); icon.arc(28, 17, 9, -0.9, 0.9); icon.strokePath();
    this.ttsBtn.c.add(icon);
    // Speaker portrait at the left of the text box, with a blink now and then.
    this.portraitZoom = this.portrait ? 1.5 : 2;
    this.portraitFrame = this.add.graphics();
    this.portraitImg = this.add.image(0, 0, 'portrait_inspector', 0).setOrigin(0).setScale(this.portraitZoom).setVisible(false);
    // Previous expression, faded out on top when the expression changes.
    this.portraitFade = this.add.image(0, 0, 'portrait_inspector', 0).setOrigin(0).setScale(this.portraitZoom).setVisible(false);
    this.portraitExpr = 0;
    this.dlg.add([this.dlgG, this.portraitFrame, this.portraitImg, this.portraitFade, this.speaker, this.body.container, this.bodyEn, this.hint, this.enBtn.c, this.ttsBtn.c]);
    const blink = () => {
      this.time.delayedCall(2400 + Math.random() * 3200, () => {
        // Only the neutral face has a blink frame.
        if (this.portraitImg.visible && this.portraitExpr === 0) {
          this.portraitImg.setFrame(1);
          this.time.delayedCall(130, () => { if (this.portraitExpr === 0) this.portraitImg.setFrame(0); });
        }
        blink();
      });
    };
    blink();
  }

  layoutPanel(h) {
    const { W, H } = this;
    const top = H - h - 10;
    this.top = top;
    this.dlgG.clear();
    drawPanel(this.dlgG, 10, top, W - 20, h);
    this.speaker.setPosition(PAD, top + 13);
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

  // Shows the speaker's portrait (if they have one) with an expression; returns the x where
  // text should start. Expressions: neutral (frame 0), hostile (2), shaken (3).
  showPortrait(id, top, expr) {
    const key = `portrait_${id}`;
    const frame = { hostile: 2, shaken: 3 }[expr] || 0;
    this.portraitFrame.clear();
    this.portraitFade.setVisible(false);
    if (!id || !this.textures.exists(key)) {
      this.portraitImg.setVisible(false);
      this.portraitKey = null;
      return PAD;
    }
    const size = 96 * this.portraitZoom;
    const x = PAD - 6;
    const y = top + 16;
    this.portraitFrame.fillStyle(0x161a2c, 1).fillRect(x, y, size, size);
    this.portraitFrame.lineStyle(1, 0xd9d2c3, 0.5).strokeRect(x - 1.5, y - 1.5, size + 3, size + 3);
    // Same person changing expression: cross-fade from the old face.
    if (this.portraitKey === key && this.portraitImg.visible && this.portraitExpr !== frame) {
      this.tweens.killTweensOf(this.portraitFade);
      this.portraitFade.setTexture(key, this.portraitExpr).setPosition(x, y).setAlpha(1).setVisible(true);
      this.tweens.add({ targets: this.portraitFade, alpha: 0, duration: 220, onComplete: () => this.portraitFade.setVisible(false) });
    }
    this.portraitImg.setTexture(key, frame).setPosition(x, y).setVisible(true);
    this.portraitKey = key;
    this.portraitExpr = frame;
    return x + size + 16;
  }

  async showLine(l) {
    this.clearOptions();
    const top = this.layoutPanel(this.linePanelH());
    const narr = l.s === 'narr';
    const who = CAST[l.s];
    // Name on the first line, role underneath, so long names never run under the buttons.
    this.speaker.setText(narr ? '' : l.s === 'you' ? 'VOUS' : `${who.name.toUpperCase()}\n${who.role}`);
    const textX = this.showPortrait(l.s === 'you' ? 'inspector' : l.s, top, l.e);
    this.speaker.setX(textX);
    this.body.x = textX;
    this.body.width = this.W - PAD - textX;
    this.bodyEn.setWordWrapWidth(this.W - PAD - textX);
    this.body.y = top + 58;
    this.body.setText(l.fr, { italic: narr, color: narr ? '#cfc8b8' : C.ink });
    this.currentFr = plainText(l.fr);
    this.currentEn = l.en;
    this.bodyEn.setText(l.en).setPosition(textX, this.body.y + this.body.height + 2).setVisible(this.showEn);
    this.ttsBtn.c.setVisible(this.soundOn && 'speechSynthesis' in window);
    this.enBtn.c.setVisible(true);

    glosses(l.fr).forEach((g) => this.state.addWord(g.fr, g.en));
    if (l.set) this.state.set(l.set);
    if (l.clue && this.state.addClue(l.clue)) {
      this.sfx('right', 0.3);
      this.toast('INDICE AJOUTÉ', CLUES[l.clue].name);
    }
    if (l.record && this.state.addStatement(l.record)) {
      this.sfx('right', 0.3);
      this.toast('TÉMOIGNAGE NOTÉ', `${CAST[STATEMENTS[l.record].who].name} : « ${STATEMENTS[l.record].fr} »`);
      // Two statements that can't both be true: flag it.
      CONFLICTS.filter((k) => (k.a === l.record || k.b === l.record) && this.state.has(k.a) && this.state.has(k.b) && !this.state.has(k.resolved))
        .forEach((k) => this.toast('CONTRADICTION', k.fr));
    }

    this.hint.setVisible(false);
    this.body.reveal(narr ? 55 : 40, () => this.hint.setVisible(true));
    await this.waitTap(this.body);
    this.sfx('click', 0.12);
  }

  // Lines can depend on what the player has already heard: `if` (all must be known) and
  // `unless` (skip if known), so nobody refers back to a conversation that never happened.
  async playLines(lines) {
    const g = this.state;
    const list = (v) => (Array.isArray(v) ? v : v ? [v] : []);
    for (const l of lines) {
      if (!list(l.if).every((f) => g.has(f)) || list(l.unless).some((f) => g.has(f))) continue;
      await this.showLine(l);
    }
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
    this.portraitImg.setVisible(false);
    this.portraitFade.setVisible(false);
    this.portraitKey = null;
    this.portraitFrame.clear();
    this.speaker.setX(PAD);
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
        }, { size: 18, align: 'left', font: FONT_BODY });
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
    const ch = this.ch();
    const prologue = ch.id === 'prologue';
    const d = ch.dialogue[id];
    const metKey = ch.metKey(id);
    const g = this.state;
    this.openDialogue();
    if (!g.has(metKey)) {
      await this.playLines(d.first);
      g.set(metKey);
    } else {
      await this.playLines(d.greet);
    }
    // Scripted scenes with nothing to ask (Hélène, Théo in the prologue) end here.
    if (!d.topics.length && !d.evidence) {
      this.closeDialogue();
      if (prologue && g.has('prologue_done') && !g.has('night_seen')) await this.night();
      return;
    }

    for (;;) {
      const topics = d.topics.filter((t) => (t.requires || []).every((r) => g.has(r)));
      const options = topics.map((t) => {
        const asked = g.wasAsked(id, ch.askKey(t.id));
        return { label: `${asked ? '   ' : '» '}${t.q}`, en: `${asked ? '   ' : '» '}${t.en}`, dim: asked, value: { type: 'topic', t } };
      });
      if (ch.evidence && g.evidence().length) options.push({ label: '+ Présenter une preuve', en: '+ Present evidence', value: { type: 'evidence' } });
      options.push({ label: '« Partir', en: '« Leave', value: { type: 'leave' } });

      const pick = await this.menu(`${CAST[id].name.toUpperCase()} · ${CAST[id].role}`, options);
      if (pick.type === 'leave') break;
      if (pick.type === 'topic') {
        await this.playLines(pick.t.lines);
        g.markAsked(id, ch.askKey(pick.t.id));
        if (pick.t.end) {
          this.closeDialogue();
          await this.report();
          await this.outro();
          return;
        }
      } else {
        const ev = await this.pickEvidence(id);
        if (!ev) continue;
        let reaction = d.evidence?.[ev];
        if (typeof reaction === 'string') reaction = d.shared?.[reaction];
        if (!reaction) this.sfx('wrong', 0.25);
        await this.playLines(reaction || d.wrong);
      }
    }
    this.closeDialogue();
    await this.checkDiary();
  }

  // Once all of Hélène's diary pages are found, the player puts them in order.
  async checkDiary() {
    const g = this.state;
    if (!this.ch().diary || g.has('journal_ordre') || !DIARY.pieces.every((p) => g.has(p))) return;
    this.world.busy = true;
    this.cardOpen = true;
    this.toast('LE JOURNAL', 'Toutes les pages sont là.');
    await new Promise((r) => this.time.delayedCall(900, r));
    await runDiary(this, DIARY);
    g.set('journal_ordre');
    this.cardOpen = false;
    this.openDialogue();
    await this.playLines(DIARY.done);
    this.closeDialogue();
    this.world.busy = false;
  }

  // A few lines outside any conversation (e.g. a locked door).
  async sayLines(lines) {
    this.openDialogue();
    await this.playLines(lines);
    this.closeDialogue();
  }

  // Back to the town map (a chapter change or a cutscene always resumes outside).
  toTown() {
    this.registry.set('room', null); // the world picks the chapter's starting place
    this.registry.set('spawn', null);
    this.registry.set('roomEntered', false);
  }

  // A place that brings back a memory. Some (going back to the café to sleep) move the
  // story on: they set a flag and play a cutscene, then the town is rebuilt.
  async recall(id) {
    const m = this.ch().memories[id];
    this.openDialogue();
    await this.playLines(m.lines);
    this.closeDialogue();
    this.state.set(`mem_${id}`);
    if (m.set) this.state.set(m.set);
    if (m.cut) {
      await runCutscene(this, CUTSCENES[m.cut], null, null, { hold: true });
      this.toTown();
      this.scene.get('World').scene.restart();
      this.scene.restart();
    }
  }

  async examine(id) {
    const clue = CLUES[id];
    const p = clue.puzzle;
    this.openDialogue();
    // A puzzle stands between the player and some clues: solve it to get the clue.
    if (p && !this.state.has(`solved_${id}`)) {
      if (p.needs && !this.state.has(p.needs)) {
        await this.playLines(p.blocked);
        this.closeDialogue();
        return;
      }
      await this.playLines(p.before || []);
      this.closeDialogue();
      this.cardOpen = true;
      const solved = await runPuzzle(this, p);
      this.cardOpen = false;
      this.lock(300);
      this.openDialogue();
      if (!solved) {
        await this.playLines(p.later || []);
        this.closeDialogue();
        return;
      }
      this.state.set(`solved_${id}`);
    }
    await this.playLines(clue.lines);
    if (this.state.addClue(id)) {
      this.sfx('right', 0.3);
      this.toast('INDICE AJOUTÉ', clue.name);
    }
    this.closeDialogue();
    await this.checkDiary();
  }

  // ---------- tooltips ----------

  buildTooltip() {
    this.tip = this.add.container(0, 0).setDepth(400).setVisible(false);
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
    const prev = makeButton(this, W / 2 - 130, bottom + 4, 60, 38, '«', () => show(page - 1), { size: 16 });
    const next = makeButton(this, W / 2 + 70, bottom + 4, 60, 38, '»', () => show(page + 1), { size: 16 });
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
      // This chapter's evidence first (newest first), then earlier chapters'.
      const phase = this.ch().id;
      const ev = this.state.evidence().reverse();
      const of = (e) => (e.kind === 'clue' ? CLUES[e.id] : STATEMENTS[e.id]).phase === phase;
      const items = [...ev.filter(of), ...ev.filter((e) => !of(e))].map((e) => (w) => {
        const label = e.kind === 'clue'
          ? `• ${e.label}`
          : `${CAST[e.who].name} : « ${e.label} »`;
        const b = makeButton(this, 0, 0, w, 48, this.showEn ? (e.kind === 'clue' ? `• ${e.en}` : `${CAST[e.who].name}: "${e.en}"`) : label,
          () => done(e.id), { size: 16, align: 'left', font: FONT_BODY });
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
    const tabs = [['indices', `Indices (${g.clues.length})`], ['temoins', `Témoins (${g.statements.length})`], ['mots', `Mots (${Object.keys(g.words).length})`]];
    if (g.has('timeline_open')) tabs.splice(2, 0, ['chrono', 'Chrono']);
    const tabW = Math.min(190, (W - PAD * 2 - 10 * (tabs.length - 1)) / tabs.length);
    tabs.forEach(([id, label], i) => {
      const b = makeButton(this, PAD + i * (tabW + 10), 76, tabW, 40, label, () => this.renderCarnet(id), { size: 15 });
      if (id !== tab) b.setDim(true);
      c.add(b.c);
    });
    const close = makeButton(this, W - PAD - 120, 28, 120, 40, 'Fermer', () => this.closeCarnet(), { size: 16 });
    // Back to the title screen (progress is saved); new game and chapters are there.
    const menu = makeButton(this, W - PAD - 120 - 10 - 110, 28, 110, 40, 'Menu', () => {
      this.closeCarnet();
      this.audio?.setCafe(0);
      this.toTown();
      this.scene.stop('World');
      this.scene.start('Title');
    }, { size: 15 });
    c.add([close.c, menu.c]);

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
    } else if (tab === 'chrono') {
      items = this.timelineItems(block);
      cols = 1;
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

  // Everything with a time, in order, from that afternoon to midnight. Lines in conflict are red.
  timelineItems(block) {
    const g = this.state;
    const known = CONFLICTS.filter((k) => g.has(k.a) && g.has(k.b));
    const open = known.filter((k) => !g.has(k.resolved));
    const clash = new Set(open.flatMap((k) => [k.a, k.b]));
    const entries = [
      ...g.statements.filter((id) => STATEMENTS[id].t).map((id) => ({
        id, t: STATEMENTS[id].t, who: CAST[STATEMENTS[id].who].name, fr: `« ${STATEMENTS[id].fr} »`, en: STATEMENTS[id].en,
      })),
      ...g.clues.filter((id) => CLUES[id].t).map((id) => ({ id, t: CLUES[id].t, who: `• ${CLUES[id].name}`, fr: CLUES[id].note.fr, en: CLUES[id].note.en })),
    ].sort((a, b) => timeKey(a.t) - timeKey(b.t));
    const fmt = (t) => t.replace(':', ' h ');
    const items = entries.map((e) => block([
      [`${clash.has(e.id) ? '! ' : ''}${fmt(e.t)} — ${e.who}`, 16, clash.has(e.id) ? '#e0645a' : C.gold, { fontFamily: FONT_TITLE }],
      [e.fr, 15, C.ink],
      [e.en, 13, C.dim, { fontStyle: 'italic' }],
    ]));
    // Open contradictions first, then the ones already explained.
    [...open, ...known.filter((k) => !open.includes(k))].forEach((k) => items.push(block([
      [open.includes(k) ? 'CONTRADICTION' : 'EXPLIQUÉ', 15, open.includes(k) ? '#e0645a' : C.dim, { fontFamily: FONT_TITLE }],
      [k.fr, 15, open.includes(k) ? C.ink : C.dim],
      [k.en, 13, C.dim, { fontStyle: 'italic' }],
    ])));
    return items;
  }

  closeCarnet() {
    this.closeOverlay();
    this.carnetKeys = null;
    this.world.busy = false;
  }

  // ---------- title cards ----------

  // hold: a cutscene follows straight away, so stay on black rather than fading to the map.
  async card(lines, title, subtitle, { hold = false } = {}) {
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
    if (hold) {
      this.time.delayedCall(1500, () => c.destroy()); // the next cutscene covers it by then
      return;
    }
    await new Promise((r) => this.tweens.add({ targets: c, alpha: 0, duration: 700, onComplete: r }));
    c.destroy();
    this.cardOpen = false;
    this.lock(300);
  }

  async begin() {
    if (!this.state.has('intro_seen')) {
      await runCutscene(this, CUTSCENES.prologue, CHAPTERS.prologue.title.toUpperCase(), CHAPTERS.prologue.titleEn);
      this.state.set('intro_seen');
    }
    // Resume if the game was closed after the prologue but before the night card finished.
    if (this.state.has('prologue_done') && !this.state.has('night_seen')) {
      await this.night();
      return;
    }
    // Resume if the game was closed between the reveal and the end of the report.
    const ch = this.ch();
    if (ch.flags) {
      if (this.state.has(ch.flags.done) && !this.state.has(ch.flags.report)) await this.report();
      if (this.state.has(ch.flags.report) && !this.state.has(ch.flags.outro)) { await this.outro(); return; }
      // Closed after a chapter ended but before the next one began.
      if (this.state.has(ch.flags.outro) && ch.next) { await this.startChapter(ch.next); return; }
    }
    this.world.busy = false;
    // Some chapters open mid-scene: the conversation starts by itself (Théo at the door).
    const who = ch.autoTalk;
    if (who && !this.state.has(ch.metKey(who))) {
      this.time.delayedCall(700, () => {
        const s = this.world.people?.find((p) => p.id === who);
        if (s && !this.world.busy) this.world.interact(s);
      });
    }
  }

  // The night of the murder, then the morning: rebuild the town for chapter 1.
  async night() {
    await runCutscene(this, CUTSCENES.ch1, CHAPTERS.ch1.title.toUpperCase(), CHAPTERS.ch1.titleEn, { hold: true });
    this.state.set('night_seen');
    this.toTown();
    this.scene.get('World').scene.restart();
    this.scene.restart();
  }

  // Dubois asks for the report; the player types it up; Dubois gives a verdict.
  async report() {
    const { report, flags } = this.ch();
    this.world.busy = true;
    this.cardOpen = true;
    this.openDialogue();
    await this.playLines(report.intro);
    this.closeDialogue();
    this.carnetBtn.c.setVisible(false);
    this.soundBtn.c.setVisible(false);
    const mistakes = await runReport(this, report);
    this.state.set(flags.report);
    this.openDialogue();
    const v = report.verdict.find((x) => mistakes <= x.max);
    await this.playLines([v.line]);
    this.closeDialogue();
    this.cardOpen = false;
    this.updateHud();
  }

  async outro() {
    const ch = this.ch();
    await this.card(ch.outro, ch.outroTitle, ch.outroSub, { hold: !!ch.next });
    this.state.set(ch.flags.outro);
    this.updateHud();
    if (ch.next) await this.startChapter(ch.next);
    else this.world.busy = false;
  }

  // Title card for the next chapter, then rebuild the town for it.
  async startChapter(id) {
    const next = CHAPTERS[id];
    await runCutscene(this, CUTSCENES[id], next.title.toUpperCase(), next.titleEn, { hold: true });
    this.state.set(next.flags.start);
    this.toTown();
    this.scene.get('World').scene.restart();
    this.scene.restart();
  }

  // ---------- keyboard ----------

  onKey(e) {
    const k = e.key;
    if (this.reportKeys) { this.reportKeys(k); return; }
    if (this.cutsceneSkip && k === 'Escape') { this.cutsceneSkip(); return; }
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
