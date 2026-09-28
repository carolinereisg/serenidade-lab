import numpy as np, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
rng = np.random.default_rng(7)
FS = 4  # amostras/s
ROXO, LAR, GRID, GRID2 = "#2D0A4E", "#F5630A", "#E6DAF4", "#CDB8E6"

def ruido(n, sigma_s, amp):
    x = rng.standard_normal(n + 400)
    k = np.exp(-0.5 * (np.arange(-60, 61) / (sigma_s * FS)) ** 2); k /= k.sum()
    y = np.convolve(x, k, mode="same")[200:200 + n]
    return y / y.std() * amp

def bump(t, c, w, h):  # aceleração/desaceleração suave
    return h * np.exp(-0.5 * ((t - c) / w) ** 2)

def papel(ax, tmax, ymin, ymax, step=10):
    ax.set_xlim(0, tmax); ax.set_ylim(ymin, ymax)
    for y in range(ymin, ymax + 1, step):
        ax.axhline(y, color=GRID2 if y % 30 == 0 else GRID, lw=0.8 if y % 30 == 0 else 0.5, zorder=0)
    for x in range(0, int(tmax) + 1, 20):
        ax.axvline(x, color=GRID2 if x % 60 == 0 else GRID, lw=0.8 if x % 60 == 0 else 0.4, zorder=0)
    ax.set_xticks(range(0, int(tmax) + 1, 120)); ax.set_xticklabels([f"{m//60}" for m in range(0, int(tmax) + 1, 120)])
    ax.tick_params(colors="#8B5CC8", labelsize=8, length=0)
    for s in ax.spines.values(): s.set_visible(False)

def salvar(nome, t, fhr, toco=None, notas=(), ylim=(80, 200)):
    if toco is None:
        fig, ax = plt.subplots(figsize=(10, 3.4), dpi=200)
        axes = [ax]
    else:
        fig, (ax, ax2) = plt.subplots(2, 1, figsize=(10, 4.6), dpi=200, gridspec_kw={"height_ratios": [2.3, 1], "hspace": 0.12})
        axes = [ax, ax2]
    papel(ax, t[-1], *ylim)
    ax.set_yticks(range(90, ylim[1] + 1, 30))
    ax.plot(t, fhr, color=ROXO, lw=1.1)
    ax.set_ylabel("FCF (bpm)", color="#8B5CC8", fontsize=8)
    for (x, y, txt) in notas:
        ax.annotate(txt, (x, y), color=LAR, fontsize=8.5, fontweight="bold", ha="center")
    if toco is not None:
        papel(ax2, t[-1], 0, 100, 25); ax2.set_yticks([0, 50, 100])
        ax2.plot(t, toco, color=LAR, lw=1.1)
        ax2.set_ylabel("TOCO", color="#8B5CC8", fontsize=8)
    axes[-1].set_xlabel("minutos  ·  traçado ilustrativo (simulado para fins didáticos)", color="#8B5CC8", fontsize=8)
    fig.savefig(f"tracados/{nome}.png", bbox_inches="tight", facecolor="white"); plt.close(fig)

# 1 sinusoidal verdadeiro (10 min)
t = np.arange(0, 600, 1 / FS)
fhr = 145 + 5.5 * np.sin(2 * np.pi * t / 16) + ruido(len(t), 1.0, 0.4)
salvar("ctg_sinusoidal", t, fhr, notas=[(300, 172, "onda regular e suave · ~3–5 ciclos/min · sem acelerações")])

# 2 sinusoidal atípico (20 min): persistente, amplitude irregular, picos pontiagudos
per = 16 + ruido(len(t), 20, 1.5)
fase = np.cumsum(2 * np.pi / per / FS)
amp = 8 + ruido(len(t), 25, 3.5)
onda = np.sign(np.sin(fase)) * np.abs(np.sin(fase)) ** 0.6
fhr = 150 + amp * onda + ruido(len(t), 0.6, 1.2)
salvar("ctg_sinusoidal_atipico", t, fhr, notas=[(300, 182, "persistente · amplitude irregular · sem acelerações · sem segmentos normais")])

# 3 pseudossinusoidal (14 min): normal antes e depois
t = np.arange(0, 840, 1 / FS)
fhr = 135 + ruido(len(t), 1.5, 4.5) + bump(t, 110, 15, 22) + bump(t, 250, 14, 20) + bump(t, 720, 15, 24)
m = (t > 330) & (t < 640)
serra = 2 * np.abs(((t / 17) % 1) - 0.5) * 2 - 1  # dente de serra/triangular
env = np.clip(np.minimum(t - 330, 640 - t) / 40, 0, 1)
fhr = np.where(m, (1 - env) * fhr + env * (136 + 7 * serra + ruido(len(t), 0.4, 0.8)), fhr)
salvar("ctg_pseudossinusoidal", t, fhr, notas=[(110, 170, "acel."), (485, 160, "trecho \"serrilhado\", curto"), (720, 172, "acel.")])

t = np.arange(0, 1200, 1 / FS)
# 4 desacelerações tardias rasas + variabilidade mínima (20 min, com toco)
fhr = 155 + ruido(len(t), 1.2, 1.3)
toco = 12 + ruido(len(t), 5, 1.2)
for c in np.arange(90, 1200, 180):
    toco += bump(t, c, 22, 55)
    fhr -= bump(t, c + 40, 28, 12)
salvar("ctg_tardias_rasas", t, fhr, toco, notas=[(630, 175, "nadir após o pico da contração · amplitude ~10–15 bpm · variabilidade ≤ 5 bpm")])

# 5 variabilidade reduzida persistente (20 min)
fhr = 142 + ruido(len(t), 1.5, 1.0) + ruido(len(t), 60, 1.0)
salvar("ctg_variabilidade_reduzida", t, fhr, notas=[(600, 170, "linha \"lisa\" · sem acelerações · sem desacelerações")])

# 6 FCF normal + taquissistolia / tônus elevado (DPP inicial)
fhr = 140 + ruido(len(t), 1.5, 4.0) + bump(t, 260, 15, 18) + bump(t, 800, 15, 16)
toco = 32 + ruido(len(t), 8, 2)
for c in np.arange(40, 1200, 85):
    toco += bump(t, c, 12, 22 + rng.uniform(-4, 4))
salvar("ctg_dpp_toco", t, fhr, toco, notas=[(600, 178, "FCF ainda tranquilizadora…")])

# 7 normal (referência)
fhr = 138 + ruido(len(t), 1.5, 4.5) + bump(t, 200, 15, 22) + bump(t, 620, 14, 20) + bump(t, 980, 16, 24)
salvar("ctg_normal", t, fhr)
print("ok")
