// ============================================================
// Caso 2 — O Eco dos Dados Mortos
// Neo-Sampa, 2085. Os dados do caso ficam em ECO e entram nas tabelas
// globais (EVIDENCE, DEDUCTIONS, ACTS, ENDINGS...) quando o caso é aberto: ver cases.js.
// O Setor 4 continua aberto; os distritos de Neo-Sampa ficam a uma viagem de aerotrem.
// ============================================================

Object.assign(LOOKS, {
  kaelen:    { coat: '#2a3a4a', coatDark: '#1a2632', skin: '#a99a94', hair: '#3a2a1a', legs: '#1a1e26', implant: '#ff3355', shirt: '#d8e0e8', hairStyle: 'modern', rim: [255, 51, 85] },
  lyra:      { coat: '#1a1a2e', coatDark: '#10101e', skin: '#e0c0a8', hair: '#d8dce8', legs: '#14141e', implant: '#b04cff', long: true, shirt: '#38f6ff', collar: '#b04cff', hairStyle: 'long', goggles: '#b04cff', rim: [176, 76, 255] },
  maya:      { coat: '#e8eef2', coatDark: '#aab8c4', skin: '#c89a78', hair: '#5a5a62', legs: '#2a2e3a', implant: '#38f6ff', long: true, shirt: '#3a4a5a', hairStyle: 'bun', goggles: '#38f6ff' },
  rig7:      { coat: '#7a6a3a', coatDark: '#4a4026', skin: '#5a5a62', hair: '#3a3a42', legs: '#3a3a42', implant: '#ff3355', armL: '#8a8a94', wide: true, shirt: '#2a2a30', hairStyle: 'bald', goggles: '#ff3355', rim: [255, 51, 85] },
  zero:      { coat: '#1a1410', coatDark: '#0e0a08', skin: '#14141a', hair: '#0a0a0e', legs: '#14141a', implant: '#7dff6b', armL: '#6a6a74', wide: true, shirt: '#2a3a2a', hairStyle: 'hood', goggles: '#7dff6b', rim: [125, 255, 107] },
  dante:     { coat: '#2a2420', coatDark: '#1a1612', skin: '#c49a7a', hair: '#1a1410', legs: '#1a1612', implant: '#ffd23f', shirt: '#5a1a1a', tie: '#ffd23f', hairStyle: 'slick', hat: '#1e1a22', rim: [255, 210, 63] },
  ze:        { coat: '#e8e0d0', coatDark: '#b8ae9a', skin: '#b07a58', hair: '#d0d0d0', legs: '#3a3026', implant: '#ffb347', wide: true, shirt: '#e8e0d0', hairStyle: 'bald', beard: true },
  tico:      { coat: '#3a4a2a', coatDark: '#26321a', skin: '#8a5a3a', hair: '#1a1410', legs: '#2a2a20', implant: '#ff8a3d', armL: '#9a8a6a', shirt: '#5a4a2a', hairStyle: 'modern', goggles: '#ffb347' },
  agora:     { coat: '#7dff6b', coatDark: '#3aa82a', skin: '#d8ffd0', hair: '#a8ff9a', legs: '#3aa82a', implant: '#ffffff', long: true, holo: true, shirt: '#effff0', hairStyle: 'bob', rim: [255, 255, 255] },
  irma7:     { coat: '#f0f0f4', coatDark: '#b8b8c4', skin: '#e8e4ec', hair: '#c8c4d0', legs: '#d8d8e0', implant: '#7dff6b', long: true, shirt: '#7dff6b', hairStyle: 'bob', goggles: '#7dff6b' },
  guarda_sint: { coat: '#20242e', coatDark: '#141820', skin: '#3a3e48', hair: '#20242e', legs: '#141820', implant: '#38f6ff', armL: '#5a6070', wide: true, shirt: '#38f6ff', hairStyle: 'hood', goggles: '#38f6ff', rim: [56, 246, 255] },
  synth1:    { coat: '#2a2a3a', coatDark: '#1a1a26', skin: '#c8a888', hair: '#2a1a14', legs: '#1a1a22', implant: '#38f6ff', shirt: '#e0e0e8', tie: '#38f6ff', hairStyle: 'slick' },
  synth2:    { coat: '#3a2a4a', coatDark: '#261a32', skin: '#e0b898', hair: '#1a1a1a', legs: '#1a1a22', implant: '#ff4fd8', long: true, shirt: '#e0e0e8', hairStyle: 'bun' },
  raver1:    { coat: '#1a1a1a', coatDark: '#0e0e0e', skin: '#d8a888', hair: '#ff4fd8', legs: '#1a1a1a', implant: '#ff4fd8', shirt: '#ff4fd8', hairStyle: 'modern', goggles: '#ff4fd8' },
  raver2:    { coat: '#2a1a3a', coatDark: '#1a0e26', skin: '#8a5a3a', hair: '#38f6ff', legs: '#14141a', implant: '#38f6ff', long: true, shirt: '#38f6ff', hairStyle: 'long' },
  raver3:    { coat: '#3a3a1a', coatDark: '#26260e', skin: '#e8c8a8', hair: '#ffd23f', legs: '#1a1a14', implant: '#ffd23f', shirt: '#1a1a14', hairStyle: 'bob', goggles: '#ffd23f' },
  bixiga1:   { coat: '#4a3a2a', coatDark: '#2e2418', skin: '#c49070', hair: '#3a3a3a', legs: '#2a2420', implant: '#ffb347', shirt: '#8a2a2a', hairStyle: 'bald', beard: true },
  bixiga2:   { coat: '#2a3a4a', coatDark: '#1a2632', skin: '#a8785a', hair: '#1a1410', legs: '#1a1a20', implant: '#7dff6b', long: true, shirt: '#e8d8a8', hairStyle: 'long' },
  minhoca1:  { coat: '#4a4030', coatDark: '#2e281e', skin: '#9a6a4a', hair: '#1a1410', legs: '#2a2418', implant: '#ff8a3d', armL: '#7a7a6a', shirt: '#3a3020', hairStyle: 'hood' },
  minhoca2:  { coat: '#3a2a3a', coatDark: '#261a26', skin: '#d8b090', hair: '#7a2a8a', legs: '#1a141a', implant: '#b04cff', long: true, shirt: '#2a1a2a', hairStyle: 'long' },
  morador1:  { coat: '#4a4030', coatDark: '#2e2818', skin: '#8a5a3a', hair: '#3a3a3a', legs: '#3a3428', implant: '#6a6a5a', shirt: '#5a2a2a', hairStyle: 'hood', beard: true },
  morador2:  { coat: '#5a3a4a', coatDark: '#3a2430', skin: '#c49070', hair: '#6a6a6a', legs: '#2a2a2a', implant: '#6a6a5a', long: true, shirt: '#3a4a3a', hairStyle: 'long' },
  morador3:  { coat: '#3a4a3a', coatDark: '#26301e', skin: '#6a4028', hair: '#1a1410', legs: '#3a3020', implant: '#ffb347', shirt: '#8a6a2a', hairStyle: 'modern', cap: '#8a2a2a', beard: true },
  paciente1: { coat: '#9ab8c8', coatDark: '#6a8898', skin: '#c49070', hair: '#2a2420', legs: '#9ab8c8', implant: '#7dff6b', shirt: '#b8d4e0', hairStyle: 'modern' },
  paciente2: { coat: '#9ab8c8', coatDark: '#6a8898', skin: '#8a5a3a', hair: '#1a1410', legs: '#9ab8c8', implant: '#7dff6b', long: true, shirt: '#b8d4e0', hairStyle: 'bun' },
  hacker1:   { coat: '#1a1a1a', coatDark: '#0e0e0e', skin: '#14141a', hair: '#0a0a0e', legs: '#1a1a20', implant: '#7dff6b', shirt: '#2a3a2a', hairStyle: 'hood', goggles: '#7dff6b' },
  hacker2:   { coat: '#2a1a2a', coatDark: '#1a0e1a', skin: '#c89a78', hair: '#7dff6b', legs: '#1a1a20', implant: '#38f6ff', shirt: '#1a2a1a', hairStyle: 'modern', goggles: '#38f6ff' },
  caio:      { coat: '#d8e0e4', coatDark: '#9aa8b0', skin: '#a8785a', hair: '#3a2a1a', legs: '#2a2e3a', implant: '#7dff6b', shirt: '#3a4a3a', hairStyle: 'slick', beard: true, goggles: '#7dff6b' },
  cida:      { coat: '#6a3a2a', coatDark: '#4a2418', skin: '#7a4a2a', hair: '#c8c8c8', legs: '#3a2a2a', implant: '#ffb347', long: true, shirt: '#c8a020', hairStyle: 'bun' },
});

// robôs e androides usam o corpo mecânico (robotBody, em engine.js)
Object.assign(LOOKS, {
  robo_carga: { coat: '#c8901a', coatDark: '#8a6010', skin: '#5a5a62', hair: '#3a3a42', legs: '#3a3a42', implant: '#ff6a2a', goggles: '#ffd23f', robot: 'heavy' },
  robo_limpeza: { coat: '#3a6a8a', coatDark: '#24485e', skin: '#6a6a72', hair: '#3a3a42', legs: '#3a3a42', implant: '#7dff6b', goggles: '#38f6ff', robot: 'heavy' },
  enfermeiro_bot: { coat: '#e8eef2', coatDark: '#aab8c4', skin: '#8a8e96', hair: '#c8c8d0', legs: '#c8c8d0', implant: '#7dff6b', goggles: '#7dff6b', robot: 'android' },
});
Object.assign(LOOKS.rig7, { robot: 'heavy' });
Object.assign(LOOKS.guarda_sint, { robot: 'heavy', coat: '#2a2e3a', coatDark: '#1a1e28', skin: '#4a5060' });
Object.assign(LOOKS.irma7, { robot: 'android', skin: '#9a9aa8', veil: '#e8e8f0' });
Object.assign(LOOKS.unidade7, { robot: 'android' });
Object.assign(LOOKS.lumi, { robot: 'android' });

// ------------------------------------------------------------
// Salas de Neo-Sampa
// ------------------------------------------------------------
Object.assign(ROOMS, {
  ns_hall: {
    name: 'Neo-Sampa Tower — Átrio do 220º andar', w: 14, h: 10, floor: 'marble', dark: 0.45,
    neon: '#38f6ff', wallColor: ['#141c2a', '#0e1420'],
    glass: true, wallN: '..E..HNNH..D..', wallW: '..........',
    lights: [{ x: 6, y: 1, z: 36, r: 90, color: '#e8f4ff' }, { x: 11.5, y: 0.6, z: 30, r: 50, color: '#ff3355', flicker: true },
      { x: 2.5, y: 0.6, z: 30, r: 50, color: '#38f6ff' }, { x: 3, y: 7, z: 30, r: 70, color: '#b04cff' }, { x: 11, y: 7, z: 30, r: 70, color: '#38f6ff' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'city_paulista', at: [25, 29], name: 'Elevador expresso → Térreo (Av. Paulista)' },
      { kind: 'exit', x: 11, y: 0, key: 'exit', to: 'ns_lab', at: [2, 1], name: 'Porta blindada → Laboratório cinético' },
      { kind: 'desk', x: 4, y: 2, w: 4, d: 1, solid: true, key: 'balcao_synapse', name: 'Recepção da Synapse Corp', info: 'Mármore holográfico que muda de veio a cada minuto. O logo da Synapse gira em cima: um neurônio estilizado com uma coroa.' },
      { kind: 'terminal', x: 8, y: 2, solid: true, key: 'term_synapse', name: 'Terminal de acessos internos', screen: '#38f6ff' },
      { kind: 'holo_map', x: 9, y: 5, w: 2, d: 2, solid: true, key: 'holo_torre', name: 'Maquete holográfica da torre', info: 'A Neo-Sampa Tower em miniatura: 300 andares de vidro. Do 200º para cima, o ar é filtrado e cobrado por metro cúbico.' },
      { kind: 'sofa', x: 1, y: 6, w: 1, d: 2, solid: true, key: 'sofa_synapse', name: 'Sofá de espera', seat: true },
      { kind: 'table', x: 2, y: 7, solid: true, key: 'mesa_synapse', name: 'Mesa de vidro', info: 'Revistas holográficas: "SYNAPSE: A IMORTALIDADE É UM PRODUTO".' },
      { kind: 'armchair', x: 3, y: 8, solid: true, key: 'poltrona_synapse', name: 'Poltrona', seat: true },
      { kind: 'plant', x: 0, y: 2, solid: true, key: 'planta', name: 'Planta holográfica' },
      { kind: 'plant', x: 13, y: 2, solid: true, key: 'planta', name: 'Planta holográfica' },
      { kind: 'plant', x: 13, y: 9, solid: true, key: 'planta', name: 'Planta holográfica' },
    ],
    npcs: [{ id: 'lyra', x: 5, y: 5 }, { id: 'maya', x: 11, y: 8 }, { id: 'agora', x: 7, y: 4 }],
    walkers: [{ look: 'synth1', name: 'Executivo da Synapse', lines: 'synapse', x: 4, y: 4 }, { look: 'synth2', name: 'Executiva da Synapse', lines: 'synapse', x: 8, y: 8 },
      { look: 'synth2', name: 'Assessora de imprensa', lines: 'synapse', x: 6, y: 7 }, { look: 'synth1', name: 'Advogado da Synapse', lines: 'synapse', x: 10, y: 3 },
      { look: 'guarda_sint', name: 'Segurança sintético', lines: 'seguranca', x: 12, y: 2 }, { look: 'guarda_sint', name: 'Segurança sintético', lines: 'seguranca', x: 3, y: 2 },
      { look: 'robo_limpeza', name: 'Robô de limpeza', lines: 'robo', x: 9, y: 8 }],
  },
  ns_lab: {
    name: 'Laboratório de Testes Cinéticos', w: 10, h: 8, floor: 'office', dark: 0.66,
    neon: '#38f6ff', wallColor: ['#121822', '#0c1018'],
    wallN: '..D...HV..', wallW: 'hhhhhhhh',
    lights: [{ x: 5.5, y: 3.5, z: 26, r: 70, color: '#38f6ff' }, { x: 5, y: 1.4, z: 16, r: 50, color: '#ff3355', flicker: true },
      { x: 8.5, y: 5.5, z: 20, r: 50, color: '#ff3355' }, { x: 1.5, y: 5.5, z: 24, r: 50, color: '#7dff6b' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'ns_hall', at: [11, 1], name: 'Porta blindada → Átrio' },
      { kind: 'panel', x: 3, y: 0, solid: true, key: 'porta_quantica', name: 'Painel da porta quântica' },
      { kind: 'monitor_desk', x: 4, y: 1, w: 3, solid: true, key: 'monitor_manifesto', name: 'Monitor principal' },
      { kind: 'neural_chair', x: 5, y: 3, solid: true, key: 'cadeira_interface', name: 'Cadeira de interface 01', info: 'A cadeira de interface está vazia, girada para o lado. O cabo neural pende até o chão, onde ainda pisca em vermelho.' },
      { kind: 'corpse', x: 5, y: 4, look: 'kaelen', blood: false, solid: true, key: 'kaelen', name: 'Kaelen Voss' },
      { kind: 'server_rack', x: 9, y: 1, solid: true, key: 'racks_lab', name: 'Rack isolado', info: 'Servidores sem nenhuma conexão externa. "Gaiola de Faraday nível 9", diz a etiqueta. Nada entra, nada sai.' },
      { kind: 'server_rack', x: 9, y: 2, solid: true, key: 'racks_lab', name: 'Rack isolado', info: 'Servidores sem nenhuma conexão externa. "Gaiola de Faraday nível 9", diz a etiqueta. Nada entra, nada sai.' },
      { kind: 'lab_bench', x: 1, y: 5, w: 2, solid: true, key: 'bancada_lab', name: 'Bancada de testes', info: 'Pentes de memória vazios, um ferro de solda frio e um copo de café sintético com marca de batom prateado.' },
      { kind: 'cryo_tank', x: 0, y: 2, solid: true, key: 'tanque_lab', name: 'Tanque de resfriamento', info: 'Gel de resfriamento para interfaces neurais. Mantém a porta neural a 4 graus durante os testes.' },
      { kind: 'floodlight', x: 8, y: 7, solid: true, key: 'refletor', name: 'Refletor da perícia', info: 'Luz forense branca e dura. Deixa tudo com cara de necrotério.' },
      { kind: 'forensic_kit', x: 0, y: 7, solid: true, key: 'kit_pericia', name: 'Maleta da perícia', info: 'Pinças, sacos de evidência e um scanner de DNA. A perícia da Synapse chegou antes da polícia.' },
      { kind: 'marker', x: 6, y: 4, ox: 0.4, oy: 0.6, n: 1 }, { kind: 'marker', x: 4, y: 4, ox: 0.6, oy: 0.4, n: 2 }, { kind: 'marker', x: 6, y: 5, ox: 0.3, oy: 0.3, n: 3 },
    ],
    npcs: [{ id: 'rig7', x: 8, y: 5 }],
    walkers: [{ look: 'cop1', name: 'Perito da polícia', lines: 'pericia', x: 2, y: 4 }, { look: 'cop3', name: 'Perita da Synapse', lines: 'pericia', x: 7, y: 6 }],
  },
  ns_minhocao: {
    name: 'Baixo Minhocão — Subnível 4', w: 30, h: 16, floor: 'concrete', dark: 0.62, outdoor: true,
    neon: '#ff8a3d', wallColor: ['#1e1a18', '#161210'],
    wallN: 'PPE.N..PP.H..PPP.N...PP..H.PPP', wallW: 'P...H...P..P..P.',
    lights: [{ x: 2.5, y: 0.6, z: 30, r: 60, color: '#ffb347' }, { x: 4, y: 6.5, z: 26, r: 70, color: '#ff4fd8' }, { x: 9, y: 6.5, z: 26, r: 70, color: '#38f6ff' },
      { x: 15, y: 6.5, z: 26, r: 60, color: '#ffd23f' }, { x: 23, y: 8.5, z: 24, r: 80, color: '#ff8a3d' }, { x: 5, y: 11.5, z: 12, r: 60, color: '#ff6a2a' },
      { x: 18, y: 11.5, z: 12, r: 60, color: '#ff6a2a' }, { x: 28, y: 10.5, z: 12, r: 50, color: '#ff6a2a' }, { x: 12, y: 4.5, z: 60, r: 70, color: '#ffb347', flicker: true }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'aerotrem', name: 'Escada → Estação do aerotrem' },
      // o viaduto: duas fileiras de pilares e as vigas do tabuleiro lá em cima
      ...[5, 11, 17, 23, 29].flatMap(x => [4, 12].map(y => ({ kind: 'pillar', x, y, solid: true, key: 'pilar', name: 'Pilar do viaduto', info: 'Concreto de 2030, rachado e pichado. Lá em cima, a via expressa da Zona Alta passa sem nunca olhar para baixo.' }))),
      { kind: 'beam', x: 5, y: 4, w: 25, d: 1 }, { kind: 'beam', x: 5, y: 12, w: 25, d: 1 },
      // feira de chips e ciborgues
      { kind: 'stall', x: 3, y: 6, w: 2, d: 1, solid: true, goods: 'tech', col: '#1a6a8a', sign: 'CHIPS', key: 'banca_chips', name: 'Banca de chips', info: 'Chips de memória em potes de conserva. Um cartaz escrito à mão: "100% ROUBADO, 0% RASTREÁVEL".', light: { z: 26, r: 40, color: '#38f6ff' } },
      { kind: 'stall', x: 8, y: 6, w: 2, d: 1, solid: true, goods: 'tech', col: '#8a1a5a', sign: 'CIBORGUE', key: 'banca_ciborgue', name: 'Banca de próteses', info: 'Braços, olhos e joelhos de modelos que saíram de linha antes de você nascer. Garantia: "até virar a esquina".', light: { z: 26, r: 40, color: '#ff4fd8' } },
      { kind: 'stall', x: 14, y: 6, w: 2, d: 1, solid: true, goods: 'dumpling', col: '#c8902a', sign: 'PASTEL', key: 'banca_pastel', name: 'Pastelaria do Subnível', info: 'Pastel de "carne" frito em óleo de repulsor. O cheiro é melhor do que deveria ser.', light: { z: 26, r: 50, color: '#ffb347' } },
      { kind: 'lantern_line', x: 1, y: 2, w: 28, d: 1, axis: 'x', col: '#ff4fd8' },
      { kind: 'lantern_line', x: 1, y: 8, w: 18, d: 1, axis: 'x', col: '#38f6ff' },
      // oficina do Tico
      { kind: 'counter', x: 21, y: 8, w: 3, d: 1, solid: true, key: 'oficina_tico', name: 'Bancada da oficina do Tico', info: 'Placas-mãe abertas, um braço robótico pela metade e um ferro de solda que nunca esfria. Na parede: "CONSERTO ROBÔ, ANDROIDE E CORAÇÃO PARTIDO".' },
      { kind: 'scrap', x: 24, y: 9, w: 2, d: 2, solid: true, key: 'entulho', name: 'Sucata da oficina', info: 'Carcaças de robôs de limpeza. Uma delas tem o mesmo modelo de chassi do RIG-7.' },
      { kind: 'tires', x: 27, y: 6, solid: true, n: 5, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus de carro voador usados como cadeira, mesa e, uma vez, como berço.' },
      // carros abandonados
      { kind: 'car', cx: 8.5, cy: 14.2, ang: 0.25, solid: true, key: 'carro_abandonado', name: 'Carro abandonado', info: 'Um sedã sem repulsores, sem rodas e sem portas. Tem cortina na janela de trás: alguém mora aqui.', livery: { main: '#4a3a2a', second: '#2a2018', under: '#141008', metal: '#3a3028', glass: '#1a1a1a', accent: '#6a4a2a', model: 'sedan' } },
      { kind: 'car', cx: 15.5, cy: 9.6, ang: 1.35, solid: true, key: 'carro_abandonado', name: 'Carro abandonado', info: 'Um cupê que caiu da via expressa em 2071. Ninguém veio buscar. Virou horta: tem tomate brotando no capô.', livery: { main: '#3a4a3a', second: '#24301e', under: '#141810', metal: '#3a3a30', glass: '#1a2018', accent: '#5a6a3a', model: 'coupe' } },
      { kind: 'car', cx: 26.5, cy: 14, ang: -0.4, solid: true, key: 'carro_abandonado', name: 'Táxi abandonado', info: 'Um táxi voador de 2060, amarelo desbotado. O taxímetro ainda marca uma corrida de 40 créditos que ninguém pagou.', livery: { main: '#8a7a2a', second: '#3a3418', under: '#18160a', metal: '#3a3a30', glass: '#1a1a14', accent: '#a89a3a', model: 'sedan' } },
      { kind: 'car', cx: 20.5, cy: 14.4, ang: 0.05, solid: true, key: 'carro_abandonado', name: 'Carro queimado', info: 'Só sobrou a carcaça preta. Os moradores usam o porta-malas como armário.', livery: { main: '#1e1a18', second: '#141210', under: '#0a0a08', metal: '#2a2420', glass: '#0a0a0a', accent: '#3a2a20', model: 'coupe' } },
      // moradores de rua: barracas, colchões, fogueiras e barracos
      { kind: 'tent', x: 1, y: 9, solid: true, key: 'barraca_lona', name: 'Barraca de lona', info: 'Lona azul, cordas amarradas no pilar e um par de botas na porta. Lá dentro, alguém ronca.' },
      { kind: 'tent', x: 3, y: 10, solid: true, key: 'barraca_lona', name: 'Barraca de lona', info: 'Uma barraca de camping de luxo, de antes da crise. Agora é a casa de uma família de quatro.' },
      { kind: 'tent', x: 12, y: 14, solid: true, key: 'barraca_lona', name: 'Barraca de lona', info: 'Pendurado na entrada, um sino de vento feito de chips queimados.' },
      { kind: 'tent', x: 13, y: 10, solid: true, key: 'barraca_lona', name: 'Barraca de lona', info: 'Uma placa de papelão: "AQUI MORA O SEU JOÃO. BATA PALMAS."' },
      { kind: 'mattress', x: 1, y: 13, w: 2, d: 1, key: 'colchao', name: 'Colchão na calçada', info: 'Um colchão e um cobertor xadrez, protegidos da chuva pelo viaduto. É o melhor teto da cidade.' },
      { kind: 'mattress', x: 6, y: 9, w: 2, d: 1, col: '#2a4a5a', key: 'colchao', name: 'Papelão e cobertor', info: 'Caixas de papelão abertas e um cobertor térmico de alumínio, que brilha com o neon.' },
      { kind: 'mattress', x: 18, y: 9, w: 1, d: 2, col: '#4a3a1a', key: 'colchao', name: 'Colchão na calçada', info: 'Um colchão com uma foto colada na parede do pilar: uma família na praia, num tempo em que havia praia.' },
      { kind: 'barrel', x: 5, y: 10, solid: true, fire: true, key: 'tambor', name: 'Tambor com fogo', info: 'Gente se esquenta em volta e fala baixo. Lá em cima, a chuva ácida escorre pelas bordas do viaduto.' },
      { kind: 'barrel', x: 18, y: 12, solid: true, fire: true, key: 'tambor', name: 'Tambor com fogo', info: 'Uma panela de feijão esquenta em cima do tambor. Quem passa ganha uma concha.' },
      { kind: 'barrel', x: 28, y: 10, solid: true, fire: true, key: 'tambor', name: 'Tambor com fogo', info: 'Fogo de pneu velho. A fumaça preta sobe e some no escuro do viaduto.' },
      { kind: 'container', x: 0, y: 14, w: 1, d: 2, solid: true, col: '#2a5a6a', key: 'barraco', name: 'Barraco de lata', info: 'Uma casa feita de contêiner, com varanda de grade e uma antena parabólica apontada para o nada.' },
      { kind: 'container', x: 26, y: 1, w: 3, d: 1, solid: true, col: '#6a3a2a', key: 'barraco', name: 'Barraco de lata', info: 'Dois andares de contêiner empilhado, com uma escada de corda e vasos de planta na janela.' },
      { kind: 'cart', x: 7, y: 11, solid: true, key: 'carrinho_compras', name: 'Carrinho de supermercado', info: 'Cheio de latinhas, fios de cobre e um ursinho de pelúcia molhado. Tudo o que alguém tem.' },
      { kind: 'cart', x: 24, y: 13, solid: true, key: 'carrinho_compras', name: 'Carrinho de supermercado', info: 'Carregado de placas de circuito para vender no ferro-velho.' },
      { kind: 'trash', x: 10, y: 8, solid: true, key: 'lixo_minhocao', name: 'Lixeira transbordando', info: 'Embalagens de pastel, chips queimados e um panfleto: "SYNAPSE PAGA BEM POR VOLUNTÁRIOS. SÓ UM CHIPZINHO."' },
      { kind: 'trash', x: 20, y: 5, solid: true, key: 'lixo_minhocao2', name: 'Pilha de lixo', info: 'Sacos de lixo da Zona Alta, jogados da via expressa. Às vezes cai coisa boa.' },
      { kind: 'scrap', x: 9, y: 1, w: 2, d: 1, solid: true, key: 'entulho2', name: 'Entulho', info: 'Grades, canos e o letreiro de uma loja de 2040: "VÍDEO LOCADORA".' },
      ...[[6, 7], [12, 7], [2, 12], [16, 13], [22, 11], [25, 7], [11, 3], [19, 3]].map(([x, y]) => ({ kind: 'puddle', x, y })),
    ],
    npcs: [{ id: 'tico', x: 22, y: 7 }, { id: 'cida', x: 6, y: 12 }],
    walkers: [
      { look: 'morador1', name: 'Morador do viaduto', lines: 'morador', x: 4, y: 12 }, { look: 'morador2', name: 'Moradora do viaduto', lines: 'morador', x: 19, y: 11 },
      { look: 'morador3', name: 'Catador de latinhas', lines: 'morador', x: 25, y: 12 }, { look: 'minhoca1', name: 'Morador do Minhocão', lines: 'minhocao', x: 7, y: 8 },
      { look: 'minhoca2', name: 'Moradora do Minhocão', lines: 'minhocao', x: 13, y: 8 }, { look: 'ped3', name: 'Comprador de chips', lines: 'minhocao', x: 4, y: 7 },
      { look: 'morador1', name: 'Vendedor de pastel', lines: 'minhocao', x: 16, y: 7 }, { look: 'robo_carga', name: 'Robô de carga abandonado', lines: 'robo', x: 27, y: 8 },
    ],
  },
  ns_zetubo: {
    name: 'Bar do Zé do Tubo — Bixiga', w: 12, h: 9, floor: 'tiles', dark: 0.5,
    neon: '#ffd23f', wallColor: ['#3a2418', '#2a1a10'],
    wallN: '..D..BBB.N..', wallW: '..H...P..',
    lights: [{ x: 6.5, y: 1.5, z: 30, r: 70, color: '#ffd8a0' }, { x: 9.5, y: 0.5, z: 30, r: 45, color: '#ffd23f' },
      { x: 3, y: 6, z: 28, r: 60, color: '#ffb347' }, { x: 9, y: 6.5, z: 28, r: 60, color: '#ff8a3d' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'city_bixiga', at: [15, 26], name: 'Porta → Rua (Bixiga)' },
      { kind: 'bar', x: 5, y: 2, w: 4, d: 1, solid: true, key: 'balcao_ze', name: 'Balcão do Zé' },
      { kind: 'terminal', x: 10, y: 2, solid: true, key: 'term_bixiga', name: 'Terminal público do Bixiga', screen: '#ffd23f' },
      { kind: 'stool', x: 5, y: 3, solid: true }, { kind: 'stool', x: 7, y: 3, solid: true },
      { kind: 'table', x: 2, y: 5, solid: true, key: 'mesa_ze', name: 'Mesa de fórmica', info: 'Fórmica de verdade, de 2030. Tem um coração riscado com faca: "J + M".' },
      { kind: 'table', x: 4, y: 7, solid: true, key: 'mesa_ze', name: 'Mesa de fórmica', info: 'Uma tábua de truco holográfico esquecida. O placar diz que alguém perdeu a casa.' },
      { kind: 'table', x: 8, y: 6, solid: true, key: 'mesa_ze', name: 'Mesa de fórmica', info: 'Copo americano com café pela metade, ainda morno. Alguém saiu às pressas.' },
      { kind: 'tv', x: 0, y: 4, solid: true, key: 'tv_ze', name: 'TV de tubo', info: 'Uma TV de tubo de verdade, ligada num jogo do Corinthians de 2027. O Zé jura que não é reprise.' },
      ...[[2, 6], [3, 5], [4, 6], [5, 7], [8, 7], [9, 6]].map(([x, y]) => ({ kind: 'stool', x, y, solid: true })),
      { kind: 'bookshelf', x: 0, y: 1, solid: true, key: 'estante_ze', name: 'Estante de discos', info: 'Discos de vinil de verdade: Cartola, Adoniran, Racionais. O Zé não deixa ninguém tocar.' },
      { kind: 'manhole', x: 10, y: 7, key: 'alcapao', name: 'Alçapão do porão' },
      { kind: 'plant', x: 11, y: 8, solid: true, key: 'planta_ze', name: 'Espada-de-são-jorge', info: 'Uma espada-de-são-jorge de verdade, num vaso de lata de óleo. Contra mau-olhado e vírus de rede.' },
    ],
    npcs: [{ id: 'ze', x: 6, y: 1 }],
    walkers: [{ look: 'bixiga1', name: 'Freguês do Zé', lines: 'bixiga', x: 3, y: 6, seat: false }, { look: 'bixiga2', name: 'Hacker de meia-pataca', lines: 'bixiga', x: 9, y: 5 },
      { look: 'ped6', name: 'Seu Juca, do truco', lines: 'bixiga', x: 3, y: 4 }, { look: 'minhoca2', name: 'Cantora de samba', lines: 'bixiga', x: 6, y: 6 },
      { look: 'ped3', name: 'Taxista de folga', lines: 'bixiga', x: 9, y: 7 }],
  },
  ns_base: {
    name: 'Base dos Desconectados', w: 10, h: 8, floor: 'concrete', dark: 0.74,
    neon: '#7dff6b', wallColor: ['#14161c', '#0e1014'],
    wallN: 'hhLhhhhhhh', wallW: 'hhWhhhhh',
    lights: [{ x: 5, y: 1.5, z: 20, r: 70, color: '#7dff6b' }, { x: 8.5, y: 2, z: 18, r: 50, color: '#38f6ff' }, { x: 1, y: 5.5, z: 14, r: 40, color: '#ff4fd8' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'ns_zetubo', at: [10, 6], name: 'Escada → Bar do Zé' },
      { kind: 'monitor_desk', x: 4, y: 1, w: 3, solid: true, key: 'mesa_zero', name: 'Estação dos Desconectados', info: 'Doze telas, todas mostrando a mesma coisa: a cidade vista de baixo. Pichado na mesa: "DESCONECTA PRA ENXERGAR".' },
      { kind: 'server_rack', x: 8, y: 1, solid: true, key: 'servidores_zero', name: 'Servidores roubados', info: 'Etiquetas de patrimônio da Synapse Corp, raspadas pela metade.' },
      { kind: 'server_rack', x: 8, y: 2, solid: true, key: 'servidores_zero', name: 'Servidores roubados', info: 'Etiquetas de patrimônio da Synapse Corp, raspadas pela metade.' },
      { kind: 'cot', x: 0, y: 5, solid: true, key: 'catre_zero', name: 'Catre', info: 'Um colchão no chão e um cobertor de alumínio térmico. Revolução não paga aluguel.' },
      { kind: 'crate', x: 7, y: 6, solid: true, key: 'caixote_zero', name: 'Caixote de máscaras', info: 'Máscaras de LED iguais à do Zero, ainda na caixa. "Somos todos ninguém", diz o folheto dentro.' },
      { kind: 'trash', x: 0, y: 2, solid: true, key: 'lixo_hacker', name: 'Lixeira', info: 'Latas de energético e placas fritas. Muitas.' },
      { kind: 'server_rack', x: 8, y: 3, solid: true, key: 'servidores_zero', name: 'Servidores roubados', info: 'Etiquetas de patrimônio da Synapse Corp, raspadas pela metade.' },
      { kind: 'monitor_desk', x: 1, y: 3, w: 2, solid: true, key: 'mesa_hackers', name: 'Bancada dos hackers', info: 'Teclados mecânicos, latas de energético e um cartaz: "A REDE É NOSSA, A NUVEM É DELES".' },
      { kind: 'mattress', x: 3, y: 6, w: 2, d: 1, col: '#2a3a2a', key: 'colchao', name: 'Colchão', info: 'Alguém dorme aqui entre um ataque e outro. Tem um bichinho de pelúcia em forma de servidor.' },
    ],
    npcs: [{ id: 'zero', x: 5, y: 4 }],
    walkers: [{ look: 'hacker1', name: 'Hacker dos Desconectados', lines: 'base', x: 2, y: 4 }, { look: 'hacker2', name: 'Hacker dos Desconectados', lines: 'base', x: 6, y: 6 }],
  },
  ns_clube: {
    name: 'Clube 14 Bis — A Província dos Drones', w: 14, h: 10, floor: 'tiles', dark: 0.72,
    neon: '#ff4fd8', wallColor: ['#1a0e24', '#12081a'],
    wallN: '..D..NNNN..BB.', wallW: '..H..N..H.',
    zones: [{ x0: 4, y0: 3, x1: 9, y1: 6, floor: 'carpet' }],
    lights: [{ x: 6.5, y: 1.4, z: 30, r: 90, color: '#ff4fd8', flicker: true }, { x: 4, y: 4.5, z: 30, r: 70, color: '#38f6ff', flicker: true },
      { x: 9, y: 4.5, z: 30, r: 70, color: '#ffd23f', flicker: true }, { x: 2, y: 8, z: 22, r: 60, color: '#b04cff' }, { x: 11.5, y: 7, z: 26, r: 60, color: '#ff3355' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'city_bixiga', at: [35, 16], name: 'Escada → Rua (Bixiga)' },
      { kind: 'dj_booth', x: 5, y: 1, w: 3, solid: true, key: 'dj', name: 'Cabine do DJ', info: 'O DJ é um drone com quatro braços e fones de ouvido. Toca forró industrial a 180 batidas por minuto.' },
      { kind: 'speaker', x: 1, y: 1, solid: true, key: 'caixa_som', name: 'Caixa de som', info: 'O grave é tão forte que as gotas de chuva no casaco de Vance tremem.' },
      { kind: 'speaker', x: 10, y: 1, solid: true, key: 'caixa_som', name: 'Caixa de som', info: 'O grave é tão forte que as gotas de chuva no casaco de Vance tremem.' },
      { kind: 'bar', x: 10, y: 6, w: 3, d: 1, solid: true, key: 'bar_clube', name: 'Bar do 14 Bis', info: 'Drinques que brilham no escuro. O mais barato custa um mês de aluguel no Minhocão.' },
      { kind: 'sofa', x: 1, y: 7, w: 1, d: 2, solid: true, key: 'sofa_vip', name: 'Camarote VIP', seat: true },
      { kind: 'table', x: 2, y: 7, solid: true, key: 'mesa_vip', name: 'Mesa do camarote', info: 'Um balde de gelo com uma garrafa de champanhe sintético e três chips de dados embrulhados em guardanapo.' },
      { kind: 'stool', x: 10, y: 7, solid: true }, { kind: 'stool', x: 12, y: 7, solid: true },
    ],
    npcs: [{ id: 'dante', x: 3, y: 8 }],
    walkers: [{ look: 'raver1', name: 'Frequentador do 14 Bis', lines: 'clube', x: 5, y: 4 }, { look: 'raver2', name: 'Frequentadora do 14 Bis', lines: 'clube', x: 7, y: 5 },
      { look: 'raver3', name: 'Dançarina do 14 Bis', lines: 'clube', x: 8, y: 3 }, { look: 'synth1', name: 'Executivo disfarçado', lines: 'clube', x: 11, y: 8 },
      { look: 'raver1', name: 'Frequentador do 14 Bis', lines: 'clube', x: 6, y: 5 }, { look: 'raver2', name: 'Frequentadora do 14 Bis', lines: 'clube', x: 4, y: 4 },
      { look: 'raver3', name: 'Dançarina do 14 Bis', lines: 'clube', x: 9, y: 5 }, { look: 'synth2', name: 'Herdeira da Zona Alta', lines: 'clube', x: 12, y: 8 },
      { look: 'robo_carga', name: 'Segurança robô do clube', lines: 'clube_seg', x: 3, y: 2 }],
  },
  ns_clinica: {
    name: 'Clínica Subterrânea Santa Rita — Lado Sombra', w: 16, h: 11, floor: 'tiles', dark: 0.6,
    neon: '#7dff6b', wallColor: ['#18201c', '#101612'],
    wallN: '..D...V..P....H.', wallW: 'P...H...P..',
    lights: [{ x: 10.5, y: 1.5, z: 26, r: 90, color: '#7dff6b' }, { x: 2.5, y: 4.5, z: 30, r: 70, color: '#e8fff0' }, { x: 2.5, y: 7.5, z: 30, r: 60, color: '#e8fff0', flicker: true },
      { x: 8, y: 7, z: 20, r: 50, color: '#38f6ff', flicker: true }, { x: 13.5, y: 9, z: 14, r: 40, color: '#ffb347' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'aerotrem', name: 'Porta → Beco (estação do aerotrem)' },
      // tanques de resfriamento
      { kind: 'cryo_tank', x: 9, y: 1, solid: true, key: 'tanque', name: 'Tanque criogênico', info: 'Um paciente flutua no gel azul, de olhos fechados. A placa diz: "REABILITAÇÃO NEURAL — CICLO 14 DE 40".' },
      { kind: 'cryo_tank', x: 10, y: 1, solid: true, key: 'tanque', name: 'Tanque criogênico', info: 'Vazio. O gel ainda borbulha, como se esperasse alguém.' },
      { kind: 'cryo_tank', x: 11, y: 1, solid: true, key: 'tanque', name: 'Tanque criogênico', info: 'Um paciente flutua no gel azul. Na nuca, o mesmo modelo de chip das cobaias do Minhocão.' },
      { kind: 'cryo_tank', x: 12, y: 1, solid: true, key: 'tanque', name: 'Tanque criogênico', info: 'O painel pisca em amarelo: "RESFRIAMENTO INSTÁVEL". Alguém colou um esparadrapo em cima do aviso.' },
      // enfermaria: leitos com pacientes, cortinas e soro
      { kind: 'patient_bed', x: 1, y: 3, w: 1, d: 2, solid: true, look: 'paciente1', sleep: true, key: 'leito', name: 'Leito 1', info: 'Doador 0447, Minhocão. Dorme agarrado a uma foto. Ao lado, um bilhete: "Ele não lembra o próprio nome, mas lembra da filha."' },
      { kind: 'patient_bed', x: 1, y: 7, w: 1, d: 2, solid: true, look: 'paciente2', key: 'leito', name: 'Leito 2', info: 'Doadora 0451. Está acordada, olhando o teto. Repete baixinho um número de telefone que não existe mais.' },
      { kind: 'patient_bed', x: 4, y: 3, w: 1, d: 2, solid: true, look: 'paciente2', sleep: true, key: 'leito', name: 'Leito 3', info: 'Doadora 0452. O monitor marca sono profundo. O chip na nuca dela está desligado com um clipe de papel.' },
      { kind: 'patient_bed', x: 4, y: 7, w: 1, d: 2, solid: true, look: 'paciente1', key: 'leito', name: 'Leito 4', info: 'Doador 0455. Sorri quando Vance passa. Pergunta se ele é o filho dele. Não é.' },
      { kind: 'partition', x: 2, y: 3, d: 2, axis: 'y', solid: true }, { kind: 'partition', x: 2, y: 7, d: 2, axis: 'y', solid: true },
      { kind: 'iv_stand', x: 0, y: 3, solid: true }, { kind: 'iv_stand', x: 0, y: 7, solid: true }, { kind: 'iv_stand', x: 5, y: 3, solid: true }, { kind: 'iv_stand', x: 5, y: 7, solid: true },
      // sala de procedimentos
      { kind: 'lab_bench', x: 7, y: 5, w: 2, solid: true, key: 'bancada_clinica', name: 'Estação de compilação neural' },
      { kind: 'terminal', x: 14, y: 4, solid: true, key: 'term_clinica', name: 'Prontuários da clínica', screen: '#7dff6b' },
      { kind: 'bookshelf', x: 15, y: 1, solid: true, key: 'armario_remedios', name: 'Armário de remédios', info: 'Frascos sem rótulo, seringas reaproveitadas e uma caixa de estabilizadores neurais com o logo da Synapse riscado.' },
      { kind: 'forensic_kit', x: 13, y: 1, solid: true, key: 'maleta_cirurgia', name: 'Maleta cirúrgica', info: 'Instrumentos de neurocirurgia de altíssima qualidade. Ninguém compra isto com dinheiro de clínica clandestina.' },
      { kind: 'trash', x: 15, y: 10, solid: true, key: 'lixo_bio', name: 'Descarte biotecnológico' },
      // recepção e sala de espera
      { kind: 'shrine', x: 13, y: 9, solid: true, key: 'altar_rita', name: 'Altar de Santa Rita', info: 'Santa Rita de Cássia, padroeira das causas impossíveis. Velas de LED, fitas e pulseiras de pacientes que foram embora.' },
      ...[9, 10, 11].map(x => ({ kind: 'chair', x, y: 9, solid: true, key: 'cadeira_espera', name: 'Cadeira de espera', seat: true })),
      { kind: 'table', x: 10, y: 10, solid: true, key: 'mesa_espera', name: 'Mesinha', info: 'Revistas de 2070 e um pote de balas. As balas são estabilizadores de humor. Melhor não.' },
      { kind: 'plant', x: 7, y: 10, solid: true, key: 'planta_clinica', name: 'Samambaia', info: 'Uma samambaia de verdade, regada com o soro que sobra.' },
      { kind: 'puddle', x: 6, y: 2 }, { kind: 'puddle', x: 12, y: 6 },
    ],
    npcs: [{ id: 'irma7', x: 7, y: 3 }, { id: 'caio', x: 10, y: 6 }],
    walkers: [
      { look: 'enfermeiro_bot', name: 'Enfermeiro robô', lines: 'clinica_bot', x: 6, y: 6 },
      { look: 'paciente1', name: 'Paciente em recuperação', lines: 'paciente', x: 8, y: 8 },
      { look: 'paciente2', name: 'Paciente em recuperação', lines: 'paciente', x: 13, y: 7 },
      { look: 'minhoca2', name: 'Parente de paciente', lines: 'parente', x: 11, y: 8 },
    ],
  },
  ns_nucleo: {
    name: 'Núcleo de Processamento — Synapse Corp', w: 14, h: 10, floor: 'office', dark: 0.72,
    neon: '#38f6ff', wallColor: ['#0e1420', '#0a0e18'],
    wallN: '..E...hhhh...h', wallW: 'hhhhhhhhhh',
    lights: [{ x: 2.5, y: 0.6, z: 30, r: 50, color: '#38f6ff' }, { x: 6.5, y: 4.5, z: 30, r: 80, color: '#38f6ff' },
      { x: 12, y: 8.5, z: 20, r: 60, color: '#ff3355', flicker: true }, { x: 12, y: 1.5, z: 20, r: 50, color: '#b04cff' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'aerotrem', name: 'Elevador de serviço → Estação do aerotrem' },
      ...[4, 5, 6, 7, 8, 9].map(x => ({ kind: 'server_rack', x, y: 3, solid: true, key: 'rack_nucleo', name: 'Servidor central', info: 'Petabytes de consciência digital de clientes da Synapse. Todos esperando a imortalidade, todos em fila.' })),
      ...[4, 5, 7, 8, 9].map(x => ({ kind: 'server_rack', x, y: 6, solid: true, key: 'rack_nucleo', name: 'Servidor central', info: 'Petabytes de consciência digital de clientes da Synapse. Todos esperando a imortalidade, todos em fila.' })),
      { kind: 'terminal', x: 12, y: 8, solid: true, key: 'term_nucleo', name: 'Roteador de pacotes central', screen: '#ff3355' },
      { kind: 'terminal', x: 12, y: 1, solid: true, key: 'arquivo_lyra', name: 'Arquivo executivo restrito', screen: '#b04cff' },
      { kind: 'crate', x: 1, y: 6, solid: true, key: 'caixa_nucleo', name: 'Caixa de peças', info: 'Peças de reposição para servidores. Ninguém repõe nada aqui desde 2079.' },
      { kind: 'crate', x: 10, y: 5, solid: true, key: 'caixa_nucleo', name: 'Caixa de peças', info: 'Peças de reposição para servidores. Ninguém repõe nada aqui desde 2079.' },
    ],
    walkers: [{ look: 'robo_limpeza', name: 'Robô de manutenção', lines: 'robo', x: 3, y: 8 }, { look: 'robo_limpeza', name: 'Robô de manutenção', lines: 'robo', x: 11, y: 4 }],
  },
});

Object.assign(EXTRA_LINES, {
  paulista: ['Daqui de baixo a torre parece não ter fim. Dizem que lá em cima o ar tem cheiro de hortelã.', 'Entrega para o 220º andar? Pela portaria leva meia hora. Pelo drone, trinta segundos.', 'Vim só tirar foto da fonte. Água de verdade, olha só.', 'Viu a notícia? Morreu um engenheiro lá em cima. As ações subiram. Vai entender.', 'O aerotrem para ali na esquina. Pontual como a Synapse: nunca atrasa, nunca espera.'],
  morador: ['Debaixo do viaduto não chove ácido. É o melhor endereço da cidade, moço.', 'Tô aqui desde que a Synapse comprou o prédio onde eu morava. Era pra ser só um mês.', 'Tem um pouco de feijão no tambor ali. Pega, que ninguém passa fome aqui embaixo.', 'Lá em cima eles chamam a gente de "paisagem". Aqui embaixo a gente chama eles de "teto".', 'Meu carro caiu da via expressa em 2071. Fiquei com ele. Virou casa.', 'Polícia aqui só desce pra tirar barraca. Você veio tirar barraca?', 'A Dona Cida sabe de tudo que acontece no Minhocão. Pergunta pra ela.', 'Vendi meu chip de memória pra comer. Agora não lembro o que eu comi.'],
  robo: ['*BIP.* LIMPANDO. LIMPANDO. LIMPANDO.', 'UNIDADE SEM PROPRIETÁRIO. AGUARDANDO INSTRUÇÕES DESDE 2079.', '*BZZT.* CARGA: 12%. PROCURANDO TOMADA.', 'POR FAVOR, AFASTE-SE DA ÁREA DE TRABALHO.', '*BIP-BOP.* ESTE ROBÔ NÃO TEM AUTORIZAÇÃO PARA CONVERSAR.'],
  seguranca: ['Circulação restrita a pessoal autorizado.', 'Detetive Vance: acesso concedido pela diretoria. Comportamento monitorado.', 'Não toque nas obras de arte holográficas.', 'Este andar é vigiado por 340 câmeras. Sorria.'],
  pericia: ['A perícia da Synapse chegou antes da gente. Isso nunca é bom sinal.', 'Nenhuma digital, nenhum fio de cabelo. Esse laboratório é mais limpo que centro cirúrgico.', 'O corpo caiu da cadeira depois da morte, não antes. Dá pra ver pelo cabo.', 'Detetive, tudo que a gente acha aqui o jurídico da Synapse quer ver primeiro.'],
  base: ['A rede é nossa. A nuvem é deles.', 'Não toca no teclado do Zero. Sério, não toca.', 'A gente não mata ninguém, tira. A gente só derruba servidor.', 'Tô há três dias sem dormir. Mas derrubei o firewall da Synapse duas vezes.'],
  paciente: ['Você é meu filho? Não? Desculpa. Eu esqueço.', 'A Irmã-7 canta pra gente dormir. Ela canta mal, mas canta.', 'Eu era soldador. Agora não lembro como segura o maçarico.', 'O doutor Caio diz que eu vou lembrar do meu nome até o Natal.'],
  parente: ['Meu marido se ofereceu pro teste da Synapse. Mil créditos. Voltou sem lembrar do casamento.', 'Venho aqui todo dia. Um dia ele vai me reconhecer.', 'A doutora Lin é uma santa, moço. Ela cuida deles de graça.'],
  clinica_bot: ['PACIENTE, POR FAVOR, VOLTE AO LEITO.', '*BIP.* SORO: 40%. TROCA EM 22 MINUTOS.', 'BEM-VINDO À SANTA RITA. FALE BAIXO. OS PACIENTES ESTÃO SONHANDO.', 'MEDICAÇÃO DISTRIBUÍDA. DOR REDUZIDA EM 30%. SAUDADE: SEM ALTERAÇÃO.'],
  clube_seg: ['*BIP.* NOME NA LISTA: CONFIRMADO.', 'PROIBIDO DANÇAR COM IMPLANTE DE COMBATE ATIVO.', 'O CAMAROTE É SÓ PARA CONVIDADOS DO SENHOR ROSSI.'],
  synapse: ['A Synapse não comenta assuntos em andamento. Nem os encerrados.', 'Eu trabalhava com o Kaelen. Ele almoçava sozinho. Agora eu entendo por quê.', 'Dizem que a Dra. Lin não dorme há três dias. Dizem que ela nunca dormiu.', 'A diretora Lyra subiu de cargo duas vezes este ano. Ninguém sobe duas vezes sem pisar em alguém.', 'O ar aqui custa mais que o meu salário. Eu respiro devagar.'],
  minhocao: ['Polícia aqui embaixo? Só quando cai um corpo lá de cima.', 'A Synapse paga mil créditos por um voluntário. Meu primo foi. Voltou sem lembrar o nome da mãe.', 'Chip, detetive? Tenho um que faz você esquecer as dívidas. E o nome.', 'Lá em cima chove ácido. Aqui embaixo chove o ácido que escorre lá de cima.', 'O Tico conserta qualquer coisa. Já consertou até o meu casamento. Durou uma semana.'],
  bixiga: ['O café do Zé é coado em pano de verdade. O pano é de 2040, mas é de verdade.', 'O pão com mortadela molecular é a única coisa nesta cidade que tem gosto do passado.', 'Vi um mascarado de LED usando o terminal ontem. Ou foi um anúncio. Difícil saber hoje em dia.', 'Detetive no Bixiga? Alguém vai sair na holo-TV hoje.', 'O Zé guarda segredo melhor que cofre. E cobra menos.'],
  clube: ['O QUÊ? NÃO TÔ OUVINDO, DETETIVE!', 'Hoje o DJ é um drone de quatro braços. Semana passada era um polvo cibernético.', 'Lavagem de dinheiro? Aqui? Que absurdo. Aceita cripto?', 'O Corretor tá no camarote. Ele sempre tá no camarote.', 'Se você não tem implante de audição, sai daqui com zumbido até 2090.', 'Os drones do DJ dançam melhor que todo mundo aqui. Inclusive eu.'],
});

// ------------------------------------------------------------
// Personagens e diálogos
// ------------------------------------------------------------
Object.assign(NPCS, {
  cida: {
    name: 'Dona Cida', role: 'Moradora do Minhocão', look: 'cida',
    scan: { text: 'Nenhum implante. Pulmões cansados de fumaça de pneu. Uma pulseira de paciente antiga no pulso: "DOADORA 0102 — SYNAPSE".' },
    intro: 'Boa noite, moço. Cida. Moro aqui embaixo faz quinze anos, desde que a via expressa virou teto. Senta perto do fogo, que a noite é comprida.',
    again: ['Fala, moço.', 'Esquenta a mão aí no fogo.', 'O que foi agora?'],
    topics: [
      { id: 'ci_minhocao', label: 'Como é viver debaixo do viaduto?', lines: [
        ['N', 'Lá em cima passa carro voador o dia inteiro. Aqui embaixo passa gente. A gente se ajuda: quem tem feijão divide, quem tem lona empresta.'],
        ['N', 'A polícia desce de vez em quando pra tirar barraca. A gente monta de novo no dia seguinte.'],
      ] },
      { id: 'ci_synapse', label: 'Essa pulseira no seu pulso...', lines: [
        ['N', '*Ela esconde o pulso na manga.* Fui voluntária. Mil créditos, há dez anos. Primeira leva de chip.'],
        ['N', 'Eu tive sorte: só esqueci uns anos. Tem gente que esqueceu tudo. Esses vão pra clínica lá do Lado Sombra.'],
        ['I', 'A Synapse testa os chips aqui embaixo e cuida das sobras lá do outro lado da cidade.'],
      ] },
      { id: 'ci_tico', label: 'Você conhece o Tico?', lines: [
        ['N', 'O Tico? Menino bom. Conserta o rádio de todo mundo de graça. Ultimamente anda com crédito novo no bolso.'],
        ['N', 'Crédito novo aqui embaixo, moço, sempre vem de lá de cima.'],
      ] },
    ],
    present: {},
    presentDefault: ['Isso aí eu não conheço, moço.', 'Aqui embaixo a gente não vê essas coisas.', 'Pergunta pro Tico, ele entende de máquina.'],
  },
  caio: {
    name: 'Dr. Caio Mendes', role: 'Médico renegado da Santa Rita', look: 'caio',
    scan: { text: 'Licença médica cassada em 2079, segundo o registro público. Óculos de diagnóstico de modelo militar. Mãos firmes, olhos de quem não dorme.' },
    intro: 'Doutor Caio. Ou só Caio, desde que o conselho me cassou. Aqui ninguém pergunta pela licença: perguntam se a dor vai passar. Em que posso ajudar, detetive?',
    again: ['Detetive.', 'Seja rápido, tenho um paciente em crise.', 'Mais perguntas?'],
    topics: [
      { id: 'ca_clinica', label: 'O que é a Santa Rita?', lines: [
        ['N', 'Uma clínica de reabilitação neural para quem a cidade jogou fora. Gente que vendeu a cabeça para teste de chip e voltou vazia.'],
        ['N', 'A gente tenta religar as memórias. Às vezes volta o nome. Às vezes volta o rosto de um filho. Às vezes não volta nada.'],
      ] },
      { id: 'ca_maya', label: 'A Dra. Lin trabalha aqui?', lines: [
        ['N', 'Ela financia metade da clínica. Traz equipamento que nenhum de nós conseguiria comprar.'],
        ['N', 'Ela diz que é para consertar o que a Synapse quebrou. Eu acho que é culpa. As duas coisas podem ser verdade.'],
        ['N', 'Ontem ela passou a noite na estação de compilação. Nem tirou o jaleco.'],
      ] },
      { id: 'ca_cassado', label: 'Por que cassaram sua licença?', lines: [
        ['N', 'Eu atendi um doador da Synapse sem autorização da empresa. O chip dele era propriedade intelectual. A cabeça dele, pelo jeito, também.'],
        ['I', 'Em Neo-Sampa, até a memória tem dono.'],
      ] },
    ],
    present: {
      e_codigo_letal: [['N', '*Ele empalidece.* Isso não é reabilitação. Isso é o contrário. Quem escreveu isso sabe onde fica cada neurônio para desligar.']],
      e_maya_saida: [['N', 'Ela chegou aqui às 22:41, sim. E não dormiu. Eu passei pela estação de compilação três vezes: ela não tirou os olhos da tela.']],
    },
    presentDefault: ['Isso é assunto de polícia, não de médico.', 'Não reconheço.', 'Pergunte à Irmã-7. Ela registra tudo.'],
  },
  lyra: {
    name: 'Lyra Vance', role: 'Diretora executiva da Synapse Corp', look: 'lyra',
    scan: { text: 'Implantes oculares simétricos de alta patente. As fibras ópticas do terno estão vermelhas: estresse alto. Batimentos acelerados toda vez que alguém diz "registros".' },
    intro: 'Detetive... Vance? Que coincidência irônica. Lyra Vance. Nenhum parentesco, espero. Kaelen era meu irmão. Pergunte o que precisar, e depois saia da minha torre.',
    again: ['Seja breve, detetive. A diretoria está me esperando.', 'De novo? O meu tempo é cobrado por segundo.', 'Ainda aqui, xará?'],
    topics: [
      { id: 'ly_kaelen', label: 'Fale do seu irmão.', lines: [
        ['N', 'Kaelen era o melhor engenheiro de segurança neural desta torre. E o mais ingênuo.'],
        ['N', 'Ele achava que segurança era proteger pessoas. Na Synapse, segurança é proteger patentes.'],
        ['I', 'O terno dela mudou de vermelho para cinza quando falou "ingênuo". Fibras ópticas não mentem tão bem quanto ela.'],
      ] },
      { id: 'ly_nome', label: 'Vance. Mesmo sobrenome que o meu.', lines: [
        ['N', 'Metade de Neo-Sampa se chama Vance, Silva ou Synapse. Não se ache especial.'],
        ['V', 'Eu não me acho. Só não gosto de coincidências.'],
        ['N', 'Então vai odiar esta cidade.'],
      ] },
      { id: 'ly_chips', label: 'Kaelen ia denunciar alguma coisa?', lines: [
        ['N', '*Uma pausa longa demais.* Kaelen tinha teorias. Sobre testes de chips em voluntários no Baixo Minhocão.'],
        ['N', 'Voluntários pagos, detetive. Contratos assinados. Tudo legal.'],
        ['V', 'Então por que a pausa?'],
        ['N', 'Porque "legal" e "certo" moram em andares diferentes desta torre.'],
        ['I', 'O Baixo Minhocão. Os voluntários. Vale descer até lá.'],
        { tram: 'ns_minhocao' },
      ] },
      { id: 'ly_registros', label: 'Seus registros de acesso foram apagados.', requires: ['e_lyra_log'], lines: [
        ['N', 'Uma falha de sistema. A TI já está investigando.'],
        ['V', 'Apagados às 22:31. A hora exata da morte do seu irmão.'],
        ['N', 'Então a TI vai investigar com mais pressa.'],
        ['I', 'Ela não piscou. Implantes oculares de alta patente: dá para desligar o piscar. Dá para desligar muita coisa.'],
      ] },
      { id: 'ly_contrato', label: '⚠ Confrontar: você contratou os Desconectados', requires: ['d_contrato'], lines: [
        ['N', '*As fibras do terno ficam pretas.* Isso é um absurdo.'],
        ['V', 'L.V. Holdings. Pagamento ao Corretor, Dante Rossi. Executores: os Desconectados. Objetivo: extrair os dados do chip do seu irmão.'],
        ['N', '...'],
        ['N', 'Eu queria os dados, detetive. Os arquivos que ele ia vazar. Eu ia comprar o silêncio dele com o próprio silêncio dele.'],
        ['N', 'Um vírus de extração não mata ninguém. Eu verifiquei. Eu paguei para verificarem.'],
        ['I', 'Ela queria roubar o irmão, não matá-lo. Mas alguém transformou o roubo em execução.'],
        { give: 'e_lyra_conf' },
      ] },
    ],
    present: {
      e_kaelen: [['N', 'Não me mostre isso. *O terno fica cinza.* Eu já vi. Eu fui a primeira a ver.']],
      e_manifesto: [['N', 'Os Desconectados. Terroristas de porão. A polícia devia estar caçando eles, não me interrogando.']],
      e_rig7: [['N', 'Um robô de limpeza? A segurança desta torre é uma piada que custa bilhões.']],
      e_dante_venda: [['N', 'Eu não conheço nenhum Dante. Eu não frequento lugares onde se conhece Dantes.'], ['I', 'Mentira. O terno dela piscou amarelo por meio segundo.']],
      e_maya_saida: [['N', 'A Dra. Lin trabalha demais. Um dia isso ia acabar mal. Para alguém.']],
      e_ordem_descarte: [['N', '*O terno apaga por completo.* Isso é... um protocolo padrão de contingência. Todo executivo tem um.'], ['V', 'Um protocolo para "silenciar fornecedores". Assinado por você.']],
    },
    presentDefault: ['Isso não me diz respeito.', 'Fale com o jurídico.', 'Interessante. Irrelevante, mas interessante.'],
  },
  maya: {
    name: 'Dra. Maya Lin', role: 'Neurocirurgiã-chefe da Synapse', look: 'maya',
    scan: { text: 'Óculos de realidade aumentada ligados direto ao nervo óptico. ID do dispositivo: MLIN-AR. Sinais vitais de quem não dorme há 72 horas. Pupilas dilatadas: estimulantes.' },
    intro: 'Dra. Maya Lin. Eu fui a mentora do Kaelen por dez anos. Se veio perguntar se eu estou bem, a resposta é não. Se veio perguntar outra coisa, seja rápido.',
    again: ['Detetive.', 'Eu tenho cirurgias, detetive. Muitas.', 'Mais perguntas? Faça as certas.'],
    topics: [
      { id: 'ma_kaelen', label: 'Como era o Kaelen?', lines: [
        ['N', 'Brilhante. Teimoso. Achava que podia consertar o mundo com código.'],
        ['N', 'Eu também achava isso, aos 34 anos. Depois a gente aprende que o mundo não tem código-fonte.'],
      ] },
      { id: 'ma_projeto', label: 'O que é o projeto de imortalidade digital?', lines: [
        ['N', 'Lázaro. Transferir a consciência humana para os servidores da torre antes da morte orgânica. Vida eterna, por assinatura mensal.'],
        ['N', 'É o trabalho da minha vida, detetive. Trinta anos.'],
        ['V', 'E o Kaelen?'],
        ['N', '*Os óculos piscam.* Kaelen achava que o Lázaro era... antiético. Ele tinha opiniões fortes.'],
      ] },
      { id: 'ma_saida', label: 'Onde você estava às 22:30?', lines: [
        ['N', 'Saí do andar restrito às 22:20. Fui descansar. Três dias sem dormir, detetive. Até eu tenho limites.'],
        ['V', 'Dez minutos antes da morte.'],
        ['N', 'Dez minutos antes de uma tragédia. Você quer que eu peça desculpas por ter sono?'],
        ['I', 'Os óculos dela registram tudo o que ela vê. Mas ela não ofereceu mostrar.'],
        { give: 'e_maya_saida' },
      ] },
      { id: 'ma_dormir', label: 'Descansar onde?', requires: ['d_fisico'], requiresSeen: ['ma_saida'], lines: [
        ['N', 'Na Clínica Santa Rita, no Lado Sombra. Faço plantões voluntários lá. Reabilitação neural para quem não pode pagar.'],
        ['N', 'Eu durmo numa maca entre um paciente e outro. É o único lugar desta cidade onde eu consigo dormir.'],
        ['I', 'Uma neurocirurgiã-chefe dormindo numa clínica clandestina. Vale uma visita.'],
        { tram: 'ns_clinica' },
      ] },
      { id: 'ma_traicao', label: '⚠ Confrontar: você interceptou o vírus', requires: ['d_traicao'], lines: [
        ['N', '...'],
        ['N', 'Lyra ia matar todos eles. O Zero, o Corretor, os hackers. Ia apagar a trilha inteira depois do roubo. Estava no protocolo dela.'],
        ['N', 'E o Kaelen ia destruir o Lázaro. Trinta anos, detetive. Trinta anos.'],
        ['V', 'Então você matou dois coelhos com um vírus.'],
        ['N', 'Eu salvei a única coisa que importava. *Os óculos se apagam.* Faça a sua acusação, detetive. Eu não vou correr.'],
      ] },
    ],
    present: {
      e_kaelen: [['N', 'Morte cerebral total. A consciência foi... arrancada. Não deletada. Arrancada. Como quem arranca uma raiz.'], ['I', 'Ela falou como médica. Mas a voz tremeu na palavra "raiz".']],
      e_porta_neural: [['N', 'Um conector físico? *Ela demora a responder.* Isso é... muito específico, detetive.']],
      e_codigo_zero: [['N', 'Código amador. Comentários em tupi. Isso não mataria nem um rato de laboratório.'], ['I', 'Como ela sabe o que mataria um rato?']],
      e_codigo_letal: [['N', '*Os óculos piscam três vezes.* Onde você conseguiu isso?']],
      e_lyra_log: [['N', 'A Lyra apaga registros como quem apaga a luz. É um hábito dela.']],
      e_rig7: [['N', 'O RIG-7 limpa o meu laboratório há quatro anos. Eu não sabia nem que ele tinha firmware.']],
    },
    presentDefault: ['Não tenho tempo para isso.', 'Isso é neurocirurgia ou fofoca, detetive?', 'Não sei. Não vi. Não dormi.'],
  },
  rig7: {
    name: 'RIG-7', role: 'Unidade de manutenção autônoma', look: 'rig7',
    scan: { give: 'e_rig7', text: 'Firmware não oficial. Solda artesanal no painel traseiro, padrão das oficinas do Baixo Minhocão. Log de carga: "PACOTE 0,2 KG — ENTREGUE NA INTERFACE DA CADEIRA 01 — 22:14". O RIG-7 não carrega pacotes. Ele limpa.' },
    intro: '*BIP.* UNIDADE RIG-7. MANUTENÇÃO AUTÔNOMA. ÁREA: LABORATÓRIO CINÉTICO. *BIP.* POR FAVOR, NÃO PISE NO CHÃO MOLHADO.',
    again: ['*BIP.* AGUARDANDO TAREFA.', '*BIP-BIP.* CHÃO LIMPO. CHÃO LIMPO.', 'UNIDADE RIG-7 EM ESPERA.'],
    topics: [
      { id: 'rg_tarefas', label: 'Listar tarefas desta noite.', lines: [
        ['N', 'TAREFA 1: LIMPEZA DO PISO — 21:00. CONCLUÍDA.'],
        ['N', 'TAREFA 2: [DADOS CORROMPIDOS] — 22:14. CONCLUÍDA.'],
        ['N', 'TAREFA 3: LIMPEZA DO PISO — 23:00. CANCELADA. MOTIVO: CORPO NO CAMINHO.'],
        ['I', 'A tarefa das 22:14 foi apagada. Mas o scanner pode ler o que sobrou.'],
      ] },
      { id: 'rg_dono', label: 'Quem modificou você?', lines: [
        ['N', '*BIP.* FIRMWARE ORIGINAL: SYNAPSE CORP. FIRMWARE ATUAL: [DESCONHECIDO].'],
        ['N', 'ÚLTIMA MANUTENÇÃO EXTERNA: OFICINA "TICO CONSERTOS", SUBNÍVEL 4.'],
        { tram: 'ns_minhocao' },
      ] },
    ],
    present: {
      e_porta_neural: [['N', '*BIP.* PACOTE ENTREGUE CONFORME INSTRUÇÃO. *BIP.* INSTRUÇÃO APAGADA APÓS ENTREGA.']],
      e_kaelen: [['N', 'USUÁRIO KAELEN VOSS. STATUS: [ERRO]. STATUS: [ERRO]. *BIP.*']],
    },
    presentDefault: ['*BIP.* OBJETO NÃO RECONHECIDO.', 'FAVOR DEPOSITAR NO DESCARTE CORRETO.', '*BIP-BOP.* SEM CORRELAÇÃO.'],
  },
  agora: {
    name: 'ÁGORA', role: 'Assistente holográfica da Synapse', look: 'agora',
    scan: { text: 'Projeção holográfica de assistência. Núcleo de IA corporativo, versão 9.1. Permissões de leitura amplas, permissões de fala cuidadosamente limitadas pelo jurídico.' },
    intro: 'Bem-vindo à Synapse Corp, detetive Vance. Eu sou ÁGORA. A diretoria autorizou a sua investigação dentro dos limites contratuais. Estou aqui para ajudar dentro desses mesmos limites.',
    again: ['ÁGORA à disposição, detetive.', 'Em que posso auxiliar, dentro dos limites contratuais?', 'Processando. Pergunte.'],
    topics: [
      { id: 'ag_dica', label: 'Alguma sugestão?', repeat: true, lines: () => [['N', ecoHint()]] },
      { id: 'ag_lab', label: 'O que aconteceu no laboratório?', lines: [
        ['N', 'Às 22:31, os sensores registraram morte cerebral do engenheiro Kaelen Voss na cadeira de interface 01.'],
        ['N', 'O laboratório é blindado contra sinais externos. Nenhum pacote de dados entrou ou saiu entre 22:00 e 23:00.'],
        ['N', 'Do ponto de vista da rede, detetive, ninguém o matou.'],
      ] },
      { id: 'ag_aerotrem', label: 'Como eu chego aos outros distritos?', lines: [
        ['N', 'O elevador expresso leva à estação do aerotrem. De lá, a linha alcança todos os distritos de Neo-Sampa, inclusive o seu Setor 4.'],
        ['N', 'O aerotrem só para nos distritos que estão no seu roteiro de investigação. Conversas abrem rotas.'],
      ] },
    ],
    present: {
      e_lyra_log: [['N', 'Confirmo a exclusão. Executada com credencial de diretoria. Eu não tenho permissão para dizer de qual diretor.'], ['I', 'Ela não pode dizer. Mas também não negou.']],
      e_porta_quantica: [['N', 'A trava quântica é de nível militar. Abri-la de fora exigiria uma ordem judicial e três meses.']],
      e_manifesto: [['N', 'O arquivo apareceu no monitor às 22:31. Ele não veio da rede. Ele estava aqui dentro.']],
    },
    presentDefault: ['Sem correlação na minha base, detetive.', 'Isso está fora dos meus limites contratuais.', 'Registrado. Inconclusivo.'],
  },
  tico: {
    name: 'Tico', role: 'Mecânico do Baixo Minhocão', look: 'tico',
    scan: { text: 'Braço mecânico de solda soldado por ele mesmo. Os óculos são de solda, não de AR. No bolso, créditos novos demais para o Minhocão.' },
    intro: 'Opa, detetive! Tico Consertos, a seu dispor. Robô, androide, drone, coração partido. Se tem parafuso, eu conserto. Se não tem, eu ponho um.',
    again: ['Fala, doutor!', 'Quebrou alguma coisa? Eu conserto.', 'Tô na correria, mas pra polícia eu paro. Um minuto.'],
    topics: [
      { id: 'ti_oficina', label: 'Como vão os negócios?', lines: [
        ['N', 'Lá embaixo o negócio é sempre bom. Tudo quebra, ninguém tem dinheiro pra comprar novo. Eu sou o rei da segunda chance.'],
      ] },
      { id: 'ti_rig', label: 'Você mexeu num robô de limpeza da Synapse?', requires: ['e_rig7'], lines: [
        ['N', '*Ele para de soldar.* Robô de limpeza? Eu mexo em muito robô, doutor.'],
        ['V', 'RIG-7. Solda artesanal no painel traseiro. Igual a essa no seu braço.'],
        ['N', '...Tá bom, tá bom. Chegou aqui faz uma semana. Um cara pagou pra eu reescrever o firmware. Só uma rotina nova: "carregar pacote pequeno até a cadeira 01".'],
        ['N', 'Eu achei que era contrabando de chip. Aqui embaixo, tudo é contrabando de chip.'],
        ['V', 'Quem pagou?'],
        ['N', 'Um sujeito de chapéu holográfico, dente de cromo. Todo mundo chama de Corretor. Ele bate ponto no Clube 14 Bis.'],
        ['N', 'E o código da rotina veio pronto, doutor. Num pente de memória. Eu só instalei.'],
        { give: 'e_oficina' },
        { tram: 'ns_zetubo' },
      ] },
      { id: 'ti_cobaias', label: 'O que você sabe dos testes de chips?', lines: [
        ['N', 'A Synapse manda recrutador aqui toda semana. Mil créditos por voluntário. O povo vai.'],
        ['N', 'Uns voltam bem. Uns voltam esquecendo coisas. Uns não voltam. Esses vão pra uma clínica no Lado Sombra, dizem.'],
      ] },
    ],
    present: {
      e_porta_neural: [['N', 'Conector Kessler de pente de memória. Coisa velha, mas confiável. É o que eu instalei no braço de carga do robô.']],
      e_dante_venda: [['N', 'Eu falei que o Corretor sabe tudo. Ele sabe tudo e vende tudo.']],
    },
    presentDefault: ['Isso aí eu não conserto, doutor.', 'Não reconheço.', 'Tem parafuso? Não? Então não é comigo.'],
  },
  ze: {
    name: 'Zé do Tubo', role: 'Dono do bar no Bixiga', look: 'ze',
    scan: { text: 'Nenhum implante. Nenhum. Um homem de 70 anos sem um chip sequer, em 2085. Batimentos tranquilos de quem já viu de tudo.' },
    intro: 'Boa noite, moço. Senta aí. Café coado no pano ou pão com mortadela molecular? Polícia paga igual a todo mundo, viu?',
    again: ['Mais um café?', 'Tô aqui, moço. Desde 2031 tô aqui.', 'Fala, detetive.'],
    topics: [
      { id: 'ze_bar', label: 'Há quanto tempo você tem este bar?', lines: [
        ['N', 'Cinquenta e quatro anos. Meu pai abriu, eu continuei. O prédio caiu duas vezes, o bar não.'],
        ['N', 'Aqui não tem chip, não tem holograma, não tem assinatura mensal. Tem café e conversa.'],
      ] },
      { id: 'ze_terminal', label: 'Quem usa aquele terminal público?', lines: [
        ['N', 'Todo mundo e ninguém. É terminal público, moço. Sem login, sem câmera. Por isso que vem tanta gente.'],
        ['N', 'Ontem veio um rapaz de máscara de LED. Usou umas duas horas. Pediu três cafés e pagou com moeda de papel. Moeda de papel! Fazia anos.'],
      ] },
      { id: 'ze_porao', label: 'Onde eu encontro o mascarado de LED?', requires: ['e_terminal_bixiga'], lines: [
        ['N', '*Ele seca um copo devagar.* O moço vai me prometer que não vai entrar atirando.'],
        ['V', 'Prometo.'],
        ['N', 'O porão do bar. O Zero e os meninos dele moram lá embaixo faz anos. Eles não fazem mal a ninguém, só à Synapse.'],
        ['N', 'Pode descer pelo alçapão. Fala que o Zé deixou.'],
        { flag: 'ze_porao' },
      ] },
      { id: 'ze_cafe', label: 'Um café, Zé.', repeat: true, lines: [
        ['N', '*Ele coa o café no pano, devagar, como se fosse 2030.* Aqui, moço. Por conta da casa.'],
        { relax: 6 },
        ['I', 'Tem gosto de uma cidade que não existe mais.'],
      ] },
    ],
    present: {
      e_manifesto: [['N', 'Esse texto aí passou na tela do terminal ontem, moço. O mascarado ficou olhando pra ele um tempão.']],
      e_codigo_zero: [['N', 'Isso aí é coisa dos meninos. Eles comentam o código em tupi. Dizem que é pra lembrar de onde a gente veio.']],
    },
    presentDefault: ['Isso aí eu não entendo, moço. Eu só entendo de café.', 'Não sei, não.', 'Pergunta pro pessoal da tecnologia.'],
  },
  dante: {
    name: 'Dante "O Corretor" Rossi', role: 'Informante do submundo', look: 'dante',
    scan: { text: 'Dentes de cromo com microcâmeras embutidas. O chapéu projeta chuva digital e também um bloqueador de escuta. Três chips de dados no bolso interno, com a assinatura de Kaelen Voss.' },
    intro: '*Os dentes de cromo brilham.* Detetive Gabriel Vance. O homem que não se vende. Uma raridade, como um bom vinho de 2040. Sente-se. Mas aqui, informação tem preço.',
    again: ['Voltou para fazer negócio?', 'Detetive. O meu sorriso custa caro. As minhas respostas, mais ainda.', 'Sente-se. Os drones não ouvem nada aqui.'],
    topics: [
      { id: 'da_preco', label: 'O que você sabe sobre Kaelen Voss?', lines: [
        ['N', 'Sei muita coisa. Mas eu não falo de graça, detetive. Me traga algo que valha a minha voz.'],
        ['I', 'Ele quer munição. Algo que o comprometa, para ele saber que já está na mira.'],
      ] },
      { id: 'da_venda', label: 'O Tico disse que você pagou o firmware do RIG-7.', requires: ['e_oficina'], lines: [
        ['N', '*O sorriso de cromo some.* O Tico fala demais para um homem que gosta de ter dedos.'],
        ['N', 'Tudo bem. Você trouxe o preço. Eu sou intermediário, detetive. Eu ligo quem paga a quem faz.'],
        ['N', 'Quem pagou: uma conta chamada L.V. Holdings. Muito dinheiro, muito limpo, muito de cima.'],
        ['N', 'Quem fez: os Desconectados. O Zero escreveu um vírus de extração. Só extração: copiar os dados do chip do Kaelen e sair.'],
        ['N', 'O robô levaria o pente até a cadeira, o Kaelen plugaria achando que era um teste de rotina. Simples.'],
        ['V', 'E os chips que você vendeu aqui, na véspera?'],
        ['N', 'Ah. Uma amostra. Para provar ao cliente que o Kaelen tinha o que valia a pena roubar. Negócios.'],
        { give: 'e_dante_venda' },
      ] },
      { id: 'da_lv', label: 'Quem é a L.V. Holdings?', requires: ['e_dante_venda'], lines: [
        ['N', 'Eu nunca pergunto quem está atrás de uma conta. Isso estraga a amizade.'],
        ['N', 'Mas se eu fosse um detetive, eu olharia para as iniciais. E para quem ganharia uma promoção com os segredos de uma divisão concorrente.'],
      ] },
      { id: 'da_medo', label: 'Você parece nervoso, Dante.', requires: ['e_dante_venda'], lines: [
        ['N', 'Nervoso? Eu? *Ele ajeita o chapéu.* Um engenheiro morreu com um vírus que só devia copiar arquivos, detetive.'],
        ['N', 'Alguém mudou o código no meio do caminho. E quem muda código no meio do caminho também muda o destino de quem sabe demais.'],
        ['I', 'Ele não está com medo da polícia. Está com medo de quem mandou.'],
      ] },
    ],
    present: {
      e_kaelen: [['N', 'Uma pena. O Kaelen era um ótimo cliente. Nunca comprou nada, mas era ótimo de vender.']],
      e_manifesto: [['N', 'O manifesto? Teatro. Os Desconectados assinam tudo que cai. Eles adoram crédito por coisa que não fizeram.']],
      e_ordem_descarte: [['N', '*Ele empalidece sob o cromo.* "Silenciar fornecedores." Eu sou um fornecedor, detetive.'], ['N', 'Obrigado. Eu vou sair da cidade esta noite.']],
    },
    presentDefault: ['Isso não vale nada no meu mercado.', 'Bonito. Barato.', 'Traga algo melhor, detetive.'],
  },
  zero: {
    name: '"Zero" — Marcus Thorne', role: 'Líder dos Desconectados', look: 'zero',
    scan: { text: 'A máscara de LED transmite pixels aleatórios, e também bloqueia reconhecimento facial. Braços industriais pesados, modelo de doca. Nenhum vestígio biológico de Kaelen Voss.' },
    intro: '*A máscara de LED mostra um ponto de interrogação.* Um policial no porão do Zé. O velho amoleceu. O que você quer, Vance? Se veio prender alguém, prende o sistema.',
    again: ['*A máscara mostra um ponto.* Fala.', 'Ainda aqui, tira?', '*A máscara mostra estática.* Pergunta logo.'],
    topics: [
      { id: 'ze_grupo', label: 'Quem são os Desconectados?', lines: [
        ['N', 'Gente que tirou o chip da cabeça para lembrar quem era. A Synapse vende imortalidade. A gente vende mortalidade. É mais honesto.'],
      ] },
      { id: 'zr_reivindica', label: 'Vocês assumiram a morte de Kaelen Voss.', lines: [
        ['N', 'A gente assume tudo que derruba a Synapse. É propaganda, tira. Um dia vocês aprendem.'],
        ['V', 'E se o assassinato não foi de vocês?'],
        ['N', '*A máscara mostra um sorriso.* Então alguém fez o trabalho e a gente ficou com a fama. Barato.'],
      ] },
      { id: 'zr_codigo', label: '⚠ Mostrar: a reivindicação foi postada depois da morte', requires: ['d_reivindicacao'], lines: [
        ['N', '*A máscara congela.*'],
        ['V', 'Vocês postaram o manifesto 34 minutos depois. Vocês não sabiam que ele ia morrer. Vocês descobriram pelo noticiário, como todo mundo.'],
        ['N', '...'],
        ['N', 'Tá. Tá bom. A gente foi contratado. Pelo Corretor. Um vírus de extração: copiar o chip do Kaelen e sumir. Só isso.'],
        ['N', 'Eu escrevi o código. Eu sei o que eu escrevo, tira. Não tinha sobrecarga. Não tinha nada que fizesse mal a uma mosca.'],
        ['N', 'Aqui. O código original. Lê os comentários, estão em tupi. A gente assina assim.'],
        { give: 'e_codigo_zero' },
        ['N', 'Alguém pegou o meu vírus no meio do caminho e transformou numa bala. E agora a bala tem o meu nome.'],
      ] },
      { id: 'zr_canal', label: 'Como o vírus chegou até a oficina do Tico?', requires: ['e_codigo_zero'], lines: [
        ['N', 'Mandei pela rede interna da Synapse. Um canal de manutenção que a gente usa faz anos, roteado pelo Núcleo de Processamento.'],
        ['N', 'Se alguém interceptou, foi lá. Mas o Núcleo fica no coração da torre. Ninguém entra lá sem crachá de diretoria.'],
        ['I', 'O Núcleo de Processamento. É lá que o pacote mudou de mãos.'],
      ] },
    ],
    present: {
      e_codigo_letal: [['N', '*A máscara mostra uma caveira.* Isso não é meu. Isso é código de médico. Olha a precisão. Isso aqui sabe exatamente onde fica cada neurônio.']],
      e_kaelen: [['N', 'O Kaelen era um dos poucos lá de cima que olhava para baixo. Que ironia, né?']],
      e_dante_venda: [['N', 'O Corretor abriu a boca. Claro que abriu. Ele vende até a própria mãe, se o preço for bom.']],
    },
    presentDefault: ['*Estática na máscara.* Não me interessa.', 'Isso é problema do sistema, não meu.', '*A máscara mostra um X.*'],
  },
  irma7: {
    name: 'Irmã-7', role: 'Enfermeira androide da Santa Rita', look: 'irma7',
    scan: { text: 'Androide de cuidados de modelo religioso, recondicionado. Memória de curto prazo intacta. Registro de presença da Dra. Lin na clínica: 22:41.' },
    intro: 'Paz e bem, detetive. Sou a Irmã-7. Aqui na Santa Rita a gente cuida de quem a cidade jogou fora. Fale baixo: os pacientes estão sonhando.',
    again: ['Paz e bem.', 'Em que posso ajudar, detetive?', 'Fale baixo, por favor.'],
    topics: [
      { id: 'ir_clinica', label: 'Quem são os pacientes?', lines: [
        ['N', 'Voluntários do Minhocão. Gente que vendeu a cabeça para a Synapse por mil créditos e voltou sem memória.'],
        ['N', 'A doutora Lin traz para cá. Ela diz que é para consertar o que a empresa estragou.'],
      ] },
      { id: 'ir_maya', label: 'A Dra. Lin esteve aqui ontem?', lines: [
        ['N', 'Chegou às 22:41. Não dormiu. Ficou a noite toda na estação de compilação.'],
        ['N', 'Ela disse que precisava terminar um código antes do amanhecer.'],
        ['I', '22:41. Ela saiu da torre às 22:20... e o Kaelen morreu às 22:31. Mas o código ela "terminou" depois?'],
      ] },
    ],
    present: {
      e_codigo_letal: [['N', '*Os olhos verdes piscam.* Esse arquivo estava na lixeira biológica. A doutora sempre esvazia antes de sair. Ontem ela esqueceu.']],
      e_maya_saida: [['N', 'Ela disse ao senhor que veio dormir? A doutora não dorme aqui faz meses.']],
    },
    presentDefault: ['Não sei responder, detetive.', 'Isso foge aos meus protocolos de cuidado.', 'Paz e bem. Não reconheço.'],
  },
});

// dica dinâmica da ÁGORA, conforme o progresso
function ecoHint() {
  if (game.act === 1) {
    if (!has('e_kaelen') || !has('e_manifesto')) return 'Sugestão: examine o laboratório cinético. O corpo, o monitor principal e o painel da porta quântica.';
    if (!has('e_porta_neural')) return 'Nenhum sinal entrou pela rede. Talvez algo tenha entrado por outro caminho. O scanner na nuca de Kaelen pode revelar.';
    if (!has('e_porta_quantica')) return 'O painel da porta quântica registra cada abertura. Vale ler o log.';
    return 'Você tem o log da porta e o vestígio na porta neural. Conecte-os em Pistas.';
  }
  if (game.act === 2) {
    if (!has('e_oficina')) return 'O RIG-7 foi modificado fora da torre. Escaneie a unidade e procure a oficina no Baixo Minhocão.';
    if (!has('e_dante_venda')) return 'O mecânico citou um corretor do Clube 14 Bis. Leve a ele o que o compromete.';
    if (!has('e_terminal_bixiga')) return 'O manifesto foi publicado de um terminal público no Bixiga, no Bar do Zé do Tubo.';
    if (!has('d_reivindicacao')) return 'Compare a hora do manifesto com a hora da publicação em Pistas.';
    if (!has('e_codigo_zero')) return 'Os Desconectados se escondem perto do terminal. O dono do bar sabe onde.';
    return 'Compare o código original dos Desconectados com o que aconteceu com Kaelen.';
  }
  if (!has('e_log_nucleo')) return 'O Núcleo de Processamento está sendo apagado. Chegue ao roteador central antes do wipe.';
  if (!has('e_codigo_letal')) return 'A Dra. Lin passou a noite na Clínica Santa Rita. Escaneie o que ela deixou para trás.';
  if (!has('d_traicao')) return 'Cruze o log do roteador com o código letal da clínica.';
  if (!has('d_contrato')) return 'Quem pagou pela extração? O Corretor e os registros apagados de Lyra contam a mesma história.';
  return 'Seu dossiê parece completo, detetive. Faça a acusação em Pistas. Lembre-se: pode haver mais de um culpado.';
}

// ------------------------------------------------------------
// Evidências, deduções, atos e finais (entram nas tabelas globais em cases.js)
// ------------------------------------------------------------
const ECO = {
  EVIDENCE: {
    e_kaelen: { name: 'Corpo de Kaelen Voss', short: 'Kaelen', kind: 'física',
      desc: 'Morte cerebral irreversível às 22:31. A consciência digital foi apagada por inteiro. A porta neural da nuca queimou de dentro para fora: uma sobrecarga, não uma extração.' },
    e_manifesto: { name: 'Manifesto dos Desconectados', short: 'Manifesto', kind: 'digital',
      desc: 'Arquivo corrompido em loop no monitor principal, assinado pelos Desconectados. Surgiu às 22:31, no mesmo segundo da morte, sem ter vindo de nenhuma rede.' },
    e_porta_quantica: { name: 'Log da porta quântica', short: 'Porta Q.', kind: 'digital',
      desc: 'Laboratório trancado às 21:55 por dentro. Uma única abertura: 22:12, credencial de manutenção do RIG-7. Nenhum sinal externo entre 22:00 e 23:00.' },
    e_porta_neural: { name: 'Vestígio na porta neural', short: 'Porta neural', kind: 'física',
      desc: 'Micro-arranhões de um conector Kessler na interface da cadeira 01. Um pente de memória físico foi plugado direto na nuca de Kaelen e depois removido.' },
    e_rig7: { name: 'Firmware do RIG-7', short: 'RIG-7', kind: 'digital',
      desc: 'Firmware não oficial, com solda artesanal do Baixo Minhocão. Log: "pacote 0,2 kg entregue na interface da cadeira 01 — 22:14". Um robô de limpeza não carrega pacotes.' },
    e_maya_saida: { name: 'Depoimento da Dra. Lin', short: 'Dra. Lin', kind: 'depoimento',
      desc: 'Maya Lin admite ter saído do andar restrito às 22:20, onze minutos antes da morte, "para descansar".' },
    e_lyra_log: { name: 'Registros de Lyra apagados', short: 'Logs Lyra', kind: 'digital',
      desc: 'Os registros de acesso de Lyra Vance à rede interna foram excluídos às 22:31, com credencial de diretoria. A hora exata da morte.' },
    e_oficina: { name: 'Depoimento do Tico', short: 'Oficina', kind: 'depoimento',
      desc: 'O mecânico Tico reprogramou o RIG-7 há uma semana, a pedido do "Corretor". A rotina nova veio pronta num pente: levar um pacote pequeno até a cadeira 01.' },
    e_dante_venda: { name: 'Confissão do Corretor', short: 'Corretor', kind: 'depoimento',
      desc: 'Dante Rossi intermediou o roubo: pagamento da conta L.V. Holdings, execução pelos Desconectados. O vírus era de extração, não de morte. Vendeu uma amostra dos dados de Kaelen na véspera.' },
    e_terminal_bixiga: { name: 'Terminal público do Bixiga', short: 'Terminal', kind: 'digital',
      desc: 'O manifesto foi publicado deste terminal às 23:05, trinta e quatro minutos DEPOIS da morte. Quem reivindicou soube do crime pelo noticiário.' },
    e_codigo_zero: { name: 'Código original dos Desconectados', short: 'Código Zero', kind: 'digital',
      desc: 'O vírus escrito por Zero: só extração e cópia, comentado em tupi. Não tem nenhum módulo de sobrecarga. Do jeito que foi escrito, não mataria ninguém.' },
    e_codigo_letal: { name: 'Módulo de sobrecarga letal', short: 'Código letal', kind: 'digital',
      desc: 'Fragmento achado no descarte da Clínica Santa Rita: o vírus de Zero com um módulo de sobrecarga neural enxertado. Compilado com a chave MLIN, às 21:57. Precisão de neurocirurgião.' },
    e_lyra_conf: { name: 'Confissão de Lyra', short: 'Confissão L.', kind: 'depoimento',
      desc: 'Lyra admite ter contratado a extração dos dados do irmão para enterrar a denúncia. Jura que o vírus não matava ninguém e que pagou para verificarem isso.' },
    e_emboscada_nucleo: { name: 'Guarda sintético no Núcleo', short: 'Guarda', kind: 'depoimento',
      desc: 'Um guarda sintético da Synapse abriu fogo assim que Vance entrou no Núcleo, e recuou quando o wipe começou. Alguém com crachá de diretoria mandou proteger os servidores.' },
    e_log_nucleo: { name: 'Log do roteador central', short: 'Roteador', kind: 'digital',
      desc: 'O pacote de Zero passou pelo Núcleo às 21:52, foi desviado para o dispositivo MLIN-AR (os óculos da Dra. Lin) e reinjetado, modificado, às 21:58, rumo à oficina do Tico.' },
    e_ordem_descarte: { name: 'Protocolo de descarte de Lyra', short: 'Protocolo', kind: 'digital',
      desc: 'Arquivo executivo assinado por Lyra Vance: depois da extração, "silenciar fornecedores": Corretor, Desconectados e o mecânico. Maya Lin tinha acesso de leitura a esta pasta.' },
  },
  DEDUCTIONS: [
    { id: 'd_fisico', a: 'e_porta_quantica', b: 'e_porta_neural', name: 'O ataque veio de dentro',
      desc: 'Nenhum sinal entrou pela rede: a arma foi um pente de memória físico, plugado direto na porta neural de Kaelen.' },
    { id: 'd_mensageiro', a: 'e_rig7', b: 'e_porta_neural', name: 'O mensageiro de metal',
      desc: 'O RIG-7, a única coisa que entrou no laboratório às 22:12, levou o pente até a cadeira. O robô foi a mão, não a mente.' },
    { id: 'd_contrato', a: 'e_dante_venda', b: 'e_lyra_log', name: 'Quem pagou o roubo',
      desc: 'L.V. Holdings é Lyra Vance. Ela contratou a extração e apagou os próprios rastros na hora da morte.' },
    { id: 'd_reivindicacao', a: 'e_manifesto', b: 'e_terminal_bixiga', name: 'A reivindicação é falsa',
      desc: 'O manifesto foi publicado 34 minutos depois da morte. Os Desconectados assumiram um crime de que só souberam pelo noticiário.' },
    { id: 'd_virus_alterado', a: 'e_codigo_zero', b: 'e_kaelen', name: 'O vírus foi alterado',
      desc: 'O código de Zero só copiava dados. Kaelen morreu de sobrecarga. Alguém modificou o vírus entre o porão dos Desconectados e a nuca de Kaelen.' },
    { id: 'd_clinica', a: 'e_codigo_letal', b: 'e_maya_saida', name: 'A noite da Dra. Lin',
      desc: 'Maya não foi dormir: passou a noite na estação de compilação da Santa Rita, onde estava o módulo de sobrecarga com a chave dela.' },
    { id: 'd_traicao', a: 'e_log_nucleo', b: 'e_codigo_letal', name: 'A traição de Maya',
      desc: 'Maya interceptou o pacote de Zero no Núcleo com os óculos MLIN-AR, enxertou a sobrecarga e o devolveu ao caminho. Ela transformou o roubo em execução.' },
    { id: 'd_descarte', a: 'e_ordem_descarte', b: 'e_dante_venda', name: 'Lyra ia apagar todos',
      desc: 'Depois do roubo, Lyra pretendia silenciar o Corretor e os Desconectados. Maya sabia disso e usou o plano dela como cobertura.' },
  ],
  ACTS: {
    1: { title: 'ATO I', sub: 'A Quebra do Quarto Fechado' },
    2: { title: 'ATO II', sub: 'A Caçada pelos Distritos' },
    3: { title: 'ATO III', sub: 'O Núcleo de Processamento' },
  },
  ENDINGS: {
    perfeito: { title: 'FINAL PERFEITO', sub: 'O Eco Silenciado', good: true,
      text: 'Gabriel Vance publica o dossiê inteiro na rede pública de Neo-Sampa. Em minutos, a cidade de 300 andares inteira lê: a Dra. Maya Lin interceptou o vírus dos Desconectados e o transformou numa sentença de morte, para salvar o projeto Lázaro.\n\nMaya é presa no próprio laboratório, sem resistir. E as fraudes de Lyra Vance, a extração encomendada, o protocolo para silenciar fornecedores, chegam ao conselho da Synapse Corp antes do café da manhã.\n\nNo Bixiga, o Zé do Tubo serve um café coado no pano por conta da casa. Lá em cima, pela primeira vez em semanas, a chuva ácida dá uma trégua.' },
    quase: { title: 'FINAL', sub: 'Justiça pela Metade', good: true,
      text: 'A Dra. Maya Lin é condenada pelo homicídio de Kaelen Voss. O log do roteador e o código letal não deixam margem para dúvida.\n\nMas o conselho da Synapse fecha a porta para o resto. {extra}\n\nVance olha a torre lá de baixo, do Minhocão. Ela continua acesa. Sempre acesa.' },
    fraco: { title: 'FINAL', sub: 'Caso Arquivado', good: false,
      text: 'Você apontou a pessoa certa. Mas sem ligar o código letal à interceptação no Núcleo, os advogados da Synapse transformam a acusação contra a Dra. Maya Lin em uma "teoria criativa".\n\nEla volta ao laboratório na manhã seguinte. O projeto Lázaro ganha um novo engenheiro de segurança.\n\nSaber não basta. É preciso provar.' },
    incompleto: { title: 'FINAL INCOMPLETO', sub: 'O Bode Expiatório Digital', good: false,
      text: 'Os rastros digitais apontam para os Desconectados, e a diretoria da Synapse agradece a rapidez. Zero é preso no porão do Zé do Tubo, de máscara e tudo.\n\nO caso fecha em tempo recorde. A imprensa corporativa chama você de herói.\n\nNo 220º andar, a Dra. Maya Lin ajusta os óculos AR e volta ao trabalho. O projeto Lázaro nunca esteve tão seguro.' },
    errado_lyra: { title: 'FINAL ERRADO', sub: 'A Executiva Errada', good: false,
      text: 'Você acusa Lyra Vance do homicídio do próprio irmão. Ela encomendou o roubo, sim. Mas o vírus que ela comprou não matava ninguém.\n\nOs advogados dela desmontam a acusação de homicídio em uma tarde. Lyra é rebaixada por "má gestão de fornecedores" e sai pela porta da frente.\n\nA assassina assiste ao julgamento de dentro do laboratório, sem tirar os óculos.' },
    errado_rig: { title: 'FINAL ERRADO', sub: 'Defeito de Fábrica', good: false,
      text: 'Você acusa o RIG-7. A Synapse adora a ideia: "falha de equipamento", nenhum culpado humano, nenhuma indenização.\n\nO robô é desmontado em praça pública e vendido como sucata no Minhocão. O Tico compra as peças.\n\nQuem programou a morte continua com as mãos limpas. O RIG-7 só carregou o pacote.' },
    errado_dante: { title: 'FINAL ERRADO', sub: 'O Preço da Informação', good: false,
      text: 'Você acusa Dante Rossi. O Corretor intermediou o roubo, mas nunca encostou no código.\n\nEle paga a fiança com um chip de dados e sai sorrindo, com os dentes de cromo refletindo os flashes. Uma semana depois, desaparece de Neo-Sampa.\n\nA verdadeira assassina nunca precisou de corretor.' },
    critico: { title: 'FINAL CRÍTICO', sub: 'Wipe Total', good: false,
      text: 'O relógio chega a zero. No coração da Neo-Sampa Tower, os servidores do Núcleo de Processamento executam o wipe total de emergência.\n\nCada log, cada pacote, cada rastro digital da noite de 22:31 vira ruído branco. Às 06:00, o sistema automatizado da cidade arquiva o caso Kaelen Voss: "INCONCLUSIVO — FALHA DE EQUIPAMENTO".\n\nVance fica de pé na chuva ácida, olhando o próprio terminal. Uma linha pisca, e some.' },
  },
  SUSPECTS: ['lyra', 'maya', 'zero', 'dante', 'rig7'],
  ACCUSE_Q: ['Quem matou Kaelen Voss?', 'Alguém mais deve ser indiciado pela conspiração?'],
  OBJ_EVIDENCE: {
    kaelen: ['e_kaelen', 'e_porta_neural'], monitor_manifesto: ['e_manifesto'], porta_quantica: ['e_porta_quantica'],
    term_synapse: ['e_lyra_log'], term_bixiga: ['e_terminal_bixiga'], lixo_bio: ['e_codigo_letal'], term_nucleo: ['e_log_nucleo'], arquivo_lyra: ['e_ordem_descarte'],
  },
  // destinos do aerotrem: sala de chegada e o nome na lista
  TRAM: {
    setor4: { name: 'Sector 4 (Av. Alvorada)', room: 'city', at: [16, 18] },
    setor7: { name: 'Sector 7 — Distrito Industrial', room: 'city7', at: [25, 28] },
    ns_hall: { name: 'Setor Paulista — Neo-Sampa Tower', room: 'city_paulista', at: [45, 23] },
    ns_minhocao: { name: 'Baixo Minhocão — Subnível 4', room: 'ns_minhocao', at: [2, 1] },
    ns_zetubo: { name: 'Bixiga (Bar do Zé, Clube 14 Bis)', room: 'city_bixiga', at: [25, 28] },
    ns_clinica: { name: 'Lado Sombra — Clínica Santa Rita', room: 'ns_clinica', at: [2, 1] },
    ns_nucleo: { name: 'Neo-Sampa Tower — Núcleo de Processamento', room: 'ns_nucleo', at: [2, 1] },
  },
  WIPE: 600,   // segundos de jogo para chegar ao roteador antes do wipe
};

const ECO_AMBUSHES = {};
ECO_AMBUSHES.ns_nucleo = {
  spawn: [12.5, 9.4], escape: [12.5, 9.5], cover: [[10.5, 8.5], [11.5, 7.4], [10.5, 4.5], [12.5, 4.6], [11.5, 5.5]], look: 'guarda_sint',
  flag: 'tiroteio_nucleo', evidence: 'e_emboscada_nucleo', title: 'Guarda sintético', warn: 'Um guarda sintético da Synapse sai de trás dos servidores!',
  hit: 'Um disparo de raspão joga Vance contra um rack. Faíscas, alarme, fumaça. Quando ele se levanta, o guarda já recuou para trás dos servidores.',
  miss: 'O guarda sintético recua entre os servidores e some na fumaça do resfriamento. Os tiros de Vance só acertaram painéis.',
  after: 'Nas costas do guarda, Vance viu o crachá de comando: "AUTORIZAÇÃO DE DIRETORIA".\n\nNos alto-falantes, uma voz sintética: "WIPE DE EMERGÊNCIA EM ANDAMENTO." O tempo está correndo.',
};

// ------------------------------------------------------------
// Lógica do caso
// ------------------------------------------------------------
function tramUnlock(id) {
  if (game.flags['tram_' + id]) return;
  game.flags['tram_' + id] = true;
  toast(`<span class="k">AEROTREM</span> ${T('Nova parada: {0}', T(ECO.TRAM[id].name))}`, 'ev');
  saveGame();
}
// Sector 4 e Sector 7 estão sempre na linha; os distritos de Neo-Sampa só existem no caso 2
function tramKnown(id) { return id === 'setor4' || id === 'setor7' || (game.caseId === 'eco' && (id === 'ns_hall' || !!game.flags['tram_' + id])); }

// a estação: lista as paradas liberadas
function openTram() {
  const list = Object.keys(ECO.TRAM).filter(id => tramKnown(id) && !(ECO.TRAM[id].room === game.roomId));
  message('Estação do aerotrem', 'O vagão chega deslizando no trilho magnético, pingando chuva ácida. O painel mostra as paradas do seu roteiro:',
    list.map(id => ({ label: '▸ ' + T(ECO.TRAM[id].name), fn: () => { closeModal(); tramTravel(id); } })).concat([{ label: 'Ficar aqui', fn: closeModal }]));
}
function tramTravel(id) {
  const d = ECO.TRAM[id];
  Sound.play('door');
  if (ROOMS[d.room].city) {
    const [x, y] = ROOMS[d.room].cityObj.map(...d.at);
    enterRoom(d.room, [Math.floor(x), Math.floor(y)]);
    // a parada pode ter um poste ou uma banca em cima: desce no chão livre mais próximo
    const p = game.player;
    for (let r = 1; r < 5 && blocked(p.x, p.y); r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++)
      if (blocked(p.x, p.y) && !blocked(Math.floor(x) + dx, Math.floor(y) + dy)) { p.x = p.px = Math.floor(x) + dx; p.y = p.py = Math.floor(y) + dy; }
    updateCamera(game.roomData, p.px + 0.5, p.py + 0.5, 0, true);
  }
  else enterRoom(d.room, d.at);
  toast(`<span class="k">AEROTREM</span> ${T(d.name)}`, 'room');
  if (id === 'ns_nucleo' && !game.flags.wipe_on && !has('e_log_nucleo')) { game.flags.wipe_on = true; game.flags.wipe = ECO.WIPE; saveGame(); }
}

function ecoStart() {
  enterRoom('ns_lab', [2, 1], true);
  showCard(ACTS[1].title, ACTS[1].sub, () => {
    message('Detetive Vance', T('Neo-Sampa, 2085. Um dia depois do caso Alvorada, o telefone toca de novo. Neo-Sampa Tower, 220º andar: Kaelen Voss, engenheiro de segurança neural da Synapse Corp, está morto no chão do laboratório, ao lado da própria cadeira de interface. O cérebro, intacto. A consciência, apagada.') + '\n\n' +
      T('O laboratório é blindado e estava trancado por criptografia quântica. Nenhum sinal entrou ou saiu. Um quarto fechado, físico e digital.') + '\n\n' +
      T('O aerotrem liga a torre aos distritos de Neo-Sampa e ao seu Setor 4. O SCANNER revela o invisível; PISTAS conecta as evidências.'));
  });
}

function ecoCheckProgress() {
  if (game.act === 1 && has('d_fisico')) {
    game.act = 2;
    updateHud(); saveGame(); closeModal();
    tramUnlock('ns_zetubo');
    showCard(ACTS[2].title, ACTS[2].sub, () => message('Detetive Vance',
      'A arma não veio pela rede. Veio num pente de memória, plugado direto na nuca de Kaelen. Alguém precisou levar esse pente até a cadeira.\n\nE o manifesto no monitor tem um rastro: foi publicado de um terminal público no Bixiga. O aerotrem já tem a parada.'));
  } else if (game.act === 2 && has('d_virus_alterado')) {
    game.act = 3;
    game.flags.wipe_on = false;
    tramUnlock('ns_nucleo');
    updateHud(); saveGame(); closeModal();
    showCard(ACTS[3].title, ACTS[3].sub, () => message('Detetive Vance',
      'O vírus de Zero só copiava dados. Quem matou Kaelen trocou o conteúdo do pacote no caminho, e o caminho passa pelo Núcleo de Processamento da torre.\n\nÁGORA avisa: a Synapse agendou um wipe de emergência dos servidores. Quando Vance entrar no Núcleo, o relógio começa a correr.\n\nEncontre as provas finais. Quando estiver pronto, faça a acusação em Pistas.'));
  }
}

function ecoObjective() {
  if (game.act === 1) {
    if (has('e_porta_quantica') && has('e_porta_neural')) return 'Conecte as evidências em Pistas.';
    if (game.evidence.length >= 3) return 'Como a arma entrou num laboratório blindado? Use o scanner no corpo de Kaelen.';
    return 'Examine o laboratório cinético na Neo-Sampa Tower.';
  }
  if (game.act === 2) {
    if (!has('e_oficina')) return 'Descubra quem modificou o RIG-7 (Baixo Minhocão).';
    if (!has('e_dante_venda')) return 'Interrogue o Corretor no Clube 14 Bis.';
    if (!has('e_terminal_bixiga')) return 'Rastreie o manifesto até o terminal do Bar do Zé do Tubo.';
    if (!has('d_reivindicacao')) return 'Conecte o manifesto ao terminal do Bixiga em Pistas.';
    if (!has('e_codigo_zero')) return 'Encontre Zero, o líder dos Desconectados.';
    return 'Compare o código de Zero com a morte de Kaelen em Pistas.';
  }
  if (!has('e_log_nucleo')) {
    const w = game.flags.wipe_on ? Math.max(0, Math.ceil(game.flags.wipe)) : null;
    return w !== null ? T('WIPE EM {0}: chegue ao roteador central do Núcleo!', `${Math.floor(w / 60)}:${String(w % 60).padStart(2, '0')}`) : 'Pegue o aerotrem até o Núcleo de Processamento.';
  }
  if (!has('d_traicao')) return 'Ligue o log do roteador ao código que matou Kaelen.';
  return 'Revise as deduções e faça a acusação em Pistas.';
}

// relógio do wipe: corre no ato III depois que Vance entra no Núcleo, até ele salvar o log do roteador
function ecoUpdate(dt) {
  if (game.act !== 3 || !game.flags.wipe_on || has('e_log_nucleo') || game.modal) return;
  const before = Math.ceil(game.flags.wipe);
  game.flags.wipe -= dt;
  if (Math.ceil(game.flags.wipe) !== before) updateHud();
  if (game.flags.wipe <= 0) showEnding('critico');
}
// emboscada: o guarda sintético aparece logo que Vance entra no Núcleo
function ecoWantsCombat() { return game.roomId === 'ns_nucleo' && !game.flags.tiroteio_nucleo && !game.scanner; }

function ecoResolve(killer, second) {
  if (killer === 'zero') return showEnding('incompleto');
  if (killer === 'lyra') return showEnding('errado_lyra');
  if (killer === 'rig7') return showEnding('errado_rig');
  if (killer === 'dante') return showEnding('errado_dante');
  const proof = has('d_traicao') && has('d_virus_alterado') && has('d_fisico');
  if (!proof) return showEnding('fraco');
  if (second === 'lyra' && has('d_contrato')) return showEnding('perfeito');
  let extra;
  if (second === 'lyra') extra = T('Você acusou Lyra Vance, mas sem ligar a L.V. Holdings aos registros apagados, a acusação de conspiração não para em pé. Ela é promovida no mês seguinte.');
  else if (second === 'zero' || second === 'dante' || second === 'rig7') extra = T('Pior: você arrastou {0} para o tribunal como cúmplice de assassinato, enquanto a executiva que encomendou o roubo nunca foi sequer citada.', NPCS[second].name);
  else extra = T('Ninguém pergunta quem encomendou o roubo dos dados de Kaelen. Lyra Vance continua no 220º andar, com o protocolo de descarte guardado na gaveta.');
  showEnding('quase', extra);
}

// objetos do caso: devolve false quando não trata o objeto (aí vale o comportamento padrão)
function ecoInteract(o) {
  const S = game.scanner;
  switch (o.key) {
    case 'hotel_fechado': return message('Hotel Grand Alvorada', 'A porta está lacrada com fita da perícia: "CENA DE CRIME — CASO PENDELTON". As viaturas continuam na frente, com o giroflex ligado.\n\nO caso Alvorada ainda está no tribunal. Hoje, o trabalho de Vance é em Neo-Sampa.');
    case 'kaelen':
      if (S && give('e_porta_neural')) return message('Porta neural — scanner', 'O scanner amplia a interface da nuca de Kaelen: micro-arranhões frescos de um conector Kessler, de pente de memória físico.\n\nAlguém plugou um dispositivo direto na cabeça dele, e depois o tirou.\n\nO quarto não estava fechado para coisas que andam.');
      if (give('e_kaelen')) return message('Kaelen Voss', 'Kaelen Voss, 34 anos, caído no chão ao lado da cadeira de interface, de olhos abertos. O cabo neural ainda pende da cadeira. O cérebro orgânico está intacto, mas sem atividade nenhuma: morte cerebral irreversível às 22:31.\n\nA porta neural da nuca queimou de dentro para fora. Isso não foi um roubo de dados. Foi uma sobrecarga.\n\n(O SCANNER pode revelar mais na interface.)');
      return message('Kaelen Voss', S ? 'Arranhões de conector Kessler na interface. Um pente físico.' : 'Os olhos de Kaelen continuam abertos, fixos no teto. Ele caiu da cadeira como quem é desligado da tomada.');
    case 'monitor_manifesto':
      if (give('e_manifesto')) return message('Monitor principal', 'Um único arquivo corrompido roda em loop:\n\n"NÓS SOMOS OS DESCONECTADOS. A SYNAPSE VENDE A ETERNIDADE. NÓS COBRAMOS O PREÇO."\n\nCarimbo: 22:31:00. O arquivo não tem origem de rede. Ele foi gravado aqui dentro.');
      return message('Monitor principal', 'O manifesto dos Desconectados continua em loop. 22:31:00.');
    case 'porta_quantica':
      if (give('e_porta_quantica')) return message('Painel da porta quântica', 'Log da trava:\n\n21:55 — LOCK /QUANTUM — origem: INTERNA (K. VOSS)\n22:12 — OPEN 00:40 — credencial: MANUT/RIG-7\n22:12 — LOCK /QUANTUM\n22:00–23:00 — SINAIS EXTERNOS: 0\n\nNada entrou pela rede. Só uma coisa entrou pela porta: o robô de limpeza.');
      return message('Painel da porta quântica', 'Uma abertura às 22:12, credencial do RIG-7. Nenhum sinal externo.');
    case 'term_synapse':
      if (!has('e_lyra_log')) return message('Terminal de acessos internos', 'Registros de acesso da diretoria. Criptografia corporativa de nível executivo.', [
        { label: 'Invadir o terminal', fn: () => { closeModal(); openHack('SYNAPSE — REGISTROS DE DIRETORIA', () => { give('e_lyra_log'); message('Registros de diretoria', 'L. VANCE — sessões das 21:00 às 23:59: [EXCLUÍDAS]\n\nComando de exclusão: 22:31:04 — credencial: DIRETORIA/LV.\n\nQuatro segundos depois da morte do irmão, Lyra apagou os próprios passos.'); }); } },
        { label: 'Depois', fn: closeModal },
      ]);
      return message('Terminal de acessos internos', 'Registros de Lyra Vance excluídos às 22:31:04.');
    case 'term_bixiga':
      if (!has('e_terminal_bixiga')) return message('Terminal público do Bixiga', 'Um terminal velho, sem login e sem câmera. O teclado é colado com fita. O histórico de envios está protegido por uma senha de 2050.', [
        { label: 'Invadir o histórico', fn: () => { closeModal(); openHack('TERMINAL PÚBLICO — HISTÓRICO DE ENVIOS', () => { give('e_terminal_bixiga'); message('Histórico de envios', '23:05 — PUBLICAÇÃO NAS REDES DE SOMBRA — "manifesto_desconectados.txt"\n\nVinte e três e cinco. A morte foi às 22:31.\n\nQuem publicou este manifesto chegou atrasado ao próprio crime.'); }); } },
        { label: 'Depois', fn: closeModal },
      ]);
      return message('Terminal público do Bixiga', 'Manifesto publicado daqui às 23:05, meia hora depois da morte.');
    case 'alcapao':
      if (!game.flags.ze_porao) return message('Alçapão do porão', 'Um alçapão de madeira, com cadeado. Por baixo, um zumbido de servidores e uma luz verde.\n\nMelhor perguntar ao Zé antes de descer.');
      return enterRoom('ns_base', [2, 1]);
    case 'balcao_ze': relieve({ sede: 15, fome: 12 }); return message('Balcão do Zé', 'O Zé serve um café coado no pano e um pão com mortadela molecular. Tem gosto de domingo de 2030.');
    case 'bancada_clinica':
      return message('Estação de compilação neural', S ? 'O scanner encontra a última sessão: chave MLIN, das 22:41 às 05:58. Arquivos apagados. Mas o lixo... o lixo ninguém apaga direito.' : 'Uma estação de compilação de código neural, cara demais para uma clínica clandestina. A cadeira ainda está morna.\n\n(O SCANNER pode revelar mais.)');
    case 'lixo_bio':
      if (S && give('e_codigo_letal')) return message('Descarte biotecnológico — scanner', 'Entre luvas e seringas, um pente de memória queimado. O scanner recupera um fragmento:\n\n"modulo_sobrecarga.neu — compilado 21:57 — chave: MLIN"\n\nE, por baixo, o código de Zero, com os comentários em tupi. Alguém pegou o vírus dos Desconectados e enxertou nele uma sentença de morte.');
      if (has('e_codigo_letal')) return message('Descarte biotecnológico', 'O pente queimado com o módulo de sobrecarga.');
      return message('Descarte biotecnológico', 'Luvas, seringas, gel azul seco. Um cheiro de ozônio e hospital.\n\n(O SCANNER pode revelar mais.)');
    case 'term_clinica': return message('Prontuários da clínica', 'Pacientes 0440 a 0459: "voluntários Synapse — Baixo Minhocão". Diagnóstico de todos: "perda de memória por chip experimental".\n\nResponsável: Dra. M. Lin. A mesma que inventou o chip, cuidando de quem ele quebrou.');
    case 'term_nucleo':
      if (!has('e_log_nucleo')) return message('Roteador de pacotes central', 'O painel pisca em vermelho: WIPE EM ANDAMENTO. Os logs de roteamento estão sendo apagados setor por setor.', [
        { label: 'Invadir e salvar o log', fn: () => { closeModal(); openHack('NÚCLEO — LOG DE ROTEAMENTO (WIPE EM ANDAMENTO)', () => { give('e_log_nucleo'); game.flags.wipe_on = false; updateHud(); message('Log de roteamento salvo', 'Pacote "manut_rig7.pkg", origem: canal de manutenção (Desconectados).\n\n21:52 — DESVIADO para o dispositivo MLIN-AR\n21:58 — REINJETADO (tamanho +312 KB) com destino à oficina "Tico Consertos"\n\nOs óculos da Dra. Lin. Ela pegou o vírus no meio do caminho e o devolveu mais pesado.\n\nO wipe pode correr agora. O log já está no seu implante.'); }); } },
        { label: 'Depois', fn: closeModal },
      ]);
      return message('Roteador de pacotes central', 'O log salvo mostra o desvio para o dispositivo MLIN-AR.');
    case 'arquivo_lyra':
      if (S && give('e_ordem_descarte')) return message('Arquivo executivo — scanner', 'O scanner fura a camada de ocultação da pasta. Um documento assinado por L. Vance:\n\n"PROTOCOLO DE CONTINGÊNCIA — após a extração, silenciar fornecedores: o Corretor, o grupo Desconectados, a oficina do Subnível 4."\n\nLista de leitura da pasta: L. Vance, M. Lin.');
      if (has('e_ordem_descarte')) return message('Arquivo executivo', 'O protocolo de descarte de Lyra. Maya tinha acesso.');
      return message('Arquivo executivo restrito', 'Uma pasta de diretoria, oculta e bloqueada. Parece vazia.\n\n(O SCANNER pode revelar mais.)');
  }
  return false;
}

// ------------------------------------------------------------
// Objetos de cenário novos deste caso (chamados por drawProp)
// ------------------------------------------------------------
function ecoProp(o, t, w, d, cx, cy) {
  switch (o.kind) {
    case 'neural_chair': {   // cadeira de interface de onde Kaelen caiu
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 5, '#2a2e3a', 0, '#3a404e');
      box(o.x + 0.15, o.y + 0.1, 0.7, 0.15, 18, '#1e222c', 5, '#2a2e3a');   // encosto
      // cadeira vazia: o cabo da porta neural pende até o chão, ao lado do corpo
      const [hx, hy] = iso(o.x + 0.5, o.y + 0.15, 22), [fx, fy] = iso(o.x + 0.45, o.y + 1.05, 0);
      ctx.strokeStyle = '#38f6ff'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx + 8, (hy + fy) / 2, fx, fy); ctx.stroke();
      const pulse = 0.25 + 0.2 * Math.sin(t * 5);
      ctx.fillStyle = '#ff3355'; ctx.fillRect(fx - 0.6, fy - 0.6, 1.2, 1.2);
      glow(fx, fy, 7, '#ff3355', pulse);
      return true;
    }
    case 'cryo_tank': {      // tanque de resfriamento com gel azul e bolhas
      box(o.x + 0.12, o.y + 0.12, 0.76, 0.76, 3, '#2a3036', 0, '#3a4046');
      const [bx, by] = iso(cx, cy, 3);
      ctx.fillStyle = 'rgba(56,160,255,0.28)'; ctx.fillRect(bx - 6, by - 26, 12, 24);
      ctx.strokeStyle = 'rgba(200,240,255,0.5)'; ctx.lineWidth = 0.4; ctx.strokeRect(bx - 6, by - 26, 12, 24);
      for (let k = 0; k < 4; k++) { const u = (t * 0.6 + k * 0.25 + o.x * 0.13) % 1; ctx.fillStyle = 'rgba(220,250,255,0.6)'; ctx.fillRect(bx - 3 + k * 2, by - 3 - u * 22, 0.8, 0.8); }
      box(o.x + 0.12, o.y + 0.12, 0.76, 0.76, 2, '#2a3036', 27, '#4a5056');
      glow(bx, by - 14, 16, '#38a0ff', 0.25);
      return true;
    }
    case 'dj_booth': {       // cabine do DJ: mesa, toca-discos e um drone de quatro braços
      box(o.x + 0.05, o.y + 0.2, w - 0.1, d - 0.4, 9, '#14101c', 0, '#2a1a3a');
      const [sx, sy] = iso(cx, cy, 9);
      for (const dx of [-6, 6]) { ctx.fillStyle = '#0a0a0e'; ctx.beginPath(); ctx.ellipse(sx + dx, sy, 3, 1.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#ff4fd8'; ctx.fillRect(sx + dx - 0.3, sy - 0.3, 0.6, 0.6); }
      const bob = Math.sin(t * 6) * 1.2, [dx2, dy2] = iso(cx, cy, 20 + bob);
      ctx.fillStyle = '#3a3a48'; ctx.fillRect(dx2 - 3, dy2 - 2, 6, 3);
      ctx.strokeStyle = '#6a6a7a'; ctx.lineWidth = 0.5;
      for (const [ax, ay] of [[-6, -3], [6, -3], [-6, 2], [6, 2]]) { ctx.beginPath(); ctx.moveTo(dx2, dy2); ctx.lineTo(dx2 + ax, dy2 + ay + Math.sin(t * 8 + ax) * 1.5); ctx.stroke(); }
      ctx.fillStyle = '#38f6ff'; ctx.fillRect(dx2 - 1.5, dy2 - 1, 3, 0.8);
      glow(sx, sy - 6, 24, ['#ff4fd8', '#38f6ff', '#ffd23f'][Math.floor(t * 3) % 3], 0.35);
      return true;
    }
    case 'speaker': {        // caixa de som que pulsa com o grave
      const k = 1 + Math.max(0, Math.sin(t * 18.8)) * 0.04;
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 22 * k, '#121216', 0, '#1e1e24');
      const [sx, sy] = iso(o.x + 0.85, cy, 7);
      ctx.fillStyle = '#26262e'; ctx.beginPath(); ctx.ellipse(sx, sy, 2.4 * k, 3 * k, 0, 0, Math.PI * 2); ctx.fill();
      const [s2x, s2y] = iso(o.x + 0.85, cy, 16);
      ctx.beginPath(); ctx.ellipse(s2x, s2y, 1.6 * k, 2 * k, 0, 0, Math.PI * 2); ctx.fill();
      return true;
    }
    case 'pillar': {         // pilar de concreto do viaduto, pichado, com marcas de infiltração
      box(o.x + 0.12, o.y + 0.12, 0.76, 0.76, 74, '#4a4a4e', 0, '#3a3a3e');
      const [sx, sy] = iso(o.x + 0.88, cy, 0), [lx, ly] = iso(o.x + 0.5, o.y + 0.88, 0);
      const tags = [['#ff4fd8', 'VIVE'], ['#7dff6b', 'Z€RO'], ['#ffd23f', 'SP'], ['#38f6ff', 'FOME'], ['#ff6a2a', 'Ñ ESQUEÇA']];
      const [tc, tx2] = tags[(o.x * 7 + o.y) % tags.length];
      ctx.save(); ctx.font = '700 4px "Chakra Petch", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = rgba(tc, 0.75);
      ctx.fillText(T(tx2), lx, ly - 12); ctx.restore();
      ctx.fillStyle = 'rgba(20,30,20,0.35)'; ctx.fillRect(sx - 1.5, sy - 70, 1, 50);   // escorrido de infiltração
      for (let k = 0; k < 2; k++) { const f = ((t * 0.9 + k * 0.5 + o.x * 0.17) % 1); ctx.fillStyle = 'rgba(160,200,255,0.6)'; ctx.fillRect(sx - 1.3, sy - 70 + f * 66, 0.6, 1.5); }   // goteira
      return true;
    }
    case 'beam': {           // viga do viaduto lá em cima, de pilar a pilar (o tabuleiro da via expressa)
      box(o.x, o.y + 0.05, w, 0.9, 7, '#38383c', 66, '#2a2a2e');
      const [ax, ay] = iso(o.x, o.y + 0.95, 66), [bx, by] = iso(o.x + w, o.y + 0.95, 66);
      line([[ax, ay], [bx, by]], 'rgba(255,210,63,0.35)', 0.5);
      for (let u = 1; u < w; u += 3) { const [lx, ly] = iso(o.x + u, o.y + 0.95, 66); ctx.fillStyle = Math.sin(t * 2 + u) > 0.6 ? '#ff6a2a' : '#5a3a20'; ctx.fillRect(lx - 0.6, ly + 0.5, 1.2, 1.2); }   // luminárias de serviço
      return true;
    }
    case 'tent': {           // barraca de lona de morador de rua
      const col = o.col || ['#2a5a8a', '#6a2a2a', '#3a6a3a', '#8a6a2a'][(o.x + o.y) % 4];
      const A = iso(o.x + 0.08, o.y + 0.9, 0), B = iso(o.x + 0.92, o.y + 0.9, 0), C = iso(o.x + 0.92, o.y + 0.1, 0), D = iso(o.x + 0.08, o.y + 0.1, 0), Tp = iso(o.x + 0.5, o.y + 0.9, 11), Tb = iso(o.x + 0.5, o.y + 0.1, 11);
      poly(ctx, [D, Tb, Tp, A], shade(col, 0.7)); poly(ctx, [Tb, C, B, Tp], col);
      poly(ctx, [A, Tp, B], shade(col, 0.45));
      const [mx, my] = iso(o.x + 0.5, o.y + 0.9, 3); ctx.fillStyle = '#0a0a0e'; ctx.beginPath(); ctx.moveTo(mx - 2, my + 2); ctx.lineTo(mx, my - 4); ctx.lineTo(mx + 2, my + 2); ctx.fill();
      return true;
    }
    case 'mattress': {       // colchão velho ou papelão, com cobertor
      box(o.x + 0.1, o.y + 0.15, w - 0.2, d - 0.3, 1.5, '#7a6a4a', 0, '#8a7a5a');
      box(o.x + 0.15, o.y + 0.5, w - 0.3, d - 0.65, 1, o.col || '#5a2a3a', 1.5, shade(o.col || '#5a2a3a', 1.2));
      return true;
    }
    case 'patient_bed': {    // leito de clínica com o paciente deitado e monitor ao lado
      box(o.x + 0.1, o.y + 0.1, w - 0.2, d - 0.2, 5, '#c8ccd4', 0, '#e8ecf0');
      drawLying(o.x + w / 2, o.y + 0.28, 6.2, o.look || 'paciente1', t, { len: 1.6, zzz: !!o.sleep, pose: 'sleep' });
      box(o.x + 0.15, o.y + 0.75, w - 0.3, d - 0.95, 1.4, '#9ab8c8', 6, '#b8d4e0');   // lençol
      const [mx, my] = iso(o.x + 0.1, o.y + 0.25, 14);
      ctx.fillStyle = '#0a1410'; ctx.fillRect(mx - 3, my - 2, 6, 4);
      ctx.strokeStyle = '#7dff6b'; ctx.lineWidth = 0.4; ctx.beginPath();
      for (let k = 0; k <= 10; k++) { const ph = (t * 1.6 + k / 10) % 1, yy = my + (ph > 0.45 && ph < 0.55 ? -1.5 : 0.5); k ? ctx.lineTo(mx - 2.6 + k * 0.52, yy) : ctx.moveTo(mx - 2.6, yy); }
      ctx.stroke();
      return true;
    }
    case 'iv_stand': {       // suporte de soro
      const [bx, by] = iso(cx, cy, 0);
      line([[bx, by], [bx, by - 20]], '#8a8e96', 0.5); line([[bx - 2, by], [bx + 2, by]], '#8a8e96', 0.5);
      ctx.fillStyle = 'rgba(200,240,255,0.7)'; ctx.fillRect(bx - 1.2, by - 20, 2.4, 4);
      line([[bx, by - 16], [bx + 3, by - 8]], 'rgba(200,240,255,0.5)', 0.3);
      return true;
    }
    case 'tram_stop': {      // ponto do aerotrem: totem com o mapa da linha e um letreiro holográfico
      box(o.x + 0.35, o.y + 0.35, 0.3, 0.3, 30, '#2a2e3a', 0, '#3a404e');
      const [sx, sy] = iso(cx, cy, 36);
      ctx.fillStyle = 'rgba(10,20,40,0.85)'; ctx.fillRect(sx - 12, sy - 5, 24, 9);
      ctx.strokeStyle = '#38f6ff'; ctx.lineWidth = 0.5; ctx.strokeRect(sx - 12, sy - 5, 24, 9);
      propText('AEROTREM', sx, sy - 1.5, 3, '#38f6ff');
      propText('NEO-SAMPA', sx, sy + 2, 2, '#ff4fd8');
      glow(sx, sy, 18, '#38f6ff', 0.3 + 0.1 * Math.sin(t * 3));
      return true;
    }
  }
  return false;
}
