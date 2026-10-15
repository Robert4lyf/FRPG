"""Compose the Belleville cast from LPC layers, recolouring each layer to a target colour ramp."""
import os, sys
from PIL import Image

ROOT = os.environ.get('LPC_ROOT', 'lpc/spritesheets')  # clone of the Universal LPC Spritesheet Character Generator
OUT = os.path.join(os.path.dirname(__file__), 'source', 'lpc')
os.makedirs(OUT, exist_ok=True)


def hexrgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def load(part):
    for f in ('walk.png', 'walk/gray.png', 'walk/base.png', 'walk/charcoal.png'):
        p = os.path.join(ROOT, part, f)
        if os.path.exists(p):
            return Image.open(p).convert('RGBA')
    raise FileNotFoundError(part)


def recolour(im, dark, light, keep_dark=0):
    """Map each pixel's brightness onto a ramp from `dark` to `light` (outlines stay near black)."""
    dark, light = hexrgb(dark), hexrgb(light)
    px = im.load()
    w, h = im.size
    lums = sorted({(r * 299 + g * 587 + b * 114) // 1000 for y in range(h) for x in range(w)
                   for (r, g, b, a) in [px[x, y]] if a})
    if not lums:
        return im
    lo, hi = lums[0], lums[-1]
    out = im.copy(); po = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if not a:
                continue
            L = (r * 299 + g * 587 + b * 114) // 1000
            if L <= lo + keep_dark:
                po[x, y] = (max(0, dark[0] // 2 - 8), max(0, dark[1] // 2 - 8), max(0, dark[2] // 2 - 6), a)
                continue
            t = (L - lo) / max(1, hi - lo)
            t = t ** 0.85
            po[x, y] = tuple(int(dark[i] + (light[i] - dark[i]) * t) for i in range(3)) + (a,)
    return out


SKIN = {'fair': ('#7a4a3c', '#f6c9a3'), 'med': ('#5e3a2c', '#dba57a'), 'dark': ('#2e1c18', '#9a6a4c'), 'pale': ('#6a4a4e', '#f7dccb')}

# name: list of (part, dark, light) in draw order. Skin for body/head given by 'skin'.
CAST = {
    'inspector': dict(sex='male', skin='fair', head='male', layers=[
        ('feet/shoes/basic/male', '#141216', '#4a4440'), ('legs/formal/male', '#18171c', '#4a4852'),
        ('torso/clothes/longsleeve/formal/male', '#6c6a74', '#e6e2da'),
        ('torso/jacket/trench/male', '#4a3620', '#c9a46a'),
        ('beards/beard/5oclock_shadow', '#2a2020', '#5a4a44'),
        ('hair/buzzcut/adult', '#1c1614', '#4a3a30'),
        ('hat/formal/bowler/adult', '#141318', '#55525e')]),
    'helene': dict(sex='female', skin='med', head='female', layers=[
        ('feet/shoes/basic/thin', '#141216', '#4a4440'), ('legs/pants/thin', '#1e2e20', '#4a6a48'),
        ('torso/clothes/blouse_longsleeve/female', '#8a8890', '#fbf8f0'),
        ('hair/curly_long/adult', '#3a1e12', '#b06a3e')]),
    'dubois': dict(sex='male', skin='med', head='male_elderly', layers=[
        ('feet/shoes/basic/male', '#0e0e12', '#3a3a44'), ('legs/formal/male', '#0f1530', '#34457e'),
        ('torso/clothes/longsleeve/formal/male', '#5a6a8a', '#bfd0ee'),
        ('torso/jacket/collared/male', '#0f1530', '#3a4c8c'),
        ('beards/mustache/walrus', '#3a3a40', '#a8a8b0'),
        ('hair/buzzcut/adult', '#3a3a40', '#9a9aa4')],
        cap=('kepi', ('#0d1228', '#1f2c5a', '#3a4c8c', '#c9a64a'))),
    'lebrun': dict(sex='male', skin='dark', head='male_elderly', layers=[
        ('feet/shoes/basic/male', '#1a1210', '#4a3a2c'), ('legs/pants/male', '#2a2018', '#6a5640'),
        ('torso/clothes/longsleeve/formal/male', '#3a2416', '#8a5a34'),
        ('torso/jacket/collared/male', '#2a301a', '#7a8448'),
        ('beards/beard/trimmed', '#5a5a60', '#c8c8ce'),
        ('hair/buzzcut/adult', '#5a5a60', '#c8c8ce')],
        cap=('flat', ('#283018', '#4c5631', '#6e7a44', '#4c5631'))),
    'theo': dict(sex='male', skin='fair', head='male', layers=[
        ('feet/shoes/basic/male', '#0e0e12', '#3a3a44'), ('legs/formal/male', '#121216', '#3e3e48'),
        ('torso/clothes/longsleeve/formal/male', '#8a8890', '#fbf8f0'),
        ('torso/clothes/vest/male', '#0e0e12', '#3a3a44'),
        ('neck/tie/bowtie/adult', '#0a0a0c', '#2a2a30'),
        ('hair/bedhead/adult', '#6a2c14', '#e0803e')]),
    'garnier': dict(sex='male', skin='fair', head='male_elderly', layers=[
        ('feet/shoes/basic/male', '#0e0e12', '#3a3a44'), ('legs/formal/male', '#1a2234', '#4a5a78'),
        ('torso/clothes/longsleeve/formal/male', '#5a6a8a', '#bfd0ee'),
        ('torso/jacket/collared/male', '#1a2234', '#56678a'),
        ('beards/beard/winter/male', '#6a6a72', '#e6e6ec'),
        ('hair/balding/adult', '#6a6a72', '#e6e6ec')],
        cap=('driver', ('#141a2c', '#26304a', '#3e4c6e', '#16161c'))),
    'delacroix': dict(sex='male', skin='fair', head='male_elderly', layers=[
        ('feet/shoes/basic/male', '#0e0e12', '#3a3a44'), ('legs/formal/male', '#16151a', '#44424c'),
        ('torso/clothes/longsleeve/formal/male', '#8a8890', '#fbf8f0'),
        ('torso/jacket/frock/male', '#16151a', '#4a4852'),
        ('beards/beard/trimmed', '#7a7a84', '#eeeef4'),
        ('hair/parted/adult', '#7a7a84', '#eeeef4')]),
    'claire': dict(sex='female', skin='pale', head='female', layers=[
        ('feet/shoes/basic/thin', '#0e0e12', '#3a3a44'), ('legs/pants/thin', '#0e0e12', '#34323a'),
        ('torso/clothes/blouse_longsleeve/female', '#0e0e12', '#3a3842'),
        ('hair/bob/adult', '#0a0a0e', '#3a3644')]),
    'mmedelacroix': dict(sex='female', skin='fair', head='female_elderly', layers=[
        ('feet/shoes/basic/thin', '#141216', '#4a4440'), ('legs/pants/thin', '#241420', '#5a3a50'),
        ('torso/clothes/blouse_longsleeve/female', '#3a1830', '#8a4a74'),
        ('hair/bob/adult', '#5a5a64', '#c8c8d2')]),
    'vasseur': dict(sex='female', skin='fair', head='female', layers=[
        ('feet/shoes/basic/thin', '#141216', '#4a4440'), ('legs/pants/thin', '#1c1d22', '#4a4c56'),
        ('torso/clothes/blouse_longsleeve/female', '#2a2c34', '#6a6e7c'),
        ('hair/bob/adult', '#4a4c54', '#a8acb6')]),
    'roux': dict(sex='female', skin='fair', head='female_elderly', layers=[
        ('feet/shoes/basic/thin', '#1a1210', '#4a3a2c'), ('legs/pants/thin', '#2a1c14', '#6a4a34'),
        ('torso/clothes/blouse_longsleeve/female', '#3a2216', '#9a6440'),
        ('torso/aprons/apron_full/female', '#9a907c', '#fbf4e2'),
        ('hair/bangs_bun/adult', '#4a1c12', '#c0603a')]),
}


def head_boxes(head):
    """Per 64x64 frame: (left, top, right, bottom) of the head layer, or None."""
    boxes = {}
    for r in range(head.height // 64):
        for f in range(head.width // 64):
            bb = head.crop((f * 64, r * 64, f * 64 + 64, r * 64 + 64)).getbbox()
            boxes[(r, f)] = bb
    return boxes


def draw_cap(img, head, kind, cols):
    """Paint a cap over the head in every frame. Rows: 0 up, 1 left, 2 down, 3 right."""
    dark, mid, light, band = (hexrgb(c) for c in cols)
    out = (14, 14, 20, 255)
    px = img.load()
    def put(x, y, c):
        if 0 <= x < img.width and 0 <= y < img.height:
            px[x, y] = c if len(c) == 4 else c + (255,)
    for (r, f), bb in head_boxes(head).items():
        if not bb:
            continue
        ox, oy = f * 64, r * 64
        l, t, rr, _ = bb
        w = rr - l
        cx = ox + (l + rr) // 2
        if kind == 'kepi':      # tall flat-topped crown, gold band, black visor
            crown_h, crown_w, top = 6, w, oy + t - 2
        elif kind == 'driver':  # wider flat top over a band
            crown_h, crown_w, top = 4, w + 2, oy + t - 1
        else:                   # flat cap: low dome
            crown_h, crown_w, top = 4, w + 2, oy + t
        x0 = cx - crown_w // 2
        for yy in range(crown_h):
            inset = 1 if (kind == 'kepi' and yy < 2) else 0
            if kind == 'flat' and yy == 0:
                inset = 2
            for xx in range(x0 + inset, x0 + crown_w - inset):
                rel = (xx - x0) / max(1, crown_w - 1)
                col = light if rel < 0.3 else mid if rel < 0.7 else dark
                put(xx, top + yy, col)
            put(x0 + inset - 1, top + yy, out); put(x0 + crown_w - inset, top + yy, out)
        for xx in range(x0 - 1, x0 + crown_w + 1):
            put(xx, top - 1, out)
        by = top + crown_h
        if kind in ('kepi', 'driver'):
            for xx in range(x0, x0 + crown_w):
                put(xx, by, band)
            put(x0 - 1, by, out); put(x0 + crown_w, by, out)
            by += 1
        # peak/visor toward the facing direction
        vis = (12, 12, 16, 255)
        if r == 2:  # facing down: visor across the front
            for xx in range(x0, x0 + crown_w):
                put(xx, by, vis if kind != 'flat' else dark)
        elif r in (1, 3):  # side: peak sticks out in front
            d = -1 if r == 1 else 1
            front = x0 if r == 1 else x0 + crown_w - 1
            for k in range(4):
                put(front + d * k, by - (1 if k < 1 else 0) + (0 if kind != 'flat' else 0), vis if kind != 'flat' else dark)
                put(front + d * k, by + 1, out)
        if kind == 'driver' and r == 2:
            put(cx, top + 2, band); put(cx - 1, top + 2, band)


def compose(name, c):
    skin = SKIN[c['skin']]
    img = recolour(load(f"body/bodies/{c['sex']}"), *skin)
    img.alpha_composite(recolour(load(f"head/heads/human/{c['head']}"), *skin))
    head = load(f"head/heads/human/{c['head']}")
    for part, d, l in c['layers']:
        try:
            img.alpha_composite(recolour(load(part), d, l))
        except FileNotFoundError:
            print('missing', name, part)
    if c.get('cap'):
        draw_cap(img, head, *c['cap'])
    return img


if __name__ == '__main__':
    for n, c in CAST.items():
        compose(n, c).save(os.path.join(OUT, f'{n}.png'))
    print('ok')
