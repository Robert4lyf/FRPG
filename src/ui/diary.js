// Inès's diary: the entries' dates are lost, so the player taps them in the order they
// happened. The plus-que-parfait in each entry points back to the one before it.
import { FONT_TITLE, FONT_BODY, makeButton, plainText, glosses } from './theme.js';

const INK = '#26221e';
const FAINT = '#8a8070';
const RED = '#a3262c';
const PAPER = 0xe6dcc6;

export async function runDiary(ui, diary) {
  const { W, H } = ui;
  const portrait = H > W;
  const c = ui.add.container(0, 0).setDepth(320);
  const m = portrait ? 16 : 24;
  c.add(ui.add.rectangle(0, 0, W, H, 0x000000, 0.85).setOrigin(0).setInteractive());
  const paper = ui.add.graphics();
  paper.fillStyle(PAPER, 1).fillRect(m, m, W - m * 2, H - m * 2);
  paper.lineStyle(1, 0x8a8070, 0.6).strokeRect(m + 6, m + 6, W - m * 2 - 12, H - m * 2 - 12);
  c.add(paper);
  const t = (x, y, s, size, color = INK, extra = {}) => ui.add.text(x, y, s, {
    fontFamily: FONT_BODY, fontSize: `${size}px`, color, wordWrap: { width: W - m * 2 - 48, useAdvancedWrap: true }, ...extra,
  });
  c.add(t(m + 24, m + 18, "LE JOURNAL D'INÈS", 13, FAINT, { fontFamily: FONT_TITLE }));
  c.add(t(m + 24, m + 38, 'Dans quel ordre ?', portrait ? 22 : 24, INK, { fontFamily: FONT_TITLE }));
  const sub = t(m + 24, m + 72, 'Touchez les pages de la première à la dernière.', 15, FAINT, { fontStyle: 'italic' });
  const hint = t(m + 24, 0, `${diary.hint.fr}\n${diary.hint.en}`, 14, RED, { fontStyle: 'italic' }).setVisible(false);
  c.add([sub, hint]);

  let showEn = false;
  const enBtn = makeButton(ui, W - m - 24 - 56, m + 18, 56, 34, 'EN', () => {
    showEn = !showEn;
    cards.forEach((k) => k.btn.setLabel(label(k)));
  }, { size: 14 });
  c.add(enBtn.c);

  // Shuffle so the shown order is never already the answer.
  const entries = [...diary.entries];
  do { Phaser.Utils.Array.Shuffle(entries); } while (entries.every((e, i) => e.id === diary.order[i]));
  entries.forEach((e) => glosses(e.fr).forEach((g) => ui.state.addWord(g.fr, g.en)));

  const cols = portrait ? 1 : 2;
  const gap = 10;
  const top = m + 104;
  const cw = (W - m * 2 - 48 - gap * (cols - 1)) / cols;
  const label = (k) => `${k.n ? `${k.n}.  ` : '·  '}${plainText(k.e.fr)}${showEn ? `\n${k.e.en}` : ''}`;
  let placed = 0;
  let mistakes = 0;
  let resolveDone;
  const finished = new Promise((r) => { resolveDone = r; });
  const cards = entries.map((e) => {
    const k = { e, n: 0 };
    k.btn = makeButton(ui, 0, 0, cw, 60, '', () => {
      if (k.n) return;
      if (e.id === diary.order[placed]) {
        placed += 1;
        k.n = placed;
        ui.sfx('right', 0.2);
        k.btn.setLabel(label(k));
        k.btn.setDim(true);
        if (placed === diary.order.length) ui.time.delayedCall(700, resolveDone);
      } else {
        mistakes += 1;
        ui.sfx('wrong', 0.25);
        ui.tweens.add({ targets: k.btn.c, x: k.btn.c.x + 6, yoyo: true, repeat: 2, duration: 50 });
        hint.setVisible(true);
      }
      layout();
    }, { size: portrait ? 17 : 15, align: 'left', font: FONT_BODY });
    k.btn.setLabel(label(k));
    c.add(k.btn.c);
    return k;
  });
  const layout = () => {
    let y = top;
    for (let i = 0; i < cards.length; i += cols) {
      const row = cards.slice(i, i + cols);
      const rh = Math.max(...row.map((k) => k.btn.h));
      row.forEach((k, j) => k.btn.c.setPosition(m + 24 + j * (cw + gap), y));
      y += rh + gap;
    }
    hint.setY(Math.min(y + 4, H - m - hint.height - 12));
  };
  layout();
  // For automated playtests: tap the cards in the right order.
  ui.diarySolve = () => diary.order.forEach((id) => {
    const z = cards.find((k) => k.e.id === id).btn.c.list.find((o) => o.type === 'Zone');
    z.emit('pointerdown'); z.emit('pointerup');
  });
  ui.reportKeys = (key) => {
    const i = Number(key) - 1;
    const z = cards[i]?.btn.c.list.find((o) => o.type === 'Zone');
    if (z) { z.emit('pointerdown'); z.emit('pointerup'); }
  };
  await finished;
  ui.reportKeys = null;
  ui.diarySolve = null;
  await new Promise((r) => ui.tweens.add({ targets: c, alpha: 0, duration: 400, onComplete: r }));
  c.destroy();
  return mistakes;
}
