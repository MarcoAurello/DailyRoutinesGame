"""Recorta os sprites da Dona Joana (joana/sprites.jpg) e monta a folha de sprites do jogo.

Fundo branco vira transparente (preenchimento a partir das bordas de cada painel, então o
cabelo branco, contornado de escuro, não é apagado). Cada boneco vira um quadro do mesmo
tamanho, alinhado pelos pés. Linhas da folha: 0 dançando (8) · 1 triste (4) · 2 pensando (4).

Uso: python ferramentas/sprites.py   (gera personagens/joana/sprites.png e quadros de conferência)
"""
from collections import deque
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / 'joana' / 'sprites.jpg'
SAIDA = RAIZ / 'personagens' / 'joana' / 'sprites.png'

# miolo de cada painel (sem a moldura nem o título): x0, y0, x1, y1
PAINEIS = {
    'dancando': (34, 68, 1376, 330),
    'triste': (34, 438, 680, 732),
    'pensando': (738, 438, 1376, 732),
}
CLARO = 222      # pixel com todos os canais acima disso conta como fundo (branco do JPEG)
MIN_AREA = 2500
# o painel de cima foi desenhado menor: aumenta para ficar do mesmo tamanho dos outros
ESCALA = {'dancando': 1.14}  # componentes menores são enfeites (? e lâmpada) e grudam no boneco mais próximo


def recortar_painel(img, caixa):
    p = img.crop(caixa).convert('RGBA')
    w, h = p.size
    px = p.load()
    fundo = [[False] * w for _ in range(h)]
    fila = deque()
    claro = lambda x, y: min(px[x, y][:3]) > CLARO
    for x in range(w):
        for y in (0, h - 1):
            if claro(x, y): fila.append((x, y)); fundo[y][x] = True
    for y in range(h):
        for x in (0, w - 1):
            if claro(x, y) and not fundo[y][x]: fila.append((x, y)); fundo[y][x] = True
    while fila:
        x, y = fila.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not fundo[ny][nx] and claro(nx, ny):
                fundo[ny][nx] = True; fila.append((nx, ny))
    for y in range(h):
        for x in range(w):
            if fundo[y][x]: px[x, y] = (0, 0, 0, 0)
    # componentes opacos
    visto = [[False] * w for _ in range(h)]
    comps = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] and not visto[y][x]:
                fila = deque([(x, y)]); visto[y][x] = True
                xs, ys, n = [x, x], [y, y], 0
                while fila:
                    cx, cy = fila.popleft(); n += 1
                    xs[0] = min(xs[0], cx); xs[1] = max(xs[1], cx); ys[0] = min(ys[0], cy); ys[1] = max(ys[1], cy)
                    for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                        if 0 <= nx < w and 0 <= ny < h and not visto[ny][nx] and px[nx, ny][3]:
                            visto[ny][nx] = True; fila.append((nx, ny))
                comps.append({'n': n, 'caixa': [xs[0], ys[0], xs[1] + 1, ys[1] + 1]})
    grandes = sorted([c for c in comps if c['n'] >= MIN_AREA], key=lambda c: c['caixa'][0])
    for c in comps:
        if c['n'] < MIN_AREA and c['n'] > 30:   # ? e lâmpada: junta ao boneco mais próximo na horizontal
            cx = (c['caixa'][0] + c['caixa'][2]) / 2
            alvo = min(grandes, key=lambda g: abs((g['caixa'][0] + g['caixa'][2]) / 2 - cx))
            a, b = alvo['caixa'], c['caixa']
            alvo['caixa'] = [min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])]
    return p, [g['caixa'] for g in grandes]


def main():
    img = Image.open(ORIGEM).convert('RGB')
    linhas = {}
    for nome, caixa in PAINEIS.items():
        p, caixas = recortar_painel(img, caixa)
        e = ESCALA.get(nome, 1)
        linhas[nome] = [q.resize((round(q.width * e), round(q.height * e)), Image.LANCZOS) if e != 1 else q
                        for q in (p.crop(c) for c in caixas)]
        print(nome, len(caixas), [(c[2] - c[0], c[3] - c[1]) for c in caixas])
    QW = max(q.width for qs in linhas.values() for q in qs) + 8
    QH = max(q.height for qs in linhas.values() for q in qs) + 8
    colunas = max(len(qs) for qs in linhas.values())
    folha = Image.new('RGBA', (QW * colunas, QH * len(linhas)), (0, 0, 0, 0))
    for li, qs in enumerate(linhas.values()):
        for ci, q in enumerate(qs):
            folha.paste(q, (ci * QW + (QW - q.width) // 2, li * QH + QH - 4 - q.height), q)
    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    # 256 cores bastam para pixel art e deixam o arquivo ~4x menor (melhor para o celular)
    folha.quantize(256, method=Image.FASTOCTREE, dither=Image.NONE).save(SAIDA, optimize=True)
    print('quadro', QW, QH, 'folha', folha.size, '->', SAIDA)


if __name__ == '__main__':
    main()
