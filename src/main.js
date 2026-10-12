import BootScene from './scenes/BootScene.js';
import WorldScene from './scenes/WorldScene.js';
import UIScene from './scenes/UIScene.js';

// Measure the visible area (not window.innerHeight, which can include the address bar).
const container = document.getElementById('game');
const visible = () => ({
  w: container.clientWidth || window.visualViewport?.width || window.innerWidth,
  h: container.clientHeight || window.visualViewport?.height || window.innerHeight,
});

// Fixed short side, long side follows the screen's shape, so text stays readable
// on phones in portrait and the world isn't letterboxed on wide screens.
function gameSize() {
  const { w, h } = visible();
  const SHORT = 540;
  const clamp = (v) => Math.round(Math.min(1600, Math.max(720, v)));
  return w >= h
    ? { width: clamp((SHORT * w) / h), height: SHORT }
    : { width: SHORT, height: clamp((SHORT * h) / w) };
}

try {
  await Promise.all([
    '22px "Special Elite"', '22px "Courier Prime"', 'italic 22px "Courier Prime"', 'bold 22px "Courier Prime"',
  ].map((f) => document.fonts.load(f)));
} catch { /* fall back to system fonts */ }

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  ...gameSize(),
  pixelArt: true,
  backgroundColor: '#000000',
  physics: { default: 'arcade', arcade: { debug: false, fixedStep: false } }, // real elapsed time: same walking speed at any frame rate
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, WorldScene, UIScene],
});

// The layout is chosen for portrait or landscape when the game starts. If the phone is
// rotated, reload so the layout matches (progress is saved, so nothing is lost).
// Smaller changes, like the address bar hiding, are handled by Phaser's FIT scaling.
const startedPortrait = visible().h > visible().w;
let rotateTimer;
window.addEventListener('resize', () => {
  clearTimeout(rotateTimer);
  rotateTimer = setTimeout(() => {
    const { w, h } = visible();
    if ((h > w) !== startedPortrait) window.location.reload();
  }, 400);
});
