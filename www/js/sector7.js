// ============================================================
// Sector 7: o distrito industrial. Mesma cidade aberta do Sector 4 (ruas, trânsito, pedestres,
// GPS), mas com fundições, galpões, refinarias e pátios de contêineres. Chega-se de aerotrem.
// O conteúdo usa a mesma planta compacta de 62x62 do Sector 4 (ver city.js).
// ============================================================

Object.assign(LOOKS, {
  otto:    { coat: '#5a3a1e', coatDark: '#3a2612', skin: '#c8906a', hair: '#9a9aa4', legs: '#2a2a2a', implant: '#ff6a2a', armL: '#8a8a94', wide: true, shirt: '#3a2a1a', hairStyle: 'bald', beard: true, goggles: '#ff8a3d' },
  bento:   { coat: '#2a3440', coatDark: '#1a222c', skin: '#7a5034', hair: '#d0d0d0', legs: '#1a222c', implant: '#ffd23f', shirt: '#ffd23f', hairStyle: 'modern', cap: '#1a222c' },
  neide:   { coat: '#8a2a2a', coatDark: '#5a1a1a', skin: '#d8a888', hair: '#5a2a1a', legs: '#2a2026', implant: '#ffb347', long: true, shirt: '#e8d8b8', hairStyle: 'bun' },
  rosa:    { coat: '#3a1a1a', coatDark: '#26100e', skin: '#9a6a4a', hair: '#1a1410', legs: '#1a1414', implant: '#ff3355', long: true, shirt: '#c8202a', hairStyle: 'long' },
  galdino: { coat: '#4a4a3a', coatDark: '#2e2e24', skin: '#b07a58', hair: '#e0e0e0', legs: '#2a2a24', implant: '#7dff6b', shirt: '#6a5a3a', hairStyle: 'bald', beard: true },
  op1:     { coat: '#c86a1a', coatDark: '#8a4612', skin: '#c49070', hair: '#1a1410', legs: '#2a3040', implant: '#ffb347', shirt: '#3a3a3a', hairStyle: 'modern', cap: '#ffd23f' },
  op2:     { coat: '#2a4a6a', coatDark: '#1a3048', skin: '#8a5a3a', hair: '#1a1410', legs: '#2a3040', implant: '#38f6ff', shirt: '#d8d8d8', hairStyle: 'bald', cap: '#e8e8e8' },
  op3:     { coat: '#5a5a2a', coatDark: '#3a3a1a', skin: '#e0b898', hair: '#8a5a2a', legs: '#2a2a20', implant: '#7dff6b', long: true, shirt: '#2a2a2a', hairStyle: 'bun', cap: '#ffd23f' },
  op4:     { coat: '#c8c8c0', coatDark: '#9a9a90', skin: '#6a4028', hair: '#1a1410', legs: '#3a3a40', implant: '#ff6a2a', armL: '#7a7a84', shirt: '#4a4a4a', hairStyle: 'modern', goggles: '#ff8a3d' },
});

// ---------- a cidade ----------
const SECTOR7_LINES = ['A sirene das seis toca até de madrugada. Ninguém sabe mais que horas são.', 'Trabalho na Fundição Vulcano há vinte anos. Meus pulmões têm trinta.', 'Detetive no Sector 7? Alguém caiu num tanque de novo?', 'A fumaça aqui é tão grossa que os drones de entrega usam farol.', 'O sindicato vai parar tudo semana que vem. Ou na outra. Sempre vai.', 'O Boteco da Sirene serve a única cachaça que não derrete o copo.', 'Os robôs pegaram metade dos turnos. A outra metade é a nossa, por enquanto.', 'Cuidado no pátio de contêineres. O guindaste não para pra ninguém.', 'Lá no Sector 4 eles têm parque. Aqui a gente tem chaminé.', 'O aerotrem atrasou de novo. Disseram que foi um drone. É sempre um drone.', 'Meu capacete tem rádio. Só pega a estação da empresa.', 'Já vi chover ácido verde. Aqui do lado da refinaria a chuva tem cor.', 'O armazém 13 tem um vigia que nunca dorme. Dizem que é porque ele não tem onde morar.', 'Turno de dezesseis horas e eles chamam de "jornada flexível".'];

CITIES.city7 = buildCity({
  id: 'city7', roomId: 'city7', seed: 7707, label: 'Sector 7', walkers: 40, cars: 18,
  vNames: ['Rua da Fundição', 'Rua dos Fornos', 'Av. do Aço', 'Rua da Caldeira', 'Rua do Cobre', 'Rua da Sirene', 'Rua das Docas'],
  hNames: ['Av. Chaminé', 'Av. dos Metalúrgicos', 'Av. Industrial', 'Av. da Refinaria', 'Av. dos Guindastes', 'Av. do Carvão', 'Av. Porto Seco'],
  lines: SECTOR7_LINES, looks: ['op1', 'op2', 'op3', 'op4', 'ped3', 'ped6'],
  names: ['Operário', 'Operária', 'Soldador', 'Motorista de carga', 'Técnica de manutenção', 'Estivador', 'Vigia', 'Entregador'],
  liveries: [
    { main: '#e8a020', second: '#2a2210', under: '#1a1610', metal: '#2a2a30', glass: '#1a3040', accent: '#ffd23f', model: 'sedan' },
    { main: '#4a4a52', second: '#2a2a30', under: '#141418', metal: '#3a3a40', glass: '#1a3040', accent: '#ff6a2a', model: 'sedan' },
    { main: '#3a2a1a', second: '#22180e', under: '#141008', metal: '#2a2a30', glass: '#1a3040', accent: '#ffb347', model: 'coupe' },
    { main: '#2a3a4a', second: '#1a2632', under: '#0e141a', metal: '#2a2a30', glass: '#16394c', accent: '#38f6ff', model: 'sedan' },
  ],
  build({ B, O, set, shop, door, car, pushNpc, T, rnd, pick, GENERIC_SHOPS, buildings }) {
    const SHOPS7 = GENERIC_SHOPS.filter(s => ['RAMEN 24H', 'FARMÁCIA', 'PENHORES', 'BAR', 'LAVANDERIA', 'NOODLES', 'CÁPSULAS', '24-ELEVEN', 'DROGACYBER', 'McDRONE’S', 'SUBWAVE'].includes(s.sign));
    const yard = (X0, Y0) => { for (let y = Y0; y < Y0 + 6; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, T.PLAZA); };
    const blockType = (bi, bj) => {
      if (bi === 2 && bj === 2) return 'station';
      if (bi === 1 && bj === 1) return 'foundry';
      if (bi === 3 && bj === 1) return 'warehouse';
      if (bi === 1 && bj === 3) return 'bar';
      if (bi === 3 && bj === 3) return 'union';
      if ((bi === 0 && bj === 0) || (bi === 5 && bj === 5) || (bi === 0 && bj === 5)) return 'refinery';
      if ((bi === 4 && bj === 2) || (bi === 2 && bj === 4) || (bi === 5 && bj === 3)) return 'containers';
      if ((bi === 5 && bj === 1) || (bi === 0 && bj === 2)) return 'wasteland';
      return 'gen';
    };
    for (let bj = 0; bj < 6; bj++) for (let bi = 0; bi < 6; bi++) {
      const X0 = bi * 10 + 3, Y0 = bj * 10 + 3, type = blockType(bi, bj);
      if (type === 'gen') {
        const layout = Math.floor(rnd() * 3);
        const parts = layout === 0 ? [[0, 0, 6, 6]] : layout === 1 ? [[0, 0, 3, 6], [3, 0, 3, 6]] : [[0, 0, 6, 3], [0, 3, 3, 3], [3, 3, 3, 3]];
        for (const [ox, oy, w, d] of parts) {
          const hr = rnd(), tall = hr > 0.88;
          const h = tall ? 70 + Math.floor(hr * 60) : 18 + Math.floor(hr * 34);
          const b = B(X0 + ox, Y0 + oy, w, d, h, tall ? 'tower' : 'factory', { col: ['#3a2c22', '#2c3034', '#3a3026', '#2a2e28', '#40342a', '#30282a'][Math.floor(hr * 100) % 6] });
          if (oy + d === 6 && rnd() < 0.45) { const s = pick(SHOPS7); shop(b, 0, 0.3, w - 0.3, { ...s, key: 'loja7_' + buildings.length + '_0' }); }
          if (ox + w === 6 && rnd() < 0.25) { const s = pick(SHOPS7); shop(b, 1, 0.3, d - 0.3, { ...s, key: 'loja7_' + buildings.length + '_1' }); }
        }
      } else if (type === 'station') {
        yard(X0, Y0);
        O({ kind: 'tram_stop', x: X0 + 2, y: Y0 + 2, solid: true, key: 'estacao_aerotrem', name: 'Estação do aerotrem — Sector 7' });
        O({ kind: 'holo_ad', x: X0 + 5, y: Y0, solid: true, key: 'anuncio7', name: 'Anúncio holográfico', text: 'SINDICATO', col: '#ff3355', info: '"METALÚRGICO UNIDO NÃO É SUBSTITUÍDO POR ROBÔ." Alguém pichou embaixo: "AINDA".' });
        O({ kind: 'kiosk', x: X0, y: Y0 + 5, solid: true, key: 'banca7', name: 'Banca de notícias', col: '#ffb347', info: 'Manchetes em holograma: "FUNDIÇÃO VULCANO BATE RECORDE DE PRODUÇÃO". "SINDICATO AMEAÇA GREVE GERAL". "CHUVA ÁCIDA: SECTOR 7 TEM O AR MAIS PESADO DE NEO-SAMPA".' });
        O({ kind: 'bench', x: X0 + 1, y: Y0 + 4, solid: true, key: 'banco', name: 'Banco da estação', seat: true });
        O({ kind: 'bench', x: X0 + 4, y: Y0 + 4, solid: true, key: 'banco', name: 'Banco da estação', seat: true });
        O({ kind: 'vending_drink', x: X0 + 5, y: Y0 + 2, solid: true, key: 'maq_bebida', name: 'Máquina de bebidas HydroPop' });
        O({ kind: 'vending_food', x: X0 + 5, y: Y0 + 3, solid: true, key: 'maq_comida', name: 'Máquina de comida NutriMat' });
        O({ kind: 'phone', x: X0, y: Y0, solid: true, key: 'orelhao7', name: 'Cabine holográfica', info: 'Uma cabine de holochamada coberta de fuligem. No vidro, alguém escreveu com o dedo: "LIGA PRA MÃE".' });
        pushNpc({ id: 'galdino', x: X0 + 3, y: Y0 + 4 });
      } else if (type === 'foundry') {
        B(X0, Y0, 6, 4, 48, 'factory', { col: '#3a2a20', sign: 'FUNDIÇÃO VULCANO', signCol: '#ff6a2a' });
        for (let y = Y0 + 4; y <= Y0 + 5; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, T.PLAZA);
        door(X0 + 2, Y0 + 4, 's7_fundicao', [2, 1], 'Fundição Vulcano');
        O({ kind: 'chimney', x: X0, y: Y0 + 5, solid: true, key: 'chamine', name: 'Chaminé da fundição', info: 'Tijolo, fuligem e uma luz vermelha piscando no topo para avisar os drones. A fumaça nunca para.' });
        O({ kind: 'barrel', x: X0 + 5, y: Y0 + 5, solid: true, fire: true, key: 'tambor', name: 'Tambor com fogo', info: 'Os operários do turno da noite se esquentam aqui entre uma corrida de aço e outra.' });
        O({ kind: 'crate', x: X0 + 4, y: Y0 + 4, solid: true, key: 'lingotes', name: 'Pilha de lingotes', info: 'Lingotes de aço ainda mornos, empilhados como tijolos. Cada um tem o selo de um vulcão.' });
      } else if (type === 'warehouse') {
        B(X0, Y0, 6, 4, 30, 'factory', { col: '#2a3440', sign: 'ARMAZÉM 13', signCol: '#ffd23f' });
        for (let y = Y0 + 4; y <= Y0 + 5; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, T.PLAZA);
        door(X0 + 2, Y0 + 4, 's7_armazem', [2, 1], 'Armazém 13');
        O({ kind: 'container', x: X0 + 4, y: Y0 + 4, w: 2, d: 1, solid: true, col: '#2a5a6a', key: 'conteiner7', name: 'Contêiner', info: 'Lacrado. A etiqueta diz "PEÇAS DE ROBÔ — NÃO EMPILHAR". Está empilhado.' });
        O({ kind: 'crate', x: X0, y: Y0 + 5, solid: true, key: 'caixas7', name: 'Caixas de carga', info: 'Caixas de madeira com carimbo de exportação para a Zona Alta.' });
      } else if (type === 'bar') {
        B(X0, Y0, 6, 3, 22, 'low', { col: '#3a2418', sign: 'BOTECO DA SIRENE', signCol: '#ffb347' });
        for (let y = Y0 + 3; y <= Y0 + 5; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, T.PLAZA);
        door(X0 + 2, Y0 + 3, 's7_bar', [2, 1], 'Boteco da Sirene');
        O({ kind: 'table', x: X0 + 4, y: Y0 + 4, solid: true, key: 'mesa_calcada', name: 'Mesa na calçada', info: 'Uma mesa de plástico amarela com o logo de uma cerveja que não existe mais.' });
        O({ kind: 'bench', x: X0 + 1, y: Y0 + 5, solid: true, key: 'banco', name: 'Banco', seat: true });
      } else if (type === 'union') {
        B(X0, Y0, 6, 3, 36, 'low', { col: '#3a1a1a', sign: 'SINDICATO DOS METALÚRGICOS', signCol: '#ff3355' });
        for (let y = Y0 + 3; y <= Y0 + 5; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, T.PLAZA);
        door(X0 + 2, Y0 + 3, 's7_sindicato', [2, 1], 'Sindicato dos Metalúrgicos');
        O({ kind: 'banner', x: X0, y: Y0 + 4, text: 'GREVE', col: '#c8202a', key: 'faixa7', name: 'Faixa de greve', info: '"OITO HORAS DE TRABALHO, OITO DE DESCANSO, OITO DE CHUVA ÁCIDA." Pintada à mão.' });
        O({ kind: 'banner', x: X0 + 5, y: Y0 + 4, text: '7', col: '#c8202a', key: 'faixa7', name: 'Bandeira do Sector 7', info: 'Uma engrenagem preta sobre fundo vermelho. Embaixo: "QUEM FAZ A CIDADE MORA AQUI".' });
      } else if (type === 'refinery') {
        yard(X0, Y0);
        O({ kind: 'silo', x: X0 + 1, y: Y0 + 1, w: 2, d: 2, solid: true, key: 'silo', name: 'Tanque da refinaria', info: 'Um tanque de combustível sintético do tamanho de um prédio. A escada externa tem um aviso: "SUBA POR SUA CONTA E RISCO".' });
        O({ kind: 'silo', x: X0 + 3, y: Y0 + 3, w: 2, d: 2, solid: true, key: 'silo', name: 'Tanque da refinaria', info: 'O tanque zumbe baixinho. Um medidor marca 87%. De quê, ninguém sabe dizer.' });
        O({ kind: 'chimney', x: X0 + 5, y: Y0, solid: true, key: 'chamine', name: 'Chaminé da refinaria', info: 'Uma chama azul queima no topo, dia e noite, como uma vela que ninguém consegue apagar.', flare: true });
        O({ kind: 'barrel', x: X0, y: Y0 + 5, solid: true, col: '#2a4a6a', key: 'tambor2', name: 'Tambor de óleo', info: 'Óleo sintético. O cheiro gruda na roupa por uma semana.' });
        O({ kind: 'barrel', x: X0 + 1, y: Y0 + 5, solid: true, key: 'tambor2', name: 'Tambor de óleo', info: 'Óleo sintético. O cheiro gruda na roupa por uma semana.' });
        O({ kind: 'fence', x: X0, y: Y0, w: 6, axis: 'x' });
        O({ kind: 'fence', x: X0, y: Y0, d: 6, axis: 'y' });
      } else if (type === 'containers') {
        yard(X0, Y0);
        const cols = ['#7a3a22', '#2a5a6a', '#6a6a20', '#3a2a5a', '#2a6a3a', '#6a2a2a'];
        O({ kind: 'container', x: X0, y: Y0, w: 3, d: 1, solid: true, col: cols[(X0 + Y0) % 6], key: 'conteiner7', name: 'Contêiner', info: 'Contêiner de carga. Pela fresta sai uma luz azul e um zumbido de servidores.' });
        O({ kind: 'container', x: X0, y: Y0 + 2, w: 3, d: 1, solid: true, col: cols[(X0 + Y0 + 1) % 6], key: 'conteiner7', name: 'Contêiner', info: 'Alguém mora aqui: tem cortina na porta e um vaso de planta em cima.' });
        O({ kind: 'container', x: X0 + 4, y: Y0, w: 1, d: 3, solid: true, col: cols[(X0 + Y0 + 2) % 6], key: 'conteiner7', name: 'Contêiner', info: 'Amassado de um lado só, como se um guindaste tivesse errado a mira.' });
        O({ kind: 'crane', x: X0 + 1, y: Y0 + 4, w: 2, d: 1, solid: true, reach: 2.4, key: 'guindaste', name: 'Guindaste do pátio', info: 'O guindaste trabalha sozinho, guiado por uma IA de logística. Ele não para nem para a chuva.' });
        O({ kind: 'tires', x: X0 + 5, y: Y0 + 5, solid: true, n: 4, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus de caminhão voador, gastos até a lona.' });
      } else if (type === 'wasteland') {
        for (let y = Y0; y < Y0 + 6; y++) for (let x = X0; x < X0 + 6; x++) set(x, y, (x + y) % 4 ? T.GRASS : T.PLAZA);
        O({ kind: 'scrap', x: X0 + 1, y: Y0 + 1, w: 2, d: 2, solid: true, key: 'entulho', name: 'Entulho industrial', info: 'Engrenagens, correias e um braço robótico que ainda se mexe quando chove.' });
        O({ kind: 'barrel', x: X0 + 4, y: Y0 + 3, solid: true, fire: true, key: 'tambor', name: 'Tambor com fogo', info: 'Um ponto de encontro de quem não tem para onde ir depois do turno.' });
        O({ kind: 'tires', x: X0 + 4, y: Y0 + 1, solid: true, n: 3, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus velhos, usados como banco, mesa e trincheira.' });
        O({ kind: 'tree', x: X0 + 1, y: Y0 + 4, solid: true, key: 'arvore7', name: 'Árvore resistente', info: 'A única árvore do quarteirão. As folhas são cinza de fuligem, mas ela insiste.' });
      }
    }
  },
});

const C7 = CITIES.city7;
ROOMS.city7 = {
  name: 'Sector 7', w: C7.N, h: C7.N, city: true, cityObj: C7, outdoor: true, dark: 0.55, neon: '#ff8a3d', floor: 'city',
  lights: [], objects: C7.objects, npcs: C7.npcs, walkers: C7.walkers, spawn: [25, 28],
};

// destinos do GPS no Sector 7: todos conhecidos (o distrito é pequeno e tudo tem placa)
CITY_DESTS.city7 = {
  s7_estacao:   { name: 'Estação do aerotrem — Sector 7', short: 'Estação', door: C7.map(25, 28), color: '#38f6ff', icon: 'A' },
  s7_fundicao:  { name: 'Fundição Vulcano', short: 'Fundição', door: C7.map(15, 17), color: '#ff6a2a', icon: 'F' },
  s7_armazem:   { name: 'Armazém 13', short: 'Armazém', door: C7.map(35, 17), color: '#ffd23f', icon: '13' },
  s7_bar:       { name: 'Boteco da Sirene', short: 'Boteco', door: C7.map(15, 36), color: '#ffb347', icon: 'B' },
  s7_sindicato: { name: 'Sindicato dos Metalúrgicos', short: 'Sindicato', door: C7.map(35, 36), color: '#ff3355', icon: 'S' },
};
GPS_ALWAYS.push(...Object.keys(CITY_DESTS.city7));
GPS_HOME.push('s7_estacao');

// ---------- interiores ----------
const OPERARIOS = ['Operário', 'Soldadora', 'Forneiro', 'Operadora de ponte rolante'];
Object.assign(EXTRA_LINES, {
  fundicao: ['Cuidado onde pisa, moço. O chão aqui é quente o ano inteiro.', 'Cada corrida de aço dura quarenta minutos. Minha vida inteira cabe em corridas de quarenta minutos.', 'O Mestre Otto sabe a temperatura do forno só de olhar a cor.', 'Os robôs não aguentam o calor do forno três. Por isso ainda tem gente aqui.', 'Polícia? Aqui ninguém viu nada. O barulho não deixa.'],
  boteco: ['Uma pinga, Dona Neide! Da boa, não da que derrete o copo.', 'Hoje o turno foi de dezesseis horas. Amanhã também.', 'O Galdino da estação conta essa história do incêndio de 2071 toda noite.', 'Detetive bebe? Então senta, que aqui ninguém pergunta nada.', 'A sirene das seis tocou à meia-noite de novo. Esse relógio da fábrica tá doido.'],
  sindicato: ['Assembleia às dez. Traga o capacete, a briga às vezes fica física.', 'Eles querem trocar o turno da noite por robôs. A gente quer trocar a diretoria por robôs.', 'A Rosa vai falar hoje. Quando a Rosa fala, a Vulcano treme.', 'Café de sindicato: fraco, quente e de graça. Como as promessas.'],
});

Object.assign(ROOMS, {
  s7_fundicao: {
    name: 'Fundição Vulcano', w: 14, h: 10, floor: 'concrete', dark: 0.5,
    neon: '#ff6a2a', wallColor: ['#2a1e18', '#1e1610'],
    wallN: 'PPDPP..N...PPP', wallW: 'P..PP..P..',
    lights: [{ x: 6, y: 2, z: 20, r: 110, color: '#ff6a2a', flicker: true }, { x: 11, y: 2, z: 20, r: 80, color: '#ff8a3d', flicker: true },
      { x: 2.5, y: 0.6, z: 30, r: 50, color: '#ffd8a0' }, { x: 6, y: 7, z: 30, r: 70, color: '#ffb347' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'city7', at: [15, 18], name: 'Portão → Rua' },
      { kind: 'furnace', x: 5, y: 1, w: 3, d: 2, solid: true, key: 'forno', name: 'Alto-forno nº 3', info: 'O ar treme na frente da boca do forno. Lá dentro, o aço brilha da cor do sol que ninguém mais vê.' },
      { kind: 'furnace', x: 10, y: 1, w: 2, d: 2, solid: true, key: 'forno', name: 'Forno de indução', info: 'Menor e mais novo. Uma placa diz: "OPERADO POR IA — NÃO TOCAR". Alguém riscou o "NÃO".' },
      { kind: 'conveyor', x: 2, y: 5, w: 9, d: 1, solid: true, key: 'esteira', name: 'Esteira de lingotes', info: 'Lingotes incandescentes deslizam devagar, esfriando do laranja ao cinza.' },
      { kind: 'crate', x: 12, y: 5, solid: true, key: 'lingotes', name: 'Pilha de lingotes', info: 'Lingotes frios, prontos para embarque. Destino: Zona Alta.' },
      { kind: 'crate', x: 12, y: 6, solid: true, key: 'lingotes', name: 'Pilha de lingotes', info: 'Lingotes frios, prontos para embarque. Destino: Zona Alta.' },
      { kind: 'barrel', x: 0, y: 8, solid: true, key: 'tambor2', name: 'Tambor de escória', info: 'Escória quente, a sobra do aço. Ainda solta fumaça.' },
      { kind: 'barrel', x: 1, y: 8, solid: true, col: '#2a4a6a', key: 'tambor2', name: 'Tambor de óleo', info: 'Óleo de corte. Escorrega até o olhar.' },
      { kind: 'scrap', x: 9, y: 7, w: 2, d: 2, solid: true, key: 'sucata_fund', name: 'Sucata para fundir', info: 'Carcaças de carro, trilhos velhos e um sino de igreja. Tudo vira aço novo.' },
      { kind: 'lockers', x: 13, y: 8, solid: true, key: 'armario_fund', name: 'Armários dos operários', info: 'Cadeados de todos os tipos. Num deles, uma foto de família e um santinho.' },
    ],
    npcs: [{ id: 'otto', x: 7, y: 4 }],
    walkers: [{ look: 'op4', name: 'Forneiro', lines: 'fundicao', x: 4, y: 7 }, { look: 'op1', name: 'Soldadora', lines: 'fundicao', x: 8, y: 8 }],
  },
  s7_armazem: {
    name: 'Armazém 13', w: 14, h: 10, floor: 'concrete', dark: 0.64,
    neon: '#ffd23f', wallColor: ['#20262e', '#161a20'],
    wallN: '..D......P..PP', wallW: 'P....P....',
    lights: [{ x: 2.5, y: 0.6, z: 30, r: 50, color: '#ffd8a0' }, { x: 7, y: 4, z: 40, r: 90, color: '#e8f0ff', flicker: true }, { x: 11, y: 8, z: 20, r: 50, color: '#ffd23f' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'city7', at: [35, 18], name: 'Portão → Rua' },
      ...[[4, 2], [7, 2], [10, 2]].map(([x, y], i) => ({ kind: 'container', x, y, w: 1, d: 3, solid: true, col: ['#7a3a22', '#2a5a6a', '#6a6a20'][i], key: 'conteiner_arm', name: 'Contêiner', info: ['Etiqueta: "BRAÇOS ROBÓTICOS — 40 UNIDADES". Estão todos acenando lá dentro? Melhor não saber.', 'Etiqueta: "IMPLANTES OCULARES — FRÁGIL". Alguém desenhou um olho piscando.', 'Etiqueta: "SUCATA". Pesado demais para ser só sucata.'][i] })),
      { kind: 'crate', x: 1, y: 6, solid: true, key: 'caixas_arm', name: 'Caixas empilhadas', info: 'Caixas de peças sem nota fiscal. A metade tem o carimbo apagado com tinta preta.' },
      { kind: 'crate', x: 2, y: 6, solid: true, key: 'caixas_arm', name: 'Caixas empilhadas', info: 'Caixas de peças sem nota fiscal. A metade tem o carimbo apagado com tinta preta.' },
      { kind: 'crate', x: 1, y: 7, solid: true, key: 'caixas_arm', name: 'Caixas empilhadas', info: 'Caixas de peças sem nota fiscal. A metade tem o carimbo apagado com tinta preta.' },
      { kind: 'crate', x: 8, y: 7, solid: true, key: 'caixas_arm', name: 'Caixas empilhadas', info: 'Uma das caixas está aberta: chips de memória embalados como balas.' },
      { kind: 'terminal', x: 12, y: 1, solid: true, key: 'term_armazem', name: 'Terminal de inventário', screen: '#ffd23f', info: 'Inventário do Armazém 13: 4.112 itens registrados, 4.380 contados. A diferença está marcada como "erro de leitura".' },
      { kind: 'cot', x: 12, y: 8, solid: true, key: 'catre_bento', name: 'Catre do vigia', info: 'Um catre, um cobertor xadrez e um rádio de pilha. O Seu Bento mora aqui faz anos.' },
      { kind: 'tires', x: 0, y: 2, solid: true, n: 4, key: 'pneus', name: 'Pilha de pneus', info: 'Pneus de empilhadeira, gastos até a lona.' },
    ],
    npcs: [{ id: 'bento', x: 11, y: 6 }],
  },
  s7_bar: {
    name: 'Boteco da Sirene', w: 12, h: 9, floor: 'tiles', dark: 0.5,
    neon: '#ffb347', wallColor: ['#3a2418', '#2a1a10'],
    wallN: '..D..BBB.N..', wallW: '..H...P..',
    lights: [{ x: 6.5, y: 1.5, z: 30, r: 70, color: '#ffd8a0' }, { x: 3, y: 6, z: 28, r: 60, color: '#ffb347' }, { x: 9, y: 6.5, z: 28, r: 60, color: '#ff6a2a' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'city7', at: [15, 37], name: 'Porta → Rua' },
      { kind: 'bar', x: 5, y: 2, w: 4, d: 1, solid: true, key: 'balcao_neide', name: 'Balcão da Dona Neide', vendor: 'bar_rua', info: 'Cachaça, cerveja de arroz e coxinha de proteína. O balcão tem marcas de cotovelo de três gerações.' },
      { kind: 'stool', x: 5, y: 3, solid: true }, { kind: 'stool', x: 7, y: 3, solid: true },
      { kind: 'table', x: 2, y: 5, solid: true, key: 'mesa_boteco', name: 'Mesa de lata', info: 'Uma partida de dominó parada no meio. Ninguém mexe: o dono foi ao banheiro faz uma hora.' },
      { kind: 'table', x: 4, y: 7, solid: true, key: 'mesa_boteco', name: 'Mesa de lata', info: 'Capacetes empilhados em cima da mesa como chapéus num cabide.' },
      { kind: 'table', x: 9, y: 6, solid: true, key: 'mesa_boteco', name: 'Mesa de lata', info: 'Um copo americano, um prato com farelo de coxinha e um recibo de salário dobrado em oito.' },
      { kind: 'tv', x: 0, y: 4, solid: true, key: 'tv_boteco', name: 'TV do boteco', info: 'Futebol de robôs. Os operários torcem contra.' },
      { kind: 'plant', x: 11, y: 8, solid: true, key: 'planta_boteco', name: 'Comigo-ninguém-pode', info: 'Num vaso de lata de tinta. Contra mau-olhado e fiscal da prefeitura.' },
    ],
    npcs: [{ id: 'neide', x: 6, y: 1 }],
    walkers: [{ look: 'op2', name: 'Operário no intervalo', lines: 'boteco', x: 3, y: 6 }, { look: 'op3', name: 'Operadora de ponte rolante', lines: 'boteco', x: 9, y: 5 }],
  },
  s7_sindicato: {
    name: 'Sindicato dos Metalúrgicos', w: 12, h: 9, floor: 'tiles', dark: 0.48,
    neon: '#ff3355', wallColor: ['#2a1414', '#1e0e0e'],
    wallN: '..D..HNH....', wallW: '..H....H.',
    lights: [{ x: 6, y: 1.5, z: 32, r: 80, color: '#ffd8a0' }, { x: 2, y: 6, z: 28, r: 60, color: '#ff3355' }, { x: 10, y: 6, z: 28, r: 60, color: '#ffb347' }],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'city7', at: [35, 37], name: 'Porta → Rua' },
      { kind: 'counter', x: 5, y: 1, w: 3, d: 1, solid: true, key: 'palanque', name: 'Palanque', info: 'Uma mesa de madeira com um microfone de verdade, desses com fio. Ninguém sabe onde ligaram.' },
      ...[[3, 4], [5, 4], [7, 4], [9, 4], [3, 6], [5, 6], [7, 6], [9, 6]].map(([x, y]) => ({ kind: 'chair', x, y, solid: true, key: 'cadeira_sind', name: 'Cadeira de assembleia', seat: true })),
      { kind: 'coffee_machine', x: 11, y: 2, solid: true, key: 'cafe_sindicato', name: 'Garrafa de café do sindicato', vendor: 'cafe_d4' },
      { kind: 'banner', x: 0, y: 3, text: 'GREVE', col: '#c8202a', key: 'faixa7', name: 'Faixa de greve', info: '"QUEM FAZ A CIDADE TEM DIREITO A ELA."' },
      { kind: 'bookshelf', x: 0, y: 6, solid: true, key: 'arquivo_sind', name: 'Arquivo do sindicato', info: 'Pastas de papel com acordos de 2040 até hoje. A de 2071 tem uma mancha de fuligem: o ano do incêndio na Vulcano.' },
    ],
    npcs: [{ id: 'rosa', x: 6, y: 2 }],
    walkers: [{ look: 'op1', name: 'Metalúrgico', lines: 'sindicato', x: 4, y: 5 }, { look: 'op4', name: 'Soldador', lines: 'sindicato', x: 8, y: 7 }],
  },
});

// ---------- personagens ----------
Object.assign(NPCS, {
  galdino: {
    name: 'Seu Galdino', role: 'Operário aposentado', look: 'galdino',
    scan: { text: 'Pulmões com 40% de capacidade. Implante auditivo antigo, ajustado para ouvir a sirene da fábrica. Batimentos calmos de quem já não tem pressa.' },
    intro: 'Boa noite, moço. Galdino, quarenta anos de Fundição Vulcano. Hoje eu só fico aqui na estação vendo o aerotrem chegar. É o único que ainda chega no horário.',
    again: ['Fala, moço.', 'O aerotrem já vem.', 'Senta aí, que a história é comprida.'],
    topics: [
      { id: 'ga_setor', label: 'Como é o Sector 7?', lines: [
        ['N', 'Aqui é onde a cidade é feita, moço. O aço da Zona Alta sai daquele forno ali. O combustível dos drones sai da refinaria.'],
        ['N', 'Lá em cima eles respiram ar filtrado. Aqui a gente respira o que sobra.'],
        ['N', 'A Fundição, o Armazém 13, o Boteco da Dona Neide e o Sindicato. O resto é galpão e chaminé.'],
      ] },
      { id: 'ga_incendio', label: 'Que história é essa do incêndio de 2071?', lines: [
        ['N', 'Ah, o moço ouviu falar. O forno dois estourou numa madrugada. Doze companheiros.'],
        ['N', 'A empresa disse que foi falha humana. O sindicato provou que foi o sensor que eles não trocaram para economizar.'],
        ['N', 'Ninguém foi preso. Só trocaram o nome do forno. Agora o forno três fica onde era o dois.'],
        ['I', 'Em Neo-Sampa, culpa também tem andar. E nunca é o de cima.'],
      ] },
      { id: 'ga_conselho', label: 'Algum conselho para quem anda por aqui?', lines: [
        ['N', 'Não fique embaixo do guindaste, não beba a cachaça da garrafa sem rótulo, e não chame a Rosa do sindicato de "dona".'],
      ] },
    ],
    present: {},
    presentDefault: ['Isso aí eu não conheço, moço.', 'No meu tempo não tinha disso.', 'Pergunta pra Rosa, ela sabe de tudo.'],
  },
  otto: {
    name: 'Mestre Otto', role: 'Mestre de forno da Fundição Vulcano', look: 'otto',
    scan: { text: 'Braço mecânico de fundição, resistente a 1.600 graus. Óculos de proteção com espectrômetro: ele lê a temperatura do aço pela cor. Queimaduras antigas no pescoço.' },
    intro: '*Ele não tira os olhos do forno.* Otto. Mestre do forno três. Se veio fiscalizar, a papelada está no escritório. Se veio conversar, fale alto.',
    again: ['*Ele grita por cima do barulho.* FALE!', 'O aço não espera, detetive.', 'Mais alguma coisa?'],
    topics: [
      { id: 'ot_aco', label: 'Como você sabe a temperatura só olhando?', lines: [
        ['N', 'Laranja-escuro, novecentos graus. Amarelo, mil e duzentos. Branco, mil e quinhentos. Azul, você morreu.'],
        ['N', 'Os sensores mentem quando a empresa quer economizar. A cor do aço não mente nunca.'],
      ] },
      { id: 'ot_robos', label: 'Os robôs não substituíram vocês?', lines: [
        ['N', 'Tentaram. Os robôs derretem perto do forno três. Gente derrete mais devagar.'],
        ['N', 'Por isso ainda tem operário aqui. Não por bondade da diretoria: por física.'],
      ] },
      { id: 'ot_turno', label: 'Quantas horas dura um turno?', lines: [
        ['N', 'No papel, oito. Na vida, até o forno deixar.'],
        ['I', 'Ele falou sem amargura. Como quem descreve o tempo lá fora.'],
      ] },
    ],
    present: {},
    presentDefault: ['Não entendo disso. Entendo de aço.', 'Mostra isso pro escritório.', '*Ele dá de ombros e volta ao forno.*'],
  },
  bento: {
    name: 'Seu Bento', role: 'Vigia do Armazém 13', look: 'bento',
    scan: { text: 'Uniforme de vigia de uma empresa que faliu em 2079. Ele continua de guarda mesmo assim. Implante de visão noturna de primeira geração.' },
    intro: 'Alto lá! Ah, é polícia. Bento, vigia do Armazém 13. Faz seis anos que ninguém me paga, mas alguém tem que vigiar, né?',
    again: ['Tudo em ordem por aqui, detetive.', 'Ninguém entra sem eu ver.', 'Quer um café? É de ontem, mas é café.'],
    topics: [
      { id: 'be_armazem', label: 'O que tem neste armazém?', lines: [
        ['N', 'Oficialmente? Peças de robô e implantes para a Zona Alta. Na prática? Muito mais caixa do que no inventário.'],
        ['N', 'De madrugada chega caminhão sem placa. Eu anoto tudo no meu caderno. Ninguém nunca pediu pra ver.'],
      ] },
      { id: 'be_salario', label: 'Por que vigiar sem receber?', lines: [
        ['N', 'A empresa faliu, mas ninguém veio buscar as coisas. Se eu saio, saqueiam tudo em uma noite.'],
        ['N', 'E também... eu moro aqui, detetive. Onde mais um velho vigia vai morar?'],
      ] },
    ],
    present: {},
    presentDefault: ['Isso não passou pela minha portaria.', 'Vou anotar no caderno.', 'Não reconheço, não.'],
  },
  neide: {
    name: 'Dona Neide', role: 'Dona do Boteco da Sirene', look: 'neide',
    scan: { text: 'Nenhum implante de rede: só um marca-passo de 2060. Mãos de quem frita coxinha há trinta anos. Ela sabe o nome de todo mundo do distrito.' },
    intro: 'Entra, meu filho, que lá fora tá chovendo ácido. Neide. Aqui tem pinga, coxinha de proteína e conversa. O que vai ser?',
    again: ['Mais uma, meu filho?', 'Senta aí, que a coxinha já sai.', 'Fala, detetive.'],
    topics: [
      { id: 'ne_boteco', label: 'Por que "Boteco da Sirene"?', lines: [
        ['N', 'Porque a sirene da Vulcano toca às seis, às duas e às dez. E em cada troca de turno o boteco enche.'],
        ['N', 'Meu marido abriu. A sirene levou ele no incêndio de 71. O nome ficou.'],
      ] },
      { id: 'ne_gente', label: 'Quem frequenta o boteco?', lines: [
        ['N', 'Forneiro, soldadora, estivador, vigia. Gente que faz a cidade e que a cidade esquece.'],
        ['N', 'E de vez em quando um engravatado da Zona Alta que se perdeu. Esses eu cobro em dobro.'],
      ] },
      { id: 'ne_pinga', label: 'Uma pinga, Dona Neide.', repeat: true, lines: [
        ['N', '*Ela serve um copo americano até a boca.* Da boa. A de garrafa sem rótulo é pra quem quer ficar cego.'],
        { relax: 5 },
        ['I', 'Desce queimando. Como tudo no Sector 7.'],
      ] },
    ],
    present: {},
    presentDefault: ['Isso aí eu nunca vi, meu filho.', 'Aqui a gente não se mete nisso.', 'Pergunta pro Galdino da estação.'],
  },
  rosa: {
    name: 'Rosa Ferraz', role: 'Presidente do Sindicato dos Metalúrgicos', look: 'rosa',
    scan: { text: 'Implante vocal amplificador, para discursar sem microfone. Cicatriz de queimadura no antebraço: ex-forneira. Batimentos acelerados de quem vive em assembleia.' },
    intro: 'Rosa Ferraz, presidente do sindicato. E é "companheira", não "dona". Se a polícia veio acabar com a greve, chegou cedo: a greve ainda nem começou.',
    again: ['Fala, companheiro.', 'Seja rápido, tem assembleia às dez.', 'O que a polícia quer agora?'],
    topics: [
      { id: 'ro_greve', label: 'Por que a greve?', lines: [
        ['N', 'A Vulcano quer substituir o turno da noite por robôs novos. Os que aguentam o forno três.'],
        ['N', 'Mil e duzentas famílias, companheiro. E o dinheiro dos robôs vem do mesmo lugar de sempre: a Zona Alta.'],
        ['V', 'E o que o sindicato vai fazer?'],
        ['N', 'Parar tudo. Sem aço, a Zona Alta não constrói nem um andar a mais.'],
      ] },
      { id: 'ro_2071', label: 'O incêndio de 2071.', lines: [
        ['N', '*Ela fica séria.* Eu tinha dezoito anos. Estava no forno um quando o dois explodiu.'],
        ['N', 'O sensor de pressão estava vencido havia três anos. A empresa sabia. Está tudo naquele arquivo ali.'],
        ['N', 'Foi por isso que eu entrei no sindicato. Pra nenhuma Neide do distrito ficar viúva de novo por causa de uma planilha.'],
      ] },
      { id: 'ro_policia', label: 'Você não confia na polícia.', lines: [
        ['N', 'Eu confio em quem aparece quando a fábrica pega fogo. A polícia aparece quando a fábrica para.'],
        ['I', 'Difícil discordar.'],
      ] },
    ],
    present: {},
    presentDefault: ['Isso não é assunto do sindicato.', 'Traga provas, companheiro, não papel.', 'Não reconheço.'],
  },
});

// ---------- objetos de cenário do Sector 7 ----------
function s7Prop(o, t, w, d, cx, cy) {
  switch (o.kind) {
    case 'chimney': {        // chaminé de tijolo, com faixas vermelhas, fumaça (ou chama azul da refinaria) e luz de aviso
      box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 70, '#5a3a2e', 0, '#3a2620');
      for (const z of [20, 45, 66]) box(o.x + 0.23, o.y + 0.23, 0.54, 0.54, 2, '#c8202a', z);
      const [sx, sy] = iso(cx, cy, 72);
      if (o.flare) {
        for (let k = 0; k < 3; k++) { const h = 5 + 3 * Math.sin(t * 9 + k * 2); ctx.fillStyle = k % 2 ? '#9ff8ff' : '#38a0ff'; ctx.beginPath(); ctx.moveTo(sx - 2 + k * 2, sy); ctx.lineTo(sx - 1 + k * 2, sy - h); ctx.lineTo(sx + k * 2, sy); ctx.fill(); }
        glow(sx, sy - 4, 26, '#38a0ff', 0.45);
      } else for (let k = 0; k < 6; k++) { const up = (t * 6 + k * 7 + o.x) % 40; ctx.fillStyle = `rgba(140,130,130,${0.25 * (1 - up / 40)})`; ctx.beginPath(); ctx.ellipse(sx + up * 0.5 + Math.sin(t * 0.6 + k) * 3, sy - up, 3 + up * 0.4, 2 + up * 0.2, 0, 0, Math.PI * 2); ctx.fill(); }
      if (Math.sin(t * 2 + o.x) > 0.2) { ctx.fillStyle = '#ff3355'; ctx.fillRect(sx - 0.8, sy + 1, 1.6, 1.6); glow(sx, sy + 2, 8, '#ff3355', 0.5); }
      return true;
    }
    case 'silo': {           // tanque cilíndrico da refinaria, com escada e passarela no topo
      const [bx, by] = iso(cx, cy, 0), R = Math.min(w, d) * 7, Hh = 46;
      ctx.fillStyle = '#4a4e56'; ctx.fillRect(bx - R, by - Hh, R * 2, Hh);
      ctx.fillStyle = '#5e626a'; ctx.fillRect(bx - R, by - Hh, R * 0.9, Hh);
      ctx.fillStyle = '#3a3e46'; ctx.beginPath(); ctx.ellipse(bx, by, R, R * 0.5, 0, 0, Math.PI); ctx.fill();
      ctx.fillStyle = '#6e727a'; ctx.beginPath(); ctx.ellipse(bx, by - Hh, R, R * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      for (const z of [12, 26, 40]) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(bx - R, by - z, R * 2, 0.8); }
      ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 0.4;
      for (let z = 2; z < Hh; z += 3) { ctx.beginPath(); ctx.moveTo(bx + R * 0.55, by - z); ctx.lineTo(bx + R * 0.7, by - z); ctx.stroke(); }
      ctx.fillStyle = '#ffd23f'; ctx.fillRect(bx - R * 0.6, by - Hh * 0.55, R * 1.2, 2.4);
      if (Math.sin(t * 2.4 + o.x) > 0.4) { ctx.fillStyle = '#ff3355'; ctx.fillRect(bx - 0.6, by - Hh - R * 0.5 - 2, 1.2, 1.2); }
      return true;
    }
    case 'furnace': {        // alto-forno: corpo de tijolo, boca incandescente e brilho que pulsa
      box(o.x + 0.05, o.y + 0.05, w - 0.1, d - 0.1, 34, '#3a2a24', 0, '#2a1e1a');
      box(o.x + 0.25, o.y + 0.25, w - 0.5, d - 0.5, 10, '#2a1e1a', 34, '#1a1210');
      const k = 0.7 + 0.3 * Math.sin(t * 6) * Math.sin(t * 2.3);
      const [mx, my] = iso(o.x + w / 2, o.y + d, 8);
      ctx.fillStyle = `rgba(255,${120 + Math.floor(k * 80)},40,${0.85})`; ctx.fillRect(mx - 6, my - 8, 12, 9);
      ctx.fillStyle = `rgba(255,240,180,${0.6 * k})`; ctx.fillRect(mx - 4, my - 6, 8, 5);
      glow(mx, my - 4, 34, '#ff6a2a', 0.45 * k);
      for (let q = 0; q < 4; q++) if (Math.random() < 0.3) { ctx.fillStyle = '#ffd23f'; ctx.fillRect(mx - 6 + Math.random() * 12, my - 10 - Math.random() * 10, 0.8, 0.8); }
      return true;
    }
    case 'conveyor': {       // esteira com lingotes que andam e esfriam
      box(o.x, o.y + 0.2, w, d - 0.4, 5, '#2a2a30', 0, '#3a3a40');
      for (let u = 0; u < w; u += 0.5) { const [ax, ay] = iso(o.x + u, o.y + 0.2, 5), [bx2, by2] = iso(o.x + u, o.y + d - 0.2, 5); line([[ax, ay], [bx2, by2]], 'rgba(0,0,0,0.35)', 0.3); }
      for (let k = 0; k < 5; k++) {
        const f = ((t * 0.12 + k / 5) % 1), x = o.x + f * (w - 0.6);
        const col = f < 0.5 ? (f < 0.25 ? '#ffd27a' : '#ff8a3d') : f < 0.8 ? '#8a4a2a' : '#5a5a60';
        box(x + 0.1, o.y + 0.32, 0.45, d - 0.64, 1.6, col, 5, shade(col, 1.2));
        if (f < 0.4) { const [gx, gy] = iso(x + 0.3, o.y + d / 2, 7); glow(gx, gy, 8, '#ff6a2a', 0.35); }
      }
      return true;
    }
  }
  return false;
}
