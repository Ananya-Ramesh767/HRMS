/* ============================= PAYROLL ============================= */
function salaryRows(s){
  const rows = [
    ['Basic Salary (50% of wage)', s.basic],
    ['House Rent Allowance (50% of basic)', s.hra],
    ['Standard Allowance', s.standardAllowance],
    ['Performance Bonus', s.performanceBonus],
    ['Leave Travel Allowance', s.lta],
    ['Fixed Allowance', s.fixedAllowance],
  ];
  return rows.map(([l,v])=>`<div class="flex items-center justify-between py-2.5 border-b border-gray-50"><span class="text-sm text-gray-600">${l}</span><span class="text-sm font-medium text-ink">${fmtMoney(v)}</span></div>`).join('');
}
function viewPayroll(user){
  const isHR = user.role==='hr';
  const db = getDB();
  const targetId = isHR ? (APP.payrollEmployeeId || db.employees.find(e=>e.role==='employee').id) : user.id;
  const target = db.employees.find(e=>e.id===targetId);
  const s = computeSalary(target.wage);

  const employeePicker = isHR ? `
    <select id="payroll-emp-select" class="${inputCls} w-auto mb-6">
      ${db.employees.map(e=>`<option value="${e.id}" ${e.id===targetId?'selected':''}>${e.name} — ${e.department}</option>`).join('')}
    </select>` : '';

  const editForm = isHR ? `
    <div class="bg-white rounded-2xl shadow-card p-5 mb-6">
      <h2 class="font-display font-semibold text-ink mb-4">Salary structure</h2>
      <form id="wage-form" class="flex flex-col sm:flex-row items-end gap-4">
        <div class="flex-1 w-full">${field('Monthly Wage (₹)', `<input id="wage-input" type="number" min="1" class="${inputCls}" value="${target.wage}">`,'wage-input')}</div>
        <button class="bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg px-5 py-2.5 h-fit transition">Save Changes</button>
      </form>
      <p class="text-xs text-gray-400 mt-3">Components recompute automatically from wage. This is demo data — no real financial processing occurs.</p>
    </div>` : '';

  return `
  <div class="mb-6"><h1 class="font-display text-2xl font-bold text-ink">Payroll</h1><p class="text-sm text-gray-500 mt-1">${isHR?'View and update employee salary structures.':'Your salary structure and recent payslips.'}</p></div>
  ${employeePicker}
  ${editForm}
  <div class="grid lg:grid-cols-5 gap-6">
    <div class="lg:col-span-3 bg-white rounded-2xl shadow-card p-5">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-display font-semibold text-ink">${isHR?target.name+"'s salary":'Salary breakdown'}</h2>
        <span class="text-xs text-gray-400">Wage: ${fmtMoney(s.wage)}/mo</span>
      </div>
      ${salaryRows(s)}
      <div class="flex items-center justify-between py-2.5 border-b border-gray-50"><span class="text-sm text-gray-600">Gross Salary</span><span class="text-sm font-semibold text-ink">${fmtMoney(s.gross)}</span></div>
      <div class="flex items-center justify-between py-2.5 border-b border-gray-50"><span class="text-sm text-gray-600">Provident Fund (12% of basic)</span><span class="text-sm font-medium text-danger">− ${fmtMoney(s.pfEmployee)}</span></div>
      <div class="flex items-center justify-between py-2.5 border-b border-gray-50"><span class="text-sm text-gray-600">Professional Tax</span><span class="text-sm font-medium text-danger">− ${fmtMoney(s.professionalTax)}</span></div>
      <div class="flex items-center justify-between pt-3"><span class="font-display font-semibold text-ink">Net Salary</span><span class="font-display font-bold text-lg text-primary">${fmtMoney(s.netSalary)}</span></div>
    </div>
    <div class="lg:col-span-2 bg-white rounded-2xl shadow-card p-5">
      <h2 class="font-display font-semibold text-ink mb-3">Recent payroll records</h2>
      <div class="space-y-2.5">
        ${[0,1,2].map(i=>{ const d=new Date(); d.setMonth(d.getMonth()-i-1); const label=d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
          return `<div class="flex items-center justify-between p-3 rounded-xl bg-paper">
            <div><p class="text-sm font-medium text-ink">${label}</p><p class="text-xs text-gray-400">Paid on ${new Date(d.getFullYear(),d.getMonth()+1,1).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</p></div>
            <span class="text-sm font-semibold text-ink">${fmtMoney(s.netSalary)}</span>
          </div>`; }).join('')}
      </div>
      <p class="text-xs text-gray-400 mt-3">Employer PF contribution: ${fmtMoney(s.pfEmployer)}/mo (company cost, not deducted).</p>
    </div>
  </div>`;
}
function bindPayroll(user){
  const select = $('#payroll-emp-select');
  if(select) select.addEventListener('change', e=>{ APP.payrollEmployeeId = e.target.value; render(); });
  const form = $('#wage-form');
  if(form) form.addEventListener('submit', e=>{
    e.preventDefault();
    const targetId = APP.payrollEmployeeId || getDB().employees.find(x=>x.role==='employee').id;
    const res = updateWage(targetId, $('#wage-input').value);
    if(!res.ok){ toast(res.error,'danger'); return; }
    toast('Salary structure updated','success');
    render();
  });
}
