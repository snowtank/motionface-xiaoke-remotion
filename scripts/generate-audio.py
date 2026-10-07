#!/usr/bin/env python3
"""Create original, deterministic editor foley using only the Python stdlib.

No reference audio is read. The default output is a 30-second stereo PCM WAV.
Run from any directory: python3 scripts/generate-audio.py [--output path.wav]
"""

from __future__ import annotations

import argparse
from array import array
import math
from pathlib import Path
import random
import struct
import sys
import wave


SAMPLE_RATE = 48_000
DURATION = 30.0
FRAME_COUNT = int(SAMPLE_RATE * DURATION)
TAU = math.tau
RNG = random.Random(5418)


def build_audio() -> tuple[array, array]:
    left = array("f", [0.0]) * FRAME_COUNT
    right = array("f", [0.0]) * FRAME_COUNT

    def mix(at: float, samples: list[float], gain: float, pan: float = 0.0) -> None:
        offset = round(at * SAMPLE_RATE)
        pan = max(-1.0, min(1.0, pan))
        lg = math.sqrt((1.0 - pan) / 2.0) * gain
        rg = math.sqrt((1.0 + pan) / 2.0) * gain
        for i, value in enumerate(samples):
            frame = offset + i
            if 0 <= frame < FRAME_COUNT:
                left[frame] += value * lg
                right[frame] += value * rg

    def pluck(at: float, hz: float, gain: float = 0.12,
              length: float = 0.23, pan: float = 0.0) -> None:
        samples = []
        for i in range(round(length * SAMPLE_RATE)):
            t = i / SAMPLE_RATE
            env = min(1.0, t / 0.002) * math.exp(-t * 16.0) * max(0.0, 1.0 - t / length)
            tone = (math.sin(TAU * hz * t)
                    + 0.28 * math.sin(TAU * hz * 2.01 * t) * math.exp(-t * 14.0)
                    + 0.11 * math.sin(TAU * hz * 3.98 * t) * math.exp(-t * 25.0))
            samples.append(tone * env)
        mix(at, samples, gain, pan)

    def click(at: float, gain: float = 0.10, pan: float = 0.0,
              low: bool = False) -> None:
        length = 0.045 if low else 0.025
        base = 480 if low else 1550
        samples = []
        for i in range(round(length * SAMPLE_RATE)):
            t = i / SAMPLE_RATE
            body = math.sin(TAU * base * t) * math.exp(-t * 160)
            noise = RNG.uniform(-1, 1) * math.exp(-t * 290)
            samples.append((body * 0.62 + noise * 0.38) * min(1.0, t / 0.0005))
        mix(at, samples, gain, pan)

    def paper(at: float, length: float = 0.28, gain: float = 0.06,
              pan: float = 0.0, rising: bool = True) -> None:
        samples = []
        smoothed = 0.0
        last = 0.0
        phase = 0.0
        for i in range(round(length * SAMPLE_RATE)):
            t = i / SAMPLE_RATE
            p = t / length
            smoothed = smoothed * 0.87 + RNG.uniform(-1, 1) * 0.13
            scratch = (smoothed - last) * 3.0
            last = smoothed
            phase += TAU * (250 + (p if rising else 1.0 - p) * 650) / SAMPLE_RATE
            envelope = math.sin(math.pi * p) ** 1.5
            samples.append(envelope * (scratch + 0.05 * math.sin(phase)))
        mix(at, samples, gain, pan)

    def snip(at: float, gain: float = 0.16, pan: float = 0.0) -> None:
        click(at, gain * 0.9, pan, low=True)
        paper(at + 0.012, 0.11, gain * 0.9, pan)
        click(at + 0.075, gain * 0.65, pan + 0.1)

    def kick(at: float, gain: float = 0.042) -> None:
        samples = []
        for i in range(round(0.16 * SAMPLE_RATE)):
            t = i / SAMPLE_RATE
            phase = TAU * (56 * t + 0.85 * (1 - math.exp(-t * 32)))
            samples.append(math.sin(phase) * math.exp(-t * 28) * min(1.0, t / 0.003))
        mix(at, samples, gain)

    # Almost subliminal rhythm under the more legible editor gestures.
    for beat in range(48):
        at = 2.0 + beat * 0.5
        kick(at, 0.026 if beat % 4 else 0.037)
        if beat % 2:
            paper(at + 0.25, 0.035, 0.012, 0.2)
        if beat % 8 == 0:
            pluck(at, (196.0, 246.94, 220.0)[(beat // 8) % 3], 0.024, 0.4, -0.1)

    # Tiny typing introduction and an opening, two-note "ready" gesture.
    for at in (0.13, 0.23, 0.31, 0.46, 0.56, 0.68, 0.80):
        click(at, 0.037, RNG.uniform(-0.2, 0.2))
    paper(1.02, 0.54, 0.10, -0.3)
    pluck(1.42, 523.25, 0.10, 0.24, -0.15)
    pluck(1.59, 783.99, 0.08, 0.34, 0.15)
    pluck(2.05, 392.0, 0.15, 0.23, -0.15)
    pluck(2.23, 587.33, 0.14, 0.3, 0.12)

    # Material cards: paper drag, gentle landing, and snap to the track.
    for at, pan in ((3.04, -0.5), (3.56, -0.25), (4.10, 0.05), (4.67, 0.35)):
        paper(at, 0.24, 0.16, pan)
        click(at + 0.25, 0.12, pan, low=True)
        pluck(at + 0.255, 440 + 120 * (pan + 0.5), 0.043, 0.15, pan)

    # Cutting and discarding: two snips followed by a falling wooden note.
    for at, pan in ((6.14, -0.35), (6.64, -0.1), (7.13, 0.18)):
        snip(at, 0.16, pan)
    paper(7.62, 0.24, 0.16, 0.25, rising=False)
    pluck(7.86, 220.0, 0.13, 0.13, 0.25)
    click(8.26, 0.11, -0.18, low=True)
    paper(8.53, 0.3, 0.13, -0.4)
    click(8.85, 0.10, -0.1)

    # Transition cards and small effect confirmation bells.
    for at, hz, pan in ((9.72, 659.25, -0.35), (10.52, 783.99, 0.0), (11.38, 987.77, 0.3)):
        click(at, 0.11, -0.4)
        paper(at + 0.10, 0.23, 0.10, pan)
        pluck(at + 0.33, hz, 0.08, 0.34, pan)

    # Caption typing; a descending pair makes the undo action audible.
    click(12.75, 0.10, -0.4)
    for i, at in enumerate((13.04, 13.21, 13.37, 13.53, 13.70)):
        click(at, 0.062, -0.14 + i * 0.07)
    click(14.70, 0.14, 0.0, low=True)
    pluck(14.78, 659.25, 0.095, 0.19, 0.1)
    pluck(14.93, 440.0, 0.095, 0.24, -0.1)
    pluck(15.61, 523.25, 0.08, 0.26, -0.1)
    pluck(15.76, 659.25, 0.08, 0.3, 0.1)

    # Slider drags: soft foley avoids overpowering the deliberate visual gag.
    for at, rising in ((16.78, True), (17.41, True), (18.36, False), (19.22, False)):
        click(at, 0.08, 0.5)
        paper(at + 0.025, 0.46, 0.15, 0.5, rising=rising)
        click(at + 0.5, 0.075, 0.5, low=True)
    for at, hz in ((17.64, 523.25), (17.73, 659.25), (17.82, 783.99)):
        pluck(at, hz, 0.05, 0.16, 0.35)
    pluck(19.72, 587.33, 0.075, 0.28, 0.25)

    # Beat markers are quiet and evenly spaced; the music remains a backdrop.
    click(21.92, 0.15, 0.55, low=True)
    paper(21.99, 0.25, 0.12, 0.4)
    for i in range(10):
        at = 22.25 + i * 0.19
        click(at, 0.045, -0.4 + i * 0.08)
        if i % 2 == 0:
            pluck(at, (392.0, 493.88, 587.33)[(i // 2) % 3], 0.052, 0.16)

    # Export click, modest progress ticks, and a resolved completion chord.
    paper(24.57, 0.35, 0.13, 0.55)
    click(24.96, 0.16, 0.6, low=True)
    for i in range(8):
        pluck(25.17 + i * 0.18, 392 + i * 22, 0.031, 0.10, 0.45)
    for at, hz in ((26.64, 523.25), (26.77, 659.25), (26.90, 783.99)):
        pluck(at, hz, 0.085, 0.48, (hz - 659) / 1100)
    paper(27.31, 0.48, 0.14, -0.45)
    for at in (27.82, 28.04, 28.24, 28.44):
        click(at, 0.035, -0.4)
    for i, hz in enumerate((523.25, 659.25, 783.99, 1046.50)):
        pluck(29.02 + i * 0.075, hz, 0.105, 0.58, -0.25 + i / 6)
    paper(29.12, 0.5, 0.075, 0.25)
    return left, right


def write_wav(output: Path, left: array, right: array) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    peak = max(max(abs(v) for v in left), max(abs(v) for v in right), 0.001)
    # Keep healthy headroom for Remotion mixing and gentle playback volume.
    gain = min(1.5, 0.46 / peak)
    samples = array("h")
    fade_in = int(0.025 * SAMPLE_RATE)
    fade_out = int(0.45 * SAMPLE_RATE)
    for i, (lvalue, rvalue) in enumerate(zip(left, right)):
        fade = min(1.0, i / fade_in, (FRAME_COUNT - 1 - i) / fade_out)
        samples.append(round(max(-1.0, min(1.0, lvalue * gain * fade)) * 32767))
        samples.append(round(max(-1.0, min(1.0, rvalue * gain * fade)) * 32767))
    if sys.byteorder != "little":
        samples.byteswap()
    with wave.open(str(output), "wb") as handle:
        handle.setnchannels(2)
        handle.setsampwidth(struct.calcsize("<h"))
        handle.setframerate(SAMPLE_RATE)
        handle.writeframes(samples.tobytes())
    print(f"Generated {output.name}: {DURATION:.1f}s, {SAMPLE_RATE} Hz, stereo, 16-bit PCM")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    project_root = Path(__file__).resolve().parent.parent
    parser.add_argument("--output", type=Path,
                        default=project_root / "public/audio/editor-foley.wav")
    args = parser.parse_args()
    write_wav(args.output, *build_audio())


if __name__ == "__main__":
    main()
