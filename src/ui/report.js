
import { FONT_TITLE, FONT_BODY, makeButton } from './theme.js';

// The end-of-chapter case report, typed onto a sheet of paper one line at a time.
// The player fills each blank from three French options. A wrong pick is crossed out,
// the English appears as a hint, and the word is saved for review in later chapters.
const INK = '#26221e';
const FAINT = '#8a8070';
const RED = '#a3262c';
const PAPER = 0xebe4d2;

export async function runReport(ui, REPORT) {
  const { W, H } = ui;
  const portrait = H > W;
  const scene = ui;
  const c = scene.add.container(0, 0).setDepth(320);
  const dim = scene.add.rectangle(0, 0, W, H, 0x000000, 0.82).setOrigin(0).setInteractive();
  const m = portrait ? 18 : 26;
  const px = m;
  const pw = W - m * 2;
  const top = m;
  const ph = H - m * 2;
  const paper = scene.add.graphics();
  paper.fillStyle(PAPER, 1).fillRect(px, top, pw, ph);
  paper.fillStyle(0x000000, 0.06);
  for (let y = top + 8; y < top + ph; y += 26) paper.fillRect(px, y, pw, 1); // faint ruling
  paper.lineStyle(1, 0x8a8070, 0.6).strokeRect(px + 6, top + 6, pw - 12, ph - 12);
  c.add([dim, paper]);

  const t = (x, y, str, size, color = INK, extra = {}) => scene.add.text(x, y, str, {
    fontFamily: FONT_BODY, fontSize: `${size}px`, color, wordWrap: { width: pw - 48, useAdvancedWrap: true }, ...extra,
  });
  const header = t(px + 24, top + 20, REPORT.header, 13, FAINT, { fontFamily: FONT_TITLE });
  const title = t(px + 24, top + 38, REPORT.title, portrait ? 24 : 26, INK, { fontFamily: FONT_TITLE });
  const sub = t(px + 24, top + 72, REPORT.case, 15, FAINT, { fontStyle: 'italic' });
  c.add([header, title, sub]);

  let showEn = false;
  const enBtn = makeButton(scene, px + pw - 24 - 56, top + 20, 56, 34, 'EN', () => {
    showEn = !showEn;
    hint.setVisible(showEn || hintForced);
  }, { size: 14 });
  c.add(enBtn.c);

  const bodyTop = top + 104;
  const choiceH = 54;
  const choicesTop = top + ph - 24 - (portrait ? 3 * (choiceH + 8) : choiceH);
  const bodyBottom = choicesTop - 54;
  const done = []; // finished line text objects
  let hintForced = false;
  const hint = t(px + 24, 0, '', 14, FAINT, { fontStyle: 'italic' }).setVisible(false);
  const note = t(px + 24, 0, '', 14, RED, { fontStyle: 'italic' }).setVisible(false);
  c.add([hint, note]);

  // Keep finished lines stacked; scroll older ones off the top if space runs out.
  const layout = (current) => {
    let y = bodyTop;
    const all = [...done, current].filter(Boolean);
    const heights = all.map((o) => o.height + 8);
    let total = heights.reduce((a, b) => a + b, 0);
    let first = 0;
    while (total > bodyBottom - bodyTop && first < all.length - 1) { total -= heights[first]; first += 1; }
    all.forEach((o, i) => {
      o.setVisible(i >= first);
      if (i >= first) { o.setY(y); y += heights[i]; }
    });
    hint.setY(y - 4);
    note.setY(y + hint.height - 2);
  };

  const typeOut = (obj, full) => new Promise((resolve) => {
    let i = 0;
    const ev = scene.time.addEvent({
      delay: 22, loop: true, callback: () => {
        i += 1;
        obj.setText(full.slice(0, i));
        if (i % 3 === 0) scene.sfx('click', 0.05);
        if (i >= full.length) { ev.remove(); resolve(); }
      },
    });
  });

  let mistakes = 0;
  for (let n = 0; n < REPORT.lines.length; n++) {
    const line = REPORT.lines[n];
    const [before, after] = line.fr.split('{}');
    const label = `${n + 1}. `;
    const current = t(px + 24, bodyTop, '', portrait ? 18 : 19);
    c.add(current);
    layout(current);
    await typeOut(current, `${label}${before}______${after}`);
    hint.setText(line.en);
    hintForced = false;
    hint.setVisible(showEn);
    note.setVisible(false);
    layout(current);

    // Choices
    const picked = await new Promise((resolve) => {
      const btns = [];
      const cols = portrait ? 1 : 3;
      const gap = 10;
      const bw = (pw - 48 - gap * (cols - 1)) / cols;
      line.options.forEach((opt, k) => {
        const bx = px + 24 + (k % cols) * (bw + gap);
        const by = choicesTop + Math.floor(k / cols) * (choiceH + 8);
        const b = makeButton(scene, bx, by, bw, choiceH, opt, () => {
          if (k === line.answer) {
            btns.forEach((o) => o.c.destroy());
            resolve(opt);
            return;
          }
          // Wrong: cross it out, show the English, remember the word for review.
          mistakes += 1;
          scene.sfx('wrong', 0.25);
          b.setEnabled(false);
          b.setLabel(`${opt} — non`);
          ui.state.addReview(line.options[line.answer]);
          hintForced = true;
          hint.setVisible(true);
          note.setText('Relisez vos notes, inspecteur.').setVisible(true);
          layout(current);
        }, { size: 18, font: FONT_BODY });
        c.add(b.c);
        btns.push(b);
      });
      ui.reportKeys = (key) => {
        const k = Number(key) - 1;
        if (btns[k]?.enabled && btns[k].c.active) { const z = btns[k].c.list.find((o) => o.type === 'Zone'); z.emit('pointerdown'); z.emit('pointerup'); }
      };
    });
    ui.reportKeys = null;
    scene.sfx('right', 0.2);
    current.setText(`${label}${before}${picked}${after}`);
    hint.setVisible(false);
    note.setVisible(false);
    done.push(current);
  }

  // Conclusion and the stamp.
  const concl = t(px + 24, bodyTop, '', portrait ? 18 : 19, INK, { fontStyle: 'bold' });
  c.add(concl);
  layout(concl);
  await typeOut(concl, REPORT.conclusion.fr);
  done.push(concl);
  layout(null);

  const stamp = scene.add.container(px + pw / 2, top + ph * (portrait ? 0.78 : 0.72)).setDepth(321).setAngle(-12);
  const st = scene.add.text(0, 0, REPORT.stamp, {
    fontFamily: FONT_TITLE, fontSize: portrait ? '46px' : '52px', color: RED,
  }).setOrigin(0.5).setAlpha(0.9);
  const box = scene.add.graphics();
  box.lineStyle(4, 0xa3262c, 0.9).strokeRect(-st.width / 2 - 16, -st.height / 2 - 6, st.width + 32, st.height + 12);
  stamp.add([box, st]).setScale(2.2).setAlpha(0);
  c.add(stamp);
  await new Promise((r) => scene.tweens.add({ targets: stamp, scale: 1, alpha: 1, duration: 260, ease: 'Back.Out', onComplete: r }));
  scene.audio?.thunder();
  scene.cameras.main.shake(180, 0.006);

  const close = makeButton(scene, px + pw / 2 - 90, top + ph - 24 - choiceH, 180, choiceH, 'Signer', () => {}, { size: 18, font: FONT_TITLE });
  c.add(close.c);
  await new Promise((resolve) => {
    close.c.list.find((o) => o.type === 'Zone').on('pointerup', resolve);
    ui.reportKeys = (key) => { if (key === 'Enter' || key === ' ') resolve(); };
  });
  ui.reportKeys = null;
  await new Promise((r) => scene.tweens.add({ targets: c, alpha: 0, duration: 400, onComplete: r }));
  c.destroy();
  return mistakes;
}
