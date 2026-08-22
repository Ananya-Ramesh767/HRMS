/* ============================= PROFILE ============================= */
function viewProfile(user){
  const targetId = APP.viewingEmployeeId || user.id;
  const db = getDB();
  const target = db.employees.find(e=>e.id===targetId) || user;
  const readOnly = target.id !== user.id; // viewing someone else = view-only
  const back = APP.viewingEmployeeId ? `<a href="#/employees" class="text-xs font-semibold text-primary flex items-center gap-1 mb-4">← Back to Employees</a>` : '';

  return `
  ${back}
  <div class="bg-white rounded-2xl shadow-card p-6 mb-6">
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div class="flex items-center gap-4">
        ${Avatar(target.name, 14)}
        <div>
          <h1 class="font-display text-xl font-bold text-ink">${target.name}</h1>
          <p class="text-sm text-gray-500">${target.jobPosition} · ${target.department}</p>
          <p class="text-xs text-gray-400 mt-0.5">Emp Code: ${target.empCode}</p>
        </div>
      </div>
      ${statusDot(employeeStatusToday(target.id))}
    </div>
  </div>
  <div class="grid lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <div class="bg-white rounded-2xl shadow-card p-5">
        <h2 class="font-display font-semibold text-ink mb-4">Work information</h2>
        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          ${infoRow('Email', target.email)} ${infoRow('Mobile', target.phone)}
          ${infoRow('Department', target.department)} ${infoRow('Manager', target.manager)}
          ${infoRow('Company', target.company)} ${infoRow('Location', target.location)}
          ${infoRow('Date of Joining', target.dateOfJoining ? fmtDateLong(target.dateOfJoining) : '—')} ${infoRow('Login ID', target.empCode)}
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5">
        <h2 class="font-display font-semibold text-ink mb-4">About</h2>
        <p class="text-sm text-gray-600 leading-relaxed mb-3">${esc(target.about)||'—'}</p>
        <p class="text-xs font-semibold text-gray-500 uppercase mb-1">What I love about my job</p>
        <p class="text-sm text-gray-600 leading-relaxed mb-3">${esc(target.loves)||'—'}</p>
        <p class="text-xs font-semibold text-gray-500 uppercase mb-1">Interests &amp; hobbies</p>
        <p class="text-sm text-gray-600 leading-relaxed">${esc(target.hobbies)||'—'}</p>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-display font-semibold text-ink">Skills</h2>
          ${!readOnly ? `<button id="add-skill-btn" class="text-xs font-semibold text-primary flex items-center gap-1">${icon('plus','w-3.5 h-3.5')} Add Skill</button>`:''}
        </div>
        <div class="flex flex-wrap gap-2">${(target.skills||[]).length ? target.skills.map(s=>`<span class="px-3 py-1.5 rounded-full bg-primary-light text-primary text-xs font-medium">${esc(s)}</span>`).join('') : `<span class="text-sm text-gray-400">No skills added yet.</span>`}</div>
      </div>
    </div>
    <div class="space-y-6">
      <div class="bg-white rounded-2xl shadow-card p-5">
        <h2 class="font-display font-semibold text-ink mb-4">Private information</h2>
        <div class="space-y-3 text-sm">
          ${infoRow('Date of Birth', target.dob?fmtDateLong(target.dob):'—')}
          ${infoRow('Gender', target.gender||'—')}
          ${infoRow('Marital Status', target.maritalStatus||'—')}
          ${infoRow('Nationality', target.nationality||'—')}
          ${infoRow('Residing Address', target.residingAddress||'—')}
          ${infoRow('Personal Email', target.personalEmail||'—')}
          ${infoRow('PAN No', target.panNo||'—')}
          ${infoRow('UAN No', target.uanNo||'—')}
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-card p-5">
        <h2 class="font-display font-semibold text-ink mb-4">Bank details</h2>
        <div class="space-y-3 text-sm">
          ${infoRow('Bank Name', target.bank?.bankName||'—')}
          ${infoRow('Account Number', target.bank?.accountNumber ? '••••'+String(target.bank.accountNumber).slice(-4) : '—')}
          ${infoRow('IFSC Code', target.bank?.ifsc||'—')}
        </div>
      </div>
    </div>
  </div>`;
}
function infoRow(label, value){
  return `<div><p class="text-xs text-gray-400">${label}</p><p class="font-medium text-ink mt-0.5">${esc(value)||'—'}</p></div>`;
}
function bindProfile(user){
  const addSkill = $('#add-skill-btn');
  if(addSkill) addSkill.addEventListener('click', ()=>{
    const skill = prompt('Add a skill');
    if(skill && skill.trim()){
      const db = getDB(); const emp = db.employees.find(e=>e.id===user.id);
      emp.skills = emp.skills || []; emp.skills.push(skill.trim()); commit(); render();
    }
  });
}
