// Jeu d'icônes SVG (trait, hérite de la couleur du parent via currentColor).
// Remplace les emojis sur l'accueil pour un rendu plus sobre et cohérent.
const ICONS = (() => {
  const svg = (body, extra = '') => `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${body}</svg>`;
  return {
    calendarCheck: svg('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/>'),
    dumbbell: svg('<rect x="2.2" y="9" width="3.2" height="6" rx="1.3"/><rect x="5.6" y="6.8" width="3.4" height="10.4" rx="1.5"/><rect x="15" y="6.8" width="3.4" height="10.4" rx="1.5"/><rect x="18.6" y="9" width="3.2" height="6" rx="1.3"/><path d="M9 12h6"/>'),
    chart: svg('<path d="M3 20h18M7.5 20v-6M12 20V7.5M16.5 20v-9"/>'),
    moon: svg('<path d="M20.5 14.2A8.4 8.4 0 0 1 9.8 3.5a8.9 8.9 0 1 0 10.7 10.7Z"/>'),
    trophy: svg('<path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v1.5a3.5 3.5 0 0 1-3.5 3.5M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10"/><path d="M12 14v3M8.5 20.5h7M9.5 20.5l.4-3h4.2l.4 3"/>'),
    play: svg('<path d="M8 5.4 19 12 8 18.6V5.4Z" fill="currentColor" stroke-width="1.6"/>'),
    chevron: svg('<path d="m9.5 6 6 6-6 6"/>'),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>'),
    sunrise: svg('<path d="M12 3v3M5.6 8.6 7.1 10.1M18.4 8.6 16.9 10.1M2.5 16.5h3.5M18 16.5h3.5M8 16.5a4 4 0 0 1 8 0M3 20.5h18"/>'),
    alert: svg('<path d="M12 3.6 21.5 20h-19L12 3.6Z"/><path d="M12 10v4M12 17.1v.1"/>'),
    trendDown: svg('<path d="M3 7.5 9.5 14l4-4L21 17.5"/><path d="M21 12.5v5h-5"/>'),
    trendUp: svg('<path d="M3 16.5 9.5 10l4 4L21 6.5"/><path d="M16 6.5h5v5"/>'),
    target: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    settings: svg('<circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1.03Z"/>'),
  };
})();

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
    // Filets de sécurité contre la perte de données :
    // 1. Demande de stockage persistant (iOS 16.4+, Chrome, etc.)
    this.requestPersist(true);
    // 2. Snapshot automatique quotidien si > 24 h depuis le dernier
    this.maybeAutoSnapshot();
    // 3. Détection des mises à jour de Service Worker (PWA)
    this.setupServiceWorker();
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
      const defExo = DATA.defaultExercises.find(de => de.name === e.name);
      if (defExo && defExo.mode && !e.mode) { e.mode = defExo.mode; updated = true; }
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
    const greeting = h < 12
      ? { icon: ICONS.sunrise, text: 'Bonjour' }
      : h < 18
        ? { icon: ICONS.sun, text: 'Bon après-midi' }
        : { icon: ICONS.moon, text: 'Bonsoir' };
    const el = document.getElementById('home-greeting');
    if (el) el.innerHTML = `<span class="greet-icon">${greeting.icon}</span><span>${greeting.text}</span>`;

    // Message contextuel intelligent
    const subtitle = document.getElementById('home-subtitle');
    if (subtitle) subtitle.innerHTML = this._buildContextualMessage();

    this.renderQuickActions();

    const container = document.getElementById('home-last-session');
    if (!container) return;

    // Carte "Aujourd'hui" si un plan est actif (lancement direct en 1 tap)
    const todayCard = this.renderPlanTodayCard();

    // Alertes d'intelligence (stagnation, échecs, progression)
    const insightsCard = this._buildInsightsCard();

    if (!this.history.length) {
      container.innerHTML = todayCard + insightsCard +
        `<div class="last-session-card last-session-card--empty">
          <div class="ls-head"><span class="ls-icon">${ICONS.dumbbell}</span><span class="ls-title">Bienvenue</span></div>
          <div class="ls-summary">Aucune séance enregistrée pour l'instant. Choisis un programme ou compose ta séance, on s'occupe du reste.</div>
        </div>`;
      return;
    }
    const last = this.history[0];
    const d = new Date(last.date);
    const ds = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const nbExos = last.exercises.length;
    const nbSets = last.exercises.reduce((s, e) => s + e.sets.length, 0);
    const names = last.exercises.map(e => e.name).slice(0, 3).join(', ');
    container.innerHTML = todayCard + insightsCard + `<div class="last-session-card" onclick="app.showDetail(${last.id})">
      <div class="ls-head"><span class="ls-icon">${ICONS.chart}</span><span class="ls-title">Dernière séance</span><span class="ls-chevron">${ICONS.chevron}</span></div>
      <div class="ls-date">${ds}</div>
      <div class="ls-summary">${names}${nbExos > 3 ? '…' : ''}</div>
      <div class="ls-stats"><span class="ls-stat">${nbExos} exos</span><span class="ls-stat">${nbSets} séries</span></div>
    </div>`;
  },

  // Actions principales de l'accueil : deux lignes larges et explicites
  // (plus lisibles et accueillantes que des tuiles à emoji).
  renderQuickActions() {
    const el = document.getElementById('home-quick-actions');
    if (!el) return;
    const hasPlan = !!this.getActivePlan();
    const programTitle = hasPlan ? 'Mes programmes' : 'Choisir un programme';
    const programDesc = hasPlan
      ? 'Mon plan, mes semaines et les séances à venir'
      : 'Séances guidées, charges et progression calculées pour toi';
    el.innerHTML = `
      <button class="action-row action-row--program" onclick="app.goTo('programs')">
        <span class="ar-icon">${ICONS.calendarCheck}</span>
        <span class="ar-text">
          <span class="ar-title">${programTitle}</span>
          <span class="ar-desc">${programDesc}</span>
        </span>
        <span class="ar-chevron">${ICONS.chevron}</span>
      </button>
      <button class="action-row action-row--free" onclick="app.showExercisePicker()">
        <span class="ar-icon">${ICONS.dumbbell}</span>
        <span class="ar-text">
          <span class="ar-title">Séance à la carte</span>
          <span class="ar-desc">Je compose mon entraînement exercice par exercice</span>
        </span>
        <span class="ar-chevron">${ICONS.chevron}</span>
      </button>`;
  },

  // ---------- Message contextuel intelligent ----------
  _buildContextualMessage() {
    const plan = this.getActivePlan();
    if (!plan || !plan.weeks) return 'Prêt à tout donner ? Choisis ta séance ci-dessous.';

    this.syncPlanDays(plan);
    const weekIdx = plan.currentWeekIdx ?? 0;
    const week = plan.weeks[weekIdx];
    const totalWeeks = plan.weeks.length;
    const pct = Math.round(((weekIdx + 1) / totalWeeks) * 100);

    // Calculer la progression de charge depuis le début du plan
    const chargeProgress = this._calcChargeProgress(plan);

    // Messages selon la phase
    if (week.deload) {
      return 'Semaine de deload — récupère, ton corps se renforce au repos';
    }
    if (weekIdx === 0) {
      return 'Phase d\'adaptation — concentre-toi sur la technique, la charge viendra';
    }
    if (pct >= 90) {
      return `Dernière ligne droite ! ${pct}% du plan complété${chargeProgress}`;
    }
    if (pct >= 50) {
      return `Mi-parcours — ${week.phase} · Sem ${weekIdx + 1}/${totalWeeks}${chargeProgress}`;
    }
    // Phase en cours avec info progression
    return `${week.phase} · Sem ${weekIdx + 1}/${totalWeeks}${chargeProgress}`;
  },

  _calcChargeProgress(plan) {
    // Chercher la progression de charge moyenne sur les exercices principaux
    if (this.history.length < 4) return '';
    const recent = this.history.slice(0, 5);
    const older = this.history.slice(-5);
    if (!older.length) return '';

    let totalGain = 0, count = 0;
    recent.forEach(session => {
      session.exercises.forEach(re => {
        const reKg = re.sets.filter(s => s.kg).map(s => parseFloat(s.kg)).pop();
        if (!reKg) return;
        // Trouver le même exo dans les anciennes séances
        for (const old of older) {
          const oe = old.exercises.find(e => e.name === re.name);
          if (oe) {
            const oldKg = oe.sets.filter(s => s.kg).map(s => parseFloat(s.kg)).pop();
            if (oldKg && oldKg > 0) {
              totalGain += ((reKg - oldKg) / oldKg) * 100;
              count++;
            }
            break;
          }
        }
      });
    });
    if (count === 0) return '';
    const avgGain = Math.round(totalGain / count);
    if (avgGain > 0) return ` · <strong>+${avgGain}%</strong> charge moyenne`;
    if (avgGain < -5) return ' · charges en baisse';
    return '';
  },

  // ---------- Intelligence du programme ----------
  _buildInsightsCard() {
    if (this.history.length < 3) return '';
    const plan = this.getActivePlan();

    const insights = [];

    // 1. Détection de stagnation (même poids depuis 3+ séances)
    const stagnant = this._detectStagnation();
    if (stagnant.length) {
      insights.push({
        icon: ICONS.alert,
        type: 'warning',
        title: 'Stagnation détectée',
        msg: `${stagnant.slice(0, 2).map(s => s.name).join(', ')} — même charge depuis ${stagnant[0].weeks} séances`,
        tip: 'Essaie une variante du mouvement ou augmente le volume (1 série de plus)'
      });
    }

    // 2. Détection d'échecs répétés (RPE 10 + reps < cible)
    const failures = this._detectRepeatedFailures();
    if (failures.length) {
      insights.push({
        icon: ICONS.trendDown,
        type: 'alert',
        title: 'Exercice trop lourd',
        msg: `${failures[0].name} — échec ${failures[0].count}× d'affilée`,
        tip: 'Baisse de 5% et remonte progressivement, ou change de variante'
      });
    }

    // 3. Progression remarquable
    const progress = this._detectProgress();
    if (progress.length && !insights.length) {
      insights.push({
        icon: ICONS.trendUp,
        type: 'success',
        title: 'Belle progression !',
        msg: `${progress[0].name} : +${progress[0].gain}kg en ${progress[0].weeks} semaines`,
        tip: 'Continue comme ça, la régularité paie'
      });
    }

    // 4. Estimation 1RM sur les composés
    const rm = this._estimate1RM();
    if (rm.length && insights.length < 2) {
      insights.push({
        icon: ICONS.dumbbell,
        type: 'info',
        title: '1RM estimé',
        msg: rm.slice(0, 3).map(r => `${r.name}: ~${r.rm}kg`).join(' · '),
        tip: 'Basé sur poids × reps × RPE (formule Epley corrigée)'
      });
    }

    if (!insights.length) return '';

    return `<div class="insights-card">
      ${insights.map(i => `
        <div class="insight-item insight-${i.type}">
          <div class="insight-header"><span class="insight-icon">${i.icon}</span> <strong>${i.title}</strong></div>
          <div class="insight-msg">${i.msg}</div>
          <div class="insight-tip">${i.tip}</div>
        </div>
      `).join('')}
    </div>`;
  },

  _detectStagnation() {
    // Trouver les exercices dont le poids n'a pas bougé sur une longue période
    // Le programme masse prescrit souvent la même charge pendant une phase entière
    // (3-4 semaines = 6-8 occurrences d'un exo). On ne signale une stagnation
    // que si le poids est identique sur 10+ séances non-deload (= plus d'une phase)
    // ET que le RPE montre que la charge aurait pu monter.
    const exoHistory = {};
    this.history.slice(0, 30).forEach(session => {
      session.exercises.forEach(e => {
        if (e.deload) return;
        const validSets = e.sets.filter(s => s.kg && parseFloat(s.kg) > 0 && !s.warmup);
        if (!validSets.length) return;
        const lastSet = validSets[validSets.length - 1];
        const kg = parseFloat(lastSet.kg);
        const rpe = parseInt(lastSet.feeling) || null;
        if (!exoHistory[e.name]) exoHistory[e.name] = [];
        exoHistory[e.name].push({ kg, rpe });
      });
    });

    const stagnant = [];
    for (const [name, entries] of Object.entries(exoHistory)) {
      if (entries.length < 10) continue; // minimum ~5 semaines d'historique
      const recent = entries.slice(0, 10);
      // Tous les mêmes poids sur les 10 dernières occurrences
      if (!recent.every(e => e.kg === recent[0].kg)) continue;
      // Si RPE toujours ≥ 9 → pas de marge, c'est normal de ne pas monter
      const rpesWithData = recent.filter(e => e.rpe).map(e => e.rpe);
      if (rpesWithData.length >= 3 && rpesWithData.every(r => r >= 9)) continue;
      stagnant.push({ name, weeks: Math.round(recent.length / 2), kg: recent[0].kg });
    }
    return stagnant;
  },

  _detectRepeatedFailures() {
    // Exercices avec RPE 10 + reps sous la cible sur 2+ séances consécutives
    const exoFailures = {};
    this.history.slice(0, 10).forEach(session => {
      session.exercises.forEach(e => {
        const lastSet = e.sets.filter(s => s.feeling && s.reps).pop();
        if (!lastSet) return;
        const rpe = parseInt(lastSet.feeling);
        if (rpe >= 10) {
          exoFailures[e.name] = (exoFailures[e.name] || 0) + 1;
        } else {
          // Reset si une séance était OK
          if (exoFailures[e.name]) exoFailures[e.name] = 0;
        }
      });
    });

    return Object.entries(exoFailures)
      .filter(([_, count]) => count >= 2)
      .map(([name, count]) => ({ name, count }));
  },

  _detectProgress() {
    // Exercices avec progression notable sur les dernières semaines
    const exoHistory = {};
    this.history.slice(0, 20).forEach(session => {
      session.exercises.forEach(e => {
        const kg = e.sets.filter(s => s.kg).map(s => parseFloat(s.kg)).pop();
        if (!kg) return;
        if (!exoHistory[e.name]) exoHistory[e.name] = [];
        exoHistory[e.name].push(kg);
      });
    });

    const progress = [];
    for (const [name, kgs] of Object.entries(exoHistory)) {
      if (kgs.length < 3) continue;
      const newest = kgs[0];
      const oldest = kgs[kgs.length - 1];
      const gain = newest - oldest;
      if (gain >= 2.5) {
        progress.push({ name, gain, weeks: kgs.length });
      }
    }
    return progress.sort((a, b) => b.gain - a.gain);
  },

  _estimate1RM() {
    // Estimation du 1RM via formule Epley corrigée par RPE
    // 1RM = weight × (1 + reps/30) × rpeCorrection
    const composés = ['Développé couché barre', 'Squat barre', 'Soulevé de terre barre',
      'Développé militaire barre', 'Développé couché haltères', 'Goblet squat haltère',
      'Rowing barre buste penché'];
    const results = [];

    for (const name of composés) {
      // Chercher la meilleure performance récente
      for (const session of this.history.slice(0, 10)) {
        const exo = session.exercises.find(e => e.name === name);
        if (!exo) continue;
        const bestSet = exo.sets
          .filter(s => s.kg && s.reps && parseInt(s.reps) > 0)
          .sort((a, b) => parseFloat(b.kg) - parseFloat(a.kg))[0];
        if (!bestSet) continue;

        const kg = parseFloat(bestSet.kg);
        const reps = parseInt(bestSet.reps);
        const rpe = parseInt(bestSet.feeling) || 8;
        if (kg <= 0 || reps <= 0) continue;

        // Epley: 1RM = w × (1 + r/30)
        // Correction RPE : ajouter les RIR (reps in reserve) aux reps
        const rir = Math.max(0, 10 - rpe);
        const effectiveReps = reps + rir;
        const rm = Math.round(kg * (1 + effectiveReps / 30));

        results.push({ name: name.replace(/ (barre|haltères?|haltère)/, ''), rm });
        break;
      }
    }
    return results;
  },

  // ---------- Plan actif & "Aujourd'hui" ----------
  getActivePlan() {
    const plans = this.customPrograms.filter(p => p.isPlan);
    if (!plans.length) return null;
    return plans.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
  },

  getNextPlanDay(plan) {
    if (!plan) return null;
    this.syncPlanDays(plan);
    const weekIdx = plan.currentWeekIdx ?? 0;
    const week = plan.weeks[weekIdx];
    const completed = plan.completedDays || {};
    for (let i = 0; i < week.days.length; i++) {
      if (!completed[`${weekIdx}-${i}`]) {
        return { weekIdx, dayIdx: i, week, day: week.days[i] };
      }
    }
    return { weekIdx, dayIdx: -1, week, day: null, allDone: true };
  },

  // Détermine si l'utilisateur est en jour de repos selon la fréquence du plan
  isRestDay(plan) {
    if (!plan || !plan.isPlan || !plan.completedDays || !plan.params) return false;
    const frequency = plan.params.frequency || 4;
    
    // Récupérer les dates de toutes les séances complétées (timestamps)
    const completedDates = Object.values(plan.completedDays)
      .map(d => new Date(d))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => b - a); // plus récente en premier

    if (!completedDates.length) return false;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastTrainDate = completedDates[0];
    const lastTrainDayStart = new Date(lastTrainDate.getFullYear(), lastTrainDate.getMonth(), lastTrainDate.getDate()).getTime();

    // Si déjà entraîné aujourd'hui → repos pour le reste de la journée
    if (lastTrainDayStart === todayStart) return true;

    // Calculer le nombre de jours consécutifs d'entraînement jusqu'à hier
    let consecutiveDays = 0;
    let checkDate = todayStart - 24 * 3600 * 1000; // hier
    for (let i = 0; i < 7; i++) {
      const dayMatch = completedDates.some(d => {
        const ds = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        return ds === checkDate;
      });
      if (dayMatch) {
        consecutiveDays++;
        checkDate -= 24 * 3600 * 1000;
      } else {
        break;
      }
    }

    // Règles de repos selon la fréquence :
    // - 2-3 jours/sem : jamais 2 jours consécutifs (repos après chaque séance)
    // - 4 jours/sem : max 2 jours consécutifs, puis 1 jour de repos
    // - 5 jours/sem : max 3 jours consécutifs, puis 1 jour de repos
    // - 6 jours/sem : max 6 jours consécutifs (1 jour repos/semaine)
    let maxConsecutive;
    if (frequency <= 3) maxConsecutive = 1;
    else if (frequency === 4) maxConsecutive = 2;
    else if (frequency === 5) maxConsecutive = 3;
    else maxConsecutive = 6;

    return consecutiveDays >= maxConsecutive;
  },

  // Calcule combien de jours de repos il reste
  restDaysRemaining(plan) {
    if (!plan || !plan.completedDays) return 0;
    const completedDates = Object.values(plan.completedDays)
      .map(d => new Date(d))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => b - a);

    if (!completedDates.length) return 0;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastTrainDate = completedDates[0];
    const lastTrainDayStart = new Date(lastTrainDate.getFullYear(), lastTrainDate.getMonth(), lastTrainDate.getDate()).getTime();

    // Si entraîné aujourd'hui : au minimum repos demain
    if (lastTrainDayStart === todayStart) return 1;

    // Sinon c'est qu'on est dans un repos suite à jours consécutifs : reste 1 jour
    return 1;
  },

  // Estimation réaliste de la durée d'une séance.
  // Base : chaque série = exécution (fonction des reps) + repos série (sauf la dernière d'un exo).
  // Entre exos : repos plus long (transition, matériel, boire). +3 min de setup/échauffement général.
  // La formule précédente (totalSets*1.5 + exoCount*1.5) sous-estimait d'~35% en ignorant
  // restRecommended et restBetweenExos.
  _estimateSessionMinutes(day, week, plan) {
    const restSec = (week && week.restRecommended) || (plan && plan.restRecommended) || 90;
    // Sans valeur imposée, le repos inter-exercices est adaptatif (~70 à 180 s) : moyenne ~130 s.
    const transSec = (plan && plan.restBetweenExos) || 130;
    const setupSec = 180;
    const execSecForReps = (reps) => {
      if (!reps) return 35;
      const s = String(reps).replace(/\/jambe/, '');
      // Isométrique (ex : "30s", "45s")
      const iso = s.match(/^(\d+)\s*s$/i);
      if (iso) return parseInt(iso[1], 10);
      if (s === '21') return 60; // méthode 21
      const hi = parseInt(s.split('-').pop(), 10) || 10;
      // ~3.5 s/rep en moyenne (tempo lent 4-5 s, tempo rapide 2.5 s)
      return Math.round(hi * 3.5);
    };
    let totalSec = setupSec;
    const exos = (day && day.exercises) || [];
    exos.forEach(ex => {
      const sets = ex.sets || 0;
      if (sets <= 0) return;
      const exec = execSecForReps(ex.reps);
      totalSec += sets * exec + Math.max(0, sets - 1) * restSec;
    });
    // Transitions entre exos
    totalSec += Math.max(0, exos.length - 1) * transSec;
    return Math.round(totalSec / 60);
  },

  renderPlanTodayCard() {
    const plan = this.getActivePlan();
    if (!plan) return '';
    let next = this.getNextPlanDay(plan);
    if (!next) return '';

    // Vérifier si c'est un jour de repos
    if (this.isRestDay(plan)) {
      const frequency = plan.params?.frequency || 4;
      let restMsg = 'Ton corps récupère et se renforce.';
      if (frequency <= 3) restMsg = 'Avec ' + frequency + ' séances/sem, repose-toi entre chaque entraînement.';
      else restMsg = 'Après plusieurs jours consécutifs, accorde-toi un jour de récupération.';

      return `<div class="plan-today-card plan-today-rest">
        <div class="ptc-header">
          <div class="ptc-icon">${ICONS.moon}</div>
          <div class="ptc-text">
            <div class="ptc-title">Jour de repos</div>
            <div class="ptc-subtitle">${restMsg}</div>
          </div>
        </div>
        <div class="ptc-info">Récupération · Hydratation · Nutrition · Sommeil</div>
      </div>`;
    }

    // Si tous les jours de la semaine sont faits, proposer la semaine suivante
    if (next.allDone) {
      const currentWeek = plan.currentWeekIdx ?? 0;
      if (currentWeek < 25) {
        // Avancer à la semaine suivante
        plan.weekProgress = currentWeek + 1;
        this.saveCustomPrograms();
        this.syncPlanDays(plan);
        next = this.getNextPlanDay(plan);
        if (!next || next.allDone) {
          // Vraiment tout terminé (fin du plan)
          return `<div class="plan-today-card plan-today-done">
            <div class="ptc-header">
              <div class="ptc-icon">${ICONS.trophy}</div>
              <div class="ptc-text">
                <div class="ptc-title">Plan terminé !</div>
                <div class="ptc-subtitle">Félicitations, tu as fini les 26 semaines</div>
              </div>
            </div>
          </div>`;
        }
      } else {
        // Semaine 26 finie = plan complet
        return `<div class="plan-today-card plan-today-done">
          <div class="ptc-header">
            <div class="ptc-icon">${ICONS.trophy}</div>
            <div class="ptc-text">
              <div class="ptc-title">Plan terminé !</div>
              <div class="ptc-subtitle">Félicitations, 26 semaines complétées</div>
            </div>
          </div>
        </div>`;
      }
    }

    const day = next.day;
    const week = next.week;
    const completed = plan.completedDays || {};
    const dayCompletedCount = week.days.filter((_, i) => completed[`${next.weekIdx}-${i}`]).length;
    const exoCount = day.exercises.length;
    const totalSets = day.exercises.reduce((s, e) => s + (e.sets || 0), 0);
    const estMin = this._estimateSessionMinutes(day, week, plan);

    return `<div class="plan-today-card" onclick="app.launchPlanToday()">
      <div class="ptc-header">
        <div class="ptc-icon">${ICONS.calendarCheck}</div>
        <div class="ptc-text">
          <div class="ptc-eyebrow">Au programme aujourd'hui</div>
          <div class="ptc-title">${day.name}</div>
          <div class="ptc-subtitle">${plan.name.replace('🧠 ', '')}</div>
        </div>
      </div>
      <div class="ptc-meta">
        <span class="ptc-tag">Sem ${next.weekIdx + 1}/26</span>
        <span class="ptc-tag">${week.phase}</span>
        <span class="ptc-tag rpe-target-badge rpe-${week.rpe}">RPE ${week.rpe}</span>
        ${week.deload ? '<span class="ptc-tag deload-badge">Deload</span>' : ''}
      </div>
      <div class="ptc-info">${exoCount} exos · ${totalSets} séries · ~${estMin} min · jour ${dayCompletedCount + 1}/${week.days.length} de la semaine</div>
      <button class="ptc-launch-btn" onclick="event.stopPropagation();app.launchPlanToday()">${ICONS.play}<span>Commencer ma séance</span></button>
    </div>`;
  },

  launchPlanToday() {
    const plan = this.getActivePlan();
    if (!plan) return;
    const next = this.getNextPlanDay(plan);
    if (!next || next.allDone || next.dayIdx < 0) return;
    this.startProgramDay(plan.id, next.dayIdx);
  },

  // Marque la séance courante comme complétée dans le plan, fait avancer la semaine
  // si tous les jours sont faits, et déclenche un re-render.
  markPlanDayCompleted() {
    const ctx = this._currentPlanContext;
    if (!ctx) return;
    const plan = this.customPrograms.find(p => p.id === ctx.planId);
    if (!plan) { this._currentPlanContext = null; return; }
    plan.completedDays = plan.completedDays || {};
    plan.completedDays[`${ctx.weekIdx}-${ctx.dayIdx}`] = new Date().toISOString();

    // Migration : si plan créé avant le système de progression, initialiser
    if (plan.weekProgress == null) plan.weekProgress = ctx.weekIdx;

    // Auto-avancement : si tous les jours de la semaine de progression sont complets,
    // avancer à la semaine suivante.
    const progIdx = plan.weekProgress;
    const week = plan.weeks[progIdx];
    if (week) {
      const allDone = week.days.every((_, i) => plan.completedDays[`${progIdx}-${i}`]);
      if (allDone && progIdx < 25) {
        plan.weekProgress = progIdx + 1;
        // Si l'utilisateur naviguait avec ◀▶, on retire l'override pour repasser en auto
        delete plan.manualWeekIdx;
      }
    }
    this.saveCustomPrograms();
    this._currentPlanContext = null;
  },

  setupNav() {
    // Injecte les icônes SVG déclarées via data-icon (nav, etc.)
    document.querySelectorAll('[data-icon]').forEach(el => {
      const ico = ICONS[el.dataset.icon];
      if (ico) el.innerHTML = ico;
    });
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
    if (['calendar','exercises','history','settings','spotify','assistant','progression'].includes(view)) {
      const moreBtn = document.querySelector('[data-view="more"]');
      if (moreBtn) moreBtn.classList.add('active');
    }
    document.getElementById(`view-${view}`).classList.add('active');
    if (view === 'home') this.renderHome();
    if (view === 'programs') this.renderPrograms();
    if (view === 'calendar') calendar.render(this.history);
    if (view === 'progression') { document.getElementById('progression-overview').innerHTML = this.renderProgressionOverview(); }
    if (view === 'settings') { this.updateStats(); this.renderSnapshots(); this.showStorageStatus(); }
    if (view === 'assistant') this.renderAssistant();
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
    const mode = document.getElementById('new-exo-mode').value;
    this.exercises.push({ id: Date.now(), name, muscle, video: video || '', mode });
    document.getElementById('new-exo-name').value = '';
    document.getElementById('new-exo-video').value = '';
    this.saveExercises();
    this.renderExercises();
  },

  deleteExercise(id) { this.exercises = this.exercises.filter(e => e.id !== id); this.saveExercises(); this.renderExercises(); },

  renderExercises() {
    const modeLabels = { barbell: '🏋️', bilateral: '👐', unilateral: '☝️', alternated: '🔄' };
    document.getElementById('exercise-list').innerHTML = this.exercises.map(e => {
      const desc = DATA.descriptions[e.name];
      const preview = desc ? desc.exec.substring(0, 60) + '…' : '';
      const modeIcon = modeLabels[e.mode] || '👐';
      return `<div class="exo-item">
        <div class="exo-info" onclick="app.showExoDesc('${e.name.replace(/'/g, "\\'")}')">
          <div class="name">${modeIcon} ${e.name}</div>
          <div class="muscle">${e.muscle}${e.defaultKg ? ` — <strong>${e.defaultKg} kg</strong>` : ''}</div>
          ${preview ? `<div class="exo-desc-preview">${preview}</div>` : ''}
        </div>
        <div class="exo-item-actions">
          <button onclick="app.showProgressionChart('${e.name.replace(/'/g, "\\'")}')" title="Progression">📈</button>
          <button onclick="app.editMode(${e.id})" title="Mode">☝️</button>
          <button onclick="app.editDefaultKg(${e.id})" title="Poids par défaut">⚖️</button>
          <button onclick="app.searchVideo(${e.id})">🔍</button>
          ${e.video ? `<button onclick="app.playVideo('${e.video}')">▶️</button>` : ''}
          <button onclick="app.editVideo(${e.id})">✏️</button>
          <button onclick="app.deleteExercise(${e.id})">🗑️</button>
        </div>
      </div>`;
    }).join('');
  },

  editMode(id) {
    const exo = this.exercises.find(e => e.id === id);
    if (!exo) return;
    const modes = { '1': 'barbell', '2': 'bilateral', '3': 'unilateral', '4': 'alternated' };
    const choice = prompt(
      `Mode pour "${exo.name}" :\n` +
      `1 = 🏋️ Barre (poids total)\n` +
      `2 = 👐 2 haltères (poids par main)\n` +
      `3 = ☝️ Unilatéral (D puis G)\n` +
      `4 = 🔄 Alterné (D+G = 1 série)`,
      exo.mode === 'barbell' ? '1' : exo.mode === 'bilateral' ? '2' : exo.mode === 'unilateral' ? '3' : '4'
    );
    if (choice && modes[choice]) {
      exo.mode = modes[choice];
      this.saveExercises();
      this.renderExercises();
    }
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
    const anim = ANIMATIONS.get(name, { label: name });
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
  syncPlanDays(p) {
    if (!p || !p.isPlan || !p.weeks) return p;
    // Mettre à jour les semaines restantes avec la nouvelle logique du planner.
    // On entoure d'un try/catch : si le planner a une régression ou si le plan
    // importé est malformé, on ne veut pas casser tout le rendu / l'import.
    try { this._upgradePlanWeeks(p); }
    catch (e) { console.warn('Skip _upgradePlanWeeks:', e); }
    const idx = PLANNER.currentWeekIdx(p);
    p.currentWeekIdx = idx;
    const w = p.weeks[idx];
    // Cloner les days pour appliquer kg cible + RPE sans contaminer la définition du plan
    p.days = w.days.map(d => {
      // Dédoublonner les exercices (fix pour plans importés avant le correctif)
      const seen = new Set();
      const uniqueExos = d.exercises.filter(ex => {
        if (seen.has(ex.name)) return false;
        seen.add(ex.name);
        return true;
      });
      return {
        name: d.name,
        exercises: uniqueExos.map(ex => {
          const userExo = this.exercises.find(e => e.name === ex.name);
          const baseKg = userExo?.defaultKg || 0;
          const targetKg = PLANNER.computeTargetKg(baseKg, ex.reps, w.deload, w.rpe);
          return { ...ex, kg: targetKg, targetRpe: w.rpe, deload: w.deload };
        })
      };
    });
    return p;
  },

  // Régénère les semaines futures du plan en gardant la progression
  _upgradePlanWeeks(p) {
    if (!p.isPlan || !p.params || !p.weeks) return;
    // Ne régénérer qu'une fois par version
    if (p._planVersion >= 41) return;
    const idx = PLANNER.currentWeekIdx(p);
    const params = p.params;
    const newResult = PLANNER.generate(params);
    if (newResult.error || !newResult.plan) return;
    // Remplacer les semaines futures par les nouvelles (plus complètes)
    for (let w = idx; w < 26 && w < newResult.plan.weeks.length; w++) {
      p.weeks[w] = newResult.plan.weeks[w];
    }
    // Dédoublonner TOUTES les semaines (y compris passées) pour les plans importés
    p.weeks.forEach(w => {
      w.days.forEach(d => {
        const seen = new Set();
        d.exercises = d.exercises.filter(ex => {
          if (seen.has(ex.name)) return false;
          seen.add(ex.name);
          return true;
        });
      });
    });
    // Mettre à jour le repos recommandé
    p.restRecommended = newResult.plan.restRecommended;
    p._planVersion = 41;
    // S'assurer que les nouveaux exos existent dans le catalogue utilisateur
    const known = new Set(this.exercises.map(e => e.name));
    p.weeks.forEach(w => w.days.forEach(d => d.exercises.forEach(ex => {
      if (!known.has(ex.name)) {
        const def = DATA.defaultExercises.find(de => de.name === ex.name);
        if (def) { this.exercises.push(JSON.parse(JSON.stringify(def))); known.add(ex.name); }
      }
    })));
    this.saveExercises();
    this.saveCustomPrograms();
  },

  renderPrograms() {
    const all = this.getAllPrograms();
    // Synchroniser les plans avec la semaine en cours
    all.forEach(p => this.syncPlanDays(p));
    document.getElementById('program-list').innerHTML =
      `<div class="program-tools">
         <button id="btn-new-program" onclick="app.newProgram()">+ Créer un programme</button>
         <button id="btn-plan-program" onclick="app.openPlanner()">🧠 Générateur 6 mois</button>
       </div>` +
      all.map(p => {
        const isCustom = this.customPrograms.some(cp => cp.id === p.id);
        const planHeader = p.isPlan ? this.renderPlanHeader(p) : '';
        return `<div class="program-card${p.isPlan ? ' program-plan' : ''}">
          <div class="program-header">
            <h2>${p.name}</h2>
            ${isCustom ? `<div class="program-actions">
              ${p.isPlan ? '' : `<button onclick="app.editProgram('${p.id}')">✏️</button>`}
              <button onclick="app.deleteProgram('${p.id}')">🗑️</button>
            </div>` : ''}
          </div>
          <p class="program-desc">${p.desc}</p>
          ${planHeader}
          <div class="program-days">
          ${p.days.map((day, di) => {
            const isPlanDay = p.isPlan;
            const wkIdx = p.currentWeekIdx ?? 0;
            const isDone = isPlanDay && p.completedDays && p.completedDays[`${wkIdx}-${di}`];
            const dayCls = isDone ? 'program-day program-day-done' : 'program-day';
            return `
              <div class="${dayCls}">
                <div class="day-header"><h3>${isDone ? '✅ ' : ''}${day.name}</h3>
                  <button class="btn-start-day" onclick="app.startProgramDay('${p.id}',${di})">${isDone ? '↻ Refaire' : '🚀 Lancer'}</button></div>
                <div class="day-exercises">
                  ${day.exercises.map(e => {
                    const tech = e.lastSetTechnique ? DATA.techniques[e.lastSetTechnique] : null;
                    const t = tech ? `<span class="day-tech" style="color:${tech.color}">${tech.emoji} ${tech.label} <button class="btn-tech-info" onclick="event.stopPropagation();app.showTechniqueDetail('${e.lastSetTechnique}')">ℹ️</button></span>` : '';
                    const kgInfo = (p.isPlan && e.kg) ? ` <span class="day-kg">@ ${e.kg}kg</span>` : '';
                    return `<div class="day-exo">${e.name} — ${e.sets}×${e.reps}${kgInfo} ${t}</div>`;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
          </div>
        </div>`;
      }).join('');
  },

  newProgram() {
    this.editingProgram = { id: 'custom_' + Date.now(), name: '', desc: '', days: [{ name: 'Jour 1', exercises: [] }] };
    this.openProgramEditor();
  },

  // ---------- PLANIFICATEUR 6 MOIS ----------
  renderPlanHeader(p) {
    const idx = p.currentWeekIdx ?? 0;
    const w = p.weeks[idx];
    const pct = Math.round(((idx + 1) / 26) * 100);
    const restNote = (w.restRecommended || p.restRecommended) ? `Repos ${w.restRecommended || p.restRecommended}s` : '';
    const completed = p.completedDays || {};
    const doneCount = w.days.filter((_, i) => completed[`${idx}-${i}`]).length;
    const totalDays = w.days.length;
    const progressDots = w.days.map((_, i) =>
      completed[`${idx}-${i}`] ? '<span class="day-dot done">✓</span>' : '<span class="day-dot"></span>'
    ).join('');
    return `<div class="plan-header">
      <div class="plan-week-line">
        <button class="plan-nav" onclick="app.planShiftWeek('${p.id}', -1)" ${idx === 0 ? 'disabled' : ''}>◀</button>
        <div class="plan-week-info">
          <div class="plan-week-num">Semaine ${idx + 1} / 26</div>
          <div class="plan-week-phase">${w.phase} · 🎯 RPE ${w.rpe}${w.deload ? ' · 🔻 Deload' : ''}</div>
        </div>
        <button class="plan-nav" onclick="app.planShiftWeek('${p.id}', 1)" ${idx === 25 ? 'disabled' : ''}>▶</button>
      </div>
      <div class="plan-progress-bar"><div class="plan-progress-fill" style="width:${pct}%"></div></div>
      <div class="plan-week-progress">
        <span class="plan-week-progress-label">Séances semaine : ${doneCount}/${totalDays}</span>
        <span class="plan-week-progress-dots">${progressDots}</span>
      </div>
      <div class="plan-meta">${restNote}${p.manualWeekIdx != null ? ' · <a href="#" onclick="event.preventDefault();app.planResetAuto(\'' + p.id + '\')">↻ auto</a>' : ' · auto-avance'}</div>
    </div>`;
  },

  planShiftWeek(pid, delta) {
    const p = this.customPrograms.find(cp => cp.id === pid);
    if (!p || !p.isPlan) return;
    const cur = p.currentWeekIdx ?? PLANNER.currentWeekIdx(p);
    const next = Math.max(0, Math.min(25, cur + delta));
    p.manualWeekIdx = next;
    this.saveCustomPrograms();
    this.renderPrograms();
  },

  planResetAuto(pid) {
    const p = this.customPrograms.find(cp => cp.id === pid);
    if (!p) return;
    delete p.manualWeekIdx;
    this.saveCustomPrograms();
    this.renderPrograms();
  },

  openPlanner() {
    document.getElementById('desc-title').textContent = '🧠 Générateur de programme — 6 mois';
    document.getElementById('desc-content').innerHTML = `
      <div class="planner-form">
        <p class="planner-intro">Réponds à quelques questions, l'app construit un programme cohérent sur <strong>26 semaines</strong> avec progression, deload et techniques d'intensification.</p>

        <label class="planner-label">🎂 Ton âge</label>
        <input type="number" id="plan-age" min="14" max="90" value="${localStorage.getItem('userAge') || '30'}" inputmode="numeric">

        <label class="planner-label">⚧️ Genre</label>
        <select id="plan-gender">
          <option value="male" ${localStorage.getItem('userGender') === 'male' ? 'selected' : ''}>Homme</option>
          <option value="female" ${localStorage.getItem('userGender') === 'female' ? 'selected' : ''}>Femme</option>
        </select>

        <label class="planner-label">🎯 Ton objectif</label>
        <select id="plan-goal">
          <option value="masse">💪 Prise de masse / hypertrophie</option>
          <option value="force">🏋️ Gagner en force</option>
          <option value="perte_gras">🔥 Perdre du gras (sèche / recomposition)</option>
          <option value="tonification">✨ Tonifier / sculpter</option>
          <option value="maintien">🛡️ Maintien / forme générale</option>
        </select>

        <label class="planner-label">📊 Ton niveau</label>
        <select id="plan-level">
          <option value="beginner">Débutant (&lt; 6 mois)</option>
          <option value="intermediate" selected>Intermédiaire (6 mois - 2 ans)</option>
          <option value="advanced">Avancé (2 ans+)</option>
        </select>

        <label class="planner-label">🏠 Équipement disponible</label>
        <select id="plan-equipment">
          <option value="gym">🏟️ Salle de sport (tout dispo)</option>
          <option value="home_full">🏠 Maison complète (barre + haltères + banc)</option>
          <option value="dumbbell_bench" selected>💪 Haltères + banc</option>
          <option value="dumbbell_only">🏋️ Haltères seuls (pas de banc)</option>
          <option value="bodyweight">🤸 Poids du corps</option>
        </select>

        <label class="planner-label">📅 Fréquence (jours/semaine)</label>
        <select id="plan-frequency">
          <option value="2">2 jours</option>
          <option value="3">3 jours</option>
          <option value="4" selected>4 jours</option>
          <option value="5">5 jours</option>
          <option value="6">6 jours</option>
        </select>

        <button class="btn-generate-plan" onclick="app.createPlanFromForm()">🚀 Générer mon plan 6 mois</button>
      </div>
    `;
    document.getElementById('modal-exo-desc').classList.remove('hidden');
  },

  createPlanFromForm() {
    const age = parseInt(document.getElementById('plan-age').value) || 30;
    const gender = document.getElementById('plan-gender').value;
    const goal = document.getElementById('plan-goal').value;
    const level = document.getElementById('plan-level').value;
    const equipment = document.getElementById('plan-equipment').value;
    const frequency = parseInt(document.getElementById('plan-frequency').value) || 4;
    // Sauvegarder le genre et l'âge pour le pré-remplir la prochaine fois
    localStorage.setItem('userGender', gender);
    localStorage.setItem('userAge', String(age));

    const result = PLANNER.generate({ age, gender, goal, level, equipment, frequency });
    if (result.error) {
      this.showModal({ icon: '⚠️', title: 'Impossible', msg: result.error, confirmText: 'OK', onConfirm: () => {} });
      return;
    }

    // S'assurer que tous les exos du plan existent (sinon les ajouter au catalogue)
    const known = new Set(this.exercises.map(e => e.name));
    const needed = new Set();
    result.plan.weeks[0].days.forEach(d => d.exercises.forEach(ex => needed.add(ex.name)));
    needed.forEach(name => {
      if (!known.has(name)) {
        const def = DATA.defaultExercises.find(de => de.name === name);
        if (def) this.exercises.push(JSON.parse(JSON.stringify(def)));
      }
    });
    this.saveExercises();

    this.customPrograms.push(result.plan);
    this.saveCustomPrograms();
    document.getElementById('modal-exo-desc').classList.add('hidden');
    this.renderExercises();
    this.renderPrograms();
    this.showModal({
      icon: '✅', title: 'Plan créé !',
      msg: `Ton plan "${result.plan.name}" est prêt. La semaine en cours s'adapte automatiquement à la date.`,
      confirmText: 'Voir', cancelText: 'OK',
      onConfirm: () => { this.goTo('programs'); }
    });
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
    const restVal = p.restTime || 90;
    const restExosVal = p.restBetweenExos || '';
    document.getElementById('desc-content').innerHTML = `
      <div class="editor-form">
        <input type="text" id="editor-name" value="${p.name}" placeholder="Nom du programme" class="editor-input-big">
        <input type="text" id="editor-desc" value="${p.desc}" placeholder="Description" class="editor-input-big">
        <div class="editor-rest-row" style="display:flex;gap:8px;align-items:center;margin:8px 0;flex-wrap:wrap;">
          <label style="flex:1;min-width:140px;">⏱️ Repos séries
            <input type="number" id="editor-rest" value="${restVal}" min="10" max="600" step="5" style="width:70px;margin-left:4px;"> s
          </label>
          <label style="flex:1;min-width:140px;">⏱️ Repos exos
            <input type="number" id="editor-rest-exos" value="${restExosVal}" min="10" max="900" step="5" placeholder="auto" style="width:70px;margin-left:4px;"> s
            <span style="display:block;font-size:0.72rem;color:var(--muted);margin-top:2px;">Vide = adapté automatiquement</span>
          </label>
        </div>
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
    const restEl = document.getElementById('editor-rest');
    const restExosEl = document.getElementById('editor-rest-exos');
    if (restEl) p.restTime = parseInt(restEl.value) || 90;
    if (restExosEl) {
      const v = parseInt(restExosEl.value);
      p.restBetweenExos = v > 0 ? v : null; // vide => repos adaptatif
    }
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
  guidedSide: null, // null, 'right', 'left' pour unilatéral
  restTime: 90,
  restBetweenExos: 180,
  restExosFixed: null,
  restPauseCount: 0,

  startProgramDay(pid, di) {
    const prog = this.getAllPrograms().find(p => p.id === pid);
    if (!prog) return;
    this.syncPlanDays(prog);
    const day = prog.days[di];
    // Repos recommandé : utiliser celui de la semaine courante si disponible
    const weekIdx = prog.currentWeekIdx ?? 0;
    const currentWeek = prog.weeks && prog.weeks[weekIdx];
    const defaultRest = prog.restTime || (currentWeek && currentWeek.restRecommended) || prog.restRecommended || 90;

    // Enregistrer le contexte si c'est un plan, pour marquer la complétion à la fin
    if (prog.isPlan) {
      this._currentPlanContext = { planId: pid, weekIdx: prog.currentWeekIdx ?? 0, dayIdx: di };
    } else {
      this._currentPlanContext = null;
    }

    this.showModal({
      icon: '⏱️', title: 'Temps de repos',
      msg: 'Combien de secondes de repos entre les séries ?',
      input: String(defaultRest), unit: 'sec', placeholder: String(defaultRest),
      confirmText: 'C\'est parti 🚀',
      onConfirm: (val) => {
        this.restTime = parseInt(val) || defaultRest;
        // null => repos inter-exercices adaptatif ; valeur => imposée par le programme
        this.restExosFixed = prog.restBetweenExos || null;
        this.restBetweenExos = prog.restBetweenExos || 180;
        this._launchDay(day);
      }
    });
  },

  _launchDay(day) {
    // Dédoublonner les exercices (sécurité pour plans importés)
    const seenNames = new Set();
    const uniqueExercises = day.exercises.filter(pe => {
      if (seenNames.has(pe.name)) return false;
      seenNames.add(pe.name);
      return true;
    });

    this.currentWorkout = uniqueExercises.map(pe => {
      const exo = this.exercises.find(e => e.name === pe.name);
      const sug = this.getSuggestedWeight(pe.name);
      let kg = pe.kg || (sug ? sug.kg : (exo?.defaultKg || ''));

      // Ajuster le poids selon le RPE cible vs RPE de la dernière séance
      // Si la dernière séance était plus intense (RPE plus élevé), réduire le poids
      // Si elle était moins intense, augmenter légèrement
      if (kg && pe.targetRpe) {
        const lastPerf = this.getLastPerformance(pe.name);
        const lastRpe = lastPerf ? parseInt(lastPerf.feeling) || 8 : 8;
        const targetRpe = parseInt(pe.targetRpe) || 8;
        const rpeDiff = targetRpe - lastRpe; // négatif = on veut plus léger
        if (rpeDiff !== 0) {
          // ~2.5-5% par point de RPE de différence
          const factor = 1 + (rpeDiff * 0.04); // +/-4% par point de RPE
          kg = Math.max(0, Math.round(parseFloat(kg) * factor * 2) / 2); // arrondi au demi-kg
        }
      }

      // En deload, réduire de 20% supplémentaire
      if (pe.deload && kg && !pe.kg) {
        kg = Math.max(0, Math.round(parseFloat(kg) * 0.80 * 2) / 2);
      }

      const defaultReps = pe.reps.includes('-') ? pe.reps.split('-')[1] : pe.reps.replace(/\/jambe/, '');
      const sets = [];

      // Séries d'échauffement progressives (50% et 70% du poids cible)
      // Pas d'échauffement : deload, abdos, isométriques, ou poids nul
      const isAbdoOrIso = exo && (exo.muscle === 'Abdos' || exo.muscle === 'Mollets' || exo.isometric);
      const numKg = parseFloat(kg) || 0;
      if (!pe.deload && !isAbdoOrIso && numKg > 0) {
        const warmup1Kg = Math.max(0, Math.round(numKg * 0.50 * 2) / 2);
        const warmup2Kg = Math.max(0, Math.round(numKg * 0.70 * 2) / 2);
        const warmupReps = Math.min(10, parseInt(defaultReps) || 10);
        sets.push({ kg: warmup1Kg, reps: String(warmupReps), feeling: '', technique: '', warmup: true });
        sets.push({ kg: warmup2Kg, reps: String(warmupReps), feeling: '', technique: '', warmup: true });
      }

      for (let i = 0; i < pe.sets; i++) {
        const isLast = i === pe.sets - 1;
        const savedReps = exo?.lastReps?.[i] || defaultReps;
        sets.push({ kg, reps: (isLast && pe.lastSetTechnique === '21') ? '21' : savedReps, feeling: '',
          technique: (isLast && pe.lastSetTechnique) ? pe.lastSetTechnique : '' });
      }
      return { exerciseId: exo ? exo.id : 0, name: pe.name, muscle: exo ? exo.muscle : '',
        video: exo ? exo.video || '' : '', targetReps: pe.reps, suggestion: sug,
        targetRpe: pe.targetRpe || null, deload: !!pe.deload, sets };
    });

    this.guidedMode = true;
    this.guidedExoIndex = 0;
    this.guidedSetIndex = 0;
    this.restPauseCount = 0;
    this.guidedSide = null;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelector('[data-view="workout"]').classList.add('active');
    document.getElementById('view-workout').classList.add('active');
    document.getElementById('workout-free').classList.add('hidden');
    document.getElementById('workout-guided').classList.remove('hidden');
    this.renderGuided();
  },

  renderGuided() {
    // Reset chrono isométrique au changement de série/exo
    this._resetIsoChrono();
    const exo = this.currentWorkout[this.guidedExoIndex];
    if (!exo) return;
    const set = exo.sets[this.guidedSetIndex];
    if (!set) return;
    const totalExos = this.currentWorkout.length;
    const totalSets = exo.sets.length;
    const tech = set.technique ? DATA.techniques[set.technique] : null;
    const isRestPause = set.technique === 'rest-pause';
    const exoData = this.exercises.find(e => e.name === exo.name);
    const mode = exoData?.mode || 'bilateral';
    const isUni = mode === 'unilateral';
    // Init side pour unilatéral
    if (isUni && !this.guidedSide) this.guidedSide = 'right';

    // Progress dots (exercices)
    document.getElementById('guided-progress').innerHTML = this.currentWorkout.map((e, i) => {
      const done = e.sets.every(s => s.feeling);
      const cls = i === this.guidedExoIndex ? 'active' : (done ? 'done' : '');
      return `<div class="progress-dot ${cls}">${i + 1}</div>`;
    }).join('');

    // Animation
    // Le côté travaillé et la technique influencent réellement l'animation
    // (figure miroir pour la série gauche, tempo ralenti en négatif, etc.).
    document.getElementById('guided-animation').innerHTML = ANIMATIONS.get(exo.name, {
      label: exo.name,
      side: isUni ? this.guidedSide : null,
      mode,
      technique: set.technique,
    });

    // Nom + muscle
    document.getElementById('guided-exo-name').textContent = exo.name;
    const rpeBadge = exo.targetRpe ? ` · <span class="rpe-target-badge rpe-${exo.targetRpe}">🎯 RPE ${exo.targetRpe}</span>` : '';
    const deloadBadge = exo.deload ? ' · <span class="deload-badge">🔻 Deload</span>' : '';
    document.getElementById('guided-exo-muscle').innerHTML =
      `${exo.muscle}${exo.targetReps ? ` — Objectif : ${exo.targetReps}` : ''}${rpeBadge}${deloadBadge}`;

    // Série en cours
    const rpLabel = isRestPause && this.restPauseCount > 0 ? ` (rest-pause ${this.restPauseCount}/3)` : '';
    const techBadge = tech
      ? `<div class="technique-badge" style="border-color:${tech.color};color:${tech.color};margin-bottom:12px">${tech.emoji} ${tech.label}<span class="tech-desc">${tech.desc}</span></div>
         ${tech.detail ? `<div class="tech-detail"><div class="tech-detail-exec">${tech.detail.execution.replace(/\n/g, '<br>')}</div><div class="tech-detail-conseil">💡 ${tech.detail.conseil}</div></div>` : ''}`
      : '';

    const isIsometric = !!(exoData && exoData.isometric);
    const targetTime = isIsometric ? (set.reps || exo.targetReps || '30s') : null;

    document.getElementById('guided-current-set').innerHTML = `
      ${techBadge}
      ${set.warmup ? '<div class="warmup-badge">🔥 Échauffement — ne compte pas dans le volume</div>' : ''}
      <div class="guided-set-label">${set.warmup ? 'Échauffement' : 'Série'} ${this.guidedSetIndex + 1} / ${totalSets}${rpLabel}${isUni ? ` — <strong>${this.guidedSide === 'right' ? '💪 Droite' : '🤛 Gauche'}</strong>` : ''}${mode === 'alternated' ? ' <span style="color:var(--muted)">(D+G)</span>' : ''}</div>
      <div class="guided-set-sub">Exercice ${this.guidedExoIndex + 1} / ${totalExos} · ${this._remainingText()}</div>
      <div class="guided-inputs">
        ${!isIsometric ? `
        <div class="guided-input-group">
          <label>Poids</label>
          <input type="number" inputmode="decimal" value="${set.kg}" placeholder="0"
            onchange="app.currentWorkout[${this.guidedExoIndex}].sets[${this.guidedSetIndex}].kg=this.value"
            oninput="app.currentWorkout[${this.guidedExoIndex}].sets[${this.guidedSetIndex}].kg=this.value">
        </div>
        <div class="guided-input-group">
          <label>Reps</label>
          <input type="number" inputmode="numeric" value="${set.reps}" placeholder="0"
            onchange="app.currentWorkout[${this.guidedExoIndex}].sets[${this.guidedSetIndex}].reps=this.value"
            oninput="app.currentWorkout[${this.guidedExoIndex}].sets[${this.guidedSetIndex}].reps=this.value">
        </div>
        ` : `
        <div class="guided-chrono-group">
          <div class="chrono-target">🎯 Objectif : <strong>${targetTime}</strong></div>
          <div class="chrono-display" id="guided-chrono-display">00:00</div>
          <button class="chrono-btn" id="guided-chrono-btn" onclick="app.toggleIsoChrono()">▶️ Démarrer</button>
          <input type="hidden" id="guided-chrono-value"
            value="${set.reps || ''}"
            onchange="app.currentWorkout[${this.guidedExoIndex}].sets[${this.guidedSetIndex}].reps=this.value">
        </div>
        `}
      </div>
      ${this._getExoTips(exo.name)}
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

  _getExoTips(name) {
    const desc = DATA.descriptions[name];
    const bwBadge = this._getBwStepBadge(name);
    const tipsHtml = (desc && desc.tips)
      ? `<div class="guided-tips">${desc.tips.split(' · ').map(t => `<span class="guided-tip">${t}</span>`).join('')}</div>`
      : '';
    return bwBadge + tipsHtml;
  },

  _getBwStepBadge(name) {
    const steps = DATA.bodyweightProgression && DATA.bodyweightProgression[name];
    if (!steps || !steps.length) return '';
    const exo = this.exercises.find(e => e.name === name);
    if (!exo || exo.defaultKg > 0) return ''; // dès qu'il y a un poids, on n'affiche plus l'échelle bodyweight
    const idx = Math.min(exo.bwStep || 0, steps.length - 1);
    const step = steps[idx];
    if (!step) return '';
    return `<div style="background:#1a1a2e;border:1px solid #4ecca3;border-radius:10px;padding:10px 12px;margin:8px 0;">
      <div style="color:#4ecca3;font-size:0.85em;font-weight:600;">🎚️ Progression bodyweight — Étape ${idx + 1}/${steps.length}</div>
      <div style="color:#fff;font-weight:600;margin-top:4px;">${step.label}</div>
      <div style="color:var(--muted);font-size:0.9em;margin-top:4px;">💡 ${step.tip}</div>
    </div>`;
  },

  // Chronomètre pour exercices isométriques
  _isoChronoInterval: null,
  _isoChronoStart: 0,
  _isoChronoRunning: false,

  toggleIsoChrono() {
    if (this._isoChronoRunning) {
      this._stopIsoChrono();
    } else {
      this._startIsoChrono();
    }
  },

  _startIsoChrono() {
    this._isoChronoStart = Date.now();
    this._isoChronoRunning = true;
    const btn = document.getElementById('guided-chrono-btn');
    if (btn) btn.textContent = '⏹️ Stop';
    this._isoChronoInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this._isoChronoStart) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      const display = document.getElementById('guided-chrono-display');
      if (display) display.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 200);
  },

  _stopIsoChrono() {
    clearInterval(this._isoChronoInterval);
    this._isoChronoRunning = false;
    const elapsed = Math.floor((Date.now() - this._isoChronoStart) / 1000);
    const btn = document.getElementById('guided-chrono-btn');
    if (btn) btn.textContent = `✅ ${elapsed}s enregistré`;
    // Sauvegarder le temps réalisé comme "reps" (ex: "35s")
    const val = `${elapsed}s`;
    const input = document.getElementById('guided-chrono-value');
    if (input) { input.value = val; input.dispatchEvent(new Event('change')); }
    this.currentWorkout[this.guidedExoIndex].sets[this.guidedSetIndex].reps = val;
  },

  _resetIsoChrono() {
    clearInterval(this._isoChronoInterval);
    this._isoChronoRunning = false;
    this._isoChronoStart = 0;
  },

  guidedSetFeeling(rpe) {
    const set = this.currentWorkout[this.guidedExoIndex].sets[this.guidedSetIndex];
    set.feeling = rpe;
    this.closeRpeModal();
    this._afterRpe();
  },

  showRpeModal(afterCb, targetRpe) {
    this._afterRpe = afterCb;
    document.querySelectorAll('#modal-rpe .rpe-btn').forEach(b => b.classList.remove('rpe-target'));
    if (targetRpe) {
      const btn = document.querySelector('#modal-rpe .rpe-btn.rpe-' + targetRpe);
      if (btn) btn.classList.add('rpe-target');
    }
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
    this.guidedSide = null;
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

  // ---- Repos inter-exercices adaptatif ---------------------------------
  // Le facteur limitant n'est pas le même selon les exercices :
  //  - même muscle       -> récupération locale nécessaire (2 min 30)
  //  - polyarticulaire lourd -> fatigue systémique (jusqu'à 3 min)
  //  - groupe différent  -> simple transition (1 min à 1 min 30)
  _muscleGroup(muscle) {
    const m = (muscle || '').toLowerCase();
    if (/pector|épaule|epaule|deltoï|deltoi|triceps/.test(m)) return 'push';
    if (/dos|dorsaux|dorsal|trapèze|trapeze|biceps|lombaire|rhomboï/.test(m)) return 'pull';
    if (/quadri|ischio|fessier|mollet|jambe|cuisse|adducteur/.test(m)) return 'legs';
    if (/abdo|gainage|oblique|transverse|psoas/.test(m)) return 'core';
    return 'other';
  },

  _isCompound(name) {
    return /squat|soulev|fente|développé|developpe|rowing|hip thrust|dips|traction|pompe|tirage/i.test(name || '');
  },

  _isBarbell(name) {
    const exo = this.exercises.find(e => e.name === name);
    if (exo && exo.mode === 'barbell') return true;
    return /barre/i.test(name || '');
  },

  _isSystemic(name) {
    return /squat barre|soulevé de terre barre|souleve de terre barre/i.test(name || '');
  },

  _adaptiveRestExos(prev, next) {
    if (!prev || !next) return { sec: 120, why: '' };

    const sameMuscle = !!(prev.muscle && next.muscle && prev.muscle === next.muscle);
    const gPrev = this._muscleGroup(prev.muscle);
    const gNext = this._muscleGroup(next.muscle);
    const sameGroup = gPrev === gNext && gPrev !== 'other';
    const compound = this._isCompound(prev.name) || this._isCompound(next.name);
    const barbell = this._isBarbell(prev.name) || this._isBarbell(next.name);
    const systemic = this._isSystemic(prev.name);

    let sec, why;
    if (sameMuscle) { sec = 150; why = 'même muscle sollicité'; }
    else if (sameGroup) { sec = 100; why = 'même groupe musculaire'; }
    else { sec = 70; why = 'groupe musculaire différent'; }

    if (compound && sec < 90) { sec = 90; why += ' · polyarticulaire'; }
    if (barbell && sec < 120) { sec = 120; why += ' · charge lourde'; }
    if (systemic && sec < 180) { sec = 180; why = 'fatigue générale après ' + prev.name; }

    return { sec, why };
  },

  _formatRest(sec) {
    if (sec < 60) return `${sec} s`;
    const m = Math.floor(sec / 60), s = sec % 60;
    return s ? `${m} min ${s}` : `${m} min`;
  },

  // Texte "il reste N exercices / M séries" pour la séance guidée  // includeCurrent = true : l'exercice/série en cours n'a pas encore été effectué
  _remainingText(includeCurrent = false) {
    const total = this.currentWorkout.length;
    const exosLeft = total - this.guidedExoIndex - (includeCurrent ? 0 : 1);
    let setsLeft = 0;
    this.currentWorkout.forEach((e, i) => {
      if (i > this.guidedExoIndex) setsLeft += e.sets.length;
      else if (i === this.guidedExoIndex) setsLeft += Math.max(0, e.sets.length - this.guidedSetIndex - (includeCurrent ? 0 : 1));
    });
    const exoPart = exosLeft <= 0
      ? 'Dernier exercice'
      : (exosLeft === 1 && includeCurrent ? 'Dernier exercice' : `Encore ${exosLeft} exercice${exosLeft > 1 ? 's' : ''}`);
    const setPart = setsLeft <= 1
      ? `${setsLeft} série restante`
      : `${setsLeft} séries restantes`;
    return `${exoPart} · ${setPart}`;
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

    // Unilatéral : D → G sans repos, RPE demandé seulement après G
    const exoData = this.exercises.find(e => e.name === exo.name);
    const mode = exoData?.mode || 'bilateral';
    if (mode === 'unilateral' && this.guidedSide === 'right') {
      this.guidedSide = 'left';
      this.renderGuided();
      return;
    }

    // Demander le RPE avant de continuer
    // En deload ou warmup : pas de question RPE
    if (!set.feeling) {
      if (exo.deload) {
        set.feeling = 7;
        this._continueAfterRpe();
        return;
      }
      if (set.warmup) {
        set.feeling = 'warmup';
        this._continueAfterRpe();
        return;
      }
      this.showRpeModal(() => this._continueAfterRpe(), exo.targetRpe);
      return;
    }
    this._continueAfterRpe();
  },

  _continueAfterRpe() {
    const exo = this.currentWorkout[this.guidedExoIndex];
    const isLastSet = this.guidedSetIndex === exo.sets.length - 1;
    const isLastExo = this.guidedExoIndex === this.currentWorkout.length - 1;

    this.restPauseCount = 0;
    this.guidedSide = null;
    this._uniDone = false;

    if (isLastSet && isLastExo) {
      this.finishWorkout();
      return;
    }

    if (isLastSet) {
      this.guidedExoIndex++;
      this.guidedSetIndex = 0;
      this.guidedSide = null;
      this.renderGuided();
      window.scrollTo(0, 0);
      const nextExo = this.currentWorkout[this.guidedExoIndex];
      const nextKg = nextExo.sets[0]?.kg || '';
      const desc = DATA.descriptions[nextExo.name];
      const kgHtml = nextKg ? `<div class="next-exo-kg">${nextKg} kg</div>` : '';
      const setsHtml = `<div class="next-exo-sets">${nextExo.sets.length} série${nextExo.sets.length > 1 ? 's' : ''}${nextExo.targetReps ? ` · ${nextExo.targetReps} reps` : ''}</div>`;
      const execHtml = desc && desc.exec
        ? `<div class="next-exo-exec"><div class="next-exo-sub">Exécution</div>${desc.exec}</div>` : '';
      const tipsHtml = desc && desc.tips
        ? `<div class="next-exo-tips">${desc.tips.split(' · ').map(t => `<span class="guided-tip">${t}</span>`).join('')}</div>` : '';

      // repos adaptatif (sauf si le programme impose une valeur fixe)
      const adapt = this._adaptiveRestExos(exo, nextExo);
      const restSec = this.restExosFixed || adapt.sec;
      const restNote = this.restExosFixed
        ? `<div class="next-exo-rest">Repos ${this._formatRest(restSec)}</div>`
        : `<div class="next-exo-rest">Repos adapté · <strong>${this._formatRest(restSec)}</strong><span>${adapt.why}</span></div>`;
      const nextExoData = this.exercises.find(e => e.name === nextExo.name);
      const nextAnim = ANIMATIONS.get(nextExo.name, {
        label: nextExo.name,
        mode: nextExoData?.mode || 'bilateral',
        technique: nextExo.sets[0]?.technique,
      });
      const descHtml = `
        <div class="next-exo-preview">
          <div class="next-exo-label">Prochain exercice</div>
          <div class="next-exo-anim">${nextAnim}</div>
          <div class="next-exo-title">${nextExo.name}</div>
          ${desc ? `<div class="next-exo-muscles">${desc.muscles}</div>` : ''}
          ${kgHtml}
          ${setsHtml}
          ${restNote}
          <div class="next-exo-remaining">${this._remainingText(true)}</div>
          ${execHtml}
          ${tipsHtml}
        </div>`;
      this.showTimerPopup('Repos entre exercices', descHtml);
      timer.onEnd = () => this.hideTimerPopup();
      timer.autoStart(restSec);
    } else {
      // Repos plus court après les séries d'échauffement (45s au lieu du repos normal)
      const currentSet = exo.sets[this.guidedSetIndex];
      const isWarmupRest = currentSet && currentSet.warmup;
      this.showTimerPopup(isWarmupRest ? 'Repos échauffement' : 'Repos',
        `<div class="rest-remaining">${this._remainingText()}</div>`);
      timer.onEnd = () => {
        this.hideTimerPopup();
        this.guidedSetIndex++;
        this.guidedSide = null;
        this.renderGuided();
        window.scrollTo(0, 0);
      };
      timer.autoStart(isWarmupRest ? 45 : this.restTime);
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
    // Sauvegarder dans l'historique SANS les séries d'échauffement
    const workoutForHistory = this.currentWorkout.map(exo => ({
      ...exo,
      sets: exo.sets.filter(s => !s.warmup)
    }));
    this.history.unshift({ id: Date.now(), date: new Date().toISOString(), exercises: JSON.parse(JSON.stringify(workoutForHistory)) });
    this.saveHistory();

    // Sauvegarder les reps et poids réalisés sur chaque exercice
    this.currentWorkout.forEach(we => {
      const exo = this.exercises.find(e => e.name === we.name);
      if (!exo) return;
      const repsArr = we.sets.map(s => s.reps || '').filter(r => r);
      if (repsArr.length) exo.lastReps = repsArr;

      // En deload : ne pas mettre à jour defaultKg (poids volontairement réduit)
      if (we.deload) return;

      // Toujours mettre à jour le poids par défaut avec le dernier poids utilisé
      // C'est la référence pour le calcul des charges dans les semaines à venir
      const lastKg = we.sets.filter(s => s.kg).map(s => parseFloat(s.kg)).pop();
      if (lastKg) {
        // Si le plan indique un RPE cible et que l'exercice a un targetRpe,
        // on recalcule le defaultKg « à RPE 8 » (référence) à partir du poids réellement utilisé.
        // Formule inverse de computeTargetKg : defaultKg = lastKg / (repFactor/0.75 * rpeFactor * deloadFactor)
        const targetRpe = we.targetRpe ? parseInt(we.targetRpe) : null;
        if (targetRpe && we.targetReps) {
          const repF = PLANNER.repFactor(we.targetReps) / 0.75;
          const rpeF = PLANNER.rpeFactor(targetRpe);
          const factor = repF * rpeF;
          const inferredDefault = factor > 0 ? Math.round(lastKg / factor * 2) / 2 : lastKg;
          if (inferredDefault > 0) exo.defaultKg = inferredDefault;
        } else {
          // Pas de RPE cible (programme classique) : le dernier poids devient la référence
          exo.defaultKg = lastKg;
        }
      }
    });
    this.saveExercises();

    this.proposeWeightAdjustments();

    // Marquer la séance comme complétée dans le plan + auto-avancement de semaine
    this.markPlanDayCompleted();

    // Snapshot automatique après chaque séance (filet de sécurité)
    this.saveSnapshot('après-séance');

    this.currentWorkout = [];
    this.guidedMode = false;
    this.guidedExoIndex = 0;
    this.guidedSetIndex = 0;
    this.restPauseCount = 0;
    this.guidedSide = null;
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
      // Ne pas proposer d'ajustement sur les séances de deload
      // (le poids est volontairement réduit, pas représentatif)
      if (we.deload) return;

      // On garde les séries avec un feeling + des reps (exclure warmup).
      const setsWithData = we.sets.filter(s => s.feeling && s.feeling !== 'warmup' && s.reps && !s.warmup);
      if (!setsWithData.length) return;

      const exo = this.exercises.find(e => e.name === we.name);
      if (!exo) return;

      // Palier selon le groupe musculaire
      const increment = DATA.weightIncrements[exo.muscle] || 1;

      // Ignorer les séries avec technique d'intensification pour la décision
      const normalSets = setsWithData.filter(s => !s.technique);
      const referenceSet = normalSets.length > 0 ? normalSets.at(-1) : setsWithData[0];
      const rpe = parseInt(referenceSet.feeling);
      const repsRealized = parseInt(referenceSet.reps);
      const lastKg = parseFloat(referenceSet.kg) || 0;

      if (isNaN(rpe) || isNaN(repsRealized)) return;

      // Extraire le haut de la plage de reps
      let maxReps = 10;
      if (we.targetReps) {
        const parts = we.targetReps.replace(/\/jambe/, '').split('-');
        maxReps = parseInt(parts[parts.length - 1]) || 10;
      }

      // 🎚️ Progression au poids du corps : si aucun poids n'est utilisé (ni sur cette série,
      // ni configuré par défaut) et que l'exo possède une échelle de variantes, on propose
      // le passage à l'étape suivante quand c'est trop facile. Dès que l'utilisateur ajoute
      // un poids externe, on retombe sur la logique classique en kg — donc on ne propose
      // plus rien de spécifique (ex. crunch lesté).
      const bwSteps = DATA.bodyweightProgression && DATA.bodyweightProgression[we.name];
      const usesBodyweight = lastKg === 0 && !(exo.defaultKg > 0);
      if (bwSteps && usesBodyweight) {
        const currentStep = exo.bwStep || 0;
        const nextStep = currentStep + 1;
        if (nextStep < bwSteps.length) {
          let shouldProgress = false;
          let reason = '';
          if (we.targetRpe) {
            const targetRpe = parseInt(we.targetRpe);
            // Règle 1 (RPE) : au moins 1 point sous la cible = variante trop facile
            if (rpe <= targetRpe - 1) {
              shouldProgress = true;
              reason = `RPE ${rpe} ressenti vs ${targetRpe} cible → trop facile, passe à la variante plus dure`;
            }
            // Règle 2 (double progression) : haut de la fourchette atteint à RPE ≤ cible
            else if (repsRealized >= maxReps && rpe <= targetRpe) {
              shouldProgress = true;
              reason = `${repsRealized} reps (obj : ${maxReps}) à RPE ${rpe} (cible ${targetRpe}) → prêt pour la variante plus dure`;
            }
          } else if (rpe <= 7 && repsRealized >= maxReps) {
            shouldProgress = true;
            reason = `${repsRealized} reps (obj : ${maxReps}) à RPE ${rpe} → prêt pour la variante plus dure`;
          } else if (rpe <= 6) {
            shouldProgress = true;
            reason = `RPE ${rpe} ressenti → trop facile, passe à la variante plus dure`;
          }
          if (shouldProgress) {
            proposals.push({
              exo, name: we.name, bodyweight: true,
              currentStep, nextStep, stepData: bwSteps[nextStep],
              totalSteps: bwSteps.length,
              rpe, repsRealized, muscle: exo.muscle, reason,
            });
          }
        }
        return; // pas de suggestion en kg tant qu'on est en bodyweight pur
      }

      if (increment === 0) return; // sécurité (muscle sans palier défini)

      let decision = 'same';
      let newKg = lastKg;
      let reason = '';

      // 🎯 Mode RPE cible : convergence vers le RPE visé par le plan
      // 1 point de RPE ≈ 2.5 % de charge (consensus Helms / RTS)
      if (we.targetRpe) {
        const targetRpe = parseInt(we.targetRpe);
        const delta = rpe - targetRpe; // >0 trop dur, <0 trop facile
        if (Math.abs(delta) >= 1) {
          const adjPct = -delta * 0.025;
          const desiredKg = lastKg * (1 + adjPct);
          // Arrondir au palier muscle (ex. 2.5 kg pour pectoraux)
          const steps = Math.round((desiredKg - lastKg) / increment);
          if (steps !== 0) {
            newKg = Math.max(0, lastKg + steps * increment);
            decision = steps > 0 ? 'up' : 'down';
            const arrow = steps > 0 ? '+' : '';
            reason = `RPE ${rpe} ressenti vs ${targetRpe} cible → ${arrow}${steps * increment} kg pour atteindre la zone visée`;
          }
        }
      }

      // Mode classique (fallback si pas de targetRpe — programmes non-plan)
      if (decision === 'same' && !we.targetRpe) {
        if (repsRealized >= maxReps && rpe <= 8) {
          decision = 'up';
          newKg = lastKg + increment;
          reason = `${repsRealized} reps (obj : ${maxReps}) à RPE ${rpe} → prêt à monter`;
        } else if (rpe >= 10 && repsRealized < maxReps - 2) {
          decision = 'down';
          newKg = Math.max(0, lastKg - increment);
          reason = `RPE 10 avec ${repsRealized} reps (obj : ${maxReps}) → trop lourd`;
        }
      }

      if (decision === 'same' || newKg === lastKg) return;

      proposals.push({
        exo, name: we.name, lastKg, newKg, increment, decision,
        rpe, repsRealized, maxReps, muscle: exo.muscle, reason,
        targetRpe: we.targetRpe, targetReps: we.targetReps, isDeload: !!we.deload
      });
    });

    if (!proposals.length) return;

    const showNext = (i) => {
      if (i >= proposals.length) return;
      const p = proposals[i];

      // 🎚️ Proposition de progression au poids du corps
      if (p.bodyweight) {
        const addBadge = p.stepData.addWeight ? '\n\n➕ À partir de cette étape, saisis le poids réel dans les séries : la progression repassera en kg.' : '';
        this.showModal({
          icon: '🎚️', title: p.name,
          msg: `${p.muscle} — progression au poids du corps\n${p.reason}\n\nÉtape ${p.currentStep + 1}/${p.totalSteps} → ${p.nextStep + 1}/${p.totalSteps} :\n« ${p.stepData.label} »\n\n💡 ${p.stepData.tip}${addBadge}`,
          confirmText: 'Passer à la variante suivante', cancelText: 'Rester à l\'étape actuelle',
          onConfirm: () => {
            p.exo.bwStep = p.nextStep;
            this.saveExercises();
            showNext(i + 1);
          }
        });
        document.getElementById('modal-custom-cancel').onclick = () => { this.closeCustomModal(); showNext(i + 1); };
        return;
      }

      const arrow = p.decision === 'up' ? '⬆️' : '⬇️';
      this.showModal({
        icon: arrow, title: p.name,
        msg: `${p.muscle} — palier ${p.increment} kg\n${p.reason}\n\n${p.lastKg} kg → ${p.newKg} kg`,
        confirmText: `Valider ${p.newKg} kg`, cancelText: `Garder ${p.lastKg} kg`,
        onConfirm: () => {
          // Recalculer le defaultKg (référence RPE 8, 8-10 reps) à partir du poids validé
          // pour que computeTargetKg puisse recalculer correctement les semaines suivantes
          if (p.targetRpe && p.targetReps) {
            const targetRpe = parseInt(p.targetRpe);
            const repF = PLANNER.repFactor(p.targetReps) / 0.75;
            const rpeF = PLANNER.rpeFactor(targetRpe);
            const dlF = p.isDeload ? 0.80 : 1;
            const factor = repF * rpeF * dlF;
            p.exo.defaultKg = factor > 0 ? Math.round(p.newKg / factor * 2) / 2 : p.newKg;
          } else {
            p.exo.defaultKg = p.newKg;
          }
          this.saveExercises();
          showNext(i + 1);
        }
      });
      document.getElementById('modal-custom-cancel').onclick = () => { this.closeCustomModal(); showNext(i + 1); };
    };
    showNext(0);
  },

  // ---------- PROGRESSION PAR EXERCICE ----------
  showProgressionChart(name) {
    const data = this._getExoProgressionData(name);
    if (!data.length) {
      this.showModal({ icon: '📈', title: name, msg: 'Pas encore d\'historique pour cet exercice.', confirmText: 'OK', onConfirm: () => {} });
      return;
    }

    const exo = this.exercises.find(e => e.name === name);
    const muscle = exo ? exo.muscle : '';

    // Stats
    const first = data[data.length - 1];
    const last = data[0];
    const maxKg = Math.max(...data.map(d => d.kg));
    const gain = last.kg - first.kg;
    const gainPct = first.kg > 0 ? Math.round((gain / first.kg) * 100) : 0;

    // Estimation 1RM sur la meilleure performance
    const best1RM = Math.max(...data.map(d => {
      const rir = Math.max(0, 10 - (d.rpe || 8));
      return Math.round(d.kg * (1 + (d.reps + rir) / 30));
    }));

    // Générer le SVG
    const svg = this._buildProgressionSVG(data);

    document.getElementById('desc-title').textContent = `📈 ${name}`;
    document.getElementById('desc-content').innerHTML = `
      <div class="progression-chart">
        <div class="progression-stats">
          <div class="prog-stat"><span class="prog-stat-val">${last.kg} kg</span><span class="prog-stat-label">Actuel</span></div>
          <div class="prog-stat"><span class="prog-stat-val ${gain > 0 ? 'prog-up' : gain < 0 ? 'prog-down' : ''}">${gain > 0 ? '+' : ''}${gain} kg</span><span class="prog-stat-label">Progression</span></div>
          <div class="prog-stat"><span class="prog-stat-val">${gainPct > 0 ? '+' : ''}${gainPct}%</span><span class="prog-stat-label">Évolution</span></div>
          <div class="prog-stat"><span class="prog-stat-val">${best1RM} kg</span><span class="prog-stat-label">1RM estimé</span></div>
        </div>
        <div class="progression-svg-wrap">${svg}</div>
        <div class="progression-detail">
          <div class="prog-info">🏋️ ${muscle} · ${data.length} séances · Max : ${maxKg} kg</div>
          <div class="prog-info">📅 ${first.dateLabel} → ${last.dateLabel}</div>
        </div>
        <div class="progression-history">
          <h3>Dernières séances</h3>
          ${data.slice(0, 10).map(d => `
            <div class="prog-history-row">
              <span class="prog-h-date">${d.dateLabel}</span>
              <span class="prog-h-kg">${d.kg} kg</span>
              <span class="prog-h-reps">×${d.reps}</span>
              ${d.rpe ? `<span class="prog-h-rpe rpe-${d.rpe}">RPE ${d.rpe}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.getElementById('modal-exo-desc').classList.remove('hidden');
  },

  _getExoProgressionData(name) {
    const data = [];
    for (const session of this.history) {
      const exo = session.exercises.find(e => e.name === name);
      if (!exo) continue;
      // Prendre le set le plus lourd de la séance (hors warmup)
      const validSets = exo.sets.filter(s => s.kg && parseFloat(s.kg) > 0 && !s.warmup);
      if (!validSets.length) continue;
      const best = validSets.sort((a, b) => parseFloat(b.kg) - parseFloat(a.kg))[0];
      const d = new Date(session.date);
      data.push({
        date: d,
        dateLabel: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        kg: parseFloat(best.kg),
        reps: parseInt(best.reps) || 0,
        rpe: parseInt(best.feeling) || null
      });
    }
    return data; // Plus récent en premier
  },

  _buildProgressionSVG(data) {
    if (data.length < 2) {
      return `<div style="text-align:center;color:var(--muted);padding:20px;">Pas assez de données pour tracer un graphe (min 2 séances)</div>`;
    }

    const W = 320, H = 160, PAD = 30;
    const pts = [...data].reverse(); // chronologique (ancien → récent)
    const kgs = pts.map(d => d.kg);
    const minKg = Math.min(...kgs) - 2.5;
    const maxKg = Math.max(...kgs) + 2.5;
    const rangeKg = maxKg - minKg || 1;

    const xStep = (W - PAD * 2) / (pts.length - 1);
    const toX = (i) => PAD + i * xStep;
    const toY = (kg) => H - PAD - ((kg - minKg) / rangeKg) * (H - PAD * 2);

    // Points du graphe
    const points = pts.map((d, i) => `${toX(i)},${toY(d.kg)}`).join(' ');

    // Aire sous la courbe (gradient)
    const areaPoints = `${toX(0)},${H - PAD} ${points} ${toX(pts.length - 1)},${H - PAD}`;

    // Lignes de grille horizontales
    const gridLines = [];
    const gridStep = rangeKg > 20 ? 10 : rangeKg > 10 ? 5 : 2.5;
    for (let kg = Math.ceil(minKg / gridStep) * gridStep; kg <= maxKg; kg += gridStep) {
      const y = toY(kg);
      gridLines.push(`<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" stroke="#333" stroke-width="0.5"/>`);
      gridLines.push(`<text x="${PAD - 4}" y="${y + 4}" fill="#888" font-size="9" text-anchor="end">${kg}</text>`);
    }

    // Labels dates (premier et dernier)
    const dateLabels = `
      <text x="${PAD}" y="${H - 8}" fill="#888" font-size="9" text-anchor="start">${pts[0].dateLabel}</text>
      <text x="${W - PAD}" y="${H - 8}" fill="#888" font-size="9" text-anchor="end">${pts[pts.length - 1].dateLabel}</text>
    `;

    // Points individuels
    const dots = pts.map((d, i) => {
      const color = i === pts.length - 1 ? '#4ecca3' : '#e94560';
      return `<circle cx="${toX(i)}" cy="${toY(d.kg)}" r="4" fill="${color}" stroke="#1a1a2e" stroke-width="2"/>`;
    }).join('');

    return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;max-height:200px;">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4ecca3" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#4ecca3" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      ${gridLines.join('')}
      <polygon points="${areaPoints}" fill="url(#areaGrad)"/>
      <polyline points="${points}" fill="none" stroke="#4ecca3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${dots}
      ${dateLabels}
    </svg>`;
  },

  // Vue globale des progressions (accessible depuis le menu "Plus")
  renderProgressionOverview() {
    const composés = ['Développé couché barre', 'Squat barre', 'Soulevé de terre barre',
      'Développé militaire barre', 'Développé couché haltères', 'Goblet squat haltère',
      'Rowing barre buste penché', 'Développé incliné haltères', 'Soulevé de terre roumain haltères',
      'Fentes bulgares haltères', 'Curl biceps haltères', 'Hip Thrust haltère'];

    // Trouver les exercices qui ont de l'historique
    const withData = this.exercises
      .filter(e => this._getExoProgressionData(e.name).length >= 2)
      .sort((a, b) => {
        const idxA = composés.indexOf(a.name);
        const idxB = composés.indexOf(b.name);
        if (idxA >= 0 && idxB >= 0) return idxA - idxB;
        if (idxA >= 0) return -1;
        if (idxB >= 0) return 1;
        return 0;
      });

    if (!withData.length) {
      return '<p style="color:var(--muted);text-align:center;padding:20px;">Pas encore assez d\'historique. Fais quelques séances et reviens ici !</p>';
    }

    return withData.map(e => {
      const data = this._getExoProgressionData(e.name);
      const first = data[data.length - 1];
      const last = data[0];
      const gain = last.kg - first.kg;
      const miniSvg = this._buildMiniSparkline(data);
      return `<div class="prog-overview-card" onclick="app.showProgressionChart('${e.name.replace(/'/g, "\\'")}')">
        <div class="prog-ov-left">
          <div class="prog-ov-name">${e.name}</div>
          <div class="prog-ov-stats">${last.kg} kg · ${data.length} séances · <span class="${gain > 0 ? 'prog-up' : gain < 0 ? 'prog-down' : ''}">${gain > 0 ? '+' : ''}${gain} kg</span></div>
        </div>
        <div class="prog-ov-chart">${miniSvg}</div>
      </div>`;
    }).join('');
  },

  _buildMiniSparkline(data) {
    if (data.length < 2) return '';
    const W = 80, H = 32;
    const pts = [...data].reverse();
    const kgs = pts.map(d => d.kg);
    const minKg = Math.min(...kgs);
    const maxKg = Math.max(...kgs);
    const range = maxKg - minKg || 1;
    const xStep = W / (pts.length - 1);
    const points = pts.map((d, i) => `${i * xStep},${H - ((d.kg - minKg) / range) * (H - 4) - 2}`).join(' ');
    const color = kgs[kgs.length - 1] >= kgs[0] ? '#4ecca3' : '#e94560';
    return `<svg viewBox="0 0 ${W} ${H}" style="width:80px;height:32px;">
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
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
  async exportData() {
    const data = {
      version: 1,
      date: new Date().toISOString(),
      exercises: this.exercises,
      history: this.history,
      customPrograms: this.customPrograms,
      userAge: localStorage.getItem('userAge') || null,
      userGender: localStorage.getItem('userGender') || null,
    };
    const json = JSON.stringify(data);
    const filename = `muscutracker-${new Date().toISOString().slice(0, 10)}.json`;

    // 📲 Partage natif (iOS share sheet, Android, etc.) — bien plus pratique
    // que copier-coller du JSON sur mobile.
    try {
      const file = new File([json], filename, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Sauvegarde MuscuTracker' });
        return;
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return; // l'utilisateur a annulé
      // sinon, on tombe dans le fallback ci-dessous
    }

    // Fallback : téléchargement (desktop) + textarea (vieux navigateurs)
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
      return;
    } catch (e) {}

    // Dernier recours : ancien flow textarea
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
      if (data.userAge) localStorage.setItem('userAge', data.userAge);
      if (data.userGender) localStorage.setItem('userGender', data.userGender);
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
      if (data.userAge) localStorage.setItem('userAge', data.userAge);
      if (data.userGender) localStorage.setItem('userGender', data.userGender);
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
      onConfirm: () => {
        // Snapshot de sécurité avant le wipe (ne touche pas la clé "snapshots")
        this.saveSnapshot('avant-réinitialisation');
        const snaps = localStorage.getItem('snapshots');
        localStorage.clear();
        if (snaps) localStorage.setItem('snapshots', snaps);
        location.reload();
      }
    });
  },

  // ---------- Snapshots automatiques (restauration en un tap) ----------
  saveSnapshot(reason = 'auto') {
    const snap = {
      version: 1,
      date: new Date().toISOString(),
      reason,
      exercises: this.exercises,
      history: this.history,
      customPrograms: this.customPrograms,
    };
    let snapshots;
    try { snapshots = JSON.parse(localStorage.getItem('snapshots') || '[]'); } catch (e) { snapshots = []; }
    snapshots.unshift(snap);
    while (snapshots.length > 5) snapshots.pop();
    try {
      localStorage.setItem('snapshots', JSON.stringify(snapshots));
    } catch (e) {
      // QuotaExceeded → on garde seulement les 2 plus récents
      try { localStorage.setItem('snapshots', JSON.stringify(snapshots.slice(0, 2))); } catch (_) {}
    }
  },

  restoreSnapshot(idx) {
    let snapshots;
    try { snapshots = JSON.parse(localStorage.getItem('snapshots') || '[]'); } catch (e) { snapshots = []; }
    const snap = snapshots[idx];
    if (!snap) return;
    const d = new Date(snap.date);
    const ds = d.toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    this.showModal({
      icon: '↻', title: 'Restaurer cette sauvegarde ?',
      msg: `Du ${ds}\n${(snap.history || []).length} séances · ${(snap.exercises || []).length} exos · ${(snap.customPrograms || []).length} programmes\n\n⚠️ Tes données actuelles seront remplacées (un snapshot de sauvegarde est créé avant).`,
      confirmText: 'Restaurer', confirmClass: 'modal-btn-confirm',
      onConfirm: () => {
        // Snapshot de sécurité avant restauration
        this.saveSnapshot('avant-restauration');
        this.exercises = snap.exercises || [];
        this.history = snap.history || [];
        this.customPrograms = snap.customPrograms || [];
        this.saveExercises();
        this.saveHistory();
        this.saveCustomPrograms();
        this.renderAll();
        this.renderSnapshots();
        alert('Sauvegarde restaurée ! 🎉');
      }
    });
  },

  deleteSnapshot(idx) {
    this.showModal({
      icon: '🗑️', title: 'Supprimer ce snapshot ?',
      msg: 'Action irréversible.',
      confirmText: 'Supprimer', confirmClass: 'modal-btn-danger',
      onConfirm: () => {
        let snapshots;
        try { snapshots = JSON.parse(localStorage.getItem('snapshots') || '[]'); } catch (e) { return; }
        snapshots.splice(idx, 1);
        localStorage.setItem('snapshots', JSON.stringify(snapshots));
        this.renderSnapshots();
      }
    });
  },

  renderSnapshots() {
    const list = document.getElementById('snapshots-list');
    if (!list) return;
    let snapshots;
    try { snapshots = JSON.parse(localStorage.getItem('snapshots') || '[]'); } catch (e) { snapshots = []; }
    if (!snapshots.length) {
      list.innerHTML = '<p class="settings-desc" style="font-size:0.8rem;font-style:italic;">Aucune sauvegarde automatique pour l\'instant. Le 1er snapshot sera créé après ta prochaine séance.</p>';
      return;
    }
    list.innerHTML = snapshots.map((s, i) => {
      const d = new Date(s.date);
      const ds = d.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      const reasonIcon = {
        'auto': '⏱️',
        'après-séance': '✅',
        'avant-restauration': '🛟',
        'avant-réinitialisation': '⚠️',
      }[s.reason] || '⏱️';
      return `<div class="snapshot-item">
        <div class="snapshot-info">
          <div class="snapshot-date">${reasonIcon} ${ds}</div>
          <div class="snapshot-stats">${(s.history || []).length} séances · ${(s.exercises || []).length} exos · ${(s.customPrograms || []).length} prog · <em>${s.reason || 'auto'}</em></div>
        </div>
        <div class="snapshot-actions">
          <button class="snapshot-restore" onclick="app.restoreSnapshot(${i})">↻</button>
          <button class="snapshot-delete" onclick="app.deleteSnapshot(${i})">🗑️</button>
        </div>
      </div>`;
    }).join('');
  },

  // Bouton direct "choisir un fichier" (sans modal intermédiaire)
  pickImportFile() {
    document.getElementById('import-file').click();
  },

  // ---------- PERSISTANCE DU STOCKAGE & MISES À JOUR ----------
  async requestPersist(silent = false) {
    if (!navigator.storage || !navigator.storage.persist) {
      if (!silent) this.showModal({ icon: 'ℹ️', title: 'Non supporté', msg: 'Ton navigateur ne supporte pas l\'API de persistance. Utilise plutôt les exports manuels.', confirmText: 'OK', onConfirm: () => {} });
      this.showStorageStatus();
      return;
    }
    try {
      const already = await navigator.storage.persisted();
      if (already) { this.showStorageStatus(); return; }
      const granted = await navigator.storage.persist();
      this.showStorageStatus();
      if (!silent && !granted) {
        this.showModal({
          icon: '⚠️', title: 'Persistance refusée',
          msg: 'iOS n\'a pas accordé le stockage persistant cette fois. Réessaye après quelques séances supplémentaires (iOS l\'accorde plus volontiers aux PWAs installées et utilisées régulièrement).',
          confirmText: 'OK', onConfirm: () => {}
        });
      }
    } catch (e) { this.showStorageStatus(); }
  },

  async showStorageStatus() {
    const el = document.getElementById('storage-status');
    if (!el) return;
    const lines = [];
    let persisted = false;
    if (navigator.storage && navigator.storage.persisted) {
      try { persisted = await navigator.storage.persisted(); } catch (e) {}
    }
    lines.push(persisted
      ? '<div class="storage-line storage-ok">✅ Stockage persistant — données protégées contre l\'éviction iOS</div>'
      : '<div class="storage-line storage-warn">⚠️ Stockage non persistant — peut être nettoyé par iOS</div>');
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const e = await navigator.storage.estimate();
        if (e.usage != null && e.quota != null) {
          const usedKB = Math.round(e.usage / 1024);
          const quotaMB = Math.round(e.quota / (1024 * 1024));
          lines.push(`<div class="storage-line">💾 ${usedKB.toLocaleString('fr-FR')} Ko utilisés sur ~${quotaMB.toLocaleString('fr-FR')} Mo disponibles</div>`);
        }
      } catch (e) {}
    }
    let snaps;
    try { snaps = JSON.parse(localStorage.getItem('snapshots') || '[]'); } catch (e) { snaps = []; }
    if (snaps[0]) {
      const ds = new Date(snaps[0].date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      lines.push(`<div class="storage-line">📸 Dernier snapshot : ${ds}</div>`);
    }
    el.innerHTML = lines.join('');
    const btn = document.getElementById('btn-persist');
    if (btn) btn.style.display = persisted ? 'none' : 'block';
  },

  maybeAutoSnapshot() {
    if (!this.history.length && !this.customPrograms.length) return;
    let snaps;
    try { snaps = JSON.parse(localStorage.getItem('snapshots') || '[]'); } catch (e) { snaps = []; }
    const last = snaps[0];
    if (!last) { this.saveSnapshot('démarrage'); return; }
    const elapsed = Date.now() - new Date(last.date).getTime();
    if (elapsed > 24 * 3600 * 1000) this.saveSnapshot('quotidien');
  },

  setupServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('sw.js').then(reg => {
      // Nouvelle version installée alors qu'une ancienne contrôle déjà la page
      const offerUpdate = (worker) => {
        if (!worker) return;
        if (navigator.serviceWorker.controller) this._pendingUpdateWorker = worker;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            this._pendingUpdateWorker = worker;
            this.showUpdateBanner();
          }
        });
      };
      if (reg.waiting) offerUpdate(reg.waiting);
      reg.addEventListener('updatefound', () => offerUpdate(reg.installing));
    }).catch(() => {});

    // Quand le nouveau SW prend le contrôle, recharger pour servir le nouveau JS
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  },

  showUpdateBanner() {
    const el = document.getElementById('update-banner');
    if (el) el.classList.remove('hidden');
  },

  dismissUpdate() {
    const el = document.getElementById('update-banner');
    if (el) el.classList.add('hidden');
  },

  applyUpdate() {
    // Snapshot de sécurité juste avant la MAJ (en plus du backup manuel
    // que l'utilisateur peut faire avec l'autre bouton)
    this.saveSnapshot('avant-mise-à-jour');
    const w = this._pendingUpdateWorker;
    if (w) {
      w.postMessage({ type: 'SKIP_WAITING' });
      // Le 'controllerchange' rechargera la page automatiquement.
    } else {
      window.location.reload();
    }
  },

  updateStats() {
    const el = (id) => document.getElementById(id);
    if (el('stats-exos')) el('stats-exos').textContent = this.exercises.length;
    if (el('stats-sessions')) el('stats-sessions').textContent = this.history.length;
    if (el('stats-programs')) el('stats-programs').textContent = this.customPrograms.length;
    const cb = el('setting-bypass-mute');
    if (cb) cb.checked = !!timer.bypassMute;
    const ageEl = el('settings-age');
    if (ageEl) ageEl.value = localStorage.getItem('userAge') || '30';
    const aiKeyEl = el('settings-ai-key');
    if (aiKeyEl) aiKeyEl.value = this.getAiKey();
    const aiProvEl = el('settings-ai-provider');
    if (aiProvEl) aiProvEl.value = this.getAiProvider();
  },

  setUserAge(val) {
    const a = parseInt(val);
    if (a && a >= 14 && a <= 90) localStorage.setItem('userAge', String(a));
  },

  toggleBypassMute(enabled) {
    timer.setBypassMute(enabled);
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

  // ---------- ASSISTANT IA ----------
  aiMessages: [],

  getAiKey() { return localStorage.getItem('aiApiKey') || ''; },
  setAiKey(key) { localStorage.setItem('aiApiKey', key.trim()); },
  getAiProvider() { return localStorage.getItem('aiProvider') || 'openai'; },
  setAiProvider(p) { localStorage.setItem('aiProvider', p); },
  clearAiKey() {
    localStorage.removeItem('aiApiKey');
    localStorage.removeItem('aiProvider');
    const el = document.getElementById('settings-ai-key');
    if (el) el.value = '';
    this.showModal({ icon: '🗑️', title: 'Clé supprimée', msg: 'La clé API a été supprimée.', confirmText: 'OK', onConfirm: () => {} });
  },

  async testAiKey() {
    const key = this.getAiKey();
    const provider = this.getAiProvider();
    if (!key) { this.showModal({ icon: '⚠️', title: 'Pas de clé', msg: 'Entre d\'abord ta clé API.', confirmText: 'OK', onConfirm: () => {} }); return; }
    try {
      let res;
      if (provider === 'anthropic') {
        res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json', 'anthropic-dangerous-direct-browser-access': 'true' },
          body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 10, messages: [{ role: 'user', content: 'test' }] })
        });
      } else {
        res = await fetch('https://api.openai.com/v1/models', { headers: { 'Authorization': `Bearer ${key}` } });
      }
      if (res.ok || res.status === 200) this.showModal({ icon: '✅', title: 'Clé valide !', msg: `Connexion réussie à ${provider === 'anthropic' ? 'Anthropic' : 'OpenAI'}.`, confirmText: 'OK', onConfirm: () => {} });
      else this.showModal({ icon: '❌', title: 'Clé invalide', msg: `Erreur ${res.status}. Vérifie ta clé.`, confirmText: 'OK', onConfirm: () => {} });
    } catch (e) {
      this.showModal({ icon: '❌', title: 'Erreur réseau', msg: e.message, confirmText: 'OK', onConfirm: () => {} });
    }
  },

  renderAssistant() {
    const key = this.getAiKey();
    const noKey = document.getElementById('assistant-no-key');
    const chat = document.getElementById('assistant-chat');
    if (!key) {
      noKey.classList.remove('hidden');
      chat.classList.add('hidden');
    } else {
      noKey.classList.add('hidden');
      chat.classList.remove('hidden');
      this._renderMessages();
    }
  },

  _renderMessages() {
    const container = document.getElementById('assistant-messages');
    if (!container) return;
    container.innerHTML = this.aiMessages.map(m => {
      const cls = m.role === 'user' ? 'ai-msg-user' : 'ai-msg-bot';
      return `<div class="ai-msg ${cls}">${m.content.replace(/\n/g, '<br>')}</div>`;
    }).join('');
    container.scrollTop = container.scrollHeight;
  },

  sendAssistantMsg() {
    const input = document.getElementById('assistant-input');
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    this.askAssistant(q);
  },

  async askAssistant(question) {
    const key = this.getAiKey();
    if (!key) { this.goTo('settings'); return; }
    const provider = this.getAiProvider();

    this.aiMessages.push({ role: 'user', content: question });
    this._renderMessages();

    // Construire le contexte d'entraînement
    const context = this._buildAiContext();
    const conversationMsgs = this.aiMessages.filter(m => m.content !== '⏳ …').slice(-10);

    // Afficher "typing"
    this.aiMessages.push({ role: 'assistant', content: '⏳ …' });
    this._renderMessages();

    try {
      let responseText = '';

      if (provider === 'anthropic') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 800,
            system: context,
            messages: conversationMsgs
          })
        });
        const data = await res.json();
        if (data.content && data.content[0]) {
          responseText = data.content[0].text;
        } else if (data.error) {
          responseText = `❌ Erreur : ${data.error.message}`;
        }
      } else {
        // OpenAI
        const messages = [
          { role: 'system', content: context },
          ...conversationMsgs
        ];
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 800,
            temperature: 0.7,
          })
        });
        const data = await res.json();
        if (data.choices && data.choices[0]) {
          responseText = data.choices[0].message.content;
        } else if (data.error) {
          responseText = `❌ Erreur : ${data.error.message}`;
        }
      }

      // Remplacer le "typing"
      this.aiMessages.pop();
      this.aiMessages.push({ role: 'assistant', content: responseText || '❌ Réponse vide' });
    } catch (e) {
      this.aiMessages.pop();
      this.aiMessages.push({ role: 'assistant', content: `❌ Erreur réseau : ${e.message}` });
    }
    this._renderMessages();
  },

  _buildAiContext() {
    const age = localStorage.getItem('userAge') || '?';
    const nbExos = this.exercises.length;
    const nbSessions = this.history.length;

    // Résumé des 5 dernières séances
    const lastSessions = this.history.slice(0, 5).map(s => {
      const d = new Date(s.date).toLocaleDateString('fr-FR');
      const exos = s.exercises.map(e => {
        const sets = e.sets.map(st => `${st.kg||'?'}kg×${st.reps||'?'} RPE:${st.feeling||'?'}`).join(', ');
        return `${e.name}: ${sets}`;
      }).join(' | ');
      return `${d}: ${exos}`;
    }).join('\n');

    // Exercices avec poids par défaut
    const exoWeights = this.exercises.filter(e => e.defaultKg).map(e => `${e.name}: ${e.defaultKg}kg`).join(', ');

    // Programme en cours
    const plans = this.customPrograms.filter(p => p.isPlan);
    const planInfo = plans.length ? `Plan actif : "${plans[0].name}"` : 'Pas de plan 6 mois actif';

    return `Tu es un coach musculation expert, bienveillant et concis. Tu réponds en français.
L'utilisateur a ${age} ans, ${nbExos} exercices configurés, ${nbSessions} séances enregistrées.
${planInfo}

Poids de travail actuels : ${exoWeights || 'non renseignés'}

5 dernières séances :
${lastSessions || 'Aucune séance enregistrée'}

Réponds de manière concise (max 150 mots), pratique et motivante. Si tu proposes des exercices, utilise ceux du catalogue de l'utilisateur. N'invente pas de données que tu n'as pas.`;
  },
};

app.init();
