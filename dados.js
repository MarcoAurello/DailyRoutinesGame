/* My Day — dados dos personagens. © Marco Nunes. Todos os direitos reservados.

   Cada personagem tem 10 atividades (9h às 18h). Cada atividade tem a versão fácil e a difícil,
   com a frase certa e 3 erradas, sempre em português (pt) e em inglês (en).
   RASCUNHO: as frases da Dona Joana foram criadas a partir das ideias do planejamento
   e precisam da revisão do professor.

   Sprites: folha personagens/<id>/sprites.png (gerada por ferramentas/sprites.py).
   'quadros' = lista de [coluna, linha] na folha; 'fps' = velocidade da animação. */

const R = (pt, en) => ({ pt, en });

const PERSONAGENS = [
  {
    id: 'joana',
    nome: 'Dona Joana',
    icone: '👵',
    cor: '#c8202f',
    apresentacao: R(
      'Olá! Eu sou a Dona Joana. Tenho 75 anos e amo o meu jardim!',
      "Hi! I'm Dona Joana. I'm 75 years old and I love my garden!"
    ),
    capa: 'personagens/joana/capa.jpg',
    sprite: {
      src: 'personagens/joana/sprites.png',
      colunas: 8, linhas: 3,           // tamanho da folha em quadros
      proporcao: '178 / 287',          // largura / altura de um quadro (impresso por ferramentas/sprites.py)
      estados: {
        oi:       { quadros: [[0, 0], [1, 0]], fps: 2.5 },
        pensando: { quadros: [[0, 2], [1, 2]], fps: 1.2 },
        acertou:  { quadros: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], fps: 8 },
        festa:    { quadros: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], fps: 8 },
        triste:   { quadros: [[0, 1], [2, 1]], fps: 1.2 },
        ideia:    { quadros: [[3, 2]], fps: 1 },
      },
    },
    rotina: [
      {
        hora: 9,
        facil: { certa: R('Tomar café da manhã', 'Have breakfast'), erradas: [
          R('Almoçar', 'Have lunch'),
          R('Preparar o café da manhã', 'Make breakfast'),
          R('Jantar', 'Have dinner'),
        ] },
        dificil: { certa: R('Tomar um café da manhã leve na cozinha', 'Have a light breakfast in the kitchen'), erradas: [
          R('Tomar um café da manhã leve no jardim', 'Have a light breakfast in the garden'),
          R('Tomar um café da manhã reforçado na cozinha', 'Have a big breakfast in the kitchen'),
          R('Preparar um café da manhã leve na cozinha', 'Make a light breakfast in the kitchen'),
        ] },
      },
      {
        hora: 10,
        facil: { certa: R('Regar as plantas', 'Water the plants'), erradas: [
          R('Lavar as plantas', 'Wash the plants'),
          R('Comprar plantas', 'Buy plants'),
          R('Regar a grama', 'Water the grass'),
        ] },
        dificil: { certa: R('Regar as plantas do jardim com o meu regador', 'Water the plants in the garden with my watering can'), erradas: [
          R('Regar as plantas da cozinha com o meu regador', 'Water the plants in the kitchen with my watering can'),
          R('Regar as plantas do jardim com a minha mangueira', 'Water the plants in the garden with my hose'),
          R('Lavar as plantas do jardim com o meu regador', 'Wash the plants in the garden with my watering can'),
        ] },
      },
      {
        hora: 11,
        facil: { certa: R('Tomar o meu remédio', 'Take my medicine'), erradas: [
          R('Comprar o meu remédio', 'Buy my medicine'),
          R('Tomar as minhas vitaminas', 'Take my vitamins'),
          R('Esquecer o meu remédio', 'Forget my medicine'),
        ] },
        dificil: { certa: R('Tomar o meu remédio de pressão com um copo de água', 'Take my blood pressure medicine with a glass of water'), erradas: [
          R('Tomar o meu remédio de pressão com um copo de leite', 'Take my blood pressure medicine with a glass of milk'),
          R('Tomar o meu remédio de pressão com uma xícara de água', 'Take my blood pressure medicine with a cup of water'),
          R('Tomar o meu remédio de dor de cabeça com um copo de água', 'Take my headache medicine with a glass of water'),
        ] },
      },
      {
        hora: 12,
        facil: { certa: R('Almoçar', 'Have lunch'), erradas: [
          R('Jantar', 'Have dinner'),
          R('Fazer o almoço', 'Make lunch'),
          R('Fazer um lanche', 'Have a snack'),
        ] },
        dificil: { certa: R('Almoçar com a minha vizinha na casa dela', 'Have lunch with my neighbor at her house'), erradas: [
          R('Almoçar com a minha vizinha na minha casa', 'Have lunch with my neighbor at my house'),
          R('Jantar com a minha vizinha na casa dela', 'Have dinner with my neighbor at her house'),
          R('Almoçar com a minha irmã na casa dela', 'Have lunch with my sister at her house'),
        ] },
      },
      {
        hora: 13,
        facil: { certa: R('Tirar um cochilo', 'Take a nap'), erradas: [
          R('Tomar banho', 'Take a shower'),
          R('Dar uma caminhada', 'Take a walk'),
          R('Ir para a cama', 'Go to bed'),
        ] },
        dificil: { certa: R('Tirar um cochilo curto no sofá da sala', 'Take a short nap on the living room sofa'), erradas: [
          R('Tirar um cochilo longo no sofá da sala', 'Take a long nap on the living room sofa'),
          R('Tirar um cochilo curto embaixo do sofá da sala', 'Take a short nap under the living room sofa'),
          R('Tirar um cochilo curto no sofá do quarto', 'Take a short nap on the bedroom sofa'),
        ] },
      },
      {
        hora: 14,
        facil: { certa: R('Dar comida ao meu gato', 'Feed my cat'), erradas: [
          R('Dar comida ao meu cachorro', 'Feed my dog'),
          R('Dar banho no meu gato', 'Wash my cat'),
          R('Fazer carinho no meu gato', 'Pet my cat'),
        ] },
        dificil: { certa: R('Dar comida ao meu gato preguiçoso na varanda', 'Feed my lazy cat on the porch'), erradas: [
          R('Dar comida ao meu cachorro preguiçoso na varanda', 'Feed my lazy dog on the porch'),
          R('Dar comida ao meu gato faminto na varanda', 'Feed my hungry cat on the porch'),
          R('Dar comida ao meu gato preguiçoso na cozinha', 'Feed my lazy cat in the kitchen'),
        ] },
      },
      {
        hora: 15,
        facil: { certa: R('Tricotar um cachecol', 'Knit a scarf'), erradas: [
          R('Comprar um cachecol', 'Buy a scarf'),
          R('Tricotar um suéter', 'Knit a sweater'),
          R('Lavar um cachecol', 'Wash a scarf'),
        ] },
        dificil: { certa: R('Tricotar um cachecol azul para o meu neto', 'Knit a blue scarf for my grandson'), erradas: [
          R('Tricotar um cachecol vermelho para o meu neto', 'Knit a red scarf for my grandson'),
          R('Tricotar um cachecol azul para a minha neta', 'Knit a blue scarf for my granddaughter'),
          R('Tricotar um cachecol azul com o meu neto', 'Knit a blue scarf with my grandson'),
        ] },
      },
      {
        hora: 16,
        facil: { certa: R('Ligar para os meus netos', 'Call my grandchildren'), erradas: [
          R('Visitar os meus netos', 'Visit my grandchildren'),
          R('Ligar para os meus filhos', 'Call my children'),
          R('Mandar mensagem para os meus netos', 'Text my grandchildren'),
        ] },
        dificil: { certa: R('Fazer uma chamada de vídeo para os meus netos no meu celular', 'Make a video call to my grandchildren on my phone'), erradas: [
          R('Fazer uma chamada de vídeo para os meus filhos no meu celular', 'Make a video call to my children on my phone'),
          R('Fazer uma chamada de voz para os meus netos no meu celular', 'Make a voice call to my grandchildren on my phone'),
          R('Fazer uma chamada de vídeo para os meus netos no meu computador', 'Make a video call to my grandchildren on my computer'),
        ] },
      },
      {
        hora: 17,
        facil: { certa: R('Ir ao mercado', 'Go to the supermarket'), erradas: [
          R('Ir à farmácia', 'Go to the pharmacy'),
          R('Ir à padaria', 'Go to the bakery'),
          R('Sair do mercado', 'Leave the supermarket'),
        ] },
        dificil: { certa: R('Ir ao mercado a pé com a minha melhor amiga', 'Go to the supermarket on foot with my best friend'), erradas: [
          R('Ir ao mercado de ônibus com a minha melhor amiga', 'Go to the supermarket by bus with my best friend'),
          R('Ir à padaria a pé com a minha melhor amiga', 'Go to the bakery on foot with my best friend'),
          R('Ir ao mercado a pé sem a minha melhor amiga', 'Go to the supermarket on foot without my best friend'),
        ] },
      },
      {
        hora: 18,
        facil: { certa: R('Assistir à novela', 'Watch the soap opera'), erradas: [
          R('Assistir ao jornal', 'Watch the news'),
          R('Assistir a um filme', 'Watch a movie'),
          R('Ouvir rádio', 'Listen to the radio'),
        ] },
        dificil: { certa: R('Assistir à minha novela favorita na TV com um chá quente', 'Watch my favorite soap opera on TV with a hot tea'), erradas: [
          R('Assistir à minha novela favorita na TV com um chá gelado', 'Watch my favorite soap opera on TV with an iced tea'),
          R('Assistir ao meu filme favorito na TV com um chá quente', 'Watch my favorite movie on TV with a hot tea'),
          R('Assistir à minha novela favorita na cama com um chá quente', 'Watch my favorite soap opera in bed with a hot tea'),
        ] },
      },
    ],
  },
];

// personagens do planejamento que ainda não têm conteúdo: aparecem como "em breve"
const EM_BREVE = [
  { nome: 'Policial', icone: '👮' },
  { nome: 'Influencer', icone: '🤳' },
  { nome: 'Empresário', icone: '💼' },
  { nome: 'Jogador de futebol', icone: '⚽' },
];
