const app = {
  exercises: JSON.parse(localStorage.getItem('exercises') || '[]'),
  history: JSON.parse(localStorage.getItem('history') || '[]'),
  customPrograms: JSON.parse(localStorage.getItem('customPrograms') || '[]'),
  currentWorkout: [],
  editingProgram: null,

  // CUSTOM MODAL
  showModal({ icon, title, msg, input, unit, placeholder, confirmText, cancelText, confirmClass, onConfirm }) {
    document.getElementById('modal-custom-icon').textContent = icon || '';
    document.getElementById('modal-custom-title').textContent = title || '';
    document.getElementById('modal-custom-msg').textContent = msg || '';
    const inputWrap = document.getElementById('modal-custom-input-wrap');
    const inputEl = document.getElementById('modal-custom-input');
    if (input) {
      inputWrap.classList.remove('hidden');
      inputEl.value = input;
      inputEl.placeholder = placeholder || '';
      document.getElementById('modal-custom-unit').textContent = unit || '';
      setTimeout(() => { inputEl.focus(); inputEl.select(); }, 100);
    } else {
      inputWrap.classList.add('hidden');
    }
    document.getElementById('modal-custom-buttons').innerHTML =
      `<button class="modal-btn-cancel" id="modal-custom-cancel">${cancelText || 'Annuler'}</button>` +
      `<button class="${confirmClass || 'modal-btn-confirm'}" id="modal-custom-ok">${confirmText || 'OK'}</button>`;
    document.getElementById('modal-custom').classList.remove('hidden');
    document.getElementById('modal-custom-cancel').onclick = () => this.closeCustomModal();
    document.getElementById('modal-custom-ok').onclick = () => {
      const val = input !== undefined ? inputEl.value : true;
      this.closeCustomModal();
      if (onConfirm) onConfirm(val);
    };
  },

  closeCustomModal() { document.getElementById('modal-custom').classList.add('hidden'); },

  init() {
    this.migrate();
    if (!this.exercises.length) {
      this.exercises = JSON.parse(JSON.stringify(DATA.defaultExercises));
      this.saveExercises();
    }
    this.setupNav();
    timer.init();
    this.renderAll();
  },

  migrate() {
    if (!this.exercises.length) return;
    const map = {
      'Développé couché': 'Développé couché barre', 'Squat': 'Squat barre',
      'Soulevé de terre': 'Soulevé de terre barre', 'Développé militaire': 'Développé militaire barre',
      'Curl biceps': 'Curl biceps haltères', 'Extension triceps': 'Dips sur banc (triceps)',
      'Barre au front (triceps)': 'Dips sur banc (triceps)',
      'Élévations latérales': 'Élévations latérales haltères',
      'Tirage vertical': 'Rowing barre buste penché', 'Presse à cuisses': 'Fentes haltères',
    };
    const defaultVids = {};
    DATA.defaultExercises.forEach(e => { if (e.video) defaultVids[e.name] = e.video; });
    let updated = false;
    this.exercises.forEach(e => {
      if (map[e.name]) { e.name = map[e.name]; updated = true; }
      if (!e.video && defaultVids[e.name]) { e.video = defaultVids[e.name]; updated = true; }
    });
    // Ajouter les exercices manquants des programmes
    const existingNames = new Set(this.exercises.map(e => e.name));
    DATA.defaultExercises.forEach(de => {
      if (!existingNames.has(de.name)) {
        this.exercises.push(JSON.parse(JSON.stringify(de)));
        updated = true;
      }
    });
    if (updated) this.saveExercises();
  },

  renderAll() {
    this.renderHome();
    this.renderExercises();
    this.renderHistory();
    this.renderWorkout();
    this.renderPrograms();
    calendar.render(this.history);
  },

  renderHome() {
    const h = new Date().getHours();
    const greet = h < 12 ? 'Bonjour ☀️' : h < 18 ? 'Bon après-midi 💪' : 'Bonsoir 🌙';
    const el = document.getElementById('home-greeting');
    if (el) el.textContent = greet;

    const container = document.getElementById('home-last-session');
    if (!container) return;
    if (!this.history.length) {
      container.innerHTML = `<div class="last-session-card"><div class="ls-title">Bienvenue !</div><div class="ls-summary">Aucune séance enregistrée. Lance-toi ! 🚀</div></div>`;
      return;
    }
    const last = this.history[0];
    const d = new Date(last.date);
    const ds = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const nbExos = last.exercises.length;
    const nbSets = last.exercises.reduce((s, e) => s + e.sets.length, 0);
    const names = last.exercises.map(e => e.name).slice(0, 3).join(', ');
    container.innerHTML = `<div class="last-session-card" onclick="app.showDetail(${last.id})">
      <div class="ls-title">📊 Dernière séance</div>
      <div class="ls-date">${ds}</div>
      <div class="ls-summary">${names}${nbExos > 3 ? '…' : ''}</div>
      <div class="ls-stats"><span class="ls-stat">${nbExos} exos</span><span class="ls-stat">${nbSets} séries</span></div>
    </div>`;
  },

  setupNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.goTo(btn.dataset.view);
      });
    });
  },

  goTo(view) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const navBtn = document.querySelector(`[data-view="${view}"]`);
    if (navBtn) navBtn.classList.add('active');
    // Sous-vues : garder "Plus" actif
    if (['calendar','exercises','history','settings','spotify'].includes(view)) {
      const moreBtn = document.querySelector('[data-view="more"]');
      if (moreBtn) moreBtn.classList.add('active');
    }
    document.getElementById(`view-${view}`).classList.add('active');
    if (view === 'calendar') calendar.render(this.history);
    if (view === 'settings') this.updateStats();
    if (view === 'spotify') { this.renderSpotify(); }
    else if (this.currentSpotifyUri) this.showSpotifyMini();
    window.scrollTo(0, 0);
  },

  saveExercises() { localStorage.setItem('exercises', JSON.stringify(this.exercises)); },
  saveHistory() { localStorage.setItem('history', JSON.stringify(this.history)); },
  saveCustomPrograms() { localStorage.setItem('customPrograms', JSON.stringify(this.customPrograms)); },

  getAllPrograms() { return [...DATA.programs, ...this.customPrograms]; },

  // TIMER DELEGATES
  setTimer(s) { timer.set(s); },
  startTimer() { timer.start(); },
  resetTimer() { timer.reset(); },

  // CALENDAR DELEGATES
  calendarPrev() { calendar.prev(this.history); },
  calendarNext() { calendar.next(this.history); },
  selectCalendarDay(d) { calendar.selectDay(d, this.history); },

  // WEIGHT SUGGESTION
  getLastPerformance(name) {
    for (const s of this.history) {
      const exo = s.exercises.find(e => e.name === name);
      if (exo) { const last = [...exo.sets].reverse().find(s => s.kg); if (last) return last; }
    }
    return null;
  },

  getSuggestedWeight(name) {
    const last = this.getLastPerformance(name);
    const exo = this.exercises.find(e => e.name === name);
    const defaultKg = exo?.defaultKg || 0;
    if (!last || !last.kg) {
      if (defaultKg) return { kg: defaultKg, reason: '⚖️ Poids par défaut', lastKg: defaultKg };
      return null;
    }
    const kg = parseFloat(last.kg);
    // Utiliser le poids par défaut (mis à jour par proposeWeightAdjustments) s'il existe
    if (defaultKg) return { kg: defaultKg, reason: `📊 Dernière séance : ${kg} kg`, lastKg: kg };
    return { kg, reason: '📊 Dernière séance', lastKg: kg };
  },

  // EXERCISES
  addExercise() {
    const name = document.getElementById('new-exo-name').value.trim();
    if (!name) return;
    const video = document.getElementById('new-exo-video').value.trim();
    const muscle = document.getElementById('new-exo-muscle').value;
    this.exercises.push({ id: Date.now(), name, muscle, video: video || '' });
    document.getElementById('new-exo-name').value = '';
    document.getElementById('new-exo-video').value = '';
    this.saveExercises();
    this.renderExercises();
  },

  deleteExercise(id) { this.exercises = this.exercises.filter(e => e.id !== id); this.saveExercises(); this.renderExercises(); },

  renderExercises() {
    document.getElementById('exercise-list').innerHTML = this.exercises.map(e => {
      const desc = DATA.descriptions[e.name];
      const preview = desc ? desc.exec.substring(0, 60) + '…' : '';
      return `<div class="exo-item">
        <div class="exo-info" onclick="app.showExoDesc('${e.name.replace(/'/g, "\\'")}')">
          <div class="name">${e.name}</div>
          <div class="muscle">${e.muscle}${e.defaultKg ? ` — <strong>${e.defaultKg} kg</strong>` : ''}</div>
          ${preview ? `<div class="exo-desc-preview">${preview}</div>` : ''}
        </div>
        <div class="exo-item-actions">
          <button onclick="app.editDefaultKg(${e.id})" title="Poids par défaut">⚖️</button>
          <button onclick="app.searchVideo(${e.id})">🔍</button>
          ${e.video ? `<button onclick="app.playVideo('${e.video}')">▶️</button>` : ''}
          <button onclick="app.editVideo(${e.id})">✏️</button>
          <button onclick="app.deleteExercise(${e.id})">🗑️</button>
        </div>
      </div>`;
    }).join('');
  },

  editDefaultKg(id) {
    const exo = this.exercises.find(e => e.id === id);
    if (!exo) return;
    this.showModal({
      icon: '⚖️', title: `Poids par défaut`,
      msg: exo.name,
      input: exo.defaultKg || '', unit: 'kg', placeholder: '0',
      confirmText: 'Enregistrer',
      onConfirm: (val) => {
        exo.defaultKg = val ? parseFloat(val) : 0;
        this.saveExercises();
        this.renderExercises();
      }
    });
  },

  showExoDesc(name) {
    const desc = DATA.descriptions[name];
    const anim = ANIMATIONS.get(name);
    document.getElementById('desc-title').textContent = name;
    document.getElementById('desc-content').innerHTML =
      `<div style="text-align:center;margin-bottom:16px;background:#1a1a2e;border-radius:12px;padding:16px;">${anim}</div>` +
      (desc
        ? `<div class="desc-section"><div class="desc-label">💪 Muscles ciblés</div>${desc.muscles}</div>
           <div class="desc-section"><div class="desc-label">📝 Exécution</div>${desc.exec}</div>`
        : '<p>Pas de description disponible.</p>');
    document.getElementById('modal-exo-desc').classList.remove('hidden');
  },

  searchVideo(id) {
    const exo = this.exercises.find(e => e.id === id);
    if (exo) window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exo.name + ' musculation tuto')}`, '_blank');
  },

  editVideo(id) {
    const exo = this.exercises.find(e => e.id === id);
    if (!exo) return;
    const url = prompt('URL YouTube pour "' + exo.name + '" :', exo.video || '');
    if (url === null) return;
    exo.video = url.trim();
    this.saveExercises();
    this.renderExercises();
  },

  // PROGRAMS
  renderPrograms() {
    const all = this.getAllPrograms();
    document.getElementById('program-list').innerHTML =
      `<button id="btn-new-program" onclick="app.newProgram()">+ Créer un programme</button>` +
      all.map(p => {
        const isCustom = this.customPrograms.some(cp => cp.id === p.id);
        return `<div class="program-card">
          <div class="program-header">
            <h2>${p.name}</h2>
            ${isCustom ? `<div class="program-actions">
              <button onclick="app.editProgram('${p.id}')">✏️</button>
              <button onclick="app.deleteProgram('${p.id}')">🗑️</button>
            </div>` : ''}
          </div>
          <p class="program-desc">${p.desc}</p>
          <div class="program-days">
            ${p.days.map((day, di) => `
              <div class="program-day">
                <div class="day-header"><h3>${day.name}</h3>
                  <button class="btn-start-day" onclick="app.startProgramDay('${p.id}',${di})">🚀 Lancer</button></div>
                <div class="day-exercises">
                  ${day.exercises.map(e => {
                    const tech = e.lastSetTechnique ? DATA.techniques[e.lastSetTechnique] : null;
                    const t = tech ? `<span class="day-tech" style="color:${tech.color}">${tech.emoji} ${tech.label} <button class="btn-tech-info" onclick="event.stopPropagation();app.showTechniqueDetail('${e.lastSetTechnique}')">ℹ️</button></span>` : '';
                    return `<div class="day-exo">${e.name} — ${e.sets}×${e.reps} ${t}</div>`;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
      }).join('');
  },

  newProgram() {
    this.editingProgram = { id: 'custom_' + Date.now(), name: '', desc: '', days: [{ name: 'Jour 1', exercises: [] }] };
    this.openProgramEditor();
  },

  editProgram(id) {
    const p = this.customPrograms.find(cp => cp.id === id);
    if (!p) return;
    this.editingProgram = JSON.parse(JSON.stringify(p));
    this.openProgramEditor();
  },

  deleteProgram(id) {
    this.showModal({
      icon: '🗑️', title: 'Supprimer ce programme ?',
      msg: 'Cette action est irréversible.',
      confirmText: 'Supprimer', confirmClass: 'modal-btn-danger',
      onConfirm: () => {
        this.customPrograms = this.customPrograms.filter(p => p.id !== id);
        this.saveCustomPrograms();
        this.renderPrograms();
      }
    });
  },

  openProgramEditor() {
    const p = this.editingProgram;
    const repOptions = ['5-6','6-8','8-10','10-12','12-15','15-20','21'].map(r => `<option value="${r}">${r}</option>`).join('');

    const renderDays = () => p.days.map((day, di) => `
      <div class="editor-day">
        <div class="editor-day-header">
          <input type="text" value="${day.name}" placeholder="Nom du jour" onchange="app.editingProgram.days[${di}].name=this.value">
          ${p.days.length > 1 ? `<button onclick="app.editorRemoveDay(${di})">🗑️</button>` : ''}
        </div>
        ${day.exercises.map((ex, exi) => `
          <div class="editor-exo-row">
            <div class="editor-exo-move">
              ${exi > 0 ? `<button onclick="app.editorMoveExo(${di},${exi},-1)">▲</button>` : '<button disabled>▲</button>'}
              ${exi < day.exercises.length - 1 ? `<button onclick="app.editorMoveExo(${di},${exi},1)">▼</button>` : '<button disabled>▼</button>'}
            </div>
            <select onchange="app.editingProgram.days[${di}].exercises[${exi}].name=this.value">
              <option value="">-- Exercice --</option>
              ${this.exercises.map(e => `<option value="${e.name}" ${e.name===ex.name?'selected':''}>${e.name}</option>`).join('')}
            </select>
            <input type="number" value="${ex.sets}" min="1" max="10" style="width:45px" placeholder="S" onchange="app.editingProgram.days[${di}].exercises[${exi}].sets=+this.value">
            <select onchange="app.editingProgram.days[${di}].exercises[${exi}].reps=this.value" style="width:65px">
              ${['5-6','6-8','8-10','10-12','12-15','15-20','21'].map(r => `<option value="${r}" ${ex.reps===r?'selected':''}>${r}</option>`).join('')}
            </select>
            <input type="number" value="${ex.kg || ''}" min="0" step="0.5" style="width:55px" placeholder="kg" onchange="app.editingProgram.days[${di}].exercises[${exi}].kg=+this.value">
            <select onchange="app.editorSetTechnique(${di},${exi},this.value)" style="width:70px">
              <option value="">Tech.</option>
              ${Object.entries(DATA.techniques).map(([k, v]) => `<option value="${k}" ${ex.lastSetTechnique===k?'selected':''}>${v.emoji}</option>`).join('')}
            </select>
            <button onclick="app.editorRemoveExo(${di},${exi})">✕</button>
          </div>
          ${ex.lastSetTechnique && DATA.techniques[ex.lastSetTechnique] ? `<div class="editor-tech-desc" style="color:${DATA.techniques[ex.lastSetTechnique].color}">${DATA.techniques[ex.lastSetTechnique].emoji} ${DATA.techniques[ex.lastSetTechnique].label} — ${DATA.techniques[ex.lastSetTechnique].desc}</div>` : ''}
        `).join('')}
        <button class="btn-add-set" onclick="app.editorAddExo(${di})">+ Exercice</button>
      </div>
    `).join('');

    document.getElementById('desc-title').textContent = p.name ? 'Modifier programme' : 'Nouveau programme';
    document.getElementById('desc-content').innerHTML = `
      <div class="editor-form">
        <input type="text" id="editor-name" value="${p.name}" placeholder="Nom du programme" class="editor-input-big">
        <input type="text" id="editor-desc" value="${p.desc}" placeholder="Description" class="editor-input-big">
        <div id="editor-days">${renderDays()}</div>
        <button class="btn-add-set" onclick="app.editorAddDay()" style="margin-top:8px">+ Ajouter un jour</button>
        <button id="btn-save-program" onclick="app.saveProgram()">💾 Enregistrer</button>
      </div>`;
    document.getElementById('modal-exo-desc').classList.remove('hidden');
  },

  editorSetTechnique(di, exi, val) {
    this.editingProgram.days[di].exercises[exi].lastSetTechnique = val;
    this.openProgramEditor();
  },

  editorMoveExo(di, exi, direction) {
    const exos = this.editingProgram.days[di].exercises;
    const target = exi + direction;
    if (target < 0 || target >= exos.length) return;
    [exos[exi], exos[target]] = [exos[target], exos[exi]];
    this.openProgramEditor();
  },

  editorAddDay() {
    this.editingProgram.days.push({ name: `Jour ${this.editingProgram.days.length + 1}`, exercises: [] });
    this.openProgramEditor();
  },

  editorRemoveDay(di) {
    this.editingProgram.days.splice(di, 1);
    this.openProgramEditor();
  },

  editorAddExo(di) {
    this.editingProgram.days[di].exercises.push({ name: '', sets: 3, reps: '8-10', kg: 0, lastSetTechnique: '' });
    this.openProgramEditor();
  },

  editorRemoveExo(di, exi) {
    this.editingProgram.days[di].exercises.splice(exi, 1);
    this.openProgramEditor();
  },

  saveProgram() {
    const p = this.editingProgram;
    p.name = document.getElementById('editor-name').value.trim();
    p.desc = document.getElementById('editor-desc').value.trim();
    if (!p.name) { alert('Donne un nom au programme'); return; }
    if (!p.days.some(d => d.exercises.some(e => e.name))) { alert('Ajoute au moins un exercice'); return; }
    // Nettoyer les exercices vides
    p.days.forEach(d => { d.exercises = d.exercises.filter(e => e.name); });
    p.days = p.days.filter(d => d.exercises.length);

    const idx = this.customPrograms.findIndex(cp => cp.id === p.id);
    if (idx >= 0) this.customPrograms[idx] = p;
    else this.customPrograms.push(p);

    this.saveCustomPrograms();
    this.editingProgram = null;
    document.getElementById('modal-exo-desc').classList.add('hidden');
    this.renderPrograms();
  },

  guidedMode: false,
  guidedExoIndex: 0,
  guidedSetIndex: 0,
  restTime: 90,
  restBetweenExos: 180,
  restPauseCount: 0,

  startProgramDay(pid, di) {
    const prog = this.getAllPrograms().find(p => p.id === pid);
    if (!prog) return;
    const day = prog.days[di];

    this.showModal({
      icon: '⏱️', title: 'Temps de repos',
      msg: 'Combien de secondes de repos entre les séries ?',
      input: '90', unit: 'sec', placeholder: '90',
      confirmText: 'C\'est parti 🚀',
      onConfirm: (val) => {
        this.restTime = parseInt(val) || 90;
        this.restBetweenExos = 180;
        this._launchDay(day);
      }
    });
  },

  _launchDay(day) {
    this.currentWorkout = day.exercises.map(pe => {
      const exo = this.exercises.find(e => e.name === pe.name);
      const sug = this.getSuggestedWeight(pe.name);
      const kg = pe.kg || (sug ? sug.kg : (exo?.defaultKg || ''));
      const defaultReps = pe.reps.includes('-') ? pe.reps.split('-')[1] : pe.reps.replace(/\/jambe/, '');
      const sets = [];
      for (let i = 0; i < pe.sets; i++) {
        const isLast = i === pe.sets - 1;
        // Utiliser les reps de la dernière séance si disponibles
        const savedReps = exo?.lastReps?.[i] || defaultReps;
        sets.push({ kg, reps: (isLast && pe.lastSetTechnique === '21') ? '21' : savedReps, feeling: '',
          technique: (isLast && pe.lastSetTechnique) ? pe.lastSetTechnique : '' });
      }
      return { exerciseId: exo ? exo.id : 0, name: pe.name, muscle: exo ? exo.muscle : '',
        video: exo ? exo.video || '' : '', targetReps: pe.reps, suggestion: sug, sets };
    });

    this.guidedMode = true;
    this.guidedExoIndex = 0;
    this.guidedSetIndex = 0;
    this.restPauseCount = 0;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelector('[data-view="workout"]').classList.add('active');
    document.getElementById('view-workout').classList.add('active');
    document.getElementById('workout-free').classList.add('hidden');
    document.getElementById('workout-guided').classList.remove('hidden');
    this.renderGuided();
  },

  renderGuided() {
    const exo = this.currentWorkout[this.guidedExoIndex];
    if (!exo) return;
    const set = exo.sets[this.guidedSetIndex];
    if (!set) return;
    const totalExos = this.currentWorkout.length;
    const totalSets = exo.sets.length;
    const tech = set.technique ? DATA.techniques[set.technique] : null;
    const isRestPause = set.technique === 'rest-pause';

    // Progress dots (exercices)
    document.getElementById('guided-progress').innerHTML = this.currentWorkout.map((e, i) => {
      const done = e.sets.every(s => s.feeling);
      const cls = i === this.guidedExoIndex ? 'active' : (done ? 'done' : '');
      return `<div class="progress-dot ${cls}">${i + 1}</div>`;
    }).join('');

    // Animation
    document.getElementById('guided-animation').innerHTML = ANIMATIONS.get(exo.name);

    // Nom + muscle
    document.getElementById('guided-exo-name').textContent = exo.name;
    document.getElementById('guided-exo-muscle').innerHTML =
      `${exo.muscle}${exo.targetReps ? ` — Objectif : ${exo.targetReps}` : ''}`;

    // Série en cours
    const rpLabel = isRestPause && this.restPauseCount > 0 ? ` (rest-pause ${this.restPauseCount}/3)` : '';
    const techBadge = tech
      ? `<div class="technique-badge" style="border-color:${tech.color};color:${tech.color};margin-bottom:12px">${tech.emoji} ${tech.label}<span class="tech-desc">${tech.desc}</span></div>
         ${tech.detail ? `<div class="tech-detail"><div class="tech-detail-exec">${tech.detail.execution.replace(/\n/g, '<br>')}</div><div class="tech-detail-conseil">💡 ${tech.detail.conseil}</div></div>` : ''}`
      : '';

    document.getElementById('guided-current-set').innerHTML = `
      ${techBadge}
      <div class="guided-set-label">Série ${this.guidedSetIndex + 1} / ${totalSets}${rpLabel}</div>
      <div class="guided-set-sub">Exercice ${this.guidedExoIndex + 1} / ${totalExos}</div>
      <div class="guided-inputs">
        <div class="guided-input-group">
          <label>Poids</label>
          <input type="number" inputmode="decimal" value="${set.kg}" placeholder="0"
            onchange="app.currentWorkout[${this.guidedExoIndex}].sets[${this.guidedSetIndex}].kg=this.value">
        </div>
        <div class="guided-input-group">
          <label>Reps</label>
          <input type="number" inputmode="numeric" value="${set.reps}" placeholder="0"
            onchange="app.currentWorkout[${this.guidedExoIndex}].sets[${this.guidedSetIndex}].reps=this.value">
        </div>
      </div>

    `;

    // Bouton suivant
    const isLastSet = this.guidedSetIndex === totalSets - 1;
    const isLastExo = this.guidedExoIndex === totalExos - 1;
    let btnText;
    if (isRestPause && this.restPauseCount < 3) btnText = `⏱️ Rest-Pause ${this.restPauseCount + 1}/3 (15s)`;
    else if (isLastSet && isLastExo) btnText = '✅ Terminer la séance';
    else if (isLastSet) btnText = 'Exercice suivant ▶ (3min)';
    else btnText = 'Série suivante ▶';
    document.getElementById('guided-next').textContent = btnText;
  },

  guidedSetFeeling(rpe) {
    const set = this.currentWorkout[this.guidedExoIndex].sets[this.guidedSetIndex];
    set.feeling = rpe;
    this.closeRpeModal();
    this._afterRpe();
  },

  showRpeModal(afterCb) {
    this._afterRpe = afterCb;
    document.getElementById('modal-rpe').classList.remove('hidden');
  },

  closeRpeModal() {
    document.getElementById('modal-rpe').classList.add('hidden');
  },

  showTimerPopup(label, extraHtml) {
    document.getElementById('guided-timer-label').textContent = label || 'Repos';
    document.getElementById('guided-timer-extra').innerHTML = extraHtml || '';
    document.getElementById('guided-timer-pause').textContent = '⏸️ Pause';
    document.getElementById('guided-timer').classList.remove('hidden');
  },

  hideTimerPopup() {
    document.getElementById('guided-timer').classList.add('hidden');
  },

  skipTimer() {
    const cb = timer.onEnd;
    timer.stop();
    timer.setTimerClass('');
    timer.onEnd = null;
    this.hideTimerPopup();
    if (cb) cb();
  },

  quitProgram() {
    this.showModal({
      icon: '⚠️', title: 'Arrêter le programme ?',
      msg: 'Les données non terminées seront perdues.',
      confirmText: 'Arrêter', confirmClass: 'modal-btn-danger',
      onConfirm: () => {
        timer.stop();
        timer.onEnd = null;
        this.hideTimerPopup();
        this.currentWorkout = [];
        this.guidedMode = false;
        this.guidedExoIndex = 0;
        this.guidedSetIndex = 0;
        this.restPauseCount = 0;
        document.getElementById('workout-guided').classList.add('hidden');
        document.getElementById('workout-free').classList.remove('hidden');
        timer.reset();
        this.renderHome();
      }
    });
  },

  pauseTimer() {
    const btn = document.getElementById('guided-timer-pause');
    if (timer.interval) {
      timer.stop();
      timer.setTimerClass('');
      btn.textContent = '▶️ Reprendre';
    } else {
      timer.resume();
      btn.textContent = '⏸️ Pause';
    }
  },

  guidedNext() {
    const exo = this.currentWorkout[this.guidedExoIndex];
    const set = exo.sets[this.guidedSetIndex];
    const isRestPause = set.technique === 'rest-pause';
    const isLastSet = this.guidedSetIndex === exo.sets.length - 1;
    const isLastExo = this.guidedExoIndex === this.currentWorkout.length - 1;

    // Rest-pause : d'abord la série normale (count=0), puis 3 rounds de 15s
    if (isRestPause && this.restPauseCount < 3) {
      this.restPauseCount++;
      this.showTimerPopup(`Rest-Pause ${this.restPauseCount}/3`);
      timer.onEnd = () => { this.hideTimerPopup(); this.renderGuided(); };
      timer.autoStart(15);
      this.renderGuided();
      return;
    }

    // Demander le RPE avant de continuer
    if (!set.feeling) {
      this.showRpeModal(() => this._continueAfterRpe());
      return;
    }
    this._continueAfterRpe();
  },

  _continueAfterRpe() {
    const exo = this.currentWorkout[this.guidedExoIndex];
    const set = exo.sets[this.guidedSetIndex];
    const isRestPause = set.technique === 'rest-pause';
    const isLastSet = this.guidedSetIndex === exo.sets.length - 1;
    const isLastExo = this.guidedExoIndex === this.currentWorkout.length - 1;

    this.restPauseCount = 0;

    if (isLastSet && isLastExo) {
      this.finishWorkout();
      return;
    }

    if (isLastSet) {
      this.guidedExoIndex++;
      this.guidedSetIndex = 0;
      this.renderGuided();
      window.scrollTo(0, 0);
      const nextExo = this.currentWorkout[this.guidedExoIndex];
      const nextKg = nextExo.sets[0]?.kg || '';
      const desc = DATA.descriptions[nextExo.name];
      const kgHtml = nextKg ? `<div class="next-exo-kg">⚖️ ${nextKg} kg</div>` : '';
      const descHtml = desc
        ? `<div class="next-exo-preview"><div class="next-exo-title">Prochain : ${nextExo.name}</div>${kgHtml}<div class="next-exo-muscles">${desc.muscles}</div></div>`
        : `<div class="next-exo-preview"><div class="next-exo-title">Prochain : ${nextExo.name}</div>${kgHtml}</div>`;
      this.showTimerPopup('Repos entre exercices', descHtml);
      timer.onEnd = () => this.hideTimerPopup();
      timer.autoStart(this.restBetweenExos);
    } else {
      this.showTimerPopup('Repos');
      timer.onEnd = () => {
        this.hideTimerPopup();
        this.guidedSetIndex++;
        this.renderGuided();
        window.scrollTo(0, 0);
      };
      timer.autoStart(this.restTime);
    }
  },

  // WORKOUT
  showExercisePicker() {
    document.getElementById('picker-list').innerHTML = this.exercises.map(e =>
      `<div class="picker-item" onclick="app.addExoToWorkout(${e.id})">
        <div class="name">${e.name}</div><div class="muscle">${e.muscle}</div></div>`
    ).join('');
    document.getElementById('modal-picker').classList.remove('hidden');
  },
  closeModal() { document.getElementById('modal-picker').classList.add('hidden'); },

  addExoToWorkout(id) {
    const exo = this.exercises.find(e => e.id === id);
    if (!exo) return;
    const sug = this.getSuggestedWeight(exo.name);
    this.currentWorkout.push({ exerciseId: exo.id, name: exo.name, muscle: exo.muscle,
      video: exo.video || '', targetReps: '', suggestion: sug,
      sets: [{ kg: sug ? sug.kg : '', reps: '', feeling: '', technique: '' }] });
    this.closeModal();
    this.showWorkoutActive();
    this.renderWorkout();
  },

  showWorkoutActive() {
    document.getElementById('workout-free').classList.add('hidden');
    document.getElementById('workout-active').classList.remove('hidden');
  },

  showWorkoutHome() {
    document.getElementById('workout-active').classList.add('hidden');
    document.getElementById('workout-free').classList.remove('hidden');
    this.renderHome();
  },

  removeExoFromWorkout(i) { this.currentWorkout.splice(i, 1); this.renderWorkout(); },

  addSet(ei) {
    const last = this.currentWorkout[ei].sets.at(-1);
    this.currentWorkout[ei].sets.push({ kg: last?.kg || '', reps: last?.reps || '', feeling: '', technique: '' });
    this.renderWorkout();
  },

  removeSet(ei, si) {
    if (this.currentWorkout[ei].sets.length <= 1) return;
    this.currentWorkout[ei].sets.splice(si, 1);
    this.renderWorkout();
  },

  updateSet(ei, si, field, val) { this.currentWorkout[ei].sets[si][field] = val; },

  setFeeling(ei, si, feeling) {
    this.currentWorkout[ei].sets[si].feeling = feeling;
    const set = this.currentWorkout[ei].sets[si];
    timer.autoStart(set.technique === 'rest-pause' ? 15 : timer.seconds || 90);
    this.renderWorkout();
  },

  renderWorkout() {
    const c = document.getElementById('workout-exercises');
    if (!this.currentWorkout.length) {
      c.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px;">Ajoute un exercice ou lance un programme 💪</p>';
      return;
    }
    c.innerHTML = this.currentWorkout.map((exo, ei) => {
      const sug = exo.suggestion;
      const sugH = sug ? `<div class="suggestion">💡 Suggestion : <strong>${sug.kg} kg</strong> <span class="sug-reason">(dernière fois ${sug.lastKg}kg — ${sug.reason})</span></div>` : '';
      const tgtH = exo.targetReps ? `<span class="target-reps">Objectif : ${exo.targetReps} reps</span>` : '';
      return `<div class="workout-exo-card">
        <button class="btn-remove-exo" onclick="app.removeExoFromWorkout(${ei})">✕</button>
        <h3>${exo.name}
          ${exo.video ? `<button class="btn-video" onclick="app.playVideo('${exo.video}')">▶️ Vidéo</button>` : ''}
          <button class="btn-video" onclick="app.searchVideoByName('${exo.name.replace(/'/g, "\\'")}')">🔍</button>
          <button class="btn-video" onclick="app.showExoDesc('${exo.name.replace(/'/g, "\\'")}')">ℹ️</button>
        </h3>
        <div class="muscle-tag">${exo.muscle} ${tgtH}</div>
        ${sugH}
        ${exo.sets.map((set, si) => {
          const tech = set.technique ? DATA.techniques[set.technique] : null;
          const badge = tech ? `<div class="technique-badge" style="border-color:${tech.color};color:${tech.color}">${tech.emoji} ${tech.label} <button class="btn-video" onclick="app.showTechniqueDetail('${set.technique}')">ℹ️</button><span class="tech-desc">${tech.desc}</span></div>` : '';
          return `<div class="set-block">${badge}
            <div class="set-row">
              <span>Série ${si + 1}</span>
              <input type="number" inputmode="decimal" placeholder="kg" value="${set.kg}" onchange="app.updateSet(${ei},${si},'kg',this.value)">
              <input type="number" inputmode="numeric" placeholder="reps" value="${set.reps}" onchange="app.updateSet(${ei},${si},'reps',this.value)">
              <button onclick="app.removeSet(${ei},${si})">✕</button>
            </div>
            <div class="feeling-row"><span>Ressenti :</span>
              <button class="feeling-btn ${set.feeling==='easy'?'active easy':''}" onclick="app.setFeeling(${ei},${si},'easy')">😎 Facile</button>
              <button class="feeling-btn ${set.feeling==='correct'?'active correct':''}" onclick="app.setFeeling(${ei},${si},'correct')">👍 OK</button>
              <button class="feeling-btn ${set.feeling==='hard'?'active hard':''}" onclick="app.setFeeling(${ei},${si},'hard')">😤 Dur</button>
              <button class="feeling-btn ${set.feeling==='fail'?'active fail':''}" onclick="app.setFeeling(${ei},${si},'fail')">❌ Raté</button>
            </div></div>`;
        }).join('')}
        <button class="btn-add-set" onclick="app.addSet(${ei})">+ Série</button>
      </div>`;
    }).join('');
  },

  finishWorkout() {
    if (!this.currentWorkout.length) return;
    if (!this.currentWorkout.some(e => e.sets.some(s => s.kg || s.reps))) { alert('Remplis au moins une série !'); return; }
    this.history.unshift({ id: Date.now(), date: new Date().toISOString(), exercises: JSON.parse(JSON.stringify(this.currentWorkout)) });
    this.saveHistory();

    // Sauvegarder les reps et poids réalisés sur chaque exercice
    this.currentWorkout.forEach(we => {
      const exo = this.exercises.find(e => e.name === we.name);
      if (!exo) return;
      const repsArr = we.sets.map(s => s.reps || '').filter(r => r);
      if (repsArr.length) exo.lastReps = repsArr;
      // Mettre à jour le poids par défaut avec le dernier poids utilisé
      const lastKg = we.sets.filter(s => s.kg).map(s => parseFloat(s.kg)).pop();
      if (lastKg && !exo.defaultKg) exo.defaultKg = lastKg;
    });
    this.saveExercises();

    this.proposeWeightAdjustments();

    this.currentWorkout = [];
    this.guidedMode = false;
    this.guidedExoIndex = 0;
    this.guidedSetIndex = 0;
    this.restPauseCount = 0;
    document.getElementById('workout-guided').classList.add('hidden');
    document.getElementById('workout-active').classList.add('hidden');
    document.getElementById('workout-free').classList.remove('hidden');
    this.renderHome();
    this.renderWorkout();
    this.renderHistory();
    this.renderExercises();
    timer.reset();
    calendar.render(this.history);
    alert('Séance enregistrée ! 🎉');
  },

  proposeWeightAdjustments() {
    const lastSession = this.history[0];
    if (!lastSession) return;

    const proposals = [];
    lastSession.exercises.forEach(we => {
      const setsWithData = we.sets.filter(s => s.feeling && s.kg && s.reps);
      if (!setsWithData.length) return;

      const exo = this.exercises.find(e => e.name === we.name);
      if (!exo) return;

      // Palier selon le groupe musculaire
      const increment = DATA.weightIncrements[exo.muscle] || 1;
      if (increment === 0) return; // Abdos, pas de proposition

      // Analyser la dernière série (la plus représentative)
      const lastSet = setsWithData.at(-1);
      const rpe = parseInt(lastSet.feeling);
      const repsRealized = parseInt(lastSet.reps);
      const lastKg = parseFloat(lastSet.kg);

      if (isNaN(rpe) || isNaN(repsRealized) || isNaN(lastKg)) return;

      // Extraire le haut de la plage de reps
      let maxReps = 10;
      if (we.targetReps) {
        const parts = we.targetReps.replace(/\/jambe/, '').split('-');
        maxReps = parseInt(parts[parts.length - 1]) || 10;
      }

      // Décision
      let decision = 'same'; // same, up, down
      if (repsRealized >= maxReps && rpe <= 8) {
        decision = 'up';
      } else if (rpe >= 10 && repsRealized < maxReps - 2) {
        decision = 'down';
      }

      if (decision === 'same') return;

      const newKg = decision === 'up'
        ? lastKg + increment
        : Math.max(0, lastKg - increment);

      if (newKg === lastKg) return;

      proposals.push({
        exo, name: we.name, lastKg, newKg, increment, decision,
        rpe, repsRealized, maxReps, muscle: exo.muscle
      });
    });

    if (!proposals.length) return;

    const showNext = (i) => {
      if (i >= proposals.length) return;
      const p = proposals[i];
      const arrow = p.decision === 'up' ? '⬆️' : '⬇️';
      const reason = p.decision === 'up'
        ? `${p.repsRealized} reps (obj: ${p.maxReps}) à RPE ${p.rpe} → prêt à monter`
        : `RPE 10 avec ${p.repsRealized} reps (obj: ${p.maxReps}) → trop lourd`;
      this.showModal({
        icon: arrow, title: p.name,
        msg: `${p.muscle} — palier ${p.increment} kg\n${reason}\n\n${p.lastKg} kg → ${p.newKg} kg`,
        confirmText: `Valider ${p.newKg} kg`, cancelText: `Garder ${p.lastKg} kg`,
        onConfirm: () => {
          p.exo.defaultKg = p.newKg;
          this.saveExercises();
          showNext(i + 1);
        }
      });
      document.getElementById('modal-custom-cancel').onclick = () => { this.closeCustomModal(); showNext(i + 1); };
    };
    showNext(0);
  },

  // HISTORY
  renderHistory() {
    const list = document.getElementById('history-list');
    if (!this.history.length) { list.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px;">Aucune séance enregistrée</p>'; return; }
    list.innerHTML = this.history.map(h => {
      const d = new Date(h.date);
      const ds = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      const names = h.exercises.map(e => e.name).join(', ');
      const sets = h.exercises.reduce((s, e) => s + e.sets.length, 0);
      return `<div class="history-item" onclick="app.showDetail(${h.id})">
        <button class="delete-history" onclick="event.stopPropagation();app.deleteHistory(${h.id})">🗑️</button>
        <div class="date">${ds}</div><div class="summary">${h.exercises.length} exos · ${sets} séries — ${names}</div></div>`;
    }).join('');
  },

  deleteHistory(id) { this.history = this.history.filter(h => h.id !== id); this.saveHistory(); this.renderHistory(); calendar.render(this.history); },

  showDetail(id) {
    const s = this.history.find(h => h.id === id);
    if (!s) return;
    const fe = { '6': '6', '7': '7', '8': '8', '9': '9', '10': '10', easy: '😎', correct: '👍', hard: '😤', fail: '❌' };
    document.getElementById('detail-content').innerHTML = s.exercises.map(e =>
      `<div class="detail-exo"><h3>${e.name} (${e.muscle})</h3>
        ${e.sets.map((s, i) => `<div class="detail-set">Série ${i+1} : ${s.kg||'—'} kg × ${s.reps||'—'} reps
          ${s.technique ? `<span class="detail-technique">${DATA.techniques[s.technique]?.emoji||''} ${DATA.techniques[s.technique]?.label||''}</span>` : ''}
          ${s.feeling ? `<span class="detail-feeling">${fe[s.feeling]||''}</span>` : ''}</div>`).join('')}</div>`
    ).join('');
    document.getElementById('modal-detail').classList.remove('hidden');
  },

  closeDetailModal() { document.getElementById('modal-detail').classList.add('hidden'); },

  // VIDEO
  getYouTubeId(url) { const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/); return m ? m[1] : null; },
  playVideo(url) {
    const id = this.getYouTubeId(url);
    if (!id) { window.open(url, '_blank'); return; }
    document.getElementById('video-iframe').src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    document.getElementById('modal-video').classList.remove('hidden');
  },
  closeVideo() { document.getElementById('video-iframe').src = ''; document.getElementById('modal-video').classList.add('hidden'); },
  searchVideoByName(name) { window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' musculation tuto')}`, '_blank'); },

  // EXPORT / IMPORT
  exportData() {
    const data = {
      version: 1,
      date: new Date().toISOString(),
      exercises: this.exercises,
      history: this.history,
      customPrograms: this.customPrograms,
    };
    const json = JSON.stringify(data);

    document.getElementById('desc-title').textContent = '📤 Exporter les données';
    document.getElementById('desc-content').innerHTML = `
      <p style="color:var(--muted);margin-bottom:12px;">Copie le texte ci-dessous et colle-le dans un fichier .json, ou envoie-le par message/mail.</p>
      <textarea id="export-text" readonly style="width:100%;height:150px;background:var(--bg);color:var(--text);border:1px solid #333;border-radius:8px;padding:10px;font-size:0.75rem;font-family:monospace;">${json}</textarea>
      <button onclick="app.copyExport()" style="width:100%;padding:14px;margin-top:10px;border-radius:var(--radius);border:none;background:var(--accent);color:#fff;font-size:1rem;font-weight:600;cursor:pointer;">📋 Copier</button>
    `;
    document.getElementById('modal-exo-desc').classList.remove('hidden');
    setTimeout(() => document.getElementById('export-text').select(), 100);
  },

  copyExport() {
    const textarea = document.getElementById('export-text');
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    try {
      document.execCommand('copy');
      alert('Données copiées ! \ud83c\udf89');
    } catch(e) {
      alert('Sélectionne tout le texte manuellement et copie-le.');
    }
  },

  showImportModal() {
    document.getElementById('desc-title').textContent = '📥 Importer des données';
    document.getElementById('desc-content').innerHTML = `
      <p style="color:var(--muted);margin-bottom:12px;">Colle le JSON exporté ci-dessous, ou choisis un fichier.</p>
      <textarea id="import-text" placeholder="Colle tes données ici..." style="width:100%;height:150px;background:var(--bg);color:var(--text);border:1px solid #333;border-radius:8px;padding:10px;font-size:0.75rem;font-family:monospace;"></textarea>
      <button onclick="app.importFromText()" style="width:100%;padding:14px;margin-top:10px;border-radius:var(--radius);border:none;background:var(--accent);color:#fff;font-size:1rem;font-weight:600;cursor:pointer;">📥 Importer le texte</button>
      <button onclick="document.getElementById('import-file').click()" style="width:100%;padding:14px;margin-top:8px;border-radius:var(--radius);border:none;background:var(--card);color:var(--text);font-size:1rem;cursor:pointer;">📁 Ou choisir un fichier .json</button>
    `;
    document.getElementById('modal-exo-desc').classList.remove('hidden');
  },

  importFromText() {
    const text = document.getElementById('import-text').value.trim();
    if (!text) { alert('Colle les données d\'abord'); return; }
    try {
      const data = JSON.parse(text);
      this.mergeImport(data);
      document.getElementById('modal-exo-desc').classList.add('hidden');
    } catch(e) {
      alert('JSON invalide : ' + e.message);
    }
  },

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.mergeImport(data);
        document.getElementById('modal-exo-desc').classList.add('hidden');
      } catch(err) {
        alert('Erreur : ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },

  mergeImport(data) {
    if (!data.exercises && !data.history && !data.customPrograms) {
      alert('Fichier invalide'); return;
    }
    const stats = [
      `${(data.exercises||[]).length} exercices`,
      `${(data.history||[]).length} séances`,
      `${(data.customPrograms||[]).length} programmes custom`,
    ].join('\n- ');

    const choice = prompt(
      `Données trouvées :\n- ${stats}\n\n` +
      `Tape 1 ou 2 :\n` +
      `1 = REMPLACER toutes les données\n` +
      `2 = FUSIONNER (ajouter + mettre à jour)`, '1');

    if (choice !== '1' && choice !== '2') return;

    if (choice === '1') {
      // Remplacement complet
      if (data.exercises) { this.exercises = data.exercises; this.saveExercises(); }
      if (data.history) { this.history = data.history; this.saveHistory(); }
      if (data.customPrograms) { this.customPrograms = data.customPrograms; this.saveCustomPrograms(); }
    } else {
      // Fusion intelligente
      if (data.exercises) {
        data.exercises.forEach(e => {
          const existing = this.exercises.find(ex => ex.name === e.name);
          if (!existing) {
            this.exercises.push(e);
          } else {
            // Mettre à jour les champs si l'import a des données plus récentes
            if (e.defaultKg) existing.defaultKg = e.defaultKg;
            if (e.video) existing.video = e.video;
          }
        });
        this.saveExercises();
      }
      if (data.history) {
        const existingIds = new Set(this.history.map(h => h.id));
        data.history.forEach(h => { if (!existingIds.has(h.id)) this.history.push(h); });
        this.history.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.saveHistory();
      }
      if (data.customPrograms) {
        data.customPrograms.forEach(p => {
          const idx = this.customPrograms.findIndex(cp => cp.id === p.id);
          if (idx >= 0) {
            // Mettre à jour le programme existant
            this.customPrograms[idx] = p;
          } else {
            this.customPrograms.push(p);
          }
        });
        this.saveCustomPrograms();
      }
    }
    this.renderAll();
    this.updateStats();
    alert('Import réussi ! \ud83c\udf89');
  },

  resetAllData() {
    this.showModal({
      icon: '⚠️', title: 'Tout supprimer ?',
      msg: 'Exercices, historique, programmes… Cette action est irréversible.',
      confirmText: 'Tout supprimer', confirmClass: 'modal-btn-danger',
      onConfirm: () => { localStorage.clear(); location.reload(); }
    });
  },

  updateStats() {
    const el = (id) => document.getElementById(id);
    if (el('stats-exos')) el('stats-exos').textContent = this.exercises.length;
    if (el('stats-sessions')) el('stats-sessions').textContent = this.history.length;
    if (el('stats-programs')) el('stats-programs').textContent = this.customPrograms.length;
  },

  // SPOTIFY
  spotifyPlaylists: [
    { name: '💪 Beast Mode', uri: '37i9dQZF1DX76Wlfdnj7AP' },
    { name: '🔥 Workout Twerkout', uri: '37i9dQZF1DX0HRj9P7NxeE' },
    { name: '⚡ Power Workout', uri: '37i9dQZF1DX70RN3TfnE9m' },
    { name: '🎸 Rock Workout', uri: '37i9dQZF1DX9qNs32fujYe' },
    { name: '🎶 Motivation Mix', uri: '37i9dQZF1DXdxcBWuJkbcy' },
    { name: '🎵 Rap Workout', uri: '37i9dQZF1DX0vMF3iBNMhs' },
  ],

  currentSpotifyUri: null,

  isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  },

  renderSpotify() {
    const saved = localStorage.getItem('spotifyUri');
    if (saved && !this.currentSpotifyUri) {
      this.currentSpotifyUri = saved;
      if (!this.isMobile()) this.setSpotifyEmbed(saved);
      else this.showSpotifyMini();
    }

    document.getElementById('spotify-preset-list').innerHTML = this.spotifyPlaylists.map(p =>
      `<button class="spotify-preset" onclick="app.loadSpotify('${p.uri}')">${p.name}</button>`
    ).join('');

    const openBtn = document.getElementById('spotify-open-app');
    if (this.currentSpotifyUri && this.isMobile()) openBtn.classList.remove('hidden');
    else openBtn.classList.add('hidden');
  },

  loadSpotify(uri) {
    this.currentSpotifyUri = uri;
    localStorage.setItem('spotifyUri', uri);
    if (this.isMobile()) {
      this.showSpotifyMini();
      document.getElementById('spotify-open-app').classList.remove('hidden');
      this.openInSpotifyApp();
    } else {
      this.setSpotifyEmbed(uri);
    }
  },

  loadSpotifyUrl() {
    const url = document.getElementById('spotify-url').value.trim();
    if (!url) return;
    const match = url.match(/open\.spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
    if (!match) { this.showModal({ icon: '❌', title: 'Lien invalide', msg: 'Colle un lien Spotify valide (playlist, album ou titre).', confirmText: 'OK', onConfirm: () => {} }); return; }
    this.loadSpotify(`${match[1]}/${match[2]}`);
    document.getElementById('spotify-url').value = '';
  },

  openInSpotifyApp() {
    if (!this.currentSpotifyUri) return;
    const type = this.currentSpotifyUri.includes('/') ? this.currentSpotifyUri : `playlist/${this.currentSpotifyUri}`;
    const [kind, id] = type.split('/');
    window.open(`https://open.spotify.com/${kind}/${id}`, '_blank');
  },

  setSpotifyEmbed(uri) {
    const type = uri.includes('/') ? uri : `playlist/${uri}`;
    document.getElementById('spotify-mini-embed').innerHTML =
      `<iframe src="https://open.spotify.com/embed/${type}?theme=0" width="100%" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    this.showSpotifyMini();
  },

  showSpotifyMini() {
    const mini = document.getElementById('spotify-mini');
    mini.classList.remove('hidden');
    const openBtn = document.getElementById('spotify-mini-open');
    if (this.isMobile()) {
      document.getElementById('spotify-mini-embed').innerHTML = '';
      openBtn.classList.remove('hidden');
    } else {
      openBtn.classList.add('hidden');
    }
  },

  closeSpotifyMini() {
    document.getElementById('spotify-mini').classList.add('hidden');
    document.getElementById('spotify-mini-embed').innerHTML = '';
    document.getElementById('spotify-mini-open').classList.add('hidden');
    this.currentSpotifyUri = null;
    localStorage.removeItem('spotifyUri');
  },

  showTechniqueDetail(techId) {
    const tech = DATA.techniques[techId];
    if (!tech || !tech.detail) return;
    const d = tech.detail;
    document.getElementById('desc-title').textContent = `${tech.emoji} ${tech.label}`;
    document.getElementById('desc-content').innerHTML =
      `<div class="desc-section"><div class="desc-label">🎯 Principe</div>${d.principe}</div>
       <div class="desc-section"><div class="desc-label">📝 Exécution</div>${d.execution.replace(/\n/g, '<br>')}</div>
       <div class="desc-section"><div class="desc-label">🏋️ Quand l'utiliser</div>${d.usage}</div>
       <div class="desc-section"><div class="desc-label">⚠️ Conseil</div>${d.conseil}</div>`;
    document.getElementById('modal-exo-desc').classList.remove('hidden');
  },
};

app.init();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
