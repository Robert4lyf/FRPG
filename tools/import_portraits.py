"""Cuts the 3x3 portrait sheet (tools/source/portraits_chatgpt.png) into dialogue portraits.

Each cell is downscaled to SIZE x SIZE by area averaging, then reduced to a small palette
so it reads as crisp pixel art in game. Output: assets/portraits/<id>.png, two frames side
by side: eyes open, then blinking. The blink frame takes only the eye band from
tools/source/portraits_chatgpt_closed.png (found where the two sheets differ most), so the
rest of the face stays still. Expression frames (hostile, shaken) take only the face area
where that sheet differs from the neutral one. All frames share one palette.
Frames: 0 neutral, 1 blink, 2 hostile, 3 shaken.
Run: python3 tools/import_portraits.py
"""
import os
from PIL import Image, ImageChops, ImageEnhance, ImageFilter

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, 'source', 'portraits_chatgpt.png')
SRC_CLOSED = os.path.join(HERE, 'source', 'portraits_chatgpt_closed.png')
EXPRESSIONS = ['hostile', 'shaken']
SRC_EXPR = {e: os.path.join(HERE, 'source', f'portraits_chatgpt_{e}.png') for e in EXPRESSIONS}
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


def face_region(base, other):
    """Feathered mask covering where `other` differs from `base` (the face), ignoring speckle."""
    diff = ImageChops.difference(base, other).convert('L').point(lambda v: 255 if v > 45 else 0)
    dens = diff.filter(ImageFilter.BoxBlur(14)).point(lambda v: 255 if v > 40 else 0)
    box = dens.getbbox()
    mask = Image.new('L', base.size, 0)
    if box:
        mask.paste(255, (box[0] - 12, box[1] - 12, box[2] + 12, box[3] + 12))
    return mask.filter(ImageFilter.GaussianBlur(12))


def convert(cell, closed=None, exprs=()):
    """Returns frames [neutral, blink, *expressions] as RGBA sharing one palette."""
    blink = cell.copy()
    if closed is not None:
        box = eye_band(cell, closed)
        mask = Image.new('L', cell.size, 0)
        mask.paste(255, box)
        mask = mask.filter(ImageFilter.GaussianBlur(10))
        blink = Image.composite(closed, cell, mask)
    variants = [cell, blink] + [Image.composite(e, cell, face_region(cell, e)) for e in exprs]
    prepped = [prep(v) for v in variants]
    # One palette from all frames stacked, so tears, flushed cheeks etc. still get colours.
    strip = Image.new('RGB', (SIZE * len(prepped), SIZE))
    for i, v in enumerate(prepped):
        strip.paste(v, (i * SIZE, 0))
    pal = strip.quantize(colors=COLOURS + 8, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    return [v.quantize(palette=pal, dither=Image.Dither.NONE).convert('RGBA') for v in prepped]


def main():
    sheet = Image.open(SRC).convert('RGB')
    closed = Image.open(SRC_CLOSED).convert('RGB') if os.path.exists(SRC_CLOSED) else None
    exprs = [Image.open(SRC_EXPR[e]).convert('RGB') for e in EXPRESSIONS]
    cw = sheet.width / 3
    ch = sheet.height / 3
    os.makedirs(OUT, exist_ok=True)
    for r, row in enumerate(ORDER):
        for c, name in enumerate(row):
            box = (round(c * cw) + INSET, round(r * ch) + INSET, round((c + 1) * cw) - INSET, round((r + 1) * ch) - INSET)
            frames = convert(sheet.crop(box), closed.crop(box) if closed else None, [e.crop(box) for e in exprs])
            out = Image.new('RGBA', (SIZE * len(frames), SIZE))
            for i, f in enumerate(frames):
                out.paste(f, (i * SIZE, 0))
            out.save(os.path.join(OUT, f'{name}.png'))
    print('wrote', sum(len(r) for r in ORDER), 'portraits,', 2 + len(exprs), 'frames each')


if __name__ == '__main__':
    main()
