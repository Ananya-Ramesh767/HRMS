/* ============================= ATTENDANCE ============================= */
function viewAttendance(user){
  if(user.role === 'hr'){
    const db = getDB();
    const date = APP.attDate || todayStr();
    const recs = getAllAttendanceForDate(date);
    const rows = db.employees.map(emp => {
      const rec = recs.find(r => r.employeeId === emp.id);
      const onLeave = isOnApprovedLeave(emp.id, date);
      return { emp, rec, onLeave };
    });

    const presentCount = rows.filter(r => r.rec && !r.onLeave).length;
    const leaveCount = rows.filter(r => r.onLeave).length;
    const absentCount = rows.length - presentCount - leaveCount;

    return `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
          Workforce Attendance · ${COMPANY.name}
        </h1>
        <p class="text-xs text-slate-500 mt-1">Daily check-in logs, break records, and working hours for all employees.</p>
      </div>
      <div class="flex items-center gap-3">
        <label for="att-date" class="text-xs font-bold text-slate-500">Filter Date:</label>
        <input id="att-date" type="date" value="${date}" class="${inputCls} w-auto text-xs py-2">
      </div>
    </div>

    <!-- Attendance Stats -->
    <div class="grid sm:grid-cols-3 gap-4 mb-6">
      ${StatCard({ label:'Present Employees', value: presentCount, sub:`${Math.round((presentCount/rows.length)*100)}% present`, iconName:'clock', accent:'success' })}
      ${StatCard({ label:'On Approved Leave', value: leaveCount, sub:'Scheduled time off', iconName:'calendar', accent:'accent' })}
      ${StatCard({ label:'Absent / Unreported', value: absentCount, sub:'Not checked in', iconName:'clock', accent:'warning' })}
    </div>

    <div class="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden card-pop">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 class="font-display font-extrabold text-base text-ink">Attendance Log for ${fmtDateLong(date)}</h2>
        <span class="text-xs text-slate-400 font-mono">${rows.length} total team members</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
              <th class="p-4">Employee</th>
              <th class="p-4">Status</th>
              <th class="p-4">Check In</th>
              <th class="p-4">Check Out</th>
              <th class="p-4">Break Time</th>
              <th class="p-4">Net Hours</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            ${rows.map(({ emp, rec, onLeave }) => {
              const breakMs = rec ? totalBreakMs(rec) : 0;
              return `
              <tr class="hover:bg-slate-50/60 transition">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    ${Avatar(emp, 9)}
                    <div>
                      <p class="font-bold text-ink">${esc(emp.name)}</p>
                      <p class="text-[11px] text-slate-400 font-mono">${esc(emp.empCode)} · ${esc(emp.department)}</p>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  ${onLeave ? Badge('On Leave') : rec ? (rec.checkOut ? Badge('Present') : (isOnBreak(rec) ? Badge('In Progress') : Badge('Present'))) : Badge('Absent')}
                </td>
                <td class="p-4 font-medium text-slate-700">${rec ? fmtTime(rec.checkIn) : '—'}</td>
                <td class="p-4 font-medium text-slate-700">${rec ? fmtTime(rec.checkOut) : '—'}</td>
                <td class="p-4 text-slate-500">${breakMs > 0 ? fmtDuration(breakMs) : '0m'}</td>
                <td class="p-4">
                  <span class="font-mono font-bold px-2 py-0.5 rounded-md ${rec && rec.hours != null ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}">
                    ${rec && rec.hours != null ? rec.hours + 'h' : (rec ? 'In Progress' : '—')}
                  </span>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  // Employee Attendance View
  const att = getTodayAttendance(user.id);
  const status = employeeStatusToday(user.id);
  const monthRecs = getAttendanceForEmployee(user.id, APP.attMonthOffset || 0);
  const monthLabel = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + (APP.attMonthOffset || 0));
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  })();
  const totalHrs = monthRecs.reduce((s, r) => s + (r.hours || 0), 0);
  const onBreak = isOnBreak(att);

  let actionButtons = '';
  if(!att){
    actionButtons = `
      <button id="att-checkin-btn" class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl px-6 py-3 shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2">
        <span>✨</span> Check In
      </button>`;
  } else if(!att.checkOut){
    if(onBreak){
      actionButtons = `
        <div class="flex items-center gap-3">
          <button id="att-endbreak-btn" class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-2xl px-5 py-3 shadow-md shadow-amber-500/25 transition active:scale-95">
            ☕ End Break
          </button>
          <button id="att-checkout-btn" class="bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-2xl px-5 py-3 transition active:scale-95">
            Check Out
          </button>
        </div>`;
    } else {
      actionButtons = `
        <div class="flex items-center gap-3">
          <button id="att-startbreak-btn" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl px-4 py-3 border border-slate-200 transition active:scale-95">
            ☕ Take Break
          </button>
          <button id="att-checkout-btn" class="bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-2xl px-5 py-3 shadow-md transition active:scale-95">
            Check Out
          </button>
        </div>`;
    }
  } else {
    actionButtons = `
      <div class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
        <span>🎉</span> Day Complete · ${att.hours || 0}h logged
      </div>`;
  }

  return `
  <div class="mb-6">
    <h1 class="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
      My Attendance
    </h1>
    <p class="text-xs text-slate-500 mt-1">Track check-ins, coffee breaks, and monthly working hour logs.</p>
  </div>

  <!-- Status & Actions Card -->
  <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-7 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-5 card-pop">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 text-2xl shadow-inner">
        ⏰
      </div>
      <div>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Record</p>
        <div class="flex flex-wrap items-center gap-2.5 mt-1.5">
          ${statusDot(status)}
          <span class="font-display font-extrabold text-ink text-sm sm:text-base">
            ${status==='present' ? (att.checkOut ? `Completed at ${fmtTime(att.checkOut)}` : `Checked in at ${fmtTime(att.checkIn)}`) : status==='break' ? 'Currently on Coffee Break' : status==='leave' ? 'On Approved Time Off' : 'Not checked in yet'}
          </span>
        </div>
      </div>
    </div>
    ${actionButtons}
  </div>

  <!-- Monthly Stats -->
  <div class="grid sm:grid-cols-3 gap-4 mb-6">
    ${StatCard({ label:'Total Month Hours', value: totalHrs.toFixed(1)+'h', sub:`In ${monthLabel}`, iconName:'clock', accent:'primary' })}
    ${StatCard({ label:'Days Checked In', value: monthRecs.length, sub:'Present working days', iconName:'check', accent:'success' })}
    ${StatCard({ label:'Past 7 Days Hours', value: weeklyHours(user.id).toFixed(1)+'h', sub:'Rolling weekly work', iconName:'calendar', accent:'warning' })}
  </div>

  <!-- Monthly Log Table -->
  <div class="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden card-pop">
    <div class="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
      <h2 class="font-display font-extrabold text-base text-ink">${monthLabel} Attendance History</h2>
      <div class="flex items-center gap-2">
        <button id="prev-month" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold transition">←</button>
        <button id="next-month" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold transition" ${(APP.attMonthOffset||0)>=0?'disabled opacity-40':''}>→</button>
      </div>
    </div>
    <div class="overflow-x-auto p-6 pt-2">
      ${monthRecs.length ? `
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
              <th class="py-3">Date</th>
              <th class="py-3">Day</th>
              <th class="py-3">Check In</th>
              <th class="py-3">Check Out</th>
              <th class="py-3">Breaks</th>
              <th class="py-3">Total Hours</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            ${monthRecs.map(a => {
              const breakMs = totalBreakMs(a);
              return `
              <tr class="hover:bg-slate-50/50 transition">
                <td class="py-3 font-semibold text-slate-800">${fmtDateLong(a.date)}</td>
                <td class="py-3 text-slate-500 font-medium">${fmtDay(a.date)}</td>
                <td class="py-3 font-medium text-slate-700">${fmtTime(a.checkIn)}</td>
                <td class="py-3 font-medium text-slate-700">${fmtTime(a.checkOut)}</td>
                <td class="py-3 text-slate-500">${breakMs > 0 ? fmtDuration(breakMs) : '0m'}</td>
                <td class="py-3">
                  <span class="font-mono font-bold px-2 py-0.5 rounded-md ${a.hours && a.hours >= 8 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}">
                    ${a.hours != null ? a.hours + 'h' : 'In progress'}
                  </span>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      ` : EmptyState('No records for this month', 'Check in to start building your attendance timeline.')}
    </div>
  </div>`;
}

function bindAttendance(user){
  const inBtn = $('#att-checkin-btn');
  if(inBtn){
    inBtn.addEventListener('click', () => {
      const r = checkIn(user.id);
      if(r.ok){
        launchConfetti();
        playChime('success');
        toast('Checked in! Have a great day!', 'success');
        render();
      } else {
        toast(r.error, 'danger');
      }
    });
  }

  const startBreakBtn = $('#att-startbreak-btn');
  if(startBreakBtn){
    startBreakBtn.addEventListener('click', () => {
      const r = startBreak(user.id);
      if(r.ok){
        playChime('click');
        toast('Break started — enjoy your break!', 'info');
        render();
      } else {
        toast(r.error, 'danger');
      }
    });
  }

  const endBreakBtn = $('#att-endbreak-btn');
  if(endBreakBtn){
    endBreakBtn.addEventListener('click', () => {
      const r = endBreak(user.id);
      if(r.ok){
        playChime('click');
        toast('Break ended — back to work!', 'success');
        render();
      } else {
        toast(r.error, 'danger');
      }
    });
  }

  const outBtn = $('#att-checkout-btn');
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

  const dateInput = $('#att-date');
  if(dateInput){
    dateInput.addEventListener('change', e => {
      APP.attDate = e.target.value;
      render();
    });
  }

  const prev = $('#prev-month'), next = $('#next-month');
  if(prev) prev.addEventListener('click', () => { APP.attMonthOffset = (APP.attMonthOffset || 0) - 1; render(); });
  if(next) next.addEventListener('click', () => { if((APP.attMonthOffset || 0) < 0){ APP.attMonthOffset = (APP.attMonthOffset || 0) + 1; render(); } });
}
