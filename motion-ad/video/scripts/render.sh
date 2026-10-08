#!/usr/bin/env bash
# Renders out/ad_916.mp4, out/ad_45.mp4, out/poster.png and out/cues.csv.
# Audio: drop music.mp3 and sfx/{pop,tick,click,impact}.mp3 into motion-ad/audio/
# before running; without them the videos are silent.
# Optional: REMOTION_BROWSER=/path/to/chrome-headless-shell
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=../out
mkdir -p "$OUT"

./scripts/prepare.sh

BROWSER=()
if [ -n "${REMOTION_BROWSER:-}" ]; then BROWSER=(--browser-executable "$REMOTION_BROWSER"); fi

for comp in Ad916 Ad45; do
  file="$OUT/ad_${comp#Ad}.mp4"
  npx remotion render src/index.ts "$comp" "$file" --concurrency=4 ${BROWSER[@]+"${BROWSER[@]}"}
  if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$file" | grep -q .; then
    ffmpeg -y -v error -i "$file" -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac -b:a 192k "$file.tmp.mp4"
    mv "$file.tmp.mp4" "$file"
  fi
done

# Sound design (synthesised score + SFX) unless you supplied your own audio/
if [ ! -d ../audio ]; then
  if python3 -c "import numpy, scipy, pyloudnorm" 2>/dev/null; then
    python3 ../sound/design.py ad
  else
    echo "Sound: pip install -r ../sound/requirements.txt, then python3 ../sound/design.py ad"
  fi
fi

npx remotion still src/index.ts Ad916 "$OUT/poster.png" --frame=0 ${BROWSER[@]+"${BROWSER[@]}"}
node scripts/cues-csv.mjs > "$OUT/cues.csv"
echo "Done: $OUT"
