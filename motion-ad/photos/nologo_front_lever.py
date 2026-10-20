# One pass from the original front-lever photo (card 1): paints out apparel and
# equipment prints. The athlete's body is never touched. Writes the -nologo file once.
import os
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'front-lever-door-bar.webp')
DST = os.path.join(HERE, 'front-lever-door-bar-nologo.webp')
orig = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
out = orig.copy()
lum = orig.mean(axis=2)
rng = np.random.default_rng(3)
ALLOWED = np.zeros(lum.shape, bool)  # declared retouch zones: nothing may change outside them


def harmonic(mask, known, iters=600):
    w = out.copy()
    w[mask] = 0
    for it in range(iters):
        k0 = known | (mask if it else np.zeros_like(mask))
        acc = np.zeros_like(w)
        cnt = np.zeros(mask.shape, np.float32)
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            k = np.roll(np.roll(k0, dy, 0), dx, 1)
            acc += np.roll(np.roll(w, dy, 0), dx, 1) * k[..., None]
            cnt += k
        w[mask] = (acc / np.maximum(cnt, 1)[..., None])[mask]
    return w


def grow(m, n):
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(n))) > 0


SKIN = (orig[..., 0] - orig[..., 2] > 25) & (lum > 90)  # warm, light: wrists and hands


def light_on_dark(box, thr, dark, g=5, neutral=False, nowall=False):
    """Light print on a dark ground (socks, black end cap): refill from the dark ground.
    neutral: only grey pixels (prints), so a box that touches skin never takes it.
    nowall: also leave anything as light as the wall (for marks on a band's edge)."""
    x0, y0, x1, y1 = box
    ALLOWED[y0 - g:y1 + g, x0 - g:x1 + g] = True
    m = np.zeros(lum.shape, bool)
    m[y0:y1, x0:x1] = lum[y0:y1, x0:x1] > thr
    if neutral:
        m &= ~SKIN
    m = grow(m, g)
    if neutral:
        m &= ~grow(SKIN, 3)
    if nowall:
        m &= lum < 190
    w = harmonic(m, (~m) & (lum < dark))
    w[m] += rng.normal(0, 2.5, (m.sum(), 1))
    out[m] = w[m]
    return int(m.sum())


def dark_on_light(box, depth):
    """Faint dark print on a light ground (grey end cap): refill from the ground."""
    x0, y0, x1, y1 = box
    ALLOWED[y0 - 3:y1 + 3, x0 - 3:x1 + 3] = True
    bg = np.asarray(Image.fromarray(lum.astype(np.uint8)).filter(ImageFilter.MedianFilter(15))).astype(np.float32)
    m = np.zeros(lum.shape, bool)
    m[y0:y1, x0:x1] = (bg - lum)[y0:y1, x0:x1] > depth
    m = grow(m, 3)
    w = harmonic(m, ~m)
    out[m] = w[m]
    return int(m.sum())


def band(x0, x1, y0, y1, ya, yb, dark=45):
    """Wristband: a white lettered stripe across a black band. The band's outline at the
    stripe rows is interpolated from its black rows just above (ya) and below (yb), so
    the fill never spills onto the wall or the wrist; inside it, everything lighter than
    the band is refilled from the black around it."""
    def extent(y):
        xs = np.where(lum[y, x0:x1] < dark)[0]
        return x0 + xs[0], x0 + xs[-1]
    (la, ra), (lb, rb) = extent(ya), extent(yb)
    m = np.zeros(lum.shape, bool)
    for y in range(ya + 1, yb):
        t = (y - ya) / (yb - ya)
        l, r = round(la + (lb - la) * t), round(ra + (rb - ra) * t)
        m[y, l + 1:r] = lum[y, l + 1:r] > dark
    m = grow(m, 3) & (np.arange(lum.shape[0])[:, None] > ya) & (np.arange(lum.shape[0])[:, None] < yb)
    for y in range(ya + 1, yb):
        t = (y - ya) / (yb - ya)
        ALLOWED[y, round(la + (lb - la) * t) - 4:round(ra + (rb - ra) * t) + 5] = True  # stripe runs ~3 px past
    w = harmonic(m, (~m) & (lum < dark))
    w[m] += rng.normal(0, 2.0, (m.sum(), 1))
    out[m] = w[m]
    return int(m.sum())


n = {}
n['socks'] = light_on_dark((250, 384, 284, 408), 48, 70, 5, True) + light_on_dark((158, 288, 175, 316), 48, 70, 5, True)
n['wrist_left'] = band(205, 262, 200, 250, 212, 237)
n['wrist_right'] = band(415, 466, 190, 236, 201, 224)
n['wrist_small'] = light_on_dark((213, 204, 224, 210), 60, 45, 3, True, True) + light_on_dark((452, 198, 460, 207), 90, 45, 3, True, True)
n['cap_left'] = light_on_dark((125, 146, 134, 195), 80, 60, 3)
n['cap_right'] = dark_on_light((526, 108, 538, 188), 12)
# guard: no skin pixel may change (the athlete stays exactly as photographed)
changed = np.abs(out - orig).max(axis=2) > 1
assert not (changed & SKIN).any(), f'{int((changed & SKIN).sum())} skin pixels changed'
spill = changed & ~ALLOWED
assert not spill.any(), f'{int(spill.sum())} pixels changed outside the declared retouch zones'
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(DST, lossless=True)
print(n)
