/* ============================= LAYOUT ============================= */
const NAV_EMPLOYEE = [
  { href:'#/dashboard', label:'Dashboard', icon:'home' },
  { href:'#/attendance', label:'Attendance', icon:'clock' },
  { href:'#/leave', label:'Time Off', icon:'calendar' },
  { href:'#/payroll', label:'Payroll', icon:'wallet' },
  { href:'#/profile', label:'My Profile', icon:'user' },
  { href:'#/notifications', label:'Notifications', icon:'bell' },
];

const NAV_HR = [
  { href:'#/dashboard', label:'Dashboard', icon:'home' },
  { href:'#/employees', label:'Employees', icon:'users' },
  { href:'#/attendance', label:'Attendance', icon:'clock' },
  { href:'#/leave', label:'Time Off', icon:'calendar' },
  { href:'#/payroll', label:'Payroll', icon:'wallet' },
  { href:'#/analytics', label:'Analytics', icon:'chart' },
  { href:'#/notifications', label:'Notifications', icon:'bell' },
];

function Shell(user, route, contentHtml){
  const db = getDB();
  const nav = user.role==='hr' ? NAV_HR : NAV_EMPLOYEE;
  const unread = unreadNotifCount(user.id);
  const completeness = calcProfileCompleteness(user);

  const navItems = nav.map(n => {
    const active = route === n.href;
    return `
    <a href="${n.href}" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
      ${active
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
        : 'text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600'}">
      <span class="${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors">${icon(n.icon,'w-4 h-4')}</span>
      <span>${n.label}</span>
      ${n.href==='#/notifications' && unread>0 ? `<span class="ml-auto bg-rose-500 text-white text-[10px] font-extrabold rounded-full px-2 py-0.5 shadow-sm">${unread}</span>` : ''}
    </a>`;
  }).join('');

  // Persona switcher options for testing & seamless demoing
  const personaOptions = db.employees.map(e => `
    <option value="${e.id}" ${e.id===user.id?'selected':''}>
      ${e.role==='hr'?'👑 HR':'👤'} ${e.name} (${e.jobPosition})
    </option>
  `).join('');

  return `
  <div class="min-h-screen flex bg-[#F8FAFC]">
    <div id="sidebar-backdrop" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 hidden lg:hidden"></div>
    <aside id="sidebar" class="fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-slate-200/80 z-40 flex flex-col -translate-x-full lg:translate-x-0 transition-transform duration-300 shadow-sm">
      <div class="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500"></div>
      
      <!-- Brand Logo -->
      <div class="p-5 flex items-center justify-between border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-display font-extrabold text-lg shadow-md shadow-indigo-500/25">
            OI
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-display font-extrabold text-base text-ink tracking-tight">Odoo India</span>
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p class="text-[11px] font-semibold text-slate-400">Dayflow HRMS</p>
          </div>
        </div>
      </div>

      <!-- User Mini Card & Profile Progress in Sidebar -->
      <div class="p-3 mx-3 my-3 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 border border-indigo-100/80">
        <div class="flex items-center gap-3 mb-2.5">
          ${Avatar(user, 9)}
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold text-ink truncate">${esc(user.name)}</p>
            <p class="text-[11px] text-slate-500 truncate">${esc(user.jobPosition)}</p>
            <span class="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${user.role==='hr'?'bg-purple-100 text-purple-700':'bg-indigo-100 text-indigo-700'} mt-0.5">
              ${user.role==='hr'?'HR Admin':'Employee'}
            </span>
          </div>
        </div>
        <div class="space-y-1">
          <div class="flex justify-between text-[10px] font-semibold text-slate-500">
            <span>Profile Completeness</span>
            <span class="text-indigo-600 font-bold">${completeness}%</span>
          </div>
          <div class="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
            <div class="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" style="width: ${completeness}%"></div>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">${navItems}</nav>

      <!-- Sidebar Footer -->
      <div class="p-3 border-t border-slate-100 space-y-2">
        <button id="reset-db-btn" class="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition" title="Reset sample database to fresh defaults">
          ${icon('refresh','w-3.5 h-3.5')}<span>Reset Sample Data</span>
        </button>
        <button id="logout-btn" class="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition">
          ${icon('logout','w-4 h-4')}<span>Log out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0 flex flex-col">
      <header class="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div class="flex items-center justify-between px-4 lg:px-8 h-16">
          <div class="flex items-center gap-3">
            <button id="sidebar-toggle" class="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100">${icon('menu','w-5 h-5')}</button>
            <div class="hidden sm:block">
              <p class="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <span>🗓️</span> ${new Date().toLocaleDateString('en-IN',{weekday:'long', day:'numeric', month:'long', year:'numeric'})}
              </p>
            </div>
          </div>

          <!-- Header Right Actions & Persona Switcher -->
          <div class="flex items-center gap-3 sm:gap-4">
            <!-- Persona Switcher for pair-programming & demo -->
            <div class="flex items-center gap-1.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-2.5 py-1.5 transition">
              <span class="text-xs text-slate-500 font-medium hidden md:inline">Demo Switcher:</span>
              <select id="persona-switcher" class="bg-transparent text-xs font-bold text-ink outline-none cursor-pointer">
                ${personaOptions}
              </select>
            </div>

            <!-- Streak Pill -->
            <div class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold shadow-xs">
              <span>🔥</span>
              <span>${user.streak || 14} Day Streak</span>
            </div>

            <!-- Notifications Icon -->
            <a href="#/notifications" class="relative p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/80 transition" title="Notifications">
              ${icon('bell','w-5 h-5')}
              ${unread>0 ? `<span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>` : ''}
            </a>

            <!-- User Menu -->
            <div class="relative">
              <button id="profile-menu-btn" class="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition">
                ${Avatar(user, 8)}
                <span class="hidden sm:block text-xs font-bold text-ink">${esc(user.name.split(' ')[0])}</span>
                ${icon('chevronDown','w-3.5 h-3.5 text-slate-400 hidden sm:block')}
              </button>
              <div id="profile-menu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div class="px-4 py-2 border-b border-slate-100">
                  <p class="text-xs font-bold text-ink truncate">${esc(user.name)}</p>
                  <p class="text-[11px] text-slate-400 truncate">${esc(user.empCode)}</p>
                </div>
                <a href="#/profile" class="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition">
                  ${icon('user','w-4 h-4')}<span>My Profile</span>
                </a>
                <button id="logout-btn-2" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">
                  ${icon('logout','w-4 h-4')}<span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 px-4 lg:px-8 py-6 max-w-[1280px] w-full mx-auto animate-fadein">
        ${contentHtml}
      </main>
    </div>
  </div>
  <div id="modal-root"></div>`;
}

function bindShell(){
  const toggle = $('#sidebar-toggle'), sidebar = $('#sidebar'), backdrop = $('#sidebar-backdrop');
  if(toggle){
    toggle.addEventListener('click', ()=>{
      sidebar.classList.remove('-translate-x-full');
      backdrop.classList.remove('hidden');
    });
  }
  if(backdrop){
    backdrop.addEventListener('click', ()=>{
      sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
    });
  }

  // Persona switcher
  const switcher = $('#persona-switcher');
  if(switcher){
    switcher.addEventListener('change', (e)=>{
      const targetId = e.target.value;
      setSession(targetId);
      toast('Switched demo persona', 'info');
      playChime('click');
      render();
    });
  }

  // Reset database button
  const resetBtn = $('#reset-db-btn');
  if(resetBtn){
    resetBtn.addEventListener('click', ()=>{
      if(confirm('Reset sample database to fresh Odoo India defaults?')){
        resetDatabase();
        toast('Database reset to fresh sample data', 'success');
        playChime('success');
        navigate('#/dashboard');
        render();
      }
    });
  }

  $$('#logout-btn, #logout-btn-2').forEach(b => b && b.addEventListener('click', logout));

  const menuBtn = $('#profile-menu-btn'), menu = $('#profile-menu');
  if(menuBtn){
    menuBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      menu.classList.toggle('hidden');
    });
    document.addEventListener('click', ()=> menu.classList.add('hidden'));
  }
}
