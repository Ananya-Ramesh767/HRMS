/* ============================= LEAVE / TIME OFF ============================= */
function leaveTypeOptions(){
  return ['Paid Time Off','Sick Leave','Unpaid Leave'].map(t=>`<option value="${t}">${t}</option>`).join('');
}
function viewLeave(user){
  const isHR = user.role==='hr';
  const leaves = isHR ? getAllLeaves() : getLeavesForEmployee(user.id);
  const db = getDB();
  const balanceCards = !isHR ? `
    <div class="grid sm:grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-2xl shadow-card p-5 flex items-center justify-between">
        <div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Paid Time Off</p><p class="text-2xl font-display font-bold text-ink mt-1">${user.leaveBalance.paid} <span class="text-sm font-medium text-gray-400">days available</span></p></div>
        <div class="w-10 h-10 rounded-xl bg-success-light text-success flex items-center justify-center">${icon('calendar','w-5 h-5')}</div>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5 flex items-center justify-between">
        <div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sick Leave</p><p class="text-2xl font-display font-bold text-ink mt-1">${user.leaveBalance.sick} <span class="text-sm font-medium text-gray-400">days available</span></p></div>
        <div class="w-10 h-10 rounded-xl bg-warning-light text-warning flex items-center justify-center">${icon('calendar','w-5 h-5')}</div>
      </div>
    </div>` : '';

  const applyForm = !isHR ? `
    <div class="bg-white rounded-2xl shadow-card p-5 mb-6">
      <h2 class="font-display font-semibold text-ink mb-4">Apply for time off</h2>
      <form id="leave-form" novalidate>
        <div id="leave-error"></div>
        <div class="grid sm:grid-cols-3 gap-4">
          ${field('Time Off Type', `<select id="lv-type" class="${inputCls}"><option value="">Select type</option>${leaveTypeOptions()}</select>`, 'lv-type')}
          ${field('Start Date', `<input id="lv-start" type="date" class="${inputCls}">`, 'lv-start')}
          ${field('End Date', `<input id="lv-end" type="date" class="${inputCls}">`, 'lv-end')}
        </div>
        ${field('Remarks', `<textarea id="lv-remarks" rows="2" class="${inputCls}" placeholder="Optional note for HR"></textarea>`, 'lv-remarks')}
        <button class="bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg px-5 py-2.5 transition">Submit Request</button>
      </form>
    </div>` : '';

  const tableRows = leaves.map(l => {
    const emp = db.employees.find(e=>e.id===l.employeeId);
    return `<tr class="${isHR?'cursor-pointer hover:bg-paper':''}" ${isHR?`data-leave-id="${l.id}"`:''}>
      ${isHR ? `<td><div class="flex items-center gap-2.5">${Avatar(emp.name,7)}<span class="font-medium">${emp.name}</span></div></td>`:''}
      <td>${l.type}</td>
      <td>${fmtDateLong(l.startDate)} → ${fmtDateLong(l.endDate)}</td>
      <td>${l.days}</td>
      <td>${Badge(l.status)}</td>
      ${isHR ? `<td class="text-primary text-xs font-semibold">${l.status==='Pending'?'Review →':'View →'}</td>` : `<td class="text-xs text-gray-500">${esc(l.hrComment)||'—'}</td>`}
    </tr>`;
  }).join('');

  return `
  <div class="mb-6"><h1 class="font-display text-2xl font-bold text-ink">Time Off</h1><p class="text-sm text-gray-500 mt-1">${isHR?'Review and decide on employee leave requests.':'Apply for leave and track your request history.'}</p></div>
  ${balanceCards}
  ${applyForm}
  <div class="bg-white rounded-2xl shadow-card overflow-hidden">
    <div class="p-5 pb-0"><h2 class="font-display font-semibold text-ink">${isHR?'All requests':'Your requests'}</h2></div>
    <div class="overflow-x-auto p-5">
      ${leaves.length ? `<table class="dl-table w-full min-w-[560px]"><thead><tr>${isHR?'<th>Employee</th>':''}<th>Type</th><th>Dates</th><th>Days</th><th>Status</th><th>${isHR?'':'HR Comment'}</th></tr></thead><tbody>${tableRows}</tbody></table>`
      : EmptyState('No time off requests', isHR?'Nothing has been submitted yet.':'Apply above and your requests will show here.')}
    </div>
  </div>`;
}
function leaveDetailModal(leaveId){
  const db = getDB();
  const l = db.leaves.find(x=>x.id===leaveId);
  const emp = db.employees.find(e=>e.id===l.employeeId);
  const body = `
    <div class="flex items-center gap-3 mb-4">${Avatar(emp.name,10)}<div><p class="font-semibold text-ink">${emp.name}</p><p class="text-xs text-gray-500">${emp.department} · ${emp.jobPosition}</p></div></div>
    <div class="grid grid-cols-2 gap-3 text-sm mb-4">
      <div><p class="text-xs text-gray-400">Type</p><p class="font-medium">${l.type}</p></div>
      <div><p class="text-xs text-gray-400">Days</p><p class="font-medium">${l.days}</p></div>
      <div><p class="text-xs text-gray-400">Start</p><p class="font-medium">${fmtDateLong(l.startDate)}</p></div>
      <div><p class="text-xs text-gray-400">End</p><p class="font-medium">${fmtDateLong(l.endDate)}</p></div>
    </div>
    <div class="mb-4"><p class="text-xs text-gray-400 mb-1">Remarks</p><p class="text-sm text-ink">${esc(l.remarks)||'—'}</p></div>
    ${l.status==='Pending' ? `
      <form id="leave-decision-form">
        ${field('Add comment (optional)', `<textarea id="hr-comment" rows="2" class="${inputCls}"></textarea>`, 'hr-comment')}
        <div class="flex gap-3">
          <button type="button" data-decision="Rejected" class="flex-1 border border-danger text-danger font-semibold text-sm rounded-lg py-2.5 hover:bg-danger-light">Reject</button>
          <button type="button" data-decision="Approved" class="flex-1 bg-success text-white font-semibold text-sm rounded-lg py-2.5 hover:opacity-90">Approve</button>
        </div>
      </form>` : `<div class="text-sm"><p class="text-xs text-gray-400 mb-1">Status</p>${Badge(l.status)}${l.hrComment?`<p class="text-sm text-gray-600 mt-2">"${esc(l.hrComment)}"</p>`:''}</div>`}
  `;
  openModal(Modal('Leave Request', body));
  $$('[data-decision]').forEach(btn => btn.addEventListener('click', () => {
    const decision = btn.getAttribute('data-decision');
    const comment = $('#hr-comment').value;
    const res = decideLeave(l.id, decision, comment);
    if(res.ok){ toast(`Request ${decision.toLowerCase()}`, decision==='Approved'?'success':'danger'); closeModal(); render(); }
  }));
}
function bindLeave(user){
  const form = $('#leave-form');
  if(form) form.addEventListener('submit', e => {
    e.preventDefault();
    const res = applyLeave(user.id, { type:$('#lv-type').value, startDate:$('#lv-start').value, endDate:$('#lv-end').value, remarks:$('#lv-remarks').value });
    if(!res.ok){ $('#leave-error').innerHTML = errorBox(res.error); return; }
    toast('Leave request submitted','success');
    render();
  });
  $$('[data-leave-id]').forEach(row => row.addEventListener('click', () => leaveDetailModal(row.getAttribute('data-leave-id'))));
}
