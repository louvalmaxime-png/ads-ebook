#!/usr/bin/env bash
# Renders the carousel-A Reel (9:16) into carousel/video/: MP4, cover image, cue sheet.
# Audio: same rule as render.sh (motion-ad/audio/ when present, silent otherwise).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=../../carousel/video
mkdir -p "$OUT"
./scripts/prepare.sh

BROWSER=()
if [ -n "${REMOTION_BROWSER:-}" ]; then BROWSER=(--browser-executable "$REMOTION_BROWSER"); fi

file="$OUT/reel_A_9x16.mp4"
npx remotion render src/index.ts ReelA "$file" --concurrency=4 ${BROWSER[@]+"${BROWSER[@]}"}
if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$file" | grep -q .; then
  ffmpeg -y -v error -i "$file" -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac -b:a 192k "$file.tmp.mp4"
  mv "$file.tmp.mp4" "$file"
fi
# Sound design (synthesised score + SFX) unless you supplied your own audio/
if [ ! -d ../audio ]; then
  if python3 -c "import numpy, scipy, pyloudnorm" 2>/dev/null; then
    python3 ../sound/design.py reel
  else
    echo "Sound: pip install -r ../sound/requirements.txt, then python3 ../sound/design.py reel"
  fi
fi

npx remotion still src/index.ts ReelA "$OUT/reel_A_cover.png" --frame=75 ${BROWSER[@]+"${BROWSER[@]}"}
node scripts/cues-csv.mjs src/reel/cues.json > "$OUT/reel_A_cues.csv"
echo "Done: $OUT"
