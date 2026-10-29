// ============================================================
// Interface: mensagens, diálogos, evidências, Palácio, hack, acusação
// ============================================================

const $ = id => document.getElementById(id);
const EV_KEYS = Object.keys(EVIDENCE);
const pickOne = arr => arr[Math.floor(Math.random() * arr.length)];

function show(el) { $(el).classList.remove('hidden'); }
function hide(el) { $(el).classList.add('hidden'); }

function closeModal() {
  ['msg', 'call', 'dialogue', 'evidence', 'palace', 'hack', 'accuse', 'menu', 'gps', 'lang'].forEach(hide);
  if (game) game.modal = null;
  stopTyping();
}

function button(label, fn, cls) {
  const b = document.createElement('button');
  b.textContent = T(label);
  if (cls) b.className = cls;
  b.onclick = () => { Sound.play('click'); fn(); };
  return b;
}

// ---------- toast ----------
let toastTimer = null;
function toast(html, cls = '') {
  const el = $('toast');
  el.innerHTML = T(html);
  el.className = 'show ' + cls;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = ''; }, 3200);
}

// ---------- máquina de escrever ----------
let typing = null;
// voz de quem está falando no diálogo: tom em Hz, 'cat' (Byte) ou null (pensamento)
let talkVoice = null;
const VOICE_PITCH = { victor: 95, goro: 90, zeca: 100, wen: 110, okafor: 165, evelyn: 210, helena: 195, hana: 240, bao: 290, lumi: 250, iris: 230, nozomi: 220, kyomi: 245, su: 225, lin: 200, campton: 140 };
function voiceFor(id) {
  if (VOICE_PITCH[id]) return VOICE_PITCH[id];
  let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 997;
  return 110 + h % 150;
}
function typeText(el, text, done) {
  stopTyping();
  let i = 0;
  el.textContent = '';
  typing = { el, text, done, iv: setInterval(() => {
    i += 2;
    el.textContent = text.slice(0, i);
    if ((el.id === 'dlg-text' || el.id === 'msg-text' || el.id === 'call-text') && talkVoice) {
      // fala: blablablá no tom de quem fala; o Byte mia no começo da fala
      if (talkVoice === 'cat') { if (i === 2) Sound.play('meow'); }
      else if (i % 6 === 2) Sound.voice(talkVoice);
    } else if (i % 6 === 0) Sound.play('type');
    if (i >= text.length) finishTyping();
  }, 16) };
}
function finishTyping() {
  if (!typing) return false;
  const t = typing;
  clearInterval(t.iv);
  t.el.textContent = t.text;
  typing = null;
  if (t.done) t.done();
  return true;
}
function stopTyping() { if (typing) { clearInterval(typing.iv); typing = null; } }

// toque no texto: completa a frase ou avança
function textTap(optsId) {
  if (finishTyping()) return;
  const c = $(optsId).querySelector('[data-continue]');
  if (c) c.click();
}

// ---------- mensagem genérica ----------
function message(title, text, buttons, voice) {
  talkVoice = voice || null;   // pitch de quem fala (figurantes); sem voz, só o tec-tec da máquina
  game.modal = 'msg';
  show('msg');
  $('msg-title').textContent = T(title);
  const opts = $('msg-options');
  opts.innerHTML = '';
  const list = buttons || [{ label: '▶ Continuar', fn: closeModal }];
  typeText($('msg-text'), T(text), () => {
    list.forEach((b, i) => {
      const btn = button(b.label, b.fn);
      if (i === 0 && list.length === 1) btn.dataset.continue = '1';
      opts.appendChild(btn);
    });
  });
}

// ---------- retratos ----------
// fotos realistas opcionais: img/portraits/<look>.jpg substitui o retrato em pixel art quando existe
const PHOTOS = {};
function photo(src, onload) {
  if (!(src in PHOTOS)) { const im = new Image(); PHOTOS[src] = null; im.onload = () => { PHOTOS[src] = im; if (onload) onload(); }; im.src = src; }
  return PHOTOS[src];
}
function drawCover(c, im, W, H, zoom = 1, top = 0.5) {   // top: 0 = encosta no alto (rostos em fotos verticais)
  const s = Math.max(W / im.width, H / im.height) * zoom, w = im.width * s, h = im.height * s;
  c.drawImage(im, (W - w) / 2, (H - h) * top, w, h);
}

function drawPortrait(canvasEl, lookKey) {
  const c = canvasEl.getContext('2d');
  const ph = photo(`img/portraits/${lookKey.replace('_bath', '')}.jpg`, () => drawPortrait(canvasEl, lookKey));
  if (ph) { c.imageSmoothingEnabled = true; drawCover(c, ph, canvasEl.width, canvasEl.height, 1, 0.15); return; }
  c.imageSmoothingEnabled = false;
  c.clearRect(0, 0, canvasEl.width, canvasEl.height);
  const g = c.createLinearGradient(0, 0, 0, canvasEl.height);
  g.addColorStop(0, '#1a0f2e'); g.addColorStop(1, '#05030c');
  c.fillStyle = g; c.fillRect(0, 0, canvasEl.width, canvasEl.height);
  // busto: linhas 2 a 32 do sprite, ampliado sem suavização
  const spr = getSprite(lookKey, 'stand');
  const s = Math.floor(canvasEl.height / 30);
  const L = LOOKS[lookKey];
  c.save();
  if (L.holo) c.globalAlpha = 0.7 + 0.2 * Math.sin((game ? game.t : 0) * 9);
  c.drawImage(spr, 0, 2, SPR_W, 30, (canvasEl.width - SPR_W * s) / 2, canvasEl.height - 30 * s, SPR_W * s, 30 * s);
  c.restore();
  // luz neon lateral
  const rim = c.createLinearGradient(canvasEl.width, 0, canvasEl.width * 0.5, 0);
  rim.addColorStop(0, rgba(L.implant, 0.18)); rim.addColorStop(1, rgba(L.implant, 0));
  c.fillStyle = rim; c.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

// ---------- chamada ----------
// Vance à esquerda, o outro (npcId) à direita; lines: ['V' | 'N' | 'I' | '' (narração), texto]
function phoneCall(title, npcId, lines, done) {
  game.modal = 'call';
  show('call');
  $('call-title').textContent = T(title);
  const L = $('call-l'), R = $('call-r');
  L.querySelector('span').textContent = T('GABRIEL VANCE');
  R.querySelector('span').textContent = NPCS[npcId].name.toUpperCase();
  drawPortrait(L.querySelector('canvas'), playerLook());
  drawPortrait(R.querySelector('canvas'), NPCS[npcId].look);
  const step = i => {
    if (i >= lines.length) { closeModal(); if (done) done(); return; }
    const [who, text] = lines[i];
    L.classList.toggle('talking', who === 'V');
    R.classList.toggle('talking', who === 'N');
    const sp = $('call-speaker');
    sp.textContent = who === 'V' ? T('GABRIEL VANCE') : who === 'N' ? NPCS[npcId].name.toUpperCase() : who === 'I' ? T('PENSAMENTO DE VANCE') : '';
    sp.className = who === 'V' ? 'vance' : who === 'I' ? 'inner' : '';
    $('call-text').classList.toggle('inner', who === 'I' || !who);
    talkVoice = who === 'V' ? 105 : who === 'N' ? voiceFor(npcId) : null;
    const opts = $('call-options');
    opts.innerHTML = '';
    typeText($('call-text'), T(text), () => {
      const b = button(i === lines.length - 1 ? '▶ Desligar' : '▶ Continuar', () => step(i + 1));
      b.dataset.continue = '1';
      opts.appendChild(b);
    });
  };
  step(0);
}

// ---------- diálogo ----------
function topicAvailable(tp) {
  if (tp.requires && !tp.requires.every(has)) return false;
  if (tp.requiresSeen && !tp.requiresSeen.every(s => game.seen.has(s))) return false;
  if (tp.requiresFlag && !game.flags[tp.requiresFlag]) return false;
  return true;
}
function topicFresh(tp) { return !tp.repeat && topicAvailable(tp) && !game.seen.has(tp.id); }

let portraitTimer = null;
function openDialogue(id) {
  const npc = NPCS[id];
  game.modal = 'dialogue';
  game.talkingTo = id;
  show('dialogue');
  $('dlg-name').textContent = npc.name;
  $('dlg-role').textContent = npc.role;
  clearInterval(portraitTimer);
  drawPortrait($('dlg-portrait'), npc.look);
  if (npc.holo) portraitTimer = setInterval(() => { if (game.modal === 'dialogue') drawPortrait($('dlg-portrait'), npc.look); }, 120);
  const first = !game.seen.has(id);
  game.seen.add(id);
  showTopics(id, first ? npc.intro : pickOne(npc.again), 'N');
}

function setSpeaker(id, who) {
  const el = $('dlg-speaker');
  talkVoice = who === 'I' ? null : who === 'V' ? (I18N.gender === 'f' ? 200 : 105) : id === 'byte' ? 'cat' : voiceFor(id);
  if (who === 'V') { el.textContent = T('GABRIEL VANCE'); el.className = 'vance'; }
  else if (who === 'I') { el.textContent = T('PENSAMENTO DE VANCE'); el.className = 'inner'; }
  else { el.textContent = NPCS[id].name.toUpperCase(); el.className = ''; }
  $('dlg-text').classList.toggle('inner', who === 'I');
}

function showTopics(id, text, who) {
  const npc = NPCS[id];
  setSpeaker(id, who);
  const opts = $('dlg-options');
  opts.innerHTML = '';
  typeText($('dlg-text'), text, () => {
    npc.topics.filter(topicAvailable).forEach(tp => {
      const cls = [tp.repeat ? 'hint' : '', game.seen.has(tp.id) && !tp.repeat ? 'seen' : '', tp.requires ? 'confront' : ''].join(' ');
      opts.appendChild(button((topicFresh(tp) ? '● ' : '') + tp.label, () => playTopic(id, tp), cls));
    });
    if (game.evidence.length) opts.appendChild(button('◆ Apresentar evidência', () => showPresent(id), 'present'));
    opts.appendChild(button('— Encerrar conversa', closeModal, 'end'));
  });
}

function playTopic(id, tp) {
  const lines = typeof tp.lines === 'function' ? tp.lines() : tp.lines;
  runSeq(id, lines, 0, () => {
    game.seen.add(tp.id);
    saveGame();
    showTopics(id, pickOne(NPCS[id].again), 'N');
  });
}

function runSeq(id, seq, i, done) {
  if (i >= seq.length) return done();
  const e = seq[i];
  const next = () => runSeq(id, seq, i + 1, done);
  if (Array.isArray(e)) {
    const [who, text] = e;
    setSpeaker(id, who);
    const opts = $('dlg-options');
    opts.innerHTML = '';
    typeText($('dlg-text'), text, () => {
      const b = button('▶ Continuar', next);
      b.dataset.continue = '1';
      opts.appendChild(b);
    });
    return;
  }
  if (e.choice) {
    const opts = $('dlg-options');
    opts.innerHTML = '';
    e.choice.filter(c => !c.requiresFlag || game.flags[c.requiresFlag])
      .forEach(c => opts.appendChild(button('» ' + c.label, () => runSeq(id, c.lines, 0, next), 'choice')));
    return;
  }
  if (e.give) { give(e.give); return next(); }
  if (e.unlock) { unlockGps(e.unlock); return next(); }
  if (e.relax) { relieve({ cansaco: e.relax }, true); return next(); }
  if (e.flag) { game.flags[e.flag] = true; return next(); }
  if (e.tram) { tramUnlock(e.tram); return next(); }
  let cond = null;
  if (e.ifFlag) cond = !!game.flags[e.ifFlag];
  else if (e.ifHas) cond = has(e.ifHas);
  else if (e.ifSeen) cond = game.seen.has(e.ifSeen);
  if (cond !== null) return runSeq(id, (cond ? e.then : e.else) || [], 0, next);
  next();
}

function showPresent(id) {
  setSpeaker(id, 'V');
  const opts = $('dlg-options');
  opts.innerHTML = '';
  typeText($('dlg-text'), T('Qual evidência mostrar?'), () => {
    const wrap = document.createElement('div');
    wrap.className = 'present-list';
    game.evidence.forEach(ev => {
      const b = button(EVIDENCE[ev].name, () => presentEvidence(id, ev), 'ev-btn kind-' + kindClass(EVIDENCE[ev].kind));
      if (game.seen.has(`p:${id}:${ev}`)) b.classList.add('seen');
      wrap.appendChild(b);
    });
    opts.appendChild(wrap);
    opts.appendChild(button('← Voltar', () => showTopics(id, pickOne(NPCS[id].again), 'N'), 'end'));
  });
}

function presentEvidence(id, ev) {
  const npc = NPCS[id];
  const reaction = npc.present[ev] || [['N', pickOne(npc.presentDefault)]];
  const intro = ['V', T(pickOne(['Dê uma olhada nisto: {0}.', 'O que me diz disto? {0}.', 'Reconhece isto? {0}.']), EVIDENCE[ev].name)];
  runSeq(id, [intro, ...reaction], 0, () => {
    game.seen.add(`p:${id}:${ev}`);
    saveGame();
    showTopics(id, pickOne(npc.again), 'N');
  });
}

// ---------- painel de evidências ----------
function openEvidence() {
  game.modal = 'evidence';
  show('evidence');
  const list = $('ev-list');
  list.innerHTML = '';
  $('ev-count').textContent = `${game.evidence.length}/${EV_KEYS.length}`;
  if (!game.evidence.length) {
    $('ev-detail').innerHTML = `<p class="muted">${T('Nenhuma evidência coletada ainda.')}</p>`;
    return;
  }
  game.evidence.forEach((id, i) => {
    const e = EVIDENCE[id];
    const b = document.createElement('button');
    b.className = 'ev-item kind-' + kindClass(e.kind);
    b.innerHTML = `<span class="dot"></span>${e.name}`;
    b.onclick = () => {
      Sound.play('click');
      [...list.children].forEach(c => c.classList.remove('active'));
      b.classList.add('active');
      $('ev-detail').innerHTML = `<h3>${e.name}</h3><div class="tag kind-${kindClass(e.kind)}">${T(e.kind)}</div><p>${e.desc}</p>`;
    };
    list.appendChild(b);
    if (i === game.evidence.length - 1) b.onclick();
  });
}
function kindClass(k) { return k === 'física' ? 'fis' : k === 'digital' ? 'dig' : 'dep'; }

// ---------- Palácio da Memória ----------
let palaceSel = null;
let palaceCur = null;   // nó sob o cursor do teclado / controle
function nodePos(id) {
  let i = EV_KEYS.indexOf(id);
  if (i >= 0) {
    const a = i / EV_KEYS.length * Math.PI * 2 - Math.PI / 2;
    return [500 + Math.cos(a) * 430, 300 + Math.sin(a) * 235];
  }
  i = DEDUCTIONS.findIndex(d => d.id === id);
  const a = i / DEDUCTIONS.length * Math.PI * 2 - Math.PI / 2 + 0.3;
  return [500 + Math.cos(a) * 215, 300 + Math.sin(a) * 115];
}

function openPalace() {
  game.modal = 'palace';
  palaceSel = null;
  palaceCur = game.evidence[0] || null;
  show('palace');
  renderPalace();
  palaceInfo(null);
}

function renderPalace() {
  const svg = $('palace-svg');
  let h = '<defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  h += '<ellipse cx="500" cy="300" rx="430" ry="235" class="ring"/><ellipse cx="500" cy="300" rx="215" ry="115" class="ring"/>';
  h += `<circle cx="500" cy="300" r="34" class="core"/><text x="500" y="305" class="core-t">VANCE</text>`;
  for (const d of DEDUCTIONS) {
    if (!has(d.id)) continue;
    const p = nodePos(d.id);
    for (const parent of [d.a, d.b]) {
      const q = nodePos(parent);
      h += `<line x1="${q[0]}" y1="${q[1]}" x2="${p[0]}" y2="${p[1]}" class="link"/>`;
    }
    h += `<line x1="500" y1="300" x2="${p[0]}" y2="${p[1]}" class="link core-link"/>`;
  }
  for (const id of game.evidence) {
    const [x, y] = nodePos(id);
    const e = EVIDENCE[id];
    const sel = (palaceSel === id ? ' sel' : '') + (palaceCur === id ? ' cur' : '');
    // círculo invisível maior para facilitar o toque; anel do cursor e selo "1ª" da primeira escolhida
    h += `<g class="node ev kind-${kindClass(e.kind)}${sel}" data-id="${id}"><circle cx="${x}" cy="${y}" r="30" class="hit"/>${palaceCur === id ? `<circle cx="${x}" cy="${y}" r="25" class="cur-ring"/>` : ''}<circle cx="${x}" cy="${y}" r="16"/><text x="${x}" y="${y + 34}">${e.short}</text>${palaceSel === id ? `<text x="${x}" y="${y - 26}" class="sel-badge">1ª</text>` : ''}</g>`;
  }
  for (const d of DEDUCTIONS) {
    if (!has(d.id)) continue;
    const [x, y] = nodePos(d.id);
    const sel = (palaceSel === d.id ? ' sel' : '') + (palaceCur === d.id ? ' cur' : '');
    h += `<g class="node ded${sel}" data-id="${d.id}"><circle cx="${x}" cy="${y}" r="28" class="hit"/>${palaceCur === d.id ? `<circle cx="${x}" cy="${y}" r="27" class="cur-ring"/>` : ''}<rect x="${x - 13}" y="${y - 13}" width="26" height="26" transform="rotate(45 ${x} ${y})"/><text x="${x}" y="${y + 36}">${d.name}</text></g>`;
  }
  svg.innerHTML = h;
  svg.querySelectorAll('.node').forEach(n => n.onclick = () => palaceClick(n.dataset.id));
  $('palace-stats').textContent = T('Evidências {0}/{1} · Deduções {2}/{3}', game.evidence.length, EV_KEYS.length, game.deductions.length, DEDUCTIONS.length);
  $('btn-accuse').classList.toggle('hidden', game.act < 3);
}

function palaceInfo(id, extra = '') {
  const el = $('palace-info');
  if (!id) {
    el.innerHTML = `<h3>${T('Interface Neural')}</h3><p>${T('Toque em duas evidências para conectá-las. Conexões corretas geram <b>deduções</b>: teorias que avançam a investigação e liberam confrontos com os suspeitos.')}</p>${extra}`;
    return;
  }
  const isEv = !!EVIDENCE[id];
  const item = isEv ? EVIDENCE[id] : DEDUCTIONS.find(d => d.id === id);
  el.innerHTML = `<h3>${item.name}</h3><div class="tag ${isEv ? 'kind-' + kindClass(item.kind) : 'ded'}">${T(isEv ? item.kind : 'dedução')}</div><p>${item.desc}</p>${extra}${isEv && palaceSel ? `<p class="hint">${T(palaceSel === id ? 'Primeira escolhida. Mova o cursor até outra evidência e confirme (A / Enter) para conectar.' : 'Toque em outra evidência para tentar uma conexão.')}</p>` : ''}`;
}

// direcional: salta para o nó mais próximo na direção apertada; embaixo de tudo, o botão de acusar
function palaceMove(dx, dy) {
  const ids = game.evidence.concat(game.deductions);
  if (!ids.length) return;
  const acc = $('btn-accuse'), onAcc = document.activeElement === acc;
  if (onAcc) { if (dy < 0) { acc.classList.remove('pad-focus'); acc.blur(); renderPalace(); } return; }
  if (!palaceCur || !ids.includes(palaceCur)) { palaceCur = ids[0]; renderPalace(); palaceInfo(palaceCur); return; }
  const [px, py] = nodePos(palaceCur);
  let best = null, bs = Infinity;
  for (const id of ids) {
    if (id === palaceCur) continue;
    const [qx, qy] = nodePos(id), vx = qx - px, vy = qy - py;
    const along = vx * dx + vy * dy, perp = Math.abs(vx * dy - vy * dx);
    if (along <= 4) continue;
    const sc = along + perp * 2;
    if (sc < bs) { bs = sc; best = id; }
  }
  if (!best) {
    if (dy > 0 && !acc.classList.contains('hidden')) { padFocus(acc); renderPalace(); }
    return;
  }
  palaceCur = best;
  Sound.play('click');
  renderPalace();
  palaceInfo(palaceCur);
}

function palaceClick(id) {
  palaceCur = id;
  Sound.play('click');
  if (!EVIDENCE[id]) { palaceSel = null; renderPalace(); palaceInfo(id); return; }
  if (!palaceSel || palaceSel === id || !EVIDENCE[palaceSel]) {
    palaceSel = palaceSel === id ? null : id;
    renderPalace();
    palaceInfo(palaceSel);
    return;
  }
  const a = palaceSel, b = id;
  palaceSel = null;
  const d = DEDUCTIONS.find(x => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  if (d && !has(d.id)) {
    Sound.play('deduction');
    addDeduction(d.id);
    renderPalace();
    palaceInfo(d.id, `<p class="new">◆ ${T('NOVA DEDUÇÃO DESBLOQUEADA')}</p>`);
  } else if (d) {
    renderPalace();
    palaceInfo(d.id, `<p class="hint">${T('Você já fez essa conexão.')}</p>`);
  } else {
    Sound.play('wrong');
    renderPalace();
    palaceInfo(null, `<p class="bad">✕ ${T('"{0}" e "{1}" não se conectam. Os nós neurais rejeitam a hipótese.', EVIDENCE[a].short, EVIDENCE[b].short)}</p>`);
    const svg = $('palace-svg');
    svg.classList.remove('shake'); void svg.offsetWidth; svg.classList.add('shake');
  }
}

// ---------- mini-game de hack (circuitos) ----------
const HN = 5;
let hackState = null;
const rot = m => ((m << 1) | (m >> 3)) & 15;
const DIRS = [[0, -1, 1, 4], [1, 0, 2, 8], [0, 1, 4, 1], [-1, 0, 8, 2]]; // dx, dy, bit, bit oposto

function openHack(title, onSolve) {
  game.modal = 'hack';
  show('hack');
  $('hack-title').textContent = title;
  $('hack-status').textContent = T('Toque nos nós para girá-los e conectar a entrada (IN) à saída (OUT).') + ' ' + T('Controle ou teclado: direcional move, A ou Enter gira.');
  const grid = Array.from({ length: HN }, () => Array(HN).fill(0));
  let r = Math.floor(Math.random() * HN);
  const sr = r, path = [];
  for (let c = 0; c < HN; c++) {
    path.push([c, r]);
    const t = Math.floor(Math.random() * HN);
    while (r !== t) { r += Math.sign(t - r); path.push([c, r]); }
  }
  const tr = r;
  const bitTo = (a, b) => b[0] > a[0] ? 2 : b[0] < a[0] ? 8 : b[1] > a[1] ? 4 : 1;
  path.forEach((p, i) => {
    const inBit = i === 0 ? 8 : bitTo(p, path[i - 1]);
    const outBit = i === path.length - 1 ? 2 : bitTo(p, path[i + 1]);
    grid[p[1]][p[0]] = inBit | outBit;
  });
  const fillers = [5, 3, 7, 3, 5];
  for (let y = 0; y < HN; y++) for (let x = 0; x < HN; x++) if (!grid[y][x]) grid[y][x] = fillers[Math.floor(Math.random() * fillers.length)];
  hackState = { grid, sr, tr, onSolve, solved: false, cur: [0, sr] };
  do {
    for (let y = 0; y < HN; y++) for (let x = 0; x < HN; x++) {
      const n = Math.floor(Math.random() * 4);
      for (let k = 0; k < n; k++) grid[y][x] = rot(grid[y][x]);
    }
  } while (hackPowered().solved);
  drawHack();
}

function hackPowered() {
  const { grid, sr, tr } = hackState;
  const on = Array.from({ length: HN }, () => Array(HN).fill(false));
  if (!(grid[sr][0] & 8)) return { on, solved: false };
  const q = [[0, sr]]; on[sr][0] = true;
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy, bit, opp] of DIRS) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= HN || ny >= HN || on[ny][nx]) continue;
      if ((grid[y][x] & bit) && (grid[ny][nx] & opp)) { on[ny][nx] = true; q.push([nx, ny]); }
    }
  }
  return { on, solved: on[tr][HN - 1] && (grid[tr][HN - 1] & 2) };
}

function drawHack() {
  const cv = $('hack-canvas'), c = cv.getContext('2d');
  const S = 64, M = 40;
  c.fillStyle = '#05030c'; c.fillRect(0, 0, cv.width, cv.height);
  const { on, solved } = hackPowered();
  const { grid, sr, tr } = hackState;
  c.lineCap = 'square';
  for (let y = 0; y < HN; y++) for (let x = 0; x < HN; x++) {
    const ox = M + x * S, oy = M + y * S, cx = ox + S / 2, cy = oy + S / 2;
    c.fillStyle = '#0e0a1c'; c.fillRect(ox + 2, oy + 2, S - 4, S - 4);
    c.strokeStyle = '#2a1f44'; c.lineWidth = 1; c.strokeRect(ox + 2.5, oy + 2.5, S - 5, S - 5);
    const col = on[y][x] ? (solved ? '#7dff6b' : '#38f6ff') : '#5a2a6e';
    c.strokeStyle = col; c.lineWidth = 8;
    c.shadowColor = on[y][x] ? col : 'transparent'; c.shadowBlur = on[y][x] ? 12 : 0;
    c.beginPath();
    for (const [dx, dy, bit] of DIRS) if (grid[y][x] & bit) { c.moveTo(cx, cy); c.lineTo(cx + dx * S / 2, cy + dy * S / 2); }
    c.stroke();
    c.fillStyle = col; c.fillRect(cx - 6, cy - 6, 12, 12);
    c.shadowBlur = 0;
  }
  // cursor de teclado / controle
  if (hackState.cur && !solved) {
    const [qx, qy] = hackState.cur, pulse = 0.6 + 0.4 * Math.sin(performance.now() / 160);
    c.strokeStyle = `rgba(255,210,63,${pulse})`; c.lineWidth = 4; c.strokeRect(M + qx * S + 3, M + qy * S + 3, S - 6, S - 6);
  }
  c.fillStyle = '#38f6ff';
  c.fillRect(0, M + sr * S + S / 2 - 4, M, 8);
  c.fillStyle = solved ? '#7dff6b' : '#ff3355';
  c.fillRect(M + HN * S, M + tr * S + S / 2 - 4, M, 8);
  c.font = '700 15px "Chakra Petch", sans-serif';
  c.fillStyle = '#38f6ff'; c.fillText('IN', 6, M + sr * S + S / 2 - 10);
  c.fillStyle = solved ? '#7dff6b' : '#ff3355'; c.fillText('OUT', M + HN * S + 6, M + tr * S + S / 2 - 10);
}

function hackClick(ev) {
  if (!hackState || hackState.solved) return;
  const cv = $('hack-canvas');
  const r = cv.getBoundingClientRect();
  const x = (ev.clientX - r.left) * cv.width / r.width, y = (ev.clientY - r.top) * cv.height / r.height;
  const gx = Math.floor((x - 40) / 64), gy = Math.floor((y - 40) / 64);
  if (gx < 0 || gy < 0 || gx >= HN || gy >= HN) return;
  hackState.cur = [gx, gy];
  hackRotate();
}
// setas / direcional movem o cursor; Enter / A giram o nó sob ele
function hackMove(dx, dy) {
  if (!hackState || hackState.solved) return;
  const [x, y] = hackState.cur;
  hackState.cur = [Math.max(0, Math.min(HN - 1, x + dx)), Math.max(0, Math.min(HN - 1, y + dy))];
  Sound.play('click');
  drawHack();
}
function hackRotate() {
  if (!hackState || hackState.solved) return;
  const [gx, gy] = hackState.cur;
  hackState.grid[gy][gx] = rot(hackState.grid[gy][gx]);
  Sound.play('rotate');
  drawHack();
  if (hackPowered().solved) {
    hackState.solved = true;
    Sound.play('hackOk');
    $('hack-status').innerHTML = '<span class="ok">ACESSO CONCEDIDO</span>';
    setTimeout(() => { closeModal(); hackState.onSolve(); }, 900);
  }
}

// ---------- acusação ----------
let accuseStep = 0, accuseKiller = null;
const SUSPECTS = ['evelyn', 'victor', 'helena', 'tomas'];

function openAccuse() {
  game.modal = 'accuse';
  hide('palace');
  show('accuse');
  Sound.play('accuse');
  accuseStep = 0; accuseKiller = null;
  renderAccuse();
}

function renderAccuse() {
  const grid = $('accuse-grid');
  grid.innerHTML = '';
  $('accuse-q').textContent = T(CASES[game.caseId].ACCUSE_Q[accuseStep]);
  const list = accuseStep === 0 ? SUSPECTS : SUSPECTS.filter(s => s !== accuseKiller).concat(['ninguem']);
  list.forEach(id => {
    const card = document.createElement('button');
    card.className = 'suspect';
    if (id === 'ninguem') {
      card.innerHTML = '<div class="nobody">∅</div><b>Ninguém</b><small>Apenas o assassino</small>';
    } else {
      const cv = document.createElement('canvas'); cv.width = 120; cv.height = 180;
      drawPortrait(cv, NPCS[id].look);
      card.appendChild(cv);
      card.insertAdjacentHTML('beforeend', `<b>${NPCS[id].name}</b><small>${NPCS[id].role}</small>`);
    }
    card.onclick = () => {
      Sound.play('click');
      if (accuseStep === 0) { accuseKiller = id; accuseStep = 1; renderAccuse(); }
      else resolveCase(accuseKiller, id);
    };
    grid.appendChild(card);
  });
  $('accuse-back').onclick = () => { if (accuseStep === 1) { accuseStep = 0; renderAccuse(); } else { hide('accuse'); openPalace(); } };
}

// ---------- telas cheias ----------
function showCard(title, sub, then) {
  const el = $('card');
  el.innerHTML = `<div class="card-in"><div class="card-title">${title}</div><div class="card-sub">${sub}</div><div class="card-hint">${T('toque para continuar')}</div></div>`;
  show('card');
  game.modal = 'card';
  Sound.play('act');
  el.onclick = () => { hide('card'); game.modal = null; if (then) then(); };
}

// ---------- finais ----------
// cada final tem a sua tela: cena de fundo, cor, carimbo e o quadro de veredito (retrato + destino de cada um)
const ENDING_SCENES = {
  alvorada: {
    victim: 'arthur', victimName: 'Arthur Pendelton', solvedBg: 'img/intro/2.jpg',
    perfeito:     { bg: 'img/intro/2.jpg', tone: 'green',  stamp: 'CASO SOLUCIONADO', people: [['victor', 'CONDENADO'], ['helena', 'CONDENADA']] },
    quase:        { bg: 'img/intro/2.jpg', tone: 'cyan',   stamp: 'CASO ENCERRADO',   people: [['victor', 'CONDENADO'], ['helena', 'IMPUNE']] },
    fraco:        { bg: 'img/intro/5.jpg', tone: 'yellow', stamp: 'CASO ARQUIVADO',   people: [['victor', 'ABSOLVIDO']] },
    incompleto:   { bg: 'img/intro/3.jpg', tone: 'orange', stamp: 'MEIA VERDADE',     people: [['helena', 'CONDENADA'], ['victor', 'IMPUNE']] },
    errado:       { bg: 'img/intro/5.jpg', tone: 'red',    stamp: 'LICENÇA CASSADA',  people: [['evelyn', 'INOCENTE'], ['victor', 'IMPUNE']] },
    errado_tomas: { bg: 'img/intro/4.jpg', tone: 'red',    stamp: 'ACUSAÇÃO ERRADA',  people: [['tomas', 'INOCENTE'], ['victor', 'IMPUNE']] },
  },
  eco: {
    victim: 'kaelen', victimName: 'Kaelen Voss', solvedBg: 'img/intro/eco_1.jpg',
    perfeito:     { bg: 'img/intro/eco_1.jpg', tone: 'green',  stamp: 'CASO SOLUCIONADO', people: [['maya', 'CONDENADA'], ['lyra', 'CONDENADA']] },
    quase:        { bg: 'img/intro/eco_1.jpg', tone: 'cyan',   stamp: 'CASO ENCERRADO',   people: [['maya', 'CONDENADA'], ['lyra', 'IMPUNE']] },
    fraco:        { bg: 'img/intro/eco_5.jpg', tone: 'yellow', stamp: 'CASO ARQUIVADO',   people: [['maya', 'ABSOLVIDA']] },
    incompleto:   { bg: 'img/intro/eco_4.jpg', tone: 'orange', stamp: 'MEIA VERDADE',     people: [['zero', 'INOCENTE'], ['maya', 'IMPUNE']] },
    errado_lyra:  { bg: 'img/intro/eco_4.jpg', tone: 'red',    stamp: 'ACUSAÇÃO ERRADA',  people: [['lyra', 'ABSOLVIDA'], ['maya', 'IMPUNE']] },
    errado_rig:   { bg: 'img/intro/eco_3.jpg', tone: 'red',    stamp: 'ACUSAÇÃO ERRADA',  people: [['rig7', 'INOCENTE'], ['maya', 'IMPUNE']] },
    errado_dante: { bg: 'img/intro/eco_2.jpg', tone: 'red',    stamp: 'ACUSAÇÃO ERRADA',  people: [['dante', 'ABSOLVIDO'], ['maya', 'IMPUNE']] },
    critico:      { bg: 'img/intro/eco_3.jpg', tone: 'crit',   stamp: 'PROVAS APAGADAS',  people: [['maya', 'IMPUNE'], ['lyra', 'IMPUNE']] },
  },
};
// destino de cada pessoa no quadro: cor do carimbo sobre o retrato
const VERDICT_CLASS = { CONDENADO: 'v-guilty', CONDENADA: 'v-guilty', IMPUNE: 'v-free', ABSOLVIDO: 'v-free', ABSOLVIDA: 'v-free', INOCENTE: 'v-innocent' };

function endingCard(look, name, tag, cls) {
  return `<figure class="end-person ${cls}"><canvas width="132" height="168" data-look="${look}"></canvas><span class="end-tag">${T(tag)}</span><figcaption>${name}</figcaption></figure>`;
}
function endingPortraits(el) { el.querySelectorAll('canvas[data-look]').forEach(cv => drawPortrait(cv, cv.dataset.look)); }

function showEnding(key, extra = '') {
  const e = ENDINGS[key];
  const scenes = ENDING_SCENES[game.caseId] || ENDING_SCENES.alvorada;
  const sc = scenes[key] || { bg: '', tone: e.good ? 'green' : 'red', stamp: '', people: [] };
  const el = $('ending');
  const stats = T('Evidências {0}/{1} · Deduções {2}/{3}', game.evidence.length, EV_KEYS.length, game.deductions.length, DEDUCTIONS.length);
  const pct = Math.round(100 * (game.evidence.length + game.deductions.length) / Math.max(1, EV_KEYS.length + DEDUCTIONS.length));
  const bg = src => src ? `<div class="end-bg" style="background-image:url('${src}')"></div>` : '';
  closeModal();
  clearSave();
  if (key === 'perfeito') setCaseProgress(game.caseId, 100);
  game.modal = 'ending';
  Sound.play(e.good ? 'deduction' : 'wrong');
  Sound.setMusic(e.good ? 'good' : 'bad');

  // tela do final: carimbo, veredito e o desfecho
  const finale = () => {
    el.className = `screen end-final tone-${sc.tone}`;
    el.innerHTML = `${bg(sc.bg)}<div class="end-in">
      <header class="end-head">
        ${sc.stamp ? `<div class="end-stamp">${T(sc.stamp)}</div>` : ''}
        <div class="end-title">${e.title}</div>
        <div class="end-sub">${e.sub}</div>
      </header>
      <div class="end-body">
        ${sc.people.length ? `<div class="end-board">${sc.people.map(([id, tag]) => endingCard(NPCS[id] ? NPCS[id].look : id, NPCS[id] ? NPCS[id].name : id, tag, VERDICT_CLASS[tag] || '')).join('')}</div>` : ''}
        <div class="end-text">${e.text.replace('{extra}', extra).split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
      </div>
      <div class="end-stats">${stats}</div>
      <button id="btn-restart" data-continue>${T('Novo caso')}</button>
    </div>`;
    el.scrollTop = 0;
    endingPortraits(el);
    $('btn-restart').onclick = () => { el.classList.add('hidden'); newGame(true, game.caseId); };
  };

  // caso solucionado (o assassino foi condenado): antes do desfecho, a tela de êxito do caso
  if (!e.good) return finale();
  const c = CASES[game.caseId] || {};
  const stars = key === 'perfeito' ? 3 : 2;
  el.className = `screen end-solved tone-${sc.tone}`;
  el.innerHTML = `${bg(scenes.solvedBg)}<div class="end-in">
    <div class="solved-tag">${c.tag || ''}</div>
    <div class="solved-case">${c.title || ''}</div>
    <div class="solved-stamp">${T('CASO SOLUCIONADO')}</div>
    <div class="solved-row">
      ${endingCard(scenes.victim, scenes.victimName, 'VÍTIMA', 'v-victim')}
      <div class="solved-score">
        <div class="solved-stars">${'<b>★</b>'.repeat(stars)}${'<i>★</i>'.repeat(3 - stars)}</div>
        <div class="solved-rank">${e.sub}</div>
        <div class="solved-bar"><i style="width:${pct}%"></i></div>
        <div class="solved-pct">${T('Investigação {0}%', pct)}</div>
        <div class="end-stats">${stats}</div>
      </div>
    </div>
    <button id="btn-epilogue" data-continue>${T('Ver desfecho')}</button>
  </div>`;
  el.scrollTop = 0;
  endingPortraits(el);
  $('btn-epilogue').onclick = finale;
}
