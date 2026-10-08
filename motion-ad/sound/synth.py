"""Instruments and sound effects, synthesised from scratch (no samples, no licences).

Everything is mono float64 at 48 kHz unless noted; stereo buffers are (n, 2).
"""
import numpy as np
from scipy import signal

SR = 48000


def n_of(sec):
    return int(round(sec * SR))


def t_of(n):
    return np.arange(n) / SR


def norm(x, peak=1.0):
    m = np.max(np.abs(x))
    return x * (peak / m) if m > 0 else x


def filt(x, kind, freq, order=2):
    sos = signal.butter(order, freq, btype=kind, fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def noise(n, rng):
    return rng.uniform(-1.0, 1.0, n)


def saw(freq, n, harmonics, rng, detune_cents=0.0):
    """Band-limited saw by additive synthesis, random start phase."""
    f = freq * 2 ** (detune_cents / 1200)
    t = t_of(n)
    k_max = int(min(harmonics, (SR * 0.45) // f))
    ph = rng.uniform(0, 2 * np.pi)
    x = np.zeros(n)
    for k in range(1, k_max + 1):
        x += np.sin(2 * np.pi * k * f * t + k * ph) / k
    return x * (2 / np.pi)


def chirp_phase(freq_curve):
    return 2 * np.pi * np.cumsum(freq_curve) / SR


def pan(x, p):
    """Equal-power pan, p in [-1, 1] -> (n, 2)."""
    a = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], 1)


def place(bus, sample, t0, gain=1.0, p=0.0):
    """Mix a mono or stereo sample into a stereo bus at time t0."""
    s = sample if sample.ndim == 2 else pan(sample, p)
    i = n_of(t0)
    if i >= len(bus) or i + len(s) <= 0:
        return
    a, b = max(i, 0), min(len(bus), i + len(s))
    bus[a:b] += s[a - i:b - i] * gain


# ---------------------------------------------------------------- music voices

def kick(rng):
    n = n_of(0.5)
    t = t_of(n)
    f = 52 + 140 * np.exp(-t * 26)
    body = np.sin(chirp_phase(f)) * np.exp(-t * 9)
    knock = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 32) * 0.35  # audible on phone speakers
    click = filt(noise(n, rng), 'highpass', 2500) * np.exp(-t * 450) * 0.5
    return norm(filt(np.tanh(2.4 * (0.85 * body + knock + click)), 'highpass', 35, 4))


def clap(rng):
    n = n_of(0.4)
    t = t_of(n)
    nz = filt(noise(n, rng), 'bandpass', [900, 3400])
    env = np.zeros(n)
    for k, off in enumerate([0.0, 0.008, 0.017, 0.026]):
        i = n_of(off)
        env[i:] += np.exp(-t[: n - i] * (190 if k < 3 else 20)) * (0.75 if k < 3 else 1.0)
    body = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 32) * 0.35
    return norm(nz * env + body)


def hat(rng, open_=False):
    n = n_of(0.32 if open_ else 0.07)
    t = t_of(n)
    nz = filt(noise(n, rng), 'highpass', 7200, 4)
    metal = sum(np.sign(np.sin(2 * np.pi * f * t)) for f in (5410, 6830, 8120)) * 0.12
    x = (nz + filt(metal, 'highpass', 6000)) * np.exp(-t * (11 if open_ else 75))
    return norm(x)


def bass_note(freq, dur, rng):
    n = n_of(dur)
    t = t_of(n)
    env = np.minimum(1, t / 0.004) * np.exp(-t * 4.5)
    sub = np.tanh(2.2 * (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t))) * 0.6
    # an octave-up saw so phone speakers still hear the line
    mid = filt(saw(2 * freq, n, 14, rng), 'lowpass', 900) * 0.8
    return filt((sub + mid) * env, 'highpass', 38, 2)


def pad_chord(freqs, dur, cutoff, rng):
    n = n_of(dur)
    t = t_of(n)
    left, right = np.zeros(n), np.zeros(n)
    for f in freqs:
        left += saw(f, n, 24, rng, -9) + 0.7 * saw(f, n, 24, rng, 0)
        right += saw(f, n, 24, rng, 9) + 0.7 * saw(f, n, 24, rng, 0)
    env = np.minimum(1, t / 0.35) * np.minimum(1, (dur - t) / 0.4)
    st = np.stack([filt(left, 'lowpass', cutoff), filt(right, 'lowpass', cutoff)], 1)
    return st * env[:, None] / (len(freqs) * 1.7)


def pluck(freq, cutoff, rng):
    n = n_of(0.45)
    t = t_of(n)
    x = 0.6 * saw(freq, n, 16, rng) + 0.4 * np.sin(2 * np.pi * freq * t)
    env = np.minimum(1, t / 0.002) * np.exp(-t * 15)
    return filt(x * env, 'lowpass', cutoff)


def pingpong(bus, delay=0.375, feedback=0.33, mix=0.3, taps=5):
    """Stereo ping-pong echo of a stereo bus."""
    out = bus.copy()
    mono = bus.mean(axis=1)
    d = n_of(delay)
    for k in range(1, taps + 1):
        g = mix * feedback ** (k - 1)
        side = 0 if k % 2 else 1
        if d * k < len(bus):
            out[d * k:, side] += mono[: len(bus) - d * k] * g
    return out


def reverb_ir(rng, rt60=1.9, dur=2.4):
    n = n_of(dur)
    t = t_of(n)
    decay = np.exp(-6.91 * t / rt60)
    pre = n_of(0.018)
    irs = []
    for _ in range(2):
        ir = np.zeros(n)
        ir[pre:] = noise(n - pre, rng) * decay[: n - pre]
        ir = filt(filt(ir, 'lowpass', 5500), 'highpass', 220)
        irs.append(ir / np.sqrt(np.sum(ir ** 2)))
    return irs


def reverb(bus, irs, wet):
    n = len(bus)
    out = bus.copy()
    for ch in range(2):
        out[:, ch] += signal.fftconvolve(bus.mean(axis=1), irs[ch])[:n] * wet
    return out


def swept_noise(dur, f0, f1, width, rng, nperseg=1024):
    """Noise through a band-pass whose centre sweeps f0 -> f1 (log scale)."""
    n = n_of(dur)
    f, tt, z = signal.stft(noise(n, rng), fs=SR, nperseg=nperseg)
    centre = f0 * (f1 / f0) ** np.clip(tt / dur, 0, 1)
    mask = np.exp(-0.5 * ((np.log(f[:, None] + 20) - np.log(centre[None, :])) / width) ** 2)
    _, y = signal.istft(z * mask, fs=SR, nperseg=nperseg)
    y = np.pad(y, (0, max(0, n - len(y))))[:n]
    return norm(y)


def riser(dur, rng):
    n = n_of(dur)
    t = t_of(n)
    amp = (t / dur) ** 2.2
    air = swept_noise(dur, 250, 7000, 0.45, rng, 2048)
    tone = np.sin(chirp_phase(110 * 8 ** (t / dur))) * 0.18
    return norm((air + tone) * amp)


# ---------------------------------------------------------------- sound effects

def impact(rng):
    n = n_of(1.7)
    t = t_of(n)
    boom = np.tanh(2.6 * np.sin(chirp_phase(42 + 80 * np.exp(-t * 9))) * np.exp(-t * 3.2))
    boom = filt(boom, 'highpass', 32, 4)
    thud = filt(noise(n, rng), 'bandpass', [140, 800]) * np.exp(-t * 12) * 1.15
    crack = filt(noise(n, rng), 'highpass', 1500) * np.exp(-t * 85) * 0.75
    return norm(boom + thud + crack)


def pop(rng, pitch=1.0):
    n = n_of(0.15)
    t = t_of(n)
    x = np.sin(chirp_phase((380 + 820 * np.exp(-t * 55)) * pitch)) * np.exp(-t * 36)
    click = filt(noise(n, rng), 'highpass', 3000) * np.exp(-t * 650) * 0.22
    return norm(x + click)


def tick(rng, pitch=1.0):
    n = n_of(0.05)
    t = t_of(n)
    ping = np.sin(2 * np.pi * 2600 * pitch * t) * np.exp(-t * 170) * 0.6
    nz = filt(noise(n, rng), 'bandpass', [2500, 7000]) * np.exp(-t * 420)
    return norm(ping + nz)


def key_tick(rng, pitch=1.0):
    """Typing: drier, lower than the UI tick."""
    n = n_of(0.05)
    t = t_of(n)
    thock = np.sin(2 * np.pi * 900 * pitch * t) * np.exp(-t * 140) * 0.5
    nz = filt(noise(n, rng), 'bandpass', [1800, 6000]) * np.exp(-t * 520)
    return norm(thock + nz)


def click(rng):
    n = n_of(0.1)
    t = t_of(n)
    hi = filt(noise(n, rng), 'highpass', 3500) * np.exp(-t * 520)
    lo = np.sin(2 * np.pi * 170 * t) * np.exp(-t * 55)
    second = np.roll(hi, n_of(0.018)) * 0.45
    return norm(0.7 * hi + 0.6 * lo + second)


def whoosh(rng, dur=0.42, up=True):
    t = t_of(n_of(dur))
    f0, f1 = (450, 3800) if up else (3800, 450)
    return norm(swept_noise(dur, f0, f1, 0.5, rng) * np.sin(np.pi * t / dur) ** 2)


def star(freq):
    n = n_of(0.4)
    t = t_of(n)
    x = (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * 2.76 * freq * t)) * np.exp(-t * 13)
    return norm(x * np.minimum(1, t / 0.002))


def sparkle(rng):
    n = n_of(0.6)
    out = np.zeros(n)
    for k, f in enumerate([2093, 2637, 3136, 4186]):  # C7 E7 G7 C8
        s = star(f)
        i = n_of(0.03 * k)
        m = min(n - i, len(s))
        out[i:i + m] += s[:m] * (0.9 - 0.12 * k)
    shimmer = filt(noise(n, rng), 'highpass', 6000) * np.exp(-t_of(n) * 9) * 0.25
    return norm(out + shimmer)
