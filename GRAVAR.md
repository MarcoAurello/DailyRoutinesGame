# 🎙️ Gravações do professor para o My Day

Quando a gravação existe, o jogo toca a voz do professor. Quando não existe, ele lê o texto com a voz
do aparelho. Dá para gravar aos poucos: cada arquivo que entra já passa a valer.

## Como gravar

1. Use o gravador de voz do celular, num lugar silencioso.
2. Fale com animação, misturando português e inglês, como nos exemplos.
3. Grave um arquivo por fala, com meio segundo de silêncio no começo e no fim.
4. Renomeie com o nome da tabela, sem mudar a extensão: `.m4a`, `.mp3` ou `.wav` (o jogo aceita os três).
5. Coloque os arquivos em `audio/professor/`.

## Falas (8 no total)

| Quando toca | Sugestão de fala | Nome do arquivo |
|---|---|---|
| Antes de começar a partida (curta, uns 10 segundos) | "Hello! Escolha a hora no relógio, veja na agenda o que o personagem faz e escolha a frase certa. Você tem 200 segundos. Good luck!" | `explicacao` |
| Acerto (sorteada) | "Great job! Mandou bem!" | `acerto-1` |
| Acerto (sorteada) | "Excellent! Isso aí!" | `acerto-2` |
| Acerto (sorteada) | "Well done! Perfeito!" | `acerto-3` |
| Erro (sorteada) | "Oops! Não foi dessa vez, keep going!" | `erro-1` |
| Erro (sorteada) | "Don't worry! Vamos para a próxima!" | `erro-2` |
| Erro (sorteada) | "Almost! Continue tentando!" | `erro-3` |
| Quando o aluno fica numa hora sem abrir a agenda | "Psiu! As atividades estão na agenda. Open the agenda!" | `lembrete-agenda` |

> A explicação gravada vale para todos os personagens e modos, por isso não deve citar o nome
> da Dona Joana nem o idioma da agenda. Sem gravação, o jogo fala uma versão com o nome do aluno e do personagem.
