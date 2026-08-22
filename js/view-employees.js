/* ============================= EMPLOYEES (HR) ============================= */
function viewEmployees(){
  const db = getDB();
  const q = (APP.empSearch||'').toLowerCase();
  const list = db.employees.filter(e => e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q));
  return `
  <div class="flex items-center justify-between flex-wrap gap-3 mb-6">
    <div><h1 class="font-display text-2xl font-bold text-ink">Employees</h1><p class="text-sm text-gray-500 mt-1">${db.employees.length} people at ${COMPANY.name}</p></div>
    <button id="add-emp-btn" class="bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg px-4 py-2.5 flex items-center gap-1.5">${icon('plus','w-4 h-4')}Add Employee</button>
  </div>
  <div class="relative mb-6 max-w-sm">
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${icon('search','w-4 h-4')}</span>
    <input id="emp-search" class="${inputCls} pl-9" placeholder="Search by name or department" value="${esc(APP.empSearch||'')}">
  </div>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    ${list.map(e => `
    <div data-emp-card="${e.id}" class="bg-white rounded-2xl shadow-card p-5 cursor-pointer hover:shadow-lg transition relative">
      <div class="absolute top-4 right-4">${statusDot(employeeStatusToday(e.id))}</div>
      <div class="flex items-center gap-3 mb-3">${Avatar(e.name,11)}<div><p class="font-display font-semibold text-ink">${e.name}</p><p class="text-xs text-gray-500">${e.jobPosition}</p></div></div>
      <div class="text-xs text-gray-400 space-y-1">
        <p>${e.department} · ${e.location}</p>
        <p>${e.empCode}</p>
      </div>
      ${e.role==='hr' ? `<span class="absolute bottom-4 right-4 text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">HR</span>` : ''}
    </div>`).join('') || `<div class="col-span-full">${EmptyState('No employees found', 'Try a different search term.')}</div>`}
  </div>`;
}
function addEmployeeModal(){
  const body = `
    <form id="add-emp-form" novalidate>
      <div id="add-emp-error"></div>
      ${field('Full Name', `<input id="ae-name" class="${inputCls}" required>`, 'ae-name')}
      ${field('Email', `<input id="ae-email" type="email" class="${inputCls}" required>`, 'ae-email')}
      <div class="grid grid-cols-2 gap-4">
        ${field('Phone', `<input id="ae-phone" class="${inputCls}">`, 'ae-phone')}
        ${field('Date of Joining', `<input id="ae-doj" type="date" class="${inputCls}" value="${todayStr()}">`, 'ae-doj')}
      </div>
      <div class="grid grid-cols-2 gap-4">
        ${field('Department', `<input id="ae-dept" class="${inputCls}" placeholder="Engineering">`, 'ae-dept')}
        ${field('Job Position', `<input id="ae-job" class="${inputCls}" placeholder="Software Engineer">`, 'ae-job')}
      </div>
      <div class="grid grid-cols-2 gap-4">
        ${field('Monthly Wage (₹)', `<input id="ae-wage" type="number" min="1" class="${inputCls}" value="30000">`, 'ae-wage')}
        ${field('Role', `<select id="ae-role" class="${inputCls}"><option value="employee">Employee</option><option value="hr">HR / Admin</option></select>`, 'ae-role')}
      </div>
      <button class="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg py-2.5 transition">Create Account</button>
      <p class="text-xs text-gray-400 mt-3">A Login ID and temporary password will be generated automatically.</p>
    </form>`;
  openModal(Modal('Add Employee', body));
  $('#add-emp-form').addEventListener('submit', e=>{
    e.preventDefault();
    const res = addEmployee({
      name:$('#ae-name').value, email:$('#ae-email').value, phone:$('#ae-phone').value, dateOfJoining:$('#ae-doj').value,
      department:$('#ae-dept').value, jobPosition:$('#ae-job').value, wage:$('#ae-wage').value, role:$('#ae-role').value,
    });
    if(!res.ok){ $('#add-emp-error').innerHTML = errorBox(res.error); return; }
    const body2 = `<div class="text-center py-4">
      <div class="w-12 h-12 rounded-full bg-success-light text-success flex items-center justify-center mx-auto mb-3">${icon('check','w-6 h-6')}</div>
      <p class="font-display font-semibold text-ink mb-1">Account created</p>
      <p class="text-sm text-gray-500 mb-4">Share these credentials with the new hire — they'll be asked to change the password on first login.</p>
      <div class="bg-paper rounded-xl p-4 text-sm text-left space-y-1.5">
        <p><span class="text-gray-400">Login ID:</span> <span class="font-semibold">${res.empCode}</span></p>
        <p><span class="text-gray-400">Temp Password:</span> <span class="font-semibold">${res.tempPassword}</span></p>
      </div>
    </div>`;
    openModal(Modal('Success', body2));
    render();
  });
}
function bindEmployees(){
  const btn = $('#add-emp-btn'); if(btn) btn.addEventListener('click', addEmployeeModal);
  const search = $('#emp-search'); if(search) search.addEventListener('input', e=>{ APP.empSearch = e.target.value; render(); });
  $$('[data-emp-card]').forEach(card => card.addEventListener('click', ()=>{ APP.viewingEmployeeId = card.getAttribute('data-emp-card'); navigate('#/profile'); }));
}
