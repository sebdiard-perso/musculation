const timer = {
  seconds: 90,
  remaining: 90,
  interval: null,
  wakeLock: null,
  onEnd: null,

  // Web Audio API : ne coupe PAS Spotify sur iOS (catégorie audio "ambient")
  // À l'inverse de HTMLAudioElement qui force la catégorie "playback".
  audioCtx: null,
  beepBuffer: null,
  buzzerBuffer: null,

  // Mode "bypass silencieux" : joue les sons via un <video> caché.
  // Sur iOS, les <video> ignorent l'interrupteur muet — mais ça réquisitionne
  // la session audio en "playback" → Spotify est interrompu. C'est un compromis,
  // l'utilisateur l'active explicitement dans Réglages.
  bypassMute: false,
  beepVideo: null,
  buzzerVideo: null,

  // Planification précise des sons (évite la dérive de setInterval)
  _scheduledSources: [],
  _scheduledTimeouts: [],

  init() {
    this.bypassMute = localStorage.getItem('audioBypassMute') === '1';
    this.updateDisplay();
    // Déverrouiller le contexte audio à la 1ère interaction utilisateur (requis iOS)
    const unlock = () => {
      this._ensureCtx();
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      // Charger les fichiers MP3 décodés en buffers (une seule fois)
      if (!this.beepBuffer) this._loadSound('freesound_community-short-beep-tone-47916.mp3').then(b => this.beepBuffer = b).catch(() => {});
      if (!this.buzzerBuffer) this._loadSound('magiaz-bip-457700.mp3').then(b => this.buzzerBuffer = b).catch(() => {});
      // Préparer les <video> de bypass (chargés mais inactifs tant que bypassMute = false)
      this._prepareBypassVideos();
      // Jouer un buffer silencieux pour valider le déblocage iOS
      this._silentPing();
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('touchstart', unlock);
    document.addEventListener('click', unlock);

    // Resync quand l'app revient au premier plan (changement d'écran / onglet)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.interval) {
        // Réveiller l'AudioContext (iOS le suspend en background)
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
        // Recalculer remaining immédiatement
        this._tick();
        // Re-planifier les sons restants pour compenser la dérive
        this._scheduleEvents();
      }
    });
  },

  setBypassMute(enabled) {
    this.bypassMute = !!enabled;
    localStorage.setItem('audioBypassMute', this.bypassMute ? '1' : '0');
    if (this.bypassMute) this._prepareBypassVideos();
  },

  _prepareBypassVideos() {
    if (this.beepVideo && this.buzzerVideo) return;
    const make = (src) => {
      const v = document.createElement('video');
      v.src = src;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.preload = 'auto';
      v.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
      document.body.appendChild(v);
      // Tentative de chargement (sans son, juste pour amorcer iOS)
      v.load();
      return v;
    };
    this.beepVideo = make('freesound_community-short-beep-tone-47916.mp3');
    this.buzzerVideo = make('magiaz-bip-457700.mp3');
  },

  _playVideo(v) {
    if (!v) return false;
    try {
      v.currentTime = 0;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
      return true;
    } catch (e) { return false; }
  },

  _ensureCtx() {
    if (this.audioCtx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try { this.audioCtx = new Ctx(); } catch (e) {}
  },

  _silentPing() {
    if (!this.audioCtx) return;
    try {
      const buf = this.audioCtx.createBuffer(1, 1, 22050);
      const src = this.audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(this.audioCtx.destination);
      src.start(0);
    } catch (e) {}
  },

  async _loadSound(url) {
    if (!this.audioCtx) return null;
    const res = await fetch(url);
    const arr = await res.arrayBuffer();
    return new Promise((resolve, reject) => {
      this.audioCtx.decodeAudioData(arr, resolve, reject);
    });
  },

  _playBuffer(buffer, volume) {
    if (!this.audioCtx || !buffer) return false;
    try {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const src = this.audioCtx.createBufferSource();
      src.buffer = buffer;
      const gain = this.audioCtx.createGain();
      gain.gain.value = volume;
      src.connect(gain).connect(this.audioCtx.destination);
      src.start(0);
      return true;
    } catch (e) { return false; }
  },

  _tone(freq, duration, volume) {
    if (!this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(volume, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      osc.connect(gain).connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + duration);
    } catch (e) {}
  },

  // Flash visuel plein écran (utile en mode silencieux)
  _flash(color, count, totalMs) {
    const el = document.getElementById('timer-flash');
    if (!el) return;
    const single = totalMs / (count * 2);
    let i = 0;
    const tick = () => {
      if (i >= count * 2) { el.style.background = 'transparent'; el.classList.add('hidden'); return; }
      el.classList.remove('hidden');
      el.style.background = (i % 2 === 0) ? color : 'transparent';
      i++;
      setTimeout(tick, single);
    };
    tick();
  },

  playBeep() {
    if (this.bypassMute && this.beepVideo) {
      this._playVideo(this.beepVideo);
    } else if (!this._playBuffer(this.beepBuffer, 0.5)) {
      this._tone(880, 0.12, 0.35);
    }
    if (navigator.vibrate) navigator.vibrate(80);
  },

  playBuzzer() {
    if (this.bypassMute && this.buzzerVideo) {
      this._playVideo(this.buzzerVideo);
    } else if (!this._playBuffer(this.buzzerBuffer, 0.7)) {
      this._tone(660, 0.25, 0.45);
      setTimeout(() => this._tone(880, 0.25, 0.45), 250);
      setTimeout(() => this._tone(1100, 0.45, 0.5), 500);
    }
    // Vibration intense (perceptible même en silencieux)
    if (navigator.vibrate) navigator.vibrate([400, 120, 400, 120, 600]);
    // Flash visuel vert (3 fois) — visible même en mode silencieux
    this._flash('rgba(78,204,163,0.55)', 3, 900);
  },

  set(secs) { this.stop(); this.seconds = secs; this.remaining = secs; this.updateDisplay(); },

  // ---------- Sons déclenchés dans le tick (synchronisés avec le chrono) ----------
  // Plutôt que de pré-planifier les sons sur AudioContext.currentTime (qui se décale
  // quand iOS suspend l'AudioContext en background), on déclenche les sons dans _tick()
  // au moment exact où remaining passe sur 5, 4, 3, 2, 1 et 0.
  // Le chrono est calé sur Date.now() → les sons le sont aussi.
  _scheduleEvents() {
    // Annuler les anciens timeouts (vibration/flash)
    this._cancelScheduled();
    // Rien à pré-planifier — tout est géré dans _tick() maintenant
  },

  _scheduleBeep() {},
  _scheduleBuzzer() {},

  _cancelScheduled() {
    this._scheduledSources.forEach(s => { try { s.stop(); } catch (e) {} });
    this._scheduledSources = [];
    this._scheduledTimeouts.forEach(t => clearTimeout(t));
    this._scheduledTimeouts = [];
  },

  _tick() {
    const elapsed = Math.floor((Date.now() - this._startTime) / 1000);
    const prev = this.remaining;
    this.remaining = Math.max(0, this._startRemaining - elapsed);
    if (this.remaining !== prev) {
      this.updateDisplay();
      // Déclencher les sons en temps réel (synchronisés avec le chrono)
      if (this.remaining >= 1 && this.remaining <= 5 && prev > this.remaining) {
        this.playBeep();
      }
      if (this.remaining <= 0) {
        this.playBuzzer();
        clearInterval(this.interval);
        this.interval = null;
        this.setTimerClass('done');
        this.updateBtn('▶️ Start');
        this.releaseWake();
        if (this.onEnd) { const cb = this.onEnd; this.onEnd = null; setTimeout(cb, 500); }
      }
    }
  },

  _run() {
    this._startTime = Date.now();
    this._startRemaining = this.remaining;
    this._scheduleEvents();
    // Tick d'affichage rapide (80 ms) → l'écran ne lag jamais de plus de 80 ms
    // par rapport à la seconde réelle, donc image & son perçus synchronisés.
    this.interval = setInterval(() => this._tick(), 80);
  },

  start() {
    if (this.interval) { this.stop(); this.updateBtn('▶️ Start'); this.releaseWake(); return; }
    if (this.remaining <= 0) this.remaining = this.seconds || 90;
    this.requestWake();
    this.setTimerClass('running');
    this.updateBtn('⏸️ Pause');
    this._run();
  },

  stop() { clearInterval(this.interval); this.interval = null; this._cancelScheduled(); },

  reset() {
    this.stop(); this.remaining = this.seconds || 90;
    this.setTimerClass('');
    this.updateBtn('▶️ Start'); this.releaseWake(); this.updateDisplay();
  },

  autoStart(secs) { this.set(secs || this.seconds || 90); this.start(); },

  resume() {
    if (this.interval) return;
    if (this.remaining <= 0) return;
    this.requestWake();
    this.setTimerClass('running');
    this._run();
  },

  setTimerClass(cls) {
    ['timer-display', 'guided-timer-display'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('running', 'done');
      if (cls) el.classList.add(cls);
    });
  },

  updateDisplay() {
    const m = Math.floor(this.remaining / 60), s = this.remaining % 60;
    const txt = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    ['timer-display', 'guided-timer-display'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    });
  },

  updateBtn(txt) {
    const el = document.getElementById('btn-timer-start');
    if (el) el.textContent = txt;
    const gel = document.getElementById('guided-btn-start');
    if (gel) gel.textContent = txt.includes('Pause') ? '⏸️' : '▶️';
  },

  async requestWake() {
    try { if ('wakeLock' in navigator) this.wakeLock = await navigator.wakeLock.request('screen'); } catch (e) {}
  },
  releaseWake() { if (this.wakeLock) { this.wakeLock.release().catch(() => {}); this.wakeLock = null; } },
};
