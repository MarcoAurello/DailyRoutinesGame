# My Day — English Academy

Jogo de rotina diária em inglês para adolescentes iniciantes. O aluno acompanha o dia de um
personagem das 9h às 18h, consulta a agenda e escolhe a frase certa na outra língua.
O planejamento completo está em `My_Day_planejamento.pdf`.

Feito com HTML, CSS e JavaScript puro, sem instalação, no mesmo padrão do Jogo de Ortografia do Pleno.
Funciona no celular, no tablet e no computador, e pode ser instalado como app (PWA, funciona offline).

## Como jogar

1. **Nome** do aluno (vai para o relatório).
2. **Modo**: português → inglês ou inglês → português.
3. **Nível**: fácil (frases curtas) ou difícil (frases completas, erradas quase iguais à certa).
4. **Personagem**: por enquanto só a **Dona Joana**; os outros 4 aparecem como "em breve".
5. **Explicação** do professor (gravação ou voz do aparelho).
6. **Jogo**: 100 segundos, relógio digital com ◀ ▶, indicador das 10 horas, botão **Agenda**
   (rotina no idioma de origem) e 4 alternativas no idioma de destino.
7. **Fim**: pontuação, tempo, acertos, erros, correção hora a hora e **PDF** para baixar.

## Regras (planejamento, seções 5 e 6)

- Acertou: ✓ na agenda e no relógio. Errou: a hora fica bloqueada (a resposta certa só aparece no fim).
- O dia acaba quando as 10 horas são respondidas ou os 100 segundos acabam; horas sem resposta contam como erro.
- Pontuação oculta durante o jogo: começa com 1000, −100 por erro, + bônus de velocidade por acerto
  (até 5 s = +100, depois −10 por segundo, 15 s ou mais = 0). Trocar de hora reinicia o bônus daquela hora.
- O PDF tem o desempenho (Parte 1) e a rotina em português e inglês lado a lado (Parte 2).
  A tradução das alternativas erradas está ligada por `PDF_COM_ERRADAS` no `jogo.js` (pendente de confirmação).

## Arquivos

- `index.html`, `style.css` — telas e visual (cores da English Academy)
- `jogo.js` — fluxo, cronômetro, pontuação, agenda, sons, áudios do professor e PDF
- `dados.js` — personagens e as frases de cada hora (fácil e difícil, certa + 3 erradas, PT e EN)
- `personagens/joana/` — `sprites.png` (folha de sprites) e `capa.jpg`
- `assets/marca.png`, `icons/` — marca sem fundo e ícones do app
- `audio/professor/` — gravações do professor (lista em `GRAVAR.md`)
- `vendor/jspdf.umd.min.js` — gera o PDF no próprio aparelho
- `ferramentas/sprites.py` — recorta `joana/sprites.jpg` e monta a folha de sprites
- `ferramentas/marca.py` — tira o fundo da marca, gera os ícones e a capa

## Para adicionar um personagem

1. Coloque a imagem de sprites e a capa em uma pasta própria e ajuste/rode as ferramentas.
2. Acrescente o personagem em `PERSONAGENS` no `dados.js` (e tire-o de `EM_BREVE`).
3. Acrescente os arquivos novos no `service-worker.js`.

## Para testar no computador

```bash
python -m http.server 5510 --directory C:/dev/ingles
```

Depois abra http://localhost:5510.

Ao publicar uma versão nova, aumente a `VERSAO` no `service-worker.js` e o `?v=` no `index.html`.

---

© **Marco Nunes** — Todos os direitos reservados.
