import BootScene from './scenes/BootScene.js';
import WorldScene from './scenes/WorldScene.js';
import UIScene from './scenes/UIScene.js';

// Fixed short side, long side follows the screen's shape, so text stays readable
// on phones in portrait and the world isn't letterboxed on wide screens.
function gameSize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const SHORT = 540;
  const clamp = (v) => Math.round(Math.min(1200, Math.max(720, v)));
  return w >= h
    ? { width: clamp((SHORT * w) / h), height: SHORT }
    : { width: SHORT, height: clamp((SHORT * h) / w) };
}

try { await document.fonts.load('24px "Pixelify Sans"'); } catch { /* fall back to system font */ }

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  ...gameSize(),
  pixelArt: true,
  backgroundColor: '#2b2d42',
  physics: { default: 'arcade', arcade: { debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, WorldScene, UIScene],
});
