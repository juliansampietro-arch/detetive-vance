// ============================================================
// NPCs da cidade (mesmo formato de dialogues.js)
// ============================================================

Object.assign(NPCS, {
  // ---------------- rua do hotel ----------------
  marta: {
    name: 'Marta Ferraz', role: 'Taxista aérea (parada)', look: 'marta',
    scan: { text: 'Implante de navegação de taxista, licença ativa. Batimentos acelerados: muito café e pouca paciência.' },
    intro: 'Detetive? Graças a Deus, alguém com cara de quem resolve coisa. Tô parada aqui há seis horas. Meu táxi não sobe com essa tempestade.',
    again: ['E aí, detetive. Ainda chovendo ácido, né?', 'Fala, chefe.', 'Se precisar de carona quando liberarem o céu, é comigo.'],
    topics: [
      { id: 'ma_tempestade', label: 'Como está a cidade com a tempestade?', lines: [
        ['N', 'Céu fechado. Tráfego aéreo zerado. Só os flutuantes de rua, como o seu, ainda rodam. Baixinho, colado no asfalto.'],
        ['N', 'Pra mim é prejuízo. Pro senhor, é a cidade inteira parada esperando ser investigada.'],
      ] },
      { id: 'ma_hotel', label: 'Viu algo estranho no hotel esta noite?', lines: [
        ['N', 'Estranho é o gerente. O tal Rossi saiu pelos fundos umas três vezes desde que cheguei. Sempre olhando pros lados.'],
        ['N', 'Da última vez voltou com a calça molhada até o joelho. E aquela luva preta no braço esquerdo, sempre.'],
        ['I', 'Molhado até o joelho. Os túneis de manutenção alagam com a chuva ácida.'],
      ] },
      { id: 'ma_carro', label: 'Alguma dica pra dirigir hoje?', lines: [
        ['N', 'Usa o GPS, detetive. Com essa chuva não dá pra ver placa de rua.'],
        ['N', 'E cuidado com os cruzamentos da Av. Lótus. Os drones de entrega ficam doidos com a interferência.'],
      ] },
    ],
    present: {
      e_luva: [['N', 'Essa luva aí! É do gerente. Ele nunca tira, nem pra fumar.']],
      e_tiroteio: [['N', 'Tiros?! Eu ouvi uns estalos lá embaixo, pensei que era transformador queimando.']],
    },
    presentDefault: ['Isso aí é coisa de polícia, não de taxista.', 'Não faço ideia, chefe.', 'Bonito. Mas não paga a minha corrida.'],
  },

  // ---------------- casa ----------------
  byte: {
    name: 'Byte', role: 'Gato-robô de Vance', look: 'byte',
    scan: { text: 'Unidade felina doméstica modelo K-9 Lite. Bateria em 62%. Nível de carência: alto.' },
    intro: '*Byte pisca os olhos de LED e solta um miado sintetizado que já foi atualizado três vezes.*',
    again: ['*Mrrrp.*', '*Byte se esfrega na sua perna, zumbindo.*', '*Byte encara você como quem cobra o jantar.*'],
    topics: [
      { id: 'by_carinho', label: 'Fazer carinho', repeat: true, lines: [
        ['N', '*O ronronar mecânico de Byte enche o apartamento. Por um minuto, o caso pode esperar.*'],
        ['I', 'Ele é o único que me espera em casa. Mesmo que seja por programação.'],
        { relax: 6 },
      ] },
      { id: 'by_conversa', label: '"Dia difícil, Byte."', lines: [
        ['V', 'Dia difícil, Byte. Um magnata morto, quatro suspeitos e uma chuva que derrete tinta.'],
        ['N', '*Byte inclina a cabeça. Um LED amarelo pisca: "processando empatia".*'],
        ['V', 'É. Eu também não entendo as pessoas.'],
      ] },
    ],
    present: {},
    presentDefault: ['*Byte cheira a evidência e espirra uma faísca.*', '*Byte tenta morder a evidência.*', '*Byte não está interessado. Byte quer ração.*'],
  },

  // ---------------- delegacia ----------------
  unidade7: {
    name: 'Unidade 7', role: 'Recepção androide', look: 'unidade7',
    scan: { text: 'Androide de recepção policial, firmware 9.4. Acesso a mapas, ocorrências e escalas.' },
    intro: 'Bem-vindo de volta, Detetive Vance. Você tem 14 mensagens não lidas e 1 caso ativo de prioridade máxima.',
    again: ['Em que posso ajudar, detetive?', 'Unidade 7 à disposição.', 'Lembre-se de registrar suas horas extras, detetive. Ninguém registra.'],
    topics: [
      { id: 'u7_mapa', label: 'Quais lugares estão acessíveis com a tempestade?', lines: [
        ['N', 'Com o tráfego aéreo suspenso, só as vias de solo funcionam. Locais registrados no seu GPS:'],
        ['N', 'Hotel Grand Alvorada, Delegacia do Distrito 4, Café Neon, Chinatown — Rua Lótus, a Casa de Banho Lótus e o seu apartamento.'],
        ['N', 'Dica: abra o GPS, a pé ou de carro, e escolha o destino. A rota acende no chão. O carro pode ser estacionado em qualquer lugar.'],
      ] },
      { id: 'u7_mensagens', label: 'Ler as mensagens', lines: [
        ['N', 'Mensagem 1: "Sua lavanderia está pronta." Mensagem 2: "Sua lavanderia ainda está pronta."'],
        ['N', 'Mensagem 3, da Capitã Okafor: "Vance. Na minha sala. Agora." Enviada há 40 minutos.'],
        ['N', 'As outras 11 são da corporação Pendelton exigindo atualizações do caso.'],
      ] },
      { id: 'u7_saude', label: 'Como estou, segundo os sensores?', repeat: true, lines: () => [['N', healthReport()]] },
    ],
    present: {},
    presentDefault: ['Evidência registrada no sistema, detetive.', 'Arquivo anexado ao caso Pendelton.', 'Não encontro correspondência no banco de dados.'],
  },
  okafor: {
    name: 'Capitã Rhea Okafor', role: 'Chefe da Delegacia', look: 'okafor',
    scan: { text: 'Implante tático de comando. Níveis de cortisol altíssimos. A corporação está pressionando.' },
    intro: 'Vance. Finalmente. A Pendelton BioCyber ligou para mim seis vezes. O prefeito, duas. Me diga que você tem alguma coisa.',
    again: ['Fale rápido, Vance.', 'Novidades?', 'Estou ouvindo. E a corporação também, infelizmente.'],
    topics: [
      { id: 'ok_pressao', label: 'Quanta pressão estamos sofrendo?', lines: [
        ['N', 'Toda. A corporação quer um culpado antes do amanhecer. Qualquer culpado, Vance. Entende o que eu estou dizendo?'],
        ['N', 'E eu estou dizendo que quero o culpado certo. Não me faça me arrepender de ter te readmitido.'],
      ] },
      { id: 'ok_evelyn', label: 'E se a culpada for a viúva?', lines: [
        ['N', 'Evelyn Pendelton tem os melhores advogados do Sector 4. Acuse-a sem provas e você perde o distintivo antes do café.'],
        ['N', 'Se for ela, traga algo que nem os advogados dela consigam apagar.'],
      ] },
      { id: 'ok_conselho', label: 'Algum conselho, capitã?', lines: [
        ['N', 'O de sempre: siga o tempo. Quem estava onde, quando. Relógios mentem, Vance. Sistemas de rede raramente.'],
        ['N', 'E coma alguma coisa. Você está com cara de quem não dorme há dois dias.'],
      ] },
      { id: 'ok_tiro', label: 'Fui atacado nos túneis do hotel.', requiresFlag: 'tiroteio', lines: [
        ['N', 'Atacado? Por que eu estou sabendo disso por você e não por um relatório?'],
        ['V', 'Encapuzado. Mancava. Fugiu pela escada de manutenção.'],
        ['N', 'Então alguém lá dentro está desesperado. Gente desesperada comete erros. Ache o erro.'],
      ] },
    ],
    present: {
      e_corpo: [['N', 'Fratura no crânio... isso não foi acidente de implante. A corporação vai odiar essa palavra: homicídio.']],
      e_trava: [['N', 'Credencial administrativa. Ou seja, alguém da casa. Sempre é alguém da casa.']],
      e_tiroteio: [['N', 'Se ele atirou em um detetive, ele já perdeu. Só ainda não sabe.']],
    },
    presentDefault: ['Interessante. Coloque no relatório.', 'Isso não me ajuda a responder a corporação, Vance.', 'Continue cavando.'],
  },
  kenji: {
    name: 'Kenji Mori', role: 'Perito forense', look: 'kenji',
    scan: { text: 'Óculos de análise espectral de última geração. Ele não dorme há 30 horas e parece feliz com isso.' },
    intro: 'Vance! Meu detetive favorito, e o único que me traz coisas interessantes. Tem evidência pra mim? Me mostra, me mostra.',
    again: ['Mais evidências? Por favor diga que sim.', 'Fala, Vance.', 'Meu espectrômetro está entediado.'],
    topics: [
      { id: 'kj_ajuda', label: 'Como você pode me ajudar?', lines: [
        ['N', 'Me mostre qualquer evidência que você coletou. Eu faço a análise forense na hora, sem papelada.'],
        ['N', 'Use a opção "Apresentar evidência". Eu sou bom nisso. Modéstia à parte. Muito à parte.'],
      ] },
      { id: 'kj_nx7', label: 'O que você sabe sobre NX-7?', lines: [
        ['N', 'Paralisante de laboratório. Três laboratórios no Sector 4 têm licença: BioCyber, Halcyon e... o laboratório pessoal da Dra. Helena Souza.'],
        ['I', 'Ele disse o nome dela sem eu perguntar.'],
      ] },
    ],
    present: {
      e_taca: [['N', 'Dose de NX-7 calculada para paralisar um homem de 80 kg por quatro horas. Precisa. Quem fez isso sabia exatamente o que fazia.'], ['N', 'Não é dose de matar. É dose de imobilizar.']],
      e_corpo: [['N', 'A fratura tem padrão de impacto único, com força de mais de uma tonelada. Nenhum humano bate assim.'], ['N', 'A não ser que tenha uma prótese industrial.']],
      e_ferramenta: [['N', 'Material biológico compatível com a vítima, e fibras de polímero preto tipo luva de prótese. Bate com a fratura.'], ['N', 'Parabéns, Vance. Você achou a arma do crime.']],
      e_cronometro: [['N', 'Reescrita manual do firmware. O carimbo interno da alteração diz 23:02. Quem mexeu tinha o cronômetro na mão.']],
      e_nanobots: [['N', 'Biomonitores classe médica. Margem de erro: dois segundos. Se eles dizem 22:57, foi às 22:57.']],
      e_pegadas: [['N', 'Distribuição de peso assimétrica: uns 40 kg a mais do lado esquerdo. Isso é uma prótese de estivador ou um homem carregando um cofre.']],
      e_polvora: [['N', 'Nitratos frescos, menos de uma hora. Essa luva disparou uma arma. Ponto final.']],
      e_oculos: [['N', 'Log de conexão autêntico, sem adulteração. Os óculos da doutora estavam conectados ao drive da suíte das 22:50 às 22:52.']],
      e_luva: [['N', 'Fibras pretas faltando no rasgo. Se você achar essas fibras em algum lugar, eu consigo provar que são da mesma luva.']],
    },
    presentDefault: ['Hmm. Nada de forense aqui, Vance. É só... uma coisa.', 'Não tenho o que analisar nisso.', 'Isso é mais pra um psicólogo do que pra um perito.'],
  },

  // ---------------- café ----------------
  lumi: {
    name: 'Lumi', role: 'Barista androide', look: 'lumi',
    scan: { text: 'Androide de serviço com módulo de paladar experimental. Ela realmente sente o gosto do café.' },
    intro: 'Detetive Vance! O de sempre? Espresso duplo, sem açúcar, com uma pitada de desilusão?',
    again: ['Mais um café, detetive?', 'O balcão é todo seu.', 'Você parece cansado. Mais cansado.'],
    topics: [
      { id: 'lu_menu', label: 'O que tem de bom hoje?', lines: [
        ['N', 'Espresso duplo, sanduíche de cogumelo defumado e bolo de laranja-sangue. Pode pedir no balcão.'],
        ['N', 'O café é de verdade. Importado de uma estufa em Lunar 2. Não pergunte o preço.'],
      ] },
      { id: 'lu_paladar', label: 'Você sente mesmo o gosto do café?', lines: [
        ['N', 'Sinto. Meu fabricante desligou o módulo em todas as outras unidades. Disse que era "ineficiente".'],
        ['N', 'Eu acho que é a única coisa eficiente em mim. Saber o que é bom.'],
      ] },
      { id: 'lu_fofoca', label: 'Ouviu algo sobre o caso Pendelton?', lines: [
        ['N', 'A Sra. Ilsa, naquela mesa, conhecia os Pendelton há trinta anos. Ela fala bastante. Muito, na verdade.'],
        ['N', 'E o Jax, o entregador, vive em Chinatown. Ele sabe de coisas que não deveria.'],
      ] },
    ],
    present: {},
    presentDefault: ['Isso não combina com café, detetive.', 'Guardo segredos, mas não evidências.', 'Uma xícara resolveria melhor esse mistério?'],
  },
  ilsa: {
    name: 'Sra. Ilsa Varga', role: 'Aposentada fofoqueira', look: 'ilsa', seated: true,
    scan: { text: 'Implantes auditivos de alta sensibilidade. Ela escuta tudo. Literalmente tudo.' },
    intro: 'Ah, um detetive! Sente-se, sente-se. Eu conheço todo mundo nesta cidade, querido. Todo mundo.',
    again: ['Mais fofoca, querido?', 'Senta aqui, senta.', 'Onde eu parei? Ah, sim, em tudo.'],
    topics: [
      { id: 'il_pendelton', label: 'Conhecia os Pendelton?', lines: [
        ['N', 'Fui vizinha deles por trinta anos! Arthur era um menino ambicioso. Virou um homem ambicioso. Depois só ambição, sem homem.'],
        ['N', 'E a Evelyn... coitada. Casou com um império e acordou com um contrato.'],
      ] },
      { id: 'il_helena', label: 'E a Dra. Souza?', lines: [
        ['N', 'A cientista? Vinha aqui chorando no ano passado. Dizia que tinham roubado a "Aurora" dela. Achei que era uma filha!'],
        ['N', 'Depois entendi que era um programa. Gente estranha, cientista.'],
      ] },
      { id: 'il_rossi', label: 'Sabe algo sobre Victor Rossi?', lines: [
        ['N', 'O gerente? Joga, querido. Joga muito. Em Chinatown, nas mesas do Sindicato Lótus.'],
        ['N', 'Dizem que deve a alma e mais um pouco. Pergunte na casa de banho. Os velhos do Sindicato tomam banho lá todas as noites.'],
      ] },
    ],
    present: {
      e_testamento: [['N', 'Ele tirou a Evelyn do testamento? Que homem horrível. Que fofoca maravilhosa.']],
      e_arquivo: [['N', 'A Aurora! Viu? Eu disse que era coisa da cientista.']],
    },
    presentDefault: ['Não sei o que é isso, mas conte mais!', 'Ui, que mistério.', 'Querido, eu entendo de gente, não de bugigangas.'],
  },
  jax: {
    name: 'Jax', role: 'Entregador de drones', look: 'jax',
    scan: { text: 'Implantes de reflexo turbinados e um controlador de drones ilegal na nuca.' },
    intro: 'Opa, polícia. Relaxa, tô de folga. Os drones não voam com essa tempestade, então eu tomo café.',
    again: ['Fala, detetive.', 'Ainda de folga.', 'Precisa de alguma coisa entregue? Ah é, não dá.'],
    topics: [
      { id: 'jx_chinatown', label: 'Você conhece Chinatown?', lines: [
        ['N', 'Moro lá. A barraca do Sr. Wen faz o melhor lámen do Sector 4. E a casa de banho Lótus... bom, é onde o Sindicato faz negócios.'],
      ] },
      { id: 'jx_sindicato', label: 'O que é o Sindicato Lótus?', requiresSeen: ['jx_chinatown'], lines: [
        ['N', 'Agiotas das antigas. Emprestam pra quem banco nenhum empresta. E cobram de um jeito que banco nenhum cobra.'],
        ['N', 'O velho Goro fica na casa de banho todas as noites. Se alguém deve, ele sabe.'],
      ] },
      { id: 'jx_braco', label: 'Viu alguém com braço mecânico por lá?', requiresSeen: ['jx_sindicato'], lines: [
        ['N', 'Um cara de terno com uma luva preta num braço enorme? Vi semana passada saindo da casa de banho. Pálido feito papel.'],
      ] },
    ],
    present: {},
    presentDefault: ['Não é comigo, detetive.', 'Eu só entrego, não abro.', 'Parece caro. Vende?'],
  },

  // ---------------- Chinatown ----------------
  wen: {
    name: 'Sr. Wen', role: 'Mestre do lámen', look: 'wen',
    scan: { text: 'Mãos com 40 anos de calos de cozinha. Nenhum implante além de um marca-passo antigo.' },
    intro: 'Vance! Olha só quem lembrou do velho Wen. Senta, senta. O caldo está no ponto há dezoito horas.',
    again: ['Mais uma tigela, Vance?', 'Senta, menino.', 'Você está magro. Come.'],
    topics: [
      { id: 'we_comer', label: 'Pedir lámen (no balcão da barraca)', lines: [
        ['N', 'Fala com a barraca, menino, não comigo! Eu cozinho, a barraca serve. Pede lá.'],
      ] },
      { id: 'we_pai', label: 'Ainda lembra do meu pai?', lines: [
        ['N', 'Como esquecer? O sargento Vance sentava aí mesmo, onde você está. Pedia extra de ovo e nunca pagava a cebolinha.'],
        ['N', 'Ele dizia: "Wen, a verdade é igual caldo. Precisa de tempo, e quem tem pressa estraga."'],
        ['I', 'Dezoito horas. Ele nunca teve pressa. Nem quando morreu.'],
      ] },
      { id: 'we_bairro', label: 'Como anda o bairro?', lines: [
        ['N', 'Chove ácido, os neons queimam, o Sindicato cobra. Chinatown é Chinatown.'],
        ['N', 'Mas o lámen continua bom. Enquanto o lámen estiver bom, o bairro aguenta.'],
      ] },
    ],
    present: {},
    presentDefault: ['Não traz trabalho pra minha barraca, Vance.', 'Isso aí não vai no caldo.', 'Come primeiro, investiga depois.'],
  },
  lin: {
    name: 'Madame Lin', role: 'Cartomante', look: 'lin',
    scan: { text: 'Nenhum implante. Absolutamente nenhum. Os sensores se recusam a acreditar.' },
    intro: 'Eu esperava você, detetive. As cartas falaram de um homem que procura na chuva o que já está no próprio bolso.',
    again: ['As cartas ainda falam.', 'Sente-se diante do destino.', 'Hmm.'],
    topics: [
      { id: 'li_cartas', label: 'Leia as cartas para mim.', lines: [
        ['N', '*Ela vira três cartas: um cálice, uma torre, uma mão de ferro.*'],
        ['N', 'O cálice trouxe o sono. A torre guardava o segredo. Mas a mão de ferro trouxe a morte.'],
        ['N', 'Dois venenos, detetive. Uma só morte. Não confunda quem dormiu o homem com quem o calou.'],
      ] },
      { id: 'li_futuro', label: 'E o meu futuro?', lines: [
        ['N', '*Ela vira uma carta e sorri.* Uma tigela de lámen. Muito em breve.'],
        ['N', 'Nem tudo é mistério, detetive.'],
      ] },
    ],
    present: {
      e_taca: [['N', 'O cálice. Eu disse.']],
      e_ferramenta: [['N', 'A mão de ferro. As cartas não mentem, detetive.']],
    },
    presentDefault: ['As cartas não falam sobre isso.', 'Hmm. Nada.', 'O destino é silencioso sobre esse objeto.'],
  },
  bao: {
    name: 'Bao', role: 'Menino do bairro', look: 'bao',
    scan: { text: 'Criança, uns 10 anos. Um implante de jogo barato atrás da orelha. Muito, muito curioso.' },
    intro: 'Você é polícia de verdade? Tem arma? Já prendeu alguém? Posso ver o distintivo?',
    again: ['Oi, polícia!', 'Já pegou o bandido?', 'Me leva no carro flutuante?'],
    topics: [
      { id: 'ba_casa', label: 'Você não devia estar em casa?', lines: [
        ['N', 'Meus pais trabalham no turno da noite. Eu fico ajudando o Sr. Wen. Ele me paga em lámen.'],
      ] },
      { id: 'ba_viu', label: 'Viu alguma coisa estranha por aqui?', lines: [
        ['N', 'Vi o homem do braço de ferro! Ele foi na casa de banho falar com o velho Goro. Saiu chorando. Adulto chorando é estranho.'],
        ['I', 'Victor Rossi. Em Chinatown. Com o Sindicato.'],
      ] },
    ],
    present: {
      e_luva: [['N', 'É a luva do homem do braço de ferro! Eu vi!']],
    },
    presentDefault: ['Que legal! O que é?', 'Posso ficar com isso?', 'Isso é evidência? Uau.'],
  },
  hana: {
    name: 'Hana', role: 'Atendente da casa de banho', look: 'hana',
    scan: { text: 'Implante de controle térmico para suportar o vapor. Calma absoluta nos sinais vitais.' },
    intro: 'Bem-vindo à Casa de Banho Lótus, detetive. Tire os sapatos, deixe o mundo na porta. A água está a 42 graus.',
    again: ['A água está perfeita hoje.', 'Relaxe, detetive.', 'O vapor cura quase tudo.'],
    topics: [
      { id: 'ha_banho', label: 'Como funciona?', lines: [
        ['N', 'Lave-se, entre na água quente e não pense em nada por dez minutos. É a única regra.'],
        ['N', 'Use o banho quando quiser. Ele tira o cansaço do corpo. O da alma, só o tempo.'],
      ] },
      { id: 'ha_arthur', label: 'Arthur Pendelton vinha aqui?', lines: [
        ['N', 'Aqui? Não, detetive. O Sr. Pendelton não gostava de água quente.'],
        ['N', 'Ele preferia a Casa de Chá Matsurika, a "Flor de Jasmim", do outro lado da travessa, ao lado do salão de mahjong. Toda quinta, sempre a mesma sala privativa. Todo mundo em Chinatown sabe. Ninguém fala.'],
        ['I', 'Uma sala privativa toda quinta. Arthur tinha mais segredos do que patentes.'],
        { unlock: 'bordel' },
      ] },
      { id: 'ha_goro', label: 'Quem é o senhor no canto?', lines: [
        ['N', 'O senhor Goro. Vem todas as noites há vinte anos. Ninguém senta perto dele sem ser convidado.'],
        ['N', 'Se quiser falar com ele, seja educado. Muito educado.'],
      ] },
    ],
    present: {},
    presentDefault: ['Aqui dentro não se fala de trabalho, detetive.', 'Deixe isso na porta.', 'O vapor não resolve isso.'],
  },
  goro: {
    name: 'Goro Takeda', role: 'Velho do Sindicato Lótus', look: 'goro',
    scan: { text: 'Tatuagens dinâmicas sob a pele, em movimento lento. Um implante cardíaco militar. Este homem já foi muito perigoso.' },
    intro: 'Um policial na minha água. Que tempos. Sente-se, detetive, antes que eu mude de ideia.',
    again: ['Ainda aqui, detetive?', 'Fale baixo. O vapor ouve.', 'Hmm.'],
    topics: [
      { id: 'go_quem', label: 'Quem é o senhor?', lines: [
        ['N', 'Um velho que gosta de água quente. E que empresta dinheiro a quem os bancos esqueceram.'],
        ['N', 'Juros justos. Cobrança justa. Na maioria das vezes.'],
      ] },
      { id: 'go_rossi', label: 'Victor Rossi deve dinheiro ao senhor?', requiresSeen: ['go_quem'], lines: [
        { choice: [
          { label: 'Educado: "Seria uma honra se pudesse me ajudar."', lines: [
            ['V', 'Senhor Takeda, seria uma honra se pudesse me ajudar com uma informação.'],
            ['N', '...Você tem modos. Raro na sua profissão.'],
            ['N', 'Rossi deve dois milhões ao Sindicato. O prazo vence esta semana. Ele jurou que teria o dinheiro: "o investidor vai assinar".'],
            ['N', 'Se o investidor morreu... bom. Diga a Rossi que o Sindicato manda lembranças.'],
            { give: 'e_dividas' },
          ] },
          { label: 'Duro: "Responda, ou fecho este lugar."', lines: [
            ['V', 'Responda, ou eu fecho este lugar por violação sanitária ainda hoje.'],
            ['N', '*Goro ri baixo, sem mover um músculo.* Já tentaram coisa pior, detetive. Volte quando aprender a falar.'],
          ] },
        ] },
      ] },
    ],
    present: {
      e_falencia: [['N', 'Falido, é? Ele me disse que o hotel valia ouro. Mentiroso dos bons.']],
      e_papeis: [['N', 'O "resgate". Era assim que ele chamava a minha conta.']],
    },
    presentDefault: ['Não tenho interesse nisso.', 'Guarde isso. A água não gosta de papel.', 'Hmm.'],
  },
});


// ============================================================
// Polícia no hotel, perícia na suíte e comerciantes de Chinatown
// ============================================================
Object.assign(NPCS, {
  cruz: {
    name: 'Policial Cruz', role: 'Guarda na porta do hotel', look: 'cruz',
    scan: { text: 'Implante tático padrão do Distrito 4. Turno de 14 horas. Glicose baixa.' },
    intro: 'Detetive Vance. A capitã mandou isolar o hotel. Ninguém entra, ninguém sai, a não ser o senhor.',
    again: ['Tudo sob controle aqui fora, detetive.', 'Ninguém passou por mim.', 'Essa chuva vai derreter meu quepe.'],
    topics: [
      { id: 'cz_movimento', label: 'Alguém saiu do hotel esta noite?', lines: [
        ['N', 'Desde que cheguei, às 23:50, ninguém. Mas o porteiro disse que o gerente saiu pela lateral duas vezes antes disso.'],
        ['N', 'Voltou molhado. Disse que foi ver um vazamento.'],
        ['I', 'Um vazamento. Nos túneis, talvez.'],
      ] },
      { id: 'cz_viaturas', label: 'Quantas viaturas vieram?', lines: [
        ['N', 'Duas aqui na frente e a perícia lá em cima. A Ana Duarte e o Rui Sato estão no quarto desde a meia-noite.'],
        ['N', 'Se precisar de mais gente, é só falar com a Unidade 7 na delegacia.'],
      ] },
    ],
    present: { e_luva: [['N', 'O gerente usa essa luva, sim. Cumprimentou todo mundo com a outra mão.']] },
    presentDefault: ['Isso é com a perícia, detetive.', 'Não sei nada disso.', 'Vou anotar no relatório.'],
  },
  ana: {
    name: 'Perita Ana Duarte', role: 'Perícia criminal', look: 'ana',
    scan: { text: 'Óculos forenses com espectrometria. Luvas nitrílicas. Concentração total.' },
    intro: 'Vance. Não pise nos marcadores amarelos, por favor. Já catalogamos quatro pontos de interesse.',
    again: ['Cuidado onde pisa.', 'Ainda estamos catalogando.', 'Fale baixo, estou medindo partículas.'],
    topics: [
      { id: 'an_marcadores', label: 'O que os marcadores indicam?', lines: [
        ['N', 'O 1 é a posição da cabeça. O 2, uma gota de sangue fora do padrão. O 3 marca a taça. O 4, arranhões perto da grade de ventilação.'],
        ['N', 'Arranhões frescos, de metal contra metal. Alguém mexeu nessa grade hoje.'],
      ] },
      { id: 'an_morte', label: 'Já dá para estimar a hora da morte?', lines: [
        ['N', 'Pela temperatura corporal, entre 22:45 e 23:15. Os nanorrobôs dele devem ter algo mais preciso.'],
        ['N', 'Use o seu scanner perto do corpo. Eles ainda transmitem.'],
      ] },
    ],
    present: {
      e_corpo: [['N', 'A fratura é recente e o golpe veio de cima, de alguém bem mais alto, ou muito mais forte.']],
      e_ferramenta: [['N', 'O formato dessa chave bate com a fratura. Vou mandar para o Kenji confirmar.']],
    },
    presentDefault: ['Vou catalogar, mas não é do meu setor.', 'Não tenho como analisar isso aqui.', 'Leve isso para o Kenji, na delegacia.'],
  },
  rui: {
    name: 'Agente Rui Sato', role: 'Fotógrafo da perícia', look: 'rui',
    scan: { text: 'Câmera volumétrica acoplada ao implante ocular. 2.348 fotos tiradas esta noite.' },
    intro: 'Opa, detetive. Sorria. Brincadeira. Não fotografo vivos em cena de crime.',
    again: ['*Flash.*', 'Mais um ângulo.', 'Essa luz está horrível.'],
    topics: [
      { id: 'ru_fotos', label: 'Alguma foto chamou atenção?', lines: [
        ['N', 'A porta. A trava quântica marca "trancada por dentro", mas não há nenhuma digital no painel. Nenhuma. Nem do morto.'],
        ['N', 'Quem trancou não encostou aqui.'],
      ] },
      { id: 'ru_hotel', label: 'O que acha deste hotel?', lines: [
        ['N', 'Lindo por fora, podre por dentro. Os dutos de ventilação são da era analógica. Dá para andar dentro deles, se for corajoso.'],
      ] },
    ],
    present: { e_trava: [['N', 'Remota. Por isso não tem digital. Faz sentido.']] },
    presentDefault: ['Vou fotografar, por via das dúvidas.', '*Flash.* Registrado.', 'Isso não estava no quarto.'],
  },
  mei: {
    name: 'Sra. Mei', role: 'Dona da Casa de Chá Jade', look: 'mei',
    scan: { text: 'Implante auditivo antigo. Mãos firmes. Ela serve chá há cinquenta anos.' },
    intro: 'Detetive, entre, entre. Chá resolve metade dos problemas. A outra metade, o tempo.',
    again: ['Mais um chá?', 'O bule está quente.', 'Sente-se um pouco.'],
    topics: [
      { id: 'me_bairro', label: 'Há quanto tempo a senhora está aqui?', lines: [
        ['N', 'Desde antes dos portais serem restaurados. Vi três corporações passarem por esta rua. Todas foram embora. O chá ficou.'],
      ] },
      { id: 'me_rossi', label: 'Conhece Victor Rossi?', lines: [
        ['N', 'O homem do braço de ferro? Toma chá aqui antes de ir à casa de banho. Sempre pede o mais forte.'],
        ['N', 'Semana passada, quebrou uma xícara sem querer. Aquela mão não sabe a própria força.'],
      ] },
    ],
    present: { e_luva: [['N', 'A luva dele. Rasgou quando quebrou a xícara? Não... estava inteira naquele dia.']] },
    presentDefault: ['Isso não combina com chá.', 'Os jovens trazem cada coisa...', 'Guarde isso e beba seu chá.'],
  },
  huang: {
    name: 'Dr. Huang', role: 'Ervanário', look: 'huang',
    scan: { text: 'Nenhum implante. Um scanner de DNA de última geração escondido sob o balcão.' },
    intro: 'Ah, a polícia. Diga, detetive: insônia, dor nas costas ou excesso de café? Tenho raiz para tudo.',
    again: ['Mais ginseng?', 'Sua aura está cinza, detetive.', 'Beba água. Muita água.'],
    topics: [
      { id: 'hu_nx7', label: 'Conhece um paralisante chamado NX-7?', lines: [
        ['N', 'NX-7... versão de laboratório da toxina do baiacu, estabilizada. Uma gota e o corpo para, mas a mente segue acordada.'],
        ['N', 'Ninguém em Chinatown vende isso. Precisa de laboratório licenciado. Procure entre os cientistas, não entre os ervanários.'],
      ] },
      { id: 'hu_conselho', label: 'Algum remédio para o cansaço?', lines: [
        ['N', 'Ginseng, para hoje. Para amanhã, dormir. Os dois juntos, para a vida.'],
      ] },
    ],
    present: { e_taca: [['N', 'O cheiro... amêndoa e metal. NX-7, com certeza. Isso não saiu de uma ervanaria.']] },
    presentDefault: ['Isso não é planta, detetive.', 'Não tenho erva para isso.', 'Hmm. Não.'],
  },
  lan: {
    name: 'Tia Lan', role: 'Cozinheira de dim sum', look: 'lan',
    scan: { text: 'Queimaduras antigas de vapor nas mãos. Um implante de tradução que ela desligou de propósito.' },
    intro: 'Polícia! Tá com fome? Tá com cara de fome. Senta, que eu trago um cestinho.',
    again: ['Mais um bao?', 'Come, menino!', 'Tá magro demais.'],
    topics: [
      { id: 'la_fofoca', label: 'O que se fala no bairro?', lines: [
        ['N', 'Que o Sindicato está cobrando todo mundo esta semana. Até o Fong teve que pagar.'],
        ['N', 'E que um figurão de hotel deve uma fortuna. Mas quem não deve, né?'],
      ] },
      { id: 'la_receita', label: 'Qual o segredo do seu dim sum?', lines: [
        ['N', 'Doze pregas no har gow. Nem onze, nem treze. Doze.'],
        ['N', 'E nunca, nunca use camarão de tanque barato. Só o de tanque caro.'],
      ] },
    ],
    present: {},
    presentDefault: ['Isso não se come, né?', 'Leva isso daqui da minha cozinha!', 'Hmm, não conheço.'],
  },
});

// ============================================================
// Casa de Chá Matsurika (茉莉花): Nozomi (anfitriã), Kyomi (salão) e Sue (sala 3).
// Lá dentro ninguém sabe que Vance é policial: ele entra como cliente.
// ============================================================
Object.assign(NPCS, {
  nozomi: {
    name: 'Nozomi', role: 'Anfitriã da Casa de Chá Matsurika', look: 'nozomi',
    scan: { text: 'Implante de reconhecimento facial ligado a um banco de dados particular. Ela nunca esquece um cliente.' },
    intro: '*Ela se curva.* Bem-vindo à Matsurika, a "Flor de Jasmim". Tire os sapatos, por favor. Aqui o chá é servido com discrição, e a discrição vem incluída no preço.',
    again: ['Já escolheu, senhor?', 'As salas privativas não ficam livres por muito tempo.', 'Um chá enquanto pensa?'],
    topics: [
      { id: 'no_casa', label: 'Que lugar é este?', lines: [
        ['N', 'Uma casa de chá tradicional. Salas privativas, cerimônia completa e memórias curtas.'],
        ['N', 'Homens importantes vêm aqui fechar negócios que não podem ser vistos. Nós servimos o chá e esquecemos os rostos.'],
      ] },
      { id: 'no_cliente', label: 'Quero uma sala privativa para a cerimônia do chá.', lines: [
        ['V', '*Vance esconde o distintivo no bolso de dentro.* Uma sala privativa. Com a melhor mestra da casa.'],
        ['N', 'Um homem de bom gosto. Hoje a Sue conduz a cerimônia na sala 3, no fim do corredor.'],
        ['N', 'Duzentos créditos, pagos lá dentro. E nada de gravações, senhor.'],
        ['I', 'Ninguém aqui pode saber que sou da polícia. Para essa gente, distintivo é sinônimo de boca fechada.'],
        { flag: 'itoko_cliente' },
      ] },
    ],
    present: {},
    presentDefault: ['Isso não é assunto da recepção, senhor.', 'Guarde isso. Aqui se bebe chá.', 'Não reconheço.'],
  },
  su: {
    name: 'Sue', role: 'Mestra de chá da Matsurika', look: 'su',
    scan: { text: 'Batimentos acelerados, pupilas dilatadas: medo. Um implante de memória de luxo, criptografado, e um alarme de pânico escondido no bracelete.' },
    intro: 'A Nozomi disse que um cliente novo pediu a cerimônia. *Ela fecha o shoji da sala 3, ajoelha-se diante da chaleira de ferro e começa a bater o matcha.* Sente-se, por favor. Você tem cara de quem veio conversar.',
    again: ['Ainda aqui?', 'O chá está esfriando.', 'Fale baixo. As paredes de papel escutam.'],
    topics: [
      { id: 'su_quem', label: 'Quem é você?', lines: [
        ['N', 'Sue. Não é o nome verdadeiro, mas é o que vale aqui dentro.'],
        ['N', 'Vim do interior há três anos, com uma dívida de implante. A casa pagou e me ensinou a cerimônia. Desde então eu sirvo aqui.'],
      ] },
      { id: 'su_arthur', label: 'Arthur Pendelton vinha aqui?', lines: [
        ['N', '*Ela para o batedor de bambu no meio do movimento.* Toda quinta. Reservava esta sala com o nome "Sr. Aurora". Achava graça nisso.'],
        ['N', 'Passava horas falando. Do império, das patentes, de como ninguém o amava de verdade. Eu... acabei gostando dele. E ele de mim.'],
        ['I', 'Aurora. O mesmo nome do programa que ele roubou da Dra. Souza. E um caso escondido, longe dos olhos de Evelyn.'],
      ] },
      { id: 'su_rossi', label: 'Alguém mais perguntou sobre ele?', requiresSeen: ['su_arthur'], lines: [
        { choice: [
          { label: 'Gentil: "Você não está encrencada. Eu só quero a verdade."', lines: [
            ['V', 'Você não está encrencada, Sue. Eu só quero saber quem fez mal ao Arthur.'],
            ['N', '...Há dois meses veio um homem de terno. Braço enorme, luva preta. Pagou cinco mil créditos para saber quais clientes ricos tinham segredos.'],
            ['N', 'Eu precisava do dinheiro. Contei do Sr. Aurora. De nós dois. Depois vi o homem na rua, fotografando a gente na saída.'],
            ['N', 'Semana passada o Arthur chegou furioso. Disse que o gerente do hotel queria arrancar uma assinatura dele com aquelas fotos. Disse que ia acabar com ele.'],
            ['N', '*Ela tira um cartão de dados do bracelete.* O homem me deu uma cópia, para eu ficar quieta. Eu guardei. Leva com você. Eu não quero morrer.'],
            { give: 'e_bordel' }, { give: 'e_fotos' },
          ] },
          { label: 'Firme: "Eu sei que você vendeu o segredo dele."', lines: [
            ['V', 'Eu sei que você vendeu o segredo do Arthur, Sue. Fala, antes que quem comprou volte atrás de você.'],
            ['N', '*Ela engole em seco.* Tá bom, tá bom. Um homem de luva preta pagou para saber os segredos dos clientes. Eu contei do Arthur. É só isso que eu sei.'],
            ['I', 'Ela está escondendo alguma coisa. Com medo, ninguém conta tudo.'],
            { give: 'e_bordel' },
          ] },
        ] },
      ] },
    ],
    present: {
      e_luva: [['N', '*Ela empalidece.* É ele. O homem da luva. Foi ele que pagou.']],
      e_fotos: [['N', 'Não deixe ninguém saber que fui eu que te dei isso. Por favor.']],
    },
    presentDefault: ['Não sei o que é isso.', 'Você veio aqui para me mostrar coisas?', 'Isso não tem nada a ver comigo.'],
  },
  jade: {
    name: 'Kyomi', role: 'Atendente da Matsurika', look: 'jade',
    scan: { text: 'Um implante barato de tradução e unhas de cromo. Ela observa cada cliente como quem calcula a conta.' },
    intro: 'Cliente novo? Sente-se, eu trago o chá. Ternos amassados assim costumam pedir a sala privativa.',
    again: ['De novo, senhor?', 'Fale baixo. A Nozomi escuta tudo.', 'Ainda pensando no velho rico?'],
    topics: [
      { id: 'jd_quem', label: 'Quem é você?', lines: [
        ['N', 'Kyomi. Sirvo o chá aqui no salão.'],
        ['N', 'E faço companhia a quem espera uma sala privativa. Você parece desse tipo.'],
      ] },
      { id: 'jd_arthur', label: 'Arthur Pendelton vinha aqui?', lines: [
        ['N', 'O velho do sobretudo caro? Toda quinta. Mas ele só queria a Sue e a sala 3. Nunca olhou para mais ninguém.'],
        ['N', 'Quer falar com ela? Peça uma sala para a Nozomi, na recepção.'],
      ] },
    ],
    present: { e_luva: [['N', '*Ela desvia o olhar.* Já vi essa luva por aqui. Pergunte para a Sue, não para mim.']] },
    presentDefault: ['Não sei o que é isso.', 'Não me mostre essas coisas, senhor.', 'Isso não tem nada a ver comigo.'],
  },
});

// pistas que levam à casa de chá e ao confronto com Victor
NPCS.bao.topics.push({ id: 'ba_lanternas', label: 'O Sr. Pendelton vinha a Chinatown?', lines: [
  ['N', 'O velho rico do sobretudo caro? Vinha toda quinta! Ia na casa de chá Matsurika, ali do lado do salão de mahjong.'],
  ['N', 'Minha mãe diz que lá é lugar de gente rica com segredo. Nem de polícia, acho.'],
] });
NPCS.victor.topics.push({ id: 'vi_fotos', label: '⚠ Confrontar: as fotos da Matsurika', requires: ['e_fotos'], lines: [
  ['V', 'Holofotos do Arthur saindo de uma casa de chá em Chinatown, de mãos dadas com uma mestra de chá. E uma mensagem assinada "V.". Você o chantageava, Rossi.'],
  ['N', 'Eu... qualquer um pode ter tirado essas fotos! "V." pode ser qualquer pessoa!'],
  ['N', '*O suor escorre pela têmpora. Ele esconde a mão da luva atrás das costas.*'],
  ['I', 'Ele não negou a chantagem. Só a autoria.'],
] });
NPCS.kenji.present.e_fotos = [['N', 'Metadados das holofotos: câmera de implante ocular industrial, modelo de estivador. O mesmo pacote que vem com próteses de braço pesado.'], ['N', 'Coincidência demais para um homem só, Vance.']];
NPCS.okafor.present.e_fotos = [['N', 'Chantagem contra Pendelton. Se for o gerente, o caso fecha com laço. Traga a ligação com o crime.']];


// ============================================================
// C4mpt0n (hacker) e Zeca (ferro-velho): a credencial mestra para a porta de serviço
// ============================================================
NPCS.bao.topics.push({ id: 'ba_porta', label: 'Você conhece alguém que consegue abrir qualquer porta?', requiresFlag: 'porta_emperrada', lines: [
  ['N', 'Qualquer porta? *Ele olha para os lados e baixa a voz.* Conheço o C4mpt0n. É o melhor hacker do Sector 4. Dizem que abriu o cofre de uma corporação só de tédio.'],
  ['N', 'Mas ele não atende número rastreável. Liga de uma cabine de holochamada e digita 4-4-7-C-4-M. Fala que fui eu que passei.'],
  ['I', 'Um hacker que um menino de dez anos chama pelo apelido. Vale a ligação.'],
  { flag: 'tel_campton' },
] });

Object.assign(NPCS, {
  campton: {
    name: 'C4mpt0n', role: 'Hacker', look: 'campton',
    scan: { text: 'Nenhum registro em banco de dados nenhum. O implante na nuca tem dezenas de modificações caseiras e um firewall que tenta escanear o seu scanner de volta.' },
    intro: '*Seis monitores iluminam o rosto dele de verde.* Então você é o tira que o Bao mandou. Senta onde não tiver cabo. Se tiver cabo em todo lugar, fica em pé.',
    again: ['Fala rápido, tô compilando.', 'Não encosta na androide.', 'Café? Não tenho. Tenho energético vencido.'],
    topics: [
      { id: 'cp_quem', label: 'Quem é você?', lines: [
        ['N', 'C4mpt0n. Com quatro e zero, porque as letras já tinham dono.'],
        ['N', 'Abro portas, cofres e consciências. Corporação nenhuma me pega, porque eu não existo em nenhum banco de dados.'],
      ] },
      { id: 'cp_porta', label: 'Preciso abrir a porta de serviço do Hotel Alvorada.', lines: [
        ['N', '*Ele digita sem olhar e uma tela pisca com a planta do hotel.* Porta de serviço do 4º andar... Hm. Isso não é defeito, tira. É um bug plantado no firmware.'],
        ['N', 'Alguém travou essa porta de propósito, anteontem, e ainda apagou os logs. Quase todos.'],
        ['N', 'Consigo uma credencial mestra que passa por cima de tudo. Mas nada é de graça.'],
        ['N', '*Ele aponta a androide na bancada.* Tô terminando essa belezinha, encomenda do Sindicato Lótus. Falta um núcleo de sincronia neural K-9. Sem ele, ela não abre os olhos. E o Sindicato não gosta de atraso.'],
        ['N', 'Tem um no ferro-velho do Zeca, em algum lugar no meio daquela montanha de sucata. Traz pra mim, e a credencial é sua.'],
        ['I', 'Um bug plantado. Alguém não queria ninguém naqueles túneis.'],
        { flag: 'missao_peca' }, { unlock: 'ferrovelho' },
      ] },
      { id: 'cp_androide', label: 'O que é essa androide?', lines: [
        ['N', 'Modelo de companhia, personalidade sob medida, para o Sindicato Lótus. Eu não pergunto pra quê.'],
        ['N', 'Eles pagam bem e pagam em dia. Quem atrasa com o Sindicato costuma aparecer no rio.'],
      ] },
      { id: 'cp_peca', label: 'Trouxe o núcleo K-9.', requiresFlag: 'peca_ok', lines: [
        ['N', '*Ele gira o núcleo contra a luz e sorri pela primeira vez.* Original, sem arranhão. Você tem jeito pra sucateiro, tira.'],
        ['N', '*Ele encaixa a peça no peito da androide. Os olhos dela piscam em azul por um instante.* Pronto. Agora a sua parte.'],
        ['N', 'Credencial mestra gravada no seu implante. Passa por cima de qualquer trava do Alvorada.'],
        ['N', 'E um brinde: puxei o pedaço de log que sobrou do bug. A assinatura é ADM-02. A credencial da gerência.'],
        ['I', 'ADM-02. Quem trancou a suíte também fechou o caminho dos túneis.'],
        { give: 'e_credencial' }, { give: 'e_sabotagem' }, { flag: 'credencial' },
      ] },
    ],
    present: {
      e_luva: [['N', 'Prótese industrial de 40 quilos. Já vi gente com uma dessas arrancar porta de cofre. Ou de túnel.']],
      e_recepcao_log: [['N', 'ADM-02 de novo? Esse gerente tem a mão pesada no teclado. E em outras coisas, aposto.']],
    },
    presentDefault: ['Não me mostra prova de polícia, tira. Eu não vi nada.', 'Isso aí não compila.', 'Bonito. Não me interessa.'],
  },
  zeca: {
    name: 'Zeca', role: 'Dono do ferro-velho', look: 'zeca',
    scan: { text: 'Pulmões cheios de pó de metal e um implante de solda no polegar. Ele já soldou meia cidade.' },
    intro: '*Um velho de macacão engordurado ergue os óculos de solda.* Tá procurando o quê? Aqui tem de tudo, menos garantia.',
    again: ['Achou o que queria?', 'Cuidado com o monte do fundo, ele morde.', 'Tudo acaba aqui, moço. Tudo.'],
    topics: [
      { id: 'ze_quem', label: 'Há quanto tempo o senhor tem este lugar?', lines: [
        ['N', 'Quarenta anos. Vi carro virar carro voador e carro voador virar sucata.'],
        ['N', 'Tudo acaba aqui, detetive. Até gente importante. Principalmente gente importante.'],
      ] },
      { id: 'ze_peca', label: 'Procuro um núcleo de sincronia K-9.', requiresFlag: 'missao_peca', lines: [
        ['N', 'K-9? Peça de androide fino. Se tiver, tá enterrada em algum desses montes.'],
        ['N', 'Pode vasculhar à vontade. Achou, leva. O Sindicato já pagou por metade dessa sucata mesmo.'],
      ] },
    ],
    present: {},
    presentDefault: ['Isso eu não compro.', 'Não vale nem o peso.', 'Hm. Não sei o que é.'],
  },
});
