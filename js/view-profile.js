/* ============================= PROFILE VIEW ============================= */
function viewProfile(user){
  const targetId = APP.viewingEmployeeId || user.id;
  const db = getDB();
  const target = db.employees.find(e => e.id === targetId) || user;
  const isOwner = target.id === user.id;
  const isHR = user.role === 'hr';
  const canEdit = isOwner || isHR; // Work Info & profile photo — HR manages job/role details
  const canEditSensitive = isOwner; // About, Skills, Certifications, Private Info, Bank Details — owner-only.
  // HR can view every employee's record for directory/reporting purposes, but per policy
  // cannot modify an employee's personal narrative, skills, or sensitive financial/private data.
  const completeness = calcProfileCompleteness(target);
  const certs = target.certifications || [];

  const back = APP.viewingEmployeeId ? `
    <div class="mb-5">
      <a href="#/employees" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 shadow-xs transition">
        ← Back to Employee Directory
      </a>
    </div>` : '';

  return `
  ${back}

  <!-- Hero Profile Card -->
  <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-8 mb-6 relative overflow-hidden">
    <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div class="relative group shrink-0">
          ${Avatar(target, 16)}
          ${canEdit ? `
            <button id="change-photo-btn" title="Upload new photo" class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition ring-2 ring-white">
              ${icon('camera','w-4 h-4')}
            </button>
            <input id="photo-input" type="file" accept="image/*" class="hidden">
          ` : ''}
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2.5 mb-1">
            <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">${esc(target.name)}</h1>
            <span class="inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${target.role==='hr'?'bg-purple-100 text-purple-700 border border-purple-200':'bg-indigo-100 text-indigo-700 border border-indigo-200'}">
              ${target.role==='hr'?'HR Manager':'Employee'}
            </span>
            ${target.vibe ? `<span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">${target.vibe}</span>` : ''}
          </div>
          <p class="text-sm font-medium text-slate-600">${esc(target.jobPosition)} · <span class="text-indigo-600 font-semibold">${esc(target.department)}</span></p>
          <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
            <span class="flex items-center gap-1 font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">ID: ${esc(target.empCode)}</span>
            <span>📍 ${esc(target.location||'Bengaluru HQ')}</span>
            <span>🏢 ${esc(target.company||'Odoo India')}</span>
          </div>
        </div>
      </div>

      <!-- Profile Actions & Completeness -->
      <div class="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
        ${statusDot(employeeStatusToday(target.id))}
        <div class="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 w-full sm:w-64 md:w-56">
          <div class="flex justify-between text-xs font-bold mb-1.5">
            <span class="text-slate-600">Profile Health</span>
            <span class="${completeness === 100 ? 'text-emerald-600 font-extrabold' : 'text-indigo-600'}">${completeness}%</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div class="h-2 rounded-full ${completeness === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}" style="width:${completeness}%"></div>
          </div>
          <p class="text-[10px] text-slate-400 mt-1.5">${completeness === 100 ? '✨ Complete profile!' : 'Fill in all sections to reach 100%'}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Profile Grid -->
  <div class="grid lg:grid-cols-3 gap-6">
    <!-- Left 2 Cols: Work Info, About, Skills, Certs -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Work Information -->
      <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Work Information
          </h2>
          ${canEdit ? `
            <button id="edit-work-btn" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-bold transition">
              ${icon('edit','w-3.5 h-3.5')} Edit
            </button>
          ` : ''}
        </div>
        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          ${profileField('Work Email', target.email)}
          ${profileField('Mobile Phone', target.phone)}
          ${profileField('Department', target.department)}
          ${profileField('Job Position', target.jobPosition)}
          ${profileField('Reporting Manager', target.manager)}
          ${profileField('Company', target.company)}
          ${profileField('Location', target.location)}
          ${profileField('Date of Joining', fmtDateLong(target.dateOfJoining))}
          ${profileField('System Login ID', target.empCode, true)}
        </div>
      </div>

      <!-- About, Loves, Hobbies -->
      <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-600"></span> About &amp; Personal Story
          </h2>
          ${canEditSensitive ? `
            <button id="edit-about-btn" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-600 text-xs font-bold transition">
              ${icon('edit','w-3.5 h-3.5')} Edit
            </button>
          ` : ''}
        </div>

        <div class="space-y-4">
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About Me</p>
            <p class="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">${esc(target.about) || '<span class="text-slate-400 italic">No biography added yet. Click edit to introduce yourself!</span>'}</p>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div class="bg-rose-50/50 border border-rose-100/80 rounded-2xl p-4">
              <p class="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <span>❤️</span> What I Love About My Job
              </p>
              <p class="text-xs text-slate-700 leading-relaxed font-medium">${esc(target.loves) || '<span class="text-slate-400 italic">Tell the team what gets you excited at work!</span>'}</p>
            </div>

            <div class="bg-amber-50/50 border border-amber-100/80 rounded-2xl p-4">
              <p class="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <span>🎨</span> Interests &amp; Hobbies
              </p>
              <p class="text-xs text-slate-700 leading-relaxed font-medium">${esc(target.hobbies) || '<span class="text-slate-400 italic">Share your favorite hobbies & passions!</span>'}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Skills &amp; Superpowers
          </h2>
          ${canEditSensitive ? `
            <button id="add-skill-btn" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition">
              ${icon('plus','w-3.5 h-3.5')} Add Skill
            </button>
          ` : ''}
        </div>
        <div class="flex flex-wrap gap-2">
          ${(target.skills && target.skills.length) ? target.skills.map(s => `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100/80 text-xs font-bold shadow-2xs">
              <span>⚡</span> ${esc(s)}
              ${canEditSensitive ? `<button data-remove-skill="${esc(s)}" class="w-4 h-4 rounded-full hover:bg-indigo-200/80 text-indigo-400 hover:text-indigo-800 flex items-center justify-center transition" title="Remove skill">×</button>` : ''}
            </span>
          `).join('') : `<p class="text-xs text-slate-400 italic">No skills added yet.</p>`}
        </div>
      </div>

      <!-- Certifications -->
      <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Professional Certifications
          </h2>
          ${canEditSensitive ? `
            <button id="add-cert-btn" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition">
              ${icon('plus','w-3.5 h-3.5')} Add Certification
            </button>
          ` : ''}
        </div>

        ${certs.length ? `
          <div class="space-y-3">
            ${certs.map(c => `
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    ${icon('award','w-5 h-5')}
                  </div>
                  <div>
                    <p class="font-bold text-sm text-ink">${esc(c.name)}</p>
                    <p class="text-xs text-slate-500 font-medium">${esc(c.issuer)} · <span class="text-slate-400">${c.issueDate ? fmtDateLong(c.issueDate) : 'No date'}</span></p>
                    ${c.credentialId ? `<p class="text-[11px] font-mono text-indigo-600 mt-0.5">ID: ${esc(c.credentialId)}</p>` : ''}
                  </div>
                </div>
                <div class="flex items-center gap-2 self-end sm:self-center">
                  ${Badge(c.status || 'Active')}
                  ${c.attachment ? `
                    <a href="${c.attachment.dataUrl}" download="${esc(c.attachment.name)}" class="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition" title="Download certificate proof">
                      ${icon('download','w-4 h-4')}
                    </a>
                  ` : ''}
                  ${canEditSensitive ? `
                    <button data-edit-cert="${c.id}" class="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition" title="Edit">
                      ${icon('edit','w-4 h-4')}
                    </button>
                    <button data-delete-cert="${c.id}" class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition" title="Delete">
                      ${icon('trash','w-4 h-4')}
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : EmptyState(
            'No certifications yet',
            canEditSensitive ? 'Showcase your professional achievements by adding your first certification.' : 'No certificates recorded.',
            canEditSensitive ? `<button id="add-cert-empty-btn" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-sm transition">${icon('plus','w-3.5 h-3.5')} Add Certification</button>` : ''
          )}
      </div>
    </div>

    <!-- Right Col: Private Info & Bank Details -->
    <div class="space-y-6">
      <!-- Private Information -->
      <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Private Information
          </h2>
          ${canEditSensitive ? `
            <button id="edit-private-btn" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition">
              ${icon('edit','w-3.5 h-3.5')} Edit
            </button>
          ` : ''}
        </div>
        <div class="space-y-3 text-sm">
          ${profileField('Date of Birth', target.dob ? fmtDateLong(target.dob) : null)}
          ${profileField('Gender', target.gender)}
          ${profileField('Marital Status', target.maritalStatus)}
          ${profileField('Nationality', target.nationality)}
          ${profileField('Personal Email', target.personalEmail)}
          ${profileField('Residing Address', target.residingAddress)}
          ${profileField('PAN Number', target.panNo, true)}
          ${profileField('UAN Number', target.uanNo, true)}
        </div>
      </div>

      <!-- Bank Details -->
      <div class="bg-white rounded-3xl shadow-card border border-slate-100 p-6 card-pop">
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 class="font-display font-extrabold text-base text-ink flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Bank Details (Direct Deposit)
          </h2>
          ${canEditSensitive ? `
            <button id="edit-bank-btn" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 text-xs font-bold transition">
              ${icon('edit','w-3.5 h-3.5')} Edit
            </button>
          ` : ''}
        </div>
        <div class="space-y-3 text-sm">
          ${profileField('Bank Name', target.bank?.bankName)}
          ${profileField('Account Number', target.bank?.accountNumber ? '••••••••' + String(target.bank.accountNumber).slice(-4) : null)}
          ${profileField('IFSC Code', target.bank?.ifsc, true)}
        </div>
        <p class="text-[11px] text-slate-400 mt-4 leading-relaxed">
          🔒 Bank details are encrypted for payroll processing.
        </p>
      </div>

      <!-- Daily Vibe Selector -->
      ${isOwner ? `
      <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100/80 p-6 card-pop">
        <h3 class="font-display font-extrabold text-sm text-ink mb-2">How is your vibe today?</h3>
        <p class="text-xs text-slate-500 mb-3">Set your daily mood status for your team.</p>
        <div class="grid grid-cols-2 gap-2">
          ${['🚀 Energized', '🎯 Focused', '✨ Inspired', '☕ Need Coffee', '🔥 On Fire', '🧘 In the Zone'].map(v => `
            <button type="button" data-vibe="${v}" class="p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${target.vibe === v ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-indigo-100/50 border border-indigo-100'}">
              <span>${v.split(' ')[0]}</span>
              <span class="truncate">${v.split(' ').slice(1).join(' ')}</span>
            </button>
          `).join('')}
        </div>
      </div>` : ''}
    </div>
  </div>`;
}

function profileField(label, val, mono=false){
  const hasVal = Boolean(val && String(val).trim() !== '' && String(val) !== '—');
  return `
  <div class="py-1">
    <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${label}</p>
    <p class="font-medium text-ink mt-0.5 text-sm ${mono ? 'font-mono text-indigo-700 font-bold' : ''}">
      ${hasVal ? esc(val) : '<span class="text-amber-600/90 text-xs font-semibold bg-amber-50 px-2 py-0.5 rounded-md inline-block">Not provided</span>'}
    </p>
  </div>`;
}

/* ---- Modals for Profile Sections ---- */

function editWorkInfoModal(emp){
  const body = `
    <form id="work-info-form" novalidate class="space-y-4">
      <div id="work-info-error"></div>
      ${field('Full Name', `<input id="w-name" class="${inputCls}" value="${esc(emp.name)}" required>`, 'w-name')}
      <div class="grid sm:grid-cols-2 gap-3">
        ${field('Mobile Phone', `<input id="w-phone" class="${inputCls}" value="${esc(emp.phone||'')}" required>`, 'w-phone')}
        ${field('Department', `<input id="w-dept" class="${inputCls}" value="${esc(emp.department||'Engineering')}">`, 'w-dept')}
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        ${field('Job Position', `<input id="w-job" class="${inputCls}" value="${esc(emp.jobPosition||'')}">`, 'w-job')}
        ${field('Location', `<input id="w-loc" class="${inputCls}" value="${esc(emp.location||'Bengaluru HQ')}">`, 'w-loc')}
      </div>
      ${field('Reporting Manager', `<input id="w-mgr" class="${inputCls}" value="${esc(emp.manager||'Ananya Sharma')}">`, 'w-mgr')}
      <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl py-3 shadow-md shadow-indigo-500/25 transition">
        Save Work Information
      </button>
    </form>`;
  openModal(Modal('Edit Work Information', body, 'work-modal'));

  $('#work-info-form').addEventListener('submit', e => {
    e.preventDefault();
    const res = updateWorkInfo(emp.id, {
      name: $('#w-name').value,
      phone: $('#w-phone').value,
      department: $('#w-dept').value,
      jobPosition: $('#w-job').value,
      location: $('#w-loc').value,
      manager: $('#w-mgr').value,
    });
    if(!res.ok){
      $('#work-info-error').innerHTML = errorBox(res.error);
      return;
    }
    toast('Work information updated!', 'success');
    playChime('success');
    closeModal();
    render();
  });
}

function editAboutModal(emp){
  const body = `
    <form id="about-info-form" novalidate class="space-y-4">
      <div id="about-info-error"></div>
      ${field('About Me (Bio)', `<textarea id="a-about" rows="3" class="${inputCls}" placeholder="Tell the team about your journey and role...">${esc(emp.about||'')}</textarea>`, 'a-about')}
      ${field('What I Love About My Job', `<textarea id="a-loves" rows="2" class="${inputCls}" placeholder="What excites you most at Odoo India?">${esc(emp.loves||'')}</textarea>`, 'a-loves')}
      ${field('Interests & Hobbies', `<textarea id="a-hobbies" rows="2" class="${inputCls}" placeholder="Your weekend passions, favorite sports, books, etc.">${esc(emp.hobbies||'')}</textarea>`, 'a-hobbies')}
      <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl py-3 shadow-md shadow-purple-500/25 transition">
        Save About &amp; Interests
      </button>
    </form>`;
  openModal(Modal('Edit About & Personal Story', body, 'about-modal'));

  $('#about-info-form').addEventListener('submit', e => {
    e.preventDefault();
    const res = updateAboutAndInterests(emp.id, {
      about: $('#a-about').value.trim(),
      loves: $('#a-loves').value.trim(),
      hobbies: $('#a-hobbies').value.trim(),
    });
    if(!res.ok){
      $('#about-info-error').innerHTML = errorBox(res.error);
      return;
    }
    toast('About & Interests updated!', 'success');
    playChime('success');
    closeModal();
    render();
  });
}

function editPrivateInfoModal(emp){
  const body = `
    <form id="private-info-form" novalidate class="space-y-4">
      <div id="private-info-error"></div>
      <div class="grid sm:grid-cols-2 gap-3">
        ${field('Date of Birth', `<input id="p-dob" type="date" class="${inputCls}" value="${emp.dob||''}">`, 'p-dob')}
        ${field('Gender', `
          <select id="p-gender" class="${inputCls}">
            ${['Male','Female','Non-binary','Prefer not to say'].map(g => `<option value="${g}" ${emp.gender===g?'selected':''}>${g}</option>`).join('')}
          </select>`, 'p-gender')}
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        ${field('Marital Status', `
          <select id="p-marital" class="${inputCls}">
            ${['Single','Married','Divorced','Widowed'].map(m => `<option value="${m}" ${emp.maritalStatus===m?'selected':''}>${m}</option>`).join('')}
          </select>`, 'p-marital')}
        ${field('Nationality', `<input id="p-nation" class="${inputCls}" value="${esc(emp.nationality||'Indian')}">`, 'p-nation')}
      </div>
      ${field('Personal Email', `<input id="p-pemail" type="email" class="${inputCls}" value="${esc(emp.personalEmail||'')}">`, 'p-pemail')}
      ${field('Residing Address', `<textarea id="p-address" rows="2" class="${inputCls}">${esc(emp.residingAddress||'')}</textarea>`, 'p-address')}
      <div class="grid sm:grid-cols-2 gap-3">
        ${field('PAN Number', `<input id="p-pan" class="${inputCls}" value="${esc(emp.panNo||'')}" placeholder="ABCDE1234F">`, 'p-pan')}
        ${field('UAN Number', `<input id="p-uan" class="${inputCls}" value="${esc(emp.uanNo||'')}" placeholder="100200300400">`, 'p-uan')}
      </div>
      <button type="submit" class="w-full bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl py-3 shadow-md shadow-rose-500/25 transition">
        Save Private Information
      </button>
    </form>`;
  openModal(Modal('Edit Private Information', body, 'private-modal'));

  $('#private-info-form').addEventListener('submit', e => {
    e.preventDefault();
    const res = updatePrivateInfo(emp.id, {
      dob: $('#p-dob').value,
      gender: $('#p-gender').value,
      maritalStatus: $('#p-marital').value,
      nationality: $('#p-nation').value.trim(),
      personalEmail: $('#p-pemail').value.trim(),
      residingAddress: $('#p-address').value.trim(),
      panNo: $('#p-pan').value.trim(),
      uanNo: $('#p-uan').value.trim(),
    });
    if(!res.ok){
      $('#private-info-error').innerHTML = errorBox(res.error);
      return;
    }
    toast('Private information updated!', 'success');
    playChime('success');
    closeModal();
    render();
  });
}

function editBankDetailsModal(emp){
  const bank = emp.bank || {};
  const body = `
    <form id="bank-info-form" novalidate class="space-y-4">
      <div id="bank-info-error"></div>
      ${field('Bank Name', `<input id="b-name" class="${inputCls}" value="${esc(bank.bankName||'HDFC Bank')}" placeholder="HDFC / ICICI / SBI" required>`, 'b-name')}
      ${field('Account Number', `<input id="b-acc" class="${inputCls}" value="${esc(bank.accountNumber||'')}" placeholder="50100012345678" required>`, 'b-acc')}
      ${field('IFSC Code', `<input id="b-ifsc" class="${inputCls}" value="${esc(bank.ifsc||'HDFC0001234')}" placeholder="HDFC0001234" required>`, 'b-ifsc')}
      <button type="submit" class="w-full bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl py-3 shadow-md shadow-teal-500/25 transition">
        Save Bank Details
      </button>
    </form>`;
  openModal(Modal('Edit Bank & Direct Deposit Details', body, 'bank-modal'));

  $('#bank-info-form').addEventListener('submit', e => {
    e.preventDefault();
    const res = updateBankDetails(emp.id, {
      bankName: $('#b-name').value.trim(),
      accountNumber: $('#b-acc').value.trim(),
      ifsc: $('#b-ifsc').value.trim(),
    });
    if(!res.ok){
      $('#bank-info-error').innerHTML = errorBox(res.error);
      return;
    }
    toast('Bank details updated successfully!', 'success');
    playChime('success');
    closeModal();
    render();
  });
}

function certModal(targetId, certId){
  const db = getDB();
  const emp = db.employees.find(e => e.id === targetId);
  const existing = certId ? (emp.certifications || []).find(c => c.id === certId) : null;
  const body = `
    <form id="cert-form" novalidate class="space-y-4">
      <div id="cert-error"></div>
      ${field('Certification Name *', `<input id="c-name" class="${inputCls}" value="${esc(existing?.name||'')}" placeholder="AWS Certified Solutions Architect" required>`, 'c-name')}
      ${field('Issuing Organization *', `<input id="c-issuer" class="${inputCls}" value="${esc(existing?.issuer||'')}" placeholder="Amazon Web Services" required>`, 'c-issuer')}
      <div class="grid grid-cols-2 gap-3">
        ${field('Issue Date', `<input id="c-issue" type="date" class="${inputCls}" value="${existing?.issueDate||''}">`, 'c-issue')}
        ${field('Expiry Date', `<input id="c-expiry" type="date" class="${inputCls}" value="${existing?.expiryDate||''}">`, 'c-expiry')}
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${field('Credential ID', `<input id="c-cred" class="${inputCls}" value="${esc(existing?.credentialId||'')}" placeholder="Optional ID">`, 'c-cred')}
        ${field('Status', `
          <select id="c-status" class="${inputCls}">
            ${['Active','Expired','In Progress'].map(s => `<option value="${s}" ${existing?.status===s?'selected':''}>${s}</option>`).join('')}
          </select>`, 'c-status')}
      </div>
      ${field('Certificate File (PDF or Image)', `<input id="c-file" type="file" accept="image/*,.pdf" class="${inputCls}">${existing?.attachment ? `<p class="text-xs text-slate-500 mt-1">Current file: <a href="${existing.attachment.dataUrl}" download="${esc(existing.attachment.name)}" class="text-indigo-600 font-bold underline">${esc(existing.attachment.name)}</a></p>` : ''}`, 'c-file')}
      <button type="submit" class="w-full bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl py-3 shadow-md shadow-amber-500/25 transition">
        ${existing ? 'Save Certificate Changes' : 'Add Certification'}
      </button>
    </form>`;
  openModal(Modal(existing ? 'Edit Certification' : 'Add Certification', body, 'cert-modal'));

  $('#cert-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fileInput = $('#c-file');
    let attachment = existing?.attachment || null;
    if(fileInput && fileInput.files && fileInput.files[0]){
      try {
        attachment = await readFileAsDataURL(fileInput.files[0]);
      } catch(err){
        $('#cert-error').innerHTML = errorBox('Could not read the uploaded file.');
        return;
      }
    }
    const payload = {
      name: $('#c-name').value.trim(),
      issuer: $('#c-issuer').value.trim(),
      issueDate: $('#c-issue').value,
      expiryDate: $('#c-expiry').value,
      credentialId: $('#c-cred').value.trim(),
      status: $('#c-status').value,
      attachment
    };
    const res = existing ? updateCertification(targetId, existing.id, payload) : addCertification(targetId, payload);
    if(!res.ok){
      $('#cert-error').innerHTML = errorBox(res.error);
      return;
    }
    toast(existing ? 'Certification updated' : 'Certification added', 'success');
    playChime('success');
    closeModal();
    render();
  });
}

function bindProfile(user){
  const targetId = APP.viewingEmployeeId || user.id;
  const db = getDB();
  const emp = db.employees.find(e => e.id === targetId) || user;

  // Photo upload
  const changePhotoBtn = $('#change-photo-btn'), photoInput = $('#photo-input');
  if(changePhotoBtn && photoInput){
    changePhotoBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', async () => {
      const file = photoInput.files && photoInput.files[0];
      if(!file) return;
      try {
        const { dataUrl } = await readFileAsDataURL(file);
        const res = updatePhoto(targetId, dataUrl);
        if(res.ok){
          toast('Profile photo updated!', 'success');
          playChime('success');
          render();
        }
      } catch(err){
        toast('Could not upload photo', 'danger');
      }
    });
  }

  // Work Info Modal
  const editWorkBtn = $('#edit-work-btn');
  if(editWorkBtn) editWorkBtn.addEventListener('click', () => editWorkInfoModal(emp));

  // About Modal
  const editAboutBtn = $('#edit-about-btn');
  if(editAboutBtn) editAboutBtn.addEventListener('click', () => editAboutModal(emp));  // Private Info Modal
  const editPrivateBtn = $('#edit-private-btn');
  if(editPrivateBtn) editPrivateBtn.addEventListener('click', () => editPrivateInfoModal(emp));

  // Bank Modal
  const editBankBtn = $('#edit-bank-btn');
  if(editBankBtn) editBankBtn.addEventListener('click', () => editBankDetailsModal(emp));

  // Add Skill
  const addSkillBtn = $('#add-skill-btn');
  if(addSkillBtn){
    addSkillBtn.addEventListener('click', () => {
      const skill = prompt('Enter a new skill or expertise (e.g. Python, UX Design, Leadership):');
      if(skill && skill.trim()){
        addSkill(targetId, skill.trim());
        toast(`Added skill: ${skill.trim()}`, 'success');
        playChime('success');
        render();
      }
    });
  }

  // Remove Skill
  $$('[data-remove-skill]').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = btn.getAttribute('data-remove-skill');
      removeSkill(targetId, s);
      toast(`Removed skill: ${s}`, 'info');
      render();
    });
  });

  // Add Certification
  const addCertBtn = $('#add-cert-btn');
  if(addCertBtn) addCertBtn.addEventListener('click', () => certModal(targetId, null));

  const addCertEmptyBtn = $('#add-cert-empty-btn');
  if(addCertEmptyBtn) addCertEmptyBtn.addEventListener('click', () => certModal(targetId, null));

  // Edit Certification
  $$('[data-edit-cert]').forEach(btn => {
    btn.addEventListener('click', () => certModal(targetId, btn.getAttribute('data-edit-cert')));
  });

  // Delete Certification
  $$('[data-delete-cert]').forEach(btn => {
    btn.addEventListener('click', () => {
      if(confirm('Are you sure you want to delete this certification?')){
        deleteCertification(targetId, btn.getAttribute('data-delete-cert'));
        toast('Certification deleted', 'info');
        render();
      }
    });
  });

  // Daily Vibe Selector
  $$('[data-vibe]').forEach(btn => {
    btn.addEventListener('click', () => {
      const vibe = btn.getAttribute('data-vibe');
      setUserVibe(user.id, vibe);
      toast(`Vibe updated to ${vibe}!`, 'success');
      playChime('click');
      render();
    });
  });
}
