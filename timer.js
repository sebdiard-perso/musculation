const timer = {
  seconds: 90,
  remaining: 90,
  interval: null,
  wakeLock: null,
  beepEl: null,
  buzzerEl: null,
  onEnd: null,

  init() {
    this.beepEl = new Audio('freesound_community-short-beep-tone-47916.mp3');
    this.buzzerEl = new Audio('magiaz-bip-457700.mp3');
    this.beepEl.preload = 'auto';
    this.buzzerEl.preload = 'auto';
    const unlock = () => {
      this.beepEl.play().then(() => { this.beepEl.pause(); this.beepEl.currentTime = 0; }).catch(() => {});
      this.buzzerEl.play().then(() => { this.buzzerEl.pause(); this.buzzerEl.currentTime = 0; }).catch(() => {});
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('touchstart', unlock);
    document.addEventListener('click', unlock);
    this.updateDisplay();
  },

  playBeep() {
    try {
      this.beepEl.currentTime = 0;
      this.beepEl.play().catch(() => {});
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate(100);
  },

  playBuzzer() {
    try {
      this.buzzerEl.currentTime = 0;
      this.buzzerEl.play().catch(() => {});
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 500]);
  },

  set(secs) { this.stop(); this.seconds = secs; this.remaining = secs; this.updateDisplay(); },

  _tick() {
    const elapsed = Math.floor((Date.now() - this._startTime) / 1000);
    const prev = this.remaining;
    this.remaining = Math.max(0, this._startRemaining - elapsed);
    if (this.remaining !== prev) {
      this.updateDisplay();
      if (this.remaining >= 1 && this.remaining <= 5 && prev > this.remaining) this.playBeep();
      if (this.remaining <= 0) {
        this.stop();
        this.setTimerClass('done');
        this.updateBtn('▶️ Start');
        this.playBuzzer();
        this.releaseWake();
        if (this.onEnd) { const cb = this.onEnd; this.onEnd = null; setTimeout(cb, 500); }
      }
    }
  },

  _run() {
    this._startTime = Date.now();
    this._startRemaining = this.remaining;
    this.interval = setInterval(() => this._tick(), 250);
  },

  start() {
    if (this.interval) { this.stop(); this.updateBtn('▶️ Start'); this.releaseWake(); return; }
    if (this.remaining <= 0) this.remaining = this.seconds || 90;
    this.requestWake();
    this.setTimerClass('running');
    this.updateBtn('⏸️ Pause');
    this._run();
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
