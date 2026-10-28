// ============================================================
// Setor Paulista: o bairro corporativo de Neo-Sampa em volta da Neo-Sampa Tower.
// Cidade aberta como o Sector 4 (ruas, trânsito, pedestres, lojas, GPS); chega-se de aerotrem
// ou saindo pela portaria da torre. Só existe no caso 2.
// ============================================================

const PAULISTA_LINES = EXTRA_LINES.paulista.concat(['O ar aqui é filtrado. Pago no condomínio, junto com a luz e a eternidade.', 'Trabalho no 140º andar. Faz três anos que não vejo o chão.', 'Não fique parado na calçada, detetive. Aqui tudo é cobrado por minuto, até o tempo parado.', 'Dizem que o Parque Trianon tem árvores de verdade. Eu nunca toquei numa.', 'A Synapse comprou a avenida inteira. Agora o semáforo verde tem patrocínio.', 'Starbytes de novo? É o terceiro do dia. Meu implante conta.', 'Lá embaixo, no Minhocão, dizem que chove dentro das casas. Aqui chove só nos guarda-chuvas.', 'Vi a polícia entrando na torre. Alguém lá em cima fez besteira. Ou morreu.']);

// estações elevadas: área do mezanino (altura MAG_Z) e da escadaria, por sala da cidade
const MAG_Z = 40;
const STATION_ELEV = {};
// altura do chão sob um ponto (fx, fy = centro do personagem)
function elevAt(roomId, fx, fy) {
  const e = STATION_ELEV[roomId];
  if (!e) return 0;
  if (fx >= e.x0 && fx < e.x1 && fy >= e.y0 && fy < e.y1) return MAG_Z;
  if (fx >= e.sx0 && fx < e.sx1 && fy >= e.sy0 && fy < e.sy1) return MAG_Z * Math.min(1, Math.max(0, (e.sy1 - fy) / (e.sy1 - e.sy0)));
  return 0;
}

CITIES.city_paulista = buildCity({
  id: 'city_paulista', roomId: 'city_paulista', seed: 2085, label: 'Setor Paulista', walkers: 50, cars: 22,
  vNames: ['Rua Augusta Alta', 'Rua Haddock Lobo', 'Av. Consolação', 'Rua Pamplona', 'Al. Santos', 'Rua Frei Caneca', 'Rua Bela Cintra'],
  hNames: ['Av. Paulista Superior', 'Al. Jaú', 'Av. Neo-Paulista', 'Al. Itu', 'Av. Brigadeiro', 'Al. Lorena', 'Av. Rebouças'],
  lines: PAULISTA_LINES, looks: ['synth1', 'synth2', 'ped1', 'ped2', 'ped4', 'ped5', 'raver2'],
  names: ['Executivo', 'Executiva', 'Advogado corporativo', 'Analista de dados', 'Turista', 'Entregador de drone', 'Assessora', 'Investidor'],
  liveries: [
    { main: '#e8e8f0', second: '#9aa0b0', under: '#2a2a30', metal: '#c8ccd4', glass: '#0a0e14', accent: '#38f6ff', model: 'sedan' },
    { main: '#1a1a24', second: '#0e0e14', under: '#0a0a10', metal: '#3a3a48', glass: '#0a0e14', accent: '#b04cff', model: 'coupe' },
    { main: '#2a3a5a', second: '#1a2438', under: '#0e1420', metal: '#3a4458', glass: '#0a1420', accent: '#38f6ff', model: 'sedan' },
    { main: '#5a1a2a', second: '#3a0e1a', under: '#140810', metal: '#3a2a30', glass: '#140a10', accent: '#ff4fd8', model: 'coupe' },
  ],
  build({ B, O, set, setR, shop, door, T, rnd, pick, m1, GENERIC_SHOPS, HOLO_ADS, buildings, objects }) {
    const ADS = HOLO_ADS.filter(a => a[0] !== 'PENDELTON').concat([['SYNAPSE', 'a eternidade é um produto', '#38f6ff', 'helix', '永遠'], ['LÁZARO', 'nunca mais diga adeus', '#b04cff', 'orbit', '再生']]);
    const R = o => { objects.push(o); return o; };   // objetos já em coordenadas reais
    // trilho magnético elevado sobre a faixa sul da Av. Neo-Paulista, de ponta a ponta do bairro
    for (let x = 0, N = m1(61) + 1; x < N; x++) R({ kind: 'maglev', x, y: m1(21), w: 1, d: 1, n: N });
    const yard = (X0, Y0) => { for (let y = Y0; y < Y0 + 6; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, T.PLAZA); };
    const blockType = (bi, bj) => {
      if (bi === 2 && bj === 2) return 'tower';
      if (bi === 3 && bj === 1) return 'trianon';      // o parque ocupa os quarteirões (3,1) e (4,1) e a rua entre eles
      if ((bi === 4 || bi === 5) && bj === 1) return 'skip';
      if (bi === 3 && bj === 2) return 'masp';         // do outro lado da Av. Neo-Paulista, de frente para o parque
      if (bi === 4 && bj === 2) return 'station';
      if ((bi === 1 && bj === 1) || (bi === 4 && bj === 4) || (bi === 2 && bj === 3)) return 'plaza';
      return 'gen';
    };
    for (let bj = 0; bj < 6; bj++) for (let bi = 0; bi < 6; bi++) {
      const X0 = bi * 10 + 3, Y0 = bj * 10 + 3, type = blockType(bi, bj);
      if (type === 'gen') {
        // torres de vidro altas; o térreo é quase sempre loja
        const layout = Math.floor(rnd() * 3);
        const parts = layout === 0 ? [[0, 0, 3, 6], [3, 0, 3, 6]] : layout === 1 ? [[0, 0, 3, 3], [3, 0, 3, 3], [0, 3, 3, 3], [3, 3, 3, 3]] : [[0, 0, 6, 3], [0, 3, 3, 3], [3, 3, 3, 3]];
        for (const [ox, oy, w, d] of parts) {
          // quarteirões entre a torre, a estação e a câmera ficam baixos, para não escondê-las
          const front = bi >= 2 && bj >= 2 && bi + bj <= 8;
          const hr = rnd(), h = front ? 18 + Math.floor(hr * 10) : hr < 0.25 ? 45 + Math.floor(hr * 80) : 90 + Math.floor((hr - 0.25) * 180);
          const b = B(X0 + ox, Y0 + oy, w, d, h, 'tower', { holo: h >= 70 && rnd() < 0.55 ? pick(ADS) : null, col: pick(['#141c30', '#18202e', '#1c1830', '#121a28', '#1a1e2a']) });
          if (oy + d === 6 && rnd() < 0.95) { const s = pick(GENERIC_SHOPS); shop(b, 0, 0.3, w - 0.3, { ...s, key: 'lojap_' + buildings.length + '_0' }); }
          if (ox + w === 6 && rnd() < 0.7) { const s = pick(GENERIC_SHOPS); shop(b, 1, 0.3, d - 0.3, { ...s, key: 'lojap_' + buildings.length + '_1' }); }
        }
      } else if (type === 'tower') {
        // a Neo-Sampa Tower: um quarteirão inteiro, com a portaria voltada para a Av. Paulista
        B(X0, Y0, 6, 6, 260, 'corp', { col: '#141c2a', sign: 'SYNAPSE', label: 'NEO-SAMPA TOWER', signCol: '#38f6ff' });
        door(X0 + 2, Y0 + 6, 'ns_hall', [2, 1], 'Neo-Sampa Tower → Átrio');
        door(X0 + 3, Y0 + 6, 'ns_hall', [2, 1], 'Neo-Sampa Tower → Átrio');
        for (const x of [X0 + 1, X0 + 4]) O({ kind: 'bollard', x, y: Y0 + 6, solid: true });
      } else if (type === 'station') {
        // estação elevada à beira da Av. Neo-Paulista: o térreo é o prédio da estação e o mezanino, no alto,
        // tem guichê, catracas e portas de vidro de plataforma diante do trilho; sobe-se pela escadaria
        yard(X0, Y0);
        const I = m1(X0), J = m1(Y0), xA = I - 2, xB = I + 7, yA = m1(21) + 1, yB = J + 2, Z = MAG_Z;
        const E = o => R({ st: true, z: Z, ...o });
        R({ kind: 'maglev_station', st: true, x: xA, y: yA, w: xB - xA + 1, d: yB - yA + 1, light: { z: 70, r: 110, color: '#38f6ff' } });
        for (let y = yA; y <= yB; y++) for (let x = xA; x <= xB; x++) R({ kind: 'st_floor', st: true, x, y, edgeS: y === yB, edgeE: x === xB, edgeW: x === xA });
        // escadaria: 3 fileiras subindo da calçada até o mezanino, com corrimão de vidro dos dois lados
        for (let k = 0; k < 3; k++) for (const x of [I + 2, I + 3]) R({ kind: 'st_step', st: true, x, y: J + 3 + k, w: 1, d: 1, k });   // um tile por peça: assim quem pisa no degrau é desenhado depois dele
        for (let k = 0; k < 3; k++) for (const x of [I + 1, I + 4]) R({ kind: 'st_rail', st: true, x, y: J + 3 + k, solid: true, k, side: x === I + 1 ? 'w' : 'e' });
        STATION_ELEV.city_paulista = { x0: xA, y0: yA, x1: xB + 1, y1: yB + 1, sx0: I + 2, sx1: I + 4, sy0: J + 3, sy1: J + 6 };
        // portas de vidro de plataforma diante do trilho (abrem quando o trem para)
        for (let x = xA; x <= xB; x++) E({ kind: 'st_psd', x, y: yA, solid: true, key: 'porta_plataforma', name: 'Portas de plataforma — embarque', info: 'Portas de vidro de segurança. Quando o aerotrem para, elas se abrem alinhadas com as portas do trem.' });
        // vidro de segurança em volta do mezanino
        for (let y = yA + 1; y <= yB; y++) { E({ kind: 'st_glass', x: xA, y, solid: true, side: 'w' }); E({ kind: 'st_glass', x: xB, y, solid: true, side: 'e' }); }
        for (let x = xA + 1; x < xB; x++) if (x !== I + 2 && x !== I + 3) E({ kind: 'st_glass', x, y: yB, solid: true, side: 's' });
        // linha das catracas, com o guichê e as máquinas: separa a área paga da plataforma
        const yC = J + 1;
        E({ kind: 'vending_drink', x: xA + 1, y: yC, solid: true, key: 'maq_bebida', name: 'Máquina de bebidas HydroPop' });
        E({ kind: 'vending_food', x: xA + 2, y: yC, solid: true, key: 'maq_comida', name: 'Máquina de comida NutriMat' });
        E({ kind: 'st_ticket', x: xA + 3, y: yC, solid: true, key: 'guiche_aerotrem', name: 'Guichê do aerotrem', info: 'Uma atendente de verdade atrás do vidro, coisa rara. "Bilhete único, detetive? A linha passa por Sector 4, Sector 7, Paulista e Bixiga."' });
        for (const x of [I + 2, I + 3]) E({ kind: 'st_gate', x, y: yC, key: 'catraca', name: 'Catraca do aerotrem', info: 'Catraca com leitor de íris. Ela pisca verde e cobra a passagem direto do seu implante.' });
        E({ kind: 'st_glass', x: I + 4, y: yC, solid: true, side: 'n' });
        E({ kind: 'tram_stop', x: xB - 2, y: yC, solid: true, key: 'estacao_aerotrem', name: 'Mapa da linha do aerotrem' });
        E({ kind: 'vending_drink', x: xB - 1, y: yC, solid: true, key: 'maq_bebida', name: 'Máquina de bebidas HydroPop' });
        E({ kind: 'bench', x: xA + 2, y: yA + 2, solid: true, key: 'banco', name: 'Banco da plataforma', seat: true });
        E({ kind: 'bench', x: xB - 2, y: yA + 2, solid: true, key: 'banco', name: 'Banco da plataforma', seat: true });
        // embaixo, na calçada
        O({ kind: 'holo_ad', x: X0 + 5, y: Y0 + 4, solid: true, key: 'anuncio_lazaro', name: 'Anúncio holográfico', text: 'LÁZARO', col: '#b04cff', info: '"PROJETO LÁZARO: NUNCA MAIS DIGA ADEUS." Embaixo, em letras pequenas: "sujeito a disponibilidade de servidor".' });
        O({ kind: 'holo_ad', x: X0, y: Y0 + 4, solid: true, key: 'anuncio_synapse', name: 'Anúncio holográfico', text: 'SYNAPSE', col: '#38f6ff', info: '"SYNAPSE CORP: A ETERNIDADE, AGORA EM 12 PARCELAS." Um rosto sorridente se desfaz em pixels e se refaz, para sempre.' });
        O({ kind: 'kiosk', x: X0, y: Y0 + 5, solid: true, key: 'banca_paulista', name: 'Banca de notícias', col: '#38f6ff', info: 'Manchetes: "ENGENHEIRO DA SYNAPSE MORRE NA TORRE". "AÇÕES DA SYNAPSE SOBEM 4%". Ninguém aqui acha as duas coisas estranhas juntas.' });
        O({ kind: 'vending_food', x: X0 + 5, y: Y0 + 5, solid: true, key: 'maq_comida', name: 'Máquina de comida NutriMat' });
      } else if (type === 'trianon') {
        // Parque Trianon: dois quarteirões e a rua do meio viram mata, com trilhas, lago e mirante
        const x0 = m1(X0), x1 = m1(X0 + 25) + 1, y0 = m1(Y0), y1 = m1(Y0 + 5) + 1;
        const midX = Math.floor((x0 + x1) / 2), midY = Math.floor((y0 + y1) / 2);
        for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
          const trail = y === midY || (x - x0) % 6 === 3;   // trilhas: uma ao longo do parque e várias atravessando
          setR(x, y, trail ? T.PLAZA : T.GRASS);
        }
        // árvores em todo canto que não é trilha (mata densa)
        const raw = [];
        for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
          const trail = y === midY || (x - x0) % 6 === 3;
          if (!trail) raw.push([x, y]);
        }
        const lakeX = x0 + 5, lakeY = midY + 2;
        for (const [x, y] of raw) {
          if (x >= lakeX - 1 && x <= lakeX + 3 && y >= lakeY - 1 && y <= lakeY + 2) continue;   // espaço do lago
          if (x >= midX - 1 && x <= midX + 2 && y >= midY - 4 && y < midY) continue;          // praça da fonte
          if (rnd() < 0.7) R({ kind: 'tree', x, y, solid: true, key: 'arvore_trianon', name: 'Árvore do Trianon', info: pick(['Uma árvore centenária, de verdade, protegida por um campo de umidade. Tem mais seguranças que muita gente.', 'Um jequitibá de verdade, plantado antes de a cidade ter 300 andares. Os passarinhos daqui nunca viram um drone de perto.', 'Uma figueira gigante, com raízes que levantam a calçada. A prefeitura desistiu de brigar com ela.', 'Um pau-brasil de verdade, com uma placa: "ESPÉCIE PROTEGIDA DESDE 1500. AINDA."']), col: pick(['#1e4a34', '#1a3a2a', '#2a4a2a', '#1a4a3a', '#2a3a1a']), glow: pick(['#7dff6b', '#38f6ff', '#b8ff8a']) });
        }
        R({ kind: 'koi', x: lakeX, y: lakeY, w: 3, d: 2, solid: true, key: 'lago_trianon', name: 'Lago do Trianon', info: 'Um lago de água de verdade, com carpas e reflexo dos neons da avenida. Ninguém pesca: as carpas têm advogado.' });
        R({ kind: 'fountain', x: midX, y: midY - 3, w: 2, d: 2, solid: true, key: 'fonte_paulista', name: 'Fonte do Trianon', info: 'Água de verdade, filtrada três vezes. No Setor Paulista, até a fonte é um símbolo de status.', light: { z: 14, r: 70, color: '#38f6ff' } });
        for (const [x, y] of [[midX - 1, midY], [midX + 2, midY], [x0 + 2, midY], [x1 - 3, midY], [midX, y0 + 2], [midX + 1, y1 - 3]])
          R({ kind: 'bench', x, y, solid: true, key: 'banco', name: 'Banco do parque', seat: true });
        for (let k = 0; x0 + 3 + k * 6 < x1; k++) R({ kind: 'lamp_post', x: x0 + 3 + k * 6, y: k % 2 ? y1 - 2 : y0 + 1, light: { z: 30, r: 60, color: '#ffd8a0' } });   // postes sobre as trilhas
        R({ kind: 'holo_ad', x: midX + 1, y: y1 - 1, solid: true, key: 'placa_trianon', name: 'Portal do Parque Trianon', text: 'TRIANON', col: '#7dff6b', info: '"PARQUE TENENTE SIQUEIRA CAMPOS — TRIANON. Última mata atlântica da Zona Alta. Entrada gratuita (por enquanto)."' });
      } else if (type === 'masp') {
        // MASP do futuro: um bloco de vidro suspenso por pórticos vermelhos, com o vão livre aberto embaixo
        yard(X0, Y0);
        O({ kind: 'masp', x: X0, y: Y0, w: 6, d: 4, key: 'masp', name: 'MASP — Museu de Arte de Neo-Sampa', info: 'O MASP de 2085: o mesmo bloco suspenso por quatro pilares vermelhos, agora de vidro inteligente. Lá dentro, as obras do acervo são projetadas em escala real, e o vão livre embaixo continua sendo de todo mundo.' });
        for (const [ox, oy] of [[0, 0], [5, 0], [0, 3], [5, 3]]) O({ kind: 'block', x: X0 + ox, y: Y0 + oy, solid: true });
        O({ kind: 'stall', x: X0 + 1, y: Y0 + 1, w: 1, d: 1, solid: true, goods: 'lanterns', col: '#8a2a2a', sign: 'ANTIGUIDADES', key: 'feira_masp', name: 'Feira de antiguidades do vão livre', info: 'Celulares de 2020, máquinas de escrever e um disco rígido "com as fotos da vovó". Tudo vendido como relíquia.', light: { z: 20, r: 40, color: '#ffb347' } });
        O({ kind: 'stall', x: X0 + 3, y: Y0 + 2, w: 1, d: 1, solid: true, goods: 'tech', col: '#2a3a6a', sign: 'VINIL', key: 'feira_masp', name: 'Feira de antiguidades do vão livre', info: 'Discos de vinil, fitas cassete e um walkman que ainda funciona. O vendedor cobra para deixar ouvir.', light: { z: 20, r: 40, color: '#38f6ff' } });
        O({ kind: 'kiosk', x: X0 + 5, y: Y0 + 5, solid: true, key: 'bilheteria_masp', name: 'Bilheteria do MASP', col: '#c8202a', info: 'Exposição de hoje: "OS ÚLTIMOS PINTORES HUMANOS". Entrada: um retrato seu, desenhado à mão, no livro de visitas.' });
        O({ kind: 'bench', x: X0 + 2, y: Y0 + 5, solid: true, key: 'banco', name: 'Banco do vão livre', seat: true });
      } else if (type === 'plaza') {
        yard(X0, Y0);
        O({ kind: 'fountain', x: X0 + 2, y: Y0 + 2, w: 2, d: 2, solid: true, key: 'fonte_holo', name: 'Fonte holográfica', info: 'Arcos de luz no lugar da água. Um aviso: "ESTA FONTE É PATROCINADA PELA SYNAPSE CORP".', light: { z: 14, r: 70, color: '#b04cff' } });
        O({ kind: 'tree', x: X0, y: Y0, solid: true, key: 'arvore_paulista', name: 'Ipê sintético', info: 'Um ipê-amarelo de fibra óptica. Floresce o ano inteiro, conforme o contrato de manutenção.', col: '#5a4a10', glow: '#ffd23f' });
        O({ kind: 'tree', x: X0 + 5, y: Y0 + 5, solid: true, key: 'arvore_paulista', name: 'Ipê sintético', info: 'Um ipê-amarelo de fibra óptica. Floresce o ano inteiro, conforme o contrato de manutenção.', col: '#5a4a10', glow: '#ffd23f' });
        O({ kind: 'bench', x: X0 + 1, y: Y0 + 4, solid: true, key: 'banco', name: 'Banco da praça', seat: true });
        O({ kind: 'bench', x: X0 + 4, y: Y0 + 1, solid: true, key: 'banco', name: 'Banco da praça', seat: true });
        O({ kind: 'holo_ad', x: X0 + 5, y: Y0, solid: true, key: 'anuncio_paulista', name: 'Anúncio holográfico', text: pick(['STARBYTES', 'PEAR', 'NYKE', 'SAMSONG']), col: pick(['#2fd27a', '#e8eef8', '#38f6ff', '#4a9aff']), info: 'Um anúncio de três andares, em loop. Ele sabe o seu nome, e diz em voz alta.' });
      }
    }
  },
});

const CP = CITIES.city_paulista;
// nada da rua (postes, anúncios, lixeiras) fica embaixo da plataforma da estação, a não ser os pilares dela
{ const st = CP.objects.find(o => o.kind === 'maglev_station');
  for (let i = CP.objects.length - 1; i >= 0; i--) { const o = CP.objects[i];
    if (!o.st && o.kind !== 'maglev' && o.x + (o.w || 1) > st.x && o.x < st.x + st.w && o.y + (o.d || 1) > st.y && o.y < st.y + st.d) CP.objects.splice(i, 1); } }
ROOMS.city_paulista = {
  name: 'Setor Paulista', w: CP.N, h: CP.N, city: true, cityObj: CP, outdoor: true, dark: 0.45, neon: '#38f6ff', floor: 'city',
  lights: [], objects: CP.objects, npcs: CP.npcs, walkers: CP.walkers, spawn: [45, 29],
};
// passageiros andando pelo mezanino da estação
{ const e = STATION_ELEV.city_paulista, looks = ['synth1', 'synth2', 'ped1', 'ped2', 'ped4', 'ped5'], names = ['Passageiro', 'Passageira', 'Executivo apressado', 'Estudante', 'Turista'];
  for (let k = 0; k < 7; k++) CP.walkers.push({ look: looks[k % looks.length], name: names[k % names.length], lines: PAULISTA_LINES, x: e.x0 + 1 + k, y: e.y0 + 1, speed: 0.8 + (k % 3) * 0.2, area: [e.x0 + 1, e.y0 + 1, e.x1 - 2, e.y0 + 2] });
  for (const w of CP.walkers) if (w.tiles === 'crowd' && w.x >= e.x0 && w.x < e.x1 && w.y >= e.y0 && w.y < e.y1) w.y = e.sy1 + 1;   // ninguém de guarda-chuva no mezanino
  for (let k = 0; k < 2; k++) CP.walkers.push({ look: looks[k + 2], name: 'Passageiro', lines: PAULISTA_LINES, x: e.sx0 + k, y: e.sy0 - 1, speed: 1, area: [e.sx0, e.sy0 - 1, e.sx1 - 1, e.sy1 - 1] }); }
CITY_DESTS.city_paulista = {
  ns_torre:   { name: 'Neo-Sampa Tower (Synapse Corp)', short: 'Torre', door: CP.map(25, 29), color: '#38f6ff', icon: 'S' },
  ns_estacao: { name: 'Estação do aerotrem — Setor Paulista', short: 'Estação', door: CP.map(45, 29), color: '#b04cff', icon: 'A' },
  ns_trianon: { name: 'Parque Trianon', short: 'Trianon', door: CP.map(36, 19), color: '#7dff6b', icon: 'T' },
  ns_masp:    { name: 'MASP — Museu de Arte de Neo-Sampa', short: 'MASP', door: CP.map(36, 22), color: '#ff3355', icon: 'M' },
};
GPS_ALWAYS.push(...Object.keys(CITY_DESTS.city_paulista));
GPS_HOME.push('ns_estacao', 'ns_torre');

// ---------- MASP do futuro ----------
// bloco de vidro suspenso por dois pórticos vermelhos (pilares nas quatro pontas e vigas por cima),
// com o vão livre aberto embaixo; o acervo aparece projetado nas janelas
// ---------- aerotrem: trilho magnético, trem flutuante e estação elevada ----------
// o trem vem a cada 34 s, alternando o sentido: chega freando, para 8 s na estação com as portas abertas e parte.
// devolve a posição da frente, o sentido e quanto as portas estão abertas (ou null quando não há trem)
function maglevTrain(t, n) {
  const e = STATION_ELEV.city_paulista, stop = e ? (e.x0 + e.x1) / 2 : n / 2;
  const P = 34, s = t % P, dir = Math.floor(t / P) % 2 ? -1 : 1;
  let c;
  if (s < 6) { const u = 1 - s / 6; c = stop - dir * (stop + 20) * u * u; }
  else if (s < 14) c = stop;
  else if (s < 20) { const u = (s - 14) / 6; c = stop + dir * (n - stop + 20) * u * u; }
  else return null;
  return { head: c + dir * 4.75, dir, open: s > 6.6 && s < 13.4 ? Math.min(1, (s - 6.6) / 0.8, (13.4 - s) / 0.8) : 0 };
}
function paulistaProp(o, t, w, d, cx, cy) {
  if (o.kind === 'maglev') {
    const y = o.y + 0.3, dd = 0.4;
    if (o.x % 7 === 3) {                                // pilar de concreto com faixa de neon
      box(o.x + 0.38, y + 0.05, 0.3, 0.3, MAG_Z, '#3a3e4a', 0, '#4a4e5a');
      const [sx, sy] = iso(o.x + 0.53, y + 0.35, MAG_Z - 6); glow(sx, sy, 8, '#38f6ff', 0.25);
    }
    box(o.x, y, 1, dd, 3, '#2a2e3a', MAG_Z, '#4a5060');            // viga
    const [a0, a1] = [iso(o.x, y + dd, MAG_Z + 1.5), iso(o.x + 1, y + dd, MAG_Z + 1.5)];
    line([a0, a1], rgba('#38f6ff', 0.55 + 0.25 * Math.sin(t * 4 + o.x * 0.5)), 0.6);   // bobinas magnéticas
    const tr = maglevTrain(t, o.n);
    if (tr) {
      for (let c = 0; c < 3; c++) {                     // três vagões de 3 tiles
        const c0 = tr.dir > 0 ? tr.head - 3 - c * 3.25 : tr.head + c * 3.25, c1 = c0 + 3;
        const xa = Math.max(c0, o.x), xb = Math.min(c1, o.x + 1);
        if (xb <= xa) continue;
        const z = MAG_Z + 5 + Math.sin(t * 3) * 0.6, ty = o.y + 0.15;
        box(xa, ty, xb - xa, 0.7, 11, '#d8dee8', z, '#eef2f8');
        const p0 = iso(xa, ty + 0.7, z + 5), p1 = iso(xb, ty + 0.7, z + 5), p2 = iso(xb, ty + 0.7, z + 8.5), p3 = iso(xa, ty + 0.7, z + 8.5);
        ctx.fillStyle = 'rgba(120,230,255,0.85)'; ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.lineTo(...p2); ctx.lineTo(...p3); ctx.fill();
        line([iso(xa, ty + 0.7, z + 1.5), iso(xb, ty + 0.7, z + 1.5)], '#ff4fd8', 0.7);
        const [gx, gy] = iso((xa + xb) / 2, ty + 0.35, MAG_Z + 3); glow(gx, gy, 10, '#38f6ff', 0.35);
      }
    }
    return true;
  }
  if (o.kind === 'st_floor') {                          // prédio da estação: térreo de vidro e laje do mezanino
    box(o.x, o.y, 1, 1, MAG_Z, '#161b26', 0, (o.x + o.y) % 2 ? '#3a4152' : '#353c4c');
    if (o.edgeS) {
      const a = iso(o.x, o.y + 1, 8), b = iso(o.x + 1, o.y + 1, 8), c = iso(o.x + 1, o.y + 1, 28), d0 = iso(o.x, o.y + 1, 28);
      ctx.fillStyle = 'rgba(120,200,255,0.22)'; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d0); ctx.fill();
      line([iso(o.x, o.y + 1, MAG_Z - 1), iso(o.x + 1, o.y + 1, MAG_Z - 1)], '#38f6ff', 0.8);
    }
    if (o.edgeE) {
      const a = iso(o.x + 1, o.y, 8), b = iso(o.x + 1, o.y + 1, 8), c = iso(o.x + 1, o.y + 1, 28), d0 = iso(o.x + 1, o.y, 28);
      ctx.fillStyle = 'rgba(120,200,255,0.16)'; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d0); ctx.fill();
      line([iso(o.x + 1, o.y, MAG_Z - 1), iso(o.x + 1, o.y + 1, MAG_Z - 1)], '#38f6ff', 0.8);
    }
    return true;
  }
  if (o.kind === 'st_step') {                           // uma fileira da escadaria (k = 0 é a mais alta)
    const n = 4, sd = 1 / n;
    for (let i = 0; i < n; i++) {
      const f = (o.k * n + i + 1) / (3 * n);            // fração da descida já vencida
      box(o.x, o.y + i * sd, w, sd, MAG_Z * (1 - f) + MAG_Z / (3 * n), '#262b38', 0, i % 2 ? '#4a5060' : '#555c6e');
    }
    return true;
  }
  if (o.kind === 'st_rail') {                           // corrimão de vidro da escadaria
    const z0 = MAG_Z * (1 - o.k / 3), z1 = MAG_Z * (1 - (o.k + 1) / 3), xx = o.side === 'w' ? o.x + 0.9 : o.x + 0.1;
    box(o.x + 0.1, o.y, 0.8, 1, Math.max(4, z1), '#202530', 0, '#2a303c');
    const a = iso(xx, o.y, z0), b = iso(xx, o.y + 1, z1), c = iso(xx, o.y + 1, z1 + 9), d0 = iso(xx, o.y, z0 + 9);
    ctx.fillStyle = 'rgba(120,220,255,0.2)'; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d0); ctx.fill();
    line([d0, c], '#38f6ff', 0.7);
    return true;
  }
  if (o.kind === 'st_glass') {                          // vidro de segurança na borda do mezanino (desenhado já na altura dele)
    const pts = o.side === 'w' ? [[o.x + 0.1, o.y], [o.x + 0.1, o.y + 1]] : o.side === 'e' ? [[o.x + 0.9, o.y], [o.x + 0.9, o.y + 1]] : [[o.x, o.y + 0.9], [o.x + 1, o.y + 0.9]];
    const a = iso(...pts[0]), b = iso(...pts[1]), c = iso(...pts[1], 14), d0 = iso(...pts[0], 14);
    ctx.fillStyle = 'rgba(120,220,255,0.18)'; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d0); ctx.fill();
    line([d0, c], '#9ae8ff', 0.6); line([a, d0], '#5a6a7a', 0.5);
    return true;
  }
  if (o.kind === 'st_psd') {                            // porta de plataforma: duas folhas de vidro que correm para os lados
    const tr = maglevTrain(t, CITIES.city_paulista.N), op = tr ? tr.open : 0, y = o.y + 0.15;
    box(o.x, y, 0.08, 0.2, 22, '#5a6272', 0, '#7a8292');
    const g = 0.42 * op;
    for (const [u0, u1] of [[0.08, 0.5 - g], [0.5 + g, 1]]) {
      if (u1 <= u0) continue;
      const a = iso(o.x + u0, y + 0.1), b = iso(o.x + u1, y + 0.1), c = iso(o.x + u1, y + 0.1, 20), d0 = iso(o.x + u0, y + 0.1, 20);
      ctx.fillStyle = 'rgba(140,230,255,0.25)'; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d0); ctx.fill();
      line([d0, c], '#9ae8ff', 0.5);
    }
    box(o.x, y, 1, 0.2, 2, '#3a4152', 20, '#4a5262');
    const [lx, ly] = iso(o.x + 0.5, y + 0.2, 21);
    ctx.fillStyle = op > 0 ? '#7dff6b' : '#ff3355'; ctx.fillRect(lx - 1, ly - 0.5, 2, 1);
    return true;
  }
  if (o.kind === 'st_ticket') {                         // guichê: cabine com vidro e atendente
    box(o.x + 0.05, o.y + 0.1, 0.9, 0.8, 9, '#2a3040', 0, '#3a4252');
    const [sx, sy] = iso(o.x + 0.5, o.y + 0.5, 9);
    drawChar(ctx, sx, sy + 9, LOOKS.synth2, t, false, true, { look: 'synth2' });
    ctx.globalAlpha = 0.35; box(o.x + 0.05, o.y + 0.85, 0.9, 0.05, 12, '#8ad8ff', 9); ctx.globalAlpha = 1;
    box(o.x, o.y, 1, 1, 2, '#c8202a', 22, '#e83a3a');
    const [tx, ty] = iso(o.x + 0.5, o.y + 1, 25); propText('GUICHÊ', tx, ty, 2.6, '#ffffff');
    return true;
  }
  if (o.kind === 'st_gate') {                           // catraca de vidro com leitor de íris
    for (const u of [0.05, 0.8]) box(o.x + u, o.y + 0.2, 0.15, 0.6, 9, '#4a5262', 0, '#6a7282');
    const open = Math.sin(t * 1.3 + o.x) > 0.6;
    if (!open) { ctx.globalAlpha = 0.5; box(o.x + 0.2, o.y + 0.45, 0.6, 0.08, 6, '#8ad8ff', 2); ctx.globalAlpha = 1; }
    const [lx, ly] = iso(o.x + 0.12, o.y + 0.5, 10); ctx.fillStyle = open ? '#7dff6b' : '#38f6ff'; ctx.fillRect(lx - 1, ly - 1, 2, 2);
    return true;
  }
  if (o.kind === 'maglev_station') {                    // cobertura de vidro sobre o mezanino e o letreiro
    for (const [px, py] of [[o.x + 0.1, o.y + 0.1], [o.x + w - 0.3, o.y + 0.1], [o.x + 0.1, o.y + d - 0.3], [o.x + w - 0.3, o.y + d - 0.3]])
      box(px, py, 0.2, 0.2, 30, '#8a90a0', MAG_Z, '#aab0c0');
    ctx.globalAlpha = 0.25; box(o.x - 0.2, o.y - 0.8, w + 0.4, d + 0.8, 2, '#1a3a50', MAG_Z + 30, '#2a6a8a'); ctx.globalAlpha = 1;
    const [sx, sy] = iso(o.x + w / 2, o.y + d, MAG_Z + 24);
    ctx.fillStyle = 'rgba(10,20,40,0.85)'; ctx.fillRect(sx - 20, sy - 5, 40, 10);
    ctx.strokeStyle = '#38f6ff'; ctx.lineWidth = 0.5; ctx.strokeRect(sx - 20, sy - 5, 40, 10);
    propText('AEROTREM', sx, sy - 1.5, 3.4, '#38f6ff');
    propText('PAULISTA', sx, sy + 2.5, 2.4, '#ff4fd8');
    glow(sx, sy, 26, '#38f6ff', 0.25 + 0.08 * Math.sin(t * 3));
    return true;
  }
  if (o.kind !== 'masp') return false;
  const RED = '#c8202a', REDL = '#e83a3a', Z0 = 44, Z1 = 78;
  // pilares
  for (const [px, py] of [[o.x + 0.15, o.y + 0.15], [o.x + w - 0.65, o.y + 0.15], [o.x + 0.15, o.y + d - 0.65], [o.x + w - 0.65, o.y + d - 0.65]])
    box(px, py, 0.5, 0.5, Z1 + 6, RED, 0, REDL);
  // caixa de vidro suspensa
  box(o.x + 0.1, o.y + 0.6, w - 0.2, d - 1.2, Z1 - Z0, '#1a2430', Z0, '#24303e');
  // obras do acervo projetadas na fachada (troca de quadro de tempos em tempos)
  const ART = [['#e8b040', '#3a6aa8', '#c8202a'], ['#2a6a3a', '#e8e0c8', '#8a3a2a'], ['#5a3a8a', '#e8a0c8', '#3a3a3a'], ['#c87a2a', '#2a3a5a', '#e8e8e8']];
  const k = Math.floor(t / 6) % ART.length;
  for (let i = 0; i < 4; i++) {
    const u = o.x + 0.6 + i * (w - 1.2) / 4, [ax, ay] = iso(u, o.y + d - 0.6, Z0 + 8), [bx, by] = iso(u + (w - 1.2) / 4 - 0.25, o.y + d - 0.6, Z0 + 8);
    const hgt = 16, cols = ART[(k + i) % ART.length];
    ctx.fillStyle = 'rgba(10,14,20,0.9)'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(bx, by - hgt); ctx.lineTo(ax, ay - hgt); ctx.fill();
    for (let j = 0; j < 3; j++) {
      ctx.fillStyle = cols[j]; ctx.globalAlpha = 0.75;
      const f0 = j / 3, f1 = (j + 1) / 3;
      ctx.beginPath(); ctx.moveTo(ax + (bx - ax) * f0, ay + (by - ay) * f0 - 2); ctx.lineTo(ax + (bx - ax) * f1, ay + (by - ay) * f1 - 2); ctx.lineTo(ax + (bx - ax) * f1, ay + (by - ay) * f1 - hgt + 2); ctx.lineTo(ax + (bx - ax) * f0, ay + (by - ay) * f0 - hgt + 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // vigas vermelhas por cima, de pilar a pilar (os dois pórticos)
  box(o.x + 0.1, o.y + 0.15, w - 0.2, 0.5, 6, RED, Z1, REDL);
  box(o.x + 0.1, o.y + d - 0.65, w - 0.2, 0.5, 6, RED, Z1, REDL);
  const [sx, sy] = iso(o.x + w / 2, o.y + d - 0.6, Z0 + 4);
  propText('MASP', sx, sy, 4.6, '#ffffff');
  glow(sx, sy, 30, '#ff3355', 0.18);
  return true;
}
