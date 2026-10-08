"""Detoure les livres des slides de reference -> PNG RGBA pour la video.

Alpha = 1 dans la silhouette du livre (enveloppe convexe des pixels sombres,
+ bloc de pages), ailleurs alpha "unmix" contre la couleur de fond : les ombres
deviennent du noir semi-transparent, le fond devient transparent.
"""
import sys
import numpy as np
import cv2

REFS, OUT = sys.argv[1], sys.argv[2]
LUM = np.array([0.2126, 0.7152, 0.0722], np.float32)


def load(name):
    return cv2.imread(f"{REFS}/{name}")[:, :, ::-1].astype(np.float32)


def unmix(rgb, bg):
    """Minimum alpha such that rgb = a*F + (1-a)*bg with F black (shadow model)."""
    # Outside the book only shadows matter: pixels brighter than the backdrop
    # are JPEG noise or vignetting, never foreground.
    a = ((bg - rgb) / np.maximum(bg, 1)).max(axis=2)
    # JPEG noise floor -> 0
    return np.clip((a - 0.03) / (1 - 0.03), 0, 1)


def cutout(rgb, bg, opaque_poly, roi, feather=24, edges="lrtb", keep=None):
    x0, y0, x1, y1 = roi
    c = rgb[y0:y1, x0:x1].copy()
    a = unmix(c, bg)
    mask = np.zeros(a.shape, np.uint8)
    poly = np.array([[px - x0, py - y0] for px, py in opaque_poly], np.int32)
    cv2.fillPoly(mask, [poly], 255)
    mask = cv2.GaussianBlur(mask, (3, 3), 0).astype(np.float32) / 255
    if keep is not None:  # only keep unmixed alpha inside these rects (abs coords)
        k = np.zeros(a.shape, np.float32)
        for kx0, ky0, kx1, ky1 in keep:
            k[max(ky0 - y0, 0):max(ky1 - y0, 0), max(kx0 - x0, 0):max(kx1 - x0, 0)] = 1
        a *= k
    a = np.maximum(a, mask)
    # feather the crop border so no rectangle edge can show
    h, w = a.shape
    yy, xx = np.mgrid[0:h, 0:w]
    d = {"l": xx, "r": w - 1 - xx, "t": yy, "b": h - 1 - yy}
    edge = np.minimum.reduce([d[e] for e in edges]).astype(np.float32)
    a *= np.clip(edge / feather, 0, 1)
    # foreground colour: inside silhouette keep pixel, outside solve unmix
    F = np.where(a[..., None] > 1e-3, (c - (1 - a[..., None]) * bg) / np.maximum(a[..., None], 1e-3), 0)
    F = np.where(mask[..., None] > 0.5, c, F)
    F = np.clip(F, 0, 255)
    out = np.dstack([F, a * 255]).astype(np.uint8)
    return out


def save(name, rgba):
    cv2.imwrite(f"{OUT}/{name}", cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    print(name, rgba.shape[1], "x", rgba.shape[0])


def bg_of(rgb, pts):
    return np.median(np.concatenate([rgb[y:y + 16, x:x + 16].reshape(-1, 3) for x, y in pts]), axis=0)


def dark_hull(rgb, region, thr):
    x0, y0, x1, y1 = region
    l = rgb[y0:y1, x0:x1] @ LUM
    ys, xs = np.where(l < thr)
    pts = np.stack([xs + x0, ys + y0], 1).astype(np.int32)
    return cv2.convexHull(pts).reshape(-1, 2)


# 1) Intensity, hi-res, from the PROBLEM slide (2000px)
p = load("problem.jpg")
bg = bg_of(p, [(1080, 600), (1900, 600), (1080, 1740), (1900, 1740), (1500, 1735)])
hull = dark_hull(p, (1100, 590, 1900, 1740), 0.55 * float(bg @ LUM))
save("intensity.png", cutout(p, bg, hull, (1085, 575, 1925, 1765)))

# 2) Volume + Periodization from the PACK slide (1024px)
k = load("pack.jpg")
bgk = bg_of(k, [(30, 210), (975, 210), (30, 735), (975, 735)])
vol_poly = [(354, 236), (673, 236), (673, 715), (354, 715)]
save("volume.png", cutout(k, bgk, vol_poly, (330, 222, 700, 742), feather=10,
                          keep=[(354, 715, 674, 742)]))
# Periodization: cover hull (right of Volume) + page block, cut under Volume (x>=664)
cov = dark_hull(k, (674, 236, 930, 722), 130)
pages = [(926, 241), (942, 245), (947, 260), (944, 700), (934, 710), (928, 715)]
per_poly = cv2.convexHull(np.array(list(map(tuple, cov)) + pages + [(664, 255), (664, 694)], np.int32)).reshape(-1, 2)
# left edge sits under Volume: no feather there
save("periodization.png", cutout(k, bgk, per_poly, (664, 222, 990, 742), feather=10, edges="rtb"))
