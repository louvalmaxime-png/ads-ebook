"""Sound design for the ads: an original 120 BPM score + SFX on the video cues.

    python3 design.py reel          # carousel/video/reel_A_9x16.mp4
    python3 design.py ad            # motion-ad/out/ad_916.mp4 and ad_45.mp4
    python3 design.py all

Each target renders music and SFX stems, mixes them (ducking under impacts,
one beat of silence before the price, fade-out), normalises to -14 LUFS with
a -1.5 dBTP ceiling, then muxes the mix into the MP4(s) without touching the
video stream. Stems land next to the video in audio/ as .m4a.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
from scipy import signal
from scipy.io import wavfile

import synth as s

ROOT = Path(__file__).resolve().parents[2]
SR = s.SR
FPS = 30
BAR, BEAT = 2.0, 0.5  # 120 BPM, 4/4

# A minor, one chord per bar: Am - F - Dm - E (smooth voice leading on the pad).
PROG = [
    dict(root=55.00, pad=[220.00, 261.63, 329.63], arp=[440.00, 523.25, 659.26, 880.00]),
    dict(root=43.65, pad=[220.00, 261.63, 349.23], arp=[349.23, 440.00, 523.25, 698.46]),
    dict(root=73.42, pad=[220.00, 293.66, 349.23], arp=[293.66, 349.23, 440.00, 587.33]),
    dict(root=41.20, pad=[207.65, 246.94, 329.63], arp=[329.63, 415.30, 493.88, 659.26]),
]
ARP_STEPS = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 3, 2, 1, 2]
BASE = dict(kick=0.75, clap=0.4, hat=0.2, hat16=0.1, ohat=0.13, bass=0.42, pad=0.42, arp=0.26)
FULL = dict(kick=1, clap=1, hat=0.9, hat16=0.6, ohat=0.6, bass=1, pad=0.85, arp=0.85, pad_cut=1500, arp_cut=2800)

TARGETS = {
    'reel': dict(
        name='reel_A',
        videos=['carousel/video/reel_A_9x16.mp4'],
        cues='motion-ad/video/src/reel/cues.json',
        duration=27.5,
        silence=(22.5, 23.0),
        fade=(26.5, 27.5),
        riser=(20.5, 22.5),
        parts=[(0.0, 22.5), (23.0, 27.5)],
        sections=[
            (0.0, 3.5, dict(kick=1, clap=0, hat=0.7, hat16=0, ohat=0, bass=1, pad=0.8, arp=0, pad_cut=1100, arp_cut=1800)),
            (3.5, 7.0, dict(kick=1, clap=1, hat=0.8, hat16=0, ohat=0, bass=1, pad=0.8, arp=0, pad_cut=1200, arp_cut=1800)),
            (7.0, 10.0, dict(kick=1, clap=1, hat=0.8, hat16=0.5, ohat=0, bass=1, pad=0.8, arp=0.55, pad_cut=1300, arp_cut=2000)),
            (10.0, 17.5, FULL),
            # reviews: breakdown, the pad opens up under the riser
            (17.5, 22.5, dict(kick=0, clap=0, hat=0.45, hat16=0, ohat=0, bass=0.55, pad=1.1, arp=0.85,
                              pad_cut=(900, 2600), arp_cut=(1500, 3500), pump=0)),
            (23.0, 27.5, dict(FULL, pad=0.9, arp=0.9, pad_cut=1600, arp_cut=3000)),
        ],
    ),
    'ad': dict(
        name='ad',
        videos=['motion-ad/out/ad_916.mp4', 'motion-ad/out/ad_45.mp4'],
        cues='motion-ad/video/src/cues.json',
        duration=20.0,
        silence=(15.5, 16.0),
        fade=(19.0, 20.0),
        riser=(13.5, 15.5),
        parts=[(0.0, 15.5), (16.0, 20.0)],
        sections=[
            (0.0, 3.5, dict(kick=1, clap=0, hat=0.7, hat16=0, ohat=0, bass=1, pad=0.8, arp=0, pad_cut=1100, arp_cut=1800)),
            (3.5, 7.0, dict(kick=1, clap=1, hat=0.8, hat16=0, ohat=0, bass=1, pad=0.8, arp=0, pad_cut=1200, arp_cut=1800)),
            (7.0, 10.0, dict(kick=1, clap=1, hat=0.8, hat16=0.5, ohat=0, bass=1, pad=0.8, arp=0.55, pad_cut=1300, arp_cut=2000)),
            (10.0, 15.5, dict(FULL, pad_cut=(1500, 2400))),
            (16.0, 20.0, dict(FULL, pad=0.9, arp=0.9, pad_cut=1600, arp_cut=3000)),
        ],
    ),
}

SFX_GAIN = dict(pop=0.5, tick=0.22, key=0.2, click=0.5, impact=1.0, whoosh=0.36, star=0.22, sparkle=0.3)
STAR_NOTES = [1318.5, 1568.0, 1760.0, 2093.0, 2637.0]  # E6 G6 A6 C7 E7


def section_at(sections, t):
    for a, b, mix in sections:
        if a <= t < b:
            return a, b, mix
    return None


def value(mix, key, t, a, b):
    v = mix.get(key, 0)
    if isinstance(v, tuple):
        return v[0] + (v[1] - v[0]) * (t - a) / (b - a)
    return v


def automation(sections, key, n):
    """Per-sample gain curve from the section table, smoothed over 20 ms."""
    g = np.zeros(n)
    for a, b, mix in sections:
        i, j = s.n_of(a), min(n, s.n_of(b))
        g[i:j] = mix.get(key, 0) if not isinstance(mix.get(key, 0), tuple) else 1
    k = s.n_of(0.02)
    return np.convolve(g, np.ones(k) / k, mode='same')


def render_music(cfg, rng):
    n = s.n_of(cfg['duration'])
    sections = cfg['sections']
    tracks = {k: np.zeros((n, 2)) for k in BASE}
    kick_times = []
    one = dict(kick=s.kick(rng), clap=s.clap(rng), hat=s.hat(rng), ohat=s.hat(rng, open_=True))

    for p0, p1 in cfg['parts']:
        origin = p0
        bars = int(np.ceil((p1 - origin) / BAR))
        for bar in range(bars):
            chord = PROG[bar % 4]
            t_bar = origin + bar * BAR
            sec = section_at(sections, max(t_bar, p0))
            if sec:
                a, b, mix = sec
                cut = value(mix, 'pad_cut', t_bar, a, b) or 1200
                s.place(tracks['pad'], s.pad_chord(chord['pad'], BAR + 0.35, cut, rng), t_bar - 0.05)
            for k in range(4):
                t = t_bar + k * BEAT
                if not p0 <= t < p1:
                    continue
                s.place(tracks['kick'], one['kick'], t)
                if section_at(sections, t) and section_at(sections, t)[2].get('kick', 0) > 0:
                    kick_times.append(t)
                if k in (1, 3):
                    s.place(tracks['clap'], one['clap'], t, p=0.05)
                off = t + BEAT / 2
                if off < p1:
                    s.place(tracks['hat'], one['hat'], off, p=0.18)
                    s.place(tracks['bass'], s.bass_note(chord['root'], 0.24, rng), off)
                    if k == 3:
                        s.place(tracks['ohat'], one['ohat'], off, p=-0.2)
            for st in range(16):
                t = t_bar + st * BEAT / 4
                if not p0 <= t < p1:
                    continue
                sec = section_at(sections, t)
                if not sec:
                    continue
                a, b, mix = sec
                accent = 1.0 if st % 4 == 0 else (0.75 if st % 2 == 0 else 0.55)
                s.place(tracks['hat16'], one['hat'], t, gain=accent * 0.8, p=-0.25 if st % 2 else 0.25)
                f = chord['arp'][ARP_STEPS[st]]
                s.place(tracks['arp'], s.pluck(f, value(mix, 'arp_cut', t, a, b) or 2000, rng), t, gain=accent)

    # section automation, sidechain pump from the kick
    pump = np.ones(n)
    t_axis = s.t_of(n)
    for tk in kick_times:
        i = s.n_of(tk)
        span = slice(i, min(n, i + s.n_of(0.45)))
        pump[span] = np.minimum(pump[span], 1 - np.exp(-(t_axis[span] - tk) / 0.11))
    pump_on = automation([(a, b, dict(p=mix.get('pump', 1))) for a, b, mix in sections], 'p', n)
    music = np.zeros((n, 2))
    depth = dict(bass=0.7, pad=0.4, arp=0.25)
    for key, bus in tracks.items():
        g = automation(sections, key, n) * BASE[key]
        if key in depth:
            g = g * (1 - depth[key] * pump_on * (1 - pump))
        if key == 'arp':
            bus = s.pingpong(bus, mix=0.28)
        music += bus * g[:, None]

    r0, r1 = cfg['riser']
    s.place(music, s.riser(r1 - r0, rng), r0, gain=0.32)
    irs = s.reverb_ir(rng)
    music = s.reverb(music, irs, 0.16)
    # phone-first low end: no rumble, a softer shelf under 90 Hz
    music = s.filt(music, 'highpass', 35, 4)
    music = music - 0.35 * s.filt(music, 'lowpass', 90, 2)
    peak = np.max(np.abs(music))
    music = music / peak  # gain staging before the bus saturation
    return np.tanh(1.4 * music) / np.tanh(1.4)


def render_sfx(cues, n, rng):
    bus = np.zeros((n, 2))
    stars = 0
    for c in cues:
        kind = c['sfx']
        if kind == 'music':
            continue
        t = c['frame'] / FPS
        g = SFX_GAIN[kind]
        if kind == 'pop':
            s.place(bus, s.pop(rng, rng.uniform(0.95, 1.06)), t, g, rng.uniform(-0.15, 0.15))
        elif kind == 'tick':
            s.place(bus, s.tick(rng, rng.uniform(0.9, 1.15)), t, g, rng.uniform(-0.2, 0.2))
        elif kind == 'key':
            s.place(bus, s.key_tick(rng, rng.uniform(0.85, 1.1)), t, g, rng.uniform(-0.1, 0.1))
        elif kind == 'click':
            s.place(bus, s.click(rng), t, g)
        elif kind == 'impact':
            s.place(bus, s.impact(rng), t, g)
        elif kind == 'whoosh':
            w = s.whoosh(rng, up=c.get('up', True))
            sweep = np.linspace(-0.6, 0.6, len(w))
            st = np.stack([w * np.cos((sweep + 1) * np.pi / 4), w * np.sin((sweep + 1) * np.pi / 4)], 1)
            s.place(bus, st, t - 0.42 * 0.55, g)  # peak lands on the cue
        elif kind == 'star':
            s.place(bus, s.star(STAR_NOTES[c.get('pitch', stars % 5)]), t, g, -0.3 + 0.15 * (stars % 5))
            stars += 1
        elif kind == 'sparkle':
            s.place(bus, s.sparkle(rng), t, g, 0.2)
        else:
            raise ValueError(f'unknown sfx {kind!r}')
    irs = s.reverb_ir(rng, rt60=1.4, dur=1.8)
    return s.reverb(bus, irs, 0.12)


def music_envelope(cfg, n):
    t = s.t_of(n)
    g = np.ones(n)
    a, b = cfg['silence']
    g *= 1 - np.interp(t, [a - 0.005, a, b - 0.005, b], [0, 1, 1, 0])
    f0, f1 = cfg['fade']
    g *= np.interp(t, [f0, f1], [1, 0])
    return g


def duck(cues, n):
    t = s.t_of(n)
    g = np.ones(n)
    for c in cues:
        if c['sfx'] == 'impact':
            h = c['frame'] / FPS
            g *= 1 - 0.5 * np.interp(t, [h - 0.067, h, h + 0.267, h + 0.467], [0, 1, 1, 0])
    return g


def true_peak(x):
    return np.max(np.abs(signal.resample_poly(x, 4, 1, axis=0)))


def limit(x, ceiling_db=-1.5):
    """Stereo-linked look-ahead limiter on the 4x oversampled peak."""
    thr = 10 ** (ceiling_db / 20)
    up = np.max(np.abs(signal.resample_poly(x, 4, 1, axis=0)), axis=1)
    need = np.minimum(1, thr / np.maximum(up, 1e-9))
    need = need.reshape(-1, 4).min(axis=1)[: len(x)]
    look = s.n_of(0.0015)
    need = np.minimum.reduce([np.roll(need, -k) for k in range(look)])
    rel = np.exp(-1 / s.n_of(0.08))
    g = np.empty_like(need)
    cur = 1.0
    for i, v in enumerate(need):
        cur = v if v < cur else v + (cur - v) * rel
        g[i] = cur
    return x * g[:, None]


def master(mix, target=-14.0):
    meter = pyln.Meter(SR)
    gain = 10 ** ((target - meter.integrated_loudness(mix)) / 20)
    for _ in range(3):
        mix = limit(mix * 10 ** ((target - meter.integrated_loudness(mix)) / 20))
    return mix, gain, meter.integrated_loudness(mix), 20 * np.log10(true_peak(mix))


def write_wav(path, x):
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


def ffmpeg(*args):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *args], check=True)


def build(key, dry=None):
    cfg = TARGETS[key]
    rng = np.random.default_rng(20261008)
    cues = json.loads((ROOT / cfg['cues']).read_text())
    n = s.n_of(cfg['duration'])
    music = render_music(cfg, rng) * 0.42 * (music_envelope(cfg, n) * duck(cues, n))[:, None]
    sfx = render_sfx(cues, n, rng)
    mix = s.filt(music + sfx, 'highpass', 30, 4)
    mix = mix + 0.25 * s.filt(mix, 'bandpass', [2000, 6000], 2)  # presence for small speakers
    mix, gain, lufs, tp = master(mix)
    print(f'[{key}] {lufs:.1f} LUFS, {tp:.1f} dBTP, {cfg["duration"]} s')
    if dry:
        Path(dry).mkdir(parents=True, exist_ok=True)
        for stem, x in (('mix', mix), ('music', music * gain), ('sfx', sfx * gain)):
            write_wav(Path(dry) / f'{cfg["name"]}_{stem}.wav', x)
        return mix, music, sfx, cues

    out_dir = ROOT / Path(cfg['videos'][0]).parent / 'audio'
    out_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        write_wav(tmp / 'mix.wav', mix)
        for stem, x in (('music', music), ('sfx', sfx)):
            y = x * gain
            y = y * min(1, 10 ** (-1.5 / 20) / max(np.max(np.abs(y)), 1e-9))
            write_wav(tmp / f'{stem}.wav', y)
            ffmpeg('-i', str(tmp / f'{stem}.wav'), '-c:a', 'aac', '-b:a', '192k', str(out_dir / f'{cfg["name"]}_{stem}.m4a'))
        ffmpeg('-i', str(tmp / 'mix.wav'), '-c:a', 'aac', '-b:a', '192k', str(out_dir / f'{cfg["name"]}_mix.m4a'))
        for video in cfg['videos']:
            src = ROOT / video
            dst = src.with_suffix('.tmp.mp4')
            ffmpeg('-i', str(src), '-i', str(tmp / 'mix.wav'), '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
                   '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', str(dst))
            dst.replace(src)
            print(f'  muxed {video}')
    return mix, music, sfx, cues


if __name__ == '__main__':
    args = sys.argv[1:]
    dry = None
    if '--dry' in args:
        dry = args[args.index('--dry') + 1]
        args = [a for a in args if a not in ('--dry', dry)]
    keys = list(TARGETS) if args == ['all'] else args
    if not keys or any(k not in TARGETS for k in keys):
        sys.exit(f'usage: design.py {"|".join(TARGETS)}|all [--dry <dir>]')
    for k in keys:
        build(k, dry)
