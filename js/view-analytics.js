/* ============================= ANALYTICS (HR) ============================= */
function viewAnalytics(){
  const db = getDB();
  const emps = db.employees;
  const present = emps.filter(e=>employeeStatusToday(e.id)==='present').length;
  const onLeave = emps.filter(e=>employeeStatusToday(e.id)==='leave').length;
  const absent = emps.length - present - onLeave;
  const byDept = {};
  emps.forEach(e => byDept[e.department] = (byDept[e.department]||0)+1);
  const leaveTypes = {};
  db.leaves.forEach(l => leaveTypes[l.type] = (leaveTypes[l.type]||0)+1);
  const totalPayroll = emps.reduce((s,e)=>s+computeSalary(e.wage).netSalary,0);
  const maxDept = Math.max(...Object.values(byDept),1);
  const maxLeave = Math.max(...Object.values(leaveTypes),1);

  return `
  <div class="mb-6"><h1 class="font-display text-2xl font-bold text-ink">Analytics</h1><p class="text-sm text-gray-500 mt-1">Live metrics computed from current workforce data.</p></div>
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${StatCard({ label:'Attendance rate', value: Math.round((present+onLeave? present/emps.length*100:0))+'%', iconName:'clock', accent:'success' })}
    ${StatCard({ label:'Pending requests', value: getPendingLeaves().length, iconName:'briefcase', accent:'warning' })}
    ${StatCard({ label:'Departments', value: Object.keys(byDept).length, iconName:'users', accent:'primary' })}
    ${StatCard({ label:'Monthly payroll (net)', value: fmtMoney(totalPayroll), iconName:'wallet', accent:'primary' })}
  </div>
  <div class="grid lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-2xl shadow-card p-5">
      <h2 class="font-display font-semibold text-ink mb-4">Headcount by department</h2>
      <div class="space-y-3">${Object.entries(byDept).map(([dept,count])=>`
        <div><div class="flex justify-between text-sm mb-1"><span class="text-gray-600">${dept}</span><span class="font-medium">${count}</span></div>
        <div class="bar-track h-2"><div class="bg-primary h-2 rounded-full" style="width:${count/maxDept*100}%"></div></div></div>`).join('')}</div>
    </div>
    <div class="bg-white rounded-2xl shadow-card p-5">
      <h2 class="font-display font-semibold text-ink mb-4">Leave requests by type</h2>
      ${Object.keys(leaveTypes).length ? `<div class="space-y-3">${Object.entries(leaveTypes).map(([type,count])=>`
        <div><div class="flex justify-between text-sm mb-1"><span class="text-gray-600">${type}</span><span class="font-medium">${count}</span></div>
        <div class="bar-track h-2"><div class="bg-success h-2 rounded-full" style="width:${count/maxLeave*100}%"></div></div></div>`).join('')}</div>` : EmptyState('No leave data yet','Requests will appear here once submitted.')}
    </div>
    <div class="bg-white rounded-2xl shadow-card p-5 lg:col-span-2">
      <h2 class="font-display font-semibold text-ink mb-4">Employee status today</h2>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="p-4 rounded-xl bg-success-light"><p class="text-2xl font-display font-bold text-success">${present}</p><p class="text-xs text-success/80 font-medium mt-1">Present</p></div>
        <div class="p-4 rounded-xl bg-primary-light"><p class="text-2xl font-display font-bold text-primary">${onLeave}</p><p class="text-xs text-primary/80 font-medium mt-1">On Leave</p></div>
        <div class="p-4 rounded-xl bg-warning-light"><p class="text-2xl font-display font-bold text-warning">${absent}</p><p class="text-xs text-warning/80 font-medium mt-1">Absent</p></div>
      </div>
    </div>
  </div>`;
}
