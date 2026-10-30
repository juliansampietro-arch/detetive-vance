// ============================================================
// Áudio procedural (WebAudio): ambiente, trilha por cena e efeitos
// ============================================================

const Sound = (() => {
  let ac = null, master, amb, musicBus, sfx, echo, noiseBuf;
  let rainGain, rainFilter, dropsGain, humGain, humOsc;
  let dripTimer = null, schedTimer = null;
  let muted = false, musicEnabled = true;
  // volume da música escolhido pelo jogador (0 a 1); o ganho real vai até MUSIC_MAX
  let musicVol = 0.7;
  // volumes dos efeitos e das vozes (0 a 1); as vozes têm canal próprio, com ganho alto para passar por cima da chuva
  let sfxVol = 1, voiceVol = 0.8;
  const SFX_MAX = 0.7, VOICE_MAX = 3.2;
  let voiceBus = null, catBuf = null, waterBuf = null;
  try {
    muted = localStorage.getItem('alvorada_muted') === '1';
    musicEnabled = localStorage.getItem('alvorada_music') !== '0';
    const v = localStorage.getItem('alvorada_music_vol');
    if (v !== null && !isNaN(+v)) musicVol = Math.min(1, Math.max(0, +v));
    const fx = localStorage.getItem('alvorada_sfx_vol'), vc = localStorage.getItem('alvorada_voice_vol');
    if (fx !== null && !isNaN(+fx)) sfxVol = Math.min(1, Math.max(0, +fx));
    if (vc !== null && !isNaN(+vc)) voiceVol = Math.min(1, Math.max(0, +vc));
  } catch (e) {}
  const MUSIC_MAX = 2.4;
  const musicGain = () => (musicEnabled ? musicVol * MUSIC_MAX : 0);

  const ROOM_MIX = {
    suite:    { rain: 0.16, drops: 0.05, hum: 0.022, humF: 55, drips: false },
    corridor: { rain: 0.08, drops: 0.02, hum: 0.035, humF: 60, drips: false },
    lobby:    { rain: 0.11, drops: 0.03, hum: 0.018, humF: 50, drips: false },
    tunnels:  { rain: 0.03, drops: 0.0,  hum: 0.045, humF: 40, drips: true },
    street:   { rain: 0.32, drops: 0.12, hum: 0.012, humF: 60, drips: false },
    city:     { rain: 0.22, drops: 0.06, hum: 0.03,  humF: 45, drips: false },
    home:     { rain: 0.12, drops: 0.04, hum: 0.008, humF: 50, drips: false },
    delegacia:{ rain: 0.06, drops: 0.02, hum: 0.03,  humF: 60, drips: false },
    cafe:     { rain: 0.09, drops: 0.03, hum: 0.01,  humF: 50, drips: false },
    chinatown:{ rain: 0.3,  drops: 0.1,  hum: 0.015, humF: 55, drips: false },
    bathhouse:{ rain: 0.04, drops: 0.0,  hum: 0.006, humF: 40, drips: true },
  };
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function init() {
    if (ac) { ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    // compressor no fim da cadeia: a música mais alta não estoura junto com trovões e tiros
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.005; comp.release.value = 0.25;
    comp.connect(ac.destination);
    master = ac.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(comp);
    echo = ac.createDelay(1); echo.delayTime.value = 0.36;
    const fb = ac.createGain(); fb.gain.value = 0.35;
    const wet = ac.createGain(); wet.gain.value = 0.3;
    echo.connect(fb); fb.connect(echo); echo.connect(wet); wet.connect(master);
    amb = ac.createGain(); amb.connect(master);
    musicBus = ac.createGain(); musicBus.gain.value = musicGain();
    meter = ac.createAnalyser(); meter.fftSize = 2048; musicBus.connect(meter);
    musicBus.connect(master); musicBus.connect(echo);
    sfx = ac.createGain(); sfx.gain.value = sfxVol * SFX_MAX; sfx.connect(master); sfx.connect(echo);
    voiceBus = ac.createGain(); voiceBus.gain.value = voiceVol * VOICE_MAX; voiceBus.connect(master);
    // sons gravados: miado do Byte (audio/cat.wav) e entrada na água (audio/water.flac); até carregar, valem os sintetizados
    // (XHR em vez de fetch: no exe a página abre por file://, onde o fetch é bloqueado)
    const loadSample = (src, done) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', src); xhr.responseType = 'arraybuffer';
        xhr.onload = () => { if (xhr.response) ac.decodeAudioData(xhr.response).then(done).catch(() => {}); };
        xhr.send();
      } catch (e) {}
    };
    loadSample('audio/cat.wav', buf => { catBuf = buf; });
    loadSample('audio/water.flac', buf => { waterBuf = buf; });
    sfxMeter = ac.createAnalyser(); sfxMeter.fftSize = 2048; sfx.connect(sfxMeter); voiceBus.connect(sfxMeter);

    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    const rain = loopNoise();
    rainFilter = ac.createBiquadFilter(); rainFilter.type = 'lowpass'; rainFilter.frequency.value = 1400;
    rainGain = ac.createGain(); rainGain.gain.value = 0;
    rain.connect(rainFilter); rainFilter.connect(rainGain); rainGain.connect(amb);
    const drops = loopNoise();
    const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5000;
    dropsGain = ac.createGain(); dropsGain.gain.value = 0;
    drops.connect(hp); hp.connect(dropsGain); dropsGain.connect(amb);
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.07;
    const lfoG = ac.createGain(); lfoG.gain.value = 500;
    lfo.connect(lfoG); lfoG.connect(rainFilter.frequency); lfo.start();

    humOsc = ac.createOscillator(); humOsc.type = 'sawtooth'; humOsc.frequency.value = 55;
    const humF = ac.createBiquadFilter(); humF.type = 'lowpass'; humF.frequency.value = 180;
    humGain = ac.createGain(); humGain.gain.value = 0;
    humOsc.connect(humF); humF.connect(humGain); humGain.connect(amb); humOsc.start();

    schedTimer = setInterval(schedule, 50);
    if (pendingRoom) setRoom(pendingRoom);
    if (pendingMusic) { const m = pendingMusic; pendingMusic = null; setMusic(m); }
  }

  function loopNoise() {
    const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start();
    return s;
  }

  function ramp(param, v, time = 1.5) {
    param.cancelScheduledValues(ac.currentTime);
    param.setValueAtTime(param.value, ac.currentTime);
    param.linearRampToValueAtTime(v, ac.currentTime + time);
  }

  let pendingRoom = null;
  // a chuva fica sempre bem baixa, só como fundo (os jogadores acharam alta demais)
  const RAIN_LEVEL = 0.1;
  // salas que dividem o clima e a trilha de outra
  const ROOM_ALIAS = { home_kitchen: 'home', home_bath: 'home', locker: 'bathhouse', onsen: 'bathhouse', sauna: 'bathhouse' };
  function setRoom(id) {
    id = ROOM_ALIAS[id] || id;
    pendingRoom = id;
    setMusic(id);
    if (!ac) return;
    const m = ROOM_MIX[id] || ROOM_MIX.suite;
    ramp(rainGain.gain, m.rain * RAIN_LEVEL); ramp(dropsGain.gain, m.drops * RAIN_LEVEL);
    ramp(humGain.gain, m.hum); ramp(humOsc.frequency, m.humF);
    clearTimeout(dripTimer);
    if (m.drips) scheduleDrip();
  }

  function scheduleDrip() {
    dripTimer = setTimeout(() => {
      const t = ac.currentTime, f = 900 + Math.random() * 900;
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.4, t + 0.12);
      g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o.connect(g); g.connect(sfx); g.connect(echo); o.start(t); o.stop(t + 0.2);
      scheduleDrip();
    }, 600 + Math.random() * 2200);
  }

  // ---------- instrumentos ----------
  function env(g, t, a, peak, rel) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + rel);
  }

  function pad(bus, notes, t, dur, vol, cutoff = 900) {
    const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cutoff; f.Q.value = 0.8;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.35);
    g.gain.linearRampToValueAtTime(vol * 0.8, t + dur * 0.8);
    g.gain.linearRampToValueAtTime(0.0001, t + dur * 1.15);
    f.connect(g); g.connect(bus);
    for (const n of notes) for (const det of [-7, 7]) {
      const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(n); o.detune.value = det;
      o.connect(f); o.start(t); o.stop(t + dur * 1.2);
    }
  }

  // piano elétrico (FM)
  function ep(bus, n, t, vol, dur = 1.8) {
    const f = mtof(n);
    const car = ac.createOscillator(), mod = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
    car.frequency.value = f; mod.frequency.value = f;
    mg.gain.setValueAtTime(f * 1.6, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 0.9);
    mod.connect(mg); mg.connect(car.frequency);
    env(g, t, 0.006, vol, dur);
    car.connect(g); g.connect(bus);
    car.start(t); mod.start(t); car.stop(t + dur + 0.1); mod.stop(t + dur + 0.1);
  }

  // sino metálico inarmônico
  function bell(bus, n, t, vol, dur = 3) {
    const f = mtof(n);
    const car = ac.createOscillator(), mod = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
    car.frequency.value = f; mod.frequency.value = f * 3.5;
    mg.gain.setValueAtTime(f * 2, t); mg.gain.exponentialRampToValueAtTime(f * 0.1, t + dur);
    mod.connect(mg); mg.connect(car.frequency);
    env(g, t, 0.004, vol, dur);
    car.connect(g); g.connect(bus);
    car.start(t); mod.start(t); car.stop(t + dur + 0.1); mod.stop(t + dur + 0.1);
  }

  function bass(bus, n, t, dur, vol) {
    const o = ac.createOscillator(), s = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = 'triangle'; o.frequency.value = mtof(n); s.type = 'sine'; s.frequency.value = mtof(n);
    f.type = 'lowpass'; f.frequency.value = 420;
    env(g, t, 0.02, vol, dur);
    o.connect(f); s.connect(f); f.connect(g); g.connect(bus);
    o.start(t); s.start(t); o.stop(t + dur + 0.1); s.stop(t + dur + 0.1);
  }

  function pluck(bus, n, t, vol, cut = 900, dur = 0.35) {
    const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = 'sawtooth'; o.frequency.value = mtof(n);
    f.type = 'lowpass'; f.Q.value = 4;
    f.frequency.setValueAtTime(cut * 4, t); f.frequency.exponentialRampToValueAtTime(cut, t + 0.18);
    env(g, t, 0.004, vol, dur);
    o.connect(f); f.connect(g); g.connect(bus);
    o.start(t); o.stop(t + dur + 0.1);
  }

  // lead com portamento e vibrato que entra devagar
  function lead(bus, n, t, dur, vol, from = n) {
    const f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = 'lowpass'; f.Q.value = 2;
    f.frequency.setValueAtTime(700, t); f.frequency.linearRampToValueAtTime(2600, t + 0.08); f.frequency.exponentialRampToValueAtTime(1200, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.setValueAtTime(vol, t + dur * 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.15);
    f.connect(g); g.connect(bus);
    const vib = ac.createOscillator(), vg = ac.createGain();
    vib.frequency.value = 5.5;
    vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(18, t + dur * 0.6);
    vib.connect(vg);
    for (const [type, det] of [['sawtooth', -6], ['square', 6]]) {
      const o = ac.createOscillator(); o.type = type; o.detune.value = det;
      o.frequency.setValueAtTime(mtof(from), t); o.frequency.exponentialRampToValueAtTime(mtof(n), t + 0.06);
      vg.connect(o.detune); o.connect(f); o.start(t); o.stop(t + dur + 0.2);
    }
    vib.start(t); vib.stop(t + dur + 0.2);
  }

  function snare(bus, t, vol) {
    noiseHit(bus, t, vol, 1800, 'bandpass', 0.18);
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.08);
    env(g, t, 0.002, vol * 0.8, 0.1);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + 0.15);
  }

  function noiseHit(bus, t, vol, freq, type, dur, attack = 0.002) {
    const s = ac.createBufferSource(); s.buffer = noiseBuf;
    const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = ac.createGain();
    env(g, t, attack, vol, dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(t, Math.random()); s.stop(t + attack + dur + 0.05);
  }

  function thump(bus, t, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(75, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.2);
    env(g, t, 0.005, vol, 0.28);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + 0.35);
  }

  // nota sustentada que vive enquanto o tema toca
  function drone(bus, n, type, vol, cutoff, vib = 0) {
    const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = type; o.frequency.value = mtof(n);
    f.type = 'lowpass'; f.frequency.value = cutoff;
    g.gain.value = vol;
    o.connect(f); f.connect(g); g.connect(bus);
    let l = null;
    if (vib) { l = ac.createOscillator(); const lg = ac.createGain(); l.frequency.value = 0.15; lg.gain.value = vib; l.connect(lg); lg.connect(o.detune); l.start(); }
    o.start();
    return () => { try { o.stop(); if (l) l.stop(); } catch (e) {} };
  }

  // ---------- temas por cena (passo = colcheia) ----------
  const THEMES = {
    // tela de título: cyberpunk sombrio em lá menor (Am, F, Dm, E)
    // ciclo de 16 compassos: 4 de abertura com o filtro abrindo, 4 com bateria e baixo, 8 com o lead
    title: {
      bpm: 96,
      start(b) { return [drone(b, 33, 'sawtooth', 0.012, 140, 8)]; },
      step(i, t, b, dur) {
        const prog = [[45, [57, 60, 64]], [41, [57, 60, 65]], [38, [57, 62, 65]], [40, [56, 59, 64]]];
        const k = i % 128, sec = k < 32 ? 0 : k < 64 ? 1 : 2, s = k % 8;
        const [root, ch] = prog[Math.floor(k / 8) % 4];
        if (s === 0) pad(b, ch, t, dur * 8, 0.02, sec ? 1300 : 700);
        // arpejo em semicolcheias
        const arp = [ch[0], ch[1], ch[2], ch[0] + 12, ch[2], ch[1], ch[0] + 12, ch[2]];
        const cut = sec ? 1700 : 400 + k / 32 * 1300;
        pluck(b, arp[(s * 2) % 8] + 12, t, 0.018, cut, 0.18);
        pluck(b, arp[(s * 2 + 1) % 8] + 12, t + dur / 2, 0.014, cut, 0.18);
        if (sec === 0) {
          if (k === 0) bell(b, 81, t, 0.025, 4);
          if (k === 16) noiseHit(b, t, 0.03, 3000, 'bandpass', 0.3, dur * 16);   // riser
          return;
        }
        // baixo em oitavas, bumbo, chimbal e caixa
        pluck(b, s % 2 ? root : root - 12, t, 0.06, 300, 0.22);
        if (s % 2 === 0) thump(b, t, 0.13);
        noiseHit(b, t + (s % 2 ? 0 : dur / 2), 0.012, 9000, 'highpass', 0.04);
        if (sec === 2 && (s === 2 || s === 6)) snare(b, t, 0.06);
        if (sec === 1 && k >= 56 && s >= 4) snare(b, t, 0.03 + (s - 4) * 0.012);   // virada
        if (sec === 2) {
          const mel = {
            0: [76, 3], 3: [74, 1], 4: [72, 4], 8: [72, 2], 10: [74, 2], 12: [77, 4],
            16: [76, 3], 19: [74, 1], 20: [69, 4], 24: [71, 4], 28: [68, 4],
            32: [76, 3], 35: [79, 1], 36: [81, 4], 40: [79, 2], 42: [77, 2], 44: [76, 4],
            48: [77, 3], 51: [76, 1], 52: [74, 4], 56: [76, 8],
          };
          const m = k - 64, note = mel[m];
          if (note) {
            const prev = Object.keys(mel).map(Number).filter(x => x < m).pop();
            lead(b, note[0], t, dur * note[1] * 0.95, 0.03, prev === undefined ? note[0] : mel[prev][0]);
          }
        }
      },
    },
    // rua do hotel: chuva e um synth melancólico
    street: {
      bpm: 66,
      step(i, t, b, dur) {
        const prog = [[45, [57, 60, 64]], [43, [55, 59, 62]], [41, [57, 60, 65]], [40, [56, 59, 64]]];
        const [root, ch] = prog[Math.floor(i / 16) % 4];
        if (i % 16 === 0) { pad(b, ch, t, dur * 16, 0.022, 800); bass(b, root - 12, t, dur * 14, 0.08); }
        if (i % 4 === 2) pluck(b, ch[(i / 4) % 3 | 0] + 12, t, 0.014, 700, 0.6);
      },
    },
    // dirigindo: synthwave com batida
    city: {
      bpm: 100,
      step(i, t, b, dur) {
        const prog = [[45, [57, 60, 64, 67]], [41, [53, 57, 60, 64]], [48, [55, 60, 64, 67]], [43, [55, 59, 62, 67]]];
        const [root, ch] = prog[Math.floor(i / 16) % 4];
        if (i % 16 === 0) pad(b, ch, t, dur * 16, 0.02, 1300);
        pluck(b, (i % 2 ? root + 12 : root), t, 0.05, 420, 0.2);
        if (i % 4 === 0) thump(b, t, 0.11);
        if (i % 8 === 4) noiseHit(b, t, 0.035, 2000, 'bandpass', 0.12);
        noiseHit(b, t, 0.007, 9000, 'highpass', 0.03);
        pluck(b, ch[[0, 1, 2, 3, 2, 1][i % 6]] + 12, t + dur / 2, 0.018, 1600, 0.25);
      },
    },
    // casa: lo-fi tranquilo
    home: {
      bpm: 72, swing: 0.58,
      step(i, t, b, dur) {
        const prog = [[48, [52, 55, 59, 62]], [45, [52, 55, 60, 64]], [41, [52, 57, 60, 64]], [43, [53, 57, 59, 62]]];
        const [root, ch] = prog[Math.floor(i / 8) % 4];
        if (i % 8 === 0) { ch.forEach(n => ep(b, n, t, 0.02, 2)); bass(b, root - 12, t, dur * 6, 0.09); }
        if (i % 4 === 0) thump(b, t, 0.06);
        if (i % 8 === 4) noiseHit(b, t, 0.025, 1500, 'bandpass', 0.15, 0.01);
        noiseHit(b, t, 0.004, 7000, 'highpass', 0.05);
        if (i % 2 && Math.random() < 0.2) ep(b, ch[Math.floor(Math.random() * 4)] + 12, t, 0.025, 1.5);
      },
    },
    // delegacia: tensão contida
    delegacia: {
      bpm: 84,
      step(i, t, b, dur) {
        const prog = [[38, [50, 53, 57]], [34, [50, 53, 58]], [36, [48, 52, 55]], [33, [49, 52, 57]]];
        const [root, ch] = prog[Math.floor(i / 16) % 4];
        if (i % 16 === 0) { pad(b, ch, t, dur * 16, 0.02, 700); bass(b, root, t, dur * 15, 0.08); }
        if (i % 2 === 0) pluck(b, root + 12, t, 0.02, 350, 0.18);
        if (i % 16 === 10) ep(b, ch[2] + 12, t, 0.025, 2);
      },
    },
    // café: bossa lounge
    cafe: {
      bpm: 92, swing: 0.55,
      step(i, t, b, dur) {
        const prog = [[41, [52, 57, 60, 64]], [43, [53, 58, 62, 65]], [40, [50, 55, 59, 62]], [45, [52, 55, 61, 64]]];
        const [root, ch] = prog[Math.floor(i / 8) % 4];
        const s2 = i % 8;
        if (s2 === 0 || s2 === 3 || s2 === 6) ch.forEach(n => ep(b, n, t, s2 ? 0.012 : 0.018, s2 ? 0.5 : 1.4));
        if (s2 === 0) bass(b, root, t, dur * 2.5, 0.1);
        if (s2 === 3) bass(b, root + 7, t, dur * 2, 0.08);
        if (s2 === 5) bass(b, root + 12, t, dur * 2, 0.07);
        noiseHit(b, t, s2 % 2 ? 0.006 : 0.012, 5000, 'bandpass', 0.05);
      },
    },
    // Chinatown: pentatônica e gongo
    chinatown: {
      bpm: 80,
      step(i, t, b, dur) {
        const pent = [57, 60, 62, 64, 67, 69, 72, 74];
        if (i % 32 === 0) { noiseHit(b, t, 0.04, 300, 'lowpass', 3, 0.01); bell(b, 45, t, 0.03, 4); }
        if (i % 16 === 0) pad(b, [45, 52, 57], t, dur * 16, 0.016, 600);
        if (i % 2 === 0 && Math.random() < 0.7) pluck(b, pent[Math.floor(Math.random() * pent.length)], t, 0.022, 1400, 0.5);
        if (i % 4 === 0) thump(b, t, 0.05);
      },
    },
    // casa de banho: água, drone e koto lento
    bathhouse: {
      bpm: 54,
      start(b) { return [drone(b, 45, 'sine', 0.02, 400, 4), drone(b, 52, 'sine', 0.012, 400, 6)]; },
      step(i, t, b, dur) {
        const pent = [57, 60, 62, 64, 67, 69];
        if (i % 3 === 0 && Math.random() < 0.6) pluck(b, pent[Math.floor(Math.random() * pent.length)] + 12, t, 0.018, 1800, 1.4);
        if (i % 16 === 8) bell(b, 81, t, 0.012, 4);
      },
    },
    // emboscada: ação tensa, baixo pulsante e bateria
    combat: {
      bpm: 140,
      step(i, t, b, dur) {
        const ost = [33, 33, 45, 33, 36, 33, 43, 33];
        pluck(b, ost[i % 8] + (Math.floor(i / 32) % 2 ? 3 : 0), t, 0.06, 520, 0.22);
        if (i % 2 === 0) thump(b, t, 0.13);
        if (i % 8 === 2 || i % 8 === 6) noiseHit(b, t, 0.05, 1800, 'bandpass', 0.12);
        noiseHit(b, t, 0.01, 9000, 'highpass', 0.03);
        if (i % 16 === 0) pad(b, Math.floor(i / 16) % 2 ? [56, 59, 63] : [57, 60, 64], t, dur * 3, 0.035, 1600);
      },
    },
    // introdução: abertura cinematográfica, pulso grave e sinos
    intro: {
      bpm: 64,
      start(b) { return [drone(b, 33, 'sawtooth', 0.02, 160, 6)]; },
      step(i, t, b, dur) {
        const prog = [[45, [57, 60, 64, 69]], [41, [57, 60, 65, 69]], [38, [57, 62, 65, 69]], [40, [56, 59, 64, 68]]];
        const [root, ch] = prog[Math.floor(i / 16) % 4];
        if (i % 16 === 0) { pad(b, ch, t, dur * 16, 0.03, 900); bass(b, root - 12, t, dur * 15, 0.12); }
        if (i % 4 === 0) thump(b, t, 0.07);
        if (i % 8 === 6) bell(b, ch[3] + 12, t, 0.022, 3.5);
        if (i % 2 === 0 && i % 16 >= 8) pluck(b, ch[(i / 2) % 4] + 12, t, 0.016, 800, 0.5);
      },
    },
    // suíte (cena do crime): piano esparso, relógio e drone alto
    suite: {
      bpm: 56,
      start(b) { return [drone(b, 81, 'sine', 0.006, 4000, 8)]; },
      step(i, t, b, dur) {
        const prog = [[45, [57, 60, 64, 71]], [41, [53, 57, 60, 64]], [38, [50, 57, 60, 65]], [40, [52, 56, 59, 62]]];
        const [root, ch] = prog[Math.floor(i / 16) % 4];
        if (i % 16 === 0) { pad(b, ch, t, dur * 16, 0.022, 650); bass(b, root, t, dur * 14, 0.08); }
        const mel = { 0: 76, 5: 72, 10: 71, 16: 69, 21: 72, 26: 77, 32: 74, 37: 72, 42: 69, 48: 68, 53: 71, 58: 74 };
        const m = mel[i % 64];
        if (m) ep(b, m, t, 0.05, 2.6);
        if (i % 2 === 0) noiseHit(b, t, 0.012, 6000, 'highpass', 0.02);
      },
    },
    // corredor: ostinato tenso e batida de coração
    corridor: {
      bpm: 92,
      step(i, t, b, dur) {
        const ost = [38, 38, 50, 38, 41, 38, 48, 38];
        pluck(b, ost[i % 8], t, 0.05, 380, 0.3);
        if (i % 16 === 0) { thump(b, t, 0.16); thump(b, t + 0.2, 0.1); }
        if (i % 2 === 1) noiseHit(b, t, 0.008, 8000, 'highpass', 0.04);
        if (i % 32 === 0) pad(b, Math.floor(i / 32) % 2 ? [46, 50, 53, 58] : [50, 53, 57, 62], t, dur * 32, 0.016, 600);
        if (i % 16 === 12 && Math.random() < 0.4) bell(b, 81, t, 0.012);
      },
    },
    // lobby: jazz noir com swing, piano elétrico e baixo andante
    lobby: {
      bpm: 80, swing: 0.6,
      step(i, t, b, dur) {
        const prog = [[38, [53, 57, 60, 64], true], [43, [53, 59, 64], false], [36, [52, 55, 59, 62], false], [45, [55, 58, 61, 64], false]];
        const [root, ch, minor] = prog[Math.floor(i / 8) % 4];
        const s = i % 8;
        if (s === 0) ch.forEach(n => ep(b, n, t, 0.02, 1.6));
        if (s === 3) ch.forEach(n => ep(b, n, t, 0.013, 0.5));
        if (s % 2 === 0) bass(b, root + [0, minor ? 3 : 4, 7, 10][s / 2], t, dur * 1.8, 0.1);
        if (s === 2 || s === 6) noiseHit(b, t, 0.02, 2500, 'bandpass', 0.14, 0.015);
        noiseHit(b, t, 0.006, 9000, 'highpass', 0.08);
        if (s % 2 === 1 && Math.random() < 0.22) ep(b, ch[Math.floor(Math.random() * ch.length)] + 12, t, 0.03, 1.2);
      },
    },
    // túneis: drone grave, rumores e metais distantes
    tunnels: {
      bpm: 50,
      start(b) { return [drone(b, 33, 'sawtooth', 0.03, 170, 10), drone(b, 33.2, 'sawtooth', 0.025, 150), drone(b, 21, 'sine', 0.05, 200)]; },
      step(i, t, b, dur) {
        if (i % 8 === 0) noiseHit(b, t, 0.035, 120, 'lowpass', 3, 1.5);
        if (Math.random() < 0.16) bell(b, [69, 70, 75, 76, 63][Math.floor(Math.random() * 5)], t, 0.018, 4);
        if (i % 32 === 16) pad(b, [45, 46], t, dur * 24, 0.014, 400);
      },
    },
    good: {
      bpm: 66,
      step(i, t, b, dur) {
        const prog = [[48, [60, 64, 67, 71]], [41, [57, 60, 64, 65]], [45, [57, 60, 64, 67]], [43, [55, 59, 62, 67]]];
        const [root, ch] = prog[Math.floor(i / 16) % 4];
        if (i % 16 === 0) { pad(b, ch, t, dur * 16, 0.024, 1400); bass(b, root, t, dur * 14, 0.09); }
        if (i % 2 === 0) ep(b, ch[(i / 2) % 4] + 12, t, 0.03, 1.6);
      },
    },
    bad: {
      bpm: 52,
      step(i, t, b, dur) {
        const prog = [[45, [57, 60, 64]], [41, [56, 60, 65]], [45, [57, 60, 64]], [40, [56, 59, 64]]];
        const [root, ch] = prog[Math.floor(i / 16) % 4];
        if (i % 16 === 0) { pad(b, ch, t, dur * 16, 0.024, 600); bass(b, root - 12, t, dur * 14, 0.1); }
        if (i % 8 === 4) ep(b, ch[2] + 12 - (Math.floor(i / 8) % 3), t, 0.03, 2.4);
      },
    },
  };

  // ---------- sequenciador com crossfade ----------
  let current = null, pendingMusic = null;

  function setMusic(name) {
    if (!THEMES[name]) return;
    if (!ac) { pendingMusic = name; return; }
    if (current && current.name === name) return;
    const now = ac.currentTime;
    if (current) {
      const old = current;
      ramp(old.bus.gain, 0, 2.5);
      setTimeout(() => { old.stops.forEach(s => s()); old.bus.disconnect(); }, 3000);
    }
    const bus = ac.createGain();
    bus.gain.setValueAtTime(0.0001, now);
    bus.gain.linearRampToValueAtTime(1, now + 3);
    bus.connect(musicBus);
    const th = THEMES[name];
    current = { name, th, bus, step: 0, next: now + 0.1, stops: th.start ? th.start(bus) : [] };
  }

  function schedule() {
    if (!current || ac.state !== 'running') return;
    const { th } = current;
    const dur = 60 / th.bpm / 2;
    while (current.next < ac.currentTime + 0.25) {
      const swing = th.swing && current.step % 2 ? dur * (th.swing - 0.5) * 2 : 0;
      try { th.step(current.step, current.next + swing, current.bus, dur); } catch (e) {}
      current.step++;
      current.next += dur;
    }
  }

  // ---------- efeitos ----------
  function tone(type, f0, f1, dur, vol, when = 0) {
    const t = ac.currentTime + when;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfx); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(dur, freq, vol, type = 'lowpass', when = 0, attack = 0.005) {
    noiseHit(sfx, ac.currentTime + when, vol, freq, type, dur, attack);
  }

  const FX = {
    click: () => tone('square', 900, 900, 0.04, 0.035),
    type: () => tone('square', 1500 + Math.random() * 300, 1500, 0.015, 0.01),
    step: () => noise(0.06, 500, 0.05, 'bandpass'),
    evidence: () => { tone('sine', 660, 660, 0.25, 0.12); tone('sine', 880, 880, 0.25, 0.12, 0.08); tone('sine', 1320, 1320, 0.5, 0.1, 0.16); },
    deduction: () => { [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, 1.2, 0.08, i * 0.07)); noise(1.2, 6000, 0.03, 'highpass', 0.1, 0.3); },
    wrong: () => { tone('sawtooth', 160, 70, 0.35, 0.08); tone('square', 120, 60, 0.35, 0.04); },
    scanOn: () => { tone('sine', 300, 1600, 0.35, 0.08); noise(0.3, 3000, 0.03, 'bandpass'); },
    scanOff: () => tone('sine', 1400, 250, 0.3, 0.07),
    door: () => { noise(0.5, 900, 0.12, 'lowpass', 0, 0.15); tone('sine', 90, 50, 0.3, 0.15, 0.4); },
    elevator: () => { tone('sine', 880, 880, 0.3, 0.07); tone('sine', 660, 660, 0.5, 0.07, 0.25); noise(1.2, 300, 0.08, 'lowpass', 0.2, 0.4); },
    rotate: () => tone('square', 600 + Math.random() * 200, 400, 0.05, 0.05),
    hackOk: () => { [440, 554, 659, 880].forEach((f, i) => tone('square', f, f, 0.15, 0.05, i * 0.06)); },
    act: () => { tone('sine', 60, 35, 2.5, 0.35); noise(2.5, 200, 0.15, 'lowpass', 0, 0.3); },
    accuse: () => { tone('sawtooth', 110, 110, 1.5, 0.06); tone('sawtooth', 116, 116, 1.5, 0.06); },
    // tiro: estalo agudo + estouro grave + eco do ambiente
    gunshot: () => {
      noise(0.06, 5000, 0.5, 'highpass', 0, 0.001); noise(0.35, 1600, 0.6, 'lowpass', 0, 0.001);
      tone('square', 160, 38, 0.18, 0.3); tone('sine', 90, 30, 0.3, 0.45);
      noise(0.5, 900, 0.12, 'lowpass', 0.12, 0.02); noise(0.6, 700, 0.06, 'lowpass', 0.28, 0.03);
    },
    enemyShot: () => {
      noise(0.05, 4000, 0.4, 'highpass', 0, 0.001); noise(0.4, 1100, 0.55, 'lowpass', 0, 0.001);
      tone('sawtooth', 130, 32, 0.22, 0.24); tone('sine', 75, 28, 0.35, 0.4);
      noise(0.6, 700, 0.1, 'lowpass', 0.15, 0.03);
    },
    // miado do gato-robô: sobe e desce, com um chiado metálico
    meow: () => {
      if (catBuf) { const s = ac.createBufferSource(); s.buffer = catBuf; s.playbackRate.value = 0.94 + Math.random() * 0.12; s.connect(voiceBus); s.start(); return; }
      const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
      const base = 520 + Math.random() * 120;
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(base * 0.8, t);
      o.frequency.exponentialRampToValueAtTime(base * 1.45, t + 0.18);
      o.frequency.exponentialRampToValueAtTime(base * 0.7, t + 0.6);
      f.type = 'bandpass'; f.Q.value = 3;
      f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(2200, t + 0.2); f.frequency.linearRampToValueAtTime(800, t + 0.6);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.06); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
      o.connect(f); f.connect(g); g.connect(voiceBus); o.start(t); o.stop(t + 0.7);
      tone('square', 3200, 2400, 0.08, 0.008, 0.05);
    },
    ricochet: () => tone('sine', 2200 + Math.random() * 800, 600, 0.25, 0.05),
    hurt: () => { tone('sawtooth', 200, 60, 0.4, 0.14); noise(0.3, 600, 0.2); },
    sit: () => { noise(0.18, 400, 0.08, 'lowpass'); tone('sine', 120, 70, 0.15, 0.06); },
    // entrar na água: a gravação, baixinha
    waterIn: () => {
      if (!waterBuf) return FX.splash();
      const s = ac.createBufferSource(), g = ac.createGain();
      s.buffer = waterBuf; g.gain.value = 0.22;
      s.connect(g); g.connect(sfx); s.start();
    },
    splash: () => { noise(0.35, 1400, 0.1, 'bandpass', 0, 0.01); noise(0.5, 600, 0.05, 'lowpass', 0.05, 0.05); },
    shower: () => { noise(4, 5000, 0.07, 'highpass', 0, 0.3); noise(4, 900, 0.05, 'bandpass', 0, 0.3); },
    sizzle: () => { noise(1.1, 4000, 0.06, 'highpass', 0, 0.05); for (let k = 0; k < 5; k++) noise(0.04, 2500, 0.05, 'bandpass', Math.random() * 1); },
    steam: () => { noise(1.6, 3000, 0.14, 'highpass', 0, 0.1); noise(1.6, 500, 0.06, 'lowpass', 0, 0.2); },
    clank: () => { tone('square', 180, 110, 0.08, 0.07); noise(0.1, 2500, 0.06, 'bandpass'); },
  };

  function play(name) {
    if (!ac || muted) return;
    try { FX[name] && FX[name](); } catch (e) {}
  }

  // "blablablá" de quem fala: uma sílaba curta com duas formantes, no tom da voz da pessoa
  const VOWELS = [[730, 1090], [530, 1840], [270, 2290], [570, 840], [300, 870]];
  function voice(pitch) {
    if (!ac || muted) return;
    try {
      const t = ac.currentTime, dur = 0.07 + Math.random() * 0.05;
      const o = ac.createOscillator(), g = ac.createGain();
      const f0 = pitch * (0.88 + Math.random() * 0.26);
      o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * (0.92 + Math.random() * 0.12), t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.38, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const [a, b] = VOWELS[Math.floor(Math.random() * VOWELS.length)];
      for (const [fq, q, v] of [[a, 2.5, 1], [b, 4, 0.6]]) {
        const bp = ac.createBiquadFilter(), m = ac.createGain();
        bp.type = 'bandpass'; bp.frequency.value = fq; bp.Q.value = q; m.gain.value = v;
        o.connect(bp); bp.connect(m); m.connect(g);
      }
      g.connect(voiceBus); o.start(t); o.stop(t + dur + 0.02);
    } catch (e) {}
  }

  // motor do carro voador: zumbido "bolha" retrofuturista que sobe com a velocidade
  let eng = null;
  function engine(on, speed = 0) {
    if (!ac) return;
    if (!on || muted) {
      if (eng) { const e = eng; eng = null; ramp(e.g.gain, 0, 0.25); setTimeout(() => { try { e.o.stop(); e.lfo.stop(); e.o2.stop(); } catch (err) {} }, 500); }
      return;
    }
    if (!eng) {
      const o = ac.createOscillator(), o2 = ac.createOscillator(), lfo = ac.createOscillator(), depth = ac.createGain();
      const f = ac.createBiquadFilter(), g = ac.createGain();
      o.type = 'sine'; o2.type = 'triangle'; lfo.type = 'sine';
      lfo.connect(depth); depth.connect(o.frequency); depth.connect(o2.frequency);
      f.type = 'lowpass'; f.frequency.value = 1800; f.Q.value = 4;
      o.connect(f); o2.connect(f); f.connect(g); g.connect(sfx);
      g.gain.value = 0;
      o.start(); o2.start(); lfo.start();
      eng = { o, o2, lfo, depth, f, g };
    }
    const s = Math.min(1, Math.max(0, speed)), t = ac.currentTime;
    const base = 220 + 520 * s;                                   // marcha lenta 220 Hz, até ~740 Hz
    eng.o.frequency.setTargetAtTime(base, t, 0.12);
    eng.o2.frequency.setTargetAtTime(base * 1.505, t, 0.12);
    eng.lfo.frequency.setTargetAtTime(7 + 9 * s, t, 0.12);       // o "blip-blip-blip" acelera junto
    eng.depth.gain.setTargetAtTime(base * (0.06 + 0.05 * s), t, 0.12);
    eng.g.gain.setTargetAtTime(0.05 + 0.12 * s, t, 0.1);
  }

  function thunder() {
    if (!ac || muted) return;
    noise(0.25, 3000, 0.12, 'highpass');
    noise(3.5, 160, 0.5, 'lowpass', 0.15, 0.25);
  }

  function toggleMute() {
    muted = !muted;
    try { localStorage.setItem('alvorada_muted', muted ? '1' : '0'); } catch (e) {}
    if (ac) ramp(master.gain, muted ? 0 : 0.9, 0.3);
    return muted;
  }

  function toggleMusic() {
    musicEnabled = !musicEnabled;
    try { localStorage.setItem('alvorada_music', musicEnabled ? '1' : '0'); } catch (e) {}
    if (ac) ramp(musicBus.gain, musicGain(), 0.8);
    return musicEnabled;
  }

  // nível (RMS) da trilha neste instante — usado pelos testes
  let meter = null, sfxMeter = null;
  // pico dos efeitos neste instante (testes)
  function sfxPeak() { if (!sfxMeter) return 0; const b = new Float32Array(sfxMeter.fftSize); sfxMeter.getFloatTimeDomainData(b); let m = 0; for (const x of b) m = Math.max(m, Math.abs(x)); return m; }
  function musicLevel() {
    if (!meter) return 0;
    const buf = new Float32Array(meter.fftSize);
    meter.getFloatTimeDomainData(buf);
    let sum = 0;
    for (const x of buf) sum += x * x;
    return Math.sqrt(sum / buf.length);
  }

  function setMusicVolume(v) {
    musicVol = Math.min(1, Math.max(0, v));
    if (musicVol > 0 && !musicEnabled) { musicEnabled = true; try { localStorage.setItem('alvorada_music', '1'); } catch (e) {} }
    try { localStorage.setItem('alvorada_music_vol', String(musicVol)); } catch (e) {}
    if (ac) ramp(musicBus.gain, musicGain(), 0.15);
  }

  function setSfxVolume(v) {
    sfxVol = Math.min(1, Math.max(0, v));
    try { localStorage.setItem('alvorada_sfx_vol', String(sfxVol)); } catch (e) {}
    if (ac) ramp(sfx.gain, sfxVol * SFX_MAX, 0.1);
  }
  function setVoiceVolume(v) {
    voiceVol = Math.min(1, Math.max(0, v));
    try { localStorage.setItem('alvorada_voice_vol', String(voiceVol)); } catch (e) {}
    if (ac) ramp(voiceBus.gain, voiceVol * VOICE_MAX, 0.1);
  }

  function suspend() { if (ac) ac.suspend(); }
  function resume() { if (ac) ac.resume(); }

  return { init, setRoom, setMusic, play, voice, engine, sfxPeak, thunder, toggleMute, toggleMusic, setMusicVolume, musicVolume: () => musicVol, setSfxVolume, sfxVolume: () => sfxVol, setVoiceVolume, voiceVolume: () => voiceVol, musicLevel, isMuted: () => muted, musicOn: () => musicEnabled, suspend, resume };
})();
