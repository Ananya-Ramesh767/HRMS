/* ============================= ANALYTICS (HR) ============================= */
function viewAnalytics(){
  const db = getDB();
  const emps = db.employees;
  const present = emps.filter(e => employeeStatusToday(e.id)==='present').length;
  const onLeave = emps.filter(e => employeeStatusToday(e.id)==='leave').length;
  const onBreak = emps.filter(e => employeeStatusToday(e.id)==='break').length;
  const absent = emps.length - present - onLeave - onBreak;

  const byDept = {};
  emps.forEach(e => { byDept[e.department] = (byDept[e.department] || 0) + 1; });

  const leaveTypes = {};
  db.leaves.forEach(l => { leaveTypes[l.type] = (leaveTypes[l.type] || 0) + 1; });

  const totalPayroll = emps.reduce((s, e) => s + computeSalary(e.wage).netSalary, 0);
  const maxDept = Math.max(...Object.values(byDept), 1);
  const maxLeave = Math.max(...Object.values(leaveTypes), 1);

  return `
  <div class="mb-6">
    <h1 class="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
      People Analytics · ${COMPANY.name}
    </h1>
    <p class="text-xs text-slate-500 mt-1">Live workforce metrics, department distributions, and payroll commitments.</p>
  </div>

  <!-- Key Metrics -->
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${StatCard({ label:'Attendance Rate', value: Math.round(((present+onBreak)/emps.length)*100)+'%', sub:'Present & working', iconName:'clock', accent:'success', trend:'+4%' })}
    ${StatCard({ label:'Pending Requests', value: getPendingLeaves().length, sub:'Awaiting HR action', iconName:'briefcase', accent:'warning' })}
    ${StatCard({ label:'Total Departments', value: Object.keys(byDept).length, sub:'Cross-functional units', iconName:'users', accent:'accent' })}
    ${StatCard({ label:'Monthly Net Payroll', value: fmtMoney(totalPayroll), sub:'Direct deposit run', iconName:'wallet', accent:'primary' })}
  </div>

  <div class="grid lg:grid-cols-2 gap-6">
    <!-- Department Distribution -->
    <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-7 card-pop">
      <h2 class="font-display font-extrabold text-base text-ink mb-1">Headcount by Department</h2>
      <p class="text-xs text-slate-400 mb-5">Talent distribution across functional teams</p>
      
      <div class="space-y-4">
        ${Object.entries(byDept).map(([dept, count]) => `
          <div>
            <div class="flex justify-between text-xs font-bold mb-1.5">
              <span class="text-slate-700">${dept}</span>
              <span class="text-indigo-700">${count} (${Math.round((count/emps.length)*100)}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500" style="width:${(count/maxDept)*100}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Leave Requests by Type -->
    <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-7 card-pop">
      <h2 class="font-display font-extrabold text-base text-ink mb-1">Leave Requests Distribution</h2>
      <p class="text-xs text-slate-400 mb-5">Breakdown of time off applications by category</p>
      
      ${Object.keys(leaveTypes).length ? `
        <div class="space-y-4">
          ${Object.entries(leaveTypes).map(([type, count]) => `
            <div>
              <div class="flex justify-between text-xs font-bold mb-1.5">
                <span class="text-slate-700">${type}</span>
                <span class="text-emerald-700">${count} requests</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500" style="width:${(count/maxLeave)*100}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : EmptyState('No leave records yet', 'Requests will appear here once submitted by team members.')}
    </div>

    <!-- Live Status Overview -->
    <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-7 lg:col-span-2 card-pop">
      <h2 class="font-display font-extrabold text-base text-ink mb-1">Real-Time Team Presence</h2>
      <p class="text-xs text-slate-400 mb-5">Today's workforce availability snapshot</p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <p class="text-3xl font-display font-black text-emerald-600">${present}</p>
          <p class="text-xs font-bold text-emerald-800 mt-1">Present &amp; Working</p>
        </div>
        <div class="p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <p class="text-3xl font-display font-black text-amber-600">${onBreak}</p>
          <p class="text-xs font-bold text-amber-800 mt-1">On Break</p>
        </div>
        <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
          <p class="text-3xl font-display font-black text-indigo-600">${onLeave}</p>
          <p class="text-xs font-bold text-indigo-800 mt-1">On Approved Leave</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-100 border border-slate-200/80">
          <p class="text-3xl font-display font-black text-slate-600">${absent}</p>
          <p class="text-xs font-bold text-slate-700 mt-1">Not Checked In</p>
        </div>
      </div>
    </div>
  </div>`;
}
