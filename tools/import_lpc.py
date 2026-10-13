"""Shrinks the composed LPC walk sheets (tools/source/lpc/<id>.png, 64x64 frames, 9 frames x 4 rows:
up, left, down, right) to game size and writes assets/lpc/<SIZE>/<id>.png.

Each frame is area-downscaled to SIZE x SIZE, its alpha snapped to solid, its colours reduced to the
character's own palette, then given a 1 px dark outline so the silhouette stays crisp in the dark.
Run: python3 tools/import_lpc.py [SIZE]
"""
import os, sys
from PIL import Image

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, 'source', 'lpc')
OUT = os.path.join(HERE, '..', 'assets', 'lpc')
SIZE = int(sys.argv[1]) if len(sys.argv) > 1 else 26
OUTLINE = (10, 10, 16, 255)


def shrink(frame, pal):
    rgba = frame.resize((SIZE, SIZE), Image.BOX)
    a = rgba.split()[3].point(lambda v: 255 if v >= 110 else 0)
    rgb = rgba.convert('RGB').quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB')
    out = Image.merge('RGBA', (*rgb.split(), a))
    src = out.copy().load(); px = out.load()
    for y in range(SIZE):
        for x in range(SIZE):
            if src[x, y][3]:
                continue
            if any(0 <= x + dx < SIZE and 0 <= y + dy < SIZE and src[x + dx, y + dy][3]
                   for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                px[x, y] = OUTLINE
    return out


def main():
    out_dir = os.path.join(OUT, str(SIZE))
    os.makedirs(out_dir, exist_ok=True)
    for f in sorted(os.listdir(SRC)):
        if not f.endswith('.png'):
            continue
        sheet = Image.open(os.path.join(SRC, f)).convert('RGBA')
        cols, rows = sheet.width // 64, sheet.height // 64
        solid = Image.new('RGB', sheet.size, (0, 0, 0)); solid.paste(sheet, mask=sheet.split()[3])
        pal = solid.quantize(colors=40, method=Image.Quantize.MEDIANCUT)
        out = Image.new('RGBA', (cols * SIZE, rows * SIZE))
        for r in range(rows):
            for c in range(cols):
                fr = sheet.crop((c * 64, r * 64, c * 64 + 64, r * 64 + 64))
                out.paste(shrink(fr, pal), (c * SIZE, r * SIZE))
        out.save(os.path.join(out_dir, f))
    print('wrote LPC sheets at', SIZE, 'px')


if __name__ == '__main__':
    main()
