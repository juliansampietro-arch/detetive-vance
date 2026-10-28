// ============================================================
// Bixiga: o bairro boêmio de Neo-Sampa. Sobrados antigos, cantinas, a festa da Achiropita,
// a escola de samba e a escadaria. Cidade aberta como o Sector 4; aqui ficam o Bar do Zé do Tubo
// e o Clube 14 Bis. Só existe no caso 2.
// ============================================================

const BIXIGA_LINES = EXTRA_LINES.bixiga.concat(['A festa da Achiropita é a única coisa que a chuva ácida não cancela.', 'Aqui no Bixiga os prédios são baixos. Lá da Paulista, a gente parece um tapete.', 'A Vai-Vem ensaia toda sexta. O surdo faz tremer até o implante.', 'Minha nonna dizia que a massa tem que ser feita à mão. A impressora dela discorda.', 'O Clube 14 Bis abre à meia-noite. A fila começa às dez.', 'Cuidado na escadaria quando chove. Já perdi dois dentes e um implante ali.', 'O Zé do Tubo serve café desde antes de eu nascer. E eu tenho setenta.', 'Lá em cima, na torre, eles compram eternidade. Aqui embaixo a gente compra pizza.']);

const BIXIGA_SHOPS = [
  { sign: 'CANTINA', col: '#ff6a2a', name: 'Cantina Nonna Lúcia', vendor: 'ramen_bar', info: 'Toalhas xadrez, garrafas de vinho viradas em velas e uma nonna holográfica que grita "MANGIA!" a cada cliente.' },
  { sign: 'PIZZARIA', col: '#ffd23f', name: 'Pizzaria Forno Velho', vendor: 'ramen_bar', info: 'Forno a lenha de verdade, o último do distrito. A fumaça é ilegal; a pizza, também deveria ser.' },
  { sign: 'BRECHÓ', col: '#b04cff', name: 'Brechó da Saudade', info: 'Roupas de 2040, discos de vinil e implantes vintage. Tudo cheira a naftalina e a nostalgia.' },
  { sign: 'SEBO', col: '#7dff6b', name: 'Sebo Papel e Tinta', info: 'Livros de papel, empilhados até o teto. O dono jura que todos foram lidos pelo menos uma vez.' },
  { sign: 'BOTECO', col: '#ff8a3d', name: 'Boteco do Nino', vendor: 'bar_rua', info: 'Um balcão de mármore rachado, cerveja gelada e uma TV passando reprise de jogo de 2026.' },
];

CITIES.city_bixiga = buildCity({
  id: 'city_bixiga', roomId: 'city_bixiga', seed: 1914, label: 'Bixiga', walkers: 50, cars: 14,
  vNames: ['Rua 13 de Maio', 'Rua dos Italianos', 'Rua Rui Barbosa', 'Rua Conselheiro Carrão', 'Rua Santo Antônio', 'Rua Major Diogo', 'Rua Manuel Dutra'],
  hNames: ['Rua Avanhandava', 'Rua Fortaleza', 'Rua Treze de Maio', 'Rua Almirante Marques', 'Rua Jandaia', 'Rua Una', 'Rua Abolição'],
  lines: BIXIGA_LINES, looks: ['bixiga1', 'bixiga2', 'ped1', 'ped3', 'ped6', 'ped7', 'raver1', 'raver3', 'minhoca2'],
  names: ['Morador do Bixiga', 'Sambista', 'Pizzaiolo', 'Frequentador do 14 Bis', 'Nonna', 'Estudante', 'Músico de rua', 'Taxista'],
  liveries: [
    { main: '#8a7a2a', second: '#3a3418', under: '#18160a', metal: '#3a3a30', glass: '#1a1a14', accent: '#ffd23f', model: 'sedan' },
    { main: '#5a1a1a', second: '#3a0e0e', under: '#140808', metal: '#3a2a2a', glass: '#140a0a', accent: '#ff6a2a', model: 'coupe' },
    { main: '#2a4a3a', second: '#1a3026', under: '#0e1a14', metal: '#2a3a30', glass: '#0a1a14', accent: '#7dff6b', model: 'sedan' },
  ],
  build({ B, O, set, shop, door, T, rnd, pick, GENERIC_SHOPS, buildings }) {
    const SHOPS = BIXIGA_SHOPS.concat(GENERIC_SHOPS.filter(s => ['RAMEN 24H', 'FARMÁCIA', 'PENHORES', 'BAR', 'LAVANDERIA', 'TATUAGEM', 'FLORES', '24-ELEVEN', 'KOLA-KOLA', 'ARCADE'].includes(s.sign)));
    const yard = (X0, Y0) => { for (let y = Y0; y < Y0 + 6; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, T.PLAZA); };
    const front = (X0, Y0, d) => { for (let y = Y0 + d; y < Y0 + 6; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, T.PLAZA); };
    const blockType = (bi, bj) => {
      if (bi === 2 && bj === 2) return 'station';
      if (bi === 1 && bj === 2) return 'ze';
      if (bi === 3 && bj === 1) return 'clube';
      if (bi === 2 && bj === 3) return 'festa';
      if (bi === 1 && bj === 4) return 'samba';
      if (bi === 4 && bj === 2) return 'escadaria';
      if ((bi === 0 && bj === 0) || (bi === 5 && bj === 5)) return 'praca';
      return 'gen';
    };
    for (let bj = 0; bj < 6; bj++) for (let bi = 0; bi < 6; bi++) {
      const X0 = bi * 10 + 3, Y0 = bj * 10 + 3, type = blockType(bi, bj);
      if (type === 'gen') {
        // sobrados baixos e coloridos, quase todos com comércio no térreo
        const layout = Math.floor(rnd() * 3);
        const parts = layout === 0 ? [[0, 0, 3, 6], [3, 0, 3, 6]] : layout === 1 ? [[0, 0, 3, 3], [3, 0, 3, 3], [0, 3, 3, 3], [3, 3, 3, 3]] : [[0, 0, 6, 3], [0, 3, 3, 3], [3, 3, 3, 3]];
        for (const [ox, oy, w, d] of parts) {
          const hr = rnd(), tall = hr > 0.9, h = tall ? 60 + Math.floor(hr * 40) : 18 + Math.floor(hr * 26);
          const b = B(X0 + ox, Y0 + oy, w, d, h, tall ? 'tower' : 'low', { col: pick(['#5a2a2a', '#2a4a3a', '#5a4a2a', '#3a2a4a', '#6a3a1a', '#2a3a5a', '#5a2a4a']) });
          if (oy + d === 6 && rnd() < 0.9) { const s = pick(SHOPS); shop(b, 0, 0.3, w - 0.3, { ...s, key: 'lojab_' + buildings.length + '_0' }); }
          if (ox + w === 6 && rnd() < 0.6) { const s = pick(SHOPS); shop(b, 1, 0.3, d - 0.3, { ...s, key: 'lojab_' + buildings.length + '_1' }); }
        }
      } else if (type === 'station') {
        yard(X0, Y0);
        O({ kind: 'tram_stop', x: X0 + 2, y: Y0 + 2, solid: true, key: 'estacao_aerotrem', name: 'Estação do aerotrem — Bixiga' });
        O({ kind: 'kiosk', x: X0, y: Y0 + 5, solid: true, key: 'banca_bixiga', name: 'Banca de notícias', col: '#ffd23f', info: 'Manchetes: "FESTA DA ACHIROPITA RESISTE À CHUVA ÁCIDA PELO 160º ANO". "CLUBE 14 BIS É INVESTIGADO POR LAVAGEM DE DINHEIRO (DE NOVO)".' });
        O({ kind: 'bench', x: X0 + 1, y: Y0 + 4, solid: true, key: 'banco', name: 'Banco da estação', seat: true });
        O({ kind: 'bench', x: X0 + 4, y: Y0 + 4, solid: true, key: 'banco', name: 'Banco da estação', seat: true });
        O({ kind: 'phone', x: X0 + 5, y: Y0, solid: true, key: 'orelhao_bixiga', name: 'Cabine holográfica', info: 'Uma cabine coberta de adesivos de escola de samba. Alguém escreveu: "VAI-VEM, MEU AMOR".' });
        O({ kind: 'lamp_post', x: X0 + 3, y: Y0 + 5, light: { z: 30, r: 60, color: '#ffd8a0' } });
      } else if (type === 'ze') {
        B(X0, Y0, 6, 3, 22, 'low', { col: '#5a3a1a', sign: 'BAR DO ZÉ DO TUBO', signCol: '#ffd23f' });
        front(X0, Y0, 3);
        door(X0 + 2, Y0 + 3, 'ns_zetubo', [2, 1], 'Bar do Zé do Tubo');
        O({ kind: 'table', x: X0 + 4, y: Y0 + 4, solid: true, key: 'mesa_calcada_ze', name: 'Mesa na calçada', info: 'Mesa de lata com dois copos americanos e um tabuleiro de dama. Ninguém mexe: é do Seu Juca.' });
        O({ kind: 'bench', x: X0, y: Y0 + 4, solid: true, key: 'banco', name: 'Banco', seat: true });
        O({ kind: 'lamp_post', x: X0 + 5, y: Y0 + 5, light: { z: 30, r: 60, color: '#ffd8a0' } });
      } else if (type === 'clube') {
        B(X0, Y0, 6, 3, 30, 'low', { col: '#1a0e24', sign: 'CLUBE 14 BIS', signCol: '#ff4fd8' });
        front(X0, Y0, 3);
        door(X0 + 2, Y0 + 3, 'ns_clube', [2, 1], 'Clube 14 Bis');
        O({ kind: 'holo_ad', x: X0 + 5, y: Y0 + 3, solid: true, key: 'anuncio_clube', name: 'Anúncio holográfico', text: '14 BIS', col: '#ff4fd8', info: '"CLUBE 14 BIS: A PROVÍNCIA DOS DRONES. Entrada só com nome na lista ou crédito na conta."' });
        for (const x of [X0, X0 + 1]) O({ kind: 'bollard', x, y: Y0 + 4, solid: true });
      } else if (type === 'festa') {
        // a festa da Achiropita: a igreja, barracas de comida e varais de luz atravessando a praça
        B(X0, Y0, 6, 2, 64, 'low', { col: '#d8c8a8', sign: 'ACHIROPITA', signCol: '#ffd23f' });
        front(X0, Y0, 2);
        O({ kind: 'shrine', x: X0 + 2, y: Y0 + 2, solid: true, key: 'altar_achiropita', name: 'Altar de Nossa Senhora Achiropita', info: 'Velas, flores de plástico e fitas coloridas. A santa protege o bairro desde 1908. A chuva ácida ela ainda está estudando.' });
        O({ kind: 'stall', x: X0, y: Y0 + 3, w: 2, d: 1, solid: true, goods: 'dumpling', col: '#c8202a', sign: 'FOGAZZA', key: 'barraca_fogazza', name: 'Barraca de fogazza', vendor: 'ramen_bar', info: 'Fogazza de calabresa frita na hora. A fila dá a volta no quarteirão.', light: { z: 26, r: 50, color: '#ffb347' } });
        O({ kind: 'stall', x: X0 + 4, y: Y0 + 3, w: 2, d: 1, solid: true, goods: 'fruit', col: '#2a6a3a', sign: 'VINHO', key: 'barraca_vinho', name: 'Barraca de vinho quente', vendor: 'bar_rua', info: 'Vinho quente com canela, servido em copo de papel. Esquenta a alma e o implante.', light: { z: 26, r: 50, color: '#ff8a3d' } });
        for (const y of [Y0 + 2, Y0 + 5]) O({ kind: 'lantern_line', x: X0, y, w: 6, d: 1, axis: 'x', col: y % 2 ? '#ffd23f' : '#ff3355' });
        O({ kind: 'table', x: X0 + 2, y: Y0 + 5, solid: true, key: 'mesa_festa', name: 'Mesa comunitária', info: 'Uma mesa comprida onde estranhos dividem pizza, vinho e opinião sobre futebol.' });
        O({ kind: 'table', x: X0 + 3, y: Y0 + 5, solid: true, key: 'mesa_festa', name: 'Mesa comunitária', info: 'Uma mesa comprida onde estranhos dividem pizza, vinho e opinião sobre futebol.' });
      } else if (type === 'samba') {
        B(X0, Y0, 6, 3, 26, 'low', { col: '#1a4a2a', sign: 'ESCOLA DE SAMBA VAI-VEM', signCol: '#7dff6b' });
        front(X0, Y0, 3);
        O({ kind: 'banner', x: X0, y: Y0 + 3, text: 'VAI-VEM', col: '#1a6a2a', key: 'estandarte_samba', name: 'Estandarte da Vai-Vem', info: 'Preto e branco, com uma coroa bordada em dourado. "Campeã do carnaval de 2083." Ninguém fala de 2084.' });
        O({ kind: 'banner', x: X0 + 5, y: Y0 + 3, text: 'SAMBA', col: '#1a1a1a', key: 'estandarte_samba', name: 'Estandarte da Vai-Vem', info: 'Lá dentro, o surdo marca o ritmo do ensaio. O chão da calçada vibra junto.' });
        O({ kind: 'speaker', x: X0 + 2, y: Y0 + 4, solid: true, key: 'caixa_samba', name: 'Caixa de som da quadra', info: 'Toca samba-enredo em volume que a prefeitura considera "patrimônio cultural".' });
      } else if (type === 'escadaria') {
        // a escadaria do Bixiga: degraus de pedra, plantas e música
        for (let y = Y0; y < Y0 + 6; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, (x === X0 || x === X0 + 5) ? T.GRASS : T.PLAZA);
        for (let k = 0; k < 5; k++) O({ kind: 'bench', x: X0 + 1 + (k % 2) * 3, y: Y0 + k + (k > 2 ? 1 : 0), solid: true, key: 'degrau', name: 'Escadaria do Bixiga', seat: true, info: 'Degraus de pedra gastos por dois séculos de gente subindo e descendo. Hoje são arquibancada, sala e palco.' });
        O({ kind: 'planter', x: X0, y: Y0 + 2, solid: true, key: 'canteiro_escadaria', name: 'Canteiro', info: 'Manjericão de verdade, plantado pela nonna do número 42. Ai de quem arrancar.' });
        O({ kind: 'lamp_post', x: X0 + 3, y: Y0 + 2, light: { z: 30, r: 60, color: '#ffd8a0' } });
      } else if (type === 'praca') {
        yard(X0, Y0);
        O({ kind: 'tree', x: X0 + 1, y: Y0 + 1, solid: true, key: 'arvore_bixiga', name: 'Árvore', info: 'Uma árvore velha com um balanço de pneu pendurado. As crianças do bairro disputam a vez.', col: '#2a4a2a', glow: '#7dff6b' });
        O({ kind: 'tree', x: X0 + 4, y: Y0 + 4, solid: true, key: 'arvore_bixiga', name: 'Árvore', info: 'Uma árvore velha com um balanço de pneu pendurado. As crianças do bairro disputam a vez.', col: '#2a4a2a', glow: '#7dff6b' });
        O({ kind: 'mahjong', x: X0 + 3, y: Y0 + 1, solid: true, key: 'mesa_dama', name: 'Mesa de dama', info: 'Dois senhores jogam dama há tanto tempo que ninguém lembra quem está ganhando.' });
        O({ kind: 'bench', x: X0 + 1, y: Y0 + 4, solid: true, key: 'banco', name: 'Banco da praça', seat: true });
        O({ kind: 'fountain', x: X0 + 2, y: Y0 + 2, w: 1, d: 1, solid: true, key: 'bebedouro_praca', name: 'Chafariz antigo', info: 'Um chafariz de ferro fundido de 1920. Não sai água há décadas, mas alguém pintou de novo.', light: { z: 10, r: 40, color: '#ffd8a0' } });
      }
    }
  },
});

const CB = CITIES.city_bixiga;
ROOMS.city_bixiga = {
  name: 'Bixiga', w: CB.N, h: CB.N, city: true, cityObj: CB, outdoor: true, dark: 0.5, neon: '#ffb347', floor: 'city',
  lights: [], objects: CB.objects, npcs: CB.npcs, walkers: CB.walkers, spawn: [25, 28],
};
CITY_DESTS.city_bixiga = {
  bx_estacao: { name: 'Estação do aerotrem — Bixiga', short: 'Estação', door: CB.map(25, 28), color: '#38f6ff', icon: 'A' },
  bx_ze:      { name: 'Bar do Zé do Tubo', short: 'Bar do Zé', door: CB.map(15, 26), color: '#ffd23f', icon: 'Z' },
  bx_clube:   { name: 'Clube 14 Bis', short: '14 Bis', door: CB.map(35, 16), color: '#ff4fd8', icon: '14' },
  bx_festa:   { name: 'Festa da Achiropita', short: 'Achiropita', door: CB.map(25, 35), color: '#ff8a3d', icon: '✝' },
  bx_samba:   { name: 'Escola de Samba Vai-Vem', short: 'Vai-Vem', door: CB.map(15, 46), color: '#7dff6b', icon: '♫' },
  bx_escada:  { name: 'Escadaria do Bixiga', short: 'Escadaria', door: CB.map(45, 28), color: '#b04cff', icon: 'E' },
};
GPS_ALWAYS.push(...Object.keys(CITY_DESTS.city_bixiga));
GPS_HOME.push('bx_estacao');
