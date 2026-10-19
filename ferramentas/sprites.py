"""Recorta os sprites de um personagem e monta a folha de sprites do jogo.

O fundo liso de cada painel (branco ou cinza) vira transparente: o preenchimento começa nas
bordas do painel, então partes claras do boneco contornadas de escuro (cabelo branco) não são
apagadas. Cada boneco vira um quadro do mesmo tamanho, alinhado pelos pés.
Enfeites pequenos (?, lâmpada, coração) grudam no boneco mais próximo.

Uso: python ferramentas/sprites.py joana    (ou jack; sem nome, gera todos)
O quadro (largura x altura) impresso no fim vai em 'proporcao' no dados.js.
"""
import sys
from collections import deque
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
MIN_AREA = 2500   # componentes menores que isso são enfeites, não bonecos

# paineis: miolo de cada painel (sem moldura nem título) x0, y0, x1, y1, na ordem das linhas da folha
# fundo: 'branco' (todos os canais acima de 222) ou uma cor RGB com tolerância
PERSONAGENS = {
    # linhas: 0 dançando (8) · 1 triste (4) · 2 pensando (4)
    'joana': {
        'origem': 'joana/sprites.jpg',
        'paineis': {'dancando': (34, 68, 1376, 330), 'triste': (34, 438, 680, 732), 'pensando': (738, 438, 1376, 732)},
        'fundo': 'branco',
        'escala': {'dancando': 1.14},   # o painel de cima foi desenhado menor
    },
    # linhas: 0 comemorando (8) · 1 pensando (8) · 2 triste (5). As cabeças (canto de baixo) não são usadas.
    'jack': {
        'origem': 'policialjack/spritesjack.jpg',
        'paineis': {'comemorando': (2, 36, 1321, 264), 'pensando': (2, 300, 1321, 524), 'triste': (2, 560, 841, 773)},
        'fundo': ((213, 220, 226), 45),
        'escala': {},
        'buracos': True,   # o fundo cinza também aparece entre braço e corpo: apaga esses buracos
    },
}


def eh_fundo_func(px, fundo):
    if fundo == 'branco':
        return lambda x, y: min(px[x, y][:3]) > 222
    cor, tol = fundo
    return lambda x, y: sum(abs(a - b) for a, b in zip(px[x, y][:3], cor)) < tol


def recortar_painel(img, caixa, fundo_cfg, buracos=False):
    p = img.crop(caixa).convert('RGBA')
    w, h = p.size
    px = p.load()
    eh_fundo = eh_fundo_func(px, fundo_cfg)
    fundo = [[False] * w for _ in range(h)]
    fila = deque()
    borda = [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]
    for x, y in borda:
        if not fundo[y][x] and eh_fundo(x, y): fundo[y][x] = True; fila.append((x, y))
    while fila:
        x, y = fila.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not fundo[ny][nx] and eh_fundo(nx, ny):
                fundo[ny][nx] = True; fila.append((nx, ny))
    if buracos:
        # bolsões fechados com a cor do fundo (entre braço e corpo, entre as pernas)
        for y in range(h):
            for x in range(w):
                if fundo[y][x] or not eh_fundo(x, y): continue
                bolsao, fila = [(x, y)], deque([(x, y)]); fundo[y][x] = True
                while fila:
                    cx, cy = fila.popleft()
                    for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                        if 0 <= nx < w and 0 <= ny < h and not fundo[ny][nx] and eh_fundo(nx, ny):
                            fundo[ny][nx] = True; fila.append((nx, ny)); bolsao.append((nx, ny))
                if len(bolsao) < 20:   # pontinho claro do próprio desenho: devolve
                    for bx, by in bolsao: fundo[by][bx] = False
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
        if 30 < c['n'] < MIN_AREA:   # enfeite: junta ao boneco mais próximo na horizontal
            cx = (c['caixa'][0] + c['caixa'][2]) / 2
            alvo = min(grandes, key=lambda g: abs((g['caixa'][0] + g['caixa'][2]) / 2 - cx))
            a, b = alvo['caixa'], c['caixa']
            alvo['caixa'] = [min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])]
    return p, [g['caixa'] for g in grandes]


def gerar(id_):
    cfg = PERSONAGENS[id_]
    img = Image.open(RAIZ / cfg['origem']).convert('RGB')
    linhas = {}
    for nome, caixa in cfg['paineis'].items():
        p, caixas = recortar_painel(img, caixa, cfg['fundo'], cfg.get('buracos', False))
        e = cfg['escala'].get(nome, 1)
        linhas[nome] = [q.resize((round(q.width * e), round(q.height * e)), Image.LANCZOS) if e != 1 else q
                        for q in (p.crop(c) for c in caixas)]
        print(id_, nome, len(caixas), [(c[2] - c[0], c[3] - c[1]) for c in caixas])
    QW = max(q.width for qs in linhas.values() for q in qs) + 8
    QH = max(q.height for qs in linhas.values() for q in qs) + 8
    colunas = max(len(qs) for qs in linhas.values())
    folha = Image.new('RGBA', (QW * colunas, QH * len(linhas)), (0, 0, 0, 0))
    for li, qs in enumerate(linhas.values()):
        for ci, q in enumerate(qs):
            folha.paste(q, (ci * QW + (QW - q.width) // 2, li * QH + QH - 4 - q.height), q)
    saida = RAIZ / 'personagens' / id_ / 'sprites.png'
    saida.parent.mkdir(parents=True, exist_ok=True)
    # 256 cores bastam para pixel art e deixam o arquivo ~4x menor (melhor para o celular)
    folha.quantize(256, method=Image.FASTOCTREE, dither=Image.NONE).save(saida, optimize=True)
    print(id_, 'quadro', QW, 'x', QH, '| colunas', colunas, 'linhas', len(linhas), '->', saida)


if __name__ == '__main__':
    for id_ in (sys.argv[1:] or PERSONAGENS):
        gerar(id_)
