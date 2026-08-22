/* ============================= EMPLOYEES (HR) ============================= */
function viewEmployees(){
  const db = getDB();
  const q = (APP.empSearch || '').toLowerCase();
  const deptFilter = APP.deptFilter || 'all';

  const departments = ['all', ...new Set(db.employees.map(e => e.department))];

  const list = db.employees.filter(e => {
    const matchesQuery = e.name.toLowerCase().includes(q) ||
                         e.department.toLowerCase().includes(q) ||
                         e.empCode.toLowerCase().includes(q) ||
                         e.email.toLowerCase().includes(q);
    const matchesDept = deptFilter === 'all' || e.department === deptFilter;
    return matchesQuery && matchesDept;
  });

  return `
  <!-- Header & Actions -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 class="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
        Team Directory · ${COMPANY.name}
      </h1>
      <p class="text-xs text-slate-500 mt-1">Manage ${db.employees.length} employees, roles, profiles, and compensation.</p>
    </div>
    <button id="add-emp-btn" class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl px-5 py-3 shadow-md shadow-indigo-500/25 transition active:scale-95">
      ${icon('plus','w-4 h-4')} Add New Employee
    </button>
  </div>

  <!-- Search & Department Filter Chips -->
  <div class="bg-white rounded-3xl p-4 shadow-card border border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="relative flex-1 max-w-md">
      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${icon('search','w-4 h-4')}</span>
      <input id="emp-search" class="${inputCls} pl-10 text-xs" placeholder="Search by name, department, email, or Login ID..." value="${esc(APP.empSearch||'')}">
    </div>

    <!-- Department Chips -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
      ${departments.map(d => `
        <button type="button" data-dept-chip="${d}" class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${deptFilter === d ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
          ${d === 'all' ? '🏢 All Departments' : d}
        </button>
      `).join('')}
    </div>
  </div>

  <!-- Employee Cards Grid -->
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    ${list.map(e => {
      const completeness = calcProfileCompleteness(e);
      return `
      <div data-emp-card="${e.id}" class="bg-white rounded-3xl shadow-card border border-slate-100 p-5 cursor-pointer hover:shadow-xl hover:border-indigo-200 transition-all duration-200 relative group flex flex-col justify-between card-pop">
        <div>
          <!-- Top Row: Status Dot and Role Tag -->
          <div class="flex items-center justify-between mb-4">
            ${statusDot(employeeStatusToday(e.id))}
            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${e.role==='hr' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-600'}">
              ${e.role === 'hr' ? '👑 HR Admin' : 'Employee'}
            </span>
          </div>

          <!-- Employee Identity -->
          <div class="flex items-center gap-3.5 mb-4">
            ${Avatar(e, 12)}
            <div class="min-w-0">
              <h3 class="font-display font-extrabold text-sm text-ink group-hover:text-indigo-600 transition truncate">${esc(e.name)}</h3>
              <p class="text-xs text-slate-500 font-medium truncate">${esc(e.jobPosition)}</p>
              <p class="text-[11px] font-mono font-bold text-indigo-600 mt-0.5">${esc(e.empCode)}</p>
            </div>
          </div>

          <!-- Info Rows -->
          <div class="bg-slate-50/70 rounded-2xl p-3 space-y-1.5 text-xs text-slate-600 mb-4">
            <div class="flex justify-between">
              <span class="text-slate-400">Department:</span>
              <span class="font-semibold text-slate-700">${esc(e.department)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Location:</span>
              <span class="font-medium text-slate-700">${esc(e.location || 'Bengaluru HQ')}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Monthly Wage:</span>
              <span class="font-bold text-emerald-700">${fmtMoney(e.wage || 45000)}</span>
            </div>
          </div>
        </div>

        <!-- Footer Card Meta & View Link -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Profile:</span>
            <span class="font-bold ${completeness === 100 ? 'text-emerald-600' : 'text-indigo-600'}">${completeness}%</span>
          </div>
          <span class="text-indigo-600 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View &amp; Edit Profile →
          </span>
        </div>
      </div>`;
    }).join('') || `<div class="col-span-full">${EmptyState('No matching employees', 'Try adjusting your search query or department filter.')}</div>`}
  </div>`;
}

function addEmployeeModal(){
  const body = `
    <form id="add-emp-form" novalidate class="space-y-4">
      <div id="add-emp-error"></div>
      
      <div class="grid sm:grid-cols-2 gap-3">
        ${field('Full Name *', `<input id="ae-name" class="${inputCls}" placeholder="e.g. John Doe" required>`, 'ae-name')}
        ${field('Work Email *', `<input id="ae-email" type="email" class="${inputCls}" placeholder="john.doe@odooindia.com" required>`, 'ae-email')}
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        ${field('Mobile Phone *', `<input id="ae-phone" class="${inputCls}" placeholder="9876543210" required>`, 'ae-phone')}
        ${field('Date of Joining', `<input id="ae-doj" type="date" class="${inputCls}" value="${todayStr()}">`, 'ae-doj')}
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        ${field('Department', `
          <select id="ae-dept" class="${inputCls}">
            <option value="Engineering" selected>Engineering</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="Support">Support</option>
            <option value="Human Resources">Human Resources</option>
          </select>`, 'ae-dept')}
        ${field('Job Position', `<input id="ae-job" class="${inputCls}" placeholder="e.g. Software Engineer" value="Software Engineer">`, 'ae-job')}
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        ${field('Monthly Wage (₹)', `<input id="ae-wage" type="number" min="1" class="${inputCls}" value="50000">`, 'ae-wage')}
        ${field('System Role', `
          <select id="ae-role" class="${inputCls}">
            <option value="employee" selected>Employee</option>
            <option value="hr">HR / Administrator</option>
          </select>`, 'ae-role')}
      </div>

      <div class="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-[11px] text-indigo-900 leading-relaxed">
        💡 <strong>Automatic Login ID:</strong> A Login ID in the format <code class="font-bold bg-white px-1.5 py-0.5 rounded text-indigo-700 font-mono">OI[FL]YYYY####</code> and temporary password will be generated automatically.
      </div>

      <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-2xl py-3 shadow-md shadow-indigo-500/25 transition active:scale-98">
        Create Employee Account &amp; Provision Credentials
      </button>
    </form>`;

  openModal(Modal('Add New Employee to Odoo India', body, 'add-emp-modal', 'max-w-2xl'));

  $('#add-emp-form').addEventListener('submit', e => {
    e.preventDefault();
    const res = addEmployee({
      name: $('#ae-name').value,
      email: $('#ae-email').value,
      phone: $('#ae-phone').value,
      dateOfJoining: $('#ae-doj').value,
      department: $('#ae-dept').value,
      jobPosition: $('#ae-job').value,
      wage: $('#ae-wage').value,
      role: $('#ae-role').value,
    });

    if(!res.ok){
      $('#add-emp-error').innerHTML = errorBox(res.error);
      return;
    }

    launchConfetti();
    playChime('success');

    const successBody = `
      <div class="text-center py-4">
        <div class="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
          🎉
        </div>
        <h3 class="font-display font-extrabold text-lg text-ink mb-1">Employee Account Created!</h3>
        <p class="text-xs text-slate-500 mb-5 max-w-sm mx-auto">Share these generated credentials with the employee. They can sign in with either their email or Login ID.</p>
        
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left space-y-2.5 max-w-sm mx-auto font-mono text-xs">
          <div class="flex justify-between items-center">
            <span class="text-slate-500">Employee Name:</span>
            <span class="font-bold text-slate-900 font-sans">${esc(res.employee.name)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">Login ID:</span>
            <span class="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">${res.empCode}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">Email:</span>
            <span class="font-bold text-slate-900">${res.employee.email}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">Temp Password:</span>
            <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">${res.tempPassword}</span>
          </div>
        </div>

        <button id="dismiss-success-modal" class="mt-6 px-6 py-2.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 hover:bg-indigo-700 transition">
          Done &amp; View in Directory
        </button>
      </div>`;

    openModal(Modal('Account Provisioned Successfully', successBody, 'success-emp-modal'));
    $('#dismiss-success-modal').addEventListener('click', () => {
      closeModal();
      render();
    });
  });
}

function bindEmployees(){
  const btn = $('#add-emp-btn');
  if(btn) btn.addEventListener('click', addEmployeeModal);

  const search = $('#emp-search');
  if(search){
    search.addEventListener('input', e => {
      APP.empSearch = e.target.value;
      render();
    });
  }

  // Dept chips
  $$('[data-dept-chip]').forEach(chip => {
    chip.addEventListener('click', () => {
      APP.deptFilter = chip.getAttribute('data-dept-chip');
      playChime('click');
      render();
    });
  });

  $$('[data-emp-card]').forEach(card => {
    card.addEventListener('click', () => {
      APP.viewingEmployeeId = card.getAttribute('data-emp-card');
      playChime('click');
      navigate('#/profile');
    });
  });
}
