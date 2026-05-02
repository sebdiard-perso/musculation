const timer = {
  seconds: 90,
  remaining: 90,
  interval: null,
  audioBeep: null,
  audioEnd: null,
  wakeLock: null,

  init() {
    this.audioBeep = new Audio();
    this.audioEnd = new Audio();
    this.generateSounds();
    this.unlockAudio();
    this.updateDisplay();
  },

  unlockAudio() {
    const unlock = () => {
      [this.audioBeep, this.audioEnd].forEach(a => {
        if (a) { a.volume = 0; a.play().then(() => { a.pause(); a.volume = 1; }).catch(() => {}); }
      });
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('touchstart', unlock);
    document.addEventListener('click', unlock);
  },

  generateSounds() {
    const sr = 44100;
    const writeHeader = (view, samples, w) => {
      w(0, 'RIFF'); view.setUint32(4, 36 + samples * 2, true); w(8, 'WAVE');
      w(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
      view.setUint16(22, 1, true); view.setUint32(24, sr, true);
      view.setUint32(28, sr * 2, true); view.setUint16(32, 2, true);
      view.setUint16(34, 16, true); w(36, 'data'); view.setUint32(40, samples * 2, true);
    };
    const w = (view) => (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };

    // Countdown : 3 bips montants
    const cDur = 2.8, cN = Math.floor(sr * cDur);
    const cBuf = new ArrayBuffer(44 + cN * 2), cv = new DataView(cBuf);
    writeHeader(cv, cN, w(cv));
    for (let i = 0; i < cN; i++) {
      const t = i / sr; let s = 0;
      [[0, 880], [0.9, 1100], [1.8, 1400]].forEach(([start, freq]) => {
        const l = t - start;
        if (l >= 0 && l < 0.25) {
          const env = l < 0.01 ? l / 0.01 : Math.max(0, 1 - (l - 0.01) / 0.24);
          s += (Math.sin(2 * Math.PI * freq * l) * 0.7 +
                Math.sin(2 * Math.PI * freq * 2 * l) * 0.25 +
                Math.sin(2 * Math.PI * freq * 3 * l) * 0.1) * env;
        }
      });
      cv.setInt16(44 + i * 2, Math.max(-1, Math.min(1, s)) * 32767, true);
    }
    this.audioBeep.src = URL.createObjectURL(new Blob([cBuf], { type: 'audio/wav' }));
    this.audioBeep.load();

    // End : alarme buzzer
    const eDur = 1.5, eN = Math.floor(sr * eDur);
    const eBuf = new ArrayBuffer(44 + eN * 2), ev = new DataView(eBuf);
    writeHeader(ev, eN, w(ev));
    for (let i = 0; i < eN; i++) {
      const t = i / sr;
      const env = t < 0.02 ? t / 0.02 : Math.max(0, 1 - (t - 0.02) / 1.48);
      const f = Math.floor(t * 8) % 2 === 0 ? 1500 : 1900;
      const s = (Math.sin(2 * Math.PI * f * t) * 0.6 +
                 Math.sin(2 * Math.PI * f * 1.5 * t) * 0.3 +
                 Math.sin(2 * Math.PI * f * 0.5 * t) * 0.2) * env;
      ev.setInt16(44 + i * 2, Math.max(-1, Math.min(1, s)) * 32767, true);
    }
    this.audioEnd.src = URL.createObjectURL(new Blob([eBuf], { type: 'audio/wav' }));
    this.audioEnd.load();
  },

  set(secs) { this.stop(); this.seconds = secs; this.remaining = secs; this.updateDisplay(); },

  start() {
    if (this.interval) { this.stop(); this.updateBtn('▶️ Start'); this.releaseWake(); return; }
    if (this.remaining <= 0) this.remaining = this.seconds || 90;
    this.requestWake();
    const d = document.getElementById('timer-display');
    d.classList.add('running'); d.classList.remove('done');
    this.updateBtn('⏸️ Pause');
    this.interval = setInterval(() => {
      this.remaining--;
      this.updateDisplay();
      if (this.remaining === 3) this.audioBeep && (this.audioBeep.currentTime = 0, this.audioBeep.play().catch(() => {}));
      if (this.remaining <= 0) {
        this.stop(); d.classList.remove('running'); d.classList.add('done');
        this.updateBtn('▶️ Start');
        this.audioEnd && (this.audioEnd.currentTime = 0, this.audioEnd.play().catch(() => {}));
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
        this.releaseWake();
      }
    }, 1000);
  },

  stop() { clearInterval(this.interval); this.interval = null; },

  reset() {
    this.stop(); this.remaining = this.seconds || 90;
    const d = document.getElementById('timer-display');
    d.classList.remove('running', 'done');
    this.updateBtn('▶️ Start'); this.releaseWake(); this.updateDisplay();
  },

  autoStart(secs) { this.set(secs || this.seconds || 90); this.start(); },

  updateDisplay() {
    const m = Math.floor(this.remaining / 60), s = this.remaining % 60;
    document.getElementById('timer-display').textContent =
      `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  updateBtn(txt) { document.getElementById('btn-timer-start').textContent = txt; },

  async requestWake() {
    try { if ('wakeLock' in navigator) this.wakeLock = await navigator.wakeLock.request('screen'); } catch (e) {}
  },
  releaseWake() { if (this.wakeLock) { this.wakeLock.release().catch(() => {}); this.wakeLock = null; } },
};
