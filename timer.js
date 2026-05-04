const timer = {
  seconds: 90,
  remaining: 90,
  interval: null,
  wakeLock: null,
  sounds: {},
  onEnd: null,

  init() {
    // Charger les MP3
    this.sounds.beep = new Audio('freesound_community-short-beep-tone-47916.mp3');
    this.sounds.buzzer = new Audio('magiaz-bip-457700.mp3');
    this.sounds.beep.load();
    this.sounds.buzzer.load();
    this.unlockAudio();
    this.updateDisplay();
  },

  unlockAudio() {
    const unlock = () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      ctx.resume().catch(() => {});
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('touchstart', unlock);
    document.addEventListener('click', unlock);
  },

  playBeep() {
    const s = this.sounds.beep;
    if (s) { s.currentTime = 0; s.play().catch(() => {}); }
  },

  playBuzzer() {
    const s = this.sounds.buzzer;
    if (s) { s.currentTime = 0; s.play().catch(() => {}); }
  },

  set(secs) { this.stop(); this.seconds = secs; this.remaining = secs; this.updateDisplay(); },

  start() {
    if (this.interval) { this.stop(); this.updateBtn('▶️ Start'); this.releaseWake(); return; }
    if (this.remaining <= 0) this.remaining = this.seconds || 90;
    this.requestWake();
    this.setTimerClass('running');
    this.updateBtn('⏸️ Pause');
    this.interval = setInterval(() => {
      this.remaining--;
      this.updateDisplay();
      if (this.remaining === 3) this.playBeep();
      if (this.remaining === 2) this.playBeep();
      if (this.remaining === 1) this.playBeep();
      if (this.remaining <= 0) {
        this.stop();
        this.setTimerClass('done');
        this.updateBtn('▶️ Start');
        this.playBuzzer();
        if (navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 500]);
        this.releaseWake();
        if (this.onEnd) { const cb = this.onEnd; this.onEnd = null; setTimeout(cb, 500); }
      }
    }, 1000);
  },

  stop() { clearInterval(this.interval); this.interval = null; },

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
    this.interval = setInterval(() => {
      this.remaining--;
      this.updateDisplay();
      if (this.remaining === 3) this.playBeep();
      if (this.remaining === 2) this.playBeep();
      if (this.remaining === 1) this.playBeep();
      if (this.remaining <= 0) {
        this.stop();
        this.setTimerClass('done');
        this.updateBtn('▶️ Start');
        this.playBuzzer();
        if (navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 500]);
        this.releaseWake();
        if (this.onEnd) { const cb = this.onEnd; this.onEnd = null; setTimeout(cb, 500); }
      }
    }, 1000);
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
