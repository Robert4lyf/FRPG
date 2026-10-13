"""Draws the noir dialogue portraits (48x48 busts) into assets/portraits/.

Each portrait is built from simple shapes, cel-shaded with a warm lamp from the
left and cool shadow on the right, then outlined. Two frames per character:
eyes open and blinking. Run: python3 tools/portraits.py
"""
import math
import os
from PIL import Image

S = 48
# Hand-drawn placeholders (superseded by tools/import_portraits.py); kept for reference.
OUT = os.path.join(os.path.dirname(__file__), 'source', 'drawn_portraits')
LIGHT = (-0.82, -0.32, 0.47)  # warm lamp from the left: hard side light
RIM = (120, 146, 214)  # cool moonlight rim on the shadow side
OUTLINE = (12, 13, 22, 255)


def hexc(h, a=255):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


# Four tones per material: highlight, light, mid, shadow (shadows lean cool blue).
PAL = {
    'skin_fair': ['#ffdcbc', '#f0b48e', '#c98666', '#7a5056'],
    'skin_med': ['#f4c495', '#d99b6d', '#a86b4c', '#5c3c40'],
    'skin_dark': ['#c88a5c', '#a0653f', '#73462e', '#3e2730'],
    'skin_pale': ['#fbe8d8', '#e8c3ad', '#b48d88', '#69506a'],
    'navy': ['#6178bf', '#35488c', '#232f60', '#131a37'],
    'olive': ['#a4ad66', '#6e7845', '#4c5631', '#2a301f'],
    'charcoal': ['#6c6a74', '#45434c', '#2d2c33', '#18171d'],
    'black': ['#4a4652', '#2c2a32', '#1c1b21', '#0f0f14'],
    'white': ['#fffdf6', '#e6e1d6', '#b4afa8', '#6d6b78'],
    'cream': ['#fff3dc', '#e8d8b8', '#bba98c', '#6f6570'],
    'tan': ['#d8b57c', '#ad8a55', '#82663d', '#4b3b33'],
    'bluegrey': ['#7f92ad', '#56677f', '#3b475b', '#222836'],
    'brown': ['#a8784c', '#7e5534', '#5a3a25', '#30202060'],
    'hair_grey': ['#e3e3ea', '#b9b9c6', '#878799', '#4d4c60'],
    'hair_silver': ['#f2f2f6', '#cfd0da', '#9a9cad', '#5a5b6e'],
    'hair_ginger': ['#f2a25c', '#d0763a', '#9c4f2a', '#5a2c26'],
    'hair_auburn': ['#c86a46', '#9a4630', '#6c2c24', '#3a1a1e'],
    'hair_chestnut': ['#a86a42', '#7c4a2c', '#55311f', '#2e1a18'],
    'hair_black': ['#4b4654', '#2d2a34', '#1b1a21', '#0d0d12'],
    'hair_dark': ['#6b5040', '#4a362c', '#30231d', '#181214'],
    'red': ['#e0545a', '#b8303a', '#82202a', '#45141e'],
    'darkred': ['#b8434a', '#8f2a2f', '#621c22', '#341016'],
    'gold': ['#ffe28a', '#e2b54a', '#a87d2e', '#5c4222'],
}
for k, v in PAL.items():
    PAL[k] = [hexc(c[:7]) for c in v]


class P:
    def __init__(self):
        self.im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        self.px = self.im.load()

    def put(self, x, y, c):
        if 0 <= x < S and 0 <= y < S:
            self.px[x, y] = hexc(c) if isinstance(c, str) else c

    def tone(self, nx, ny, pal, bias=0.0):
        nz = math.sqrt(max(0.0, 1 - nx * nx - ny * ny))
        d = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2] + bias
        if d > 0.80:
            return pal[0]
        if d > 0.52:
            return pal[1]
        if d > 0.22:
            return pal[2]
        return pal[3]

    # Shade any mask (function x,y -> bool) as if it were a rounded volume
    # centred at (cx, cy) with radii (rx, ry).
    def shade(self, inside, pal, cx, cy, rx, ry, bias=0.0, box=(0, 0, S, S)):
        x0, y0, x1, y1 = box
        for y in range(max(0, y0), min(S, y1)):
            for x in range(max(0, x0), min(S, x1)):
                if inside(x + 0.5, y + 0.5):
                    nx = max(-0.99, min(0.99, (x + 0.5 - cx) / rx))
                    ny = max(-0.99, min(0.99, (y + 0.5 - cy) / ry))
                    self.px[x, y] = self.tone(nx, ny, pal, bias)

    def ellipse(self, cx, cy, rx, ry, pal, bias=0.0, srx=None, sry=None):
        self.shade(lambda x, y: ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, pal,
                   cx, cy, srx or rx, sry or ry, bias)

    def poly(self, pts, pal, cx, cy, rx, ry, bias=0.0):
        def inside(x, y):
            c = False
            n = len(pts)
            for i in range(n):
                (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % n]
                if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1 + 1e-9) + x1:
                    c = not c
            return c
        self.shade(inside, pal, cx, cy, rx, ry, bias)

    def rect(self, x, y, w, h, c):
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                self.put(xx, yy, c)

    def rim(self):
        # Thin cool rim light on the right-hand edge of the silhouette.
        src = self.im.copy().load()
        for y in range(S):
            for x in range(S - 1):
                if src[x, y][3] and not src[x + 1, y][3]:
                    r, g, b, a = src[x, y]
                    self.px[x, y] = (int(r * 0.45 + RIM[0] * 0.55), int(g * 0.45 + RIM[1] * 0.55), int(b * 0.45 + RIM[2] * 0.55), a)

    def outline(self):
        self.rim()
        src = self.im.copy().load()
        for y in range(S):
            for x in range(S):
                if src[x, y][3]:
                    continue
                if any(0 <= x + dx < S and 0 <= y + dy < S and src[x + dx, y + dy][3]
                       for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    self.px[x, y] = OUTLINE


# ---------- shared building blocks ----------

def shoulders(p, pal, width=19, top=37, collar=None):
    pts = [(24 - width, 48), (24 - width + 3, top + 3), (24 - 7, top), (24 + 7, top), (24 + width - 3, top + 3), (24 + width, 48)]
    p.poly(pts, pal, 24, top + 10, width, 11, bias=0.05)


def neck(p, skin, w=5, top=31, bottom=39):
    p.poly([(24 - w, top), (24 + w, top), (24 + w, bottom), (24 - w, bottom)], skin, 24, top + 2, w + 3, 8, bias=-0.15)


def head(p, skin, w=10, top=10, chin=33, jaw=0.75):
    cy = (top + chin) / 2
    ry = (chin - top) / 2

    def inside(x, y):
        t = (y - cy) / ry
        if abs(t) > 1:
            return False
        half = w * math.sqrt(1 - t * t) if t < 0 else w * (1 - (1 - jaw) * t) * math.sqrt(1 - t ** 4)
        return abs(x - 24) <= half
    p.shade(inside, skin, 24, cy, w, ry)
    # ears
    p.ellipse(24 - w - 0.5, cy + 1, 1.6, 2.6, skin, bias=-0.1)
    p.ellipse(24 + w + 0.5, cy + 1, 1.6, 2.6, skin, bias=-0.1)


def eyes(p, y, gap=4, col='#1a1620', lid=None, blink=False, white=True, brow=None, brow_dy=-2, brow_tilt=0):
    for side in (-1, 1):
        x = 24 + side * gap
        if blink:
            p.put(x - 1, y, col); p.put(x, y, col); p.put(x + 1, y, col)
        else:
            if white:
                p.put(x - 1 if side < 0 else x + 1, y, '#e9e3da')
            p.put(x, y, col)
            p.put(x, y - 1 if lid is None else y - 1, lid or col)
        if brow:
            by = y + brow_dy
            p.put(x - 1, by + (brow_tilt if side < 0 else 0), brow)
            p.put(x, by, brow)
            p.put(x + 1, by + (0 if side < 0 else brow_tilt), brow)


def nose(p, y, skin, length=3):
    for i in range(length):
        p.put(24 + 1, y + i, skin[3] if i < length - 1 else skin[2])
    p.put(24, y + length, skin[3])


def mouth(p, y, col, w=2, smile=0):
    for dx in range(-w, w + 1):
        dy = -smile if abs(dx) == w else 0
        p.put(24 + dx, y + dy, col)


def hair_cap(p, pal, top, w, depth, cx=24):
    p.ellipse(cx, top + depth, w, depth + 0.5, pal)


# ---------- the cast ----------

def dubois(blink=False):
    p = P(); skin = PAL['skin_med']
    shoulders(p, PAL['navy'], 20)
    p.rect(19, 38, 10, 2, PAL['navy'][3]); p.rect(22, 40, 4, 8, PAL['navy'][3])  # collar opening
    p.rect(21, 40, 2, 3, '#d8d2c4'); p.rect(25, 40, 2, 3, '#d8d2c4')  # shirt collar
    p.put(16, 41, PAL['gold'][1]); p.put(32, 41, PAL['gold'][1])  # rank pips
    neck(p, skin, 5)
    head(p, skin, w=10, top=11, chin=34, jaw=0.82)
    # stubble
    for (x, y) in [(18, 29), (20, 31), (22, 32), (26, 32), (28, 31), (30, 29), (19, 31), (29, 31), (24, 33), (21, 30), (27, 30)]:
        p.put(x, y, skin[3])
    # kepi: crown, band, visor
    p.poly([(14, 15), (15, 6), (33, 6), (34, 15)], PAL['navy'], 22, 8, 12, 8)
    p.rect(14, 13, 21, 2, PAL['gold'][2]); p.rect(14, 13, 8, 1, PAL['gold'][1])
    p.poly([(12, 15), (36, 15), (34, 18), (14, 18)], PAL['black'], 20, 15, 13, 3)
    for x in range(14, 34):
        p.put(x, 19, skin[3])  # visor shadow on brow
    eyes(p, 22, 4, blink=blink, lid=skin[3], brow='#3a3038')
    p.rect(20, 21, 2, 1, skin[3]); p.rect(27, 21, 2, 1, skin[3])  # heavy lids
    nose(p, 23, skin, 4)
    p.rect(20, 28, 9, 2, PAL['hair_grey'][2]); p.rect(20, 28, 4, 1, PAL['hair_grey'][1])  # moustache
    mouth(p, 30, '#4a2a2e', 2)
    # cigarette with ember
    p.rect(27, 30, 5, 1, '#efe9de'); p.put(32, 30, '#ff8a3a'); p.put(33, 30, '#ffd27a')
    p.put(33, 28, '#9a9aa8'); p.put(34, 26, '#77778a'); p.put(33, 24, '#5d5d70')  # smoke
    p.outline()
    return p.im


def lebrun(blink=False):
    p = P(); skin = PAL['skin_dark']
    shoulders(p, PAL['olive'], 21)
    p.rect(20, 38, 8, 3, PAL['olive'][3])
    p.rect(21, 41, 6, 7, '#5e4c3a')  # brown jumper under jacket
    neck(p, skin, 5)
    head(p, skin, w=10, top=12, chin=34, jaw=0.85)
    # short grey beard
    p.shade(lambda x, y: y > 28 and abs(x - 24) < 9 - (y - 28) * 0.9 and y < 35, PAL['hair_grey'], 24, 31, 9, 4, bias=-0.2)
    # flat cap
    p.poly([(13, 17), (14, 11), (24, 8), (34, 11), (35, 17)], PAL['olive'], 22, 11, 12, 6)
    p.poly([(14, 16), (37, 15), (36, 18), (14, 18)], PAL['olive'], 20, 16, 13, 3, bias=-0.25)
    for x in range(15, 34):
        p.put(x, 19, skin[3])
    eyes(p, 22, 4, blink=blink, lid=skin[3], brow=PAL['hair_grey'][2], brow_tilt=1)
    nose(p, 23, skin, 4)
    mouth(p, 30, '#2a1a1e', 2)
    p.put(17, 25, skin[3]); p.put(31, 25, skin[3])  # lines
    p.outline()
    return p.im


def theo(blink=False):
    p = P(); skin = PAL['skin_fair']
    shoulders(p, PAL['white'], 19)  # shirt sleeves
    p.poly([(11, 48), (14, 40), (20, 38), (24, 46), (28, 38), (34, 40), (37, 48)], PAL['black'], 24, 44, 12, 6)  # waistcoat
    p.put(24, 44, '#c9c3b8'); p.put(24, 47, '#c9c3b8')  # buttons
    p.rect(22, 38, 4, 2, '#1a1a20'); p.put(21, 37, '#1a1a20'); p.put(26, 37, '#1a1a20')  # bow tie
    p.rect(30, 37, 8, 3, PAL['cream'][1]); p.rect(31, 40, 6, 2, PAL['cream'][2])  # towel on shoulder
    neck(p, skin, 4)
    head(p, skin, w=9, top=12, chin=33, jaw=0.7)
    # messy ginger hair
    p.ellipse(24, 14, 11, 6, PAL['hair_ginger'])
    for (x, y) in [(14, 16), (15, 18), (33, 16), (34, 18), (20, 9), (27, 9), (24, 8), (17, 11), (31, 11)]:
        p.put(x, y, PAL['hair_ginger'][1])
    p.rect(15, 18, 2, 3, PAL['hair_ginger'][2]); p.rect(32, 18, 2, 3, PAL['hair_ginger'][3])
    for (x, y) in [(19, 25), (21, 26), (27, 26), (29, 25), (20, 27), (28, 27)]:
        p.put(x, y, '#c9744e')  # freckles
    eyes(p, 22, 4, blink=blink, brow=PAL['hair_ginger'][2])
    nose(p, 23, skin, 3)
    mouth(p, 29, '#8a3c3c', 2, smile=1)
    p.outline()
    return p.im


def garnier(blink=False):
    p = P(); skin = PAL['skin_fair']
    shoulders(p, PAL['bluegrey'], 21)
    p.rect(21, 38, 6, 10, '#cfd4de'); p.rect(23, 40, 2, 8, '#2b3446')  # shirt and tie
    neck(p, skin, 5)
    head(p, skin, w=10, top=12, chin=33, jaw=0.85)
    # big grey beard
    p.shade(lambda x, y: y > 25 and abs(x - 24) < 11 - max(0, (y - 31)) * 1.4 and y < 39, PAL['hair_grey'], 24, 31, 10, 7, bias=-0.1)
    p.rect(20, 27, 9, 2, PAL['hair_grey'][1])
    # driver's cap
    p.poly([(13, 16), (14, 9), (34, 9), (35, 16)], PAL['bluegrey'], 22, 10, 12, 6)
    p.rect(13, 14, 23, 2, PAL['black'][1])
    p.poly([(12, 16), (36, 16), (33, 19), (15, 19)], PAL['black'], 20, 16, 12, 3)
    p.rect(22, 11, 4, 2, PAL['gold'][1])  # badge
    for x in range(15, 33):
        p.put(x, 20, skin[3])
    eyes(p, 23, 4, blink=blink, brow=PAL['hair_grey'][2])
    p.put(19, 24, skin[2]); p.put(29, 24, skin[2])  # kind crinkles
    nose(p, 24, skin, 3)
    mouth(p, 30, '#6a3a3a', 1)
    p.outline()
    return p.im


def delacroix(blink=False):
    p = P(); skin = PAL['skin_fair']
    shoulders(p, PAL['charcoal'], 21)
    p.rect(21, 38, 6, 10, '#e6e1d6'); p.rect(23, 39, 2, 9, PAL['red'][1]); p.put(23, 39, PAL['red'][0])  # shirt, red tie
    # tricolour sash across the chest
    for i in range(16):
        x = 10 + i; y = 39 + i // 2
        for k, col in enumerate(['#2c4ea8', '#ece8e0', '#c22d36']):
            p.put(x, y + k + 2, col); p.put(x, y + k + 3, col)
    neck(p, skin, 6)
    head(p, skin, w=11, top=11, chin=35, jaw=0.95)  # jowly
    p.put(15, 31, skin[3]); p.put(33, 31, skin[3])
    # silver hair, combed back
    p.poly([(13, 20), (13, 13), (18, 8), (30, 8), (35, 13), (35, 20), (32, 15), (16, 15)], PAL['hair_silver'], 22, 11, 12, 6)
    # trimmed silver beard
    p.shade(lambda x, y: y > 29 and abs(x - 24) < 9 - (y - 29) * 1.2 and y < 36, PAL['hair_silver'], 24, 32, 9, 4, bias=-0.15)
    eyes(p, 22, 4, blink=blink, lid=skin[3], brow=PAL['hair_silver'][2], brow_tilt=-1)
    nose(p, 23, skin, 4)
    mouth(p, 29, '#7a3c3e', 3, smile=1)  # thin smile
    p.outline()
    return p.im


def claire(blink=False):
    p = P(); skin = PAL['skin_pale']
    shoulders(p, PAL['black'], 17)
    p.poly([(18, 37), (30, 37), (29, 41), (19, 41)], PAL['black'], 24, 38, 7, 3, bias=0.1)  # turtleneck
    neck(p, skin, 4, top=31, bottom=37)
    # sharp black bob behind the face
    p.poly([(12, 30), (12, 14), (16, 8), (32, 8), (36, 14), (36, 30), (32, 31), (16, 31)], PAL['hair_black'], 24, 18, 12, 12)
    head(p, skin, w=9, top=12, chin=33, jaw=0.6)
    # fringe cut straight, dark red band
    p.poly([(14, 19), (14, 12), (19, 9), (29, 9), (34, 12), (34, 19), (30, 17), (18, 17)], PAL['hair_black'], 24, 12, 11, 6)
    p.rect(15, 12, 19, 1, PAL['darkred'][1]); p.rect(15, 12, 7, 1, PAL['darkred'][0])
    eyes(p, 22, 4, blink=blink, lid='#1a1620', brow='#1a1620', brow_tilt=-1)
    p.put(19, 23, skin[3]); p.put(29, 23, skin[3])  # tired shadows
    nose(p, 23, skin, 3)
    mouth(p, 29, '#7a3040', 2, smile=-1)  # tight-lipped
    p.put(29, 37, '#c9c3b8')  # small silver earring
    p.outline()
    return p.im


def roux(blink=False):
    p = P(); skin = PAL['skin_fair']
    shoulders(p, PAL['brown'], 21)
    p.poly([(14, 48), (16, 39), (32, 39), (34, 48)], PAL['cream'], 24, 44, 10, 6)  # apron
    p.rect(17, 38, 2, 3, PAL['cream'][1]); p.rect(29, 38, 2, 3, PAL['cream'][1])  # straps
    neck(p, skin, 5)
    head(p, skin, w=10, top=13, chin=34, jaw=0.9)  # round face
    # auburn hair in a bun with stray strands
    p.ellipse(24, 8, 6, 4, PAL['hair_auburn'])
    p.ellipse(24, 16, 11, 5, PAL['hair_auburn'])
    p.rect(13, 17, 2, 6, PAL['hair_auburn'][2]); p.rect(33, 17, 2, 6, PAL['hair_auburn'][3])
    p.put(30, 9, '#f3ead8'); p.put(18, 12, '#f3ead8')  # flour
    p.put(20, 27, '#f3ead8'); p.put(21, 28, '#f3ead8')  # flour on cheek
    p.put(18, 26, '#e48d7e'); p.put(30, 26, '#e48d7e')  # rosy cheeks
    eyes(p, 22, 4, blink=blink, brow=PAL['hair_auburn'][2])
    nose(p, 23, skin, 3)
    mouth(p, 29, '#a0403e', 3, smile=1)
    p.outline()
    return p.im


def helene(blink=False):
    p = P(); skin = PAL['skin_med']
    shoulders(p, PAL['white'], 19)  # pharmacist's white coat
    p.poly([(19, 38), (24, 44), (29, 38)], PAL['olive'], 24, 40, 5, 4)  # green blouse in the V
    p.rect(30, 41, 3, 3, '#2fbf6a'); p.put(31, 40, '#2fbf6a'); p.put(31, 44, '#2fbf6a')  # green cross pin
    neck(p, skin, 4)
    # long chestnut waves behind
    p.poly([(12, 38), (12, 16), (17, 9), (31, 9), (36, 16), (36, 38), (31, 34), (17, 34)], PAL['hair_chestnut'], 24, 20, 12, 14)
    head(p, skin, w=9, top=12, chin=33, jaw=0.68)
    p.poly([(14, 21), (14, 13), (20, 9), (30, 10), (34, 15), (33, 18), (27, 14), (19, 15)], PAL['hair_chestnut'], 22, 13, 11, 6)
    eyes(p, 22, 4, blink=blink, brow=PAL['hair_chestnut'][2], brow_tilt=1)  # worried brows
    nose(p, 23, skin, 3)
    mouth(p, 29, '#9a4448', 2)
    p.outline()
    return p.im


def inspector(blink=False):
    p = P(); skin = PAL['skin_fair']
    # trench coat with the collar turned up
    shoulders(p, PAL['tan'], 21)
    p.poly([(14, 40), (17, 31), (21, 38)], PAL['tan'], 16, 35, 4, 5)
    p.poly([(34, 40), (31, 31), (27, 38)], PAL['tan'], 32, 35, 4, 5, bias=-0.2)
    p.rect(22, 39, 4, 9, '#2c2a30')
    neck(p, skin, 4)
    head(p, skin, w=9, top=13, chin=33, jaw=0.72)
    # fedora: crown, band, wide brim, deep shadow over the eyes
    p.poly([(15, 15), (16, 7), (21, 5), (27, 5), (32, 7), (33, 15)], PAL['charcoal'], 22, 8, 11, 7)
    p.rect(15, 13, 18, 2, '#141318')
    p.poly([(9, 16), (39, 16), (36, 19), (12, 19)], PAL['charcoal'], 20, 16, 15, 3)
    for x in range(14, 34):
        p.put(x, 20, skin[3]); p.put(x, 21, skin[3])  # brim shadow
    eyes(p, 22, 4, blink=blink, col='#e8d9a8', white=False, lid=skin[3])  # eyes glint from the shadow
    nose(p, 24, skin, 3)
    mouth(p, 29, '#6a3a3a', 2)
    p.put(21, 31, skin[2]); p.put(27, 31, skin[2])  # stubble hint
    p.outline()
    return p.im


CAST = {
    'dubois': dubois, 'lebrun': lebrun, 'theo': theo, 'garnier': garnier, 'delacroix': delacroix,
    'claire': claire, 'roux': roux, 'helene': helene, 'inspector': inspector,
}

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, fn in CAST.items():
        sheet = Image.new('RGBA', (S * 2, S), (0, 0, 0, 0))
        sheet.paste(fn(False), (0, 0))
        sheet.paste(fn(True), (S, 0))
        sheet.save(os.path.join(OUT, f'{name}.png'))
    print('wrote', len(CAST), 'portraits')
