"""Writes assets/lpc/CREDITS.md: authors, licences and links for every LPC part used by tools/lpc_compose.py.
Run: python3 tools/lpc_credits.py path/to/LPC/CREDITS.csv
"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lpc_compose import CAST

rows = list(csv.DictReader(open(sys.argv[1], encoding='utf-8')))
parts = set()
for c in CAST.values():
    parts.add(f"body/bodies/{c['sex']}")
    parts.add(f"head/heads/human/{c['head']}")
    parts.update(p for p, _, _ in c['layers'])

out = ['# LPC character credits', '',
       'In-game characters (test sprite set, `?sprites=lpc`) are composed from the Universal LPC Spritesheet',
       'Character Generator (https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator),',
       'then recoloured, given drawn caps and shrunk (tools/lpc_compose.py, tools/import_lpc.py).',
       'These derived sprites are shared under the same licences as their sources (CC-BY-SA 3.0 / GPL 3.0 / OGA-BY 3.0).', '']
for part in sorted(parts):
    hit = [r for r in rows if r['filename'].strip().startswith(part + '/walk')] or \
          [r for r in rows if r['filename'].strip().startswith(part + '/')]
    if not hit:
        print('no credit row for', part); continue
    r = hit[0]
    out += [f'## {part}', f"- Authors: {r['authors'].strip()}", f"- Licences: {r['licenses'].strip()}",
            f"- Links: {', '.join(u.strip() for u in r['urls'].split(','))}", '']
open(os.path.join(os.path.dirname(__file__), '..', 'assets', 'lpc', 'CREDITS.md'), 'w', encoding='utf-8').write('\n'.join(out))
print('credited', len(parts), 'parts')
