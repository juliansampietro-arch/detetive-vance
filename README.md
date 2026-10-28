# O Silêncio do Hotel Alvorada

RPG de investigação cyberpunk noir em pixel art isométrico, feito para celular Android, baseado no GDD `gemini-code-1792969076345.md`.

## Rodar no navegador (desenvolvimento)

```bash
npm run serve        # http://localhost:8080
```

Abrir `www/index.html` direto também funciona, mas o service worker (modo offline) só ativa via `http://`.
Para testar no celular sem instalar nada: rode `npm run serve` e abra `http://IP-DO-PC:8080` no Chrome do Android (mesma rede Wi-Fi). Pelo menu ⋮, use "Adicionar à tela inicial" para instalar como PWA.

## Gerar o APK Android

Pré-requisito único: [Android Studio](https://developer.android.com/studio) instalado (ele traz o SDK e o Java).

```bash
npm install          # só na primeira vez
npm run android      # copia www/ para o projeto nativo e abre no Android Studio
```

No Android Studio:
- **Testar no celular:** ative "Depuração USB" no aparelho, conecte o cabo e clique em ▶ Run.
- **Gerar APK:** menu *Build → Build Bundle(s) / APK(s) → Build APK(s)*. O arquivo sai em `android/app/build/outputs/apk/debug/`.
- **Publicar na Play Store:** *Build → Generate Signed Bundle / APK → Android App Bundle*.

Atalho pela linha de comando (depois que o Android Studio já estiver instalado e tiver aberto o projeto uma vez): `npm run apk` gera `android/app/build/outputs/apk/debug/app-debug.apk`.

Toda vez que mudar algo em `www/`, rode `npm run sync` (ou `npm run android`) para levar as mudanças ao app.

Configuração nativa já aplicada: paisagem fixa (`sensorLandscape`), tela cheia imersiva, tela sempre ligada, ícone e splash do jogo, botão voltar do Android (fecha janelas / abre a pausa) e pausa do áudio ao minimizar.

## Controles

As duas formas de andar funcionam juntas: direcional e tocar/clicar no destino.

| Celular | Desktop | Controle (gamepad) | Ação |
|---|---|---|---|
| Direcional virtual (esquerda) | Setas / WASD | Analógico / D-pad | andar |
| Tocar no chão / objeto / pessoa | Clicar | — | ir até lá (e interagir ao chegar) |
| Botão **A** (direita) | E / Enter / Espaço | A | examinar / conversar com o que está à frente; avançar textos |
| Pinça | Roda do mouse / `+` `-` | — | zoom |
| ◉ | `Q` | X | Modo Scanner |
| ▤ | `I` | Select | Evidências |
| ✦ | `M` | Y | Palácio da Memória |
| Voltar / ☰ | `Esc` | B / Start | fechar janela / pausa |

Nas janelas, setas / D-pad navegam pelos botões. Portas se atravessam andando sobre elas.

## Recursos

- **Introdução animada:** 5 cenas desenhadas em tempo real (cidade, hotel, cena do crime, suspeitos, Vance) com legendas e trilha própria. Toque avança, "Pular" encerra; também pode ser vista pela tela de título.
- **Visual em alta resolução:** cenário vetorial nítido na resolução real da tela, personagens com o dobro de detalhe, contorno e luz neon de borda, parede de vidro panorâmica com a cidade lá fora, vinheta.
- **Fontes:** Chakra Petch (títulos e interface) e Inter (textos), embutidas para funcionar offline.
- **Câmera e zoom:** a câmera segue Vance; o zoom muda a resolução interna, mantendo o pixel art nítido.
- **Som procedural (WebAudio, sem arquivos):** chuva com vento, zumbido neon, uma trilha sutil para cada cena (título, introdução, suíte, corredor, lobby jazz noir, túneis, finais) com transição suave, trovões sincronizados com os relâmpagos, gotejamento nos túneis, passos e efeitos de interface.
- **Save automático:** ao coletar evidências, fazer deduções, trocar de sala, terminar diálogos, a cada 20 s e ao minimizar o app. "Continuar caso" aparece na tela de título.
- **Diálogos:** 18 personagens (incluindo IRIS, a IA concierge que dá dicas conforme o progresso), escolhas de tom que mudam respostas e revelam detalhes, pensamentos de Vance e a opção de **apresentar qualquer evidência a qualquer personagem**.
- **Emboscada nos túneis:** ao achar a arma do crime, um atirador encapuzado ataca. Vance revida (botão A / E / tocar no atirador), mas os tiros sempre desviam. Proteja-se atrás de canos e caixotes. Não há game over.
- **Fome, sede e cansaço:** barras no HUD que sobem com o tempo. No limite, Vance fica lento e "pisca" de sono. Máquinas NutriMat (comida) e HydroPop (bebidas) no hotel, na rua, na delegacia e em Chinatown; café, lámen, chá, banho quente e a geladeira de casa também ajudam. **Dormir em casa** zera o cansaço e avança 6 horas.
- **Cidade e carro flutuante:** saia pela porta da frente do lobby até a rua, entre no carro e dirija pelo Sector 4 (direcional/setas), com trânsito e minimapa. **GPS:** escolha o destino (botão GPS, tecla `G` ou tocando no minimapa); a rota acende no asfalto e as instruções aparecem na tela. Perto do destino, A/E estaciona.
- **Lugares:** Hotel Grand Alvorada, Rua do Hotel, Delegacia do Distrito 4, Café Neon, Chinatown (Rua Lótus, barraca de lámen e cartomante), Casa de Banho Lótus e o apartamento de Vance (com o gato-robô Byte).

## Tempo de jogo (estimativa)

| Estilo | Tempo |
|---|---|
| Só o caso, direto | ~25–35 min |
| Primeira partida normal | ~50–80 min |
| Completo (todos os diálogos, a cidade e a pista opcional do Sindicato) | ~2h–2h30 |

## Estrutura

- `www/js/data.js`: evidências, deduções, mapas, atos e finais.
- `www/js/dialogues.js`: todos os diálogos, reações a evidências e as dicas da IRIS. O formato está documentado no topo do arquivo.
- `www/js/engine.js`: renderização isométrica, câmera, iluminação, sprites procedurais e pathfinding.
- `www/js/ui.js`: diálogos, evidências, Palácio da Memória, hack e acusação.
- `www/js/audio.js`: motor de áudio procedural.
- `www/js/intro.js`: introdução animada.
- `www/js/world.js`: salas da cidade, consumíveis, máquinas e destinos do GPS.
- `www/js/npcs_city.js`: diálogos dos NPCs da cidade.
- `www/js/city.js`: mapa da cidade, direção do carro, trânsito, GPS e minimapa.
- `www/js/main.js`: estado, controles (direcional, toque/clique, teclado, gamepad), save, interações e progressão.
- `android/`: projeto nativo Capacitor.
- `tests/playthrough.html` + `tests/run.mjs`: teste automatizado (caminho principal, emboscada, cidade/GPS/necessidades, todos os diálogos e escolhas, finais e save). Na raiz: `npx http-server . -p 8765` e, em outro terminal, `node tests/run.mjs`.

## Depuração

Atalhos via hash na URL (o save automático fica desligado nesse modo), por exemplo `index.html#room=lobby&act=3&scan&all&ui=palace`.
Parâmetros: `room`, `at=x,y`, `act`, `scan`, `all` (todas as evidências), `zoom`, `touch` (mostra controles de toque), `intro=cena,segundos`, `drive=destino` e `gps=destino` (cidade), `needs=fome,sede,cansaço` e `ui` (`palace|evidence|hack|accuse|menu|talk`, com `npc=` para escolher o personagem).
