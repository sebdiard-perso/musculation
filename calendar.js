const calendar = {
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  selectedDate: null,

  render(history) {
    const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    document.getElementById('calendar-month').textContent = `${months[this.currentMonth]} ${this.currentYear}`;

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const today = new Date();
    const startDay = firstDay === 0 ? 6 : firstDay - 1; // Lundi = 0

    // Jours avec séances
    const workoutDays = new Set();
    history.forEach(h => {
      const d = new Date(h.date);
      if (d.getMonth() === this.currentMonth && d.getFullYear() === this.currentYear) {
        workoutDays.add(d.getDate());
      }
    });

    let html = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
      .map(d => `<div class="cal-header">${d}</div>`).join('');

    for (let i = 0; i < startDay; i++) html += '<div class="cal-day empty"></div>';

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
      const hasW = workoutDays.has(d);
      const isSel = this.selectedDate === d;
      const cls = ['cal-day', isToday ? 'today' : '', hasW ? 'has-workout' : '', isSel ? 'selected' : ''].filter(Boolean).join(' ');
      html += `<div class="${cls}" onclick="app.selectCalendarDay(${d})">${d}</div>`;
    }

    document.getElementById('calendar-grid').innerHTML = html;
    this.renderDetail(history);
  },

  renderDetail(history) {
    const detail = document.getElementById('calendar-detail');
    if (!this.selectedDate) { detail.innerHTML = ''; return; }

    const sessions = history.filter(h => {
      const d = new Date(h.date);
      return d.getDate() === this.selectedDate && d.getMonth() === this.currentMonth && d.getFullYear() === this.currentYear;
    });

    if (!sessions.length) {
      detail.innerHTML = '<p style="color:var(--muted);text-align:center;padding:12px;">Pas de séance ce jour</p>';
      return;
    }

    detail.innerHTML = sessions.map(h => {
      const d = new Date(h.date);
      const timeStr = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const totalVolume = h.exercises.reduce((vol, e) => {
        return vol + e.sets.reduce((sv, s) => sv + (parseFloat(s.kg) || 0) * (parseInt(s.reps) || 0), 0);
      }, 0);

      // Trouver la séance précédente pour comparer
      const prevSession = this.findPreviousSession(history, h);

      const exoDetails = h.exercises.map(e => {
        const maxKg = Math.max(...e.sets.map(s => parseFloat(s.kg) || 0));
        const totalReps = e.sets.reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0);
        
        // Comparer avec la séance précédente
        let progression = '';
        if (prevSession) {
          const prevExo = prevSession.exercises.find(pe => pe.name === e.name);
          if (prevExo) {
            const prevMaxKg = Math.max(...prevExo.sets.map(s => parseFloat(s.kg) || 0));
            if (maxKg > prevMaxKg) progression = `<span class="prog-up">⬆️ +${(maxKg - prevMaxKg).toFixed(1)}kg</span>`;
            else if (maxKg < prevMaxKg) progression = `<span class="prog-down">⬇️ ${(maxKg - prevMaxKg).toFixed(1)}kg</span>`;
            else progression = `<span class="prog-same">=</span>`;
          }
        }

        return `<div class="cal-exo-detail">
          <span class="cal-exo-name">${e.name}</span>
          <span class="cal-exo-stats">${maxKg}kg × ${totalReps} reps ${progression}</span>
        </div>`;
      }).join('');

      // Volume total comparé
      let volComparison = '';
      if (prevSession) {
        const prevVolume = prevSession.exercises.reduce((vol, e) => {
          return vol + e.sets.reduce((sv, s) => sv + (parseFloat(s.kg) || 0) * (parseInt(s.reps) || 0), 0);
        }, 0);
        const diff = totalVolume - prevVolume;
        if (diff > 0) volComparison = `<span class="prog-up">⬆️ +${Math.round(diff)}kg</span>`;
        else if (diff < 0) volComparison = `<span class="prog-down">⬇️ ${Math.round(diff)}kg</span>`;
      }

      return `<div class="cal-detail-item" onclick="app.showDetail(${h.id})">
        <div class="date">${timeStr} — ${h.exercises.length} exos</div>
        <div class="cal-volume">Volume total : ${Math.round(totalVolume)} kg ${volComparison}</div>
        <div class="cal-exo-list">${exoDetails}</div>
      </div>`;
    }).join('');
  },

  findPreviousSession(history, current) {
    const currentDate = new Date(current.date);
    const currentExoNames = new Set(current.exercises.map(e => e.name));
    // Chercher la séance précédente avec au moins un exercice en commun
    for (const h of history) {
      if (h.id === current.id) continue;
      const hDate = new Date(h.date);
      if (hDate >= currentDate) continue;
      const hasCommon = h.exercises.some(e => currentExoNames.has(e.name));
      if (hasCommon) return h;
    }
    return null;
  },

  prev(history) { this.currentMonth--; if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; } this.selectedDate = null; this.render(history); },
  next(history) { this.currentMonth++; if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; } this.selectedDate = null; this.render(history); },
  selectDay(day, history) { this.selectedDate = this.selectedDate === day ? null : day; this.render(history); },
};
