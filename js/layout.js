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
  const nav = user.role==='hr' ? NAV_HR : NAV_EMPLOYEE;
  const unread = unreadCount(user.id);
  const navItems = nav.map(n => `
    <a href="${n.href}" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition
      ${route===n.href ? 'bg-primary text-white shadow-card' : 'text-gray-600 hover:bg-primary-light hover:text-primary'}">
      ${icon(n.icon,'w-4 h-4')}<span>${n.label}</span>
      ${n.href==='#/notifications' && unread>0 ? `<span class="ml-auto bg-danger text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 px-1.5 py-0.5">${unread}</span>` : ''}
    </a>`).join('');

  return `
  <div class="min-h-screen flex">
    <div id="sidebar-backdrop" class="fixed inset-0 bg-ink/40 z-30 hidden lg:hidden"></div>
    <aside id="sidebar" class="fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-gray-100 z-40 flex flex-col -translate-x-full lg:translate-x-0 transition-transform duration-200">
      <div class="h-1 flow-bar"></div>
      <div class="px-5 py-5 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-white font-display font-bold text-sm">D</div>
        <span class="font-display font-bold text-lg text-ink">Dayflow</span>
      </div>
      <nav class="flex-1 px-3 space-y-1 overflow-y-auto">${navItems}</nav>
      <div class="p-3 border-t border-gray-100">
        <button id="logout-btn" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-danger-light hover:text-danger transition">
          ${icon('logout')}<span>Log out</span>
        </button>
      </div>
    </aside>
    <div class="flex-1 min-w-0 flex flex-col">
      <header class="sticky top-0 z-20 bg-paper/90 backdrop-blur border-b border-gray-100">
        <div class="flex items-center justify-between px-4 lg:px-8 h-16">
          <button id="sidebar-toggle" class="lg:hidden p-2 -ml-2 text-gray-500">${icon('menu','w-5 h-5')}</button>
          <div class="hidden lg:block">
            <p class="text-xs text-gray-400">${new Date().toLocaleDateString('en-IN',{weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>
          </div>
          <div class="flex items-center gap-4">
            <a href="#/notifications" class="relative p-2 text-gray-500 hover:text-primary">
              ${icon('bell','w-5 h-5')}
              ${unread>0 ? `<span class="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>` : ''}
            </a>
            <div class="relative">
              <button id="profile-menu-btn" class="flex items-center gap-2">
                ${Avatar(user.name,8)}
                <span class="hidden sm:block text-sm font-medium text-ink">${user.name.split(' ')[0]}</span>
                ${icon('chevronDown','w-3.5 h-3.5 text-gray-400 hidden sm:block')}
              </button>
              <div id="profile-menu" class="hidden absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-card border border-gray-100 py-1.5 z-50">
                <a href="#/profile" class="flex items-center gap-2 px-3.5 py-2 text-sm text-gray-600 hover:bg-paper">${icon('user','w-4 h-4')}My Profile</a>
                <button id="logout-btn-2" class="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-danger hover:bg-danger-light">${icon('logout','w-4 h-4')}Log Out</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main class="flex-1 px-4 lg:px-8 py-6 max-w-[1200px] w-full mx-auto">${contentHtml}</main>
    </div>
  </div>
  <div id="modal-root"></div>`;
}
function bindShell(){
  const toggle = $('#sidebar-toggle'), sidebar = $('#sidebar'), backdrop = $('#sidebar-backdrop');
  if(toggle){ toggle.addEventListener('click', ()=>{ sidebar.classList.remove('-translate-x-full'); backdrop.classList.remove('hidden'); }); }
  if(backdrop){ backdrop.addEventListener('click', ()=>{ sidebar.classList.add('-translate-x-full'); backdrop.classList.add('hidden'); }); }
  $$('#logout-btn, #logout-btn-2').forEach(b => b && b.addEventListener('click', logout));
  const menuBtn = $('#profile-menu-btn'), menu = $('#profile-menu');
  if(menuBtn){ menuBtn.addEventListener('click', (e)=>{ e.stopPropagation(); menu.classList.toggle('hidden'); }); document.addEventListener('click', ()=> menu.classList.add('hidden'), { once:true }); }
}
