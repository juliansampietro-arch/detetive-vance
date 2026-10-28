# Tradução de "O Silêncio do Hotel Alvorada"

Jogo de investigação noir cyberpunk (isométrico, pixel art, para celular). Ano 2085, megacidade "Sector 4",
chuva ácida constante. O jogador é o Detetive Gabriel Vance, que investiga a morte do magnata Arthur Pendelton
na suíte 404 do Hotel Grand Alvorada. O texto-fonte é português do Brasil.

## Arquivos
- `tools/i18n/pt.json`: `{ "id": "texto em português" }`, uma entrada por linha.
- Tradução de um idioma: `tools/i18n/<lang>.<parte>.json`, no mesmo formato `{ "id": "tradução" }`.
- Conferir: `node tools/i18n-build.mjs <lang> --check` (aponta ids faltando, `{0}` trocados, `\n` e tags HTML diferentes).

## Regras
1. Traduza **todos** os ids. Se um texto não for para traduzir (sigla, nome próprio, código), repita o original.
2. Mantenha exatamente: marcadores `{0}`, `{1}`...; o número de quebras de linha `\n`; tags HTML (`<b>`, `<span class="k">`...);
   símbolos e emojis (▶ ◆ ● ▸ ✕ ← — ★ ⚠ 🔊 ♫ ⛶ ⏏ ⟲ ↱ ↰ ⬆); horários e números (22:57, ADM-02, T-03, NX-7, 42 graus);
   ações entre asteriscos (`*Byte pisca os olhos.*` continua entre asteriscos); aspas internas.
3. Caracteres chineses e japoneses ficam como estão (拉麵, 温泉, 中華街, 福...). Se o texto explicar o ideograma, traduza só a explicação.
4. Nomes próprios não se traduzem: Vance, Gabriel Vance, Arthur Pendelton, Evelyn, Victor Rossi, Dra./Dr. Helena Souza (use o
   título equivalente: Dr. Helena Souza / Dra. / 헬레나 소자 박사), Tomás Bruno, IRIS, Marta Ferraz, Byte, Unidade 7 (traduza "Unidade": Unit 7),
   Capitã Rhea Okafor (traduza o posto), Kenji Mori, Lumi, Ilsa Varga, Jax, Sr. Wen, Madame Lin, Bao, Hana, Goro Takeda, Ana Duarte, Rui Sato,
   Sra. Mei, Dr. Huang, Tia Lan (Aunt Lan...), Kai, Fong. Marcas: Hotel Grand Alvorada, Café Neon, Pendelton BioCyber, NutriMat, HydroPop,
   NeoVolt, Kestrel-7, Halcyon, Aurora, Sector 4, Lunar 2.
5. Lugares com nome descritivo se traduzem: "Casa de Banho Lótus" (Lotus Bathhouse), "Sindicato Lótus" (Lotus Syndicate),
   "Rua Lótus" (Lotus Street), "Travessa do Dragão", "Templo do Dragão", "Av. Chuva Ácida", "Residencial Kowloon" (Kowloon Residences),
   "Delegacia do Distrito 4" (District 4 Precinct). Chinatown fica Chinatown (ko: 차이나타운).
6. Termos de jogo, sempre os mesmos:
   | pt | en | es | de | fr | it | ko |
   |---|---|---|---|---|---|---|
   | Pistas (o quadro de conexões) | Clues | Pistas | Hinweise | Indices | Indizi | 단서 |
   | Evidência(s) | Evidence | Evidencia(s) | Beweis(e) | Preuve(s) | Prova/e | 증거 |
   | Dedução | Deduction | Deducción | Schlussfolgerung | Déduction | Deduzione | 추리 |
   | Scanner | Scanner | Escáner | Scanner | Scanner | Scanner | 스캐너 |
   | Próxima sala | Next room | Siguiente sala | Nächster Raum | Pièce suivante | Stanza successiva | 다음 방 |
   | ATO I / II / III | ACT I | ACTO I | AKT I | ACTE I | ATTO I | 1막 / 2막 / 3막 |
   | Fome / Sede / Cansaço | Hunger / Thirst / Fatigue | Hambre / Sed / Cansancio | Hunger / Durst / Müdigkeit | Faim / Soif / Fatigue | Fame / Sete / Stanchezza | 배고픔 / 갈증 / 피로 |
   | física / digital / depoimento (tipo de evidência) | physical / digital / testimony | física / digital / testimonio | physisch / digital / Aussage | physique / numérique / témoignage | fisica / digitale / testimonianza | 물리 / 디지털 / 증언 |
   | Palácio... não existe mais: use "Pistas" | | | | | | |
7. Botões e verbos curtos (Examinar, Conversar, Sentar, Sair, Dirigir, Comprar...): uma ou duas palavras, imperativo/infinitivo natural da língua.
8. Tom: noir, seco, frases curtas; humor ácido. Diálogos informais ("chefe", "menino", "querido") viram o equivalente natural
   de cada língua. Em coreano, use registro coerente por personagem (Vance: 반말/해요체 conforme a situação; idosos e
   funcionários: 존댓말). Gírias brasileiras viram expressões naturais, não literais.
9. Comida e bebida: traduza (lámen = ramen / ラーメン não; en "ramen"), "pão de abacaxi" = pineapple bun, "bolo da lua" = mooncake.
10. Moeda "créditos" = credits. Medidas em metros e graus Celsius ficam.
