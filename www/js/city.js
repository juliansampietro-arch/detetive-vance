// ============================================================
// Sector 4: a cidade aberta, explorada a pé ou de carro (mesma câmera e HUD)
// Quarteirões de 6x6 cercados por calçadas largas (2 tiles) e ruas de 3 faixas; as duas ruas
// que passam na frente e ao lado do hotel são avenidas de 6 faixas. Chinatown ocupa 2x2
// quarteirões, com ruas só para pedestres (nenhum carro entra), portais, lanternas e barracas.
//
// O conteúdo (prédios, lojas, objetos, pessoas) é descrito numa planta "compacta" de 62x62
// (ruas de 2 tiles a cada 10, calçada de 1) e convertido para a grade real por map().
// ============================================================

function buildCity(def) {
  const tr = (...a) => window.T(...a);   // tradução (o nome T aqui é o tipo de tile)
  const T = { ROAD: 1, CROSS: 2, WALK: 3, PLAZA: 4, GRASS: 5, CTWALK: 6, CTSTREET: 7, BLD: 8 };
  const S = 2;                                     // largura das calçadas
  const RW = [3, 3, 6, 3, 3, 3, 3];                // largura das ruas (índice 2 = avenida do hotel)
  const roadStart = [], intStart = [];
  { let p = 0; for (let i = 0; i < 7; i++) { roadStart[i] = p; p += RW[i]; if (i < 6) { intStart[i] = p + S; p += S + 6 + S; } } }
  const N = roadStart[6] + RW[6];
  // tipo de cada coluna/linha: índice da rua, ou -1 (calçada / miolo)
  const roadIdx = new Int8Array(N).fill(-1), walkIdx = new Int8Array(N).fill(-1);
  for (let i = 0; i < 7; i++) for (let k = 0; k < RW[i]; k++) roadIdx[roadStart[i] + k] = i;
  for (let i = 0; i < 6; i++) for (let k = 0; k < S; k++) { walkIdx[intStart[i] - 1 - k] = i; walkIdx[intStart[i] + 6 + k] = i; }

  // planta compacta (62x62) → grade real
  const m1 = v => {
    const f = v - Math.floor(v), x = Math.floor(v), i = Math.min(6, Math.floor(x / 10)), r = x - i * 10;
    let n;
    if (r === 0) n = roadStart[i];
    else if (r === 1) n = roadStart[i] + RW[i] - 1;
    else if (r === 2) n = intStart[i] - 1;
    else if (r === 9) n = intStart[i] + 6;
    else n = intStart[i] + r - 3;
    return n + f;
  };
  const span = (v, len) => m1(v + len - 1) - m1(v) + 1;     // largura convertida de um objeto com tamanho
  const map = (x, y) => [m1(x), m1(y)];

  const grid = new Uint8Array(N * N);
  const inside = (x, y) => x >= 0 && y >= 0 && x < N && y < N;
  const tile = (x, y) => inside(x, y) ? grid[y * N + x] : 0;
  const setR = (x, y, v) => { if (inside(x, y)) grid[y * N + x] = v; };
  // Chinatown: quarteirões 3 e 4 nos dois eixos, com as calçadas em volta
  const CT = { x0: intStart[3] - S, y0: intStart[3] - S, x1: intStart[4] + 6 + S - 1, y1: intStart[4] + 6 + S - 1 };
  const inCT = def.ct ? (x, y) => x >= CT.x0 && x <= CT.x1 && y >= CT.y0 && y <= CT.y1 : () => false;
  const V_NAMES = def.vNames || ['Rua Neon', 'Rua Kowloon', 'Av. Alvorada Norte', 'Rua Halcyon', 'Rua Lótus', 'Rua do Ferro', 'Rua Aurora'];
  const H_NAMES = def.hNames || ['Av. Chuva Ácida', 'Av. Distrito 4', 'Av. Alvorada', 'Av. do Dragão', 'Av. dos Drones', 'Av. Corporativa', 'Av. Porto'];

  let seed = def.seed || 4242;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const pick = a => a[Math.floor(rnd() * a.length)];

  // ---------- piso ----------
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const rx = roadIdx[x] >= 0, ry = roadIdx[y] >= 0;
    let v;
    if (rx || ry) {
      v = T.ROAD;
      if (rx && !ry && walkIdx[y] >= 0) v = T.CROSS;      // faixa de pedestres: a calçada atravessa a rua
      if (ry && !rx && walkIdx[x] >= 0) v = T.CROSS;
    } else v = (walkIdx[x] >= 0 || walkIdx[y] >= 0) ? T.WALK : T.PLAZA;
    if (inCT(x, y)) {
      if (roadIdx[x] === 4 || roadIdx[y] === 4) v = T.CTSTREET;
      else if (v === T.WALK) v = T.CTWALK;
    }
    // faixas onde as ruas de Chinatown cruzam as avenidas de fora
    if (roadIdx[x] === 4 && (roadIdx[y] === 3 || roadIdx[y] === 5)) v = T.CROSS;
    if (roadIdx[y] === 4 && (roadIdx[x] === 3 || roadIdx[x] === 5)) v = T.CROSS;
    grid[y * N + x] = v;
  }

  // ---------- prédios, objetos e lojas (coordenadas da planta compacta) ----------
  const buildings = [], objects = [], shops = [], npcs = [];
  const set = (x, y, v) => setR(m1(x), m1(y), v);
  const B = (x0, y0, w0, d0, h, style, extra = {}) => {
    const x = m1(x0), y = m1(y0), w = span(x0, w0), d = span(y0, d0);
    const b = { x, y, w, d, h, style, col: extra.col || pick(['#1c1430', '#141c30', '#221828', '#18202a', '#201a34', '#162028']), seed: Math.floor(rnd() * 99999), shops: [], ...extra };
    buildings.push(b);
    for (let yy = y; yy < y + d; yy++) for (let xx = x; xx < x + w; xx++) setR(xx, yy, T.BLD);
    return b;
  };
  const O = o => {
    if (o.cx !== undefined) { o.cx = m1(o.cx); o.cy = m1(o.cy); }
    else {
      if (o.w) o.w = span(o.x, o.w);
      if (o.d) o.d = span(o.y, o.d);
      o.x = m1(o.x); o.y = m1(o.y);
    }
    objects.push(o); return o;
  };
  const mapArea = a => [m1(a[0]), m1(a[1]), m1(a[2]), m1(a[3])];
  const pushNpc = (...list) => { for (const n of list) { [n.x, n.y] = map(n.x, n.y); if (n.wander && n.wander.area) n.wander.area = mapArea(n.wander.area); npcs.push(n); } };
  // loja no térreo: side 0 = fachada da frente-esquerda (y = b.y + b.d), 1 = frente-direita (x = b.x + b.w)
  const shop = (b, side, u0, u1, s) => {
    const sh = { b, side, u0, u1, ...s };
    b.shops.push(sh); shops.push(sh);
    const um = Math.floor((u0 + u1) / 2);
    const [fx, fy] = side ? [b.x + b.w, b.y + um] : [b.x + um, b.y + b.d];
    sh.tile = [fx, fy];
    if (s.key) objects.push({ kind: 'shopfront', x: fx, y: fy, key: s.key, name: s.name, info: s.info, vendor: s.vendor, sign: s.sign, col: s.col });
    return sh;
  };
  const door = (x, y, to, at, name) => O({ kind: 'exit', x, y, key: 'exit', to, at, name });
  const car = (kind, cx, cy, ang, extra = {}) => O({ kind, cx, cy, ang, solid: true, ...extra });

  const GENERIC_SHOPS = [
    { sign: 'RAMEN 24H', col: '#ff8a3d', name: 'Bar de Ramen 24h', vendor: 'ramen_bar', info: 'Um balcão de seis lugares e um cozinheiro androide que nunca dorme.' },
    { sign: 'FARMÁCIA', col: '#7dff6b', name: 'Farmácia NeoVida', vendor: 'farmacia', info: 'Analgésicos, estimulantes e um holograma de pílula girando na vitrine.' },
    { sign: 'CLÍNICA CIBER', col: '#38f6ff', name: 'Clínica de Implantes', info: 'Instalação de implantes em 15 minutos. "Sem perguntas" está escrito em letras bem pequenas.' },
    { sign: 'ARCADE', col: '#ff4fd8', name: 'Fliperama Pixel', info: 'Máquinas de fliperama de verdade, de antes da rede neural. Um garoto joga sem tirar os olhos da tela.' },
    { sign: 'PENHORES', col: '#ffd23f', name: 'Casa de Penhores', info: 'Implantes usados, relógios, uma guitarra. Tudo tem preço; nada tem história.' },
    { sign: 'BAR', col: '#b04cff', name: 'Bar O Último Trago', vendor: 'bar_rua', info: 'Música baixa, luz roxa e um barman que finge não reconhecer policiais.' },
    { sign: 'LAVANDERIA', col: '#7fd8ff', name: 'Lavanderia Bolha', info: 'Máquinas girando a noite toda. Alguém dorme numa cadeira de plástico.' },
    { sign: 'NOODLES', col: '#ff3355', name: 'Noodles Express', vendor: 'ramen_bar', info: 'Um balcão estreito e vapor saindo da cozinha.' },
    { sign: 'CÁPSULAS', col: '#38a0ff', name: 'Hotel Cápsula Nuvem', info: 'Cápsulas de dormir empilhadas em seis andares. 40 créditos a noite.' },
    { sign: 'CYBERDECK', col: '#7dff6b', name: 'Loja de Cyberdecks', info: 'Placas, cabos e um vendedor que fala em hexadecimal.' },
    { sign: 'FLORES', col: '#ff8ad8', name: 'Floricultura Sintética', info: 'Flores que nunca murcham, com cheiro programável.' },
    { sign: 'TATUAGEM', col: '#ffb347', name: 'Estúdio de Tatuagem Dinâmica', info: 'Tatuagens que se movem sob a pele. O catálogo tem dragões, ondas e logotipos de corporação.' },
    // marcas da vida real, em versão paródia de 2085
    { sign: 'STARBYTES', col: '#2fd27a', name: 'Starbytes Coffee', vendor: 'starbytes', info: 'Uma sereia holográfica acena no letreiro. A IA do balcão escreve seu nome errado no copo, de propósito, "pela tradição". Slogan: "Seu terceiro lugar. Entre a casa, o trabalho e o metaverso."' },
    { sign: 'McDRONE’S', col: '#ffd23f', name: 'McDrone’s', vendor: 'mcdrones', info: 'Arcos dourados em neon e drones saindo pelo telhado com sacolas de papel. Slogan: "Amo muito tudo isso. Entregue em 90 segundos, chova ácido ou não."' },
    { sign: '24-ELEVEN', col: '#ff8a3d', name: 'Loja de conveniência 24-Eleven', vendor: 'conveniencia', info: 'Aberta 24 horas desde 1927, diz a placa. O caixa é um braço robótico que dá bom-dia para todo mundo. Slogan: "Oh, thank heaven. Nunca fechamos, nem no apocalipse."' },
    { sign: 'NYKE', col: '#f0f0f0', name: 'Nyke Store', info: 'Tênis com amortecimento magnético e cadarço que se amarra sozinho. Slogan no vidro: "Just Jack In."' },
    { sign: 'PEAR', col: '#e0e8f0', name: 'Pear Store', info: 'Uma vitrine branca, minimalista, com implantes neurais expostos como joias. O logo é uma pera mordida. Slogan: "Think Different. Pense conectado."' },
    { sign: 'KOLA-KOLA', col: '#ff3355', name: 'Kola-Kola Bar', vendor: 'kolakola', info: 'Garrafas curvas geladas brilhando em vermelho. Slogan: "Abra a felicidade. Agora com zero açúcar e cem por cento nanorrobôs."' },
    { sign: 'BURGER KYNG', col: '#ff8a3d', name: 'Burger Kyng', vendor: 'mcdrones', info: 'Hambúrgueres de carne cultivada em laboratório, impressos na hora. Slogan: "Do seu jeito. Do jeito da impressora, na verdade."' },
    { sign: 'CASAS BAHYA', col: '#38a0ff', name: 'Casas Bahya', info: 'Geladeiras inteligentes, sofás que massageiam e implantes oculares em promoção. Slogan: "Dedicação total a você. Implantes em 48x sem juros."' },
    { sign: 'SUBWAVE', col: '#7dff6b', name: 'Subwave', vendor: 'mcdrones', info: 'Sanduíches montados por um braço robótico que pergunta "qual pão?" com uma paciência infinita. Slogan: "Eat fresh. Mais fresco que o ar do Sector 4, pelo menos."' },
    { sign: 'DROGACYBER', col: '#7dff6b', name: 'Drogacyber', vendor: 'farmacia', info: 'Farmácia de rede com corredor de nano-remédios. Slogan: "Desconto com CPF. Mais desconto com o seu DNA."' },
    { sign: 'HAVAIONAS', col: '#ffd23f', name: 'Havaionas', info: 'Chinelos de todas as cores, empilhados até o teto. Slogan: "Todo mundo usa. Agora com sola antiderrapante para chuva ácida."' },
    { sign: 'SAMSONG', col: '#38a0ff', name: 'Samsong Experience', info: 'Telas dobráveis, relógios dobráveis e um vendedor com olhos dobráveis. Slogan: "Do what you can\'t. Dobre o que você puder."' },
  ];

  // anúncios holográficos no alto das torres: marca e slogan (paródias de marcas reais, em 2085)
  const HOLO_ADS = [
    ['STARBYTES', 'seu 3º lugar', '#2fd27a', 'siren', 'コーヒー'], ['McDRONE’S', 'amo muito tudo isso', '#ffd23f', 'arches', 'ドローン'],
    ['PEAR', 'think different', '#e8eef8', 'pear', '未来'], ['NYKE', 'just jack in', '#38f6ff', 'swoosh', '走れ'],
    ['KOLA-KOLA', 'abra a felicidade', '#ff3355', 'wave', '幸福'], ['RED VOLT', 'te dá asas (de verdade)', '#ff4a2a', 'bolt', '電撃'],
    ['SAMSONG', "do what you can't", '#4a9aff', 'orbit', '銀河'], ['24-ELEVEN', 'nunca fechamos', '#ff8a3d', 'num', '二十四'],
    ['PENDELTON', 'o futuro dentro de você', '#ff4fd8', 'helix', '生命'],
  ];

  if (def.build) def.build({ B, O, set, setR, shop, door, car, pushNpc, T, rnd, pick, m1, map, span, tile, inside, GENERIC_SHOPS, HOLO_ADS, buildings, objects });
  else {
  const blockType = (bi, bj) => {
    if (bi === 1 && bj === 1) return 'hotel';
    if (bi === 3 && bj === 1) return 'police';
    if (bi === 1 && bj === 2) return 'cafe';
    if (bi === 4 && bj === 0) return 'home';
    if (bi === 5 && bj === 0) return 'hacker';
    if (bi === 0 && bj === 4) return 'junkyard';
    if (bi === 2 && bj === 2) return 'plaza';
    if ((bi === 2 && bj === 0) || (bi === 5 && bj === 2) || (bi === 0 && bj === 5)) return 'park';
    if (bi >= 3 && bi <= 4 && bj >= 3 && bj <= 4) return 'chinatown';
    return 'gen';
  };

  for (let bj = 0; bj < 6; bj++) for (let bi = 0; bi < 6; bi++) {
    const X0 = bi * 10 + 3, Y0 = bj * 10 + 3, type = blockType(bi, bj);
    if (type === 'gen') {
      const layout = Math.floor(rnd() * 3);
      const parts = layout === 0 ? [[0, 0, 3, 6], [3, 0, 3, 6]] : layout === 1 ? [[0, 0, 3, 3], [3, 0, 3, 3], [0, 3, 3, 3], [3, 3, 3, 3]] : [[0, 0, 6, 3], [0, 3, 3, 3], [3, 3, 3, 3]];
      for (const [ox, oy, w, d] of parts) {
        // altura: metade baixa (sobrado com loja), um quarto média, um quarto torre (o mesmo sorteio de antes)
        const hr = rnd(), h = hr < 0.5 ? 20 + Math.floor(hr * 24) : hr < 0.75 ? 40 + Math.floor((hr - 0.5) * 120) : 95 + Math.floor((hr - 0.75) * 300);
        const holo = rnd() < 0.35 ? pick(HOLO_ADS) : null;
        const b = B(X0 + ox, Y0 + oy, w, d, h, h < 40 ? 'low' : 'tower', { holo: h >= 70 ? holo : null, ...(h < 40 ? { col: ['#3a2c2a', '#2c3034', '#34282e', '#2a3028', '#3a3430'][Math.floor(hr * 100) % 5] } : {}) });
        if (oy + d === 6 && rnd() < 0.85) { const s = pick(GENERIC_SHOPS); shop(b, 0, 0.3, w - 0.3, { ...s, key: 'loja_' + buildings.length + '_0' }); }
        if (ox + w === 6 && rnd() < 0.6) { const s = pick(GENERIC_SHOPS); shop(b, 1, 0.3, d - 0.3, { ...s, key: 'loja_' + buildings.length + '_1' }); }
      }
    } else if (type === 'park' || type === 'plaza') {
      for (let y = Y0; y < Y0 + 6; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, type === 'park' && x !== X0 + 2 && x !== X0 + 3 && y !== Y0 + 2 && y !== Y0 + 3 ? T.GRASS : T.PLAZA);
      if (type === 'park') {
        for (const [ox, oy] of [[0, 0], [5, 0], [0, 5], [5, 5], [1, 4], [4, 1]]) O({ kind: 'tree', x: X0 + ox, y: Y0 + oy, solid: true, key: 'arvore', name: 'Árvore', info: 'Uma árvore de verdade, regada por drones. Nas folhas, gotas de chuva ácida brilham em neon.', col: pick(['#1e4a34', '#1a3a3a', '#2a4a2a']), glow: pick(['#7dff6b', '#38f6ff', '#ff4fd8']) });
        O({ kind: 'bench', x: X0 + 1, y: Y0 + 2, solid: true, key: 'banco', name: 'Banco do parque', seat: true });
        O({ kind: 'bench', x: X0 + 4, y: Y0 + 3, solid: true, key: 'banco', name: 'Banco do parque', seat: true });
        O({ kind: 'lamp_post', x: X0 + 2, y: Y0 + 2, light: { z: 30, r: 60, color: '#ffd8a0' } });
      } else {
        O({ kind: 'fountain', x: X0 + 2, y: Y0 + 2, w: 2, d: 2, solid: true, key: 'fonte', name: 'Fonte holográfica', info: 'Uma fonte sem água: só luz projetada em arcos. Economiza recursos, diz a placa da prefeitura.', light: { z: 14, r: 70, color: '#38f6ff' } });
        O({ kind: 'kiosk', x: X0, y: Y0 + 5, solid: true, key: 'banca', name: 'Banca de notícias', col: '#ff4fd8', info: 'Manchetes em holograma: "MAGNATA PENDELTON MORRE NO HOTEL ALVORADA". "TEMPESTADE DE DADOS ISOLA ZONA ALTA". "PREFEITO PROMETE SOL ATÉ 2090".' });
        O({ kind: 'holo_ad', x: X0 + 5, y: Y0, solid: true, key: 'anuncio', name: 'Anúncio holográfico', text: 'PENDELTON', col: '#38f6ff', info: '"PENDELTON BIOCYBER: o futuro dentro de você." O anúncio ainda não sabe que o dono morreu.' });
        O({ kind: 'bench', x: X0 + 1, y: Y0 + 1, solid: true, key: 'banco', name: 'Banco da praça', seat: true });
        O({ kind: 'bench', x: X0 + 4, y: Y0 + 4, solid: true, key: 'banco', name: 'Banco da praça', seat: true });
        O({ kind: 'phone', x: X0 + 5, y: Y0 + 5, solid: true, key: 'orelhao', name: 'Cabine holográfica', info: 'Uma cabine de holochamada. Alguém deixou um recado gravado: "Mãe, eu tô bem. Não vem me buscar."' });
      }
    } else if (type === 'hotel') {
      B(14, 13, 4, 3, 160, 'hotel', { col: '#2a1440', sign: 'ALVORADA', signCol: '#ff4fd8' });
      B(13, 13, 1, 3, 70, 'tower', { col: '#24123a' }); B(18, 13, 1, 3, 70, 'tower', { col: '#24123a' });
      for (let y = 16; y <= 18; y++) for (let x = 13; x <= 18; x++) set(x, y, T.PLAZA);
      door(15, 16, 'lobby', [1, 6], 'Hotel Grand Alvorada → Lobby'); door(16, 16, 'lobby', [1, 6], 'Hotel Grand Alvorada → Lobby');
      car('police_car', 13.3, 20.7, 0, { key: 'viatura', name: 'Viatura da polícia', info: 'Uma viatura spinner do Distrito 4, giroflex ligado. O rádio chia: "...perícia na 404, aguardando o detetive Vance..."', light: { z: 10, r: 60, color: '#38a0ff', flicker: true } });
      car('police_car', 17.7, 20.7, Math.PI, { key: 'viatura', name: 'Viatura da polícia', info: 'O motor ainda está quente. No painel, um copo de café sintético pela metade e uma foto de criança.', light: { z: 10, r: 60, color: '#ff3355', flicker: true } });
      O({ kind: 'planter', x: 13, y: 16, solid: true, key: 'canteiro', name: 'Canteiro', info: 'Flores sintéticas com o logo do hotel bordado nas pétalas.' });
      O({ kind: 'planter', x: 18, y: 16, solid: true, key: 'canteiro', name: 'Canteiro', info: 'Flores sintéticas. Uma delas está pisoteada: alguém saiu com pressa.' });
      O({ kind: 'cone', x: 14, y: 19 }); O({ kind: 'cone', x: 17, y: 19 });
      O({ kind: 'tram_stop', x: 18, y: 17, solid: true, key: 'estacao_aerotrem', name: 'Estação do aerotrem — Sector 4' });
      O({ kind: 'vending_drink', x: 19, y: 13, solid: true, key: 'maq_bebida', name: 'Máquina de bebidas HydroPop' });
      O({ kind: 'vending_food', x: 19, y: 14, solid: true, key: 'maq_comida', name: 'Máquina de comida NutriMat' });
      O({ kind: 'bench', x: 12, y: 14, solid: true, key: 'banco', name: 'Banco da calçada', seat: true });
      pushNpc({ id: 'cruz', x: 17, y: 16, wander: { area: [13, 16, 18, 18] } }, { id: 'marta', x: 19, y: 17, wander: { area: [19, 15, 19, 19] } });
    } else if (type === 'police') {
      B(33, 13, 6, 3, 70, 'police', { col: '#1a2a48', sign: 'POLÍCIA · D4', signCol: '#38a0ff' });
      for (let y = 16; y <= 18; y++) for (let x = 33; x <= 38; x++) set(x, y, T.PLAZA);
      door(35, 16, 'delegacia', [2, 1], 'Delegacia do Distrito 4'); door(36, 16, 'delegacia', [2, 1], 'Delegacia do Distrito 4');
      car('police_car', 33.5, 20.7, 0, { key: 'viatura', name: 'Viatura da polícia', info: 'Viatura estacionada. O porta-luvas tem três multas de estacionamento. Da própria polícia.' });
      car('police_car', 37.5, 20.7, Math.PI, { key: 'viatura', name: 'Viatura da polícia', info: 'Viatura em manutenção: um dos repulsores está desmontado no chão.' });
      O({ kind: 'banner', x: 33, y: 16, col: '#1a2a5a', text: 'D4', key: 'bandeira', name: 'Bandeira do Distrito 4', info: 'A bandeira azul do Distrito 4, encharcada. Lema: "Servir mesmo debaixo de chuva."' });
    } else if (type === 'cafe') {
      B(13, 23, 4, 3, 60, 'tower');
      B(13, 26, 4, 3, 30, 'cafe', { col: '#3a1a30', sign: 'CAFÉ NEON', signCol: '#ff8ad8' });
      const t2 = B(17, 23, 2, 6, 90, 'tower');
      shop(t2, 1, 0.5, 2.5, { ...GENERIC_SHOPS[1], key: 'loja_cafe_farmacia' });
      door(14, 29, 'cafe', [1, 1], 'Café Neon');
    } else if (type === 'hacker') {
      B(53, 3, 6, 4, 125, 'home', { col: '#1a1a2e', sign: 'EDIFÍCIO ÁTRIO', signCol: '#38f6ff' });
      for (let y = 7; y <= 8; y++) for (let x = 53; x <= 58; x++) set(x, y, T.PLAZA);
      door(55, 7, 'hacker', [1, 1], 'Edifício Átrio → Apartamento 1207');
      O({ kind: 'trash', x: 58, y: 7, solid: true, key: 'lixeira', name: 'Lixeira', info: 'Placas de circuito queimadas e latas de energético. Alguém neste prédio não dorme.' });
      O({ kind: 'phone', x: 53, y: 8, solid: true, key: 'orelhao', name: 'Cabine holográfica', info: 'Uma cabine de holochamada com a tela rachada. Ainda funciona.' });
    } else if (type === 'junkyard') {
      // pátio a céu aberto, cercado de arame: montanhas de sucata, guindaste e carcaças visíveis da rua
      for (let y = 43; y <= 48; y++) for (let x = 3; x <= 8; x++) set(x, y, T.PLAZA);
      const pile = (x, y, w, d, info) => O({ kind: 'scrap', x, y, w, d, solid: true, key: 'sucata_rua', name: 'Montanha de sucata', info });
      pile(3, 43, 2, 2, 'Chapas retorcidas, braços robóticos e uma cabeça de androide que parece acompanhar você com os olhos apagados.');
      pile(7, 43, 2, 2, 'Geladeiras inteligentes empilhadas. Uma delas ainda pede, em voz baixa, que alguém compre leite.');
      pile(3, 45, 1, 1, 'Rodas, molas e um letreiro de neon que diz "ABERT".');
      O({ kind: 'crane', x: 5, y: 43, w: 2, d: 1, solid: true, reach: 2.2, key: 'guindaste', name: 'Guindaste com eletroímã', info: 'O eletroímã segura uma carcaça de carro no ar. Range com o vento. Ninguém fica embaixo.' });
      O({ kind: 'tires', x: 8, y: 45, solid: true, n: 5, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus de carros que pararam de voar há muito tempo.' });
      O({ kind: 'barrel', x: 6, y: 44, solid: true, fire: true, key: 'tambor', name: 'Tambor com fogo', info: 'Fogo num tambor velho, para espantar o frio e a chuva. O Zeca esquenta marmita aqui.' });
      // cerca: fundos, laterais e frente, com o portão no meio
      O({ kind: 'fence', x: 3, y: 43, w: 6, axis: 'x' });
      O({ kind: 'fence', x: 3, y: 43, d: 3, axis: 'y' });
      O({ kind: 'fence', x: 9, y: 43, d: 3, axis: 'y' });
      O({ kind: 'fence', x: 3, y: 46, w: 2, axis: 'x' });
      O({ kind: 'fence', x: 7, y: 46, w: 2, axis: 'x' });
      O({ kind: 'junk_gate', x: 5, y: 46, w: 2, axis: 'x', text: 'FERRO-VELHO DO ZECA' });
      door(5, 46, 'ferrovelho', [2, 1], 'Ferro-velho do Zeca'); door(6, 46, 'ferrovelho', [3, 1], 'Ferro-velho do Zeca');
      O({ kind: 'scrap', x: 7, y: 47, w: 2, d: 2, solid: true, key: 'sucata_rua', name: 'Sucata na calçada', info: 'Peças que não couberam lá dentro: um braço robótico, rodas, um letreiro de neon apagado.' });
    } else if (type === 'home') {
      B(43, 3, 6, 4, 140, 'home', { col: '#1e3028', sign: 'RESIDENCIAL KOWLOON', signCol: '#7dff6b' });
      for (let y = 7; y <= 8; y++) for (let x = 43; x <= 48; x++) set(x, y, T.PLAZA);
      door(45, 7, 'home', [1, 1], 'Residencial Kowloon → Apartamento de Vance');
      O({ kind: 'planter', x: 43, y: 7, solid: true, key: 'canteiro', name: 'Canteiro', info: 'Os vizinhos plantaram tomates de verdade aqui. Ninguém sabe quem rega.' });
      O({ kind: 'trash', x: 48, y: 7, solid: true, key: 'lixeira', name: 'Lixeira', info: 'Reciclável, orgânico, implantes descartados. O terceiro compartimento está transbordando.' });
      O({ kind: 'bench', x: 47, y: 8, solid: true, key: 'banco', name: 'Banco', seat: true });
    }
  }

  // ---------- Chinatown ----------
  const ct = (x, y, w, d, h, col, extra) => B(x, y, w, d, h, 'ct', { col, ...extra });
  const A1 = ct(33, 33, 6, 3, 36, '#5a1a1e'), A2 = ct(33, 36, 6, 3, 30, '#6a4a1a');
  const B1 = ct(43, 33, 6, 3, 40, '#1a4a4a'), B2 = ct(43, 36, 6, 3, 32, '#5a1a2a');
  const C1 = B(33, 43, 6, 6, 36, 'bath', { col: '#4a2a1a', sign: '湯', signCol: '#ff3355' });
  for (let y = 43; y <= 48; y++) for (let x = 43; x <= 48; x++) set(x, y, T.PLAZA);
  const D1 = B(44, 44, 4, 4, 30, 'temple', { col: '#7a1018' });
  shop(A1, 1, 0.2, 2.8, { sign: '拉麵', col: '#ff8a3d', name: 'Lámen do Sr. Wen' });
  shop(A2, 1, 0.2, 2.8, { sign: '算命', col: '#b04cff', name: 'Madame Lin — Cartomante' });
  shop(A2, 0, 0.3, 2.7, { sign: '茶館', col: '#7dff6b', name: 'Casa de Chá Jade', key: 'loja_cha', vendor: 'casa_cha', info: 'Bules de ferro fumegando, cheiro de jasmim e mesas baixas de madeira escura.' });
  shop(A2, 0, 3.3, 5.7, { sign: '藥房', col: '#ffd23f', name: 'Ervanaria Dr. Huang', key: 'loja_ervas', vendor: 'ervanaria', info: 'Gavetas de madeira até o teto, raízes secas, cavalos-marinhos em pote. E um scanner de DNA moderníssimo no balcão.' });
  shop(B2, 0, 0.3, 2.7, { sign: '點心', col: '#ff8ad8', name: 'Dim Sum da Tia Lan', key: 'loja_dimsum', vendor: 'dimsum', info: 'Cestos de bambu empilhados soltando vapor. Tia Lan grita os pedidos em três idiomas.' });
  shop(B2, 0, 3.3, 5.7, { sign: '燒臘', col: '#ff3355', name: 'Assados Fong', key: 'loja_assados', vendor: 'assados', info: 'Patos laqueados pendurados na vitrine, brilhando como âmbar.' });
  shop(B1, 1, 0.2, 2.8, { sign: '麻雀', col: '#38f6ff', name: 'Salão de Mahjong', key: 'loja_mahjong', info: 'O estalar das peças de mahjong atravessa a porta. Lá dentro, apostas que a polícia finge não ver.' });
  shop(B2, 1, 0.2, 2.8, { sign: '茉莉花', col: '#f0e0a0', name: 'Casa de Chá Matsurika' });
  door(49, 37, 'bordel', [1, 1], 'Casa de Chá Matsurika');
  shop(C1, 0, 0.3, 2.7, { sign: '餅家', col: '#ffb347', name: 'Padaria Lua Dourada', key: 'loja_padaria', vendor: 'padaria', info: 'Bolos da lua, pães de abacaxi e um forno que nunca apaga.' });
  shop(C1, 0, 3.3, 5.7, { sign: '福', col: '#ffd23f', name: 'Loja da Sorte', key: 'loja_sorte', info: 'Centenas de gatos da sorte acenando ao mesmo tempo, num ritmo hipnótico. Um deles está quebrado e acena mais devagar.' });
  shop(C1, 1, 1.6, 3.4, { sign: '湯 LÓTUS', col: '#ff3355', name: 'Casa de Banho Lótus' });
  door(39, 45, 'bathhouse', [1, 1], 'Casa de Banho Lótus');
  O({ kind: 'shopfront', x: 46, y: 48, key: 'templo', name: 'Templo do Dragão', info: 'Um pequeno templo espremido entre os prédios. Velas, frutas oferecidas e o cheiro doce do incenso.' });
  O({ kind: 'incense', x: 45, y: 48, solid: true, key: 'incensario', name: 'Incensário de bronze', info: 'Dezenas de varetas de incenso queimando devagar. Cada fio de fumaça é um pedido.' });
  O({ kind: 'lion', x: 43, y: 48, solid: true, key: 'leao', name: 'Leão de pedra', info: 'Um leão guardião com uma bola sob a pata. Dizem que protege o templo de maus espíritos e de fiscais da prefeitura.' });
  O({ kind: 'lion', x: 48, y: 48, solid: true, flip: true, key: 'leao', name: 'Leã de pedra', info: 'A leoa guardiã, com um filhote sob a pata. Alguém pendurou uma lanterna de LED no pescoço dela.' });
  O({ kind: 'lion', x: 39, y: 44, solid: true, key: 'leao', name: 'Leão de pedra', info: 'Guarda a entrada da casa de banho. Está gasto de tanto as pessoas esfregarem a cabeça para dar sorte.' });
  O({ kind: 'lion', x: 39, y: 46, solid: true, flip: true, key: 'leao', name: 'Leã de pedra', info: 'Tem um chiclete grudado na orelha. Os leões também sofrem nesta cidade.' });
  O({ kind: 'bamboo', x: 43, y: 43, solid: true, key: 'bambu', name: 'Bambu', info: 'Bambu de verdade, alto e verde, balançando com o vento da tempestade.' });
  O({ kind: 'bamboo', x: 48, y: 43, solid: true, key: 'bambu', name: 'Bambu', info: 'Alguém amarrou fitas vermelhas com desejos escritos nos galhos.' });
  O({ kind: 'shrine', x: 43, y: 45, solid: true, key: 'altar', name: 'Altar de rua', info: 'Um altar pequeno com laranjas e uma foto de um senhor sorrindo. Velas novas: alguém passou aqui há pouco.' });
  // portais chineses (pilares sólidos nas pontas)
  for (const [x, y, axis] of [[39, 32, 'x'], [39, 49, 'x'], [32, 39, 'y'], [49, 39, 'y']]) {
    O({ kind: 'paifang', x, y, w: axis === 'x' ? 4 : 1, d: axis === 'y' ? 4 : 1, axis, key: 'portal', name: 'Portal de Chinatown', info: 'Um paifang vermelho com telhado de telhas verdes: "中華街", Rua da China. Do outro lado, o cheiro de lámen e incenso.' });
    for (const k of [0, 3]) O({ kind: 'block', x: axis === 'x' ? x + k : x, y: axis === 'y' ? y + k : y, solid: true });
  }
  // lanternas atravessando as ruas
  for (const y of [34, 37, 43, 46]) O({ kind: 'lantern_line', x: 39, y, w: 4, d: 1, axis: 'x', col: y % 2 ? '#ffd23f' : null });
  for (const x of [35, 37, 44, 46]) O({ kind: 'lantern_line', x, y: 39, w: 1, d: 4, axis: 'y' });
  // barracas e mercado noturno
  O({ kind: 'stall', x: 40, y: 33, w: 1, d: 2, solid: true, goods: 'dumpling', col: '#c8202a', sign: '拉麵', key: 'barraca_lamen', name: 'Barraca de lámen do Sr. Wen', light: { z: 26, r: 60, color: '#ffb347' } });
  O({ kind: 'fortune', x: 40, y: 37, solid: true, key: 'mesa_lin', name: 'Mesa da cartomante', light: { z: 10, r: 40, color: '#b04cff' } });
  O({ kind: 'stall', x: 34, y: 40, solid: true, goods: 'tech', col: '#1a6a8a', key: 'barraca_tech', name: 'Barraca de eletrônicos', info: 'Cabos, chips e implantes de segunda mão espalhados numa toalha. Nenhum tem nota fiscal.', light: { z: 26, r: 40, color: '#38f6ff' } });
  O({ kind: 'stall', x: 36, y: 40, solid: true, goods: 'fruit', col: '#e8a020', key: 'barraca_frutas', name: 'Barraca de frutas', vendor: 'frutas', light: { z: 26, r: 40, color: '#ffd8a0' } });
  O({ kind: 'stall', x: 44, y: 40, solid: true, goods: 'fish', col: '#2a6aa8', key: 'barraca_peixe', name: 'Peixaria do Sr. Fong', info: 'Peixes de tanque, ainda se mexendo no gelo. O Sr. Fong garante que nenhum tem três olhos.', light: { z: 26, r: 40, color: '#7fd8ff' } });
  O({ kind: 'stall', x: 47, y: 40, solid: true, goods: 'lanterns', col: '#c8202a', key: 'barraca_lanternas', name: 'Barraca de lanternas', info: 'Lanternas de papel e de LED, amuletos e fitas vermelhas. "Para o Festival da Lua", diz a vendedora.', light: { z: 26, r: 50, color: '#ff3355' } });
  O({ kind: 'koi', x: 40, y: 40, w: 2, d: 2, solid: true, key: 'lago_koi', name: 'Lago das carpas', info: 'Carpas laranja e brancas nadando em círculos lentos, alheias à chuva ácida. Moedas brilham no fundo.' });
  O({ kind: 'mahjong', x: 49, y: 34, solid: true, key: 'mesa_mahjong', name: 'Mesa de mahjong', info: 'Dois velhos jogam mahjong na calçada, protegidos por um toldo. Ninguém levanta os olhos para você.' });
  for (const [x, y, text, col] of [[39, 38, '福', '#c8202a'], [42, 34, '龍', '#c8202a'], [42, 38, '中華', '#1e5a3a'], [39, 42, '平安', '#c8202a'], [42, 47, '財', '#c8202a'], [38, 42, '吉', '#1e5a3a'], [47, 42, '春', '#c8202a']])
    O({ kind: 'banner', x, y, text, col, key: 'estandarte', name: 'Estandarte', info: 'Um estandarte de pano com um ideograma bordado em dourado: ' + text + '.' });
  O({ kind: 'maneki', x: 38, y: 49, solid: true, key: 'gato_sorte', name: 'Gato da sorte gigante', info: 'Um maneki-neko dourado do tamanho de uma criança, acenando sem parar. A pilha dele deve ser nuclear.' });
  O({ kind: 'vending_drink', x: 32, y: 34, solid: true, key: 'maq_bebida', name: 'Máquina de bebidas HydroPop' });
  O({ kind: 'vending_food', x: 32, y: 35, solid: true, key: 'maq_comida', name: 'Máquina de comida NutriMat' });
  for (const [x, y] of [[34, 39], [37, 39], [44, 39], [47, 39], [39, 35], [42, 45]]) O({ kind: 'lantern', x, y });
  pushNpc(
    { id: 'wen', x: 39, y: 33 },
    { id: 'lin', x: 39, y: 37, seated: true },
    { id: 'bao', x: 41, y: 36, wander: { area: [39, 32, 42, 49] } },
    { id: 'mei', x: 35, y: 39, wander: { area: [33, 39, 38, 39] } },
    { id: 'huang', x: 38, y: 39 },
    { id: 'lan', x: 45, y: 39, wander: { area: [43, 39, 48, 39] } },
  );
  }

  // ---------- rua: postes, lixeiras, hidrantes e bueiros ----------
  for (let bj = 0; bj < 6; bj++) for (let bi = 0; bi < 6; bi++) {
    const x2 = bi * 10 + 2, y2 = bj * 10 + 2;
    if (inCT(m1(x2 + 1), m1(y2 + 1))) continue;
    O({ kind: 'lamp_post', x: x2 + 4, y: y2 + 7, light: { z: 30, r: 60, color: '#ffd8a0' } });
    O({ kind: 'lamp_post', x: x2 + 7, y: y2 + 3, light: { z: 30, r: 60, color: '#ffd8a0' } });
    if (rnd() < 0.5) O({ kind: 'manhole', x: bi * 10 + (rnd() < 0.5 ? 0 : 1), y: y2 + 2 + Math.floor(rnd() * 4) });
  }
  // a calçada do lado das fachadas visíveis ganha lixeiras e hidrantes nos cantos
  for (let bj = 0; bj < 6; bj++) for (let bi = 0; bi < 6; bi++) {
    const x9 = bi * 10 + 9, y9 = bj * 10 + 9;
    if (inCT(m1(x9), m1(y9)) || tile(m1(x9), m1(y9)) !== T.WALK) continue;
    if (rnd() < 0.6) O({ kind: 'hydrant', x: x9, y: y9, solid: true, key: 'hidrante', name: 'Hidrante', info: 'Um hidrante amarelo e vermelho. Alguém pichou um olho nele.' });
  }

  // ---------- quarteirões de borda (silhuetas fora do mapa) ----------
  const border = [];
  for (let k = -8; k < N + 8; k += 4) {
    border.push({ x: k, y: -6, w: 3.6, d: 5, h: 60 + ((k * 37) & 63), style: 'tower', col: '#120c1c', seed: k * 7 + 3, shops: [], border: true });
    border.push({ x: -6, y: k, w: 5, d: 3.6, h: 60 + ((k * 53) & 63), style: 'tower', col: '#120c1c', seed: k * 11 + 5, shops: [], border: true });
    border.push({ x: k, y: N + 1, w: 3.6, d: 5, h: 20 + ((k * 17) & 31), style: 'tower', col: '#120c1c', seed: k * 13 + 1, shops: [], border: true });
    border.push({ x: N + 1, y: k, w: 5, d: 3.6, h: 20 + ((k * 29) & 31), style: 'tower', col: '#120c1c', seed: k * 19 + 9, shops: [], border: true });
  }
  buildings.push(...border);

  // ---------- regras de passagem ----------
  const carOK = (x, y) => { const v = tile(x, y); return (v === T.ROAD || v === T.CROSS) && !inCT(x, y); };   // só rua
  const crowdOK = (x, y) => { const v = tile(x, y); return v === T.WALK || v === T.CROSS || v === T.PLAZA || v === T.CTWALK || v === T.CTSTREET || v === T.GRASS; };

  // ---------- multidão: pedestres com e sem guarda-chuva ----------
  const CROWD_NAMES = ['Pedestre', 'Entregadora', 'Operário', 'Estudante', 'Executivo', 'Turista', 'Senhora', 'Músico de rua', 'Enfermeira', 'Hacker', 'Segurança', 'Vendedor'];
  const LINES = {
    city: ['Essa chuva não para nunca, né?', 'Ouvi dizer que mataram um figurão no Alvorada.', 'Não tenho tempo, moço, perdi o último trem.', 'Polícia? Eu não vi nada. Nunca vejo nada.', 'Tá procurando o quê, detetive? Todo mundo aqui esconde alguma coisa.', 'Meu implante tá dando erro com a tempestade. Tudo pisca.', 'O ramen 24h da esquina é bom. O de Chinatown é melhor.', 'Cuidado com os drones de entrega. Eles não freiam.', 'A Pendelton BioCyber manda nesta cidade. Ou mandava.', 'Viu o tanto de viatura na frente do hotel? Coisa grande.', 'Eu trabalho no turno da noite. Todo turno é da noite aqui.', 'Desculpa, tô atrasado pra uma reunião. Às três da manhã. É, eu sei.', 'Meu cachorro-robô fugiu. Se vir um poodle cromado, ele atende por Pixel.', 'Trabalho com marketing. Faço os outdoors que te seguem com o olhar. Desculpa.', 'A Av. Lótus alagou de novo. Fui de barco pro trabalho.', 'Comprei um guarda-chuva antiácido. Durou duas quadras.', 'Detetive, cuidado com o beco atrás do 24-Eleven. Tem gente que some ali.', 'Faz três anos que eu não vejo uma estrela. Acho que elas desistiram da gente.', 'Minha avó dizia que antes a chuva cheirava a terra. Hoje cheira a bateria.', 'Você parece cansado. Toma um NEOVOLT. Todo mundo toma.', 'O metrô tá parado. Disseram que um drone caiu nos trilhos.', 'Tô indo pro turno no hospital. Noite de tempestade é noite de queimadura.', 'Já provou o hambúrguer cúbico? Dizem que é defeito da impressora. Eu acho que é arte.', 'Ei, você não é aquele detetive do noticiário? Não? Tem cara.', 'Vi uma luz azul piscando no telhado do Alvorada ontem. Ninguém acredita em mim.', 'Meu implante traduz tudo. Até o que eu não queria ouvir.'],
    chinatown: ['O lámen do Sr. Wen é o melhor do Sector 4.', 'A Madame Lin leu minha sorte. Disse que eu ia encontrar um policial. Olha você aí.', 'Não vá ao Salão de Mahjong sem ser convidado.', 'A casa de banho fica aberta a noite toda. Os velhos do Sindicato vivem lá.', 'Compre um bolo da lua na Padaria Lua Dourada. É festival logo.', 'Esses portais têm mais de cem anos. Sobreviveram a três corporações.', 'O Bao é um bom menino. Curioso demais, mas bom.', 'O Sindicato Lótus cuida do bairro. Do jeito deles.', 'Não pise na sombra do portal. Dá azar. Ou é o que minha mãe dizia.', 'O dumpling da barraca vermelha tem recheio surpresa. Não pergunte.', 'Os velhos do mahjong sabem de tudo que acontece no bairro. Tudo.', 'Aqui a chuva parece mais gentil. Deve ser o incenso.', 'Comprei um gato da sorte que acena com as duas patas. Sorte em dobro, problema em dobro.', 'O festival da lua vai ter fogos holográficos este ano. Os de verdade foram proibidos.', 'Policial em Chinatown? O Sindicato já sabe que você está aqui.', 'Minha tia vende chá que cura tudo. Até saudade.'],
  };
  const LOOKS_CROWD = ['ped1', 'ped2', 'ped3', 'ped4', 'ped5', 'ped6', 'ped7', 'ped8'];
  const UMB = ['#ff4fd8', '#38f6ff', '#ffd23f', '#7dff6b', '#ff3355', '#e8e8f0', '#b04cff'];
  const walkers = [];
  const spots = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (crowdOK(x, y) && tile(x, y) !== T.CROSS) spots.push([x, y]);
  for (let k = 0; k < (def.walkers || 60); k++) {
    const [x, y] = spots[Math.floor(rnd() * spots.length)];
    const ctz = inCT(x, y);
    walkers.push({
      look: ctz && rnd() < 0.5 ? pick(['ped5', 'ped7', 'ped8']) : pick(def.looks || LOOKS_CROWD), name: pick(def.names || CROWD_NAMES),
      lines: ctz ? LINES.chinatown : def.lines || LINES.city, umbrella: rnd() < 0.75 ? pick(UMB) : null,
      x, y, speed: 0.9 + rnd() * 0.5, tiles: 'crowd', range: 9,
    });
  }

  // ---------- trânsito: carros seguem as faixas e viram nos cruzamentos ----------
  const traffic = [];
  const LIVERIES = [
    { main: '#3a2a10', second: '#1e160a', under: '#141008', metal: '#2a2a30', glass: '#1a3040', accent: '#ffb347', model: 'sedan' },
    { main: '#102a3a', second: '#0a1a24', under: '#0a1018', metal: '#2a2a30', glass: '#1a3a52', accent: '#38f6ff', model: 'coupe' },
    { main: '#3a1020', second: '#200a12', under: '#140810', metal: '#2a2a30', glass: '#1a3040', accent: '#ff3355', model: 'sedan' },
    { main: '#203a20', second: '#122012', under: '#0a140a', metal: '#2a2a30', glass: '#1a3a40', accent: '#7dff6b', model: 'coupe' },
    { main: '#e8b020', second: '#2a2210', under: '#1a1610', metal: '#2a2a30', glass: '#1a3040', accent: '#ffd23f', model: 'sedan' },
    { main: '#2a2a32', second: '#18181e', under: '#101014', metal: '#2a2a30', glass: '#16394c', accent: '#ff4fd8', model: 'coupe' },
  ];
  // faixas: o sentido + usa o lado de baixo/direito da rua, o sentido − o outro; avenidas têm duas faixas por sentido
  const laneCoord = (dx, dy, k, sub = 0) => {
    const w = RW[k], st = roadStart[k], plus = dx > 0 || dy > 0;
    if (w >= 6) return st + (plus ? (sub ? 5.2 : 3.9) : (sub ? 0.8 : 2.1));
    return st + (plus ? w * 0.72 : w * 0.28);
  };
  const outsideCT = (x, y) => !inCT(Math.floor(x), Math.floor(y));
  for (let k = 0; k < (def.cars || 26); k++) {
    // as avenidas do hotel (índice 2) ganham mais carros
    const vertical = k % 2 === 0, dir = k % 4 < 2 ? 1 : -1, lane = k < 10 ? 2 : (k * 3) % 7;
    const sub = (k >> 1) % 2;
    let along = 3 + ((k * 13) % (N - 6));
    const dx = vertical ? 0 : dir, dy = vertical ? dir : 0;
    let x = vertical ? laneCoord(0, dy, lane, sub) : along, y = vertical ? along : laneCoord(dx, 0, lane, sub);
    for (let t = 0; t < 40 && (!outsideCT(x, y) || !carOK(Math.floor(x), Math.floor(y))); t++) { along = (along + 7) % (N - 4) + 2; if (vertical) y = along; else x = along; }
    for (let t = 0; t < 20 && traffic.some(o => Math.hypot(o.x - x, o.y - y) < 2.5); t++) { along = (along + 3) % (N - 4) + 2; if (vertical) y = along; else x = along; }   // não nasce em cima de outro carro
    traffic.push({ x, y, dx, dy, sub, speed: 3 + (k % 3) * 0.8, v: 0, livery: (def.liveries || LIVERIES)[k % (def.liveries || LIVERIES).length], lastCross: null, plan: null, rise: 0, wait: 0 });
  }

  // ---------- semáforos (todos sincronizados) ----------
  // ciclo de 24 s: norte-sul verde 8 s, amarelo 2 s, todos vermelhos 2 s; depois o mesmo para leste-oeste
  const CYC = 24;
  const phaseOf = ns => (((game ? game.t : 0) + (ns ? 0 : CYC / 2)) % CYC + CYC) % CYC;
  const light = ns => { const q = phaseOf(ns); return q < 8 ? 'g' : q < 10 ? 'y' : 'r'; };
  // faixa de pedestres atravessa uma rua de carros norte-sul?
  const crossesNS = (x, y) => roadIdx[x] >= 0 && (roadIdx[y] < 0 || roadIdx[x] !== 4);
  // boneco: 'walk' nos 5 primeiros segundos do verde da outra rua, 'flash' até o fim desse verde, senão 'stop'
  const pedSignal = ns => { const q = phaseOf(!ns); return q < 5 ? 'walk' : q < 8 ? 'flash' : 'stop'; };
  const zoneAt = (x, y) => tile(x, y) === T.CROSS || (roadIdx[x] >= 0 && roadIdx[y] >= 0);
  // pedestre pode pisar na faixa? (quem já está nela termina a travessia)
  const pedOK = (fx, fy, nx, ny) => tile(nx, ny) !== T.CROSS || tile(fx, fy) === T.CROSS || pedSignal(crossesNS(nx, ny)) === 'walk';
  // postes nas esquinas de cada cruzamento (fora das ruas de pedestres de Chinatown)
  for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
    const x0 = roadStart[i], x1 = x0 + RW[i] - 1, y0 = roadStart[j], y1 = y0 + RW[j] - 1;
    if (inCT(x0, y0) || inCT(x1, y1)) continue;
    for (const [x, y, ns] of [[x0 - 1, y0 - 1, 1], [x1 + 1, y1 + 1, 1], [x1 + 1, y0 - 1, 0], [x0 - 1, y1 + 1, 0]])
      if (inside(x, y) && tile(x, y) !== T.BLD && !objects.some(o => o.x === x && o.y === y)) objects.push({ kind: 'semaforo', x, y, ns: !!ns, key: 'semaforo', name: 'Semáforo', info: 'Semáforo inteligente: conta carros por câmera e multa por reconhecimento facial. O boneco verde pisca em três idiomas.' });
  }

  function trafficBlocked(c, ahead) {
    const fx = c.x + c.dx * ahead, fy = c.y + c.dy * ahead;
    if (game.car && game.driving && Math.hypot(game.car.x - fx, game.car.y - fy) < 1.1) return true;
    const p = game.player;
    if (!game.driving && game.roomId === def.roomId && Math.hypot(p.px + 0.5 - fx, p.py + 0.5 - fy) < 0.9) return true;
    for (const w of ROOMS[def.roomId]._walkers || []) if (Math.hypot(w.fx + 0.5 - fx, w.fy + 0.5 - fy) < 0.7) return true;
    if (c.hop > 0) return false;                                  // passando por cima de um carro enroscado
    if (c.wait > 4 && !c.queued) { c.hop = 1.6; return false; }   // enroscado: sobe e passa por cima (nunca fura a fila do semáforo)
    for (const o of traffic) if (o !== c && Math.hypot(o.x - fx, o.y - fy) < 1.2 && (o.dx * c.dx + o.dy * c.dy) > -0.5) {
      // dois carros travados um pelo outro: o de prioridade sobe e passa, o outro espera
      if (o.blockBy === c && traffic.indexOf(c) < traffic.indexOf(o)) { c.hop = 1.6; return false; }
      c.blockBy = o; return true;
    }
    return false;
  }

  function updateTraffic(dt) {
    for (const c of traffic) {
      // semáforo: antes de entrar na faixa ou no cruzamento, só passa no verde (no amarelo, só se já estiver em cima)
      let red = false;
      const cxT = Math.floor(c.x), cyT = Math.floor(c.y);
      if (!zoneAt(cxT, cyT) && zoneAt(Math.floor(c.x + c.dx * 1.3), Math.floor(c.y + c.dy * 1.3))) {
        const L = light(c.dy !== 0);
        red = L === 'r' || (L === 'y' && !zoneAt(Math.floor(c.x + c.dx * 0.5), Math.floor(c.y + c.dy * 0.5)));
        // não entra se ainda tem carro atravessando no outro sentido (cruzamento livre antes de avançar)
        if (!red) for (const o of traffic) if (o !== c && o.dx * c.dx + o.dy * c.dy === 0 && zoneAt(Math.floor(o.x), Math.floor(o.y)) && Math.hypot(o.x - c.x, o.y - c.y) < 9) { red = true; break; }
      }
      c.atRed = red; c.blockBy = null;
      const stop = red || trafficBlocked(c, 1.4);
      c.queued = red || !!(c.blockBy && (c.blockBy.atRed || c.blockBy.queued));
      c.v += ((stop ? 0 : c.speed) - c.v) * Math.min(1, dt * (stop ? 6 : 1.5));
      c.wait = stop ? c.wait + dt : 0;
      // ruas de pedestres (Chinatown) e fim da faixa: o carro faz o retorno
      const ax = c.x + c.dx * 1.3, ay = c.y + c.dy * 1.3;
      if (!carOK(Math.floor(ax), Math.floor(ay)) || inCT(Math.floor(ax), Math.floor(ay))) {
        c.dx = -c.dx; c.dy = -c.dy; c.plan = null;
        if (c.dx !== 0) c.y = laneCoord(c.dx, 0, roadIdx[Math.floor(c.y)], c.sub); else c.x = laneCoord(0, c.dy, roadIdx[Math.floor(c.x)], c.sub);
      }
      // encostou em outro carro (retorno, saída do cruzamento): sobe por cima em vez de atravessar a lataria
      if (!c.hop && traffic.some(o => o !== c && o.rise < 2 && Math.hypot(o.x - c.x, o.y - c.y) < 0.75)) c.hop = 0.3;
      const step = c.v * dt;
      const ox = c.x, oy = c.y;
      c.x += c.dx * step; c.y += c.dy * step;
      // passa por cima de carros estacionados (sobe um pouco, como todo flutuante)
      if (c.hop > 0) { c.hop -= dt; if (c.hop <= 0 && traffic.some(o => o !== c && Math.hypot(o.x - c.x, o.y - c.y) < 1.1)) c.hop = 0.2; }   // só pousa com espaço livre embaixo
      else c.hop = 0;
      const under = c.hop > 0 || parked().some(o => Math.hypot(o.cx - c.x, o.cy - c.y) < 1.4);
      c.rise += ((under ? 12 : 0) - c.rise) * Math.min(1, dt * 4);
      // cruzamento: decide uma vez se segue ou vira
      const ix = roadIdx[Math.floor(c.x)], iy = roadIdx[Math.floor(c.y)];
      const inCross = ix >= 0 && iy >= 0;
      const id = ix + ',' + iy;
      if (inCross && c.lastCross !== id) {
        c.lastCross = id;
        const opts = [[c.dx, c.dy]];
        for (const [nx, ny] of [[c.dy, -c.dx], [-c.dy, c.dx]]) {
          const tx = roadStart[ix] + RW[ix] / 2 + nx * (RW[ix] / 2 + 3), ty = roadStart[iy] + RW[iy] / 2 + ny * (RW[iy] / 2 + 3);
          if (tx > 0 && ty > 0 && tx < N - 1 && ty < N - 1 && carOK(Math.floor(tx), Math.floor(ty))) opts.push([nx, ny]);
        }
        c.plan = opts[Math.floor(Math.random() * opts.length)];
        if (c.plan[0] === c.dx && c.plan[1] === c.dy) c.plan = null;
      }
      if (c.plan) {
        const [nx, ny] = c.plan;
        // ponto da virada: a coordenada da nova faixa
        const turnAt = nx !== 0 ? laneCoord(nx, 0, iy, c.sub) : laneCoord(0, ny, ix, c.sub);
        const cur = c.dx !== 0 ? c.x : c.y, prev = c.dx !== 0 ? ox : oy;
        if ((prev - turnAt) * (cur - turnAt) <= 0) {
          if (c.dx !== 0) c.x = turnAt; else c.y = turnAt;
          c.dx = nx; c.dy = ny; c.plan = null;
          if (c.dx !== 0) c.y = laneCoord(c.dx, 0, iy, c.sub); else c.x = laneCoord(0, c.dy, ix, c.sub);
        }
      }
      // fim do mapa: faz o retorno
      if (c.x < 0.5 || c.x > N - 0.5 || c.y < 0.5 || c.y > N - 0.5) {
        c.dx = -c.dx; c.dy = -c.dy;
        if (c.dx !== 0) c.y = laneCoord(c.dx, 0, roadIdx[Math.floor(c.y)], c.sub); else c.x = laneCoord(0, c.dy, roadIdx[Math.floor(c.x)], c.sub);
        c.x = Math.max(0.6, Math.min(N - 0.6, c.x)); c.y = Math.max(0.6, Math.min(N - 0.6, c.y));
      }
    }
  }
  const parked = () => ROOMS[def.roomId] ? ROOMS[def.roomId].objects.filter(o => o.cx !== undefined) : [];

  // ---------- desenho do chão ----------
  // os losangos são agrupados por cor (um preenchimento por cor em vez de um por tile);
  // a primeira camada de cada tile vai antes de todos os detalhes
  function drawGround(t, view) {
    const base = new Map(), over = new Map();
    let layer = base;
    const diamond = (x, y, w, d, z, col) => {
      let p = layer.get(col);
      if (!p) { p = new Path2D(); layer.set(col, p); }
      const a = iso(x, y), b = iso(x + w, y), c = iso(x + w, y + d), e = iso(x, y + d);
      p.moveTo(a[0], a[1]); p.lineTo(b[0], b[1]); p.lineTo(c[0], c[1]); p.lineTo(e[0], e[1]); p.closePath();
    };
    for (let y = view.y0; y <= view.y1; y++) for (let x = view.x0; x <= view.x1; x++) {
      if (!inside(x, y)) continue;
      const [sx, sy] = iso(x + 0.5, y + 0.5);
      if (sx < -24 || sx > VW + 24 || sy < -16 || sy > VH + 16) continue;
      const v = tile(x, y), odd = (x + y) % 2, n = (x * 7 + y * 13) % 5;
      layer = base;
      switch (v) {
        case T.ROAD: case T.CROSS: {
          diamond(x, y, 1, 1, 0, n === 0 ? '#17171d' : '#141419');
          layer = over;
          const vert = x % 10 < 2, horiz = y % 10 < 2;
          if (v === T.CROSS) {
            if (vert) for (let k = 0; k < 4; k++) diamond(x + 0.05 + k * 0.24, y + 0.1, 0.13, 0.8, 0, 'rgba(230,230,240,0.32)');
            else for (let k = 0; k < 4; k++) diamond(x + 0.1, y + 0.05 + k * 0.24, 0.8, 0.13, 0, 'rgba(230,230,240,0.32)');
          } else if (vert && !horiz && x % 10 === 0 && y % 2 === 0) diamond(x + 0.94, y + 0.15, 0.12, 0.6, 0, 'rgba(255,210,63,0.6)');
          else if (horiz && !vert && y % 10 === 0 && x % 2 === 0) diamond(x + 0.15, y + 0.94, 0.6, 0.12, 0, 'rgba(255,210,63,0.6)');
          if (n === 3) diamond(x + 0.25, y + 0.3, 0.5, 0.4, 0, ['rgba(255,79,216,0.06)', 'rgba(56,246,255,0.06)', 'rgba(255,210,63,0.06)'][(x + y) % 3]);
          break;
        }
        case T.WALK: case T.CTWALK: {
          const ctw = v === T.CTWALK;
          diamond(x, y, 1, 1, 0, ctw ? (odd ? '#3a1a1e' : '#321619') : (odd ? '#2a2830' : '#24222a'));
          layer = over;
          // meio-fio onde a calçada encontra a rua
          const road = (xx, yy) => { const q = tile(xx, yy); return q === T.ROAD || q === T.CROSS; };
          if (road(x, y + 1)) diamond(x, y + 0.86, 1, 0.14, 0, '#46444e');
          if (road(x + 1, y)) diamond(x + 0.86, y, 0.14, 1, 0, '#3e3c46');
          if (road(x, y - 1)) diamond(x, y, 1, 0.1, 0, '#3e3c46');
          if (road(x - 1, y)) diamond(x, y, 0.1, 1, 0, '#3e3c46');
          break;
        }
        case T.PLAZA: diamond(x, y, 1, 1, 0, odd ? '#22222c' : '#1e1e28'); layer = over; diamond(x + 0.1, y + 0.1, 0.8, 0.8, 0, odd ? '#26263a' : '#20202e'); break;
        case T.GRASS: diamond(x, y, 1, 1, 0, n === 1 ? '#173322' : odd ? '#142c1e' : '#12281a'); break;
        case T.CTSTREET:
          diamond(x, y, 1, 1, 0, odd ? '#4a2024' : '#40191d');
          layer = over;
          diamond(x + 0.12, y + 0.12, 0.76, 0.76, 0, odd ? '#521e24' : '#481a1f');
          if (n === 2) diamond(x + 0.3, y + 0.3, 0.4, 0.4, 0, 'rgba(255,80,60,0.08)');
          break;
        case T.BLD: diamond(x, y, 1, 1, 0, '#0c0a12'); break;
      }
    }
    for (const m of [base, over]) for (const [col, p] of m) { ctx.fillStyle = col; ctx.fill(p); }
  }

  // ---------- desenho dos prédios ----------
  const TU = 12, TV = 2;
  function faceTex(b, len, side) {
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.ceil(len * TU)); cv.height = Math.max(1, Math.ceil(b.h * TV));
    const g = cv.getContext('2d');
    const base = b.style === 'ct' ? b.col : b.style === 'temple' ? '#7a1018' : b.style === 'bath' ? '#4a2a1a' : b.col;
    g.fillStyle = shade(base, side ? 0.8 : 0.62); g.fillRect(0, 0, cv.width, cv.height);
    let s2 = (b.seed || 7) + (side ? 13 : 0);
    const r = () => (s2 = (s2 * 9301 + 49297) % 233280) / 233280;
    const hasShop = b.shops.some(s => s.side === side);
    const vStart = hasShop || ['cafe', 'ct', 'bath', 'temple'].includes(b.style) ? 22 : 6;
    if (b.style === 'ct' || b.style === 'bath') {
      // sobrado chinês: janelas com venezianas e sacadas
      for (let v = vStart; v < b.h - 6; v += 14) for (let u = 0.3; u < len - 0.3; u += 0.8) {
        g.fillStyle = r() < 0.6 ? 'rgba(255,190,110,0.6)' : '#140a0a';
        g.fillRect(u * TU, (b.h - v - 6) * TV, 0.4 * TU, 6 * TV);
        g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect((u - 0.08) * TU, (b.h - v) * TV, 0.56 * TU, 1 * TV);
      }
      g.fillStyle = 'rgba(0,0,0,0.3)'; for (let v = 18; v < b.h; v += 14) g.fillRect(0, (b.h - v) * TV, cv.width, 0.8 * TV);
      return cv;
    }
    if (b.style === 'temple') return cv;
    // fachada: vidro escuro refletindo o céu (torres) ou reboco com placas (baixas), lajes e pilares
    const low = b.style === 'low' || b.style === 'factory', H = cv.height;
    const gr = g.createLinearGradient(0, 0, 0, H);
    if (low) { gr.addColorStop(0, shade(base, side ? 1.05 : 0.85)); gr.addColorStop(1, shade(base, side ? 0.8 : 0.6)); }
    else { gr.addColorStop(0, shade(base, side ? 1.5 : 1.15)); gr.addColorStop(0.35, shade(base, side ? 0.95 : 0.7)); gr.addColorStop(1, shade(base, side ? 0.7 : 0.5)); }
    g.fillStyle = gr; g.fillRect(0, 0, cv.width, H);
    const acc = b.acc || (b.acc = ['#38f6ff', '#ff4fd8', '#b04cff', '#7dff6b', '#ffd23f'][(b.seed || 0) % 5]);
    if (!low) {   // reflexo diagonal do céu no vidro
      g.globalAlpha = 0.07; g.fillStyle = '#c8d8ff';
      for (let x = -H; x < cv.width; x += 46) { g.beginPath(); g.moveTo(x, H); g.lineTo(x + 14, H); g.lineTo(x + 14 + H * 0.5, 0); g.lineTo(x + H * 0.5, 0); g.fill(); }
      g.globalAlpha = 1;
    }
    for (let v = vStart - 3; v < b.h; v += 14) { g.fillStyle = low ? 'rgba(0,0,0,0.25)' : 'rgba(200,220,255,0.07)'; g.fillRect(0, (b.h - v) * TV, cv.width, 1.4 * TV); }
    if (!low) for (let u = 1; u < len; u += 1) { g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(u * TU - 1, 0, 2, H); }
    const lit = b.style === 'hotel' ? 0.75 : b.style === 'police' ? 0.6 : low ? 0.55 : 0.5;
    const COLS = ['#ffcf8a', '#ffcf8a', '#ffe0b0', '#bfe0ff', '#7fd8ff', '#ff8ad8', '#e8b870'];
    const live = (b.live = b.live || [[], []])[side] = [];
    const step = low ? 0.55 : 0.25, ww = low ? 0.3 : 0.16;
    for (let v = vStart; v < b.h - 4; v += 14) for (let u = 0.12; u < len - ww; u += step) {
      const k = r(), x = u * TU, y = (b.h - v - 7) * TV, w = ww * TU, h = 7 * TV;
      if (k > lit) {   // janela apagada: vidro escuro com reflexo no alto
        g.fillStyle = 'rgba(8,10,24,0.85)'; g.fillRect(x, y, w, h);
        g.fillStyle = 'rgba(140,170,255,0.12)'; g.fillRect(x, y, w, h * 0.3);
        continue;
      }
      const col = b.style === 'police' ? (k < 0.1 ? '#7fd8ff' : '#c8d8ff') : COLS[Math.floor(r() * COLS.length)];
      // luz da sala: mais forte embaixo (abajur), com moldura escura
      const lg = g.createLinearGradient(0, y, 0, y + h);
      lg.addColorStop(0, rgba(col, 0.35 + r() * 0.2)); lg.addColorStop(1, rgba(col, 0.75 + r() * 0.25));
      g.fillStyle = lg; g.fillRect(x, y, w, h);
      const q = r();
      if (q < 0.25) { g.fillStyle = 'rgba(0,0,0,0.35)'; for (let yy = y + 2; yy < y + h; yy += 3) g.fillRect(x, yy, w, 1); }          // persiana
      else if (q < 0.35) { g.fillStyle = 'rgba(10,6,16,0.7)'; g.fillRect(x + w * 0.3, y + h * 0.35, w * 0.35, h * 0.65); }          // alguém na janela
      else if (q < 0.45) { g.fillStyle = 'rgba(30,60,30,0.6)'; g.fillRect(x, y + h * 0.7, w, h * 0.3); }                           // plantas no parapeito
      g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(x, y, w, 1); g.fillRect(x + w / 2 - 0.5, y, 1, h);
      if (low && r() < 0.5) { g.fillStyle = '#5a5a60'; g.fillRect(x + w * 0.1, y + h + 1, w * 0.5, 4); }                             // ar-condicionado
      if (r() < 0.14 && live.length < 14) live.push({ u, v, w: ww, col, kind: ['tv', 'fade', 'fade', 'neon', 'off'][Math.floor(r() * 5)], ph: r() * 6.3 });
    }
    return cv;
  }

  // desenha no plano da fachada: u ao longo do prédio, v = altura
  // (só a matriz é guardada: save/restore completo em centenas de fachadas pesa no celular)
  function onFace(b, side, fn) {
    const T0 = ctx.getTransform();
    if (side) ctx.transform(-TW2, TH2, 0, -1, OX + (b.x + b.w - b.y) * TW2, OY + (b.x + b.w + b.y) * TH2);
    else ctx.transform(TW2, TH2, 0, -1, OX + (b.x - b.y - b.d) * TW2, OY + (b.x + b.y + b.d) * TH2);
    ctx.scale(1, CITY_SV);
    fn();
    ctx.setTransform(T0);
  }
  // texto pintado na fachada (em pixels de jogo, sem distorção vertical)
  function faceText(b, side, u, v, txt, size, col, opts = {}) {
    txt = tr(txt);
    const len = side ? b.d : b.w;
    onFace(b, side, () => {
      // na fachada direita, u cresce para a esquerda da tela: espelha para o texto ler certo
      if (side) { ctx.translate(len - u, v); ctx.scale(-1.5 / TW2, -1.5 / CITY_SV); }
      else { ctx.translate(u, v); ctx.scale(1.5 / TW2, -1.5 / CITY_SV); }
      ctx.font = `700 ${size}px ${opts.font || '"Chakra Petch", sans-serif'}`;
      ctx.textAlign = opts.align || 'center'; ctx.textBaseline = 'middle';
      // brilho barato: o texto translúcido levemente maior por trás (shadowBlur pesa no celular)
      const put = () => { if (opts.vertical) [...txt].forEach((ch, i) => ctx.fillText(ch, 0, i * size * 1.05)); else ctx.fillText(txt, 0, 0); };
      if (opts.glow !== false) { ctx.globalAlpha = 0.35; ctx.fillStyle = col; ctx.lineWidth = size * 0.35; ctx.strokeStyle = col; if (opts.vertical) [...txt].forEach((ch, i) => ctx.strokeText(ch, 0, i * size * 1.05)); else ctx.strokeText(txt, 0, 0); ctx.globalAlpha = 1; }
      ctx.fillStyle = col;
      put();
      ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
    });
  }

  function drawShop(sh, t) {
    const { b, side, u0, u1, col } = sh;
    onFace(b, side, () => {
      wallRect(u0, 0, u1, 17, '#0a0610');
      const flick = 0.32 + 0.05 * Math.sin(t * 2 + u0 * 3);
      wallRect(u0 + 0.06, 1.5, u1 - 0.06, 15, rgba(col, flick));
      wallRect(u0 + 0.06, 1.5, u1 - 0.06, 4, 'rgba(0,0,0,0.35)');
      // silhuetas e prateleiras do lado de dentro
      for (let k = 0; k < (u1 - u0) * 3; k++) wallRect(u0 + 0.15 + k * 0.33, 6 + (k % 2) * 2, u0 + 0.3 + k * 0.33, 7 + (k % 2) * 2, rgba('#ffffff', 0.25));
      const dc = (u0 + u1) / 2;
      wallRect(dc - 0.32, 0, dc + 0.32, 13, '#1a1420'); wallRect(dc - 0.28, 0.5, dc + 0.28, 12.4, rgba(col, 0.55));
      wallRect(u0, 17, u1, 23, '#140a10'); wallRect(u0, 22.6, u1, 23, col);
    });
    const latin = /[A-Za-zÀ-ú]/.test(sh.sign);
    faceText(b, side, (u0 + u1) / 2, 20, sh.sign, latin ? 4.2 : 5, col, { font: latin ? '"Chakra Petch", sans-serif' : 'sans-serif' });
    if (!latin && sh.sign.length <= 3) faceText(b, side, u1 - 0.25, 34, sh.sign, 5, col, { vertical: true, font: 'sans-serif' });
    // toldo saindo da fachada
    const out = 0.45;
    const P = (u, o2, v) => side ? iso(b.x + b.w + o2, b.y + u, v) : iso(b.x + u, b.y + b.d + o2, v);
    const zA = 17 * CITY_SV, zB = 13 * CITY_SV;
    poly(ctx, [P(u0, 0, zA), P(u1, 0, zA), P(u1, out, zB), P(u0, out, zB)], shade(col, 0.55));
    for (let k = 0; k < (u1 - u0) * 4; k += 2) { const a = u0 + k * 0.25, c2 = Math.min(u1, a + 0.25); poly(ctx, [P(a, 0, zA), P(c2, 0, zA), P(c2, out, zB), P(a, out, zB)], shade(col, 0.85)); }
    if (b.style === 'ct') for (const u of [u0 + 0.2, u1 - 0.2]) {
      const [lx, ly] = P(u, out - 0.05, 12 * CITY_SV);
      ctx.fillStyle = '#e8202a'; ctx.beginPath(); ctx.ellipse(lx, ly + 2, 1.8, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd23f'; ctx.fillRect(lx - 0.9, ly - 0.4, 1.8, 0.5);
    }
  }

  // ---------- outdoor holográfico (estilo Blade Runner) ----------
  // um projetor no topo do prédio lança um feixe; no ar, o painel translúcido com logo, marca, slogan,
  // faixa vertical em japonês, linhas de varredura, falhas de sinal e luz derramando no prédio
  function holoLogo(kind, x, y, r, col, t) {
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 0.9;
    ctx.beginPath();
    switch (kind) {
      case 'siren': ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, Math.PI * 2); ctx.fill(); break;
      case 'arches': ctx.lineWidth = 1.3; ctx.moveTo(x - r, y + r); ctx.quadraticCurveTo(x - r * 0.5, y - r * 1.6, x, y + r * 0.2); ctx.quadraticCurveTo(x + r * 0.5, y - r * 1.6, x + r, y + r); ctx.stroke(); break;
      case 'pear': ctx.arc(x, y + r * 0.35, r * 0.7, 0, Math.PI * 2); ctx.arc(x, y - r * 0.35, r * 0.45, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x - 0.3, y - r * 1.15, 0.6, r * 0.45); break;
      case 'swoosh': ctx.lineWidth = 1.4; ctx.moveTo(x - r, y); ctx.quadraticCurveTo(x - r * 0.3, y + r * 0.9, x + r * 1.1, y - r * 0.6); ctx.stroke(); break;
      case 'wave': ctx.lineWidth = 1.2; for (let k = 0; k <= 12; k++) { const u = x - r + (k / 12) * r * 2, v = y + Math.sin(k / 12 * Math.PI * 2 + t * 3) * r * 0.45; k ? ctx.lineTo(u, v) : ctx.moveTo(u, v); } ctx.stroke(); break;
      case 'bolt': ctx.moveTo(x + r * 0.2, y - r); ctx.lineTo(x - r * 0.6, y + r * 0.15); ctx.lineTo(x, y + r * 0.15); ctx.lineTo(x - r * 0.2, y + r); ctx.lineTo(x + r * 0.6, y - r * 0.15); ctx.lineTo(x, y - r * 0.15); ctx.closePath(); ctx.fill(); break;
      case 'orbit': ctx.ellipse(x, y, r, r * 0.42, -0.3, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x + Math.cos(t * 2) * r, y + Math.sin(t * 2) * r * 0.42, 0.8, 0, Math.PI * 2); ctx.fill(); break;
      case 'num': ctx.font = `900 ${r * 1.6}px "Chakra Petch", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('24', x, y); ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic'; break;
      case 'helix': ctx.lineWidth = 0.7; for (const ph of [0, Math.PI]) { ctx.beginPath(); for (let k = 0; k <= 10; k++) { const v = y - r + (k / 10) * r * 2, u = x + Math.sin(k / 10 * Math.PI * 2 + t * 2 + ph) * r * 0.6; k ? ctx.lineTo(u, v) : ctx.moveTo(u, v); } ctx.stroke(); } break;
    }
  }
  function holoBillboard(b, tx, ty, t) {
    const [brand, slogan, col, logo, jp] = b.holo;
    const sl = slogan ? tr(slogan) : '';
    const W = Math.max(38, brand.length * 5.4 + 22), H = 24;
    const x0 = tx - W / 2, y0 = ty - 46 + Math.sin(t * 0.8 + b.seed) * 0.8;   // painel flutuando acima do topo
    const flick = Math.random() < 0.025 ? 0.25 : 0.88 + Math.sin(t * 17 + b.seed) * 0.05;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // feixe do projetor (do teto até o painel)
    const beam = ctx.createLinearGradient(0, ty, 0, y0 + H);
    beam.addColorStop(0, rgba(col, 0.35)); beam.addColorStop(1, rgba(col, 0.03));
    ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(tx - 1.2, ty - 1); ctx.lineTo(tx + 1.2, ty - 1); ctx.lineTo(x0 + W, y0 + H); ctx.lineTo(x0, y0 + H); ctx.closePath(); ctx.fill();
    ctx.fillStyle = col; ctx.fillRect(tx - 1.5, ty - 2, 3, 1.4);                        // o projetor
    // luz derramando no prédio e no ar em volta
    const halo = ctx.createRadialGradient(tx, y0 + H / 2, 0, tx, y0 + H / 2, W * 0.9);
    halo.addColorStop(0, rgba(col, 0.22 * flick)); halo.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = halo; ctx.fillRect(tx - W, y0 - W * 0.4, W * 2, W * 1.6);
    // painel translúcido com borda e cantos
    ctx.globalAlpha = flick;
    const pg = ctx.createLinearGradient(0, y0, 0, y0 + H);
    pg.addColorStop(0, rgba(col, 0.26)); pg.addColorStop(1, rgba(col, 0.08));
    ctx.fillStyle = pg; ctx.fillRect(x0, y0, W, H);
    ctx.strokeStyle = rgba(col, 0.85); ctx.lineWidth = 0.4; ctx.strokeRect(x0, y0, W, H);
    ctx.fillStyle = col;
    for (const [cx2, cy2, dx, dy] of [[x0, y0, 1, 1], [x0 + W, y0, -1, 1], [x0, y0 + H, 1, -1], [x0 + W, y0 + H, -1, -1]]) { ctx.fillRect(cx2 - (dx < 0 ? 3 : 0), cy2 - (dy < 0 ? 0.8 : 0), 3, 0.8); ctx.fillRect(cx2 - (dx < 0 ? 0.8 : 0), cy2 - (dy < 0 ? 3 : 0), 0.8, 3); }
    // conteúdo: logo, marca (com brilho duplicado), slogan e faixa vertical em japonês
    const glitch = Math.sin(t * 3.1 + b.seed) > 0.97 ? (Math.random() - 0.5) * 3 : 0;
    holoLogo(logo, x0 + 8 + glitch, y0 + H / 2 - 1, 4.2, col, t);
    const bx = x0 + 15 + (W - 19) / 2;
    ctx.globalAlpha = flick * 0.45; propText(brand, bx + 0.4 + glitch, y0 + 9.4, 7.2, col, 'sans-serif');
    ctx.globalAlpha = flick; propText(brand, bx + glitch, y0 + 9, 7, '#ffffff', 'sans-serif');
    if (sl) propText(sl, bx, y0 + 17, 3.4, col, 'sans-serif');
    ctx.globalAlpha = flick * 0.9;
    ctx.fillStyle = rgba(col, 0.18); ctx.fillRect(x0 + W + 1.5, y0 - 2, 5, H + 4);
    ctx.font = '700 4px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = col;
    [...jp].forEach((ch, k) => ctx.fillText(ch, x0 + W + 4, y0 + 3 + k * 5));
    ctx.textAlign = 'start';
    // linhas de varredura descendo e uma faixa de falha de sinal
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    for (let yy = y0 + ((t * 6) % 1.6); yy < y0 + H; yy += 1.6) ctx.fillRect(x0, yy, W, 0.45);
    const band = y0 + ((t * 9 + b.seed) % (H * 3));
    if (band < y0 + H) { ctx.globalAlpha = 0.35; ctx.fillStyle = col; ctx.fillRect(x0, band, W, 1.2); }
    ctx.restore();
  }

  function drawBuilding(b, t) {
    if (!b.texL) { b.texL = faceTex(b, b.w, 0); b.texR = faceTex(b, b.d, 1); }
    for (const side of [0, 1]) {
      const len = side ? b.d : b.w, tex = side ? b.texR : b.texL;
      onFace(b, side, () => {
        const T1 = ctx.getTransform();
        ctx.translate(0, b.h); ctx.scale(1, -1);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(tex, 0, 0, len, b.h);
        ctx.imageSmoothingEnabled = false;
        ctx.setTransform(T1);
        if (b.style === 'hotel') {
          for (let u = 0.5; u < len; u += 1) wallRect(u - 0.02, 30, u + 0.02, b.h - 6, rgba('#ff4fd8', 0.55 + 0.25 * Math.sin(t * 2 + u)));
        }
        // janelas vivas: TV piscando, luz acendendo e apagando devagar, letreiro de neon, lâmpada falhando
        if (b.live) for (const L of b.live[side]) {
          let k;
          if (L.kind === 'tv') k = 0.25 + 0.6 * Math.abs(Math.sin(t * 6.3 + L.ph) * Math.sin(t * 2.1 + L.ph * 3));
          else if (L.kind === 'fade') k = Math.max(0, Math.min(1, 0.5 + Math.sin(t * 0.35 + L.ph) * 1.6));
          else if (L.kind === 'neon') k = Math.sin(t * 1.7 + L.ph) > -0.2 ? 0.85 : 0.1;
          else k = Math.random() < 0.08 ? 0 : 0.9;
          const col = L.kind === 'tv' ? (Math.sin(t * 1.3 + L.ph) > 0 ? '#7fb8ff' : '#c8f0ff') : L.kind === 'neon' ? '#ff4fd8' : L.col;
          wallRect(L.u, L.v, L.u + L.w, L.v + 7, rgba(col, 0.75 * k));
          if (k > 0.3) wallRect(L.u - 0.04, L.v - 0.6, L.u + L.w + 0.04, L.v + 7.6, rgba(col, 0.12 * k));
        }
        // torres: fitas de LED nas quinas com um pulso de luz subindo, e coroa iluminada
        if (b.style === 'tower' && b.h >= 40 && !b.border) {
          const acc = b.acc || '#38f6ff', pulse = (t * 22 + (b.seed % 97)) % (b.h + 20) - 10;
          for (const u of [0.02, len - 0.06]) {
            wallRect(u, 0, u + 0.04, b.h, rgba(acc, 0.35 + 0.15 * Math.sin(t * 2 + b.seed)));
            wallRect(u - 0.02, pulse, u + 0.06, pulse + 8, rgba('#ffffff', 0.8));
          }
          wallRect(0, b.h - 3, len, b.h - 1.6, rgba(acc, 0.7 + 0.3 * Math.sin(t * 3 + b.seed)));
          if (b.h >= 90) for (let u = 0.25; u < len; u += 0.5) wallRect(u, b.h - 9, u + 0.25, b.h - 5, rgba(acc, 0.25 + 0.25 * Math.sin(t * 4 - u * 2)));
        }
        if (b.style === 'temple') {
          for (let u = 0.3; u < len; u += 0.9) wallRect(u, 0, u + 0.16, 24, '#c8202a');
          wallRect(0, 24, len, 27, '#ffd23f');
        }
      });
    }
    // telhado
    const H = b.h * CITY_SV;
    const a = iso(b.x, b.y, H), bb = iso(b.x + b.w, b.y, H), c = iso(b.x + b.w, b.y + b.d, H), e = iso(b.x, b.y + b.d, H);
    poly(ctx, [a, bb, c, e], shade(b.col, 1.15));
    line([e, c, bb], 'rgba(255,255,255,0.12)', 0.4);
    if (b.border) return;
    for (const sh of b.shops) drawShop(sh, t);
    const [tx, ty] = iso(b.x + b.w / 2, b.y + b.d / 2, H);
    switch (b.style) {
      case 'low': {
        // telhado de sobrado: caixa d'água, condensadores girando, antena e varal de luzes
        const sd = b.seed;
        box(b.x + 0.2, b.y + 0.2, b.w - 0.4, b.d - 0.4, 1.2, shade(b.col, 0.8), H);
        if (sd % 3 !== 0) box(b.x + b.w - 0.9, b.y + 0.3, 0.55, 0.55, 9, '#4a4a52', H, '#6a6a72');
        for (let k = 0; k < 2 + sd % 2; k++) {
          const cx2 = b.x + 0.4 + k * 0.8, cy2 = b.y + b.d - 0.8;
          box(cx2, cy2, 0.5, 0.4, 3.5, '#8a8e96', H, '#a8acb4');
          const [fx2, fy2] = iso(cx2 + 0.25, cy2 + 0.2, H + 3.6), a2 = t * 9 + k;
          ctx.strokeStyle = '#3a3a42'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(fx2 - Math.cos(a2) * 2, fy2 - Math.sin(a2)); ctx.lineTo(fx2 + Math.cos(a2) * 2, fy2 + Math.sin(a2)); ctx.stroke();
        }
        if (sd % 4 === 1) {
          const p1 = iso(b.x + 0.2, b.y + 0.3, H + 6), p2 = iso(b.x + b.w - 0.3, b.y + b.d - 0.3, H + 6);
          line([p1, p2], 'rgba(40,40,50,0.8)', 0.3);
          for (let k = 1; k < 8; k++) { const q = k / 8; ctx.fillStyle = ['#ffd23f', '#ff4fd8', '#38f6ff'][k % 3]; ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 3 + k); ctx.fillRect(p1[0] + (p2[0] - p1[0]) * q - 0.5, p1[1] + (p2[1] - p1[1]) * q + Math.sin(q * Math.PI) * 2, 1, 1); }
          ctx.globalAlpha = 1;
        }
        if (sd % 5 === 2) { const [ax, ay] = iso(b.x + 0.5, b.y + 0.5, H); line([[ax, ay], [ax, ay - 14]], '#4a4a52', 0.4); if (Math.sin(t * 2.5 + sd) > 0.3) { ctx.fillStyle = '#ff3355'; ctx.fillRect(ax - 0.6, ay - 15, 1.2, 1.2); } }
        if (b.sign) faceText(b, 0, b.w / 2, Math.min(b.h - 4, 18), b.sign, 3.8, b.signCol || '#ffb347');
        break;
      }
      case 'factory': {
        // galpão: telhado em dente de serra com claraboias, chaminé fumegando e letreiro na fachada
        const n = Math.max(2, Math.round(b.w / 1.4));
        for (let k = 0; k < n; k++) {
          const x0 = b.x + k * b.w / n, x1 = x0 + b.w / n;
          poly(ctx, [iso(x0, b.y + 0.1, H), iso(x0, b.y + b.d - 0.1, H), iso(x0, b.y + b.d - 0.1, H + 5), iso(x0, b.y + 0.1, H + 5)], rgba('#ffcf8a', 0.25 + 0.1 * ((b.seed + k) % 3)));
          poly(ctx, [iso(x0, b.y + 0.1, H + 5), iso(x0, b.y + b.d - 0.1, H + 5), iso(x1, b.y + b.d - 0.1, H), iso(x1, b.y + 0.1, H)], shade(b.col, 1.3));
        }
        if (b.seed % 3 !== 1) {
          const cx2 = b.x + b.w - 0.75, cy2 = b.y + 0.35;
          box(cx2, cy2, 0.45, 0.45, 26, '#4a3a32', H, '#2a201c');
          for (const z of [8, 18]) box(cx2 - 0.02, cy2 - 0.02, 0.49, 0.49, 1, '#c8202a', H + z);
          const [sx2, sy2] = iso(cx2 + 0.22, cy2 + 0.22, H + 27);
          for (let k = 0; k < 5; k++) { const up = (t * 6 + k * 6 + b.seed) % 30; ctx.fillStyle = `rgba(150,140,140,${0.22 * (1 - up / 30)})`; ctx.beginPath(); ctx.ellipse(sx2 + Math.sin(t * 0.7 + k) * 3 + up * 0.4, sy2 - up, 3 + up * 0.35, 2 + up * 0.15, 0, 0, Math.PI * 2); ctx.fill(); }
          if (Math.sin(t * 2 + b.seed) > 0.2) { ctx.fillStyle = '#ff3355'; ctx.fillRect(sx2 - 0.7, sy2 - 1, 1.4, 1.4); }
        }
        if (b.sign) faceText(b, 0, b.w / 2, Math.min(b.h - 6, 30), b.sign, 4.6, b.signCol || '#ffb347');
        break;
      }
      case 'tower':
        if (b.h >= 95 && !b.border) {
          // heliponto com luzes que piscam em sequência
          const [hx, hy] = iso(b.x + b.w / 2, b.y + b.d / 2, H + 0.5);
          ctx.strokeStyle = rgba(b.acc || '#38f6ff', 0.7); ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.ellipse(hx, hy, Math.min(b.w, b.d) * 5, Math.min(b.w, b.d) * 2.5, 0, 0, Math.PI * 2); ctx.stroke();
          for (let k = 0; k < 8; k++) { const an = k / 8 * Math.PI * 2, on = Math.floor(t * 8) % 8 === k; ctx.fillStyle = on ? '#ffffff' : rgba(b.acc || '#38f6ff', 0.5); ctx.fillRect(hx + Math.cos(an) * Math.min(b.w, b.d) * 5 - 0.5, hy + Math.sin(an) * Math.min(b.w, b.d) * 2.5 - 0.5, 1, 1); }
        }
        if (b.w * b.d >= 4) { box(b.x + 0.3, b.y + 0.3, 0.6, 0.5, 4, '#2a2a34', H); box(b.x + b.w - 0.9, b.y + 0.4, 0.5, 0.5, 3, '#2a2a34', H); }
        if (b.h > 110) { box(b.x + b.w / 2 - 0.05, b.y + b.d / 2 - 0.05, 0.1, 0.1, 16, '#3a3a48', H); if (Math.sin(t * 3 + b.x) > 0) { ctx.fillStyle = '#ff3355'; ctx.fillRect(tx - 0.8, ty - 17, 1.6, 1.6); } }
        if (b.holo) holoBillboard(b, tx, ty, t);
        // letreiro vertical de neon na quina da torre
        if (b.h >= 60 && !b.border && b.seed % 3 === 0) {
          const word = ['NEO', 'ZEN', 'BYTE', 'KAIJU', 'NOVA', '未来', '電脳', '夢', '光速'][b.seed % 9], acc = b.acc || '#38f6ff';
          const cw = /[A-Z]/.test(word) ? 3.4 : 4.6, v0 = b.h * 0.72, v1 = v0 - word.length * cw - 2;
          const on = Math.random() > 0.015;
          onFace(b, 0, () => { wallRect(b.w - 0.62, v1, b.w - 0.12, v0 + 2, 'rgba(5,3,12,0.85)'); wallRect(b.w - 0.64, v1, b.w - 0.6, v0 + 2, rgba(acc, 0.7)); wallRect(b.w - 0.14, v1, b.w - 0.1, v0 + 2, rgba(acc, 0.7)); });
          if (on) faceText(b, 0, b.w - 0.37, v0 - 1, word, /[A-Z]/.test(word) ? 4.2 : 5.6, acc, { vertical: true, font: /[A-Z]/.test(word) ? undefined : 'sans-serif' });
        }
        break;
      case 'hotel': {
        faceText(b, 1, b.d / 2 + 0.2, b.h - 20, 'ALVORADA', 7, '#ff4fd8', { vertical: true });
        // marquise da entrada e letreiro
        poly(ctx, [iso(b.x + 0.6, b.y + b.d, 22 * CITY_SV), iso(b.x + b.w - 0.6, b.y + b.d, 22 * CITY_SV), iso(b.x + b.w - 0.6, b.y + b.d + 0.8, 20 * CITY_SV), iso(b.x + 0.6, b.y + b.d + 0.8, 20 * CITY_SV)], '#2a1440');
        line([iso(b.x + 0.6, b.y + b.d + 0.8, 20 * CITY_SV), iso(b.x + b.w - 0.6, b.y + b.d + 0.8, 20 * CITY_SV)], '#ff4fd8', 0.8);
        onFace(b, 0, () => { wallRect(1.1, 0, 2.9, 18, '#0d0a14'); wallRect(1.2, 0, 2.8, 17, rgba('#ffb8e0', 0.35 + 0.05 * Math.sin(t * 2))); wallRect(1.98, 0, 2.02, 17, '#2a1440'); });
        faceText(b, 0, b.w / 2, 26, 'GRAND HOTEL ALVORADA', 3.6, '#ff8ad8');
        const g = ctx.createLinearGradient(0, ty - 140, 0, ty);
        g.addColorStop(0, 'rgba(255,79,216,0)'); g.addColorStop(1, 'rgba(255,79,216,0.3)');
        ctx.fillStyle = g; ctx.fillRect(tx - 3, ty - 140, 6, 140);
        break;
      }
      case 'corp': {
        // sede corporativa: letreiro vertical na quina, portaria de vidro, faixas de luz e feixe no topo
        const acc = b.signCol || '#38f6ff';
        faceText(b, 1, b.d / 2, b.h - 30, b.sign, 8, acc, { vertical: true });
        onFace(b, 0, () => {
          wallRect(b.w / 2 - 1.2, 0, b.w / 2 + 1.2, 22, '#0a0e16');
          wallRect(b.w / 2 - 1.1, 0, b.w / 2 + 1.1, 21, rgba('#cfe8ff', 0.35 + 0.05 * Math.sin(t * 2)));
          wallRect(b.w / 2 - 0.02, 0, b.w / 2 + 0.02, 21, '#141c2a');
          for (let v = 40; v < b.h - 10; v += 46) wallRect(0, v, b.w, v + 1.2, rgba(acc, 0.55));
        });
        faceText(b, 0, b.w / 2, 30, b.label || b.sign, 4.4, acc);
        const g = ctx.createLinearGradient(0, ty - 220, 0, ty);
        g.addColorStop(0, rgba(acc, 0)); g.addColorStop(1, rgba(acc, 0.28));
        ctx.fillStyle = g; ctx.fillRect(tx - 4, ty - 220, 8, 220);
        if (Math.sin(t * 3) > 0) { ctx.fillStyle = '#ff3355'; ctx.fillRect(tx - 1, ty - 4, 2, 2); }
        break;
      }
      case 'police': {
        faceText(b, 0, b.w / 2, 40, b.sign, 6, '#38a0ff');
        onFace(b, 0, () => { wallRect(2.1, 0, 3.9, 20, '#0d1220'); wallRect(2.2, 0, 3.8, 19, rgba('#cfe0ff', 0.35)); wallRect(2.98, 0, 3.02, 19, '#1a2a48'); wallRect(0, 30, b.w, 31, '#38a0ff'); });
        const on = Math.floor(t * 4) % 2;
        ctx.fillStyle = on ? '#ff3355' : '#38a0ff'; ctx.fillRect(tx - 6, ty - 3, 4, 2);
        ctx.fillStyle = on ? '#38a0ff' : '#ff3355'; ctx.fillRect(tx + 2, ty - 3, 4, 2);
        break;
      }
      case 'cafe':
        faceText(b, 0, b.w / 2, 24, 'CAFÉ NEON', 6, '#ff8ad8');
        onFace(b, 0, () => { wallRect(0.2, 2, b.w - 0.2, 16, rgba('#ffb8e0', 0.3 + 0.05 * Math.sin(t * 2))); wallRect(0.8, 0, 1.2, 14, '#1a1420'); for (let u = 1.6; u < b.w - 0.2; u += 0.6) wallRect(u, 4, u + 0.3, 6, rgba('#ffd8a0', 0.5)); });
        break;
      case 'home':
        faceText(b, 0, b.w / 2, 30, 'RESIDENCIAL KOWLOON', 4, '#7dff6b');
        onFace(b, 0, () => { wallRect(2.1, 0, 2.9, 16, '#0d1410'); wallRect(2.2, 0, 2.8, 15, rgba('#c8ffd0', 0.3)); });
        break;
      case 'ct': case 'bath': {
        // telhado de pagode: beirais verdes levantados e cumeeira dourada
        const ex = 0.3;
        box(b.x - ex, b.y - ex, b.w + ex * 2, b.d + ex * 2, 2, '#1e5a3a', H, '#2a7a4a');
        box(b.x + 0.4, b.y + 0.4, b.w - 0.8, b.d - 0.8, 5, '#1e5a3a', H + 2, '#2a6a44');
        line([iso(b.x + 0.4, b.y + b.d / 2, H + 7), iso(b.x + b.w - 0.4, b.y + b.d / 2, H + 7)], '#e8c040', 0.8);
        for (const [px2, py2] of [[b.x - ex, b.y + b.d + ex], [b.x + b.w + ex, b.y + b.d + ex], [b.x + b.w + ex, b.y - ex]]) { const [qx, qy] = iso(px2, py2, H + 2); ctx.fillStyle = '#2a7a4a'; ctx.fillRect(qx - 0.6, qy - 3, 1.2, 3); }
        if (b.style === 'bath') {
          faceText(b, 1, b.d / 2, 26, '湯', 9, '#ff3355', { font: 'sans-serif' });
          faceText(b, 0, b.w / 2, 30, 'CASA DE BANHO LÓTUS', 3.6, '#ffd8a0');
          // chaminé com vapor
          box(b.x + 1, b.y + 1, 0.5, 0.5, 18, '#5a3a2a', H + 2);
          const [cx2, cy2] = iso(b.x + 1.25, b.y + 1.25, H + 20);
          for (let k = 0; k < 4; k++) { const up = (t * 5 + k * 5) % 20; ctx.fillStyle = `rgba(230,230,240,${0.16 * (1 - up / 20)})`; ctx.beginPath(); ctx.ellipse(cx2 + Math.sin(t + k) * 2, cy2 - up, 3 + up * 0.3, 2, 0, 0, Math.PI * 2); ctx.fill(); }
        }
        break;
      }
      case 'temple': {
        box(b.x - 0.5, b.y - 0.5, b.w + 1, b.d + 1, 3, '#7a1018', H, '#c8202a');
        box(b.x - 0.1, b.y - 0.1, b.w + 0.2, b.d + 0.2, 6, '#1e5a3a', H + 3, '#2a7a4a');
        box(b.x + 0.6, b.y + 0.6, b.w - 1.2, b.d - 1.2, 6, '#1e5a3a', H + 9, '#2a7a4a');
        line([iso(b.x + 0.6, b.y + b.d / 2, H + 15), iso(b.x + b.w - 0.6, b.y + b.d / 2, H + 15)], '#ffd23f', 1);
        faceText(b, 0, b.w / 2, 16, '龍門', 6, '#ffd23f', { font: 'sans-serif' });
        onFace(b, 0, () => { wallRect(1.5, 0, 2.5, 13, '#2a0a0a'); wallRect(1.6, 0, 2.4, 12, rgba('#ffb347', 0.45 + 0.1 * Math.sin(t * 3))); });
        break;
      }
    }
  }

  // ---------- GPS ----------
  function route(fromX, fromY, to, ok) {
    const key = (x, y) => y * N + x;
    const prev = new Int32Array(N * N).fill(-2);
    prev[key(fromX, fromY)] = -1;
    const q = [key(fromX, fromY)];
    for (let qi = 0; qi < q.length; qi++) {
      const k0 = q[qi], x = k0 % N, y = Math.floor(k0 / N);
      if (x === to[0] && y === to[1]) {
        const path = [];
        let k = k0;
        while (k !== -1) { path.unshift([k % N, Math.floor(k / N)]); k = prev[k]; }
        return path;
      }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (!inside(nx, ny) || prev[key(nx, ny)] !== -2) continue;
        if (!(nx === to[0] && ny === to[1]) && !ok(nx, ny)) continue;
        prev[key(nx, ny)] = k0;
        q.push(key(nx, ny));
      }
    }
    return null;
  }

  // nome da rua de um trecho
  function streetName(x, y, dx) {
    if (inCT(x, y)) return x === 40 || x === 41 ? 'Rua Lótus' : 'Travessa do Dragão';
    const near = (v, idx) => { for (let d = 0; d < N; d++) { if (idx[v - d] >= 0) return idx[v - d]; if (idx[v + d] >= 0) return idx[v + d]; } return 0; };
    return dx !== 0 ? H_NAMES[near(y, roadIdx)] : V_NAMES[near(x, roadIdx)];
  }

  function instructions(path, vx, vy, scale) {
    if (!path || path.length < 2) return { arrow: '★', text: tr('Você chegou'), dist: 0 };
    const d0 = [path[1][0] - path[0][0], path[1][1] - path[0][1]];
    let i = 1;
    while (i < path.length - 1 && path[i + 1][0] - path[i][0] === d0[0] && path[i + 1][1] - path[i][1] === d0[1]) i++;
    const m = i * scale;
    const sp = Math.hypot(vx, vy);
    if (sp > 1 && (vx * d0[0] + vy * d0[1]) / sp < -0.5) return { arrow: '⟲', text: tr('Faça o retorno quando possível'), dist: m };
    if (i >= path.length - 1) return { arrow: '⬆', text: tr('Siga em frente por {0} m: destino à frente', m), dist: m };
    const d1 = [path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]];
    const right = d0[0] * d1[1] - d0[1] * d1[0] > 0;
    const name = streetName(path[i + 1][0], path[i + 1][1], d1[0]);
    const turn = right ? (i <= 1 ? 'Vire agora à direita na {1}' : 'Em {0} m, vire à direita na {1}') : (i <= 1 ? 'Vire agora à esquerda na {1}' : 'Em {0} m, vire à esquerda na {1}');
    return { arrow: right ? '↱' : '↰', text: tr(turn, m, tr(name)), dist: m };
  }

  // nome do lugar onde Vance está
  function placeName(x, y) {
    if (inCT(x, y)) return tr(roadIdx[x] === 4 ? 'Chinatown — Rua Lótus' : roadIdx[y] === 4 ? 'Chinatown — Travessa do Dragão' : 'Chinatown');
    // vale o nome da rua mais próxima (vertical ou horizontal)
    const dist = (v) => { for (let d = 0; d < N; d++) if (roadIdx[v - d] >= 0 || roadIdx[v + d] >= 0) return d; return N; };
    return (def.label || 'Sector 4') + ' — ' + tr(streetName(x, y, dist(y) <= dist(x) ? 1 : 0));
  }

  // vaga de meio-fio mais perto de (x, y): centro do tile da faixa encostada na calçada, com o carro
  // alinhado à rua (o sentido mais parecido com 'ang'); free(cx, cy, a) diz se o carro cabe ali
  function curbSpot(x, y, ang, free, R = 6) {
    let best = null, bd = 1e9;
    const x0 = Math.floor(x), y0 = Math.floor(y);
    for (let yy = y0 - R; yy <= y0 + R; yy++) for (let xx = x0 - R; xx <= x0 + R; xx++) {
      if (tile(xx, yy) !== T.ROAD || inCT(xx, yy)) continue;
      const vert = roadIdx[xx] >= 0 && roadIdx[yy] < 0, horz = roadIdx[yy] >= 0 && roadIdx[xx] < 0;
      if (!vert && !horz) continue;                                   // cruzamento
      const edge = vert ? roadIdx[xx - 1] < 0 || roadIdx[xx + 1] < 0 : roadIdx[yy - 1] < 0 || roadIdx[yy + 1] < 0;
      if (!edge) continue;                                            // só a faixa junto ao meio-fio
      const cx = xx + 0.5, cy = yy + 0.5, d = Math.hypot(cx - x, cy - y);
      if (d >= bd) continue;
      const opts = vert ? [Math.PI / 2, -Math.PI / 2] : [0, Math.PI];
      const a = opts.sort((p1, p2) => Math.abs(Math.atan2(Math.sin(p1 - ang), Math.cos(p1 - ang))) - Math.abs(Math.atan2(Math.sin(p2 - ang), Math.cos(p2 - ang))))[0];
      // o carro inteiro precisa caber na pista, sem pegar faixa de pedestres
      const tilesOK = [-1, -0.5, 0, 0.5, 1].every(f => tile(Math.floor(cx + Math.cos(a) * f), Math.floor(cy + Math.sin(a) * f)) === T.ROAD);
      if (!tilesOK || !free(cx, cy, a)) continue;
      bd = d; best = { cx, cy, ang: a };
    }
    return best;
  }

  return { def, N, T, map, tile, inCT, light, pedSignal, pedOK, zoneAt, carOK, crowdOK, curbSpot, buildings, objects, shops, npcs, walkers, traffic, updateTraffic, drawGround, drawBuilding, route, instructions, streetName, placeName };
}

// cidade ativa: o Setor 4 ao começar; enterRoom troca para a cidade em que Vance está (activateCity)
let CITY = buildCity({ id: 'city', roomId: 'city', seed: 4242, ct: true, label: 'Sector 4' });
const CITIES = { city: CITY };

// a cidade é uma sala como as outras, só que enorme e ao ar livre
ROOMS.city = {
  name: 'Sector 4', w: CITY.N, h: CITY.N, city: true, cityObj: CITY, outdoor: true, dark: 0.5, neon: '#38f6ff', floor: 'city',
  lights: [], objects: CITY.objects, npcs: CITY.npcs, walkers: CITY.walkers,
};
// o carro de Vance começa estacionado na frente do hotel
ROOMS.city.objects.push({ kind: 'car', key: 'carro', name: 'Seu carro (Kestrel-7)', cx: CITY.map(15.5, 20.75)[0], cy: CITY.map(15.5, 20.75)[1], ang: 0, solid: true, livery: 'vance', playerCar: true });

// ---------- destinos do GPS ----------
// hotel, café e apartamento estão sempre no GPS; os outros aparecem quando alguém fala deles
const GPS_ALWAYS = ['hotel', 'cafe', 'casa'];
const POLICE_TALK = ['cruz', 'ana', 'rui', 'okafor', 'kenji', 'unidade7'];
function gpsKnown(id) { return GPS_ALWAYS.includes(id) || !!(game && game.flags['gps_' + id]); }
function unlockGps(ids) {
  for (const id of [].concat(ids)) {
    const d = destAny(id);
    if (gpsKnown(id) || !d) continue;
    game.flags['gps_' + id] = true;
    toast(`<span class="k">GPS</span> ${T('Novo local: {0}', d.name)}`, 'ev');
  }
  saveGame();
}
// teletransporte só para onde Vance já esteve: o hotel (onde o jogo começa) e a casa dele contam desde o início
function gpsVisited(id) { return GPS_HOME.includes(id) || !!(game && game.flags['visit_' + id]); }
const GPS_HOME = ['hotel', 'casa'];
function markVisited() {
  if (!game) return;
  const p = game.driving && game.car ? { x: game.car.x, y: game.car.y } : { x: game.player.px, y: game.player.py };
  for (const id in DESTINATIONS) {
    if (gpsVisited(id)) continue;
    const d = DESTINATIONS[id];
    const ex = cityRoom().objects.find(o => o.kind === 'exit' && o.to && o.x === d.door[0] && o.y === d.door[1]);
    if (game.roomId === CITY.def.roomId ? Math.hypot(p.x - d.door[0], p.y - d.door[1]) <= 3 : ex && ex.to === game.roomId) game.flags['visit_' + id] = true;
  }
}
const DESTINATIONS = {
  hotel:     { name: 'Hotel Grand Alvorada', short: 'Hotel', door: CITY.map(15, 16), color: '#ff4fd8', icon: 'H' },
  delegacia: { name: 'Delegacia do Distrito 4', short: 'Delegacia', door: CITY.map(35, 16), color: '#38a0ff', icon: 'D' },
  cafe:      { name: 'Café Neon', short: 'Café', door: CITY.map(14, 29), color: '#ff8ad8', icon: 'C' },
  chinatown: { name: 'Chinatown — Rua Lótus', short: 'Chinatown', door: CITY.map(40, 31), color: '#ff3355', icon: 'L' },
  banho:     { name: 'Casa de Banho Lótus', short: 'Casa de banho', door: CITY.map(39, 45), color: '#ff8a6a', icon: '湯' },
  casa:      { name: 'Apartamento de Vance', short: 'Casa', door: CITY.map(45, 7), color: '#7dff6b', icon: 'V' },
  hacker:    { name: 'Apartamento de C4mpt0n (Edifício Átrio)', short: 'C4mpt0n', door: CITY.map(55, 7), color: '#7dff6b', icon: '⌨' },
  ferrovelho:{ name: 'Ferro-velho do Zeca', short: 'Ferro-velho', door: CITY.map(5, 46), color: '#ffb347', icon: '⚙' },
  bordel:    { name: 'Casa de Chá Matsurika (茉莉花)', short: 'Matsurika', door: CITY.map(49, 37), color: '#f0e0a0', icon: '茶' },
};
// cada cidade tem os seus destinos; DESTINATIONS mostra os da cidade ativa
const CITY_DESTS = { city: { ...DESTINATIONS } };
function destAny(id) { for (const c in CITY_DESTS) if (CITY_DESTS[c][id]) return CITY_DESTS[c][id]; return null; }
function cityRoom() { return ROOMS[CITY.def.roomId]; }
function inCity() { return !!(game && game.roomData && game.roomData.city); }
function activateCity(roomId) {
  if (!CITIES[roomId] || CITY === CITIES[roomId]) return;
  CITY = CITIES[roomId];
  for (const k of Object.keys(DESTINATIONS)) delete DESTINATIONS[k];
  Object.assign(DESTINATIONS, CITY_DESTS[roomId] || {});
  if (game && game.gps && !DESTINATIONS[game.gps.dest]) game.gps = null;
}

// ============================================================
// Carro: entrar, dirigir com a mesma câmera de quando anda a pé, estacionar em qualquer lugar
// ============================================================
const CAR_MAX = 7.5;

function playerCar() { return ROOMS.city.objects.find(o => o.playerCar); }

// altura de voo: carros andando flutuam alto; estacionados pousam no chão
const CAR_FLY = 10;
function carAlt(c) { return CAR_FLY * Math.min(1, (game.t - (c.upT || 0)) / 0.9); }          // decolagem em 0,9 s
function parkedPose(o) {                                                                          // pouso em 1,4 s
  if (o.landT === undefined) return { x: o.cx, y: o.cy, ang: o.ang || 0, alt: 0 };
  const k = Math.min(1, (game.t - o.landT) / 1.4);
  if (k >= 1) { delete o.landT; delete o.fromX; return { x: o.cx, y: o.cy, ang: o.ang || 0, alt: 0 }; }
  const m = Math.min(1, k / 0.6), e = m * m * (3 - 2 * m);   // primeiro encosta e alinha, depois desce
  const fx = o.fromX !== undefined ? o.fromX : o.cx, fy = o.fromY !== undefined ? o.fromY : o.cy, fa = o.fromAng !== undefined ? o.fromAng : o.ang;
  const da = Math.atan2(Math.sin(o.ang - fa), Math.cos(o.ang - fa));
  const kd = Math.max(0, (k - 0.35) / 0.65);
  return { x: fx + (o.cx - fx) * e, y: fy + (o.cy - fy) * e, ang: fa + da * e, alt: (o.landFrom || CAR_FLY) * (1 - kd) * (1 - kd) };
}

// tiles cobertos por um carro (pontos ao longo do eixo)
function carTiles(cx, cy, ang) {
  const out = new Set();
  for (const f of [-1, -0.5, 0, 0.5, 1]) for (const s of [-0.44, 0, 0.44]) {
    const x = Math.floor(cx + Math.cos(ang) * f - Math.sin(ang) * s), y = Math.floor(cy + Math.sin(ang) * f + Math.cos(ang) * s);
    out.add(x + ',' + y);
  }
  return [...out].map(k => k.split(',').map(Number));
}

// caixa no chão ocupada pelo carro (para a ordem de desenho)
function carBox(cx, cy, ang) {
  const ex = Math.abs(Math.cos(ang)) * 1 + Math.abs(Math.sin(ang)) * 0.45, ey = Math.abs(Math.sin(ang)) * 1 + Math.abs(Math.cos(ang)) * 0.45;
  return [cx - ex, cy - ey, cx + ex, cy + ey];
}

// o carro cabe aqui? (prédios, objetos sólidos, ruas de pedestres e pessoas)
function carFree(cx, cy, ang, turnOnly) {
  for (const [x, y] of carTiles(cx, cy, ang)) {
    if (!CITY.carOK(x, y)) return false;
    if (solidAt(ROOMS.city, x, y, playerCar())) return false;
  }
  // só quem está na pista bloqueia (pedestre esperando o sinal no meio-fio não trava o volante)
  if (!turnOnly) for (const n of agentsHere()) if (CITY.carOK(Math.floor(n.fx + 0.5), Math.floor(n.fy + 0.5)) && Math.hypot(n.fx + 0.5 - cx, n.fy + 0.5 - cy) < 0.75) return false;
  return true;
}

function enterCar(o) {
  const p = game.player;
  game.car = { x: o.cx, y: o.cy, ang: o.ang, vx: 0, vy: 0, bump: 0, upT: game.t };   // decola do chão
  ROOMS.city.objects.splice(ROOMS.city.objects.indexOf(o), 1);
  invalidateGrid(ROOMS.city);
  game.driving = true;
  p.seat = null; p.inWater = null;
  p.px = o.cx - 0.5; p.py = o.cy - 0.5; p.x = Math.floor(o.cx); p.y = Math.floor(o.cy);
  game.inputLock = true;
  p.path = []; game.pending = null; game.dest = null; game.target = null;
  Sound.play('door');
  toast('<b>Kestrel-7</b> · ' + T(IS_TOUCH ? 'Segure Acelerar para andar. Toque no mapa para escolher a direção.' : 'Espaço acelera, ← → viram o volante, ↓ freia e dá ré. E estaciona.'));
  updateHud();
  saveGame();
}

// estaciona onde está e coloca Vance no tile livre mais próximo
function exitCar() {
  const c = game.car;
  if (Math.hypot(c.vx, c.vy) > 2.5) { toast('Diminua a velocidade para estacionar.'); return false; }
  const spot = CITY.curbSpot(c.x, c.y, c.ang, (cx, cy, a) => carFree(cx, cy, a), 6);
  if (!spot) { toast(T('Não há vaga no meio-fio aqui. Siga um pouco pela rua.')); return false; }
  const car = { kind: 'car', key: 'carro', name: T('Seu carro (Kestrel-7)'), cx: spot.cx, cy: spot.cy, ang: spot.ang, solid: true, livery: 'vance', playerCar: true,
    landT: game.t, landFrom: carAlt(c), fromX: c.x, fromY: c.y, fromAng: c.ang };
  const taken = new Set(carTiles(spot.cx, spot.cy, spot.ang).map(t => t.join(',')));
  let best = null, bd = 1e9;
  for (let r = 1; r <= 3 && !best; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const x = Math.floor(spot.cx) + dx, y = Math.floor(spot.cy) + dy;
    if (taken.has(x + ',' + y) || blocked(x, y)) continue;
    const dd = Math.hypot(x + 0.5 - spot.cx, y + 0.5 - spot.cy);
    if (dd < bd) { bd = dd; best = [x, y]; }
  }
  if (!best) { toast('Sem espaço para sair do carro aqui.'); return false; }
  ROOMS.city.objects.push(car);
  invalidateGrid(ROOMS.city);
  game.car = null; game.driving = false;
  const p = game.player;
  p.x = p.px = best[0]; p.y = p.py = best[1]; p.path = [];
  game.inputLock = true;
  Sound.play('door');
  updateHud();
  saveGame();
  return true;
}

// botão Acelerar seguro (toque/mouse) ou barra de espaço
let driveGas = false;
function setGas(on) { driveGas = on; $('btn-gas').classList.toggle('on', on); }
$('btn-gas').addEventListener('pointerdown', e => { e.preventDefault(); try { $('btn-gas').setPointerCapture(e.pointerId); } catch (err) {} setGas(true); });
for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) $('btn-gas').addEventListener(ev, () => setGas(false));
$('btn-park').addEventListener('pointerdown', e => { e.preventDefault(); if (game && game.driving && !game.modal) { setGas(false); exitCar(); } });
// barra de espaço = pedal do acelerador no teclado
let spaceGas = false;
document.addEventListener('keydown', e => { if (e.key === ' ' && game && game.driving && !game.modal) { e.preventDefault(); spaceGas = true; $('btn-gas').classList.add('on'); } });
document.addEventListener('keyup', e => { if (e.key === ' ') { spaceGas = false; $('btn-gas').classList.toggle('on', driveGas); } });

// teclado (computador): Espaço ou ↑ acelera, ← → viram o volante, ↓ freia e dá ré
function driveKeys() {
  const k = name => keys.has(name);
  return {
    steer: (k('arrowright') || k('d') ? 1 : 0) - (k('arrowleft') || k('a') ? 1 : 0),
    gas: spaceGas || k('arrowup') || k('w'),
    brake: k('arrowdown') || k('s'),
  };
}

// carro preso dentro de um obstáculo (curva rente a prédio, pedestre que parou na frente):
// procura o ponto livre mais próximo e encaixa o carro ali
function unstickCar(car) {
  if (carFree(car.x, car.y, car.ang)) return;
  for (let r = 0.15; r <= 2.4; r += 0.15) for (let k = 0; k < 16; k++) {
    const a = k / 16 * Math.PI * 2, x = car.x + Math.cos(a) * r, y = car.y + Math.sin(a) * r;
    for (const ang of [car.ang, Math.round(car.ang / (Math.PI / 2)) * (Math.PI / 2)]) {
      if (carFree(x, y, ang)) { car.x = x; car.y = y; car.ang = ang; car.vx = car.vy = 0; car.spd = 0; return; }
    }
  }
}

function updateDrive(dt) {
  const car = game.car;
  const jx = joy.x + pad.x, jy = joy.y + pad.y;            // joystick e controle (direção na tela)
  const mag = Math.min(1, Math.hypot(jx, jy));
  const kb = driveKeys();
  const kbOn = !game.modal && (kb.steer || kb.gas || kb.brake);
  if (game.inputLock) { if (mag < 0.15 && !kb.steer && !kb.gas && !kb.brake) game.inputLock = false; }
  let steerByVel = true;
  if (!game.modal && !game.inputLock && kbOn) {
    // direção de carro: velocidade escalar ao longo do bico, volante gira o bico
    if (!car.kb) { car.kb = true; car.spd = car.vx * Math.cos(car.ang) + car.vy * Math.sin(car.ang); }
    car.aim = null;
    if (kb.gas || driveGas) car.spd += (CAR_MAX - car.spd) * Math.min(1, dt * 1.6);
    else if (kb.brake) car.spd = Math.max(-CAR_MAX * 0.35, car.spd - dt * (car.spd > 0 ? 14 : 5));
    else car.spd *= Math.max(0, 1 - dt * 1.8);
    const turn = kb.steer * 2.6 * dt * Math.min(1, Math.abs(car.spd) / 2) * Math.sign(car.spd || 1);
    if (turn && carFree(car.x, car.y, car.ang + turn, true)) car.ang += turn;
    car.vx = Math.cos(car.ang) * car.spd; car.vy = Math.sin(car.ang) * car.spd;
    steerByVel = false;
  } else if (!game.modal && !game.inputLock && mag >= 0.15) {
    car.kb = false;
    let tx = jx + jy, ty = jy - jx;
    const tl = Math.hypot(tx, ty); tx /= tl; ty /= tl;
    car.vx += (tx * CAR_MAX * mag - car.vx) * Math.min(1, dt * 2.4);
    car.vy += (ty * CAR_MAX * mag - car.vy) * Math.min(1, dt * 2.4);
    car.aim = null;
  } else if (!game.modal && driveGas) {
    // acelerador na tela: segue para o ponto tocado no mapa ou, sem ponto, para a frente
    car.kb = false;
    let a = car.ang;
    if (car.aim) {
      if (Math.hypot(car.aim[0] - car.x, car.aim[1] - car.y) < 1.2) car.aim = null;
      else a = Math.atan2(car.aim[1] - car.y, car.aim[0] - car.x);
    }
    car.vx += (Math.cos(a) * CAR_MAX - car.vx) * Math.min(1, dt * 2.4);
    car.vy += (Math.sin(a) * CAR_MAX - car.vy) * Math.min(1, dt * 2.4);
  } else {
    car.vx *= Math.max(0, 1 - dt * 2.2); car.vy *= Math.max(0, 1 - dt * 2.2);
    if (car.kb) { car.spd = (car.spd || 0) * Math.max(0, 1 - dt * 2.2); steerByVel = false; }
  }
  const sp = Math.hypot(car.vx, car.vy);
  if (steerByVel && sp > 0.4) {
    // o bico acompanha o movimento, mas só gira se o carro couber no ângulo novo
    let da = Math.atan2(car.vy, car.vx) - car.ang;
    while (da > Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    const na = car.ang + da * Math.min(1, dt * 6);
    if (carFree(car.x, car.y, na)) car.ang = na;
  }
  const nx = car.x + car.vx * dt, ny = car.y + car.vy * dt;
  let hit = false;
  if (carFree(nx, car.y, car.ang)) car.x = nx; else { car.vx *= -0.25; hit = true; }
  if (carFree(car.x, ny, car.ang)) car.y = ny; else { car.vy *= -0.25; hit = true; }
  if (hit && car.kb) car.spd *= -0.25;
  unstickCar(car);
  car.bump = Math.max(0, car.bump - dt);
  if (hit && car.bump <= 0 && sp > 0.5) { car.bump = 0.4; Sound.play('clank'); }
  // Vance anda junto (para o save, o GPS e o nome do lugar)
  const p = game.player;
  p.px = car.x - 0.5; p.py = car.y - 0.5; p.x = Math.floor(car.x); p.y = Math.floor(car.y);
}

// ---------- GPS (a pé e de carro) ----------
function setGps(id) {
  game.gps = { dest: id, path: null, timer: 0, info: null };
  Sound.play('hackOk');
  toast(`<span class="k">GPS</span> ${T('Rota para {0}', DESTINATIONS[id].name)}`);
  updateGps(0);
  saveGame();
}

function updateGps(dt) {
  const g = game.gps;
  if (!g || !inCity()) return;
  const p = game.player, fx = p.px + 0.5, fy = p.py + 0.5;
  const d = DESTINATIONS[g.dest];
  g.timer -= dt;
  if (g.timer <= 0) {
    g.timer = 0.35;
    const ok = game.driving ? (x, y) => CITY.carOK(x, y) && !solidAt(cityRoom(), x, y) : (x, y) => !solidAt(cityRoom(), x, y);
    g.path = CITY.route(Math.floor(fx), Math.floor(fy), d.door, ok);
  }
  const vx = game.driving ? game.car.vx : p.dir[0], vy = game.driving ? game.car.vy : p.dir[1];
  g.info = CITY.instructions(g.path, game.driving ? vx : 0, game.driving ? vy : 0, game.driving ? 20 : 10);
  if (Math.hypot(fx - d.door[0] - 0.5, fy - d.door[1] - 0.5) < 2) {
    g.info = { arrow: '★', text: T('Você chegou: {0}', d.name), dist: 0 };
    g.arrived = (g.arrived || 0) + dt;
    if (g.arrived > 4) game.gps = null;
  }
}

function openGps() {
  if (!game || game.modal || !inCity()) return;
  game.modal = 'gps';
  show('gps');
  const list = $('gps-list');
  list.innerHTML = '';
  if (game.roomId === 'city') list.appendChild(button('🚗 Chamar meu carro', () => { closeModal(); callCar(); }, 'gps-call'));
  const p = game.player;
  for (const id in DESTINATIONS) {
    if (!gpsKnown(id)) continue;
    const d = DESTINATIONS[id];
    const dist = Math.round(Math.hypot(p.px - d.door[0], p.py - d.door[1]) * 10);
    const row = document.createElement('div');
    row.className = 'gps-row';
    const b = button('', () => { closeModal(); setGps(id); }, 'gps-item');
    b.innerHTML = `<span class="gps-ico" style="background:${d.color}">${d.icon}</span><span><b>${d.name}</b><small>${T('{0} m em linha reta', dist)}</small></span>`;
    row.appendChild(b);
    if (gpsVisited(id)) row.appendChild(button('⚡', () => { closeModal(); fastTravel(id); }, 'gps-warp'));
    list.appendChild(row);
  }
  if (game.gps) list.appendChild(button('Cancelar rota', () => { game.gps = null; closeModal(); }, 'end'));
  drawMinimap();
}

// viagem rápida: Vance é teletransportado direto para dentro do destino (ou para a porta)
function fastTravel(id) {
  const d = DESTINATIONS[id];
  if (game.driving) { const c = game.car; resetCar({ x: c.x, y: c.y, ang: c.ang }); game.car = null; game.driving = false; Sound.engine(false); }
  const ex = cityRoom().objects.find(o => o.kind === 'exit' && o.to && o.x === d.door[0] && o.y === d.door[1]);
  if (ex && ex.key !== 'hotel_fechado') enterRoom(ex.to, ex.at, true);
  else {
    let at = null;
    for (let r = 0; r < 8 && !at; r++)
      for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r && !at; dx++)
        if (!solidAt(cityRoom(), d.door[0] + dx, d.door[1] + dy)) at = [d.door[0] + dx, d.door[1] + dy];
    enterRoom(CITY.def.roomId, at || d.door, true);
  }
  game.gps = null;
  game.teleFx = game.t;
  Sound.play('hackOk');
  toast(`<span class="k">⚡</span> ${T('Teletransporte: {0}', d.name)}`, 'room');
  saveGame();
}

// o Kestrel-7 vem sozinho até o lugar mais próximo de Vance onde caiba
function callCar() {
  if (!inCity()) { toast(T('O carro só pode ser chamado na rua.')); return; }
  if (game.roomId !== 'city') { toast(T('O Kestrel-7 ficou estacionado no Setor 4. Aqui, só a pé ou de aerotrem.')); return; }
  if (game.driving) { toast(T('Você já está dirigindo.')); return; }
  const p = game.player, px0 = p.x, py0 = p.y;
  const old = playerCar();
  if (old) { ROOMS.city.objects.splice(ROOMS.city.objects.indexOf(old), 1); invalidateGrid(ROOMS.city); }
  // em Chinatown não entra carro: ele para no meio-fio mais próximo fora do bairro
  const R = CITY.inCT(px0, py0) ? 16 : 10;
  const best = CITY.curbSpot(px0 + 0.5, py0 + 0.5, 0, (cx, cy, a) => carFree(cx, cy, a) && !carTiles(cx, cy, a).some(([x, y]) => x === px0 && y === py0), R);
  if (!best) { if (old) ROOMS.city.objects.push(old); invalidateGrid(ROOMS.city); toast(T('Não há espaço para o carro parar aqui.')); return; }
  ROOMS.city.objects.push({ kind: 'car', key: 'carro', name: T('Seu carro (Kestrel-7)'), ...best, solid: true, livery: 'vance', playerCar: true, landT: game.t, landFrom: CAR_FLY });
  invalidateGrid(ROOMS.city);
  Sound.play('door');
  toast(T('O Kestrel-7 chega sozinho e estaciona ao seu lado.'));
  saveGame();
}

// mapa da cidade dentro da janela do GPS, na mesma rotação isométrica da tela
function drawMinimap() {
  const cv = $('minimap'), c = cv.getContext('2d');
  const W = cv.width, H = cv.height, N = CITY.N, s = W / (N * 2.1);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, W, H);
  const P = (x, y) => [W / 2 + (x - y) * s, H * 0.04 + (x + y) * s / 2];
  const quad = (x, y, w, d, col) => { const a = P(x, y), b = P(x + w, y), cc = P(x + w, y + d), e = P(x, y + d); c.fillStyle = col; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.lineTo(...cc); c.lineTo(...e); c.fill(); };
  quad(0, 0, N, N, 'rgba(40,40,52,0.9)');
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const v = CITY.tile(x, y);
    if (v === CITY.T.BLD) quad(x, y, 1, 1, 'rgba(12,8,24,0.95)');
    else if (v === CITY.T.CTSTREET || v === CITY.T.CTWALK) quad(x, y, 1, 1, 'rgba(120,30,40,0.9)');
    else if (v === CITY.T.GRASS) quad(x, y, 1, 1, 'rgba(30,80,50,0.9)');
  }
  if (game.gps && game.gps.path) {
    c.strokeStyle = '#38f6ff'; c.lineWidth = Math.max(2, s * 0.9); c.lineJoin = 'round';
    c.beginPath(); game.gps.path.forEach(([x, y], i) => { const p = P(x + 0.5, y + 0.5); i ? c.lineTo(...p) : c.moveTo(...p); }); c.stroke();
  }
  c.font = `700 ${Math.round(s * 3)}px "Chakra Petch", sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (const id in DESTINATIONS) {
    if (!gpsKnown(id)) continue;
    const d = DESTINATIONS[id], [x, y] = P(d.door[0] + 0.5, d.door[1] + 0.5);
    c.fillStyle = d.color; c.beginPath(); c.arc(x, y, s * 2.2, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#05030c'; c.fillText(d.icon, x, y + 1);
  }
  const p = game.player, [x, y] = P(p.px + 0.5, p.py + 0.5);
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x, y, s * 1.6, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#05030c'; c.lineWidth = 1; c.stroke();
}

// toque no mapa do GPS escolhe o destino mais próximo do toque
function minimapClick(ev) {
  if (!game || !inCity()) return;
  const cv = $('minimap'), r = cv.getBoundingClientRect();
  const mx = (ev.clientX - r.left) * cv.width / r.width, my = (ev.clientY - r.top) * cv.height / r.height;
  const N = CITY.N, s = cv.width / (N * 2.1);
  let best = null, bd = 1e9;
  for (const id in DESTINATIONS) {
    if (!gpsKnown(id)) continue;
    const d = DESTINATIONS[id], x = d.door[0] + 0.5, y = d.door[1] + 0.5;
    const px2 = cv.width / 2 + (x - y) * s, py2 = cv.height * 0.04 + (x + y) * s / 2;
    const dd = Math.hypot(px2 - mx, py2 - my);
    if (dd < bd) { bd = dd; best = id; }
  }
  if (best && bd < s * 8) { closeModal(); setGps(best); }
}

// rota do GPS acesa no chão
function drawGpsRoute(t) {
  const g = game.gps;
  if (!g || !g.path || g.path.length < 2) return;
  const p = game.player;
  const pts = g.path.slice(0, 80).map(([x, y], i) => iso(i === 0 ? p.px + 0.5 : x + 0.5, i === 0 ? p.py + 0.5 : y + 0.5));
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(56,246,255,0.22)'; ctx.lineWidth = 5;
  ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke();
  ctx.strokeStyle = 'rgba(160,250,255,0.85)'; ctx.lineWidth = 1.1; ctx.setLineDash([3, 3]); ctx.lineDashOffset = -t * 12;
  ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke();
  ctx.restore();
  const d = DESTINATIONS[g.dest], [sx, sy] = iso(d.door[0] + 0.5, d.door[1] + 0.5);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const gr = ctx.createLinearGradient(0, sy - 90, 0, sy);
  gr.addColorStop(0, rgba(d.color, 0)); gr.addColorStop(1, rgba(d.color, 0.55));
  ctx.fillStyle = gr; ctx.fillRect(sx - 4, sy - 90, 8, 90);
  ctx.restore();
}
