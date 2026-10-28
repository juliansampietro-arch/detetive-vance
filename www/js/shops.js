// ============================================================
// Comércios da cidade: interiores por tipo de loja, mochila e itens com efeito
// Tudo é de graça (Vance é da polícia, os lojistas preferem não discutir).
// No penhores não se leva nada de graça: troca-se um item da mochila por outro.
// ============================================================

// itens novos (comida de lanchonete e farmácia); o resto vem de CONSUMABLES
Object.assign(CONSUMABLES, {
  hamburguer:  { name: 'Hambúrguer Kyng impresso', fome: 55, sede: -5, text: 'Carne cultivada, impressa na hora em camadas perfeitas. O queijo escorre. Vance não pergunta de que é feito.' },
  batata:      { name: 'Batata frita de tanque', fome: 25, sede: -10, text: 'Crocante, salgada, servida num cone de papel reciclado. Some em segundos.' },
  kola:        { name: 'Kola-Kola gelada', sede: 35, cansaco: 8, text: 'Garrafa curva, gelada, borbulhando. Zero açúcar, cem por cento nanorrobôs.' },
  analgesico:  { name: 'Analgésico NeoVida', cansaco: 15, text: 'Dois comprimidos azuis. A dor de cabeça da chuva ácida some devagar.' },
  bateria:     { name: 'Bateria de implante', cansaco: 22, text: 'Vance encaixa a bateria no implante da têmpora. Um formigamento elétrico e a cabeça clareia.' },
});

// equipamentos: ficam na mochila e funcionam enquanto Vance os carrega
const GEAR = {
  tenis:    { name: 'Tênis Nyke Air Mag', effect: 'Vance anda 20% mais rápido a pé.', text: 'Cadarço que se amarra sozinho e amortecimento magnético. Os passos ficam leves.' },
  jaqueta:  { name: 'Jaqueta Nyke Storm', effect: 'Na rua, o cansaço sobe 25% mais devagar.', text: 'Impermeável à chuva ácida, com aquecimento interno. Vance finalmente para de tremer.' },
  chinelos: { name: 'Chinelos Havaionas', effect: 'O cansaço sobe 10% mais devagar.', text: 'Sola antiderrapante para chuva ácida. Os pés agradecem.' },
  relogio:  { name: 'Relógio Samsong', effect: 'Mostra fome, sede e cansaço em números.', text: 'Tela dobrável no pulso. Ele vigia o corpo de Vance melhor do que o próprio Vance.' },
  lanterna: { name: 'Lanterna Pear Glow', effect: 'Ambientes escuros ficam um pouco mais claros.', text: 'Branca, minimalista, com uma pera mordida. Ilumina como um holofote.' },
  visao:    { name: 'Implante de visão noturna', effect: 'Ambientes escuros ficam bem mais claros.', text: 'Quinze minutos na cadeira da clínica. Agora o escuro tem tons de verde.' },
  metab:    { name: 'Implante metabólico', effect: 'Fome e sede sobem 20% mais devagar.', text: 'Um chip no estômago que economiza energia. O médico garante que é "quase" legal.' },
  isqueiro: { name: 'Isqueiro Zippo de 1990', effect: 'Nenhum. Mas é bonito.', text: 'Metal gasto, tampa que estala. Vance não fuma, mas gosta do som.' },
  disco:    { name: 'Disco de vinil de bossa-nova', effect: 'Nenhum. Lembra o pai de Vance.', text: 'Um LP arranhado de 1964. O pai ouvia esse disco aos domingos.' },
};
function itemInfo(id) { return CONSUMABLES[id] || GEAR[id]; }
const BAG_MAX = 5;   // unidades de cada comida, bebida ou remédio

// tipo de interior e estoque de cada fachada (pelo letreiro)
const SHOP_BY_SIGN = {
  'BURGER KYNG': { type: 'lanchonete', stock: ['hamburguer', 'batata', 'kola'] },
  'McDRONE’S':   { type: 'lanchonete', stock: ['hamburguer', 'batata', 'kola', 'sanduiche'] },
  'SUBWAVE':     { type: 'lanchonete', stock: ['sanduiche', 'agua', 'kola'] },
  'KOLA-KOLA':   { type: 'lanchonete', stock: ['kola', 'sanduiche', 'agua'] },
  'FARMÁCIA':    { type: 'farmacia', stock: ['analgesico', 'estimulante', 'eletrolitico', 'gengibre'] },
  'DROGACYBER':  { type: 'farmacia', stock: ['analgesico', 'estimulante', 'eletrolitico', 'agua'] },
  'STARBYTES':   { type: 'cafe', stock: ['espresso', 'cafelata', 'bolo', 'sanduiche'] },
  '24-ELEVEN':   { type: 'conveniencia', stock: ['barra', 'noodle', 'agua', 'neovolt', 'kola'] },
  'BAR':         { type: 'bar', stock: ['cerveja', 'agua'] },
  'RAMEN 24H':   { type: 'ramen', stock: ['ramen_shoyu', 'gyoza', 'agua'] },
  'NOODLES':     { type: 'ramen', stock: ['ramen_shoyu', 'gyoza', 'cha'] },
  'NYKE':        { type: 'roupas', stock: ['tenis', 'jaqueta'] },
  'HAVAIONAS':   { type: 'roupas', stock: ['chinelos'] },
  'PEAR':        { type: 'eletronicos', stock: ['lanterna', 'bateria'] },
  'SAMSONG':     { type: 'eletronicos', stock: ['relogio', 'bateria'] },
  'CYBERDECK':   { type: 'eletronicos', stock: ['bateria', 'lanterna'] },
  'CASAS BAHYA': { type: 'eletronicos', stock: ['relogio', 'lanterna'] },
  'CLÍNICA CIBER': { type: 'clinica', stock: ['visao', 'metab', 'bateria'] },
  'PENHORES':    { type: 'penhores', stock: ['isqueiro', 'disco', 'relogio', 'lanterna'] },
};
function shopOf(o) { return !!o && o.kind === 'shopfront' && SHOP_BY_SIGN[o.sign]; }

// ---------- interiores (um por tipo; nome e cor vêm da fachada) ----------
// cada tipo tem tamanho, paleta, luz, atendente e clientes próprios
Object.assign(LOOKS, {
  at_lanche: { coat: '#c82a2a', coatDark: '#8a1a1a', skin: '#e0b090', hair: '#e8c040', legs: '#2a2a2a', implant: '#ffd23f', shirt: '#ffd23f', hairStyle: 'bob' },
  at_farma:  { coat: '#e8f0ec', coatDark: '#b0c4bc', skin: '#a87050', hair: '#1a1a20', legs: '#2a3a34', implant: '#7dff6b', shirt: '#2a6a4a', hairStyle: 'bun', long: true },
  at_cafe:   { coat: '#2a4a3a', coatDark: '#1a3026', skin: '#d8b090', hair: '#7a3a1a', legs: '#2a2420', implant: '#ffd23f', shirt: '#e8e0d0', hairStyle: 'modern', beard: true },
  at_conv:   { coat: '#ff8a3d', coatDark: '#b8582a', skin: '#c89070', hair: '#141418', legs: '#1a1a24', implant: '#38f6ff', shirt: '#1a1a24', hairStyle: 'short' },
  at_bar:    { coat: '#141418', coatDark: '#0a0a0e', skin: '#6a4430', hair: '#b04cff', legs: '#141418', implant: '#ff4fd8', shirt: '#b04cff', hairStyle: 'long', long: true, jacket: true },
  at_ramen:  { coat: '#f0ece0', coatDark: '#c0b8a8', skin: '#e8c8a0', hair: '#1a1a20', legs: '#2a2a32', implant: '#ff3355', shirt: '#ff3355', hairStyle: 'bald' },
  at_roupas: { coat: '#1a1a24', coatDark: '#0e0e14', skin: '#e8c8a8', hair: '#38f6ff', legs: '#e8e8f0', implant: '#38f6ff', shirt: '#e8e8f0', hairStyle: 'modern', jacket: true },
  at_eletro: { coat: '#e8e8f0', coatDark: '#a8a8b8', skin: '#8a5a3a', hair: '#e8e8f0', legs: '#1a1a24', implant: '#38f6ff', shirt: '#38f6ff', hairStyle: 'short' },
  at_clinica:{ coat: '#d6e2ea', coatDark: '#9fb2c0', skin: '#c89a7a', hair: '#5a5a60', legs: '#22283a', implant: '#7dff6b', goggles: '#7dff6b', shirt: '#2a3448', hairStyle: 'slick', armL: '#8a93a6' },
  at_penhor: { coat: '#4a3a2a', coatDark: '#2e241a', skin: '#c89070', hair: '#9a9aa4', legs: '#2a2418', implant: '#ffd23f', shirt: '#8a7a50', hairStyle: 'bald', beard: true },
});

const SHOP_LAYOUTS = {
  lanchonete: { w: 9, h: 6, floor: 'smalltile', wallN: '.D..MMM.G', wallW: 'GG....', wall: ['#3a1414', '#2a0e0e'], dark: 0.25,
    lights: [{ x: 5, y: 1.5, z: 26, r: 80, color: '#ffd23f' }, { x: 2, y: 4, z: 26, r: 70, color: '#ff3355' }, { x: 7, y: 4.5, z: 26, r: 70, color: '#ffe8b0' }],
    clerk: { look: 'at_lanche', name: 'Atendente de lanchonete', intro: 'Bem-vindo! Combo do dia: hambúrguer impresso, batata e refri. Pra polícia é cortesia, pode pegar no balcão!',
      again: ['Saindo um quentinho!', 'Molho extra? É de graça. Tudo é de graça pra você.', 'Volte sempre! A chapa nunca desliga.'],
      chat: [['N', 'A impressora de carne travou duas vezes hoje. Saiu um hambúrguer em formato de cubo. O cliente adorou.'], ['N', 'Trabalho aqui de madrugada há dois anos. Já vi de tudo. Gente chorando no milk-shake, casamento, um assalto feito por um drone.']] },
    objects: [
      { kind: 'table', x: 1, y: 4, solid: true, key: 'mesa_loja', name: 'Mesa' },
      { kind: 'chair', x: 2, y: 4, solid: true, face: 'w', key: 'cadeira', name: 'Cadeira', seat: true, col: '#d83a2a' },
      { kind: 'table', x: 4, y: 4, solid: true, key: 'mesa_loja', name: 'Mesa' },
      { kind: 'chair', x: 5, y: 4, solid: true, face: 'w', key: 'cadeira', name: 'Cadeira', seat: true, col: '#ffd23f' },
      { kind: 'chair', x: 4, y: 5, solid: true, face: 'n', key: 'cadeira', name: 'Cadeira', seat: true, col: '#d83a2a' },
      { kind: 'vending_drink', x: 8, y: 1, solid: true, key: 'refri_loja', name: 'Máquina de refrigerante', info: 'Refil livre, diz o adesivo. O adesivo é de 2079.' },
      { kind: 'plant', x: 8, y: 5, solid: true, key: 'planta', name: 'Planta de plástico' },
    ],
    walkers: [
      { look: 'ped3', name: 'Cliente', x: 2, y: 4, seat: 'cadeira', lines: ['Hmm. Tem gosto de hambúrguer. Mais ou menos.', 'Terceiro combo da noite. Não me julgue, detetive.', 'Essa batata é a única coisa honesta da cidade.'] },
      { look: 'ped2', name: 'Cliente', x: 5, y: 4, seat: 'cadeira', lines: ['Shh, tô no meio de um episódio. *aponta pro implante ocular*', 'Pede o molho verde. Confia.', 'Meu namorado me trocou por uma IA. Vim afogar as mágoas em gordura.'] },
      { look: 'ped6', name: 'Entregador', x: 6, y: 2, area: [5, 2, 7, 3], lines: ['Pedido 4471, pedido 4471... cadê o pedido 4471?', 'Trinta entregas hoje. Na chuva ácida. Minha jaqueta tá derretendo.', 'Os drones roubam as entregas boas. Sobra pra gente o que é longe.'] },
    ] },
  farmacia: { w: 8, h: 7, floor: 'lab', wallN: '.D..GG.G', wallW: 'GG.G...', wall: ['#e0ece6', '#b8ccc2'], dark: 0.12,
    lights: [{ x: 4, y: 2, z: 28, r: 90, color: '#e8fff0' }, { x: 2, y: 5, z: 28, r: 80, color: '#7dff6b' }, { x: 6, y: 5, z: 28, r: 80, color: '#e8fff0' }],
    clerk: { look: 'at_farma', name: 'Farmacêutica', intro: 'Boa noite, detetive. Sem receita, sem perguntas, sem cobrança. Só não conte pro conselho de farmácia.',
      again: ['Lembre: estimulante não substitui sono.', 'Hidrate-se. A chuva ácida desidrata.', 'Mais alguma dor? Física, de preferência.'],
      chat: [['N', 'Metade da clientela vem por causa da chuva: queimadura, tosse, olho ardendo. A outra metade vem por causa dos implantes.'], ['N', 'Ontem um homem comprou vinte frascos de analgésico e pagou com crédito do Sindicato Lótus. Não fiz perguntas.']] },
    objects: [
      { kind: 'gondola', x: 1, y: 3, w: 2, solid: true, key: 'gondola', name: 'Gôndola de remédios', info: 'Nano-remédios, emplastros de cafeína e protetor contra chuva ácida fator 90.', col: '#7dff6b' },
      { kind: 'gondola', x: 5, y: 3, w: 2, solid: true, key: 'gondola', name: 'Gôndola de higiene', info: 'Pasta de dente com nanorrobôs clareadores e desodorante com bluetooth.', col: '#38f6ff' },
      { kind: 'gondola', x: 1, y: 5, w: 2, solid: true, key: 'gondola', name: 'Gôndola de vitaminas', info: 'Vitamina D sintética. Ninguém nesta cidade vê o sol há anos.', col: '#ffd23f' },
      { kind: 'bench', x: 6, y: 6, solid: true, key: 'banco', name: 'Banco de espera', seat: true },
      { kind: 'plant', x: 7, y: 5, solid: true, key: 'planta', name: 'Planta' },
    ],
    walkers: [
      { look: 'ped7', name: 'Senhor tossindo', x: 6, y: 6, seat: 'banco', lines: ['*cof cof* É a chuva, detetive. Quarenta anos respirando isso.', 'Tô esperando a receita do meu pulmão novo. Fila de dois anos.', 'Na minha época a chuva só molhava.'] },
      { look: 'ped4', name: 'Cliente', x: 4, y: 4, area: [3, 4, 4, 6], lines: ['Qual desses tira ressaca de implante? Todos dizem que sim.', 'Não olha pra minha cesta, por favor.', 'Remédio pra insônia ou estimulante? Ainda não decidi se hoje eu durmo.'] },
    ] },
  cafe: { w: 9, h: 6, floor: 'wood', wallN: '.D..MM.WW', wallW: 'GG.W..', wall: ['#2a1e14', '#1e140c'], dark: 0.45,
    lights: [{ x: 7, y: 1.5, z: 24, r: 60, color: '#ffb347' }, { x: 2.5, y: 4, z: 22, r: 55, color: '#ffcf8a' }, { x: 6.5, y: 4, z: 22, r: 55, color: '#ffcf8a' }],
    clerk: { look: 'at_cafe', name: 'Barista', intro: 'Ah, um cliente que parece precisar de café de verdade. Grãos cultivados em estufa, torrados aqui. Fique à vontade.',
      again: ['Espresso duplo? Você tem cara de espresso duplo.', 'O wi-fi é "StarBytes_Lento". Senha: paciência.', 'Sente-se. A chuva espera.'],
      chat: [['N', 'O pessoal vem pra trabalhar no notebook a noite toda. Ninguém dorme nesta cidade, só troca de cafeína.'], ['N', 'Sabe o que eu gosto da madrugada? Os pedidos ficam honestos. Ninguém pede latte de abóbora às quatro da manhã.']] },
    objects: [
      { kind: 'espresso', x: 8, y: 1, solid: true, key: 'maquina_cafe', name: 'Máquina de espresso', info: 'Cromada, chiando, com um nome de barista holográfico piscando na tela.' },
      { kind: 'table', x: 2, y: 4, solid: true, key: 'mesa_loja', name: 'Mesa' },
      { kind: 'chair', x: 3, y: 4, solid: true, face: 'w', key: 'cadeira', name: 'Poltrona', seat: true, col: '#2a6a4a' },
      { kind: 'chair', x: 2, y: 5, solid: true, face: 'n', key: 'cadeira', name: 'Poltrona', seat: true, col: '#2a6a4a' },
      { kind: 'table', x: 6, y: 4, solid: true, key: 'mesa_loja', name: 'Mesa' },
      { kind: 'chair', x: 7, y: 4, solid: true, face: 'w', key: 'cadeira', name: 'Poltrona', seat: true, col: '#6a3a2a' },
      { kind: 'sofa', x: 7, y: 2, w: 1, solid: true, key: 'sofa_loja', name: 'Sofá', seat: true },
      { kind: 'plant', x: 0, y: 5, solid: true, key: 'planta', name: 'Samambaia' },
    ],
    walkers: [
      { look: 'ped8', name: 'Escritora', x: 3, y: 4, seat: 'cadeira', lines: ['Estou escrevendo um romance policial. Posso usar você de personagem?', 'Capítulo doze. O detetive ainda não sabe que o culpado é... ah, não vou contar.', 'Esse é meu quinto café. A protagonista também está no quinto.'] },
      { look: 'ped1', name: 'Programador', x: 7, y: 4, seat: 'cadeira', lines: ['Não reinicia. Não reinicia. Não reinicia... reiniciou.', 'Trabalho pra uma startup que vende nuvem. A de verdade. Pra chover menos.', 'Você é policial? Eu juro que aquele código não era meu.'] },
      { look: 'ped5', name: 'Cliente', x: 2, y: 5, seat: 'cadeira', lines: ['Primeiro encontro. Ela tá atrasada quarenta minutos.', 'Esse bolo é de cenoura. Cenoura de verdade, de estufa. Custou um rim.'] },
    ] },
  conveniencia: { w: 9, h: 7, floor: 'smalltile', wallN: '.D..GG..G', wallW: 'GG.G...', wall: ['#1a2a3a', '#122030'], dark: 0.15,
    lights: [{ x: 4, y: 2, z: 28, r: 90, color: '#d8f0ff' }, { x: 2, y: 5, z: 28, r: 80, color: '#ff8a3d' }, { x: 7, y: 5, z: 28, r: 80, color: '#d8f0ff', flicker: true }],
    clerk: { look: 'at_conv', name: 'Caixa da madrugada', intro: '*Tira um fone do ouvido.* Opa. Polícia? Pega o que quiser, eu não ganho o bastante pra discutir.',
      again: ['*Volta pro jogo no celular.*', 'Tá tudo no lugar de sempre. Ou quase.', 'Se for roubar, rouba devagar. Brincadeira. Ou não.'],
      chat: [['N', 'Turno das dez às seis. Já vi alien de fantasia, noivas fugitivas e um cara que comprou só gelo. Trinta quilos de gelo.'], ['N', 'A lâmpada do fundo pisca desde que comecei. O gerente diz que é "ambiente". Eu digo que é economia.']] },
    objects: [
      { kind: 'gondola', x: 1, y: 3, w: 2, solid: true, key: 'gondola', name: 'Gôndola de salgadinhos', info: 'Chips de alga, amendoim sintético e um pacote de "batata de verdade" trancado a cadeado.', col: '#ff8a3d' },
      { kind: 'gondola', x: 5, y: 3, w: 2, solid: true, key: 'gondola', name: 'Gôndola de enlatados', info: 'Sopas, feijão, carne em lata. Tudo com validade até 2110.', col: '#ffd23f' },
      { kind: 'gondola', x: 1, y: 5, w: 3, solid: true, key: 'gondola', name: 'Gôndola de miojo', info: 'Quarenta sabores de macarrão instantâneo. O de "frango" nunca viu um frango.', col: '#ff3355' },
      { kind: 'fridge', x: 8, y: 2, solid: true, key: 'geladeira_loja', name: 'Geladeira de bebidas', info: 'Portas de vidro embaçadas e fileiras de energéticos brilhando.' },
      { kind: 'fridge', x: 8, y: 3, solid: true, key: 'geladeira_loja', name: 'Geladeira de bebidas', info: 'Cerveja, leite de aveia sintético e uma garrafa de saquê esquecida.' },
      { kind: 'vending_drink', x: 8, y: 6, solid: true, key: 'refri_loja', name: 'Máquina de energético', info: 'NEOVOLT: "durma quando morrer". Literalmente o slogan.' },
    ],
    walkers: [
      { look: 'ped6', name: 'Cliente indeciso', x: 4, y: 4, area: [3, 4, 7, 4], lines: ['Miojo de camarão ou de carne? É a decisão mais importante da minha noite.', 'Eles mudaram tudo de lugar de novo.', 'Tô procurando pilha AAA. Ninguém usa mais, mas meu controle sim.'] },
      { look: 'ped2', name: 'Estudante', x: 6, y: 6, area: [5, 5, 7, 6], lines: ['Prova às oito. Energético é minha alma agora.', 'Você sabe se NEOVOLT dá taquicardia? Pergunto por um amigo. Eu.'] },
    ] },
  bar: { w: 10, h: 7, floor: 'darkwood', wallN: '.D..BB.B.L', wallW: '...B...', wall: ['#1a0e1e', '#120814'], dark: 0.62,
    lights: [{ x: 5, y: 1.5, z: 22, r: 60, color: '#b04cff' }, { x: 2, y: 5, z: 18, r: 45, color: '#ff4fd8', flicker: true }, { x: 7.5, y: 5, z: 18, r: 45, color: '#38f6ff' }],
    clerk: { look: 'at_bar', name: 'Bartender', intro: 'Detetive. Senta, a primeira é por conta. A segunda também. Esta noite ninguém paga nada mesmo.',
      again: ['Mais uma?', '*Seca um copo que já estava seco.*', 'Aqui dentro a chuva não entra. Só os problemas.'],
      chat: [['N', 'Bartender ouve tudo. Divórcio, dívida, confissão. Eu só não ouço o que não quero lembrar.'], ['N', 'Aquele cara na mesa do fundo está na mesma cerveja há três horas. Acho que ele está esperando alguém que não vem.']] },
    objects: [
      { kind: 'stool', x: 4, y: 2, solid: true, key: 'banqueta', name: 'Banqueta', seat: true },
      { kind: 'stool', x: 5, y: 2, solid: true, key: 'banqueta', name: 'Banqueta', seat: true },
      { kind: 'stool', x: 6, y: 2, solid: true, key: 'banqueta', name: 'Banqueta', seat: true },
      { kind: 'sofa', x: 1, y: 5, w: 2, solid: true, key: 'sofa_loja', name: 'Sofá de couro rasgado', seat: true },
      { kind: 'table', x: 1, y: 4, w: 2, solid: true, key: 'mesa_loja', name: 'Mesa' },
      { kind: 'table', x: 7, y: 4, solid: true, key: 'mesa_loja', name: 'Mesa' },
      { kind: 'stool', x: 8, y: 4, solid: true, key: 'banqueta', name: 'Banqueta', seat: true },
      { kind: 'pool', x: 5, y: 5, w: 2, solid: true, key: 'sinuca', name: 'Mesa de sinuca', info: 'O feltro tem queimaduras de cigarro e uma bola oito faltando.' },
    ],
    walkers: [
      { look: 'ped7', name: 'Bêbado filosófico', x: 4, y: 2, seat: 'banqueta', lines: ['Sabe qual o problema dessa cidade? *soluço* Tudo.', 'Eu já fui alguém, detetive. Fui gerente de banco de memória.', 'Paga uma? Ah, é de graça? Então paga duas.'] },
      { look: 'ped4', name: 'Cantora', x: 6, y: 2, seat: 'banqueta', lines: ['Canto aqui às sextas. Hoje é terça. Vim só beber.', 'Já cantei no Alvorada, nos bons tempos. Antes do gerente novo.', 'Quer um conselho? Nunca confie em homem de luva.'] },
      { look: 'ped1', name: 'Solitário', x: 8, y: 4, seat: 'banqueta', lines: ['...', 'Ela disse que vinha. Faz três horas.', 'Me deixa, detetive. Hoje não.'] },
      { look: 'ped6', name: 'Jogador de sinuca', x: 4, y: 5, area: [4, 4, 4, 6], lines: ['Bola nove na caçapa do canto. Olha... errei.', 'Aposta? Ah, você é policial. Não, nada de aposta.', 'Jogo aqui desde os dezesseis. A mesa é mais velha que eu.'] },
    ] },
  ramen: { w: 9, h: 6, floor: 'wood', wallN: '.D..MM.KK', wallW: '..K...', wall: ['#3a1a14', '#2a120e'], dark: 0.38,
    lights: [{ x: 5, y: 1.5, z: 24, r: 70, color: '#ffb347' }, { x: 1.5, y: 5, z: 20, r: 50, color: '#ff3355' }, { x: 7.5, y: 5, z: 20, r: 50, color: '#ff3355' }],
    clerk: { look: 'at_ramen', name: 'Mestre do ramen', intro: 'Irasshaimase! Caldo fervendo há dezoito horas. Senta no balcão, detetive. A tigela vem já.',
      again: ['Slurp alto é elogio aqui.', 'Mais cebolinha? Sempre mais cebolinha.', 'O caldo não espera. Coma enquanto está quente.'],
      chat: [['N', 'Meu avô abriu esta casa antes das corporações. O caldo é o mesmo. A cidade é que mudou em volta.'], ['N', 'Ramen é paciência. Você não apressa um caldo. Nem um caso, imagino.']] },
    objects: [
      { kind: 'stool', x: 4, y: 2, solid: true, key: 'banqueta', name: 'Banqueta', seat: true },
      { kind: 'stool', x: 5, y: 2, solid: true, key: 'banqueta', name: 'Banqueta', seat: true },
      { kind: 'stool', x: 6, y: 2, solid: true, key: 'banqueta', name: 'Banqueta', seat: true },
      { kind: 'table', x: 2, y: 4, solid: true, key: 'mesa_loja', name: 'Mesa baixa' },
      { kind: 'stool', x: 3, y: 4, solid: true, key: 'banqueta', name: 'Banqueta', seat: true },
      { kind: 'table', x: 6, y: 4, solid: true, key: 'mesa_loja', name: 'Mesa baixa' },
      { kind: 'stool', x: 7, y: 4, solid: true, key: 'banqueta', name: 'Banqueta', seat: true },
      { kind: 'lantern', x: 1, y: 5 }, { kind: 'lantern', x: 8, y: 5 },
    ],
    walkers: [
      { look: 'ped5', name: 'Cliente', x: 5, y: 2, seat: 'banqueta', lines: ['*slurrrp* Desculpa. É regra da casa.', 'Melhor ramen do setor. Mas não conta pro Sr. Wen que eu disse isso.', 'Vim de turno dobrado. Isso aqui me ressuscita.'] },
      { look: 'ped3', name: 'Operário', x: 3, y: 4, seat: 'banqueta', lines: ['Trabalho na manutenção dos túneis. Tá tudo alagado lá embaixo.', 'Ninguém desce nos túneis à noite. Ninguém com juízo.', 'Ovo marinado extra. Luxo de trabalhador.'] },
      { look: 'ped8', name: 'Turista', x: 7, y: 4, seat: 'banqueta', lines: ['Isso é ramen de verdade? Lá de onde venho é tudo pílula.', 'Tirei quarenta fotos da tigela. Esqueci de comer.'] },
    ] },
  roupas: { w: 8, h: 7, floor: 'marble', wallN: '.D..GGmm', wallW: 'Gm.G...', wall: ['#e8e8f0', '#c0c0cc'], dark: 0.1,
    lights: [{ x: 4, y: 2, z: 30, r: 100, color: '#ffffff' }, { x: 2, y: 5, z: 30, r: 70, color: '#38f6ff' }, { x: 6, y: 5, z: 30, r: 70, color: '#ff4fd8' }],
    clerk: { look: 'at_roupas', name: 'Vendedor estiloso', intro: 'Detetive! Esse sobretudo... é vintage ou é só velho? Não responda. Pegue algo novo, por conta da casa.',
      again: ['Ficou incrível. Sério.', 'Coleção outono-tempestade acabou de chegar.', 'Combina com a sua cara de cansado.'],
      chat: [['N', 'Moda nesta cidade é sobrevivência com estilo. Impermeável, antiácido, com LED. Feio não vende.'], ['N', 'O sobretudo de detetive anos 40 é nosso item mais devolvido. As pessoas descobrem que não são detetives.']] },
    objects: [
      { kind: 'arara', x: 1, y: 3, w: 2, solid: true, key: 'arara', name: 'Arara de roupas', info: 'Jaquetas impermeáveis, capas com LED e um sobretudo "estilo detetive anos 40". Vance finge não ver.' },
      { kind: 'arara', x: 5, y: 3, w: 2, solid: true, key: 'arara', name: 'Arara de calçados', info: 'Tênis que acendem, botas magnéticas e chinelos empilhados em cores neon.' },
      { kind: 'vitrine', x: 1, y: 5, w: 2, solid: true, key: 'vitrine', name: 'Vitrine de bonés', info: 'Bonés com tela, viseiras holográficas e um chapéu de feltro esquecido no canto.', col: '#ff4fd8' },
      { kind: 'bench', x: 5, y: 6, w: 2, solid: true, key: 'banco', name: 'Pufe de provador', seat: true },
      { kind: 'plant', x: 7, y: 5, solid: true, key: 'planta', name: 'Planta' },
    ],
    walkers: [
      { look: 'ped2', name: 'Cliente', x: 4, y: 4, area: [3, 4, 4, 5], lines: ['Esse tênis acende quando eu ando. Preciso disso? Preciso.', 'Fica bem em mim? Seja sincero. Não, não seja.'] },
      { look: 'ped1', name: 'Namorado entediado', x: 5, y: 6, seat: 'banco', lines: ['Ela tá no provador há quarenta minutos.', 'Trouxe livro. Já li dois capítulos.', 'Se ela perguntar, eu disse que gostei de todas.'] },
    ] },
  eletronicos: { w: 9, h: 6, floor: 'office', wallN: '.D..GG.GG', wallW: 'GG.G..', wall: ['#141a2a', '#0e1220'], dark: 0.3,
    lights: [{ x: 4, y: 1.5, z: 28, r: 80, color: '#38f6ff' }, { x: 2, y: 4, z: 26, r: 60, color: '#d8e8ff' }, { x: 7, y: 4.5, z: 26, r: 60, color: '#ff4fd8' }],
    clerk: { look: 'at_eletro', name: 'Técnico de vendas', intro: 'Bem-vindo à vanguarda! Tudo aqui tem no mínimo três atualizações obrigatórias. Leve o que quiser.',
      again: ['Já atualizou o firmware hoje?', 'Garantia estendida? Brincadeira, é de graça mesmo.', 'Cuidado, as vitrines têm sensor de baba.'],
      chat: [['N', 'A tempestade está fritando implantes pela cidade toda. Vendi trinta baterias desde a meia-noite.'], ['N', 'Lançaram um óculos que mostra anúncios dentro dos anúncios. Esgotou em dez minutos.']] },
    objects: [
      { kind: 'vitrine', x: 1, y: 3, w: 2, solid: true, key: 'vitrine', name: 'Vitrine', info: 'Relógios dobráveis, fones invisíveis e implantes oculares expostos como joias.', col: '#38f6ff' },
      { kind: 'vitrine', x: 5, y: 3, w: 2, solid: true, key: 'vitrine', name: 'Vitrine', info: 'Baterias de implante, lanternas de bolso e um cyberdeck de edição limitada.', col: '#ff4fd8' },
      { kind: 'tv', x: 8, y: 4, solid: true, key: 'tv_loja', name: 'Holo-TV de demonstração', info: 'Passa em loop um anúncio de óculos que mostram anúncios.' },
      { kind: 'terminal', x: 8, y: 2, solid: true, key: 'terminal_loja', name: 'Totem de demonstração', info: '"Experimente o futuro!" O futuro trava ao abrir.' },
      { kind: 'tv', x: 1, y: 5, solid: true, key: 'tv_loja', name: 'Holo-TV gigante', info: 'Um jogo de futebol de 2066 em 8K. O replay mais visto da história.' },
    ],
    walkers: [
      { look: 'ped4', name: 'Hacker', x: 4, y: 4, area: [3, 4, 4, 5], lines: ['Esse cyberdeck tem uma porta de debug aberta. Não que eu tenha olhado.', 'Tô só olhando. Juro.', 'O firewall do Alvorada? Papel molhado. Ouvi dizer.'] },
      { look: 'ped8', name: 'Senhora', x: 6, y: 5, area: [5, 4, 7, 5], lines: ['Meu neto disse pra comprar um "relógio inteligente". Ele é mais inteligente que eu?', 'Onde fica o botão de ligar? Não tem botão?!'] },
    ] },
  clinica: { w: 8, h: 6, floor: 'lab', wallN: '.D..GG.V', wallW: 'GG..V.', wall: ['#1a2a24', '#10201a'], dark: 0.3,
    lights: [{ x: 2, y: 4, z: 30, r: 70, color: '#7dff6b' }, { x: 5, y: 1.5, z: 28, r: 60, color: '#e8fff0' }, { x: 6, y: 4.5, z: 26, r: 50, color: '#38f6ff', flicker: true }],
    clerk: { look: 'at_clinica', name: 'Cirurgião de rua', intro: 'Hm. Policial. Minha licença está em renovação... permanente. Mas para você, cirurgia de graça. Sente-se.',
      again: ['Anestesia é opcional. Recomendo.', 'Não toque nos braços mecânicos. Eles têm vontade própria.', 'Procedência garantida. Não pergunte de onde.'],
      chat: [['N', 'Quinze anos operando. Comecei no hospital da Pendelton BioCyber. Saí antes de me pedirem coisas que eu não faria.'], ['N', 'Instalei o braço de muita gente importante nesta cidade. Incluindo gente que usa luva preta pra esconder.']] },
    objects: [
      { kind: 'cot', x: 1, y: 4, w: 2, solid: true, key: 'maca', name: 'Cadeira de implantes', info: 'Reclinável, com braços mecânicos dobrados ao lado. "Sem perguntas", diz a placa. Em letras bem pequenas.' },
      { kind: 'vitrine', x: 5, y: 4, w: 2, solid: true, key: 'vitrine', name: 'Vitrine de implantes', info: 'Olhos, rins, chips de memória. Cada peça com uma etiqueta de "procedência garantida".', col: '#7dff6b' },
      { kind: 'bench', x: 7, y: 2, solid: true, key: 'banco', name: 'Banco de espera', seat: true },
    ],
    walkers: [
      { look: 'ped6', name: 'Paciente nervoso', x: 7, y: 2, seat: 'banco', lines: ['É minha primeira vez. Um olho novo. Será que dói?', 'Li as avaliações. Quatro estrelas. A quinta pessoa não voltou pra avaliar.', 'Se eu desmaiar, me acorda?'] },
    ] },
  penhores: { w: 8, h: 6, floor: 'darkwood', wallN: '.D..GG.B', wallW: 'B.....', wall: ['#2a2014', '#1e160c'], dark: 0.6,
    lights: [{ x: 5, y: 1.5, z: 20, r: 55, color: '#ffd23f' }, { x: 2, y: 4, z: 18, r: 40, color: '#ffb347', flicker: true }],
    clerk: { look: 'at_penhor', name: 'Dono do penhores', intro: '*Nem levanta os olhos da lupa.* Aqui não tem nada de graça, detetive. Aqui se troca.',
      again: ['Tem algo pra trocar ou só veio olhar?', '*Resmunga.*', 'Tudo tem valor. Só não tem preço.'],
      chat: [['N', 'Cada coisa aqui tem uma história que o dono quis esquecer. Eu só guardo.'], ['N', 'Ontem me trouxeram um relógio de ouro do Alvorada. Gravado "A.P.". Recusei. Coisa quente demais.']] },
    objects: [
      { kind: 'vitrine', x: 1, y: 3, w: 2, solid: true, key: 'vitrine', name: 'Vitrine de penhores', info: 'Relógios, implantes usados, anéis de casamento. Tudo tem preço; nada tem história.', col: '#ffd23f' },
      { kind: 'bookshelf', x: 6, y: 3, w: 2, solid: true, key: 'estante_penhor', name: 'Estante de quinquilharias', info: 'Uma guitarra sem cordas, discos de vinil, um capacete de astronauta de plástico.' },
      { kind: 'crate', x: 7, y: 5, solid: true, key: 'caixote', name: 'Caixote' },
      { kind: 'crate', x: 1, y: 5, solid: true, key: 'caixote', name: 'Caixote de rádios velhos' },
    ],
    walkers: [
      { look: 'ped3', name: 'Músico falido', x: 4, y: 4, area: [3, 4, 5, 5], lines: ['Vim buscar minha guitarra. Ainda não tenho o dinheiro. Só vim visitar.', 'Penhorei meu implante auditivo. Agora ouço a cidade de verdade. É pior.'] },
    ] },
};

for (const [type, L] of Object.entries(SHOP_LAYOUTS)) {
  const id = 'at_' + type;
  ROOMS['loja_' + type] = {
    name: 'Loja', w: L.w, h: L.h, floor: L.floor, dark: L.dark, glass: true,
    neon: '#ff4fd8', wallColor: L.wall,
    wallN: L.wallN, wallW: L.wallW,
    lights: L.lights,
    objects: [
      { kind: 'exit', x: 1, y: 0, key: 'exit', shopExit: true, name: 'Saída → Rua' },
      { kind: 'counter', x: 4, y: 1, w: 3, d: 1, solid: true, key: 'balcao_loja', name: 'Balcão', col: L.wall[1], top: '#d8d4cc' },
      ...L.objects.map(o => ({ ...o })),
    ],
    npcs: [{ id, x: 5, y: 0 }],
    walkers: L.walkers,
    shopType: type,
  };
  const c = L.clerk;
  NPCS[id] = {
    name: c.name, role: 'Atendimento', look: c.look,
    scan: { text: 'Funcionário do turno da madrugada. Batimentos normais, olheiras de quem não dorme há dias.' },
    intro: c.intro, again: c.again,
    topics: [
      { id: id + '_conversa', label: 'Puxar conversa', repeat: true, lines: () => [pickOne(c.chat)] },
      { id: id + '_movimento', label: 'Movimento bom hoje?', repeat: true, lines: () => [pickOne([
        ['N', 'Com a tempestade, só aparece quem precisa muito. Ou quem não tem para onde ir.'],
        ['N', 'Mais do que deveria para uma madrugada de terça.'],
        ['N', 'A chuva espanta os clientes e traz os desesperados. Dá no mesmo.'],
        ['N', 'Tem a polícia aqui, então já melhorou. Ou piorou. Ainda não sei.'],
      ])] },
    ],
    present: {},
    presentDefault: ['Não reconheço isso, detetive.', 'Isso não está no nosso catálogo.', 'Hm. Não é da minha conta. Nem quero que seja.'],
  };
}
NPCS.atendente = NPCS.at_lanchonete;   // saves antigos


// ---------- entrar e sair ----------
function enterShop(o) {
  const s = shopOf(o), room = ROOMS['loja_' + s.type];
  const p = game.player;
  game.shopCtx = { sign: o.sign, name: o.name, col: o.col, back: [p.x, p.y] };
  applyShopCtx();
  enterRoom('loja_' + s.type, [1, 1]);
  if (!game.flags['loja_' + o.sign]) {
    game.flags['loja_' + o.sign] = true;
    toast(`<span class="k">🎒</span> ${T('Pegue o que quiser no balcão. Seus itens ficam na Mochila.')}`, 'ev');
  }
}
// aplica nome e cor da fachada ao interior (também ao carregar o save)
function applyShopCtx() {
  const c = game.shopCtx, s = c && SHOP_BY_SIGN[c.sign];
  if (!s) return false;
  const room = ROOMS['loja_' + s.type];
  room.name = c.name; room.neon = c.col || '#ff4fd8';
  return true;
}
function leaveShop() {
  const back = game.shopCtx ? game.shopCtx.back : CITY.map(15, 17);
  game.shopCtx = null;
  enterRoom('city', back);
}

// ---------- balcão ----------
function bagCount(id) { return game.bag[id] || 0; }
function openShop() {
  const s = game.shopCtx && SHOP_BY_SIGN[game.shopCtx.sign];
  if (!s) return;
  if (s.type === 'penhores') return openPawn();
  message(game.shopCtx.name, T('O que Vance vai levar?') + '\n\n' + bagSummary(),
    s.stock.map(id => ({ label: shopLabel(id), fn: () => takeItem(id) })).concat([{ label: 'Nada, obrigado', fn: closeModal }]));
}
function shopLabel(id) {
  const n = bagCount(id), info = itemInfo(id);
  if (GEAR[id]) return (n ? '✓ ' : '◆ ') + T(info.name);
  return `${T(info.name)}${n ? ` (${n})` : ''}`;
}
function takeItem(id) {
  const info = itemInfo(id);
  if (GEAR[id] && bagCount(id)) return message(info.name, T('Vance já tem um destes na mochila.'), [{ label: '← Voltar', fn: openShop }]);
  if (!GEAR[id] && bagCount(id) >= BAG_MAX) return message(info.name, T('A mochila não cabe mais deste item (máximo {0}).', BAG_MAX), [{ label: '← Voltar', fn: openShop }]);
  game.bag[id] = bagCount(id) + 1;
  Sound.play('evidence');
  updateHud(); saveGame();
  message(info.name, `${T(info.text)}\n\n${GEAR[id] ? '◆ ' + T(info.effect) : T('Guardado na mochila.')}`,
    [{ label: '← Pegar mais', fn: openShop }, { label: '▶ Continuar', fn: closeModal }]);
}

// ---------- penhores: troca ----------
function openPawn() {
  const s = SHOP_BY_SIGN[game.shopCtx.sign];
  const own = Object.keys(game.bag).filter(id => game.bag[id] > 0);
  if (!own.length) return message(game.shopCtx.name, 'O dono do penhores nem levanta os olhos: "Aqui é troca, não doação. Volta quando tiver alguma coisa na mochila."');
  message(game.shopCtx.name, T('"Aqui é troca. Você deixa uma coisa, leva outra." O que Vance oferece?'),
    own.map(id => ({ label: T(itemInfo(id).name), fn: () => pawnPick(id, s) })).concat([{ label: 'Nada', fn: closeModal }]));
}
function pawnPick(give, s) {
  const opts = s.stock.filter(id => id !== give && !(GEAR[id] && bagCount(id)));
  if (!opts.length) return message(game.shopCtx.name, 'Não há nada aqui que Vance ainda não tenha.');
  message(game.shopCtx.name, T('Em troca de "{0}", o que Vance leva?', T(itemInfo(give).name)),
    opts.map(id => ({ label: T(itemInfo(id).name), fn: () => {
      game.bag[give]--; if (!game.bag[give]) delete game.bag[give];
      game.bag[id] = bagCount(id) + 1;
      Sound.play('evidence'); updateHud(); saveGame();
      message(itemInfo(id).name, `${T(itemInfo(id).text)}${GEAR[id] ? '\n\n◆ ' + T(GEAR[id].effect) : ''}`);
    } })).concat([{ label: '← Voltar', fn: openPawn }]));
}

// ---------- mochila ----------
function bagSummary() {
  const ids = Object.keys(game.bag).filter(id => game.bag[id] > 0);
  if (!ids.length) return T('Mochila vazia.');
  return T('Na mochila: {0}', ids.map(id => (game.bag[id] > 1 ? game.bag[id] + '× ' : '') + T(itemInfo(id).name)).join(', '));
}
function openBag() {
  if (!game || (game.modal && game.modal !== 'msg') || game.combat) return;
  const ids = Object.keys(game.bag).filter(id => game.bag[id] > 0);
  const food = ids.filter(id => CONSUMABLES[id]), gear = ids.filter(id => GEAR[id]);
  const n = game.needs;
  let text = T('Fome {0}% · Sede {1}% · Cansaço {2}%', Math.round(n.fome), Math.round(n.sede), Math.round(n.cansaco));
  if (gear.length) text += '\n\n' + T('Equipamento:') + '\n' + gear.map(id => `◆ ${T(GEAR[id].name)}: ${T(GEAR[id].effect)}`).join('\n');
  if (!ids.length) text += '\n\n' + T('A mochila está vazia. Entre nas lojas da cidade para pegar comida, bebida, remédios, roupas e implantes.');
  else if (food.length) text += '\n\n' + T('Toque num item para usar:');
  message('🎒 Mochila', text, food.map(id => ({ label: `${T(CONSUMABLES[id].name)} ×${game.bag[id]}`, fn: () => useItem(id) }))
    .concat([{ label: '▶ Fechar', fn: closeModal }]));
}
function useItem(id) {
  if (!bagCount(id)) return;
  game.bag[id]--; if (!game.bag[id]) delete game.bag[id];
  const c = CONSUMABLES[id], fx = relieve(c, true);
  Sound.play('click'); updateHud(); saveGame();
  message(c.name, `${c.text}\n\n${fx}`, [{ label: '🎒 Mochila', fn: openBag }, { label: '▶ Continuar', fn: closeModal }]);
}

// ---------- efeitos do equipamento ----------
function hasGear(id) { return !!(game && game.bag && game.bag[id]); }
function gearSpeed() { return hasGear('tenis') && !game.driving ? 1.2 : 1; }
function gearNeed(k) {
  let m = 1;
  if (k === 'cansaco' && hasGear('jaqueta') && game.roomId === 'city') m *= 0.75;
  if (k === 'cansaco' && hasGear('chinelos')) m *= 0.9;
  if ((k === 'fome' || k === 'sede') && hasGear('metab')) m *= 0.8;
  return m;
}
function gearDark() { return (hasGear('visao') ? 0.45 : 1) * (hasGear('lanterna') ? 0.8 : 1); }
