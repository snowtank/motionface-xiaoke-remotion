#!/usr/bin/env python3
"""Validate the final render with ffprobe and a complete ffmpeg decode.

Usage: python3 scripts/validate-render.py [out/xiaoke.mp4]
The JSON report defaults to docs/validation.json relative to this project.
Requires ffprobe and ffmpeg on PATH; uses no third-party Python packages.
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from fractions import Fraction
import json
from pathlib import Path
import shutil
import subprocess
import sys


PROJECT_ROOT = Path(__file__).resolve().parent.parent


def display_path(path: Path) -> str:
    """Keep reports portable and avoid publishing local absolute paths."""
    try:
        return path.resolve().relative_to(PROJECT_ROOT).as_posix()
    except ValueError:
        return path.name


def run_checked(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, capture_output=True, text=True, check=True)


def validate(media: Path) -> dict:
    report: dict = {
        "checked_at_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "media_file": display_path(media),
        "status": "failed",
        "expected": {
            "width": 1920,
            "height": 1080,
            "fps": 30,
            "video_frames": 900,
            "video_duration_seconds": 30,
            "audio_codec": "aac",
            "audio_sample_rate_hz": 48000,
            "audio_channels": 2,
        },
        "observed": {},
        "checks": {},
        "full_decode": False,
        "errors": [],
    }
    try:
        for tool in ("ffprobe", "ffmpeg"):
            if shutil.which(tool) is None:
                raise RuntimeError(f"Required command is missing from PATH: {tool}")
        if not media.is_file():
            raise RuntimeError(f"Render does not exist: {display_path(media)}")

        probe = run_checked([
            "ffprobe", "-v", "error", "-count_frames",
            "-show_entries",
            "stream=codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,"
            "nb_frames,nb_read_frames,duration,sample_rate,channels:format=duration,size",
            "-of", "json", str(media),
        ])
        data = json.loads(probe.stdout)
        video_streams = [s for s in data.get("streams", []) if s.get("codec_type") == "video"]
        audio_streams = [s for s in data.get("streams", []) if s.get("codec_type") == "audio"]
        report["checks"]["one_video_stream"] = len(video_streams) == 1
        report["checks"]["one_audio_stream"] = len(audio_streams) == 1
        if not video_streams or not audio_streams:
            raise RuntimeError("The render must contain both a video and an audio stream")

        video = video_streams[0]
        audio = audio_streams[0]
        duration = float(video.get("duration", 0))
        frames = int(video.get("nb_read_frames", video.get("nb_frames", 0)))
        fps = Fraction(video.get("avg_frame_rate", "0/1"))
        nominal_fps = Fraction(video.get("r_frame_rate", "0/1"))
        report["observed"] = {
            "video_codec": video.get("codec_name"),
            "width": video.get("width"),
            "height": video.get("height"),
            "fps": str(fps),
            "nominal_fps": str(nominal_fps),
            "video_frames": frames,
            "video_duration_seconds": duration,
            "audio_codec": audio.get("codec_name"),
            "audio_sample_rate_hz": int(audio.get("sample_rate", 0)),
            "audio_channels": audio.get("channels"),
            "audio_duration_seconds": float(audio.get("duration", 0)),
            "container_duration_seconds": float(data.get("format", {}).get("duration", 0)),
            "size_bytes": int(data.get("format", {}).get("size", 0)),
        }
        report["checks"].update({
            "resolution_1920x1080": video.get("width") == 1920 and video.get("height") == 1080,
            "frame_rate_30": fps == 30 and nominal_fps == 30,
            "video_frames_900": frames == 900,
            "video_duration_30_seconds": abs(duration - 30.0) <= 0.001,
            "audio_codec_aac": audio.get("codec_name") == "aac",
            "audio_sample_rate_48000": int(audio.get("sample_rate", 0)) == 48000,
            "audio_channels_stereo": audio.get("channels") == 2,
        })

        # -xerror makes a decoding error fail the command rather than continue.
        # Mapping both streams ensures audio is decoded as well as every frame.
        run_checked([
            "ffmpeg", "-v", "error", "-xerror", "-i", str(media),
            "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-",
        ])
        report["full_decode"] = True
        report["checks"]["full_audio_video_decode"] = True
        failed = [name for name, passed in report["checks"].items() if not passed]
        if failed:
            report["errors"].append("Failed checks: " + ", ".join(failed))
        else:
            report["status"] = "passed"
    except subprocess.CalledProcessError as error:
        # Do not copy command arguments or machine paths into a public report.
        tool = Path(error.cmd[0]).name
        report["errors"].append(f"{tool} failed with exit code {error.returncode}")
        print(f"{tool} failed; inspect the render locally for decoding issues.", file=sys.stderr)
    except (RuntimeError, ValueError, KeyError, ZeroDivisionError) as error:
        report["errors"].append(str(error))
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("media", nargs="?", type=Path, default=PROJECT_ROOT / "out/xiaoke.mp4")
    parser.add_argument("--report", type=Path, default=PROJECT_ROOT / "docs/validation.json")
    args = parser.parse_args()
    report = validate(args.media)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Render validation: {report['status']}; report: {display_path(args.report)}")
    for error in report["errors"]:
        print(error, file=sys.stderr)
    return 0 if report["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
