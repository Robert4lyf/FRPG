// Chapter-opening cutscenes: one still image per shot, a slow pan/zoom across it, black
// letterbox bars, and narration typed along the bottom (gold words tappable, EN toggle).
// Tap advances the narration; "Passer" skips the rest. Ends on the chapter title.
import { C, FONT_TITLE, text, makeButton, RichText, glosses } from './theme.js';

const IMG_W = 1536;
const IMG_H = 1024;

// Stand-in until the real picture exists: a dark frame with what the shot will show.
function placeholder(scene, key, alt) {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, IMG_W, IMG_H);
  const ctx = tex.getContext();
  const g = ctx.createLinearGradient(0, 0, 0, IMG_H);
  g.addColorStop(0, '#16223f'); g.addColorStop(1, '#05070d');
  ctx.fillStyle = g; ctx.fillRect(0, 0, IMG_W, IMG_H);
  ctx.strokeStyle = 'rgba(160,180,220,0.12)'; ctx.lineWidth = 2;
  for (let i = 0; i < 160; i++) {
    const x = (i * 97) % IMG_W; const y = (i * 61) % IMG_H;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18, y + 60); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(217,210,195,0.35)'; ctx.strokeRect(60, 60, IMG_W - 120, IMG_H - 120);
  ctx.fillStyle = 'rgba(217,210,195,0.55)';
  ctx.font = '34px "Courier Prime", monospace'; ctx.textAlign = 'center';
  ctx.fillText('[ image à venir ]', IMG_W / 2, IMG_H / 2 - 60);
  // Wrap the description.
  const words = alt.split(' '); let line = ''; let y = IMG_H / 2;
  words.forEach((w) => {
    if (ctx.measureText(`${line} ${w}`).width > 900) { ctx.fillText(line, IMG_W / 2, y); line = w; y += 44; } else line = line ? `${line} ${w}` : w;
  });
  ctx.fillText(line, IMG_W / 2, y);
  tex.refresh();
}

export async function runCutscene(ui, shots, title, subtitle) {
  const { W, H } = ui;
  const portrait = H > W;
  ui.cardOpen = true;
  ui.world.busy = true;
  const c = ui.add.container(0, 0).setDepth(300);
  c.add(ui.add.rectangle(0, 0, W, H, 0x000000, 1).setOrigin(0));
  const layer = ui.add.container(0, 0);
  c.add(layer);

  // Letterbox: thin bar on top, a deeper band at the bottom for the narration.
  const barTop = Math.round(H * (portrait ? 0.07 : 0.08));
  const capH = portrait ? 236 : 150;
  const bars = ui.add.graphics();
  bars.fillStyle(0x000000, 1).fillRect(0, 0, W, barTop);
  bars.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.92, 0.92).fillRect(0, H - capH - 70, W, 70);
  bars.fillStyle(0x000000, 0.92).fillRect(0, H - capH, W, capH);
  c.add(bars);

  const pad = portrait ? 24 : 40;
  const capY = H - capH + (portrait ? 22 : 20);
  const rich = new RichText(ui, pad, capY, W - pad * 2, { size: portrait ? 20 : 22, onWord: (fr, en, obj) => ui.wordTip(fr, en, obj) });
  c.add(rich.container);
  const en = text(ui, pad, 0, '', 15, C.dim, { fontStyle: 'italic', wordWrap: { width: W - pad * 2, useAdvancedWrap: true } });
  const hint = text(ui, W - pad, H - 16, '▼', 18, C.ink).setOrigin(1, 1).setVisible(false);
  ui.tweens.add({ targets: hint, alpha: 0.15, yoyo: true, repeat: -1, duration: 500 });
  c.add([en, hint]);

  let skipped = false;
  const bh = Math.min(34, barTop - 8);
  const enBtn = makeButton(ui, W - 12 - 56, (barTop - bh) / 2, 56, bh, 'EN', () => {
    ui.cardEn = !ui.cardEn;
    en.setVisible(!!ui.cardEn);
  }, { size: 14 });
  const skip = makeButton(ui, W - 12 - 56 - 8 - 96, (barTop - bh) / 2, 96, bh, 'Passer ›', () => {
    skipped = true;
    ui.cutsceneSkip = null;
    ui.readyAt = 0;
    rich.finish?.();
    const done = ui.waiting; ui.waiting = null; ui.waitingRich = null; done?.();
  }, { size: 14 });
  ui.cutsceneSkip = () => skip.c.list.find((o) => o.type === 'Zone').emit('pointerdown');
  c.add([enBtn.c, skip.c]);

  for (const shot of shots) {
    if (skipped) break;
    const key = `cut_${shot.img}`;
    placeholder(ui, key, shot.alt);
    const src = ui.textures.get(key).getSourceImage();
    const iw = src.width; const ih = src.height;
    const img = ui.add.image(W / 2, H / 2, key).setAlpha(0);
    layer.add(img);
    const cover = Math.max(W / iw, H / ih);
    const { from, to } = shot.move;
    // Where the image sits at the start and end: focus point centred, but never past the
    // image's edges. The move is a straight line between the two, so the camera makes one
    // smooth movement (clamping along the way would make it turn mid-shot).
    const place = ({ x: fx, y: fy, zoom }) => {
      const s = cover * zoom;
      const dw = iw * s; const dh = ih * s;
      return {
        s,
        x: Phaser.Math.Clamp(W / 2 - (fx - 0.5) * dw, W - dw / 2, dw / 2),
        y: Phaser.Math.Clamp(H / 2 - (fy - 0.5) * dh, H - dh / 2, dh / 2),
      };
    };
    const a = place(from);
    const b = place(to);
    // Position and scale both change linearly, so if both ends cover the screen, every
    // point in between does too.
    const apply = (t) => img.setScale(a.s + (b.s - a.s) * t).setPosition(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    apply(0);
    const prog = { t: 0 };
    const move = ui.tweens.add({
      targets: prog, t: 1, duration: Math.max(8000, shot.lines.length * 5000), ease: 'Sine.InOut', onUpdate: () => apply(prog.t),
    });
    ui.tweens.add({ targets: img, alpha: 1, duration: 700 });

    for (const l of shot.lines) {
      if (skipped) break;
      rich.setText(l.fr, { italic: true, color: '#e2dccd' });
      glosses(l.fr).forEach((gl) => ui.state.addWord(gl.fr, gl.en));
      en.setText(l.en).setY(capY + rich.height + 6).setVisible(!!ui.cardEn);
      hint.setVisible(false);
      rich.reveal(55, () => hint.setVisible(true));
      await ui.waitTap(rich);
      ui.sfx('click', 0.1);
    }
    await new Promise((r) => ui.tweens.add({ targets: img, alpha: 0, duration: skipped ? 150 : 500, onComplete: r }));
    move.stop();
    img.destroy();
  }
  rich.clear();
  en.setVisible(false);
  hint.setVisible(false);
  ui.cutsceneSkip = null;
  enBtn.c.setVisible(false);
  skip.c.setVisible(false);

  if (title) {
    const cw = Math.min(W - 70, 700);
    const t1 = text(ui, W / 2, H * 0.4, title, portrait ? 26 : 30, C.ink, { fontFamily: FONT_TITLE, align: 'center', wordWrap: { width: cw } }).setOrigin(0.5, 0).setAlpha(0);
    const t2 = text(ui, W / 2, H * 0.4 + t1.height + 14, subtitle || '', 16, C.dim, { align: 'center', fontStyle: 'italic', wordWrap: { width: cw } }).setOrigin(0.5, 0).setAlpha(0);
    c.add([t1, t2]);
    ui.tweens.add({ targets: [t1, t2], alpha: 1, duration: 900 });
    ui.audio?.thunder();
    await ui.waitTap();
  }
  await new Promise((r) => ui.tweens.add({ targets: c, alpha: 0, duration: 700, onComplete: r }));
  c.destroy();
  ui.cardOpen = false;
  ui.lock(300);
}
