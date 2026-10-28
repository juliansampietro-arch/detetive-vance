// ============================================================
// Loop principal, estado, controles (direcional/teclado/gamepad), save e interações
// ============================================================

let game = null;
const IS_NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const IS_TOUCH = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
const SPEED = 3.4;          // tiles por segundo
const RADIUS = 0.36;        // raio de colisão do jogador
const REACH = 1.25;         // alcance para interagir

// qual evidência cada objeto ainda esconde (para os indicadores)
const OBJ_EVIDENCE = {
  corpo: ['e_corpo'], taca: ['e_taca'], holomesa: ['e_cronometro', 'e_arquivo'], duto: ['e_duto'],
  painel: ['e_trava'], pegadas: ['e_pegadas'], nanobots: ['e_nanobots'], servico: ['e_porta_servico'],
  term_recepcao: ['e_recepcao_log'], term_bar: ['e_bar_log'], t03: ['e_terminal_t03'],
  papeis: ['e_papeis'], ferramenta: ['e_ferramenta'],
};

// objetos rentes ao chão: desenhados antes de tudo, sem ordenação de profundidade
const FLAT = ['puddle', 'exit', 'glass', 'rug', 'onsen', 'marker', 'koi', 'manhole', 'shopfront', 'block'];
const HIDDEN_KINDS = ['footprint', 'nanobots'];

function has(id) { return game.evidence.includes(id) || game.deductions.includes(id); }

// ---------- configurações ----------
function loadZoom() {
  try { const z = +localStorage.getItem('alvorada_zoom'); if (z) return z; } catch (e) {}
  return window.innerHeight < 500 ? 170 : 220;
}
function saveZoom() { try { localStorage.setItem('alvorada_zoom', String(Math.round(game.zoom))); } catch (e) {} }
function setZoom(z) {
  game.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
  resizeView(game.zoom);
}

// ---------- save automático ----------
let saveFlash = null;
const DEBUG = location.hash.length > 1;
function saveGame() {
  if (!game || game.modal === 'ending' || DEBUG) return;
  trackProgress();
  const p = game.player;
  const pc = game.driving ? game.car : playerCar();
  const data = {
    v: 1, grid: 2, caseId: game.caseId, act: game.act, roomId: game.roomId, x: p.x, y: p.y,
    evidence: game.evidence, deductions: game.deductions, seen: [...game.seen],
    gender: I18N.gender, flags: game.flags, clock: game.clock, date: Date.now(), needs: game.needs, outfit: game.outfit,
    car: pc ? { x: pc.cx !== undefined ? pc.cx : pc.x, y: pc.cy !== undefined ? pc.cy : pc.y, ang: pc.ang } : null,
    driving: game.driving, gps: game.gps ? game.gps.dest : null,
    bag: game.bag, shopCtx: game.shopCtx,
  };
  try { localStorage.setItem(caseSaveKey(game.caseId), JSON.stringify(data)); } catch (e) { return; }
  const el = $('save-ind');
  el.classList.add('show');
  clearTimeout(saveFlash);
  saveFlash = setTimeout(() => el.classList.remove('show'), 1400);
}
function readSave(caseId = 'alvorada') {
  try { const s = JSON.parse(localStorage.getItem(caseSaveKey(caseId))); return s && s.v === 1 ? s : null; } catch (e) { return null; }
}
function clearSave(caseId = game ? game.caseId : 'alvorada') { try { localStorage.removeItem(caseSaveKey(caseId)); } catch (e) {} }

// ---------- início ----------
function baseState() {
  return {
    caseId: 'alvorada', act: 1, roomId: null, roomData: null,
    player: { x: 4, y: 6, px: 4, py: 6, face: false, dir: [1, 1], moving: false, path: [], seat: null, inWater: null },
    target: null, pending: null, dest: null, inputLock: false, evidence: [], deductions: [], seen: new Set(), flags: {}, bag: {}, shopCtx: null,
    scanner: false, modal: null, t: 0, flash: 0, nextFlash: 7, clock: 0, talkingTo: null,
    zoom: loadZoom(), saveTimer: 0, stepAcc: 0, busy: null, outfit: null, gathering: null,
    needs: { fome: 20, sede: 25, cansaco: 30 }, needWarn: {}, blink: 0, car: null, driving: false, gps: null, place: '',
  };
}

function hideAllScreens() {
  ['msg', 'dialogue', 'evidence', 'palace', 'hack', 'accuse', 'ending', 'menu', 'card', 'gps'].forEach(hide);
}

// devolve o carro ao estacionamento do hotel (início de jogo)
function resetCar(pos) {
  const old = playerCar();
  if (old) ROOMS.city.objects.splice(ROOMS.city.objects.indexOf(old), 1);
  const home = CITY.map(15.5, 20.75);
  // carro salvo fora da rua (versões antigas deixavam parar na calçada): volta para a vaga na avenida
  if (pos && !carTiles(pos.x, pos.y, pos.ang).every(([x, y]) => CITY.carOK(x, y))) pos = null;
  ROOMS.city.objects.push({ kind: 'car', key: 'carro', name: T('Seu carro (Kestrel-7)'), cx: pos ? pos.x : home[0], cy: pos ? pos.y : home[1], ang: pos ? pos.ang : 0, solid: true, livery: 'vance', playerCar: true });
  invalidateGrid(ROOMS.city);
}

function newGame(skipIntro, caseId = 'alvorada') {
  endGathering();
  applyCase(caseId);
  game = baseState();
  game.caseId = caseId;
  hideAllScreens();
  setZoom(game.zoom);
  resetCar();
  if (caseId === 'eco') {
    enterRoom('ns_lab', [2, 1], true);
    updateHud();
    if (!skipIntro && !DEBUG) { game.modal = 'intro'; Intro.play(() => { game.modal = null; Sound.setRoom(game.roomId); ecoStart(); }, 0, 0, 'eco'); }
    else ecoStart();
    saveGame();
    return;
  }
  enterRoom('suite', [4, 6], true);
  updateHud();
  if (!skipIntro && !DEBUG) {
    game.modal = 'intro';
    Intro.play(() => { game.modal = null; Sound.setRoom(game.roomId); newGameCard(); });
  } else newGameCard();
  saveGame();
}

function newGameCard() {
  showCard(ACTS[1].title, ACTS[1].sub, () => {
    message('Detetive Vance', T('Meia-noite. Suíte 404. A chuva ácida martela o vidro e os drones zumbem lá fora. Arthur Pendelton, magnata da biotecnologia, está morto, caído no carpete da própria suíte, e a porta estava trancada por dentro com trava quântica.') + '\n\n' +
      T(IS_TOUCH ? 'Ande com o direcional ou tocando no chão. Toque num objeto ou pessoa para ir até ele, ou use o botão A quando estiver perto.' : 'Ande com as setas / WASD ou clicando no chão. Clique num objeto ou pessoa para ir até ele, ou use E / Enter quando estiver perto.') +
      ' ' + T('O SCANNER revela o invisível; PISTAS conecta as evidências.'));
  });
}

// salas antigas de saves anteriores viram pontos da cidade
const OLD_ROOMS = { street: CITY.map(15, 17), chinatown: CITY.map(40, 35) };

function continueGame(caseId = 'alvorada') {
  const s = readSave(caseId);
  if (!s) return newGame(false, caseId);
  endGathering();
  applyCase(caseId);
  game = baseState();
  game.caseId = caseId;
  hideAllScreens();
  setZoom(game.zoom);
  game.act = s.act;
  game.evidence = s.evidence.filter(e => EVIDENCE[e]);
  game.deductions = s.deductions.filter(d => DEDUCTIONS.some(x => x.id === d));
  game.seen = new Set(s.seen);
  game.flags = s.flags || {};
  game.clock = s.clock || 0;
  game.outfit = s.outfit || null;
  game.bag = s.bag || {};
  game.shopCtx = s.shopCtx || null;
  if (s.needs) game.needs = s.needs;
  resetCar(s.grid === 2 && s.car && s.car.x !== undefined && s.car.x < CITY.N ? s.car : null);
  let room = s.roomId, at = [s.x, s.y];
  if (OLD_ROOMS[room]) { at = OLD_ROOMS[room]; room = 'city'; }
  if (room === 'city' && s.grid !== 2) { at = CITY.map(15, 17); s.car = null; s.driving = false; }
  if (!ROOMS[room]) { room = caseId === 'eco' ? 'ns_hall' : 'suite'; at = caseId === 'eco' ? [2, 1] : [4, 6]; }
  if (room.startsWith('loja_') && !applyShopCtx()) { room = 'city'; at = CITY.map(15, 17); }
  enterRoom(room, at, true);
  if (blocked(game.player.x, game.player.y)) enterRoom(room, ROOMS[room].city ? ROOMS[room].cityObj.map(...(ROOMS[room].spawn || [15, 17])) : [2, 1], true);
  if (room === 'city' && s.driving) { const c = playerCar(); game.player.px = c.cx - 0.5; game.player.py = c.cy - 0.5; enterCar(c); }
  if (s.gps && DESTINATIONS[s.gps]) game.gps = { dest: s.gps, path: null, timer: 0, info: null };
  updateHud();
  toast(`<span class="k">${T('CASO RETOMADO')}</span> ${ACTS[game.act].title} · ${placeLabel()}`);
}

function enterRoom(id, at, silent) {
  const from = game.roomId;
  if (ROOMS[id] && ROOMS[id].city) activateCity(id);
  if (from === 'lobby' && id !== 'lobby') endGathering();
  game.roomId = id;
  game.roomData = ROOMS[id];
  const p = game.player;
  p.x = p.px = at[0]; p.y = p.py = at[1];
  p.path = []; p.seat = null; p.inWater = null; game.pending = null; game.dest = null;
  game.target = null; game.busy = null;
  if (!silent) game.inputLock = true;
  roomAgents(game.roomData);
  updateCamera(game.roomData, p.px + 0.5, p.py + 0.5, 0, true);
  document.body.classList.toggle('in-city', !!ROOMS[id].city);
  game.place = '';
  Sound.setRoom(ROOMS[id].city ? (CITY.inCT(p.x, p.y) ? 'chinatown' : 'city') : id);
  if (!silent) {
    Sound.play((from === 'lobby' && id === 'corridor') || (from === 'corridor' && id === 'lobby') ? 'elevator' : 'door');
    toast(`<b>${ROOMS[id].city ? CITY.placeName(p.x, p.y) : game.roomData.name}</b>`, 'room');
    saveGame();
  }
  updateHud();
}

// ---------- ocupação e colisão ----------
// grade de tiles sólidos de cada sala (objetos e prédios), refeita quando algo muda de lugar
function roomGrid(room) {
  if (room._grid) return room._grid;
  const W = room.w, g = new Uint8Array(room.w * room.h);
  const mark = (x, y) => { if (x >= 0 && y >= 0 && x < room.w && y < room.h) g[y * W + x] = 1; };
  for (const o of room.objects) {
    if (!o.solid) continue;
    if (o.cx !== undefined) { for (const [x, y] of carTiles(o.cx, o.cy, o.ang || 0)) mark(x, y); continue; }
    for (let y = o.y; y < o.y + (o.d || 1); y++) for (let x = o.x; x < o.x + (o.w || 1); x++) mark(x, y);
  }
  if (room.city) for (let y = 0; y < room.h; y++) for (let x = 0; x < room.w; x++) if (CITY.tile(x, y) === CITY.T.BLD) g[y * W + x] = 1;
  room._exits = new Set(room.objects.filter(o => o.kind === 'exit').map(o => o.x + ',' + o.y));
  return (room._grid = g);
}
function invalidateGrid(room) { room._grid = null; }
function solidAt(room, x, y) {
  if (x < 0 || y < 0 || x >= room.w || y >= room.h) return true;
  return !!roomGrid(room)[y * room.w + x];
}

// pessoas da sala: personagens com diálogo (npcs) e figurantes (walkers)
function npcsHere() { return game.roomData.npcs || []; }
function agentsHere() { return (game.roomData.npcs || []).concat(game.roomData._walkers || []); }
const occupies = (a, x, y) => (a.x === x && a.y === y) || (Math.round(a.fx) === x && Math.round(a.fy) === y);

function blocked(x, y, self) {
  const r = game.roomData;
  if (solidAt(r, x, y)) return true;
  for (const a of agentsHere()) if (a !== self && occupies(a, x, y)) return true;
  return false;
}

// o círculo do jogador (centro cx, cy) cabe nesta posição?
// (pessoas não bloqueiam o detetive: ele passa por elas; só móveis, paredes e prédios param)
function free(cx, cy) {
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    if (solidAt(game.roomData, Math.floor(cx + dx * RADIUS), Math.floor(cy + dy * RADIUS))) return false;
  }
  return true;
}

// água (onsen) sob um tile
function waterAt(room, x, y) {
  if (!room._water) room._water = room.objects.filter(o => o.water);   // só as piscinas (a cidade tem centenas de objetos)
  for (const o of room._water) if (o.water && x >= o.x && x < o.x + (o.w || 1) && y >= o.y && y < o.y + (o.d || 1)) return o;
  return null;
}

// ============================================================
// Pessoas que andam pelo cenário
// ============================================================
function initAgent(a, room) {
  if (a.fx !== undefined) return a;
  // figurante sorteado em cima de algo sólido (lago, banca...): vai para o tile livre mais próximo
  if (a.tiles === 'crowd' && !agentTileOK(a, room, a.x, a.y)) {
    for (let r = 1, done = false; r < 8 && !done; r++) for (let dy = -r; dy <= r && !done; dy++) for (let dx = -r; dx <= r && !done; dx++) {
      if (agentTileOK(a, room, a.x + dx, a.y + dy)) { a.x += dx; a.y += dy; done = true; }
    }
  }
  a.fx = a.x; a.fy = a.y; a.path = []; a.wait = 0.5 + Math.random() * 3; a.moving = false; a.face = Math.random() < 0.5; a.hold = 0;
  if (a.wander && a.wander.area) a.area = a.wander.area;
  if (!a.id && !a.area && !a.range && !a.seat) a.range = 6;   // figurante sem área: passeia pela sala
  if (a.seat && typeof a.seat === 'string') {
    const o = room.objects.find(o2 => o2.key === a.seat && a.x >= o2.x && a.x < o2.x + (o2.w || 1) && a.y >= o2.y && a.y < o2.y + (o2.d || 1));
    if (o) a.seatObj = o;
  }
  return a;
}

function roomAgents(room) {
  if (!room._walkers) room._walkers = (room.walkers || []).map(w => ({ ...w }));
  for (const a of room._walkers) initAgent(a, room);
  for (const n of room.npcs || []) initAgent(n, room);
}

// figurante ou personagem pode pisar neste tile?
function agentTileOK(a, room, x, y) {
  if (solidAt(room, x, y)) return false;
  roomGrid(room);
  if (room._exits.has(x + ',' + y)) return false;
  if (a.area && (x < a.area[0] || y < a.area[1] || x > a.area[2] || y > a.area[3])) return false;
  if (a.tiles === 'crowd' && !CITY.crowdOK(x, y)) return false;
  if (!a.area && waterAt(room, x, y)) return false;
  return true;
}

function pickGoal(a, room) {
  if (a.spots) { a.spotI = ((a.spotI === undefined ? -1 : a.spotI) + 1) % a.spots.length; return a.spots[a.spotI]; }
  for (let k = 0; k < 14; k++) {
    let x, y;
    if (a.area) { x = a.area[0] + Math.floor(Math.random() * (a.area[2] - a.area[0] + 1)); y = a.area[1] + Math.floor(Math.random() * (a.area[3] - a.area[1] + 1)); }
    else { const r = a.range || 5; x = a.x + Math.round((Math.random() * 2 - 1) * r); y = a.y + Math.round((Math.random() * 2 - 1) * r); }
    if ((x !== a.x || y !== a.y) && agentTileOK(a, room, x, y)) return [x, y];
  }
  return null;
}

// o jogador está neste tile (ou vai pisar nele já)?
function playerNear(x, y) {
  const p = game.player, cx = p.px + 0.5, cy = p.py + 0.5;
  if (Math.abs(x + 0.5 - cx) < 0.5 + RADIUS && Math.abs(y + 0.5 - cy) < 0.5 + RADIUS) return true;
  return p.path.slice(0, 2).some(([px2, py2]) => px2 === x && py2 === y);
}

function updateAgents(dt) {
  const room = game.roomData, p = game.player;
  const pcx = p.px + 0.5, pcy = p.py + 0.5;
  for (const a of agentsHere()) {
    if (a.fx === undefined) initAgent(a, room);
    if (a.moving) {
      const dx = a.x - a.fx, dy = a.y - a.fy, d = Math.hypot(dx, dy), sp = (a.speed || 1.1) * dt;
      if (d <= sp) { a.fx = a.x; a.fy = a.y; a.moving = false; } else { a.fx += dx / d * sp; a.fy += dy / d * sp; }
      continue;
    }
    const mobile = (a.area || a.spots || a.range) && !a.seatObj && !a.seated && !game.gathering;
    if (!mobile) continue;
    const isNpc = !!a.id;
    const near = !game.driving && Math.hypot(a.fx + 0.5 - pcx, a.fy + 0.5 - pcy) < (isNpc ? 1.8 : 1.1);
    const talking = game.modal && game.talkingTo === (isNpc ? a.id : a);
    if (a.hold > 0) a.hold -= dt;
    if (talking || a.hold > 0 || (near && isNpc)) continue;
    a.wait -= dt;
    if (a.wait > 0) continue;
    if (!a.path.length) {
      const goal = pickGoal(a, room);
      if (!goal) { a.wait = 1 + Math.random() * 2; continue; }
      a.path = findPath(room, (x, y) => !agentTileOK(a, room, x, y), a.x, a.y, (x, y) => x === goal[0] && y === goal[1]) || [];
      a.goalPose = goal[2] || null;
      if (!a.path.length) { a.wait = 1 + Math.random() * 2; continue; }
    }
    const [nx, ny] = a.path[0];
    if (a.tiles === 'crowd' && room.city && !CITY.pedOK(a.x, a.y, nx, ny)) { a.wait = 0.3; continue; }
    if (blocked(nx, ny, a) || playerNear(nx, ny)) { a.path = []; a.wait = 0.4 + Math.random() * 0.8; continue; }
    a.path.shift();
    if (nx - ny !== a.x - a.y) a.face = (nx - ny) < (a.x - a.y);
    a.x = nx; a.y = ny; a.moving = true; a.pose = null;
    if (!a.path.length) { a.wait = a.spots ? 4 + Math.random() * 4 : isNpc ? 2 + Math.random() * 4 : 0.3 + Math.random() * 2.5; a.pose = a.goalPose; }
  }
}

// conversa rápida com figurante
function extraLines(a) { return Array.isArray(a.lines) ? a.lines : EXTRA_LINES[a.lines] || ['...']; }
function talkWalker(a) {
  a.hold = 5; a.path = [];
  const p = game.player;
  a.face = (p.px - p.py) < (a.fx - a.fy);
  game.talkingTo = a;
  if (a.lines === 'cops' || a.lines === 'hotelcops') unlockGps('delegacia');
  const ls = extraLines(a);
  a.said = ((a.said === undefined ? Math.floor(Math.random() * ls.length) : a.said) + 1) % ls.length;
  let h = 0; for (const ch of a.look + a.name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  message(a.name, ls[a.said], null, 100 + h % 160);
}

// ---------- evidências e progresso ----------
function give(id) {
  if (has(id)) return false;
  game.evidence.push(id);
  Sound.play('evidence');
  toast(`<span class="k">◆ ${T('NOVA EVIDÊNCIA')}</span> ${EVIDENCE[id].name}`, 'ev');
  $('btn-palace').classList.add('pulse');
  updateHud();
  saveGame();
  return true;
}

function addDeduction(id) {
  if (has(id)) return;
  game.deductions.push(id);
  updateHud();
  saveGame();
  setTimeout(checkProgress, 400);
}

function checkProgress() {
  if (game.caseId === 'eco') return ecoCheckProgress();
  if (game.act === 1 && has('d_entrada')) {
    game.act = 2;
    updateHud(); saveGame();
    closeModal();
    showCard(ACTS[2].title, ACTS[2].sub, () => message('Detetive Vance',
      'O assassino veio pelos túneis de serviço e subiu pelo duto. Isso significa que alguém conhecia as entranhas deste hotel.\n\nO elevador para o lobby está liberado. Hora de conversar com os suspeitos.'));
  } else if (game.act === 2 && has('d_trava')) {
    game.act = 3;
    updateHud(); saveGame();
    closeModal();
    showCard(ACTS[3].title, ACTS[3].sub, () => message('Detetive Vance',
      'A credencial ADM-02 foi usada no terminal T-03, dentro dos túneis de manutenção. Com isso, Vance tem justificativa para forçar a porta de serviço do 4º andar.\n\nEncontre as provas finais. Quando estiver pronto, faça a acusação em Pistas: todos serão reunidos no lobby do hotel.'));
  }
}

function objective() {
  if (game.caseId === 'eco') return ecoObjective();
  if (game.act === 1) {
    if (has('e_duto') && has('e_porta_servico')) return 'Conecte as evidências em Pistas.';
    if (has('e_duto')) return 'O duto leva para baixo. Investigue o corredor do 4º andar.';
    if (game.evidence.length >= 3) return 'Como o assassino entrou? Use o scanner nos lugares suspeitos.';
    return 'Examine a cena do crime na suíte 404.';
  }
  if (game.act === 2 && !(game.flags.porta_emperrada && !game.flags.credencial)) {
    if (has('e_trava') && has('e_recepcao_log')) return 'Conecte a trava ao registro da chave mestra em Pistas.';
    if (!has('e_trava')) return 'Quem trancou a suíte? Verifique o painel da trava na 404.';
    return 'Interrogue os suspeitos no lobby e invada os terminais.';
  }
  if (!game.flags.credencial) {
    if (!game.flags.porta_emperrada) return 'Abra a porta de serviço do 4º andar e desça aos túneis.';
    if (!game.flags.tel_campton) return 'A porta de serviço emperrou. Pergunte ao Bao, em Chinatown, quem abre qualquer porta.';
    if (!game.flags.ligou_campton) return 'Ligue para C4mpt0n de uma cabine de holochamada.';
    if (!game.flags.missao_peca) return 'Encontre C4mpt0n no apartamento dele (GPS).';
    if (!game.flags.peca_ok) return 'Vasculhe o ferro-velho do Zeca atrás do núcleo K-9.';
    return 'Leve o núcleo K-9 para C4mpt0n.';
  }
  if (!has('d_arma')) return 'Vasculhe os túneis de manutenção em busca da arma.';
  return 'Revise as deduções e faça a acusação em Pistas.';
}

function placeLabel() { return inCity() ? CITY.placeName(game.player.x, game.player.y) : game.roomData ? game.roomData.name : ''; }

function updateHud() {
  if (!game) return;
  game.place = placeLabel();
  $('act-label').textContent = `${ACTS[game.act].title} · ${game.place}`;
  $('objective').textContent = '▸ ' + T(objective());
  $('btn-scan').classList.toggle('on', game.scanner);
  updateGpsLine();
}

function updateGpsLine() {
  const el = $('gps-line'), info = game.gps && inCity() && game.gps.info;
  el.classList.toggle('hidden', !info);
  if (info) el.innerHTML = `<span class="gps-arrow">${info.arrow}</span> ${info.text}`;
}

// ============================================================
// Sentar, deitar e ações demoradas (banho, cozinhar, trocar de roupa)
// ============================================================
const SEAT_Z = { sofa: 5, bench: 4, stool: 8, chair: 7.2, sauna_bench: 0, wash_stool: 3, armchair: 5, zabuton: 1.1 };

function seatPoint(o, nx, ny) {
  const w = o.w || 1, d = o.d || 1;
  let x = Math.max(o.x, Math.min(o.x + w - 1, nx)) + 0.5, y = Math.max(o.y, Math.min(o.y + d - 1, ny)) + 0.5;
  if (o.kind === 'sofa') x = o.x + 0.62;
  const z = o.kind === 'sauna_bench' ? o.h || 6 : SEAT_Z[o.kind] !== undefined ? SEAT_Z[o.kind] : 5;
  return { x, y, z };
}

function sit(o) {
  const p = game.player;
  if (p.seat && p.seat.obj === o) return;
  // lugar livre mais perto de Vance no mesmo assento (bancos compridos têm vários lugares)
  const taken = pt => agentsHere().some(a => a.seatObj === o && Math.abs(a.x + 0.5 - pt.x) < 0.6 && Math.abs(a.y + 0.5 - pt.y) < 0.6);
  const spots = [];
  for (let y = o.y; y < o.y + (o.d || 1); y++) for (let x = o.x; x < o.x + (o.w || 1); x++) spots.push(seatPoint(o, x, y));
  spots.sort((a, b) => Math.hypot(a.x - p.x - 0.5, a.y - p.y - 0.5) - Math.hypot(b.x - p.x - 0.5, b.y - p.y - 0.5));
  const pt = spots.find(s => !taken(s));
  if (!pt) { toast('Esse lugar está ocupado.'); return false; }
  p.seat = { obj: o, pose: 'sit', pt, back: [p.x, p.y] };
  p.path = []; game.pending = null; game.dest = null; game.inputLock = true;
  Sound.play('sit');
  return true;
}

function lieDown(o) {
  const p = game.player;
  p.seat = { obj: o, pose: 'lie', back: [p.x, p.y] };
  p.path = []; game.inputLock = true;
  Sound.play('sit');
}

function standUp() {
  const p = game.player, s = p.seat;
  if (!s) return;
  p.seat = null;
  let [bx, by] = s.back;
  if (blocked(bx, by)) {
    const o = s.obj;
    outer: for (let r = 1; r <= 2; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const x = o.x + dx, y = o.y + dy;
      if (!blocked(x, y)) { bx = x; by = y; break outer; }
    }
  }
  p.x = p.px = bx; p.y = p.py = by;
  game.inputLock = true;
}

function startBusy(kind, dur, done, obj) {
  game.busy = { kind, t: 0, dur, done, obj };
  game.target = null;
}

function updateBusy(dt) {
  const b = game.busy;
  if (!b || game.modal) return;
  b.t += dt;
  if (b.kind === 'cook' && Math.floor(b.t * 1.2) !== Math.floor((b.t - dt) * 1.2)) Sound.play('sizzle');
  if (b.t >= b.dur) { game.busy = null; if (b.done) b.done(); }
}

function changeClothes() {
  const towel = game.outfit !== 'towel';
  message('Armários', towel
    ? 'Vance pendura o sobretudo, a camisa e o coldre no armário e fecha o cadeado. Na casa de banho, do vestiário para dentro, só se entra de toalha.'
    : 'As roupas continuam lá, dobradas, cheirando a chuva ácida.', [
    { label: towel ? 'Trocar a roupa pela toalha' : 'Vestir as roupas', fn: () => {
      closeModal();
      startBusy('change', 1.2, () => {
        game.outfit = towel ? 'towel' : null;
        Sound.play('click');
        toast(towel ? 'Vance agora veste só uma toalha na cintura.' : 'Vance está vestido de novo.');
        saveGame();
        // segunda emboscada: vestido de novo, prestes a sair da casa de banho
        if (!towel && game.roomId === 'locker' && !game.flags.tiroteio2) startCombat();
      });
    } },
    { label: 'Agora não', fn: closeModal },
  ]);
}

function takeShower(o) {
  const p = game.player;
  p.seat = { obj: o, pose: 'shower', back: [p.x, p.y] };
  o.on = true;
  o.occupant = () => {
    const [sx, sy] = iso(o.x + 0.5, o.y + 0.5, 0.5);
    const tl = I18N.gender === 'f' ? 'vance_f_towel' : 'vance_towel';
    drawChar(ctx, sx, sy, LOOKS[tl], game.t, false, false, { look: tl, noShadow: true });
  };
  Sound.play('shower');
  startBusy('shower', 4, () => {
    o.on = false; o.occupant = null;
    standUp();
    relieve({ cansaco: 25, sede: -5 }, true);
    message('Banho quente', 'Água quente nos ombros por quatro minutos. O cheiro de chuva ácida vai embora pelo ralo, junto com um pouco do caso.\n\nCansaço −25');
  });
}

function openStove(o) {
  message('Fogão', T('Fome {0}%. Na geladeira tem ovos, cogumelos, macarrão e um frango sintético. O que vai cozinhar?', Math.round(game.needs.fome)),
    RECIPES.map(r => ({ label: CONSUMABLES[r.id].name, fn: () => {
      closeModal();
      o.on = true; o.food = r.food;
      Sound.play('sizzle');
      startBusy('cook', r.secs, () => { o.on = false; consume(r.id); }, o);
    } })).concat([{ label: 'Nada', fn: closeModal }]));
}

// ---------- interação com objetos ----------
const OBJ_TEXT = {
  cama: ['Cama', 'A cama está intocada. Arthur nem chegou a se deitar esta noite.'],
  abajur: ['Luminária', 'Uma luminária art déco com filamento de neon. Peça de colecionador dos anos 2070.'],
  planta: ['Planta holográfica', 'Uma samambaia holográfica. Nunca precisa de água. Nunca morre.\n\nDiferente dos hóspedes.'],
  carrinho: ['Carrinho de limpeza', 'O carrinho de Tomás. Toalhas, solvente, peças de reposição para implantes baratos... e uma garrafa de bebida escondida sob os panos.'],
  mesa_casa: ['Escrivaninha', 'Contas atrasadas, uma foto do pai de farda e três canecas de café pela metade.'],
  tv_casa: ['Holo-TV', 'O noticiário mostra a fachada do Hotel Alvorada cercada de viaturas. "A polícia ainda não comenta a morte de Arthur Pendelton." Vance desliga antes de ouvir o próprio nome.'],
  estante: ['Estante', 'Livros de papel, raridade. Romances policiais antigos, um manual de balística e um álbum de fotos que ele não abre há anos.'],
  bancada: ['Bancada', 'Pedra sintética, uma tábua de cortar e uma faca boa. A única coisa cara da cozinha.'],
  mesa_cozinha: ['Mesa da cozinha', 'Uma mesa para dois. A segunda cadeira é de Byte, que nunca come nada.'],
  lixeira_casa: ['Lixeira', 'Embalagens de comida pronta. Muitas. Vance prefere não contar.'],
  vaso: ['Vaso sanitário', 'Um vaso inteligente que insiste em analisar a saúde de Vance. "Hidratação baixa", diz a tela. Vance ignora.'],
  mesa_cafe: ['Mesa', 'Uma xícara esquecida e um jornal digital com a manchete: "TEMPESTADE DE DADOS ISOLA ZONA ALTA".'],
  mesa_kenji: ['Bancada forense', 'Espectrômetros, scanners de DNA e um ramen frio. Kenji pode analisar qualquer evidência que você mostrar a ele.'],
  recepcao_d4: ['Recepção', 'O balcão da recepção. A Unidade 7 organiza as ocorrências da noite em pilhas holográficas.'],
  arquivo: ['Arquivo de aço', 'Casos em papel, da época em que a rede caía toda semana. Alguns ainda caem.'],
  celas: ['Celas de detenção', 'Atrás das grades, um bêbado dorme cantando baixinho uma música de 2050. As outras celas estão vazias esta noite.'],
  mapa_holo: ['Mapa holográfico', 'O mapa holográfico do Distrito 4. Pontos vermelhos piscam: ocorrências da noite. O maior deles marca o Hotel Alvorada.'],
  mesa_policial: ['Mesa de policial', 'Café frio, relatórios atrasados e um cacto de plástico.'],
  mesa_policial2: ['Mesa de policial', 'Uma foto de família, um sanduíche mordido e um alerta piscando: "RELATÓRIO VENCIDO".'],
  mesa_policial3: ['Mesa de policial', 'Alguém deixou o terminal aberto num jogo de cartas. Vance fecha sem dizer nada.'],
  mesa_okafor: ['Mesa da capitã', 'A mesa da capitã Okafor, impecável. Um único porta-retratos virado para baixo.'],
  armario_provas: ['Armário de provas', 'Lacrado. Só o Kenji e a capitã têm a combinação.'],
  mesa_interrogatorio: ['Sala de interrogatório', 'Uma mesa de metal parafusada no chão e uma luz forte demais. Atrás do vidro espelhado, alguém sempre assiste.'],
  refletor: ['Refletor da perícia', 'Ilumina o quarto inteiro com luz fria e sem sombra. Nada se esconde aqui. Em tese.'],
  kit_pericia: ['Maleta da perícia', 'Pincéis, reagentes, sacos de evidência e um scanner de partículas. A Ana organiza tudo por cor.'],
  sapateira: ['Sapateira', 'Dezenas de pares de sapatos em cubículos de madeira. Na casa de banho, só se entra descalço.'],
  gato_sorte: ['Gato da sorte', 'Um maneki-neko dourado acenando sem parar.'],
  pedra: ['Pedra vulcânica', 'Uma pedra vulcânica de verdade, trazida de algum lugar onde ainda existem vulcões.'],
  toro: ['Tōrō', 'Uma lanterna de pedra japonesa com uma chama de LED tremulando dentro.'],
  bambu: ['Bambu', 'Bambu de verdade, crescendo num vaso de pedra.'],
  balde: ['Baldes de madeira', 'Para jogar água no corpo antes de entrar no banho. Regra da casa.'],
  onsen: ['Onsen (温泉)', 'Água termal a 42 graus, vapor subindo devagar. Para entrar, é só caminhar até a água.'],
  mizuburo: ['Banho frio (水風呂)', 'Água a 16 graus. Depois da sauna, dizem que é o paraíso. Antes, é só gelado.'],
  pia_vestiario: ['Pia', 'Secador, pentes e loção. Tudo cheira a cânfora.'],
  sauna_fogao: ['Fogão de pedras', 'Pedras quentes sobre a resistência. O termômetro marca 92 graus.'],
  balcao: ['Recepção', 'Um sino holográfico pisca: "TOQUE PARA ATENDIMENTO". O terminal da recepção fica na ponta do balcão.'],
  balcao_bar: ['Balcão do bar', 'Copos meio vazios, gelo derretendo. O barman-robô está desligado para manutenção.'],
  duto2: ['Duto vertical', 'O duto sobe por todos os andares. Na escada interna, arranhões metálicos recentes e um degrau entortado, como se alguém muito pesado tivesse subido por ele.'],
};

function interact(o) {
  const S = game.scanner;
  if (o.key === 'aerotrem' || o.key === 'estacao_aerotrem' || o.key === 'porta_plataforma') return openTram();
  if (game.caseId === 'eco') { const r = ecoInteract(o); if (r !== false) return r; }
  switch (o.key) {
    case 'corpo':
      if (give('e_corpo')) return message('Arthur Pendelton', 'Arthur Pendelton, 58 anos, caído de costas no carpete. O implante neural na nuca está fundido, mas há uma fratura no crânio logo abaixo.\n\nSobrecarga elétrica não quebra osso. Alguém bateu nele. Com força.');
      return message('Arthur Pendelton', S ? 'O scanner mostra o corpo esfriando. Ao redor, uma nuvem fraca de nanorrobôs ainda transmite dados.' : 'O olhar vazio de Arthur continua fixo no teto. O sangue já escureceu no carpete.');
    case 'taca':
      if (give('e_taca')) return message('Taça caída', 'Uma taça de cristal caída no carpete, com resíduo esverdeado.\n\nO analisador químico do implante identifica: NX-7. Paralisante neural. Não mata, apenas imobiliza.');
      return message('Taça caída', 'Resíduo de NX-7. Quem preparou essa bebida queria Arthur imóvel, não morto.');
    case 'holomesa':
      if (give('e_cronometro')) return message('Mesa holográfica', 'O cronômetro de pulso de Arthur está sobre a mesa, travado em 23:15. O firmware registra uma alteração manual de horário.\n\nAo lado, um arquivo de dados criptografado, parcialmente queimado.', [
        { label: 'Invadir o arquivo', fn: () => { closeModal(); hackFile(); } },
        { label: 'Depois', fn: closeModal },
      ]);
      if (!has('e_arquivo')) return message('Mesa holográfica', 'O arquivo criptografado ainda pisca na mesa.', [
        { label: 'Invadir o arquivo', fn: () => { closeModal(); hackFile(); } },
        { label: 'Depois', fn: closeModal },
      ]);
      return message('Mesa holográfica', 'Patentes de IA, um testamento alterado e um cronômetro adulterado. Esta mesa conta mais do que Arthur jamais contou.');
    case 'duto':
      if (S && give('e_duto')) return message('Duto de ventilação', 'O scanner revela: os parafusos da grade foram soltos POR DENTRO. Há arranhões de metal pesado e um rastro térmico que desce pelo duto.\n\nO quarto não estava fechado. Alguém veio de baixo.');
      if (has('e_duto')) return message('Duto de ventilação', 'O duto desce em direção aos andares de serviço do hotel.');
      return message('Grade de ventilação', 'Uma grade de ventilação de serviço. A olho nu, parece normal...\n\n(Ative o SCANNER e examine de novo.)');
    case 'painel':
      if (give('e_trava')) return message('Painel da trava quântica', 'Log do sistema:\n\n23:20 — LOCK /QUANTUM — origem: REMOTA — credencial: ADM-02.\n\nA suíte não foi trancada por dentro. Foi trancada de longe, com uma credencial administrativa.');
      return message('Painel da trava quântica', 'Credencial ADM-02, acionamento remoto às 23:20.');
    case 'pegadas':
      if (give('e_pegadas')) return message('Pegadas térmicas', 'Um rastro térmico vai da grade de ventilação até o corpo de Arthur.\n\nO padrão de pressão é estranho: o lado esquerdo afunda muito mais. Quem andou aqui carrega uns 40 kg extras de um lado só.');
      return message('Pegadas térmicas', 'Do duto até o corpo. Passos pesados, desbalanceados.');
    case 'nanobots':
      if (give('e_nanobots')) return message('Nanorrobôs biomonitores', 'Os nanorrobôs de saúde de Arthur ainda flutuam ao redor do corpo, transmitindo o último registro:\n\nPARADA CARDÍACA — 22:57.\n\nO cronômetro diz 23:15. Um dos dois está mentindo, e nanorrobôs não mentem.');
      return message('Nanorrobôs', 'Último registro: 22:57.');
    case 'servico':
      if (game.flags.credencial) return enterRoom('tunnels', [2, 1]);
      if (game.act >= 3) {
        game.flags.porta_emperrada = true; updateHud(); saveGame();
        return message('Porta de serviço', 'Vance tenta forçar a porta, mas o painel pisca em vermelho: ERRO DE FIRMWARE — TRAVA EMPERRADA. Nem a credencial da polícia passa.\n\nIsso não é defeito comum. Alguém travou essa porta de propósito.\n\nPreciso de alguém que abra qualquer porta. O Bao, aquele garoto de Chinatown, conhece todo mundo.');
      }
      if (S && give('e_porta_servico')) return message('Porta de serviço', 'Trancada. Mas o scanner revela resíduo térmico recente na maçaneta e arranhões novos no batente.\n\nUma placa antiga: "TÚNEIS DE MANUTENÇÃO — ACESSO A DUTOS DOS ANDARES 1-6".');
      if (has('e_porta_servico')) return message('Porta de serviço', 'Trancada. Acesso restrito à gerência. Você precisa de um motivo concreto para forçá-la.');
      return message('Porta de serviço', 'Uma porta pesada, da era analógica. Placa: "ACESSO RESTRITO — GERÊNCIA".\n\n(Talvez o SCANNER revele algo.)');
    case 'orelhao':
      if (game.flags.tel_campton && !game.flags.ligou_campton) {
        game.flags.ligou_campton = true;
        unlockGps('hacker');
        saveGame();
        return phoneCall('Cabine holográfica', 'campton', [
          ['', 'Vance digita 4-4-7-C-4-M. Três toques de estática, e uma voz distorcida atende.'],
          ['N', 'Quem passou esse número?'],
          ['V', 'O Bao.'],
          ['N', 'Hm. O moleque tem bom gosto pra gente. *Teclas ao fundo.* Você é tira. Tudo bem, tira também paga.'],
          ['N', 'Edifício Átrio, apartamento 1207, no alto da Rua Aurora. Venha sozinho e sem distintivo à vista.'],
          ['', '*Clique.* A linha fica muda.'],
        ]);
      }
      if (game.flags.ligou_campton) return message('Cabine holográfica', 'O endereço de C4mpt0n já está no GPS: Edifício Átrio, apartamento 1207.');
      break;
    case 'sucata': return searchScrap(o);
    case 'carro': return enterCar(o);
    case 'maq_comida': case 'maq_bebida': case 'balcao_cafe': case 'barraca_lamen': case 'geladeira':
      return openVendor(o.key);
    case 'cafeteira_casa': return openVendor('cafeteira_casa');
    case 'cafeteira_d4': return openVendor('cafe_d4');
    case 'balcao_banho': return openVendor('banho_balcao');
    case 'cama_casa': return message('Sua cama', T('Cansaço: {0}%. A chuva bate na janela. A cama parece maior do que deveria.', Math.round(game.needs.cansaco)), [
      { label: 'Dormir (6 horas)', fn: () => { closeModal(); lieDown(o); startBusy('sleepIn', 1.6, sleep); } },
      { label: 'Ainda não', fn: closeModal },
    ]);
    case 'sofa_casa': sit(o); relieve({ cansaco: 8 }); return message('Sofá', 'Vance afunda no sofá por alguns minutos. Byte sobe no colo dele. Não é dormir, mas ajuda.');
    case 'sofa': sit(o); return message('Sofá', 'Couro sintético, ainda morno. Alguém estava sentado aqui há pouco.');
    case 'sofa_d4': sit(o); relieve({ cansaco: 5 }); return message('Sofá da copa', 'Um sofá afundado com a forma exata de todos os policiais do turno da noite.');
    case 'banco': sit(o); relieve({ cansaco: 4 }); return;
    case 'cadeira_vance': sit(o); return message('Sua cadeira', 'A cadeira range do jeito de sempre. Daqui, o quadro do caso parece encarar Vance de volta.');
    case 'banquinho':
      sit(o); relieve({ cansaco: 6 });
      return message('Posto de lavagem', 'Vance se senta no banquinho, enche o balde e joga água quente no corpo. Regra da casa: lavar-se antes de entrar no onsen.');
    case 'banco_sauna':
      sit(o); relieve({ cansaco: 12, sede: -8 });
      return message('Sauna', 'O calor seco envolve Vance. O suor escorre e leva junto um pouco do cansaço. E um pouco da água do corpo também.');
    case 'balde_sauna': {
      const st = game.roomData.objects.find(x => x.kind === 'sauna_stove');
      if (st) st.steam = 3;
      Sound.play('steam'); relieve({ cansaco: 5 });
      return message('Löyly', 'Vance joga uma concha de água nas pedras. Uma onda de vapor quente sobe até o teto e todo mundo suspira junto.');
    }
    case 'armario': return changeClothes();
    case 'chuveiro': return message('Chuveiro', T('Cansaço: {0}%. Água quente de verdade, coisa rara no Sector 4.', Math.round(game.needs.cansaco)), [
      { label: 'Tomar banho', fn: () => { closeModal(); takeShower(o); } },
      { label: 'Agora não', fn: closeModal },
    ]);
    case 'fogao': return openStove(o);
    case 'pia': relieve({ sede: 10 }); return message('Pia', 'Água da torneira, com gosto de cloro. Mas mata a sede.');
    case 'pia_banheiro': relieve({ cansaco: 4 }); return message('Pia e espelho', 'Água fria no rosto. No espelho, um homem cansado olha de volta. As olheiras já têm olheiras.');
    case 'templo': relieve({ cansaco: 6 }); return message('Templo do Dragão', 'Vance acende uma vareta de incenso e fica um minuto em silêncio. Não pede nada. Só respira.\n\nA fumaça sobe reta, apesar do vento.');
    case 'mesa_vance': return message('Sua mesa', 'O quadro do caso Pendelton ocupa a parede inteira: fotos, linhas vermelhas, horários.\n\nAqui, longe do hotel, as peças parecem se encaixar melhor.', [
      { label: 'Abrir Pistas', fn: () => { closeModal(); openPalace(); } },
      { label: 'Fechar', fn: closeModal },
    ]);
    case 'term_delegacia': return message('Terminal da polícia', T('Caso Pendelton — {0}\nEvidências: {1}/{2} · Deduções: {3}/{4}\n\nPróximo passo sugerido: {5}',
      ACTS[game.act].title, game.evidence.length, EV_KEYS.length, game.deductions.length, DEDUCTIONS.length, T(objective())));
    case 'bebedouro': relieve({ sede: 20 }); return message('Bebedouro', 'Água morna com gosto de cano. Mas é água.');
    case 'mesa_lin': return talk('lin');
    case 'exit':
      if (o.shopExit) return leaveShop();
      if (o.gate && game.act < o.gate) return message('Elevador bloqueado', 'Antes de deixar o andar, você precisa entender como o assassino entrou na suíte trancada.\n\n(Reúna evidências e conecte-as em Pistas. A IRIS, no corredor, pode dar dicas.)');
      if (o.gender && o.gender !== I18N.gender) return message(o.gender === 'f' ? 'Onsen feminino (女湯)' : 'Onsen masculino (男湯)', o.gender === 'f' ? 'A cortina vermelha leva à ala feminina. Entrada só para mulheres; a Hana confere de perto.' : 'A cortina azul leva à ala masculina. Entrada só para homens; a Hana confere de perto.');
      if (o.needFlag && !game.flags[o.needFlag]) return message(o.name, o.lockedMsg);
      if (o.need === 'towel' && game.outfit !== 'towel') return message('Onsen', 'Hana avisou: do vestiário para dentro, só de toalha.\n\n(Troque de roupa nos armários do vestiário.)');
      if (o.need === 'clothes' && game.outfit === 'towel') return message('Vestiário', 'Sair só de toalha para a recepção? A Hana não ia gostar. Nem a chuva ácida lá fora.\n\n(Vista suas roupas nos armários.)');
      return enterRoom(o.to, ROOMS[o.to] && ROOMS[o.to].city ? ROOMS[o.to].cityObj.map(...o.at) : o.at);
    case 'term_recepcao':
      if (!has('e_recepcao_log')) return message('Terminal da recepção', 'Registros de acesso e chaves mestras. Protegido por criptografia corporativa.', [
        { label: 'Invadir o terminal', fn: () => { closeModal(); openHack('TERMINAL DA RECEPÇÃO — REGISTROS ADM', () => { give('e_recepcao_log'); message('Registro da chave mestra', 'Credencial ADM-02 — titular: VICTOR ROSSI.\n\nÚltimo uso: 23:20 — LOCK SUITE_404 — origem: terminal T-03 (túneis de manutenção, subsolo).'); }); } },
        { label: 'Depois', fn: closeModal },
      ]);
      return message('Terminal da recepção', 'ADM-02 — Victor Rossi. Último uso: 23:20, a partir do terminal T-03.');
    case 'term_bar':
      if (give('e_bar_log')) return message('Terminal do bar', 'Transações de créditos da noite:\n\n22:20 — Dra. H. Souza — "Uísque sintético personalizado" — ENTREGA: SUÍTE 404\n22:30 a 23:40 — E. Pendelton — 9 transações no balcão, intervalo máximo de 11 min.');
      return message('Terminal do bar', 'Evelyn: no bar das 22:30 às 23:40. Helena: drinque enviado à 404 às 22:20.');
    case 't03':
      if (give('e_terminal_t03')) return message('Terminal T-03', 'Histórico de sessão:\n\n22:40 — CAM_TUNEL_02 — OFF\n23:18 — LOGIN ADM-02\n23:20 — LOCK SUITE_404 /QUANTUM\n23:21 — LOGOUT\n\nAlguém trancou a suíte daqui de baixo, depois de sair pelo duto.');
      return message('Terminal T-03', 'Sessão ADM-02, 23:18 a 23:21.');
    case 'papeis':
      if (give('e_papeis')) return message('Caixote com papéis', 'Um contrato impresso, raridade nesta era. "Plano de Resgate Financeiro — Hotel Grand Alvorada". Campo de assinatura do investidor: em branco.\n\nAssinado apenas por: Victor Rossi, Gerente.');
      return message('Papéis de resgate', 'Rossi precisava da assinatura de Arthur. Nunca a conseguiu.');
    case 'ferramenta':
      if (S && give('e_ferramenta')) return message('Chave hidráulica', 'Sob a luz forense do scanner, a ferramenta "limpa" brilha: material biológico de Arthur Pendelton e fibras sintéticas pretas presas na empunhadura.\n\nFibras de luva.');
      if (has('e_ferramenta')) return message('Chave hidráulica', 'A arma do crime, escondida atrás dos canos.');
      return message('Canos e ferramentas', 'Uma chave hidráulica pesada, largada atrás dos canos. Parece limpa... limpa demais para um túnel destes.\n\n(O SCANNER forense pode revelar mais.)');
  }
  // genéricos: assento, loja, texto
  if (OBJ_TEXT[o.key]) { if (o.seat) sit(o); return message(...OBJ_TEXT[o.key]); }
  if (shopOf(o)) return enterShop(o);
  if (o.key === 'balcao_loja') return openShop();
  if (o.vendor) return openVendor(o.vendor, o.info);
  if (o.seat) { sit(o); return; }
  if (o.info) return message(o.name, o.info);
  return message(o.name || 'Objeto', 'Nada de especial.');
}

function hackFile() {
  openHack('ARQUIVO CRIPTOGRAFADO — MESA HOLOGRÁFICA', () => {
    give('e_arquivo');
    message('Arquivo descriptografado', 'Dados recuperados:\n\n• Patentes de IA "Aurora" — registradas por A. Pendelton. Autora original: Dra. Helena Souza.\n• Rascunho de testamento: Evelyn Pendelton REMOVIDA como herdeira.\n• Log: tentativa de acesso remoto ao drive às 22:50.');
  });
}

function talk(id) {
  const npc = NPCS[id];
  if (POLICE_TALK.includes(id)) unlockGps('delegacia');   // qualquer policial fala da delegacia
  if (game.scanner) {
    const after = npc.scanAfter;
    if (after && game.flags[after.flag] && !has(after.give)) { give(after.give); return message(T('Scanner — {0}', npc.name), after.text); }
    if (npc.scan.give) give(npc.scan.give);
    return message(T('Scanner — {0}', npc.name), npc.scan.text);
  }
  openDialogue(id);
}

// ---------- alvo de interação: o que está perto e à frente ----------
function targetCenter(tg) {
  if (tg.npc) return [tg.npc.fx + 0.5, tg.npc.fy + 0.5];
  if (tg.walker) return [tg.walker.fx + 0.5, tg.walker.fy + 0.5];
  const o = tg.obj;
  if (o.cx !== undefined) return [o.cx, o.cy];
  return [o.x + (o.w || 1) / 2, o.y + (o.d || 1) / 2];
}

function objBox(o) {
  if (o.cx !== undefined) return carBox(o.cx, o.cy, o.ang || 0);
  return [o.x, o.y, o.x + (o.w || 1), o.y + (o.d || 1)];
}

function findTarget() {
  const p = game.player, cx = p.px + 0.5, cy = p.py + 0.5;
  const dl = Math.hypot(p.dir[0], p.dir[1]) || 1, fx = p.dir[0] / dl, fy = p.dir[1] / dl;
  let best = null, bestScore = Infinity;
  const consider = (tg, x0, y0, x1, y1) => {
    const nx = Math.max(x0, Math.min(cx, x1)), ny = Math.max(y0, Math.min(cy, y1));
    const dist = Math.hypot(nx - cx, ny - cy);
    if (dist > REACH) return;
    const [tx, ty] = targetCenter(tg);
    const tl = Math.hypot(tx - cx, ty - cy) || 1;
    // perto e à frente vence; pessoas têm leve prioridade sobre objetos
    // pistas ainda não coletadas têm prioridade sobre as pessoas em volta
    const clue = tg.obj && OBJ_EVIDENCE[tg.obj.key] && !OBJ_EVIDENCE[tg.obj.key].every(has);
    // em cima de uma porta, ela é o alvo
    const onDoor = tg.obj && tg.obj.kind === 'exit' && Math.floor(cx) === tg.obj.x && Math.floor(cy) === tg.obj.y;
    const score = dist - 0.8 * ((tx - cx) / tl * fx + (ty - cy) / tl * fy) - (tg.obj ? (clue ? 0.25 : 0) : 0.1) - (onDoor ? 0.3 : 0);
    if (score < bestScore) { bestScore = score; best = tg; }
  };
  for (const o of game.roomData.objects) {
    if (!o.key || o.kind === 'puddle') continue;
    if (o.hidden && !game.scanner) continue;
    if (Math.abs(o.x - cx) > 4 && o.cx === undefined) continue;
    const [x0, y0, x1, y1] = objBox(o);
    consider({ obj: o }, x0, y0, x1, y1);
  }
  for (const n of npcsHere()) consider({ npc: n }, n.fx, n.fy, n.fx + 1, n.fy + 1);
  for (const w of game.roomData._walkers || []) consider({ walker: w }, w.fx + 0.15, w.fy + 0.15, w.fx + 0.85, w.fy + 0.85);
  return best;
}

function targetVerb(tg) {
  if (tg.npc) return game.scanner ? 'Escanear' : 'Conversar';
  if (tg.walker) return 'Conversar';
  const o = tg.obj;
  if (o.kind === 'exit') return o.key === 'servico' && game.act < 3 ? 'Examinar' : 'Próxima sala';
  if (o.key === 'carro') return 'Dirigir';
  if (o.key === 'sucata') return 'Vasculhar';
  if (o.key === 'orelhao' && game.flags.tel_campton && !game.flags.ligou_campton) return 'Ligar';
  if (o.key === 'cama_casa') return 'Deitar';
  if (o.key === 'chuveiro') return 'Tomar banho';
  if (o.key === 'fogao') return 'Cozinhar';
  if (o.key === 'armario') return 'Trocar de roupa';
  if (o.seat) return 'Sentar';
  if (shopOf(o)) return 'Entrar';
  if (o.key === 'balcao_loja') return 'Pegar itens';
  if (o.vendor || VENDORS[o.key]) return 'Comprar';
  return 'Examinar';
}

function targetName(tg) { return tg.npc ? NPCS[tg.npc.id].name : tg.walker ? tg.walker.name : tg.obj.name; }

function updatePrompt() {
  const tg = game.modal ? null : game.target;
  const el = $('prompt'), btn = $('btn-action');
  const k = IS_TOUCH ? 'A' : 'E';
  let txt = null, lbl = '';
  if (game.modal || game.busy) txt = null;
  else if (game.driving) { txt = `<b>${k}</b> ${T('Estacionar e sair do carro')}`; lbl = T('Sair'); }
  else if (game.player.seat) { txt = `<b>${k}</b> ${T('Levantar')}`; lbl = T('Levantar'); }
  else if (game.combat) { txt = `<b>${k}</b> ${T('Atirar')}${IS_TOUCH ? '' : ' · ' + T('ou clique no atirador')}`; lbl = T('Atirar'); }
  else if (tg) { txt = `<b>${k}</b> ${T(targetVerb(tg))}: ${targetName(tg)}`; lbl = T(targetVerb(tg)); }
  el.innerHTML = txt || '';
  el.classList.toggle('show', !!txt);
  btn.classList.toggle('ready', !!txt);
  $('btn-action-lbl').textContent = lbl;
}

// botão de ação: interage com o alvo ou avança o texto da janela aberta
let engineOn = false;
function doAction() {
  if (!game) {
    // tela de título: A abre o botão destacado; na introdução, avança
    if (Intro.isRunning()) { Intro.next(); return; }
    const f = document.activeElement;
    if (titleOn() && f && f.tagName === 'BUTTON' && $('title').contains(f)) f.click();
    else if (titleOn()) focusMove(1);
    return;
  }
  if (game.modal) {
    if (game.modal === 'intro') { Intro.next(); return; }
    if (game.modal === 'card') { $('card').click(); return; }
    if (typing) { finishTyping(); return; }
    const panel = activePanel();
    if (!panel) return;
    const f = document.activeElement;
    if (f && f.tagName === 'BUTTON' && panel.contains(f)) { f.click(); return; }
    const c = panel.querySelector('[data-continue]');
    if (c) c.click();
    return;
  }
  if (game.busy) return;
  if (game.combat) { playerShoot(); return; }
  if (game.driving) { exitCar(); return; }
  if (game.player.seat) { standUp(); return; }
  if (game.target) actOn(game.target);
}

// ---------- controles ----------
const keys = new Set();
const joy = { x: 0, y: 0, id: null };
const pad = { x: 0, y: 0, prev: [] };

function inputVector() {
  let ix = 0, iy = 0;
  if (keys.has('arrowleft') || keys.has('a')) ix -= 1;
  if (keys.has('arrowright') || keys.has('d')) ix += 1;
  if (keys.has('arrowup') || keys.has('w')) iy -= 1;
  if (keys.has('arrowdown') || keys.has('s')) iy += 1;
  ix += joy.x + pad.x; iy += joy.y + pad.y;
  const l = Math.hypot(ix, iy);
  return l > 1 ? [ix / l, iy / l] : [ix, iy];
}

// direção na tela → direção nos eixos do mapa isométrico; sem direcional, segue o caminho do clique
function movePlayer(dt) {
  const p = game.player;
  const [ix, iy] = inputVector();
  const mag = Math.hypot(ix, iy);
  p.moving = false;
  if (game.modal || game.busy) return;
  // depois de atravessar uma porta, espera soltar a direcional (evita voltar na hora)
  if (game.inputLock) { if (mag < 0.15) game.inputLock = false; else return; }
  if (p.seat) { if (mag >= 0.15) standUp(); return; }
  const water = p.inWater ? 0.55 : 1;
  if (mag >= 0.15) {
    p.path = []; game.pending = null; game.dest = null;
    let tx = ix + iy, ty = iy - ix;
    const tl = Math.hypot(tx, ty);
    stepPlayer(tx / tl, ty / tl, SPEED * needSpeed() * gearSpeed() * water * Math.min(1, mag) * dt, ix);
    return;
  }
  if (!p.path.length) return;
  // caminho do clique: anda até o centro do próximo tile
  const [wx, wy] = p.path[0];
  const cx = p.px + 0.5, cy = p.py + 0.5, dx = wx + 0.5 - cx, dy = wy + 0.5 - cy, dist = Math.hypot(dx, dy);
  const sp = SPEED * needSpeed() * gearSpeed() * water * dt;
  if (dist <= sp) {
    p.px = wx; p.py = wy; p.moving = true;
    p.path.shift();
    onTile(wx, wy);
    if (!p.path.length) { game.dest = null; if (game.pending) { const t = game.pending; game.pending = null; actOn(t); } }
  } else {
    stepPlayer(dx / dist, dy / dist, sp, dx - dy, true);
  }
}

function stepPlayer(tx, ty, step, screenX, noCollide) {
  const p = game.player;
  p.dir = [tx, ty];
  if (Math.abs(screenX) > 0.05) p.face = screenX < 0;
  const cx = p.px + 0.5, cy = p.py + 0.5;
  let nx = cx, ny = cy;
  const mx = tx * step, my = ty * step;
  if (noCollide || free(cx + mx, cy)) nx = cx + mx;
  else if (Math.abs(tx) > 0.2) ny = slide(cy, step, v => free(cx + mx, v), v => free(cx, v));
  if (noCollide || free(nx, ny + my)) ny += my;
  else if (Math.abs(ty) > 0.2 && nx === cx) nx = slide(cx, step, v => free(v, ny + my), v => free(v, ny));
  if (nx === cx && ny === cy) return;
  p.moving = true;
  p.px = nx - 0.5; p.py = ny - 0.5;
  game.stepAcc += step;
  if (game.stepAcc > 0.55) { game.stepAcc = 0; Sound.play(p.inWater ? 'splash' : 'step'); }
  onTile(Math.floor(nx), Math.floor(ny));
}

// passagens estreitas: ao bater num canto, escorrega para o centro do vão (se lá o caminho estiver livre)
function slide(v, step, passes, fits) {
  const c = Math.floor(v) + 0.5;
  if (Math.abs(c - v) < 0.001 || !passes(c)) return v;
  const nv = v + Math.sign(c - v) * Math.min(step, Math.abs(c - v));
  return fits(nv) ? nv : v;
}

// pisar num tile novo: entrar na água
function onTile(tx, ty) {
  const p = game.player;
  if (tx === p.x && ty === p.y) return;
  p.x = tx; p.y = ty;
  const w = waterAt(game.roomData, tx, ty);
  if (w && w !== p.inWater) {
    Sound.play('waterIn');
    toast(w.water === 'cold' ? 'Água gelada! Vance perde o fôlego por um segundo.' : 'Vance entra na água quente. Os ombros soltam na hora.');
  }
  p.inWater = w;
  // portas não se atravessam sozinhas: é preciso apertar o botão "Próxima sala"
}

// ---------- clicar / tocar para andar ----------
function goTo(target) {
  const p = game.player;
  let goal;
  if (target.npc || target.walker) {
    const a = target.npc || target.walker;
    goal = (x, y) => Math.max(Math.abs(x - a.x), Math.abs(y - a.y)) === 1;
  } else if (target.obj) {
    const o = target.obj;
    const [x0, y0, x1, y1] = objBox(o).map((v, i) => i < 2 ? Math.floor(v) : Math.ceil(v) - 1);
    if (o.kind === 'exit') goal = (x, y) => x === o.x && y === o.y;
    else goal = (x, y) => {
      const dx = x < x0 ? x0 - x : x > x1 ? x - x1 : 0;
      const dy = y < y0 ? y0 - y : y > y1 ? y - y1 : 0;
      return Math.max(dx, dy) <= 1 && !(o.solid && dx === 0 && dy === 0);
    };
  } else {
    const [tx, ty] = target.tile;
    goal = (x, y) => x === tx && y === ty;
  }
  const isDoor = target.obj && target.obj.key === 'exit';
  if (goal(p.x, p.y)) { p.path = []; if (!isDoor) actOn(target); return; }
  const path = findPath(game.roomData, (x, y) => solidAt(game.roomData, x, y), p.x, p.y, goal);
  if (!path) { toast('Não dá para chegar lá.'); return; }
  // começa pelo centro do tile atual para não cortar móveis
  p.path = [[p.x, p.y], ...path];
  game.pending = target.tile || isDoor ? null : target;
  game.dest = target.tile ? target.tile : null;
}

// chegou ao alvo: vira para ele e interage
function actOn(tg) {
  if (!tg || tg.tile) return;
  const p = game.player, [tx, ty] = targetCenter(tg);
  p.face = (tx - ty) < (p.px - p.py);
  if (tg.npc) talk(tg.npc.id);
  else if (tg.walker) talkWalker(tg.walker);
  else interact(tg.obj);
}

// objeto ou personagem sob o ponto da tela (unidades de jogo)
function pickAt(x, y) {
  let best = null, bestDepth = -1e9;
  const test = (tg, cx, cy, halfW, tall, depth, z = floorZ(cx, cy)) => {
    const [sx, sy] = iso(cx, cy, z);
    if (x >= sx - halfW && x <= sx + halfW && y >= sy - tall && y <= sy + 6 && depth > bestDepth) { best = tg; bestDepth = depth; }
  };
  for (const o of game.roomData.objects) {
    if (!o.key || o.kind === 'puddle' || (o.hidden && !game.scanner)) continue;
    const [x0, y0, x1, y1] = objBox(o), w = x1 - x0, d = y1 - y0;
    const tall = o.kind === 'exit' || o.kind === 'shopfront' ? 40 : o.solid ? 28 : 10;
    test({ obj: o }, (x0 + x1) / 2, (y0 + y1) / 2, (w + d) * 8 * 0.6 + 2, tall, x1 + y1, o.z || 0);
  }
  for (const n of npcsHere()) test({ npc: n }, n.fx + 0.5, n.fy + 0.5, 8, 32, n.fx + n.fy + 2.5);
  for (const w of game.roomData._walkers || []) test({ walker: w }, w.fx + 0.5, w.fy + 0.5, 7, 30, w.fx + w.fy + 2.4);
  return best;
}

function handleTap(clientX, clientY) {
  if (!game || game.modal || game.busy) return;
  const r = canvas.getBoundingClientRect();
  const x = (clientX - r.left) * VW / r.width, y = (clientY - r.top) * VH / r.height;
  // dirigindo, o toque marca para onde o carro vai quando acelerar
  if (game.driving) { const [tx, ty] = screenToTile(x, y); game.car.aim = [tx + 0.5, ty + 0.5]; return; }
  game.inputLock = false;
  if (game.combat) {
    const e = game.combat.enemy, [ex, ey] = iso(e.x, e.y);
    if (Math.abs(x - ex) < 10 && y > ey - 30 && y < ey + 6) return playerShoot();
  }
  if (game.player.seat) { standUp(); return; }
  const tg = pickAt(x, y);
  if (tg) return goTo(tg);
  let [tx, ty] = screenToTile(x, y);
  // toque no piso de um mezanino elevado: o tile está mais abaixo na grade do que parece na tela
  for (let z = 4; z <= 48; z += 4) { const [ux, uy] = screenToTile(x, y + z); if (Math.abs(floorZ(ux + 0.5, uy + 0.5) - z) < 6 && floorZ(ux + 0.5, uy + 0.5) > 0) { [tx, ty] = [ux, uy]; break; } }
  if (!solidAt(game.roomData, tx, ty)) goTo({ tile: [tx, ty] });
}

// joystick virtual
const joyEl = $('joy'), knob = $('joy-knob');
function joyMove(e) {
  const r = joyEl.getBoundingClientRect();
  const R = r.width / 2;
  let dx = e.clientX - (r.left + R), dy = e.clientY - (r.top + R);
  const l = Math.hypot(dx, dy);
  if (l > R) { dx = dx / l * R; dy = dy / l * R; }
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
  const m = Math.min(1, l / R);
  joy.x = m < 0.18 ? 0 : dx / R; joy.y = m < 0.18 ? 0 : dy / R;
}
function joyEnd(e) {
  if (e.pointerId !== joy.id) return;
  joy.id = null; joy.x = joy.y = 0;
  knob.style.transform = '';
  joyEl.classList.remove('active');
}
$('joy-zone').addEventListener('pointerdown', e => {
  e.preventDefault();
  joy.id = e.pointerId;
  $('joy-zone').setPointerCapture(e.pointerId);
  joyEl.classList.add('active');
  joyMove(e);
});
$('joy-zone').addEventListener('pointermove', e => { if (e.pointerId === joy.id) joyMove(e); });
$('joy-zone').addEventListener('pointerup', joyEnd);
$('joy-zone').addEventListener('pointercancel', joyEnd);
$('btn-action').addEventListener('pointerdown', e => { e.preventDefault(); doAction(); });
if (IS_TOUCH) document.body.classList.add('touch');

// pinça no cenário para zoom
const pointers = new Map();
let pinch = null, tapStart = null;
const pdist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
canvas.addEventListener('pointerdown', e => {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2 && game) { const [a, b] = [...pointers.values()]; pinch = { d: pdist(a, b), zoom: game.zoom }; tapStart = null; }
  else if (pointers.size === 1) tapStart = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('pointermove', e => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size >= 2) { const [a, b] = [...pointers.values()]; setZoom(pinch.zoom * pinch.d / Math.max(20, pdist(a, b))); }
  else if (tapStart && Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y) > 14) tapStart = null;
});
const pointerEnd = e => {
  pointers.delete(e.pointerId);
  if (pinch) { if (pointers.size < 2) { pinch = null; saveZoom(); } tapStart = null; return; }
  if (tapStart && e.type === 'pointerup') handleTap(e.clientX, e.clientY);
  tapStart = null;
};
canvas.addEventListener('pointerup', pointerEnd);
canvas.addEventListener('pointercancel', pointerEnd);
canvas.addEventListener('wheel', e => {
  if (!game) return;
  e.preventDefault();
  setZoom(game.zoom * (e.deltaY > 0 ? 1.08 : 0.92));
  saveZoom();
}, { passive: false });
window.addEventListener('resize', () => { if (game) { resizeView(game.zoom); updateCamera(game.roomData, game.player.px + 0.5, game.player.py + 0.5, 0, true); } });

// navegação por botões nas janelas (teclado / gamepad)
function activePanel() {
  return ['accuse', 'hack', 'palace', 'evidence', 'menu', 'gps', 'lang', 'dialogue', 'msg', 'call'].map($).find(el => !el.classList.contains('hidden')) || (titleOn() ? $('title') : null);
}
// tela de título (escolha do caso) aberta, sem a introdução por cima
function titleOn() { return !$('title').classList.contains('hidden') && !Intro.isRunning(); }
function focusMove(delta) {
  const panel = activePanel();
  if (!panel) return;
  const bs = [...panel.querySelectorAll('button')].filter(b => b.offsetParent);
  if (!bs.length) return;
  const i = bs.indexOf(document.activeElement);
  const n = bs[(i < 0 ? (delta > 0 ? 0 : bs.length - 1) : (i + delta + bs.length) % bs.length)];
  document.querySelectorAll('.pad-focus').forEach(b => b.classList.remove('pad-focus'));
  n.classList.add('pad-focus');   // destaque visível também com controle (o :focus-visible só aparece com teclado)
  n.focus({ focusVisible: true });
  n.scrollIntoView({ block: 'nearest' });
}

function toggleScanner() {
  if (!game || game.modal) return;
  if (game.combat) { toast('Agora não. Abaixe a cabeça!'); return; }
  game.scanner = !game.scanner;
  Sound.play(game.scanner ? 'scanOn' : 'scanOff');
  updateHud();
  toast(game.scanner ? '<span class="k">SCANNER ATIVO</span> rastros digitais e térmicos visíveis' : 'Scanner desativado');
}

// gamepad (controle Bluetooth/USB)
function pollGamepad() {
  const gp = navigator.getGamepads ? [...navigator.getGamepads()].find(g => g) : null;
  if (!gp) { pad.x = pad.y = 0; return; }
  const b = i => !!(gp.buttons[i] && gp.buttons[i].pressed);
  const pressed = i => b(i) && !pad.prev[i];
  // Xbox/TV: o primeiro botão do controle também libera o áudio (se o navegador aceitar)
  if (!pad.audioTried && gp.buttons.some(x => x.pressed)) { pad.audioTried = true; Sound.init(); }
  let ax = Math.abs(gp.axes[0]) > 0.2 ? gp.axes[0] : 0, ay = Math.abs(gp.axes[1]) > 0.2 ? gp.axes[1] : 0;
  if (b(14)) ax = -1; if (b(15)) ax = 1; if (b(12)) ay = -1; if (b(13)) ay = 1;
  // a tecla emulada pelo Edge do Xbox chegou primeiro: este aperto já foi tratado por ela
  if (performance.now() - (pad.lastKey || -1e9) < 250) { for (let i = 0; i < gp.buttons.length; i++) pad.prev[i] = b(i); pad.prev.up = pad.prev.down = true; pad.x = pad.y = 0; return; }
  if ((game && game.modal) || titleOn()) {
    pad.x = pad.y = 0;
    const up = (b(12) || b(14) || gp.axes[1] < -0.6 || gp.axes[0] < -0.6), down = (b(13) || b(15) || gp.axes[1] > 0.6 || gp.axes[0] > 0.6);
    if (up && !pad.prev.up) focusMove(-1);
    if (down && !pad.prev.down) focusMove(1);
    pad.prev.up = up; pad.prev.down = down;
  } else { pad.x = ax; pad.y = ay; }
  if (pressed(0)) doAction();
  if (pressed(1)) goBack();
  if (pressed(2)) toggleScanner();
  if (pressed(3) && game && !game.modal) openPalace();
  if (pressed(8) && game && !game.modal) openEvidence();
  if (pressed(9) && game) game.modal === 'menu' ? closeModal() : openMenu();
  if (gp.buttons.some(x => x.pressed) || Math.abs(gp.axes[0]) > 0.6 || Math.abs(gp.axes[1]) > 0.6) pad.lastPress = performance.now();
  for (let i = 0; i < gp.buttons.length; i++) pad.prev[i] = b(i);
}

// ---------- loop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  pollGamepad();
  if (game) { update(dt); render(); }
  requestAnimationFrame(frame);
}

function update(dt) {
  game.t += dt;
  if (!game.modal) {
    game.clock += dt;
    game.saveTimer += dt;
    if (game.saveTimer > 20) { game.saveTimer = 0; saveGame(); }
  }
  game.flash = Math.max(0, game.flash - dt * 2.5);
  game.nextFlash -= dt;
  if (game.nextFlash <= 0) {
    game.flash = 1; game.nextFlash = 8 + Math.random() * 14;
    if (game.roomId !== 'tunnels') setTimeout(Sound.thunder, 300 + Math.random() * 1200);
  }
  const room = game.roomData;
  if (!room.glass && !room.outdoor) game.flash = 0;
  markVisited();
  updateNeeds(dt);
  updateBusy(dt);
  for (const o of room.objects) if (o.steam > 0) o.steam -= dt;
  updateAgents(dt);
  if (room.city) CITY.updateTraffic(dt);
  if (game.driving) { if (!game.modal) updateDrive(dt); }
  // som do motor: liga ao entrar no carro e acompanha a velocidade
  if (game.driving) Sound.engine(true, Math.hypot(game.car.vx, game.car.vy) / CAR_MAX);
  else if (engineOn) Sound.engine(false);
  engineOn = !!game.driving;
  if (document.body.classList.contains('driving') !== !!game.driving) {
    document.body.classList.toggle('driving', !!game.driving);
    $('drive-btns').classList.toggle('hidden', !game.driving);
    if (!game.driving) setGas(false);
  }
  else movePlayer(dt);
  const p = game.player;
  p.inWater = game.driving || p.seat ? null : waterAt(room, p.x, p.y);
  // água quente relaxa; água gelada desperta
  if (p.inWater && !game.modal) relieve({ cansaco: (p.inWater.water === 'cold' ? 1 : 2.2) * dt }, true);
  // a emboscada começa depois de achar a arma do crime, mas só com o scanner desligado
  if (game.caseId === 'eco') ecoUpdate(dt);
  if (!game.combat && !game.modal && (game.caseId === 'eco' ? ecoWantsCombat() : game.roomId === 'tunnels' && has('e_ferramenta') && !game.flags.tiroteio && !game.scanner)) {
    game.combatDelay = (game.combatDelay || 0) + dt;
    if (game.combatDelay > 0.8) startCombat();
  }
  if (game.combat && !game.modal) updateCombat(dt);
  game.target = game.modal || game.combat || game.busy || game.driving || p.seat ? null : findTarget();
  if (room.city) {
    updateGps(dt);
    const ctz = CITY.inCT(p.x, p.y);
    if (ctz !== game.inCT) { game.inCT = ctz; Sound.setRoom(ctz ? 'chinatown' : 'city'); }
    if (placeLabel() !== game.place) updateHud(); else updateGpsLine();
  }
  updatePrompt();
  updateCamera(room, p.px + 0.5, p.py + 0.5, dt, false);
  updateClock();
}

function updateClock() {
  const mins = 47 + Math.floor(game.clock / 6);
  $('clock').textContent = `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}

// ============================================================
// Desenho
// ============================================================
// a caixa (no chão, com altura h) aparece na tela?
function onScreen(x0, y0, x1, y1, h) {
  const l = iso(x0, y1)[0], r = iso(x1, y0)[0], top = iso(x0, y0, h)[1], bot = iso(x1, y1)[1];
  return r > -10 && l < VW + 10 && bot > -10 && top < VH + 10;
}

// faixa de tiles visível (para o chão da cidade)
function viewTiles() {
  const c = [[0, 0], [VW, 0], [0, VH], [VW, VH]].map(([x, y]) => screenToTile(x, y));
  const xs = c.map(v => v[0]), ys = c.map(v => v[1]);
  return { x0: Math.min(...xs) - 1, x1: Math.max(...xs) + 1, y0: Math.min(...ys) - 1, y1: Math.max(...ys) + 1 };
}

function playerLook() { const f = I18N.gender === 'f'; return game.outfit === 'towel' ? (f ? 'vance_f_towel' : 'vance_towel') : (f ? 'vance_f' : 'vance'); }

function drawPlayer(t) {
  const p = game.player, C = game.combat, look = playerLook();
  const [sx, sy] = iso(p.px + 0.5, p.py + 0.5);
  const crouch = game.busy && game.busy.kind === 'search';   // agachado revirando a sucata
  drawChar(ctx, sx, sy, LOOKS[look], t, p.moving, p.face, { look, gun: !!C, flash: C && C.gunFlash > 0, water: !!p.inWater, pose: crouch ? 'kneel' : undefined });
}

// quem está sentado ou deitado neste objeto é desenhado junto com ele
// onde desenhar quem está sentado: na borda da frente do assento, com os joelhos na quina
// e as canelas pendendo na frente do assento (e não em pé em cima dele)
const SEAT_EDGE = 0.3;
function seatScreen(pt) { return iso(pt.x + SEAT_EDGE, pt.y + SEAT_EDGE); }

function drawOccupants(o, t) {
  const p = game.player, s = p.seat;
  if (s && s.obj === o) {
    const look = playerLook();
    if (s.pose === 'sit' && o.kind === 'zabuton') {
      const [sx, sy] = iso(s.pt.x, s.pt.y);
      drawChar(ctx, sx, sy - s.pt.z, LOOKS[look], t, false, p.face, { look, pose: 'seiza', noShadow: true });
    } else if (s.pose === 'sit') {
      const [sx, sy] = seatScreen(s.pt);
      drawChar(ctx, sx, sy - (s.pt.z - 6), LOOKS[look], t, false, p.face, { look, seated: true, noShadow: true });
    } else if (s.pose === 'lie') {
      // deitado debaixo da colcha da própria cama: só cabeça, peito e braços de fora
      const sleeping = game.modal === 'card' || (game.busy && game.busy.kind === 'sleepIn');
      drawLying(o.x + (o.w || 1) / 2, o.y + 0.28, 7.2, look, t, { len: 1.9, zzz: sleeping, pose: sleeping ? 'sleep' : 'stand' });
      if (o.kind === 'bed') {
        const w = o.w || 1, d = o.d || 1;
        box(o.x + 0.05, o.y + 1.25, w - 0.1, d - 1.3, 1.8, '#5a2a7a', 6.2, '#6a3490');
        line([iso(o.x + 0.05, o.y + 1.25, 8), iso(o.x + w - 0.05, o.y + 1.25, 8)], 'rgba(255,255,255,0.25)', 0.6);
        line([iso(o.x + 0.05, o.y + 1.7, 8), iso(o.x + w - 0.05, o.y + 1.7, 8)], 'rgba(0,0,0,0.2)', 0.4);
      }
    }
  }
  let any = s && s.obj === o && s.pose === 'sit';
  for (const a of game.roomData._walkers || []) if (a.seatObj === o) {
    const pt = seatPoint(o, a.x, a.y);
    if (o.kind === 'zabuton') { const [sx, sy] = iso(pt.x, pt.y); drawChar(ctx, sx, sy - pt.z, LOOKS[a.look], t + a.x, false, a.face, { look: a.look, pose: 'seiza', noShadow: true }); }
    else { const [sx, sy] = seatScreen(pt); drawChar(ctx, sx, sy - (pt.z - 6), LOOKS[a.look], t + a.x, false, a.face, { look: a.look, seated: true, noShadow: true }); }
    any = true;
  }
}

// redesenha a frente do assento por cima de quem está sentado: as pernas somem atrás dele,
// como nas cenas de sentar de Stardew Valley
function seatFront(o) {
  const w = o.w || 1, d = o.d || 1;
  const fronts = (x, y, fw, fd, h, col) => {
    const c = iso(x + fw, y + fd, h), b = iso(x + fw, y, h), e = iso(x, y + fd, h);
    const b0 = iso(x + fw, y, 0), c0 = iso(x + fw, y + fd, 0), e0 = iso(x, y + fd, 0);
    poly(ctx, [e0, c0, c, e], shade(col, 0.62));
    poly(ctx, [c0, b0, b, c], shade(col, 0.8));
    line([e, c, b], 'rgba(255,255,255,0.13)', 0.4);
  };
  switch (o.kind) {
    case 'sofa': fronts(o.x + 0.1, o.y + 0.05, 0.8, d - 0.1, 5, '#3a1f4a'); break;
    case 'bench': fronts(o.x + 0.1, o.y + 0.25, 0.8, 0.5, 4, '#3a2a20'); break;
    case 'sauna_bench': fronts(o.x + 0.02, o.y + 0.06, w - 0.04, d - 0.12, o.h || 6, '#7a5430'); break;
    case 'armchair': fronts(o.x + 0.12, o.y + 0.12, 0.76, 0.76, 5, o.col || '#5a2a3a'); break;
    case 'chair': box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 1.2, o.col || '#4a3a5a', 6); break;
    case 'stool': box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 2, '#b04cff', 6); break;
    case 'wash_stool': box(o.x + 0.32, o.y + 0.32, 0.36, 0.36, 3, '#c8d0d8'); break;
  }
}

// altura do chão neste ponto da sala (mezanino e escadaria das estações elevadas)
function floorZ(fx, fy) { return typeof elevAt === 'function' ? elevAt(game.roomId, fx, fy) : 0; }
function lifted(fx, fy, fn) {
  const z = floorZ(fx, fy);
  if (!z) return fn();
  ctx.save(); ctx.translate(0, -z); fn(); ctx.restore();
}

function render() {
  const room = game.roomData, t = game.t, S = game.scanner;
  beginFrame();
  ctx.fillStyle = '#05030c';
  ctx.fillRect(0, 0, VW, VH);
  const C = game.combat;
  if (C && C.shake > 0) ctx.translate((Math.random() - 0.5) * C.shake * 6, (Math.random() - 0.5) * C.shake * 6);
  const city = !!room.city;
  if (city) CITY.drawGround(t, viewTiles());
  else { drawWalls(room, t, game.flash); drawFloor(room, t); }

  const objs = room.objects;
  objs.filter(o => FLAT.includes(o.kind) && (!city || onScreen(o.x, o.y, o.x + (o.w || 1), o.y + (o.d || 1), 4))).forEach(o => drawObject(o, t, S));
  if (city) drawGpsRoute(t);
  if (game.target) drawTargetRing(game.target, t);
  if (game.dest) {
    const [sx, sy] = iso(game.dest[0] + 0.5, game.dest[1] + 0.5);
    ctx.strokeStyle = rgba('#ffd23f', 0.5 + 0.3 * Math.sin(t * 8)); ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.ellipse(sx, sy, 6, 3, 0, 0, Math.PI * 2); ctx.stroke();
  }

  const ents = [];
  const p = game.player;
  let occluded = false;
  for (const o of objs) {
    if (FLAT.includes(o.kind) || HIDDEN_KINDS.includes(o.kind)) continue;
    const b = objBox(o);
    if (city && !onScreen(b[0], b[1], b[2], b[3], o.kind === 'paifang' || o.kind === 'lantern_line' ? 50 : 40)) continue;
    let bb = b;
    if (o.kind === 'partition' || o.kind === 'paifang' || o.kind === 'lantern_line' || o.kind === 'tape') bb = o.axis === 'y' ? [o.x + 0.45, o.y, o.x + 0.55, o.y + (o.d || 1)] : [o.x, o.y + 0.45, o.x + (o.w || 1), o.y + 0.55];
    const lift = o.z || 0;   // objetos em cima de um mezanino elevado
    ents.push({ b: bb, d: bb[2] + bb[3] - 1 - (o.kind === 'st_floor' || o.kind === 'st_step' ? 0.5 : 0), draw: () => { if (lift) { ctx.save(); ctx.translate(0, -lift); } drawObject(o, t, S); drawOccupants(o, t); if (lift) ctx.restore(); } });
  }
  if (city) {
    // prédios na frente de Vance ficam transparentes
    const fx = p.px + 0.5, fy = p.py + 0.5, [fsx, fsy] = iso(fx, fy, 8);
    for (const b of CITY.buildings) {
      if (!onScreen(b.x, b.y, b.x + b.w, b.y + b.d, b.h * CITY_SV + 50)) continue;
      const behind = fx < b.x + b.w && fy < b.y + b.d;
      const l = iso(b.x, b.y + b.d)[0], r = iso(b.x + b.w, b.y)[0], top = iso(b.x, b.y, b.h * CITY_SV)[1], bot = iso(b.x + b.w, b.y + b.d)[1];
      const fade = behind && fsx > l - 4 && fsx < r + 4 && fsy > top && fsy < bot;
      ents.push({ b: [b.x, b.y, b.x + b.w, b.y + b.d], d: b.x + b.w + b.y + b.d - 1, draw: () => { if (fade) ctx.globalAlpha = 0.28; CITY.drawBuilding(b, t); ctx.globalAlpha = 1; } });
    }
    for (const c of CITY.traffic) if (onScreen(c.x - 1, c.y - 1, c.x + 1, c.y + 1, 30)) { const cb = carBox(c.x, c.y, Math.atan2(c.dy, c.dx)); ents.push({ b: cb, d: cb[2] + cb[3] - 1, draw: () => {
      ctx.save(); ctx.translate(0, -c.rise); drawHoverCar(c.x, c.y, Math.atan2(c.dy, c.dx), t + c.x, { livery: c.livery }); ctx.restore();
    } }); }
  }
  npcsHere().forEach(n => ents.push({ b: [n.fx + 0.3, n.fy + 0.3, n.fx + 0.7, n.fy + 0.7], d: n.fx + n.fy + 1, draw: () => lifted(n.fx + 0.5, n.fy + 0.5, () => drawNpc(n, t)) }));
  for (const w of room._walkers || []) {
    if (w.seatObj || (city && !onScreen(w.fx, w.fy, w.fx + 1, w.fy + 1, 40))) continue;
    ents.push({ b: [w.fx + 0.3, w.fy + 0.3, w.fx + 0.7, w.fy + 0.7], d: w.fx + w.fy + 1, draw: () => lifted(w.fx + 0.5, w.fy + 0.5, () => drawWalker(w, t)) });
  }
  if (game.driving) {
    const c = game.car;
    const cb = carBox(c.x, c.y, c.ang);
    ents.push({ b: cb, d: cb[2] + cb[3] - 1, draw: () => drawHoverCar(c.x, c.y, c.ang, t, { livery: 'vance', alt: carAlt(c) }) });
  } else if (!p.seat) {
    ents.push({ b: [p.px + 0.3, p.py + 0.3, p.px + 0.7, p.py + 0.7], d: p.px + p.py + 1.01, draw: () => lifted(p.px + 0.5, p.py + 0.5, () => drawPlayer(t)) });
  }
  if (C && C.enemy.alpha > 0) {
    const e = C.enemy;
    ents.push({ b: [e.x - 0.2, e.y - 0.2, e.x + 0.2, e.y + 0.2], d: e.x + e.y + 0.01, draw: () => {
      const [sx, sy] = iso(e.x, e.y);
      ctx.save(); ctx.globalAlpha = e.alpha;
      drawChar(ctx, sx, sy, LOOKS[C.ambush.look || 'hooded'], t, e.moving, e.face, { look: C.ambush.look || 'hooded', gun: C.phase !== 'intro' || C.t > 0.6, flash: e.flash > 0 });
      ctx.restore();
    } });
  }
  depthSort(ents).forEach(e => e.draw());

  const ps = iso(p.px + 0.5, p.py + 0.5, floorZ(p.px + 0.5, p.py + 0.5));
  drawLighting(city ? { dark: room.dark, lights: cityLights() } : room, t, ps, game.flash);

  if (S) {
    drawScannerOverlay(t);
    objs.filter(o => HIDDEN_KINDS.includes(o.kind)).forEach(o => drawObject(o, t, S));
    npcsHere().forEach(n => {
      if (NPCS[n.id].holo) return;
      const [sx, sy] = iso(n.fx + 0.5, n.fy + 0.5);
      ctx.fillStyle = rgba('#ff6b3d', 0.22 + 0.1 * Math.sin(t * 6));
      ctx.beginPath(); ctx.ellipse(sx, sy - 11, 5.5, 12, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  if (C) drawCombatFx(C, t);
  if (room.outdoor) drawRain(t, city ? 0.38 : 0.42);
  drawVignette();
  drawNeedsFx();
  // teletransporte: clarão ciano e feixe vertical sobre Vance
  const tk = game.teleFx != null ? (game.t - game.teleFx) / 0.9 : 1;
  if (tk >= 0 && tk < 1) {
    const [bx] = iso(game.player.px + 0.5, game.player.py + 0.5);
    ctx.fillStyle = `rgba(120,250,255,${(1 - tk) * 0.5})`; ctx.fillRect(-10, -10, VW + 20, VH + 20);
    const bw = 16 * (1 - tk);
    ctx.fillStyle = `rgba(220,255,255,${(1 - tk) * 0.9})`; ctx.fillRect(bx - bw / 2, -10, bw, VH + 20);
  }
  if (C && C.hitFlash > 0) { ctx.fillStyle = `rgba(255,30,60,${C.hitFlash * 0.35})`; ctx.fillRect(-10, -10, VW + 20, VH + 20); }
  // trocar de roupa: tela escurece e clareia
  if (game.busy && game.busy.kind === 'change') { ctx.fillStyle = `rgba(0,0,0,${Math.sin(Math.min(1, game.busy.t / game.busy.dur) * Math.PI) * 0.95})`; ctx.fillRect(-10, -10, VW + 20, VH + 20); }
  drawIndicators(room, t, S);
  if (game.target) drawTargetMarker(game.target, t);
}

// luzes da cidade visíveis agora (postes, lojas, faróis)
function cityLights() {
  const out = [];
  const near = (x, y) => { const [sx, sy] = iso(x, y); return sx > -80 && sx < VW + 80 && sy > -80 && sy < VH + 80; };
  for (const o of game.roomData.objects) if (o.light) {
    const x = o.cx !== undefined ? o.cx : o.x + (o.w || 1) / 2, y = o.cy !== undefined ? o.cy : o.y + (o.d || 1) / 2;
    if (near(x, y)) out.push({ x, y, ...o.light });
  }
  for (const sh of CITY.shops) { const [x, y] = sh.tile; if (near(x + 0.5, y + 0.5)) out.push({ x: x + 0.5, y: y + 0.5, z: 10, r: 55, color: sh.col }); }
  if (game.driving) { const c = game.car; out.push({ x: c.x + Math.cos(c.ang) * 2, y: c.y + Math.sin(c.ang) * 2, z: 4, r: 50, color: '#fffbe0' }); }
  for (const c of CITY.traffic) if (near(c.x, c.y)) out.push({ x: c.x + c.dx * 1.6, y: c.y + c.dy * 1.6, z: 4, r: 34, color: '#fff4d0' });
  // no máximo as 28 luzes mais perto de Vance (cada luz custa dois degradês por quadro)
  const p = game.player, px0 = p.px + 0.5, py0 = p.py + 0.5;
  return out.length <= 22 ? out : out.sort((a, b) => Math.hypot(a.x - px0, a.y - py0) - Math.hypot(b.x - px0, b.y - py0)).slice(0, 22);
}

function drawNpc(n, t) {
  const npc = NPCS[n.id];
  const look = n.look || npc.look;
  const water = !!waterAt(game.roomData, n.x, n.y);
  const seated = (n.seated !== undefined ? n.seated : npc.seated) && !game.gathering;
  const [sx, sy] = iso(n.fx + 0.5, n.fy + 0.5);
  if (seated) {
    box(n.fx + 0.42, n.fy + 0.42, 0.16, 0.16, 6, '#3a3a48');
    box(n.fx + 0.25, n.fy + 0.25, 0.5, 0.5, 2, '#b04cff', 6);
  }
  const faceLeft = n.moving ? n.face : (game.player.px - game.player.py) < (n.fx - n.fy);
  const pose = !n.moving && n.pose === 'kneel' ? 'kneel' : null;
  drawChar(ctx, sx, sy - (seated ? 2 : 0), LOOKS[look], t + n.x, n.moving, faceLeft, { seated, look, water, pose });
  // perícia: luz forense ou flash da câmera
  if (n.spots && !n.moving) {
    if (n.pose === 'kneel') {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(sx + 4, sy, 0, sx + 4, sy, 9);
      g.addColorStop(0, 'rgba(120,80,255,0.5)'); g.addColorStop(1, 'rgba(120,80,255,0)');
      ctx.fillStyle = g; ctx.fillRect(sx - 6, sy - 9, 20, 18);
      ctx.restore();
    } else if (Math.sin(t * 1.3 + n.x * 3) > 0.985) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(-10, -10, VW + 20, VH + 20); ctx.restore();
    }
  }
}

function drawWalker(w, t) {
  const [sx, sy] = iso(w.fx + 0.5, w.fy + 0.5);
  const water = !!waterAt(game.roomData, w.x, w.y);
  const faceLeft = w.moving || w.hold <= 0 ? w.face : (game.player.px - game.player.py) < (w.fx - w.fy);
  drawChar(ctx, sx, sy, LOOKS[w.look], t + w.fx * 0.7, w.moving, faceLeft, { look: w.look, umbrella: game.roomData.outdoor ? w.umbrella : null, water });
}

function npcHasNews(n, S) {
  const npc = NPCS[n.id];
  if (!game.seen.has(n.id)) return true;
  if (npc.topics.some(topicFresh)) return true;
  return S && npc.scan.give && !has(npc.scan.give);
}

function drawIndicators(room, t, S) {
  const bob = Math.sin(t * 4) * 1.5;
  for (const o of room.objects) {
    const evs = OBJ_EVIDENCE[o.key];
    if (!evs || evs.every(has)) continue;
    if (o.hidden && !S) continue;
    if (game.target && game.target.obj === o) continue;
    const [sx, sy] = iso(o.x + (o.w || 1) / 2, o.y + (o.d || 1) / 2, o.solid ? 24 : 12);
    const col = o.scan && !S ? '#38f6ff' : '#ffd23f';
    ctx.fillStyle = rgba(col, 0.9);
    ctx.beginPath(); ctx.moveTo(sx, sy - 6 + bob); ctx.lineTo(sx + 1.6, sy - 4 + bob); ctx.lineTo(sx, sy - 2 + bob); ctx.lineTo(sx - 1.6, sy - 4 + bob); ctx.fill();
  }
  for (const n of npcsHere()) {
    if (!npcHasNews(n, S) || (game.target && game.target.npc === n)) continue;
    const [sx, sy] = iso(n.fx + 0.5, n.fy + 0.5);
    if (sx < -10 || sx > VW + 10 || sy < -10 || sy > VH + 40) continue;
    const y = sy - (NPCS[n.id].seated ? 34 : 33) + bob + (waterAt(game.roomData, n.x, n.y) ? 9 : 0);
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(sx - 0.75, y, 1.5, 4); ctx.fillRect(sx - 0.75, y + 5, 1.5, 1.5);
  }
}

// anel no chão + seta sobre o alvo selecionado
function drawTargetRing(tg, t) {
  const [cx, cy] = targetCenter(tg);
  const [sx, sy] = iso(cx, cy);
  const r = tg.obj && ((tg.obj.w || 1) > 1 || tg.obj.cx !== undefined) ? 12 : 8;
  ctx.strokeStyle = rgba('#38f6ff', 0.55 + 0.25 * Math.sin(t * 6));
  ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.ellipse(sx, sy, r, r / 2, 0, 0, Math.PI * 2); ctx.stroke();
}
function drawTargetMarker(tg, t) {
  const [cx, cy] = targetCenter(tg);
  const tall = tg.npc || tg.walker ? 32 : tg.obj.kind === 'shopfront' ? 22 : tg.obj.solid ? 26 : 12;
  const [sx, sy] = iso(cx, cy, tall);
  const bob = Math.sin(t * 5) * 1.5;
  ctx.fillStyle = '#38f6ff';
  ctx.beginPath(); ctx.moveTo(sx - 3, sy - 6 + bob); ctx.lineTo(sx + 3, sy - 6 + bob); ctx.lineTo(sx, sy - 2 + bob); ctx.fill();
}

// ---------- fome, sede e cansaço (0 = bem, 100 = no limite) ----------
const NEED_RATE = { fome: 100 / 1500, sede: 100 / 1080, cansaco: 100 / 2100 };
const NEED_LABEL = { fome: 'fome', sede: 'sede', cansaco: 'cansaço' };

function updateNeeds(dt) {
  if (game.modal) return;
  const n = game.needs;
  const mult = game.combat ? 3 : game.driving ? 1.3 : 1;
  for (const k in NEED_RATE) n[k] = Math.min(100, n[k] + NEED_RATE[k] * dt * (k === 'cansaco' ? mult : 1) * gearNeed(k));
  for (const k in n) {
    if (n[k] >= 75 && !game.needWarn[k]) {
      game.needWarn[k] = true;
      toast('<span class="k">⚠</span> ' + T(k === 'fome' ? 'Vance está com muita fome. Procure uma máquina ou um lugar para comer.' : k === 'sede' ? 'Vance está com muita sede. Procure uma máquina ou um lugar para beber.' : 'Vance está com muito cansaço. Hora de ir para casa dormir.'), 'ev');
    }
    if (n[k] < 60) game.needWarn[k] = false;
  }
  // no limite (100%), Vance desmaia e acorda na própria cama
  if (!game.combat && !game.gathering) for (const k in NEED_RATE) if (n[k] >= 100) return faint(k);
  // cansaço extremo: piscadas de sono
  if (n.cansaco >= 90) { game.blink -= dt; if (game.blink < -6 - Math.random() * 4) game.blink = 0.6; }
  else game.blink = 0;
  updateNeedsHud();
}

// penalidade de velocidade quando alguma necessidade está no limite
function needSpeed() {
  const n = game.needs;
  let m = 1;
  if (n.fome >= 95 || n.sede >= 95) m *= 0.65;
  if (n.cansaco >= 90) m *= 0.75;
  return m;
}

function updateNeedsHud() {
  for (const k of ['fome', 'sede', 'cansaco']) {
    const v = game.needs[k], el = $('need-' + k);
    el.style.width = Math.round(v) + '%';
    el.parentElement.classList.toggle('warn', v >= 75);
    el.parentElement.parentElement.dataset.num = hasGear('relogio') ? Math.round(v) + '%' : '';
  }
}

function drawNeedsFx() {
  if (game.blink > 0) {
    const a = Math.sin(game.blink / 0.6 * Math.PI);
    ctx.fillStyle = `rgba(0,0,0,${a * 0.92})`;
    ctx.fillRect(-10, -10, VW + 20, VH + 20);
    game.blink -= 1 / 60;
  }
  const n = game.needs;
  if (n.fome >= 95 || n.sede >= 95) {
    ctx.fillStyle = `rgba(80,0,20,${0.12 + 0.06 * Math.sin(game.t * 3)})`;
    ctx.fillRect(-10, -10, VW + 20, VH + 20);
  }
}

// alivia necessidades (valores positivos reduzem)
function relieve(v, quiet) {
  const n = game.needs, parts = [];
  for (const k of ['fome', 'sede', 'cansaco']) {
    if (!v[k]) continue;
    n[k] = Math.max(0, Math.min(100, n[k] - v[k]));
    parts.push(`${T(NEED_LABEL[k])} ${v[k] > 0 ? '−' : '+'}${Math.abs(Math.round(v[k]))}`);
  }
  updateNeedsHud();
  if (!quiet && parts.length) toast(parts.join(' · '));
  return parts.join(' · ');
}

function openVendor(key, info) {
  const v = VENDORS[key], n = game.needs;
  message(v.title, (info ? info + '\n\n' : '') + T('Fome {0}% · Sede {1}% · Cansaço {2}%\n\nO que vai ser?', Math.round(n.fome), Math.round(n.sede), Math.round(n.cansaco)),
    v.items.map(id => ({ label: CONSUMABLES[id].name, fn: () => consume(id) })).concat([{ label: 'Nada', fn: closeModal }]));
}

function consume(id) {
  const c = CONSUMABLES[id];
  const fx = relieve(c, true);
  Sound.play('click');
  message(c.name, `${c.text}\n\n${fx}`);
}

// desmaio: alguém leva Vance para casa; ele acorda deitado na cama, horas depois
function faint(k) {
  const n = game.needs;
  if (game.driving) { const c = game.car; resetCar({ x: c.x, y: c.y, ang: c.ang }); game.car = null; game.driving = false; }
  game.player.seat = null; game.busy = null; game.outfit = null;
  enterRoom('home', [5, 4], true);
  lieDown(ROOMS.home.objects.find(o => o.key === 'cama_casa'));
  n.fome = Math.min(n.fome, 45); n.sede = Math.min(n.sede, 45); n.cansaco = k === 'cansaco' ? 0 : Math.min(n.cansaco, 30);
  for (const j in game.needWarn) game.needWarn[j] = false;
  game.clock += 8 * 60 * 6;
  updateNeedsHud();
  game.modal = 'card';
  const el = $('card');
  el.innerHTML = `<div class="card-in"><div class="card-title" style="font-size:2em">${T('Vance desmaia')}</div><div class="card-sub">${T(k === 'fome' ? 'O estômago vazio cobra a conta. As pernas cedem no meio do caminho.' : k === 'sede' ? 'A boca seca, a visão turva. O chão vem ao encontro dele.' : 'Os olhos fecham sozinhos. O corpo simplesmente desliga.')}</div><div class="card-hint">${T('toque para acordar')}</div></div>`;
  show('card');
  Sound.setMusic('home');
  saveGame();
  el.onclick = () => { hide('card'); game.modal = null; message('Acordando em casa', 'Vance abre os olhos na própria cama, ainda de roupa. Não lembra como chegou. Byte apita, preocupado, no travesseiro ao lado.\n\nOito horas perdidas. Coma, beba e durma direito, detetive.'); };
}

// vasculhar a sucata do ferro-velho: o núcleo K-9 aparece no terceiro monte revirado
const SCRAP_JUNK = [
  'Braços robóticos enferrujados, um aspirador de pó com IA e um rádio que ainda toca bossa-nova. Nada de núcleo K-9.',
  'Placas-mãe derretidas, um capacete de piloto e uma boneca sem cabeça. Nada útil aqui.',
  'Repulsores quebrados e um letreiro de neon que diz "ABERT". Nenhum sinal da peça.',
  'Só ferro torcido e fiação queimada. Vance corta a mão num pedaço de chapa.',
];
function searchScrap(o) {
  if (!game.flags.missao_peca) return message('Monte de sucata', 'Uma montanha de lixo eletrônico, carcaças e peças de androide. Sem saber o que procurar, não adianta revirar.');
  if (game.flags.peca_ok) return message('Monte de sucata', 'Você já achou o núcleo K-9. O resto é só ferro-velho.');
  const done = game.flags.sucata || [];
  if (done.includes(o.pile)) return message('Monte de sucata', 'Você já revirou este monte. Tente outro.');
  game.player.path = [];
  Sound.play('clank');
  startBusy('search', 2.4, () => {
    done.push(o.pile); game.flags.sucata = done;
    Sound.play('clank');
    if (done.length >= 3) {
      game.flags.peca_ok = true; updateHud(); saveGame();
      toast(`<span class="k">◆</span> ${T('Núcleo de sincronia K-9')}`, 'ev');
      return message('Núcleo de sincronia K-9', 'No fundo do monte, embrulhado num saco antiestático, um cilindro do tamanho de um punho com o selo K-9. Intacto.\n\nHora de levar a peça para C4mpt0n.');
    }
    saveGame();
    message('Monte de sucata', SCRAP_JUNK[(o.pile + done.length) % SCRAP_JUNK.length]);
  }, o);
}

// dormir: Vance já está deitado; a tela escurece e passam seis horas
function sleep() {
  game.modal = 'card';
  const el = $('card');
  el.innerHTML = '<div class="card-in"><div class="card-title" style="font-size:2em">zzz</div><div class="card-sub">Vance dorme seis horas. A chuva não para.</div><div class="card-hint">toque para acordar</div></div>';
  show('card');
  Sound.setMusic('home');
  game.needs.cansaco = 0;
  game.needs.fome = Math.min(100, game.needs.fome + 15);
  game.needs.sede = Math.min(100, game.needs.sede + 20);
  game.clock += 6 * 60 * 6;
  updateNeedsHud();
  saveGame();
  el.onclick = () => { hide('card'); game.modal = null; message('Bom dia, Vance', 'Byte está sentado no seu peito, piscando os LEDs. Lá fora, o Sector 4 continua escuro e encharcado.\n\nO caso ainda espera por você.'); };
}

function healthReport() {
  const n = game.needs, lvl = v => T(v < 30 ? 'ótimo' : v < 60 ? 'aceitável' : v < 85 ? 'preocupante' : 'crítico');
  return T('Fome: {0} ({1}%). Sede: {2} ({3}%). Cansaço: {4} ({5}%). Recomendação: {6}', lvl(n.fome), Math.round(n.fome), lvl(n.sede), Math.round(n.sede), lvl(n.cansaco), Math.round(n.cansaco),
    T(n.cansaco > 70 ? 'dormir em casa.' : n.fome > 60 ? 'comer algo; a barraca do Sr. Wen fica em Chinatown.' : n.sede > 60 ? 'hidratar-se.' : 'continuar trabalhando, detetive.'));
}

// ============================================================
// Acusação: todos reunidos no lobby do hotel
// ============================================================
const GATHER_SPOTS = { victor: [6, 6], evelyn: [7, 5], helena: [9, 5], tomas: [10, 6] };

function askGather() {
  closeModal();
  // o caso 2 não tem reunião no lobby do hotel: a acusação é feita direto
  if (game.caseId === 'eco') return message('Acusação', 'Está pronto para fazer a acusação?', [
    { label: 'Fazer a acusação', fn: () => { closeModal(); openAccuse(); } },
    { label: 'Ainda não', fn: () => { closeModal(); openPalace(); } },
  ]);
  message('Acusação', 'Reunir todos no lobby?', [
    { label: 'Sim, reunir todos', fn: gatherInLobby },
    { label: 'Ainda não', fn: () => { closeModal(); openPalace(); } },
  ]);
}

function gatherInLobby() {
  closeModal();
  if (game.driving) { const c = game.car; resetCar({ x: c.x, y: c.y, ang: c.ang }); game.car = null; game.driving = false; }
  game.outfit = null;
  enterRoom('lobby', [8, 8], true);
  const lobby = ROOMS.lobby;
  const saved = lobby.npcs.map(n => ({ n, x: n.x, y: n.y }));
  const tomas = { id: 'tomas', x: 8, y: 5, temp: true };
  lobby.npcs.push(tomas);
  game.gathering = { saved };
  for (const n of lobby.npcs) {
    initAgent(n, lobby);
    const s = GATHER_SPOTS[n.id];
    if (s) { n.x = n.fx = s[0]; n.y = n.fy = s[1]; n.path = []; n.moving = false; n.pose = null; }
  }
  for (const w of lobby._walkers || []) if (w.lines === 'hotelcops') { w.x = w.fx = 1 + (w.look === 'cop2'); w.y = w.fy = 5 + (w.look === 'cop2'); w.path = []; w.moving = false; }
  const p = game.player;
  p.dir = [-1, -1]; p.face = true;
  updateCamera(lobby, p.px + 0.5, p.py + 0.5, 0, true);
  Sound.play('act');
  message('Lobby do Hotel Alvorada', 'Vance reúne todos no lobby: Evelyn Pendelton, Victor Rossi, a Dra. Helena Souza e Tomás Bruno. Os policiais fecham as portas. A chuva bate no vidro.\n\nNinguém fala. Todos olham para o detetive.', [
    { label: 'Fazer a acusação', fn: () => { closeModal(); openAccuse(); } },
  ]);
}

function endGathering() {
  const lobby = ROOMS.lobby, g = game && game.gathering;
  lobby.npcs = lobby.npcs.filter(n => !n.temp);
  if (g) for (const { n, x, y } of g.saved) { n.x = n.fx = x; n.y = n.fy = y; n.path = []; n.moving = false; }
  if (game) game.gathering = null;
}

// ---------- emboscadas ----------
// O atirador encapuzado alterna entre coberturas e atira; os tiros de Vance sempre desviam.
const AMBUSHES = {
  tunnels: {
    spawn: [2.5, 0.6], escape: [2.5, 0.5], cover: [[2.5, 2.5], [4.5, 2.4], [6.5, 2.6], [3.5, 3.5], [5.5, 3.4]],
    flag: 'tiroteio', evidence: 'e_tiroteio', title: 'Emboscada', warn: 'Uma figura encapuzada desce a escada!',
    hit: 'Um tiro de raspão no ombro derruba Vance atrás dos canos. Quando ele consegue se levantar, a figura já está na escada, subindo para a escuridão.',
    miss: 'A figura encapuzada recua para a escada e some na escuridão do poço. Os tiros de Vance só arrancaram faíscas dos canos.',
    after: 'Ele não viu o rosto. Mas viu o suficiente: o atirador mancava, com o lado esquerdo pesado demais, e havia um brilho amarelo sob o capuz. Na escada de metal, cada passo soava seco. Clanc. Clanc.\n\nAlguém não quer que esta ferramenta saia dos túneis.',
  },
  // no vestiário da casa de banho, quando Vance veste a roupa para ir embora
  locker: {
    spawn: [6.5, 0.6], escape: [6.5, 0.5], cover: [[6.5, 2.5], [5.5, 4.5], [6.5, 4.4], [7.5, 3.5], [5.5, 2.4]],
    flag: 'tiroteio2', evidence: 'e_emboscada2', title: 'Segunda emboscada', warn: 'Alguém atravessa a cortina da sala de lavagem, armado!',
    hit: 'Uma bala de raspão joga Vance contra os armários. Quando ele levanta, só sobra a cortina balançando e pegadas molhadas no tatame.',
    miss: 'A figura encapuzada recua pela cortina e some no vapor da sala de lavagem. Os tiros de Vance só estilhaçaram o espelho.',
    after: 'O mesmo capuz. O mesmo passo manco, pesado do lado esquerdo. E o mesmo brilho amarelo.\n\nEle sabia que Vance estaria aqui. Alguém anda contando os passos do detetive.',
  },
};

Object.assign(AMBUSHES, ECO_AMBUSHES);
function startCombat() {
  const A = AMBUSHES[game.roomId] || AMBUSHES.tunnels;
  const p = game.player;
  p.path = []; game.pending = null; game.dest = null;
  game.combat = {
    t: 0, phase: 'intro', hp: 4, cd: 0, shots: 0, hitFlash: 0, gunFlash: 0, shake: 0.3,
    ambush: A,
    enemy: { x: A.spawn[0], y: A.spawn[1], tx: A.cover[0][0], ty: A.cover[0][1], alpha: 0, fireCd: 1.2, burst: 0, volleys: 0, flash: 0, face: false, moving: false, stepAcc: 0 },
    bullets: [], sparks: [],
  };
  Sound.setMusic('combat');
  Sound.play('clank');
  toast(`<span class="k">⚠ ${T('PERIGO')}</span> ${T(A.warn)}`, 'ev');
  updateCombatHud();
}

function updateCombatHud() {
  const C = game && game.combat;
  $('combat-hud').classList.toggle('hidden', !C);
  if (C) $('combat-hp').innerHTML = [0, 1, 2, 3].map(i => `<i class="${i < C.hp ? 'on' : ''}"></i>`).join('');
}

function updateCombat(dt) {
  const C = game.combat, e = C.enemy, p = game.player;
  const pcx = p.px + 0.5, pcy = p.py + 0.5;
  C.t += dt;
  C.hitFlash = Math.max(0, C.hitFlash - dt * 2.5);
  C.gunFlash -= dt; e.flash -= dt; C.cd -= dt;
  C.shake = Math.max(0, C.shake - dt * 1.5);
  // movimento do atirador (passos pesados e metálicos)
  const dx = e.tx - e.x, dy = e.ty - e.y, d = Math.hypot(dx, dy);
  e.moving = d > 0.05;
  if (e.moving) {
    const st = Math.min(d, (C.phase === 'escape' ? 3.6 : 2.6) * dt);
    e.x += dx / d * st; e.y += dy / d * st;
    e.stepAcc += st;
    if (e.stepAcc > 0.7) { e.stepAcc = 0; Sound.play('clank'); }
  }
  if (C.phase !== 'escape') e.alpha = Math.min(1, e.alpha + dt * 2);
  e.face = (pcx - pcy) < (e.x - e.y);
  if (C.phase === 'intro' && C.t > 1.4) C.phase = 'fight';
  if (C.phase === 'fight') {
    e.fireCd -= dt;
    if (!e.moving && e.fireCd <= 0) {
      enemyShoot(C, pcx, pcy);
      if (++e.burst >= 2) {
        e.burst = 0; e.volleys++; e.fireCd = 1.5;
        const opts = C.ambush.cover.filter(c => Math.hypot(c[0] - e.x, c[1] - e.y) > 0.5);
        [e.tx, e.ty] = opts[Math.floor(Math.random() * opts.length)];
      } else e.fireCd = 0.45;
    }
    if (e.volleys >= 6 || C.t > 24 || C.hp <= 0) { C.phase = 'escape'; [e.tx, e.ty] = C.ambush.escape; }
  }
  if (C.phase === 'escape' && !e.moving) {
    e.alpha -= dt * 2.5;
    if (e.alpha <= 0) return endCombat();
  }
  // balas: param no primeiro obstáculo sólido (cobertura funciona)
  for (const b of C.bullets) {
    b.px = b.x; b.py = b.y;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (solidAt(game.roomData, Math.floor(b.x), Math.floor(b.y))) {
      b.dead = true; spark(C, b.px, b.py);
      if (Math.random() < 0.6) Sound.play('ricochet');
    } else if (!b.enemy && Math.hypot(b.x - e.x, b.y - e.y) < 0.55) {
      // de raspão: a bala estoura no metal ao lado do atirador, nunca nele
      b.dead = true;
      const d = Math.hypot(b.vx, b.vy), side = Math.sign((b.x - e.x) * b.vy - (b.y - e.y) * b.vx) || 1;
      spark(C, e.x - b.vy / d * 0.6 * side, e.y + b.vx / d * 0.6 * side);
      Sound.play('ricochet');
    } else if (b.enemy && Math.hypot(b.x - pcx, b.y - pcy) < 0.3 && C.hp > 0) {
      b.dead = true; C.hp--; C.hitFlash = 1; C.shake = 0.5;
      Sound.play('hurt'); updateCombatHud();
    }
  }
  C.bullets = C.bullets.filter(b => !b.dead);
  for (const s of C.sparks) { s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 60 * dt; s.life -= dt; }
  C.sparks = C.sparks.filter(s => s.life > 0);
}

function enemyShoot(C, tx, ty) {
  const e = C.enemy;
  const a = Math.atan2(ty - e.y, tx - e.x) + (Math.random() - 0.5) * 0.22;
  C.bullets.push({ x: e.x, y: e.y, vx: Math.cos(a) * 9, vy: Math.sin(a) * 9, enemy: true });
  e.flash = 0.1;
  Sound.play('enemyShot');
}

// Vance atira no atirador e sempre erra: a mira sai deslocada para o lado
function playerShoot() {
  const C = game.combat;
  if (!C || C.cd > 0 || (C.phase === 'escape' && C.enemy.alpha < 0.5)) return;
  const p = game.player, e = C.enemy, cx = p.px + 0.5, cy = p.py + 0.5;
  const dx = e.x - cx, dy = e.y - cy, d = Math.hypot(dx, dy) || 1;
  const side = (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.45);
  const ax = e.x - dy / d * side, ay = e.y + dx / d * side;
  const a = Math.atan2(ay - cy, ax - cx);
  C.bullets.push({ x: cx, y: cy, vx: Math.cos(a) * 13, vy: Math.sin(a) * 13, enemy: false });
  p.face = (e.x - e.y) < (p.px - p.py);
  C.cd = 0.32; C.gunFlash = 0.09; C.shots++; C.shake = Math.max(C.shake, 0.15);
  Sound.play('gunshot');
}

// faíscas guardadas relativas à origem da câmera, para acompanharem o cenário
function spark(C, x, y) {
  const [sx, sy] = iso(x, y, 10);
  for (let k = 0; k < 9; k++) {
    const a = Math.random() * Math.PI * 2, v = 20 + Math.random() * 40;
    C.sparks.push({ x: sx - OX, y: sy - OY, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, life: 0.25 + Math.random() * 0.3 });
  }
}

function drawCombatFx(C) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  for (const b of C.bullets) {
    const a = iso(b.x - b.vx * 0.035, b.y - b.vy * 0.035, 10), z = iso(b.x, b.y, 10);
    ctx.strokeStyle = b.enemy ? 'rgba(255,90,60,0.95)' : 'rgba(255,230,150,0.95)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(z[0], z[1]); ctx.stroke();
  }
  for (const s of C.sparks) {
    ctx.fillStyle = `rgba(255,${180 + Math.floor(Math.random() * 60)},90,${Math.min(1, s.life * 3)})`;
    ctx.fillRect(s.x + OX, s.y + OY, 0.8, 0.8);
  }
  ctx.restore();
}

function endCombat() {
  const C = game.combat;
  const grazed = C.hp <= 0;
  const A = C.ambush;
  game.combat = null;
  game.flags[A.flag] = true;
  updateCombatHud();
  Sound.setRoom(game.roomId);
  give(A.evidence);
  message(A.title, T(grazed ? A.hit : A.miss) + '\n\n' + T(A.after));
}

// ---------- menu de pausa ----------
function openMenu() {
  if (!game || (game.modal && game.modal !== 'menu')) return;
  game.modal = 'menu';
  show('menu');
  menuView('main');
  renderMenu();
}
// a pausa tem duas telas: a principal e as Configurações
function menuView(v) {
  $('menu-main').classList.toggle('hidden', v !== 'main');
  $('menu-config').classList.toggle('hidden', v !== 'config');
  $('menu-head').textContent = T(v === 'config' ? 'CONFIGURAÇÕES' : 'PAUSA');
}
function renderMenu() {
  $('menu-sound').textContent = T(Sound.isMuted() ? '🔇 Som: desligado' : '🔊 Som: ligado');
  syncMusicSliders();
  $('menu-zoom').textContent = T('Zoom: {0}%', Math.round((ZOOM_MAX - game.zoom) / (ZOOM_MAX - ZOOM_MIN) * 100));
  $('menu-full').classList.toggle('hidden', IS_NATIVE || !document.documentElement.requestFullscreen);
}

function closableModal() { return ['msg', 'call','dialogue', 'evidence', 'palace', 'hack', 'accuse', 'menu', 'gps', 'lang'].includes(game.modal); }

function goBack() {
  if (Intro.isRunning()) { Intro.skip(); return; }
  if (!game) return;
  if (typing) { finishTyping(); return; }
  if (game.modal === 'accuse') { $('accuse-back').click(); return; }
  if (game.modal === 'menu' && !$('menu-config').classList.contains('hidden')) { menuView('main'); return; }
  if (closableModal()) { closeModal(); return; }
  if (!game.modal) openMenu();
}

document.addEventListener('keydown', ev => {
  const k = ev.key.toLowerCase();
  if (Intro.isRunning()) { if (k === 'escape') Intro.skip(); else if (k === 'enter' || k === ' ' || k === 'e') Intro.next(); return; }
  if (!game) return;
  // o Edge do Xbox também transforma o controle em teclas (setas, Enter, Esc): ignora o eco para não contar duas vezes
  if (performance.now() - (pad.lastPress || -1e9) < 250 && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter', 'escape', ' ', 'gamepada', 'gamepadb'].includes(k)) { ev.preventDefault(); return; }
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter', 'escape', ' '].includes(k)) pad.lastKey = performance.now();
  if (k === 'escape') { goBack(); return; }
  // dirigindo, o Espaço é o acelerador (tratado em city.js), não a tecla de ação
  if (k === ' ' && game.driving && !game.modal) { ev.preventDefault(); return; }
  if (k === 'e' || k === 'enter' || k === ' ') {
    ev.preventDefault();
    if (!ev.repeat) doAction();
    return;
  }
  if (game.modal) {
    if (k === 'arrowup' || k === 'arrowleft') { ev.preventDefault(); focusMove(-1); }
    else if (k === 'arrowdown' || k === 'arrowright' || k === 'tab') { ev.preventDefault(); focusMove(1); }
    if (game.modal !== 'evidence' && game.modal !== 'palace') return;
  }
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) { ev.preventDefault(); keys.add(k); return; }
  if (k === 'q') toggleScanner();
  else if (k === 'g') openGps();
  else if (k === 'b') { game.modal === 'msg' && $('msg-title').textContent.includes('🎒') ? closeModal() : (closeModal(), openBag()); }
  else if (k === 'i') { game.modal === 'evidence' ? closeModal() : (closeModal(), openEvidence()); }
  else if (k === 'm') { game.modal === 'palace' ? closeModal() : (closeModal(), openPalace()); }
  else if (k === '+' || k === '=') { setZoom(game.zoom * 0.9); saveZoom(); }
  else if (k === '-') { setZoom(game.zoom * 1.1); saveZoom(); }
});
document.addEventListener('keyup', ev => keys.delete(ev.key.toLowerCase()));
window.addEventListener('blur', () => keys.clear());

$('btn-scan').onclick = toggleScanner;
$('btn-ev').onclick = () => { if (!game.modal || game.modal === 'palace') { Sound.play('click'); closeModal(); openEvidence(); } };
$('btn-bag').onclick = () => { if (!game.modal || game.modal === 'msg') { Sound.play('click'); closeModal(); openBag(); } };
$('btn-palace').onclick = () => { if (!game.modal || game.modal === 'evidence') { Sound.play('click'); closeModal(); $('btn-palace').classList.remove('pulse'); openPalace(); } };
$('btn-menu').onclick = () => { Sound.play('click'); openMenu(); };
$('btn-accuse').onclick = askGather;
$('btn-gps').onclick = () => { Sound.play('click'); openGps(); };
$('minimap').addEventListener('click', minimapClick);
$('menu-resume').onclick = closeModal;
$('menu-sound').onclick = () => { Sound.toggleMute(); renderMenu(); };
$('menu-music').onclick = () => { Sound.toggleMusic(); renderMenu(); };
// barras de volume da música (menu de pausa e tela de título)
function onMusicSlider(e) {
  Sound.init();
  const v = +e.target.value / 100;
  if (v === 0 && Sound.musicOn()) Sound.toggleMusic();
  else if (v > 0) Sound.setMusicVolume(v);
  syncMusicSliders();
}
function syncMusicSliders() {
  const vol = Sound.musicOn() ? Math.round(Sound.musicVolume() * 100) : 0;
  for (const id of ['menu-music-vol', 'title-music-vol']) {
    $(id).value = vol;
    $(id).style.setProperty('--fill', vol + '%');
    $(id + '-val').textContent = vol + '%';
  }
  $('menu-music').textContent = T(Sound.musicOn() ? '♫ Música: ligada' : '♫ Música: desligada');
}
$('menu-music-vol').addEventListener('input', onMusicSlider);
// efeitos e vozes: ao soltar a barra, toca uma amostra no volume escolhido
function syncFxSliders() {
  for (const [id, v] of [['menu-sfx-vol', Sound.sfxVolume()], ['menu-voice-vol', Sound.voiceVolume()]]) {
    const p = Math.round(v * 100);
    $(id).value = p; $(id).style.setProperty('--fill', p + '%'); $(id + '-val').textContent = p + '%';
  }
}
$('menu-sfx-vol').addEventListener('input', e => { Sound.setSfxVolume(+e.target.value / 100); syncFxSliders(); });
$('menu-sfx-vol').addEventListener('change', () => Sound.play('evidence'));
$('menu-voice-vol').addEventListener('input', e => { Sound.setVoiceVolume(+e.target.value / 100); syncFxSliders(); });
$('menu-voice-vol').addEventListener('change', () => { for (let k = 0; k < 6; k++) setTimeout(() => Sound.voice(150), k * 70); });
syncFxSliders();
$('menu-settings').onclick = () => { Sound.play('click'); menuView('config'); renderMenu(); };
$('menu-back').onclick = () => { Sound.play('click'); menuView('main'); };
$('title-music-vol').addEventListener('input', onMusicSlider);
syncMusicSliders();
$('menu-zin').onclick = () => { setZoom(game.zoom * 0.88); saveZoom(); renderMenu(); };
$('menu-zout').onclick = () => { setZoom(game.zoom * 1.12); saveZoom(); renderMenu(); };
$('menu-full').onclick = () => { try { document.documentElement.requestFullscreen(); } catch (e) {} };
$('menu-title').onclick = () => { saveGame(); closeModal(); endGathering(); game = null; Sound.engine(false); engineOn = false; document.body.classList.remove('driving'); $('drive-btns').classList.add('hidden'); document.body.classList.remove('in-city'); $('combat-hud').classList.add('hidden'); showTitle(); };
$('hack-canvas').addEventListener('click', hackClick);
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => { Sound.play('click'); closeModal(); });
$('msg-text').addEventListener('click', () => textTap('msg-options'));
$('dlg-text').addEventListener('click', () => textTap('dlg-options'));
$('call-text').addEventListener('click', () => textTap('call-options'));

// ---------- ciclo de vida (Android / navegador) ----------
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { saveGame(); Sound.suspend(); keys.clear(); } else Sound.resume();
});
if (IS_NATIVE && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
  const App = window.Capacitor.Plugins.App;
  App.addListener('backButton', () => {
    if (!game) { if (!$('title').classList.contains('hidden')) App.exitApp(); return; }
    goBack();
  });
  App.addListener('pause', () => { saveGame(); Sound.suspend(); });
  App.addListener('resume', () => Sound.resume());
}
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !IS_NATIVE) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ---------- resolução do caso ----------
function resolveCase(killer, second) {
  if (game.caseId === 'eco') return ecoResolve(killer, second);
  if (killer === 'evelyn') return showEnding('errado');
  if (killer === 'tomas') return showEnding('errado_tomas');
  if (killer === 'helena') return showEnding('incompleto');
  const proof = has('d_arma') && has('d_hora') && (has('d_braco') || has('d_trava') || has('d_atirador') || has('d_chantagem') || has('d_sabotagem'));
  if (!proof) return showEnding('fraco');
  const helenaProof = has('d_veneno') && has('d_hack');
  if (second === 'helena' && helenaProof) return showEnding('perfeito');
  let extra;
  if (second === 'helena') extra = T('Você acusou a Dra. Helena, mas sem ligar o NX-7 e os óculos AR ao crime, a acusação não para em pé. Ela deixa o Sector 4 no primeiro transporte aéreo.');
  else if (second === 'evelyn' || second === 'tomas') extra = T('Pior: você arrastou {0}, um inocente nessa história, para o tribunal. E a mulher que envenenou Arthur com NX-7 nunca foi sequer interrogada a sério.', NPCS[second].name);
  else extra = T('Ninguém pergunta como Arthur ficou paralisado antes do golpe. A Dra. Helena Souza e seu NX-7 saem impunes, com as patentes de volta nas mãos.');
  showEnding('quase', extra);
}

// ---------- tela de título ----------
function startAudioAndScreen() {
  Sound.init();
  if (!IS_NATIVE) {
    try { if (window.innerWidth < 1000 && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); } catch (e) {}
    try { screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape').catch(() => {}); } catch (e) {}
  }
}

function showTitle() {
  hideAllScreens();
  show('title');
  Sound.setMusic('title');
  renderCaseList();
  fitTitle();
  titleRain();
}

// os dois casos, cada um com o progresso guardado e os botões de continuar / abrir
function renderCaseList() {
  const list = $('case-list');
  list.innerHTML = '';
  for (const id of CASE_IDS) {
    const C = CASES[id], s = readSave(id);
    // saves anteriores ao registro de progresso: a porcentagem sai das evidências do próprio save
    const total = Object.keys(C.EVIDENCE).length + C.DEDUCTIONS.length;
    const pct = Math.max(caseProgress(id), s ? Math.round(Math.min(95, 95 * (s.evidence.length + s.deductions.length) / total)) : 0);
    const card = document.createElement('div');
    card.className = 'case-card' + (id === 'eco' ? ' case-eco' : '');
    const info = s ? `${C.ACTS[s.act] ? T(C.ACTS[s.act].title) : ''} · ${T('{0} evidências', s.evidence.length)} · ${new Date(s.date).toLocaleString(I18N.locale(), { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}` : T(pct >= 100 ? 'Caso resolvido' : 'Caso não iniciado');
    card.innerHTML = `<div class="case-head"><b>${T(C.title)}</b><small>${T(C.tag)}</small></div>
      <div class="case-bar"><i style="width:${pct}%"></i></div><div class="case-meta"><span>${info}</span><span class="case-pct">${T('{0}% concluído', pct)}</span></div>`;
    const btns = document.createElement('div');
    btns.className = 'case-btns';
    if (s) btns.appendChild(button('▶ Continuar caso', () => { startAudioAndScreen(); hide('title'); continueGame(id); }));
    btns.appendChild(button(s ? 'Recomeçar' : '▶ Abrir o caso', () => {
      if (s && !confirm(T('Recomeçar apaga o progresso salvo deste caso. Continuar?'))) return;
      startAudioAndScreen(); hide('title'); clearSave(id); newGame(false, id);
    }, s ? 'ghost' : ''));
    btns.appendChild(button('Ver introdução', () => { startAudioAndScreen(); Intro.play(() => Sound.setMusic('title'), 0, 0, id); }, 'ghost'));
    card.appendChild(btns);
    list.appendChild(card);
  }
}

// a tela de título nunca rola: se o conteúdo passar da altura da janela, ele encolhe por inteiro
function fitTitle() {
  const el = document.querySelector('.title-in');
  if (!el || $('title').classList.contains('hidden')) return;
  el.style.transform = '';
  const s = Math.min(1, (window.innerHeight - 8) / el.scrollHeight, (window.innerWidth - 8) / el.scrollWidth);
  if (s < 1) el.style.transform = `scale(${s})`;
}
window.addEventListener('resize', fitTitle);
if (document.fonts) document.fonts.ready.then(fitTitle);

// ---------- idioma ----------
function langLabel() { return '🌐 ' + (I18N.lang === 'pt' ? 'Idioma' : T('Idioma') + ' / Language') + ': ' + LANGS[I18N.lang].name; }
function openLang() {
  if (game) game.modal = 'lang';
  show('lang');
  const list = $('lang-list');
  list.innerHTML = '';
  for (const code in LANGS) {
    const b = document.createElement('button');
    b.textContent = (code === I18N.lang ? '● ' : '') + LANGS[code].name;
    b.onclick = () => {
      Sound.play('click');
      if (code === I18N.lang) { hide('lang'); if (game) game.modal = null; return; }
      if (game) { saveGame(); try { sessionStorage.setItem('alvorada_autocontinue', game.caseId); } catch (e) {} }
      I18N.set(code);   // recarrega o jogo já no idioma escolhido (o progresso fica salvo)
    };
    list.appendChild(b);
  }
}
$('btn-lang').onclick = () => { Sound.play('click'); openLang(); };
// detetive homem ou mulher (troca os textos e recarrega; vale para o próximo caso e para o save)
$('menu-lang').onclick = () => { Sound.play('click'); closeModal(); openLang(); };

Intro.bind();
I18N.apply();
document.title = T('Detetive Gabriel Vance');
$('btn-lang').textContent = $('menu-lang').textContent = langLabel();
// a primeira interação libera o áudio (exigência dos navegadores)
document.addEventListener('pointerdown', () => Sound.init(), { once: true });
document.addEventListener('keydown', () => Sound.init(), { once: true });
resizeView(loadZoom());
requestAnimationFrame(frame);

// atalho de depuração: index.html#room=lobby&act=3&scan&all&ui=palace
if (location.hash.length > 1) {
  const q = new URLSearchParams(location.hash.slice(1));
  hide('title'); newGame(); hide('card'); closeModal();
  if (q.get('act')) game.act = +q.get('act');
  if (q.get('room')) enterRoom(q.get('room'), q.get('room') === 'city' ? CITY.map(15, 17) : [2, 1], true);
  if (q.get('at')) { let [x, y] = q.get('at').split(',').map(Number); if (game.roomId === 'city') [x, y] = CITY.map(x, y); game.player.px = game.player.x = x; game.player.py = game.player.y = y; updateCamera(game.roomData, x + 0.5, y + 0.5, 0, true); }
  if (q.has('scan')) game.scanner = true;
  if (q.has('touch')) document.body.classList.add('touch');
  if (q.has('towel')) game.outfit = 'towel';
  if (q.has('drive') && game.roomId === 'city') { const c = playerCar(); c.cx = game.player.px + 0.5; c.cy = game.player.py + 0.5; c.ang = +(q.get('ang') || 0); invalidateGrid(ROOMS.city); enterCar(c); if (q.get('gps')) setGps(q.get('gps')); }
  else if (q.get('gps')) setGps(q.get('gps'));
  if (q.get('needs')) { const [f, s2, c] = q.get('needs').split(',').map(Number); Object.assign(game.needs, { fome: f, sede: s2, cansaco: c }); }
  if (q.get('intro')) { const [i, o] = q.get('intro').split(',').map(Number); game.modal = 'intro'; Intro.play(() => { game.modal = null; }, i, o || 0); }
  if (q.has('all')) { EV_KEYS.forEach(k => { if (!has(k)) game.evidence.push(k); }); }
  if (q.get('zoom')) setZoom(+q.get('zoom'));
  if (q.get('sit')) { const o = game.roomData.objects.find(o2 => o2.key === q.get('sit')); if (o) { sit(o); game.inputLock = false; } }
  if (q.get('lie')) { const o = game.roomData.objects.find(o2 => o2.key === q.get('lie')); if (o) lieDown(o); }
  if (q.get('shower')) { const o = game.roomData.objects.find(o2 => o2.key === 'chuveiro'); if (o) takeShower(o); }
  if (q.get('cook')) { const o = game.roomData.objects.find(o2 => o2.key === 'fogao'); if (o) { o.on = true; startBusy('cook', 99, null, o); } }
  if (q.has('gather')) gatherInLobby();
  if (q.get('ui')) ({ palace: openPalace, evidence: openEvidence, hack: () => openHack('TESTE', () => {}), accuse: openAccuse, menu: openMenu, config: () => { openMenu(); menuView('config'); renderMenu(); }, gps: openGps, talk: () => openDialogue(q.get('npc') || 'victor') })[q.get('ui')]();
  if (q.has('closemsg')) closeModal();
  updateHud();
} else {
  showTitle();
  let auto = false;
  try { auto = sessionStorage.getItem('alvorada_autocontinue'); sessionStorage.removeItem('alvorada_autocontinue'); } catch (e) {}
  if (auto && CASES[auto]) { hide('title'); continueGame(auto); }
}

// chuva na tela de título
function titleRain() {
  const c = $('title-rain'), g = c.getContext('2d');
  const drops = Array.from({ length: 120 }, () => ({ x: Math.random() * 480, y: Math.random() * 270, v: 3 + Math.random() * 4 }));
  (function loop() {
    if ($('title').classList.contains('hidden')) return;
    g.fillStyle = 'rgba(5,3,12,0.35)'; g.fillRect(0, 0, 480, 270);
    g.fillStyle = 'rgba(120,160,255,0.6)';
    for (const d of drops) { g.fillRect(d.x, d.y, 1, 5); d.y += d.v; d.x -= 0.6; if (d.y > 270) { d.y = -6; d.x = Math.random() * 500; } }
    requestAnimationFrame(loop);
  })();
}
