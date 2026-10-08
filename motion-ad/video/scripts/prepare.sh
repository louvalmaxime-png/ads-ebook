#!/usr/bin/env bash
# Syncs motion-ad/covers and motion-ad/audio into public/ (Remotion only serves public/).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf public/covers public/audio
cp -r ../covers public/covers
if [ -d ../audio ]; then cp -r ../audio public/audio; fi
