// ============================================================
// Mundo além do hotel: casa, delegacia, café, casa de banho (a cidade fica em city.js)
// (carregado depois de data.js e dialogues.js)
// ============================================================

// ---------- visuais extras ----------
Object.assign(LOOKS, {
  vance_f: { coat: '#1c2a4a', coatDark: '#101a30', skin: '#d8a27a', hair: '#0c0c10', legs: '#16161c', implant: '#38f6ff', shirt: '#121216', collar: '#2a2a32', hairStyle: 'bob', jacket: true },
  vance_f_towel: { coat: '#d8a27a', coatDark: '#a8785a', skin: '#d8a27a', hair: '#0c0c10', legs: '#d8a27a', implant: '#38f6ff', hairStyle: 'bob', towel: '#f0f0f4', towelHigh: true },
  vance_towel: { coat: '#d8a27a', coatDark: '#a8785a', skin: '#d8a27a', hair: '#0c0c10', legs: '#d8a27a', implant: '#38f6ff', hairStyle: 'modern', towel: '#f0f0f4' },
  marta:   { coat: '#c8a020', coatDark: '#8a6a10', skin: '#a8724e', hair: '#d8502a', legs: '#20202a', implant: '#38f6ff', shirt: '#1a1a20', hairStyle: 'bob', jacket: true },
  okafor:  { coat: '#1c2a48', coatDark: '#101a30', skin: '#6a4430', hair: '#141418', legs: '#141a2a', implant: '#ffd23f', shirt: '#d8dce8', hairStyle: 'bun', tie: '#2a3a68' },
  kenji:   { coat: '#e4e8f0', coatDark: '#a8b0c0', skin: '#e0b890', hair: '#18181e', legs: '#2a2a36', implant: '#7dff6b', shirt: '#3a4a5a', hairStyle: 'modern', goggles: '#7dff6b', long: true },
  unidade7:{ coat: '#4a5468', coatDark: '#2e3444', skin: '#a8b4c8', hair: '#6a7488', legs: '#2e3444', implant: '#ff3355', shirt: '#2e3444', hairStyle: 'bald' },
  lumi:    { coat: '#f0e0d0', coatDark: '#b8a090', skin: '#e8f0ff', hair: '#ff8ad8', legs: '#3a2a3a', implant: '#ff4fd8', shirt: '#5a2a4a', hairStyle: 'bob' },
  ilsa:    { coat: '#6a4a6a', coatDark: '#4a304a', skin: '#e8c8b8', hair: '#e8e8f0', legs: '#2a202a', implant: '#b04cff', shirt: '#d8c8e0', hairStyle: 'bun', long: true },
  jax:     { coat: '#2a6a4a', coatDark: '#1a4a30', skin: '#8a5a3a', hair: '#e8d040', legs: '#202a20', implant: '#7dff6b', shirt: '#101410', hairStyle: 'modern', jacket: true },
  wen:     { coat: '#e8e8e0', coatDark: '#b0b0a8', skin: '#d8b088', hair: '#9a9aa0', legs: '#2a2a2a', implant: '#ff6b3d', shirt: '#e8e8e0', hairStyle: 'bald', beard: true },
  lin:     { coat: '#7a1a3a', coatDark: '#4a1024', skin: '#e0c0a0', hair: '#141418', legs: '#3a1020', implant: '#ffd23f', shirt: '#d8a020', hairStyle: 'long', long: true, rim: [255, 210, 63] },
  bao:     { child: 0.66, coat: '#3a8ad8', coatDark: '#2a5a98', skin: '#e0b890', hair: '#141418', legs: '#2a2a3a', implant: '#38f6ff', shirt: '#f0f0f0', hairStyle: 'short' },
  hana:    { coat: '#d84a6a', coatDark: '#983048', skin: '#f0d0b8', hair: '#2a1a14', legs: '#d84a6a', implant: '#38f6ff', shirt: '#f0e0e0', hairStyle: 'bun', long: true },
  goro:    { coat: '#e8e8e8', coatDark: '#a8a8a8', skin: '#c89878', hair: '#c8c8c8', legs: '#e8e8e8', implant: '#ff3355', shirt: '#3a5a8a', hairStyle: 'slick', long: true, rim: [255, 51, 85] },
  goro_bath: { coat: '#c89878', coatDark: '#a07858', skin: '#c89878', hair: '#c8c8c8', legs: '#c89878', implant: '#ff3355', hairStyle: 'slick', towel: '#e8e8f0', rim: [255, 51, 85] },
  byte:    { coat: '#3a3a48', coatDark: '#24242e', skin: '#5a5a6a', hair: '#3a3a48', legs: '#24242e', implant: '#38f6ff', shirt: '#3a3a48', hairStyle: 'bald', cat: true },
  // polícia
  cruz:    { coat: '#1c2a48', coatDark: '#101a30', skin: '#b07850', hair: '#141418', legs: '#141a2a', implant: '#38a0ff', shirt: '#d8dce8', hairStyle: 'short', cap: '#141c30', vest: '#22304a', vestStripe: '#38a0ff' },
  cop1:    { coat: '#1c2a48', coatDark: '#101a30', skin: '#e0b890', hair: '#3a2a1a', legs: '#141a2a', implant: '#38a0ff', shirt: '#d8dce8', hairStyle: 'short', cap: '#141c30' },
  cop2:    { coat: '#1c2a48', coatDark: '#101a30', skin: '#6a4430', hair: '#141418', legs: '#141a2a', implant: '#38a0ff', shirt: '#d8dce8', hairStyle: 'bun', cap: '#141c30', vest: '#22304a', vestStripe: '#38a0ff' },
  cop3:    { coat: '#1c2a48', coatDark: '#101a30', skin: '#c89878', hair: '#8a8a90', legs: '#141a2a', implant: '#ffd23f', shirt: '#d8dce8', hairStyle: 'slick', cap: '#141c30', beard: true },
  cop4:    { coat: '#22304a', coatDark: '#141c30', skin: '#e8c8b0', hair: '#d8c040', legs: '#141a2a', implant: '#38a0ff', shirt: '#d8dce8', hairStyle: 'bob', vest: '#1a2438', vestStripe: '#d8ff60' },
  ana:     { coat: '#e8eef2', coatDark: '#b0bcc6', skin: '#d8a888', hair: '#2a1a14', legs: '#d8e0e6', implant: '#38f6ff', shirt: '#e8eef2', hairStyle: 'bun', goggles: '#38f6ff', vest: '#2a3a5a', vestStripe: '#ffd23f' },
  rui:     { coat: '#e8eef2', coatDark: '#b0bcc6', skin: '#e0b890', hair: '#141418', legs: '#d8e0e6', implant: '#7dff6b', shirt: '#e8eef2', hairStyle: 'modern', vest: '#2a3a5a', vestStripe: '#ffd23f' },
  // Chinatown
  mei:     { coat: '#1e6a4a', coatDark: '#124a32', skin: '#e8c8a8', hair: '#d8d8e0', legs: '#1a2a20', implant: '#7dff6b', shirt: '#e8e0c8', hairStyle: 'bun', long: true },
  huang:   { coat: '#5a4a3a', coatDark: '#3a3024', skin: '#d8b088', hair: '#e8e8e8', legs: '#2a2420', implant: '#ffd23f', shirt: '#e8e0d0', hairStyle: 'bald', beard: true, long: true },
  lan:     { coat: '#e8e0d8', coatDark: '#b8b0a8', skin: '#e0b890', hair: '#2a1a14', legs: '#3a2a2a', implant: '#ff8ad8', shirt: '#ff8ad8', hairStyle: 'bob' },
  // pedestres
  ped1:    { coat: '#3a2a4a', coatDark: '#24182e', skin: '#d8a888', hair: '#1a1a20', legs: '#1a1a24', implant: '#ff4fd8', shirt: '#2a2a3a', hairStyle: 'short', long: true },
  ped2:    { coat: '#2a4a5a', coatDark: '#18303a', skin: '#8a5a3a', hair: '#e04060', legs: '#1a1a24', implant: '#38f6ff', shirt: '#101418', hairStyle: 'bob', jacket: true },
  ped3:    { coat: '#5a4a2a', coatDark: '#3a301a', skin: '#e0c0a0', hair: '#6a4a2a', legs: '#2a2418', implant: '#ffd23f', shirt: '#d0d0c0', hairStyle: 'modern' },
  ped4:    { coat: '#1a1a24', coatDark: '#0e0e14', skin: '#c89070', hair: '#d8d8e0', legs: '#14141c', implant: '#7dff6b', shirt: '#7dff6b', hairStyle: 'long', long: true },
  ped5:    { coat: '#7a1a2a', coatDark: '#4a0e18', skin: '#e8c8a8', hair: '#141418', legs: '#1a1a24', implant: '#ffd23f', shirt: '#e8e0d0', hairStyle: 'bun' },
  ped6:    { coat: '#2a2a32', coatDark: '#16161c', skin: '#6a4430', hair: '#141418', legs: '#1a1a24', implant: '#ff3355', shirt: '#ff3355', hairStyle: 'modern', jacket: true },
  ped7:    { coat: '#3a5a3a', coatDark: '#243a24', skin: '#d8b088', hair: '#5a5a60', legs: '#20201a', implant: '#7dff6b', shirt: '#d8d0b0', hairStyle: 'bald', beard: true },
  ped8:    { coat: '#b8a888', coatDark: '#8a7a60', skin: '#e0b890', hair: '#1a1a20', legs: '#2a2a2a', implant: '#38f6ff', shirt: '#2a2a3a', hairStyle: 'long', long: true },
  // casa de banho
  banhista_m: { coat: '#c89070', coatDark: '#a07050', skin: '#c89070', hair: '#1a1a20', legs: '#c89070', implant: '#38f6ff', hairStyle: 'short', towel: '#e8f0f8' },
  banhista_m2:{ coat: '#e8c8a8', coatDark: '#c0a080', skin: '#e8c8a8', hair: '#8a8a90', legs: '#e8c8a8', implant: '#ffd23f', hairStyle: 'bald', beard: true, towel: '#f0e0d0' },
  banhista_m3:{ coat: '#6a4430', coatDark: '#4a2e20', skin: '#6a4430', hair: '#141418', legs: '#6a4430', implant: '#7dff6b', hairStyle: 'modern', towel: '#e8e8d8' },
  banhista_f: { coat: '#e0b890', coatDark: '#b89070', skin: '#e0b890', hair: '#2a1a14', legs: '#e0b890', implant: '#ff4fd8', hairStyle: 'bun', towel: '#f8d8e8', towelHigh: true },
  banhista_f2:{ coat: '#8a5a3a', coatDark: '#6a4028', skin: '#8a5a3a', hair: '#e8d8f0', legs: '#8a5a3a', implant: '#38f6ff', hairStyle: 'bun', towel: '#d8f0f8', towelHigh: true },
  banhista_f3:{ coat: '#f0d0c0', coatDark: '#c8a898', skin: '#f0d0c0', hair: '#d8502a', legs: '#f0d0c0', implant: '#7dff6b', hairStyle: 'long', towel: '#e8f8e0', towelHigh: true },
  banhista_f4:{ coat: '#5a3a2a', coatDark: '#3e2818', skin: '#5a3a2a', hair: '#141418', legs: '#5a3a2a', implant: '#ffd23f', hairStyle: 'bob', towel: '#f8e8c8', towelHigh: true },
  banhista_m4:{ coat: '#e8c8a8', coatDark: '#c0a080', skin: '#e8c8a8', hair: '#e8d040', legs: '#e8c8a8', implant: '#38f6ff', hairStyle: 'modern', towel: '#d8e8f8' },
  banhista_m5:{ coat: '#a87858', coatDark: '#80583e', skin: '#a87858', hair: '#2a2a2a', legs: '#a87858', implant: '#ff3355', hairStyle: 'bald', beard: true, wide: true, towel: '#f0f0e8' },
});

// ---------- consumíveis (valores reduzem fome, sede e cansaço) ----------
const CONSUMABLES = {
  barra:      { name: 'Barra de proteína sintética', fome: 30, text: 'Gosto de papelão com baunilha. Mas enche.' },
  noodle:     { name: 'Noodle instantâneo NutriMat', fome: 45, sede: -5, text: 'Salgado demais, quente demais, perfeito demais para as três da manhã.' },
  sushi:      { name: 'Sushi de alga cultivada', fome: 35, text: 'Alga de tanque e arroz de laboratório. O Sector 4 inteiro come isso.' },
  agua:       { name: 'Água filtrada', sede: 45, text: 'Água de verdade, filtrada três vezes. Coisa rara nesta cidade.' },
  neovolt:    { name: 'Energético NeoVolt', sede: 25, cansaco: 25, text: 'O coração acelera. Os olhos abrem. Vai cobrar o preço depois.' },
  cafelata:   { name: 'Café em lata', sede: 15, cansaco: 18, text: 'Amargo, morno, metálico. Funciona.' },
  espresso:   { name: 'Espresso duplo', sede: 10, cansaco: 35, text: 'Lumi tira um espresso perfeito. Vance sente o cérebro reiniciar.' },
  sanduiche:  { name: 'Sanduíche de cogumelo defumado', fome: 45, text: 'Pão de verdade. Lumi jura que é de verdade.' },
  bolo:       { name: 'Fatia de bolo de laranja-sangue', fome: 25, cansaco: 5, text: 'Doce o suficiente para lembrar que existe vida fora do caso.' },
  lamen:      { name: 'Lámen tonkotsu do Sr. Wen', fome: 70, sede: 20, cansaco: 10, text: 'Caldo cozido por dezoito horas, ovo marinado, cebolinha. O Sr. Wen nunca erra.' },
  cha:        { name: 'Chá de jasmim', sede: 35, cansaco: 10, text: 'Quente, perfumado. A chuva lá fora parece menos ácida.' },
  lasanha:    { name: 'Lasanha congelada', fome: 50, text: 'Três minutos no micro-ondas. O queijo borbulha. É quase um lar.' },
  agua_casa:  { name: 'Água da geladeira', sede: 40, text: 'Gelada. Vance bebe direto da garrafa, como sempre.' },
  // Chinatown
  cha_crisantemo: { name: 'Chá de crisântemo', sede: 30, cansaco: 12, text: 'A Sra. Mei serve o chá num bule de ferro. As flores se abrem devagar na água quente.' },
  bolinho_lotus:  { name: 'Bolinho de lótus', fome: 25, text: 'Massa macia, recheio de pasta de lótus. Doce sem exagero.' },
  ginseng:        { name: 'Chá de ginseng do Dr. Huang', sede: 15, cansaco: 35, text: 'Amargo como remédio. Porque é remédio. Em dez minutos, Vance enxerga mais nítido.' },
  gengibre:       { name: 'Bala de gengibre', cansaco: 8, text: 'Arde na garganta e acorda até a alma.' },
  har_gow:        { name: 'Har gow (pastel de camarão)', fome: 30, text: 'Massa translúcida, camarão de tanque. A Tia Lan dobra cada um com doze pregas.' },
  char_siu_bao:   { name: 'Char siu bao', fome: 40, text: 'Pão no vapor recheado de porco agridoce. Fofo como uma nuvem.' },
  siu_mai:        { name: 'Siu mai', fome: 30, text: 'Quatro siu mai num cestinho de bambu, fumegando.' },
  pato:           { name: 'Pato laqueado com arroz', fome: 65, sede: -5, text: 'Pele crocante, carne macia, molho de ameixa. Fong corta o pato com um cutelo do tamanho de um braço.' },
  bolo_lua:       { name: 'Bolo da lua', fome: 30, cansaco: 5, text: 'Recheio de semente de lótus e uma gema salgada no meio, como uma lua cheia.' },
  pao_abacaxi:    { name: 'Pão de abacaxi', fome: 25, text: 'Não tem abacaxi. Tem uma casquinha doce e crocante que parece um. Ninguém reclama.' },
  pessego:        { name: 'Pêssego de estufa', fome: 12, sede: 15, text: 'Suculento, doce, caro. Vance lambe o suco dos dedos.' },
  lichia:         { name: 'Lichias geladas', fome: 10, sede: 20, text: 'Doces e perfumadas. Lembram a infância de alguém, talvez a dele.' },
  cha_cevada:     { name: 'Chá de cevada gelado', sede: 40, text: 'Gelado, levemente torrado. Hana diz que é o que se bebe depois do banho.' },
  // rua
  ramen_shoyu:    { name: 'Ramen shoyu', fome: 55, sede: -5, text: 'Caldo escuro, macarrão firme, uma fatia de porco. O cozinheiro androide acena com a concha.' },
  gyoza:          { name: 'Gyoza na chapa', fome: 25, text: 'Seis pastéis dourados, crocantes por baixo.' },
  estimulante:    { name: 'Comprimido estimulante', cansaco: 30, fome: -5, text: 'Legal. Mais ou menos. Vance engole sem água e sente o coração disparar.' },
  eletrolitico:   { name: 'Bebida eletrolítica', sede: 45, text: 'Azul fluorescente. Gosto de chuva com açúcar.' },
  cerveja:        { name: 'Cerveja de arroz', sede: 25, cansaco: -5, text: 'Gelada e leve. Só uma. Está em serviço.' },
  cafe_d4:        { name: 'Café da delegacia', sede: 10, cansaco: 22, text: 'Requentado desde o turno da tarde. É um crime contra o café. Mas funciona.' },
  // feitos em casa
  omelete:        { name: 'Omelete de cogumelos', fome: 45, text: 'Ovos de verdade (quase), cogumelos e cebolinha. Vance ainda sabe cozinhar.' },
  lamen_casa:     { name: 'Lámen caseiro com ovo', fome: 55, sede: 10, text: 'Não chega aos pés do Sr. Wen, mas tem o gosto de casa.' },
  frango:         { name: 'Frango sintético grelhado', fome: 60, text: 'Dourado na frigideira, com alho e molho de soja. O apartamento inteiro cheira bem.' },
  cafe_casa:      { name: 'Café passado na hora', sede: 12, cansaco: 25, text: 'O ritual de sempre: água quente, pó, a caneca lascada do pai.' },
};

// máquinas e balcões: o que cada um oferece
const VENDORS = {
  maq_comida:   { title: 'NutriMat — máquina de comida', items: ['barra', 'noodle', 'sushi'] },
  maq_bebida:   { title: 'HydroPop — máquina de bebidas', items: ['agua', 'neovolt', 'cafelata'] },
  balcao_cafe:  { title: 'Café Neon — balcão', items: ['espresso', 'sanduiche', 'bolo'] },
  barraca_lamen:{ title: 'Barraca do Sr. Wen', items: ['lamen', 'cha'] },
  geladeira:    { title: 'Geladeira', items: ['lasanha', 'agua_casa'] },
  casa_cha:     { title: 'Casa de Chá Jade', items: ['cha', 'cha_crisantemo', 'bolinho_lotus'] },
  ervanaria:    { title: 'Ervanaria Dr. Huang', items: ['ginseng', 'gengibre'] },
  dimsum:       { title: 'Dim Sum da Tia Lan', items: ['har_gow', 'char_siu_bao', 'siu_mai'] },
  assados:      { title: 'Assados Fong', items: ['pato'] },
  padaria:      { title: 'Padaria Lua Dourada', items: ['bolo_lua', 'pao_abacaxi'] },
  frutas:       { title: 'Barraca de frutas', items: ['pessego', 'lichia'] },
  banho_balcao: { title: 'Balcão da Casa de Banho', items: ['cha_cevada', 'cha'] },
  ramen_bar:    { title: 'Bar de ramen', items: ['ramen_shoyu', 'gyoza', 'agua'] },
  starbytes:    { title: 'Starbytes Coffee', items: ['espresso', 'cafelata', 'bolo'] },
  mcdrones:     { title: 'Lanchonete', items: ['sanduiche', 'neovolt', 'agua'] },
  conveniencia: { title: '24-Eleven', items: ['barra', 'noodle', 'agua', 'neovolt'] },
  kolakola:     { title: 'Kola-Kola Bar', items: ['neovolt', 'agua', 'sanduiche'] },
  farmacia:     { title: 'Farmácia NeoVida', items: ['estimulante', 'eletrolitico', 'gengibre'] },
  bar_rua:      { title: 'Bar O Último Trago', items: ['cerveja', 'agua'] },
  cafe_d4:      { title: 'Cafeteira da delegacia', items: ['cafe_d4'] },
  cafeteira_casa: { title: 'Cafeteira', items: ['cafe_casa'] },
};

// receitas do fogão de casa
const RECIPES = [
  { id: 'omelete', food: '#e8c060', secs: 3 },
  { id: 'lamen_casa', food: '#e8d8a0', secs: 3.5 },
  { id: 'frango', food: '#c87a3a', secs: 4 },
];

// ---------- salas novas ----------
Object.assign(ROOMS, {
  // ---------------- apartamento de Vance ----------------
  home: {
    name: 'Apartamento de Vance — Sala e quarto', w: 9, h: 7, floor: 'wood', dark: 0.5, glass: true,
    neon: '#7dff6b', wallColor: ['#1e2420', '#141a16'],
    wallN: '.D.H.D.D.', wallW: '.......',
    zones: [{ x0: 5, y0: 2, x1: 8, y1: 6, floor: 'carpet' }],
    lights: [
      { x: 6.5, y: 3.5, z: 24, r: 55, color: '#ffb347' }, { x: 0.3, y: 3, z: 26, r: 60, color: '#4060ff' },
      { x: 3.5, y: 0.3, z: 30, r: 40, color: '#7dff6b' }, { x: 4.5, y: 3.5, z: 14, r: 40, color: '#38a0ff' },
    ],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'city', at: [45, 7], name: 'Porta → Rua' },
      { kind: 'exit', x: 5, y: 0, key: 'exit', to: 'home_kitchen', at: [1, 1], name: 'Porta → Cozinha' },
      { kind: 'exit', x: 7, y: 0, key: 'exit', to: 'home_bath', at: [1, 1], name: 'Porta → Banheiro' },
      { kind: 'bed', x: 6, y: 3, w: 2, d: 3, solid: true, key: 'cama_casa', name: 'Sua cama' },
      { kind: 'rug', x: 2, y: 3, w: 2, d: 2, col: '#2a3a30' },
      { kind: 'sofa', x: 1, y: 3, w: 1, d: 2, solid: true, key: 'sofa_casa', name: 'Sofá', seat: true },
      { kind: 'tv', x: 4, y: 3, solid: true, face: 'e', key: 'tv_casa', name: 'Holo-TV' },
      { kind: 'desk', x: 3, y: 0, solid: true, key: 'mesa_casa', name: 'Escrivaninha' },
      { kind: 'bookshelf', x: 8, y: 1, solid: true, key: 'estante', name: 'Estante' },
      { kind: 'lamp', x: 0, y: 0, solid: true },
      { kind: 'plant', x: 0, y: 6, solid: true, key: 'planta', name: 'Planta holográfica' },
    ],
    npcs: [{ id: 'byte', x: 3, y: 5, wander: { area: [0, 1, 8, 6] } }],
  },
  home_kitchen: {
    name: 'Apartamento de Vance — Cozinha', w: 7, h: 6, floor: 'kitchen', dark: 0.45,
    neon: '#ffd8a0', wallColor: ['#2a2a30', '#202026'],
    wallN: '.DCCWC.', wallW: 'CC.W..',
    lights: [{ x: 3.5, y: 2.5, z: 34, r: 70, color: '#ffe8c8' }, { x: 4.5, y: 0.3, z: 28, r: 40, color: '#7fd8ff' }],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'home', at: [5, 1], name: 'Porta → Sala' },
      { kind: 'counter', x: 2, y: 0, solid: true, key: 'bancada', name: 'Bancada' },
      { kind: 'stove', x: 3, y: 0, solid: true, key: 'fogao', name: 'Fogão' },
      { kind: 'sink', x: 4, y: 0, solid: true, key: 'pia', name: 'Pia' },
      { kind: 'coffee_machine', x: 5, y: 0, solid: true, key: 'cafeteira_casa', name: 'Cafeteira' },
      { kind: 'fridge', x: 6, y: 0, solid: true, key: 'geladeira', name: 'Geladeira' },
      { kind: 'table', x: 3, y: 3, solid: true, key: 'mesa_cozinha', name: 'Mesa da cozinha' },
      { kind: 'chair', x: 3, y: 2, solid: true, key: 'cadeira', name: 'Cadeira', seat: true, col: '#5a3a2a' },
      { kind: 'chair', x: 2, y: 3, solid: true, face: 'e', key: 'cadeira', name: 'Cadeira', seat: true, col: '#5a3a2a' },
      { kind: 'trash', x: 0, y: 5, solid: true, key: 'lixeira_casa', name: 'Lixeira' },
    ],
  },
  home_bath: {
    name: 'Apartamento de Vance — Banheiro', w: 6, h: 5, floor: 'smalltile', dark: 0.42,
    neon: '#7fd8ff', wallColor: ['#3a4a54', '#2e3c44'],
    wallN: 'TDTmTT', wallW: 'TTTTT',
    lights: [{ x: 3, y: 2, z: 34, r: 60, color: '#e8f4ff' }],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'home', at: [7, 1], name: 'Porta → Sala' },
      { kind: 'basin', x: 3, y: 0, solid: true, key: 'pia_banheiro', name: 'Pia e espelho' },
      { kind: 'shower', x: 5, y: 0, solid: true, key: 'chuveiro', name: 'Chuveiro' },
      { kind: 'toilet', x: 0, y: 3, solid: true, key: 'vaso', name: 'Vaso sanitário' },
      { kind: 'rug', x: 4, y: 1, w: 1, d: 1, col: '#3a6a8a' },
      { kind: 'plant', x: 5, y: 4, solid: true, key: 'planta', name: 'Planta holográfica' },
    ],
  },

  // ---------------- delegacia ----------------
  delegacia: {
    name: 'Delegacia do Distrito 4', w: 20, h: 14, floor: 'office', dark: 0.4, glass: true,
    neon: '#38a0ff', wallColor: ['#18202e', '#10161f'],
    wallN: '..D.A..RXXXXR.Q..RH.', wallW: '..............',
    zones: [
      { x0: 17, y0: 0, x1: 19, y1: 4, floor: 'carpet' },
      { x0: 15, y0: 10, x1: 19, y1: 13, floor: 'lab' },
      { x0: 0, y0: 10, x1: 3, y1: 13, floor: 'cell' },
      { x0: 7, y0: 11, x1: 12, y1: 13, floor: 'kitchen' },
      { x0: 8, y0: 0, x1: 11, y1: 0, floor: 'cell' },
    ],
    lights: [
      { x: 4, y: 3, z: 34, r: 80, color: '#cfe0ff' }, { x: 10, y: 5, z: 34, r: 90, color: '#cfe0ff' },
      { x: 18, y: 2, z: 30, r: 60, color: '#ffd8a0' }, { x: 17, y: 11.5, z: 34, r: 70, color: '#e8f8ff' },
      { x: 2, y: 11.5, z: 34, r: 45, color: '#fff0c8', flicker: true }, { x: 9.5, y: 12, z: 30, r: 60, color: '#ffd8a0' },
      { x: 9.5, y: 0.4, z: 30, r: 50, color: '#ff3355', flicker: true }, { x: 0.3, y: 6, z: 26, r: 60, color: '#4060ff' },
      { x: 7, y: 6, z: 12, r: 50, color: '#38f6ff' },
    ],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'city', at: [35, 16], name: 'Saída → Rua' },
      // recepção
      { kind: 'desk', x: 3, y: 2, w: 3, d: 1, solid: true, key: 'recepcao_d4', name: 'Balcão da recepção' },
      { kind: 'bench', x: 0, y: 3, solid: true, key: 'banco', name: 'Banco de espera', seat: true },
      { kind: 'bench', x: 0, y: 4, solid: true, key: 'banco', name: 'Banco de espera', seat: true },
      { kind: 'filing', x: 5, y: 0, solid: true, key: 'arquivo', name: 'Arquivo de aço' },
      { kind: 'filing', x: 6, y: 0, solid: true, key: 'arquivo', name: 'Arquivo de aço' },
      { kind: 'shopfront', x: 9, y: 1, key: 'celas', name: 'Celas de detenção' },
      // salão
      { kind: 'holo_map', x: 6, y: 5, w: 2, d: 2, solid: true, key: 'mapa_holo', name: 'Mapa holográfico do distrito' },
      { kind: 'desk', x: 9, y: 4, w: 2, d: 1, solid: true, key: 'mesa_policial', name: 'Mesa de policial' },
      { kind: 'chair', x: 9, y: 3, solid: true, key: 'cadeira', name: 'Cadeira', seat: true, col: '#2a3446' },
      { kind: 'desk', x: 9, y: 7, w: 2, d: 1, solid: true, key: 'mesa_policial2', name: 'Mesa de policial' },
      { kind: 'chair', x: 10, y: 6, solid: true, key: 'cadeira', name: 'Cadeira', seat: true, col: '#2a3446' },
      { kind: 'desk', x: 12, y: 7, w: 2, d: 1, solid: true, key: 'mesa_policial3', name: 'Mesa de policial' },
      { kind: 'desk', x: 13, y: 3, w: 2, d: 1, solid: true, key: 'mesa_vance', name: 'Sua mesa (quadro do caso)' },
      { kind: 'terminal', x: 15, y: 3, solid: true, key: 'term_delegacia', name: 'Terminal da polícia', screen: '#38a0ff' },
      { kind: 'chair', x: 13, y: 2, solid: true, key: 'cadeira_vance', name: 'Sua cadeira', seat: true, col: '#3a2a20' },
      // sala da capitã
      { kind: 'partition', x: 16, y: 0, d: 2, axis: 'y', solid: true },
      { kind: 'partition', x: 16, y: 3, d: 2, axis: 'y', solid: true },
      { kind: 'partition', x: 16, y: 5, w: 2, axis: 'x', solid: true },
      { kind: 'partition', x: 19, y: 5, w: 1, axis: 'x', solid: true },
      { kind: 'desk', x: 17, y: 1, w: 2, d: 1, solid: true, key: 'mesa_okafor', name: 'Mesa da capitã' },
      { kind: 'plant', x: 19, y: 0, solid: true, key: 'planta', name: 'Planta holográfica' },
      // laboratório forense
      { kind: 'partition', x: 15, y: 9, w: 2, axis: 'x', solid: true, neon: '#7dff6b' },
      { kind: 'partition', x: 18, y: 9, w: 2, axis: 'x', solid: true, neon: '#7dff6b' },
      { kind: 'partition', x: 14, y: 9, d: 2, axis: 'y', solid: true, neon: '#7dff6b' },
      { kind: 'partition', x: 14, y: 12, d: 2, axis: 'y', solid: true, neon: '#7dff6b' },
      { kind: 'lab_bench', x: 16, y: 13, w: 3, d: 1, solid: true, key: 'mesa_kenji', name: 'Bancada forense' },
      { kind: 'evidence_locker', x: 19, y: 10, solid: true, key: 'armario_provas', name: 'Armário de provas' },
      // sala de interrogatório
      { kind: 'partition', x: 0, y: 9, w: 2, axis: 'x', solid: true, h: 30 },
      { kind: 'partition', x: 3, y: 9, w: 1, axis: 'x', solid: true, h: 30 },
      { kind: 'partition', x: 4, y: 9, d: 5, axis: 'y', solid: true, h: 30 },
      { kind: 'int_table', x: 1, y: 11, w: 2, d: 1, solid: true, key: 'mesa_interrogatorio', name: 'Mesa de interrogatório' },
      { kind: 'chair', x: 1, y: 10, solid: true, key: 'cadeira', name: 'Cadeira', seat: true, col: '#4a4e56' },
      // copa
      { kind: 'sofa', x: 7, y: 11, w: 1, d: 2, solid: true, key: 'sofa_d4', name: 'Sofá da copa', seat: true },
      { kind: 'coffee_machine', x: 9, y: 13, solid: true, key: 'cafeteira_d4', name: 'Cafeteira' },
      { kind: 'vending_food', x: 10, y: 13, solid: true, key: 'maq_comida', name: 'Máquina de comida NutriMat' },
      { kind: 'vending_drink', x: 11, y: 13, solid: true, key: 'maq_bebida', name: 'Máquina de bebidas HydroPop' },
      { kind: 'water_cooler', x: 12, y: 13, solid: true, key: 'bebedouro', name: 'Bebedouro' },
      { kind: 'plant', x: 0, y: 7, solid: true, key: 'planta', name: 'Planta holográfica' },
    ],
    npcs: [
      { id: 'unidade7', x: 4, y: 1 },
      { id: 'okafor', x: 18, y: 3, wander: { area: [17, 2, 19, 4] } },
      { id: 'kenji', x: 17, y: 11, wander: { area: [15, 10, 19, 12] } },
    ],
    walkers: [
      { look: 'cop1', name: 'Policial Reyes', lines: 'cops', x: 8, y: 2 },
      { look: 'cop2', name: 'Policial Tanaka', lines: 'cops', x: 12, y: 5 },
      { look: 'cop3', name: 'Sargento Moura', lines: 'cops', x: 6, y: 9 },
      { look: 'cop4', name: 'Policial Ivanova', lines: 'cops', x: 13, y: 10 },
    ],
  },

  // ---------------- café ----------------
  cafe: {
    name: 'Café Neon', w: 10, h: 7, floor: 'wood', dark: 0.4, glass: true,
    neon: '#ff8ad8', wallColor: ['#2a1a24', '#1e1218'],
    wallN: '.D..MM..BB', wallW: '.......',
    lights: [
      { x: 6, y: 1.5, z: 26, r: 70, color: '#ffb8e0' }, { x: 3, y: 4.5, z: 26, r: 60, color: '#ffd8a0' },
      { x: 8, y: 4.5, z: 26, r: 60, color: '#ffd8a0' }, { x: 0.3, y: 3, z: 26, r: 60, color: '#4060ff' },
    ],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'city', at: [14, 29], name: 'Saída → Rua' },
      { kind: 'bar', x: 5, y: 1, w: 3, d: 1, solid: true, key: 'balcao_cafe', name: 'Balcão do café' },
      { kind: 'espresso', x: 8, y: 1, solid: true, key: 'balcao_cafe', name: 'Máquina de espresso' },
      { kind: 'table', x: 2, y: 4, solid: true, key: 'mesa_cafe', name: 'Mesa' },
      { kind: 'table', x: 6, y: 4, solid: true, key: 'mesa_cafe', name: 'Mesa' },
      { kind: 'chair', x: 6, y: 3, solid: true, key: 'cadeira', name: 'Cadeira', seat: true, col: '#5a2a4a' },
      { kind: 'table', x: 8, y: 5, solid: true, key: 'mesa_cafe', name: 'Mesa' },
      { kind: 'chair', x: 7, y: 5, solid: true, face: 'e', key: 'cadeira', name: 'Cadeira', seat: true, col: '#5a2a4a' },
      { kind: 'plant', x: 9, y: 6, solid: true, key: 'planta', name: 'Planta holográfica' },
    ],
    npcs: [{ id: 'lumi', x: 6, y: 0, wander: { area: [5, 0, 7, 0] } }, { id: 'ilsa', x: 2, y: 5 }, { id: 'jax', x: 8, y: 3, wander: { area: [7, 2, 9, 3] } }],
  },

  // ---------------- casa de banho: recepção, vestiário, onsen e sauna ----------------
  bathhouse: {
    name: 'Casa de Banho Lótus — Recepção', w: 8, h: 6, floor: 'darkwood', dark: 0.45,
    neon: '#ff3355', wallColor: ['#3a2418', '#2e1c12'],
    wallN: '.D..J.O.', wallW: 'JJJJJJ',
    lights: [{ x: 4, y: 1.5, z: 30, r: 60, color: '#ffb347' }, { x: 6.5, y: 0.4, z: 30, r: 40, color: '#ff8a6a' }, { x: 1.5, y: 4, z: 30, r: 50, color: '#ff8a6a' }],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'city', at: [39, 45], name: 'Saída → Chinatown' },
      { kind: 'exit', x: 6, y: 0, key: 'exit', to: 'locker', at: [1, 1], name: 'Cortina → Vestiário', need: 'clothes' },
      { kind: 'desk', x: 3, y: 1, w: 3, d: 1, solid: true, key: 'balcao_banho', name: 'Balcão da recepção' },
      { kind: 'getabako', x: 0, y: 2, d: 3, solid: true, key: 'sapateira', name: 'Sapateira' },
      { kind: 'maneki', x: 2, y: 1, solid: true, key: 'gato_sorte', name: 'Gato da sorte' },
      { kind: 'bench', x: 3, y: 5, solid: true, key: 'banco', name: 'Banco de espera', seat: true },
      { kind: 'bench', x: 4, y: 5, solid: true, key: 'banco', name: 'Banco de espera', seat: true },
      { kind: 'bamboo', x: 7, y: 5, solid: true, key: 'bambu', name: 'Bambu' },
      { kind: 'lantern', x: 7, y: 1 }, { kind: 'lantern', x: 1, y: 5 },
    ],
    npcs: [{ id: 'hana', x: 4, y: 0 }],
    walkers: [
      { look: 'ped5', name: 'Cliente', lines: 'bath', x: 4, y: 5, seat: 'banco' },
      { look: 'ped7', name: 'Cliente', lines: 'bath', x: 6, y: 3, area: [5, 2, 7, 4] },
    ],
  },
  locker: {
    name: 'Casa de Banho Lótus — Vestiário', w: 8, h: 6, floor: 'tatami', dark: 0.45,
    neon: '#ff8a6a', wallColor: ['#3a2418', '#2e1c12'],
    wallN: '.O..m.O.', wallW: 'JJJJJJ',
    lights: [{ x: 4, y: 2.5, z: 32, r: 70, color: '#ffd8a0' }],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'bathhouse', at: [6, 1], name: 'Cortina → Recepção', need: 'clothes' },
      { kind: 'exit', x: 6, y: 0, key: 'exit', to: 'lavagem', at: [1, 1], name: 'Cortina → Sala de lavagem (洗い場)', need: 'towel' },
      { kind: 'lockers', x: 0, y: 1, d: 4, solid: true, key: 'armario', name: 'Armários', col: '#6a4a2a' },
      { kind: 'lockers', x: 2, y: 0, w: 2, solid: true, key: 'armario', name: 'Armários', col: '#6a4a2a' },
      { kind: 'basin', x: 4, y: 0, solid: true, key: 'pia_vestiario', name: 'Pia' },
      { kind: 'bench', x: 3, y: 3, solid: true, key: 'banco', name: 'Banco', seat: true },
      { kind: 'bench', x: 4, y: 3, solid: true, key: 'banco', name: 'Banco', seat: true },
      { kind: 'plant', x: 7, y: 5, solid: true, key: 'planta', name: 'Planta' },
    ],
    walkers: [
      { look: 'banhista_m', name: 'Banhista', lines: 'bath', x: 6, y: 3, area: [5, 2, 7, 4] },
      { look: 'banhista_f3', name: 'Banhista', lines: 'bath', x: 4, y: 3, seat: 'banco' },
    ],
  },
  lavagem: {
    name: 'Casa de Banho Lótus — Sala de lavagem 洗い場', w: 10, h: 7, floor: 'smalltile', dark: 0.42,
    neon: '#7fd8ff', wallColor: ['#3a4a54', '#2e3c44'],
    wallN: '.O.wwwww.O', wallW: '.wwwww.',
    lights: [{ x: 5, y: 1.5, z: 32, r: 70, color: '#e8f4ff' }, { x: 1.5, y: 3.5, z: 30, r: 60, color: '#ffd8a0' }, { x: 6, y: 5, z: 20, r: 60, color: '#7fd8ff' }],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'locker', at: [6, 1], name: 'Cortina → Vestiário' },
      { kind: 'exit', x: 9, y: 0, key: 'exit', to: 'onsen', at: [1, 1], name: 'Porta → Onsen (温泉)' },
      ...[3, 4, 5, 6, 7].map(x => ({ kind: 'wash_stool', x, y: 1, solid: true, key: 'banquinho', name: 'Posto de lavagem', seat: true })),
      ...[2, 3, 4].map(y => ({ kind: 'wash_stool', x: 1, y, solid: true, key: 'banquinho', name: 'Posto de lavagem', seat: true })),
      { kind: 'bucket', x: 8, y: 1, solid: true, key: 'balde', name: 'Baldes de madeira' },
      { kind: 'bucket', x: 1, y: 5, solid: true, key: 'balde', name: 'Baldes de madeira' },
      { kind: 'onsen', x: 5, y: 4, w: 2, d: 2, water: 'hot', key: 'kakeyu', name: 'Tina de água quente (かけ湯)' },
      { kind: 'plant', x: 9, y: 6, solid: true, key: 'bambu', name: 'Bambu' },
    ],
    walkers: [
      { look: 'banhista_f', name: 'Banhista', lines: 'bath', x: 4, y: 1, seat: 'banquinho' },
      { look: 'banhista_m4', name: 'Banhista', lines: 'bath', x: 6, y: 1, seat: 'banquinho' },
      { look: 'banhista_f4', name: 'Banhista', lines: 'bath', x: 1, y: 3, seat: 'banquinho' },
      { look: 'banhista_m5', name: 'Banhista', lines: 'bath', x: 7, y: 1, seat: 'banquinho' },
      { look: 'banhista_f2', name: 'Banhista', lines: 'bath', x: 3, y: 4, area: [2, 3, 8, 6] },
      { look: 'banhista_m2', name: 'Banhista', lines: 'bath', x: 8, y: 4, area: [2, 3, 8, 6] },
    ],
  },
  onsen: {
    name: 'Casa de Banho Lótus — Onsen misto 温泉', w: 14, h: 10, floor: 'stone', dark: 0.5, glass: true,
    neon: '#ff8a6a', wallColor: ['#3a3430', '#2e2824'],
    wallN: '.O.www.www..O.', wallW: '..........',
    zones: [{ x0: 0, y0: 0, x1: 13, y1: 1, floor: 'darkwood' }],
    lights: [
      { x: 5.5, y: 5, z: 16, r: 90, color: '#7fd8ff' }, { x: 11.5, y: 7.5, z: 16, r: 50, color: '#a8e8ff' },
      { x: 12.5, y: 3.5, z: 14, r: 50, color: '#ffb347' }, { x: 6, y: 0.5, z: 30, r: 60, color: '#ffd8a0' },
      { x: 0.3, y: 5, z: 26, r: 70, color: '#4060ff' },
    ],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'lavagem', at: [9, 1], name: 'Porta → Sala de lavagem' },
      { kind: 'exit', x: 12, y: 0, key: 'exit', to: 'sauna', at: [1, 1], name: 'Porta → Sauna' },
      { kind: 'onsen', x: 2, y: 3, w: 7, d: 5, water: 'hot', key: 'onsen', name: 'Onsen (温泉)' },
      { kind: 'onsen', x: 10, y: 6, w: 3, d: 3, water: 'cold', cold: true, key: 'mizuburo', name: 'Banho frio (水風呂)' },
      { kind: 'wash_stool', x: 3, y: 1, solid: true, key: 'banquinho', name: 'Posto de lavagem', seat: true },
      { kind: 'wash_stool', x: 4, y: 1, solid: true, key: 'banquinho', name: 'Posto de lavagem', seat: true },
      { kind: 'wash_stool', x: 7, y: 1, solid: true, key: 'banquinho', name: 'Posto de lavagem', seat: true },
      { kind: 'wash_stool', x: 9, y: 1, solid: true, key: 'banquinho', name: 'Posto de lavagem', seat: true },
      { kind: 'rock', x: 1, y: 3, solid: true, key: 'pedra', name: 'Pedra vulcânica' },
      { kind: 'rock', x: 9, y: 3, solid: true, key: 'pedra', name: 'Pedra vulcânica' },
      { kind: 'rock', x: 1, y: 8, solid: true, key: 'pedra', name: 'Pedra vulcânica' },
      { kind: 'bench', x: 12, y: 8, solid: true, key: 'banco', name: 'Banco de pedra', seat: true },
      { kind: 'stone_lantern', x: 12, y: 3, solid: true, key: 'toro', name: 'Lanterna de pedra (tōrō)' },
      { kind: 'bamboo', x: 13, y: 5, solid: true, key: 'bambu', name: 'Bambu' },
      { kind: 'bamboo', x: 0, y: 9, solid: true, key: 'bambu', name: 'Bambu' },
      { kind: 'bucket', x: 10, y: 1, solid: true, key: 'balde', name: 'Baldes de madeira' },
    ],
    npcs: [{ id: 'goro', x: 7, y: 6, look: 'goro_bath' }],
    walkers: [
      // dentro d'água
      { look: 'banhista_m', name: 'Banhista', lines: 'bath', x: 3, y: 5, area: [2, 3, 8, 7], speed: 0.5 },
      { look: 'banhista_f', name: 'Banhista', lines: 'bath', x: 5, y: 4, area: [2, 3, 8, 7], speed: 0.5 },
      { look: 'banhista_m3', name: 'Banhista', lines: 'bath', x: 4, y: 7, area: [2, 3, 8, 7], speed: 0.5 },
      { look: 'banhista_f4', name: 'Banhista', lines: 'bath', x: 11, y: 7, area: [10, 6, 12, 8], speed: 0.4 },
      // fora d'água: lavando, sentadas na pedra e caminhando pelo deque
      { look: 'banhista_f3', name: 'Banhista', lines: 'bath', x: 3, y: 1, seat: 'banquinho' },
      { look: 'banhista_f2', name: 'Banhista', lines: 'bath', x: 7, y: 1, seat: 'banquinho' },
      { look: 'banhista_f', name: 'Banhista', lines: 'bath', x: 12, y: 8, seat: 'banco' },
      { look: 'banhista_f4', name: 'Banhista', lines: 'bath', x: 11, y: 2, area: [10, 1, 13, 4] },
      { look: 'banhista_m4', name: 'Banhista', lines: 'bath', x: 0, y: 5, area: [0, 4, 1, 7] },
    ],
  },
  sauna: {
    name: 'Casa de Banho Lótus — Sauna', w: 7, h: 6, floor: 'slats', dark: 0.5,
    neon: '#ff6a2a', wallColor: ['#6a4a2a', '#5a3e22'],
    wallN: 'JOJJJJJ', wallW: 'JJJJJJ',
    lights: [{ x: 5.5, y: 4.5, z: 10, r: 70, color: '#ff8a3d' }, { x: 3.5, y: 1, z: 34, r: 50, color: '#ffb347' }],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'onsen', at: [12, 1], name: 'Porta → Onsen' },
      { kind: 'sauna_bench', x: 3, y: 0, w: 4, d: 1, h: 12, solid: true, key: 'banco_sauna', name: 'Banco alto da sauna', seat: true },
      { kind: 'sauna_bench', x: 3, y: 1, w: 4, d: 1, h: 6, solid: true, key: 'banco_sauna', name: 'Banco da sauna', seat: true },
      { kind: 'sauna_stove', x: 5, y: 4, solid: true, key: 'sauna_fogao', name: 'Fogão de pedras' },
      { kind: 'bucket', x: 4, y: 4, solid: true, key: 'balde_sauna', name: 'Balde com concha' },
    ],
    walkers: [
      { look: 'banhista_m2', name: 'Banhista', lines: 'sauna', x: 5, y: 0, seat: 'banco_sauna' },
      { look: 'banhista_f3', name: 'Banhista', lines: 'sauna', x: 3, y: 0, seat: 'banco_sauna' },
      { look: 'banhista_m3', name: 'Banhista', lines: 'sauna', x: 4, y: 1, seat: 'banco_sauna' },
      { look: 'banhista_f2', name: 'Banhista', lines: 'sauna', x: 6, y: 1, seat: 'banco_sauna' },
    ],
  },
});


// ---------- hotel ----------
// porta da frente do lobby leva à rua; polícia no lobby e perícia na suíte
// a porta de vidro fica na parede da frente (oeste), entre os tiles 5 e 6
ROOMS.lobby.objects.push({ kind: 'exit', x: 0, y: 5, key: 'exit', to: 'city', at: [15, 16], name: 'Porta da frente → Rua' });
ROOMS.lobby.objects.push({ kind: 'exit', x: 0, y: 6, key: 'exit', to: 'city', at: [15, 16], name: 'Porta da frente → Rua' });
ROOMS.lobby.objects.push({ kind: 'vending_drink', x: 10, y: 0, solid: true, key: 'maq_bebida', name: 'Máquina de bebidas HydroPop' });
ROOMS.lobby.objects.find(o => o.key === 'sofa').seat = true;
ROOMS.lobby.objects.filter(o => o.kind === 'stool').forEach(o => { o.key = 'banqueta'; o.name = 'Banqueta do bar'; o.seat = true; });
ROOMS.lobby.walkers = [
  { look: 'cop1', name: 'Policial Reyes', lines: 'hotelcops', x: 7, y: 7, area: [5, 4, 11, 9] },
  { look: 'cop2', name: 'Policial Duarte', lines: 'hotelcops', x: 1, y: 4, area: [1, 4, 2, 7] },
  { look: 'recep1', name: 'Recepcionista Clara', lines: 'recepcao', x: 3, y: 1, area: [3, 1, 4, 1] },
  { look: 'recep2', name: 'Concierge Otávio', lines: 'concierge', x: 6, y: 1, area: [5, 1, 6, 1] },
  { look: 'bellhop', name: 'Mensageiro Pipo', lines: 'mensageiro', x: 2, y: 4, area: [1, 4, 4, 7] },
  { look: 'ped8', name: 'Hóspede retido', lines: 'hospede', x: 1, y: 8, seat: 'sofa' },
];
Object.assign(LOOKS, {
  recep1:  { coat: '#5a1a3a', coatDark: '#3a0e26', skin: '#e0b890', hair: '#2a1a14', legs: '#1a1020', implant: '#ff4fd8', shirt: '#e8e0d8', hairStyle: 'bun', tie: '#ffd23f' },
  recep2:  { coat: '#1a1424', coatDark: '#0e0a16', skin: '#8a5a3a', hair: '#d8d8e0', legs: '#141018', implant: '#ffd23f', shirt: '#e8e0d8', hairStyle: 'slick', tie: '#ff4fd8' },
  bellhop: { coat: '#a81a2a', coatDark: '#6a0e18', skin: '#e8c8a8', hair: '#6a3a1a', legs: '#1a1a24', implant: '#ffd23f', shirt: '#ffd23f', hairStyle: 'short', cap: '#a81a2a' },
});
ROOMS.corridor.objects.push({ kind: 'vending_food', x: 11, y: 3, solid: true, key: 'maq_comida', name: 'Máquina de comida NutriMat' });
ROOMS.suite.objects.push(
  { kind: 'marker', x: 4, y: 4, ox: 0.75, oy: 0.3, n: 1 }, { kind: 'marker', x: 6, y: 4, ox: 0.3, oy: 0.75, n: 2 },
  { kind: 'marker', x: 6, y: 5, ox: 0.85, oy: 0.25, n: 3 }, { kind: 'marker', x: 8, y: 1, ox: 0.4, oy: 0.85, n: 4 },
  { kind: 'floodlight', x: 9, y: 5, solid: true, key: 'refletor', name: 'Refletor da perícia' },
  { kind: 'forensic_kit', x: 0, y: 7, solid: true, key: 'kit_pericia', name: 'Maleta da perícia' },
);
ROOMS.suite.lights.push({ x: 9.3, y: 5.3, z: 22, r: 70, color: '#fff4d0' });
ROOMS.suite.npcs = [
  { id: 'ana', x: 4, y: 3, spots: [[4, 3, 'kneel'], [6, 6, 'stand'], [8, 2, 'kneel'], [3, 6, 'stand']] },
  { id: 'rui', x: 7, y: 6, spots: [[7, 6, 'kneel'], [9, 2, 'stand'], [5, 2, 'kneel'], [8, 4, 'stand']] },
];
// suspeitos andam pelo hotel (menos a viúva, no bar, e a IRIS)
ROOMS.lobby.npcs.find(n => n.id === 'victor').wander = { area: [3, 3, 9, 6] };
ROOMS.lobby.npcs.find(n => n.id === 'helena').wander = { area: [5, 7, 11, 10] };
ROOMS.corridor.npcs.find(n => n.id === 'tomas').wander = { area: [2, 1, 9, 3] };

// falas genéricas dos figurantes
const EXTRA_LINES = {
  recepcao: ['Boa noite, detetive. Infelizmente não posso fazer check-in de ninguém esta noite. Ordens da polícia. Da sua polícia.', 'O sistema de chaves está fora do ar desde as onze. O Sr. Rossi disse que é "manutenção".', 'Trabalho aqui há seis anos. Nunca vi o hotel tão silencioso.', 'O Sr. Pendelton sempre pedia a suíte 404. Dizia que era o número da sorte dele.', 'Se precisar de alguma coisa, é só tocar a campainha. Ela não funciona, mas eu vejo.', 'Os hóspedes estão nervosos. Um deles tentou sair pela porta da cozinha.'],
  concierge: ['Concierge Otávio, ao seu dispor. Restaurante, transporte, discrição. Principalmente discrição.', 'Este hotel já foi o mais elegante do Sector 4. Hoje é o mais elegante com goteiras.', 'O gerente anda muito pelos fundos ultimamente. Não que eu repare. Um concierge não repara.', 'A Sra. Pendelton pediu três martinis desde a meia-noite. Três. Eu repararia, se fosse do tipo que repara.', 'Táxi aéreo? Lamento, detetive, o céu está fechado. Só o seu carro roda nesta chuva.'],
  mensageiro: ['Quer que eu leve alguma coisa, detetive? Tô sem nada pra fazer. Ninguém entra, ninguém sai.', 'Essas malas são de um casal que ia subir às onze. Agora tão presos no sofá.', 'Vi a doutora descendo do elevador de serviço ontem. Ou foi anteontem? Aqui todo dia é noite.', 'Gorjeta? Não, não, imagina. Mas se quiser...', 'Os policiais lá fora tão encharcados. Levei café, mas a chuva entrou no copo.'],
  hospede: ['Viemos para o aniversário de casamento. Agora somos testemunhas de um assassinato. Romântico.', 'Ninguém me deixa subir pro quarto. Minha escova de dentes está lá em cima!', 'Detetive, quanto tempo isso vai demorar? Meu voo é às seis. Se é que vai ter voo.', 'Ouvi um barulho lá em cima, perto das onze. Achei que era trovão.'],
  cops: ['Detetive Vance! A capitã está de péssimo humor hoje.', 'O café acabou de novo. Alguém roubou a última cápsula.', 'Três chamados de briga em Chinatown. Noite normal.', 'Ouvi dizer que o caso Pendelton é seu. Boa sorte. Vai precisar.', 'Se for falar com o Kenji, leve um café pra ele. Ele trabalha melhor com cafeína.', 'O sistema de câmeras caiu de novo com a tempestade.', 'A Unidade 7 tá falando sozinha de novo. Acho que é atualização.'],
  hotelcops: ['A perícia ainda está lá em cima, detetive.', 'Ninguém sai do hotel sem autorização. Ordens da capitã.', 'O gerente não para de suar. Já reparou?', 'Essa chuva tá entrando pela porta giratória.'],
  bath: ['Hmm... a água está perfeita hoje.', 'Policial? Aqui dentro todo mundo é só gente pelada, detetive.', 'Venho aqui toda noite depois do turno. É o único lugar quente da cidade.', 'Não olhe para o senhor Goro por muito tempo. Ele não gosta.', 'O banho frio depois da sauna. Confie em mim.', 'Dizem que a fonte é termal de verdade. Eu acho que é aquecedor.'],
  sauna: ['Joga mais água nas pedras, vai.', 'Noventa graus. Daqui a pouco vou ver meu avô.', 'Respira fundo. O calor tira até o veneno da cidade.'],
};

// evidência e dedução opcionais vindas da cidade
Object.assign(EVIDENCE, {
  e_dividas: { name: 'Dívidas de Rossi', short: 'Dívidas', kind: 'depoimento',
    desc: 'Segundo Goro, Victor Rossi deve dois milhões de créditos ao Sindicato Lótus. O prazo vence esta semana — e o Sindicato não costuma esperar.' },
});
DEDUCTIONS.push({ id: 'd_desespero', a: 'e_dividas', b: 'e_falencia', name: 'Homem encurralado',
  desc: 'Falido e devendo ao Sindicato Lótus, Victor tinha uma única saída: a assinatura de Arthur. A qualquer custo.' });

// ---------- Casa de Chá Matsurika (茉莉花) em Chinatown e a chantagem ----------
Object.assign(LOOKS, {
  nozomi: { coat: '#1a1030', coatDark: '#0e0820', skin: '#f0d0b0', hair: '#2a1a3a', legs: '#1a1030', implant: '#00e5ff', shirt: '#ff3355', hairStyle: 'bun', long: true },
  su:   { coat: '#2a0e1a', coatDark: '#1a0810', skin: '#e8c8a8', hair: '#141418', legs: '#2a0e1a', implant: '#ffd23f', shirt: '#c8a020', hairStyle: 'bun', long: true },
  jade: { coat: '#b81a2a', coatDark: '#7a1018', skin: '#e0b890', hair: '#141418', legs: '#b81a2a', implant: '#ff4fd8', shirt: '#ffd23f', hairStyle: 'long', long: true, rim: [255, 79, 216] },
  lirio:{ coat: '#3a1a5a', coatDark: '#24103a', skin: '#8a5a3a', hair: '#e8d8f0', legs: '#3a1a5a', implant: '#38f6ff', shirt: '#e8c8f0', hairStyle: 'bob', long: true },
});
ROOMS.bordel = {
  name: 'Casa de Chá Matsurika 茉莉花', w: 9, h: 7, floor: 'tatami', dark: 0.45,
  neon: '#e8b860', wallColor: ['#4a2e18', '#3a2414'],
  wallN: 'YUYUYZYYY', wallW: 'YYYYYYY',
  zones: [{ x0: 0, y0: 0, x1: 2, y1: 1, floor: 'stone' }, { x0: 3, y0: 0, x1: 8, y1: 6, floor: 'tatami' }, { x0: 0, y0: 2, x1: 2, y1: 6, floor: 'tatami' }],
  lights: [
    { x: 4.5, y: 3.5, z: 30, r: 85, color: '#ffc880' }, { x: 7.5, y: 1.5, z: 24, r: 50, color: '#ffb860' },
    { x: 1, y: 5.5, z: 16, r: 50, color: '#ffb860' },
  ],
  objects: [
    { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'city', at: [49, 37], name: 'Saída → Chinatown' },
    { kind: 'exit', x: 3, y: 0, key: 'exit', to: 'bordel_quarto', at: [1, 1], name: 'Corredor das salas privativas', needFlag: 'itoko_cliente', lockedMsg: 'A Nozomi se curva, educada, e fecha o caminho: "As salas privativas são só para quem reservou a cerimônia, senhor. Fale comigo primeiro."' },
    { kind: 'getabako', x: 0, y: 1, d: 2, solid: true, key: 'getabako_cha', name: 'Sapateira (getabako)', info: 'Na entrada de pedra, todos tiram os sapatos antes de pisar no tatame. Há chinelos de pano enfileirados para os clientes.' },
    { kind: 'counter', x: 7, y: 1, w: 2, solid: true, key: 'balcao_su', name: 'Recepção', col: '#5a3a20', top: '#3a2414' },
    { kind: 'chabudai', x: 3, y: 3, solid: true, key: 'chabudai', name: 'Mesa baixa (chabudai)', info: 'Mesa de madeira laqueada, com um bule de ferro e duas xícaras de matcha. O chá ainda está morno.' },
    { kind: 'zabuton', x: 2, y: 3, solid: true, key: 'zabuton', name: 'Almofada (zabuton)', seat: true, col: '#6a2a3a' },
    { kind: 'zabuton', x: 4, y: 3, solid: true, key: 'zabuton', name: 'Almofada (zabuton)', seat: true, col: '#6a2a3a' },
    { kind: 'chabudai', x: 6, y: 5, solid: true, key: 'chabudai', name: 'Mesa baixa (chabudai)', info: 'Mesa de madeira laqueada, com um bule de ferro e duas xícaras de matcha. O chá ainda está morno.' },
    { kind: 'zabuton', x: 5, y: 5, solid: true, key: 'zabuton', name: 'Almofada (zabuton)', seat: true, col: '#2a3a5a' },
    { kind: 'zabuton', x: 7, y: 5, solid: true, key: 'zabuton', name: 'Almofada (zabuton)', seat: true, col: '#2a3a5a' },
    { kind: 'byobu', x: 5, y: 2, w: 2, solid: true, key: 'byobu', name: 'Biombo (byōbu)', info: 'Um biombo pintado à mão: montanhas na névoa e um galho de jasmim em flor.' },
    { kind: 'andon', x: 0, y: 6, solid: true, key: 'andon', name: 'Luminária de papel (andon)', info: 'Uma luminária de papel e madeira. A luz quente faz o tatame parecer dourado.' },
    { kind: 'andon', x: 8, y: 3, solid: true, key: 'andon', name: 'Luminária de papel (andon)', info: 'Uma luminária de papel e madeira. A luz quente faz o tatame parecer dourado.' },
    { kind: 'bonsai', x: 8, y: 6, solid: true, key: 'bonsai', name: 'Bonsai', info: 'Um pinheiro negro de cem anos, podado com paciência. A placa diz: "Não toque. Nem a polícia."' },
    { kind: 'shopfront', x: 5, y: 0, key: 'tokonoma', name: 'Tokonoma', info: 'O nicho de honra da sala: um pergaminho com a caligrafia 茉莉花, "flor de jasmim", e um arranjo de ikebana com galhos de jasmim branco.' },
  ],
  npcs: [{ id: 'nozomi', x: 8, y: 0 }, { id: 'jade', x: 2, y: 5, wander: { area: [1, 4, 4, 6] } }],
  walkers: [{ look: 'lirio', name: 'Cliente', lines: 'brothel', x: 7, y: 5, seat: 'zabuton' }],
};
EXTRA_LINES.brothel = ['Primeira vez aqui? Tire os sapatos, senhor.', 'A Sue conduz a melhor cerimônia da casa. Sala 3, se a Nozomi deixar.', 'Dizem que a Sue anda nervosa desde que mataram aquele ricaço.', 'Aqui se fecham negócios que não podem ser vistos lá fora.'];

Object.assign(EVIDENCE, {
  e_bordel: { name: 'Depoimento de Sue', short: 'Sue', kind: 'depoimento',
    desc: 'Toda quinta-feira, Arthur Pendelton reservava uma sala privativa na Casa de Chá Matsurika, sob o nome "Sr. Aurora", para encontrar Sue, a mestra de chá. Os dois tinham um caso escondido. Há dois meses, Victor Rossi pagou Sue para saber quais clientes ricos tinham segredos. Ela contou sobre Arthur.' },
  e_fotos: { name: 'Holofotos da chantagem', short: 'Holofotos', kind: 'digital',
    desc: 'Cópia de holofotos de Arthur saindo da Casa de Chá Matsurika de mãos dadas com Sue, com uma mensagem anexada: "Assine o resgate do hotel ou Evelyn e o conselho da BioCyber recebem isto. — V." Sue guardou a cópia por medo.' },
  e_emboscada2: { name: 'Segunda emboscada', short: 'Emboscada 2', kind: 'depoimento',
    desc: 'O atirador encapuzado voltou e atacou no vestiário da casa de banho. Mancava do mesmo jeito e fugiu pela sala de lavagem. Alguém sabe por onde Vance anda.' },
});
DEDUCTIONS.push({ id: 'd_chantagem', a: 'e_fotos', b: 'e_papeis', name: 'A chantagem',
  desc: 'Victor chantageou Arthur com as fotos do caso secreto na casa de chá para obrigá-lo a assinar o resgate do hotel. Arthur recusou e ameaçou denunciá-lo. Victor ficou sem saída.' });

ROOMS.bordel_quarto = {
  name: 'Matsurika: sala de chá 3', w: 5, h: 5, floor: 'tatami', dark: 0.5,
  neon: '#e8b860', wallColor: ['#4a2e18', '#3a2414'],
  wallN: 'YUYZY', wallW: 'YYYYY',
  zones: [{ x0: 0, y0: 0, x1: 4, y1: 4, floor: 'tatami' }],
  lights: [{ x: 2.5, y: 2.5, z: 22, r: 60, color: '#ffc880' }, { x: 0.5, y: 4, z: 14, r: 40, color: '#ffb860' }],
  objects: [
    { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'bordel', at: [3, 1], name: 'Corredor → Salão' },
    { kind: 'shopfront', x: 3, y: 0, key: 'tokonoma3', name: 'Tokonoma', info: 'Um pergaminho com um poema curto: "Na chuva de verão, o jasmim não se esconde." Embaixo, uma única flor branca num vaso de ferro.' },
    { kind: 'chagama', x: 3, y: 2, solid: true, key: 'chagama', name: 'Chaleira de ferro (chagama)', info: 'A água ferve devagar sobre o braseiro. Ao lado, o pote de matcha, a concha de bambu e o batedor chasen.' },
    { kind: 'zabuton', x: 2, y: 3, solid: true, key: 'zabuton', name: 'Almofada do convidado', seat: true, col: '#2a3a5a' },
    { kind: 'andon', x: 0, y: 4, solid: true, key: 'andon', name: 'Luminária de papel (andon)', info: 'Uma luminária de papel e madeira. A luz quente faz o tatame parecer dourado.' },
    { kind: 'bonsai', x: 4, y: 4, solid: true, key: 'bonsai', name: 'Bonsai', info: 'Um pequeno bordo japonês, as folhas vermelhas mesmo fora de época.' },
  ],
  npcs: [{ id: 'su', x: 4, y: 2 }],
};
// (as falas da Nozomi, da Sue e da Kyomi ficam em npcs_city.js)



// ============================================================
// A porta emperrada: o hacker C4mpt0n e o ferro-velho do Zeca
// ============================================================
Object.assign(LOOKS, {
  campton: { coat: '#1a1a24', coatDark: '#0e0e16', skin: '#c89a70', hair: '#7dff6b', legs: '#22222c', implant: '#7dff6b', shirt: '#2a3a2a', hairStyle: 'modern' },
  zeca:    { coat: '#3a4a5a', coatDark: '#26323e', skin: '#d8a880', hair: '#c8c8c8', legs: '#3a4a5a', implant: '#ffb347', shirt: '#5a4a3a', hairStyle: 'bald', beard: true },
});

ROOMS.hacker = {
  name: 'Edifício Átrio: apartamento 1207', w: 7, h: 6, floor: 'office', dark: 0.7,
  neon: '#7dff6b', wallColor: ['#14161c', '#0e1014'],
  wallN: 'hDhhhhh', wallW: 'hhWhhh',
  lights: [{ x: 2.5, y: 1.5, z: 20, r: 70, color: '#7dff6b' }, { x: 5.5, y: 3.5, z: 16, r: 60, color: '#38f6ff' }, { x: 1, y: 4.5, z: 14, r: 40, color: '#ff4fd8' }],
  objects: [
    { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'city', at: [55, 8], name: 'Saída → Rua' },
    { kind: 'monitor_desk', x: 3, y: 1, w: 2, solid: true, key: 'mesa_hacker', name: 'Estação de trabalho', info: 'Três monitores curvos rolando código verde, um teclado mecânico gasto e uma xícara com algo que já foi café.' },
    { kind: 'server_rack', x: 6, y: 1, solid: true, key: 'servidores', name: 'Rack de servidores', info: 'LEDs piscando em ritmo de respiração. Etiquetas escritas à mão: "NÃO DESLIGAR", "NUNCA", "SÉRIO".' },
    { kind: 'server_rack', x: 6, y: 2, solid: true, key: 'servidores', name: 'Rack de servidores', info: 'LEDs piscando em ritmo de respiração. Etiquetas escritas à mão: "NÃO DESLIGAR", "NUNCA", "SÉRIO".' },
    { kind: 'android_bench', x: 4, y: 4, w: 2, solid: true, key: 'androide', name: 'Androide inacabada', info: 'Uma androide de rosto sereno, deitada na bancada. O peito está aberto, com cabos coloridos e um encaixe vazio no meio.' },
    { kind: 'cot', x: 0, y: 4, solid: true, key: 'catre_hacker', name: 'Catre', info: 'Um catre desarrumado entre caixas de componentes. Pelo jeito, C4mpt0n dorme quando o código compila.' },
    { kind: 'trash', x: 0, y: 2, solid: true, key: 'lixo_hacker', name: 'Lixeira', info: 'Latas de energético NeoVolt. Muitas.' },
  ],
  npcs: [{ id: 'campton', x: 3, y: 2 }],
};

ROOMS.ferrovelho = {
  name: 'Ferro-velho do Zeca', w: 16, h: 12, floor: 'stone', dark: 0.5, outdoor: true,
  neon: '#ffb347', wallColor: ['#2a2a2e', '#1e1e22'],
  wallN: 'ffffffffffffffff', wallW: 'fffffgggffff',
  lights: [{ x: 2.5, y: 1, z: 30, r: 80, color: '#ffb347' }, { x: 3.5, y: 4.5, z: 12, r: 60, color: '#ff8a3d' }, { x: 12.5, y: 2.5, z: 40, r: 110, color: '#f0f0ff' },
    { x: 9.5, y: 7, z: 30, r: 90, color: '#ffb347' }, { x: 13.5, y: 7.5, z: 12, r: 50, color: '#ff8a3d' }, { x: 4, y: 10, z: 20, r: 70, color: '#38f6ff' }],
  objects: [
    { kind: 'exit', x: 0, y: 5, key: 'exit', to: 'city', at: [5, 47], name: 'Portão → Rua' },
    { kind: 'exit', x: 0, y: 6, key: 'exit', to: 'city', at: [5, 47], name: 'Portão → Rua' },
    { kind: 'exit', x: 0, y: 7, key: 'exit', to: 'city', at: [6, 47], name: 'Portão → Rua' },
    // os cinco montes que dá para vasculhar (o núcleo K-9 está no terceiro revirado)
    { kind: 'scrap', x: 0, y: 2, w: 2, d: 2, solid: true, key: 'sucata', pile: 0, name: 'Monte de sucata' },
    { kind: 'scrap', x: 6, y: 2, w: 2, d: 2, solid: true, key: 'sucata', pile: 1, name: 'Monte de sucata' },
    { kind: 'scrap', x: 11, y: 3, w: 2, d: 2, solid: true, key: 'sucata', pile: 2, name: 'Monte de sucata' },
    { kind: 'scrap', x: 7, y: 8, w: 2, d: 2, solid: true, key: 'sucata', pile: 3, name: 'Monte de sucata' },
    { kind: 'scrap', x: 1, y: 9, w: 2, d: 2, solid: true, key: 'sucata', pile: 4, name: 'Monte de sucata' },
    // entulho que só enche o pátio
    { kind: 'scrap', x: 13, y: 0, w: 3, d: 2, solid: true, key: 'entulho', name: 'Montanha de entulho', info: 'Uma montanha de chapas, carcaças de drone e cabos que vai até a altura da cerca.' },
    { kind: 'scrap', x: 9, y: 0, w: 2, d: 1, solid: true, key: 'entulho', name: 'Entulho', info: 'Teclados, telas rachadas e um holoprojetor que ainda pisca um anúncio de 2061.' },
    { kind: 'scrap', x: 14, y: 6, w: 2, d: 3, solid: true, key: 'entulho', name: 'Montanha de entulho', info: 'Pernas de androide empilhadas como lenha. Algumas ainda têm meias.' },
    { kind: 'scrap', x: 4, y: 10, w: 2, d: 2, solid: true, key: 'entulho', name: 'Entulho', info: 'Motores de geladeira, um repulsor partido ao meio e muita ferrugem.' },
    { kind: 'scrap', x: 11, y: 10, w: 3, d: 2, solid: true, key: 'entulho', name: 'Montanha de entulho', info: 'Painéis solares quebrados e um robô de limpeza que tenta, sem sucesso, varrer a si mesmo.' },
    { kind: 'scrap', x: 0, y: 9, w: 1, d: 2, solid: true, key: 'entulho', name: 'Entulho', info: 'Grades, canos e um capacete de motoqueiro amassado.' },
    { kind: 'container', x: 4, y: 0, w: 3, d: 1, solid: true, col: '#7a3a22', text: 'ZECA', key: 'conteiner', name: 'Contêiner', info: 'O "escritório" do Zeca: um contêiner com um catre, uma cafeteira e um calendário de 2079.' },
    { kind: 'container', x: 15, y: 9, w: 1, d: 3, solid: true, col: '#2a4a6a', key: 'conteiner2', name: 'Contêiner amassado', info: 'Amassado como lata de refrigerante. Ninguém sabe o que bateu nele, e ninguém quer saber.' },
    { kind: 'crane', x: 9, y: 5, w: 2, d: 1, solid: true, reach: 2.5, key: 'guindaste', name: 'Guindaste com eletroímã', info: 'O eletroímã segura uma carcaça de carro no ar. Range com o vento. Ninguém fica embaixo.' },
    { kind: 'car', cx: 3.5, cy: 7.5, ang: 1.2, solid: true, key: 'carcaca', name: 'Carcaça de carro voador', info: 'Um sedã voador sem repulsores, sem portas e sem esperança. Alguém dorme no banco de trás de vez em quando.', livery: { main: '#3a3026', second: '#24201a', under: '#141210', metal: '#2a2a2a', glass: '#1a2026', accent: '#5a4a3a', model: 'sedan' } },
    { kind: 'car', cx: 11, cy: 7.6, ang: 0.3, solid: true, key: 'carcaca2', name: 'Carcaça de cupê', info: 'Um cupê esportivo que já foi vermelho. Os bancos de couro sumiram; o rádio, por algum motivo, não.', livery: { main: '#5a2020', second: '#3a1414', under: '#141010', metal: '#2a2a2a', glass: '#1a2026', accent: '#8a3a2a', model: 'coupe' } },
    { kind: 'tires', x: 9, y: 3, solid: true, n: 5, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus de carros que pararam de voar há muito tempo.' },
    { kind: 'tires', x: 5, y: 7, solid: true, n: 3, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus de carros que pararam de voar há muito tempo.' },
    { kind: 'tires', x: 14, y: 11, solid: true, n: 4, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus de carros que pararam de voar há muito tempo.' },
    { kind: 'barrel', x: 3, y: 4, solid: true, fire: true, key: 'tambor', name: 'Tambor com fogo', info: 'Fogo num tambor velho, para espantar o frio e a chuva. O Zeca esquenta marmita aqui.' },
    { kind: 'barrel', x: 8, y: 0, solid: true, key: 'tambor2', name: 'Tambor de óleo', info: 'Óleo velho de repulsor. Cheira a ozônio e arrependimento.' },
    { kind: 'barrel', x: 13, y: 7, solid: true, col: '#2a4a6a', key: 'tambor2', name: 'Tambor de óleo', info: 'Óleo velho de repulsor. Cheira a ozônio e arrependimento.' },
    { kind: 'barrel', x: 13, y: 8, solid: true, fire: true, key: 'tambor', name: 'Tambor com fogo', info: 'Fogo num tambor velho, para espantar o frio e a chuva.' },
    // pilhas de carros prensados e mais entulho espalhado
    { kind: 'car_stack', x: 12, y: 0, w: 1, d: 2, n: 5, solid: true, key: 'pilha_carros', name: 'Pilha de carros prensados', info: 'Cinco carros voadores esmagados em blocos, um em cima do outro. O de baixo ainda tem um adesivo: "MEU OUTRO CARRO É UM DRONE".' },
    { kind: 'car_stack', x: 0, y: 1, w: 2, d: 1, n: 4, solid: true, key: 'pilha_carros', name: 'Pilha de carros prensados', info: 'Sedãs prensados como sanduíche. O Zeca vende por quilo.' },
    { kind: 'car_stack', x: 15, y: 3, w: 1, d: 2, n: 6, solid: true, key: 'pilha_carros', name: 'Torre de carros prensados', info: 'Seis carcaças empilhadas até acima da cerca. Rangem quando venta.' },
    { kind: 'scrap', x: 4, y: 3, w: 1, d: 1, solid: true, key: 'entulho', name: 'Entulho', info: 'Um torso de androide abraçado a uma máquina de lavar.' },
    { kind: 'scrap', x: 9, y: 9, w: 1, d: 2, solid: true, key: 'entulho', name: 'Entulho', info: 'Grades de ventilação, um assento de ônibus e fios por todo lado.' },
    { kind: 'scrap', x: 13, y: 4, w: 1, d: 2, solid: true, key: 'entulho', name: 'Entulho', info: 'Chapas de blindagem com buracos de bala. Melhor não perguntar.' },
    { kind: 'scrap', x: 6, y: 5, w: 1, d: 1, solid: true, key: 'entulho', name: 'Entulho', info: 'Placas de circuito e um teclado com só a tecla ESC.' },
    { kind: 'scrap', x: 0, y: 11, w: 1, d: 1, solid: true, key: 'entulho', name: 'Entulho', info: 'Canos de cobre, já roubados pela metade.' },
    { kind: 'scrap', x: 7, y: 11, w: 2, d: 1, solid: true, key: 'entulho', name: 'Entulho', info: 'Portas de carro empilhadas, todas de modelos diferentes.' },
    { kind: 'tires', x: 2, y: 11, solid: true, n: 4, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus de carros que pararam de voar há muito tempo.' },
    { kind: 'tires', x: 10, y: 11, solid: true, n: 6, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus de carros que pararam de voar há muito tempo.' },
  ],
  npcs: [{ id: 'zeca', x: 3, y: 2 }],
};

Object.assign(EVIDENCE, {
  e_credencial: { name: 'Credencial mestra', short: 'Credencial', kind: 'digital',
    desc: 'Credencial mestra gravada por C4mpt0n no implante de Vance. Passa por cima de qualquer trava eletrônica do Hotel Alvorada, inclusive a da porta de serviço do 4º andar.' },
  e_sabotagem: { name: 'Bug na porta de serviço', short: 'Sabotagem', kind: 'digital',
    desc: 'A porta de serviço do 4º andar foi travada de propósito, com um bug plantado no firmware anteontem. O que sobrou do log tem a assinatura da credencial ADM-02, da gerência do hotel.' },
});
DEDUCTIONS.push({ id: 'd_sabotagem', a: 'e_sabotagem', b: 'e_recepcao_log', name: 'Quem fechou os túneis',
  desc: 'A mesma credencial ADM-02, de Victor Rossi, trancou a suíte e sabotou a porta de serviço. Ele queria impedir que alguém descesse aos túneis e achasse o que ficou lá.' });
