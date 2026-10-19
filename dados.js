/* My Day — dados dos personagens. © Marco Nunes. Todos os direitos reservados.

   Cada personagem tem 10 atividades (9h às 18h). Cada atividade tem a versão fácil e a difícil,
   com a frase certa e 3 erradas, sempre em português (pt) e em inglês (en).
   RASCUNHO: as frases da Dona Joana foram criadas a partir das ideias do planejamento
   e precisam da revisão do professor. As do Policial Jack e da Influenciadora Emily partem das
   frases certas de policialjack/rotinajack.txt e influenciadora emily/rotinaemily.json; as erradas seguem o planejamento (frases parecidas, sem erro de gramática).

   Sprites: folha personagens/<id>/sprites.png (gerada por ferramentas/sprites.py).
   'quadros' = lista de [coluna, linha] na folha; 'fps' = velocidade da animação. */

const R = (pt, en) => ({ pt, en });

const PERSONAGENS = [
  {
    id: 'joana',
    nome: 'Dona Joana',
    artigo: 'a', pronome: R('ela', 'she'),   // "o dia da Dona Joana", "o que ela faz"
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
  {
    id: 'jack',
    nome: 'Policial Jack',
    artigo: 'o', pronome: R('ele', 'he'),
    icone: '👮',
    cor: '#2b3a67',
    apresentacao: R(
      'Olá! Eu sou o Policial Jack. Eu cuido da segurança da cidade!',
      "Hi! I'm Police Officer Jack. I keep the city safe!"
    ),
    capa: 'personagens/jack/capa.jpg',
    sprite: {
      src: 'personagens/jack/sprites.png',
      colunas: 8, linhas: 3,           // linhas: 0 comemorando · 1 pensando · 2 triste
      proporcao: '161 / 234',
      estados: {
        oi:       { quadros: [[0, 0], [1, 0]], fps: 2.5 },
        pensando: { quadros: [[0, 1], [1, 1]], fps: 1.2 },
        acertou:  { quadros: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], fps: 8 },
        festa:    { quadros: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], fps: 8 },
        triste:   { quadros: [[0, 2], [1, 2], [2, 2], [1, 2]], fps: 1.5 },
        ideia:    { quadros: [[5, 1], [6, 1]], fps: 1.2 },
      },
    },
    rotina: [
      {
        hora: 9,
        facil: { certa: R('Começar o meu turno', 'Start my shift'), erradas: [
          R('Terminar o meu turno', 'End my shift'),
          R('Ligar o meu carro', 'Start my car'),
          R('Faltar ao meu turno', 'Skip my shift'),
        ] },
        dificil: { certa: R('Começar o meu turno e verificar o rádio da polícia', 'Start my shift and check the police radio'), erradas: [
          R('Terminar o meu turno e verificar o rádio da polícia', 'End my shift and check the police radio'),
          R('Começar o meu turno e consertar o rádio da polícia', 'Start my shift and fix the police radio'),
          R('Começar o meu turno e verificar o carro da polícia', 'Start my shift and check the police car'),
        ] },
      },
      {
        hora: 10,
        facil: { certa: R('Patrulhar as ruas', 'Patrol the streets'), erradas: [
          R('Limpar as ruas', 'Clean the streets'),
          R('Atravessar as ruas', 'Cross the streets'),
          R('Patrulhar a praia', 'Patrol the beach'),
        ] },
        dificil: { certa: R('Patrulhar as ruas da cidade no carro de polícia', 'Patrol the city streets in the police car'), erradas: [
          R('Patrulhar as ruas da cidade numa moto de polícia', 'Patrol the city streets on a police motorcycle'),
          R('Patrulhar os parques da cidade no carro de polícia', 'Patrol the city parks in the police car'),
          R('Patrulhar as ruas da cidade a pé', 'Patrol the city streets on foot'),
        ] },
      },
      {
        hora: 11,
        facil: { certa: R('Revisar relatórios', 'Review reports'), erradas: [
          R('Escrever relatórios', 'Write reports'),
          R('Imprimir relatórios', 'Print reports'),
          R('Revisar e-mails', 'Review emails'),
        ] },
        dificil: { certa: R('Revisar os relatórios de ocorrências na delegacia', 'Review the incident reports at the police station'), erradas: [
          R('Escrever os relatórios de ocorrências na delegacia', 'Write the incident reports at the police station'),
          R('Revisar os relatórios de ocorrências em casa', 'Review the incident reports at home'),
          R('Revisar os relatórios de trânsito na delegacia', 'Review the traffic reports at the police station'),
        ] },
      },
      {
        hora: 12,
        facil: { certa: R('Almoçar', 'Have lunch'), erradas: [
          R('Tomar café da manhã', 'Have breakfast'),
          R('Jantar', 'Have dinner'),
          R('Fazer o almoço', 'Make lunch'),
        ] },
        dificil: { certa: R('Fazer um almoço rápido e comer um sanduíche de frango', 'Have a quick lunch and eat a chicken sandwich'), erradas: [
          R('Fazer um almoço longo e comer um sanduíche de frango', 'Have a long lunch and eat a chicken sandwich'),
          R('Fazer um almoço rápido e comer um sanduíche de queijo', 'Have a quick lunch and eat a cheese sandwich'),
          R('Fazer um almoço rápido e preparar um sanduíche de frango', 'Have a quick lunch and make a chicken sandwich'),
        ] },
      },
      {
        hora: 13,
        facil: { certa: R('Ir a uma reunião', 'Go to a meeting'), erradas: [
          R('Ir a uma festa', 'Go to a party'),
          R('Sair de uma reunião', 'Leave a meeting'),
          R('Ir a uma aula', 'Go to a class'),
        ] },
        dificil: { certa: R('Conduzir uma reunião de segurança com os moradores do bairro', 'Lead a safety meeting with the neighborhood residents'), erradas: [
          R('Participar de uma reunião de segurança com os moradores do bairro', 'Attend a safety meeting with the neighborhood residents'),
          R('Conduzir uma reunião de segurança sem os moradores do bairro', 'Lead a safety meeting without the neighborhood residents'),
          R('Conduzir uma reunião de segurança com os alunos da escola', 'Lead a safety meeting with the school students'),
        ] },
      },
      {
        hora: 14,
        facil: { certa: R('Visitar as lojas', 'Visit the stores'), erradas: [
          R('Fechar as lojas', 'Close the stores'),
          R('Limpar as lojas', 'Clean the stores'),
          R('Visitar as escolas', 'Visit the schools'),
        ] },
        dificil: { certa: R('Inspecionar as lojas do bairro com o meu parceiro', 'Inspect the local stores with my partner'), erradas: [
          R('Inspecionar as lojas do bairro com o meu chefe', 'Inspect the local stores with my boss'),
          R('Inspecionar as escolas do bairro com o meu parceiro', 'Inspect the local schools with my partner'),
          R('Visitar as lojas do bairro com o meu parceiro', 'Visit the local stores with my partner'),
        ] },
      },
      {
        hora: 15,
        facil: { certa: R('Atender a um chamado', 'Answer a call'), erradas: [
          R('Fazer uma ligação', 'Make a call'),
          R('Perder um chamado', 'Miss a call'),
          R('Responder a um e-mail', 'Answer an email'),
        ] },
        dificil: { certa: R('Atender a um chamado de emergência sobre um acidente de carro', 'Answer an emergency call about a car accident'), erradas: [
          R('Atender a um chamado de emergência sobre um acidente de bicicleta', 'Answer an emergency call about a bike accident'),
          R('Fazer uma ligação de emergência sobre um acidente de carro', 'Make an emergency call about a car accident'),
          R('Atender a um chamado de emergência depois de um acidente de carro', 'Answer an emergency call after a car accident'),
        ] },
      },
      {
        hora: 16,
        facil: { certa: R('Tomar café', 'Drink coffee'), erradas: [
          R('Tomar chá', 'Drink tea'),
          R('Fazer café', 'Make coffee'),
          R('Comprar café', 'Buy coffee'),
        ] },
        dificil: { certa: R('Fazer uma pausa rápida para o café na delegacia', 'Have a quick coffee break at the police station'), erradas: [
          R('Fazer uma pausa longa para o café na delegacia', 'Have a long coffee break at the police station'),
          R('Fazer uma pausa rápida para o café na padaria', 'Have a quick coffee break at the bakery'),
          R('Fazer uma pausa rápida para o chá na delegacia', 'Have a quick tea break at the police station'),
        ] },
      },
      {
        hora: 17,
        facil: { certa: R('Preencher formulários', 'Fill out forms'), erradas: [
          R('Imprimir formulários', 'Print forms'),
          R('Assinar formulários', 'Sign forms'),
          R('Perder formulários', 'Lose forms'),
        ] },
        dificil: { certa: R('Preencher os formulários de fim de turno na minha mesa', 'Fill out the end-of-shift forms at my desk'), erradas: [
          R('Preencher os formulários de início de turno na minha mesa', 'Fill out the start-of-shift forms at my desk'),
          R('Preencher os formulários de fim de turno em casa', 'Fill out the end-of-shift forms at home'),
          R('Assinar os formulários de fim de turno na minha mesa', 'Sign the end-of-shift forms at my desk'),
        ] },
      },
      {
        hora: 18,
        facil: { certa: R('Ir para casa', 'Go home'), erradas: [
          R('Ir para o trabalho', 'Go to work'),
          R('Sair de casa', 'Leave home'),
          R('Ir para a academia', 'Go to the gym'),
        ] },
        dificil: { certa: R('Terminar o meu turno e ir para casa descansar', 'Finish my shift and go home to rest'), erradas: [
          R('Começar o meu turno e ir para casa descansar', 'Start my shift and go home to rest'),
          R('Terminar o meu turno e ir para casa cozinhar', 'Finish my shift and go home to cook'),
          R('Terminar o meu turno e ir para a delegacia descansar', 'Finish my shift and go to the police station to rest'),
        ] },
      },
    ],
  },
  {
    id: 'emily',
    nome: 'Influenciadora Emily',
    artigo: 'a', pronome: R('ela', 'she'),
    icone: '🤳',
    cor: '#8a5cc7',
    apresentacao: R(
      'Oi! Eu sou a Emily, influenciadora digital. Siga o meu dia!',
      "Hi! I'm Emily, a digital influencer. Follow my day!"
    ),
    capa: 'personagens/emily/capa.jpg',
    sprite: {
      src: 'personagens/emily/sprites.png',
      colunas: 8, linhas: 3,           // linhas: 0 comemorando · 1 pensando · 2 triste
      proporcao: '180 / 232',
      estados: {
        oi:       { quadros: [[0, 0], [1, 0]], fps: 2.5 },
        pensando: { quadros: [[0, 1], [2, 1]], fps: 1.2 },
        acertou:  { quadros: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], fps: 8 },
        festa:    { quadros: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], fps: 8 },
        triste:   { quadros: [[0, 2], [1, 2], [2, 2], [1, 2]], fps: 1.5 },
        ideia:    { quadros: [[5, 1]], fps: 1 },
      },
    },
    rotina: [
      {
        hora: 9,
        facil: { certa: R('Gravar stories', 'Record stories'), erradas: [
          R('Assistir a stories', 'Watch stories'),
          R('Apagar stories', 'Delete stories'),
          R('Gravar um podcast', 'Record a podcast'),
        ] },
        dificil: { certa: R('Gravar stories da manhã e checar as minhas notificações', 'Record morning stories and check my notifications'), erradas: [
          R('Gravar stories da noite e checar as minhas notificações', 'Record night stories and check my notifications'),
          R('Gravar stories da manhã e apagar as minhas notificações', 'Record morning stories and delete my notifications'),
          R('Assistir a stories da manhã e checar as minhas notificações', 'Watch morning stories and check my notifications'),
        ] },
      },
      {
        hora: 10,
        facil: { certa: R('Ir à academia', 'Go to the gym'), erradas: [
          R('Ir ao shopping', 'Go to the mall'),
          R('Sair da academia', 'Leave the gym'),
          R('Ir ao parque', 'Go to the park'),
        ] },
        dificil: { certa: R('Treinar na academia com o meu personal trainer', 'Work out at the gym with my personal trainer'), erradas: [
          R('Treinar no parque com o meu personal trainer', 'Work out at the park with my personal trainer'),
          R('Treinar na academia sem o meu personal trainer', 'Work out at the gym without my personal trainer'),
          R('Treinar na academia com a minha melhor amiga', 'Work out at the gym with my best friend'),
        ] },
      },
      {
        hora: 11,
        facil: { certa: R('Fazer vídeos', 'Make videos'), erradas: [
          R('Assistir a vídeos', 'Watch videos'),
          R('Apagar vídeos', 'Delete videos'),
          R('Tirar fotos', 'Take photos'),
        ] },
        dificil: { certa: R('Criar conteúdo novo e filmar vídeos para os meus canais', 'Create new content and film videos for my channels'), erradas: [
          R('Criar conteúdo novo e filmar vídeos para os meus amigos', 'Create new content and film videos for my friends'),
          R('Criar conteúdo novo e editar vídeos para os meus canais', 'Create new content and edit videos for my channels'),
          R('Copiar conteúdo novo e filmar vídeos para os meus canais', 'Copy new content and film videos for my channels'),
        ] },
      },
      {
        hora: 12,
        facil: { certa: R('Almoçar', 'Have lunch'), erradas: [
          R('Tomar café da manhã', 'Have breakfast'),
          R('Jantar', 'Have dinner'),
          R('Pedir o almoço', 'Order lunch'),
        ] },
        dificil: { certa: R('Almoçar e postar um story sobre a minha refeição', 'Have lunch and post a story about my meal'), erradas: [
          R('Jantar e postar um story sobre a minha refeição', 'Have dinner and post a story about my meal'),
          R('Almoçar e postar uma foto sobre a minha refeição', 'Have lunch and post a photo about my meal'),
          R('Almoçar e postar um story sobre o meu cachorro', 'Have lunch and post a story about my dog'),
        ] },
      },
      {
        hora: 13,
        facil: { certa: R('Ter uma reunião', 'Have a meeting'), erradas: [
          R('Dar uma festa', 'Have a party'),
          R('Cancelar uma reunião', 'Cancel a meeting'),
          R('Ter uma aula', 'Have a class'),
        ] },
        dificil: { certa: R('Participar de uma reunião online com as minhas marcas parceiras', 'Attend an online meeting with my brand partners'), erradas: [
          R('Participar de uma reunião presencial com as minhas marcas parceiras', 'Attend an in-person meeting with my brand partners'),
          R('Participar de uma reunião online com os meus fãs', 'Attend an online meeting with my fans'),
          R('Cancelar uma reunião online com as minhas marcas parceiras', 'Cancel an online meeting with my brand partners'),
        ] },
      },
      {
        hora: 14,
        facil: { certa: R('Editar fotos', 'Edit photos'), erradas: [
          R('Tirar fotos', 'Take photos'),
          R('Imprimir fotos', 'Print photos'),
          R('Editar textos', 'Edit texts'),
        ] },
        dificil: { certa: R('Editar fotos e vídeos para os meus próximos posts', 'Edit photos and videos for my next posts'), erradas: [
          R('Editar fotos e vídeos para os meus posts antigos', 'Edit photos and videos for my old posts'),
          R('Apagar fotos e vídeos para os meus próximos posts', 'Delete photos and videos for my next posts'),
          R('Editar fotos e vídeos para a minha próxima viagem', 'Edit photos and videos for my next trip'),
        ] },
      },
      {
        hora: 15,
        facil: { certa: R('Postar um vídeo', 'Post a video'), erradas: [
          R('Assistir a um vídeo', 'Watch a video'),
          R('Apagar um vídeo', 'Delete a video'),
          R('Postar uma foto', 'Post a photo'),
        ] },
        dificil: { certa: R('Subir um vídeo novo no meu canal', 'Upload a new video to my channel'), erradas: [
          R('Subir um vídeo antigo no meu canal', 'Upload an old video to my channel'),
          R('Subir um vídeo novo no canal da minha amiga', "Upload a new video to my friend's channel"),
          R('Baixar um vídeo novo do meu canal', 'Download a new video from my channel'),
        ] },
      },
      {
        hora: 16,
        facil: { certa: R('Responder comentários', 'Answer comments'), erradas: [
          R('Apagar comentários', 'Delete comments'),
          R('Ler comentários', 'Read comments'),
          R('Responder e-mails', 'Answer emails'),
        ] },
        dificil: { certa: R('Fazer uma pausa para o café e responder os comentários dos meus seguidores', "Have a coffee break and answer my followers' comments"), erradas: [
          R('Fazer uma pausa para o café e apagar os comentários dos meus seguidores', "Have a coffee break and delete my followers' comments"),
          R('Fazer uma pausa para o almoço e responder os comentários dos meus seguidores', "Have a lunch break and answer my followers' comments"),
          R('Fazer uma pausa para o café e responder os comentários dos meus amigos', "Have a coffee break and answer my friends' comments"),
        ] },
      },
      {
        hora: 17,
        facil: { certa: R('Planejar o meu conteúdo', 'Plan my content'), erradas: [
          R('Apagar o meu conteúdo', 'Delete my content'),
          R('Compartilhar o meu conteúdo', 'Share my content'),
          R('Planejar a minha viagem', 'Plan my trip'),
        ] },
        dificil: { certa: R('Analisar os meus números e planejar o conteúdo de amanhã', 'Check my numbers and plan the content for tomorrow'), erradas: [
          R('Analisar os meus números e planejar o conteúdo da próxima semana', 'Check my numbers and plan the content for next week'),
          R('Analisar os meus números e postar o conteúdo de amanhã', 'Check my numbers and post the content for tomorrow'),
          R('Analisar as minhas mensagens e planejar o conteúdo de amanhã', 'Check my messages and plan the content for tomorrow'),
        ] },
      },
      {
        hora: 18,
        facil: { certa: R('Relaxar em casa', 'Relax at home'), erradas: [
          R('Trabalhar em casa', 'Work at home'),
          R('Relaxar na academia', 'Relax at the gym'),
          R('Limpar a minha casa', 'Clean my house'),
        ] },
        dificil: { certa: R('Terminar o meu trabalho e relaxar à noite', 'Finish my work and relax in the evening'), erradas: [
          R('Começar o meu trabalho e relaxar à noite', 'Start my work and relax in the evening'),
          R('Terminar o meu trabalho e estudar à noite', 'Finish my work and study in the evening'),
          R('Terminar o meu trabalho e relaxar no fim de semana', 'Finish my work and relax on the weekend'),
        ] },
      },
    ],
  },
];

// personagens que ainda não têm conteúdo aparecem como "em breve".
// Por enquanto ficam de fora (Empresário e Jogador de futebol voltam aqui quando forem criados).
const EM_BREVE = [];
