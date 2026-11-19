#!/usr/bin/env python3
"""Make the app icons in the site's colors (docs/icons/). Run once; re-run to change the design."""
import pathlib
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parent.parent / "docs" / "icons"
NAVY, TEAL, WHITE = (11, 79, 108), (159, 214, 224), (255, 255, 255)
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def art(size, safe):
    """Full-bleed navy square. Text sits inside `safe` (fraction of the side) so
    Android's round/squircle masks and iOS's rounded corners never clip it."""
    im = Image.new("RGB", (size, size), NAVY)
    d = ImageDraw.Draw(im)
    box = size * safe
    left = (size - box) / 2
    f1 = ImageFont.truetype(BOLD, int(box * 0.34))
    f2 = ImageFont.truetype(BOLD, int(box * 0.17))
    w1 = d.textlength("TEAS", font=f1)
    w2 = d.textlength("PREP", font=f2)
    y1 = left + box * 0.16
    d.text(((size - w1) / 2, y1), "TEAS", font=f1, fill=WHITE)
    bar_y = y1 + box * 0.44
    d.rounded_rectangle([(size - w1) / 2, bar_y, (size + w1) / 2, bar_y + box * 0.045], radius=box * 0.02, fill=TEAL)
    d.text(((size - w2) / 2, bar_y + box * 0.09), "PREP", font=f2, fill=TEAL)
    return im


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    big = art(1024, 0.86)        # regular icon: a little margin
    mask = art(1024, 0.66)       # maskable: content inside the 80% safe circle
    for name, im, px in [("icon-192.png", big, 192), ("icon-512.png", big, 512),
                         ("icon-maskable-512.png", mask, 512), ("icon-maskable-192.png", mask, 192),
                         ("apple-touch-icon.png", big, 180)]:
        im.resize((px, px), Image.LANCZOS).save(OUT / name, optimize=True)
    print("icons in", OUT)


if __name__ == "__main__":
    main()
