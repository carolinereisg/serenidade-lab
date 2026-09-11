#!/usr/bin/env bash
# Exporta os 20 slides em PNG 1080x1350 (4:5, formato vertical do Instagram).
# O Chromium headless reserva parte da altura da janela, entao renderizamos numa
# janela mais alta e recortamos os 1080x1350 do canto superior esquerdo.
set -euo pipefail

CHROME="${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"
AQUI="$(cd "$(dirname "$0")" && pwd)"
SAIDA="$AQUI/png"
BRUTO="$(mktemp -d)"
mkdir -p "$SAIDA"

for n in $(seq 1 20); do
  bruto=$(printf "%s/bruto-%02d.png" "$BRUTO" "$n")
  "$CHROME" \
    --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size=1080,1460 \
    --virtual-time-budget=8000 \
    --screenshot="$bruto" \
    "file://$AQUI/index.html?raw=1&slide=$n" >/dev/null 2>&1
done

python3 - "$BRUTO" "$SAIDA" <<'PY'
import sys, os
from PIL import Image
bruto, saida = sys.argv[1], sys.argv[2]
for n in range(1, 21):
    im = Image.open(os.path.join(bruto, f"bruto-{n:02d}.png")).convert("RGB")
    if im.size[1] < 1350 or im.size[0] < 1080:
        raise SystemExit(f"slide {n}: janela renderizada pequena demais ({im.size})")
    corte = im.crop((0, 0, 1080, 1350))
    # confere se sobrou faixa branca (conteudo cortado antes dos 1350px)
    px = corte.load()
    if all(px[x, 1349] == (255, 255, 255) for x in range(0, 1080, 40)):
        raise SystemExit(f"slide {n}: faixa branca no rodape — aumente --window-size")
    alvo = os.path.join(saida, f"slide-{n:02d}.png")
    corte.save(alvo, optimize=True)
    print(f"  ok  slide-{n:02d}.png  {corte.size[0]}x{corte.size[1]}")
PY

rm -rf "$BRUTO"
echo "PNGs em: $SAIDA"
