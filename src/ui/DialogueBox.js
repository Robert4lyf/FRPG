const STYLE = { fontFamily: 'monospace', fontSize: '12px', color: '#ffffff' };

// Bottom-of-screen dialogue box. Shows a message with optional numbered choices.
// Choices: tap or press 1-3. No choices: tap, Space or Enter to close.
export default class DialogueBox {
  constructor(scene) {
    this.scene = scene;
    const { width: w, height: h } = scene.scale;
    this.h = h;
    this.container = scene.add.container(0, 0).setDepth(100).setScrollFactor(0).setVisible(false);
    const bg = scene.add.rectangle(8, h - 144, w - 16, 136, 0x000000, 0.85)
      .setOrigin(0).setStrokeStyle(2, 0xffffff);
    this.text = scene.add.text(18, h - 136, '', { ...STYLE, wordWrap: { width: w - 36 } });
    this.hint = scene.add.text(w - 18, h - 18, '▼', STYLE).setOrigin(1, 1);
    this.container.add([bg, this.text, this.hint]);
    this.buttons = [];
    this.choices = [];
    this.callback = null;
  }

  get open() {
    return this.container.visible;
  }

  show(message, choices = [], callback = null) {
    this.clearButtons();
    this.choices = choices;
    this.callback = callback;
    this.text.setText(message);
    this.hint.setVisible(choices.length === 0);
    choices.forEach((label, i) => {
      const b = this.scene.add.text(24, this.h - 92 + i * 24, `${i + 1}. ${label}`, {
        ...STYLE, backgroundColor: '#333c57', padding: { x: 6, y: 3 },
      }).setInteractive({ useHandCursor: true });
      b.on('pointerdown', (_p, _x, _y, event) => {
        event.stopPropagation();
        this.choose(i);
      });
      this.container.add(b);
      this.buttons.push(b);
    });
    this.container.setVisible(true);
  }

  choose(i) {
    if (i < 0 || i >= this.choices.length) return;
    const cb = this.callback;
    this.choices = [];
    cb?.(i);
  }

  // Closes a message that has no choices.
  advance() {
    if (!this.open || this.choices.length) return;
    const cb = this.callback;
    this.hide();
    cb?.();
  }

  handleKey(key) {
    if (!this.open) return;
    if (this.choices.length && /^[1-9]$/.test(key)) this.choose(Number(key) - 1);
    else if (key === ' ' || key === 'Enter') this.advance();
  }

  hide() {
    this.clearButtons();
    this.callback = null;
    this.container.setVisible(false);
  }

  clearButtons() {
    this.buttons.forEach((b) => b.destroy());
    this.buttons = [];
  }
}
