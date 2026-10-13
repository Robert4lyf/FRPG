"""Cuts the 3x3 portrait sheet (tools/source/portraits_chatgpt.png) into dialogue portraits.

Each cell is downscaled to SIZE x SIZE by area averaging, then reduced to a small palette
so it reads as crisp pixel art in game. Output: assets/portraits/<id>.png, two frames side
by side: eyes open, then blinking. The blink frame takes only the eye band from
tools/source/portraits_chatgpt_closed.png (found where the two sheets differ most), so the
rest of the face stays still, and both frames share one palette so nothing shimmers.
Run: python3 tools/import_portraits.py
"""
import os
from PIL import Image, ImageChops, ImageEnhance, ImageFilter

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, 'source', 'portraits_chatgpt.png')
SRC_CLOSED = os.path.join(HERE, 'source', 'portraits_chatgpt_closed.png')
OUT = os.path.join(HERE, '..', 'assets', 'portraits')
SIZE = 96
COLOURS = 40
INSET = 3  # trim a few pixels from each cell edge to avoid seams
ORDER = [
    ['inspector', 'helene', 'dubois'],
    ['lebrun', 'theo', 'garnier'],
    ['delacroix', 'claire', 'roux'],
]


def prep(cell):
    small = cell.resize((SIZE, SIZE), Image.BOX)
    small = ImageEnhance.Contrast(small).enhance(1.08)
    return ImageEnhance.Sharpness(small).enhance(1.4)


def eye_band(open_cell, closed_cell):
    """Box (in cell pixels) around the eyes: the densest area of difference."""
    diff = ImageChops.difference(open_cell, closed_cell).convert('L').point(lambda v: 255 if v > 40 else 0)
    dens = diff.filter(ImageFilter.BoxBlur(18))
    w, h = dens.size
    px = dens.load()
    best, by, bx = -1, 0, 0
    for y in range(0, h - 60, 4):
        for x in range(0, w - 180, 4):
            v = px[x + 90, y + 30]
            if v > best:
                best, bx, by = v, x, y
    return (bx - 30, by - 25, bx + 210, by + 85)


def convert(cell, closed=None):
    """Returns (open_frame, blink_frame) as RGBA with a shared palette."""
    blink = cell.copy()
    if closed is not None:
        box = eye_band(cell, closed)
        mask = Image.new('L', cell.size, 0)
        mask.paste(255, box)
        mask = mask.filter(ImageFilter.GaussianBlur(10))
        blink = Image.composite(closed, cell, mask)
    a = prep(cell)
    pal = a.quantize(colors=COLOURS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    b = prep(blink).quantize(palette=pal, dither=Image.Dither.NONE)
    return pal.convert('RGBA'), b.convert('RGBA')


def main():
    sheet = Image.open(SRC).convert('RGB')
    closed = Image.open(SRC_CLOSED).convert('RGB') if os.path.exists(SRC_CLOSED) else None
    cw = sheet.width / 3
    ch = sheet.height / 3
    os.makedirs(OUT, exist_ok=True)
    for r, row in enumerate(ORDER):
        for c, name in enumerate(row):
            box = (round(c * cw) + INSET, round(r * ch) + INSET, round((c + 1) * cw) - INSET, round((r + 1) * ch) - INSET)
            open_f, blink_f = convert(sheet.crop(box), closed.crop(box) if closed else None)
            out = Image.new('RGBA', (SIZE * 2, SIZE))
            out.paste(open_f, (0, 0))
            out.paste(blink_f, (SIZE, 0))
            out.save(os.path.join(OUT, f'{name}.png'))
    print('wrote', sum(len(r) for r in ORDER), 'portraits at', SIZE, 'px', '(with blink)' if closed else '')


if __name__ == '__main__':
    main()
