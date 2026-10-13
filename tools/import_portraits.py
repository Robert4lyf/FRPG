"""Cuts the 3x3 portrait sheet (tools/source/portraits_chatgpt.png) into dialogue portraits.

Each cell is downscaled to SIZE x SIZE by area averaging, then reduced to a small palette
so it reads as crisp pixel art in game. Output: assets/portraits/<id>.png, two frames side
by side (the game uses frame 1 for blinking; these sheets have no closed-eye version, so
both frames are the same and the blink is a no-op).
Run: python3 tools/import_portraits.py
"""
import os
from PIL import Image, ImageEnhance

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, 'source', 'portraits_chatgpt.png')
OUT = os.path.join(HERE, '..', 'assets', 'portraits')
SIZE = 96
COLOURS = 40
INSET = 3  # trim a few pixels from each cell edge to avoid seams
ORDER = [
    ['inspector', 'helene', 'dubois'],
    ['lebrun', 'theo', 'garnier'],
    ['delacroix', 'claire', 'roux'],
]


def convert(cell):
    small = cell.resize((SIZE, SIZE), Image.BOX)
    small = ImageEnhance.Contrast(small).enhance(1.08)
    small = ImageEnhance.Sharpness(small).enhance(1.4)
    pal = small.quantize(colors=COLOURS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    return pal.convert('RGBA')


def main():
    sheet = Image.open(SRC).convert('RGB')
    cw = sheet.width / 3
    ch = sheet.height / 3
    os.makedirs(OUT, exist_ok=True)
    for r, row in enumerate(ORDER):
        for c, name in enumerate(row):
            box = (round(c * cw) + INSET, round(r * ch) + INSET, round((c + 1) * cw) - INSET, round((r + 1) * ch) - INSET)
            img = convert(sheet.crop(box))
            out = Image.new('RGBA', (SIZE * 2, SIZE))
            out.paste(img, (0, 0))
            out.paste(img, (SIZE, 0))
            out.save(os.path.join(OUT, f'{name}.png'))
    print('wrote', sum(len(r) for r in ORDER), 'portraits at', SIZE, 'px')


if __name__ == '__main__':
    main()
