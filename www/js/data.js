// ============================================================
// O Silêncio do Hotel Alvorada — dados do caso
// ============================================================

const EVIDENCE = {
  e_corpo: { name: 'Corpo de Arthur Pendelton', short: 'Corpo', kind: 'física',
    desc: 'Implante neural fundido na nuca. A sobrecarga elétrica não explica tudo: há uma fratura no crânio — sinal de um golpe físico com objeto pesado.' },
  e_taca: { name: 'Taça com resíduos', short: 'Taça', kind: 'física',
    desc: 'Resíduos de NX-7, um composto neural paralisante de laboratório. Não é letal sozinho: incapacita a vítima por horas.' },
  e_cronometro: { name: 'Cronômetro travado — 23:15', short: 'Cronômetro', kind: 'digital',
    desc: 'O cronômetro de pulso parou exatamente às 23:15. O firmware mostra uma reescrita manual de horário. Conveniente demais.' },
  e_arquivo: { name: 'Arquivo criptografado', short: 'Arquivo', kind: 'digital',
    desc: 'Parcialmente queimado. Contém as patentes de IA registradas por Arthur — criadas pela Dra. Helena Souza — e um rascunho de testamento removendo Evelyn. Log: tentativa de acesso remoto às 22:50.' },
  e_trava: { name: 'Log da trava quântica', short: 'Trava', kind: 'digital',
    desc: 'A suíte foi trancada às 23:20 — não por dentro, mas remotamente, com a credencial administrativa ADM-02.' },
  e_duto: { name: 'Duto de ventilação de serviço', short: 'Duto', kind: 'física',
    desc: 'Parafusos soltos pelo lado de dentro. Arranhões de metal pesado. Alguém passou por aqui — vindo de baixo.' },
  e_nanobots: { name: 'Nanorrobôs biomonitores', short: 'Nanorrobôs', kind: 'digital',
    desc: 'Os nanorrobôs de saúde de Arthur registraram parada cardíaca às 22:57 — dezoito minutos antes do horário do cronômetro.' },
  e_pegadas: { name: 'Pegadas assimétricas', short: 'Pegadas', kind: 'física',
    desc: 'Rastro térmico do duto até o corpo. O peso está desbalanceado: o lado esquerdo carrega ~40 kg extras. Uma prótese pesada?' },
  e_porta_servico: { name: 'Porta de serviço do 4º andar', short: 'Porta serv.', kind: 'física',
    desc: 'Usada recentemente: resíduo térmico na maçaneta e arranhões novos. Leva aos túneis de manutenção da era analógica — que ligam ao duto da 404.' },
  e_tomas_ronda: { name: 'Depoimento de Tomás', short: 'Tomás', kind: 'depoimento',
    desc: 'Às 22:55 ouviu um baque metálico vindo da 404. Às 23:00 viu a porta de serviço entreaberta. Escondeu-se por medo de ter a identidade falsa descoberta.' },
  e_bar_log: { name: 'Registros do bar', short: 'Bar', kind: 'digital',
    desc: 'Evelyn pagou bebidas sem interrupção das 22:30 às 23:40. Às 22:20, a Dra. Helena pediu um drinque personalizado entregue na suíte 404.' },
  e_testamento: { name: 'Confissão de Evelyn', short: 'Testamento', kind: 'depoimento',
    desc: 'Evelyn sabia que seria retirada do testamento. "Eu queria vê-lo arruinado, não morto. Morto, ele não pode mais mudar de ideia."' },
  e_discussao: { name: 'Discussão no lobby', short: 'Discussão', kind: 'depoimento',
    desc: 'Helena admite a discussão: Arthur roubou suas patentes de IA e riu na cara dela. "Ele ia pagar, de um jeito ou de outro."' },
  e_falencia: { name: 'Falência do hotel', short: 'Falência', kind: 'depoimento',
    desc: 'Victor admite: o hotel está falido. Arthur ameaçou cortar todo o financiamento na manhã seguinte.' },
  e_luva: { name: 'Braço mecânico de Victor', short: 'Luva', kind: 'física',
    desc: 'Sob a luva fina: uma prótese industrial pesada (~40 kg). A luva tem um rasgo recente e fibras pretas faltando.' },
  e_oculos: { name: 'Óculos AR de Helena', short: 'Óculos AR', kind: 'digital',
    desc: 'ID do dispositivo: HS-AR. Conectado a um drive na suíte 404 das 22:50 às 22:52.' },
  e_recepcao_log: { name: 'Registro da chave mestra', short: 'Chave ADM', kind: 'digital',
    desc: 'A credencial ADM-02 pertence a Victor Rossi. Último uso: 23:20, trancamento remoto da suíte 404 a partir do terminal T-03 — nos túneis de manutenção.' },
  e_terminal_t03: { name: 'Terminal T-03', short: 'T-03', kind: 'digital',
    desc: 'Sessão ADM-02 aberta às 23:18, encerrada às 23:21. Comando: LOCK SUITE_404 /QUANTUM. A câmera do túnel foi desligada às 22:40.' },
  e_ferramenta: { name: 'Chave hidráulica', short: 'Ferramenta', kind: 'física',
    desc: 'Ferramenta pesada escondida atrás dos canos. Sob luz forense: material biológico de Arthur e fibras sintéticas pretas — idênticas às da luva de Victor.' },
  e_papeis: { name: 'Papéis de resgate', short: 'Papéis', kind: 'física',
    desc: 'Contrato de resgate financeiro do Hotel Alvorada, pronto para Arthur assinar. Assinado apenas por Victor Rossi. Manchado de chuva ácida.' },
  e_tiroteio: { name: 'Emboscada nos túneis', short: 'Emboscada', kind: 'depoimento',
    desc: 'Uma figura encapuzada atirou em Vance nos túneis e fugiu pela escada. Mancava: o lado esquerdo era muito mais pesado. Sob o capuz, um brilho amarelo, como um implante.' },
  e_polvora: { name: 'Resíduo de disparo na luva', short: 'Pólvora', kind: 'física',
    desc: 'O scanner detecta resíduo de disparo recente na luva do braço mecânico de Victor Rossi. Ele atirou com essa mão há menos de uma hora.' },
  e_confissao: { name: 'Confissão de Helena', short: 'Confissão H.', kind: 'depoimento',
    desc: 'Helena admite o NX-7 e a tentativa de roubar as patentes. Jura que Arthur respirava quando ela desconectou, às 22:52.' },
};

const DEDUCTIONS = [
  { id: 'd_entrada', a: 'e_duto', b: 'e_porta_servico', name: 'Quarto fechado resolvido',
    desc: 'O assassino não usou a porta: veio pelos túneis de serviço e subiu pelo duto de ventilação.' },
  { id: 'd_hora', a: 'e_nanobots', b: 'e_cronometro', name: 'Horário forjado',
    desc: 'Arthur morreu às 22:57. O cronômetro foi adulterado para criar um álibi às 23:15.' },
  { id: 'd_tomas', a: 'e_tomas_ronda', b: 'e_nanobots', name: 'Testemunha, não assassino',
    desc: 'Tomás ouviu o golpe às 22:55, batendo com a morte às 22:57. Ele é testemunha.' },
  { id: 'd_veneno', a: 'e_taca', b: 'e_bar_log', name: 'Origem do veneno',
    desc: 'O NX-7 estava no drinque que Helena enviou à suíte às 22:20.' },
  { id: 'd_hack', a: 'e_arquivo', b: 'e_oculos', name: 'Tentativa de roubo',
    desc: 'Helena usou os óculos AR para invadir o drive de patentes enquanto Arthur estava paralisado.' },
  { id: 'd_evelyn', a: 'e_bar_log', b: 'e_testamento', name: 'Álibi de Evelyn',
    desc: 'Motivo forte, mas Evelyn esteve no bar o tempo todo. Ela não estava na 404.' },
  { id: 'd_trava', a: 'e_trava', b: 'e_recepcao_log', name: 'Quem trancou a suíte',
    desc: 'A credencial de Victor Rossi trancou a suíte remotamente, do terminal T-03, nos túneis.' },
  { id: 'd_braco', a: 'e_pegadas', b: 'e_luva', name: 'O peso da prótese',
    desc: 'As pegadas desbalanceadas batem com o braço mecânico de Victor.' },
  { id: 'd_motivo', a: 'e_falencia', b: 'e_papeis', name: 'Motivo de Victor',
    desc: 'Victor precisava da assinatura de Arthur para salvar o hotel. Encontrou-o paralisado — sem assinatura.' },
  { id: 'd_atirador', a: 'e_tiroteio', b: 'e_polvora', name: 'O atirador encapuzado',
    desc: 'Foi Victor quem atirou em Vance nos túneis, tentando recuperar a arma do crime.' },
  { id: 'd_arma', a: 'e_corpo', b: 'e_ferramenta', name: 'A arma do crime',
    desc: 'A fratura na nuca foi causada pela chave hidráulica — com fibras da luva de Victor.' },
];

// ------------------------------------------------------------
// Personagens (visual em pixel art procedural)
// ------------------------------------------------------------
const LOOKS = {
  vance:  { coat: '#1c2a4a', coatDark: '#101a30', skin: '#d8a27a', hair: '#0c0c10', legs: '#16161c', implant: '#38f6ff', shirt: '#121216', collar: '#2a2a32', hairStyle: 'modern', jacket: true },
  evelyn: { coat: '#5a2a7a', coatDark: '#3d1b55', skin: '#e8c4b0', hair: '#d9d9f0', legs: '#1a1426', implant: '#ff4fd8', long: true, shirt: '#1a0f24', hairStyle: 'long', rim: [255, 79, 216] },
  victor: { coat: '#2e3445', coatDark: '#1f2330', skin: '#c99a76', hair: '#14141c', legs: '#181a22', implant: '#ffd23f', armL: '#8a93a6', sweat: true, shirt: '#d8d8e0', tie: '#8a2a2a', hairStyle: 'slick' },
  helena: { coat: '#d6e2ea', coatDark: '#9fb2c0', skin: '#b5835e', hair: '#3a2416', legs: '#22283a', implant: '#38f6ff', goggles: '#38f6ff', long: true, shirt: '#2a3448', hairStyle: 'bun' },
  tomas:  { coat: '#b8621d', coatDark: '#7d4013', skin: '#c48e68', hair: '#55504a', legs: '#2a2420', implant: '#ff6b3d', wide: true, shirt: '#e0d0b0', hairStyle: 'bald', beard: true, rim: [255, 107, 61] },
  arthur: { coat: '#3b3b4a', coatDark: '#2a2a36', skin: '#a99a94', hair: '#9a9aa4', legs: '#22222c', implant: '#ff3355', shirt: '#e0e0e8', tie: '#1a1a24', hairStyle: 'slick', rim: [255, 51, 85] },
  hooded: { coat: '#17161f', coatDark: '#0b0a10', skin: '#2a2430', hair: '#1d1b26', legs: '#111017', implant: '#ffd23f', armL: '#5f6676', long: true, shirt: '#0b0a10', hairStyle: 'hood', rim: [255, 51, 85] },
  iris:   { coat: '#38f6ff', coatDark: '#1aa8c0', skin: '#bff8ff', hair: '#7dd8ff', legs: '#1aa8c0', implant: '#ffffff', long: true, holo: true, shirt: '#e8ffff', hairStyle: 'bob', rim: [255, 255, 255] },
};
// os diálogos ficam em dialogues.js

// ------------------------------------------------------------
// Mapas
// wallN: parede do fundo-direita (um caractere por coluna x)
// wallW: parede do fundo-esquerda (um caractere por linha y)
//   glass: true = parede esquerda inteira de vidro, com a cidade lá fora
//   . lisa  D porta  E elevador  S porta de serviço
//   N letreiro neon  H holo-pôster  V grade de ventilação
//   B prateleira de bebidas  P canos  L escada
// ------------------------------------------------------------
const ROOMS = {
  suite: {
    name: 'Suíte Presidencial — 404', w: 10, h: 8, floor: 'carpet', dark: 0.6,
    neon: '#b04cff', wallColor: ['#2a1a3a', '#1e1230'],
    glass: true, wallN: '..D..H..V.', wallW: '........',
    lights: [
      { x: 7.5, y: 3.5, z: 14, r: 70, color: '#38f6ff' },
      { x: 1.5, y: 0.6, z: 30, r: 60, color: '#ff4fd8' },
      { x: 0.3, y: 2, z: 26, r: 60, color: '#4060ff' },
      { x: 0.3, y: 6, z: 26, r: 60, color: '#6a40ff' },
      { x: 5.5, y: 4.5, z: 24, r: 50, color: '#ff3355', flicker: true },
    ],
    objects: [
      { kind: 'bed', x: 1, y: 2, w: 2, d: 3, solid: true, key: 'cama', name: 'Cama' },
      { kind: 'corpse', x: 5, y: 4, solid: true, key: 'corpo', name: 'Arthur Pendelton' },
      { kind: 'glass', x: 6, y: 5, key: 'taca', name: 'Taça caída' },
      { kind: 'holotable', x: 7, y: 3, solid: true, key: 'holomesa', name: 'Mesa holográfica' },
      { kind: 'vent', x: 8, y: 0, solid: true, key: 'duto', name: 'Grade de ventilação', scan: true },
      { kind: 'panel', x: 3, y: 0, solid: true, key: 'painel', name: 'Painel da trava quântica' },
      { kind: 'footprint', x: 8, y: 1, hidden: true, key: 'pegadas', name: 'Pegadas térmicas' },
      { kind: 'footprint', x: 7, y: 2, hidden: true, key: 'pegadas', name: 'Pegadas térmicas' },
      { kind: 'footprint', x: 6, y: 3, hidden: true, key: 'pegadas', name: 'Pegadas térmicas' },
      { kind: 'nanobots', x: 4, y: 5, hidden: true, key: 'nanobots', name: 'Nuvem de nanorrobôs' },
      { kind: 'lamp', x: 0, y: 0, solid: true, key: 'abajur', name: 'Luminária' },
      { kind: 'plant', x: 9, y: 7, solid: true, key: 'planta', name: 'Planta holográfica' },
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'corridor', at: [1, 1], name: 'Porta → Corredor do 4º andar' },
    ],
  },
  corridor: {
    name: 'Corredor — 4º andar', w: 12, h: 4, floor: 'tiles', dark: 0.62,
    neon: '#38a0ff', wallColor: ['#1a2238', '#121a2c'],
    glass: true, wallN: '.D..HS..H.E.', wallW: '....',
    lights: [
      { x: 1.5, y: 0.4, z: 34, r: 45, color: '#38a0ff' },
      { x: 5.5, y: 0.4, z: 34, r: 40, color: '#ff3355', flicker: true },
      { x: 10.5, y: 0.4, z: 34, r: 50, color: '#38f6ff' },
      { x: 8, y: 2.5, z: 20, r: 45, color: '#ffb347' },
      { x: 0.3, y: 2, z: 26, r: 55, color: '#4060ff' },
    ],
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', to: 'suite', at: [2, 1], name: 'Porta → Suíte 404' },
      { kind: 'exit', x: 10, y: 0, key: 'exit', to: 'lobby', at: [9, 1], gate: 2, name: 'Elevador → Lobby' },
      { kind: 'exit', x: 5, y: 0, key: 'servico', name: 'Porta de serviço', scan: true },
      { kind: 'cart', x: 8, y: 2, solid: true, key: 'carrinho', name: 'Carrinho de limpeza' },
      { kind: 'plant', x: 0, y: 3, solid: true, key: 'planta', name: 'Planta holográfica' },
      { kind: 'puddle', x: 3, y: 2 }, { kind: 'puddle', x: 9, y: 1 },
    ],
    npcs: [{ id: 'tomas', x: 7, y: 2 }, { id: 'iris', x: 3, y: 3 }],
  },
  lobby: {
    name: 'Lobby & Bar Cibernético', w: 16, h: 12, floor: 'marble', dark: 0.42,
    neon: '#ff4fd8', wallColor: ['#2a1630', '#1c0f24'],
    glass: true, streetView: true, wallN: '..HNNNH..EE.BBB.', wallW: '............',
    zones: [{ x0: 0, y0: 5, x1: 8, y1: 6, floor: 'carpet' }],
    lights: [
      { x: 4.5, y: 0.8, z: 36, r: 80, color: '#ffd8a0' },
      { x: 13, y: 1.5, z: 30, r: 75, color: '#b04cff' },
      { x: 9.5, y: 0.5, z: 30, r: 45, color: '#38f6ff' },
      { x: 4, y: 8.5, z: 30, r: 75, color: '#38a0ff' },
      { x: 0.3, y: 5.5, z: 26, r: 80, color: '#ff3355', flicker: true },
      { x: 0.3, y: 6.5, z: 26, r: 70, color: '#3a6aff' },
      { x: 10, y: 7, z: 34, r: 90, color: '#fff0d8' },
      { x: 13, y: 10, z: 28, r: 60, color: '#6a40ff' },
    ],
    objects: [
      { kind: 'exit', x: 9, y: 0, key: 'exit', to: 'corridor', at: [10, 1], name: 'Elevador → 4º andar' },
      { kind: 'desk', x: 2, y: 2, w: 5, d: 1, solid: true, key: 'balcao', name: 'Recepção' },
      { kind: 'terminal', x: 7, y: 2, solid: true, key: 'term_recepcao', name: 'Terminal da recepção' },
      { kind: 'bar', x: 12, y: 2, w: 3, d: 1, solid: true, key: 'balcao_bar', name: 'Balcão do bar' },
      { kind: 'terminal', x: 15, y: 2, solid: true, key: 'term_bar', name: 'Terminal do bar', screen: '#ff4fd8' },
      { kind: 'stool', x: 12, y: 3, solid: true }, { kind: 'stool', x: 14, y: 3, solid: true },
      { kind: 'rug', x: 1, y: 8, w: 4, d: 3, col: '#3a1838' },
      { kind: 'sofa', x: 1, y: 8, w: 1, d: 2, solid: true, key: 'sofa', name: 'Sofá' },
      { kind: 'armchair', x: 4, y: 8, solid: true, key: 'poltrona', name: 'Poltrona', seat: true },
      { kind: 'table', x: 2, y: 10, solid: true, key: 'mesa_lobby', name: 'Mesa de centro' },
      { kind: 'lamp', x: 0, y: 11 },
      { kind: 'cart', x: 1, y: 3, solid: true, key: 'carrinho_malas', name: 'Carrinho de malas', info: 'Malas de grife esperando hóspedes que não vão subir esta noite. Uma delas ainda pinga chuva ácida.' },
      { kind: 'plant', x: 8, y: 2, solid: true, key: 'planta', name: 'Planta holográfica' },
      { kind: 'plant', x: 0, y: 3, solid: true, key: 'planta', name: 'Planta holográfica' },
      { kind: 'plant', x: 15, y: 11, solid: true, key: 'planta', name: 'Planta holográfica' },
      { kind: 'plant', x: 8, y: 11, solid: true, key: 'planta', name: 'Planta holográfica' },
      { kind: 'table', x: 12, y: 7, solid: true, key: 'mesa_lobby', name: 'Mesa do bar' },
      { kind: 'table', x: 14, y: 9, solid: true, key: 'mesa_lobby', name: 'Mesa do bar' },
      { kind: 'puddle', x: 1, y: 5 }, { kind: 'puddle', x: 2, y: 6 }, { kind: 'puddle', x: 4, y: 5 },
    ],
    npcs: [
      { id: 'victor', x: 5, y: 4 },
      { id: 'evelyn', x: 13, y: 3 },
      { id: 'helena', x: 6, y: 8 },
      { id: 'iris', x: 10, y: 10 },
    ],
  },
  tunnels: {
    name: 'Túneis de Manutenção', w: 10, h: 8, floor: 'concrete', dark: 0.74,
    neon: '#7dff6b', wallColor: ['#1c1f1a', '#141612'],
    wallN: 'P.L..V..P.', wallW: 'P..PP..P',
    lights: [
      { x: 2.5, y: 0.6, z: 30, r: 50, color: '#ffb347', flicker: true },
      { x: 8.5, y: 1.5, z: 14, r: 55, color: '#7dff6b' },
      { x: 3.5, y: 5.5, z: 26, r: 45, color: '#ffb347' },
    ],
    objects: [
      { kind: 'exit', x: 2, y: 0, key: 'exit', to: 'corridor', at: [5, 1], name: 'Escada → Corredor do 4º andar' },
      { kind: 'shaft', x: 5, y: 0, solid: true, key: 'duto2', name: 'Duto vertical' },
      { kind: 'terminal', x: 8, y: 1, solid: true, key: 't03', name: 'Terminal T-03', screen: '#7dff6b' },
      { kind: 'crate', x: 3, y: 5, solid: true, key: 'papeis', name: 'Caixote com papéis' },
      { kind: 'toolbox', x: 8, y: 6, solid: true, key: 'ferramenta', name: 'Canos e ferramentas', scan: true },
      { kind: 'pipe', x: 0, y: 3, solid: true }, { kind: 'pipe', x: 0, y: 4, solid: true },
      { kind: 'pipe', x: 9, y: 3, solid: true },
      { kind: 'puddle', x: 5, y: 4 }, { kind: 'puddle', x: 6, y: 5 }, { kind: 'puddle', x: 2, y: 6 },
    ],
  },
};

const ACTS = {
  1: { title: 'ATO I', sub: 'A Cena do Quarto Fechado' },
  2: { title: 'ATO II', sub: 'Interrogatórios e Quebra de Álibis' },
  3: { title: 'ATO III', sub: 'A Passagem Oculta' },
};

const ENDINGS = {
  perfeito: { title: 'FINAL PERFEITO', sub: 'A Verdade Inteira', good: true,
    text: 'Você expõe os dois planos que se sobrepuseram naquela noite. A Dra. Helena Souza é indiciada por tentativa de homicídio e invasão neural: o NX-7 e os óculos AR não deixam dúvida. E Victor Rossi — que subiu pelo duto, encontrou Arthur paralisado e desferiu o golpe fatal com a chave hidráulica — é preso pelo assassinato.\n\nO cronômetro forjado, a trava acionada dos túneis, as pegadas pesadas: cada peça no lugar.\n\nLá fora, a chuva ácida finalmente diminui. Pela primeira vez em anos, a corporação precisa admitir: o Detetive Vance estava certo.' },
  quase: { title: 'FINAL', sub: 'Justiça Parcial', good: true,
    text: 'Victor Rossi é condenado pelo assassinato de Arthur Pendelton. As provas são sólidas e o júri corporativo não hesita.\n\nMas metade da verdade fica no escuro. {extra}\n\nVance acende um cigarro sintético na chuva. O caso está fechado. Ele só não sabe se está resolvido.' },
  fraco: { title: 'FINAL', sub: 'Caso Arquivado', good: false,
    text: 'Você apontou o homem certo. Mas sem provas sólidas — a arma do crime, o horário forjado, a ligação direta com a cena — os advogados corporativos de Victor Rossi desmontam a acusação em menos de uma hora.\n\nRossi sai do tribunal sorrindo, ajeitando a luva no braço mecânico.\n\nÀs vezes, saber não basta. É preciso provar.' },
  incompleto: { title: 'FINAL INCOMPLETO', sub: 'Meia Verdade', good: false,
    text: 'Os rastros do NX-7 bastam para condenar a Dra. Helena Souza. A corporação comemora um caso encerrado em tempo recorde.\n\nMas Arthur respirava quando ela desconectou. O golpe na nuca veio depois — e de outras mãos.\n\nMeses depois, em algum lugar do Sector 4, Victor Rossi reinaugura o Hotel Alvorada com o dinheiro do seguro.' },
  errado: { title: 'FINAL ERRADO', sub: 'Licença Cassada', good: false,
    text: 'Você acusa Evelyn Pendelton. O registro do bar a coloca a vinte andares de distância no horário do crime, pagando bebidas a cada dez minutos.\n\nOs advogados dela riem. A corporação, constrangida, cassa a sua licença e encerra o caso.\n\nO Detetive Vance devolve o distintivo sob a chuva ácida. O assassino nunca foi encontrado.' },
  errado_tomas: { title: 'FINAL ERRADO', sub: 'O Bode Expiatório', good: false,
    text: 'Você acusa Tomás Bruno. A identidade falsa vem à tona e o júri corporativo não precisa de mais nada: um ex-criminoso no corredor do crime.\n\nMas Tomás era só uma testemunha assustada. Ele ouviu o golpe — não o deu.\n\nO verdadeiro assassino assiste ao julgamento pela holo-TV do hotel, ajeitando a luva no braço mecânico.' },
};
