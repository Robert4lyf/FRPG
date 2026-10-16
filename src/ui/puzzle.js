// Small investigation puzzles on a sheet of paper (answering machine, graves, padlock,
// bus ticket). Each one is solved by understanding the French: optional items to read or
// listen to, a question, and a few answers. Returns true when solved, false if closed.
import { FONT_TITLE, FONT_BODY, makeButton, plainText, glosses } from './theme.js';
import { speech } from '../learning/speech.js';

const INK = '#26221e';
const FAINT = '#8a8070';
const RED = '#a3262c';
const PAPER = 0xe6dcc6;

export async function runPuzzle(ui, p) {
  const { W, H } = ui;
  const portrait = H > W;
  const m = portrait ? 16 : 24;
  const c = ui.add.container(0, 0).setDepth(320);
  c.add(ui.add.rectangle(0, 0, W, H, 0x000000, 0.85).setOrigin(0).setInteractive());
  const paper = ui.add.graphics();
  paper.fillStyle(PAPER, 1).fillRect(m, m, W - m * 2, H - m * 2);
  paper.lineStyle(1, 0x8a8070, 0.6).strokeRect(m + 6, m + 6, W - m * 2 - 12, H - m * 2 - 12);
  c.add(paper);
  const iw = W - m * 2 - 48;
  const t = (x, y, s, size, color = INK, extra = {}) => ui.add.text(x, y, s, {
    fontFamily: FONT_BODY, fontSize: `${size}px`, color, wordWrap: { width: iw, useAdvancedWrap: true }, ...extra,
  });
  let showEn = false;
  const enTexts = [];
  const en = (obj) => { enTexts.push(obj); obj.setVisible(false); return obj; };

  c.add(t(m + 24, m + 18, p.title, 13, FAINT, { fontFamily: FONT_TITLE }));
  c.add(t(m + 24, m + 38, p.heading, portrait ? 22 : 24, INK, { fontFamily: FONT_TITLE }));
  let y = m + 74;
  if (p.sub) {
    const s = t(m + 24, y, p.sub.fr, 15, FAINT, { fontStyle: 'italic' });
    const se = en(t(m + 24, y + s.height, p.sub.en, 13, FAINT, { fontStyle: 'italic' }));
    c.add([s, se]);
    y += s.height + se.height + 10;
  }
  [p.question?.fr, ...(p.items || []).map((i) => i.fr), ...p.options].forEach((s) => s && glosses(s).forEach((g) => ui.state.addWord(g.fr, g.en)));

  // Items: things to read; `speak` ones are heard first (tap to play), `hidden` until played.
  const items = (p.items || []).map((it) => {
    const box = ui.add.container(m + 24, y);
    const head = makeButton(ui, 0, 0, iw, portrait ? 40 : 30, it.speak ? `» ${it.label}` : it.label, () => {
      if (it.speak) speech.speak(plainText(it.fr));
      body.setVisible(true);
      if (showEn) bodyEn.setVisible(true);
      layout();
    }, { size: portrait ? 15 : 14, align: 'left' });
    const body = t(8, head.h + 4, plainText(it.fr), 16, INK).setVisible(!it.hidden);
    const bodyEn = t(8, head.h + 4 + body.height, it.en, 13, FAINT, { fontStyle: 'italic' }).setVisible(false);
    enTexts.push({ setVisible: (v) => bodyEn.setVisible(v && body.visible) });
    box.add([head.c, body, bodyEn]);
    c.add(box);
    return { box, head, body, bodyEn };
  });

  const q = t(m + 24, 0, p.question.fr, portrait ? 18 : 19, INK, { fontStyle: 'bold' });
  const qe = en(t(m + 24, 0, p.question.en, 13, FAINT, { fontStyle: 'italic' }));
  const note = t(m + 24, 0, '', 14, RED, { fontStyle: 'italic' }).setVisible(false);
  c.add([q, qe, note]);

  let resolve;
  const done = new Promise((r) => { resolve = r; });
  const cols = portrait ? 1 : 2;
  const bw = (iw - 10 * (cols - 1)) / cols;
  const opts = p.options.map((o, k) => {
    const b = makeButton(ui, 0, 0, bw, portrait ? 46 : 40, o, () => {
      if (k === p.answer) {
        ui.sfx('right', 0.3);
        b.setLabel(`» ${o}`);
        ui.time.delayedCall(600, () => resolve(true));
        return;
      }
      ui.sfx('wrong', 0.25);
      b.setEnabled(false);
      note.setText(`${p.wrong.fr}${showEn ? `\n${p.wrong.en}` : ''}`).setVisible(true);
      layout();
    }, { size: 16, font: FONT_BODY });
    c.add(b.c);
    return b;
  });

  const layout = () => {
    let yy = y;
    items.forEach((it) => {
      it.box.setY(yy);
      yy += it.head.h + (it.body.visible ? it.body.height + 4 : 0) + (it.bodyEn.visible ? it.bodyEn.height : 0) + (portrait ? 10 : 6);
    });
    yy += 6;
    q.setY(yy); yy += q.height;
    qe.setY(yy); if (qe.visible) yy += qe.height;
    yy += 10;
    for (let i = 0; i < opts.length; i += cols) {
      const row = opts.slice(i, i + cols);
      row.forEach((b, j) => b.c.setPosition(m + 24 + j * (bw + 10), yy));
      yy += Math.max(...row.map((b) => b.h)) + (portrait ? 8 : 6);
    }
    yy += 4;
    note.setY(yy);
  };
  layout();

  const close = makeButton(ui, W - m - 24 - 100, m + 18, 100, 34, 'Fermer', () => resolve(false), { size: 14 });
  const enBtn = makeButton(ui, W - m - 24 - 100 - 8 - 56, m + 18, 56, 34, 'EN', () => {
    showEn = !showEn;
    enTexts.forEach((o) => o.setVisible(showEn));
    layout();
  }, { size: 14 });
  c.add([close.c, enBtn.c]);

  // For automated playtests.
  ui.puzzleSolve = () => { const z = opts[p.answer].c.list.find((o) => o.type === 'Zone'); z.emit('pointerdown'); z.emit('pointerup'); };
  ui.reportKeys = (key) => {
    if (key === 'Escape') { resolve(false); return; }
    const z = opts[Number(key) - 1]?.c.list.find((o) => o.type === 'Zone');
    if (z) { z.emit('pointerdown'); z.emit('pointerup'); }
  };
  const solved = await done;
  ui.reportKeys = null;
  ui.puzzleSolve = null;
  await new Promise((r) => ui.tweens.add({ targets: c, alpha: 0, duration: 300, onComplete: r }));
  c.destroy();
  return solved;
}
