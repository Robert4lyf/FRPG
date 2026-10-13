// Character sprite set. Default: 16px Kenney costumes. Test: ?sprites=lpc[&size=20|22|26]
// for the realistic-proportion LPC characters (not yet approved, so not the default).
const q = new URLSearchParams(location.search);
const lpc = q.get('sprites') === 'lpc';
const size = lpc ? ([20, 22, 26].includes(+q.get('size')) ? +q.get('size') : 22) : 16;

export const SPRITES = {
  lpc,
  size,
  // Feet sit 8px below the sprite's position in both sets, so tiles, bodies and paths don't change.
  originY: (size - 8) / size,
  // Distance from position to just above the head (for name tags and the talk marker).
  head: lpc ? Math.round(size * 0.62) : 8,
};

// Sprite body boxes measured from the frame's top-left, sitting on the feet.
export const bodyBox = (w, h) => [w, h, (SPRITES.size - w) / 2, SPRITES.size - h];
