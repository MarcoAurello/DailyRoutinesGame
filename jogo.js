/* My Day — English Academy — © Marco Nunes. Todos os direitos reservados. */
(() => {
  const $ = (id) => document.getElementById(id);
  const embaralhar = (lista) => {
    const a = [...lista];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];
  const seguro = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const horaTexto = (h) => String(h).padStart(2, '0') + ':00';

  // ---------- Regras (planejamento, seções 5 e 6) ----------
  const DURACAO = 200;              // segundos por partida (o dobro do planejamento, a pedido do professor)
  const LEMBRETE = 8;               // segundos numa hora sem abrir a agenda até o lembrete
  const PONTOS_INICIAIS = 1000;
  const PENALIDADE = 100;           // por erro ou hora sem resposta
  // bônus por acerto: até 5 s vale 100; depois perde 10 por segundo; 15 s ou mais vale 0
  const bonus = (segundos) => {
    const s = Math.floor(segundos);
    return s <= 5 ? 100 : Math.max(0, 100 - (s - 5) * 10);
  };
  // incluir no PDF a tradução das 3 alternativas erradas (pendente de confirmação do professor)
  const PDF_COM_ERRADAS = true;

  const CHAVE_ALUNO = 'myday:aluno';
  let aluno = '';
  try { aluno = localStorage.getItem(CHAVE_ALUNO) || ''; } catch (e) { aluno = ''; }

  // escolhas do aluno
  let modo = 'pt-en', nivel = 'facil', personagem = PERSONAGENS[0];
  const origem = () => (modo === 'pt-en' ? 'pt' : 'en');   // idioma da agenda
  const destino = () => (modo === 'pt-en' ? 'en' : 'pt');  // idioma das alternativas
  const NOME_MODO = { 'pt-en': 'Português → Inglês', 'en-pt': 'Inglês → Português' };
  const NOME_NIVEL = { facil: 'Fácil', dificil: 'Difícil' };

  // ---------- Sons (sem arquivos) ----------
  let somLigado = true, ctx = null;
  function tocar(notas) {
    if (!somLigado) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      let t = ctx.currentTime;
      for (const [freq, dur, tipo = 'triangle'] of notas) {
        const o = ctx.createOscillator(), v = ctx.createGain();
        o.type = tipo; o.frequency.value = freq;
        v.gain.setValueAtTime(0.15, t);
        v.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(v); v.connect(ctx.destination);
        o.start(t); o.stop(t + dur);
        t += dur * 0.8;
      }
    } catch (e) { /* sem áudio */ }
  }
  const SOM = {
    certo: () => tocar([[660, 0.12], [880, 0.2]]),
    errado: () => tocar([[220, 0.25, 'square']]),
    vitoria: () => tocar([[523, 0.14], [659, 0.14], [784, 0.14], [1047, 0.35]]),
    clique: () => tocar([[440, 0.06]]),
    tique: () => tocar([[1200, 0.04, 'sine']]),
  };
  $('btn-som').onclick = () => {
    somLigado = !somLigado;
    $('btn-som').textContent = somLigado ? '🔊' : '🔇';
    $('btn-som').setAttribute('aria-label', somLigado ? 'Som ligado' : 'Som desligado');
    if (!somLigado) pararVoz();
  };

  // ---------- Áudios do professor ----------
  // 1) Se existir a gravação (audio/professor/<nome>.mp3, .m4a ou .wav), toca a gravação.
  // 2) Senão, lê o texto com a voz do aparelho. A lista de gravações está em GRAVAR.md.
  const EXTENSOES = ['mp3', 'm4a', 'wav'];
  const naoExiste = new Set();
  let audioAtual = null;

  const FALAS = {
    acerto: ['Great job! Mandou bem!', 'Excellent! Isso aí!', 'Well done! Perfeito!'],
    erro: ['Oops! Não foi dessa vez, keep going!', "Don't worry! Vamos para a próxima!", 'Almost! Continue tentando!'],
    lembrete: 'Psiu! As atividades estão na agenda. Open the agenda!',
  };

  function tocarGravacao(nome) {
    return new Promise((ok) => {
      const tentativas = EXTENSOES.map((e) => `audio/professor/${nome}.${e}`).filter((s) => !naoExiste.has(s));
      const tentar = () => {
        const src = tentativas.shift();
        if (!src) return ok(false);
        const a = new Audio(src);
        let resolvido = false;
        const falhou = () => { if (resolvido) return; resolvido = true; naoExiste.add(src); tentar(); };
        a.onerror = falhou;
        a.play()
          .then(() => { if (resolvido) return; resolvido = true; audioAtual = a; ok(true); })
          .catch((e) => {
            if (e && e.name === 'NotAllowedError') { resolvido = true; ok(false); return; }
            falhou();
          });
      };
      tentar();
    });
  }

  function vozDoAparelho(texto) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const f = new SpeechSynthesisUtterance(texto);
    f.lang = 'pt-BR';
    f.rate = 1;
    const vozes = speechSynthesis.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith('pt'));
    const preferida = vozes.find((v) => /pt.br/i.test(v.lang)) || vozes[0];
    if (preferida) f.voice = preferida;
    speechSynthesis.speak(f);
  }
  if (window.speechSynthesis) speechSynthesis.getVoices();

  function pararVoz() {
    if (audioAtual) { audioAtual.pause(); audioAtual = null; }
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  async function professor(nome, texto) {
    if (!somLigado) return;
    pararVoz();
    if (await tocarGravacao(nome)) return;
    if (texto) vozDoAparelho(texto);
  }

  // acerto e erro: 3 variações sorteadas (acerto-1..3, erro-1..3)
  function reacao(tipo) {
    const n = 1 + Math.floor(Math.random() * 3);
    professor(`${tipo}-${n}`, FALAS[tipo][n - 1]);
  }

  // ---------- Moldura: estrelas, relógios e balões de fala ----------
  const ENFEITES = {
    estrela: (c) => `<svg viewBox="0 0 60 60" width="34"><path d="M30 4 L37 22 L56 22 L41 34 L47 54 L30 42 L13 54 L19 34 L4 22 L23 22 Z" fill="${c}" stroke="#141c4d" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
    relogio: (c) => `<svg viewBox="0 0 60 60" width="40"><circle cx="30" cy="30" r="25" fill="#fff" stroke="${c}" stroke-width="6"/><path d="M30 14 V30 L41 37" stroke="#141c4d" stroke-width="4.5" fill="none" stroke-linecap="round"/></svg>`,
    fala: (c, t) => `<svg viewBox="0 0 80 56" width="58"><path d="M8 6 H72 Q76 6 76 10 V36 Q76 40 72 40 H30 L16 52 L19 40 H8 Q4 40 4 36 V10 Q4 6 8 6 Z" fill="${c}" stroke="#141c4d" stroke-width="3"/><text x="40" y="30" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="19" fill="#141c4d">${t}</text></svg>`,
    brilho: (c) => `<svg viewBox="0 0 40 40" width="22"><path d="M20 2 Q22 18 38 20 Q22 22 20 38 Q18 22 2 20 Q18 18 20 2 Z" fill="${c}"/></svg>`,
  };
  const OURO = '#e8b04a', VERMELHO = '#e0404d', BRANCO = '#ffffff';
  const POSICOES = [
    ['estrela', OURO, 2, 4, -15], ['fala', BRANCO, 10, 2, -6, 'Hi!'], ['brilho', OURO, 22, 9, 0], ['relogio', VERMELHO, 82, 3, 10],
    ['estrela', BRANCO, 92, 14, 12], ['brilho', BRANCO, 70, 6, 0], ['fala', OURO, 1, 40, 8, 'ABC'], ['estrela', VERMELHO, 3, 66, -10],
    ['relogio', OURO, 92, 44, -8], ['fala', BRANCO, 90, 72, 6, 'Yes!'], ['brilho', OURO, 6, 88, 0], ['estrela', OURO, 94, 92, 15],
    ['brilho', BRANCO, 48, 97, 0],
  ];
  $('moldura').innerHTML = POSICOES.map(([tipo, cor, x, y, giro, txt], i) =>
    `<div class="enfeite" style="left:${x}%;top:${y}%;transform:rotate(${giro}deg);--giro:${giro}deg;animation-delay:${(i % 6) * -1}s">${ENFEITES[tipo](cor, txt)}</div>`).join('');

  // ---------- Sprite do personagem ----------
  // folha com quadros do mesmo tamanho; cada estado é uma lista de [coluna, linha] e uma velocidade
  const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timersSprite = {};
  function sprite(area, estado) {
    const s = personagem.sprite, e = s.estados[estado] || s.estados.oi;
    clearInterval(timersSprite[area]);
    $(area).innerHTML = `<div class="sprite" role="img" aria-label="${seguro(personagem.nome)}"></div>`;
    const el = $(area).firstChild;
    el.style.backgroundImage = `url(${s.src})`;
    el.style.aspectRatio = s.proporcao;
    el.style.backgroundSize = `${s.colunas * 100}% ${s.linhas * 100}%`;
    let i = 0;
    const quadro = () => {
      const [c, l] = e.quadros[i % e.quadros.length];
      el.style.backgroundPosition = `${(c / (s.colunas - 1)) * 100}% ${(l / (s.linhas - 1)) * 100}%`;
      i++;
    };
    quadro();
    if (e.quadros.length > 1 && !reduzirMovimento) timersSprite[area] = setInterval(quadro, 1000 / e.fps);
  }

  // ---------- Telas ----------
  function mostrar(id) {
    document.querySelectorAll('.tela').forEach((t) => t.classList.toggle('ativa', t.id === id));
    document.body.classList.toggle('jogando', id === 'tela-jogo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('[data-voltar]').forEach((b) => {
    b.onclick = () => { SOM.clique(); pararVoz(); mostrar(b.dataset.voltar); };
  });

  // 1. Nome
  function telaNome() {
    $('erro-nome').textContent = '';
    if (!$('nome').value) $('nome').value = aluno;
    mostrar('tela-nome');
  }
  $('form-nome').onsubmit = (e) => {
    e.preventDefault();
    const nome = $('nome').value.trim().replace(/\s+/g, ' ');
    if (nome.length < 2) { $('erro-nome').textContent = 'Digite o seu nome. · Type your name.'; return; }
    aluno = nome;
    try { localStorage.setItem(CHAVE_ALUNO, aluno); } catch (err) { /* sem armazenamento */ }
    SOM.certo();
    mostrar('tela-modo');
  };

  // 2. Modo
  document.querySelectorAll('[data-modo]').forEach((b) => {
    b.onclick = () => { SOM.clique(); modo = b.dataset.modo; mostrar('tela-nivel'); };
  });

  // 3. Nível
  document.querySelectorAll('[data-nivel]').forEach((b) => {
    b.onclick = () => { SOM.clique(); nivel = b.dataset.nivel; telaPersonagem(); };
  });

  // 4. Personagem
  function telaPersonagem() {
    $('grade-personagens').innerHTML =
      PERSONAGENS.map((p) => `
        <button class="personagem" type="button" data-id="${p.id}" style="--c:${p.cor}">
          <span class="personagem-foto" style="background-image:url(${p.capa})"></span>
          <span class="personagem-nome">${p.icone} ${seguro(p.nome)}</span>
          <span class="personagem-frase">${seguro(p.apresentacao[origem()])}</span>
        </button>`).join('')
      + EM_BREVE.map((p) => `
        <div class="personagem bloqueado" aria-disabled="true">
          <span class="personagem-foto vazia">${p.icone}</span>
          <span class="personagem-nome">${seguro(p.nome)}</span>
          <span class="personagem-frase">🔒 Em breve · <i>coming soon</i></span>
        </div>`).join('');
    mostrar('tela-personagem');
  }
  $('grade-personagens').onclick = (e) => {
    const b = e.target.closest('button.personagem'); if (!b) return;
    SOM.clique();
    personagem = PERSONAGENS.find((p) => p.id === b.dataset.id);
    telaExplicacao();
  };

  // 5. Explicação
  function textoExplicacao() {
    const n = personagem.nome;
    const idiomaAgenda = modo === 'pt-en' ? 'em português' : 'em inglês';
    const idiomaFrases = modo === 'pt-en' ? 'em inglês' : 'em português';
    return {
      html: `<b>Hello, ${seguro(aluno)}!</b> Acompanhe o dia da <b>${seguro(n)}</b>, das <b>9h às 18h</b>.<br>
        ⏰ Escolha a hora no relógio <b>◀ ▶</b>.<br>
        📒 Veja na <b>Agenda</b> (${idiomaAgenda}) o que ela faz.<br>
        ✅ Escolha a frase certa ${idiomaFrases}. Errou? A hora fica bloqueada!<br>
        ⏱ Você tem <b>${DURACAO} segundos</b>. <b>Good luck!</b>`,
      // áudio curto: o texto completo fica na tela
      falado: `Hello, ${aluno}! Escolha a hora no relógio, veja na agenda o que a ${n} faz e escolha a frase certa. `
        + `Você tem ${DURACAO} segundos. Good luck!`,
    };
  }
  function telaExplicacao() {
    const t = textoExplicacao();
    $('texto-explicacao').innerHTML = t.html;
    $('capa').style.backgroundImage = `url(${personagem.capa})`;
    $('capa').innerHTML = `<span class="capa-nome">${personagem.icone} ${seguro(personagem.nome)}</span>
      <span class="capa-detalhe">${NOME_MODO[modo]} · ${NOME_NIVEL[nivel]}</span>`;
    sprite('sprite-explicacao', 'oi');
    mostrar('tela-explicacao');
    professor('explicacao', t.falado);
  }
  $('btn-ouvir-explicacao').onclick = () => professor('explicacao', textoExplicacao().falado);
  $('btn-comecar').onclick = () => { SOM.clique(); pararVoz(); comecar(); };

  // ---------- 6. Partida ----------
  // horas: { hora, ativ (versão do nível), opcoes, estado: pendente|certo|errado, escolha, bonus, tempo }
  let horas = [], atual = 0, inicio = 0, inicioHora = 0, relogioTimer = null, encerrada = true, proximaTimer = null;
  let ultimoSegundo = null;
  // agenda: se o aluno fica numa hora sem abrir a agenda, o jogo lembra que as atividades estão nela
  let ultimaPosCerta = -1;   // posição da resposta certa na última hora mostrada
  let pausaInicio = 0;   // quando o aluno pede para sair, o tempo fica parado até ele decidir
  let agendaJaAberta = false, agendaNaHora = false, lembreteTimer = null, lembretesFalados = 0;

  function comecar() {
    horas = personagem.rotina.map((r) => {
      const ativ = r[nivel];
      return {
        hora: r.hora, ativ,
        opcoes: embaralhar([{ ...ativ.certa, certa: true }, ...ativ.erradas.map((e) => ({ ...e, certa: false }))]),
        estado: 'pendente', escolha: null, bonus: 0, tempo: null,
      };
    });
    encerrada = false;
    ultimaPosCerta = -1;
    agendaJaAberta = false; lembretesFalados = 0;
    inicio = Date.now();
    ultimoSegundo = null;
    mostrar('tela-jogo');
    selecionarHora(0);
    clearInterval(relogioTimer);
    relogioTimer = setInterval(atualizarCronometro, 200);
    atualizarCronometro();
  }

  const decorrido = () => (Date.now() - inicio) / 1000;

  function atualizarCronometro() {
    if (encerrada || pausaInicio) return;
    const resta = Math.max(0, DURACAO - decorrido());
    const seg = Math.ceil(resta);
    $('cronometro-num').textContent = seg;
    $('cronometro-barra').style.width = (resta / DURACAO) * 100 + '%';
    $('cronometro').classList.toggle('alerta', seg <= 15);
    if (seg <= 10 && seg !== ultimoSegundo && seg > 0) SOM.tique();
    ultimoSegundo = seg;
    if (resta <= 0) fimDaPartida();
  }

  function selecionarHora(i) {
    clearTimeout(proximaTimer);
    atual = (i + horas.length) % horas.length;
    inicioHora = Date.now();   // trocar de hora reinicia o cronômetro de bônus daquela hora
    agendaNaHora = false;
    if (horas[atual].estado === 'pendente') embaralharOpcoes(horas[atual]);
    desenharHora();
    agendarLembrete();
  }

  // a cada vez que a hora aparece, as alternativas mudam de lugar e a certa
  // nunca fica na mesma posição da hora mostrada antes
  function embaralharOpcoes(h) {
    const certa = h.opcoes.find((o) => o.certa);
    const opcoes = embaralhar(h.opcoes.filter((o) => !o.certa));
    const pos = sortear([0, 1, 2, 3].filter((p) => p !== ultimaPosCerta));
    opcoes.splice(pos, 0, certa);
    h.opcoes = opcoes;
    ultimaPosCerta = pos;
  }

  function marcarAgenda(classe) {
    for (const id of ['btn-agenda', 'btn-agenda-grande']) {
      $(id).classList.toggle('chamar', classe === 'chamar');
      $(id).classList.toggle('lembrar', classe === 'lembrar');
    }
  }

  function agendarLembrete() {
    clearTimeout(lembreteTimer);
    const h = horas[atual];
    marcarAgenda(!agendaJaAberta && h.estado === 'pendente' ? 'chamar' : null);
    if (h.estado !== 'pendente') return;
    const hora = atual;
    lembreteTimer = setTimeout(() => {
      if (encerrada || hora !== atual || agendaNaHora || horas[hora].estado !== 'pendente' || !$('modal-agenda').hidden) return;
      marcarAgenda('lembrar');
      sprite('sprite-jogo', 'ideia');
      balao(origem() === 'pt'
        ? '💡 <b>Psiu!</b> As atividades estão na <b>📒 Agenda</b>! Abra para ver o que ela faz às ' + horaTexto(horas[hora].hora) + '.'
        : '💡 <b>Psst!</b> The activities are in the <b>📒 Agenda</b>! Open it to see what she does at ' + horaTexto(horas[hora].hora) + '.', 'lembrete');
      // a voz só nas duas primeiras vezes, para não cansar
      if (lembretesFalados < 2) { lembretesFalados++; professor('lembrete-agenda', FALAS.lembrete); }
    }, LEMBRETE * 1000);
  }

  function desenharHoras() {
    $('horas').innerHTML = horas.map((h, i) => {
      const icone = h.estado === 'certo' ? '✓' : h.estado === 'errado' ? '✗' : '';
      return `<button type="button" role="tab" aria-selected="${i === atual}" class="hora ${h.estado}${i === atual ? ' atual' : ''}" data-i="${i}">
        ${h.hora}h<small>${icone}</small></button>`;
    }).join('');
  }

  function balao(html, estado) {
    $('balao-jogo').innerHTML = html;
    $('balao-jogo').className = 'balao balao-cima' + (estado ? ' ' + estado : '');
  }

  function desenharHora() {
    const h = horas[atual];
    $('visor').textContent = horaTexto(h.hora);
    $('visor').className = 'visor ' + h.estado;
    desenharHoras();
    $('enunciado').textContent = modo === 'pt-en'
      ? `Qual frase em inglês é a atividade das ${horaTexto(h.hora)}?`
      : `Which sentence in Portuguese is the activity at ${horaTexto(h.hora)}?`;
    $('opcoes').innerHTML = '';
    for (const op of h.opcoes) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opcao';
      b.lang = destino() === 'en' ? 'en' : 'pt-BR';
      b.textContent = op[destino()];
      if (h.estado !== 'pendente') {
        b.disabled = true;
        if (h.escolha === op) b.classList.add(h.estado === 'certo' ? 'certa' : 'errada');
      } else {
        b.onclick = () => responder(op, b);
      }
      $('opcoes').append(b);
    }
    const sit = $('situacao');
    sit.hidden = h.estado === 'pendente';
    sit.className = 'situacao ' + h.estado;
    sit.textContent = h.estado === 'certo' ? '✓ Feito! · Done!' : h.estado === 'errado' ? '🔒 Hora bloqueada · Locked' : '';

    if (h.estado === 'pendente') {
      sprite('sprite-jogo', 'pensando');
      balao(modo === 'pt-en'
        ? `O que a <b>${seguro(personagem.nome)}</b> faz às <b>${horaTexto(h.hora)}</b>? Confira na <b>📒 Agenda</b>!`
        : `What does <b>${seguro(personagem.nome)}</b> do at <b>${horaTexto(h.hora)}</b>? Check the <b>📒 Agenda</b>!`);
    } else if (h.estado === 'certo') {
      sprite('sprite-jogo', 'acertou');
      balao('Great job! 🎉', 'certo');
    } else {
      sprite('sprite-jogo', 'triste');
      balao('Oops! Keep going! 💪', 'errado');
    }
  }

  function responder(op, botao) {
    const h = horas[atual];
    if (encerrada || h.estado !== 'pendente') return;
    clearTimeout(lembreteTimer);
    marcarAgenda(null);
    h.escolha = op;
    h.tempo = (Date.now() - inicioHora) / 1000;
    document.querySelectorAll('#opcoes .opcao').forEach((b) => { b.disabled = true; });
    if (op.certa) {
      h.estado = 'certo';
      h.bonus = bonus(h.tempo);
      SOM.certo();
      reacao('acerto');
    } else {
      h.estado = 'errado';
      SOM.errado();
      reacao('erro');
    }
    desenharHora();
    botao.classList.add(op.certa ? 'certa' : 'errada');
    // o dia acaba quando as 10 horas forem respondidas; senão vai para a próxima hora pendente
    if (!horas.some((x) => x.estado === 'pendente')) { setTimeout(fimDaPartida, 1600); return; }
    proximaTimer = setTimeout(() => {
      if (encerrada) return;
      for (let k = 1; k <= horas.length; k++) {
        const j = (atual + k) % horas.length;
        if (horas[j].estado === 'pendente') return selecionarHora(j);
      }
    }, 1600);
  }

  $('hora-ant').onclick = () => { SOM.clique(); selecionarHora(atual - 1); };
  $('hora-prox').onclick = () => { SOM.clique(); selecionarHora(atual + 1); };
  $('horas').onclick = (e) => {
    const b = e.target.closest('.hora'); if (!b) return;
    SOM.clique(); selecionarHora(Number(b.dataset.i));
  };
  document.addEventListener('keydown', (e) => {
    if (!$('tela-jogo').classList.contains('ativa') || !$('modal-agenda').hidden || !$('modal-sair').hidden) return;
    if (e.key === 'ArrowLeft') selecionarHora(atual - 1);
    if (e.key === 'ArrowRight') selecionarHora(atual + 1);
  });

  // ---------- Agenda (popup no idioma de origem) ----------
  function abrirAgenda() {
    SOM.clique();
    agendaJaAberta = true; agendaNaHora = true;
    clearTimeout(lembreteTimer);
    marcarAgenda(null);
    if ($('balao-jogo').classList.contains('lembrete')) desenharHora();
    const o = origem();
    const feito = o === 'pt' ? 'feito' : 'done';
    $('agenda-titulo').textContent = `📒 ${o === 'pt' ? 'Agenda da' : 'Agenda:'} ${personagem.nome}`;
    $('lista-agenda').innerHTML = horas.map((h, i) => `
      <li class="${h.estado}${i === atual ? ' atual' : ''}">
        <span class="agenda-hora">${horaTexto(h.hora)}</span>
        <span class="agenda-ativ" lang="${o === 'en' ? 'en' : 'pt-BR'}">${seguro(h.ativ.certa[o])}</span>
        <span class="agenda-marca">${h.estado === 'certo' ? `✓ ${feito}` : h.estado === 'errado' ? '✗' : ''}</span>
      </li>`).join('');
    $('modal-agenda').hidden = false;
    $('fechar-agenda').focus();
  }
  function fecharAgenda() { $('modal-agenda').hidden = true; $('btn-agenda').focus({ preventScroll: true }); }
  $('btn-agenda').onclick = abrirAgenda;
  $('btn-agenda-grande').onclick = abrirAgenda;
  $('fechar-agenda').onclick = fecharAgenda;
  $('modal-agenda').onclick = (e) => { if (e.target === $('modal-agenda')) fecharAgenda(); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('modal-agenda').hidden) fecharAgenda(); });

  // ---------- Sair da partida ----------
  function pedirSair() {
    if (encerrada) return;
    SOM.clique();
    pausaInicio = Date.now();
    clearTimeout(lembreteTimer);
    $('modal-agenda').hidden = true;
    $('modal-sair').hidden = false;
    $('sair-continuar').focus();
  }
  function continuar() {
    if (!pausaInicio) return;
    // o tempo parado não conta nem para a partida nem para o bônus da hora
    const parado = Date.now() - pausaInicio;
    inicio += parado; inicioHora += parado;
    pausaInicio = 0;
    $('modal-sair').hidden = true;
    if (!agendaNaHora) agendarLembrete();
    $('btn-sair').focus({ preventScroll: true });
  }
  function sair() {
    encerrada = true;
    pausaInicio = 0;
    clearInterval(relogioTimer);
    clearTimeout(proximaTimer);
    clearTimeout(lembreteTimer);
    pararVoz();
    $('modal-sair').hidden = true;
    mostrar('tela-modo');
  }
  $('btn-sair').onclick = pedirSair;
  $('sair-continuar').onclick = continuar;
  $('sair-confirmar').onclick = () => { SOM.clique(); sair(); };
  $('modal-sair').onclick = (e) => { if (e.target === $('modal-sair')) continuar(); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('modal-sair').hidden) continuar(); });

  // ---------- 7. Fim ----------
  let resultado = null;

  function fimDaPartida() {
    if (encerrada) return;
    encerrada = true;
    clearInterval(relogioTimer);
    clearTimeout(proximaTimer);
    clearTimeout(lembreteTimer);
    $('modal-agenda').hidden = true;
    $('modal-sair').hidden = true;
    pausaInicio = 0;
    const tempo = Math.min(DURACAO, Math.round(decorrido()));
    const acertos = horas.filter((h) => h.estado === 'certo').length;
    const erros = horas.length - acertos;   // erradas + sem resposta
    const pontos = Math.max(0, PONTOS_INICIAIS - erros * PENALIDADE + horas.reduce((s, h) => s + h.bonus, 0));
    resultado = { aluno, modo, nivel, personagem, horas, tempo, acertos, erros, pontos, data: new Date() };

    $('fim-titulo').textContent = tempo >= DURACAO && horas.some((h) => h.estado === 'pendente') ? "Time's up! ⏰" : 'End of the day! 🌙';
    $('fim-pontos').textContent = pontos;
    $('fim-acertos').textContent = `${acertos}/${horas.length}`;
    $('fim-erros').textContent = erros;
    $('fim-tempo').textContent = tempo + 's';
    $('fim-texto').textContent = acertos === horas.length
      ? `Perfect day, ${aluno}! Você acertou todas as horas!`
      : acertos >= 5 ? `Well done, ${aluno}! Confira a correção e baixe o seu relatório.`
        : `Keep practicing, ${aluno}! Estude a correção e jogue de novo.`;
    sprite('sprite-fim', acertos >= 5 ? 'festa' : 'ideia');
    desenharCorrecao();
    mostrar('tela-fim');
    SOM.vitoria();
    if (acertos >= 5) soltarConfete();
  }

  const situacaoTexto = (h) => (h.estado === 'certo' ? 'Acertou' : h.estado === 'errado' ? 'Errou' : 'Não respondeu');

  function desenharCorrecao() {
    const r = resultado, o = origem(), d = destino();
    $('relatorio-info').innerHTML = `<b>Aluno:</b> ${seguro(r.aluno)} · <b>Personagem:</b> ${seguro(r.personagem.nome)} · `
      + `<b>Modo:</b> ${NOME_MODO[r.modo]} · <b>Nível:</b> ${NOME_NIVEL[r.nivel]}`;
    $('tabela-correcao').innerHTML = `
      <thead><tr><th>Hora</th><th>Agenda</th><th>Sua resposta</th><th>Resposta certa</th><th>Situação</th></tr></thead>
      <tbody>${r.horas.map((h) => `
        <tr class="${h.estado}">
          <td class="c-hora">${horaTexto(h.hora)}</td>
          <td>${seguro(h.ativ.certa[o])}</td>
          <td class="c-resp">${h.escolha ? seguro(h.escolha[d]) : '—'}</td>
          <td class="c-certa">${seguro(h.ativ.certa[d])}</td>
          <td class="c-sit">${h.estado === 'certo' ? '✓' : h.estado === 'errado' ? '✗' : '⏱'} ${situacaoTexto(h)}</td>
        </tr>`).join('')}</tbody>`;
  }

  function soltarConfete() {
    const c = $('confete');
    c.innerHTML = '';
    const itens = ['⭐', '🎉', '✨', '🇺🇸', '🇬🇧', '🇨🇦'];
    for (let i = 0; i < 36; i++) {
      const s = document.createElement('span');
      s.textContent = sortear(itens);
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDuration = 2 + Math.random() * 2.5 + 's';
      s.style.animationDelay = Math.random() * 0.8 + 's';
      c.append(s);
    }
    setTimeout(() => { c.innerHTML = ''; }, 5500);
  }

  // ---------- Relatório em PDF (gerado no próprio aparelho) ----------
  // as fontes padrão do PDF não têm emoji nem setas: troca/remove o que não for latino
  const paraPDF = (t) => String(t).replace(/→/g, '->').replace(/[^\u0000-ÿ]/g, '').replace(/\s+/g, ' ').trim();
  const nomeArquivo = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

  function imagemComoDataURL(src) {
    return new Promise((ok, falha) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        try { ok({ url: c.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight }); } catch (e) { falha(e); }
      };
      img.onerror = falha;
      img.src = src;
    });
  }

  async function baixarPDF() {
    if (!resultado) return;
    const lib = window.jspdf;
    if (!lib || !lib.jsPDF) { window.print(); return; }
    const r = resultado;
    const o = r.modo === 'pt-en' ? 'pt' : 'en', d = o === 'pt' ? 'en' : 'pt';
    const doc = new lib.jsPDF({ unit: 'mm', format: 'a4' });
    const AZUL = [31, 42, 107], VERM = [200, 32, 47], TEXTO = [30, 34, 60], CINZA = [110, 116, 140];
    const VERDE = [30, 120, 70];
    const L = 16, LARG = 210 - 2 * L, FIM = 280;
    let y = 16;

    const novaPagina = (altura) => { if (y + altura > FIM) { doc.addPage(); y = 20; return true; } return false; };
    const paragrafo = (texto, tam = 11, estilo = 'normal', cor = TEXTO) => {
      doc.setFont('helvetica', estilo); doc.setFontSize(tam); doc.setTextColor(...cor);
      for (const l of doc.splitTextToSize(paraPDF(texto), LARG)) { novaPagina(tam * 0.5); doc.text(l, L, y); y += tam * 0.45; }
    };
    const titulo = (texto) => { novaPagina(16); y += 3; paragrafo(texto, 15, 'bold', AZUL); y += 1; };

    // tabela com quebra de linha nas células; colunas = [{ titulo, larg }]
    function tabela(colunas, linhas, corDaLinha) {
      const TAM = 9.5, LH = 4.2, PAD = 2;
      const cabecalho = () => {
        doc.setFillColor(...AZUL); doc.rect(L, y, LARG, 7.5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(TAM); doc.setTextColor(255, 255, 255);
        let x = L;
        for (const c of colunas) { doc.text(c.titulo, x + PAD, y + 5); x += c.larg; }
        y += 7.5;
      };
      novaPagina(20); cabecalho();
      linhas.forEach((celulas, i) => {
        doc.setFontSize(TAM);
        const estilos = celulas.map((_, k) => (corDaLinha ? corDaLinha(i, k) : null));
        // quebra cada célula com a fonte em que ela será escrita (negrito ocupa mais espaço)
        const partes = celulas.map((t, k) => {
          doc.setFont('helvetica', estilos[k] ? estilos[k].fonte : 'normal');
          return doc.splitTextToSize(paraPDF(t), colunas[k].larg - 2 * PAD);
        });
        const alt = Math.max(...partes.map((p) => p.length)) * LH + 2 * PAD - 1;
        if (y + alt > FIM) { doc.addPage(); y = 20; cabecalho(); }
        if (i % 2 === 0) { doc.setFillColor(238, 241, 250); doc.rect(L, y, LARG, alt, 'F'); }
        let x = L;
        partes.forEach((p, k) => {
          const estilo = estilos[k];
          doc.setFont('helvetica', estilo ? estilo.fonte : 'normal');
          doc.setTextColor(...(estilo ? estilo.cor : TEXTO));
          doc.text(p, x + PAD, y + PAD + 3);
          x += colunas[k].larg;
        });
        y += alt;
      });
      y += 4;
    }

    // cabeçalho com a marca
    try {
      const logo = await imagemComoDataURL('assets/marca.png');
      doc.addImage(logo.url, 'PNG', L, y - 4, 24, 24 * logo.h / logo.w, undefined, 'FAST');
    } catch (e) { /* sem logo */ }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(...AZUL);
    doc.text('My Day - Relatório', L + 30, y + 6);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(...CINZA);
    doc.text('English Academy - rotina diária em inglês', L + 30, y + 13);
    y += 26;
    doc.setDrawColor(...VERM); doc.setLineWidth(0.7); doc.line(L, y, L + LARG, y); y += 8;

    // Parte 1: desempenho
    paragrafo(`Aluno: ${r.aluno}`, 13, 'bold');
    paragrafo(`Data: ${r.data.toLocaleDateString('pt-BR')}`, 11);
    paragrafo(`Personagem: ${r.personagem.nome}    Modo: ${NOME_MODO[r.modo]}    Nível: ${NOME_NIVEL[r.nivel]}`, 11);
    paragrafo(`Tempo usado: ${r.tempo} s de ${DURACAO} s    Pontuação: ${r.pontos} pontos`, 11, 'bold', VERM);
    paragrafo(`Acertos: ${r.acertos}    Erros: ${r.erros} (inclui horas sem resposta)`, 11);

    titulo('Parte 1 - Desempenho hora a hora');
    tabela(
      [{ titulo: 'Hora', larg: 16 }, { titulo: 'Atividade', larg: 46 }, { titulo: 'Sua resposta', larg: 46 }, { titulo: 'Resposta certa', larg: 46 }, { titulo: 'Situação', larg: LARG - 154 }],
      r.horas.map((h) => [horaTexto(h.hora), h.ativ.certa[o], h.escolha ? h.escolha[d] : '-', h.ativ.certa[d], situacaoTexto(h)]),
      (i, k) => {
        const h = r.horas[i];
        if (k === 3) return { fonte: 'bold', cor: VERDE };
        if (k === 2 && h.estado === 'errado') return { fonte: 'normal', cor: VERM };
        if (k === 4) return { fonte: 'bold', cor: h.estado === 'certo' ? VERDE : VERM };
        return null;
      }
    );

    // Parte 2: estudo
    titulo(`Parte 2 - Estudo: a rotina de ${r.personagem.nome}`);
    tabela(
      [{ titulo: 'Hora', larg: 16 }, { titulo: 'Português', larg: (LARG - 16) / 2 }, { titulo: 'English', larg: (LARG - 16) / 2 }],
      r.horas.map((h) => [horaTexto(h.hora), h.ativ.certa.pt, h.ativ.certa.en]),
      (i, k) => (k === 2 ? { fonte: 'bold', cor: AZUL } : null)
    );

    if (PDF_COM_ERRADAS) {
      titulo('Frases parecidas: as alternativas erradas traduzidas');
      paragrafo('Compare com a frase certa e veja o detalhe que muda o sentido.', 10, 'italic', CINZA);
      y += 2;
      const linhas = [];
      r.horas.forEach((h) => {
        linhas.push([horaTexto(h.hora), `CERTA: ${h.ativ.certa.en}`, h.ativ.certa.pt]);
        h.ativ.erradas.forEach((e) => linhas.push(['', e.en, e.pt]));
      });
      tabela(
        [{ titulo: 'Hora', larg: 16 }, { titulo: 'English', larg: (LARG - 16) / 2 }, { titulo: 'Português', larg: (LARG - 16) / 2 }],
        linhas,
        (i, k) => (linhas[i][0] ? (k ? { fonte: 'bold', cor: VERDE } : { fonte: 'bold', cor: TEXTO }) : (k === 1 ? { fonte: 'normal', cor: VERM } : null))
      );
    }

    // rodapé
    const paginas = doc.getNumberOfPages();
    for (let i = 1; i <= paginas; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...CINZA);
      doc.text('My Day - English Academy - © Marco Nunes - Todos os direitos reservados', L, 290);
      doc.text(`${i}/${paginas}`, L + LARG, 290, { align: 'right' });
    }
    doc.save(`my-day-${nomeArquivo(r.aluno)}-${nomeArquivo(r.personagem.nome)}.pdf`);
  }

  // ---------- Botões do fim ----------
  $('btn-pdf').onclick = () => { baixarPDF().catch(() => window.print()); };
  $('btn-repetir').onclick = () => { SOM.clique(); comecar(); };
  $('btn-menu').onclick = () => { SOM.clique(); mostrar('tela-modo'); };

  // ---------- Instalar como app ----------
  let pedidoInstalacao = null;
  const rodandoComoApp = () => matchMedia('(display-mode: standalone)').matches
    || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    pedidoInstalacao = e;
    $('btn-instalar').hidden = false;
  });
  window.addEventListener('appinstalled', () => { pedidoInstalacao = null; $('btn-instalar').hidden = true; });
  if (!rodandoComoApp()) $('btn-instalar').hidden = false;
  $('btn-instalar').onclick = async () => {
    if (pedidoInstalacao) {
      pedidoInstalacao.prompt();
      const { outcome } = await pedidoInstalacao.userChoice;
      pedidoInstalacao = null;
      if (outcome === 'accepted') $('btn-instalar').hidden = true;
      return;
    }
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    const dentroDeApp = /FBAN|FBAV|Instagram|WhatsApp|Line\//i.test(ua);
    const passos = ios
      ? ['Abra este link no <b>Safari</b>.', 'Toque em <b>Compartilhar</b> (quadrado com a seta ⬆).', 'Escolha <b>Adicionar à Tela de Início</b>.', 'Abra pelo <b>ícone do jogo</b>.']
      : ['Abra este link no <b>Google Chrome</b> (não dentro do WhatsApp ou Instagram).', 'Toque em <b>⋮</b> no canto de cima.', 'Toque em <b>Instalar app</b> (ou <b>Adicionar à tela inicial → Instalar</b>).', 'Abra pelo <b>ícone do jogo</b> na tela do celular.'];
    if (dentroDeApp) passos.unshift('⚠ Você abriu pelo navegador de outro app, que não instala jogos. Toque em <b>⋮ → Abrir no navegador</b>.');
    $('passos-instalar').innerHTML = passos.map((p) => `<li>${p}</li>`).join('');
    mostrar('tela-instalar');
  };
  $('btn-fechar-instalar').onclick = telaNome;

  telaNome();
})();
