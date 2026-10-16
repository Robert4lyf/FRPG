// Noir UI kit: colours, fonts, panels, buttons and rich dialogue text.
export const FONT_TITLE = '"Special Elite", "Courier New", monospace';
export const FONT_BODY = '"Courier Prime", "Courier New", monospace';

export const C = {
  ink: '#e9e3d5', // main text
  dim: '#8f897b', // translations, secondary text
  gold: '#d6a84e', // vocabulary words
  name: '#c7b38c', // speaker names
  good: '#9fc18a',
  bad: '#c8645a',
  panel: 0x0b0b0e,
  edge: 0xd9d2c3,
};

// Double-ruled dark panel, like a title card.
export function drawPanel(g, x, y, w, h, alpha = 0.985) {
  g.fillStyle(C.panel, alpha).fillRect(x, y, w, h);
  g.lineStyle(2, C.edge, 0.85).strokeRect(x + 1, y + 1, w - 2, h - 2);
  g.lineStyle(1, C.edge, 0.28).strokeRect(x + 6, y + 6, w - 12, h - 12);
  return g;
}

export function text(scene, x, y, str, size, color = C.ink, extra = {}) {
  return scene.add.text(x, y, str, {
    fontFamily: FONT_BODY, fontSize: `${size}px`, color, ...extra,
  });
}

// Outlined button that inverts when pressed. Height grows to fit wrapped text.
// Returns { c (container), h, setLabel, setEnabled, setDim }.
export function makeButton(scene, x, y, w, h, label, onClick, opts = {}) {
  const { size = 20, align = 'center', font = FONT_TITLE, onPress } = opts; // labels: typewriter; pass FONT_BODY for sentences
  const pad = 14;
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  const t = scene.add.text(0, 0, label, {
    fontFamily: font, fontSize: `${size}px`, color: C.ink, align,
    wordWrap: { width: w - pad * 2, useAdvancedWrap: true }, lineSpacing: 2,
  });
  const zone = scene.add.zone(0, 0, w, h).setOrigin(0).setInteractive({ useHandCursor: true });
  c.add([g, t, zone]);

  const b = { c, h, enabled: true, dim: false };
  const layout = () => {
    b.h = Math.max(h, Math.ceil(t.height + 18));
    zone.setSize(w, b.h);
    zone.input.hitArea.setSize(w, b.h);
    t.setOrigin(align === 'center' ? 0.5 : 0, 0.5);
    t.setPosition(align === 'center' ? w / 2 : pad, b.h / 2);
  };
  const paint = (pressed) => {
    g.clear();
    g.fillStyle(pressed ? C.edge : 0x141418, pressed ? 1 : 0.96).fillRect(0, 0, w, b.h);
    g.lineStyle(1, C.edge, b.enabled ? 0.6 : 0.2).strokeRect(0.5, 0.5, w - 1, b.h - 1);
    t.setColor(pressed ? '#111111' : (b.dim ? C.dim : C.ink));
    c.setAlpha(b.enabled ? 1 : 0.45);
  };
  b.setLabel = (s) => { t.setText(s); layout(); paint(false); return b; };
  b.setEnabled = (on) => { b.enabled = on; paint(false); return b; };
  b.setDim = (on) => { b.dim = on; paint(false); return b; };

  // A press must start and end on the button: a release left over from a tap elsewhere
  // (e.g. the tap that made this menu appear) never selects it.
  let armed = false;
  zone.on('pointerdown', (_p, _x, _y, e) => {
    e?.stopPropagation?.();
    onPress?.();
    if (!b.enabled) return;
    armed = true;
    paint(true);
  });
  zone.on('pointerup', (_p, _x, _y, e) => {
    e?.stopPropagation?.();
    const wasArmed = armed;
    armed = false;
    if (!b.enabled || !wasArmed) return;
    paint(false);
    onClick();
  });
  zone.on('pointerout', () => { armed = false; paint(false); });
  layout();
  paint(false);
  return b;
}

// French typography: no line break before ? ! : ; » or after «.
const frenchSpacing = (s) => s.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ');

// Splits "Il est [[tombé|fell]]." into tokens. Tokens marked with a gloss are vocabulary.
export function parseMarkup(markup) {
  const tokens = [];
  const re = /\[\[([^|\]]+)\|([^\]]+)\]\]/g;
  let last = 0;
  let m;
  // Each token records whether whitespace precedes it (punctuation can stick to a vocabulary word).
  const pushPlainExact = (str) => {
    const s = frenchSpacing(str);
    const parts = s.split(' ');
    parts.forEach((piece, i) => {
      if (piece === '') return;
      const precededBySpace = i > 0 || tokens.length === 0;
      tokens.push({ text: piece, space: precededBySpace });
    });
  };
  while ((m = re.exec(markup))) {
    if (m.index > last) pushPlainExact(markup.slice(last, m.index));
    const before = markup[m.index - 1];
    tokens.push({ text: m[1], gloss: m[2], space: tokens.length === 0 || before === ' ' });
    last = re.lastIndex;
  }
  if (last < markup.length) pushPlainExact(markup.slice(last));
  return tokens;
}

export const plainText = (markup) => markup.replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1');
export const glosses = (markup) => [...markup.matchAll(/\[\[([^|\]]+)\|([^\]]+)\]\]/g)].map((m) => ({ fr: m[1], en: m[2] }));

// Word-by-word dialogue text. Vocabulary words are gold, underlined and tappable.
export class RichText {
  constructor(scene, x, y, width, opts = {}) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.size = opts.size || 22;
    this.italic = false;
    this.onWord = opts.onWord || (() => {});
    this.container = scene.add.container(0, 0);
    this.items = [];
    this.height = 0;
    this.timer = null;
  }

  setText(markup, { italic = false, color = C.ink } = {}) {
    this.clear();
    const style = {
      fontFamily: FONT_BODY, fontSize: `${this.size}px`, color, fontStyle: italic ? 'italic' : 'normal',
    };
    const spaceW = this.scene.add.text(0, 0, 'a a', style);
    const aW = this.scene.add.text(0, 0, 'aa', style);
    const space = spaceW.width - aW.width;
    spaceW.destroy(); aW.destroy();
    const lineH = Math.round(this.size * 1.38);

    let cx = 0;
    let cy = 0;
    parseMarkup(markup).forEach((tok) => {
      const t = this.scene.add.text(0, 0, tok.text, { ...style, color: tok.gloss ? C.gold : color });
      const gap = tok.space && cx > 0 ? space : 0;
      if (cx > 0 && tok.space && cx + gap + t.width > this.width) {
        cx = 0;
        cy += lineH;
      } else {
        cx += gap;
      }
      t.setPosition(this.x + cx, this.y + cy);
      const item = { t, underline: null };
      if (tok.gloss) {
        item.underline = this.scene.add.rectangle(this.x + cx, this.y + cy + this.size * 1.08, t.width, 1, 0xd6a84e, 0.6).setOrigin(0);
        t.setInteractive({ useHandCursor: true });
        t.on('pointerdown', (_p, _x, _y, e) => {
          e?.stopPropagation?.();
          this.onWord(tok.text, tok.gloss, t);
        });
        this.container.add(item.underline);
      }
      this.container.add(t);
      this.items.push(item);
      cx += t.width;
    });
    this.height = cy + lineH;
    return this.height;
  }

  // Reveal word by word. Calls onDone when finished.
  reveal(msPerWord = 38, onDone = () => {}) {
    this.items.forEach((it) => { it.t.setVisible(false); it.underline?.setVisible(false); });
    let i = 0;
    this.onDone = onDone;
    this.revealing = true;
    this.timer = this.scene.time.addEvent({
      delay: msPerWord, loop: true, callback: () => {
        const it = this.items[i++];
        if (it) { it.t.setVisible(true); it.underline?.setVisible(true); }
        if (i >= this.items.length) this.finish();
      },
    });
  }

  finish() {
    this.timer?.remove();
    this.timer = null;
    this.items.forEach((it) => { it.t.setVisible(true); it.underline?.setVisible(true); });
    if (this.revealing) {
      this.revealing = false;
      const done = this.onDone;
      this.onDone = null;
      done?.();
    }
  }

  clear() {
    this.timer?.remove();
    this.timer = null;
    this.revealing = false;
    this.container.removeAll(true);
    this.items = [];
    this.height = 0;
  }
}
