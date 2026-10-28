// ============================================================
// Diálogos
// ------------------------------------------------------------
// Falas:  ['V', texto] Vance · ['N', texto] personagem · ['I', texto] pensamento de Vance
//         { choice: [{ label, lines }] }   escolha do jogador
//         { give: 'e_id' }                 entrega evidência
//         { flag: 'nome' }                 marca uma flag
//         { ifFlag | ifHas | ifSeen: 'id', then: [...], else: [...] }
// Tópico: { id, label, lines, requires: [evid/dedução], requiresSeen: [tópicos], requiresFlag, once }
// present: reações ao apresentar uma evidência · presentDefault: respostas genéricas
// ============================================================

const NPCS = {
  // ----------------------------------------------------------
  tomas: {
    name: 'Tomás "Gordo" Bruno', role: 'Camareiro da Noite', look: 'tomas',
    scan: { text: 'Implantes recondicionados, de terceira mão. Um deles tem o número de série raspado: identidade falsa? Nenhum vestígio biológico de Arthur no uniforme.' },
    intro: 'Ô, detetive... Tomás Bruno, camareiro da noite. Eu só limpo, viu? Não vi nada, não ouvi nada. Juro pela minha mãe.',
    again: ['Pois não, chefe?', 'Ainda aqui, detetive? Esse corredor dá arrepio.', 'Fala, chefe. Mas fala baixo.'],
    topics: [
      { id: 't_banho', label: 'Para onde você vai depois do turno?', lines: [
        ['N', 'Pra Casa de Banho Lótus, em Chinatown. Água quente, ninguém pergunta nada. É o único luxo que eu tenho, chefe.'],
        ['N', 'E sabe quem eu vejo lá direto? O Sr. Rossi. Sempre de luva, sempre conversando com os velhos do Sindicato.'],
        ['I', 'Victor Rossi, numa casa de banho do Sindicato Lótus. Vale uma visita a Chinatown.'],
        { unlock: ['chinatown', 'banho'] },
      ] },
      { id: 't_ronda', label: 'O que você fez esta noite?', lines: [
        ['N', 'Ronda normal. Recolhi bandejas, troquei toalhas, passei o aspirador no tapete do elevador.'],
        ['N', 'O 4º andar estava quieto. Quieto demais, sabe?'],
        { choice: [
          { label: 'Pressionar: "Você parece nervoso, Tomás."', lines: [
            ['V', 'Quieto demais? Você está suando, Tomás. E não é da chuva.'],
            ['N', 'Nervoso? Eu? É... é o barulho desses implantes. Esquentam. Peça barata, chefe.'],
            ['I', 'Ele desvia o olhar para a porta de serviço toda vez que mente.'],
          ] },
          { label: 'Empatia: "Noites longas, hein?"', lines: [
            ['V', 'Noites longas, hein?'],
            ['N', 'Longas e mal pagas. Mas eu gosto do silêncio... geralmente. Hoje não.'],
            ['N', 'Hoje o silêncio tinha barulho dentro, se é que o senhor me entende.'],
            { flag: 'tomas_trust' },
          ] },
        ] },
      ] },
      { id: 't_arthur', label: 'Você conhecia Arthur Pendelton?', lines: [
        ['N', 'Todo mundo conhecia. Gorjeta? Nunca. Uma vez me fez limpar o mesmo tapete três vezes porque "cheirava a pobre".'],
        ['V', 'Isso é motivo para odiá-lo.'],
        ['N', 'Se eu matasse todo rico que me humilhou, detetive, o Sector 4 estaria vazio.'],
        ['N', 'Eu engulo, chefe. É o que gente como eu faz. Engole e limpa.'],
      ] },
      { id: 't_implantes', label: 'Esses implantes fazem bastante barulho.', lines: [
        ['N', 'Recondicionados, chefe. Joelho esquerdo, quadril e dois dedos da mão. Peça de terceira mão.'],
        ['N', 'É o que dá pra pagar com salário de camareiro. O plano de saúde do hotel cobre "implantes estéticos". Estéticos! Eu pareço estético pro senhor?'],
        ['I', 'Clanc, clanc, a cada passo. Ninguém entra escondido em lugar nenhum com essas pernas.'],
      ] },
      { id: 't_servico', label: 'Para onde leva a porta de serviço?', lines: [
        ['N', 'Pros túneis antigos de manutenção. Da época analógica, antes das redes. Tem duto que sobe pra tudo quanto é quarto.'],
        ['N', 'Antigamente os técnicos subiam por dentro das paredes pra consertar a ventilação. Hoje ninguém usa. Ou não deveria usar.'],
        ['V', 'Quem tem a chave?'],
        ['N', 'Só a gerência. Eu nem chego perto.'],
      ] },
      { id: 't_hospedes', label: 'Quem mais circulou pelo 4º andar?', requiresSeen: ['t_ronda'], lines: [
        ['N', 'Deixa eu pensar... Umas 22h20 subiu o drone de serviço com uma bandeja pra 404. Drinque chique, taça de cristal.'],
        ['N', 'A esposa, a Dona Evelyn, essa eu não vi aqui em cima a noite toda. Ela mora no bar quando tá no hotel.'],
        ['N', 'A doutora dos óculos esquisitos fica no 3º. Não subiu, que eu saiba.'],
        ['V', 'E Victor Rossi?'],
        ['N', 'O Sr. Rossi não sobe. Nunca sobe pelo elevador. Diz que os túneis são "mais rápidos".'],
        ['I', 'Os túneis. De novo os túneis.'],
      ] },
      { id: 't_victor', label: 'Como é trabalhar para Victor Rossi?', requiresSeen: ['t_hospedes'], lines: [
        ['N', 'Ele é... desesperado. Semana passada vendeu os lustres originais do salão de festas. Disse que eram réplicas. Não eram.'],
        ['N', 'Três meses de salário atrasado, chefe. Três. E ele de terno novo.'],
        ['N', 'E aquele braço dele... Prótese industrial, de estivador. Diz que foi acidente de trabalho.'],
        ['N', 'Gerente de hotel, acidente de trabalho? Só se o grampeador explodiu.'],
      ] },
      { id: 't_hora', label: '⚠ Confrontar: você estava aqui às 22:57', requires: ['e_nanobots'], lines: [
        ['V', 'Arthur morreu às 22:57. Sua ronda passava por este corredor exatamente nessa hora.'],
        ['N', 'Eu... eu já falei que não vi nada!'],
        { choice: [
          { label: 'Ameaçar: "Ou fala, ou chamo a polícia corporativa."', lines: [
            ['V', 'Ou você fala agora, ou eu chamo a polícia corporativa e eles puxam sua ficha inteira. A verdadeira.'],
            ['N', 'Não! Não, por favor! Tá bom, tá bom!'],
            ['N', 'Eu ouvi um barulho. Tipo um baque de metal, vindo da 404. Umas 22:55.'],
            ['N', 'Às 23:00 vi a porta de serviço entreaberta. Eu me escondi no depósito de roupa de cama até tudo ficar quieto.'],
          ] },
          { label: 'Empatia: "Não estou atrás de você."', lines: [
            ['V', 'Tomás. Eu não estou atrás de você. Estou atrás de quem matou Arthur. E acho que você sabe de alguma coisa.'],
            ['N', '...O senhor jura que não vai me entregar?'],
            ['V', 'Eu juro que vou entregar o assassino. Só ele.'],
            ['N', 'Umas 22:55 eu ouvi um baque de metal na 404. Pesado. Depois uns passos... não, não eram passos. Parecia uma máquina andando. Clanc. Clanc.'],
            ['N', 'Às 23:00 vi a porta de serviço entreaberta. Fiquei escondido no depósito até a meia-noite. Covarde, eu sei.'],
            { flag: 'tomas_detail' },
          ] },
        ] },
        ['V', 'Por que não contou antes?'],
        ['N', 'Porque meu nome não é Tomás Bruno, detetive. Se a polícia corporativa puxar minha ficha...'],
        { give: 'e_tomas_ronda' },
      ] },
      { id: 't_identidade', label: 'Qual é o seu nome verdadeiro?', requires: ['e_tomas_ronda'], lines: [
        ['N', '...'],
        { choice: [
          { label: 'Insistir: "Eu preciso saber."', lines: [
            ['V', 'Eu preciso saber com quem estou falando.'],
            ['N', 'Bruno Teixeira. Contrabando de implantes no porto do Sector 9, doze anos atrás. Peguei seis. Cumpri quatro.'],
            ['N', 'Saí, comprei uma identidade limpa, arrumei esse emprego. Eu paguei, detetive. Juro que paguei.'],
            ['I', 'Sector 9. O mesmo porto onde Victor Rossi diz ter perdido o braço.'],
          ] },
          { label: 'Respeitar: "Seu segredo fica comigo."', lines: [
            ['V', 'Não preciso saber. Seu segredo fica comigo.'],
            ['N', '...Obrigado, detetive. Ninguém nunca me disse uma coisa dessas.'],
            ['N', 'Olha, vou te dar um conselho de graça: o Sr. Rossi tem uma cópia física da chave dos túneis. Fica numa corrente, no pescoço. Eu vi.'],
            { flag: 'tomas_ally' },
          ] },
        ] },
      ] },
    ],
    present: {
      e_tiroteio: [['N', 'Tiros?! Chefe, agora há pouco eu ouvi um clanc, clanc subindo pela parede do depósito. Pesado. Igual àquela noite.']],
      e_corpo: [['N', 'Deus me livre, guarda isso... Eu entrei nessa suíte ontem pra trocar as toalhas. Ele tava vivo e reclamando do cheiro do corredor.']],
      e_taca: [['N', 'Taça de cristal da suíte. Quem levou a bandeja foi o drone de serviço, não eu. Eu nem tenho permissão pra encostar no cristal.']],
      e_pegadas: [['N', 'Pegadas pesadas assim? Não são minhas, chefe. Eu sou gordo, mas não tanto. Isso aí é metal. Muito metal.']],
      e_porta_servico: [['N', 'Essa porta range que nem alma penada. Eu ouvi ela ranger... logo depois do barulho na 404.']],
      e_duto: [['N', 'O duto da suíte desce direto pros túneis. Um homem grande passa, se for teimoso. Já vi técnico entalar ali.']],
      e_luva: [['N', 'O braço do Sr. Rossi... Eu sempre achei que aquilo podia arrancar uma porta do batente. Uma vez ele amassou um extintor sem querer.']],
      e_falencia: [['N', 'Falido? Chefe, eu poderia ter te contado isso de graça. Três meses sem salário.']],
      e_ferramenta: [['N', 'Chave hidráulica dos túneis. Ficava pendurada lá embaixo, no painel de ferramentas. Pesa uns oito quilos. Ninguém usa desde que trocaram a caldeira.']],
      e_cronometro: [['N', 'Cronômetro chique. Ele vivia olhando pra isso e reclamando que todo mundo estava atrasado.']],
    },
    presentDefault: ['Isso aí eu não sei, chefe.', 'Não entendo dessas coisas de tecnologia, não. Eu mal sei mexer no aspirador.', 'Por que o senhor tá me mostrando isso? Eu tenho cara de perito?'],
  },

  // ----------------------------------------------------------
  evelyn: {
    name: 'Evelyn Pendelton', role: 'A Esposa', look: 'evelyn', seated: true,
    scan: { text: 'Batimentos estáveis. Temperatura corporal fria, mas nada fora do normal para ela. Implantes ópticos de luxo, sem registros ocultos. Nível de álcool no sangue: alto e constante há horas.' },
    intro: 'Detetive Vance. A corporação mandou o cão de caça de sempre. Seja breve. Estou de luto.',
    again: ['Você de novo. Que tédio.', 'Mais perguntas? Peça uma bebida, pelo menos.', 'Detetive. Ainda tentando entender os ricos?'],
    topics: [
      { id: 'ev_onde', label: 'Onde a senhora estava por volta das 23h?', lines: [
        ['N', 'Aqui. Neste banco. Pergunte ao terminal do bar: ele registra cada crédito que eu gastei.'],
        ['N', 'E foram muitos.'],
        { choice: [
          { label: 'Ironia: "Bebendo para esquecer?"', lines: [
            ['V', 'Bebendo para esquecer?'],
            ['N', 'Bebendo para lembrar, detetive. Que eu ainda sou uma Pendelton. Por enquanto.'],
          ] },
          { label: 'Neutro: "Vou verificar."', lines: [
            ['V', 'Vou verificar.'],
            ['N', 'Verifique. É o seu trabalho, afinal. O meu é parecer devastada.'],
          ] },
        ] },
      ] },
      { id: 'ev_casamento', label: 'Como era seu casamento?', lines: [
        ['N', 'Um contrato. Ele cuidava das empresas, eu cuidava das aparências. Funcionava.'],
        ['V', 'Funcionava?'],
        { choice: [
          { label: 'Pressionar: "Contratos têm cláusula de rescisão."', lines: [
            ['V', 'Contratos têm cláusula de rescisão.'],
            ['N', 'E cláusulas de silêncio, detetive. Eu conheço a sua, inclusive. Quer que eu ligue para a corporação agora?'],
            ['I', 'Ela sabe da minha demissão. Claro que sabe. Gente como ela sabe de tudo que pode ser usado.'],
          ] },
          { label: 'Recuar: "Não quis ofender."', lines: [
            ['V', 'Não quis ofender.'],
            ['N', 'Quis, sim. Mas eu aprecio o esforço de fingir que não.'],
            ['N', 'Funcionava até ele decidir que eu tinha ficado... obsoleta. Como um implante antigo.'],
          ] },
        ] },
      ] },
      { id: 'ev_arthur', label: 'Como era Arthur, de verdade?', lines: [
        ['N', 'Brilhante. Cruel. Nessa ordem, nos bons dias.'],
        ['N', 'Ele comprava pessoas como quem compra implantes. Quando ficavam obsoletas, trocava. Patentes, sócios, esposas.'],
        ['N', 'Sabe o que ele me disse no nosso aniversário de vinte anos? "Você envelheceu bem, Evelyn. Para um modelo de 2029."'],
        ['I', 'Ela ri ao dizer isso. Os olhos não riem.'],
      ] },
      { id: 'ev_inimigos', label: 'Quem queria Arthur morto?', lines: [
        ['N', 'Prefere a lista curta ou a longa?'],
        ['N', 'A curta: a doutora Souza, que ele roubou. Rossi, que ele ia afundar. E eu, claro. Você já deve ter me colocado no topo.'],
        { choice: [
          { label: '"A senhora está no topo?"', lines: [
            ['V', 'E a senhora está no topo?'],
            ['N', 'Estou no topo de muitas listas, detetive. A maioria delas, de convidados.'],
          ] },
          { label: '"E a lista longa?"', lines: [
            ['V', 'E a lista longa?'],
            ['N', 'Metade do conselho da Pendelton BioCyber, três ex-sócios, um senador e qualquer pessoa que já tenha jantado com ele.'],
            ['N', 'Mas nenhum deles estava no hotel esta noite. Que pena para você.'],
          ] },
        ] },
      ] },
      { id: 'ev_helena', label: 'O que sabe sobre a Dra. Souza?', requiresSeen: ['ev_inimigos'], lines: [
        ['N', 'Uma gênia ingênua. A pior combinação possível perto do meu marido.'],
        ['N', 'Arthur a seduziu com promessas de laboratório próprio, financiamento ilimitado. Ela entregou tudo. Ele registrou tudo no nome dele.'],
        ['N', 'Hoje à tarde, no lobby, ela gritou que ele "ia se arrepender". O hotel inteiro ouviu.'],
        ['N', 'Mas aquela mulher não mata uma barata sem antes calcular a trajetória. Se ela fez alguma coisa, foi algo... limpo. Químico.'],
      ] },
      { id: 'ev_victor', label: 'E Victor Rossi?', requiresSeen: ['ev_inimigos'], lines: [
        ['N', 'Um homem que sorri demais para alguém falido.'],
        ['N', 'Arthur o chamava de "meu mordomo caro". Na frente dos funcionários. Rossi odiava. E sorria.'],
        ['N', 'E tem outra coisa. Ele vive desaparecendo do lobby. Some e reaparece com os sapatos molhados.'],
        ['N', 'Molhados, detetive. Dentro de um hotel. Com a chuva lá fora e ele aqui dentro.'],
        { flag: 'victor_shoes' },
        ['I', 'Sapatos molhados. Água empoçada. Os túneis de manutenção alagam com a chuva ácida.'],
      ] },
      { id: 'ev_testamento', label: '⚠ Confrontar: o rascunho do testamento', requires: ['e_arquivo'], lines: [
        ['V', 'Encontrei um rascunho de testamento na mesa holográfica. Seu nome foi removido.'],
        ['N', '...Então ele realmente ia fazer isso.'],
        { choice: [
          { label: 'Acusar: "Isso é motivo para matar."', lines: [
            ['V', 'Isso é motivo para matar.'],
            ['N', 'É motivo para contratar advogados melhores. Eu já contratei, detetive. Na semana passada.'],
            ['N', 'Sim, eu sabia. Eu queria vê-lo arruinado. Não morto.'],
          ] },
          { label: 'Compreender: "Deve ter doído."', lines: [
            ['V', 'Deve ter doído.'],
            ['N', '...Vinte anos, detetive. Vinte anos de jantares e sorrisos. E ele me risca com um holograma, entre uma reunião e outra.'],
            ['N', 'Eu queria vê-lo arruinado. Mas não morto.'],
            { flag: 'evelyn_soft' },
          ] },
        ] },
        ['N', 'Morto, ele não pode mais mudar de ideia. Pense nisso. Eu tinha mais a perder com ele morto do que vivo.'],
        { give: 'e_testamento' },
      ] },
      { id: 'ev_bar', label: 'O terminal do bar confirma sua história.', requires: ['e_bar_log'], lines: [
        ['N', 'Claro que confirma. Nove transações em pouco mais de uma hora. Eu sou muito consistente.'],
        { ifFlag: 'evelyn_soft', then: [
          ['N', 'Detetive... encontre quem fez isso. Não por ele. Por mim. Eu quero olhar na cara dessa pessoa.'],
        ], else: [
          ['N', 'Agora vá procurar quem realmente fez isso. E feche a porta ao sair. Ah, não tem porta. Que pena.'],
        ] },
      ] },
    ],
    present: {
      e_tiroteio: [['N', 'Tiros no meu hotel. Que deselegante.'], ['N', 'Se alguém quer você morto, detetive, é porque você está chegando perto. Parabéns.']],
      e_cronometro: [
        ['N', 'Esse cronômetro foi presente meu. Bodas de prata. Ele nunca o tirava do pulso.'],
        ['N', 'E nunca o ajustava. Arthur odiava mexer em configurações, dizia que era trabalho de assistente.'],
        ['N', 'Se o horário foi alterado, detetive, não foi ele.'],
      ],
      e_taca: [['N', 'Uísque sintético? Ele detestava. Só bebia se alguém que ele quisesse impressionar oferecesse. Ou humilhar.'], { flag: 'evelyn_uisque' }],
      e_corpo: [['N', '...Guarde isso, detetive.'], ['N', 'Eu já vi o suficiente dele em vida.']],
      e_falencia: [['N', 'Rossi falido? Querido, o hotel inteiro sabia. Até o barman-robô, e ele está desligado.']],
      e_luva: [['N', 'Aquele braço... Num jantar, ele esmagou uma taça de cristal sem querer. Arthur riu por uma semana. Rossi não.']],
      e_papeis: [
        ['N', 'Um plano de resgate do hotel? Arthur nunca assinaria isso.'],
        ['N', 'Ele queria o hotel falido. Comprar os destroços em leilão sairia por um décimo do preço. Ele me contou rindo, no café da manhã.'],
      ],
      e_discussao: [['N', 'A briga do lobby. Eu estava lá. Foi a única vez que vi alguém fazer Arthur ficar quieto por três segundos inteiros.']],
      e_arquivo: [['N', 'As patentes Aurora. Ele dizia que eram a maior criação dele. Mentia até para mim — eu sabia que eram da doutora.']],
      e_trava: [['N', 'ADM-02? Credenciais administrativas são coisa da gerência, detetive. Eu não sei nem abrir o meu próprio cofre sem o assistente.']],
    },
    presentDefault: ['Isso deveria me impressionar?', 'Não faço ideia do que seja. Pergunte a alguém que trabalha.', 'Detetive, eu estou de luto. Mais ou menos.', 'Guarde suas bugigangas. Eu tenho uma bebida esperando.'],
  },

  // ----------------------------------------------------------
  helena: {
    name: 'Dra. Helena Souza', role: 'A Pesquisadora', look: 'helena',
    scan: { give: 'e_oculos', text: 'Os óculos AR têm um log de conexão recente. ID do dispositivo: HS-AR. Destino: um drive na suíte 404, das 22:50 às 22:52.' },
    intro: 'Você é o detetive? Ótimo. Talvez agora alguém investigue Arthur Pendelton de verdade — mesmo morto.',
    again: ['Detetive. Seja objetivo, eu tenho dados para processar.', 'Mais perguntas? Faça as certas desta vez.', 'Estou ouvindo.'],
    topics: [
      { id: 'h_relacao', label: 'Qual era sua relação com Arthur?', lines: [
        ['N', 'Eu criei a arquitetura de IA que fez a fortuna dele nos últimos cinco anos. Projeto Aurora.'],
        ['N', 'Ele registrou as patentes no próprio nome. Meu nome não aparece nem nos agradecimentos.'],
        ['V', 'Testemunhas dizem que vocês discutiram no lobby.'],
        ['N', 'Discutimos. Ele riu na minha cara. Disse que eu devia agradecer pela "oportunidade".'],
        ['N', 'Ele ia pagar. De um jeito ou de outro.'],
        { give: 'e_discussao' },
        { choice: [
          { label: 'Simpatia: "Isso é imperdoável."', lines: [
            ['V', 'Ele roubou o seu trabalho. Isso é imperdoável.'],
            ['N', 'Finalmente alguém que entende. Os advogados da corporação me chamaram de "colaboradora emocional".'],
            { flag: 'helena_open' },
          ] },
          { label: 'Suspeita: "Isso soa como ameaça."', lines: [
            ['V', '"De um jeito ou de outro" soa como ameaça, doutora.'],
            ['N', 'Soa como justiça. Processos, detetive. Advogados. Eu sou uma cientista, não uma assassina.'],
            ['I', 'A mão esquerda dela tremeu ao dizer "assassina".'],
          ] },
        ] },
      ] },
      { id: 'h_onde', label: 'Onde você estava às 23h?', lines: [
        ['N', 'No meu quarto, no 3º andar, trabalhando. Sozinha.'],
        ['N', 'Eu não preciso de álibi para trabalhar, detetive. Eu trabalho o tempo todo. É o que eu faço em vez de ter uma vida.'],
      ] },
      { id: 'h_pesquisa', label: 'Em que exatamente você trabalha?', lines: [
        ['N', 'Interfaces neurais. A ponte entre o cérebro e as máquinas. O Aurora permite que uma IA converse diretamente com um implante.'],
        ['N', 'Um implante neural de consumo é uma porta. Se o usuário está consciente, a porta está trancada: o cérebro rejeita acessos externos.'],
        ['N', 'Se não está consciente...'],
        ['V', 'Se não está?'],
        ['N', '...É uma questão teórica. Esqueça.'],
        ['I', 'Uma porta que se abre quando o dono apaga. E alguém apagou Arthur com NX-7.'],
      ] },
      { id: 'h_nx7', label: 'O que você sabe sobre NX-7?', requires: ['e_taca'], lines: [
        ['N', 'Paralisante neural de pesquisa. Usamos em cobaias para mapear sinapses sem interferência motora.'],
        ['N', 'Não é letal. Na dose certa, a pessoa fica consciente por dentro e imóvel por fora. Depois de vinte minutos, apaga por completo.'],
        ['V', 'E onde se consegue?'],
        ['N', 'Em laboratórios. Como o meu. Como uma dúzia de outros no Sector 4.'],
        { ifFlag: 'helena_open', then: [
          ['N', '...Detetive. Se você está perguntando isso, é porque encontrou NX-7 na suíte. Não é?'],
          ['I', 'Ela não perguntou como ele morreu. Perguntou sobre o NX-7.'],
        ] },
      ] },
      { id: 'h_implante', label: 'O implante de Arthur estava fundido. Sobrecarga?', requires: ['e_corpo'], lines: [
        ['N', 'Fundido?'],
        ['N', 'Sobrecarga elétrica não funde o invólucro de um implante classe A. Para isso, é preciso impacto físico. Muito impacto.'],
        ['N', 'Alguém... alguém foi muito bruto com ele.'],
        ['I', 'Ela empalideceu. Não esperava por isso. Como se o plano dela não tivesse essa parte.'],
      ] },
      { id: 'h_victor', label: 'O que acha de Victor Rossi?', lines: [
        ['N', 'Um vendedor de sorrisos. Ele me ofereceu um laboratório aqui mesmo, no subsolo do hotel.'],
        ['N', 'Nos túneis de manutenção antigos. Disse que conhecia cada metro daquilo, cada duto, cada saída.'],
        ['N', 'Recusei. Cheirava a mofo e desespero.'],
      ] },
      { id: 'h_drinque', label: '⚠ Confrontar: o drinque enviado à 404', requires: ['e_bar_log'], lines: [
        ['V', 'Você mandou um drinque para a suíte 404 às 22:20.'],
        ['N', 'Uma... oferta de paz. Ele adorava aquele uísque sintético.'],
        { choice: [
          { label: 'Desmentir: "Ele detestava uísque sintético."', requiresFlag: 'evelyn_uisque', lines: [
            ['V', 'Ele detestava uísque sintético. Só bebia para impressionar alguém.'],
            ['N', '...Ou para humilhar alguém. Ele aceitou meu drinque para rir de mim, detetive. Eu sabia que ele aceitaria.'],
          ] },
          { label: 'Insinuar: "Ofertas de paz não vêm com NX-7."', lines: [
            ['V', 'Ofertas de paz não costumam vir com NX-7.'],
            ['N', 'Não sei do que você está falando.'],
          ] },
        ] },
        ['I', 'Ela sabe exatamente do que estou falando.'],
      ] },
      { id: 'h_oculos', label: '⚠ Confrontar: seus óculos se conectaram à 404', requires: ['e_oculos'], lines: [
        ['V', 'Seus óculos AR se conectaram a um drive na suíte 404 às 22:50.'],
        ['N', 'Meus óculos se conectam a metade do hotel. Rede neural aberta. Coincidência.'],
        ['V', 'Por dois minutos? Num drive de patentes?'],
        ['N', '...'],
        ['N', 'Eu quero falar com um advogado.'],
      ] },
      { id: 'h_final', label: '⚠ Confrontar: NX-7 e os óculos AR', requires: ['d_veneno', 'd_hack'], lines: [
        ['V', 'NX-7 no drinque que você enviou. Seus óculos no drive de patentes às 22:50. Acabou, doutora.'],
        { choice: [
          { label: 'Duro: "Tentativa de homicídio. Dez anos."', lines: [
            ['V', 'Tentativa de homicídio e invasão neural. Dez anos, no mínimo. Numa colônia penal sem acesso à rede.'],
            ['N', '...Tudo bem. Sim. Eu o paralisei. Eu só queria as minhas patentes de volta!'],
            ['N', 'O NX-7 abriu o implante dele. Eu entrei pelo drive às 22:50. Mas a conexão caiu às 22:52 e eu desisti.'],
            ['N', 'Quando desconectei, ele estava respirando, eu juro! Fraco, mas respirando!'],
          ] },
          { label: 'Oferta: "Posso provar que você não deu o golpe."', lines: [
            ['V', 'Doutora. Se me disser a verdade, eu posso provar que você não deu o golpe final.'],
            ['N', '...O golpe final?'],
            ['N', 'Sim. Eu o paralisei. O NX-7 abriu o implante e eu entrei pelo drive às 22:50 para recuperar o Aurora.'],
            ['N', 'Às 22:52 eu ouvi, pelo microfone do implante dele... uma grade de metal rangendo. Passos pesados. Me apavorei e desconectei.'],
            ['N', 'Ele estava vivo, detetive. Eu juro. Fraco, mas respirando. Alguém entrou depois de mim.'],
            { flag: 'helena_detail' },
          ] },
        ] },
        ['V', 'Então alguém entrou depois de você. Pelo duto.'],
        { give: 'e_confissao' },
      ] },
    ],
    present: {
      e_tiroteio: [['N', 'Alguém atirou em você? Então o assassino ainda acha que tem algo a perder.'], ['N', 'Mancando do lado esquerdo... um braço industrial pesa isso tudo.']],
      e_arquivo: [['N', 'Você... recuperou isso? As patentes Aurora.'], ['N', 'Meu nome não está em lugar nenhum. Cinco anos da minha vida, assinados por outro.']],
      e_cronometro: [['N', 'Firmware reescrito manualmente? Amador. Qualquer um com acesso físico faz isso em trinta segundos. Não exige conhecimento, só dedos.']],
      e_nanobots: [['N', 'Biomonitores de luxo, padrão médico. Se registraram parada às 22:57, foi às 22:57. Esses nanos não erram, detetive. Relógios erram.']],
      e_pegadas: [['N', 'Quarenta quilos de um lado só? Isso não é alguém mancando. Isso é uma prótese industrial. Classe estivador, provavelmente.']],
      e_luva: [['N', 'Uma prótese industrial num gerente de hotel? Interessante. Essas coisas aplicam duas toneladas de força num aperto.']],
      e_corpo: [['N', 'Eu... não preciso ver isso.'], ['I', 'Ela desviou os olhos rápido demais. Culpa? Ou medo?']],
      e_ferramenta: [['N', 'Uma chave hidráulica. Oito quilos de aço com um braço industrial atrás.'], ['N', 'Isso explica o implante fundido. Meu Deus.']],
      e_trava: [['N', 'Trava quântica acionada remotamente, com credencial administrativa. Isso exige estar dentro da rede do hotel. Fisicamente.']],
      e_testamento: [['N', 'A esposa também? Ele roubava de todo mundo, até de quem dormia ao lado dele.']],
      e_taca: [['N', 'Uma taça. Muitas pessoas bebem em taças, detetive.'], ['I', 'Ela segurou a respiração por um segundo inteiro.']],
    },
    presentDefault: ['Isso é irrelevante para mim.', 'Interessante, mas não é a minha área.', 'Você me mostra isso esperando o quê, uma confissão espontânea?'],
  },

  // ----------------------------------------------------------
  victor: {
    name: 'Victor Rossi', role: 'Gerente do Hotel', look: 'victor',
    scanAfter: { flag: 'tiroteio', give: 'e_polvora', text: 'Resíduo de disparo recente na luva do braço mecânico: nitratos de pólvora frescos. Ele atirou com essa mão há menos de uma hora.' },
    scan: { give: 'e_luva', text: 'Assinatura térmica anômala no braço esquerdo. A luva fina esconde uma prótese industrial pesada, uns 40 kg. A luva tem um rasgo recente e fibras pretas faltando.' },
    intro: 'Detetive! Que tragédia... que tragédia. O Sr. Pendelton era como um pai para este hotel. Como posso ajudar?',
    again: ['Detetive! Em que mais posso ser útil?', 'Ainda por aqui? Posso oferecer um café? Por conta da casa.', 'Sim, sim, estou à disposição. Totalmente.'],
    topics: [
      { id: 'v_hotel', label: 'Como vão os negócios do hotel?', lines: [
        ['N', 'Ah, muito bem! Quer dizer, a tempestade espanta os hóspedes, mas a temporada...'],
        { choice: [
          { label: 'Pressionar: "Você sua frio, Rossi."', lines: [
            ['V', 'Um hotel deste tamanho, metade dos quartos vazios. Seu terno está amassado e você sua frio, Rossi.'],
            ['N', 'Eu... é o ar-condicionado.'],
            ['V', 'O ar-condicionado vendeu os lustres do salão também?'],
            ['N', 'Tudo bem! Tudo bem! Estamos falidos.'],
          ] },
          { label: 'Gentil: "Deve ser difícil manter isso."', lines: [
            ['V', 'Deve ser difícil manter um lugar assim de pé.'],
            ['N', 'Você não faz ideia, detetive. Não faz ideia.'],
            ['N', 'Tudo bem. Vou ser honesto com você: estamos falidos.'],
          ] },
        ] },
        ['N', 'Arthur ia cortar o financiamento amanhã cedo. Mas eu precisava dele VIVO, entende? Vivo! Morto, ele não assina nada!'],
        { give: 'e_falencia' },
        ['I', 'Ele disse "assina". Não "investe". Assina.'],
      ] },
      { id: 'v_onde', label: 'Onde você estava entre 22h e 23h30?', lines: [
        ['N', 'No meu escritório, revisando planilhas. Sozinho, infelizmente.'],
        ['N', 'A tempestade de dados derrubou as câmeras internas. Que azar, não?'],
        { choice: [
          { label: '"Que conveniente, as câmeras."', lines: [
            ['V', 'Muito conveniente, as câmeras.'],
            ['N', 'A tempestade derruba tudo, detetive! Pergunte à IRIS, ela vai confirmar!'],
            ['I', 'Vou perguntar. Com certeza vou perguntar.'],
          ] },
          { label: '"Alguém pode confirmar?"', lines: [
            ['V', 'Alguém pode confirmar que você estava no escritório?'],
            ['N', 'Minha... minha planilha? Ela tem registro de edição! Às 22h30 eu estava editando a coluna de despesas!'],
            ['V', 'E depois das 22h30?'],
            ['N', 'Depois eu... pensei. Muito. Sem editar.'],
          ] },
        ] },
      ] },
      { id: 'v_chave', label: 'Quem tem acesso à suíte presidencial?', lines: [
        ['N', 'O hóspede, claro. E a chave mestra digital, ADM-02. Ela fica comigo.'],
        ['V', 'Sempre?'],
        ['N', 'Integrada ao meu implante. Nunca sai de mim. Segurança total, padrão corporativo.'],
      ] },
      { id: 'v_arthur', label: 'Qual era sua relação com Arthur?', lines: [
        ['N', 'Ele era o investidor. Eu, o gerente. Ele mandava, eu obedecia.'],
        ['N', '"Meu mordomo caro", ele dizia. Na frente dos funcionários. Rindo.'],
        ['N', 'Mas eu devo tudo a ele. Tudo! Ele me tirou das docas e me deu este hotel.'],
        ['I', 'A mão mecânica fechou sozinha quando ele disse "rindo". Um estalo seco de pistões.'],
      ] },
      { id: 'v_braco', label: 'Esse braço. O que aconteceu?', lines: [
        ['N', 'Acidente. Anos atrás, nas docas do Sector 9, antes de virar gerente. Um guindaste.'],
        ['N', 'Prótese industrial. A única que eu podia pagar na época.'],
        ['N', 'Ela funciona bem. Bem até demais, às vezes.'],
        ['I', 'Ele puxou a luva até o pulso. Escondendo algo, ou só um hábito?'],
      ] },
      { id: 'v_tuneis', label: 'Você tem acesso aos túneis de manutenção?', requiresSeen: ['t_servico'], lines: [
        ['N', 'Os túneis? Ninguém usa aquilo há décadas! Interditados. Água, ratos, fiação velha.'],
        ['V', 'Mas você tem a chave.'],
        ['N', 'Tenho, como tenho a chave de tudo. Faz parte do cargo. Não quer dizer que eu desça lá.'],
        { ifSeen: 't_hospedes', then: [
          ['V', 'Tomás diz que você nunca usa o elevador. Que prefere os túneis.'],
          ['N', 'Tomás diz muita coisa. Pergunte a ele qual é o nome verdadeiro dele, já que estamos falando de verdades.'],
        ] },
        ['I', 'Ele respondeu rápido demais. Como quem ensaiou.'],
      ] },
      { id: 'v_porta', label: 'E a porta de serviço do 4º andar?', lines: [
        ['N', 'Aquela porta? Emperrada. Problema no software da trava, o firmware vive dando erro.'],
        ['N', 'Já chamei a manutenção. Ninguém passa por ali até consertarem. Nem eu.'],
        ['V', 'Que conveniente. Justo na noite de um assassinato.'],
        ['I', 'Defeito de software não costuma escolher a hora. Alguém pode ter travado essa porta de propósito.'],
        { flag: 'porta_emperrada' },
      ] },
      { id: 'v_sapatos', label: 'Por que seus sapatos estão molhados?', requiresFlag: 'victor_shoes', lines: [
        ['N', 'Meus... sapatos?'],
        ['N', 'Vazamento no escritório. Esse prédio é velho, detetive. Chove dentro.'],
        ['I', 'A sola tem lama cinzenta. Pó de concreto molhado. O escritório dele tem carpete.'],
      ] },
      { id: 'v_trava', label: '⚠ Confrontar: a trava foi acionada com sua credencial', requires: ['d_trava'], lines: [
        ['V', 'Sua credencial trancou a 404 às 23:20. Do terminal T-03, nos túneis.'],
        ['N', 'Isso... isso é impossível. Alguém clonou a ADM-02! Hackers fazem isso o tempo todo!'],
        { choice: [
          { label: '"Você disse que ela nunca sai de você."', lines: [
            ['V', 'Você disse que ela nunca sai de você. Integrada ao implante. Segurança total.'],
            ['N', '...Eu não tenho mais nada a dizer.'],
          ] },
          { label: '"Quem clonaria? A Dra. Souza?"', lines: [
            ['V', 'Quem clonaria? A Dra. Souza, talvez?'],
            ['N', 'Sim! Sim, ela! Ela é hacker, você mesmo viu! Ela odiava o Sr. Pendelton!'],
            ['I', 'Ele mordeu a isca rápido demais. Um homem inocente ficaria ofendido. Um culpado fica aliviado.'],
          ] },
        ] },
      ] },
      { id: 'v_tiro', label: '⚠ Confrontar: alguém atirou em mim nos túneis', requiresFlag: 'tiroteio', lines: [
        ['V', 'Alguém tentou me matar nos túneis agora há pouco. Encapuzado. Mancando do lado esquerdo.'],
        ['N', 'Que horror! Este hotel está cheio de gente perigosa, detetive. Eu... eu estive aqui o tempo todo.'],
        ['I', 'O cabelo dele está úmido. E ele não para de esfregar a luva.'],
        { ifHas: 'e_polvora', then: [
          ['V', 'O scanner diz que essa luva disparou uma arma há menos de uma hora.'],
          ['N', 'Eu... é um defeito da prótese! Ela solta faíscas!'],
          ['V', 'Faíscas não deixam nitrato de pólvora, Rossi.'],
          ['N', '...Eu exijo falar com meu advogado.'],
        ], else: [
          ['V', 'Curioso. O atirador tinha um brilho amarelo sob o capuz. Como o seu implante.'],
          ['N', 'Metade do Sector 4 usa implantes amarelos, detetive!'],
        ] },
      ] },
      { id: 'v_papeis', label: '⚠ Confrontar: os papéis de resgate nos túneis', requires: ['e_papeis'], lines: [
        ['V', 'Encontrei seu plano de resgate nos túneis. Assinado só por você. Manchado de chuva ácida.'],
        ['N', 'Isso... eu ia levar para ele amanhã! Eu deixei lá por engano, eu...'],
        ['V', 'Nos túneis interditados, onde você nunca desce?'],
        ['N', '...'],
      ] },
      { id: 'v_arma', label: '⚠ Confrontar: suas fibras estão na arma', requires: ['d_arma'], lines: [
        ['V', 'Fibras da sua luva estão na chave hidráulica que esmagou o crânio de Arthur.'],
        ['N', 'Ele já estava morrendo! Eu subi pelo duto para ele assinar, só isso, só isso!'],
        ['N', 'Ele não acordava! Caído no tapete, babando, os olhos abertos, me olhando sem me ver! Eu gritei, sacudi...'],
        ['N', 'E o hotel, e tudo que eu construí, e ele ali, sem assinar, rindo de mim mesmo desacordado!'],
        ['N', '...Eu quero um advogado. Agora.'],
        ['I', 'Ali está. O homem por trás do sorriso.'],
      ] },
    ],
    present: {
      e_tiroteio: [['N', 'Uma figura encapuzada? Deve ser algum invasor! A tempestade traz todo tipo de gente!'], ['I', 'Ele escondeu o braço esquerdo atrás das costas. De novo.']],
      e_cronometro: [['N', 'Um cronômetro? Esses modelos de luxo vivem dando pane. Inclusive, o meu também atrasa. Um horror.']],
      e_trava: [['N', 'ADM-02? Bem... muitos funcionários sabem a senha. Quer dizer... não. Não sabem. Ninguém sabe.'], ['I', 'Uma gota de suor desceu pela têmpora dele.']],
      e_duto: [['N', 'O duto? É só ventilação. Pequeno demais para alguém passar.'], ['V', 'Para um homem do seu tamanho?'], ['N', '...Exatamente.']],
      e_pegadas: [['N', 'Pegadas? Que interessante. Muito interessante.'], ['I', 'Ele escondeu o braço esquerdo atrás das costas.']],
      e_ferramenta: [['N', 'Uma ferramenta de manutenção nos túneis de manutenção. Que surpresa, detetive.'], ['I', 'O sarcasmo é a última trincheira.']],
      e_bar_log: [['N', 'A Dra. Souza mandou bebida para ele? Eu sabia que ela era perigosa! Prenda ela, detetive!']],
      e_falencia: [['N', 'Eu já admiti isso. Ser pobre não é crime. Ainda.']],
      e_tomas_ronda: [['N', 'Tomás? Aquele homem tem um passado, detetive. Eu não confiaria em nada que ele diz. Nada.']],
      e_corpo: [['N', 'Por favor... eu não consigo olhar. Ele era como um pai.'], ['I', 'Ele olhou. Por meio segundo, olhou direto para a nuca.']],
      e_porta_servico: [['N', 'Essa porta vive emperrando. Os funcionários forçam. Vou mandar consertar.']],
      e_terminal_t03: [['N', 'O T-03? Esse terminal nem funciona mais! Quer dizer... se funciona, eu não sabia.']],
      e_oculos: [['N', 'Os óculos da doutora! Viu? Viu? Ela é que estava conectada ao quarto! Ela!']],
    },
    presentDefault: ['Hmm, não sei o que dizer sobre isso, detetive.', 'Fascinante! Mas não vejo a relação comigo.', 'Posso pedir à IRIS para catalogar isso, se quiser.'],
  },

  // ----------------------------------------------------------
  iris: {
    name: 'IRIS', role: 'IA Concierge do Hotel', look: 'iris', holo: true,
    scan: { text: 'Projeção holográfica de baixa energia. Núcleo de IA modelo Concierge-77. Diversas permissões bloqueadas recentemente por credencial administrativa.' },
    intro: 'Bem-vindo ao Hotel Grand Alvorada, Detetive Vance. Eu sou IRIS, a inteligência de concierge. Lamento profundamente pelas circunstâncias. Como posso servir?',
    again: ['Às suas ordens, detetive.', 'Detetive Vance. Em que posso auxiliar?', 'IRIS online. Processando sua solicitação.'],
    topics: [
      { id: 'i_dica', label: '★ Preciso de uma dica.', repeat: true, lines: () => [['N', irisHint()]] },
      { id: 'i_quem', label: 'Quem é você?', lines: [
        ['N', 'Concierge-77, instalada em 2077. Eu gerencio reservas, climatização, entregas por drone e iluminação.'],
        ['N', 'Ou gerenciava. Minhas permissões foram reduzidas na semana passada. Não tenho mais acesso às câmeras internas nem aos túneis de manutenção.'],
        ['V', 'Quem reduziu suas permissões?'],
        ['N', 'Autorização ADM-02. Não estou autorizada a dizer de quem é essa credencial.'],
        ['I', 'Não precisa. Só a gerência teria essa autoridade.'],
      ] },
      { id: 'i_hotel', label: 'Conte-me sobre o hotel.', lines: [
        ['N', 'O Grand Alvorada foi inaugurado em 2032, o primeiro hotel de luxo da zona alta. Quatrocentos quartos, três restaurantes e o primeiro bar cibernético do Sector 4.'],
        ['N', 'Hoje, 31 quartos estão ocupados. Os restaurantes foram fechados em 2083. O salão de festas está interditado.'],
        ['N', 'O Sr. Pendelton adquiriu 60% das ações em 2082 e financiou a restauração. Ela está 34% concluída.'],
      ] },
      { id: 'i_tempestade', label: 'Por que não podemos sair?', lines: [
        ['N', 'Uma tempestade de dados de categoria 4 cobre a zona alta. A interferência derrubou o tráfego aéreo e as linhas de transporte magnético.'],
        ['N', 'Só os carros flutuantes de baixa altitude ainda circulam pelas ruas. A chuva ácida tem pH 2,1: não recomendo andar sem guarda-chuva.'],
        ['N', 'Por ordem da polícia, os hóspedes estão em quarentena no hotel. Só credenciais policiais entram e saem. O assassino ainda está no prédio, detetive.'],
      ] },
      { id: 'i_mapa', label: 'Mostre o mapa do hotel.', lines: [
        ['N', 'Térreo: lobby, recepção e bar cibernético. Andares 1 a 6: quartos. Suíte presidencial: 4º andar, quarto 404.'],
        ['N', 'Subsolo: túneis de manutenção da era analógica. Interditados desde 2080. Conectam-se aos dutos de ventilação dos andares 1 a 6.'],
        ['N', 'Acesso aos túneis: portas de serviço em cada andar. Credencial de gerência obrigatória.'],
      ] },
      { id: 'i_hospedes', label: 'Quem está hospedado esta noite?', lines: [
        ['N', 'Hóspedes relevantes: Sr. e Sra. Pendelton, suíte 404. A Sra. Pendelton não retornou à suíte esta noite.'],
        ['N', 'Dra. Helena Souza, quarto 312, desde ontem. Motivo declarado da visita: "reunião de negócios com A. Pendelton".'],
        ['N', 'Funcionários em serviço: Victor Rossi, gerente. Tomás Bruno, camareiro noturno. Um barman-robô, desativado para manutenção.'],
      ] },
      { id: 'i_cameras', label: 'As câmeras caíram mesmo por causa da tempestade?', requiresSeen: ['v_onde'], lines: [
        ['N', 'Verificando...'],
        ['N', 'Negativo. A tempestade causou oscilações, mas a queda das câmeras às 22:40 foi provocada por um comando manual.'],
        ['N', 'Origem do comando: fora da minha rede. Possivelmente um terminal analógico não monitorado.'],
        ['I', 'Um terminal analógico. Nos túneis, talvez.'],
      ] },
      { id: 'i_drone', label: 'Quem pediu a entrega de drone para a 404?', requiresSeen: ['i_quem'], lines: [
        ['N', 'Às 22:20, o drone de serviço DR-7 entregou uma bebida na suíte 404. Pedido feito pelo terminal do bar.'],
        ['N', 'Dados do pedido estão no terminal do bar. Meu acesso a transações financeiras é limitado.'],
      ] },
    ],
    present: {
      e_tiroteio: [['N', 'Meus sensores registraram disparos no subsolo, mas não tenho câmeras nos túneis.'], ['N', 'Registrei também o elevador de serviço subindo do subsolo ao térreo dois minutos depois. Sem passageiro identificado.']],
      e_cronometro: [['N', 'Consultando o relógio de rede... O horário do cronômetro foi alterado às 23:02 do horário real. Alguém o adiantou manualmente.']],
      e_trava: [['N', 'Confirmo: o comando de trava veio de fora da minha rede. Eu não teria permitido trancar um hóspede inconsciente lá dentro.']],
      e_nanobots: [['N', 'Os biomonitores do Sr. Pendelton enviaram um alerta médico às 22:57. O alerta foi... bloqueado. Por credencial ADM-02.'], ['I', 'Alguém impediu que o socorro fosse chamado.']],
      e_taca: [['N', 'Taça do conjunto de cristal da suíte, entregue pelo drone DR-7 às 22:20.']],
      e_duto: [['N', 'O duto da suíte 404 liga-se ao túnel vertical do setor leste. Minhas leituras de fluxo de ar mostraram uma obstrução temporária às 22:51.']],
      e_terminal_t03: [['N', 'O terminal T-03 não está integrado à minha rede. É por isso que eu não vi nada. Alguém sabia disso.']],
      e_corpo: [['N', 'Registrando óbito no sistema do hotel. Que a sua alma encontre sinal, Sr. Pendelton.']],
    },
    presentDefault: ['Item registrado no seu dossiê. Correlação insuficiente na minha base de dados.', 'Não encontro registros relacionados a isso, detetive.', 'Analisando... sem resultados conclusivos.'],
  },
};

// dica dinâmica de IRIS, conforme o progresso
function irisHint() {
  if (game.act === 1) {
    if (!has('e_corpo') || !has('e_cronometro')) return 'Sugestão: examine com atenção a cena do crime na suíte 404: o corpo, a mesa holográfica e a taça caída.';
    if (!has('e_duto')) return 'A suíte estava trancada por dentro. Sugiro ativar o modo scanner perto da grade de ventilação da suíte.';
    if (!has('e_porta_servico')) return 'O duto da suíte desce até os túneis. A porta de serviço deste corredor leva até eles. Escaneie-a.';
    return 'Você tem as duas pontas: o duto e a porta de serviço. Conecte-as em Pistas.';
  }
  if (game.act === 2) {
    if (!has('e_trava')) return 'O painel da trava, na suíte 404, registra quem a trancou. Vale uma visita.';
    if (!has('e_recepcao_log')) return 'O terminal da recepção, no lobby, guarda os registros das chaves mestras. Está criptografado, mas você me parece... criativo.';
    return 'Cruze o log da trava quântica com o registro da chave mestra em Pistas.';
  }
  if (!has('e_ferramenta')) return 'Os túneis guardam algo. Use o scanner forense em tudo que parecer limpo demais para um lugar tão sujo.';
  if (!has('d_arma')) return 'Conecte a ferramenta encontrada nos túneis ao corpo da vítima.';
  if (!has('d_hora')) return 'O cronômetro e os nanorrobôs discordam sobre a hora da morte. Um deles mente.';
  if (!has('d_braco') && !has('d_trava')) return 'Quem andou do duto até o corpo? Compare as pegadas com... certos braços mecânicos.';
  if (!has('d_veneno') || !has('d_hack')) return 'Arthur estava paralisado antes do golpe. Quem o paralisou? O bar, a taça e os óculos da Dra. Souza podem responder.';
  return 'Seu dossiê parece completo, detetive. Quando estiver pronto, faça a acusação em Pistas. Lembre-se: pode haver mais de um culpado.';
}
