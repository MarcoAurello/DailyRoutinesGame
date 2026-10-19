"""Prepara a marca e as imagens do jogo a partir dos arquivos originais.

- marca.jpg            -> assets/marca.png (fundo transparente)
- marca.jpg            -> icons/ (ícones do app)
- joana/dona joana.jpg -> personagens/joana/capa.jpg (menor, para carregar rápido no celular)

Uso: python ferramentas/marca.py
"""
from collections import deque
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent


def sem_fundo(img, tol=28):
    """Apaga o fundo liso (cor do canto) a partir das bordas."""
    img = img.convert('RGBA'); px = img.load(); w, h = img.size
    ref = px[2, 2][:3]
    perto = lambda c: sum(abs(a - b) for a, b in zip(c[:3], ref)) < tol
    fila = deque((x, y) for x in range(w) for y in (0, h - 1)); fila.extend((x, y) for y in range(h) for x in (0, w - 1))
    visto = set(fila)
    while fila:
        x, y = fila.popleft()
        if not perto(px[x, y]): continue
        px[x, y] = (0, 0, 0, 0)
        for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= n[0] < w and 0 <= n[1] < h and n not in visto: visto.add(n); fila.append(n)
    return img.crop(img.getbbox())


def main():
    marca = sem_fundo(Image.open(RAIZ / 'marca.jpg'))
    (RAIZ / 'assets').mkdir(exist_ok=True)
    marca.save(RAIZ / 'assets' / 'marca.png', optimize=True)
    icons = RAIZ / 'icons'; icons.mkdir(exist_ok=True)
    for nome, lado, margem, fundo in [('icon-192.png', 192, 0.08, None), ('icon-512.png', 512, 0.08, None),
                                      ('icon-maskable-512.png', 512, 0.2, (234, 240, 250, 255)),
                                      ('apple-touch-icon.png', 180, 0.1, (234, 240, 250, 255))]:
        tela = Image.new('RGBA', (lado, lado), fundo or (0, 0, 0, 0))
        m = marca.copy(); m.thumbnail((int(lado * (1 - 2 * margem)),) * 2, Image.LANCZOS)
        tela.alpha_composite(m, ((lado - m.width) // 2, (lado - m.height) // 2))
        tela.save(icons / nome, optimize=True)
    capa = Image.open(RAIZ / 'joana' / 'dona joana.jpg').convert('RGB')
    capa.thumbnail((960, 960), Image.LANCZOS)
    capa.save(RAIZ / 'personagens' / 'joana' / 'capa.jpg', quality=82, optimize=True, progressive=True)
    print('ok', marca.size)


if __name__ == '__main__':
    main()
