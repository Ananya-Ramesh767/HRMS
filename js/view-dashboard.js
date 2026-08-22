/* ============================= EMPLOYEE DASHBOARD ============================= */
function viewEmployeeDashboard(user){
  const att = getTodayAttendance(user.id);
  const status = employeeStatusToday(user.id);
  const pending = getLeavesForEmployee(user.id).filter(l=>l.status==='Pending').length;
  const notifs = getNotifications(user.id).slice(0,4);
  const recentAtt = getAttendanceForEmployee(user.id).slice(0,4);

  const actionBtn = !att
    ? `<button id="checkin-btn" class="bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg px-5 py-2.5 transition">Check In</button>`
    : !att.checkOut
    ? `<button id="checkout-btn" class="bg-ink hover:bg-ink/90 text-white font-semibold text-sm rounded-lg px-5 py-2.5 transition">Check Out</button>`
    : `<span class="inline-flex items-center gap-1.5 text-success text-sm font-semibold">${icon('check','w-4 h-4')} Day complete — ${att.hours}h logged</span>`;

  return `
  <div class="mb-6">
    <h1 class="font-display text-2xl font-bold text-ink">Hi ${user.name.split(' ')[0]}, here's your workday</h1>
    <p class="text-sm text-gray-500 mt-1">A quick look at everything happening today.</p>
  </div>
  <div class="bg-white rounded-2xl shadow-card p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">${icon('clock','w-6 h-6')}</div>
      <div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today's status</p>
        <div class="flex items-center gap-2 mt-1">${statusDot(status)}<span class="font-display font-semibold text-ink">${status==='present'?(att.checkOut?'Present · Completed':'Present · Checked in '+fmtTime(att.checkIn)) : status==='leave' ? 'On approved leave' : 'Not checked in yet'}</span></div>
      </div>
    </div>
    ${actionBtn}
  </div>
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${StatCard({ label:'Hours this week', value: weeklyHours(user.id).toFixed(1)+'h', iconName:'clock', accent:'primary' })}
    ${StatCard({ label:'Paid leave left', value: user.leaveBalance.paid+' days', iconName:'calendar', accent:'success' })}
    ${StatCard({ label:'Sick leave left', value: user.leaveBalance.sick+' days', iconName:'calendar', accent:'warning' })}
    ${StatCard({ label:'Pending requests', value: pending, iconName:'briefcase', accent:'primary' })}
  </div>
  <div class="grid lg:grid-cols-5 gap-6">
    <div class="lg:col-span-3 bg-white rounded-2xl shadow-card p-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-display font-semibold text-ink">Recent attendance</h2>
        <a href="#/attendance" class="text-xs font-semibold text-primary flex items-center gap-1">View all ${icon('arrowRight','w-3.5 h-3.5')}</a>
      </div>
      ${recentAtt.length ? `<table class="dl-table w-full"><thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th></tr></thead><tbody>
        ${recentAtt.map(a=>`<tr><td>${fmtDateLong(a.date)}</td><td>${fmtTime(a.checkIn)}</td><td>${fmtTime(a.checkOut)}</td><td>${a.hours!=null?a.hours+'h':'—'}</td></tr>`).join('')}
      </tbody></table>` : EmptyState('No attendance yet', 'Check in to start tracking your workday.')}
    </div>
    <div class="lg:col-span-2 bg-white rounded-2xl shadow-card p-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-display font-semibold text-ink">Notifications</h2>
        <a href="#/notifications" class="text-xs font-semibold text-primary flex items-center gap-1">View all ${icon('arrowRight','w-3.5 h-3.5')}</a>
      </div>
      ${notifs.length ? `<div class="space-y-3">${notifs.map(n=>`
        <div class="flex gap-3 items-start">
          <div class="w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read?'bg-gray-200':'bg-primary'}"></div>
          <div><p class="text-sm text-ink leading-snug">${esc(n.message)}</p><p class="text-xs text-gray-400 mt-0.5">${new Date(n.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</p></div>
        </div>`).join('')}</div>` : EmptyState('All caught up', 'You have no notifications right now.')}
    </div>
  </div>`;
}
function bindEmployeeDashboard(user){
  const inBtn = $('#checkin-btn'), outBtn = $('#checkout-btn');
  if(inBtn) inBtn.addEventListener('click', ()=>{ const r=checkIn(user.id); if(r.ok){ toast('Checked in for the day','success'); render(); } else toast(r.error,'danger'); });
  if(outBtn) outBtn.addEventListener('click', ()=>{ const r=checkOut(user.id); if(r.ok){ toast('Checked out — see you tomorrow!','success'); render(); } else toast(r.error,'danger'); });
}

/* ============================= HR DASHBOARD ============================= */
function viewHRDashboard(user){
  const db = getDB();
  const emps = db.employees;
  const today = todayStr();
  const presentToday = emps.filter(e=>employeeStatusToday(e.id)==='present').length;
  const onLeaveToday = emps.filter(e=>employeeStatusToday(e.id)==='leave').length;
  const absentToday = emps.length - presentToday - onLeaveToday;
  const pending = getPendingLeaves();

  return `
  <div class="mb-6">
    <h1 class="font-display text-2xl font-bold text-ink">Good to see you, ${user.name.split(' ')[0]}</h1>
    <p class="text-sm text-gray-500 mt-1">Here's what needs your attention today.</p>
  </div>
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${StatCard({ label:'Total employees', value: emps.length, iconName:'users', accent:'primary' })}
    ${StatCard({ label:'Present today', value: presentToday, sub:`${Math.round(presentToday/emps.length*100)}% attendance`, iconName:'clock', accent:'success' })}
    ${StatCard({ label:'On leave today', value: onLeaveToday, iconName:'calendar', accent:'primary' })}
    ${StatCard({ label:'Pending requests', value: pending.length, iconName:'briefcase', accent:'warning' })}
  </div>
  <div class="grid lg:grid-cols-5 gap-6">
    <div class="lg:col-span-3 bg-white rounded-2xl shadow-card p-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-display font-semibold text-ink">Needs attention</h2>
        <a href="#/leave" class="text-xs font-semibold text-primary flex items-center gap-1">Open Time Off ${icon('arrowRight','w-3.5 h-3.5')}</a>
      </div>
      ${pending.length ? `<div class="space-y-1">${pending.slice(0,6).map(l=>{
        const emp = emps.find(e=>e.id===l.employeeId);
        return `<div class="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
          ${Avatar(emp.name,8)}
          <div class="min-w-0 flex-1"><p class="text-sm font-medium text-ink truncate">${emp.name}</p><p class="text-xs text-gray-500">${l.type} · ${l.days} day${l.days>1?'s':''} · ${fmtDateLong(l.startDate)}</p></div>
          ${Badge('Pending')}
        </div>`; }).join('')}</div>` : EmptyState('Nothing pending', 'All leave requests are up to date.')}
    </div>
    <div class="lg:col-span-2 bg-white rounded-2xl shadow-card p-5">
      <h2 class="font-display font-semibold text-ink mb-3">Today's snapshot</h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm"><span class="flex items-center gap-2"><span class="status-dot bg-success"></span>Present</span><span class="font-semibold">${presentToday}</span></div>
        <div class="w-full bar-track h-1.5"><div class="bg-success h-1.5 rounded-full" style="width:${emps.length? presentToday/emps.length*100:0}%"></div></div>
        <div class="flex items-center justify-between text-sm pt-2"><span class="flex items-center gap-2"><span class="text-primary text-xs">✈️</span>On leave</span><span class="font-semibold">${onLeaveToday}</span></div>
        <div class="w-full bar-track h-1.5"><div class="bg-primary h-1.5 rounded-full" style="width:${emps.length? onLeaveToday/emps.length*100:0}%"></div></div>
        <div class="flex items-center justify-between text-sm pt-2"><span class="flex items-center gap-2"><span class="status-dot bg-warning"></span>Absent</span><span class="font-semibold">${absentToday}</span></div>
        <div class="w-full bar-track h-1.5"><div class="bg-warning h-1.5 rounded-full" style="width:${emps.length? absentToday/emps.length*100:0}%"></div></div>
      </div>
      <a href="#/analytics" class="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary">Full analytics ${icon('arrowRight','w-3.5 h-3.5')}</a>
    </div>
  </div>`;
}
