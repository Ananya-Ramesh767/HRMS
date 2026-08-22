/* ============================= DASHBOARDS ============================= */

/* ---- Employee Dashboard ---- */
function viewEmployeeDashboard(user){
  const att = getTodayAttendance(user.id);
  const status = employeeStatusToday(user.id);
  const pending = getLeavesForEmployee(user.id).filter(l=>l.status==='Pending').length;
  const notifs = getNotifications(user.id).slice(0,4);
  const recentAtt = getAttendanceForEmployee(user.id).slice(0,5);
  const completeness = calcProfileCompleteness(user);
  const onBreak = isOnBreak(att);

  // Profile completion nudge
  const profileNudge = completeness < 100 ? `
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-5 mb-6 text-white shadow-lg shadow-indigo-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-pop">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0">
          🚀
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-display font-extrabold text-base">Your profile is ${completeness}% complete!</h3>
            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20">Action Needed</span>
          </div>
          <p class="text-xs text-white/80 mt-0.5">Add your Bank Details, Loves &amp; Hobbies to complete your profile setup.</p>
        </div>
      </div>
      <a href="#/profile" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-indigo-700 hover:bg-white/90 text-xs font-extrabold shadow-md transition shrink-0">
        ${icon('edit','w-3.5 h-3.5')} Complete Profile
      </a>
    </div>` : '';

  // Dynamic Check-In / Break / Check-Out Controls
  let attendanceActions = '';
  if(!att){
    attendanceActions = `
      <button id="dash-checkin-btn" class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl px-6 py-3 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95 flex items-center gap-2">
        <span>✨</span> Check In for Today
      </button>`;
  } else if(!att.checkOut){
    if(onBreak){
      attendanceActions = `
        <div class="flex flex-wrap items-center gap-3">
          <button id="dash-endbreak-btn" class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-2xl px-5 py-3 shadow-md shadow-amber-500/25 transition-all active:scale-95 flex items-center gap-2">
            <span>☕</span> Resume Work (End Break)
          </button>
          <button id="dash-checkout-btn" class="bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-2xl px-5 py-3 transition-all active:scale-95">
            Check Out
          </button>
        </div>`;
    } else {
      attendanceActions = `
        <div class="flex flex-wrap items-center gap-3">
          <button id="dash-startbreak-btn" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl px-4 py-3 border border-slate-200/80 transition-all active:scale-95 flex items-center gap-1.5">
            <span>☕</span> Take a Break
          </button>
          <button id="dash-checkout-btn" class="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-black hover:to-slate-800 text-white font-bold text-sm rounded-2xl px-5 py-3 shadow-md transition-all active:scale-95">
            Check Out
          </button>
        </div>`;
    }
  } else {
    attendanceActions = `
      <div class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
        <span>🎉</span> Day Complete · ${att.hours || 0} hrs logged
      </div>`;
  }

  return `
  <!-- Welcome Greeting -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 class="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
        Good day, ${esc(user.name.split(' ')[0])}!
      </h1>
      <p class="text-xs text-slate-500 mt-1">Here is your daily snapshot at ${esc(user.company || 'Odoo India')}.</p>
    </div>

    <!-- Quick Daily Vibe Selector -->
    <div class="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-xs">
      <span class="text-[11px] font-bold text-slate-400 px-2">Vibe:</span>
      ${['🚀 Energized', '🎯 Focused', '✨ Inspired', '☕ Coffee', '🔥 On Fire'].map(v => `
        <button type="button" data-dash-vibe="${v}" class="px-2.5 py-1 rounded-xl text-xs font-bold transition ${user.vibe === v ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}">
          ${v.split(' ')[0]}
        </button>
      `).join('')}
    </div>
  </div>

  ${profileNudge}

  <!-- Real-time Attendance & Status Card -->
  <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-7 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-5 card-pop">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 text-2xl shadow-inner">
        ⏰
      </div>
      <div>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Status</p>
        <div class="flex flex-wrap items-center gap-2.5 mt-1.5">
          ${statusDot(status)}
          <span class="font-display font-extrabold text-ink text-sm sm:text-base">
            ${status==='present' ? (att.checkOut ? `Completed at ${fmtTime(att.checkOut)}` : `Checked in at ${fmtTime(att.checkIn)}`) : status==='break' ? 'Currently on Coffee Break' : status==='leave' ? 'On Approved Time Off' : 'Ready to start your workday'}
          </span>
        </div>
      </div>
    </div>
    ${attendanceActions}
  </div>

  <!-- Key Metrics Row -->
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${StatCard({ label:'Hours this week', value: weeklyHours(user.id).toFixed(1)+'h', sub:'Target: 40h', iconName:'clock', accent:'primary', trend:'+2.4h' })}
    ${StatCard({ label:'Paid time off', value: user.leaveBalance.paid+' days', sub:'Available to book', iconName:'calendar', accent:'success' })}
    ${StatCard({ label:'Sick leave', value: user.leaveBalance.sick+' days', sub:'Annual balance', iconName:'calendar', accent:'warning' })}
    ${StatCard({ label:'Pending requests', value: pending, sub: pending ? 'Awaiting HR review' : 'All clear', iconName:'briefcase', accent:'accent' })}
  </div>

  <!-- Recent Logs & Notifications Split -->
  <div class="grid lg:grid-cols-5 gap-6">
    <div class="lg:col-span-3 bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
          <span>📅</span> Recent Attendance Log
        </h2>
        <a href="#/attendance" class="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          Full Log ${icon('arrowRight','w-3.5 h-3.5')}
        </a>
      </div>
      ${recentAtt.length ? `
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <th class="pb-3">Date</th>
                <th class="pb-3">Check In</th>
                <th class="pb-3">Check Out</th>
                <th class="pb-3">Net Work</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              ${recentAtt.map(a => `
                <tr class="hover:bg-slate-50/50 transition">
                  <td class="py-3 font-semibold text-slate-800">${fmtDateLong(a.date)}</td>
                  <td class="py-3 font-medium text-slate-600">${fmtTime(a.checkIn)}</td>
                  <td class="py-3 font-medium text-slate-600">${fmtTime(a.checkOut)}</td>
                  <td class="py-3">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md font-mono font-bold text-[11px] ${a.hours && a.hours >= 8 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}">
                      ${a.hours != null ? a.hours + 'h' : 'In Progress'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : EmptyState('No attendance recorded yet', 'Check in above to record your first workday.')}
    </div>

    <!-- Right Side: Recent Notifications -->
    <div class="lg:col-span-2 bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
          <span>🔔</span> Notifications
        </h2>
        <a href="#/notifications" class="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          View All ${icon('arrowRight','w-3.5 h-3.5')}
        </a>
      </div>
      ${notifs.length ? `
        <div class="space-y-3">
          ${notifs.map(n => `
            <a href="${n.link}" class="flex items-start gap-3 p-3 rounded-2xl ${n.read ? 'bg-slate-50/60' : 'bg-indigo-50/60 border border-indigo-100'} hover:bg-indigo-50 transition">
              <span class="w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-300' : 'bg-indigo-600 animate-pulse'}"></span>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-bold text-ink leading-snug">${esc(n.message)}</p>
                <p class="text-[10px] text-slate-400 mt-1">${fmtDateLong(toDateStr(new Date(n.createdAt)))}</p>
              </div>
            </a>
          `).join('')}
        </div>
      ` : EmptyState('All caught up', 'You have no new notifications right now.')}
    </div>
  </div>`;
}

function bindEmployeeDashboard(user){
  const inBtn = $('#dash-checkin-btn');
  if(inBtn){
    inBtn.addEventListener('click', () => {
      const r = checkIn(user.id);
      if(r.ok){
        launchConfetti();
        playChime('success');
        toast('Checked in! Have a productive workday!', 'success');
        render();
      } else {
        toast(r.error, 'danger');
      }
    });
  }

  const startBreakBtn = $('#dash-startbreak-btn');
  if(startBreakBtn){
    startBreakBtn.addEventListener('click', () => {
      const r = startBreak(user.id);
      if(r.ok){
        playChime('click');
        toast('Break started — enjoy your coffee!', 'info');
        render();
      } else {
        toast(r.error, 'danger');
      }
    });
  }

  const endBreakBtn = $('#dash-endbreak-btn');
  if(endBreakBtn){
    endBreakBtn.addEventListener('click', () => {
      const r = endBreak(user.id);
      if(r.ok){
        playChime('click');
        toast('Welcome back to work!', 'success');
        render();
      } else {
        toast(r.error, 'danger');
      }
    });
  }

  const outBtn = $('#dash-checkout-btn');
  if(outBtn){
    outBtn.addEventListener('click', () => {
      const r = checkOut(user.id);
      if(r.ok){
        playChime('success');
        toast('Checked out! See you tomorrow!', 'success');
        render();
      } else {
        toast(r.error, 'danger');
      }
    });
  }

  // Dashboard Vibe Selector
  $$('[data-dash-vibe]').forEach(btn => {
    btn.addEventListener('click', () => {
      const vibe = btn.getAttribute('data-dash-vibe');
      setUserVibe(user.id, vibe);
      toast(`Mood set to ${vibe}!`, 'success');
      playChime('click');
      render();
    });
  });
}

/* ---- HR Dashboard ---- */
function viewHRDashboard(user){
  const db = getDB();
  const emps = db.employees;
  const presentToday = emps.filter(e => employeeStatusToday(e.id)==='present').length;
  const onLeaveToday = emps.filter(e => employeeStatusToday(e.id)==='leave').length;
  const onBreakToday = emps.filter(e => employeeStatusToday(e.id)==='break').length;
  const absentToday = emps.length - presentToday - onLeaveToday - onBreakToday;
  const pending = getPendingLeaves();
  const totalMonthlyPayroll = emps.reduce((acc,e) => acc + computeSalary(e.wage).netSalary, 0);
  const attendancePct = emps.length ? Math.round(((presentToday+onBreakToday)/emps.length)*100) : 0;

  // "Today's HR Pulse" — a plain-language narrative summary of the day's numbers,
  // sitting above the detailed stat cards/breakdowns below.
  const pulseTone = attendancePct >= 90
    ? { emoji:'🎉', headline:'Team attendance is looking great!' }
    : attendancePct >= 75
    ? { emoji:'👍', headline:'Team attendance is holding steady.' }
    : { emoji:'👀', headline:'Attendance is a bit lower than usual today.' };
  const pulseAction = pending.length
    ? `${pending.length} leave request${pending.length===1?'':'s'} need${pending.length===1?'s':''} your attention.`
    : `No pending approvals right now — you're all caught up.`;

  const hrPulse = `
  <div class="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-7 mb-6 text-white shadow-lg shadow-indigo-500/20 card-pop">
    <div class="flex items-center justify-between mb-5">
      <p class="text-[11px] font-extrabold uppercase tracking-widest text-white/70">Today at ${esc(COMPANY.name)}</p>
      <span class="text-[11px] font-semibold text-white/60">${fmtDateLong(todayStr())}</span>
    </div>
    <div class="grid grid-cols-3 gap-4 sm:gap-6 mb-5">
      <div>
        <p class="font-display text-3xl sm:text-4xl font-black leading-none">${attendancePct}%</p>
        <p class="text-[11px] sm:text-xs font-bold text-white/70 mt-1.5">Attendance</p>
      </div>
      <div>
        <p class="font-display text-3xl sm:text-4xl font-black leading-none">${onLeaveToday}</p>
        <p class="text-[11px] sm:text-xs font-bold text-white/70 mt-1.5">On Leave</p>
      </div>
      <div>
        <p class="font-display text-3xl sm:text-4xl font-black leading-none">${pending.length}</p>
        <p class="text-[11px] sm:text-xs font-bold text-white/70 mt-1.5">Pending Actions</p>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/15">
      <p class="text-xs sm:text-sm text-white/90 leading-relaxed">
        <span class="mr-1">${pulseTone.emoji}</span><span class="font-bold">${pulseTone.headline}</span>
        ${attendancePct}% of employees have checked in today. ${pulseAction}
      </p>
      ${pending.length ? `
        <a href="#/leave" class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-700 hover:bg-white/90 text-xs font-extrabold shadow-sm transition shrink-0">
          Review ${icon('arrowRight','w-3.5 h-3.5')}
        </a>` : ''}
    </div>
  </div>`;

  return `
  <!-- HR Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 class="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
        HR Command Center · <span class="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">${COMPANY.name}</span>
      </h1>
      <p class="text-xs text-slate-500 mt-1">Workforce analytics, approvals, and employee operations.</p>
    </div>
    <div class="flex items-center gap-3">
      <a href="#/employees" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-500/25 transition">
        ${icon('users','w-4 h-4')} Directory (${emps.length})
      </a>
    </div>
  </div>

  ${hrPulse}

  <!-- HR Stat Cards -->
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${StatCard({ label:'Total Workforce', value: emps.length, sub:'Active team members', iconName:'users', accent:'primary', trend:'+100%' })}
    ${StatCard({ label:'Checked in today', value: presentToday + onBreakToday, sub:`${Math.round(((presentToday+onBreakToday)/emps.length)*100)}% attendance rate`, iconName:'clock', accent:'success' })}
    ${StatCard({ label:'On Approved Leave', value: onLeaveToday, sub:'Scheduled time off', iconName:'calendar', accent:'accent' })}
    ${StatCard({ label:'Pending Requests', value: pending.length, sub: pending.length ? 'Requires HR action' : 'All caught up', iconName:'briefcase', accent:'warning' })}
  </div>

  <div class="grid lg:grid-cols-5 gap-6">
    <!-- Pending Leave Approvals -->
    <div class="lg:col-span-3 bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
          <span>⚡</span> Action Items &amp; Leave Requests
        </h2>
        <a href="#/leave" class="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          Time Off Hub ${icon('arrowRight','w-3.5 h-3.5')}
        </a>
      </div>

      ${pending.length ? `
        <div class="space-y-3">
          ${pending.slice(0,5).map(l => {
            const emp = emps.find(e => e.id === l.employeeId);
            return `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition">
              <div class="flex items-center gap-3">
                ${Avatar(emp, 10)}
                <div>
                  <p class="font-bold text-xs text-ink">${esc(emp?.name || 'Employee')}</p>
                  <p class="text-[11px] text-slate-500">${esc(l.type)} · <span class="font-bold text-indigo-600">${l.days} day(s)</span> · ${fmtDateLong(l.startDate)}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 self-end sm:self-center">
                ${Badge('Pending')}
                <a href="#/leave" class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition">
                  Review →
                </a>
              </div>
            </div>`;
          }).join('')}
        </div>
      ` : EmptyState('No pending requests', 'All employee time-off requests have been reviewed.')}
    </div>

    <!-- Attendance Breakdown -->
    <div class="lg:col-span-2 bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
          <span>📊</span> Today's Workforce Status
        </h2>
        <a href="#/analytics" class="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          Analytics ${icon('arrowRight','w-3.5 h-3.5')}
        </a>
      </div>

      <div class="space-y-4">
        <div>
          <div class="flex justify-between text-xs font-bold mb-1.5">
            <span class="text-emerald-700 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Present &amp; Working</span>
            <span class="text-slate-800">${presentToday} / ${emps.length}</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${emps.length ? (presentToday/emps.length)*100 : 0}%"></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-xs font-bold mb-1.5">
            <span class="text-amber-700 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-500"></span> On Break</span>
            <span class="text-slate-800">${onBreakToday} / ${emps.length}</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: ${emps.length ? (onBreakToday/emps.length)*100 : 0}%"></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-xs font-bold mb-1.5">
            <span class="text-indigo-700 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-indigo-500"></span> On Approved Leave</span>
            <span class="text-slate-800">${onLeaveToday} / ${emps.length}</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="bg-indigo-500 h-2 rounded-full transition-all duration-500" style="width: ${emps.length ? (onLeaveToday/emps.length)*100 : 0}%"></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-xs font-bold mb-1.5">
            <span class="text-slate-500 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-slate-300"></span> Not Checked In</span>
            <span class="text-slate-800">${absentToday} / ${emps.length}</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="bg-slate-300 h-2 rounded-full transition-all duration-500" style="width: ${emps.length ? (absentToday/emps.length)*100 : 0}%"></div>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span class="text-slate-500 font-medium">Monthly Payroll Run</span>
        <span class="font-display font-extrabold text-indigo-700">${fmtMoney(totalMonthlyPayroll)}</span>
      </div>
    </div>
  </div>`;
}
