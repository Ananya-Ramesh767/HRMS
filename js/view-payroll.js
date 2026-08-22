/* ============================= PAYROLL ============================= */
function salaryRows(s){
  const rows = [
    ['Basic Salary (50% of wage)', s.basic, 'Primary base pay component'],
    ['House Rent Allowance (50% of basic)', s.hra, 'Tax-exempt housing benefit'],
    ['Standard Statutory Allowance', s.standardAllowance, 'Fixed monthly allowance'],
    ['Performance Bonus Incentive', s.performanceBonus, 'Monthly incentive pool'],
    ['Leave Travel Allowance (LTA)', s.lta, 'Travel allowance provision'],
    ['Flexible Special Allowance', s.fixedAllowance, 'Residual balancing component'],
  ];
  return rows.map(([l, v, sub]) => `
    <div class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition">
      <div>
        <p class="text-xs font-semibold text-slate-700">${l}</p>
        <p class="text-[10px] text-slate-400">${sub}</p>
      </div>
      <span class="text-xs font-bold text-ink">${fmtMoney(v)}</span>
    </div>`).join('');
}

function viewPayroll(user){
  const isHR = user.role === 'hr';
  const db = getDB();
  const targetId = isHR ? (APP.payrollEmployeeId || db.employees.find(e => e.role==='employee')?.id || user.id) : user.id;
  const target = db.employees.find(e => e.id === targetId) || user;
  const s = computeSalary(target.wage);

  const employeePicker = isHR ? `
    <div class="bg-white rounded-3xl p-4 shadow-card border border-slate-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <label for="payroll-emp-select" class="text-xs font-bold text-slate-500 whitespace-nowrap">Select Employee:</label>
        <select id="payroll-emp-select" class="${inputCls} text-xs font-bold w-auto">
          ${db.employees.map(e => `<option value="${e.id}" ${e.id===targetId?'selected':''}>${e.name} (${e.jobPosition}) · ${fmtMoney(e.wage)}</option>`).join('')}
        </select>
      </div>
      <span class="text-xs text-slate-400">Employee Login ID: <code class="font-mono font-bold text-indigo-700">${target.empCode}</code></span>
    </div>` : '';

  const editForm = isHR ? `
    <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 mb-6 card-pop">
      <h2 class="font-display font-extrabold text-base text-ink mb-1">Update Compensation Structure</h2>
      <p class="text-xs text-slate-400 mb-4">Set monthly base wage for ${esc(target.name)}. Earnings and statutory contributions recalculate dynamically.</p>
      <form id="wage-form" class="flex flex-col sm:flex-row items-end gap-3">
        <div class="flex-1 w-full">
          <label for="wage-input" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Monthly Total Compensation (₹)</label>
          <input id="wage-input" type="number" min="10000" step="1000" class="${inputCls}" value="${target.wage || 45000}">
        </div>
        <button type="submit" class="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl px-6 py-3 shadow-md shadow-indigo-500/25 transition active:scale-95 whitespace-nowrap">
          Save Salary Structure
        </button>
      </form>
    </div>` : '';

  return `
  <div class="mb-6">
    <h1 class="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
      Compensation &amp; Payroll
    </h1>
    <p class="text-xs text-slate-500 mt-1">${isHR ? 'View and update employee salary packages & statutory deductions.' : 'Review your monthly pay breakdown, payslips, and statutory benefits.'}</p>
  </div>

  ${employeePicker}
  ${editForm}

  <div class="grid lg:grid-cols-5 gap-6">
    <!-- Left 3 Cols: Breakdown -->
    <div class="lg:col-span-3 bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-7 card-pop">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 class="font-display font-extrabold text-base text-ink">${isHR ? `${esc(target.name)}'s Salary Package` : 'My Salary Breakdown'}</h2>
          <p class="text-xs text-slate-400">${esc(target.department)} · ${esc(target.jobPosition)}</p>
        </div>
        <span class="text-sm font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
          Wage: ${fmtMoney(s.wage)}/mo
        </span>
      </div>

      <!-- Allowances Breakdown -->
      <div class="space-y-1 mb-5">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Earnings Components</p>
        ${salaryRows(s)}
      </div>

      <!-- Gross Pay -->
      <div class="flex items-center justify-between py-3 border-t border-b border-slate-100 bg-slate-50/60 px-3 rounded-xl mb-4">
        <span class="text-xs font-bold text-slate-800">Gross Earnings</span>
        <span class="text-sm font-extrabold text-ink">${fmtMoney(s.gross)}</span>
      </div>

      <!-- Deductions -->
      <div class="space-y-2 mb-5">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employee Statutory Deductions</p>
        <div class="flex items-center justify-between py-2 text-xs px-2">
          <span class="text-slate-600">Employee Provident Fund (EPF - 12% of Basic)</span>
          <span class="font-bold text-rose-600">− ${fmtMoney(s.pfEmployee)}</span>
        </div>
        <div class="flex items-center justify-between py-2 text-xs px-2">
          <span class="text-slate-600">Professional Tax (PT Karnataka)</span>
          <span class="font-bold text-rose-600">− ${fmtMoney(s.professionalTax)}</span>
        </div>
      </div>

      <!-- Net In-Hand Pay Highlight -->
      <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-200/80 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-emerald-800 uppercase tracking-wider">Net Monthly Take-Home</p>
          <p class="text-[11px] text-slate-500">Credited to ${esc(target.bank?.bankName || 'Direct Deposit Account')}</p>
        </div>
        <span class="font-display font-black text-2xl text-emerald-700">${fmtMoney(s.netSalary)}</span>
      </div>
    </div>

    <!-- Right 2 Cols: Recent Payslips -->
    <div class="lg:col-span-2 bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-7 card-pop flex flex-col justify-between">
      <div>
        <h2 class="font-display font-extrabold text-base text-ink mb-1">Recent Payslips</h2>
        <p class="text-xs text-slate-400 mb-4">Historical monthly disbursement logs</p>

        <div class="space-y-3">
          ${[0, 1, 2].map(i => {
            const d = new Date();
            d.setMonth(d.getMonth() - i - 1);
            const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
            return `
            <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-ink">${label}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">Disbursed on 1st · Direct Deposit</p>
              </div>
              <div class="text-right">
                <span class="text-xs font-extrabold text-emerald-700 block">${fmtMoney(s.netSalary)}</span>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 mt-0.5 hover:underline cursor-pointer">
                  ${icon('download','w-3 h-3')} Payslip PDF
                </span>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="mt-6 p-4 rounded-2xl bg-slate-50 text-xs text-slate-500 border border-slate-100 leading-relaxed">
        <p class="font-bold text-slate-700 mb-1">🏢 Employer Contributions (CTC)</p>
        Employer PF (12% of Basic): <span class="font-bold text-ink">${fmtMoney(s.pfEmployer)}/mo</span>. Fully covered by ${COMPANY.name}.
      </div>
    </div>
  </div>`;
}

function bindPayroll(user){
  const select = $('#payroll-emp-select');
  if(select){
    select.addEventListener('change', e => {
      APP.payrollEmployeeId = e.target.value;
      playChime('click');
      render();
    });
  }

  const form = $('#wage-form');
  if(form){
    form.addEventListener('submit', e => {
      e.preventDefault();
      const targetId = APP.payrollEmployeeId || getDB().employees.find(x => x.role==='employee')?.id || user.id;
      const res = updateWage(targetId, $('#wage-input').value);
      if(!res.ok){
        toast(res.error, 'danger');
        return;
      }
      playChime('success');
      toast('Compensation package updated!', 'success');
      render();
    });
  }
}
