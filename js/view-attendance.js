/* ============================= ATTENDANCE ============================= */
function viewAttendance(user){
  if(user.role==='hr'){
    const db = getDB();
    const date = APP.attDate || todayStr();
    const recs = getAllAttendanceForDate(date);
    const rows = db.employees.map(emp => {
      const rec = recs.find(r=>r.employeeId===emp.id);
      const onLeave = isOnApprovedLeave(emp.id, date);
      return { emp, rec, onLeave };
    });
    return `
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div><h1 class="font-display text-2xl font-bold text-ink">Attendance</h1><p class="text-sm text-gray-500 mt-1">Company-wide attendance by date.</p></div>
      <input id="att-date" type="date" value="${date}" class="${inputCls} w-auto"/>
    </div>
    <div class="bg-white rounded-2xl shadow-card overflow-x-auto">
      <table class="dl-table w-full min-w-[640px]">
        <thead><tr><th>Employee</th><th>Status</th><th>Check In</th><th>Check Out</th><th>Work Hours</th></tr></thead>
        <tbody>${rows.map(({emp,rec,onLeave})=>`
          <tr>
            <td><div class="flex items-center gap-2.5">${Avatar(emp.name,7)}<div><p class="font-medium">${emp.name}</p><p class="text-xs text-gray-400">${emp.department}</p></div></div></td>
            <td>${onLeave ? Badge('On Leave') : rec ? Badge('Present') : Badge('Absent')}</td>
            <td>${rec?fmtTime(rec.checkIn):'—'}</td>
            <td>${rec?fmtTime(rec.checkOut):'—'}</td>
            <td>${rec&&rec.hours!=null?rec.hours+'h':'—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }
  const att = getTodayAttendance(user.id);
  const status = employeeStatusToday(user.id);
  const monthRecs = getAttendanceForEmployee(user.id, APP.attMonthOffset||0);
  const monthLabel = (()=>{ const d=new Date(); d.setMonth(d.getMonth()+(APP.attMonthOffset||0)); return d.toLocaleDateString('en-IN',{month:'long', year:'numeric'}); })();
  const totalHrs = monthRecs.reduce((s,r)=>s+(r.hours||0),0);
  const actionBtn = !att
    ? `<button id="checkin-btn" class="bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg px-5 py-2.5 transition">Check In</button>`
    : !att.checkOut
    ? `<button id="checkout-btn" class="bg-ink hover:bg-ink/90 text-white font-semibold text-sm rounded-lg px-5 py-2.5 transition">Check Out</button>`
    : `<span class="text-success text-sm font-semibold">Completed · ${att.hours}h</span>`;

  return `
  <div class="mb-6"><h1 class="font-display text-2xl font-bold text-ink">Attendance</h1><p class="text-sm text-gray-500 mt-1">Your check-in history and monthly summary.</p></div>
  <div class="bg-white rounded-2xl shadow-card p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">${icon('clock','w-6 h-6')}</div>
      <div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today</p>
      <div class="flex items-center gap-2 mt-1">${statusDot(status)}<span class="font-display font-semibold text-ink">${status==='present'?(att.checkOut?'Present · Completed':'Checked in '+fmtTime(att.checkIn)) : status==='leave' ? 'On approved leave' : 'Not checked in yet'}</span></div></div>
    </div>
    ${actionBtn}
  </div>
  <div class="grid sm:grid-cols-3 gap-4 mb-6">
    ${StatCard({ label:'This month hours', value: totalHrs.toFixed(1)+'h', iconName:'clock', accent:'primary' })}
    ${StatCard({ label:'Days present', value: monthRecs.length, iconName:'check', accent:'success' })}
    ${StatCard({ label:'Weekly hours', value: weeklyHours(user.id).toFixed(1)+'h', iconName:'calendar', accent:'warning' })}
  </div>
  <div class="bg-white rounded-2xl shadow-card overflow-hidden">
    <div class="flex items-center justify-between p-5 pb-0">
      <h2 class="font-display font-semibold text-ink">${monthLabel}</h2>
      <div class="flex items-center gap-1">
        <button id="prev-month" class="p-1.5 rounded-lg hover:bg-paper text-gray-500">←</button>
        <button id="next-month" class="p-1.5 rounded-lg hover:bg-paper text-gray-500" ${(APP.attMonthOffset||0)>=0?'disabled':''}>→</button>
      </div>
    </div>
    <div class="overflow-x-auto p-5">
      ${monthRecs.length ? `<table class="dl-table w-full min-w-[520px]"><thead><tr><th>Date</th><th>Day</th><th>Check In</th><th>Check Out</th><th>Work Hours</th></tr></thead><tbody>
        ${monthRecs.map(a=>`<tr><td>${fmtDateLong(a.date)}</td><td>${fmtDay(a.date)}</td><td>${fmtTime(a.checkIn)}</td><td>${fmtTime(a.checkOut)}</td><td>${a.hours!=null?a.hours+'h':'In progress'}</td></tr>`).join('')}
      </tbody></table>` : EmptyState('No records this month', 'Attendance you log will show up here.')}
    </div>
  </div>`;
}
function bindAttendance(user){
  const inBtn=$('#checkin-btn'), outBtn=$('#checkout-btn');
  if(inBtn) inBtn.addEventListener('click', ()=>{ const r=checkIn(user.id); if(r.ok){ toast('Checked in','success'); render(); } else toast(r.error,'danger'); });
  if(outBtn) outBtn.addEventListener('click', ()=>{ const r=checkOut(user.id); if(r.ok){ toast('Checked out','success'); render(); } else toast(r.error,'danger'); });
  const dateInput = $('#att-date');
  if(dateInput) dateInput.addEventListener('change', e=>{ APP.attDate = e.target.value; render(); });
  const prev = $('#prev-month'), next = $('#next-month');
  if(prev) prev.addEventListener('click', ()=>{ APP.attMonthOffset = (APP.attMonthOffset||0)-1; render(); });
  if(next) next.addEventListener('click', ()=>{ if((APP.attMonthOffset||0)<0){ APP.attMonthOffset = (APP.attMonthOffset||0)+1; render(); } });
}
