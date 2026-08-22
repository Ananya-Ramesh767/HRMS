/* ============================= LEAVE / TIME OFF ============================= */
function leaveTypeOptions(){
  return ['Paid Time Off','Sick Leave','Unpaid Leave'].map(t => `<option value="${t}">${t}</option>`).join('');
}

function viewLeave(user){
  const isHR = user.role === 'hr';
  const leaves = isHR ? getAllLeaves() : getLeavesForEmployee(user.id);
  const db = getDB();

  const balanceCards = !isHR ? `
    <div class="grid sm:grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-5 flex items-center justify-between card-pop">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid Time Off (PTO)</p>
          <p class="text-2xl font-display font-extrabold text-ink mt-1">
            ${user.leaveBalance.paid} <span class="text-xs font-semibold text-slate-400">days available</span>
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xl shadow-inner">
          🌴
        </div>
      </div>
      <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-5 flex items-center justify-between card-pop">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Sick / Medical Leave</p>
          <p class="text-2xl font-display font-extrabold text-ink mt-1">
            ${user.leaveBalance.sick} <span class="text-xs font-semibold text-slate-400">days available</span>
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-xl shadow-inner">
          🩺
        </div>
      </div>
    </div>` : '';

  const applyForm = !isHR ? `
    <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 mb-6 card-pop">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
          <span>📝</span> Apply for Time Off
        </h2>
        <span class="text-xs text-slate-400">Auto-routes to HR for approval</span>
      </div>

      <form id="leave-form" novalidate class="space-y-4">
        <div id="leave-error"></div>
        <div class="grid sm:grid-cols-3 gap-3">
          ${field('Time Off Type *', `<select id="lv-type" class="${inputCls}" required><option value="">Select leave type</option>${leaveTypeOptions()}</select>`, 'lv-type')}
          ${field('Start Date *', `<input id="lv-start" type="date" class="${inputCls}" min="${todayStr()}" required>`, 'lv-start')}
          ${field('End Date *', `<input id="lv-end" type="date" class="${inputCls}" min="${todayStr()}" required>`, 'lv-end')}
        </div>
        ${field('Reason / Remarks', `<textarea id="lv-remarks" rows="2" class="${inputCls}" placeholder="Brief context for your manager & HR..."></textarea>`, 'lv-remarks')}
        ${field('Attachment Proof (Optional for medical / certificate)', `<input id="lv-file" type="file" accept="image/*,.pdf" class="${inputCls}">`, 'lv-file')}
        
        <button type="submit" class="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl px-6 py-3 shadow-md shadow-indigo-500/25 transition active:scale-95">
          Submit Leave Request →
        </button>
      </form>
    </div>` : '';

  const tableRows = leaves.map(l => {
    const emp = db.employees.find(e => e.id === l.employeeId);
    return `
    <tr class="${isHR ? 'cursor-pointer hover:bg-slate-50/80 transition' : ''}" ${isHR ? `data-leave-id="${l.id}"` : ''}>
      ${isHR ? `
        <td class="p-4">
          <div class="flex items-center gap-2.5">
            ${Avatar(emp, 8)}
            <div>
              <p class="font-bold text-ink">${esc(emp?.name || 'Employee')}</p>
              <p class="text-[11px] text-slate-400 font-mono">${esc(emp?.empCode)}</p>
            </div>
          </div>
        </td>` : ''}
      <td class="p-4 font-semibold text-slate-800">${esc(l.type)}</td>
      <td class="p-4 font-medium text-slate-600">${fmtDateLong(l.startDate)} → ${fmtDateLong(l.endDate)}</td>
      <td class="p-4 font-bold text-indigo-700">${l.days} day(s)</td>
      <td class="p-4">${Badge(l.status)}</td>
      <td class="p-4">
        ${l.attachment ? `
          <a href="${l.attachment.dataUrl}" download="${esc(l.attachment.name)}" class="inline-flex items-center gap-1 text-indigo-600 text-xs font-bold hover:underline" title="Download proof">
            ${icon('paperclip','w-3.5 h-3.5')} Attached
          </a>` : '<span class="text-slate-300 text-xs">—</span>'}
      </td>
      ${isHR ? `
        <td class="p-4 text-right">
          <span class="text-xs font-extrabold text-indigo-600">
            ${l.status === 'Pending' ? 'Review Request →' : 'View Details →'}
          </span>
        </td>` : `
        <td class="p-4 text-xs text-slate-600 italic">
          ${esc(l.hrComment) || '—'}
        </td>`}
    </tr>`;
  }).join('');

  return `
  <div class="mb-6">
    <h1 class="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
      Time Off &amp; Leaves
    </h1>
    <p class="text-xs text-slate-500 mt-1">${isHR ? 'Review, approve, or reject employee leave requests.' : 'Apply for paid time off and track request statuses.'}</p>
  </div>

  ${balanceCards}
  ${applyForm}

  <div class="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden card-pop">
    <div class="p-5 border-b border-slate-100 flex items-center justify-between">
      <h2 class="font-display font-extrabold text-base text-ink">${isHR ? 'All Employee Leave Applications' : 'My Leave Request History'}</h2>
      <span class="text-xs text-slate-400 font-mono">${leaves.length} records</span>
    </div>
    <div class="overflow-x-auto">
      ${leaves.length ? `
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
              ${isHR ? '<th class="p-4">Employee</th>' : ''}
              <th class="p-4">Type</th>
              <th class="p-4">Dates</th>
              <th class="p-4">Duration</th>
              <th class="p-4">Status</th>
              <th class="p-4">Proof</th>
              <th class="p-4 text-right">${isHR ? 'Action' : 'HR Note'}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            ${tableRows}
          </tbody>
        </table>
      ` : EmptyState('No leave requests found', isHR ? 'No employee has submitted a time-off request yet.' : 'Apply above and your requests will appear here.')}
    </div>
  </div>`;
}

function leaveDetailModal(leaveId){
  const db = getDB();
  const l = db.leaves.find(x => x.id === leaveId);
  if(!l) return;
  const emp = db.employees.find(e => e.id === l.employeeId);

  const body = `
    <div class="flex items-center gap-3.5 mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
      ${Avatar(emp, 11)}
      <div>
        <p class="font-bold text-sm text-ink">${esc(emp?.name || 'Employee')}</p>
        <p class="text-xs text-slate-500">${esc(emp?.jobPosition)} · <span class="font-mono text-indigo-600">${esc(emp?.empCode)}</span></p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 text-xs mb-4">
      <div class="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
        <p class="text-slate-400 uppercase font-bold text-[10px]">Leave Type</p>
        <p class="font-bold text-ink text-sm mt-0.5">${esc(l.type)}</p>
      </div>
      <div class="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
        <p class="text-slate-400 uppercase font-bold text-[10px]">Duration</p>
        <p class="font-bold text-indigo-700 text-sm mt-0.5">${l.days} Working Day(s)</p>
      </div>
      <div class="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
        <p class="text-slate-400 uppercase font-bold text-[10px]">From Date</p>
        <p class="font-semibold text-slate-800 mt-0.5">${fmtDateLong(l.startDate)}</p>
      </div>
      <div class="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
        <p class="text-slate-400 uppercase font-bold text-[10px]">To Date</p>
        <p class="font-semibold text-slate-800 mt-0.5">${fmtDateLong(l.endDate)}</p>
      </div>
    </div>

    <div class="mb-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employee Remarks</p>
      <p class="text-xs text-slate-700 leading-relaxed">${esc(l.remarks) || '<span class="text-slate-400 italic">No remarks provided.</span>'}</p>
    </div>

    ${l.attachment ? `
      <div class="mb-4 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs font-bold text-indigo-900">
          <span>📎</span>
          <span>${esc(l.attachment.name)}</span>
        </div>
        <a href="${l.attachment.dataUrl}" download="${esc(l.attachment.name)}" class="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition">
          Download
        </a>
      </div>` : ''}

    ${l.status === 'Pending' ? `
      <form id="leave-decision-form" class="space-y-4">
        ${field('HR Comment / Decision Note (Optional)', `<textarea id="hr-comment" rows="2" class="${inputCls}" placeholder="Optional feedback for the employee..."></textarea>`, 'hr-comment')}
        <div class="grid grid-cols-2 gap-3 pt-1">
          <button type="button" data-decision="Rejected" class="border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs rounded-2xl py-3 transition active:scale-95">
            ✕ Reject Request
          </button>
          <button type="button" data-decision="Approved" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-2xl py-3 shadow-md shadow-emerald-500/25 transition active:scale-95">
            ✓ Approve Request
          </button>
        </div>
      </form>
    ` : `
      <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-slate-500 font-bold">Decision Status:</span>
          ${Badge(l.status)}
        </div>
        ${l.hrComment ? `<p class="text-slate-600 mt-2"><strong>HR Note:</strong> "${esc(l.hrComment)}"</p>` : ''}
      </div>`}
  `;

  openModal(Modal('Review Time Off Request', body, 'leave-modal'));

  $$('[data-decision]').forEach(btn => {
    btn.addEventListener('click', () => {
      const decision = btn.getAttribute('data-decision');
      const comment = $('#hr-comment')?.value || '';
      const res = decideLeave(l.id, decision, comment);
      if(res.ok){
        if(decision === 'Approved') launchConfetti();
        playChime(decision === 'Approved' ? 'success' : 'click');
        toast(`Leave request ${decision.toLowerCase()}!`, decision === 'Approved' ? 'success' : 'warning');
        closeModal();
        render();
      }
    });
  });
}

function bindLeave(user){
  const form = $('#leave-form');
  if(form){
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fileInput = $('#lv-file');
      let attachment = null;
      if(fileInput && fileInput.files && fileInput.files[0]){
        try {
          attachment = await readFileAsDataURL(fileInput.files[0]);
        } catch(err){
          $('#leave-error').innerHTML = errorBox('Could not read the uploaded proof file.');
          return;
        }
      }

      const res = applyLeave(user.id, {
        type: $('#lv-type').value,
        startDate: $('#lv-start').value,
        endDate: $('#lv-end').value,
        remarks: $('#lv-remarks').value,
        attachment
      });

      if(!res.ok){
        $('#leave-error').innerHTML = errorBox(res.error);
        return;
      }

      launchConfetti();
      playChime('success');
      toast('Time off request submitted to HR!', 'success');
      render();
    });
  }

  $$('[data-leave-id]').forEach(row => {
    row.addEventListener('click', () => leaveDetailModal(row.getAttribute('data-leave-id')));
  });
}
